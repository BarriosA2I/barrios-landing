'use client';

import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';

// --- Sub-Components ---

const HardwareGauge = ({
  label,
  value,
  unit,
  color = "cyan"
}: {
  label: string;
  value: number;
  unit: string;
  color?: "cyan" | "gold" | "red"
}) => {
  const colorMap = {
    cyan: "from-cyan-500 to-blue-500 shadow-cyan-500/20",
    gold: "from-amber-500 to-orange-500 shadow-amber-500/20",
    red: "from-red-500 to-rose-600 shadow-red-500/20",
  };

  return (
    <div className="bg-white/[0.03] border border-white/10 rounded-xl p-4 backdrop-blur-md">
      <div className="flex justify-between items-end mb-2">
        <span className="text-[10px] font-bold text-white/70 uppercase tracking-widest">{label}</span>
        <span className="text-xl font-mono font-bold text-white">
          {value}<span className="text-xs text-white/30 ml-1">{unit}</span>
        </span>
      </div>
      <div
        role="progressbar"
        aria-label={label}
        aria-valuenow={value}
        aria-valuemin={0}
        aria-valuemax={100}
        className="h-1.5 w-full bg-white/5 rounded-full overflow-hidden"
      >
        <motion.div
          initial={{ width: 0 }}
          animate={{ width: `${value}%` }}
          className={`h-full bg-gradient-to-r ${colorMap[color]} rounded-full`}
        />
      </div>
    </div>
  );
};

const ModuleCard = ({
  name,
  status,
  load
}: {
  name: string;
  status: 'online' | 'syncing' | 'offline';
  load: number
}) => {
  const statusLabels = {
    online: 'Online',
    syncing: 'Syncing',
    offline: 'Offline'
  };

  return (
    <div className="group relative bg-white/[0.02] border border-white/5 rounded-xl p-4 hover:bg-white/[0.05] transition-all">
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-sm font-semibold text-white/80">{name}</h3>
        <span className="flex items-center gap-1.5">
          <span className={`h-2 w-2 rounded-full ${status === 'online' ? 'bg-emerald-500 animate-pulse' : status === 'syncing' ? 'bg-amber-500' : 'bg-slate-500'}`} />
          <span className="sr-only">Status: {statusLabels[status]}</span>
        </span>
      </div>
      <div className="space-y-1">
        <div className="flex justify-between text-[10px] text-white/30 uppercase">
          <span>Load</span>
          <span>{load}%</span>
        </div>
        <div
          role="progressbar"
          aria-label={`${name} load`}
          aria-valuenow={load}
          aria-valuemin={0}
          aria-valuemax={100}
          className="h-1 bg-white/5 rounded-full overflow-hidden"
        >
          <div className="h-full bg-white/20 rounded-full" style={{ width: `${load}%` }} />
        </div>
      </div>
      <button className="mt-4 w-full py-2 text-[10px] font-bold uppercase tracking-tighter border border-white/10 rounded-md hover:bg-cyan-500/20 hover:text-cyan-400 hover:border-cyan-500/40 transition-all focus:outline-none focus:ring-2 focus:ring-[#FFA726] focus:ring-offset-2 focus:ring-offset-[#0A0E27]">
        Reboot Module
      </button>
    </div>
  );
};

// --- Main Page ---

