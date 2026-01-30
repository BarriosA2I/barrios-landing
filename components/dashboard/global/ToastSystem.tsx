'use client';

import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

export type ToastType = 'info' | 'success' | 'warning' | 'error';

interface Toast {
  id: string;
  message: string;
  type: ToastType;
}

export default function ToastSystem() {
  const [toasts, setToasts] = useState<Toast[]>([]);

  // Function exposed to window for quick debugging/testing in dev
  useEffect(() => {
    (window as any).notify = (message: string, type: ToastType = 'info') => {
      const id = Math.random().toString(36).substring(2, 9);
      setToasts(prev => [...prev, { id, message, type }]);
      setTimeout(() => {
        setToasts(prev => prev.filter(t => t.id !== id));
      }, 5000);
    };
  }, []);

  const colors = {
    info: 'border-cyan-500/50 bg-cyan-500/10 text-cyan-400',
    success: 'border-emerald-500/50 bg-emerald-500/10 text-emerald-400',
    warning: 'border-amber-500/50 bg-amber-500/10 text-amber-400',
    error: 'border-red-500/50 bg-red-500/10 text-red-400',
  };

  return (
    <div className="fixed bottom-8 right-8 z-[120] flex flex-col gap-3 w-80">
      <AnimatePresence>
        {toasts.map((toast) => (
          <motion.div
            key={toast.id}
            initial={{ opacity: 0, x: 50, scale: 0.9 }}
            animate={{ opacity: 1, x: 0, scale: 1 }}
            exit={{ opacity: 0, scale: 0.9, transition: { duration: 0.2 } }}
            className={`
              relative overflow-hidden p-4 rounded-xl backdrop-blur-xl border
              flex items-start gap-3 shadow-2xl ${colors[toast.type]}
            `}
          >
            <div className="flex-1 text-sm font-medium leading-relaxed">
              <span className="text-[10px] opacity-50 block mb-1 uppercase tracking-widest">System Event</span>
              {toast.message}
            </div>

            {/* Background Progress Bar */}
            <motion.div
              initial={{ width: '100%' }}
              animate={{ width: '0%' }}
              transition={{ duration: 5, ease: "linear" }}
              className="absolute bottom-0 left-0 h-0.5 bg-current opacity-30"
            />
          </motion.div>
        ))}
      </AnimatePresence>
    </div>
  );
}
