'use client';

import { UserButton, useUser } from '@clerk/nextjs';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  LayoutDashboard,
  Video,
  Cpu,
  CreditCard,
  LifeBuoy,
  Settings,
  User,
  Menu,
  X,
  CheckSquare,
  MessageSquare,
  BarChart3
} from 'lucide-react';

const navigation = [
  { name: 'Overview', href: '/dashboard', icon: LayoutDashboard },
  { name: 'Commercial Lab', href: '/dashboard/lab', icon: Video },
  { name: 'NEXUS Personal', href: '/dashboard/nexus', icon: Cpu },
  { name: 'Billing', href: '/dashboard/billing', icon: CreditCard },
  { name: 'Success Portal', href: '/dashboard/success', icon: CheckSquare },
  { name: 'Architect', href: '/dashboard/architect', icon: MessageSquare },
  { name: 'Analytics', href: '/dashboard/analytics', icon: BarChart3 },
];

const bottomNavigation = [
  { name: 'Support', href: '/dashboard/support', icon: LifeBuoy },
  { name: 'Settings', href: '/dashboard/settings', icon: Settings },
];

const NavItem = ({
  item,
  isActive,
  onClick
}: {
  item: typeof navigation[0];
  isActive: boolean;
  onClick?: () => void;
}) => (
  <Link
    href={item.href}
    onClick={onClick}
    className={`group flex w-full items-center gap-3 rounded-xl px-4 py-3 text-sm font-semibold transition-all duration-200 ${
      isActive
        ? "bg-gradient-to-r from-[#00bfff]/20 to-transparent text-[#00bfff] shadow-[inset_3px_0_0_0_#00bfff]"
        : "text-slate-400 hover:bg-white/5 hover:text-white"
    }`}
  >
    <item.icon size={20} className={isActive ? "text-[#00bfff]" : "group-hover:text-white"} />
    {item.name}
  </Link>
);

export default function DashboardSidebar() {
  const pathname = usePathname();
  const { user } = useUser();
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  const isActive = (href: string) => {
    if (href === '/dashboard') return pathname === href;
    return pathname?.startsWith(href) ?? false;
  };

  const SidebarContent = ({ onLinkClick }: { onLinkClick?: () => void }) => (
    <>
      {/* Brand Wordmark */}
      <div className="p-8">
        <Link href="/" className="flex items-center gap-3">
          <div className="h-8 w-8 rounded bg-gradient-to-br from-[#00bfff] to-[#ffd700] shadow-[0_0_15px_rgba(0,191,255,0.4)]" />
          <span className="text-xl font-black tracking-tighter text-white uppercase">
            Barrios <span className="text-[#00bfff]">A2I</span>
          </span>
        </Link>
      </div>

      {/* Main Navigation */}
      <nav className="flex-1 space-y-1 px-4">
        {navigation.map((item) => (
          <NavItem
            key={item.name}
            item={item}
            isActive={isActive(item.href)}
            onClick={onLinkClick}
          />
        ))}

        <div className="my-6 border-t border-white/5 mx-4" />

        {bottomNavigation.map((item) => (
          <NavItem
            key={item.name}
            item={item}
            isActive={isActive(item.href)}
            onClick={onLinkClick}
          />
        ))}
      </nav>

      {/* User Profile Summary */}
      <div className="p-4 border-t border-white/5">
        <Link
          href="/dashboard/profile"
          onClick={onLinkClick}
          className="flex items-center gap-3 rounded-2xl bg-white/5 p-3 border border-white/5 hover:border-white/10 transition-colors"
        >
          <UserButton
            appearance={{
              elements: {
                avatarBox: 'h-10 w-10 rounded-lg'
              }
            }}
            afterSignOutUrl="/"
          />
          <div className="flex-1 min-w-0">
            <p className="text-sm font-bold text-white truncate">
              {user?.firstName || 'User'}
            </p>
            <p className="text-[10px] text-slate-500 uppercase tracking-widest truncate">
              Premium Tier
            </p>
          </div>
        </Link>
      </div>
    </>
  );

  return (
    <>
      {/* Mobile Menu Button */}
      <button
        className="fixed top-4 left-4 z-[60] lg:hidden p-2 rounded-lg bg-white/5 border border-white/10 text-white"
        onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
      >
        {isMobileMenuOpen ? <X size={20} /> : <Menu size={20} />}
      </button>

      {/* Mobile Overlay */}
      <AnimatePresence>
        {isMobileMenuOpen && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={() => setIsMobileMenuOpen(false)}
            className="fixed inset-0 z-40 bg-black/60 backdrop-blur-sm lg:hidden"
          />
        )}
      </AnimatePresence>

      {/* Desktop Sidebar */}
      <aside className="hidden lg:flex fixed inset-y-0 left-0 z-50 w-72 flex-col border-r border-white/5 bg-[#0B1220]/80 backdrop-blur-2xl">
        <SidebarContent />
      </aside>

      {/* Mobile Sidebar */}
      <aside className={`
        fixed inset-y-0 left-0 z-50 w-72 flex flex-col transform
        bg-[#0B1220]/95 backdrop-blur-2xl transition-all duration-500 ease-in-out
        lg:hidden
        ${isMobileMenuOpen ? "translate-x-0 shadow-[20px_0_60px_rgba(0,0,0,0.8)]" : "-translate-x-full"}
      `}>
        <SidebarContent onLinkClick={() => setIsMobileMenuOpen(false)} />
      </aside>
    </>
  );
}
