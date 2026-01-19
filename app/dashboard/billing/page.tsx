'use client';

import { motion } from 'framer-motion';
import { CreditCard, ArrowUpRight, Check, History } from 'lucide-react';

// Glass Card Component
const GlassCard = ({ children, className = "" }: { children: React.ReactNode, className?: string }) => (
  <div className={`relative overflow-hidden rounded-2xl border border-white/10 bg-white/5 backdrop-blur-xl transition-all duration-300 hover:border-white/20 ${className}`}>
    {children}
  </div>
);

// Plan Card Component
const PlanCard = ({
  tier,
  price,
  features,
  active = false
}: {
  tier: string;
  price: string;
  features: string[];
  active?: boolean;
}) => (
  <div className={`relative rounded-2xl border p-6 transition-all ${
    active ? "border-[#ffd700] bg-[#ffd700]/5 ring-1 ring-[#ffd700]" : "border-white/10 bg-white/5 hover:border-white/20"
  }`}>
    {active && (
      <span className="absolute -top-3 left-6 rounded-full bg-[#ffd700] px-3 py-1 text-[10px] font-black uppercase text-[#0B1220]">
        Current Plan
      </span>
    )}
    <h3 className="text-xl font-black text-white uppercase tracking-tighter">{tier}</h3>
    <div className="mt-2 flex items-baseline gap-1">
      <span className="text-3xl font-bold text-white">{price}</span>
      <span className="text-sm text-slate-500">/month</span>
    </div>
    <ul className="mt-6 space-y-3">
      {features.map((f, i) => (
        <li key={i} className="flex items-center gap-2 text-xs text-slate-300">
          <Check size={14} className="text-[#00bfff]" /> {f}
        </li>
      ))}
    </ul>
    <button className={`mt-8 w-full rounded-xl py-3 text-sm font-bold transition-all ${
      active ? "bg-white/10 text-white cursor-default" : "bg-[#00bfff] text-[#0B1220] hover:brightness-110"
    }`}>
      {active ? "Manage Subscription" : "Upgrade Now"}
    </button>
  </div>
);

export default function BillingPage() {
  // Mock invoice data
  const invoices = [
    { id: "INV-0012", date: "Jan 01, 2026", amount: "$199.00", status: "Paid" },
    { id: "INV-0011", date: "Dec 01, 2025", amount: "$199.00", status: "Paid" }
  ];

  return (
    <div className="space-y-10">
      {/* Header */}
      <header>
        <h2 className="text-3xl font-black text-white uppercase tracking-tighter">
          Billing <span className="text-[#00bfff]">&</span> Usage
        </h2>
        <p className="text-slate-400">Monitor your compute credits and subscription tier.</p>
      </header>

      {/* Plan Selection */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <PlanCard
          tier="Standard"
          price="$49"
          features={["50 AI Minutes", "720p Export", "Community Support"]}
        />
        <PlanCard
          tier="Studio"
          price="$199"
          features={["500 AI Minutes", "4K Export", "Priority Rendering"]}
          active
        />
        <PlanCard
          tier="Enterprise"
          price="Custom"
          features={["Unlimited compute", "API Access", "Dedicated Account Manager"]}
        />
      </div>

      {/* Usage Stats */}
      <section>
        <h3 className="text-sm font-semibold uppercase tracking-widest text-slate-500 mb-4">Current Usage</h3>
        <GlassCard className="p-6">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div>
              <p className="text-xs text-slate-500 uppercase tracking-widest mb-2">AI Minutes Used</p>
              <div className="flex items-baseline gap-2">
                <span className="text-3xl font-bold text-white">0</span>
                <span className="text-sm text-slate-500">/ 500</span>
              </div>
              <div className="mt-3 h-2 w-full bg-white/5 rounded-full overflow-hidden">
                <motion.div
                  initial={{ width: 0 }}
                  animate={{ width: '5%' }}
                  className="h-full bg-gradient-to-r from-[#00bfff] to-[#ffd700]"
                />
              </div>
            </div>
            <div>
              <p className="text-xs text-slate-500 uppercase tracking-widest mb-2">Storage Used</p>
              <div className="flex items-baseline gap-2">
                <span className="text-3xl font-bold text-white">0</span>
                <span className="text-sm text-slate-500">/ 50 GB</span>
              </div>
              <div className="mt-3 h-2 w-full bg-white/5 rounded-full overflow-hidden">
                <motion.div
                  initial={{ width: 0 }}
                  animate={{ width: '0%' }}
                  className="h-full bg-[#00bfff]"
                />
              </div>
            </div>
            <div>
              <p className="text-xs text-slate-500 uppercase tracking-widest mb-2">Billing Cycle</p>
              <p className="text-lg font-bold text-white">Resets Jan 31, 2026</p>
              <p className="text-xs text-slate-500 mt-1">12 days remaining</p>
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
