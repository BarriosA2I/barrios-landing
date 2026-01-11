// 📁 components/AudienceRouter.tsx
// Purpose: Immediate audience segmentation - replaces "Three Engines" section
// Visual DNA: Matches Deployment Path cards from screenshots
// Dependencies: framer-motion, lucide-react

'use client';

import { motion } from 'framer-motion';
import { ArrowRight, Building2, Clapperboard, ShieldCheck } from 'lucide-react';
import Link from 'next/link';

interface PathwayProps {
  id: string;
  title: string;
  subtitle: string;
  badge: string;
  description: string;
  price: string;
  priceNote?: string;
  icon: React.ReactNode;
  href: string;
  features: string[];
  accentColor: string;
  glowColor: string;
  borderColor: string;
}

const pathways: PathwayProps[] = [
  {
    id: 'ragnarok',
    title: 'Enterprise Core',
    subtitle: 'RAGNAROK_ARCHITECTURE',
    badge: 'FOR_OPERATIONS_LEADERS',
    description: 'Wire AI into your entire operation. Sales, support, ops—all running on one nervous system with 59 specialized agents.',
    price: 'CUSTOM',
    priceNote: 'Enterprise Architecture',
    icon: <Building2 className="w-7 h-7" />,
    href: '/enterprise',
    features: ['59 specialized agents', 'Infinite memory', '5-day deployment'],
    accentColor: 'text-[#00bfff]',
    glowColor: 'hover:shadow-[0_0_60px_-12px_rgba(0,191,255,0.4)]',
    borderColor: 'hover:border-[#00bfff]/30',
  },
  {
    id: 'commercial-lab',
    title: 'Creative Studio',
    subtitle: 'COMMERCIAL_LAB',
    badge: 'FOR_MARKETERS',
    description: 'Generate full 64-second video commercials from text prompts. 6-agent pipeline delivers production-ready output.',
    price: 'FROM $449',
    priceNote: '/ month',
    icon: <Clapperboard className="w-7 h-7" />,
    href: '/commercial-lab',
    features: ['Token-based pricing', 'Voice & avatar cloning', 'All major formats'],
    accentColor: 'text-[#ffd700]',
    glowColor: 'hover:shadow-[0_0_60px_-12px_rgba(255,215,0,0.4)]',
    borderColor: 'hover:border-[#ffd700]/30',
  },
  {
    id: 'nexus',
    title: 'Private Assistant',
    subtitle: 'NEXUS_PERSONAL',
    badge: 'FOR_HOME_PRIVACY',
    description: 'A personal AI that lives on your computer. Finds files, writes emails, organizes life—100% offline.',
    price: '$759',
    priceNote: 'one-time + $49.99/mo',
    icon: <ShieldCheck className="w-7 h-7" />,
    href: '/nexus',
    features: ['Data never leaves device', 'Works without internet', 'Done-for-you install'],
    accentColor: 'text-[#00ff88]',
    glowColor: 'hover:shadow-[0_0_60px_-12px_rgba(0,255,136,0.4)]',
    borderColor: 'hover:border-[#00ff88]/30',
  },
];

