"use client";

import React from 'react';
import { motion } from 'framer-motion';

/**
 * PRICING & DEPLOYMENT PATHS
 * Designed as a Tactical Mission Briefing
 * Features: HUD elements, scanline texture, animated token counter
 */

interface PricingPath {
  id: string;
  label: string;
  title: string;
  price: string;
  unit: string;
  desc: string;
  features: { name: string; detail: string }[];
  note: string;
  cta: string;
  color: string;
  isPrimary?: boolean;
  isComingSoon?: boolean;
}

const PATHS: PricingPath[] = [
  {
    id: 'commercial-lab',
    label: 'AI_COMMERCIAL_STUDIO',
    title: 'Commercial_Lab',
    price: '$449',
    unit: '/ MONTH_START',
    desc: 'Token-based subscription. Generate full 64-second AI commercials from text prompts.',
    features: [
      { name: 'STARTER', detail: '$449 • 8 TOKENS' },
      { name: 'CREATOR', detail: '$899 • 16 TOKENS' },
      { name: 'GROWTH', detail: '$1,699 • 32 TOKENS' },
      { name: 'SCALE', detail: '$3,199 • 64 TOKENS' },
    ],
    note: '*8 tokens = 1 full 64-second commercial. Script, voiceover, video, captions—all included.',
    cta: 'EXPLORE COMMERCIAL_LAB',
    color: '#00bfff',
  },
  {
    id: 'marketing-overlord',
    label: 'CAMPAIGN_AUTOPILOT',
    title: 'Marketing Overlord',
    price: '$199',
    unit: '/ MO + Setup',
    desc: 'Your always-on campaign brain: plans, writes, launches, and optimizes while you sleep.',
    features: [
      { name: 'FUNNEL_MAP', detail: 'Automated Strategy' },
      { name: 'MULTI_CHANNEL', detail: 'Social/Search/Email' },
      { name: 'LIVE_OPTIMIZATION', detail: 'Real-time A/B' },
      { name: 'PERFORMANCE_REPORTS', detail: 'Automated ROI' },
    ],
    note: '"Built for founders who want a consistent pipeline without hiring a full marketing team."',
    cta: '[ COMING_SOON ]',
    color: '#00bfff',
    isComingSoon: true,
  },
  {
    id: 'total-command',
    label: 'ENTERPRISE_CHOICE',
    title: 'Total Command',
    price: 'Custom',
    unit: '',
    desc: 'Enterprise-grade logic architecture. We wire your entire operation into a single nervous system.',
    features: [
      { name: 'PRIVATE_LLM', detail: 'Proprietary Fine-tuning' },
      { name: 'FULL_AUTONOMY', detail: 'Agentic Workflows' },
      { name: 'ON_PREMISE_DEPLOY', detail: 'High Security' },
      { name: 'DEDICATED_SUPPORT', detail: '24/7 Response' },
    ],
    note: '"Built for teams who want Barrios A2I as the brain of the company, not just another tool."',
    cta: 'CONTACT ENGINEERING',
    color: '#ffd700',
    isPrimary: true,
  },
];

export default function Pricing() {
  return (
    <section className="py-24 px-6 bg-[#0a0a1e] relative overflow-hidden">
      {/* HUD Background Elements */}
      <div className="absolute top-0 left-0 w-full h-full opacity-5 pointer-events-none">
        <div className="absolute top-20 left-10 w-64 h-64 border-t border-[#00bfff]" />
        <div className="absolute bottom-20 right-10 w-64 h-64 border-b border-[#ffd700]" />
      </div>

      <div className="max-w-7xl mx-auto relative z-10">
        {/* Section Header */}
        <div className="text-center mb-20">
          <motion.span
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            className="text-[#00bfff] font-mono text-xs tracking-[0.4em] uppercase"
          >
            [ Initialization_Paths ]
          </motion.span>
          <h2 className="text-5xl md:text-7xl font-bold text-white mt-4 tracking-tighter">
            Choose Your <span className="italic font-serif text-gray-400">Deployment</span> Path.
          </h2>
          <p className="text-gray-500 mt-6 max-w-2xl mx-auto">
            Start with a single mission or hand us your entire nervous system.
          </p>
        </div>

        {/* Pricing Cards Grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 items-stretch">
          {PATHS.map((path, idx) => (
            <motion.div
              key={path.id}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ delay: idx * 0.1 }}
              whileHover={{ y: -10 }}
              className={`
                relative flex flex-col p-8 rounded-3xl border transition-all duration-500
                ${path.isPrimary ? 'border-[#ffd700]/40 bg-[#ffd700]/5' : 'border-white/5 bg-white/5'}
                ${path.isComingSoon ? 'opacity-60 grayscale-[0.5]' : ''}
                backdrop-blur-xl group
              `}
            >
              {/* Tactical Label */}
              <div className="flex justify-between items-start mb-8">
                <span className={`text-[10px] font-mono px-2 py-1 border rounded uppercase tracking-widest
                  ${path.isPrimary ? 'text-[#ffd700] border-[#ffd700]/30' : 'text-[#00bfff] border-[#00bfff]/30'}
                `}>
                  {path.label}
                </span>
                {path.isPrimary && (
                  <span className="bg-[#ffd700] text-[#0a0a1e] text-[9px] font-black px-2 py-0.5 rounded-full">
                    ENTERPRISE CHOICE
                  </span>
                )}
              </div>

              {/* Title & Price */}
              <h3 className="text-3xl font-bold text-white mb-2">{path.title}</h3>
              <div className="flex items-baseline gap-1 mb-6">
                <span className={`text-4xl font-bold ${path.isPrimary ? 'text-[#ffd700]' : 'text-[#00bfff]'}`}>
                  {path.price}
                </span>
                <span className="text-gray-500 text-xs font-mono uppercase tracking-tighter">{path.unit}</span>
              </div>

              <p className="text-gray-400 text-sm leading-relaxed mb-8 h-12">
                {path.desc}
              </p>

              {/* Feature List (Terminal Style) */}
              <div className="space-y-4 mb-8 flex-grow">
                {path.features.map((feat) => (
                  <div key={feat.name} className="flex justify-between items-center border-b border-white/5 pb-2">
                    <span className="text-xs font-mono text-gray-500 tracking-tighter">{feat.name}</span>
                    <span className="text-xs font-bold text-white tracking-widest">{feat.detail}</span>
                  </div>
                ))}
              </div>

              {/* Footnote */}
              <p className="text-[10px] italic text-gray-600 mb-8 leading-normal">
                {path.note}
              </p>

              {/* CTA Button */}
              <motion.button
                whileTap={{ scale: 0.95 }}
                disabled={path.isComingSoon}
                className={`
                  w-full py-4 rounded-xl font-bold text-xs tracking-[0.2em] uppercase transition-all
                  ${path.isPrimary
                    ? 'bg-[#ffd700] text-[#0a0a1e] shadow-[0_0_20px_rgba(255,215,0,0.3)]'
                    : 'bg-white/10 text-white border border-white/20 hover:bg-white/20'
                  }
                  ${path.isComingSoon ? 'cursor-not-allowed opacity-50' : ''}
                `}
              >
                {path.cta}
              </motion.button>

              {/* Decorative Corner Scan */}
              <div className="absolute top-2 right-2 w-4 h-4 border-t border-r border-white/20 opacity-0 group-hover:opacity-100 transition-opacity" />
              <div className="absolute bottom-2 left-2 w-4 h-4 border-b border-l border-white/20 opacity-0 group-hover:opacity-100 transition-opacity" />
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
