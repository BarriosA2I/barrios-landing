'use client';

import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useUser } from '@clerk/nextjs';
import {
  CheckCircle2,
  Circle,
  Sparkles,
  Settings,
  MessageSquare,
  Link2,
  Rocket,
  ChevronRight,
} from 'lucide-react';
import { useProgressTracker, BrandData } from '@/hooks/useLocalStorage';
import BrandIntakeModal from '@/components/modals/BrandIntakeModal';

interface ChecklistItem {
  id: string;
  label: string;
  description: string;
}

interface Phase {
  id: number;
  name: string;
  icon: React.ElementType;
  items: ChecklistItem[];
}

const PHASES: Phase[] = [
  {
    id: 0,
    name: 'Welcome',
    icon: Sparkles,
    items: [
      { id: 'welcome-1', label: 'Account created', description: 'Your account is ready' },
      { id: 'welcome-2', label: 'Email verified', description: 'Email confirmation received' },
      { id: 'welcome-3', label: 'Welcome tour viewed', description: 'Learn the basics' },
    ],
  },
  {
    id: 1,
    name: 'Brand Setup',
    icon: Settings,
    items: [
      { id: 'brand-1', label: 'Business name entered', description: 'Tell us who you are' },
      { id: 'brand-2', label: 'Brand colors configured', description: 'Set your visual identity' },
      { id: 'brand-3', label: 'Logo uploaded', description: 'Add your brand mark' },
      { id: 'brand-4', label: 'Voice & tone selected', description: 'Define your communication style' },
    ],
  },
  {
    id: 2,
    name: 'Voice & Tone',
    icon: MessageSquare,
    items: [
      { id: 'voice-1', label: 'Target audience defined', description: 'Who are you speaking to?' },
      { id: 'voice-2', label: 'Sample content reviewed', description: 'Preview generated content' },
      { id: 'voice-3', label: 'Tone preferences saved', description: 'Fine-tune the voice' },
    ],
  },
  {
    id: 3,
    name: 'Integrations',
    icon: Link2,
    items: [
      { id: 'int-1', label: 'Connect social accounts', description: 'Link your social channels' },
      { id: 'int-2', label: 'API keys configured', description: 'Set up external services' },
      { id: 'int-3', label: 'Webhook endpoints set', description: 'Enable real-time updates' },
    ],
  },
  {
    id: 4,
    name: 'Launch',
    icon: Rocket,
    items: [
      { id: 'launch-1', label: 'First campaign created', description: 'Set up your first project' },
      { id: 'launch-2', label: 'Test run completed', description: 'Verify everything works' },
      { id: 'launch-3', label: 'Go live!', description: 'Launch your automation' },
    ],
  },
];

