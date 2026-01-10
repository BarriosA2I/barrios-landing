"use client";

import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

const NAV_LINKS = [
  { name: 'Pricing', href: '#pricing', desc: 'Subscription & Token Architecture' },
  { name: 'Nexus', href: '#nexus', desc: 'Real-time Agentic Intelligence', badge: 'Live' },
  { name: 'Commercial_Lab', href: '#lab', desc: 'Autonomous Ad Production' },
  { name: 'Founder', href: '#founder', desc: 'The Engineering Narrative' },
  { name: 'Command Center', href: '#command', desc: 'Admin Management' },
];

export default function MobileMenu() {
  const [isOpen, setIsOpen] = useState(false);

  useEffect(() => {
    if (isOpen) document.body.style.overflow = 'hidden';
    else document.body.style.overflow = 'unset';
  }, [isOpen]);

  return (
    <div className="md:hidden">
      {/* Trigger Button: Hamburger Morph */}
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="relative z-[110] w-10 h-10 flex flex-col justify-center items-center gap-1.5 focus:outline-none"
      >
        <motion.span
          animate={isOpen ? { rotate: 45, y: 8 } : { rotate: 0, y: 0 }}
          className="w-6 h-0.5 bg-[#00bfff] rounded-full"
        />
        <motion.span
          animate={isOpen ? { opacity: 0 } : { opacity: 1 }}
          className="w-6 h-0.5 bg-[#00bfff] rounded-full"
        />
        <motion.span
          animate={isOpen ? { rotate: -45, y: -8 } : { rotate: 0, y: 0 }}
          className="w-6 h-0.5 bg-[#ffd700] rounded-full"
        />
      </button>

      {/* Full-Screen Overlay */}
      <AnimatePresence mode="wait">
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, backdropFilter: 'blur(0px)' }}
            animate={{ opacity: 1, backdropFilter: 'blur(24px)' }}
            exit={{ opacity: 0, backdropFilter: 'blur(0px)' }}
            className="fixed inset-0 z-[105] bg-[#0a0a1e]/80 flex flex-col p-8 pt-24"
          >
            {/* Background Decorative Element */}
            <div className="absolute top-[-10%] right-[-10%] w-[300px] h-[300px] bg-[#ffd700]/5 rounded-full blur-[100px]" />

            {/* Navigation Links */}
            <div className="flex flex-col gap-10 mt-12">
              {NAV_LINKS.map((link, i) => (
                <motion.a
                  key={link.name}
                  href={link.href}
                  onClick={() => setIsOpen(false)}
                  initial={{ x: -20, opacity: 0 }}
                  animate={{ x: 0, opacity: 1 }}
                  transition={{ delay: i * 0.1, ease: "easeOut" }}
                  className="group"
                >
                  <div className="flex items-center gap-3">
                    <span className="text-[#ffd700] font-mono text-xs">0{i + 1}</span>
                    <h2 className="text-3xl font-bold text-white tracking-tighter group-hover:text-[#00bfff] transition-colors">
                      {link.name}
                    </h2>
                    {link.badge && (
                      <span className="text-[10px] bg-[#00bfff]/20 text-[#00bfff] px-2 py-0.5 rounded border border-[#00bfff]/30 animate-pulse">
                        {link.badge}
                      </span>
                    )}
                  </div>
                  <p className="text-gray-500 text-sm mt-1 ml-7">{link.desc}</p>
                </motion.a>
              ))}
            </div>

            {/* Bottom System Data */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.6 }}
              className="mt-auto border-t border-white/10 pt-8 flex flex-col gap-4"
            >
              <div className="flex justify-between items-center">
                <span className="text-[10px] font-mono text-gray-500 tracking-widest uppercase">
                  Node_Location
                </span>
                <span className="text-[10px] font-mono text-[#00bfff]">
                  39.15° N, 77.24° W
                </span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-[10px] font-mono text-gray-500 tracking-widest uppercase">
                  Runtime_Status
                </span>
                <span className="text-[10px] font-mono text-green-400">
                  OPTIMAL_EXECUTION
                </span>
              </div>
              <button className="w-full mt-4 py-4 rounded-xl bg-[#00bfff] text-[#0a0a1e] font-bold text-center">
                BOOK STRATEGY SESSION
              </button>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
