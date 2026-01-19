'use client';

import { useState } from 'react';
import { motion } from 'framer-motion';
import {
  Cpu,
  Globe,
  Shield,
  Zap,
  Terminal,
  Power,
  Thermometer,
  Database
} from 'lucide-react';

// Glass Card Component
const GlassCard = ({ children, className = "" }: { children: React.ReactNode, className?: string }) => (
  <div className={`relative overflow-hidden rounded-2xl border border-white/10 bg-white/5 backdrop-blur-xl transition-all duration-300 hover:border-white/20 ${className}`}>
    {children}
  </div>
);

// Hardware Module Card
const HardwareModule = ({
  name,
  model,
  load,
  temp,
  active
}: {
  name: string;
  model: string;
  load: number;
  temp: number;
  active: boolean;
}) => (
  <GlassCard className={`p-5 transition-all duration-500 ${
    active ? "border-[#00bfff]/30 bg-[#00bfff]/5" : "grayscale opacity-60"
  }`}>
    <div className="flex items-start justify-between">
      <div className="space-y-1">
        <p className="text-[10px] font-black uppercase tracking-[0.2em] text-slate-500">{name}</p>
        <h4 className="text-sm font-bold text-white uppercase">{model}</h4>
      </div>
      <div className={`h-1.5 w-1.5 rounded-full ${active ? 'bg-[#00bfff] shadow-[0_0_8px_#00bfff] animate-pulse' : 'bg-slate-700'}`} />
    </div>

    <div className="mt-6 grid grid-cols-2 gap-4">
      <div className="space-y-1">
        <div className="flex items-center gap-1.5 text-[9px] font-bold text-slate-500 uppercase">
          <Zap size={10} /> Load
        </div>
        <p className={`text-lg font-black ${active ? 'text-white' : 'text-slate-700'}`}>{active ? `${load}%` : '--'}</p>
      </div>
      <div className="space-y-1">
        <div className="flex items-center gap-1.5 text-[9px] font-bold text-slate-500 uppercase">
          <Thermometer size={10} /> Temp
        </div>
        <p className={`text-lg font-black ${temp > 75 ? 'text-[#ffd700]' : 'text-white'} ${!active && 'text-slate-700'}`}>
          {active ? `${temp}°C` : '--'}
        </p>
      </div>
    </div>

    <div className="mt-4 h-1 w-full rounded-full bg-white/5 overflow-hidden">
      <motion.div
        initial={{ width: 0 }}
        animate={{ width: active ? `${load}%` : '0%' }}
        className={`h-full ${load > 85 ? 'bg-[#ffd700]' : 'bg-[#00bfff]'}`}
      />
    </div>
  </GlassCard>
);

// System Module Row
const SystemModule = ({
  label,
  status,
  detail
}: {
  label: string;
  status: 'active' | 'offline';
  detail: string;
}) => (
  <div className="flex items-center justify-between p-4 rounded-xl bg-white/5 border border-white/5">
    <div className="flex items-center gap-4">
      <div className={`h-2 w-2 rounded-full ${status === 'active' ? 'bg-[#00bfff] shadow-[0_0_10px_#00bfff]' : 'bg-slate-700'}`} />
      <div>
        <h4 className="text-sm font-bold text-white">{label}</h4>
        <p className="text-[10px] text-slate-500">{detail}</p>
      </div>
    </div>
    <button className={`text-[10px] font-bold uppercase tracking-widest px-3 py-1 rounded border ${
      status === 'active' ? 'border-[#00bfff]/30 text-[#00bfff] hover:bg-[#00bfff]/10' : 'border-white/10 text-slate-500 hover:bg-white/5'
    }`}>
      {status === 'active' ? 'Reboot' : 'Deploy'}
    </button>
  </div>
);

