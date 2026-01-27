import { NextRequest, NextResponse } from "next/server";
import Stripe from "stripe";
import { db } from "@/lib/db";
import { sendPurchaseNotificationEmail } from "@/lib/email-service";
import { logCustomerToNotion } from "@/lib/notion";

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!, {
  apiVersion: "2024-12-18.acacia" as Stripe.LatestApiVersion,
});

const WEBHOOK_SECRET = process.env.STRIPE_WEBHOOK_SECRET!;

// Tier feature mapping
const TIER_FEATURES: Record<string, {
  monthlyTokens: number;
  maxFormats: number;
  maxRevisions: number;
  queuePriority: string;
  voiceClone: boolean;
  avatarClone: boolean;
}> = {
  STARTER: { monthlyTokens: 8, maxFormats: 1, maxRevisions: 1, queuePriority: "STANDARD", voiceClone: false, avatarClone: false },
  CREATOR: { monthlyTokens: 16, maxFormats: 4, maxRevisions: 2, queuePriority: "EXPEDITED", voiceClone: true, avatarClone: false },
  GROWTH: { monthlyTokens: 32, maxFormats: 4, maxRevisions: 3, queuePriority: "PRIORITY", voiceClone: true, avatarClone: true },
  SCALE: { monthlyTokens: 64, maxFormats: 4, maxRevisions: 5, queuePriority: "RUSH", voiceClone: true, avatarClone: true },
};

export async function POST(request: NextRequest) {
  const body = await request.text();
  const signature = request.headers.get("stripe-signature");

  if (!signature) {
    return NextResponse.json({ error: "Missing signature" }, { status: 400 });
  }

  let event: Stripe.Event;

  try {
    event = stripe.webhooks.constructEvent(body, signature, WEBHOOK_SECRET);
  } catch (err: unknown) {
    const message = err instanceof Error ? err.message : "Unknown error";
    console.error("[stripe-webhook] Signature verification failed:", message);
    return NextResponse.json({ error: "Invalid signature" }, { status: 400 });
  }

  // Check idempotency - persist event before processing
  const existingEvent = await db.stripeEvent.findUnique({
    where: { stripeEventId: event.id },
  });

  if (existingEvent?.status === "PROCESSED") {
    return NextResponse.json({ received: true, duplicate: true });
  }

  // Record event as PROCESSING
  await db.stripeEvent.upsert({
    where: { stripeEventId: event.id },
    update: { status: "PROCESSING" },
    create: {
      stripeEventId: event.id,
      eventType: event.type,
      apiVersion: event.api_version || undefined,
      status: "PROCESSING",
      payload: event.data as object,
    },
  });

  try {
    switch (event.type) {
      case "invoice.paid":
        await handleInvoicePaid(event.data.object as Stripe.Invoice);
        break;

      case "customer.subscription.created":
      case "customer.subscription.updated":
        await handleSubscriptionChange(event.data.object as Stripe.Subscription);
        break;

      case "customer.subscription.deleted":
        await handleSubscriptionDeleted(event.data.object as Stripe.Subscription);
        break;

      case "checkout.session.completed":
        await handleCheckoutCompleted(event.data.object as Stripe.Checkout.Session);
        break;

      default:
        console.log("[stripe-webhook] Unhandled event:", event.type);
    }

    // Mark as processed
    await db.stripeEvent.update({
      where: { stripeEventId: event.id },
      data: { status: "PROCESSED", processedAt: new Date() },
    });

    return NextResponse.json({ received: true });
  } catch (error: unknown) {
    const message = error instanceof Error ? error.message : "Unknown error";
    console.error("[stripe-webhook] Error:", message);

    // Record error
    await db.stripeEvent.update({
      where: { stripeEventId: event.id },
      data: {
        status: "FAILED",
        errorMessage: message,
        retryCount: { increment: 1 },
        lastRetryAt: new Date(),
      },
    });

    return NextResponse.json({ error: message }, { status: 500 });
  }
}

/**
 * Handle invoice.paid - Credit tokens with idempotency
 *
 * This is the PRIMARY token crediting mechanism:
 * - Creates LabSubscriptionCycle on each paid invoice
 * - Creates TokenLedgerEntry with idempotency key
 * - Uses invoice_${id}_cycle_credit as idempotency key
 */
