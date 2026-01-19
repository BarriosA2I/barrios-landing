'use client';

import { useState } from 'react';
import { motion } from 'framer-motion';
import {
  Play,
  Clock,
  CheckCircle2,
  Sliders,
  Film,
  Mic,
  Upload,
  Sparkles
} from 'lucide-react';

// Glass Card Component
const GlassCard = ({ children, className = "" }: { children: React.ReactNode, className?: string }) => (
  <div className={`relative overflow-hidden rounded-2xl border border-white/10 bg-white/5 backdrop-blur-xl transition-all duration-300 hover:border-white/20 ${className}`}>
    {children}
  </div>
);

// Video Project Card
const VideoProjectCard = ({
  title,
  status,
  date,
}: {
  title: string;
  status: 'rendering' | 'ready' | 'queued';
  date: string;
}) => (
  <GlassCard className="p-4 group">
    <div className="aspect-video w-full overflow-hidden rounded-lg bg-[#0B1220] mb-4 border border-white/5 relative">
      {status === 'rendering' && (
        <div className="absolute inset-0 flex flex-col items-center justify-center bg-black/60 backdrop-blur-sm">
          <motion.div
            animate={{ rotate: 360 }}
            transition={{ repeat: Infinity, duration: 2, ease: "linear" }}
            className="mb-2 h-8 w-8 border-2 border-[#00bfff] border-t-transparent rounded-full"
          />
          <span className="text-[10px] font-bold uppercase tracking-widest text-[#00bfff]">Processing AI</span>
        </div>
      )}
      {status === 'queued' && (
        <div className="absolute inset-0 flex flex-col items-center justify-center bg-black/40">
          <Clock size={24} className="text-[#ffd700] mb-2" />
          <span className="text-[10px] font-bold uppercase tracking-widest text-[#ffd700]">Queued</span>
        </div>
      )}
      <div className="h-full w-full bg-gradient-to-br from-slate-800 to-slate-900" />
    </div>
    <div className="flex items-center justify-between">
      <div>
        <h3 className="font-bold text-white leading-tight">{title}</h3>
        <p className="text-xs text-slate-500">{date}</p>
      </div>
      {status === 'ready' ? (
        <CheckCircle2 size={18} className="text-[#00bfff]" />
      ) : status === 'rendering' ? (
        <Clock size={18} className="text-[#ffd700]" />
      ) : (
        <Clock size={18} className="text-slate-500" />
      )}
    </div>
  </GlassCard>
);

