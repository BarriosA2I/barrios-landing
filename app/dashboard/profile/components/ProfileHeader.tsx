'use client';

import { motion } from 'framer-motion';
import { useUser, useClerk } from '@clerk/nextjs';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { Settings, LogOut, Crown, Zap, Shield } from 'lucide-react';

interface ProfileHeaderProps {
  subscription?: {
    tier: 'FREE' | 'STARTER' | 'CREATOR' | 'GROWTH' | 'SCALE';
    status: 'ACTIVE' | 'PAST_DUE' | 'CANCELLED';
  };
}

const tierConfig = {
  FREE: { label: 'Free Tier', color: 'text-slate-400', bg: 'bg-slate-500/10', border: 'border-slate-500/30', icon: null },
  STARTER: { label: 'Starter', color: 'text-cyan-400', bg: 'bg-cyan-500/10', border: 'border-cyan-500/30', icon: Zap },
  CREATOR: { label: 'Creator', color: 'text-purple-400', bg: 'bg-purple-500/10', border: 'border-purple-500/30', icon: Zap },
  GROWTH: { label: 'Growth', color: 'text-amber-400', bg: 'bg-amber-500/10', border: 'border-amber-500/30', icon: Crown },
  SCALE: { label: 'Scale', color: 'text-[#FFD700]', bg: 'bg-[#FFD700]/10', border: 'border-[#FFD700]/30', icon: Crown },
};

export default function ProfileHeader({ subscription }: ProfileHeaderProps) {
  const { user, isLoaded } = useUser();
  const { signOut } = useClerk();
  const router = useRouter();

  const handleSignOut = async () => {
    await signOut();
    router.push('/');
  };

  if (!isLoaded) {
    return (
      <div className="relative overflow-hidden rounded-2xl border border-white/10 bg-white/5 backdrop-blur-xl p-8">
        <div className="flex items-center justify-center min-h-[200px]">
          <div className="animate-spin h-8 w-8 border-2 border-[#00CED1] border-t-transparent rounded-full" />
        </div>
      </div>
    );
  }

  const createdAt = user?.createdAt
    ? new Date(user.createdAt).toLocaleDateString('en-US', {
        year: 'numeric',
        month: 'long',
        day: 'numeric'
      })
    : 'Unknown';

  const tier = subscription?.tier || 'FREE';
  const config = tierConfig[tier];
  const TierIcon = config.icon;

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      className="relative overflow-hidden rounded-2xl border border-white/10 bg-white/5 backdrop-blur-xl"
    >
      {/* Decorative corner elements */}
      <div className="absolute top-0 left-0 w-16 h-16 border-l-2 border-t-2 border-[#00CED1]/30 rounded-tl-2xl" />
      <div className="absolute top-0 right-0 w-16 h-16 border-r-2 border-t-2 border-[#00CED1]/30 rounded-tr-2xl" />
      <div className="absolute bottom-0 left-0 w-16 h-16 border-l-2 border-b-2 border-[#00CED1]/30 rounded-bl-2xl" />
      <div className="absolute bottom-0 right-0 w-16 h-16 border-r-2 border-b-2 border-[#00CED1]/30 rounded-br-2xl" />

      {/* Glow effect */}
      <div className="absolute -top-24 -right-24 w-48 h-48 bg-[#00CED1]/10 rounded-full blur-3xl" />

      <div className="relative p-8">
        <div className="flex flex-col md:flex-row items-center md:items-start gap-6">
          {/* Avatar with animated ring */}
          <div className="relative">
            <motion.div
              animate={{ rotate: 360 }}
              transition={{ duration: 20, repeat: Infinity, ease: "linear" }}
              className="absolute -inset-1 rounded-full bg-gradient-to-r from-[#00CED1] via-purple-500 to-[#FFD700] opacity-50 blur-sm"
            />
            <div className="relative">
              <img
                src={user?.imageUrl || '/default-avatar.png'}
                alt={user?.fullName || 'User avatar'}
                className="w-32 h-32 rounded-full border-4 border-[#0B1220] object-cover relative z-10"
              />
              {/* Online status */}
              <motion.div
                initial={{ scale: 0 }}
                animate={{ scale: 1 }}
                transition={{ delay: 0.3, type: "spring" }}
                className="absolute -bottom-1 -right-1 z-20"
              >
                <div className="relative">
                  <div className="w-6 h-6 bg-green-500 rounded-full border-4 border-[#0B1220]" />
                  <div className="absolute inset-0 bg-green-500 rounded-full animate-ping opacity-50" />
                </div>
              </motion.div>
            </div>
          </div>

          {/* User Info */}
          <div className="flex-1 text-center md:text-left space-y-3">
            <motion.h1
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.2 }}
              className="text-3xl font-black uppercase tracking-tight"
            >
              {user?.fullName || user?.firstName || 'User'}
            </motion.h1>

            <motion.p
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.3 }}
              className="text-slate-400"
            >
              {user?.primaryEmailAddress?.emailAddress || 'No email'}
            </motion.p>

            <motion.div
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.4 }}
              className="flex items-center gap-2 justify-center md:justify-start text-sm text-slate-500"
            >
              <Shield className="w-4 h-4" />
              <span>Member since {createdAt}</span>
            </motion.div>

            {/* Subscription Badge */}
            <motion.div
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: 0.5, type: "spring" }}
              className="flex items-center gap-3 justify-center md:justify-start mt-4"
            >
              <span className={`inline-flex items-center gap-2 px-4 py-1.5 rounded-full text-sm font-bold ${config.bg} ${config.color} ${config.border} border`}>
                {TierIcon && <TierIcon className="w-4 h-4" />}
                {config.label}
              </span>
              {tier === 'FREE' && (
                <Link
                  href="/dashboard/billing"
                  className="text-sm text-[#00CED1] hover:text-[#00CED1]/80 transition-colors font-medium"
                >
                  Upgrade
                </Link>
              )}
            </motion.div>
          </div>

          {/* Actions */}
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.4 }}
            className="flex flex-col gap-3"
          >
            <Link
              href="/dashboard/settings"
              className="group flex items-center gap-2 px-6 py-2.5 rounded-xl border border-white/10 bg-white/5 hover:border-[#00CED1]/50 hover:bg-[#00CED1]/5 transition-all duration-300"
            >
              <Settings className="w-4 h-4 text-slate-400 group-hover:text-[#00CED1] transition-colors" />
              <span className="group-hover:text-[#00CED1] transition-colors">Settings</span>
            </Link>
            <button
              onClick={handleSignOut}
              className="group flex items-center gap-2 px-6 py-2.5 rounded-xl border border-red-500/20 bg-red-500/5 hover:border-red-500/50 hover:bg-red-500/10 text-red-400 transition-all duration-300"
            >
              <LogOut className="w-4 h-4" />
              <span>Sign Out</span>
            </button>
          </motion.div>
        </div>
      </div>
    </motion.div>
  );
}
