// 📁 components/OperationalVelocity.tsx
// Purpose: Zone 3 - The Proof (Live Metrics)
// Visual DNA: Matches Image 314 from screenshots
// Dependencies: framer-motion

'use client';

import { motion, useInView } from 'framer-motion';
import { useRef, useEffect, useState } from 'react';
import { Zap, Target, Clock, Cpu } from 'lucide-react';

// ═══════════════════════════════════════════════════════════════════
// ANIMATED COUNTER COMPONENT
// ═══════════════════════════════════════════════════════════════════

interface AnimatedCounterProps {
  end: number;
  suffix?: string;
  prefix?: string;
  duration?: number;
  decimals?: number;
}

function AnimatedCounter({ 
  end, 
  suffix = '', 
  prefix = '',
  duration = 2000,
  decimals = 0
}: AnimatedCounterProps) {
  const [count, setCount] = useState(0);
  const ref = useRef<HTMLSpanElement>(null);
  const isInView = useInView(ref, { once: true, margin: '-100px' });

  useEffect(() => {
    if (!isInView) return;
    
    let startTime: number | null = null;
    let animationFrame: number;

    const animate = (timestamp: number) => {
      if (!startTime) startTime = timestamp;
      const progress = Math.min((timestamp - startTime) / duration, 1);
      
      // Ease out cubic
      const easeOut = 1 - Math.pow(1 - progress, 3);
      const currentValue = easeOut * end;
      
      setCount(decimals > 0 ? parseFloat(currentValue.toFixed(decimals)) : Math.floor(currentValue));
      
      if (progress < 1) {
        animationFrame = requestAnimationFrame(animate);
      }
    };
    
    animationFrame = requestAnimationFrame(animate);
    
    return () => {
      if (animationFrame) cancelAnimationFrame(animationFrame);
    };
  }, [isInView, end, duration, decimals]);

  return (
    <span ref={ref} className="tabular-nums">
      {prefix}{count.toLocaleString()}{suffix}
    </span>
  );
}

// ═══════════════════════════════════════════════════════════════════
// STAT DATA
// ═══════════════════════════════════════════════════════════════════

const stats = [
  {
    id: 'decisions',
    value: 230,
    suffix: 'k+',
    label: 'MONTHLY_DECISIONS',
    description: 'High-volume actions across sales, support, and ops.',
    icon: <Zap className="w-5 h-5" />,
    color: 'text-[#00bfff]',
  },
  {
    id: 'accuracy',
    value: 97.5,
    suffix: '%',
    decimals: 1,
    label: 'AUTONOMOUS_ACCURACY',
    description: 'Tasks completed correctly without human intervention.',
    icon: <Target className="w-5 h-5" />,
    color: 'text-[#ffd700]',
  },
  {
    id: 'response',
    value: 2,
    prefix: '<',
    suffix: 's',
    label: 'SIGNAL-TO-ACTION',
    description: 'Average time from business signal to executed response.',
    icon: <Clock className="w-5 h-5" />,
    color: 'text-[#00ff88]',
  },
  {
    id: 'agents',
    value: 59,
    label: 'ACTIVE_AI_AGENTS',
    description: 'Specialized workers running in parallel in your cloud.',
    icon: <Cpu className="w-5 h-5" />,
    color: 'text-white',
  },
];

// ═══════════════════════════════════════════════════════════════════
// MAIN COMPONENT
// ═══════════════════════════════════════════════════════════════════

