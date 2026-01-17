// =============================================================================
// POST /api/checkout/session - Create Stripe Checkout Session
// Supports: SUBSCRIPTION, CONSULTATION, TOP_UP, UPGRADE, ENTERPRISE intents
// Vercel Serverless Function
// =============================================================================

const Stripe = require('stripe');
const { PrismaClient } = require('@prisma/client');

// Lazy initialization for serverless
let stripe;
let prisma;

function getStripe() {
  if (!stripe) {
    stripe = new Stripe(process.env.STRIPE_SECRET_KEY, {
      apiVersion: '2024-12-18.acacia',
    });
  }
  return stripe;
}

function getPrisma() {
  if (!prisma) {
    prisma = new PrismaClient();
  }
  return prisma;
}

// Import product catalog (for local price lookups)
const productCatalog = require('../../js/product-catalog.js');

// Calendly URL mapping
const CALENDLY_URLS = {
  STRATEGY_45: process.env.CALENDLY_STRATEGY_URL || 'https://calendly.com/barrios-a2i/strategy-45',
  ARCHITECTURE_90: process.env.CALENDLY_ARCHITECTURE_URL || 'https://calendly.com/barrios-a2i/architecture-90',
  ENTERPRISE: process.env.CALENDLY_ENTERPRISE_URL || 'https://calendly.com/barrios-a2i/enterprise-discovery',
};

/**
 * Determine checkout mode based on intent and cart items
 */
function determineCheckoutMode(items, intent) {
  // Consultation and Top-up are always payment mode
  if (intent === 'CONSULTATION' || intent === 'TOP_UP') {
    return 'payment';
  }

  // Check if any item has a recurring price
  for (const item of items) {
    const product = productCatalog.getProductByPriceId(item.priceId);
    if (product) {
      const price = product.prices.find((pr) => pr.id === item.priceId);
      if (price?.recurring) {
        return 'subscription';
      }
    }
  }
  return 'payment';
}

/**
 * Get consultation details from cart
 */
function getConsultationDetails(items) {
  for (const item of items) {
    const product = productCatalog.getProductByPriceId(item.priceId);
    if (product && product.category === 'CONSULTATION') {
      const consultationType = product.metadata?.consultationType || 'STRATEGY_45';
      const creditableTiers = product.metadata?.creditableTiers?.split(',') || [];
      return {
        consultationType,
        calendlyUrl: CALENDLY_URLS[consultationType] || CALENDLY_URLS['STRATEGY_45'],
        creditableTiers,
      };
    }
  }
  return null;
}

/**
 * Build Stripe line items from cart
 */
async function buildLineItems(items) {
  const stripeClient = getStripe();
  const lineItems = [];

  for (const item of items) {
    let stripePriceId = item.priceId;

    // If it's a local price ID, search for the corresponding Stripe price
    const product = productCatalog.getProductByPriceId(item.priceId);
    if (product) {
      try {
        const prices = await stripeClient.prices.search({
          query: `metadata['localId']:'${item.priceId}'`,
        });
        if (prices.data.length > 0) {
          stripePriceId = prices.data[0].id;
        }
      } catch (error) {
        console.error('Error searching for price:', error.message);
        // Fall back to using the provided price ID
      }
    }

    lineItems.push({
      price: stripePriceId,
      quantity: item.quantity,
    });
  }

  return lineItems;
}

/**
 * Update customer lifecycle state based on intent
 */
async function updateCustomerLifecycle(customerId, intent) {
  if (!customerId) return;

  try {
    const db = getPrisma();
    await db.customerEvent.create({
      data: {
        customerId,
        eventType: 'action',
        eventName: `checkout_started_${intent.toLowerCase()}`,
        metadata: { intent },
        source: 'api',
      },
    });
  } catch (error) {
    // Non-critical, log and continue
    console.error('Failed to record customer event:', error.message);
  }
}

