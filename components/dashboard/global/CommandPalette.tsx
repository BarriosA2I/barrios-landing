'use client';

import React, { useState, useEffect, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

interface Action {
  id: string;
  title: string;
  description: string;
  icon: string;
  shortcut?: string;
  category: 'Workspace' | 'Infrastructure' | 'System';
}

const ACTIONS: Action[] = [
  { id: 'new-prod', title: 'New Production', description: 'Start a high-fidelity video project', icon: '🎬', shortcut: 'N', category: 'Workspace' },
  { id: 'nexus-status', title: 'NEXUS Status', description: 'Check GPU compute and memory health', icon: '⚡', shortcut: 'S', category: 'Infrastructure' },
  { id: 'voice-clone', title: 'Voice Clone', description: 'Create a new AI voice profile', icon: '🎤', shortcut: 'V', category: 'Workspace' },
  { id: 'billing', title: 'Manage Billing', description: 'Update subscription or view invoices', icon: '💳', shortcut: 'B', category: 'System' },
];

export default function CommandPalette() {
  const [isOpen, setIsOpen] = useState(false);
  const [search, setSearch] = useState('');

  useEffect(() => {
    const down = (e: KeyboardEvent) => {
      if (e.key === 'k' && (e.metaKey || e.ctrlKey)) {
        e.preventDefault();
        setIsOpen((open) => !open);
      }
    };
    document.addEventListener('keydown', down);
    return () => document.removeEventListener('keydown', down);
  }, []);

  const filteredActions = ACTIONS.filter(action =>
    action.title.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={() => setIsOpen(false)}
            className="fixed inset-0 bg-[#0A0E27]/60 backdrop-blur-md z-[100]"
          />
          <motion.div
            initial={{ opacity: 0, scale: 0.95, y: -20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95, y: -20 }}
            className="fixed top-[20%] left-1/2 -translate-x-1/2 w-full max-w-2xl z-[101] px-4"
          >
            <div className="bg-[#0A0E27]/90 border border-white/10 rounded-2xl shadow-2xl overflow-hidden backdrop-blur-2xl">
              {/* Gold Accent Line */}
              <div className="h-0.5 w-full bg-gradient-to-r from-transparent via-[#FFA726] to-transparent opacity-50" />

              <div className="p-4 border-b border-white/5">
                <input
                  autoFocus
                  placeholder="Type a command or search..."
                  value={search}
                  onChange={(e) => setSearch(e.target.value)}
                  className="w-full bg-transparent text-white text-lg outline-none placeholder:text-white/20"
                />
              </div>

              <div className="max-h-[400px] overflow-y-auto p-2">
                {['Workspace', 'Infrastructure', 'System'].map((cat) => {
                  const categoryActions = filteredActions.filter(a => a.category === cat);
                  if (categoryActions.length === 0) return null;

                  return (
                    <div key={cat} className="mb-4">
                      <h3 className="px-3 py-2 text-[10px] font-bold text-white/30 uppercase tracking-widest">{cat}</h3>
                      {categoryActions.map((action) => (
                        <button
                          key={action.id}
                          className="w-full flex items-center gap-4 px-3 py-3 rounded-xl hover:bg-white/5 transition-colors group text-left focus:outline-none focus:ring-2 focus:ring-[#FFA726] focus:ring-offset-2 focus:ring-offset-[#0A0E27]"
                        >
                          <div className="w-10 h-10 rounded-lg bg-white/5 flex items-center justify-center text-xl group-hover:bg-cyan-500/20 group-hover:text-cyan-400 transition-all">
                            {action.icon}
                          </div>
                          <div className="flex-1">
                            <div className="text-white font-medium">{action.title}</div>
                            <div className="text-sm text-white/40">{action.description}</div>
                          </div>
                          {action.shortcut && (
                            <div className="text-[10px] font-mono text-white/20 bg-white/5 px-2 py-1 rounded">
                              ⌘{action.shortcut}
                            </div>
                          )}
                        </button>
                      ))}
                    </div>
                  );
                })}
              </div>

              <div className="p-3 bg-white/[0.02] border-t border-white/5 flex justify-between items-center text-[10px] text-white/30 uppercase tracking-tighter">
                <span>Navigate ↑↓</span>
                <span>Select ↵</span>
                <span>Close esc</span>
              </div>
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
}
