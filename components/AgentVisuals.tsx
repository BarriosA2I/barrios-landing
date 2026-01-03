'use client';

/**
 * Agent Micro-Visualizations
 * ==========================
 * Neural RAG Brain v3.0 + RAGNAROK v7.0 APEX
 * 
 * Gemini v4.0 Upgrade: Replace generic spinners with 
 * functional, agent-specific visualizations that reinforce 
 * the "AI is working" perception and reduce perceived latency.
 * 
 * @version 4.0.0
 * @author Barrios A2I
 */

import React, { useState, useEffect, useMemo } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

// ============================================================================
// TYPES
// ============================================================================

export interface AgentVisualProps {
  agentId: number;
  status: 'idle' | 'working' | 'complete' | 'error';
  progress?: number; // 0-100
  metadata?: Record<string, unknown>;
}

// ============================================================================
// AGENT 1: STRATEGIST VISUAL
// ============================================================================

export const StrategistVisual = ({ status }: { status: string }) => {
  const [nodes, setNodes] = useState<Array<{ x: number; y: number; active: boolean }>>([]);

  useEffect(() => {
    if (status !== 'working') return;
    
    // Generate neural network nodes
    const newNodes = Array.from({ length: 12 }, (_, i) => ({
      x: Math.random() * 100,
      y: Math.random() * 100,
      active: false
    }));
    setNodes(newNodes);

    const interval = setInterval(() => {
      setNodes(prev => prev.map(node => ({
        ...node,
        active: Math.random() > 0.5
      })));
    }, 400);

    return () => clearInterval(interval);
  }, [status]);

  if (status !== 'working') return null;

  return (
    <div className="relative w-full h-16 overflow-hidden rounded-lg bg-[#0a0a1e]/50">
      <svg className="absolute inset-0 w-full h-full">
        {nodes.map((node, i) => (
          <React.Fragment key={i}>
            {/* Node */}
            <motion.circle
              cx={`${node.x}%`}
              cy={`${node.y}%`}
              r={node.active ? 4 : 2}
              fill={node.active ? '#00CED1' : '#00CED1'}
              opacity={node.active ? 0.8 : 0.3}
              animate={{ scale: node.active ? [1, 1.5, 1] : 1 }}
              transition={{ duration: 0.5 }}
            />
            {/* Connections */}
            {nodes.slice(i + 1, i + 3).map((target, j) => (
              <motion.line
                key={`${i}-${j}`}
                x1={`${node.x}%`}
                y1={`${node.y}%`}
                x2={`${target.x}%`}
                y2={`${target.y}%`}
                stroke="#00CED1"
                strokeWidth={0.5}
                opacity={node.active && target.active ? 0.4 : 0.1}
              />
            ))}
          </React.Fragment>
        ))}
      </svg>
      <div className="absolute bottom-1 left-2 text-[10px] text-[#00CED1]/60 font-mono">
        ANALYZING MARKET INTELLIGENCE...
      </div>
    </div>
  );
};

// ============================================================================
// AGENT 2: SCRIPTER VISUAL (Typewriter Effect)
// ============================================================================

export const ScripterVisual = ({ status }: { status: string }) => {
  const [lines, setLines] = useState<string[]>([]);
  const [currentLine, setCurrentLine] = useState('');
  
  const scriptFragments = useMemo(() => [
    'HOOK: "Transform your space..."',
    'BODY: Establishing value proposition',
    'CTA: "Call today for free estimate"',
    'Analyzing emotional resonance...',
    'Optimizing word choice for engagement',
  ], []);

  useEffect(() => {
    if (status !== 'working') {
      setLines([]);
      setCurrentLine('');
      return;
    }
    
    let lineIndex = 0;
    let charIndex = 0;
    
    const typeInterval = setInterval(() => {
      const targetLine = scriptFragments[lineIndex % scriptFragments.length];
      
      if (charIndex < targetLine.length) {
        setCurrentLine(targetLine.slice(0, charIndex + 1));
        charIndex++;
      } else {
        setLines(prev => [...prev, targetLine].slice(-4));
        setCurrentLine('');
        charIndex = 0;
        lineIndex++;
      }
    }, 50);

    return () => clearInterval(typeInterval);
  }, [status, scriptFragments]);

  if (status !== 'working') return null;

  return (
    <div className="font-mono text-xs text-[#00CED1] p-3 bg-[#0a0a1e]/50 rounded-lg border border-[#00CED1]/20">
      <div className="space-y-1 opacity-50">
        {lines.map((line, i) => (
          <motion.div
            key={i}
            initial={{ opacity: 0, x: -10 }}
            animate={{ opacity: 0.5, x: 0 }}
            className="text-white/40"
          >
            {line}
          </motion.div>
        ))}
      </div>
      <div className="flex items-center gap-1 mt-1">
        <span className="text-[#00CED1]">&gt;</span>
        <span>{currentLine}</span>
        <motion.span
          animate={{ opacity: [1, 0, 1] }}
          transition={{ duration: 0.8, repeat: Infinity }}
          className="inline-block w-2 h-4 bg-[#00CED1]"
        />
      </div>
    </div>
  );
};

