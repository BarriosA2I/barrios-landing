"use client";

import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import Link from 'next/link';

/**
 * COMMAND DOCK HEADER
 * Refined for Barrios A2I
 * Features: Floating dock, system status pulse, glassmorphism
 */

const NAV_LINKS = [
  { name: 'Pricing', href: '#pricing' },
  { name: 'Nexus', href: '#nexus', badge: 'Live' },
  { name: 'Commercial_Lab', href: '#lab' },
  { name: 'Founder', href: '#founder' },
  { name: 'Command Center', href: '#command' },
];

export default function Header() {
  const [isScrolled, setIsScrolled] = useState(false);

  useEffect(() => {
    const handleScroll = () => setIsScrolled(window.scrollY > 20);
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  return (
    <header className="fixed top-0 left-0 w-full z-[100] px-6 py-4 flex justify-center pointer-events-none">
      <motion.nav
        initial={{ y: -20, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        className={`
          pointer-events-auto flex items-center justify-between
          max-w-7xl w-full px-6 py-3 rounded-2xl transition-all duration-500
          border border-white/10 backdrop-blur-xl
          ${isScrolled ? 'bg-white/5 shadow-[0_20px_40px_rgba(0,0,0,0.4)]' : 'bg-transparent'}
        `}
      >
        {/* Left: Brand Identity */}
        <div className="flex flex-col">
          <div className="flex items-center gap-2">
            <span className="w-2 h-2 bg-[#00bfff] rounded-full animate-pulse shadow-[0_0_10px_#00bfff]" />
            <span className="text-[10px] font-mono text-[#00bfff] tracking-[0.2em] uppercase">
              System_Connected
            </span>
          </div>
          <h1 className="text-xl font-bold text-white tracking-tighter">
            BARRIOS <span className="text-[#ffd700]">A2I</span>
          </h1>
        </div>

        {/* Center: Desktop Navigation */}
        <ul className="hidden md:flex items-center gap-8">
          {NAV_LINKS.map((link) => (
            <li key={link.name}>
              <a
                href={link.href}
                className="relative group text-sm font-medium text-gray-400 hover:text-white transition-colors"
              >
                {link.name}
                {link.badge && (
                  <span className="absolute -top-3 -right-4 text-[8px] bg-[#00bfff]/20 text-[#00bfff] px-1.5 py-0.5 rounded border border-[#00bfff]/30">
                    {link.badge}
                  </span>
                )}
                <span className="absolute -bottom-1 left-0 w-0 h-[1px] bg-[#ffd700] transition-all group-hover:w-full" />
              </a>
            </li>
          ))}
        </ul>

        {/* Right: Auth Actions */}
        <div className="flex items-center gap-4">
          <Link
            href="/sign-in"
            className="hidden lg:block text-sm font-medium text-gray-400 hover:text-[#00CED1] transition-colors"
          >
            Sign In
          </Link>
          <Link href="/sign-up">
            <motion.button
              whileHover={{ scale: 1.02, boxShadow: "0 0 20px rgba(0, 206, 209, 0.4)" }}
              whileTap={{ scale: 0.98 }}
              className="px-5 py-2.5 rounded-xl bg-gradient-to-br from-[#00CED1] to-[#8B5CF6] text-white text-sm font-bold shadow-lg flex items-center gap-2"
            >
              Get Started
              <svg width="12" height="12" viewBox="0 0 12 12" fill="none" xmlns="http://www.w3.org/2000/svg">
                <path d="M2 6H10M10 6L7 9M10 6L7 3" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
              </svg>
            </motion.button>
          </Link>
        </div>
      </motion.nav>
    </header>
  );
}
