'use client';

/**
 * Explain Mode Strip
 * ==================
 * Neural RAG Brain v3.0 + NEXUS Command Center
 * 
 * Customer-facing component that explains what the AI is doing
 * and reinforces privacy/trust messaging. Reduces perceived latency
 * by showing meaningful work is happening.
 * 
 * @version 4.0.0
 * @author Barrios A2I
 */

import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

// ============================================================================
// COMPANY FACTS (Inline for portability)
// ============================================================================

const COMPANY_FACTS = {
  name: 'Barrios A2I',
  tagline: 'Alienation 2 Innovation',
  pricing: {
    setup: 759,
    monthly: 49.99,
    displayText: '$759 setup + $49.99/mo'
  },
  metrics: {
    costReduction: '62.5%',
    qualityImprovement: '25%',
    successRate: '98.5%'
  }
};

// ============================================================================
// TYPES
// ============================================================================

interface ExplainModeStripProps {
  tasksThisMonth?: number;
  hoursSaved?: number;
  onLearnMore?: () => void;
  dismissible?: boolean;
  defaultDismissed?: boolean;
  variant?: 'default' | 'compact' | 'production';
}

// ============================================================================
// MAIN COMPONENT
// ============================================================================

export function ExplainModeStrip({
  tasksThisMonth = 128,
  hoursSaved = 4.3,
  onLearnMore,
  dismissible = true,
  defaultDismissed = false,
  variant = 'default'
}: ExplainModeStripProps) {
  const [isDismissed, setIsDismissed] = useState(defaultDismissed);
  const [isMinimized, setIsMinimized] = useState(false);
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
    const saved = localStorage.getItem('nexus-explain-strip-dismissed');
    if (saved === 'true') {
      setIsDismissed(true);
    }
  }, []);

  const handleDismiss = () => {
    setIsDismissed(true);
    localStorage.setItem('nexus-explain-strip-dismissed', 'true');
  };

  const handleRestore = () => {
    setIsDismissed(false);
    localStorage.removeItem('nexus-explain-strip-dismissed');
  };

  if (!mounted) return null;

  // Minimized restore button
  if (isDismissed) {
    return (
      <motion.button
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        onClick={handleRestore}
        className="fixed top-4 right-4 z-40 px-3 py-1.5 bg-[#0a0a1e]/90 backdrop-blur-xl border border-white/10 rounded-full text-xs text-white/50 hover:text-white/70 hover:border-[#00CED1]/30 transition-all flex items-center gap-2 group"
      >
        <span className="w-2 h-2 bg-[#00CED1] rounded-full animate-pulse group-hover:animate-none" />
        <span>What is Nexus?</span>
      </motion.button>
    );
  }

  // Production variant (minimal, non-intrusive)
  if (variant === 'production') {
    return (
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        className="bg-gradient-to-r from-[#00CED1]/5 via-transparent to-[#8B5CF6]/5 border-b border-white/5"
      >
        <div className="max-w-7xl mx-auto px-4 py-2 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="flex items-center gap-2">
              <span className="w-2 h-2 bg-emerald-500 rounded-full animate-pulse" />
              <span className="text-xs text-white/60">
                <span className="text-[#00CED1]">Nexus</span> is processing your request
              </span>
            </div>
          </div>
          <div className="flex items-center gap-4">
            <span className="text-xs text-white/40">
              {tasksThisMonth} tasks • {hoursSaved}h saved this month
            </span>
            {dismissible && (
              <button 
                onClick={handleDismiss}
                className="text-white/30 hover:text-white/50 transition-colors text-sm"
              >
                ✕
              </button>
            )}
          </div>
        </div>
      </motion.div>
    );
  }

  // Compact variant
  if (variant === 'compact' || isMinimized) {
    return (
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        className="bg-[#0a0a1e]/90 backdrop-blur-xl border-b border-white/10 py-2"
      >
        <div className="max-w-7xl mx-auto px-4 flex items-center justify-between">
          <button
            onClick={() => setIsMinimized(false)}
            className="flex items-center gap-2 text-sm text-white/60 hover:text-white/80 transition-colors group"
          >
            <span className="w-2 h-2 bg-[#00CED1] rounded-full" />
            <span>Nexus: Private AI Assistant</span>
            <span className="text-white/40">• {tasksThisMonth} tasks this month</span>
            <motion.span 
              className="text-[#00CED1] text-xs"
              whileHover={{ y: 2 }}
            >
              ▼
            </motion.span>
          </button>
          <div className="flex items-center gap-2">
            <PrivacyBadge variant="compact" />
            {dismissible && (
              <button 
                onClick={handleDismiss}
                className="text-white/30 hover:text-white/50 transition-colors ml-2"
              >
                ✕
              </button>
            )}
          </div>
        </div>
      </motion.div>
    );
  }

  // Default full variant
  return (
    <motion.div
      initial={{ opacity: 0, y: -20 }}
      animate={{ opacity: 1, y: 0 }}
      className="bg-gradient-to-r from-[#0a0a1e] via-[#00CED1]/10 to-[#0a0a1e] border-b border-white/10 py-4"
    >
      <div className="max-w-7xl mx-auto px-4">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 items-center">
          {/* Main explanation */}
          <div className="md:col-span-2">
            <div className="flex items-start gap-3">
              <div className="w-3 h-3 mt-1 bg-[#00CED1] rounded-full animate-pulse flex-shrink-0" />
              <div>
                <h3 className="text-sm font-semibold text-white mb-1">
                  What you're seeing
                </h3>
                <p className="text-sm text-white/60 leading-relaxed">
                  <span className="text-[#00CED1] font-medium">Nexus</span> is scanning 
                  your approved sources and turning them into answers + actions.{' '}
                  <span className="text-white/40">
                    Runs locally. Your data stays on your machine.
                  </span>
                </p>
                
                {/* Quick capabilities */}
                <div className="flex flex-wrap gap-2 mt-3">
                  {['RAG Retrieval', 'Neural Routing', 'Self-Reflection'].map((cap) => (
                    <span 
                      key={cap}
                      className="px-2 py-0.5 text-[10px] bg-white/5 border border-white/10 rounded-full text-white/50"
                    >
                      {cap}
                    </span>
                  ))}
                </div>
              </div>
            </div>
          </div>

          {/* Stats and controls */}
          <div className="flex items-center justify-end gap-6">
            <div className="text-right">
              <p className="text-xs text-white/40 uppercase tracking-wider mb-1">
                This month
              </p>
              <p className="text-lg font-bold text-white">
                <span className="text-[#00CED1]">{tasksThisMonth}</span>
                <span className="text-white/60 text-sm font-normal"> tasks</span>
                <span className="text-white/40 mx-2">•</span>
                <span className="text-emerald-400">{hoursSaved}h</span>
                <span className="text-white/60 text-sm font-normal"> saved</span>
              </p>
            </div>
            
            <div className="flex items-center gap-2 border-l border-white/10 pl-4">
              <button 
                onClick={() => setIsMinimized(true)}
                className="p-1.5 text-white/30 hover:text-white/50 transition-colors rounded hover:bg-white/5"
                title="Minimize"
              >
                ▲
              </button>
              {onLearnMore && (
                <button 
                  onClick={onLearnMore}
                  className="p-1.5 text-white/30 hover:text-[#00CED1] transition-colors rounded hover:bg-white/5"
                  title="Learn more"
                >
                  ?
                </button>
              )}
              {dismissible && (
                <button 
                  onClick={handleDismiss}
                  className="p-1.5 text-white/30 hover:text-white/50 transition-colors rounded hover:bg-white/5"
                  title="Dismiss"
                >
                  ✕
                </button>
              )}
            </div>
          </div>
        </div>
      </div>
    </motion.div>
  );
}

