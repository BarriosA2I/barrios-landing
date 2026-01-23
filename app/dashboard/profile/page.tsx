'use client';

import { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import ProfileHeader from './components/ProfileHeader';
import StatsGrid from './components/StatsGrid';
import ActivityTimeline from './components/ActivityTimeline';
import AccountDetails from './components/AccountDetails';
import QuickLinks from './components/QuickLinks';

interface ProfileData {
  subscription: {
    tier: 'FREE' | 'STARTER' | 'CREATOR' | 'GROWTH' | 'SCALE';
    status: 'ACTIVE' | 'PAST_DUE' | 'CANCELLED';
    billingCycle?: 'MONTHLY' | 'YEARLY';
    nextBillingDate?: Date;
  } | null;
  stats: {
    tokensUsed: number;
    tokensTotal: number;
    productions: number;
    voiceClones: number;
    nexusStatus: 'ACTIVE' | 'INACTIVE' | 'PENDING' | null;
  };
  activities: Array<{
    id: string;
    type: 'LOGIN' | 'PRODUCTION' | 'PAYMENT' | 'SETTINGS' | 'CLONE' | 'SECURITY' | 'MILESTONE';
    title: string;
    description?: string;
    timestamp: Date;
  }>;
}

export default function ProfilePage() {
  const [profileData, setProfileData] = useState<ProfileData | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    async function fetchProfileData() {
      try {
        const response = await fetch('/api/user/profile');
        if (!response.ok) {
          throw new Error('Failed to fetch profile data');
        }
        const data = await response.json();
        setProfileData(data);
      } catch (err) {
        console.error('Error fetching profile:', err);
        setError('Failed to load profile data');
        // Set default values on error
        setProfileData({
          subscription: null,
          stats: {
            tokensUsed: 0,
            tokensTotal: 0,
            productions: 0,
            voiceClones: 0,
            nexusStatus: null
          },
          activities: []
        });
      } finally {
        setLoading(false);
      }
    }

    fetchProfileData();
  }, []);

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[600px]">
        <div className="text-center">
          <div className="relative w-16 h-16 mx-auto mb-4">
            <div className="absolute inset-0 rounded-full border-2 border-[#00CED1]/20" />
            <div className="absolute inset-0 rounded-full border-2 border-[#00CED1] border-t-transparent animate-spin" />
          </div>
          <p className="text-slate-500 text-sm">Loading profile...</p>
        </div>
      </div>
    );
  }

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.3 }}
      className="space-y-6 max-w-6xl mx-auto pb-8"
    >
      {/* Page Title */}
      <motion.div
        initial={{ opacity: 0, y: -10 }}
        animate={{ opacity: 1, y: 0 }}
        className="mb-2"
      >
        <h1 className="text-2xl font-black uppercase tracking-tight">
          <span className="text-[#00CED1]">Your</span> Profile
        </h1>
        <p className="text-sm text-slate-500 mt-1">
          Manage your account and view your activity
        </p>
      </motion.div>

      {/* Error Banner */}
      {error && (
        <motion.div
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          className="p-4 rounded-xl border border-amber-500/30 bg-amber-500/10 text-amber-400 text-sm"
        >
          {error}. Showing default values.
        </motion.div>
      )}

      {/* Profile Header */}
      <ProfileHeader
        subscription={profileData?.subscription ? {
          tier: profileData.subscription.tier,
          status: profileData.subscription.status
        } : undefined}
      />

      {/* Stats Grid */}
      <StatsGrid
        stats={profileData?.stats || {
          tokensUsed: 0,
          tokensTotal: 0,
          productions: 0,
          voiceClones: 0,
          nexusStatus: null
        }}
      />

      {/* Two Column Layout: Activity + Account Details */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <ActivityTimeline activities={profileData?.activities || []} />
        <AccountDetails
          subscription={profileData?.subscription ? {
            tier: profileData.subscription.tier,
            billingCycle: profileData.subscription.billingCycle,
            nextBillingDate: profileData.subscription.nextBillingDate
          } : undefined}
        />
      </div>

      {/* Quick Links */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.7 }}
      >
        <h2 className="text-lg font-black uppercase tracking-tight mb-4 flex items-center gap-2">
          <span className="w-2 h-2 rounded-full bg-[#00CED1]" />
          Quick Actions
        </h2>
        <QuickLinks />
      </motion.div>
    </motion.div>
  );
}
