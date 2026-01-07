/**
 * Barrios A2I Revenue Activation
 * Wires CTAs, injects sticky bar, and handles lead forms
 */

(function() {
  'use strict';

  // Wait for config to be available
  const CONFIG = window.BARRIOS_CONFIG || {};

  // ========================================
  // BUTTON WIRING
  // ========================================

  function wireButtons() {
    // Wire buttons by their text content or data attributes
    document.querySelectorAll('button, a').forEach(el => {
      const text = el.textContent.trim().toUpperCase();

      // SUBSCRIBE button → Stripe subscription
      if (text.includes('SUBSCRIBE')) {
        el.addEventListener('click', (e) => {
          e.preventDefault();
          window.open(CONFIG.STRIPE_SUBSCRIBE_URL, '_blank');
        });
        el.style.cursor = 'pointer';
      }

      // START_INSTALL / Remote install → Stripe $199
      if (text.includes('START_INSTALL') || text.includes('START INSTALL')) {
        el.addEventListener('click', (e) => {
          e.preventDefault();
          window.open(CONFIG.STRIPE_REMOTE_INSTALL_URL, '_blank');
        });
        el.style.cursor = 'pointer';
      }

      // BOOK_VISIT / House call → Stripe $299
      if (text.includes('BOOK_VISIT') || text.includes('BOOK VISIT')) {
        el.addEventListener('click', (e) => {
          e.preventDefault();
          window.open(CONFIG.STRIPE_HOUSE_CALL_URL, '_blank');
        });
        el.style.cursor = 'pointer';
      }

      // INITIALIZE COMMERCIAL LAB → Stripe $499
      if (text.includes('INITIALIZE COMMERCIAL LAB') || text.includes('INITIALIZE_COMMERCIAL_LAB') ||
          text.includes('INITIALIZE AD FORGE') || text.includes('INITIALIZE_AD_FORGE')) {
        el.addEventListener('click', (e) => {
          e.preventDefault();
          window.open(CONFIG.STRIPE_COMMERCIAL_LAB_URL, '_blank');
        });
        el.style.cursor = 'pointer';
      }

      // BOOK_DEMO / Book Demo → Calendly demo
      if (text.includes('BOOK_DEMO') || text.includes('BOOK DEMO') || text.includes('BOOK A DEMO')) {
        el.addEventListener('click', (e) => {
          e.preventDefault();
          window.open(CONFIG.CALENDLY_DEMO_URL, '_blank');
        });
        el.style.cursor = 'pointer';
      }

      // REQUEST_ACCESS → Lead form scroll
      if (text.includes('REQUEST_ACCESS') || text.includes('REQUEST ACCESS')) {
        el.addEventListener('click', (e) => {
          e.preventDefault();
          const form = document.getElementById('lead-capture-form');
          if (form) {
            form.scrollIntoView({ behavior: 'smooth', block: 'center' });
            setTimeout(() => {
              const firstInput = form.querySelector('input');
              if (firstInput) firstInput.focus();
            }, 500);
          }
        });
        el.style.cursor = 'pointer';
      }
    });
  }

  // ========================================
  // STICKY CTA BAR
  // ========================================

  function injectStickyCTA() {
    const isPersonalPage = window.location.pathname.includes('nexus-personal');
    const isBusinessPage = window.location.pathname === '/' ||
                           window.location.pathname.includes('index') ||
                           window.location.pathname.includes('nexus-brain');

    const stickyBar = document.createElement('div');
    stickyBar.id = 'sticky-cta-bar';
    stickyBar.innerHTML = `
      <style>
        #sticky-cta-bar {
          position: fixed;
          bottom: 0;
          left: 0;
          right: 0;
          z-index: 9990;
          background: linear-gradient(180deg, rgba(10, 10, 15, 0.95) 0%, rgba(10, 10, 30, 0.98) 100%);
          backdrop-filter: blur(12px);
          -webkit-backdrop-filter: blur(12px);
          border-top: 1px solid rgba(0, 206, 209, 0.2);
          padding: 12px 16px;
          display: flex;
          align-items: center;
          justify-content: center;
          gap: 16px;
          transform: translateY(100%);
          opacity: 0;
          transition: transform 0.4s cubic-bezier(0.16, 1, 0.3, 1), opacity 0.3s ease;
        }
        #sticky-cta-bar.visible {
          transform: translateY(0);
          opacity: 1;
        }
        #sticky-cta-bar .cta-text {
          font-family: 'Inter', sans-serif;
          font-size: 13px;
          color: rgba(255, 255, 255, 0.7);
          display: none;
        }
        @media (min-width: 640px) {
          #sticky-cta-bar .cta-text {
            display: block;
          }
        }
        #sticky-cta-bar .cta-button {
          display: inline-flex;
          align-items: center;
          gap: 8px;
          padding: 10px 24px;
          background: #00CED1;
          color: #0a0a0f;
          font-family: 'JetBrains Mono', monospace;
          font-size: 11px;
          font-weight: 600;
          text-transform: uppercase;
          letter-spacing: 0.1em;
          border: none;
          cursor: pointer;
          transition: all 0.2s ease;
          text-decoration: none;
        }
        #sticky-cta-bar .cta-button:hover {
          background: #22D3EE;
          transform: translateY(-1px);
          box-shadow: 0 4px 20px rgba(0, 206, 209, 0.4);
        }
        #sticky-cta-bar .cta-button svg {
          width: 14px;
          height: 14px;
        }
        #sticky-cta-bar .dismiss-btn {
          position: absolute;
          right: 12px;
          top: 50%;
          transform: translateY(-50%);
          width: 28px;
          height: 28px;
          display: flex;
          align-items: center;
          justify-content: center;
          background: transparent;
          border: 1px solid rgba(255, 255, 255, 0.1);
          border-radius: 4px;
          color: rgba(255, 255, 255, 0.4);
          cursor: pointer;
          transition: all 0.2s ease;
        }
        #sticky-cta-bar .dismiss-btn:hover {
          border-color: rgba(255, 255, 255, 0.3);
          color: rgba(255, 255, 255, 0.8);
        }
      </style>

      ${isPersonalPage ? `
        <span class="cta-text">Ready to get organized?</span>
        <button class="cta-button" id="sticky-book-install">
          <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
            <rect x="3" y="4" width="18" height="18" rx="2" ry="2"></rect>
            <line x1="16" y1="2" x2="16" y2="6"></line>
            <line x1="8" y1="2" x2="8" y2="6"></line>
            <line x1="3" y1="10" x2="21" y2="10"></line>
          </svg>
          Book Install
        </button>
      ` : `
        <span class="cta-text">See how AI can transform your business</span>
        <button class="cta-button" id="sticky-book-demo">
          <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
            <polygon points="5 3 19 12 5 21 5 3"></polygon>
          </svg>
          Book Demo
        </button>
      `}
      <button class="dismiss-btn" id="sticky-dismiss" aria-label="Dismiss">
        <svg xmlns="http://www.w3.org/2000/svg" width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
          <line x1="18" y1="6" x2="6" y2="18"></line>
          <line x1="6" y1="6" x2="18" y2="18"></line>
        </svg>
      </button>
    `;

    document.body.appendChild(stickyBar);

    // Show bar after scrolling 400px
    let dismissed = sessionStorage.getItem('stickyCTADismissed');
    if (!dismissed) {
      window.addEventListener('scroll', function showBar() {
        if (window.scrollY > 400) {
          stickyBar.classList.add('visible');
        }
      }, { passive: true });

      // Initial check
      if (window.scrollY > 400) {
        stickyBar.classList.add('visible');
      }
    }

    // Wire sticky buttons
    const bookInstall = document.getElementById('sticky-book-install');
    const bookDemo = document.getElementById('sticky-book-demo');
    const dismissBtn = document.getElementById('sticky-dismiss');

    if (bookInstall) {
      bookInstall.addEventListener('click', () => {
        window.open(CONFIG.CALENDLY_INSTALL_URL, '_blank');
      });
    }

    if (bookDemo) {
      bookDemo.addEventListener('click', () => {
        window.open(CONFIG.CALENDLY_DEMO_URL, '_blank');
      });
    }

    if (dismissBtn) {
      dismissBtn.addEventListener('click', () => {
        stickyBar.classList.remove('visible');
        sessionStorage.setItem('stickyCTADismissed', 'true');
      });
    }
  }

  // ========================================
  // LEAD CAPTURE FORM
  // ========================================

  function injectLeadForm() {
    // Find footer and insert form before it
    const footer = document.querySelector('footer');
    if (!footer) return;

    const formSection = document.createElement('section');
    formSection.id = 'lead-capture-section';
    formSection.innerHTML = `
      <style>
        #lead-capture-section {
          position: relative;
          padding: 80px 24px;
          background: linear-gradient(180deg, rgba(10, 10, 15, 0) 0%, rgba(10, 10, 30, 0.5) 100%);
          border-top: 1px solid rgba(255, 255, 255, 0.05);
        }
        #lead-capture-section .form-container {
          max-width: 600px;
          margin: 0 auto;
        }
        #lead-capture-section .form-header {
          text-align: center;
          margin-bottom: 40px;
        }
        #lead-capture-section .form-badge {
          display: inline-flex;
          align-items: center;
          gap: 8px;
          padding: 6px 12px;
          background: rgba(0, 206, 209, 0.1);
          border: 1px solid rgba(0, 206, 209, 0.2);
          font-family: 'JetBrains Mono', monospace;
          font-size: 10px;
          color: #00CED1;
          text-transform: uppercase;
          letter-spacing: 0.2em;
          margin-bottom: 16px;
        }
        #lead-capture-section .form-badge .pulse {
          width: 6px;
          height: 6px;
          background: #00CED1;
          border-radius: 50%;
          animation: pulse 2s ease-in-out infinite;
        }
        @keyframes pulse {
          0%, 100% { opacity: 0.5; transform: scale(0.9); }
          50% { opacity: 1; transform: scale(1.1); }
        }
        #lead-capture-section h2 {
          font-family: 'Playfair Display', serif;
          font-size: 32px;
          color: white;
          margin-bottom: 12px;
        }
        #lead-capture-section h2 span {
          color: rgba(255, 255, 255, 0.5);
          font-style: italic;
        }
        #lead-capture-section .form-subtitle {
          color: rgba(255, 255, 255, 0.5);
          font-size: 14px;
        }
        #lead-capture-form {
          display: flex;
          flex-direction: column;
          gap: 16px;
        }
        #lead-capture-form .form-row {
          display: grid;
          grid-template-columns: 1fr;
          gap: 16px;
        }
        @media (min-width: 480px) {
          #lead-capture-form .form-row {
            grid-template-columns: 1fr 1fr;
          }
        }
        #lead-capture-form input,
        #lead-capture-form select,
        #lead-capture-form textarea {
          width: 100%;
          padding: 14px 16px;
          background: rgba(255, 255, 255, 0.03);
          border: 1px solid rgba(255, 255, 255, 0.1);
          color: white;
          font-family: 'Inter', sans-serif;
          font-size: 14px;
          transition: all 0.2s ease;
        }
        #lead-capture-form input:focus,
        #lead-capture-form select:focus,
        #lead-capture-form textarea:focus {
          outline: none;
          border-color: rgba(0, 206, 209, 0.5);
          background: rgba(0, 206, 209, 0.05);
        }
        #lead-capture-form input::placeholder,
        #lead-capture-form textarea::placeholder {
          color: rgba(255, 255, 255, 0.3);
        }
        #lead-capture-form select {
          appearance: none;
          background-image: url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='12' height='12' viewBox='0 0 24 24' fill='none' stroke='%2394a3b8' stroke-width='2'%3E%3Cpolyline points='6 9 12 15 18 9'%3E%3C/polyline%3E%3C/svg%3E");
          background-repeat: no-repeat;
          background-position: right 16px center;
          padding-right: 40px;
        }
        #lead-capture-form select option {
          background: #0a0a1e;
          color: white;
        }
        #lead-capture-form textarea {
          resize: vertical;
          min-height: 100px;
        }
        #lead-capture-form button[type="submit"] {
          display: inline-flex;
          align-items: center;
          justify-content: center;
          gap: 8px;
          padding: 16px 32px;
          background: #00CED1;
          color: #0a0a0f;
          font-family: 'JetBrains Mono', monospace;
          font-size: 12px;
          font-weight: 600;
          text-transform: uppercase;
          letter-spacing: 0.1em;
          border: none;
          cursor: pointer;
          transition: all 0.2s ease;
          margin-top: 8px;
        }
        #lead-capture-form button[type="submit"]:hover {
          background: #22D3EE;
          transform: translateY(-2px);
          box-shadow: 0 8px 30px rgba(0, 206, 209, 0.3);
        }
        #lead-capture-form button[type="submit"]:disabled {
          opacity: 0.6;
          cursor: not-allowed;
          transform: none;
        }
        #lead-capture-form .form-privacy {
          text-align: center;
          font-size: 11px;
          color: rgba(255, 255, 255, 0.3);
          margin-top: 8px;
        }
      </style>

      <div class="form-container">
        <div class="form-header">
          <div class="form-badge">
            <span class="pulse"></span>
            Signal Received
          </div>
          <h2>Get in <span>Touch</span></h2>
          <p class="form-subtitle">Tell us about your project. We'll respond within 24 hours.</p>
        </div>

        <form id="lead-capture-form" action="${CONFIG.FORMSPREE_ENDPOINT}" method="POST">
          <div class="form-row">
            <input type="text" name="name" placeholder="Your Name" required>
            <input type="email" name="email" placeholder="Email Address" required>
          </div>
          <div class="form-row">
            <input type="tel" name="phone" placeholder="Phone (optional)">
            <select name="interest" required>
              <option value="" disabled selected>I'm interested in...</option>
              <option value="nexus-personal">Nexus Personal (Home AI)</option>
              <option value="nexus-brain">Nexus Brain (Business AI)</option>
              <option value="marketing-overlord">Marketing Overlord</option>
              <option value="total-command">Total Command (Enterprise)</option>
              <option value="other">Something Else</option>
            </select>
          </div>
          <textarea name="message" placeholder="Tell us about your goals or questions..."></textarea>
          <button type="submit">
            <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
              <line x1="22" y1="2" x2="11" y2="13"></line>
              <polygon points="22 2 15 22 11 13 2 9 22 2"></polygon>
            </svg>
            Send Message
          </button>
          <p class="form-privacy">We respect your privacy. No spam, ever.</p>
        </form>
      </div>
    `;

    footer.parentNode.insertBefore(formSection, footer);

    // Handle form submission
    const form = document.getElementById('lead-capture-form');
    if (form) {
      form.addEventListener('submit', async (e) => {
        e.preventDefault();
        const submitBtn = form.querySelector('button[type="submit"]');
        const originalText = submitBtn.innerHTML;

        submitBtn.disabled = true;
        submitBtn.innerHTML = '<svg class="animate-spin" xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><circle cx="12" cy="12" r="10"></circle></svg> Sending...';

        try {
          const formData = new FormData(form);
          const response = await fetch(form.action, {
            method: 'POST',
            body: formData,
            headers: { 'Accept': 'application/json' }
          });

          if (response.ok) {
            window.location.href = CONFIG.THANKS_PAGE || '/thanks.html';
          } else {
            throw new Error('Form submission failed');
          }
        } catch (error) {
          console.error('Form error:', error);
          submitBtn.innerHTML = originalText;
          submitBtn.disabled = false;
          alert('Something went wrong. Please try again or email us directly.');
        }
      });
    }
  }

  // ========================================
  // INITIALIZE
  // ========================================

  function init() {
    wireButtons();
    injectStickyCTA();
    injectLeadForm();
  }

  // Run when DOM is ready
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init);
  } else {
    init();
  }

})();
