// components/Footer.tsx
// Purpose: Site footer with navigation, status, and cyberpunk auth buttons
// Visual DNA: Matches Barrios A2I brand aesthetic with glassmorphism

import Link from 'next/link';
import { Linkedin, Twitter, Instagram } from 'lucide-react';
import { SignedIn, SignedOut } from '@clerk/nextjs';

const footerLinks = {
  products: [
    { label: 'NEXUS Personal', href: '/nexus' },
    { label: 'A2I Commercial Lab', href: '/commercial-lab' },
    { label: 'Command Center', href: '/command' },
  ],
  company: [
    { label: 'About', href: '/about' },
    { label: 'Founder', href: '/founder' },
    { label: 'Contact', href: '/contact' },
    { label: 'System Status', href: '/status' },
  ],
  account: [
    { label: 'Sign In', href: '/sign-in' },
    { label: 'Create Account', href: '/sign-up' },
    { label: 'Dashboard', href: '/dashboard' },
  ],
  legal: [
    { label: 'Privacy Directive', href: '/privacy' },
    { label: 'Terms of Service', href: '/terms' },
    { label: 'Data Sovereignty', href: '/data' },
  ],
};

const socialLinks = [
  { icon: <Linkedin className="w-5 h-5" />, href: 'https://linkedin.com', label: 'LinkedIn' },
  { icon: <Twitter className="w-5 h-5" />, href: 'https://x.com', label: 'X (Twitter)' },
  { icon: <Instagram className="w-5 h-5" />, href: 'https://instagram.com', label: 'Instagram' },
];

