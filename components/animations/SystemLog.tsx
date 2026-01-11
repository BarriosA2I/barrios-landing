'use client';

import { useEffect, useState, useRef } from 'react';

interface LogEntry {
  type: 'SYSTEM' | 'SUCCESS' | 'WARN';
  msg: string;
  color: string;
}

const DEFAULT_LOG_ENTRIES: LogEntry[] = [
  { type: "SYSTEM", msg: "NEXUS_BRIDGE: Monitoring intake ports...", color: "#00bfff" },
  { type: "SUCCESS", msg: "TRINITY: Market intelligence scan complete (0.84s)", color: "#10b981" },
  { type: "SYSTEM", msg: "RAGNAROK: Volumetric render engine initialized.", color: "#00bfff" },
  { type: "WARN", msg: "CORE: Optimization cycle running - 12.4ms latency detected.", color: "#ffd700" },
  { type: "SYSTEM", msg: "NEXUS: New lead detected via identity_protocol.", color: "#00bfff" },
  { type: "SUCCESS", msg: "SYSTEM: All agents report GREEN status.", color: "#10b981" },
  { type: "SYSTEM", msg: "TRINITY: Cross-referencing competitive logic...", color: "#00bfff" },
  { type: "SUCCESS", msg: "RAGNAROK: Asset optimization complete (2.1s)", color: "#10b981" },
  { type: "SYSTEM", msg: "NEXUS: Lead scoring algorithm updated.", color: "#00bfff" },
  { type: "WARN", msg: "SYSTEM: Cache refresh in 45s.", color: "#ffd700" },
  { type: "SUCCESS", msg: "TRINITY: Sentiment analysis pipeline active.", color: "#10b981" },
  { type: "SYSTEM", msg: "CORE: Memory allocation optimized.", color: "#00bfff" }
];

interface SystemLogProps {
  /** Custom log entries (optional, uses defaults if not provided) */
  entries?: LogEntry[];
  /** Interval between log updates in ms (default: 3000) */
  interval?: number;
  /** Show network load indicator */
  showNetworkLoad?: boolean;
}

/**
 * SystemLog - Live system status ticker footer
 *
 * Displays rotating log messages with timestamps and status indicators.
 * Respects prefers-reduced-motion by disabling animations.
 */
