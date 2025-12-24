/**
 * Barrios A2I Revenue Configuration
 * Replace placeholder URLs with actual service links
 */

const BARRIOS_CONFIG = {
  // ========================================
  // STRIPE PAYMENT LINKS
  // ========================================

  // Nexus Personal - $49/month subscription
  STRIPE_SUBSCRIBE_URL: 'https://buy.stripe.com/YOUR_SUBSCRIBE_LINK',

  // Nexus Personal - $199 remote install (one-time)
  STRIPE_REMOTE_INSTALL_URL: 'https://buy.stripe.com/YOUR_REMOTE_INSTALL_LINK',

  // Nexus Personal - $299 house call (one-time)
  STRIPE_HOUSE_CALL_URL: 'https://buy.stripe.com/YOUR_HOUSE_CALL_LINK',

  // ========================================
  // CALENDLY BOOKING LINKS
  // ========================================

  // Nexus Personal - Install scheduling
  CALENDLY_INSTALL_URL: 'https://calendly.com/barriosa2i/nexus-install',

  // Business/Enterprise - Demo booking
  CALENDLY_DEMO_URL: 'https://calendly.com/barriosa2i/demo',

  // ========================================
  // FORM ENDPOINTS
  // ========================================

  // Formspree endpoint for lead capture
  FORMSPREE_ENDPOINT: 'https://formspree.io/f/YOUR_FORM_ID',

  // ========================================
  // PAGE ROUTES
  // ========================================

  THANKS_PAGE: '/thanks.html'
};

// Make config globally available
if (typeof window !== 'undefined') {
  window.BARRIOS_CONFIG = BARRIOS_CONFIG;
}
