/**
 * RagnarokProgress - 7-Agent Video Production Pipeline Visualization
 *
 * Design: Tesla minimalism + cyberpunk aesthetic
 * Features:
 * - 7-step progress visualization
 * - Real-time WebSocket updates
 * - Agent status with animated indicators
 * - Script approval gate highlight
 */

import React, { useState, useEffect, useCallback } from 'react';

// Agent configuration
const AGENTS = [
  { id: 1, name: 'The Strategist', icon: '⚡', description: 'Analyzing brief architecture' },
  { id: 2, name: 'The Scripter', icon: '✍️', description: 'Crafting narrative structure', isGate: true },
  { id: 3, name: 'The Visualizer', icon: '🎨', description: 'Generating visual assets' },
  { id: 4, name: 'The Sound Designer', icon: '🎵', description: 'Composing audio landscape' },
  { id: 5, name: 'The Assembler', icon: '🔧', description: 'Weaving elements together' },
  { id: 6, name: 'The QA Specialist', icon: '🔍', description: 'Quality verification' },
  { id: 7, name: 'The Delivery Agent', icon: '🚀', description: 'Final export & delivery' },
];

// Status colors
const STATUS_COLORS = {
  pending: 'bg-white/5 border-white/10',
  active: 'bg-[#00CED1]/20 border-[#00CED1]/50',
  completed: 'bg-emerald-500/20 border-emerald-500/50',
  error: 'bg-red-500/20 border-red-500/50',
  awaiting: 'bg-amber-500/20 border-amber-500/50',
};

// Agent status display
const AgentStep = ({ agent, status, isCurrent, message, onApprovalClick }) => {
  const isAwaitingApproval = agent.isGate && status === 'awaiting';

  return (
    <div
      className={`
        relative flex items-center gap-4 p-4 rounded-lg border transition-all duration-300
        ${STATUS_COLORS[status] || STATUS_COLORS.pending}
        ${isCurrent ? 'ring-2 ring-[#00CED1]/50 shadow-[0_0_30px_rgba(0,206,209,0.15)]' : ''}
      `}
    >
      {/* Agent Icon */}
      <div className={`
        w-12 h-12 rounded-lg flex items-center justify-center text-xl
        ${status === 'completed' ? 'bg-emerald-500/30' : 'bg-white/5'}
        ${isCurrent ? 'animate-pulse' : ''}
      `}>
        {status === 'completed' ? '✓' : agent.icon}
      </div>

      {/* Agent Info */}
      <div className="flex-1 min-w-0">
        <div className="flex items-center gap-2">
          <span className="font-mono text-xs text-[#00CED1]/70">
            AGENT_{agent.id.toString().padStart(2, '0')}
          </span>
          {agent.isGate && (
            <span className="px-1.5 py-0.5 text-[10px] font-mono bg-amber-500/20 text-amber-400 rounded">
              APPROVAL GATE
            </span>
          )}
        </div>
        <h4 className="text-sm font-medium text-white truncate">
          {agent.name}
        </h4>
        <p className="text-xs text-white/50 truncate">
          {message || agent.description}
        </p>
      </div>

      {/* Status Indicator */}
      <div className="flex items-center gap-2">
        {status === 'active' && (
          <div className="flex gap-1">
            <span className="w-1.5 h-1.5 bg-[#00CED1] rounded-full animate-ping" />
            <span className="w-1.5 h-1.5 bg-[#00CED1] rounded-full animate-ping [animation-delay:0.2s]" />
            <span className="w-1.5 h-1.5 bg-[#00CED1] rounded-full animate-ping [animation-delay:0.4s]" />
          </div>
        )}
        {status === 'completed' && (
          <span className="text-emerald-400 text-sm">Complete</span>
        )}
        {isAwaitingApproval && (
          <button
            onClick={onApprovalClick}
            className="px-3 py-1.5 text-xs font-medium bg-amber-500 hover:bg-amber-400 text-black rounded transition-colors"
          >
            Review Script
          </button>
        )}
      </div>

      {/* Connection Line */}
      {agent.id < 7 && (
        <div className={`
          absolute -bottom-4 left-8 w-0.5 h-4
          ${status === 'completed' ? 'bg-emerald-500/50' : 'bg-white/10'}
        `} />
      )}
    </div>
  );
};

