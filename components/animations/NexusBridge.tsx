'use client';

import { useEffect, useRef, useState } from 'react';

interface NexusBridgeProps {
  /** CSS selector for the start section (e.g., '#origin-section' or '[data-nexus-start]') */
  startSelector: string;
  /** CSS selector for the end section (e.g., '#cta-section' or '[data-nexus-end]') */
  endSelector: string;
}

/**
 * NexusBridge - Vertical progress connector between two sections
 *
 * CRITICAL NOTES:
 * - Uses useEffect to find DOM elements after hydration
 * - Handles smooth scroll libraries by checking multiple scroll sources
 * - Shows/hides based on whether tracked sections are in view
 * - Respects prefers-reduced-motion
 */
export function NexusBridge({ startSelector, endSelector }: NexusBridgeProps) {
  const fillRef = useRef<HTMLDivElement>(null);
  const [isVisible, setIsVisible] = useState(false);
  const [progress, setProgress] = useState(0);
  const [startNodeActive, setStartNodeActive] = useState(false);
  const [endNodeActive, setEndNodeActive] = useState(false);
  const [prefersReducedMotion, setPrefersReducedMotion] = useState(false);

  useEffect(() => {
    const motionQuery = window.matchMedia('(prefers-reduced-motion: reduce)');
    setPrefersReducedMotion(motionQuery.matches);

    const handleChange = (e: MediaQueryListEvent) => setPrefersReducedMotion(e.matches);
    motionQuery.addEventListener('change', handleChange);
    return () => motionQuery.removeEventListener('change', handleChange);
  }, []);

  useEffect(() => {
    if (prefersReducedMotion) return;

    // Find sections after component mounts (DOM is ready)
    const startSection = document.querySelector(startSelector);
    const endSection = document.querySelector(endSelector);

    if (!startSection || !endSection) {
      console.warn(`NexusBridge: Could not find sections. Start: "${startSelector}", End: "${endSelector}"`);
      return;
    }

    const updateProgress = () => {
      const startRect = startSection.getBoundingClientRect();
      const endRect = endSection.getBoundingClientRect();
      const viewportHeight = window.innerHeight;

      const startTop = startRect.top;
      const endBottom = endRect.bottom;

      // Show bridge when start section enters viewport
      if (startTop < viewportHeight * 0.8 && endBottom > 0) {
        setIsVisible(true);

        // Calculate progress through the sections
        const totalDistance = endBottom - startTop;
        const scrolledDistance = viewportHeight * 0.5 - startTop;
        const calculatedProgress = Math.max(0, Math.min(1, scrolledDistance / totalDistance));

        setProgress(calculatedProgress);
        setStartNodeActive(calculatedProgress > 0.05);
        setEndNodeActive(calculatedProgress > 0.95);
      } else {
        setIsVisible(false);
      }
    };

    // Initial calculation
    updateProgress();

    // Listen for scroll
    const handleScroll = () => {
      requestAnimationFrame(updateProgress);
    };

    window.addEventListener('scroll', handleScroll, { passive: true });
    document.addEventListener('scroll', handleScroll, { passive: true });

    return () => {
      window.removeEventListener('scroll', handleScroll);
      document.removeEventListener('scroll', handleScroll);
    };
  }, [startSelector, endSelector, prefersReducedMotion]);

  if (prefersReducedMotion) {
    return null;
  }

  return (
    <div
      className={`
        fixed left-1/2 top-0 bottom-0 w-px -translate-x-1/2
        pointer-events-none z-[5]
        transition-opacity duration-500
        ${isVisible ? 'opacity-100' : 'opacity-0'}
      `}
      aria-hidden="true"
    >
      {/* Track (background line) */}
      <div className="absolute inset-0 bg-white/5" />

      {/* Fill (progress indicator) */}
      <div
        ref={fillRef}
        className="absolute top-0 left-0 right-0 transition-[height] duration-100"
        style={{
          height: `${progress * 100}%`,
          background: `linear-gradient(180deg,
            #fbbf24 0%,
            #00bfff 50%,
            #00bfff 100%
          )`,
          boxShadow: '0 0 10px rgba(0, 191, 255, 0.5)',
        }}
      />

      {/* Start node */}
      <div
        className={`
          absolute top-0 left-1/2 -translate-x-1/2
          w-2 h-2 rounded-full
          bg-[#00bfff]
          transition-opacity duration-300
          ${startNodeActive ? 'opacity-100' : 'opacity-0'}
        `}
        style={{
          boxShadow: '0 0 15px rgba(0, 191, 255, 0.6)',
        }}
      />

      {/* End node */}
      <div
        className={`
          absolute bottom-0 left-1/2 -translate-x-1/2
          w-2 h-2 rounded-full
          bg-[#00bfff]
          transition-opacity duration-300
          ${endNodeActive ? 'opacity-100' : 'opacity-0'}
        `}
        style={{
          boxShadow: '0 0 15px rgba(0, 191, 255, 0.6)',
        }}
      />
    </div>
  );
}

export default NexusBridge;