export function Footer() {
  return (
    <footer className="relative bg-[#080814] border-t border-white/[0.04] overflow-hidden">
      {/* Subtle background glow orbs */}
      <div className="absolute top-0 left-1/4 w-96 h-96 bg-[#00CED1]/5 rounded-full blur-[150px] pointer-events-none" />
      <div className="absolute bottom-0 right-1/4 w-80 h-80 bg-[#8B5CF6]/5 rounded-full blur-[120px] pointer-events-none" />

      <div className="container mx-auto px-4 sm:px-6 relative z-10">
        {/* Main Footer Content */}
        <div className="py-16 grid sm:grid-cols-2 lg:grid-cols-5 gap-12">
          {/* Brand Column */}
          <div className="lg:col-span-2 space-y-6">
            {/* Logo with glow */}
            <Link href="/" className="inline-flex items-center gap-3 group">
              {/* Logo Icon with glow effect */}
              <div className="relative">
                <div className="absolute -inset-1 bg-[#00CED1]/20 rounded-lg blur-md group-hover:bg-[#00CED1]/30 transition-all duration-300" />
                <div className="relative w-10 h-10 rounded-lg bg-gradient-to-br from-[#00CED1] via-[#00CED1]/90 to-cyan-400 flex items-center justify-center shadow-[0_0_20px_rgba(0,206,209,0.3)]">
                  <div className="absolute inset-0 rounded-lg bg-gradient-to-br from-white/20 to-transparent" />
                  <span className="relative font-bold text-[#0a0a0a] text-sm">A2I</span>
                </div>
              </div>
              <div>
                <span className="font-bold text-white text-lg">BARRIOS </span>
                <span className="font-bold text-[#00CED1] text-lg">A2I</span>
              </div>
            </Link>

            {/* Tagline */}
            <p className="font-mono text-xs text-[#8892b0]/60 tracking-wider uppercase">
              THE INTELLIGENCE ARCHITECTURE
            </p>

            {/* System Status - Enhanced */}
            <div className="inline-flex items-center gap-2 px-4 py-2.5 rounded-full bg-[#00ff88]/5 border border-[#00ff88]/20 backdrop-blur-sm">
              <span className="relative flex h-2 w-2">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-[#00ff88] opacity-75"></span>
                <span className="relative inline-flex rounded-full h-2 w-2 bg-[#00ff88]"></span>
              </span>
              <span className="font-mono text-xs text-[#00ff88] tracking-wider">
                ALL SYSTEMS OPERATIONAL
              </span>
            </div>
          </div>

          {/* Products */}
          <div>
            <h4 className="font-mono text-xs text-[#00CED1]/70 tracking-[0.15em] uppercase mb-6">
              [ PRODUCTS ]
            </h4>
            <ul className="space-y-3">
              {footerLinks.products.map((link) => (
                <li key={link.href}>
                  <Link
                    href={link.href}
                    className="text-[#8892b0] hover:text-[#00CED1] transition-all duration-300 text-sm flex items-center gap-2 group"
                  >
                    <span className="w-1 h-1 bg-[#00CED1] rounded-full opacity-60 group-hover:opacity-100 group-hover:shadow-[0_0_6px_rgba(0,206,209,0.8)] transition-all duration-300" />
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Company */}
          <div>
            <h4 className="font-mono text-xs text-[#00CED1]/70 tracking-[0.15em] uppercase mb-6">
              [ COMPANY ]
            </h4>
            <ul className="space-y-3">
              {footerLinks.company.map((link) => (
                <li key={link.href}>
                  <Link
                    href={link.href}
                    className="text-[#8892b0] hover:text-[#00CED1] transition-all duration-300 text-sm flex items-center gap-2 group"
                  >
                    <span className="w-1 h-1 bg-[#00CED1] rounded-full opacity-60 group-hover:opacity-100 group-hover:shadow-[0_0_6px_rgba(0,206,209,0.8)] transition-all duration-300" />
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>

            {/* Account Links - Enhanced with glassmorphism */}
            <h4 className="font-mono text-xs text-[#00CED1]/70 tracking-[0.15em] uppercase mb-4 mt-8">
              [ ACCOUNT ]
            </h4>

            <SignedOut>
              <div className="space-y-3">
                {/* Sign In - Ghost button style */}
                <Link
                  href="/sign-in"
                  className="
                    group flex items-center gap-2 px-4 py-2 rounded-lg
                    text-sm text-[#8892b0] hover:text-white
                    bg-white/[0.02] hover:bg-[#00CED1]/10
                    border border-white/[0.06] hover:border-[#00CED1]/30
                    transition-all duration-300
                    relative overflow-hidden
                  "
                >
                  {/* Hover glow */}
                  <span className="absolute inset-0 bg-[#00CED1]/0 group-hover:bg-[#00CED1]/5 blur-sm transition-all duration-300" />
                  <svg className="w-4 h-4 relative text-[#00CED1]/60 group-hover:text-[#00CED1] transition-colors duration-300" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 16l-4-4m0 0l4-4m-4 4h14m-5 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h7a3 3 0 013 3v1" />
                  </svg>
                  <span className="relative">Sign In</span>
                </Link>

                {/* Create Account - Primary button with glow */}
                <Link
                  href="/sign-up"
                  className="
                    group flex items-center gap-2 px-4 py-2 rounded-lg
                    text-sm font-medium
                    relative overflow-hidden
                  "
                >
                  {/* Gradient glow behind button */}
                  <span className="
                    absolute -inset-0.5
                    bg-gradient-to-r from-[#00CED1] via-[#8B5CF6]/50 to-[#00CED1]
                    rounded-lg blur-sm opacity-40
                    group-hover:opacity-70
                    transition-all duration-500
                  " />

                  {/* Button background */}
                  <span className="
                    absolute inset-0
                    bg-gradient-to-r from-[#00CED1] to-[#00CED1]/90
                    rounded-lg
                    group-hover:from-[#00CED1] group-hover:to-cyan-400
                    transition-all duration-300
                  " />

                  {/* Shine effect */}
                  <span className="
                    absolute inset-0
                    bg-gradient-to-r from-transparent via-white/20 to-transparent
                    -translate-x-full group-hover:translate-x-full
                    transition-transform duration-700
                    rounded-lg
                  " />

                  <svg className="w-4 h-4 relative text-[#0a0a0a]" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M18 9v3m0 0v3m0-3h3m-3 0h-3m-2-5a4 4 0 11-8 0 4 4 0 018 0zM3 20a6 6 0 0112 0v1H3v-1z" />
                  </svg>
                  <span className="relative text-[#0a0a0a] font-semibold">Create Account</span>
                </Link>
              </div>
            </SignedOut>

            <SignedIn>
              <Link
                href="/dashboard"
                className="
                  group flex items-center gap-2 px-4 py-2 rounded-lg
                  text-sm text-[#8892b0] hover:text-white
                  bg-white/[0.02] hover:bg-[#00CED1]/10
                  border border-white/[0.06] hover:border-[#00CED1]/30
                  transition-all duration-300
                  relative overflow-hidden
                "
              >
                {/* Hover glow */}
                <span className="absolute inset-0 bg-[#00CED1]/0 group-hover:bg-[#00CED1]/5 blur-sm transition-all duration-300" />
                <svg className="w-4 h-4 relative text-[#00CED1]/60 group-hover:text-[#00CED1] transition-colors duration-300" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2V6zM14 6a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2V6zM4 16a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2v-2zM14 16a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2v-2z" />
                </svg>
                <span className="relative">Dashboard</span>
              </Link>
            </SignedIn>
          </div>

          {/* Legal & Social */}
          <div>
            <h4 className="font-mono text-xs text-[#00CED1]/70 tracking-[0.15em] uppercase mb-6">
              [ LEGAL ]
            </h4>
            <ul className="space-y-3 mb-8">
              {footerLinks.legal.map((link) => (
                <li key={link.href}>
                  <Link
                    href={link.href}
                    className="text-[#8892b0] hover:text-[#00CED1] transition-all duration-300 text-sm flex items-center gap-2 group"
                  >
                    <span className="w-1 h-1 bg-[#00CED1] rounded-full opacity-60 group-hover:opacity-100 group-hover:shadow-[0_0_6px_rgba(0,206,209,0.8)] transition-all duration-300" />
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>

            {/* Social Icons - Enhanced with glow */}
            <h4 className="font-mono text-xs text-[#00CED1]/70 tracking-[0.15em] uppercase mb-4">
              [ CONNECT ]
            </h4>
            <div className="flex items-center gap-3">
              {socialLinks.map((social) => (
                <a
                  key={social.label}
                  href={social.href}
                  target="_blank"
                  rel="noopener noreferrer"
                  aria-label={social.label}
                  className="
                    group relative w-10 h-10 rounded-lg flex items-center justify-center
                    bg-white/[0.02] border border-white/[0.06]
                    text-[#8892b0] hover:text-[#00CED1]
                    transition-all duration-300
                    overflow-hidden
                  "
                >
                  {/* Hover glow */}
                  <span className="absolute inset-0 bg-[#00CED1]/0 group-hover:bg-[#00CED1]/10 transition-all duration-300" />
                  {/* Border glow on hover */}
                  <span className="absolute inset-0 rounded-lg border border-transparent group-hover:border-[#00CED1]/30 group-hover:shadow-[inset_0_0_15px_rgba(0,206,209,0.1)] transition-all duration-300" />
                  <span className="relative group-hover:drop-shadow-[0_0_8px_rgba(0,206,209,0.5)] transition-all duration-300">
                    {social.icon}
                  </span>
                </a>
              ))}
            </div>

            {/* Email with glow hover */}
            <a
              href="mailto:alienation2innovation@gmail.com"
              className="
                block mt-4 text-xs text-[#8892b0]/60
                hover:text-[#00CED1] hover:drop-shadow-[0_0_8px_rgba(0,206,209,0.3)]
                transition-all duration-300 truncate
              "
            >
              alienation2innovation@gmail.com
            </a>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="py-6 border-t border-white/[0.04] flex flex-col sm:flex-row items-center justify-between gap-4">
          <p className="text-[#8892b0]/40 text-xs font-mono">
            {new Date().getFullYear()} BARRIOS A2I INC. ALL RIGHTS RESERVED.
          </p>
          <div className="flex items-center gap-6">
            <Link href="/privacy" className="text-[#8892b0]/40 hover:text-[#00CED1] text-xs transition-all duration-300">
              Privacy
            </Link>
            <Link href="/terms" className="text-[#8892b0]/40 hover:text-[#00CED1] text-xs transition-all duration-300">
              Terms
            </Link>
            <Link href="/data" className="text-[#8892b0]/40 hover:text-[#00CED1] text-xs transition-all duration-300">
              Data
            </Link>
          </div>
        </div>
      </div>

      {/* Top accent line */}
      <div className="absolute top-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-[#00CED1]/30 to-transparent" />
    </footer>
  );
}
