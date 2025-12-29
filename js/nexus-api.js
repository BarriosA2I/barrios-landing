/**
 * Nexus Brain API Client
 * Communicates with Barrios A2I API Gateway
 */

const NexusAPI = (function() {
  'use strict';

  // Configuration
  const config = {
    baseUrl: 'https://api.barriosa2i.com', // Production
    // baseUrl: 'http://localhost:8080', // Development
    timeout: 30000,
    retries: 3,
  };

  // Session management
  let sessionId = localStorage.getItem('nexus_session_id');
  if (!sessionId) {
    sessionId = 'sess_' + crypto.randomUUID();
    localStorage.setItem('nexus_session_id', sessionId);
  }

  /**
   * Make API request with retry logic
   */
  async function request(endpoint, options = {}) {
    const url = `${config.baseUrl}${endpoint}`;

    const defaultOptions = {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
        'X-Session-ID': sessionId,
      },
      timeout: config.timeout,
    };

    const fetchOptions = { ...defaultOptions, ...options };

    let lastError;
    for (let attempt = 0; attempt < config.retries; attempt++) {
      try {
        const controller = new AbortController();
        const timeoutId = setTimeout(() => controller.abort(), config.timeout);

        const response = await fetch(url, {
          ...fetchOptions,
          signal: controller.signal,
        });

        clearTimeout(timeoutId);

        if (!response.ok) {
          const error = await response.json().catch(() => ({}));
          throw new Error(error.detail || `HTTP ${response.status}`);
        }

        return await response.json();

      } catch (error) {
        lastError = error;
        if (attempt < config.retries - 1) {
          await new Promise(r => setTimeout(r, Math.pow(2, attempt) * 1000));
        }
      }
    }

    throw lastError;
  }

  /**
   * Send chat message
   */
  async function chat(message, options = {}) {
    return request('/api/chat', {
      method: 'POST',
      body: JSON.stringify({
        message,
        session_id: sessionId,
        mode: options.mode || 'auto',
        stream: false,
        context: options.context,
      }),
    });
  }

  /**
   * Send chat message with streaming response
   */
  async function chatStream(message, onToken, onComplete, onError) {
    const url = `${config.baseUrl}/api/chat/stream`;

    try {
      const response = await fetch(url, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'X-Session-ID': sessionId,
        },
        body: JSON.stringify({
          message,
          session_id: sessionId,
          stream: true,
        }),
      });

      const reader = response.body.getReader();
      const decoder = new TextDecoder();
      let buffer = '';

      while (true) {
        const { done, value } = await reader.read();
        if (done) break;

        buffer += decoder.decode(value, { stream: true });
        const lines = buffer.split('\n\n');
        buffer = lines.pop() || '';

        for (const line of lines) {
          if (line.startsWith('data: ')) {
            const data = JSON.parse(line.slice(6));

            if (data.type === 'token') {
              onToken(data.content, data.index);
            } else if (data.type === 'complete') {
              onComplete(data.message_id);
            } else if (data.type === 'error') {
              onError(new Error(data.message));
            }
          }
        }
      }
    } catch (error) {
      onError(error);
    }
  }

  /**
   * Get system health
   */
  async function getHealth() {
    return request('/api/health');
  }

  /**
   * Generate video
   */
  async function generateVideo(prompt, options = {}) {
    return request('/api/video/generate', {
      method: 'POST',
      body: JSON.stringify({
        prompt,
        style: options.style || 'commercial',
        duration: options.duration || '30s',
        aspect_ratio: options.aspectRatio || '16:9',
      }),
    });
  }

  /**
   * Check video status
   */
  async function getVideoStatus(jobId) {
    return request(`/api/video/status/${jobId}`);
  }

  /**
   * Analyze competitor
   */
  async function analyzeCompetitor(options) {
    return request('/api/intel/analyze', {
      method: 'POST',
      body: JSON.stringify({
        company_name: options.companyName,
        domain: options.domain,
        depth: options.depth || 'standard',
      }),
    });
  }

  // Public API
  return {
    chat,
    chatStream,
    getHealth,
    generateVideo,
    getVideoStatus,
    analyzeCompetitor,
    getSessionId: () => sessionId,
    setBaseUrl: (url) => { config.baseUrl = url; },
  };
})();

// Export for modules
if (typeof module !== 'undefined' && module.exports) {
  module.exports = NexusAPI;
}
