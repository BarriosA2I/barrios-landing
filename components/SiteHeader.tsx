// components/SiteHeader.tsx
// Site-wide header with mission-control aesthetic

'use client';

import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { LogIn } from 'lucide-react';

function AuthButton() {
  const router = useRouter();
  const [isClicked, setIsClicked] = useState(false);

  const handleClick = () => {
    setIsClicked(true);
    setTimeout(() => {
      router.push('/sign-in');
    }, 200);
  };

  return (
    <motion.button
      onClick={handleClick}
      className="
        min-h-[44px] px-5 py-2.5
        flex items-center gap-2
        text-sm font-medium text-zinc-300
        bg-white/5 backdrop-blur
        border border-[#00bfff]/30
        rounded-lg
        hover:border-[#00bfff]/50
        hover:shadow-[0_0_15px_rgba(0,191,255,0.15)]
        hover:text-white
        transition-all duration-300
        cursor-pointer
      "
      animate={isClicked ? {
        boxShadow: ['0 0 0px rgba(255,215,0,0)', '0 0 20px rgba(255,215,0,0.6)', '0 0 0px rgba(255,215,0,0)'],
      } : {}}
      transition={{ duration: 0.3 }}
    >
      <LogIn className="w-4 h-4" />
      <span>Sign In / Sign Up</span>
    </motion.button>
  );
}

export function SiteHeader() {
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 20);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  return (
    <header
      className={`
        fixed top-0 left-0 right-0 z-50 transition-all duration-500
        ${scrolled
          ? 'bg-[#0a0a0a]/90 backdrop-blur-2xl border-b border-[#00CED1]/10 shadow-[0_4px_30px_rgba(0,206,209,0.08)]'
          : 'bg-[#0a0a0a]/60 backdrop-blur-xl border-b border-white/[0.04]'
        }
      `}
    >
      {/* Subtle glow line at top */}
      <div className="absolute top-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-[#00CED1]/30 to-transparent" />

      <div className="container mx-auto px-4 sm:px-6">
        <div className="flex h-16 items-center justify-between">
          {/* Logo with hover glow */}
          <Link href="/" className="group flex items-center gap-3 relative">
            {/* Logo glow effect on hover */}
            <div className="absolute -inset-3 bg-[#00CED1]/0 group-hover:bg-[#00CED1]/5 rounded-2xl blur-xl transition-all duration-500" />

            <div className="relative w-9 h-9 rounded-lg bg-gradient-to-br from-[#00CED1] via-[#00CED1]/90 to-cyan-400 flex items-center justify-center shadow-[0_0_20px_rgba(0,206,209,0.3)] group-hover:shadow-[0_0_30px_rgba(0,206,209,0.5)] transition-all duration-300">
              {/* Inner glow */}
              <div className="absolute inset-0 rounded-lg bg-gradient-to-br from-white/20 to-transparent" />
              <span className="relative font-bold text-[#0a0a0a] text-xs tracking-tight">A2I</span>
            </div>

            <div className="relative">
              <span className="font-bold text-white">BARRIOS </span>
              <span className="font-bold text-[#00CED1] group-hover:text-shadow-[0_0_10px_rgba(0,206,209,0.5)] transition-all duration-300">A2I</span>
            </div>
          </Link>

          {/* Auth Button */}
          <AuthButton />
        </div>
      </div>

      {/* Bottom glow line */}
      <div className="absolute bottom-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-[#00CED1]/20 to-transparent" />
    </header>
  );
}
