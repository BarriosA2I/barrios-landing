'use client';

import { useEffect, useRef, useState, ReactNode } from 'react';
import { cn } from '@/lib/utils';

interface LiquidCardProps {
  children: ReactNode;
  className?: string;
  glowColor?: string;
}

/**
 * LiquidCard - Mouse-tracking border glow effect
 *
 * CRITICAL NOTES:
 * - Uses useRef + useEffect to avoid hydration issues
 * - Only enables mouse tracking on desktop (hover: hover) devices
 * - CSS variables are set via ref, not state (prevents re-renders)
 * - Respects prefers-reduced-motion
 */
export function LiquidCard({
  children,
  className,
  glowColor = 'rgba(0, 191, 255, 0.4)'
}: LiquidCardProps) {
  const cardRef = useRef<HTMLDivElement>(null);
  const [isDesktop, setIsDesktop] = useState(false);
  const [prefersReducedMotion, setPrefersReducedMotion] = useState(false);

  useEffect(() => {
    // Check device capabilities AFTER hydration
    const hoverQuery = window.matchMedia('(hover: hover) and (pointer: fine)');
    const motionQuery = window.matchMedia('(prefers-reduced-motion: reduce)');

    setIsDesktop(hoverQuery.matches);
    setPrefersReducedMotion(motionQuery.matches);

    const handleHoverChange = (e: MediaQueryListEvent) => setIsDesktop(e.matches);
    const handleMotionChange = (e: MediaQueryListEvent) => setPrefersReducedMotion(e.matches);

    hoverQuery.addEventListener('change', handleHoverChange);
    motionQuery.addEventListener('change', handleMotionChange);

    return () => {
      hoverQuery.removeEventListener('change', handleHoverChange);
      motionQuery.removeEventListener('change', handleMotionChange);
    };
  }, []);

  useEffect(() => {
    if (!isDesktop || prefersReducedMotion) return;

    const card = cardRef.current;
    if (!card) return;

    const handleMouseMove = (e: MouseEvent) => {
      const rect = card.getBoundingClientRect();
      const x = e.clientX - rect.left;
      const y = e.clientY - rect.top;

      // Set CSS variables directly on the element
      card.style.setProperty('--mouse-x', `${x}px`);
      card.style.setProperty('--mouse-y', `${y}px`);
    };

    const handleMouseLeave = () => {
      // Reset to center when mouse leaves
      card.style.setProperty('--mouse-x', '50%');
      card.style.setProperty('--mouse-y', '50%');
    };

    card.addEventListener('mousemove', handleMouseMove);
    card.addEventListener('mouseleave', handleMouseLeave);

    return () => {
      card.removeEventListener('mousemove', handleMouseMove);
      card.removeEventListener('mouseleave', handleMouseLeave);
    };
  }, [isDesktop, prefersReducedMotion]);

  return (
    <div
      ref={cardRef}
      className={cn(
        // Base styles
        'relative rounded-2xl overflow-hidden',
        'bg-[rgba(11,18,32,0.5)] backdrop-blur-xl',
        'border border-white/10',
        // Transition
        'transition-all duration-400',
        // Hover states (desktop only via CSS)
        'hover:border-[rgba(0,191,255,0.2)]',
        isDesktop && !prefersReducedMotion && 'hover:-translate-y-1.5 hover:scale-[1.02]',
        className
      )}
      style={{
        '--mouse-x': '50%',
        '--mouse-y': '50%',
        '--glow-color': glowColor,
      } as React.CSSProperties}
    >
      {/* Radial border glow (follows mouse) */}
      {isDesktop && !prefersReducedMotion && (
        <div
          className="absolute -inset-px rounded-[17px] p-px pointer-events-none opacity-0 hover:opacity-100 transition-opacity duration-400"
          style={{
            background: `radial-gradient(
              400px circle at var(--mouse-x) var(--mouse-y),
              var(--glow-color),
              transparent 60%
            )`,
            WebkitMask: 'linear-gradient(#fff 0 0) content-box, linear-gradient(#fff 0 0)',
            mask: 'linear-gradient(#fff 0 0) content-box, linear-gradient(#fff 0 0)',
            WebkitMaskComposite: 'xor',
            maskComposite: 'exclude',
          }}
        />
      )}

      {/* Internal glow (follows mouse) */}
      {isDesktop && !prefersReducedMotion && (
        <div
          className="liquid-card-glow absolute inset-0 pointer-events-none opacity-0 transition-opacity duration-400"
          style={{
            background: `radial-gradient(
              600px circle at var(--mouse-x) var(--mouse-y),
              rgba(0, 191, 255, 0.1),
              transparent 50%
            )`,
          }}
        />
      )}

      {/* Content wrapper */}
      <div className="relative z-10">
        {children}
      </div>

      {/* Shimmer line at bottom */}
      <div
        className="shimmer-line absolute bottom-0 left-0 h-px w-full origin-left scale-x-0 transition-transform duration-500"
        style={{
          background: 'linear-gradient(90deg, rgba(0, 191, 255, 0.5), transparent)',
        }}
      />

      <style jsx>{`
        .liquid-card:hover .liquid-card-glow,
        div:hover > .liquid-card-glow {
          opacity: 1;
        }

        div:hover .shimmer-line {
          transform: scaleX(1);
        }

        @media (hover: none) {
          .liquid-card-glow {
            display: none;
          }
          .shimmer-line {
            display: none;
          }
        }
      `}</style>
    </div>
  );
}

export default LiquidCard;
