/**
 * Nexus Chat Streaming Endpoint
 * Proxies to API Gateway for real RAG-powered responses
 *
 * POST /api/nexus/chat
 * Body: { session_id: string, message: string, current_page?: string }
 */
export default async function handler(req, res) {
  // Set CORS headers
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'POST, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');

  if (req.method === 'OPTIONS') {
    return res.status(200).end();
  }

  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  const { session_id, message, current_page } = req.body;

  if (!message || !session_id) {
    return res.status(400).json({ error: 'Missing required fields: session_id, message' });
  }

  // Set SSE headers
  res.setHeader('Content-Type', 'text/event-stream');
  res.setHeader('Cache-Control', 'no-cache');
  res.setHeader('Connection', 'keep-alive');
  res.setHeader('X-Accel-Buffering', 'no');

  const trace_id = `nxs_${Date.now().toString(36)}_${Math.random().toString(36).slice(2, 8)}`;

  try {
    console.log(`[${trace_id}] Proxying to API Gateway: "${message.substring(0, 50)}..."`);

    // Proxy to API Gateway which has correct founder info and full RAG
    const response = await fetch('https://barrios-api-gateway.onrender.com/api/chat/stream', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        session_id,
        message,
        current_page: current_page || 'landing'
      })
    });

    if (!response.ok) {
      console.error(`[${trace_id}] API Gateway error: ${response.status}`);
      throw new Error(`API Gateway returned ${response.status}`);
    }

    // Stream the response back
    const reader = response.body.getReader();
    const decoder = new TextDecoder();

    while (true) {
      const { done, value } = await reader.read();
      if (done) break;

      const chunk = decoder.decode(value, { stream: true });
      res.write(chunk);
    }

    console.log(`[${trace_id}] Stream complete`);

  } catch (error) {
    console.error(`[${trace_id}] Error:`, error);

    // Fallback to graceful error response
    const errorEvent = JSON.stringify({
      type: 'error',
      message: 'Connection to AI service temporarily unavailable. Please try again.',
      trace_id,
      degraded: true
    });
    res.write(`data: ${errorEvent}\n\n`);
  }

  res.end();
}
