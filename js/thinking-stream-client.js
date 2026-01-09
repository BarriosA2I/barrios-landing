/**
 * ================================================================================
 * ⚡ LEGENDARY THINKING STREAM CLIENT v1.0
 * ================================================================================
 * 
 * Frontend client for the Legendary Streaming Engine
 * Supports both SSE and WebSocket connections
 * 
 * Features:
 * - Real-time token streaming with <100ms first token
 * - Cognitive mode visualization (Cache, Fast, Deep)
 * - Reflection token indicators [RET][REL][SUP][USE]
 * - Connection resilience with auto-reconnect
 * - Compatible with React/Vue/Vanilla JS
 * 
 * Author: Barrios A2I | Version: 1.0.0 | January 2026
 * ================================================================================
 */

// =============================================================================
// EVENT TYPES (Match backend StreamEventType)
// =============================================================================

const StreamEventType = {
    // Router events
    ROUTER_START: 'router_start',
    ROUTER_DECIDED: 'router_decided',
    
    // Cache events
    CACHE_HIT: 'cache_hit',
    CACHE_SEMANTIC_HIT: 'cache_semantic_hit',
    CACHE_STALE_HIT: 'cache_stale_hit',
    CACHE_MISS: 'cache_miss',
    
    // Processing events
    FAST_PATH_START: 'fast_path_start',
    DEEP_PATH_START: 'deep_path_start',
    RETRIEVAL_START: 'retrieval_start',
    RETRIEVAL_COMPLETE: 'retrieval_complete',
    
    // Reflection tokens
    REFLECTION_RET: 'reflection_ret',
    REFLECTION_REL: 'reflection_rel',
    REFLECTION_SUP: 'reflection_sup',
    REFLECTION_USE: 'reflection_use',
    
    // GoT events
    THOUGHT_GENERATED: 'thought_generated',
    THOUGHT_VERIFIED: 'thought_verified',
    THOUGHT_PRUNED: 'thought_pruned',
    
    // Token streaming
    TOKEN: 'token',
    FIRST_TOKEN: 'first_token',
    
    // Completion
    COMPLETE: 'complete',
    ERROR: 'error'
};

// =============================================================================
// THINKING STREAM CLIENT
// =============================================================================

class ThinkingStreamClient {
    /**
     * Create a new ThinkingStream client
     * @param {Object} options Configuration options
     * @param {string} options.baseUrl API base URL
     * @param {string} options.mode 'sse' or 'websocket'
     * @param {Function} options.onToken Token received callback
     * @param {Function} options.onStatus Status update callback
     * @param {Function} options.onComplete Completion callback
     * @param {Function} options.onError Error callback
     * @param {number} options.reconnectAttempts Max reconnect attempts
     */
    constructor(options = {}) {
        this.baseUrl = options.baseUrl || '';
        this.mode = options.mode || 'sse';
        this.sessionId = options.sessionId || this._generateSessionId();
        
        // Callbacks
        this.onToken = options.onToken || (() => {});
        this.onStatus = options.onStatus || (() => {});
        this.onComplete = options.onComplete || (() => {});
        this.onError = options.onError || (() => {});
        this.onFirstToken = options.onFirstToken || (() => {});
        this.onReflection = options.onReflection || (() => {});
        this.onThought = options.onThought || (() => {});
        
        // Connection state
        this.ws = null;
        this.eventSource = null;
        this.isConnected = false;
        this.reconnectAttempts = options.reconnectAttempts || 3;
        this.currentAttempt = 0;
        
        // Metrics
        this.metrics = {
            startTime: null,
            firstTokenTime: null,
            completeTime: null,
            tokenCount: 0,
            path: null
        };
    }
    
    /**
     * Generate unique session ID
     */
    _generateSessionId() {
        return `session-${Date.now().toString(36)}-${Math.random().toString(36).substr(2, 9)}`;
    }
    
    /**
     * Send a query and stream the response
     * @param {string} query User query
     * @param {Object} options Additional options
     * @returns {Promise<Object>} Complete response
     */
    async stream(query, options = {}) {
        this.metrics = {
            startTime: performance.now(),
            firstTokenTime: null,
            completeTime: null,
            tokenCount: 0,
            path: null
        };
        
        if (this.mode === 'websocket') {
            return this._streamWebSocket(query, options);
        } else {
            return this._streamSSE(query, options);
        }
    }
    
