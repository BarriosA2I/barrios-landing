'use client';

import { motion } from 'framer-motion';
import { LucideIcon } from 'lucide-react';

interface KPICardProps {
  title: string;
  value: string | number;
  change?: {
    value: number;
    label: string;
  };
  icon: LucideIcon;
  color?: 'cyan' | 'gold' | 'green' | 'red';
  index?: number;
}

const colorClasses = {
  cyan: {
    icon: 'text-[#00bfff]',
    bg: 'bg-[#00bfff]/10',
    border: 'border-[#00bfff]/20',
    glow: 'shadow-[0_0_20px_rgba(0,191,255,0.1)]',
  },
  gold: {
    icon: 'text-[#ffd700]',
    bg: 'bg-[#ffd700]/10',
    border: 'border-[#ffd700]/20',
    glow: 'shadow-[0_0_20px_rgba(255,215,0,0.1)]',
  },
  green: {
    icon: 'text-emerald-400',
    bg: 'bg-emerald-400/10',
    border: 'border-emerald-400/20',
    glow: 'shadow-[0_0_20px_rgba(52,211,153,0.1)]',
  },
  red: {
    icon: 'text-red-400',
    bg: 'bg-red-400/10',
    border: 'border-red-400/20',
    glow: 'shadow-[0_0_20px_rgba(248,113,113,0.1)]',
  },
};

export default function KPICard({
  title,
  value,
  change,
  icon: Icon,
  color = 'cyan',
  index = 0,
}: KPICardProps) {
  const colors = colorClasses[color];

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: index * 0.1 }}
      className={`rounded-2xl border ${colors.border} bg-white/5 backdrop-blur-xl p-6 ${colors.glow}`}
    >
      <div className="flex items-start justify-between">
        <div>
          <p className="text-[10px] font-bold uppercase tracking-widest text-slate-500">
            {title}
          </p>
          <p className="text-3xl font-black text-white mt-2 tracking-tight">
            {value}
          </p>
          {change && (
            <div className="flex items-center gap-1 mt-2">
              <span
                className={`text-sm font-semibold ${
                  change.value >= 0 ? 'text-emerald-400' : 'text-red-400'
                }`}
              >
                {change.value >= 0 ? '+' : ''}
                {change.value}%
              </span>
              <span className="text-xs text-slate-500">{change.label}</span>
            </div>
          )}
        </div>
        <div className={`p-3 rounded-xl ${colors.bg}`}>
          <Icon size={24} className={colors.icon} />
        </div>
      </div>
    </motion.div>
  );
}
