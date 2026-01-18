/**
 * Barrios A2I Revenue Configuration
 * Replace placeholder URLs with actual service links
 */

const BARRIOS_CONFIG = {
  // ========================================
  // STRIPE PAYMENT LINKS
  // ========================================

  // Nexus Personal - $49/month subscription
  STRIPE_SUBSCRIBE_URL: 'https://buy.stripe.com/6oU4gAclb0djbKRcMleME02',

  // Nexus Personal - $199 remote install (one-time)
  STRIPE_REMOTE_INSTALL_URL: 'https://buy.stripe.com/bJedRagBr8JP3el5jTeME03',

  // Nexus Personal - $299 house call (one-time)
  STRIPE_HOUSE_CALL_URL: 'https://buy.stripe.com/cNi00kbh7bW1g1727HeME04',

  // Commercial Lab - $499 (one-time)
  STRIPE_COMMERCIAL_LAB_URL: 'https://buy.stripe.com/00w4gA84Ve498yF27HeME05',

  // ========================================
  // CALENDLY BOOKING LINKS
  // ========================================

  // Nexus Personal - Install scheduling
  CALENDLY_INSTALL_URL: 'https://calendly.com/alienation2innovation/new-meeting',

  // Business/Enterprise - Demo booking
  CALENDLY_DEMO_URL: 'https://calendly.com/alienation2innovation/ai-commercial-consultations',

  // ========================================
  // FORM ENDPOINTS
  // ========================================

  // Formspree endpoint for lead capture
  FORMSPREE_ENDPOINT: 'https://formspree.io/f/mdanjawv',

  // ========================================
  // PAGE ROUTES
  // ========================================

  THANKS_PAGE: '/thanks.html'
};

// Make config globally available
if (typeof window !== 'undefined') {
  window.BARRIOS_CONFIG = BARRIOS_CONFIG;
}