async function handleInvoicePaid(invoice: Stripe.Invoice) {
  // Access subscription via parent field (Stripe API structure change)
  const invoiceSubscription = (invoice as any).subscription;
  if (!invoiceSubscription) return;

  const subscriptionId = typeof invoiceSubscription === "string"
    ? invoiceSubscription
    : invoiceSubscription.id;

  const subscription = await db.commercialLabSubscription.findUnique({
    where: { stripeSubscriptionId: subscriptionId },
    include: { account: true },
  });

  if (!subscription) {
    console.log("[stripe-webhook] Subscription not found:", subscriptionId);
    return;
  }

  const tierFeatures = TIER_FEATURES[subscription.tier] || TIER_FEATURES.STARTER;

  // Idempotency key for this invoice cycle credit
  const idempotencyKey = `invoice_${invoice.id}_cycle_credit`;

  // Check if already processed
  const existingEntry = await db.tokenLedgerEntry.findUnique({
    where: { idempotencyKey },
  });

  if (existingEntry) {
    console.log("[stripe-webhook] Token credit already processed:", idempotencyKey);
    return;
  }

  // Get next cycle number
  const lastCycle = await db.labSubscriptionCycle.findFirst({
    where: { subscriptionId: subscription.id },
    orderBy: { cycleNumber: "desc" },
  });
  const cycleNumber = (lastCycle?.cycleNumber || 0) + 1;

  const periodStart = new Date((invoice.period_start || Math.floor(Date.now() / 1000)) * 1000);
  const periodEnd = new Date((invoice.period_end || Math.floor(Date.now() / 1000) + 30 * 24 * 60 * 60) * 1000);

  // Create cycle and ledger entry atomically
  const cycle = await db.labSubscriptionCycle.create({
    data: {
      subscriptionId: subscription.id,
      cycleNumber,
      periodStart,
      periodEnd,
      tokensAllocated: tierFeatures.monthlyTokens,
      tokensUsed: 0,
      tokensExpired: 0,
      stripeInvoiceId: invoice.id,
    },
  });

  // Create ledger entry with idempotency
  await db.tokenLedgerEntry.create({
    data: {
      cycleId: cycle.id,
      type: "CREDIT_SUBSCRIPTION",
      amount: tierFeatures.monthlyTokens,
      balance: tierFeatures.monthlyTokens,
      referenceType: "invoice",
      referenceId: invoice.id,
      idempotencyKey,
      description: `Monthly token credit (${subscription.tier} tier)`,
    },
  });

  // Update subscription period
  await db.commercialLabSubscription.update({
    where: { id: subscription.id },
    data: {
      currentPeriodStart: periodStart,
      currentPeriodEnd: periodEnd,
    },
  });

  console.log(`[stripe-webhook] Credited ${tierFeatures.monthlyTokens} tokens for account ${subscription.accountId}`);
}

/**
 * Handle subscription create/update
 */
async function handleSubscriptionChange(stripeSubscription: Stripe.Subscription) {
  // Cast to any to handle Stripe API version type changes
  const sub = stripeSubscription as any;

  const customerId = typeof sub.customer === "string"
    ? sub.customer
    : sub.customer?.id;

  const billingCustomer = await db.billingCustomer.findUnique({
    where: { stripeCustomerId: customerId },
    include: { account: true },
  });

  if (!billingCustomer) {
    console.log("[stripe-webhook] Billing customer not found:", customerId);
    return;
  }

  const tier = (sub.metadata?.tier || "STARTER") as "STARTER" | "CREATOR" | "GROWTH" | "SCALE";
  const tierFeatures = TIER_FEATURES[tier] || TIER_FEATURES.STARTER;
  const interval = sub.items?.data[0]?.plan?.interval === "year" ? "YEARLY" : "MONTHLY";

  const subscriptionData = {
    stripeSubscriptionId: sub.id,
    stripePriceId: sub.items?.data[0]?.price?.id || "",
    stripeProductId: typeof sub.items?.data[0]?.price?.product === "string"
      ? sub.items.data[0].price.product
      : "",
    tier,
    billingInterval: interval as "MONTHLY" | "YEARLY",
    status: mapSubscriptionStatus(sub.status),
    monthlyTokens: tierFeatures.monthlyTokens,
    maxFormats: tierFeatures.maxFormats,
    maxRevisions: tierFeatures.maxRevisions,
    queuePriority: tierFeatures.queuePriority as "STANDARD" | "EXPEDITED" | "PRIORITY" | "RUSH",
    voiceCloneEnabled: tierFeatures.voiceClone,
    avatarCloneEnabled: tierFeatures.avatarClone,
    currentPeriodStart: new Date((sub.current_period_start || Math.floor(Date.now() / 1000)) * 1000),
    currentPeriodEnd: new Date((sub.current_period_end || Math.floor(Date.now() / 1000) + 30 * 24 * 60 * 60) * 1000),
    cancelAtPeriodEnd: sub.cancel_at_period_end || false,
    canceledAt: sub.canceled_at ? new Date(sub.canceled_at * 1000) : null,
    trialStart: sub.trial_start ? new Date(sub.trial_start * 1000) : null,
    trialEnd: sub.trial_end ? new Date(sub.trial_end * 1000) : null,
  };

  await db.commercialLabSubscription.upsert({
    where: { stripeSubscriptionId: sub.id },
    update: subscriptionData,
    create: {
      accountId: billingCustomer.accountId,
      ...subscriptionData,
    },
  });

  console.log(`[stripe-webhook] Subscription ${sub.id} updated for account ${billingCustomer.accountId}`);
}

