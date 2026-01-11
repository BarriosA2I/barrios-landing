// 📁 components/DeploymentTimeline.tsx
// Purpose: Enterprise Deployment - Go Live in 5 Days timeline
// Visual DNA: Matches Image 316 from screenshots
// Dependencies: framer-motion

'use client';

import { motion } from 'framer-motion';
import { Rocket } from 'lucide-react';

const timelineSteps = [
  {
    day: 1,
    title: 'Discovery Call',
    description: 'We map your workflows, data sources, and goals in a 60-minute session.',
    color: 'bg-[#00bfff]',
  },
  {
    day: 2,
    title: 'Architecture',
    description: 'Our team designs your custom agent topology and integration plan.',
    color: 'bg-[#00bfff]/80',
  },
  {
    day: 3,
    title: 'Build & Test',
    description: 'We build your agents, connect your data, and run automated tests.',
    color: 'bg-[#00bfff]/60',
  },
  {
    day: 4,
    title: 'Staging Deploy',
    description: 'Your system goes live in a staging environment for validation.',
    color: 'bg-[#00bfff]/40',
  },
  {
    day: 5,
    title: 'Production',
    description: 'Full production deployment with monitoring and support handoff.',
    color: 'bg-[#00ff88]',
  },
];

const impactStats = [
  { value: '60%', label: 'COST REDUCTION' },
  { value: '95%', label: 'ATTACK DETECTION' },
  { value: '40%+', label: 'LEAD CAPTURE LIFT' },
];

export function DeploymentTimeline() {
  return (
    <section className="relative py-24 lg:py-32 bg-[#0a0a1e]">
      <div className="container mx-auto px-4 sm:px-6 relative z-10">
        {/* Section Header */}
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="text-center mb-16"
        >
          {/* Badge */}
          <div className="inline-flex items-center gap-2 px-4 py-2 mb-6 rounded-full bg-[#ffd700]/10 border border-[#ffd700]/30">
            <Rocket className="w-4 h-4 text-[#ffd700]" />
            <span className="font-mono text-xs tracking-wider text-[#ffd700]">
              ENTERPRISE DEPLOYMENT
            </span>
          </div>

          {/* Headline */}
          <h2 className="text-4xl sm:text-5xl lg:text-6xl font-bold tracking-tight mb-4">
            <span className="text-white">Go Live in </span>
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-[#00bfff] to-cyan-300 italic">
              5 Days.
            </span>
          </h2>

          {/* Subhead */}
          <p className="text-[#8892b0] text-lg max-w-xl mx-auto">
            From first call to running system. No months of consulting. No bloated SOWs.
          </p>
        </motion.div>

        {/* Timeline */}
        <div className="max-w-5xl mx-auto mb-16">
          {/* Desktop Timeline */}
          <div className="hidden lg:flex items-start justify-between relative">
            {/* Connection Line */}
            <div className="absolute top-6 left-0 right-0 h-px bg-gradient-to-r from-[#00bfff] via-[#00bfff]/50 to-[#00ff88]" />
            
            {timelineSteps.map((step, index) => (
              <motion.div
                key={step.day}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5, delay: index * 0.1 }}
                className="flex flex-col items-center text-center w-1/5"
              >
                {/* Day Badge */}
                <div 
                  className={`
                    w-12 h-12 rounded-xl flex items-center justify-center
                    ${step.color} text-[#0a0a1e]
                    font-mono font-bold text-sm
                    relative z-10
                    ${step.day === 5 ? 'ring-4 ring-[#00ff88]/30' : ''}
                  `}
                >
                  DAY {step.day}
                </div>

                {/* Content */}
                <div className="mt-6 px-2">
                  <h3 className="text-white font-semibold mb-2">{step.title}</h3>
                  <p className="text-[#8892b0]/70 text-sm leading-relaxed">
                    {step.description}
                  </p>
                </div>
              </motion.div>
            ))}
          </div>

          {/* Mobile Timeline */}
          <div className="lg:hidden space-y-6">
            {timelineSteps.map((step, index) => (
              <motion.div
                key={step.day}
                initial={{ opacity: 0, x: -20 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5, delay: index * 0.1 }}
                className="flex gap-4"
              >
                {/* Day Badge */}
                <div 
                  className={`
                    w-12 h-12 rounded-xl flex-shrink-0 flex items-center justify-center
                    ${step.color} text-[#0a0a1e]
                    font-mono font-bold text-xs
                  `}
                >
                  D{step.day}
                </div>

                {/* Content */}
                <div className="flex-1 pt-1">
                  <h3 className="text-white font-semibold mb-1">{step.title}</h3>
                  <p className="text-[#8892b0]/70 text-sm leading-relaxed">
                    {step.description}
                  </p>
                </div>
              </motion.div>
            ))}
          </div>
        </div>

        {/* Impact Stats Bar */}
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6, delay: 0.3 }}
          className="max-w-3xl mx-auto"
        >
          <div className="grid grid-cols-3 gap-4 p-6 rounded-2xl bg-gradient-to-r from-[#ffd700]/10 via-[#ffd700]/5 to-[#ffd700]/10 border border-[#ffd700]/20">
            {impactStats.map((stat, index) => (
              <div key={stat.label} className="text-center">
                <div className="text-2xl sm:text-3xl font-bold text-[#ffd700] mb-1">
                  {stat.value}
                </div>
                <div className="font-mono text-[10px] sm:text-xs text-[#8892b0]/60 tracking-wider">
                  {stat.label}
                </div>
              </div>
            ))}
          </div>
        </motion.div>
      </div>
    </section>
  );
}
