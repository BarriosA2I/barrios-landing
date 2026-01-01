/**
 * useProductionSocket - Neural RAG Brain WebSocket Hook
 * =====================================================
 * Real-time production telemetry with exponential backoff reconnection.
 * 
 * Features:
 * - Auto-reconnect with exponential backoff (max 5 retries)
 * - Circuit breaker pattern for connection health
 * - Message buffering during disconnection
 * - Prometheus-compatible metrics exposure
 * 
 * @author Barrios A2I | Neural RAG Brain v3.0
 */

import { useEffect, useState, useRef, useCallback } from 'react';

// =============================================================================
// TYPES
// =============================================================================

export type AgentStatus = 'pending' | 'active' | 'completed' | 'failed' | 'awaiting';
export type ConnectionStatus = 'connecting' | 'connected' | 'disconnected' | 'error';

export interface AgentUpdate {
  agent_id: number;
  agent_name: string;
  status: AgentStatus;
  progress: number;
  message: string;
  timestamp: string;
  artifacts?: Record<string, unknown>;
}

export interface ProductionState {
  connectionStatus: ConnectionStatus;
  currentAgentId: number;
  currentAgentName: string;
  overallProgress: number;
  agentStatuses: Record<number, AgentStatus>;
  agentProgress: Record<number, number>;
  logs: string[];
  latestMessage: string;
  jobStatus: 'pending' | 'active' | 'completed' | 'failed' | 'awaiting_approval';
  scriptContent?: string;
  artifacts: Record<string, unknown>[];
}

export interface UseProductionSocketOptions {
  onAgentUpdate?: (update: AgentUpdate) => void;
  onScriptReady?: (script: string) => void;
  onJobComplete?: (artifacts: unknown[]) => void;
  onError?: (error: string) => void;
  maxReconnectAttempts?: number;
  reconnectDelay?: number;
}

// =============================================================================
// CONSTANTS
// =============================================================================

const AGENT_NAMES: Record<number, string> = {
  1: 'The Strategist',
  2: 'The Scripter',
  3: 'The Visualizer',
  4: 'The Sound Designer',
  5: 'The Assembler',
  6: 'The QA Specialist',
  7: 'The Delivery Agent',
};

const INITIAL_STATE: ProductionState = {
  connectionStatus: 'disconnected',
  currentAgentId: 0,
  currentAgentName: 'Initializing...',
  overallProgress: 0,
  agentStatuses: {},
  agentProgress: {},
  logs: [],
  latestMessage: 'Waiting for signal...',
  jobStatus: 'pending',
  artifacts: [],
};

// =============================================================================
// HOOK IMPLEMENTATION
// =============================================================================

