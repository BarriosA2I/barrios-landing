'use client';

import { motion } from 'framer-motion';
import { Coins, Video, Mic2, Brain, TrendingUp } from 'lucide-react';

interface StatsData {
  tokensUsed: number;
  tokensTotal: number;
  productions: number;
  voiceClones: number;
  nexusStatus: 'ACTIVE' | 'INACTIVE' | 'PENDING' | null;
}

interface StatsGridProps {
  stats: StatsData;
}

const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: { staggerChildren: 0.1, delayChildren: 0.3 }
  }
};

const itemVariants = {
  hidden: { y: 20, opacity: 0 },
  visible: { y: 0, opacity: 1, transition: { duration: 0.5 } }
};

function StatCard({
  icon: Icon,
  label,
  value,
  subtext,
  progress,
  color = 'cyan',
  delay = 0
}: {
  icon: React.ElementType;
  label: string;
  value: string | number;
  subtext?: string;
  progress?: number;
  color?: 'cyan' | 'purple' | 'gold' | 'green';
  delay?: number;
}) {
  const colorConfig = {
    cyan: {
      text: 'text-[#00CED1]',
      bg: 'bg-[#00CED1]',
      glow: 'shadow-[#00CED1]/20',
      gradient: 'from-[#00CED1] to-cyan-600'
    },
    purple: {
      text: 'text-purple-400',
      bg: 'bg-purple-500',
      glow: 'shadow-purple-500/20',
      gradient: 'from-purple-500 to-pink-500'
    },
    gold: {
      text: 'text-[#FFD700]',
      bg: 'bg-[#FFD700]',
      glow: 'shadow-[#FFD700]/20',
      gradient: 'from-[#FFD700] to-amber-600'
    },
    green: {
      text: 'text-green-400',
      bg: 'bg-green-500',
      glow: 'shadow-green-500/20',
      gradient: 'from-green-500 to-emerald-600'
    }
  };

  const config = colorConfig[color];

  return (
    <motion.div
      variants={itemVariants}
      whileHover={{ scale: 1.02, y: -4 }}
      className="relative overflow-hidden rounded-2xl border border-white/10 bg-white/5 backdrop-blur-xl p-6 group transition-all duration-300 hover:border-white/20"
    >
      {/* Glow on hover */}
      <div className={`absolute -top-12 -right-12 w-24 h-24 ${config.bg} rounded-full blur-3xl opacity-0 group-hover:opacity-20 transition-opacity duration-500`} />

      {/* Icon */}
      <div className={`inline-flex items-center justify-center w-10 h-10 rounded-xl ${config.bg}/10 ${config.text} mb-4`}>
        <Icon className="w-5 h-5" />
      </div>

      {/* Label */}
      <div className="text-[10px] font-bold uppercase tracking-widest text-slate-500 mb-2">
        {label}
      </div>

      {/* Value */}
      <motion.div
        initial={{ opacity: 0, scale: 0.5 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ delay: delay + 0.2, type: "spring" }}
        className={`text-3xl font-black tracking-tight ${config.text}`}
      >
        {value}
      </motion.div>

      {/* Subtext */}
      {subtext && (
        <div className="text-xs text-slate-500 mt-1">{subtext}</div>
      )}

      {/* Progress bar */}
      {progress !== undefined && (
        <div className="mt-4">
          <div className="h-1.5 overflow-hidden rounded-full bg-white/10">
            <motion.div
              className={`h-full rounded-full bg-gradient-to-r ${config.gradient}`}
              initial={{ width: 0 }}
              animate={{ width: `${Math.min(progress, 100)}%` }}
              transition={{ duration: 1, ease: "easeOut", delay: delay + 0.3 }}
            />
          </div>
          <div className="flex justify-between mt-1.5 text-[10px] text-slate-500">
            <span>{progress.toFixed(0)}% used</span>
            <span>{(100 - progress).toFixed(0)}% remaining</span>
          </div>
        </div>
      )}
    </motion.div>
  );
}

export default function StatsGrid({ stats }: StatsGridProps) {
  const tokenProgress = stats.tokensTotal > 0
    ? (stats.tokensUsed / stats.tokensTotal) * 100
    : 0;

  const nexusStatusConfig = {
    ACTIVE: { label: 'Active', color: 'text-green-400' },
    INACTIVE: { label: 'Inactive', color: 'text-slate-500' },
    PENDING: { label: 'Pending', color: 'text-amber-400' },
    null: { label: '—', color: 'text-slate-500' }
  };

  const nexusConfig = nexusStatusConfig[stats.nexusStatus || 'null'];

  return (
    <motion.div
      variants={containerVariants}
      initial="hidden"
      animate="visible"
      className="grid grid-cols-2 lg:grid-cols-4 gap-4"
    >
      <StatCard
        icon={Coins}
        label="Tokens Used"
        value={stats.tokensUsed.toLocaleString()}
        subtext={stats.tokensTotal > 0 ? `of ${stats.tokensTotal.toLocaleString()}` : 'No allocation'}
        progress={stats.tokensTotal > 0 ? tokenProgress : undefined}
        color="cyan"
        delay={0}
      />
      <StatCard
        icon={Video}
        label="Productions"
        value={stats.productions}
        subtext="Videos created"
        color="purple"
        delay={0.1}
      />
      <StatCard
        icon={Mic2}
        label="Voice Clones"
        value={stats.voiceClones}
        subtext="Active clones"
        color="gold"
        delay={0.2}
      />
      <motion.div
        variants={itemVariants}
        whileHover={{ scale: 1.02, y: -4 }}
        className="relative overflow-hidden rounded-2xl border border-white/10 bg-white/5 backdrop-blur-xl p-6 group transition-all duration-300 hover:border-white/20"
      >
        <div className="inline-flex items-center justify-center w-10 h-10 rounded-xl bg-green-500/10 text-green-400 mb-4">
          <Brain className="w-5 h-5" />
        </div>
        <div className="text-[10px] font-bold uppercase tracking-widest text-slate-500 mb-2">
          NEXUS Status
        </div>
        <div className={`text-3xl font-black tracking-tight ${nexusConfig.color}`}>
          {nexusConfig.label}
        </div>
        {stats.nexusStatus === 'ACTIVE' && (
          <div className="flex items-center gap-1.5 mt-2 text-xs text-green-400">
            <TrendingUp className="w-3 h-3" />
            <span>All systems operational</span>
          </div>
        )}
      </motion.div>
    </motion.div>
  );
}
