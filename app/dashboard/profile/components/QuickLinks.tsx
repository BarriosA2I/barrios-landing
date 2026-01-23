'use client';

import { motion } from 'framer-motion';
import Link from 'next/link';
import {
  CreditCard,
  Settings,
  HelpCircle,
  Video,
  Brain,
  BarChart3,
  ChevronRight
} from 'lucide-react';

interface QuickLink {
  href: string;
  icon: React.ElementType;
  title: string;
  description: string;
  color: 'cyan' | 'purple' | 'gold' | 'green';
}

const links: QuickLink[] = [
  {
    href: '/dashboard/billing',
    icon: CreditCard,
    title: 'Billing & Subscription',
    description: 'Manage your plan and payments',
    color: 'green'
  },
  {
    href: '/dashboard/settings',
    icon: Settings,
    title: 'Account Settings',
    description: 'Update profile and preferences',
    color: 'cyan'
  },
  {
    href: '/dashboard/support',
    icon: HelpCircle,
    title: 'Support',
    description: 'Get help and contact us',
    color: 'purple'
  },
  {
    href: '/dashboard/lab',
    icon: Video,
    title: 'Commercial Lab',
    description: 'Video production studio',
    color: 'purple'
  },
  {
    href: '/dashboard/nexus',
    icon: Brain,
    title: 'NEXUS Personal',
    description: 'Your AI assistant',
    color: 'cyan'
  },
  {
    href: '/dashboard/analytics',
    icon: BarChart3,
    title: 'Analytics',
    description: 'View your usage stats',
    color: 'gold'
  }
];

const colorConfig = {
  cyan: {
    hoverBorder: 'hover:border-[#00CED1]/50',
    hoverBg: 'hover:bg-[#00CED1]/5',
    iconBg: 'bg-[#00CED1]/10',
    iconColor: 'text-[#00CED1]',
    glow: 'group-hover:shadow-[#00CED1]/10'
  },
  purple: {
    hoverBorder: 'hover:border-purple-500/50',
    hoverBg: 'hover:bg-purple-500/5',
    iconBg: 'bg-purple-500/10',
    iconColor: 'text-purple-400',
    glow: 'group-hover:shadow-purple-500/10'
  },
  gold: {
    hoverBorder: 'hover:border-[#FFD700]/50',
    hoverBg: 'hover:bg-[#FFD700]/5',
    iconBg: 'bg-[#FFD700]/10',
    iconColor: 'text-[#FFD700]',
    glow: 'group-hover:shadow-[#FFD700]/10'
  },
  green: {
    hoverBorder: 'hover:border-green-500/50',
    hoverBg: 'hover:bg-green-500/5',
    iconBg: 'bg-green-500/10',
    iconColor: 'text-green-400',
    glow: 'group-hover:shadow-green-500/10'
  }
};

const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: { staggerChildren: 0.05, delayChildren: 0.6 }
  }
};

const itemVariants = {
  hidden: { y: 10, opacity: 0 },
  visible: { y: 0, opacity: 1, transition: { duration: 0.3 } }
};

export default function QuickLinks() {
  return (
    <motion.div
      variants={containerVariants}
      initial="hidden"
      animate="visible"
      className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4"
    >
      {links.map((link) => {
        const Icon = link.icon;
        const config = colorConfig[link.color];

        return (
          <motion.div key={link.href} variants={itemVariants}>
            <Link
              href={link.href}
              className={`group relative overflow-hidden flex items-center gap-4 p-4 rounded-xl border border-white/10 bg-white/5 backdrop-blur-sm ${config.hoverBorder} ${config.hoverBg} transition-all duration-300 shadow-lg ${config.glow}`}
            >
              {/* Icon */}
              <div className={`flex-shrink-0 w-12 h-12 rounded-xl ${config.iconBg} ${config.iconColor} flex items-center justify-center transition-transform duration-300 group-hover:scale-110`}>
                <Icon className="w-5 h-5" />
              </div>

              {/* Content */}
              <div className="flex-1 min-w-0">
                <h3 className="font-semibold text-sm text-slate-200 group-hover:text-white transition-colors">
                  {link.title}
                </h3>
                <p className="text-xs text-slate-500 mt-0.5 truncate">
                  {link.description}
                </p>
              </div>

              {/* Arrow */}
              <ChevronRight className="w-4 h-4 text-slate-600 group-hover:text-slate-400 transition-all duration-300 group-hover:translate-x-1" />

              {/* Hover glow effect */}
              <div className={`absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-500 pointer-events-none`}>
                <div className={`absolute -top-8 -right-8 w-16 h-16 ${config.iconBg} rounded-full blur-2xl`} />
              </div>
            </Link>
          </motion.div>
        );
      })}
    </motion.div>
  );
}
