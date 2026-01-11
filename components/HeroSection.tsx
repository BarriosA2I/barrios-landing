// 📁 components/HeroSection.tsx
// Purpose: Zone 1 - The Hook (Identity)
// Visual DNA: Matches Image 308 from screenshots - "Your Business. With a Nervous System."
// Dependencies: framer-motion

'use client';

import { motion } from 'framer-motion';
import { ArrowRight, Terminal } from 'lucide-react';
import Link from 'next/link';
import { useState, useEffect } from 'react';

// ═══════════════════════════════════════════════════════════════════
// TERMINAL ANIMATION DATA
// ═══════════════════════════════════════════════════════════════════

const terminalLines = [
  { type: 'command', text: '$ ./initialize_brain_os.sh --force' },
  { type: 'output', label: 'AGENTS_ACTIVE', value: '59 NODES', color: 'text-[#00ff88]' },
  { type: 'output', label: 'MEMORY_ALLOC', value: '12TB (EXPANDING)', color: 'text-[#ffd700]' },
  { type: 'output', label: 'SYSTEM_UPTIME', value: '99.999%', color: 'text-white' },
  { type: 'status', text: 'PARSING_DATA...', secondary: 'OPTIMIZING_ADS...' },
  { type: 'success', text: '> Neural pathways optimized.', badge: 'CONNECTION ESTABLISHED' },
];

// ═══════════════════════════════════════════════════════════════════
// TERMINAL COMPONENT
// ═══════════════════════════════════════════════════════════════════

