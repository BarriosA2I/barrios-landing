'use client';

import { useState, useEffect } from 'react';
import { useUser } from '@clerk/nextjs';
import { motion } from 'framer-motion';
import { CreditCard, ArrowUpRight, Check, History, Zap, Sparkles, Loader2 } from 'lucide-react';
import { useTokenBalance } from '@/hooks/useTokenBalance';

// V2 Performance Engine - Stripe Price IDs
const TIER_PRICES: Record<string, string> = {
  prototyper: 'price_1SuxDoLyFGkLiU4CxxLjgoZq',  // $599/mo - 16 tokens
  growth: 'price_1SuxFnLyFGkLiU4CzqWvv9DR',      // $1,199/mo - 40 tokens
  scale: 'price_1SuxGQLyFGkLiU4CiDiAEkOD',       // $2,499/mo - 96 tokens
};

// Glass Card Component
const GlassCard = ({ children, className = "" }: { children: React.ReactNode, className?: string }) => (
  <div className={`relative overflow-hidden rounded-2xl border border-white/10 bg-white/5 backdrop-blur-xl transition-all duration-300 hover:border-white/20 ${className}`}>
    {children}
  </div>
);

// Plan Card Component
const PlanCard = ({
  tier,
  tierId,
  price,
  tokens,
  commercials,
  features,
  active = false,
  popular = false,
  onUpgrade,
  isLoading = false
}: {
  tier: string;
  tierId: string;
  price: string;
  tokens: number;
  commercials: number;
  features: string[];
  active?: boolean;
  popular?: boolean;
  onUpgrade: (tierId: string) => void;
  isLoading?: boolean;
}) => (
  <div className={`relative rounded-2xl border p-6 transition-all ${
    active ? "border-[#ffd700] bg-[#ffd700]/5 ring-1 ring-[#ffd700]" :
    popular ? "border-[#00bfff] bg-[#00bfff]/5" : "border-white/10 bg-white/5 hover:border-white/20"
  }`}>
    {active && (
      <span className="absolute -top-3 left-6 rounded-full bg-[#ffd700] px-3 py-1 text-[10px] font-black uppercase text-[#0B1220]">
        Current Plan
      </span>
    )}
    {popular && !active && (
      <span className="absolute -top-3 left-6 rounded-full bg-[#00bfff] px-3 py-1 text-[10px] font-black uppercase text-[#0B1220]">
        Most Popular
      </span>
    )}
    <h3 className="text-xl font-black text-white uppercase tracking-tighter">{tier}</h3>
    <div className="mt-2 flex items-baseline gap-1">
      <span className="text-3xl font-bold text-white">{price}</span>
      <span className="text-sm text-slate-500">/month</span>
    </div>
    <div className="mt-3 flex items-center gap-4 text-xs text-slate-400">
      <span className="flex items-center gap-1">
        <Zap size={12} className="text-[#ffd700]" />
        {tokens} tokens
      </span>
      <span className="flex items-center gap-1">
        <Sparkles size={12} className="text-[#00bfff]" />
        {commercials} commercials
      </span>
    </div>
    <ul className="mt-6 space-y-3">
      {features.map((f, i) => (
        <li key={i} className="flex items-center gap-2 text-xs text-slate-300">
          <Check size={14} className="text-[#00bfff]" /> {f}
        </li>
      ))}
    </ul>
    <button
      onClick={() => !active && !isLoading && onUpgrade(tierId)}
      disabled={active || isLoading}
      className={`mt-8 w-full rounded-xl py-3 text-sm font-bold transition-all flex items-center justify-center gap-2 ${
        active ? "bg-white/10 text-white cursor-default" :
        isLoading ? "bg-[#00bfff]/50 text-[#0B1220] cursor-wait" :
        "bg-[#00bfff] text-[#0B1220] hover:brightness-110"
      }`}
    >
      {isLoading ? (
        <>
          <Loader2 size={16} className="animate-spin" />
          Processing...
        </>
      ) : active ? "Manage Subscription" : "Upgrade Now"}
    </button>
  </div>
);

