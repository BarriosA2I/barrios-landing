/**
 * Nexus Brain WebSocket Client
 * Real-time event streaming from Cognitive Orchestrator
 */

const NexusStreaming = (function() {
  'use strict';

  let ws = null;
  let reconnectAttempts = 0;
  const maxReconnectAttempts = 5;
  const reconnectDelay = 3000;

  const eventHandlers = {
    'stream.token': [],
    'stream.chunk': [],
    'stream.complete': [],
    'request.completed': [],
    'request.failed': [],
    'video.progress': [],
    'alert': [],
  };

  const config = {
    wsUrl: 'wss://api.barriosa2i.com/ws/events',
    // wsUrl: 'ws://localhost:8080/ws/events', // Development
  };

  /**
   * Connect to WebSocket server
   */
  function connect(sessionId) {
    if (ws && ws.readyState === WebSocket.OPEN) {
      return;
    }

    const url = `${config.wsUrl}?session_id=${sessionId}`;
    ws = new WebSocket(url);

    ws.onopen = () => {
      console.log('[NexusStreaming] Connected');
      reconnectAttempts = 0;
      updateStatus('online');
    };

    ws.onmessage = (event) => {
      try {
        const data = JSON.parse(event.data);
        handleEvent(data);
      } catch (e) {
        console.error('[NexusStreaming] Parse error:', e);
      }
    };

    ws.onclose = () => {
      console.log('[NexusStreaming] Disconnected');
      updateStatus('offline');
      attemptReconnect(sessionId);
    };

    ws.onerror = (error) => {
      console.error('[NexusStreaming] Error:', error);
      updateStatus('degraded');
    };
  }

  /**
   * Attempt to reconnect
   */
  function attemptReconnect(sessionId) {
    if (reconnectAttempts >= maxReconnectAttempts) {
      console.error('[NexusStreaming] Max reconnect attempts reached');
      return;
    }

    reconnectAttempts++;
    const delay = reconnectDelay * Math.pow(2, reconnectAttempts - 1);

    console.log(`[NexusStreaming] Reconnecting in ${delay}ms (attempt ${reconnectAttempts})`);

    setTimeout(() => {
      connect(sessionId);
    }, delay);
  }

  /**
   * Handle incoming event
   */
  function handleEvent(data) {
    const eventType = data.event_type || data.type;

    // Handle heartbeat
    if (eventType === 'heartbeat') {
      ws.send(JSON.stringify({ type: 'pong' }));
      return;
    }

    // Handle connected confirmation
    if (eventType === 'connected') {
      console.log('[NexusStreaming] Session confirmed:', data.client_id);
      return;
    }

    // Dispatch to handlers
    const handlers = eventHandlers[eventType] || [];
    handlers.forEach(handler => {
      try {
        handler(data);
      } catch (e) {
        console.error('[NexusStreaming] Handler error:', e);
      }
    });
  }

  /**
   * Update UI status indicator
   */
  function updateStatus(status) {
    const indicator = document.querySelector('.nexus-status-indicator');
    if (indicator) {
      indicator.className = `nexus-status-indicator nexus-status-${status}`;
      indicator.title = status.charAt(0).toUpperCase() + status.slice(1);
    }
  }

  /**
   * Subscribe to event type
   */
  function on(eventType, handler) {
    if (!eventHandlers[eventType]) {
      eventHandlers[eventType] = [];
    }
    eventHandlers[eventType].push(handler);

    return () => {
      const index = eventHandlers[eventType].indexOf(handler);
      if (index > -1) {
        eventHandlers[eventType].splice(index, 1);
      }
    };
  }

  /**
   * Send message to server
   */
  function send(data) {
    if (ws && ws.readyState === WebSocket.OPEN) {
      ws.send(JSON.stringify(data));
    }
  }

  /**
   * Disconnect from server
   */
  function disconnect() {
    if (ws) {
      ws.close();
      ws = null;
    }
  }

  // Public API
  return {
    connect,
    disconnect,
    on,
    send,
    isConnected: () => ws && ws.readyState === WebSocket.OPEN,
    setWsUrl: (url) => { config.wsUrl = url; },
  };
})();

// Export for modules
if (typeof module !== 'undefined' && module.exports) {
  module.exports = NexusStreaming;
}
