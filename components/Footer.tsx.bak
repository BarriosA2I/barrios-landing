"use client";

import React from 'react';
import { motion } from 'framer-motion';

/**
 * MISSION CONTROL FOOTER
 * Features: Terminal-style data grid, live status pings, glassmorphic links
 */

const STATS = [
  { label: "Global_Uptime", value: "99.999%" },
  { label: "Active_Agents", value: "59_NODES" },
  { label: "Neural_Latency", value: "420ms" }
];

const PRODUCT_LINKS = [
  "NEXUS Personal",
  "A2I Commercial Lab",
  "Command Center"
];

const NETWORK_LINKS = [
  "About Archive",
  "Founder Node",
  "System Status"
];

export default function Footer() {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="relative w-full bg-[#0a0a1e] pt-24 pb-12 overflow-hidden border-t border-white/5">
      {/* Background Decorative Grid */}
      <div
        className="absolute inset-0 opacity-[0.03] pointer-events-none"
        style={{
          backgroundImage: 'radial-gradient(#00bfff 1px, transparent 1px)',
          backgroundSize: '30px 30px'
        }}
      />

      <div className="max-w-7xl mx-auto px-6 relative z-10">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-8 mb-16">

          {/* Brand & Identity (Span 4) */}
          <div className="lg:col-span-4 flex flex-col gap-6">
            <div className="flex flex-col">
              <h2 className="text-2xl font-bold text-white tracking-tighter">
                BARRIOS <span className="text-[#ffd700]">A2I</span>
              </h2>
              <p className="text-[#00bfff] font-mono text-[10px] tracking-[0.3em] uppercase mt-1">
                Operational_Intelligence
              </p>
            </div>
            <div className="flex items-center gap-3">
              <span className="flex h-2 w-2 rounded-full bg-green-500 animate-pulse shadow-[0_0_8px_#22c55e]" />
              <span className="text-[10px] font-mono text-gray-400 uppercase tracking-widest">
                All Systems Operational
              </span>
            </div>
            <p className="text-gray-500 text-sm leading-relaxed max-w-xs">
              Installing autonomous intelligence that senses, decides, and acts across your entire operation—continuously.
            </p>
          </div>

          {/* Product Links (Span 2) */}
          <div className="lg:col-span-2">
            <h4 className="text-white font-bold text-xs uppercase tracking-widest mb-6">[ Products ]</h4>
            <ul className="flex flex-col gap-3 text-sm">
              {PRODUCT_LINKS.map((link) => (
                <li key={link}>
                  <a href="#" className="text-gray-500 font-medium hover:text-[#00bfff] transition-colors">
                    {link}
                  </a>
                </li>
              ))}
            </ul>
          </div>

          {/* Network Links (Span 2) */}
          <div className="lg:col-span-2">
            <h4 className="text-white font-bold text-xs uppercase tracking-widest mb-6">[ Network ]</h4>
            <ul className="flex flex-col gap-3 text-sm">
              {NETWORK_LINKS.map((link) => (
                <li key={link}>
                  <a href="#" className="text-gray-500 font-medium hover:text-[#00bfff] transition-colors">
                    {link}
                  </a>
                </li>
              ))}
            </ul>
          </div>

          {/* Social & Contact (Span 4) */}
          <div className="lg:col-span-4 flex flex-col items-start lg:items-end">
            <h4 className="text-white font-bold text-xs uppercase tracking-widest mb-6">[ Signal_Input ]</h4>
            <div className="flex gap-4 mb-8">
              {['Twitter', 'LinkedIn', 'Github'].map((platform) => (
                <motion.a
                  key={platform}
                  whileHover={{ scale: 1.1, color: '#ffd700' }}
                  href="#"
                  className="w-10 h-10 rounded-lg border border-white/10 flex items-center justify-center text-gray-400 backdrop-blur-sm bg-white/5"
                >
                  <span className="text-[10px] font-bold tracking-tighter">{platform[0]}</span>
                </motion.a>
              ))}
            </div>
            <p className="text-[#00bfff] font-mono text-xs hover:underline cursor-pointer">
              alienation2innovation@gmail.com
            </p>
          </div>
        </div>

        {/* Bottom Bar: Diagnostics Overlay */}
        <div className="pt-8 border-t border-white/5 flex flex-col md:flex-row justify-between items-center gap-6">
          <div className="flex items-center gap-8 order-2 md:order-1">
            {STATS.map((stat) => (
              <div key={stat.label} className="flex flex-col">
                <span className="text-[8px] font-mono text-gray-600 uppercase">{stat.label}</span>
                <span className="text-[10px] font-mono text-[#ffd700]">{stat.value}</span>
              </div>
            ))}
          </div>
          <p className="text-[10px] font-mono text-gray-600 order-1 md:order-2">
            © {currentYear} BARRIOS A2I. AUTHENTICATION_LEVEL: ADMIN_ROOT
          </p>
        </div>
      </div>
    </footer>
  );
}