// ============================================================================
// PRIVACY BADGE
// ============================================================================

export function PrivacyBadge({ 
  variant = 'default' 
}: { 
  variant?: 'default' | 'compact' | 'detailed' 
}) {
  if (variant === 'compact') {
    return (
      <div className="inline-flex items-center gap-1.5 px-2 py-1 bg-emerald-500/10 border border-emerald-500/20 rounded-full">
        <span className="w-1.5 h-1.5 bg-emerald-500 rounded-full" />
        <span className="text-[10px] text-emerald-400 font-medium uppercase tracking-wider">
          Private
        </span>
      </div>
    );
  }

  if (variant === 'detailed') {
    return (
      <div className="flex flex-col gap-2 p-4 bg-white/5 border border-white/10 rounded-xl">
        <div className="flex items-center gap-2">
          <span className="w-2 h-2 bg-emerald-500 rounded-full animate-pulse" />
          <span className="text-xs font-semibold text-white/80">
            PRIVATE MODE: ACTIVE
          </span>
        </div>
        <div className="space-y-2 mt-2">
          {[
            { icon: '🔒', label: 'Local Processing', desc: 'Data never leaves your machine' },
            { icon: '🛡️', label: 'No Training', desc: 'Your data is never used to train AI' },
            { icon: '🗑️', label: 'Auto-Purge', desc: 'Session data cleared on exit' },
          ].map((item) => (
            <div key={item.label} className="flex items-start gap-2">
              <span className="text-sm">{item.icon}</span>
              <div>
                <span className="text-xs text-white/70">{item.label}</span>
                <p className="text-[10px] text-white/40">{item.desc}</p>
              </div>
            </div>
          ))}
        </div>
      </div>
    );
  }

  // Default
  return (
    <div className="flex flex-col gap-1 p-3 bg-white/5 border border-white/10 rounded-xl">
      <div className="flex items-center gap-2">
        <span className="w-2 h-2 bg-emerald-500 rounded-full" />
        <span className="text-xs font-semibold text-white/80">PRIVATE MODE: ON</span>
      </div>
      <div className="space-y-1 mt-2">
        <div className="flex items-center gap-2 text-xs">
          <span className="text-emerald-400">✓</span>
          <span className="text-white/60">Local Processing</span>
        </div>
        <div className="flex items-center gap-2 text-xs">
          <span className="text-emerald-400">✓</span>
          <span className="text-white/60">No Cloud Storage</span>
        </div>
        <div className="flex items-center gap-2 text-xs">
          <span className="text-emerald-400">✓</span>
          <span className="text-white/60">Zero Data Retention</span>
        </div>
      </div>
    </div>
  );
}

