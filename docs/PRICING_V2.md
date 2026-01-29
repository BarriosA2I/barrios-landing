# Commercial Lab Pricing V2 - "Performance Engine"

## Overview
- **Target:** B2B SaaS marketing teams, Ecom managers, Growth teams
- **Positioning:** High-performance creative at machine speed
- **Model:** Subscription-first with premium token packs

---

## Subscription Tiers

### Prototyper - $599/month
- 16 tokens (2 commercials)
- 2 formats (9:16 + 16:9)
- 1 revision round
- 4-day turnaround
- Captions included
- **Effective cost:** $300/commercial, $37.44/token

### Growth - $1,199/month
- 40 tokens (5 commercials)
- 4 formats (9:16, 16:9, 1:1, 4:5)
- 2 revision rounds
- 2-day turnaround
- A/B hook variants included
- Captions included
- **Effective cost:** $240/commercial, $30/token

### Scale - $2,499/month
- 96 tokens (12 commercials)
- All formats
- 4 revision rounds
- 24-hour priority turnaround
- Voice clone included ($199 value)
- Avatar clone included ($999 value)
- Captions included
- **Effective cost:** $208/commercial, $26/token

---

## Entry Offer

### Rapid Pilot - $299 (one-time)
- 8 tokens (1 commercial)
- 1 CTA variant swap included
- 1 revision round
- 5-day turnaround
- 2 formats (9:16 + 16:9)
- **Credit Policy:** 100% credited toward first month if upgrade within 7 days of delivery

---

## Token Packs (Non-Subscriber Pricing)

Premium tax: Non-subscribers pay $75/token ($600/commercial)

| Pack | Tokens | Price | $/Token |
|------|--------|-------|---------|
| Single | 8 | $600 | $75 |
| Double | 16 | $1,200 | $75 |
| Volume | 40 | $3,000 | $75 |

**Subscriber Top-Up Rates:**
- Prototyper: $37.44/token
- Growth: $30/token
- Scale: $26/token

---

## Add-Ons

| Add-On | Price | Included At |
|--------|-------|-------------|
| Voice Clone Setup | $199 | Scale |
| Avatar Clone Training | $999 | Scale |
| Variant Pack (3 CTA swaps) | $149 | Growth+ |
| Rush 48h Delivery | $299 | - |
| Rush 24h Delivery | $499 | - |
| Extra Revisions (2 rounds) | $149 | - |

---

## Revision Policy

| Change Type | Cost |
|-------------|------|
| Copy/CTA text changes | Free (within rounds) |
| Voiceover re-record | Free (within rounds) |
| Scene regeneration | 1 token per scene |
| Full concept pivot | 8 tokens (new commercial) |

---

## Token Math

- 1 token = 1 scene = 8 seconds of video
- 8 tokens = 1 complete 64-second commercial
- Tokens reset monthly for subscribers
- 1-month rollover allowed (max 2x monthly allotment)
- Tokens expire after 60 days

---

## Deliverables Per Commercial

Every commercial includes:
- 1x 64-second hero video
- Burned-in captions
- SRT caption file
- Formats based on tier (minimum 9:16 + 16:9)

---

## Stripe Product/Price IDs (CREATED 2026-01-29)

### Subscriptions
| Product | Product ID | Price ID | Tokens | Amount |
|---------|------------|----------|--------|--------|
| Prototyper | `prod_TsifPU8AtmGacQ` | `price_1SuxDoLyFGkLiU4CxxLjgoZq` | 16 | $599/mo |
| Growth | `prod_TsihSVy6TuDqQS` | `price_1SuxFnLyFGkLiU4CzqWvv9DR` | 40 | $1,199/mo |
| Scale | `prod_TsihDQL1l9FesH` | `price_1SuxGQLyFGkLiU4CiDiAEkOD` | 96 | $2,499/mo |

