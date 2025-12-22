/**
 * Nexus Panel - Glassmorphism Chat Drawer
 * Right-side sliding panel with focus trap and mobile support
 * P0-E: Session persistence - restores messages on load
 */
(function() {
  'use strict';

  // API Base URL - same as nexus-chat.js
  const NEXUS_API_BASE = window.NEXUS_API_BASE || 'https://nexus-api-wud4.onrender.com/api/nexus';
  let hasRestoredMessages = false;

  const PANEL_ID = 'nexus-panel';
  const BACKDROP_ID = 'nexus-backdrop';
  let panelElement = null;
  let backdropElement = null;
  let isOpen = false;
  let previousActiveElement = null;

  // Generate unique session ID
  function generateSessionId() {
    return 'sess_' + Date.now().toString(36) + '_' + Math.random().toString(36).slice(2, 8);
  }

  // Create panel HTML
  function createPanel() {
    if (document.getElementById(PANEL_ID)) return;

    // Backdrop
    backdropElement = document.createElement('div');
    backdropElement.id = BACKDROP_ID;
    backdropElement.className = 'nexus-backdrop';
    backdropElement.setAttribute('aria-hidden', 'true');
    backdropElement.addEventListener('click', close);

    // Panel
    panelElement = document.createElement('div');
    panelElement.id = PANEL_ID;
    panelElement.className = 'nexus-panel';
    panelElement.setAttribute('role', 'dialog');
    panelElement.setAttribute('aria-modal', 'true');
    panelElement.setAttribute('aria-labelledby', 'nexus-title');
    panelElement.setAttribute('aria-hidden', 'true');

    panelElement.innerHTML = `
      <div class="nexus-panel-header">
        <div class="nexus-panel-title-row">
          <div class="nexus-panel-branding">
            <svg class="nexus-panel-logo" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5">
              <circle cx="12" cy="12" r="3" fill="currentColor" />
              <circle cx="12" cy="12" r="8" opacity="0.3" />
              <path d="M12 2v4m0 12v4M2 12h4m12 0h4" />
            </svg>
            <div class="nexus-panel-title-text">
              <h2 id="nexus-title" class="nexus-title">NEXUS BRAIN</h2>
              <span class="nexus-subtitle">Intelligence Interface v2.1</span>
            </div>
          </div>
          <div id="nexus-status" class="nexus-status nexus-status--loading">
            <span class="nexus-status-dot"></span>
            <span class="nexus-status-text">CONNECTING...</span>
          </div>
        </div>
        <button class="nexus-clear" aria-label="Clear history" id="nexus-clear" title="Clear chat history" style="display:none;">
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
            <path d="M3 6h18M19 6v14a2 2 0 01-2 2H7a2 2 0 01-2-2V6m3 0V4a2 2 0 012-2h4a2 2 0 012 2v2" />
          </svg>
        </button>
        <button class="nexus-close" aria-label="Close panel" id="nexus-close">
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
            <path d="M18 6L6 18M6 6l12 12" />
          </svg>
        </button>
      </div>

      <div class="nexus-panel-messages" id="nexus-messages">
        <div class="nexus-welcome">
          <div class="nexus-welcome-icon">
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5">
              <path d="M12 2L2 7l10 5 10-5-10-5z" />
              <path d="M2 17l10 5 10-5" />
              <path d="M2 12l10 5 10-5" />
            </svg>
          </div>
          <h3 class="nexus-welcome-title">Neural Link Active</h3>
          <p class="nexus-welcome-text">Ask me anything about Barrios A2I services, architecture, or deployment options.</p>
          <div class="nexus-quick-actions">
            <button class="nexus-quick-btn" data-query="What services does Barrios A2I offer?">Services</button>
            <button class="nexus-quick-btn" data-query="Explain the pricing tiers">Pricing</button>
            <button class="nexus-quick-btn" data-query="How does the RAG system work?">RAG System</button>
          </div>
        </div>
      </div>

      <div class="nexus-panel-input-container">
        <div class="nexus-input-wrapper">
          <input
            type="text"
            id="nexus-input"
            class="nexus-input"
            placeholder="Ask Nexus..."
            autocomplete="off"
            aria-label="Message input"
          />
          <button id="nexus-send" class="nexus-send" aria-label="Send message" disabled>
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
              <path d="M22 2L11 13" />
              <path d="M22 2L15 22l-4-9-9-4 20-7z" />
            </svg>
          </button>
        </div>
        <div class="nexus-input-hint">
          <span class="nexus-hint-key">Ctrl+K</span> to toggle &middot; <span class="nexus-hint-key">Esc</span> to close
        </div>
      </div>
    `;

    document.body.appendChild(backdropElement);
    document.body.appendChild(panelElement);

    // Event listeners
    panelElement.querySelector('#nexus-close').addEventListener('click', close);

    // P0-E: Clear history button
    panelElement.querySelector('#nexus-clear').addEventListener('click', clearChatHistory);

    const input = panelElement.querySelector('#nexus-input');
    const sendBtn = panelElement.querySelector('#nexus-send');

    input.addEventListener('input', () => {
      sendBtn.disabled = !input.value.trim();
    });

    input.addEventListener('keydown', (e) => {
      if (e.key === 'Enter' && input.value.trim()) {
        e.preventDefault();
        sendMessage(input.value.trim());
      }
    });

    sendBtn.addEventListener('click', () => {
      if (input.value.trim()) {
        sendMessage(input.value.trim());
      }
    });

    // Quick action buttons
    panelElement.querySelectorAll('.nexus-quick-btn').forEach(btn => {
      btn.addEventListener('click', () => {
        const query = btn.getAttribute('data-query');
        if (query) sendMessage(query);
      });
    });

    // Focus trap
    panelElement.addEventListener('keydown', handleFocusTrap);

    // Start health polling
    pollHealth();
    setInterval(pollHealth, 30000);
  }

  // Focus trap handler
  function handleFocusTrap(e) {
    if (e.key !== 'Tab') return;

    const focusables = panelElement.querySelectorAll(
      'button:not([disabled]), input:not([disabled]), [tabindex]:not([tabindex="-1"])'
    );
    const first = focusables[0];
    const last = focusables[focusables.length - 1];

    if (e.shiftKey && document.activeElement === first) {
      e.preventDefault();
      last.focus();
    } else if (!e.shiftKey && document.activeElement === last) {
      e.preventDefault();
      first.focus();
    }
  }

  // Send message
  function sendMessage(message) {
    const input = panelElement.querySelector('#nexus-input');
    const messagesContainer = panelElement.querySelector('#nexus-messages');

    // Set status to connecting
    updateStatus('connecting');

    // Hide welcome if visible
    const welcome = messagesContainer.querySelector('.nexus-welcome');
    if (welcome) welcome.style.display = 'none';

    // Add user message
    const userMsg = document.createElement('div');
    userMsg.className = 'nexus-message nexus-message--user';
    userMsg.innerHTML = `
      <div class="nexus-message-content">${escapeHtml(message)}</div>
    `;
    messagesContainer.appendChild(userMsg);

    // P0-E: Store user message and show clear button
    window.NexusChat?.addMessageToStore('user', message);
    updateClearButton();

    // Clear input
    input.value = '';
    input.disabled = true;
    panelElement.querySelector('#nexus-send').disabled = true;

    // Add assistant message placeholder (Sales-Safe - no trace_id, no citations)
    const assistantMsg = document.createElement('div');
    assistantMsg.className = 'nexus-message nexus-message--assistant';
    assistantMsg.innerHTML = `
      <div class="nexus-message-header">
        <span class="nexus-message-label">NEXUS</span>
      </div>
      <div class="nexus-message-content nexus-message--streaming">
        <span class="nexus-typing-indicator">
          <span></span><span></span><span></span>
        </span>
      </div>
    `;
    messagesContainer.appendChild(assistantMsg);
    messagesContainer.scrollTop = messagesContainer.scrollHeight;

    // Start streaming
    window.NexusChat?.stream(message, assistantMsg);
  }

  // Poll health status
  async function pollHealth() {
    const statusEl = document.getElementById('nexus-status');
    if (!statusEl) return;

    try {
      const response = await fetch(`${NEXUS_API_BASE}/health`);
      const data = await response.json();

      statusEl.className = 'nexus-status';
      if (data.status === 'DEGRADED') {
        statusEl.classList.add('nexus-status--degraded');
        statusEl.querySelector('.nexus-status-text').textContent = 'DEGRADED';
      } else if (data.status === 'ONLINE' || response.ok) {
        statusEl.classList.add('nexus-status--online');
        statusEl.querySelector('.nexus-status-text').textContent = 'ONLINE';
      } else {
        statusEl.classList.add('nexus-status--offline');
        statusEl.querySelector('.nexus-status-text').textContent = 'OFFLINE';
      }
    } catch (error) {
      statusEl.className = 'nexus-status nexus-status--offline';
      statusEl.querySelector('.nexus-status-text').textContent = 'OFFLINE';
    }
  }

  // Update status display (Sales-Safe states)
  function updateStatus(status) {
    const statusEl = document.getElementById('nexus-status');
    if (!statusEl) return;

    statusEl.className = 'nexus-status';
    const textEl = statusEl.querySelector('.nexus-status-text');

    switch (status) {
      case 'online':
        statusEl.classList.add('nexus-status--online');
        textEl.textContent = 'ONLINE';
        break;
      case 'thinking':
        statusEl.classList.add('nexus-status--loading');
        textEl.textContent = 'THINKING...';
        break;
      case 'working':
        statusEl.classList.add('nexus-status--loading');
        textEl.textContent = 'WORKING...';
        break;
      case 'connecting':
        statusEl.classList.add('nexus-status--loading');
        textEl.textContent = 'CONNECTING...';
        break;
      default:
        statusEl.classList.add('nexus-status--online');
        textEl.textContent = 'ONLINE';
    }
  }

  // Open panel
  function open() {
    if (isOpen) return;
    createPanel();

    previousActiveElement = document.activeElement;
    isOpen = true;

    backdropElement.classList.add('nexus-backdrop--visible');
    panelElement.classList.add('nexus-panel--open');
    panelElement.setAttribute('aria-hidden', 'false');
    document.body.style.overflow = 'hidden';

    window.NexusLauncher?.setExpanded(true);

    // P0-E: Restore messages from previous session
    restoreMessages();
    updateClearButton();

    // Focus input after animation
    setTimeout(() => {
      panelElement.querySelector('#nexus-input').focus();
    }, 300);
  }

  // Close panel
  function close() {
    if (!isOpen) return;
    isOpen = false;

    backdropElement.classList.remove('nexus-backdrop--visible');
    panelElement.classList.remove('nexus-panel--open');
    panelElement.setAttribute('aria-hidden', 'true');
    document.body.style.overflow = '';

    window.NexusLauncher?.setExpanded(false);

    // Return focus
    if (previousActiveElement) {
      previousActiveElement.focus();
    } else {
      window.NexusLauncher?.focus();
    }
  }

  // Toggle panel
  function toggle() {
    if (isOpen) {
      close();
    } else {
      open();
    }
  }

  // Escape HTML
  function escapeHtml(text) {
    const div = document.createElement('div');
    div.textContent = text;
    return div.innerHTML;
  }

  // P0-E: Restore messages from localStorage
  function restoreMessages() {
    if (hasRestoredMessages) return;
    hasRestoredMessages = true;

    const messages = window.NexusChat?.getStoredMessages() || [];
    if (messages.length === 0) return;

    const messagesContainer = panelElement?.querySelector('#nexus-messages');
    if (!messagesContainer) return;

    // Hide welcome message
    const welcome = messagesContainer.querySelector('.nexus-welcome');
    if (welcome) welcome.style.display = 'none';

    // Render stored messages
    messages.forEach(msg => {
      const msgEl = document.createElement('div');
      if (msg.role === 'user') {
        msgEl.className = 'nexus-message nexus-message--user';
        msgEl.innerHTML = `<div class="nexus-message-content">${escapeHtml(msg.content)}</div>`;
      } else {
        msgEl.className = 'nexus-message nexus-message--assistant';
        msgEl.innerHTML = `
          <div class="nexus-message-header">
            <span class="nexus-message-label">NEXUS</span>
          </div>
          <div class="nexus-message-content">${parseMarkdownSimple(msg.content)}</div>
        `;
      }
      messagesContainer.appendChild(msgEl);
    });

    // Scroll to bottom
    messagesContainer.scrollTop = messagesContainer.scrollHeight;

    // Show clear button
    const clearBtn = panelElement?.querySelector('#nexus-clear');
    if (clearBtn) clearBtn.style.display = 'block';
  }

  // Simple markdown parser (duplicate from nexus-chat for independence)
  function parseMarkdownSimple(text) {
    if (!text) return '';
    return text
      .replace(/\*\*(.+?)\*\*/g, '<strong>$1</strong>')
      .replace(/\*(.+?)\*/g, '<em>$1</em>')
      .replace(/`(.+?)`/g, '<code class="nexus-inline-code">$1</code>')
      .replace(/\n/g, '<br>');
  }

  // P0-E: Clear chat history
  function clearChatHistory() {
    // Clear storage
    window.NexusChat?.clearHistory();

    // Reset UI
    const messagesContainer = panelElement?.querySelector('#nexus-messages');
    if (messagesContainer) {
      // Remove all messages
      messagesContainer.querySelectorAll('.nexus-message').forEach(m => m.remove());

      // Show welcome
      const welcome = messagesContainer.querySelector('.nexus-welcome');
      if (welcome) welcome.style.display = '';
    }

    // Hide clear button
    const clearBtn = panelElement?.querySelector('#nexus-clear');
    if (clearBtn) clearBtn.style.display = 'none';

    hasRestoredMessages = false;
  }

  // P0-E: Update clear button visibility
  function updateClearButton() {
    const messages = window.NexusChat?.getStoredMessages() || [];
    const clearBtn = panelElement?.querySelector('#nexus-clear');
    if (clearBtn) {
      clearBtn.style.display = messages.length > 0 ? 'block' : 'none';
    }
  }

  // Public API
  window.NexusPanel = {
    open,
    close,
    toggle,
    isOpen: () => isOpen,
    updateStatus,
    enableInput: function() {
      if (panelElement) {
        const input = panelElement.querySelector('#nexus-input');
        input.disabled = false;
        input.focus();
        // Reset status to online after response
        updateStatus('online');
      }
    }
  };

  // Initialize on DOM ready
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', createPanel);
  } else {
    createPanel();
  }
})();