/**
 * Handle subscription deletion
 */
async function handleSubscriptionDeleted(stripeSubscription: Stripe.Subscription) {
  const sub = stripeSubscription as any;
  await db.commercialLabSubscription.update({
    where: { stripeSubscriptionId: sub.id },
    data: {
      status: "CANCELED",
      canceledAt: new Date(),
    },
  });

  console.log(`[stripe-webhook] Subscription ${sub.id} canceled`);
}

// Helper function
function mapSubscriptionStatus(status: string): "ACTIVE" | "PAST_DUE" | "CANCELED" | "INCOMPLETE" | "TRIALING" | "PAUSED" {
  const mapping: Record<string, "ACTIVE" | "PAST_DUE" | "CANCELED" | "INCOMPLETE" | "TRIALING" | "PAUSED"> = {
    active: "ACTIVE",
    past_due: "PAST_DUE",
    canceled: "CANCELED",
    incomplete: "INCOMPLETE",
    trialing: "TRIALING",
    paused: "PAUSED",
  };
  return mapping[status] || "ACTIVE";
}

/**
 * Handle checkout.session.completed
 *
 * For ALL checkouts:
 * - Send email notification to Gary
 * - Log customer to Notion database
 *
 * For TOP_UP intent specifically:
 * - Credit tokens to customer's subscription cycle
 */
async function handleCheckoutCompleted(session: Stripe.Checkout.Session) {
  const sessionData = session as any;
  const intent = sessionData.metadata?.intent || "UNKNOWN";
  const customerEmail = sessionData.customer_details?.email || sessionData.customer_email || "unknown@email.com";
  const amountTotal = sessionData.amount_total || 0;

  const customerId = typeof sessionData.customer === "string"
    ? sessionData.customer
    : sessionData.customer?.id || "";

  // Get product name from metadata or line items
  const productName = await getProductNameFromSession(session);

  console.log(`[stripe-webhook] Checkout completed: ${productName} ($${(amountTotal / 100).toFixed(2)}) - ${intent}`);

  // =========================================================================
  // 1. Send email notification to Gary (non-blocking)
  // =========================================================================
  try {
    await sendPurchaseNotificationEmail({
      customerEmail,
      productName,
      amount: amountTotal,
      intent,
      stripeSessionId: session.id,
      stripeCustomerId: customerId,
    });
    console.log("[stripe-webhook] Purchase email sent");
  } catch (error) {
    console.error("[stripe-webhook] Failed to send purchase email:", error);
    // Don't throw - email failure shouldn't break webhook
  }

  // =========================================================================
  // 2. Log to Notion database (non-blocking)
  // =========================================================================
  try {
    const notionResult = await logCustomerToNotion({
      email: customerEmail,
      product: productName,
      amount: amountTotal,
      date: new Date(),
      subscriptionStatus: intent === "SUBSCRIPTION" ? "active" : "one_time",
      stripeCustomerId: customerId,
      stripeSessionId: session.id,
      intent,
    });
    if (notionResult.success) {
      console.log("[stripe-webhook] Logged to Notion:", notionResult.pageId);
    }
  } catch (error) {
    console.error("[stripe-webhook] Failed to log to Notion:", error);
    // Don't throw - Notion failure shouldn't break webhook
  }

  // =========================================================================
  // 3. Handle TOP_UP intent - Credit tokens
  // =========================================================================
  if (intent === "TOP_UP") {
    await handleTopUpTokenCredit(session, customerId);
  }
}

/**
 * Get product name from checkout session
 */