export function OperationalVelocity() {
  return (
    <section className="relative py-24 lg:py-32 bg-[#0a0a1e]">
      {/* Background Elements */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        {/* Radial gradient */}
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[800px] bg-[#00bfff]/[0.03] rounded-full blur-[120px]" />
      </div>

      <div className="container mx-auto px-4 sm:px-6 relative z-10">
        {/* Section Header */}
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="mb-16 lg:mb-20"
        >
          {/* Terminal Tag */}
          <div className="flex items-center gap-3 mb-6">
            <span className="w-2 h-2 bg-[#00ff88] rounded-full animate-pulse" />
            <span className="font-mono text-xs tracking-[0.2em] text-[#00bfff]/70 uppercase">
              [ LIVE_METRICS ]
            </span>
          </div>

          {/* Headline */}
          <h2 className="text-4xl sm:text-5xl lg:text-6xl font-bold tracking-tight mb-4">
            <span className="text-white">Operational </span>
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-[#ffd700] to-amber-300 italic">
              Velocity.
            </span>
          </h2>

          {/* Subhead with accent bar */}
          <div className="flex items-start gap-4">
            <div className="w-1 h-12 bg-gradient-to-b from-[#00bfff] to-transparent rounded-full mt-1" />
            <p className="text-[#8892b0] text-lg max-w-xl leading-relaxed">
              Real-time performance metrics of your autonomous digital workforce.
            </p>
          </div>
        </motion.div>

        {/* Live Ticker Bar */}
        <motion.div 
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          className="mb-12 overflow-hidden"
        >
          <div className="flex items-center gap-8 py-4 px-6 rounded-lg bg-[#0f0f2a]/60 border border-white/[0.06]">
            <div className="flex items-center gap-2">
              <span className="w-2 h-2 bg-[#00ff88] rounded-full animate-pulse" />
              <span className="font-mono text-xs text-[#00ff88] tracking-wider">REALTIME</span>
            </div>
            <div className="h-4 w-px bg-white/10" />
            <div className="flex-1 overflow-hidden">
              <div className="animate-marquee whitespace-nowrap font-mono text-xs text-[#8892b0]/60 tracking-wide">
                <span className="mx-8">NEURAL PATHWAYS OPTIMIZED</span>
                <span className="mx-8 text-[#ffd700]">/// LEAD_QUALIFIED: $18.4K OPPORTUNITY</span>
                <span className="mx-8 text-[#00bfff]">/// SUPPORT_RESOLVED: 420ms</span>
                <span className="mx-8">NEURAL PATHWAYS OPTIMIZED</span>
                <span className="mx-8 text-[#ffd700]">/// LEAD_QUALIFIED: $18.4K OPPORTUNITY</span>
              </div>
            </div>
          </div>
        </motion.div>

        {/* Stats Grid */}
        <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {stats.map((stat, index) => (
            <motion.div
              key={stat.id}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: index * 0.1 }}
              className="
                relative p-6 rounded-xl
                bg-[#0f0f2a]/40 backdrop-blur-sm
                border border-white/[0.06]
                hover:border-white/[0.1] transition-colors duration-300
              "
            >
              {/* Value */}
              <div className="text-4xl sm:text-5xl font-bold text-white mb-2 tracking-tight">
                <AnimatedCounter 
                  end={stat.value} 
                  suffix={stat.suffix}
                  prefix={stat.prefix}
                  decimals={stat.decimals}
                />
              </div>

              {/* Label */}
              <div className={`font-mono text-xs tracking-[0.1em] ${stat.color} mb-3`}>
                {stat.label}
              </div>

              {/* Description */}
              <p className="text-[#8892b0]/70 text-sm leading-relaxed">
                {stat.description}
              </p>
            </motion.div>
          ))}
        </div>

        {/* Bottom Quote */}
        <motion.div 
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          transition={{ delay: 0.5 }}
          className="mt-16 max-w-3xl"
        >
          <p className="text-[#8892b0] leading-relaxed">
            Stop staring at static dashboards. The Barrios A2I nervous system is always on—
            <span className="text-white font-medium">sensing data, making micro-decisions, and executing workflows.</span>
            {' '}While your competitors analyze reports, your system has already acted.
          </p>
          
          <div className="mt-6 flex items-center gap-4">
            <div className="h-px flex-1 bg-gradient-to-r from-[#00bfff]/30 to-transparent" />
            <span className="font-mono text-xs text-[#00bfff]/60 tracking-[0.2em]">
              INTELLIGENCE THAT NEVER SLEEPS
            </span>
            <div className="h-px flex-1 bg-gradient-to-l from-[#00bfff]/30 to-transparent" />
          </div>
        </motion.div>
      </div>

      {/* CSS for marquee animation */}
      <style jsx>{`
        @keyframes marquee {
          0% { transform: translateX(0); }
          100% { transform: translateX(-50%); }
        }
        .animate-marquee {
          animation: marquee 20s linear infinite;
        }
      `}</style>
    </section>
  );
}