function TerminalUI() {
  const [visibleLines, setVisibleLines] = useState(0);

  useEffect(() => {
    const timer = setInterval(() => {
      setVisibleLines((prev) => {
        if (prev >= terminalLines.length) {
          clearInterval(timer);
          return prev;
        }
        return prev + 1;
      });
    }, 400);

    return () => clearInterval(timer);
  }, []);

  return (
    <motion.div
      initial={{ opacity: 0, y: 20, scale: 0.98 }}
      animate={{ opacity: 1, y: 0, scale: 1 }}
      transition={{ duration: 0.8, delay: 0.4 }}
      className="
        relative w-full max-w-md
        bg-[#0a0a1e]/90 backdrop-blur-xl
        rounded-xl border border-[#00bfff]/20
        shadow-[0_0_60px_-12px_rgba(0,191,255,0.3)]
        overflow-hidden
      "
    >
      {/* Terminal Header */}
      <div className="flex items-center justify-between px-4 py-3 border-b border-white/[0.06]">
        <div className="flex items-center gap-2">
          <div className="w-3 h-3 rounded-full bg-[#ff5f57]" />
          <div className="w-3 h-3 rounded-full bg-[#ffbd2e]" />
          <div className="w-3 h-3 rounded-full bg-[#28ca42]" />
        </div>
        <div className="font-mono text-xs text-[#8892b0]/60 tracking-wider">
          [ ADMIN@BARRIOSA2I:~ ]
        </div>
      </div>

      {/* Terminal Body */}
      <div className="p-4 space-y-3 font-mono text-sm min-h-[280px]">
        {terminalLines.slice(0, visibleLines).map((line, index) => (
          <motion.div
            key={index}
            initial={{ opacity: 0, x: -10 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.3 }}
          >
            {line.type === 'command' && (
              <div className="text-[#00bfff]">{line.text}</div>
            )}
            
            {line.type === 'output' && (
              <div className="flex items-center justify-between py-2 px-3 bg-white/[0.02] rounded border border-white/[0.04]">
                <span className="text-[#00bfff]/80">[ {line.label} ]</span>
                <span className={line.color}>{line.value}</span>
              </div>
            )}

            {line.type === 'status' && (
              <div className="flex gap-4">
                <div className="flex-1 py-2 px-3 bg-white/[0.02] rounded border border-white/[0.04] text-[#8892b0]/60">
                  {line.text}
                </div>
                <div className="flex-1 py-2 px-3 bg-white/[0.02] rounded border border-white/[0.04] text-[#8892b0]/60">
                  {line.secondary}
                </div>
              </div>
            )}

            {line.type === 'success' && (
              <div className="flex items-center gap-3 pt-2">
                <span className="text-[#8892b0]">{line.text}</span>
                <span className="px-2 py-1 text-xs bg-[#00bfff]/10 border border-[#00bfff]/30 rounded text-[#00bfff]">
                  [ {line.badge} ]
                </span>
              </div>
            )}
          </motion.div>
        ))}

        {/* Cursor */}
        {visibleLines < terminalLines.length && (
          <div className="flex items-center gap-1">
            <span className="w-2 h-4 bg-[#00bfff] animate-pulse" />
          </div>
        )}
      </div>
    </motion.div>
  );
}

// ═══════════════════════════════════════════════════════════════════
// MAIN HERO COMPONENT
// ═══════════════════════════════════════════════════════════════════

export function HeroSection() {
  return (
    <section className="relative min-h-screen flex items-center overflow-hidden bg-[#0a0a1e]">
      {/* Background Effects */}
      <div className="absolute inset-0 pointer-events-none">
        {/* Grid */}
        <div 
          className="absolute inset-0 opacity-20"
          style={{
            backgroundImage: `
              linear-gradient(rgba(0,191,255,0.05) 1px, transparent 1px),
              linear-gradient(90deg, rgba(0,191,255,0.05) 1px, transparent 1px)
            `,
            backgroundSize: '80px 80px',
          }}
        />
        
        {/* Radial Glow */}
        <div className="absolute top-0 right-0 w-[600px] h-[600px] bg-[#00bfff]/[0.08] rounded-full blur-[150px] translate-x-1/3 -translate-y-1/3" />
        <div className="absolute bottom-0 left-0 w-[400px] h-[400px] bg-[#ffd700]/[0.05] rounded-full blur-[120px] -translate-x-1/3 translate-y-1/3" />
      </div>

      <div className="container mx-auto px-4 sm:px-6 relative z-10 py-20 lg:py-0">
        <div className="grid lg:grid-cols-2 gap-12 lg:gap-16 items-center">
          {/* Left Column - Content */}
          <div className="space-y-8">
            {/* System Tag */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6 }}
              className="inline-flex items-center gap-2"
            >
              <span className="font-mono text-xs tracking-[0.2em] text-[#8892b0]/60 uppercase">
                [ SYSTEM_MANIFESTO ]
              </span>
            </motion.div>

            {/* Manifesto Lines */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.1 }}
              className="space-y-1"
            >
              <p className="text-[#8892b0] text-lg">This is not automation.</p>
              <p className="text-[#00ff88] text-lg font-medium">This is operational intelligence.</p>
            </motion.div>

            {/* Main Headline */}
            <motion.h1
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.2 }}
              className="text-5xl sm:text-6xl lg:text-7xl font-bold tracking-tight leading-[0.95]"
            >
              <span className="text-white block">Your</span>
              <span className="text-white block">Business.</span>
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-[#00bfff] via-cyan-300 to-[#00bfff] block italic">
                With a
              </span>
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-[#ffd700] to-amber-300 block italic">
                Nervous
              </span>
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-[#ffd700] to-amber-300 italic">
                System.
              </span>
              <span className="inline-block w-16 h-1 bg-gradient-to-r from-[#00bfff] to-transparent ml-2 translate-y-[-8px]" />
            </motion.h1>

            {/* Subheadline */}
            <motion.p
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.4 }}
              className="text-[#8892b0] text-lg max-w-lg leading-relaxed"
            >
              Barrios A2I installs <span className="text-white font-medium">autonomous intelligence</span>{' '}
              that senses, decides, and acts across your entire operation—continuously.
            </motion.p>

            {/* CTAs */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.5 }}
              className="flex flex-wrap gap-4 pt-4"
            >
              {/* Primary CTA */}
              <Link 
                href="#router"
                className="
                  inline-flex items-center gap-2 px-8 py-4
                  bg-gradient-to-r from-[#00bfff] to-cyan-400
                  text-[#0a0a1e] font-mono font-semibold text-sm tracking-wide
                  rounded-lg
                  hover:shadow-[0_0_40px_-8px_rgba(0,191,255,0.5)]
                  transition-all duration-300 hover:-translate-y-0.5
                "
              >
                BUILD_WORKFORCE
                <ArrowRight className="w-4 h-4" />
              </Link>

              {/* Secondary CTA */}
              <Link 
                href="/architecture"
                className="
                  inline-flex items-center gap-2 px-8 py-4
                  bg-transparent
                  border border-white/[0.1] hover:border-white/[0.2]
                  text-white font-mono text-sm tracking-wide
                  rounded-lg
                  hover:bg-white/[0.02]
                  transition-all duration-300
                "
              >
                <Terminal className="w-4 h-4 text-[#00bfff]" />
                VIEW_ARCHITECTURE
              </Link>
            </motion.div>
          </div>

          {/* Right Column - Terminal */}
          <div className="flex justify-center lg:justify-end">
            <TerminalUI />
          </div>
        </div>
      </div>

      {/* Scroll Indicator */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 1.5 }}
        className="absolute bottom-8 left-1/2 -translate-x-1/2 flex flex-col items-center gap-2"
      >
        <span className="font-mono text-xs text-[#8892b0]/40 tracking-wider">SCROLL</span>
        <div className="w-px h-8 bg-gradient-to-b from-[#00bfff]/40 to-transparent" />
      </motion.div>
    </section>
  );
}
