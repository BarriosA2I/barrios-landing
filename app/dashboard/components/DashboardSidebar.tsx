'use client';

import { UserButton } from '@clerk/nextjs';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { LayoutDashboard, Film, Bot, CreditCard, HelpCircle, Settings, ChevronRight } from 'lucide-react';

const navigation = [
  { name: 'Overview', href: '/dashboard', icon: LayoutDashboard },
  { name: 'Commercial Lab', href: '/dashboard/lab', icon: Film },
  { name: 'NEXUS Personal', href: '/dashboard/nexus', icon: Bot },
  { name: 'Billing', href: '/dashboard/billing', icon: CreditCard },
  { name: 'Support', href: '/dashboard/support', icon: HelpCircle },
  { name: 'Settings', href: '/dashboard/settings', icon: Settings },
];

export default function DashboardSidebar() {
  const pathname = usePathname();

  return (
    <aside className="fixed inset-y-0 left-0 z-50 w-64 border-r border-[#27272a] bg-[#141414]">
      <div className="flex h-16 items-center gap-2 border-b border-[#27272a] px-6">
        <div className="h-8 w-8 rounded-lg bg-gradient-to-br from-[#00CED1] to-[#8B5CF6]" />
        <span className="text-lg font-bold text-white">BARRIOS A2I</span>
      </div>
      <nav className="flex flex-col gap-1 p-4">
        {navigation.map((item) => {
          const isActive = pathname === item.href ||
            (item.href !== '/dashboard' && pathname?.startsWith(item.href));
          return (
            <Link
              key={item.name}
              href={item.href}
              className={`flex items-center gap-3 rounded-lg px-3 py-2 text-sm transition-colors ${
                isActive
                  ? 'bg-[#00CED1]/10 text-[#00CED1]'
                  : 'text-zinc-400 hover:bg-[#1a1a1a] hover:text-white'
              }`}
            >
              <item.icon className="h-5 w-5" />
              {item.name}
              <ChevronRight className={`ml-auto h-4 w-4 ${isActive ? 'opacity-100' : 'opacity-50'}`} />
            </Link>
          );
        })}
      </nav>
      <div className="absolute bottom-0 left-0 right-0 border-t border-[#27272a] p-4">
        <div className="flex items-center gap-3">
          <UserButton
            appearance={{
              elements: {
                avatarBox: 'h-10 w-10'
              }
            }}
            afterSignOutUrl="/"
          />
          <div className="flex-1 truncate">
            <p className="text-sm font-medium text-white">Account</p>
            <p className="text-xs text-zinc-500">Manage profile</p>
          </div>
        </div>
      </div>
    </aside>
  );
}
