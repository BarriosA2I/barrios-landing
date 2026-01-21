'use client';

import { Search, Bell } from 'lucide-react';

export default function DashboardHeader() {
  return (
    <header className="flex h-20 items-center justify-between border-b border-white/5 px-4 md:px-6 lg:px-8 bg-[#0B1220]/40 backdrop-blur-md">
      <div className="flex items-center gap-4 flex-1 pl-12 lg:pl-0">
        {/* Search Bar */}
        <div className="hidden md:flex items-center gap-3 bg-white/5 border border-white/10 px-4 py-2 rounded-xl w-96 group focus-within:border-[#00bfff]/50 transition-all">
          <Search size={16} className="text-slate-500 group-focus-within:text-[#00bfff]" />
          <input
            type="text"
            placeholder="Search modules, projects..."
            className="bg-transparent border-none text-sm outline-none w-full text-white placeholder:text-slate-600"
          />
        </div>
      </div>

      <div className="flex items-center gap-4">
        {/* Notifications */}
        <button className="relative p-2 text-slate-400 hover:text-white transition-colors">
          <Bell size={20} />
          <span className="absolute top-2 right-2 h-2 w-2 rounded-full bg-[#00bfff] shadow-[0_0_8px_#00bfff]" />
        </button>

        <div className="h-8 w-px bg-white/10" />

        {/* System Status */}
        <div className="flex items-center gap-2 rounded-lg bg-[#00bfff]/10 border border-[#00bfff]/20 px-4 py-2 text-xs font-bold text-[#00bfff]">
          <span className="h-2 w-2 rounded-full bg-[#00bfff] animate-pulse" />
          System Live
        </div>
      </div>
    </header>
  );
}