async function getProductNameFromSession(session: Stripe.Checkout.Session): Promise<string> {
  const sessionData = session as any;

  // Try to get from metadata first
  const priceId = sessionData.metadata?.priceId;
  if (priceId) {
    const priceToProduct: Record<string, string> = {
      price_starter_monthly: "Commercial Lab - Starter",
      price_starter_yearly: "Commercial Lab - Starter (Yearly)",
      price_creator_monthly: "Commercial Lab - Creator",
      price_creator_yearly: "Commercial Lab - Creator (Yearly)",
      price_growth_monthly: "Commercial Lab - Growth",
      price_growth_yearly: "Commercial Lab - Growth (Yearly)",
      price_scale_monthly: "Commercial Lab - Scale",
      price_scale_yearly: "Commercial Lab - Scale (Yearly)",
      price_lab_test: "Lab Test (Pilot)",
      price_single_lab_test: "Lab Test (Pilot)",
      price_token_pack_8: "Token Pack - 8 Videos",
      price_token_pack_16: "Token Pack - 16 Videos",
      price_token_pack_32: "Token Pack - 32 Videos",
      price_consultation_strategy: "Strategy Consultation",
      price_consultation_architecture: "Architecture Consultation",
    };
    if (priceToProduct[priceId]) {
      return priceToProduct[priceId];
    }
  }

  // Try to get from line items (expanded in session)
  try {
    const lineItems = await stripe.checkout.sessions.listLineItems(session.id, { limit: 1 });
    if (lineItems.data.length > 0) {
      return lineItems.data[0].description || "Unknown Product";
    }
  } catch (error) {
    console.error("[stripe-webhook] Error fetching line items:", error);
  }

  // Fallback based on intent
  const intent = sessionData.metadata?.intent;
  const intentToProduct: Record<string, string> = {
    SUBSCRIPTION: "Commercial Lab Subscription",
    TOP_UP: "Token Pack",
    CONSULTATION: "Consultation",
    UPGRADE: "Subscription Upgrade",
    ENTERPRISE: "Enterprise Plan",
  };

  return intentToProduct[intent] || "Unknown Product";
}

/**
 * Handle token crediting for TOP_UP purchases
 */
async function handleTopUpTokenCredit(session: Stripe.Checkout.Session, customerId: string) {
  const sessionData = session as any;

  if (!customerId) {
    console.log("[stripe-webhook] No customer ID for token top-up");
    return;
  }

  // Find billing customer and their subscription
  const billingCustomer = await db.billingCustomer.findUnique({
    where: { stripeCustomerId: customerId },
    include: {
      account: {
        include: { labSubscription: true },
      },
    },
  });

  if (!billingCustomer?.account?.labSubscription) {
    console.log("[stripe-webhook] No active subscription for token top-up, customer:", customerId);
    return;
  }

  const subscription = billingCustomer.account.labSubscription;

  // Get current cycle (active, not expired)
  const currentCycle = await db.labSubscriptionCycle.findFirst({
    where: {
      subscriptionId: subscription.id,
      periodEnd: { gte: new Date() },
    },
    orderBy: { periodEnd: "desc" },
  });

  if (!currentCycle) {
    console.log("[stripe-webhook] No active cycle for token top-up, subscription:", subscription.id);
    return;
  }

  // Determine token amount from session metadata
  const tokenAmount = getTokenAmountFromSession(sessionData);

  // Idempotency key for this checkout session
  const idempotencyKey = `checkout_${session.id}_topup`;

  // Check if already processed
  const existingEntry = await db.tokenLedgerEntry.findUnique({
    where: { idempotencyKey },
  });

  if (existingEntry) {
    console.log("[stripe-webhook] Token top-up already processed:", idempotencyKey);
    return;
  }

  // Get current balance from last ledger entry
  const lastEntry = await db.tokenLedgerEntry.findFirst({
    where: { cycleId: currentCycle.id },
    orderBy: { createdAt: "desc" },
  });
  const currentBalance = lastEntry?.balance || currentCycle.tokensAllocated - currentCycle.tokensUsed;

  // Create ledger entry for token top-up
  await db.tokenLedgerEntry.create({
    data: {
      cycleId: currentCycle.id,
      type: "CREDIT_TOPUP",
      amount: tokenAmount,
      balance: currentBalance + tokenAmount,
      referenceType: "checkout_session",
      referenceId: session.id,
      idempotencyKey,
      description: `Token pack purchase (${tokenAmount} tokens)`,
      metadata: {
        stripeSessionId: session.id,
        intent: "TOP_UP",
      },
    },
  });

  // Update cycle's tokens allocated
  await db.labSubscriptionCycle.update({
    where: { id: currentCycle.id },
    data: {
      tokensAllocated: { increment: tokenAmount },
    },
  });

  console.log(`[stripe-webhook] Credited ${tokenAmount} tokens (top-up) for account ${billingCustomer.accountId}`);
}

/**
 * Get token amount from checkout session
 */
function getTokenAmountFromSession(session: any): number {
  // Check metadata first (most reliable)
  const tokensFromMetadata = session.metadata?.tokens;
  if (tokensFromMetadata) {
    return parseInt(tokensFromMetadata, 10);
  }

  // Fallback: determine from price ID in metadata
  const priceId = session.metadata?.priceId;
  if (priceId) {
    const tokenMap: Record<string, number> = {
      price_token_pack_8: 8,
      price_token_pack_16: 16,
      price_token_pack_32: 32,
    };
    if (tokenMap[priceId]) {
      return tokenMap[priceId];
    }
  }

  // Default to 8 if unknown
  console.log("[stripe-webhook] Could not determine token amount, defaulting to 8");
  return 8;
}
