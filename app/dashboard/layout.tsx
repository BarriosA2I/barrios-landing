export const dynamic = 'force-dynamic';

import DashboardSidebar from './components/DashboardSidebar';
import DashboardHeader from './components/DashboardHeader';
import CommandPalette from '@/components/dashboard/global/CommandPalette';
import ToastSystem from '@/components/dashboard/global/ToastSystem';

export default function DashboardLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="flex min-h-screen bg-[#0B1220] text-slate-200 selection:bg-[#00bfff]/30">
      {/* Global Overlays */}
      <CommandPalette />
      <ToastSystem />

      {/* Volumetric Glows */}
      <div className="pointer-events-none fixed -left-[10%] -top-[10%] h-[60%] w-[60%] rounded-full bg-[#00bfff]/10 blur-[120px]" />
      <div className="pointer-events-none fixed -right-[5%] -bottom-[5%] h-[50%] w-[50%] rounded-full bg-[#ffd700]/5 blur-[120px]" />

      {/* Sidebar */}
      <DashboardSidebar />

      {/* Main Viewport */}
      <div className="relative flex flex-1 flex-col overflow-hidden dashboard-content">
        {/* Top Action Bar */}
        <DashboardHeader />

        {/* Content Canvas */}
        <main className="flex-1 overflow-y-auto p-4 md:p-6 lg:p-8 scrollbar-hide">
          <div className="mx-auto max-w-7xl">
            {children}
          </div>
        </main>
      </div>
    </div>
  );
}
