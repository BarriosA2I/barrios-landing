# Stripe Payment System Setup Guide

This guide walks you through completing the Stripe payment system integration for Barrios A2I.

## Prerequisites

- Stripe account (test mode for development)
- Supabase project with PostgreSQL database
- Node.js installed

## Step 1: Environment Configuration

1. Copy the example environment file:
   ```bash
   cp .env.example .env.local
   ```

2. Fill in your credentials in `.env.local`:

   ```bash
   # Supabase PostgreSQL
   # Get from Supabase Dashboard > Settings > Database
   DATABASE_URL="postgresql://postgres.[project-ref]:[password]@aws-0-[region].pooler.supabase.com:6543/postgres?pgbouncer=true"
   DIRECT_URL="postgresql://postgres.[project-ref]:[password]@aws-0-[region].pooler.supabase.com:5432/postgres"

   # Stripe Keys
   # Get from Stripe Dashboard > Developers > API Keys
   STRIPE_SECRET_KEY="sk_test_..."
   STRIPE_PUBLISHABLE_KEY="pk_test_..."
   STRIPE_WEBHOOK_SECRET="whsec_..."  # Generated in Step 4

   # Calendly URLs (optional - for consultations)
   CALENDLY_STRATEGY_URL="https://calendly.com/barrios-a2i/strategy-45"
   CALENDLY_ARCHITECTURE_URL="https://calendly.com/barrios-a2i/architecture-90"
   CALENDLY_ENTERPRISE_URL="https://calendly.com/barrios-a2i/enterprise-discovery"

   # Site URL
   NEXT_PUBLIC_BASE_URL="https://barriosa2i.com"
   ```

## Step 2: Database Migration

Run Prisma migrations to create the payment tables:

```bash
# Generate the Prisma client
npm run db:generate

# Push schema to Supabase (development)
npm run db:push

# Or run migrations (production)
npm run db:migrate
```

This creates 12 tables:
- `customers` - Customer lifecycle tracking
- `subscriptions` - Stripe subscription sync
- `token_allocations` - Token pools (subscription, purchased, bonus)
- `purchases` - All one-time purchases
- `production_jobs` - Video production queue
- `clone_assets` - Voice and avatar clones
- `webhook_events` - Idempotent webhook processing
- `token_transactions` - Token ledger
- `consultations` - Calendly booking integration
- `customer_events` - Lifecycle event tracking

## Step 3: Seed Stripe Products

Create all 24 products in your Stripe account:

```bash
npm run stripe:seed
```

This creates:
- 4 Subscription tiers (Starter, Creator, Growth, Scale)
- 3 Consultation services
- 3 Token packs
- 14 Add-ons (clones, priority, extras, Nexus)

## Step 4: Configure Webhooks

### Local Development

1. Install Stripe CLI: https://stripe.com/docs/stripe-cli
2. Start the webhook listener:
   ```bash
   npm run stripe:listen
   ```
3. Copy the webhook signing secret (`whsec_...`) to your `.env.local`

### Production (Vercel)

1. Go to Stripe Dashboard > Developers > Webhooks
2. Add endpoint: `https://barriosa2i.com/api/webhooks/stripe`
3. Select events to listen:
   - `checkout.session.completed`
   - `customer.subscription.created`
   - `customer.subscription.updated`
   - `customer.subscription.deleted`
   - `invoice.payment_succeeded`
   - `invoice.payment_failed`
4. Copy the signing secret to Vercel environment variables

### Add Environment Variables to Vercel

```bash
vercel env add STRIPE_SECRET_KEY
vercel env add STRIPE_PUBLISHABLE_KEY
vercel env add STRIPE_WEBHOOK_SECRET
vercel env add DATABASE_URL
vercel env add DIRECT_URL
```

## Step 5: Update Checkout Page

Update the Stripe publishable key in `checkout.html`:

```javascript
const stripePublishableKey = 'pk_test_your_actual_key';
```

## Step 6: Test the Flow

1. Open `/checkout.html` in your browser
2. Select a subscription tier
3. Click "Proceed to Payment"
4. Complete checkout with test card: `4242 4242 4242 4242`
5. Verify:
   - Redirect to success page
   - Webhook received (check Stripe Dashboard > Developers > Webhooks)
   - Customer created in database (run `npm run db:studio`)
   - Subscription active

## API Endpoints

| Endpoint | Method | Description |
|----------|--------|-------------|
| `/api/checkout/session` | POST | Create Stripe checkout session |
| `/api/webhooks/stripe` | POST | Handle Stripe webhook events |

### Create Checkout Session

```javascript
const response = await fetch('/api/checkout/session', {
  method: 'POST',
  headers: { 'Content-Type': 'application/json' },
  body: JSON.stringify({
    items: [{ priceId: 'price_starter_monthly', quantity: 1 }],
    intent: 'SUBSCRIPTION', // or 'CONSULTATION', 'TOP_UP', 'UPGRADE'
    email: 'customer@example.com',
    promoCode: 'LAUNCH2024',
    metadata: { source: 'landing-page' }
  })
});

const { url, sessionId } = await response.json();
window.location.href = url;
```

## Checkout Intents

| Intent | Mode | Use Case |
|--------|------|----------|
| `SUBSCRIPTION` | subscription | New subscription signup |
| `TRIAL` | subscription | Low-friction trial |
| `CONSULTATION` | payment | Strategy/architecture calls |
| `TOP_UP` | payment | Token pack purchase |
| `UPGRADE` | subscription | Tier change |
| `ENTERPRISE` | payment | Custom enterprise deal |

## Product Categories

| Category | Products |
|----------|----------|
| `COMMERCIAL_LAB` | Starter, Creator, Growth, Scale subscriptions |
| `LAB_ONE_TIME` | Single Lab Test |
| `IDENTITY_ADDONS` | Voice Clone, Avatar Clone, Bundle |
| `PRIORITY_ADDONS` | Rush Delivery, 48h Priority |
| `TOKEN_PACKS` | 8, 16, 32 token packs |
| `EXTRAS` | Revision Pack, Variant Pack |
| `NEXUS_PERSONAL` | Installation, Maintenance, House Call |
| `CONSULTATION` | Strategy 45, Architecture 90, Enterprise |

## Troubleshooting

### "Prisma client not generated"
Run: `npm run db:generate`

### "Webhook signature verification failed"
Check that `STRIPE_WEBHOOK_SECRET` matches your endpoint's signing secret

### "Database connection failed"
- Ensure Supabase is running
- Check `DATABASE_URL` format includes `?pgbouncer=true`
- Verify `DIRECT_URL` uses port 5432

### "Products not found in Stripe"
Run: `npm run stripe:seed`

## Files Created

```
frontend-barrios-landing/
├── prisma/
│   └── schema.prisma           # Database schema (12 models)
├── api/
│   ├── checkout/
│   │   └── session.js          # Checkout session API
│   └── webhooks/
│       └── stripe.js           # Webhook handler
├── js/
│   └── product-catalog.js      # 24 products
├── scripts/
│   └── seed-stripe-products.js # Stripe seeding
├── checkout.html               # Checkout page
├── checkout-success.html       # Success page
├── checkout-cancelled.html     # Cancelled page
├── .env.example                # Environment template
└── STRIPE_SETUP.md            # This file
```

## Support

For issues, contact: hello@barriosa2i.com
