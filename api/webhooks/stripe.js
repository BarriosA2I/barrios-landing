// =============================================================================
// POST /api/webhooks/stripe - Stripe Webhook Handler
// Handles: checkout.session.completed, customer.subscription.*, invoice.*
// With circuit breaker pattern and idempotency
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

// Circuit breaker state (in-memory for serverless - consider Redis for production)
const circuitBreaker = {
  failures: 0,
  lastFailure: null,
  state: 'CLOSED', // CLOSED, OPEN, HALF_OPEN
  threshold: 5,
  resetTimeout: 60000, // 1 minute
};

function checkCircuitBreaker() {
  if (circuitBreaker.state === 'OPEN') {
    const now = Date.now();
    if (now - circuitBreaker.lastFailure > circuitBreaker.resetTimeout) {
      circuitBreaker.state = 'HALF_OPEN';
    } else {
      throw new Error('Circuit breaker is OPEN - service temporarily unavailable');
    }
  }
  return true;
}

function recordSuccess() {
  if (circuitBreaker.state === 'HALF_OPEN') {
    circuitBreaker.state = 'CLOSED';
    circuitBreaker.failures = 0;
  }
}

function recordFailure() {
  circuitBreaker.failures++;
  circuitBreaker.lastFailure = Date.now();
  if (circuitBreaker.failures >= circuitBreaker.threshold) {
    circuitBreaker.state = 'OPEN';
  }
}

// Tier feature mapping for subscription creation
const TIER_FEATURES = {
  STARTER: { monthlyTokens: 8, maxFormats: 1, maxRevisions: 1, queuePriority: 'STANDARD', voiceClone: false, avatarClone: false },
  CREATOR: { monthlyTokens: 18, maxFormats: 4, maxRevisions: 2, queuePriority: 'EXPEDITED', voiceClone: true, avatarClone: false },
  GROWTH: { monthlyTokens: 32, maxFormats: 4, maxRevisions: 3, queuePriority: 'PRIORITY', voiceClone: true, avatarClone: true },
  SCALE: { monthlyTokens: 64, maxFormats: 4, maxRevisions: 5, queuePriority: 'RUSH', voiceClone: true, avatarClone: true },
};

/**
 * Handle checkout.session.completed event
 */
async function handleCheckoutCompleted(session) {
  const db = getPrisma();
  const stripeClient = getStripe();

  const customerEmail = session.customer_details?.email || session.customer_email;
  const stripeCustomerId = session.customer;
  const intent = session.metadata?.intent || 'SUBSCRIPTION';

  // Find or create customer
  let customer = await db.customer.findFirst({
    where: {
      OR: [
        { stripeCustomerId },
        { email: customerEmail },
      ].filter(Boolean),
    },
  });

  if (!customer) {
    customer = await db.customer.create({
      data: {
        email: customerEmail,
        stripeCustomerId,
        name: session.customer_details?.name,
        phone: session.customer_details?.phone,
        lifecycleState: 'ACTIVE',
        acquisitionSource: session.metadata?.source || 'checkout',
      },
    });

    // Create initial token allocation
    await db.tokenAllocation.create({
      data: {
        customerId: customer.id,
        subscriptionTokens: 0,
        purchasedTokens: 0,
        bonusTokens: 0,
      },
    });
  } else if (!customer.stripeCustomerId && stripeCustomerId) {
    // Update with Stripe customer ID if missing
    await db.customer.update({
      where: { id: customer.id },
      data: { stripeCustomerId },
    });
  }

  // Record purchase
  await db.purchase.create({
    data: {
      customerId: customer.id,
      stripePaymentIntentId: session.payment_intent,
      stripeSessionId: session.id,
      intent,
      productCategory: mapIntentToCategory(intent),
      productId: session.metadata?.productId || 'unknown',
      productName: session.metadata?.productName || 'Purchase',
      amountCents: session.amount_total || 0,
      currency: session.currency || 'usd',
      status: 'COMPLETED',
      fulfilledAt: new Date(),
      metadata: session.metadata,
    },
  });

  // Update customer LTV
  await db.customer.update({
    where: { id: customer.id },
    data: {
      lifetimeValue: {
        increment: session.amount_total || 0,
      },
      lastActivityAt: new Date(),
    },
  });

  // Handle consultation booking redirect
  if (intent === 'CONSULTATION' && session.metadata?.consultationType) {
    await db.consultation.create({
      data: {
        customerId: customer.id,
        type: session.metadata.consultationType,
        status: 'PAID',
        amountCents: session.amount_total || 0,
        creditableTiers: session.metadata.creditableTiers?.split(',') || [],
        stripeSessionId: session.id,
      },
    });
  }

  // Handle token pack purchase
  if (intent === 'TOP_UP') {
    const tokenCount = parseInt(session.metadata?.tokens || '0', 10);
    if (tokenCount > 0) {
      await db.tokenAllocation.update({
        where: { customerId: customer.id },
        data: {
          purchasedTokens: { increment: tokenCount },
        },
      });

      await db.tokenTransaction.create({
        data: {
          customerId: customer.id,
          type: 'purchase',
          purchasedDelta: tokenCount,
          subscriptionBalance: 0,
          purchasedBalance: tokenCount,
          bonusBalance: 0,
          referenceType: 'purchase',
          referenceId: session.id,
          description: `Purchased ${tokenCount} tokens`,
        },
      });
    }
  }

  console.log(`[webhook] Checkout completed for ${customerEmail} (intent: ${intent})`);
}

