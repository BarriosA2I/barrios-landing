'use client';

import { useUser } from '@clerk/nextjs';
import Link from 'next/link';
import { motion } from 'framer-motion';
import {
  Plus,
  Mic,
  Activity,
  CreditCard,
  LogOut
} from 'lucide-react';
import { useClerk } from '@clerk/nextjs';
import { useRouter } from 'next/navigation';

// Reusable Glass Card Component
const GlassCard = ({ children, className = "" }: { children: React.ReactNode, className?: string }) => (
  <div className={`relative overflow-hidden rounded-2xl border border-white/10 bg-white/5 backdrop-blur-xl transition-all duration-300 hover:border-white/20 ${className}`}>
    {children}
  </div>
);

// Metric Card Component with Progress Bar
const MetricCard = ({
  title,
  value,
  subtext,
  tag,
  tagColor,
  progress = 0
}: {
  title: string;
  value: string | number;
  subtext: string;
  tag: string;
  tagColor: string;
  progress?: number;
}) => (
  <GlassCard className="p-6">
    <div className="flex items-center justify-between mb-4">
      <span className="text-xs font-semibold uppercase tracking-wider text-slate-400">{title}</span>
      <span className={`rounded-full px-2 py-0.5 text-[10px] font-bold uppercase tracking-tight ${tagColor}`}>
        {tag}
      </span>
    </div>
    <div className="flex items-baseline gap-2">
      <span className="text-4xl font-bold text-white">{value}</span>
      <span className="text-sm text-slate-500">{subtext}</span>
    </div>
    <div className="mt-4 h-1 w-full overflow-hidden rounded-full bg-white/5">
      <motion.div
        initial={{ width: 0 }}
        animate={{ width: `${progress}%` }}
        transition={{ duration: 1, ease: "easeOut" }}
        className="h-full bg-gradient-to-r from-[#00bfff] to-[#ffd700]"
      />
    </div>
  </GlassCard>
);

export default function DashboardPage() {
  const { user, isLoaded } = useUser();
  const { signOut } = useClerk();
  const router = useRouter();

  const handleSignOut = async () => {
    await signOut();
    router.push('/');
  };

  if (!isLoaded) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <div className="animate-spin h-8 w-8 border-2 border-[#00bfff] border-t-transparent rounded-full" />
      </div>
    );
  }

  return (
    <div className="space-y-10">
      {/* Header */}
      <header className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-4xl font-bold tracking-tight text-white">
            Welcome back, <span className="text-[#00bfff]">{user?.firstName || 'there'}</span>
          </h1>
          <p className="mt-2 text-slate-400">
            Manage your Commercial Lab productions and Nexus installations.
          </p>
        </div>
        <button
          onClick={handleSignOut}
          className="flex items-center gap-2 rounded-full border border-[#00bfff]/30 bg-[#00bfff]/10 px-6 py-2.5 text-sm font-semibold text-[#00bfff] transition-all hover:bg-[#00bfff]/20"
        >
          <LogOut size={16} />
          Sign Out
        </button>
      </header>

      {/* Metrics Grid */}
      <div className="grid grid-cols-1 gap-6 md:grid-cols-3">
        <MetricCard
          title="Token Balance"
          value="0"
          subtext="tokens remaining"
          tag="Commercial Lab"
          tagColor="bg-[#00bfff]/20 text-[#00bfff]"
          progress={5}
        />
        <MetricCard
          title="Active Productions"
          value="0"
          subtext="videos processing"
          tag="In Progress"
          tagColor="bg-purple-500/20 text-purple-400"
          progress={0}
        />
        <MetricCard
          title="Nexus Installation"
          value="Inactive"
          subtext="configure now"
          tag="Not Started"
          tagColor="bg-[#ffd700]/20 text-[#ffd700]"
          progress={0}
        />
      </div>

      {/* Quick Actions */}
      <section>
        <h2 className="mb-6 text-sm font-semibold uppercase tracking-widest text-slate-500">
          Quick Actions
        </h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {[
            { label: "New Production", icon: Plus, desc: "Start a video project", href: "/dashboard/lab" },
            { label: "Voice Clone", icon: Mic, desc: "Create a voice profile", href: "/dashboard/lab" },
            { label: "Nexus Status", icon: Activity, desc: "Check system health", href: "/dashboard/nexus" },
            { label: "Billing", icon: CreditCard, desc: "Manage subscriptions", href: "/dashboard/billing" },
          ].map((action, i) => (
            <Link key={i} href={action.href} className="group relative text-left outline-none">
              <GlassCard className="p-6 h-full group-hover:bg-white/10">
                <div className="mb-4 inline-flex h-12 w-12 items-center justify-center rounded-xl bg-gradient-to-br from-[#00bfff]/20 to-transparent text-[#00bfff] border border-[#00bfff]/20">
                  <action.icon size={24} />
                </div>
                <h3 className="font-bold text-white">{action.label}</h3>
                <p className="text-xs text-slate-500">{action.desc}</p>
              </GlassCard>
            </Link>
          ))}
        </div>
      </section>

      {/* Recent Activity Placeholder */}
      <section>
        <h2 className="mb-6 text-sm font-semibold uppercase tracking-widest text-slate-500">
          Recent Activity
        </h2>
        <GlassCard className="p-8">
          <div className="flex flex-col items-center justify-center py-8 text-center">
            <div className="mb-4 h-16 w-16 rounded-2xl bg-white/5 border border-white/10 flex items-center justify-center">
              <Activity size={32} className="text-slate-600" />
            </div>
            <h3 className="text-lg font-semibold text-white mb-2">No Recent Activity</h3>
            <p className="text-sm text-slate-500 max-w-md">
              Start your first production in the Commercial Lab or configure your NEXUS installation to see activity here.
            </p>
            <Link
              href="/dashboard/lab"
              className="mt-6 px-6 py-3 rounded-xl bg-gradient-to-r from-[#00bfff] to-[#ffd700] text-[#0B1220] font-bold text-sm uppercase tracking-tighter hover:scale-105 transition-transform"
            >
              Start Your First Project
            </Link>
          </div>
        </GlassCard>
      </section>
    </div>
  );
}
