'use client';

import { useEffect, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X } from 'lucide-react';

interface SlideOverProps {
  isOpen: boolean;
  onClose: () => void;
  title?: string;
  subtitle?: string;
  children: React.ReactNode;
  width?: 'sm' | 'md' | 'lg' | 'xl';
}

const widthClasses = {
  sm: 'max-w-sm',
  md: 'max-w-md',
  lg: 'max-w-lg',
  xl: 'max-w-xl',
};

export default function SlideOver({
  isOpen,
  onClose,
  title,
  subtitle,
  children,
  width = 'md',
}: SlideOverProps) {
  // Handle ESC key to close
  const handleKeyDown = useCallback(
    (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        onClose();
      }
    },
    [onClose]
  );

  useEffect(() => {
    if (isOpen) {
      document.addEventListener('keydown', handleKeyDown);
      document.body.style.overflow = 'hidden';
    }

    return () => {
      document.removeEventListener('keydown', handleKeyDown);
      document.body.style.overflow = 'unset';
    };
  }, [isOpen, handleKeyDown]);

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          {/* Backdrop */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.2 }}
            onClick={onClose}
            className="fixed inset-0 z-[100] bg-black/60 backdrop-blur-sm"
          />

          {/* Slide-over Panel */}
          <motion.div
            initial={{ x: '100%' }}
            animate={{ x: 0 }}
            exit={{ x: '100%' }}
            transition={{ type: 'spring', damping: 30, stiffness: 300 }}
            className={`fixed inset-y-0 right-0 z-[101] w-full ${widthClasses[width]} flex flex-col`}
          >
            <div className="flex h-full flex-col bg-[#0B1220] border-l border-white/10 shadow-2xl">
              {/* Header */}
              {(title || subtitle) && (
                <div className="flex items-start justify-between p-6 border-b border-white/10">
                  <div>
                    {title && (
                      <h2 className="text-xl font-bold text-white">{title}</h2>
                    )}
                    {subtitle && (
                      <p className="mt-1 text-sm text-slate-400">{subtitle}</p>
                    )}
                  </div>
                  <button
                    onClick={onClose}
                    className="rounded-lg p-2 text-slate-400 hover:text-white hover:bg-white/10 transition-colors"
                  >
                    <X size={20} />
                  </button>
                </div>
              )}

              {/* Close button if no header */}
              {!title && !subtitle && (
                <button
                  onClick={onClose}
                  className="absolute top-4 right-4 rounded-lg p-2 text-slate-400 hover:text-white hover:bg-white/10 transition-colors z-10"
                >
                  <X size={20} />
                </button>
              )}

              {/* Content */}
              <div className="flex-1 overflow-y-auto">{children}</div>
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
}