module.exports = async function handler(req, res) {
  // CORS headers
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'POST, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Authorization');

  if (req.method === 'OPTIONS') {
    return res.status(200).end();
  }

  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  const startTime = Date.now();

  try {
    const {
      items,
      customerId,
      email,
      successUrl,
      cancelUrl,
      promoCode,
      intent = 'SUBSCRIPTION',
      metadata = {},
    } = req.body;

    // Validate required fields
    if (!items || !Array.isArray(items) || items.length === 0) {
      return res.status(400).json({ error: 'Items array is required' });
    }

    const stripeClient = getStripe();
    const db = getPrisma();

    // Determine mode based on intent
    const mode = determineCheckoutMode(items, intent);

    // Build line items
    const lineItems = await buildLineItems(items);

    // Get consultation details if applicable
    const consultationDetails = intent === 'CONSULTATION' ? getConsultationDetails(items) : null;

    // Get or create Stripe customer
    let stripeCustomerId;
    if (customerId) {
      try {
        const customer = await db.customer.findUnique({
          where: { id: customerId },
        });
        stripeCustomerId = customer?.stripeCustomerId;
      } catch (error) {
        console.error('Error finding customer:', error.message);
      }
    }

    // Build success URL with intent-specific parameters
    // Note: Must NOT use URLSearchParams for session_id - Stripe requires the literal
    // {CHECKOUT_SESSION_ID} placeholder unencoded to replace it with the actual ID
    const baseUrl = process.env.NEXT_PUBLIC_BASE_URL || 'https://barriosa2i.com';
    let finalSuccessUrl = successUrl;
    if (!finalSuccessUrl) {
      let queryString = `session_id={CHECKOUT_SESSION_ID}&intent=${encodeURIComponent(intent)}`;
      if (consultationDetails) {
        queryString += `&calendly=${encodeURIComponent(consultationDetails.calendlyUrl)}`;
      }
      finalSuccessUrl = `${baseUrl}/checkout-success.html?${queryString}`;
    }

    // Build session params
    const sessionParams = {
      mode,
      line_items: lineItems,
      success_url: finalSuccessUrl,
      cancel_url: cancelUrl || `${baseUrl}/checkout-cancelled.html`,
      billing_address_collection: 'required',
      allow_promotion_codes: !promoCode,
      metadata: {
        ...metadata,
        source: 'barrios-a2i',
        intent,
        ...(consultationDetails && {
          consultationType: consultationDetails.consultationType,
          creditableTiers: consultationDetails.creditableTiers.join(','),
        }),
      },
    };

    if (stripeCustomerId) {
      sessionParams.customer = stripeCustomerId;
    } else if (email) {
      sessionParams.customer_email = email;
    }

    // Apply promo code if provided
    if (promoCode) {
      try {
        const promoCodes = await stripeClient.promotionCodes.list({
          code: promoCode,
          active: true,
        });
        if (promoCodes.data.length > 0) {
          sessionParams.discounts = [{ promotion_code: promoCodes.data[0].id }];
        }
      } catch (error) {
        console.error('Error applying promo code:', error.message);
      }
    }

    // Intent-specific configurations
    if (mode === 'subscription') {
      sessionParams.subscription_data = {
        metadata: {
          ...metadata,
          source: 'barrios-a2i',
          intent,
        },
      };
      sessionParams.payment_method_types = ['card'];
    }

    // Consultation-specific: collect phone number for follow-up
    if (intent === 'CONSULTATION') {
      sessionParams.phone_number_collection = { enabled: true };
      sessionParams.custom_text = {
        submit: {
          message: "After payment, you'll be redirected to schedule your consultation.",
        },
      };
    }

    // Upgrade intent: Show trial period ending notice
    if (intent === 'UPGRADE') {
      sessionParams.custom_text = {
        submit: {
          message: "Your new plan will be active immediately. You'll be prorated for the remaining billing period.",
        },
      };
    }

    const session = await stripeClient.checkout.sessions.create(sessionParams);

    // Track checkout event (non-blocking)
    updateCustomerLifecycle(customerId, intent).catch(() => {});

    const duration = Date.now() - startTime;
    console.log(`[checkout/session] Created session ${session.id} (${duration}ms)`);

    return res.status(200).json({
      sessionId: session.id,
      url: session.url,
      intent,
      ...(consultationDetails && {
        calendlyUrl: consultationDetails.calendlyUrl,
      }),
    });
  } catch (error) {
    console.error('[checkout/session] Error:', error.message);
    return res.status(500).json({ error: error.message });
  }
};
