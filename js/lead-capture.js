/**
 * Lead Capture Utility - Barrios A2I
 * Captures leads from contact forms and NEXUS chat
 * Sends to /api/leads endpoint on API Gateway
 */
(function() {
  'use strict';

  const API_URL = 'https://barrios-api-gateway.onrender.com/api/leads';

  // Track captured emails to avoid duplicates in same session
  const capturedEmails = new Set();

  /**
   * Capture a lead and send to API
   * @param {Object} data - Lead data
   * @param {string} data.email - Required email address
   * @param {string} [data.name] - Optional name
   * @param {string} [data.company] - Optional company
   * @param {string} [data.phone] - Optional phone
   * @param {string} [data.message] - Optional message/context
   * @param {string} [data.source] - Source identifier (contact_form, nexus_chat, etc.)
   * @returns {Promise<boolean>} - Success status
   */
  async function capture(data) {
    if (!data.email) {
      console.debug('[LeadCapture] No email provided');
      return false;
    }

    // Normalize email
    const email = data.email.toLowerCase().trim();

    // Skip if already captured this session
    if (capturedEmails.has(email)) {
      console.debug('[LeadCapture] Already captured:', email);
      return true;
    }

    try {
      const response = await fetch(API_URL, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          name: data.name || '',
          email: email,
          company: data.company || '',
          phone: data.phone || '',
          message: data.message || '',
          source: data.source || 'website',
          session_id: getSessionId()
        })
      });

      if (response.ok) {
        capturedEmails.add(email);
        console.debug('[LeadCapture] Captured:', email, 'from', data.source);
        return true;
      } else {
        console.debug('[LeadCapture] API error:', response.status);
        return false;
      }
    } catch (e) {
      // Silent fail - don't break user experience
      console.debug('[LeadCapture] Network error:', e.message);
      return false;
    }
  }

  /**
   * Get or create session ID (reuses NEXUS session if available)
   */
  function getSessionId() {
    // Try to get NEXUS session first
    if (window.NexusChat?.getSessionId) {
      return window.NexusChat.getSessionId();
    }

    // Fallback to our own session
    let sid = sessionStorage.getItem('barrios_lead_sid');
    if (!sid) {
      sid = 'lead_' + Date.now().toString(36) + '_' + Math.random().toString(36).slice(2, 8);
      sessionStorage.setItem('barrios_lead_sid', sid);
    }
    return sid;
  }

  /**
   * Extract email address from text
   * @param {string} text - Text to search
   * @returns {string|null} - Extracted email or null
   */
  function extractEmail(text) {
    if (!text) return null;
    const match = text.match(/[\w.-]+@[\w.-]+\.\w{2,}/);
    return match ? match[0].toLowerCase() : null;
  }

  /**
   * Check if an email was already captured this session
   * @param {string} email - Email to check
   * @returns {boolean}
   */
  function isCaptured(email) {
    return capturedEmails.has(email?.toLowerCase()?.trim());
  }

  // Public API
  window.LeadCapture = {
    capture,
    extractEmail,
    isCaptured,
    getSessionId
  };

  console.debug('[LeadCapture] Utility loaded');
})();