/**
 * Handle customer.subscription.created/updated event
 */
async function handleSubscriptionChange(subscription, eventType) {
  const db = getPrisma();
  const stripeCustomerId = subscription.customer;

  const customer = await db.customer.findUnique({
    where: { stripeCustomerId },
  });

  if (!customer) {
    console.error(`[webhook] Customer not found for subscription ${subscription.id}`);
    return;
  }

  const tier = subscription.metadata?.tier || 'STARTER';
  const tierFeatures = TIER_FEATURES[tier] || TIER_FEATURES.STARTER;
  const interval = subscription.items.data[0]?.plan?.interval === 'year' ? 'YEARLY' : 'MONTHLY';

  const subscriptionData = {
    stripeSubscriptionId: subscription.id,
    stripePriceId: subscription.items.data[0]?.price?.id,
    stripeProductId: subscription.items.data[0]?.price?.product,
    tier,
    billingInterval: interval,
    status: mapSubscriptionStatus(subscription.status),
    monthlyTokens: tierFeatures.monthlyTokens,
    maxFormats: tierFeatures.maxFormats,
    maxRevisions: tierFeatures.maxRevisions,
    queuePriority: tierFeatures.queuePriority,
    voiceCloneEnabled: tierFeatures.voiceClone,
    avatarCloneEnabled: tierFeatures.avatarClone,
    currentPeriodStart: subscription.current_period_start
      ? new Date(subscription.current_period_start * 1000)
      : new Date(),
    currentPeriodEnd: subscription.current_period_end
      ? new Date(subscription.current_period_end * 1000)
      : new Date(Date.now() + 30 * 24 * 60 * 60 * 1000),
    cancelAtPeriodEnd: subscription.cancel_at_period_end,
    canceledAt: subscription.canceled_at ? new Date(subscription.canceled_at * 1000) : null,
    trialStart: subscription.trial_start ? new Date(subscription.trial_start * 1000) : null,
    trialEnd: subscription.trial_end ? new Date(subscription.trial_end * 1000) : null,
  };

  if (eventType === 'customer.subscription.created') {
    await db.subscription.create({
      data: {
        customerId: customer.id,
        ...subscriptionData,
      },
    });

    // Reset subscription tokens
    await db.tokenAllocation.update({
      where: { customerId: customer.id },
      data: {
        subscriptionTokens: tierFeatures.monthlyTokens,
        lastResetAt: new Date(),
      },
    });

    // Update customer lifecycle
    await db.customer.update({
      where: { id: customer.id },
      data: {
        lifecycleState: 'ACTIVE',
        lastActivityAt: new Date(),
      },
    });

    console.log(`[webhook] Subscription created for ${customer.email} (tier: ${tier})`);
  } else {
    await db.subscription.update({
      where: { stripeSubscriptionId: subscription.id },
      data: subscriptionData,
    });

    console.log(`[webhook] Subscription updated for ${customer.email} (status: ${subscription.status})`);
  }
}

