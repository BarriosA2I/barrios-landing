import Link from 'next/link';
import { HelpCircle } from 'lucide-react';
import DashboardSidebar from './components/DashboardSidebar';

export const dynamic = 'force-dynamic';

export default function DashboardLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="flex min-h-screen bg-[#0a0a0a]">
      {/* Sidebar */}
      <DashboardSidebar />

      {/* Main */}
      <main className="flex-1 pl-64">
        <header className="sticky top-0 z-40 flex h-16 items-center justify-between border-b border-[#27272a] bg-[#0a0a0a]/80 px-8 backdrop-blur-lg">
          <h1 className="text-lg font-semibold text-white">Dashboard</h1>
          <Link
            href="/dashboard/support"
            className="flex items-center gap-2 rounded-lg px-3 py-1.5 text-sm text-zinc-400 transition-colors hover:bg-[#1a1a1a] hover:text-white"
          >
            <HelpCircle className="h-4 w-4" />
            Support
          </Link>
        </header>
        <div className="p-8">{children}</div>
      </main>
    </div>
  );
}