// ============================================================================
// AGENT 3: VISUALIZER VISUAL (Scanning Radar Grid)
// ============================================================================

export const VisualizerVisual = ({ status }: { status: string }) => {
  const [activeCell, setActiveCell] = useState(0);

  useEffect(() => {
    if (status !== 'working') return;
    
    const interval = setInterval(() => {
      setActiveCell(prev => (prev + 1) % 9);
    }, 300);

    return () => clearInterval(interval);
  }, [status]);

  if (status !== 'working') return null;

  return (
    <div className="p-2">
      <div className="grid grid-cols-3 gap-1.5">
        {[...Array(9)].map((_, i) => (
          <motion.div
            key={i}
            className="aspect-video rounded-sm overflow-hidden relative"
            style={{
              background: i === activeCell 
                ? 'linear-gradient(135deg, rgba(0,206,209,0.3), rgba(0,206,209,0.1))' 
                : 'rgba(0,206,209,0.05)'
            }}
          >
            {/* Scan line effect */}
            {i === activeCell && (
              <motion.div
                className="absolute inset-x-0 h-0.5 bg-[#00CED1]"
                initial={{ top: 0 }}
                animate={{ top: '100%' }}
                transition={{ duration: 0.3, ease: 'linear' }}
              />
            )}
            <div className="absolute inset-0 flex items-center justify-center">
              <span className="text-[8px] text-[#00CED1]/40 font-mono">
                {i === activeCell ? 'SCAN' : `F${i + 1}`}
              </span>
            </div>
          </motion.div>
        ))}
      </div>
      <div className="mt-2 text-[10px] text-center text-[#00CED1]/60 font-mono">
        ANALYZING STYLE REFERENCES...
      </div>
    </div>
  );
};

// ============================================================================
// AGENT 4: SOUND DESIGNER VISUAL (Audio Waveform)
// ============================================================================

export const SoundDesignerVisual = ({ status }: { status: string }) => {
  const barCount = 16;
  
  if (status !== 'working') return null;

  return (
    <div className="p-3">
      <div className="flex items-end justify-center gap-0.5 h-12">
        {[...Array(barCount)].map((_, i) => (
          <motion.div
            key={i}
            className="w-1.5 bg-gradient-to-t from-[#F59E0B] to-[#F59E0B]/50 rounded-t-full"
            animate={{ 
              height: [
                `${20 + Math.sin(i * 0.5) * 15}%`,
                `${60 + Math.sin(i * 0.8 + 2) * 30}%`,
                `${30 + Math.cos(i * 0.6) * 20}%`,
                `${50 + Math.sin(i * 0.7 + 1) * 25}%`,
                `${20 + Math.sin(i * 0.5) * 15}%`
              ]
            }}
            transition={{ 
              duration: 1.2 + (i * 0.05), 
              repeat: Infinity,
              ease: 'easeInOut'
            }}
          />
        ))}
      </div>
      <div className="mt-2 flex justify-between text-[10px] text-[#F59E0B]/60 font-mono">
        <span>00:00</span>
        <span>GENERATING AUDIO...</span>
        <span>00:30</span>
      </div>
    </div>
  );
};

// ============================================================================
// AGENT 5: ASSEMBLER VISUAL (Timeline)
// ============================================================================

export const AssemblerVisual = ({ status, progress = 0 }: { status: string; progress?: number }) => {
  if (status !== 'working') return null;

  const segments = [
    { label: 'INTRO', color: '#00CED1' },
    { label: 'BODY', color: '#8B5CF6' },
    { label: 'CTA', color: '#10B981' },
  ];

  return (
    <div className="p-3">
      <div className="relative h-8 bg-[#0a0a1e]/50 rounded-lg overflow-hidden">
        {/* Progress bar */}
        <motion.div
          className="absolute inset-y-0 left-0 bg-gradient-to-r from-[#00CED1]/30 to-[#00CED1]/10"
          initial={{ width: 0 }}
          animate={{ width: `${progress}%` }}
          transition={{ duration: 0.3 }}
        />
        
        {/* Segments */}
        <div className="absolute inset-0 flex">
          {segments.map((seg, i) => (
            <div
              key={i}
              className="flex-1 flex items-center justify-center border-r border-white/10 last:border-r-0"
            >
              <span 
                className="text-[10px] font-mono"
                style={{ color: `${seg.color}80` }}
              >
                {seg.label}
              </span>
            </div>
          ))}
        </div>
        
        {/* Playhead */}
        <motion.div
          className="absolute top-0 bottom-0 w-0.5 bg-white"
          style={{ left: `${progress}%` }}
          animate={{ opacity: [1, 0.5, 1] }}
          transition={{ duration: 0.5, repeat: Infinity }}
        />
      </div>
      <div className="mt-2 text-center text-[10px] text-white/40 font-mono">
        ASSEMBLING TIMELINE... {progress}%
      </div>
    </div>
  );
};