/**
 * Handle customer.subscription.deleted event
 */
async function handleSubscriptionDeleted(subscription) {
  const db = getPrisma();

  await db.subscription.update({
    where: { stripeSubscriptionId: subscription.id },
    data: {
      status: 'CANCELED',
      canceledAt: new Date(),
    },
  });

  // Update customer lifecycle to churned
  const sub = await db.subscription.findUnique({
    where: { stripeSubscriptionId: subscription.id },
    include: { customer: true },
  });

  if (sub) {
    await db.customer.update({
      where: { id: sub.customerId },
      data: {
        lifecycleState: 'CHURNED',
        lastActivityAt: new Date(),
      },
    });

    await db.customerEvent.create({
      data: {
        customerId: sub.customerId,
        eventType: 'state_change',
        eventName: 'subscription_cancelled',
        previousState: 'ACTIVE',
        newState: 'CHURNED',
        source: 'webhook',
      },
    });

    console.log(`[webhook] Subscription cancelled for ${sub.customer.email}`);
  }
}

/**
 * Handle invoice.payment_succeeded - token reset on renewal
 */
async function handleInvoicePaymentSucceeded(invoice) {
  const db = getPrisma();

  // Only process subscription invoices
  if (!invoice.subscription) return;

  const subscription = await db.subscription.findUnique({
    where: { stripeSubscriptionId: invoice.subscription },
    include: { customer: true },
  });

  if (!subscription) return;

  // Reset subscription tokens on renewal
  const tier = subscription.tier;
  const tierFeatures = TIER_FEATURES[tier] || TIER_FEATURES.STARTER;

  await db.tokenAllocation.update({
    where: { customerId: subscription.customerId },
    data: {
      subscriptionTokens: tierFeatures.monthlyTokens,
      lastResetAt: new Date(),
    },
  });

  await db.tokenTransaction.create({
    data: {
      customerId: subscription.customerId,
      type: 'subscription_reset',
      subscriptionDelta: tierFeatures.monthlyTokens,
      subscriptionBalance: tierFeatures.monthlyTokens,
      purchasedBalance: 0,
      bonusBalance: 0,
      referenceType: 'subscription',
      referenceId: subscription.id,
      description: `Monthly token reset (${tier} tier)`,
    },
  });

  console.log(`[webhook] Tokens reset for ${subscription.customer.email} (${tierFeatures.monthlyTokens} tokens)`);
}

/**
 * Handle invoice.payment_failed - risk scoring
 */
async function handleInvoicePaymentFailed(invoice) {
  const db = getPrisma();

  if (!invoice.subscription) return;

  const subscription = await db.subscription.findUnique({
    where: { stripeSubscriptionId: invoice.subscription },
    include: { customer: true },
  });

  if (!subscription) return;

  // Increase risk score
  await db.customer.update({
    where: { id: subscription.customerId },
    data: {
      riskScore: { increment: 25 },
      lifecycleState: 'AT_RISK',
      lastActivityAt: new Date(),
    },
  });

  await db.customerEvent.create({
    data: {
      customerId: subscription.customerId,
      eventType: 'state_change',
      eventName: 'payment_failed',
      previousState: 'ACTIVE',
      newState: 'AT_RISK',
      metadata: { invoiceId: invoice.id },
      source: 'webhook',
    },
  });

  console.log(`[webhook] Payment failed for ${subscription.customer.email} - marked AT_RISK`);
}

