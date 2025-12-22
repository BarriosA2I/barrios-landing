/**
 * Nexus Chat - Sales-Safe SSE Streaming
 * Event types: meta, delta, final, error
 * NO technical exposure: no confidence, no trace_id, no sources
 * P0-E: Session persistence via localStorage
 */
(function() {
  'use strict';

  const NEXUS_API_BASE = window.NEXUS_API_BASE || 'https://nexus-api-wud4.onrender.com/api/nexus';
  const STORAGE_KEYS = {
    SESSION_ID: 'nexus_session_id',
    MESSAGES: 'nexus_chat_messages',
    LAST_ACTIVITY: 'nexus_last_activity'
  };
  const SESSION_EXPIRY_MS = 24 * 60 * 60 * 1000; // 24 hours

  console.log('[NEXUS] Ready');

  // P0-E: Get or create persistent session ID
  let sessionId = getOrCreateSessionId();

  function generateSessionId() {
    return 'sess_' + Date.now().toString(36) + '_' + Math.random().toString(36).slice(2, 8);
  }

  function getOrCreateSessionId() {
    try {
      const lastActivity = localStorage.getItem(STORAGE_KEYS.LAST_ACTIVITY);
      if (lastActivity) {
        const elapsed = Date.now() - parseInt(lastActivity, 10);
        if (elapsed > SESSION_EXPIRY_MS) {
          // Session expired - clear all
          clearStoredSession();
          return createAndStoreSession();
        }
      }

      const stored = localStorage.getItem(STORAGE_KEYS.SESSION_ID);
      if (stored) {
        localStorage.setItem(STORAGE_KEYS.LAST_ACTIVITY, Date.now().toString());
        return stored;
      }

      return createAndStoreSession();
    } catch (e) {
      return generateSessionId();
    }
  }

  function createAndStoreSession() {
    const newId = generateSessionId();
    try {
      localStorage.setItem(STORAGE_KEYS.SESSION_ID, newId);
      localStorage.setItem(STORAGE_KEYS.LAST_ACTIVITY, Date.now().toString());
    } catch (e) {}
    return newId;
  }

  function clearStoredSession() {
    try {
      localStorage.removeItem(STORAGE_KEYS.SESSION_ID);
      localStorage.removeItem(STORAGE_KEYS.MESSAGES);
      localStorage.removeItem(STORAGE_KEYS.LAST_ACTIVITY);
    } catch (e) {}
  }

  // P0-E: Message persistence
  function getStoredMessages() {
    try {
      const stored = localStorage.getItem(STORAGE_KEYS.MESSAGES);
      return stored ? JSON.parse(stored) : [];
    } catch (e) {
      return [];
    }
  }

  function storeMessages(messages) {
    try {
      // Keep last 50 messages
      const toStore = messages.slice(-50);
      localStorage.setItem(STORAGE_KEYS.MESSAGES, JSON.stringify(toStore));
      localStorage.setItem(STORAGE_KEYS.LAST_ACTIVITY, Date.now().toString());
    } catch (e) {}
  }

  function addMessageToStore(role, content) {
    const messages = getStoredMessages();
    messages.push({ role, content, timestamp: Date.now() });
    storeMessages(messages);
  }

  // Simple markdown parser
  function parseMarkdown(text) {
    if (!text) return '';
    return text
      .replace(/\*\*(.+?)\*\*/g, '<strong>$1</strong>')
      .replace(/\*(.+?)\*/g, '<em>$1</em>')
      .replace(/`(.+?)`/g, '<code class="nexus-inline-code">$1</code>')
      .replace(/\n/g, '<br>');
  }

  // Cleanup - ALWAYS re-enable input
  function cleanup() {
    window.NexusPanel?.enableInput();
  }

  // Stream message from API
  async function stream(message, messageElement) {
    const contentEl = messageElement.querySelector('.nexus-message-content');
    let accumulatedContent = '';

    try {
      const response = await fetch(`${NEXUS_API_BASE}/chat`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          session_id: sessionId,
          message: message,
          stream: true
        })
      });

      if (!response.ok) {
        throw new Error(`HTTP ${response.status}`);
      }

      const reader = response.body.getReader();
      const decoder = new TextDecoder();
      let buffer = '';

      while (true) {
        const { done, value } = await reader.read();
        if (done) {
          cleanup();
          break;
        }

        buffer += decoder.decode(value, { stream: true });
        const lines = buffer.split('\n');
        buffer = lines.pop() || '';

        for (const line of lines) {
          if (line.startsWith('data: ')) {
            try {
              const data = JSON.parse(line.slice(6));

              switch (data.type) {
                case 'meta':
                  // Status update (thinking, working)
                  window.NexusPanel?.updateStatus(data.state || 'thinking');
                  break;

                case 'delta':
                  // Text chunk - accumulate and render
                  contentEl.classList.remove('nexus-message--streaming');
                  accumulatedContent += (data.text || '');
                  contentEl.innerHTML = parseMarkdown(accumulatedContent);
                  // Auto-scroll
                  const container = contentEl.closest('.nexus-panel-messages');
                  if (container) container.scrollTop = container.scrollHeight;
                  break;

                case 'final':
                  // Stream complete - ALWAYS cleanup
                  cleanup();
                  // P0-E: Store assistant message
                  if (accumulatedContent) {
                    addMessageToStore('assistant', accumulatedContent);
                  }
                  // Store support code for reference (internal)
                  if (data.support_code) {
                    console.log('Support:', data.support_code);
                  }
                  break;

                case 'error':
                  // Show error message
                  contentEl.innerHTML = `
                    <div class="nexus-error">
                      <span>${data.message || 'Something went wrong. Try again.'}</span>
                    </div>
                  `;
                  cleanup();
                  break;
              }
            } catch (e) {
              console.warn('Parse error:', e);
            }
          }
        }
      }

      // Final render
      contentEl.classList.remove('nexus-message--streaming');
      if (accumulatedContent) {
        contentEl.innerHTML = parseMarkdown(accumulatedContent);
        // P0-E: Fallback storage if 'final' event was missed
        addMessageToStore('assistant', accumulatedContent);
      }

    } catch (error) {
      console.error('Chat error:', error.message);
      contentEl.classList.remove('nexus-message--streaming');

      if (accumulatedContent && accumulatedContent.length > 10) {
        contentEl.innerHTML = parseMarkdown(accumulatedContent);
        // P0-E: Store partial response on error
        addMessageToStore('assistant', accumulatedContent);
      } else {
        contentEl.innerHTML = `
          <div class="nexus-error">
            <span>Connection issue. Try again in a moment.</span>
          </div>
        `;
      }
      cleanup();
    }
  }

  // Public API
  window.NexusChat = {
    stream,
    resetSession: function() {
      clearStoredSession();
      sessionId = createAndStoreSession();
    },
    // P0-E: Expose persistence functions
    getStoredMessages,
    addMessageToStore,
    clearHistory: clearStoredSession,
    getSessionId: function() { return sessionId; }
  };
})();