export default function BillingPage() {
  const { user } = useUser();
  const { balance, planType, loading: tokensLoading } = useTokenBalance(user?.id);
  const [loadingTier, setLoadingTier] = useState<string | null>(null);

  // Determine tokens total based on plan (will be replaced with API data later)
  const getTierTokens = (plan: string | null): number => {
    switch (plan?.toLowerCase()) {
      case 'prototyper': return 16;
      case 'growth': return 40;
      case 'scale': return 96;
      default: return 16; // Default to Prototyper
    }
  };

  const tokensTotal = getTierTokens(planType);
  const tokensUsed = Math.max(0, tokensTotal - balance);

  // Mock invoice data - V2 pricing (will be replaced with Stripe data later)
  const invoices = [
    { id: "INV-0012", date: "Jan 01, 2026", amount: "$599.00", status: "Paid" },
    { id: "INV-0011", date: "Dec 01, 2025", amount: "$599.00", status: "Paid" }
  ];

  // Initiate Stripe checkout for subscription upgrade
  const handleUpgrade = async (tierId: string) => {
    const priceId = TIER_PRICES[tierId];
    if (!priceId) {
      alert('Invalid tier selection');
      return;
    }

    setLoadingTier(tierId);

    try {
      const response = await fetch('/api/checkout/session', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          items: [{ priceId, quantity: 1 }],
          intent: 'SUBSCRIPTION',
        }),
      });

      const data = await response.json();

      if (data.url) {
        window.location.href = data.url;
      } else {
        alert('Checkout failed: ' + (data.error || 'Unknown error'));
        setLoadingTier(null);
      }
    } catch (err) {
      console.error('Checkout error:', err);
      alert('Connection error. Please try again.');
      setLoadingTier(null);
    }
  };

  return (
    <div className="space-y-10">
      {/* Header */}
      <header>
        <h2 className="text-3xl font-black text-white uppercase tracking-tighter">
          Billing <span className="text-[#00bfff]">&</span> Usage
        </h2>
        <p className="text-slate-400">Monitor your compute credits and subscription tier.</p>
      </header>

      {/* Plan Selection - V2 Performance Engine Pricing */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <PlanCard
          tier="Prototyper"
          tierId="prototyper"
          price="$599"
          tokens={16}
          commercials={2}
          features={[
            "2 formats (9:16 + 16:9)",
            "1 revision round",
            "4-day turnaround",
            "Captions included"
          ]}
          onUpgrade={handleUpgrade}
          isLoading={loadingTier === 'prototyper'}
        />
        <PlanCard
          tier="Growth"
          tierId="growth"
          price="$1,199"
          tokens={40}
          commercials={5}
          features={[
            "4 formats (9:16, 16:9, 1:1, 4:5)",
            "2 revision rounds",
            "2-day turnaround",
            "A/B hook variants"
          ]}
          popular
          onUpgrade={handleUpgrade}
          isLoading={loadingTier === 'growth'}
        />
        <PlanCard
          tier="Scale"
          tierId="scale"
          price="$2,499"
          tokens={96}
          commercials={12}
          features={[
            "All formats",
            "4 revision rounds",
            "24-hour priority",
            "Voice + Avatar clone included"
          ]}
          onUpgrade={handleUpgrade}
          isLoading={loadingTier === 'scale'}
        />
      </div>

      {/* Usage Stats - Token-based */}
      <section>
        <h3 className="text-sm font-semibold uppercase tracking-widest text-slate-500 mb-4">Current Usage</h3>
        <GlassCard className="p-6">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div>
              <p className="text-xs text-slate-500 uppercase tracking-widest mb-2">Tokens Used</p>
              <div className="flex items-baseline gap-2">
                {tokensLoading ? (
                  <Loader2 className="h-8 w-8 animate-spin text-[#00bfff]" />
                ) : (
                  <>
                    <span className="text-3xl font-bold text-white">{tokensUsed}</span>
                    <span className="text-sm text-slate-500">/ {tokensTotal}</span>
                  </>
                )}
              </div>
              <div className="mt-3 h-2 w-full bg-white/5 rounded-full overflow-hidden">
                <motion.div
                  initial={{ width: 0 }}
                  animate={{ width: tokensTotal > 0 ? `${(tokensUsed / tokensTotal) * 100}%` : '0%' }}
                  className="h-full bg-gradient-to-r from-[#00bfff] to-[#ffd700]"
                />
              </div>
              <p className="text-[10px] text-slate-600 mt-2">8 tokens = 1 commercial (64s video)</p>
            </div>
            <div>
              <p className="text-xs text-slate-500 uppercase tracking-widest mb-2">Tokens Remaining</p>
              <div className="flex items-baseline gap-2">
                {tokensLoading ? (
                  <Loader2 className="h-8 w-8 animate-spin text-[#00bfff]" />
                ) : (
                  <>
                    <span className="text-3xl font-bold text-white">{balance}</span>
                    <span className="text-sm text-slate-500">available</span>
                  </>
                )}
              </div>
              <div className="mt-3 h-2 w-full bg-white/5 rounded-full overflow-hidden">
                <motion.div
                  initial={{ width: 0 }}
                  animate={{ width: tokensTotal > 0 ? `${(balance / tokensTotal) * 100}%` : '0%' }}
                  className="h-full bg-[#00bfff]"
                />
              </div>
              <p className="text-[10px] text-slate-600 mt-2">Unused tokens roll over 1 month</p>
            </div>
            <div>
              <p className="text-xs text-slate-500 uppercase tracking-widest mb-2">Current Plan</p>
              <p className="text-lg font-bold text-white capitalize">
                {tokensLoading ? '...' : (planType || 'Free')}
              </p>
              <p className="text-xs text-slate-500 mt-1">
                {planType ? `${tokensTotal} tokens/month` : 'No active subscription'}
              </p>
            </div>
          </div>
        </GlassCard>
      </section>

      {/* Invoice History */}
      <section className="rounded-2xl border border-white/10 bg-white/5 overflow-hidden">
        <div className="border-b border-white/10 bg-white/5 px-6 py-4 flex items-center justify-between">
          <h3 className="flex items-center gap-2 text-sm font-bold uppercase tracking-widest text-white">
            <History size={16} className="text-[#ffd700]" /> Recent Invoices
          </h3>
          <button className="text-[10px] font-bold text-[#00bfff] uppercase hover:underline">View All</button>
        </div>
        <table className="w-full text-left text-xs text-slate-400">
          <thead>
            <tr className="border-b border-white/5 bg-white/[0.02]">
              <th className="px-6 py-4 font-semibold uppercase tracking-wider">Invoice ID</th>
              <th className="px-6 py-4 font-semibold uppercase tracking-wider">Date</th>
              <th className="px-6 py-4 font-semibold uppercase tracking-wider">Amount</th>
              <th className="px-6 py-4 font-semibold uppercase tracking-wider">Status</th>
              <th className="px-6 py-4 text-right">Action</th>
            </tr>
          </thead>
          <tbody>
            {invoices.map((inv, i) => (
              <tr key={i} className="border-b border-white/5 hover:bg-white/[0.02] transition-colors">
                <td className="px-6 py-4 font-mono text-[#00bfff]">{inv.id}</td>
                <td className="px-6 py-4">{inv.date}</td>
                <td className="px-6 py-4 text-white font-bold">{inv.amount}</td>
                <td className="px-6 py-4">
                  <span className="rounded-full bg-emerald-500/10 px-2 py-0.5 text-[10px] text-emerald-400">
                    {inv.status}
                  </span>
                </td>
                <td className="px-6 py-4 text-right">
                  <button className="text-slate-500 hover:text-white transition-colors">
                    <ArrowUpRight size={16} />
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </section>

      {/* Payment Methods */}
      <section>
        <h3 className="text-sm font-semibold uppercase tracking-widest text-slate-500 mb-4">Payment Methods</h3>
        <GlassCard className="p-6 border-dashed">
          <div className="flex flex-col items-center justify-center py-6 text-center">
            <div className="mb-4 h-12 w-12 rounded-xl bg-white/5 border border-white/10 flex items-center justify-center">
              <CreditCard size={24} className="text-slate-600" />
            </div>
            <p className="text-sm text-slate-500 mb-4">No payment methods on file</p>
            <button className="px-6 py-2 rounded-lg bg-[#00bfff] text-[#0B1220] font-bold text-sm hover:brightness-110 transition-all">
              Add Payment Method
            </button>
          </div>
        </GlassCard>
      </section>
    </div>
  );
}
