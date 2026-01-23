'use client';

import { motion } from 'framer-motion';
import {
  LogIn,
  Video,
  CreditCard,
  Settings,
  Mic2,
  Shield,
  CheckCircle,
  Clock
} from 'lucide-react';

interface Activity {
  id: string;
  type: 'LOGIN' | 'PRODUCTION' | 'PAYMENT' | 'SETTINGS' | 'CLONE' | 'SECURITY' | 'MILESTONE';
  title: string;
  description?: string;
  timestamp: Date;
  metadata?: Record<string, string | number>;
}

interface ActivityTimelineProps {
  activities: Activity[];
}

const activityConfig = {
  LOGIN: {
    icon: LogIn,
    color: 'text-slate-400',
    bg: 'bg-slate-500/10',
    borderColor: 'border-slate-500/30'
  },
  PRODUCTION: {
    icon: Video,
    color: 'text-purple-400',
    bg: 'bg-purple-500/10',
    borderColor: 'border-purple-500/30'
  },
  PAYMENT: {
    icon: CreditCard,
    color: 'text-green-400',
    bg: 'bg-green-500/10',
    borderColor: 'border-green-500/30'
  },
  SETTINGS: {
    icon: Settings,
    color: 'text-slate-400',
    bg: 'bg-slate-500/10',
    borderColor: 'border-slate-500/30'
  },
  CLONE: {
    icon: Mic2,
    color: 'text-[#FFD700]',
    bg: 'bg-[#FFD700]/10',
    borderColor: 'border-[#FFD700]/30'
  },
  SECURITY: {
    icon: Shield,
    color: 'text-cyan-400',
    bg: 'bg-cyan-500/10',
    borderColor: 'border-cyan-500/30'
  },
  MILESTONE: {
    icon: CheckCircle,
    color: 'text-[#00CED1]',
    bg: 'bg-[#00CED1]/10',
    borderColor: 'border-[#00CED1]/30'
  },
};

function formatRelativeTime(date: Date): string {
  const now = new Date();
  const diffMs = now.getTime() - date.getTime();
  const diffMins = Math.floor(diffMs / (1000 * 60));
  const diffHours = Math.floor(diffMs / (1000 * 60 * 60));
  const diffDays = Math.floor(diffMs / (1000 * 60 * 60 * 24));

  if (diffMins < 1) return 'Just now';
  if (diffMins < 60) return `${diffMins}m ago`;
  if (diffHours < 24) return `${diffHours}h ago`;
  if (diffDays < 7) return `${diffDays}d ago`;
  return date.toLocaleDateString('en-US', { month: 'short', day: 'numeric' });
}

const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: { staggerChildren: 0.1, delayChildren: 0.4 }
  }
};

const itemVariants = {
  hidden: { x: -20, opacity: 0 },
  visible: { x: 0, opacity: 1, transition: { duration: 0.4 } }
};

export default function ActivityTimeline({ activities }: ActivityTimelineProps) {
  if (!activities || activities.length === 0) {
    return (
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.4 }}
        className="relative overflow-hidden rounded-2xl border border-white/10 bg-white/5 backdrop-blur-xl p-6"
      >
        <h2 className="text-lg font-black uppercase tracking-tight mb-6 flex items-center gap-2">
          <Clock className="w-5 h-5 text-[#00CED1]" />
          Recent Activity
        </h2>
        <div className="flex flex-col items-center justify-center py-12 text-slate-500">
          <Clock className="w-12 h-12 mb-4 opacity-50" />
          <p className="text-sm">No recent activity</p>
          <p className="text-xs mt-1 text-slate-600">Your activity will appear here</p>
        </div>
      </motion.div>
    );
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 0.4 }}
      className="relative overflow-hidden rounded-2xl border border-white/10 bg-white/5 backdrop-blur-xl p-6"
    >
      {/* Header */}
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-lg font-black uppercase tracking-tight flex items-center gap-2">
          <Clock className="w-5 h-5 text-[#00CED1]" />
          Recent Activity
        </h2>
        <span className="text-xs text-slate-500">{activities.length} events</span>
      </div>

      {/* Timeline */}
      <motion.div
        variants={containerVariants}
        initial="hidden"
        animate="visible"
        className="space-y-4"
      >
        {activities.slice(0, 5).map((activity, index) => {
          const config = activityConfig[activity.type];
          const Icon = config.icon;

          return (
            <motion.div
              key={activity.id}
              variants={itemVariants}
              className="relative flex gap-4 group"
            >
              {/* Timeline line */}
              {index < activities.length - 1 && (
                <div className="absolute left-5 top-10 w-px h-full bg-gradient-to-b from-white/10 to-transparent" />
              )}

              {/* Icon */}
              <div className={`relative z-10 flex-shrink-0 w-10 h-10 rounded-xl ${config.bg} ${config.color} flex items-center justify-center border ${config.borderColor}`}>
                <Icon className="w-4 h-4" />
              </div>

              {/* Content */}
              <div className="flex-1 min-w-0 pb-4">
                <div className="flex items-start justify-between gap-2">
                  <div>
                    <p className="font-medium text-sm text-slate-200 group-hover:text-white transition-colors">
                      {activity.title}
                    </p>
                    {activity.description && (
                      <p className="text-xs text-slate-500 mt-0.5 truncate">
                        {activity.description}
                      </p>
                    )}
                  </div>
                  <span className="text-[10px] text-slate-600 whitespace-nowrap">
                    {formatRelativeTime(new Date(activity.timestamp))}
                  </span>
                </div>
              </div>
            </motion.div>
          );
        })}
      </motion.div>

      {/* View all link */}
      {activities.length > 5 && (
        <div className="mt-4 pt-4 border-t border-white/5">
          <button className="text-sm text-[#00CED1] hover:text-[#00CED1]/80 transition-colors font-medium">
            View all activity
          </button>
        </div>
      )}
    </motion.div>
  );
}