### Entry Offer
| Product | Product ID | Price ID | Tokens | Amount |
|---------|------------|----------|--------|--------|
| Rapid Pilot | `prod_TsijBRlNjstjQQ` | `price_1SuxIMLyFGkLiU4CBoIEIfs8` | 8 | $299 |

### Token Packs
| Product | Product ID | Price ID | Tokens | Amount |
|---------|------------|----------|--------|--------|
| Token Pack 8 | `prod_TsimCkEe8xqNXm` | `price_1SuxKTLyFGkLiU4CyMuPCSPL` | 8 | $600 |
| Token Pack 16 | `prod_Tsin5CzxDOqIrB` | `price_1SuxMCLyFGkLiU4C8Q45qVPJ` | 16 | $1,200 |
| Token Pack 40 | `prod_TsipCaJHJqtCOM` | `price_1SuxO2LyFGkLiU4CRR7D14wh` | 40 | $3,000 |

### Add-Ons (No Token Grant)
| Product | Product ID | Amount |
|---------|------------|--------|
| Voice Clone Setup | `prod_TsirtB4j2D81dx` | $199 |
| Avatar Clone Training | `prod_Tsitl7SQnWRQeU` | $999 |
| Variant Pack | `prod_TsivqxmOqoyjGQ` | $149 |
| Rush 48h Delivery | `prod_TsixCNvGkWQTLm` | $299 |
| Rush 24h Delivery | `prod_Tsiz7rTVvQJkYf` | $499 |
| Extra Revisions | `prod_Tsj1YmDop1qQsn` | $149 |

---

## Messaging/Copy

**Headline:** High-Performance Creative at Machine Speed

**Prototyper:** Stop the scroll with pro-grade AI visuals.

**Growth:** The sweet spot for scaling brands needing constant A/B testing.

**Scale:** Your dedicated automated production house for global campaigns.

**Anchor:** Compare $1,199/mo Growth to a part-time motion designer ($4,000/mo). That's $29/ad vs $500+/ad.

---

## Migration Notes

### Old Products to Archive

| Old Product | Old Price | Stripe Price ID | Status |
|-------------|-----------|-----------------|--------|
| Starter | $449/mo | `price_1SuDIPLyFGkLiU4CWVBwoBAR` | Archive |
| Creator | $899/mo | `price_1SuDJPLyFGkLiU4Ck2CzcwcX` | Archive |
| Growth (old) | $1,699/mo | `price_1SuDMRLyFGkLiU4Ci4if35Dv` | Archive (name reused) |
| Scale (old) | $3,199/mo | `price_1SuDNGLyFGkLiU4CS6eYsq6F` | Archive (name reused) |
| Lab Test | $500 | `price_1SuDOBLyFGkLiU4Ct7F1xeZo` | Replace with Rapid Pilot |
| 8-Token Pack | $449 | `price_1SuDP7LyFGkLiU4CPQEhLnal` | Replace with $600 pack |
| 16-Token Pack | $799 | `price_1SuDR8LyFGkLiU4Ci907l5b2` | Replace with $1,200 pack |
| 32-Token Pack | $1,499 | `price_1SuDS6LyFGkLiU4CGLuNK8wS` | Replace with 40-pack $3,000 |

### Migration Steps
1. Create new products/prices in Stripe Dashboard
2. Update `stripe_webhook.py` PRICE_TO_PRODUCT mapping
3. Update frontend checkout session route
4. Update pricing display on creative-director page
5. Archive old prices in Stripe (do not delete - preserve history)

---

## Implementation Phases

| Phase | Scope | Status |
|-------|-------|--------|
| 1 | Create this documentation | COMPLETE |
| 2 | Create Stripe products/prices | COMPLETE (2026-01-29) |
| 3 | Update backend (webhook, tokens) | COMPLETE (2026-01-29) |
| 4 | Update frontend (checkout, display) | PENDING |
| 5 | E2E testing | PENDING |

---

*Last Updated: 2026-01-29*
*Version: 2.0 "Performance Engine"*
