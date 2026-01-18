/**
 * Nexus Launcher - Floating Neural Link Button
 * Premium breathing glow effect with keyboard accessibility
 */
(function() {
  'use strict';

  const NEXUS_LAUNCHER_ID = 'nexus-launcher';

  // Create launcher button
  function createLauncher() {
    if (document.getElementById(NEXUS_LAUNCHER_ID)) return;

    const launcher = document.createElement('button');
    launcher.id = NEXUS_LAUNCHER_ID;
    launcher.className = 'nexus-launcher';
    launcher.setAttribute('aria-label', 'Talk to Nexus - Neural Link');
    launcher.setAttribute('aria-haspopup', 'dialog');
    launcher.setAttribute('aria-expanded', 'false');
    launcher.setAttribute('data-tooltip', 'NEURAL LINK');

    launcher.innerHTML = `
      <div class="nexus-launcher-glow"></div>
      <div class="nexus-launcher-inner">
        <svg class="nexus-launcher-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5">
          <circle cx="12" cy="12" r="3" />
          <path d="M12 2v4m0 12v4M2 12h4m12 0h4" />
          <path d="M4.93 4.93l2.83 2.83m8.48 8.48l2.83 2.83M4.93 19.07l2.83-2.83m8.48-8.48l2.83-2.83" opacity="0.5" />
        </svg>
        <span class="nexus-launcher-pulse"></span>
      </div>
    `;

    // Click handler
    launcher.addEventListener('click', () => {
      window.NexusPanel?.toggle();
    });

    // Keyboard handler
    launcher.addEventListener('keydown', (e) => {
      if (e.key === 'Enter' || e.key === ' ') {
        e.preventDefault();
        window.NexusPanel?.toggle();
      }
    });

    document.body.appendChild(launcher);

    // Global keyboard shortcut: Ctrl+K / Cmd+K
    document.addEventListener('keydown', (e) => {
      if ((e.ctrlKey || e.metaKey) && e.key === 'k') {
        e.preventDefault();
        window.NexusPanel?.toggle();
      }
      if (e.key === 'Escape' && window.NexusPanel?.isOpen()) {
        window.NexusPanel.close();
      }
    });
  }

  // Update launcher state when panel opens/closes
  window.NexusLauncher = {
    setExpanded: function(expanded) {
      const launcher = document.getElementById(NEXUS_LAUNCHER_ID);
      if (launcher) {
        launcher.setAttribute('aria-expanded', String(expanded));
        launcher.classList.toggle('nexus-launcher--active', expanded);
      }
    },
    focus: function() {
      const launcher = document.getElementById(NEXUS_LAUNCHER_ID);
      if (launcher) launcher.focus();
    }
  };

  // Initialize on DOM ready
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', createLauncher);
  } else {
    createLauncher();
  }
})();