// Helper functions
function mapIntentToCategory(intent) {
  const mapping = {
    SUBSCRIPTION: 'COMMERCIAL_LAB',
    CONSULTATION: 'CONSULTATION',
    TOP_UP: 'TOKEN_PACKS',
    UPGRADE: 'COMMERCIAL_LAB',
    ENTERPRISE: 'ENTERPRISE',
  };
  return mapping[intent] || 'COMMERCIAL_LAB';
}

function mapSubscriptionStatus(stripeStatus) {
  const mapping = {
    active: 'ACTIVE',
    past_due: 'PAST_DUE',
    canceled: 'CANCELED',
    incomplete: 'INCOMPLETE',
    incomplete_expired: 'INCOMPLETE_EXPIRED',
    trialing: 'TRIALING',
    unpaid: 'UNPAID',
    paused: 'PAUSED',
  };
  return mapping[stripeStatus] || 'ACTIVE';
}

// Raw body parser for webhook signature verification
async function getRawBody(req) {
  const chunks = [];
  for await (const chunk of req) {
    chunks.push(typeof chunk === 'string' ? Buffer.from(chunk) : chunk);
  }
  return Buffer.concat(chunks);
}

module.exports = async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  const startTime = Date.now();

  try {
    // Check circuit breaker
    checkCircuitBreaker();

    const stripeClient = getStripe();
    const db = getPrisma();
    const sig = req.headers['stripe-signature'];

    if (!sig) {
      return res.status(400).json({ error: 'Missing stripe-signature header' });
    }

    // Get raw body for signature verification
    const rawBody = await getRawBody(req);

    let event;
    try {
      event = stripeClient.webhooks.constructEvent(
        rawBody,
        sig,
        process.env.STRIPE_WEBHOOK_SECRET
      );
    } catch (err) {
      console.error('[webhook] Signature verification failed:', err.message);
      return res.status(400).json({ error: `Webhook signature verification failed: ${err.message}` });
    }

    // Idempotency check - have we processed this event?
    const existingEvent = await db.webhookEvent.findUnique({
      where: { stripeEventId: event.id },
    });

    if (existingEvent?.processed) {
      console.log(`[webhook] Event ${event.id} already processed, skipping`);
      return res.status(200).json({ received: true, duplicate: true });
    }

    // Record event
    await db.webhookEvent.upsert({
      where: { stripeEventId: event.id },
      update: {},
      create: {
        stripeEventId: event.id,
        eventType: event.type,
        payload: event.data,
        processed: false,
      },
    });

    // Process event based on type
    switch (event.type) {
      case 'checkout.session.completed':
        await handleCheckoutCompleted(event.data.object);
        break;

      case 'customer.subscription.created':
        await handleSubscriptionChange(event.data.object, 'customer.subscription.created');
        break;

      case 'customer.subscription.updated':
        await handleSubscriptionChange(event.data.object, 'customer.subscription.updated');
        break;

      case 'customer.subscription.deleted':
        await handleSubscriptionDeleted(event.data.object);
        break;

      case 'invoice.payment_succeeded':
        await handleInvoicePaymentSucceeded(event.data.object);
        break;

      case 'invoice.payment_failed':
        await handleInvoicePaymentFailed(event.data.object);
        break;

      default:
        console.log(`[webhook] Unhandled event type: ${event.type}`);
    }

    // Mark event as processed
    await db.webhookEvent.update({
      where: { stripeEventId: event.id },
      data: {
        processed: true,
        processedAt: new Date(),
      },
    });

    recordSuccess();

    const duration = Date.now() - startTime;
    console.log(`[webhook] Processed ${event.type} in ${duration}ms`);

    return res.status(200).json({ received: true });
  } catch (error) {
    recordFailure();
    console.error('[webhook] Error:', error.message);

    // Store error for retry
    if (error.eventId) {
      const db = getPrisma();
      await db.webhookEvent.update({
        where: { stripeEventId: error.eventId },
        data: {
          errorMessage: error.message,
          retryCount: { increment: 1 },
        },
      }).catch(() => {});
    }

    return res.status(500).json({ error: error.message });
  }
};

// Vercel config - disable body parsing for raw body access
module.exports.config = {
  api: {
    bodyParser: false,
  },
};
