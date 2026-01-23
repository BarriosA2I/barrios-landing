'use client';

import { usePathname } from 'next/navigation';
import { SiteHeader } from '@/components/SiteHeader';

// Routes that have their own layouts and don't need the site header
const EXCLUDED_ROUTES = ['/sign-in', '/sign-up', '/dashboard'];

export function ConditionalHeader() {
  const pathname = usePathname();
  const shouldHide = EXCLUDED_ROUTES.some(route => pathname?.startsWith(route));

  if (shouldHide) return null;
  return <SiteHeader />;
}

export function ConditionalPadding({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const shouldSkipPadding = EXCLUDED_ROUTES.some(route => pathname?.startsWith(route));

  if (shouldSkipPadding) {
    return <>{children}</>;
  }
  return <div className="pt-16">{children}</div>;
}
