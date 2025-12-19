/**
 * Nexus Chat - Streaming SSE Chat Logic
 * Handles message streaming and citation rendering
 */
(function() {
  'use strict';

  // API Base URL - Nexus Assistant Unified backend
  // Production: https://nexus-api-wud4.onrender.com/api/nexus
  // Override: Set window.NEXUS_API_BASE before this script loads
  const NEXUS_API_BASE = window.NEXUS_API_BASE || 'https://nexus-api-wud4.onrender.com/api/nexus';

  console.log('[NEXUS] API Base:', NEXUS_API_BASE);

  let sessionId = generateSessionId();

  function generateSessionId() {
    return 'sess_' + Date.now().toString(36) + '_' + Math.random().toString(36).slice(2, 8);
  }

  // Simple markdown parser for basic formatting
  function parseMarkdown(text) {
    return text
      // Bold
      .replace(/\*\*(.+?)\*\*/g, '<strong>$1</strong>')
      // Italic
      .replace(/\*(.+?)\*/g, '<em>$1</em>')
      // Code
      .replace(/`(.+?)`/g, '<code class="nexus-inline-code">$1</code>')
      // Line breaks
      .replace(/\n/g, '<br>');
  }

  // Stream message from API
  async function stream(message, messageElement) {
    const contentEl = messageElement.querySelector('.nexus-message-content');
    const traceEl = messageElement.querySelector('#nexus-trace');
    const citationsEl = messageElement.querySelector('#nexus-citations');

    let accumulatedContent = '';
    let sources = [];
    let traceId = '';

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
        if (done) break;

        buffer += decoder.decode(value, { stream: true });
        const lines = buffer.split('\n');
        buffer = lines.pop() || '';

        for (const line of lines) {
          if (line.startsWith('data: ')) {
            try {
              const data = JSON.parse(line.slice(6));
              handleStreamEvent(data, contentEl, traceEl, citationsEl, {
                setContent: (content) => { accumulatedContent = content; },
                setSources: (s) => { sources = s; },
                setTraceId: (id) => { traceId = id; }
              });
            } catch (e) {
              console.warn('Failed to parse SSE event:', e);
            }
          }
        }
      }

      // Final render
      contentEl.classList.remove('nexus-message--streaming');
      contentEl.innerHTML = parseMarkdown(accumulatedContent);

      if (sources.length > 0) {
        renderCitations(sources, citationsEl, traceId);
      }

    } catch (error) {
      console.error('Nexus chat error:', error);
      contentEl.classList.remove('nexus-message--streaming');
      contentEl.innerHTML = `
        <div class="nexus-error">
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
            <circle cx="12" cy="12" r="10" />
            <path d="M12 8v4m0 4h.01" />
          </svg>
          <span>Connection error. Please try again.</span>
        </div>
      `;
    }

    // Re-enable input
    window.NexusPanel?.enableInput();
  }

  // Handle individual stream events
  function handleStreamEvent(data, contentEl, traceEl, citationsEl, state) {
    switch (data.type) {
      case 'status':
        // Show status updates
        if (data.trace_id) {
          state.setTraceId(data.trace_id);
          traceEl.textContent = data.trace_id;
        }
        break;

      case 'sources':
        state.setSources(data.sources || []);
        break;

      case 'chunk':
        contentEl.classList.remove('nexus-message--streaming');
        contentEl.innerHTML = parseMarkdown(data.accumulated || data.content);
        state.setContent(data.accumulated || data.content);
        // Auto-scroll
        const container = contentEl.closest('.nexus-panel-messages');
        if (container) container.scrollTop = container.scrollHeight;
        break;

      case 'complete':
        state.setContent(data.content);
        state.setSources(data.sources || []);
        if (data.trace_id) {
          state.setTraceId(data.trace_id);
          traceEl.textContent = `${data.trace_id} | ${Math.round(data.confidence * 100)}%`;
        }
        break;

      case 'error':
        contentEl.innerHTML = `
          <div class="nexus-error">
            <span>${data.message || 'An error occurred'}</span>
          </div>
        `;
        break;
    }
  }

  // Render citations block
  function renderCitations(sources, container, traceId) {
    if (!sources || sources.length === 0) return;

    container.style.display = 'block';
    container.innerHTML = `
      <div class="nexus-citations-header">
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5">
          <path d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
        </svg>
        <span>SOURCES</span>
        <span class="nexus-citations-count">${sources.length}</span>
      </div>
      <div class="nexus-citations-list">
        ${sources.map((source, idx) => `
          <div class="nexus-citation">
            <div class="nexus-citation-header">
              <span class="nexus-citation-index">[${idx + 1}]</span>
              <span class="nexus-citation-title">${escapeHtml(source.title)}</span>
              <span class="nexus-citation-relevance">${Math.round(source.relevance * 100)}%</span>
            </div>
            ${source.excerpt ? `<p class="nexus-citation-excerpt">${escapeHtml(source.excerpt)}</p>` : ''}
            ${source.url ? `
              <a href="${escapeHtml(source.url)}" class="nexus-citation-link" target="_blank" rel="noopener">
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                  <path d="M18 13v6a2 2 0 01-2 2H5a2 2 0 01-2-2V8a2 2 0 012-2h6M15 3h6v6M10 14L21 3" />
                </svg>
                <span>${source.type === 'external' ? source.url : 'View Source'}</span>
              </a>
            ` : ''}
          </div>
        `).join('')}
      </div>
    `;
  }

  // Escape HTML
  function escapeHtml(text) {
    const div = document.createElement('div');
    div.textContent = text;
    return div.innerHTML;
  }

  // Public API
  window.NexusChat = {
    stream,
    resetSession: function() {
      sessionId = generateSessionId();
    }
  };
})();
