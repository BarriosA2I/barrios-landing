// 📁 components/SystemDiagnostics.tsx
// Purpose: The Honest Truth - Comparison table (Traditional vs Freelancer vs Barrios)
// Visual DNA: Matches Image 315 from screenshots
// Dependencies: framer-motion

'use client';

import { motion } from 'framer-motion';
import { Check, X } from 'lucide-react';

const comparisonData = [
  {
    metric: 'MONTHLY_COST',
    traditional: '$2,000+',
    freelancer: '$3,500+',
    barrios: '$199',
    highlight: true,
  },
  {
    metric: 'TURNAROUND',
    traditional: '5-7 Days',
    freelancer: '48 Hours',
    barrios: '< 2s',
    highlight: true,
  },
  {
    metric: 'CONTEXT_WINDOW',
    traditional: 'Fragmented',
    freelancer: 'Zero',
    barrios: '12TB',
    highlight: true,
  },
  {
    metric: 'AVAILABILITY',
    traditional: '9-5 EST',
    freelancer: 'Irregular',
    barrios: '24/7/365',
    highlight: false,
  },
];

export function SystemDiagnostics() {
  return (
    <section className="relative py-24 lg:py-32 bg-[#0a0a1e]">
      {/* Background */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div 
          className="absolute inset-0 opacity-30"
          style={{
            backgroundImage: `
              radial-gradient(circle at 30% 50%, rgba(0,191,255,0.08) 0%, transparent 50%),
              radial-gradient(circle at 70% 50%, rgba(0,191,255,0.08) 0%, transparent 50%)
            `,
          }}
        />
      </div>

      <div className="container mx-auto px-4 sm:px-6 relative z-10">
        {/* Section Header */}
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="text-center mb-16"
        >
          {/* Terminal Tag */}
          <div className="inline-flex items-center gap-2 mb-6">
            <span className="font-mono text-xs tracking-[0.2em] text-[#00bfff]/70 uppercase">
              [ SYSTEM_DIAGNOSTICS ]
            </span>
          </div>

          {/* Headline */}
          <h2 className="text-4xl sm:text-5xl lg:text-6xl font-bold tracking-tight mb-4">
            <span className="text-white">The </span>
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-[#00bfff] to-cyan-300 italic">
              Honest Truth.
            </span>
          </h2>

          {/* Subhead */}
          <p className="text-[#8892b0] text-lg max-w-xl mx-auto">
            Humans sleep. Humans make mistakes. The Barrios A2I system does neither.
          </p>
        </motion.div>

        {/* Comparison Table */}
        <motion.div 
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6, delay: 0.2 }}
          className="max-w-5xl mx-auto"
        >
          {/* Desktop Table */}
          <div className="hidden md:block rounded-2xl overflow-hidden border border-white/[0.06]">
            {/* Header Row */}
            <div className="grid grid-cols-4 bg-[#0f0f2a]/80">
              <div className="p-6" /> {/* Empty corner */}
              <div className="p-6 text-center border-l border-white/[0.06]">
                <span className="font-mono text-xs text-[#8892b0]/60 tracking-wider">TRADITIONAL AGENCY</span>
              </div>
              <div className="p-6 text-center border-l border-white/[0.06]">
                <span className="font-mono text-xs text-[#8892b0]/60 tracking-wider">FREELANCER</span>
              </div>
              <div className="p-6 text-center border-l border-white/[0.06] bg-[#00bfff]/5">
                <div className="flex flex-col items-center gap-1">
                  <span className="font-bold text-white italic text-lg">Barrios A2I</span>
                  <span className="flex items-center gap-1.5 text-xs text-[#00ff88]">
                    <span className="w-1.5 h-1.5 bg-[#00ff88] rounded-full animate-pulse" />
                    SYSTEM ACTIVE
                  </span>
                </div>
              </div>
            </div>

            {/* Data Rows */}
            {comparisonData.map((row, index) => (
              <div 
                key={row.metric}
                className="grid grid-cols-4 border-t border-white/[0.06]"
              >
                {/* Metric Label */}
                <div className="p-6 bg-[#0f0f2a]/40">
                  <span className="font-mono text-xs text-[#00bfff]/80 tracking-wider">
                    {row.metric}
                  </span>
                </div>
                
                {/* Traditional */}
                <div className="p-6 flex items-center justify-center border-l border-white/[0.06] bg-[#0f0f2a]/20">
                  <span className="text-[#8892b0]/60">{row.traditional}</span>
                </div>
                
                {/* Freelancer */}
                <div className="p-6 flex items-center justify-center border-l border-white/[0.06] bg-[#0f0f2a]/20">
                  <span className="text-[#8892b0]/60">{row.freelancer}</span>
                </div>
                
                {/* Barrios */}
                <div className="p-6 flex items-center justify-center border-l border-white/[0.06] bg-[#00bfff]/5">
                  <span className={`text-xl font-bold ${row.highlight ? 'text-[#00bfff]' : 'text-white'}`}>
                    {row.barrios}
                  </span>
                </div>
              </div>
            ))}
          </div>

          {/* Mobile Cards */}
          <div className="md:hidden space-y-4">
            {/* Barrios Card - Featured */}
            <div className="p-6 rounded-2xl bg-[#0f0f2a]/60 border border-[#00bfff]/20">
              <div className="flex items-center justify-between mb-6">
                <div>
                  <span className="font-bold text-white text-xl italic">Barrios A2I</span>
                  <span className="flex items-center gap-1.5 text-xs text-[#00ff88] mt-1">
                    <span className="w-1.5 h-1.5 bg-[#00ff88] rounded-full animate-pulse" />
                    SYSTEM ACTIVE
                  </span>
                </div>
                <span className="text-3xl font-bold text-[#00bfff]">$199</span>
              </div>
              
              <div className="space-y-4">
                {comparisonData.map((row) => (
                  <div key={row.metric} className="flex items-center justify-between py-2 border-b border-white/[0.06] last:border-0">
                    <span className="font-mono text-xs text-[#8892b0]/60">{row.metric}</span>
                    <span className="font-bold text-[#00bfff]">{row.barrios}</span>
                  </div>
                ))}
              </div>
            </div>

            {/* Competitors - Collapsed */}
            <div className="grid grid-cols-2 gap-4">
              <div className="p-4 rounded-xl bg-[#0f0f2a]/40 border border-white/[0.06]">
                <span className="font-mono text-[10px] text-[#8892b0]/40 block mb-2">TRADITIONAL</span>
                <span className="text-[#8892b0]/60 text-sm">$2,000+/mo</span>
              </div>
              <div className="p-4 rounded-xl bg-[#0f0f2a]/40 border border-white/[0.06]">
                <span className="font-mono text-[10px] text-[#8892b0]/40 block mb-2">FREELANCER</span>
                <span className="text-[#8892b0]/60 text-sm">$3,500+/mo</span>
              </div>
            </div>
          </div>
        </motion.div>
      </div>
    </section>
  );
}
