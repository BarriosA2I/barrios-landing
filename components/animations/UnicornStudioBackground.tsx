'use client';

import { useEffect, useRef } from 'react';
import Script from 'next/script';

interface UnicornStudioBackgroundProps {
  /**
   * YOUR Unicorn Studio Project ID
   *
   * CRITICAL: This MUST be your own project ID from unicornstudio.com
   *
   * Steps to get your ID:
   * 1. Go to https://unicornstudio.com
   * 2. Create account or log in
   * 3. Create/design your effect (or use a template)
   * 4. Click "Export" -> "Embed"
   * 5. Copy the project ID from the data-us-project attribute
   * 6. IMPORTANT: Whitelist your domain in project settings
   *    - Add localhost:3000 for development
   *    - Add barriosa2i.com (or your domain) for production
   *
   * If you don't whitelist domains, the effect will show as black/empty!
   */
  projectId: string;

  /** Optional: Show gradient overlay at bottom to blend with content */
  showBottomFade?: boolean;

  /** Optional: Additional CSS classes */
  className?: string;
}

/**
 * UnicornStudioBackground - WebGL shader background from Unicorn Studio
 *
 * THIS IS A THIRD-PARTY DEPENDENCY
 *
 * The actual animation is NOT in this code - it's hosted on Unicorn Studio's servers.
 * This component just loads their SDK and points it to your project.
 *
 * Common issues:
 * - Black screen: Your domain isn't whitelisted, or project ID is wrong
 * - Nothing shows: SDK failed to load (check console for errors)
 * - Works on localhost but not production: Add production domain to whitelist
 */
export function UnicornStudioBackground({
  projectId,
  showBottomFade = true,
  className = ''
}: UnicornStudioBackgroundProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const initialized = useRef(false);

  useEffect(() => {
    // Only initialize once per mount
    if (initialized.current) return;

    const initUnicorn = () => {
      if (typeof window !== 'undefined' && (window as any).UnicornStudio) {
        if (!(window as any).UnicornStudio.isInitialized) {
          (window as any).UnicornStudio.init();
          (window as any).UnicornStudio.isInitialized = true;
        }
        initialized.current = true;
      }
    };

    // Check if already loaded
    if ((window as any).UnicornStudio) {
      initUnicorn();
    }

    // Also listen for script load
    const handleLoad = () => initUnicorn();
    window.addEventListener('unicornstudio-loaded', handleLoad);

    return () => {
      window.removeEventListener('unicornstudio-loaded', handleLoad);
    };
  }, []);

  return (
    <>
      {/* Unicorn Studio SDK */}
      <Script
        src="https://cdn.jsdelivr.net/gh/hiunicornstudio/unicornstudio.js@v1.4.33/dist/unicornStudio.umd.js"
        strategy="afterInteractive"
        onLoad={() => {
          // Mark as not initialized so our useEffect picks it up
          if (typeof window !== 'undefined') {
            (window as any).UnicornStudio = (window as any).UnicornStudio || {};
            (window as any).UnicornStudio.isInitialized = false;
            window.dispatchEvent(new Event('unicornstudio-loaded'));
          }
        }}
      />

      {/* Background container */}
      <div
        ref={containerRef}
        className={`fixed inset-0 z-0 pointer-events-none overflow-hidden ${className}`}
        aria-hidden="true"
      >
        {/* Unicorn Studio embed target */}
        <div
          data-us-project={projectId}
          className="absolute inset-0"
        />

        {/* Bottom fade gradient (blends with page content) */}
        {showBottomFade && (
          <div
            className="absolute inset-0 z-10"
            style={{
              background: 'linear-gradient(to bottom, transparent 0%, transparent 60%, rgba(10, 10, 30, 0.8) 100%)',
            }}
          />
        )}
      </div>
    </>
  );
}

export default UnicornStudioBackground;
