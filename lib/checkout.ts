/**
 * Checkout URL utilities for Barrios A2I monetization
 */

export type PricingTier = 'rapid-pilot' | 'prototyper' | 'growth' | 'scale';

const tierIndex: Record<PricingTier, number> = {
  'rapid-pilot': 0,
  prototyper: 1,
  growth: 2,
  scale: 3,
};

/**
 * Redirects user to checkout page with tier preselected
 */
export function redirectToCheckout(tier: PricingTier): void {
  window.location.href = `/checkout.html?tier=${tierIndex[tier]}`;
}

/**
 * Opens Calendly enterprise discovery call in new tab
 */
export function redirectToEnterprise(): void {
  window.open('https://calendly.com/barrios-a2i/enterprise-discovery', '_blank');
}

/**
 * Get checkout URL without redirecting (for Link components)
 */
export function getCheckoutUrl(tier: PricingTier): string {
  return `/checkout.html?tier=${tierIndex[tier]}`;
}

/**
 * Get enterprise calendly URL
 */
export function getEnterpriseUrl(): string {
  return 'https://calendly.com/barrios-a2i/enterprise-discovery';
}
