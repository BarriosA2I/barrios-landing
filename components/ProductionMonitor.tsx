'use client';

import React, { useEffect, useState, useRef } from 'react';

interface PhaseStatus {
  phase: string;
  status: 'pending' | 'running' | 'complete' | 'error';
  progress: number;
  message?: string;
}

interface ProductionMonitorProps {
  sessionId: string;
  isActive: boolean;
  onComplete: (result: any) => void;
  onError: (error: string) => void;
}

const PHASES = [
  { id: 'intake', label: 'Brief Analysis', icon: '📋' },
  { id: 'intelligence', label: 'Market Intelligence', icon: '🔍' },
  { id: 'story', label: 'Story Generation', icon: '📝' },
  { id: 'prompts', label: 'Visual Prompts', icon: '🎨' },
  { id: 'video', label: 'Video Generation', icon: '🎬' },
  { id: 'voice', label: 'Voice Synthesis', icon: '🎙️' },
  { id: 'music', label: 'Music Selection', icon: '🎵' },
  { id: 'assembly', label: 'Final Assembly', icon: '🔧' },
  { id: 'qa', label: 'Quality Check', icon: '✅' },
];

export function ProductionMonitor({ sessionId, isActive, onComplete, onError }: ProductionMonitorProps) {
  const [phases, setPhases] = useState<Record<string, PhaseStatus>>({});
  const [overallProgress, setOverallProgress] = useState(0);
  const [currentPhase, setCurrentPhase] = useState<string | null>(null);
  const eventSourceRef = useRef<EventSource | null>(null);

  useEffect(() => {
    if (!isActive || !sessionId) return;

    const GENESIS_URL = 'https://barrios-genesis-flawless.onrender.com';
    const eventSource = new EventSource(`${GENESIS_URL}/api/production/status/${sessionId}/stream`);
    eventSourceRef.current = eventSource;

    eventSource.addEventListener('status', (event) => {
      try {
        const data = JSON.parse(event.data);

        // Update phase status
        if (data.phase) {
          setCurrentPhase(data.phase);
          setPhases(prev => ({
            ...prev,
            [data.phase]: {
              phase: data.phase,
              status: data.status || 'running',
              progress: data.progress || 0,
              message: data.message,
            }
          }));
        }

        // Update overall progress
        if (data.overall_progress !== undefined) {
          setOverallProgress(data.overall_progress);
        }

        // Check for completion
        if (data.status === 'complete' && data.phase === 'qa') {
          eventSource.close();
          onComplete(data);
        }
      } catch (e) {
        console.error('SSE parse error:', e);
      }
    });

    eventSource.addEventListener('error', () => {
      onError('Connection lost - attempting to reconnect...');
    });

    return () => {
      if (eventSourceRef.current) {
        eventSourceRef.current.close();
      }
    };
  }, [sessionId, isActive, onComplete, onError]);

  return (
    <div className="bg-gray-900/80 border border-cyan-500/30 rounded-lg p-4 space-y-4">
      <div className="flex items-center justify-between">
        <h3 className="text-cyan-400 font-semibold text-lg flex items-center gap-2">
          <span className="animate-pulse">🎬</span> RAGNAROK Production
        </h3>
        <span className="text-cyan-300 font-mono">{overallProgress}%</span>
      </div>

      {/* Overall progress bar */}
      <div className="h-3 bg-gray-800 rounded-full overflow-hidden">
        <div
          className="h-full bg-gradient-to-r from-cyan-500 to-teal-500 transition-all duration-500"
          style={{ width: `${overallProgress}%` }}
        />
      </div>

      {/* Phase list */}
      <div className="space-y-2">
        {PHASES.map(({ id, label, icon }) => {
          const phase = phases[id];
          const isCurrent = currentPhase === id;
          const isComplete = phase?.status === 'complete';
          const isPending = !phase || phase.status === 'pending';

          return (
            <div
              key={id}
              className={`flex items-center gap-3 p-2 rounded transition-all ${
                isCurrent ? 'bg-cyan-500/20 border border-cyan-500/50' :
                isComplete ? 'bg-green-500/10' :
                'bg-gray-800/30'
              }`}
            >
              <span className="text-lg">{icon}</span>
              <span className={`flex-1 ${
                isComplete ? 'text-green-400' :
                isCurrent ? 'text-cyan-300' :
                'text-gray-500'
              }`}>
                {label}
              </span>
              {isComplete && <span className="text-green-500">✓</span>}
              {isCurrent && (
                <span className="text-cyan-400 text-sm animate-pulse">
                  {phase?.progress || 0}%
                </span>
              )}
            </div>
          );
        })}
      </div>

      {/* Current action */}
      {currentPhase && phases[currentPhase]?.message && (
        <div className="text-sm text-gray-400 italic text-center">
          {phases[currentPhase].message}
        </div>
      )}
    </div>
  );
}