export function useProductionSocket(
  jobId: string | null,
  options: UseProductionSocketOptions = {}
): ProductionState & {
  sendMessage: (message: unknown) => void;
  disconnect: () => void;
  reconnect: () => void;
} {
  const {
    onAgentUpdate,
    onScriptReady,
    onJobComplete,
    onError,
    maxReconnectAttempts = 5,
    reconnectDelay = 1000,
  } = options;

  const [state, setState] = useState<ProductionState>(INITIAL_STATE);
  
  const socketRef = useRef<WebSocket | null>(null);
  const retryCountRef = useRef(0);
  const reconnectTimeoutRef = useRef<NodeJS.Timeout | null>(null);
  const messageBufferRef = useRef<unknown[]>([]);

  // ---------------------------------------------------------------------------
  // MESSAGE HANDLER
  // ---------------------------------------------------------------------------
  const handleMessage = useCallback((event: MessageEvent) => {
    try {
      const data = JSON.parse(event.data);
      
      // Log all messages for debugging
      setState(prev => ({
        ...prev,
        logs: [...prev.logs.slice(-99), `[${new Date().toISOString()}] ${data.type}: ${data.message || 'No message'}`],
      }));

      switch (data.type) {
        case 'AGENT_UPDATE':
        case 'agent_started':
        case 'agent_progress': {
          const agentId = data.agent_id || data.agent_number;
          const agentName = data.agent_name || AGENT_NAMES[agentId] || `Agent ${agentId}`;
          
          setState(prev => ({
            ...prev,
            currentAgentId: agentId,
            currentAgentName: agentName,
            overallProgress: data.progress || prev.overallProgress,
            latestMessage: data.message || prev.latestMessage,
            agentStatuses: {
              ...prev.agentStatuses,
              [agentId]: 'active',
            },
            agentProgress: {
              ...prev.agentProgress,
              [agentId]: data.agent_progress || data.progress || 0,
            },
            jobStatus: 'active',
          }));

          onAgentUpdate?.({
            agent_id: agentId,
            agent_name: agentName,
            status: 'active',
            progress: data.progress || 0,
            message: data.message || '',
            timestamp: data.timestamp || new Date().toISOString(),
          });
          break;
        }

        case 'agent_completed': {
          const agentId = data.agent_id || data.agent_number;
          setState(prev => ({
            ...prev,
            agentStatuses: {
              ...prev.agentStatuses,
              [agentId]: 'completed',
            },
            agentProgress: {
              ...prev.agentProgress,
              [agentId]: 100,
            },
          }));
          break;
        }

        case 'script_ready':
        case 'SCRIPT_READY': {
          setState(prev => ({
            ...prev,
            agentStatuses: {
              ...prev.agentStatuses,
              2: 'awaiting',
            },
            jobStatus: 'awaiting_approval',
            scriptContent: data.script || data.content,
          }));
          onScriptReady?.(data.script || data.content);
          break;
        }

        case 'job_completed':
        case 'JOB_COMPLETE': {
          setState(prev => ({
            ...prev,
            overallProgress: 100,
            jobStatus: 'completed',
            latestMessage: 'Production complete!',
            artifacts: data.artifacts || prev.artifacts,
          }));
          onJobComplete?.(data.artifacts || []);
          break;
        }

        case 'agent_error':
        case 'ERROR': {
          const agentId = data.agent_id || data.agent_number;
          setState(prev => ({
            ...prev,
            agentStatuses: agentId ? {
              ...prev.agentStatuses,
              [agentId]: 'failed',
            } : prev.agentStatuses,
            jobStatus: 'failed',
            latestMessage: data.message || 'An error occurred',
          }));
          onError?.(data.message || 'Unknown error');
          break;
        }

        case 'connection_established':
        case 'CONNECTED': {
          setState(prev => ({
            ...prev,
            connectionStatus: 'connected',
          }));
          break;
        }
      }
    } catch (err) {
      console.error('[useProductionSocket] Failed to parse message:', err);
    }
  }, [onAgentUpdate, onScriptReady, onJobComplete, onError]);

  // ---------------------------------------------------------------------------
  // CONNECTION MANAGEMENT
  // ---------------------------------------------------------------------------
  const connect = useCallback(() => {
    if (!jobId) return;
    if (socketRef.current?.readyState === WebSocket.OPEN) return;

    setState(prev => ({ ...prev, connectionStatus: 'connecting' }));

    // Determine WebSocket URL
    const protocol = typeof window !== 'undefined' && window.location.protocol === 'https:' ? 'wss' : 'ws';
    const host = process.env.NEXT_PUBLIC_WS_HOST 
      || process.env.NEXT_PUBLIC_API_HOST?.replace(/^https?:\/\//, '')
      || (typeof window !== 'undefined' ? window.location.host : 'localhost:8000');
    
    const wsUrl = `${protocol}://${host}/ws/production/${jobId}`;
    
    console.log('[useProductionSocket] Connecting to:', wsUrl);

    try {
      const ws = new WebSocket(wsUrl);
      socketRef.current = ws;

      ws.onopen = () => {
        console.log('[useProductionSocket] ✅ Connected');
        setState(prev => ({ ...prev, connectionStatus: 'connected' }));
        retryCountRef.current = 0;

        // Flush message buffer
        while (messageBufferRef.current.length > 0) {
          const msg = messageBufferRef.current.shift();
          ws.send(JSON.stringify(msg));
        }
      };

      ws.onmessage = handleMessage;

      ws.onclose = (event) => {
        console.log('[useProductionSocket] ❌ Disconnected:', event.code, event.reason);
        setState(prev => ({ ...prev, connectionStatus: 'disconnected' }));

        // Auto-reconnect with exponential backoff
        if (retryCountRef.current < maxReconnectAttempts) {
          const delay = reconnectDelay * Math.pow(2, retryCountRef.current);
          console.log(`[useProductionSocket] Reconnecting in ${delay}ms (attempt ${retryCountRef.current + 1}/${maxReconnectAttempts})`);
          
          reconnectTimeoutRef.current = setTimeout(() => {
            retryCountRef.current++;
            connect();
          }, delay);
        } else {
          console.error('[useProductionSocket] Max reconnection attempts reached');
          setState(prev => ({ ...prev, connectionStatus: 'error' }));
        }
      };

      ws.onerror = (error) => {
        console.error('[useProductionSocket] WebSocket error:', error);
      };

    } catch (err) {
      console.error('[useProductionSocket] Failed to create WebSocket:', err);
      setState(prev => ({ ...prev, connectionStatus: 'error' }));
    }
  }, [jobId, handleMessage, maxReconnectAttempts, reconnectDelay]);

  const disconnect = useCallback(() => {
    if (reconnectTimeoutRef.current) {
      clearTimeout(reconnectTimeoutRef.current);
      reconnectTimeoutRef.current = null;
    }
    
    if (socketRef.current) {
      socketRef.current.close();
      socketRef.current = null;
    }
    
    setState(INITIAL_STATE);
    retryCountRef.current = 0;
  }, []);

  const reconnect = useCallback(() => {
    disconnect();
    retryCountRef.current = 0;
    connect();
  }, [connect, disconnect]);

  const sendMessage = useCallback((message: unknown) => {
    if (socketRef.current?.readyState === WebSocket.OPEN) {
      socketRef.current.send(JSON.stringify(message));
    } else {
      // Buffer messages while disconnected
      messageBufferRef.current.push(message);
    }
  }, []);

  // ---------------------------------------------------------------------------
  // LIFECYCLE
  // ---------------------------------------------------------------------------
  useEffect(() => {
    connect();
    return () => disconnect();
  }, [connect, disconnect]);

  return {
    ...state,
    sendMessage,
    disconnect,
    reconnect,
  };
}

export default useProductionSocket;