export default function NexusPersonalPage() {
  const [isSystemActive, setIsSystemActive] = useState(true);

  return (
    <div className="space-y-10">
      {/* Header */}
      <header className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h2 className="text-3xl font-black text-white uppercase tracking-tighter">
            Nexus <span className="text-[#ffd700]">Personal</span>
          </h2>
          <p className="text-slate-400">Core intelligence orchestration & local instance management.</p>
        </div>

        <button
          onClick={() => setIsSystemActive(!isSystemActive)}
          className={`flex items-center gap-3 rounded-xl px-6 py-3 border transition-all ${
            isSystemActive
              ? "border-red-500/50 bg-red-500/10 text-red-500 hover:bg-red-500/20"
              : "border-[#00bfff] bg-[#00bfff] text-[#0B1220] font-black"
          }`}
        >
          <Power size={18} />
          <span className="text-xs font-black uppercase tracking-tighter">
            {isSystemActive ? "Kill System" : "Boot Nexus"}
          </span>
        </button>
      </header>

      {/* Hardware Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        <HardwareModule name="Primary GPU" model="NVIDIA RTX 5090" load={74} temp={62} active={isSystemActive} />
        <HardwareModule name="Neural Processor" model="A2I-Core V4" load={12} temp={41} active={isSystemActive} />
        <HardwareModule name="Memory Node" model="128GB Unified VRAM" load={88} temp={58} active={isSystemActive} />
      </div>

      {/* Resource Monitoring & Control */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Live Resource Monitoring */}
        <div className="lg:col-span-2">
          <GlassCard className="p-6">
            <div className="flex items-center justify-between mb-8">
              <h3 className="flex items-center gap-2 text-sm font-bold uppercase tracking-widest text-white">
                <Terminal size={16} className="text-[#00bfff]" /> Live Node Status
              </h3>
              <span className="text-[10px] text-slate-500">Uptime: 142h 12m</span>
            </div>

            <div className="space-y-6">
              <div>
                <div className="flex justify-between text-[10px] font-bold uppercase mb-2">
                  <span className="text-slate-400">Neural Compute (GPU)</span>
                  <span className="text-[#00bfff]">72%</span>
                </div>
                <div className="h-2 w-full bg-white/5 rounded-full overflow-hidden">
                  <motion.div
                    initial={{ width: 0 }}
                    animate={{ width: isSystemActive ? '72%' : '0%' }}
                    className="h-full bg-[#00bfff] shadow-[0_0_15px_rgba(0,191,255,0.5)]"
                  />
                </div>
              </div>
              <div>
                <div className="flex justify-between text-[10px] font-bold uppercase mb-2">
                  <span className="text-slate-400">Memory Allocation</span>
                  <span className="text-[#ffd700]">44%</span>
                </div>
                <div className="h-2 w-full bg-white/5 rounded-full overflow-hidden">
                  <motion.div
                    initial={{ width: 0 }}
                    animate={{ width: isSystemActive ? '44%' : '0%' }}
                    className="h-full bg-[#ffd700] shadow-[0_0_15px_rgba(255,215,0,0.5)]"
                  />
                </div>
              </div>
            </div>
          </GlassCard>
        </div>

        {/* Global Control */}
        <div className="rounded-2xl border border-[#ffd700]/20 bg-[#ffd700]/5 p-6 flex flex-col justify-between">
          <div>
            <Power size={32} className="text-[#ffd700] mb-4" />
            <h3 className="text-xl font-bold text-white leading-tight">Instance Master Control</h3>
            <p className="text-xs text-slate-400 mt-2">Kill switch for all active Nexus local modules.</p>
          </div>
          <button className="w-full py-4 rounded-xl bg-white text-[#0B1220] font-black uppercase tracking-tighter hover:bg-[#ffd700] transition-colors mt-6">
            System Shutdown
          </button>
        </div>
      </div>

      {/* System Modules */}
      <section>
        <h3 className="text-sm font-semibold uppercase tracking-widest text-slate-500 mb-4">Active Modules</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <SystemModule label="Voice Synthesis" status="active" detail="Local ElevenLabs Bridge" />
          <SystemModule label="Vision Analysis" status="active" detail="RTX 5090 Acceleration" />
          <SystemModule label="Knowledge Graph" status="offline" detail="Vector DB Syncing..." />
          <SystemModule label="Automation Bridge" status="active" detail="n8n Local Webhook" />
        </div>
      </section>

      {/* Resource Allocation Sliders */}
      <GlassCard className="p-6">
        <div className="flex items-center gap-3 mb-6">
          <Database size={20} className="text-[#ffd700]" />
          <h3 className="text-sm font-bold text-white uppercase tracking-widest">Resource Allocation</h3>
        </div>

        <div className="space-y-8">
          {[
            { label: "VRAM Buffer", value: "84GB", color: "#00bfff", percent: 70 },
            { label: "Throughput Limit", value: "4.2 GB/s", color: "#ffd700", percent: 60 }
          ].map((slider, i) => (
            <div key={i} className="space-y-3">
              <div className="flex justify-between text-[10px] font-black uppercase tracking-widest">
                <span className="text-slate-400">{slider.label}</span>
                <span style={{ color: slider.color }}>{slider.value}</span>
              </div>
              <div className="relative h-2 w-full rounded-full bg-white/5">
                <div
                  className="h-full rounded-full"
                  style={{ width: `${slider.percent}%`, backgroundColor: slider.color, opacity: 0.4 }}
                />
                <div
                  className="absolute top-1/2 -translate-y-1/2 h-4 w-4 rounded-full border-2 border-white bg-[#0B1220] shadow-lg cursor-pointer transition-transform hover:scale-125"
                  style={{ left: `${slider.percent}%`, transform: `translateX(-50%) translateY(-50%)` }}
                />
              </div>
            </div>
          ))}
        </div>
      </GlassCard>
    </div>
  );
}
