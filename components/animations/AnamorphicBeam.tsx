'use client';

import { useEffect, useRef, useState } from 'react';

/**
 * AnamorphicBeam - Scroll-responsive horizontal scanning beam
 *
 * CRITICAL NOTES:
 * - Uses useEffect to avoid hydration mismatch
 * - Handles both native scroll AND smooth scroll libraries (Lenis, Locomotive)
 * - Falls back to document.documentElement.scrollTop if window.scrollY fails
 * - Respects prefers-reduced-motion
 */
export function AnamorphicBeam() {
  const beamRef = useRef<HTMLDivElement>(null);
  const [prefersReducedMotion, setPrefersReducedMotion] = useState(false);
  const tickingRef = useRef(false);

  useEffect(() => {
    // Check reduced motion preference
    const motionQuery = window.matchMedia('(prefers-reduced-motion: reduce)');
    setPrefersReducedMotion(motionQuery.matches);

    const handleMotionChange = (e: MediaQueryListEvent) => {
      setPrefersReducedMotion(e.matches);
    };

    motionQuery.addEventListener('change', handleMotionChange);
    return () => motionQuery.removeEventListener('change', handleMotionChange);
  }, []);

  useEffect(() => {
    if (prefersReducedMotion) return;

    const beam = beamRef.current;
    if (!beam) return;

    const updateBeamPosition = () => {
      // Handle both native scroll and smooth scroll libraries
      const scrollY = window.scrollY ||
                      window.pageYOffset ||
                      document.documentElement.scrollTop ||
                      document.body.scrollTop ||
                      0;

      const docHeight = Math.max(
        document.documentElement.scrollHeight,
        document.body.scrollHeight
      );
      const viewportHeight = window.innerHeight;
      const scrollableDistance = docHeight - viewportHeight;

      // Prevent division by zero
      const scrollPercent = scrollableDistance > 0
        ? scrollY / scrollableDistance
        : 0;

      // Beam moves between 20% and 80% of viewport height
      const beamY = 20 + (scrollPercent * 60);
      beam.style.setProperty('--scan-y', `${beamY}%`);

      tickingRef.current = false;
    };

    const handleScroll = () => {
      if (!tickingRef.current) {
        window.requestAnimationFrame(updateBeamPosition);
        tickingRef.current = true;
      }
    };

    // Initial position
    updateBeamPosition();

    // Listen for scroll events
    window.addEventListener('scroll', handleScroll, { passive: true });

    // Also listen on document for smooth scroll library compatibility
    document.addEventListener('scroll', handleScroll, { passive: true });

    return () => {
      window.removeEventListener('scroll', handleScroll);
      document.removeEventListener('scroll', handleScroll);
    };
  }, [prefersReducedMotion]);

  if (prefersReducedMotion) {
    return null;
  }

  return (
    <div
      ref={beamRef}
      className="fixed inset-x-0 top-0 h-screen pointer-events-none z-[1] overflow-hidden"
      aria-hidden="true"
    >
      {/* Main beam line */}
      <div
        className="absolute left-[-100%] right-[-100%] h-[2px] transition-[top] duration-300"
        style={{
          top: 'var(--scan-y, 30%)',
          background: `linear-gradient(90deg,
            transparent 0%,
            rgba(0, 191, 255, 0.1) 20%,
            rgba(0, 191, 255, 0.4) 50%,
            rgba(0, 191, 255, 0.1) 80%,
            transparent 100%
          )`,
          boxShadow: `
            0 0 40px 20px rgba(0, 191, 255, 0.1),
            0 0 80px 40px rgba(0, 191, 255, 0.05)
          `,
          animation: 'beamPulse 4s ease-in-out infinite',
        }}
      />

      {/* Ambient glow below beam */}
      <div
        className="absolute inset-x-0 h-[200px] -translate-y-1/2 transition-[top] duration-300"
        style={{
          top: 'var(--scan-y, 30%)',
          background: 'radial-gradient(ellipse 100% 100px at center, rgba(0, 191, 255, 0.08) 0%, transparent 70%)',
        }}
      />

      <style jsx>{`
        @keyframes beamPulse {
          0%, 100% { opacity: 0.6; }
          50% { opacity: 1; }
        }
      `}</style>
    </div>
  );
}

export default AnamorphicBeam;