// ============================================================================
// VALUE PROPOSITION
// ============================================================================

export function ValueProposition() {
  return (
    <div className="p-4 bg-gradient-to-br from-[#00CED1]/10 to-[#8B5CF6]/10 border border-white/10 rounded-xl">
      <h4 className="text-xs font-semibold text-white/40 uppercase tracking-wider mb-2">
        What you're paying for
      </h4>
      <p className="text-sm text-white/70 leading-relaxed">
        A private AI assistant that saves time, reduces mistakes, and proves its value monthly 
        with transparent metrics.
      </p>
      
      {/* Metrics */}
      <div className="grid grid-cols-3 gap-2 mt-4">
        {[
          { value: COMPANY_FACTS.metrics.costReduction, label: 'Cost Saved' },
          { value: COMPANY_FACTS.metrics.qualityImprovement, label: 'Quality Up' },
          { value: COMPANY_FACTS.metrics.successRate, label: 'Success Rate' },
        ].map((metric) => (
          <div key={metric.label} className="text-center">
            <p className="text-lg font-bold text-[#00CED1]">{metric.value}</p>
            <p className="text-[10px] text-white/40">{metric.label}</p>
          </div>
        ))}
      </div>

      {/* Pricing */}
      <div className="mt-4 pt-3 border-t border-white/10">
        <p className="text-xs text-white/40">
          {COMPANY_FACTS.pricing.displayText}
        </p>
      </div>
    </div>
  );
}

// ============================================================================
// PROCESSING INDICATOR
// ============================================================================

export function ProcessingIndicator({ 
  stage,
  agentName,
  progress = 0 
}: { 
  stage: string;
  agentName?: string;
  progress?: number;
}) {
  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.95 }}
      animate={{ opacity: 1, scale: 1 }}
      className="flex items-center gap-3 px-4 py-2 bg-[#00CED1]/5 border border-[#00CED1]/20 rounded-lg"
    >
      <motion.div
        className="w-5 h-5 border-2 border-[#00CED1]/30 border-t-[#00CED1] rounded-full"
        animate={{ rotate: 360 }}
        transition={{ duration: 1, repeat: Infinity, ease: 'linear' }}
      />
      <div className="flex-1">
        <p className="text-sm text-white/80">{stage}</p>
        {agentName && (
          <p className="text-xs text-[#00CED1]/60">Agent: {agentName}</p>
        )}
      </div>
      {progress > 0 && (
        <span className="text-xs text-white/40 font-mono">{progress}%</span>
      )}
    </motion.div>
  );
}

export default ExplainModeStrip;
