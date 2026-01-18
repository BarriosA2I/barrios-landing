// components/SiteHeader.tsx
// Site-wide header with cyberpunk glassmorphism design and glowing auth buttons

'use client';

import Link from 'next/link';
import { SignedIn, SignedOut, UserButton } from '@clerk/nextjs';
import { useState, useEffect } from 'react';

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

          {/* Auth Buttons */}
          <div className="flex items-center gap-3">
            <SignedOut>
              {/* Sign In Button - Ghost style with glow hover */}
              <Link
                href="/sign-in"
                className="
                  relative px-5 py-2 text-sm font-medium text-zinc-400
                  hover:text-[#00CED1] transition-all duration-300
                  rounded-lg
                  hover:bg-[#00CED1]/5
                  border border-transparent hover:border-[#00CED1]/20
                  group
                "
              >
                {/* Subtle glow on hover */}
                <span className="absolute inset-0 rounded-lg bg-[#00CED1]/0 group-hover:bg-[#00CED1]/5 blur-md transition-all duration-300" />
                <span className="relative">Sign In</span>
              </Link>

              {/* Get Started Button - Primary CTA with gradient glow */}
              <Link
                href="/sign-up"
                className="
                  relative group px-5 py-2.5 text-sm font-semibold rounded-lg
                  overflow-hidden
                "
              >
                {/* Animated gradient background glow */}
                <div className="
                  absolute -inset-1
                  bg-gradient-to-r from-[#00CED1] via-[#8B5CF6] to-[#00CED1]
                  rounded-lg blur-lg opacity-40
                  group-hover:opacity-70
                  transition-all duration-500
                  animate-[gradient-shift_3s_ease-in-out_infinite]
                  bg-[length:200%_100%]
                " />

                {/* Button background */}
                <div className="
                  absolute inset-0
                  bg-gradient-to-r from-[#00CED1] to-[#00CED1]/90
                  rounded-lg
                  group-hover:from-[#00CED1] group-hover:to-cyan-400
                  transition-all duration-300
                " />

                {/* Shine effect */}
                <div className="
                  absolute inset-0
                  bg-gradient-to-r from-transparent via-white/20 to-transparent
                  -translate-x-full group-hover:translate-x-full
                  transition-transform duration-700
                  rounded-lg
                " />

                {/* Button text */}
                <span className="
                  relative text-[#0a0a0a] font-semibold
                  drop-shadow-[0_1px_1px_rgba(0,0,0,0.1)]
                ">
                  Get Started
                </span>
              </Link>
            </SignedOut>

            <SignedIn>
              {/* Dashboard Link */}
              <Link
                href="/dashboard"
                className="
                  relative px-5 py-2 text-sm font-medium text-zinc-400
                  hover:text-[#00CED1] transition-all duration-300
                  rounded-lg
                  hover:bg-[#00CED1]/5
                  border border-transparent hover:border-[#00CED1]/20
                  group
                "
              >
                <span className="absolute inset-0 rounded-lg bg-[#00CED1]/0 group-hover:bg-[#00CED1]/5 blur-md transition-all duration-300" />
                <span className="relative flex items-center gap-2">
                  <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2V6zM14 6a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2V6zM4 16a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2v-2zM14 16a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2v-2z" />
                  </svg>
                  Dashboard
                </span>
              </Link>

              {/* User Button with custom styling */}
              <div className="relative group">
                {/* Glow ring around avatar */}
                <div className="absolute -inset-1 bg-gradient-to-r from-[#00CED1]/30 to-[#8B5CF6]/30 rounded-full blur-sm opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                <UserButton
                  afterSignOutUrl="/"
                  appearance={{
                    elements: {
                      avatarBox: 'w-9 h-9 ring-2 ring-white/10 hover:ring-[#00CED1]/50 transition-all duration-300',
                      userButtonPopoverCard: 'bg-[#141414]/95 backdrop-blur-xl border border-white/10 shadow-[0_0_40px_rgba(0,206,209,0.15)]',
                      userButtonPopoverActionButton: 'hover:bg-[#00CED1]/10 text-zinc-300 hover:text-white',
                      userButtonPopoverActionButtonText: 'text-zinc-300',
                      userButtonPopoverActionButtonIcon: 'text-[#00CED1]',
                      userButtonPopoverFooter: 'hidden',
                    },
                  }}
                />
              </div>
            </SignedIn>
          </div>
        </div>
      </div>

      {/* Bottom glow line */}
      <div className="absolute bottom-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-[#00CED1]/20 to-transparent" />
    </header>
  );
}
