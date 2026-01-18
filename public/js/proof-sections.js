/**
 * Barrios A2I Proof Sections
 * Injects "What happens at install" (personal) and "5-day go-live timeline" (business)
 */

(function() {
  'use strict';

  // ========================================
  // INSTALL CHECKLIST (Nexus Personal)
  // ========================================

  function injectInstallChecklist() {
    // Find pricing section to insert before it
    const pricingSection = document.getElementById('pricing');
    if (!pricingSection) return;

    const checklistSection = document.createElement('section');
    checklistSection.id = 'install-checklist';
    checklistSection.innerHTML = `
      <style>
        #install-checklist {
          position: relative;
          padding: 80px 24px;
          background: linear-gradient(180deg, rgba(10, 10, 30, 0.3) 0%, transparent 100%);
          border-top: 1px solid rgba(255, 255, 255, 0.05);
        }
        #install-checklist .checklist-container {
          max-width: 900px;
          margin: 0 auto;
        }
        #install-checklist .checklist-header {
          text-align: center;
          margin-bottom: 48px;
        }
        #install-checklist .checklist-badge {
          display: inline-flex;
          align-items: center;
          gap: 8px;
          padding: 6px 16px;
          background: rgba(0, 206, 209, 0.1);
          border: 1px solid rgba(0, 206, 209, 0.2);
          font-family: 'JetBrains Mono', monospace;
          font-size: 10px;
          color: #00CED1;
          text-transform: uppercase;
          letter-spacing: 0.2em;
          margin-bottom: 16px;
        }
        #install-checklist h2 {
          font-family: 'Playfair Display', serif;
          font-size: 36px;
          color: white;
          margin-bottom: 12px;
        }
        #install-checklist h2 span {
          color: rgba(255, 255, 255, 0.5);
          font-style: italic;
        }
        #install-checklist .checklist-subtitle {
          color: rgba(255, 255, 255, 0.5);
          font-size: 16px;
          max-width: 500px;
          margin: 0 auto;
        }
        #install-checklist .checklist-grid {
          display: grid;
          grid-template-columns: repeat(auto-fit, minmax(280px, 1fr));
          gap: 20px;
        }
        #install-checklist .checklist-item {
          display: flex;
          align-items: flex-start;
          gap: 16px;
          padding: 20px;
          background: rgba(255, 255, 255, 0.02);
          border: 1px solid rgba(255, 255, 255, 0.05);
          transition: all 0.3s ease;
        }
        #install-checklist .checklist-item:hover {
          border-color: rgba(0, 206, 209, 0.3);
          background: rgba(0, 206, 209, 0.03);
        }
        #install-checklist .check-icon {
          flex-shrink: 0;
          width: 24px;
          height: 24px;
          display: flex;
          align-items: center;
          justify-content: center;
          background: rgba(0, 206, 209, 0.1);
          border: 1px solid rgba(0, 206, 209, 0.3);
          color: #00CED1;
        }
        #install-checklist .check-text h4 {
          color: white;
          font-size: 14px;
          font-weight: 500;
          margin-bottom: 4px;
        }
        #install-checklist .check-text p {
          color: rgba(255, 255, 255, 0.5);
          font-size: 13px;
          line-height: 1.5;
        }
        #install-checklist .time-badge {
          display: flex;
          align-items: center;
          justify-content: center;
          gap: 8px;
          margin-top: 32px;
          padding: 12px 24px;
          background: rgba(255, 255, 255, 0.03);
          border: 1px solid rgba(255, 255, 255, 0.1);
          width: fit-content;
          margin-left: auto;
          margin-right: auto;
        }
        #install-checklist .time-badge iconify-icon {
          color: #00CED1;
        }
        #install-checklist .time-badge span {
          font-family: 'JetBrains Mono', monospace;
          font-size: 12px;
          color: rgba(255, 255, 255, 0.7);
        }
      </style>

      <div class="checklist-container">
        <div class="checklist-header">
          <div class="checklist-badge">
            <iconify-icon icon="lucide:clipboard-check" width="12"></iconify-icon>
            Installation Process
          </div>
          <h2>What Happens <span>at Install</span></h2>
          <p class="checklist-subtitle">A transparent look at exactly what we do during your setup session.</p>
        </div>

        <div class="checklist-grid">
          <div class="checklist-item">
            <div class="check-icon">
              <iconify-icon icon="lucide:check" width="14"></iconify-icon>
            </div>
            <div class="check-text">
              <h4>Secure Connection</h4>
              <p>We connect via encrypted remote desktop. You watch every step we take.</p>
            </div>
          </div>

          <div class="checklist-item">
            <div class="check-icon">
              <iconify-icon icon="lucide:check" width="14"></iconify-icon>
            </div>
            <div class="check-text">
              <h4>AI Engine Install</h4>
              <p>We install the local AI engine optimized for your specific hardware.</p>
            </div>
          </div>

          <div class="checklist-item">
            <div class="check-icon">
              <iconify-icon icon="lucide:check" width="14"></iconify-icon>
            </div>
            <div class="check-text">
              <h4>Folder Permissions</h4>
              <p>You choose exactly which folders the assistant can see. Nothing more.</p>
            </div>
          </div>

          <div class="checklist-item">
            <div class="check-icon">
              <iconify-icon icon="lucide:check" width="14"></iconify-icon>
            </div>
            <div class="check-text">
              <h4>Initial Indexing</h4>
              <p>We run the first document scan so your assistant knows your files.</p>
            </div>
          </div>

          <div class="checklist-item">
            <div class="check-icon">
              <iconify-icon icon="lucide:check" width="14"></iconify-icon>
            </div>
            <div class="check-text">
              <h4>Training Session</h4>
              <p>We walk you through common tasks: finding files, writing emails, etc.</p>
            </div>
          </div>

          <div class="checklist-item">
            <div class="check-icon">
              <iconify-icon icon="lucide:check" width="14"></iconify-icon>
            </div>
            <div class="check-text">
              <h4>Privacy Verification</h4>
              <p>We show you how to confirm nothing leaves your computer. Ever.</p>
            </div>
          </div>
        </div>

        <div class="time-badge">
          <iconify-icon icon="lucide:clock" width="16"></iconify-icon>
          <span>Typical install time: 45-60 minutes</span>
        </div>
      </div>
    `;

    pricingSection.parentNode.insertBefore(checklistSection, pricingSection);
  }

  // ========================================
  // 5-DAY GO-LIVE TIMELINE (Business)
  // ========================================

  function injectGoLiveTimeline() {
    // Find pricing section to insert before it
    const pricingSection = document.getElementById('pricing');
    if (!pricingSection) return;

    const timelineSection = document.createElement('section');
    timelineSection.id = 'go-live-timeline';
    timelineSection.innerHTML = `
      <style>
        #go-live-timeline {
          position: relative;
          padding: 100px 24px;
          background: linear-gradient(180deg, transparent 0%, rgba(10, 10, 30, 0.4) 50%, transparent 100%);
        }
        #go-live-timeline .timeline-container {
          max-width: 1000px;
          margin: 0 auto;
        }
        #go-live-timeline .timeline-header {
          text-align: center;
          margin-bottom: 64px;
        }
        #go-live-timeline .timeline-badge {
          display: inline-flex;
          align-items: center;
          gap: 8px;
          padding: 6px 16px;
          background: rgba(245, 158, 11, 0.1);
          border: 1px solid rgba(245, 158, 11, 0.3);
          font-family: 'JetBrains Mono', monospace;
          font-size: 10px;
          color: #F59E0B;
          text-transform: uppercase;
          letter-spacing: 0.2em;
          margin-bottom: 16px;
        }
        #go-live-timeline h2 {
          font-family: 'Playfair Display', serif;
          font-size: 40px;
          color: white;
          margin-bottom: 12px;
        }
        #go-live-timeline h2 span {
          color: #F59E0B;
        }
        #go-live-timeline .timeline-subtitle {
          color: rgba(255, 255, 255, 0.5);
          font-size: 16px;
          max-width: 550px;
          margin: 0 auto;
        }
        #go-live-timeline .timeline-grid {
          display: grid;
          grid-template-columns: repeat(5, 1fr);
          gap: 0;
          position: relative;
        }
        @media (max-width: 900px) {
          #go-live-timeline .timeline-grid {
            grid-template-columns: 1fr;
            gap: 24px;
          }
        }
        #go-live-timeline .timeline-line {
          position: absolute;
          top: 28px;
          left: 10%;
          right: 10%;
          height: 2px;
          background: linear-gradient(90deg, transparent 0%, rgba(0, 206, 209, 0.3) 20%, rgba(0, 206, 209, 0.3) 80%, transparent 100%);
        }
        @media (max-width: 900px) {
          #go-live-timeline .timeline-line {
            display: none;
          }
        }
        #go-live-timeline .timeline-day {
          position: relative;
          display: flex;
          flex-direction: column;
          align-items: center;
          text-align: center;
          padding: 0 12px;
        }
        #go-live-timeline .day-marker {
          position: relative;
          z-index: 2;
          width: 56px;
          height: 56px;
          display: flex;
          align-items: center;
          justify-content: center;
          background: #0a0a1e;
          border: 2px solid rgba(0, 206, 209, 0.4);
          margin-bottom: 20px;
          transition: all 0.3s ease;
        }
        #go-live-timeline .timeline-day:hover .day-marker {
          border-color: #00CED1;
          box-shadow: 0 0 30px rgba(0, 206, 209, 0.3);
        }
        #go-live-timeline .day-number {
          font-family: 'JetBrains Mono', monospace;
          font-size: 11px;
          color: #00CED1;
          letter-spacing: 0.1em;
        }
        #go-live-timeline .day-title {
          color: white;
          font-size: 14px;
          font-weight: 600;
          margin-bottom: 8px;
        }
        #go-live-timeline .day-desc {
          color: rgba(255, 255, 255, 0.5);
          font-size: 12px;
          line-height: 1.6;
          max-width: 160px;
        }
        #go-live-timeline .timeline-day.active .day-marker {
          background: #00CED1;
          border-color: #00CED1;
        }
        #go-live-timeline .timeline-day.active .day-number {
          color: #0a0a0f;
          font-weight: 700;
        }
        #go-live-timeline .result-banner {
          display: flex;
          align-items: center;
          justify-content: center;
          gap: 32px;
          margin-top: 64px;
          padding: 24px 32px;
          background: rgba(245, 158, 11, 0.05);
          border: 1px solid rgba(245, 158, 11, 0.2);
        }
        @media (max-width: 600px) {
          #go-live-timeline .result-banner {
            flex-direction: column;
            gap: 16px;
            text-align: center;
          }
        }
        #go-live-timeline .result-stat {
          display: flex;
          flex-direction: column;
          align-items: center;
        }
        #go-live-timeline .result-stat .number {
          font-family: 'JetBrains Mono', monospace;
          font-size: 28px;
          font-weight: 700;
          color: #F59E0B;
        }
        #go-live-timeline .result-stat .label {
          font-size: 11px;
          color: rgba(255, 255, 255, 0.5);
          text-transform: uppercase;
          letter-spacing: 0.1em;
        }
      </style>

      <div class="timeline-container">
        <div class="timeline-header">
          <div class="timeline-badge">
            <iconify-icon icon="lucide:rocket" width="12"></iconify-icon>
            Enterprise Deployment
          </div>
          <h2>Go Live in <span>5 Days</span></h2>
          <p class="timeline-subtitle">From first call to running system. No months of consulting. No bloated SOWs.</p>
        </div>

        <div class="timeline-grid">
          <div class="timeline-line"></div>

          <div class="timeline-day active">
            <div class="day-marker">
              <span class="day-number">DAY 1</span>
            </div>
            <div class="day-title">Discovery Call</div>
            <p class="day-desc">We map your workflows, data sources, and goals in a 60-minute session.</p>
          </div>

          <div class="timeline-day">
            <div class="day-marker">
              <span class="day-number">DAY 2</span>
            </div>
            <div class="day-title">Architecture</div>
            <p class="day-desc">Our team designs your custom agent topology and integration plan.</p>
          </div>

          <div class="timeline-day">
            <div class="day-marker">
              <span class="day-number">DAY 3</span>
            </div>
            <div class="day-title">Build & Test</div>
            <p class="day-desc">We build your agents, connect your data, and run automated tests.</p>
          </div>

          <div class="timeline-day">
            <div class="day-marker">
              <span class="day-number">DAY 4</span>
            </div>
            <div class="day-title">Staging Deploy</div>
            <p class="day-desc">Your system goes live in a staging environment for validation.</p>
          </div>

          <div class="timeline-day">
            <div class="day-marker">
              <span class="day-number">DAY 5</span>
            </div>
            <div class="day-title">Production</div>
            <p class="day-desc">Full production deployment with monitoring and support handoff.</p>
          </div>
        </div>

        <div class="result-banner">
          <div class="result-stat">
            <span class="number">60%</span>
            <span class="label">Cost Reduction</span>
          </div>
          <div class="result-stat">
            <span class="number">95%</span>
            <span class="label">Attack Detection</span>
          </div>
          <div class="result-stat">
            <span class="number">40%+</span>
            <span class="label">Lead Capture Lift</span>
          </div>
        </div>
      </div>
    `;

    pricingSection.parentNode.insertBefore(timelineSection, pricingSection);
  }

  // ========================================
  // INITIALIZE
  // ========================================

  function init() {
    const isPersonalPage = window.location.pathname.includes('nexus-personal');

    if (isPersonalPage) {
      injectInstallChecklist();
    }
    // Timeline is now in index.html - no longer injected via JS
  }

  // Run when DOM is ready
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init);
  } else {
    init();
  }

})();