// ============================================================================
// AGENT 6: QA VISUAL (Validation Checklist)
// ============================================================================

export const QAVisual = ({ status }: { status: string }) => {
  const [checks, setChecks] = useState<boolean[]>(Array(6).fill(false));
  
  const checkLabels = [
    'Resolution 1080p',
    'Audio Sync',
    'Color Balance',
    'CTA Clarity',
    'Brand Match',
    'Final Review'
  ];

  useEffect(() => {
    if (status !== 'working') {
      setChecks(Array(6).fill(false));
      return;
    }
    
    let currentCheck = 0;
    const interval = setInterval(() => {
      if (currentCheck < 6) {
        setChecks(prev => {
          const next = [...prev];
          next[currentCheck] = true;
          return next;
        });
        currentCheck++;
      }
    }, 800);

    return () => clearInterval(interval);
  }, [status]);

  if (status !== 'working') return null;

  return (
    <div className="p-3 space-y-1.5">
      {checkLabels.map((label, i) => (
        <motion.div
          key={i}
          className="flex items-center gap-2 text-xs"
          initial={{ opacity: 0.3 }}
          animate={{ opacity: checks[i] ? 1 : 0.3 }}
        >
          <motion.div
            className={`w-3 h-3 rounded-sm border flex items-center justify-center ${
              checks[i] 
                ? 'bg-emerald-500/20 border-emerald-500' 
                : 'border-white/20'
            }`}
          >
            {checks[i] && (
              <motion.span
                initial={{ scale: 0 }}
                animate={{ scale: 1 }}
                className="text-emerald-500 text-[8px]"
              >
                ✓
              </motion.span>
            )}
          </motion.div>
          <span className={checks[i] ? 'text-white/80' : 'text-white/40'}>
            {label}
          </span>
        </motion.div>
      ))}
    </div>
  );
};

// ============================================================================
// AGENT 7: DELIVERY VISUAL (Upload Progress)
// ============================================================================

export const DeliveryVisual = ({ status, progress = 0 }: { status: string; progress?: number }) => {
  if (status !== 'working') return null;

  const formats = ['YouTube', 'TikTok', 'Instagram'];

  return (
    <div className="p-3 space-y-2">
      {formats.map((format, i) => {
        const formatProgress = Math.max(0, Math.min(100, progress - (i * 30)));
        const isComplete = formatProgress >= 100;
        
        return (
          <div key={format} className="space-y-1">
            <div className="flex justify-between text-[10px]">
              <span className={isComplete ? 'text-emerald-400' : 'text-white/60'}>
                {format}
              </span>
              <span className="text-white/40 font-mono">
                {isComplete ? '✓' : `${Math.round(formatProgress)}%`}
              </span>
            </div>
            <div className="h-1 bg-white/10 rounded-full overflow-hidden">
              <motion.div
                className={`h-full rounded-full ${
                  isComplete ? 'bg-emerald-500' : 'bg-[#00CED1]'
                }`}
                initial={{ width: 0 }}
                animate={{ width: `${formatProgress}%` }}
              />
            </div>
          </div>
        );
      })}
    </div>
  );
};

// ============================================================================
// AGENT VISUALS MAPPING
// ============================================================================

export const AGENT_VISUALS: Record<number, React.FC<{ status: string; progress?: number }>> = {
  1: StrategistVisual,
  2: ScripterVisual,
  3: VisualizerVisual,
  4: SoundDesignerVisual,
  5: AssemblerVisual,
  6: QAVisual,
  7: DeliveryVisual,
};

// ============================================================================
// UNIFIED AGENT VISUAL COMPONENT
// ============================================================================

export const AgentVisual: React.FC<AgentVisualProps> = ({ 
  agentId, 
  status, 
  progress,
  metadata 
}) => {
  const VisualComponent = AGENT_VISUALS[agentId];
  
  if (!VisualComponent) {
    // Fallback generic spinner
    return (
      <div className="flex items-center justify-center p-4">
        <motion.div
          className="w-6 h-6 border-2 border-[#00CED1]/30 border-t-[#00CED1] rounded-full"
          animate={{ rotate: 360 }}
          transition={{ duration: 1, repeat: Infinity, ease: 'linear' }}
        />
      </div>
    );
  }

  return (
    <AnimatePresence mode="wait">
      <motion.div
        key={`${agentId}-${status}`}
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        exit={{ opacity: 0, y: -10 }}
        transition={{ duration: 0.2 }}
      >
        <VisualComponent status={status} progress={progress} />
      </motion.div>
    </AnimatePresence>
  );
};

export default AgentVisual;