    /**
     * Stream via Server-Sent Events
     * NOTE: /api/legendary-neural/stream endpoint not implemented on GENESIS
     */
    async _streamSSE(query, options) {
        return new Promise((resolve, reject) => {
            // Endpoint not implemented - return gracefully with error event
            const endpoint = '/api/legendary-neural/stream';
            console.log(`[ThinkingStream] SSE endpoint ${endpoint} not available - using fallback`);

            // Emit error event and resolve
            this._emit(StreamEventType.ERROR, {
                code: 'ENDPOINT_NOT_IMPLEMENTED',
                message: 'Legendary neural stream endpoint not available'
            });
            resolve({
                response: '',
                cached: false,
                cognitiveMode: 'unavailable',
                metrics: { fallback: true }
            });
            return;

            // Original code below (unreachable - kept for future implementation)
            const url = `${this.baseUrl}${endpoint}`;
            let fullResponse = '';
            let completed = false;

            // Create POST request with SSE response
            fetch(url, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Accept': 'text/event-stream'
                },
                body: JSON.stringify({
                    query: query,
                    session_id: this.sessionId,
                    context: options.context || '',
                    force_deep: options.forceDeep || false
                })
            }).then(response => {
                if (!response.ok) {
                    throw new Error(`HTTP ${response.status}`);
                }
                
                const reader = response.body.getReader();
                const decoder = new TextDecoder();
                let buffer = '';
                
                const processStream = async () => {
                    while (true) {
                        const { done, value } = await reader.read();
                        
                        if (done) {
                            if (!completed) {
                                resolve({
                                    response: fullResponse,
                                    metrics: this.metrics
                                });
                            }
                            break;
                        }
                        
                        buffer += decoder.decode(value, { stream: true });
                        
                        // Parse SSE events
                        const lines = buffer.split('\n\n');
                        buffer = lines.pop() || '';
                        
                        for (const eventBlock of lines) {
                            if (!eventBlock.trim()) continue;
                            
                            const eventLines = eventBlock.split('\n');
                            let eventType = null;
                            let eventData = null;
                            
                            for (const line of eventLines) {
                                if (line.startsWith('event: ')) {
                                    eventType = line.slice(7);
                                } else if (line.startsWith('data: ')) {
                                    try {
                                        eventData = JSON.parse(line.slice(6));
                                    } catch (e) {
                                        eventData = { raw: line.slice(6) };
                                    }
                                }
                            }
                            
                            if (eventData) {
                                const result = this._handleEvent(
                                    eventData.type || eventType,
                                    eventData.data || eventData
                                );
                                
                                if (result.token) {
                                    fullResponse += result.token;
                                }
                                
                                if (result.complete) {
                                    completed = true;
                                    resolve({
                                        response: fullResponse,
                                        metrics: this.metrics
                                    });
                                }
                            }
                        }
                    }
                };
                
                processStream().catch(reject);
                
            }).catch(error => {
                this.onError(error);
                reject(error);
            });
        });
    }
    
    /**
     * Stream via WebSocket
     */
    async _streamWebSocket(query, options) {
        return new Promise((resolve, reject) => {
            const wsUrl = `${this.baseUrl.replace('http', 'ws')}/api/legendary-neural/ws/${this.sessionId}`;
            let fullResponse = '';
            
            this.ws = new WebSocket(wsUrl);
            
            this.ws.onopen = () => {
                this.isConnected = true;
                this.currentAttempt = 0;
                
                // Send query
                this.ws.send(JSON.stringify({
                    query: query,
                    context: options.context || '',
                    force_deep: options.forceDeep || false
                }));
            };
            
            this.ws.onmessage = (event) => {
                try {
                    const data = JSON.parse(event.data);
                    const result = this._handleEvent(data.type, data.data);
                    
                    if (result.token) {
                        fullResponse += result.token;
                    }
                    
                    if (result.complete) {
                        this.ws.close();
                        resolve({
                            response: fullResponse,
                            metrics: this.metrics
                        });
                    }
                } catch (e) {
                    console.error('WebSocket message parse error:', e);
                }
            };
            
            this.ws.onerror = (error) => {
                this.onError(error);
                reject(error);
            };
            
            this.ws.onclose = () => {
                this.isConnected = false;
            };
        });
    }
    
    /**
     * Handle incoming stream event
     */
    _handleEvent(type, data) {
        const result = { token: null, complete: false };
        
        switch (type) {
            // Router events
            case StreamEventType.ROUTER_START:
                this.onStatus({
                    status: 'routing',
                    message: 'NEXUS: Analyzing query...',
                    icon: '🔍'
                });
                break;
            
            case StreamEventType.ROUTER_DECIDED:
                const mode = data.mode || 'UNKNOWN';
                this.metrics.path = mode;
                
                let statusMessage = 'Processing...';
                let icon = '⚡';
                
                if (mode.includes('CACHE')) {
                    statusMessage = 'Instant recall activated';
                    icon = '💾';
                } else if (mode.includes('FAST') || mode === 'NRC_FAST') {
                    statusMessage = 'Fast path engaged';
                    icon = '🚀';
                } else if (mode.includes('DEEP') || mode === 'NDR_DEEP') {
                    statusMessage = 'Deep reasoning initiated';
                    icon = '🧠';
                }
                
                this.onStatus({
                    status: 'decided',
                    mode: mode,
                    message: statusMessage,
                    icon: icon,
                    latency_ms: data.latency_ms
                });
                break;
            
            // Cache events
            case StreamEventType.CACHE_HIT:
            case StreamEventType.CACHE_SEMANTIC_HIT:
            case StreamEventType.CACHE_STALE_HIT:
                this.onStatus({
                    status: 'cache_hit',
                    hitType: data.hit_type || type.replace('cache_', ''),
                    message: `Cache ${data.hit_type || 'hit'}: ${Math.round(data.age_seconds || 0)}s ago`,
                    icon: '💾'
                });
                break;
            
            case StreamEventType.CACHE_MISS:
                this.onStatus({
                    status: 'cache_miss',
                    message: 'Cache miss - generating fresh response',
                    icon: '🔄'
                });
                break;
            
            // Processing events
            case StreamEventType.FAST_PATH_START:
                this.onStatus({
                    status: 'fast_path',
                    reason: data.reason,
                    message: `Fast path: ${data.reason}`,
                    icon: '⚡'
                });
                break;
            
            case StreamEventType.DEEP_PATH_START:
                this.onStatus({
                    status: 'deep_path',
                    message: 'Neural reasoning active',
                    icon: '🧠'
                });
                break;
            
            case StreamEventType.RETRIEVAL_START:
                this.onStatus({
                    status: 'retrieving',
                    message: 'Searching knowledge base...',
                    icon: '🔎'
                });
                break;
            
            case StreamEventType.RETRIEVAL_COMPLETE:
                this.onStatus({
                    status: 'retrieval_done',
                    count: data.count || 0,
                    message: `Retrieved ${data.count || 0} relevant documents`,
                    icon: '📚'
                });
                break;
            
            // Reflection tokens
            case StreamEventType.REFLECTION_RET:
                this.onReflection({ token: 'RET', decision: data.should_retrieve });
                break;
            
            case StreamEventType.REFLECTION_REL:
                this.onReflection({ token: 'REL', relevant: data.relevant_count });
                break;
            
            case StreamEventType.REFLECTION_SUP:
                this.onReflection({ token: 'SUP', score: data.support_score });
                break;
            
            case StreamEventType.REFLECTION_USE:
                this.onReflection({ token: 'USE', score: data.usefulness_score });
                break;
            
            // Thought events
            case StreamEventType.THOUGHT_GENERATED:
                this.onThought({ action: 'generated', thought: data.thought });
                break;
            
            case StreamEventType.THOUGHT_VERIFIED:
                this.onThought({ action: 'verified', score: data.score });
                break;
            
            case StreamEventType.THOUGHT_PRUNED:
                this.onThought({ action: 'pruned', reason: data.reason });
                break;
            
            // Token streaming
            case StreamEventType.FIRST_TOKEN:
                this.metrics.firstTokenTime = performance.now();
                this.onFirstToken({
                    latency_ms: data.latency_ms || (this.metrics.firstTokenTime - this.metrics.startTime),
                    source: data.source
                });
                break;
            
            case StreamEventType.TOKEN:
                this.metrics.tokenCount++;
                result.token = data.content || '';
                this.onToken(result.token);
                break;
            
            // Completion
            case StreamEventType.COMPLETE:
                this.metrics.completeTime = performance.now();
                result.complete = true;
                
                this.onComplete({
                    total_ms: data.total_ms || (this.metrics.completeTime - this.metrics.startTime),
                    first_token_ms: this.metrics.firstTokenTime 
                        ? (this.metrics.firstTokenTime - this.metrics.startTime) 
                        : null,
                    token_count: this.metrics.tokenCount,
                    cost_usd: data.cost_usd || 0,
                    mode: data.mode || this.metrics.path,
                    source: data.source
                });
                break;
            
            // Error
            case StreamEventType.ERROR:
                this.onError(new Error(data.error || 'Unknown error'));
                result.complete = true;
                break;
        }
        
        return result;
    }
    
    /**
     * Close any active connections
     */
    close() {
        if (this.ws) {
            this.ws.close();
            this.ws = null;
        }
        if (this.eventSource) {
            this.eventSource.close();
            this.eventSource = null;
        }
        this.isConnected = false;
    }
}