// Main Progress Component
const RagnarokProgress = ({
  jobId,
  sessionId,
  currentAgent = 0,
  progress = 0,
  status = 'pending',
  agentStatuses = {},
  messages = {},
  onApprovalClick,
  className = '',
}) => {
  const [wsConnected, setWsConnected] = useState(false);
  const [localProgress, setLocalProgress] = useState(progress);
  const [localCurrentAgent, setLocalCurrentAgent] = useState(currentAgent);
  const [localMessages, setLocalMessages] = useState(messages);
  const [localAgentStatuses, setLocalAgentStatuses] = useState(agentStatuses);

  // WebSocket connection for real-time updates
  useEffect(() => {
    if (!sessionId) return;

    const wsUrl = `${window.location.protocol === 'https:' ? 'wss:' : 'ws:'}//${window.location.host}/ws/${sessionId}`;
    let ws;

    try {
      ws = new WebSocket(wsUrl);

      ws.onopen = () => {
        setWsConnected(true);
        console.log('[RagnarokProgress] WebSocket connected');
      };

      ws.onmessage = (event) => {
        try {
          const data = JSON.parse(event.data);

          if (data.job_id !== jobId) return;

          switch (data.type) {
            case 'agent_started':
            case 'agent_progress':
              setLocalCurrentAgent(data.agent_number);
              setLocalProgress(data.progress || 0);
              if (data.message) {
                setLocalMessages(prev => ({
                  ...prev,
                  [data.agent_number]: data.message
                }));
              }
              setLocalAgentStatuses(prev => ({
                ...prev,
                [data.agent_number]: 'active'
              }));
              break;

            case 'agent_completed':
              setLocalAgentStatuses(prev => ({
                ...prev,
                [data.agent_number]: 'completed'
              }));
              break;

            case 'script_ready':
              setLocalAgentStatuses(prev => ({
                ...prev,
                2: 'awaiting'
              }));
              break;

            case 'job_completed':
              setLocalProgress(100);
              break;

            case 'agent_error':
              setLocalAgentStatuses(prev => ({
                ...prev,
                [data.agent_number]: 'error'
              }));
              break;
          }
        } catch (e) {
          console.error('[RagnarokProgress] Failed to parse message:', e);
        }
      };

      ws.onclose = () => {
        setWsConnected(false);
        console.log('[RagnarokProgress] WebSocket disconnected');
      };

      ws.onerror = (error) => {
        console.error('[RagnarokProgress] WebSocket error:', error);
      };

    } catch (e) {
      console.error('[RagnarokProgress] Failed to connect WebSocket:', e);
    }

    return () => {
      if (ws) {
        ws.close();
      }
    };
  }, [sessionId, jobId]);

  // Determine agent status
  const getAgentStatus = useCallback((agentId) => {
    if (localAgentStatuses[agentId]) {
      return localAgentStatuses[agentId];
    }
    if (agentId < localCurrentAgent) {
      return 'completed';
    }
    if (agentId === localCurrentAgent) {
      return 'active';
    }
    return 'pending';
  }, [localCurrentAgent, localAgentStatuses]);

  return (
    <div className={`w-full ${className}`}>
      {/* Header */}
      <div className="flex items-center justify-between mb-6">
        <div>
          <h3 className="text-lg font-semibold text-white flex items-center gap-2">
            <span className="text-[#00CED1]">⚔️</span>
            RAGNAROK Pipeline
          </h3>
          <p className="text-xs text-white/50 font-mono mt-1">
            {jobId ? `Job: ${jobId.slice(0, 8)}...` : 'Initializing...'}
          </p>
        </div>

        {/* Connection Status */}
        <div className="flex items-center gap-2">
          <span className={`
            w-2 h-2 rounded-full
            ${wsConnected ? 'bg-emerald-500 animate-pulse' : 'bg-red-500'}
          `} />
          <span className="text-xs text-white/50">
            {wsConnected ? 'Live' : 'Connecting...'}
          </span>
        </div>
      </div>

      {/* Progress Bar */}
      <div className="mb-6">
        <div className="flex items-center justify-between mb-2">
          <span className="text-xs text-white/50 font-mono">PROGRESS</span>
          <span className="text-xs text-[#00CED1] font-mono">{localProgress}%</span>
        </div>
        <div className="h-2 bg-white/5 rounded-full overflow-hidden">
          <div
            className="h-full bg-gradient-to-r from-[#00CED1] to-[#8B5CF6] transition-all duration-500 ease-out"
            style={{ width: `${localProgress}%` }}
          />
        </div>
      </div>

      {/* Agent Steps */}
      <div className="space-y-4">
        {AGENTS.map((agent) => (
          <AgentStep
            key={agent.id}
            agent={agent}
            status={getAgentStatus(agent.id)}
            isCurrent={agent.id === localCurrentAgent}
            message={localMessages[agent.id]}
            onApprovalClick={agent.isGate && getAgentStatus(agent.id) === 'awaiting' ? onApprovalClick : undefined}
          />
        ))}
      </div>

      {/* Estimated Time */}
      {status === 'active' && localProgress < 100 && (
        <div className="mt-6 p-3 bg-white/5 rounded-lg border border-white/5">
          <div className="flex items-center justify-between">
            <span className="text-xs text-white/50">Estimated completion</span>
            <span className="text-xs text-white font-mono">
              ~{Math.ceil((100 - localProgress) * 2.43 / 60)} min remaining
            </span>
          </div>
        </div>
      )}
    </div>
  );
};

export default RagnarokProgress;