export default function SuccessPortalPage() {
  const { user } = useUser();
  const { progress, markItemComplete, setCurrentPhase, saveBrandData } = useProgressTracker();
  const [showConfetti, setShowConfetti] = useState(false);
  const [isBrandModalOpen, setIsBrandModalOpen] = useState(false);

  // Auto-mark first items as complete on mount
  useEffect(() => {
    if (!progress.completedItems.includes('welcome-1')) {
      markItemComplete('welcome-1');
      markItemComplete('welcome-2');
    }
  }, []);

  // Show confetti on first visit
  useEffect(() => {
    const hasSeenConfetti = localStorage.getItem('success-confetti-shown');
    if (!hasSeenConfetti) {
      setShowConfetti(true);
      localStorage.setItem('success-confetti-shown', 'true');
      setTimeout(() => setShowConfetti(false), 5000);
    }
  }, []);

  const getPhaseProgress = (phase: Phase) => {
    const completed = phase.items.filter((item) =>
      progress.completedItems.includes(item.id)
    ).length;
    return { completed, total: phase.items.length };
  };

  const handleItemToggle = (itemId: string) => {
    if (!progress.completedItems.includes(itemId)) {
      markItemComplete(itemId);
    }
  };

  const handleBrandSave = (data: BrandData) => {
    saveBrandData(data);
    // Mark brand-related items as complete
    if (data.businessName) markItemComplete('brand-1');
    if (data.primaryColor) markItemComplete('brand-2');
    if (data.logoUrl) markItemComplete('brand-3');
    if (data.voiceTone) markItemComplete('brand-4');
    if (data.targetAudience) markItemComplete('voice-1');
  };

  const totalProgress = PHASES.reduce((acc, phase) => {
    const { completed, total } = getPhaseProgress(phase);
    return { completed: acc.completed + completed, total: acc.total + total };
  }, { completed: 0, total: 0 });

  const progressPercent = Math.round((totalProgress.completed / totalProgress.total) * 100);

  return (
    <div className="min-h-screen p-6 lg:p-8">
      {/* Confetti Animation */}
      <AnimatePresence>
        {showConfetti && (
          <motion.div
            initial={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 pointer-events-none z-50 overflow-hidden"
          >
            {[...Array(50)].map((_, i) => (
              <motion.div
                key={i}
                initial={{
                  x: Math.random() * window.innerWidth,
                  y: -20,
                  rotate: 0,
                }}
                animate={{
                  y: window.innerHeight + 20,
                  rotate: 360 * (Math.random() > 0.5 ? 1 : -1),
                }}
                transition={{
                  duration: 2 + Math.random() * 2,
                  delay: Math.random() * 0.5,
                  ease: 'linear',
                }}
                className="absolute w-3 h-3 rounded-sm"
                style={{
                  backgroundColor: ['#00bfff', '#ffd700', '#10b981', '#8b5cf6', '#f97316'][
                    Math.floor(Math.random() * 5)
                  ],
                }}
              />
            ))}
          </motion.div>
        )}
      </AnimatePresence>

      {/* Header */}
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        className="mb-8"
      >
        <h1 className="text-3xl font-black uppercase tracking-tighter text-white">
          Welcome, {user?.firstName || 'Commander'}!
        </h1>
        <p className="text-slate-400 mt-2">
          Complete these steps to activate your full capabilities.
        </p>
      </motion.div>

      {/* Overall Progress Bar */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.1 }}
        className="rounded-2xl border border-white/10 bg-white/5 backdrop-blur-xl p-6 mb-8"
      >
        <div className="flex items-center justify-between mb-3">
          <span className="text-[10px] font-bold uppercase tracking-widest text-slate-500">
            Setup Progress
          </span>
          <span className="text-2xl font-black text-[#00bfff]">{progressPercent}%</span>
        </div>
        <div className="h-3 bg-white/10 rounded-full overflow-hidden">
          <motion.div
            initial={{ width: 0 }}
            animate={{ width: `${progressPercent}%` }}
            transition={{ duration: 1, ease: 'easeOut' }}
            className="h-full rounded-full"
            style={{
              background: 'linear-gradient(90deg, #00bfff, #ffd700)',
            }}
          />
        </div>
        <p className="text-xs text-slate-500 mt-2">
          {totalProgress.completed} of {totalProgress.total} tasks completed
        </p>
      </motion.div>

      {/* Phase Stepper */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.2 }}
        className="flex items-center justify-between mb-8 overflow-x-auto pb-2"
      >
        {PHASES.map((phase, idx) => {
          const { completed, total } = getPhaseProgress(phase);
          const isComplete = completed === total;
          const isActive = progress.currentPhase === phase.id;

          return (
            <button
              key={phase.id}
              onClick={() => setCurrentPhase(phase.id)}
              className="flex flex-col items-center min-w-[80px]"
            >
              <div
                className={`w-12 h-12 rounded-xl flex items-center justify-center transition-all ${
                  isComplete
                    ? 'bg-emerald-500 text-white'
                    : isActive
                    ? 'bg-[#00bfff] text-[#0B1220]'
                    : 'bg-white/10 text-slate-400'
                }`}
              >
                {isComplete ? <CheckCircle2 size={24} /> : <phase.icon size={24} />}
              </div>
              <span
                className={`text-[10px] font-bold uppercase tracking-widest mt-2 ${
                  isActive ? 'text-[#00bfff]' : 'text-slate-500'
                }`}
              >
                {phase.name}
              </span>
              <span className="text-[10px] text-slate-600">
                {completed}/{total}
              </span>
              {idx < PHASES.length - 1 && (
                <div
                  className={`absolute left-full top-6 w-full h-0.5 -translate-y-1/2 ${
                    isComplete ? 'bg-emerald-500' : 'bg-white/10'
                  }`}
                  style={{ display: 'none' }}
                />
              )}
            </button>
          );
        })}
      </motion.div>

      {/* Current Phase Details */}
      <AnimatePresence mode="wait">
        {PHASES.map(
          (phase) =>
            progress.currentPhase === phase.id && (
              <motion.div
                key={phase.id}
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -20 }}
                className="rounded-2xl border border-white/10 bg-white/5 backdrop-blur-xl p-6"
              >
                <div className="flex items-center justify-between mb-6">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-xl bg-[#00bfff]/10 flex items-center justify-center">
                      <phase.icon size={20} className="text-[#00bfff]" />
                    </div>
                    <div>
                      <h2 className="text-xl font-bold text-white">{phase.name}</h2>
                      <p className="text-xs text-slate-500">
                        {getPhaseProgress(phase).completed} of {getPhaseProgress(phase).total} complete
                      </p>
                    </div>
                  </div>

                  {phase.id === 1 && (
                    <button
                      onClick={() => setIsBrandModalOpen(true)}
                      className="flex items-center gap-2 px-4 py-2 bg-[#00bfff] text-[#0B1220] rounded-xl text-sm font-bold uppercase tracking-wider hover:bg-[#00bfff]/90 transition-colors"
                    >
                      Configure Brand
                      <ChevronRight size={16} />
                    </button>
                  )}
                </div>

                <div className="space-y-3">
                  {phase.items.map((item, idx) => {
                    const isComplete = progress.completedItems.includes(item.id);

                    return (
                      <motion.div
                        key={item.id}
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: idx * 0.1 }}
                        onClick={() => handleItemToggle(item.id)}
                        className={`flex items-center gap-4 p-4 rounded-xl border transition-all cursor-pointer ${
                          isComplete
                            ? 'border-emerald-500/30 bg-emerald-500/5'
                            : 'border-white/10 bg-white/5 hover:border-white/20'
                        }`}
                      >
                        <div
                          className={`w-6 h-6 rounded-full flex items-center justify-center ${
                            isComplete
                              ? 'bg-emerald-500 text-white'
                              : 'bg-white/10 text-slate-500'
                          }`}
                        >
                          {isComplete ? (
                            <CheckCircle2 size={16} />
                          ) : (
                            <Circle size={16} />
                          )}
                        </div>
                        <div className="flex-1">
                          <p
                            className={`font-semibold ${
                              isComplete ? 'text-emerald-400' : 'text-white'
                            }`}
                          >
                            {item.label}
                          </p>
                          <p className="text-xs text-slate-500">{item.description}</p>
                        </div>
                        {isComplete && (
                          <span className="text-[10px] font-bold uppercase tracking-widest text-emerald-400">
                            Done
                          </span>
                        )}
                      </motion.div>
                    );
                  })}
                </div>

                {/* Phase Navigation */}
                <div className="flex items-center justify-between mt-6 pt-6 border-t border-white/10">
                  <button
                    onClick={() => setCurrentPhase(Math.max(0, progress.currentPhase - 1))}
                    disabled={progress.currentPhase === 0}
                    className={`px-4 py-2 rounded-xl text-sm font-semibold ${
                      progress.currentPhase === 0
                        ? 'text-slate-600 cursor-not-allowed'
                        : 'text-white hover:bg-white/10'
                    }`}
                  >
                    Previous
                  </button>
                  <button
                    onClick={() =>
                      setCurrentPhase(Math.min(PHASES.length - 1, progress.currentPhase + 1))
                    }
                    disabled={progress.currentPhase === PHASES.length - 1}
                    className={`px-4 py-2 rounded-xl text-sm font-semibold ${
                      progress.currentPhase === PHASES.length - 1
                        ? 'text-slate-600 cursor-not-allowed'
                        : 'bg-[#00bfff] text-[#0B1220] hover:bg-[#00bfff]/90'
                    }`}
                  >
                    Next Phase
                  </button>
                </div>
              </motion.div>
            )
        )}
      </AnimatePresence>

      {/* Brand Intake Modal */}
      <BrandIntakeModal
        isOpen={isBrandModalOpen}
        onClose={() => setIsBrandModalOpen(false)}
        onSave={handleBrandSave}
        initialData={progress.brandData}
      />
    </div>
  );
}