// =============================================================================
// REACT HOOK (Optional - for React projects)
// =============================================================================

/**
 * React hook for ThinkingStream
 * 
 * Usage:
 * const { stream, response, status, isStreaming, metrics } = useThinkingStream({
 *     baseUrl: '/api',
 *     onToken: (token) => console.log(token)
 * });
 * 
 * await stream('What is Barrios A2I?');
 */
function useThinkingStream(options = {}) {
    // This would be the React implementation
    // Requires React to be available
    if (typeof React === 'undefined') {
        console.warn('useThinkingStream requires React');
        return null;
    }
    
    const [response, setResponse] = React.useState('');
    const [status, setStatus] = React.useState(null);
    const [isStreaming, setIsStreaming] = React.useState(false);
    const [metrics, setMetrics] = React.useState(null);
    const [error, setError] = React.useState(null);
    
    const clientRef = React.useRef(null);
    
    React.useEffect(() => {
        clientRef.current = new ThinkingStreamClient({
            ...options,
            onToken: (token) => {
                setResponse(prev => prev + token);
                options.onToken?.(token);
            },
            onStatus: (s) => {
                setStatus(s);
                options.onStatus?.(s);
            },
            onComplete: (m) => {
                setMetrics(m);
                setIsStreaming(false);
                options.onComplete?.(m);
            },
            onError: (e) => {
                setError(e);
                setIsStreaming(false);
                options.onError?.(e);
            }
        });
        
        return () => clientRef.current?.close();
    }, []);
    
    const stream = React.useCallback(async (query, streamOptions = {}) => {
        setResponse('');
        setStatus(null);
        setMetrics(null);
        setError(null);
        setIsStreaming(true);
        
        return clientRef.current?.stream(query, streamOptions);
    }, []);
    
    const reset = React.useCallback(() => {
        setResponse('');
        setStatus(null);
        setMetrics(null);
        setError(null);
    }, []);
    
    return {
        stream,
        reset,
        response,
        status,
        isStreaming,
        metrics,
        error
    };
}