export default function NexusPersonal() {
  const [telemetry, setTelemetry] = useState({ gpu: 74, vram: 88, temp: 62, fan: 45 });

  // Simulate real-time data jitter (replace with WebSocket in production)
  useEffect(() => {
    const interval = setInterval(() => {
      setTelemetry(prev => ({
        gpu: Math.max(70, Math.min(95, prev.gpu + (Math.random() * 4 - 2))),
        vram: Math.max(85, Math.min(92, prev.vram + (Math.random() * 2 - 1))),
        temp: Math.max(60, Math.min(68, prev.temp + (Math.random() * 1 - 0.5))),
        fan: prev.fan
      }));
    }, 2000);
    return () => clearInterval(interval);
  }, []);

  return (
    <div className="min-h-screen bg-[#0A0E27] text-white p-8">
      {/* Background Scanning Effect */}
      <div className="fixed inset-0 pointer-events-none overflow-hidden opacity-10">
        <div className="absolute inset-0 bg-[linear-gradient(to_bottom,transparent_0%,rgba(0,217,255,0.1)_50%,transparent_100%)] h-[200%] animate-scan-line" />
      </div>

      <div className="relative max-w-7xl mx-auto space-y-8">
        {/* Header */}
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <h1 className="text-4xl font-black tracking-tighter uppercase italic">
              NEXUS <span className="text-cyan-400">Personal</span>
            </h1>
            <p className="text-white/40 text-sm font-mono tracking-tight">System ID: A2I-CORE-001 // Local Instance</p>
          </div>
          <button className="px-6 py-3 bg-red-500/10 border border-red-500/40 text-red-500 text-xs font-bold uppercase tracking-widest hover:bg-red-500 hover:text-white transition-all rounded-lg focus:outline-none focus:ring-2 focus:ring-red-500 focus:ring-offset-2 focus:ring-offset-[#0A0E27]">
            Emergency System Kill
          </button>
        </div>

        {/* Top Tier: Critical Telemetry */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          <HardwareGauge label="Primary GPU Load" value={Math.round(telemetry.gpu)} unit="%" color="cyan" />
          <HardwareGauge label="VRAM Utilization" value={Math.round(telemetry.vram)} unit="%" color="cyan" />
          <HardwareGauge label="Core Temperature" value={Math.round(telemetry.temp)} unit="°C" color={telemetry.temp > 65 ? "gold" : "cyan"} />
          <HardwareGauge label="Fan Speed" value={telemetry.fan} unit="%" color="cyan" />
        </div>

        {/* Middle Tier: Modules & Advanced Controls */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">

          {/* Active Modules List */}
          <div className="lg:col-span-2 space-y-4">
            <div className="flex items-center justify-between border-b border-white/10 pb-2">
              <h2 className="text-xs font-bold uppercase tracking-widest text-white/60">Neural Modules</h2>
              <span className="text-[10px] font-mono text-cyan-400">4 Active Nodes</span>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <ModuleCard name="Vision Analysis v4" status="online" load={42} />
              <ModuleCard name="Voice Synthesis (Local)" status="online" load={12} />
              <ModuleCard name="Knowledge Graph Sync" status="syncing" load={89} />
              <ModuleCard name="Automation Bridge" status="online" load={4} />
            </div>
          </div>

          {/* Infrastructure Tuning */}
          <div className="bg-white/[0.03] border border-white/10 rounded-2xl p-6 space-y-6">
            <h2 className="text-xs font-bold uppercase tracking-widest text-white/60 mb-4">Resource Allocation</h2>

            <div className="space-y-4">
              <div>
                <label className="flex justify-between text-[10px] uppercase mb-2 text-white/40">
                  <span>Throughput Limit</span>
                  <span className="text-cyan-400">4.2 GB/s</span>
                </label>
                <input
                  type="range"
                  aria-label="Throughput Limit"
                  className="w-full h-1 bg-white/10 rounded-lg appearance-none cursor-pointer accent-cyan-500"
                />
              </div>

              <div>
                <label className="flex justify-between text-[10px] uppercase mb-2 text-white/40">
                  <span>Memory Buffer</span>
                  <span className="text-cyan-400">84 GB</span>
                </label>
                <input
                  type="range"
                  aria-label="Memory Buffer"
                  className="w-full h-1 bg-white/10 rounded-lg appearance-none cursor-pointer accent-cyan-500"
                />
              </div>
            </div>

            <div className="pt-6 border-t border-white/5 space-y-3">
              <div className="flex justify-between text-xs">
                <span className="text-white/40">Compute Tier</span>
                <span className="text-amber-500 font-bold uppercase italic">Studio Elite</span>
              </div>
              <div className="flex justify-between text-xs">
                <span className="text-white/40">Encryption</span>
                <span className="text-white font-mono">AES-256-GCM</span>
              </div>
            </div>
          </div>
        </div>

        {/* Bottom Tier: Real-time Log Stream */}
        <div className="bg-black/40 border border-white/5 rounded-xl p-4 font-mono text-[11px] leading-relaxed">
          <div className="flex items-center gap-2 mb-2 text-cyan-500/50">
            <div className="h-2 w-2 bg-cyan-500 rounded-full animate-pulse" />
            <span>LIVE SYSTEM LOGS</span>
          </div>
          <div className="space-y-1 text-white/40" role="log" aria-live="polite">
            <p><span className="text-white/20">[18:52:01]</span> <span className="text-emerald-500">SUCCESS:</span> Neural handshake established with RTX 5090 cluster.</p>
            <p><span className="text-white/20">[18:52:04]</span> <span className="text-cyan-500">INFO:</span> Vision Analysis module optimized for 4K stream.</p>
            <p><span className="text-white/20">[18:52:10]</span> <span className="text-amber-500">WARN:</span> VRAM allocation exceeding 85% threshold.</p>
            <p><span className="text-white/20">[18:52:12]</span> <span className="text-white/60">TRACE:</span> Routing telemetry data through A2I-Core-V4...</p>
          </div>
        </div>
      </div>
    </div>
  );
}