export function SystemLog({
  entries = DEFAULT_LOG_ENTRIES,
  interval = 3000,
  showNetworkLoad = true
}: SystemLogProps) {
  const [currentLog, setCurrentLog] = useState('Initializing system log stream...');
  const [indicatorColor, setIndicatorColor] = useState('#00bfff');
  const [networkLoad, setNetworkLoad] = useState('0.04');
  const [isExiting, setIsExiting] = useState(false);
  const [prefersReducedMotion, setPrefersReducedMotion] = useState(false);
  const logIndexRef = useRef(0);

  useEffect(() => {
    const motionQuery = window.matchMedia('(prefers-reduced-motion: reduce)');
    setPrefersReducedMotion(motionQuery.matches);

    const handleChange = (e: MediaQueryListEvent) => setPrefersReducedMotion(e.matches);
    motionQuery.addEventListener('change', handleChange);
    return () => motionQuery.removeEventListener('change', handleChange);
  }, []);

  useEffect(() => {
    const updateLog = () => {
      const entry = entries[logIndexRef.current];
      const timestamp = new Date().toLocaleTimeString('en-US', { hour12: false });
      const formattedLog = `[${timestamp}] ${entry.msg}`;

      if (!prefersReducedMotion) {
        // Animate out, then in
        setIsExiting(true);

        setTimeout(() => {
          setCurrentLog(formattedLog);
          setIndicatorColor(entry.color);
          setIsExiting(false);
        }, 300);
      } else {
        // No animation
        setCurrentLog(formattedLog);
        setIndicatorColor(entry.color);
      }

      // Update network load with slight variation
      const loadValue = (Math.random() * 0.08 + 0.01).toFixed(2);
      setNetworkLoad(loadValue);

      logIndexRef.current = (logIndexRef.current + 1) % entries.length;
    };

    // Initial update after short delay
    const initialTimeout = setTimeout(updateLog, 1000);

    // Regular updates
    const intervalId = setInterval(updateLog, interval);

    return () => {
      clearTimeout(initialTimeout);
      clearInterval(intervalId);
    };
  }, [entries, interval, prefersReducedMotion]);

  return (
    <>
      <div
        className="fixed bottom-0 left-0 right-0 z-40 border-t border-white/5 py-3 px-4 md:px-6"
        style={{
          background: 'rgba(0, 0, 0, 0.4)',
          backdropFilter: 'blur(12px)',
          WebkitBackdropFilter: 'blur(12px)',
        }}
      >
        <div className="max-w-7xl mx-auto flex flex-col md:flex-row items-center justify-between gap-3 md:gap-4">

          {/* Scrolling Log Area */}
          <div className="flex-1 font-mono h-4 overflow-hidden relative w-full md:w-auto flex items-center text-[10px]">
            <span
              className="w-1.5 h-1.5 rounded-full mr-2 flex-shrink-0 transition-colors duration-200"
              style={{ background: indicatorColor }}
            />
            <div className="overflow-hidden flex-1">
              <p
                className={`text-slate-500 whitespace-nowrap text-[10px] ${
                  isExiting ? 'animate-log-exit' : 'animate-log-enter'
                }`}
              >
                {currentLog}
              </p>
            </div>
          </div>

          {/* Status Badges */}
          <div className="flex items-center gap-4 md:gap-6 flex-shrink-0">
            <div className="flex items-center gap-2">
              <span className="font-mono text-slate-500 uppercase text-[9px] font-bold tracking-widest">
                Global_Status
              </span>
              <div className="flex gap-1">
                <div className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-heartbeat" />
                <div className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-heartbeat animation-delay-400" />
                <div className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-heartbeat animation-delay-800" />
              </div>
            </div>

            {showNetworkLoad && (
              <div className="hidden lg:flex items-center gap-2 border-l border-white/10 pl-4 md:pl-6">
                <span className="font-mono text-slate-500 uppercase text-[9px] font-bold tracking-widest">
                  Network_Load
                </span>
                <span className="font-mono text-[10px] text-[#ffd700]">
                  {networkLoad}%
                </span>
              </div>
            )}
          </div>

        </div>
      </div>

      {/* Spacer to prevent content from hiding behind fixed footer */}
      <div className="h-12 md:h-10" />

      <style jsx>{`
        @keyframes logEnter {
          from {
            opacity: 0;
            transform: translateY(10px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }

        @keyframes logExit {
          from {
            opacity: 1;
            transform: translateY(0);
          }
          to {
            opacity: 0;
            transform: translateY(-10px);
          }
        }

        @keyframes heartbeat {
          0%, 100% { opacity: 0.3; }
          50% { opacity: 1; }
        }

        .animate-log-enter {
          animation: logEnter 0.5s cubic-bezier(0.16, 1, 0.3, 1) forwards;
        }

        .animate-log-exit {
          animation: logExit 0.3s cubic-bezier(0.16, 1, 0.3, 1) forwards;
        }

        .animate-heartbeat {
          animation: heartbeat 2s ease-in-out infinite;
        }

        .animation-delay-400 {
          animation-delay: 0.4s;
        }

        .animation-delay-800 {
          animation-delay: 0.8s;
        }

        @media (prefers-reduced-motion: reduce) {
          .animate-log-enter,
          .animate-log-exit {
            animation: none;
            opacity: 1;
          }
          .animate-heartbeat {
            animation: none;
            opacity: 0.7;
          }
        }
      `}</style>
    </>
  );
}

export default SystemLog;