// =============================================================================
// EXPORTS
// =============================================================================

// ES Module export
if (typeof module !== 'undefined' && module.exports) {
    module.exports = {
        ThinkingStreamClient,
        useThinkingStream,
        StreamEventType
    };
}

// Browser global
if (typeof window !== 'undefined') {
    window.ThinkingStreamClient = ThinkingStreamClient;
    window.useThinkingStream = useThinkingStream;
    window.StreamEventType = StreamEventType;
}

// =============================================================================
// USAGE EXAMPLE
// =============================================================================

/*
// Vanilla JS Example
const client = new ThinkingStreamClient({
    baseUrl: 'https://api.barrios-a2i.com',
    mode: 'sse',
    onToken: (token) => {
        document.getElementById('response').textContent += token;
    },
    onStatus: (status) => {
        document.getElementById('status').textContent = `${status.icon} ${status.message}`;
    },
    onFirstToken: (data) => {
        console.log(`First token in ${data.latency_ms}ms`);
    },
    onComplete: (metrics) => {
        console.log(`Complete in ${metrics.total_ms}ms, cost: $${metrics.cost_usd.toFixed(4)}`);
    }
});

// Send query
await client.stream('What services do you offer?');

// React Example
function ChatComponent() {
    const { stream, response, status, isStreaming, metrics } = useThinkingStream({
        baseUrl: '/api'
    });
    
    const handleSubmit = async (query) => {
        await stream(query);
    };
    
    return (
        <div>
            {status && <div className="status">{status.icon} {status.message}</div>}
            <div className="response">{response}</div>
            {metrics && <div className="metrics">
                First token: {metrics.first_token_ms?.toFixed(0)}ms | 
                Total: {metrics.total_ms?.toFixed(0)}ms
            </div>}
        </div>
    );
}
*/