export default function CommercialLabPage() {
  const [prompt, setPrompt] = useState('');
  const [aspectRatio, setAspectRatio] = useState('16:9');

  // Mock data for projects
  const projects = [
    { title: "Cyberpunk Street Scene", status: 'ready' as const, date: "Jan 19, 2026" },
    { title: "Abstract Logo Reveal", status: 'rendering' as const, date: "Jan 19, 2026" },
    { title: "Product Cinematic v1", status: 'ready' as const, date: "Jan 15, 2026" },
  ];

  return (
    <div className="space-y-10">
      {/* Header */}
      <header className="flex flex-col md:flex-row md:items-end justify-between gap-4">
        <div>
          <h2 className="text-3xl font-black text-white uppercase tracking-tighter">
            Commercial <span className="text-[#00bfff]">Lab</span>
          </h2>
          <p className="text-slate-400">High-fidelity AI video orchestration.</p>
        </div>
        <div className="flex gap-3">
          <button className="flex items-center gap-2 rounded-lg bg-white/5 border border-white/10 px-4 py-2 text-sm font-semibold text-white hover:bg-white/10 transition-colors">
            <Sliders size={16} /> Filters
          </button>
          <button className="flex items-center gap-2 rounded-lg bg-[#00bfff] px-6 py-2 text-sm font-bold text-[#0B1220] hover:brightness-110 transition-all">
            <Film size={16} /> New Project
          </button>
        </div>
      </header>

      {/* Master Prompt Engine */}
      <section className="rounded-2xl border border-[#00bfff]/20 bg-[#00bfff]/5 p-8 backdrop-blur-md">
        <h3 className="text-lg font-bold text-white mb-4">Master Prompt Engine</h3>
        <textarea
          value={prompt}
          onChange={(e) => setPrompt(e.target.value)}
          placeholder="Describe your commercial vision (e.g., 'Cinematic shot of a cybernetic wolf in a neon forest, 8k, volumetric lighting')..."
          className="w-full h-32 rounded-xl bg-[#0B1220]/50 border border-white/10 p-4 text-white placeholder:text-slate-600 focus:border-[#00bfff] outline-none transition-all resize-none"
        />
        <div className="mt-4 flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
          <div className="flex flex-wrap gap-4">
            <span className="text-xs text-slate-500 uppercase tracking-widest font-bold">
              Model: <span className="text-white">A2I-Vision-V2</span>
            </span>
            <div className="flex items-center gap-2">
              <span className="text-xs text-slate-500 uppercase tracking-widest font-bold">Aspect:</span>
              <select
                value={aspectRatio}
                onChange={(e) => setAspectRatio(e.target.value)}
                className="bg-white/5 border border-white/10 rounded-lg px-3 py-1 text-xs text-white focus:border-[#00bfff] outline-none cursor-pointer"
              >
                <option value="16:9">16:9 (Cinematic)</option>
                <option value="9:16">9:16 (Social)</option>
                <option value="1:1">1:1 (Square)</option>
              </select>
            </div>
          </div>
          <button className="px-8 py-3 bg-gradient-to-r from-[#00bfff] to-[#ffd700] rounded-xl text-[#0B1220] font-black text-sm uppercase tracking-tighter hover:scale-105 transition-transform shadow-[0_0_20px_rgba(0,191,255,0.3)]">
            <span className="flex items-center gap-2">
              <Sparkles size={16} />
              Generate Assets
            </span>
          </button>
        </div>
      </section>

      {/* Asset Upload */}
      <section>
        <h3 className="text-sm font-semibold uppercase tracking-widest text-slate-500 mb-4">Reference Assets</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <GlassCard className="p-6 border-dashed">
            <button className="flex w-full flex-col items-center justify-center gap-3 py-4">
              <div className="rounded-full bg-[#00bfff]/10 p-3 text-[#00bfff]">
                <Upload size={24} />
              </div>
              <p className="text-sm font-bold text-white uppercase tracking-tighter">Upload Reference</p>
              <p className="text-[10px] text-slate-500 uppercase">Image or Video (Max 100MB)</p>
            </button>
          </GlassCard>
          <GlassCard className="p-6 border-dashed">
            <button className="flex w-full flex-col items-center justify-center gap-3 py-4">
              <div className="rounded-full bg-[#ffd700]/10 p-3 text-[#ffd700]">
                <Mic size={24} />
              </div>
              <p className="text-sm font-bold text-white uppercase tracking-tighter">Voice Sample</p>
              <p className="text-[10px] text-slate-500 uppercase">Record or Upload Audio</p>
            </button>
          </GlassCard>
        </div>
      </section>

      {/* Project Gallery */}
      <section>
        <div className="flex items-center justify-between mb-6">
          <h3 className="text-sm font-semibold uppercase tracking-widest text-slate-500">Recent Productions</h3>
          <button className="text-xs font-bold text-[#00bfff] uppercase hover:underline">View All</button>
        </div>
        {projects.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {projects.map((project, i) => (
              <VideoProjectCard
                key={i}
                title={project.title}
                status={project.status}
                date={project.date}
              />
            ))}
          </div>
        ) : (
          <GlassCard className="p-12 text-center border-dashed">
            <p className="text-slate-500 mb-4">No productions yet</p>
            <button className="px-6 py-3 bg-[#00bfff] text-[#0B1220] font-bold rounded-xl hover:brightness-110 transition-all">
              Create Your First Video
            </button>
          </GlassCard>
        )}
      </section>
    </div>
  );
}