export function AudienceRouter() {
  return (
    <section className="relative py-24 lg:py-32 bg-[#0a0a1e]">
      {/* Subtle Grid Background */}
      <div 
        className="absolute inset-0 opacity-30 pointer-events-none"
        style={{
          backgroundImage: `
            linear-gradient(rgba(0,191,255,0.03) 1px, transparent 1px),
            linear-gradient(90deg, rgba(0,191,255,0.03) 1px, transparent 1px)
          `,
          backgroundSize: '60px 60px',
          maskImage: 'radial-gradient(ellipse 80% 50% at 50% 50%, black 40%, transparent 100%)',
        }}
      />

      <div className="container mx-auto px-4 sm:px-6 relative z-10">
        {/* Section Header */}
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="text-center mb-16 lg:mb-20"
        >
          {/* Terminal Tag */}
          <div className="inline-flex items-center gap-2 mb-6">
            <span className="w-2 h-2 bg-[#00bfff] rounded-full animate-pulse" />
            <span className="font-mono text-xs tracking-[0.2em] text-[#00bfff]/70 uppercase">
              [ SELECT_YOUR_PATH ]
            </span>
          </div>

          {/* Headline */}
          <h2 className="text-4xl sm:text-5xl lg:text-6xl font-bold tracking-tight mb-6">
            <span className="text-white">What Are You </span>
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-[#00bfff] to-cyan-300 italic">
              Building?
            </span>
          </h2>

          {/* Subhead */}
          <p className="text-[#8892b0] text-lg max-w-xl mx-auto leading-relaxed">
            Choose your mission. We'll configure the right intelligence system for your objective.
          </p>
        </motion.div>

        {/* Pathway Cards */}
        <div className="grid lg:grid-cols-3 gap-6 lg:gap-8 max-w-7xl mx-auto">
          {pathways.map((path, index) => (
            <motion.div
              key={path.id}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: index * 0.15 }}
            >
              <Link href={path.href} className="block group h-full">
                <div 
                  className={`
                    relative h-full flex flex-col p-8 rounded-2xl
                    bg-[#0f0f2a]/60 backdrop-blur-xl
                    border border-white/[0.06]
                    transition-all duration-500 ease-out
                    hover:-translate-y-2
                    ${path.glowColor}
                    ${path.borderColor}
                  `}
                >
                  {/* Top Gradient Line */}
                  <div 
                    className={`
                      absolute top-0 left-8 right-8 h-px
                      bg-gradient-to-r from-transparent via-current to-transparent
                      opacity-0 group-hover:opacity-40 transition-opacity duration-500
                      ${path.accentColor}
                    `}
                  />

                  {/* Header Row */}
                  <div className="flex items-start justify-between mb-8">
                    {/* Icon */}
                    <div 
                      className={`
                        p-3.5 rounded-xl
                        bg-white/[0.03] border border-white/[0.06]
                        ${path.accentColor}
                        group-hover:bg-white/[0.06] transition-colors duration-300
                      `}
                    >
                      {path.icon}
                    </div>

                    {/* Badge */}
                    <span 
                      className="
                        font-mono text-[10px] tracking-[0.15em] uppercase
                        text-[#8892b0]/60 
                        px-2.5 py-1.5 rounded-md
                        bg-[#0a0a1e] border border-white/[0.06]
                      "
                    >
                      {path.badge}
                    </span>
                  </div>

                  {/* Content */}
                  <div className="flex-grow space-y-4 mb-8">
                    {/* Subtitle */}
                    <div className={`font-mono text-xs tracking-[0.1em] ${path.accentColor} opacity-80`}>
                      {path.subtitle}
                    </div>

                    {/* Title */}
                    <h3 className="text-2xl font-bold text-white tracking-tight">
                      {path.title}
                    </h3>

                    {/* Description */}
                    <p className="text-[#8892b0] text-sm leading-relaxed">
                      {path.description}
                    </p>

                    {/* Features */}
                    <ul className="space-y-2 pt-2">
                      {path.features.map((feature, i) => (
                        <li 
                          key={i}
                          className="flex items-center gap-2 text-sm text-[#8892b0]/80"
                        >
                          <span className={`w-1 h-1 rounded-full ${path.accentColor.replace('text-', 'bg-')}`} />
                          {feature}
                        </li>
                      ))}
                    </ul>
                  </div>

                  {/* Footer */}
                  <div className="pt-6 border-t border-white/[0.06] flex items-center justify-between">
                    {/* Price */}
                    <div>
                      <span className="font-mono text-base font-semibold text-white">
                        {path.price}
                      </span>
                      {path.priceNote && (
                        <span className="font-mono text-xs text-[#8892b0]/60 ml-1">
                          {path.priceNote}
                        </span>
                      )}
                    </div>

                    {/* Arrow Button */}
                    <div 
                      className={`
                        w-10 h-10 rounded-full flex items-center justify-center
                        border border-white/[0.08] bg-white/[0.02]
                        text-[#8892b0]
                        group-hover:border-transparent group-hover:bg-white group-hover:text-[#0a0a1e]
                        transition-all duration-300
                      `}
                    >
                      <ArrowRight className="w-4 h-4 group-hover:translate-x-0.5 transition-transform" />
                    </div>
                  </div>
                </div>
              </Link>
            </motion.div>
          ))}
        </div>

        {/* Bottom CTA */}
        <motion.div 
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          transition={{ delay: 0.6 }}
          className="text-center mt-16"
        >
          <p className="text-[#8892b0]/60 text-sm">
            Not sure which path? {' '}
            <Link 
              href="/contact" 
              className="text-[#00bfff] hover:text-[#00bfff]/80 underline underline-offset-4 transition-colors"
            >
              Talk to our team
            </Link>
            {' '}— we'll map your requirements in 15 minutes.
          </p>
        </motion.div>
      </div>
    </section>
  );
}
