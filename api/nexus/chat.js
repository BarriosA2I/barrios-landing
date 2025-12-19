/**
 * Nexus Chat Streaming Endpoint
 * Handles chat requests with SSE streaming responses
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

  // Helper to send SSE events
  const sendEvent = (data) => {
    res.write(`data: ${JSON.stringify(data)}\n\n`);
  };

  try {
    // Step 1: Semantic cache check
    console.log(`[${trace_id}] Semantic cache check for: "${message.substring(0, 50)}..."`);
    sendEvent({
      type: 'status',
      step: 'cache_check',
      message: 'Checking semantic cache...',
      trace_id
    });
    await delay(200);

    // Step 2: RAG retrieval
    console.log(`[${trace_id}] RAG retrieval initiated`);
    sendEvent({
      type: 'status',
      step: 'rag_retrieval',
      message: 'Retrieving relevant context...',
      trace_id
    });
    await delay(400);

    // Mock sources based on message content
    const sources = generateMockSources(message, current_page);

    sendEvent({
      type: 'sources',
      sources,
      trace_id
    });
    await delay(200);

    // Step 3: Generate response (streaming chunks)
    console.log(`[${trace_id}] Generating response...`);
    sendEvent({
      type: 'status',
      step: 'generation',
      message: 'Generating response...',
      trace_id
    });

    const response = generateMockResponse(message);
    const words = response.split(' ');
    let accumulated = '';

    // Stream word by word with realistic timing
    for (let i = 0; i < words.length; i++) {
      accumulated += (i === 0 ? '' : ' ') + words[i];
      sendEvent({
        type: 'chunk',
        content: words[i] + (i < words.length - 1 ? ' ' : ''),
        accumulated,
        trace_id
      });
      await delay(30 + Math.random() * 50);
    }

    // Final event with complete response
    const confidence = 0.85 + Math.random() * 0.12;
    sendEvent({
      type: 'complete',
      content: response,
      sources,
      confidence: Math.round(confidence * 100) / 100,
      trace_id,
      tokens_used: Math.floor(response.length / 4),
      latency_ms: Date.now() % 1000 + 500
    });

    console.log(`[${trace_id}] Response complete. Confidence: ${(confidence * 100).toFixed(1)}%`);

  } catch (error) {
    console.error(`[${trace_id}] Error:`, error);
    sendEvent({
      type: 'error',
      message: 'An error occurred processing your request.',
      trace_id,
      degraded: true
    });
  }

  res.end();
}

function delay(ms) {
  return new Promise(resolve => setTimeout(resolve, ms));
}

function generateMockSources(message, currentPage) {
  const messageLower = message.toLowerCase();

  // Contextual mock sources based on query content
  const sourcePool = [
    {
      title: 'Barrios A2I Service Architecture',
      url: '/docs/architecture',
      relevance: 0.94,
      excerpt: 'The A2I platform leverages a multi-agent orchestration system with semantic caching and intelligent routing...',
      type: 'internal'
    },
    {
      title: 'RAG Implementation Patterns',
      url: '/docs/rag-patterns',
      relevance: 0.89,
      excerpt: 'Enterprise RAG systems require careful attention to retrieval quality, chunking strategies, and reranking...',
      type: 'internal'
    },
    {
      title: 'Deployment Protocols Overview',
      url: '/#pricing',
      relevance: 0.85,
      excerpt: 'Three deployment tiers: SCOUT for validation, COMMAND for full deployment, SOVEREIGN for enterprise scale...',
      type: 'internal'
    },
    {
      title: 'AI Agent Orchestration Best Practices',
      url: 'https://docs.anthropic.com/agents',
      relevance: 0.82,
      excerpt: 'Multi-agent systems benefit from clear role separation, shared memory, and hierarchical planning...',
      type: 'external'
    },
    {
      title: 'Semantic Caching for LLM Applications',
      url: '/docs/caching',
      relevance: 0.78,
      excerpt: 'Semantic caching reduces latency and costs by identifying semantically similar queries...',
      type: 'internal'
    }
  ];

  // Select 2-3 relevant sources
  const numSources = 2 + Math.floor(Math.random() * 2);
  return sourcePool
    .sort(() => Math.random() - 0.5)
    .slice(0, numSources)
    .map(s => ({
      ...s,
      relevance: Math.round((s.relevance - Math.random() * 0.1) * 100) / 100
    }))
    .sort((a, b) => b.relevance - a.relevance);
}

function generateMockResponse(message) {
  const messageLower = message.toLowerCase();

  // Contextual responses based on common queries
  if (messageLower.includes('pricing') || messageLower.includes('cost') || messageLower.includes('price')) {
    return "Barrios A2I offers three deployment protocols tailored to your needs. **SCOUT** ($2,500/month) provides a single-agent system for initial validation. **COMMAND** ($8,500/month) delivers a full multi-agent deployment with RAG integration. **SOVEREIGN** (custom pricing) offers enterprise-scale infrastructure with dedicated support. Each tier includes semantic caching, circuit breakers, and full observability. Would you like me to explain what's included in each tier?";
  }

  if (messageLower.includes('rag') || messageLower.includes('retrieval')) {
    return "Our RAG implementation uses a hybrid retrieval approach combining dense embeddings (via OpenAI ada-002) with sparse BM25 scoring. Documents are chunked using semantic boundaries with 512-token windows and 50-token overlap. We employ a two-stage reranking pipeline: first with a cross-encoder model, then with LLM-based relevance scoring. The system maintains a semantic cache that can reduce latency by 80% for similar queries.";
  }

  if (messageLower.includes('agent') || messageLower.includes('orchestr')) {
    return "The A2I platform uses a hierarchical multi-agent architecture. The **Orchestrator** manages task decomposition and agent coordination. Specialized agents handle specific domains: Research, Analysis, Synthesis, and Execution. Each agent has its own context window and can invoke tools via MCP (Model Context Protocol). Communication happens through a shared memory layer backed by Redis, with PostgreSQL for persistence.";
  }

  if (messageLower.includes('hello') || messageLower.includes('hi ') || message.toLowerCase() === 'hi') {
    return "Hello! I'm Nexus, the intelligence layer for Barrios A2I. I can help you understand our AI infrastructure, deployment options, and technical architecture. What would you like to know about?";
  }

  if (messageLower.includes('who') && (messageLower.includes('you') || messageLower.includes('nexus'))) {
    return "I'm **Nexus**, the conversational AI interface for Barrios A2I. I'm powered by a RAG-enhanced language model with access to our technical documentation, architecture specs, and service offerings. I can answer questions about our AI deployment protocols, pricing tiers, and technical implementation details. Think of me as your guide to understanding the A2I intelligence architecture.";
  }

  // Default response
  return "Based on the Barrios A2I documentation, I can help you with information about our AI infrastructure services. We specialize in enterprise-grade RAG systems, multi-agent orchestration, and intelligent automation. Our deployment protocols range from single-agent validation systems to full sovereign infrastructure. What specific aspect would you like to explore?";
}
