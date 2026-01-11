// 📁 components/Footer.tsx
// Purpose: Site footer with navigation and status
// Visual DNA: Matches Image 319 from screenshots
// Dependencies: lucide-react

import Link from 'next/link';
import { Linkedin, Twitter, Instagram } from 'lucide-react';

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
    <footer className="bg-[#080814] border-t border-white/[0.04]">
      <div className="container mx-auto px-4 sm:px-6">
        {/* Main Footer Content */}
        <div className="py-16 grid sm:grid-cols-2 lg:grid-cols-5 gap-12">
          {/* Brand Column */}
          <div className="lg:col-span-2 space-y-6">
            {/* Logo */}
            <Link href="/" className="inline-flex items-center gap-3">
              {/* Logo Icon - placeholder */}
              <div className="w-10 h-10 rounded-lg bg-gradient-to-br from-[#00bfff] to-cyan-400 flex items-center justify-center">
                <span className="font-bold text-[#0a0a1e] text-sm">A2I</span>
              </div>
              <div>
                <span className="font-bold text-white text-lg">BARRIOS </span>
                <span className="font-bold text-[#00bfff] text-lg">A2I</span>
              </div>
            </Link>

            {/* Tagline */}
            <p className="font-mono text-xs text-[#8892b0]/60 tracking-wider uppercase">
              THE INTELLIGENCE ARCHITECTURE
            </p>

            {/* System Status */}
            <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-[#00ff88]/5 border border-[#00ff88]/20">
              <span className="w-2 h-2 bg-[#00ff88] rounded-full animate-pulse" />
              <span className="font-mono text-xs text-[#00ff88] tracking-wider">
                ALL SYSTEMS OPERATIONAL
              </span>
            </div>
          </div>

          {/* Products */}
          <div>
            <h4 className="font-mono text-xs text-[#00bfff]/70 tracking-[0.15em] uppercase mb-6">
              [ PRODUCTS ]
            </h4>
            <ul className="space-y-3">
              {footerLinks.products.map((link) => (
                <li key={link.href}>
                  <Link 
                    href={link.href}
                    className="text-[#8892b0] hover:text-white transition-colors text-sm flex items-center gap-2"
                  >
                    <span className="w-1 h-1 bg-[#00bfff] rounded-full opacity-60" />
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Company */}
          <div>
            <h4 className="font-mono text-xs text-[#00bfff]/70 tracking-[0.15em] uppercase mb-6">
              [ COMPANY ]
            </h4>
            <ul className="space-y-3">
              {footerLinks.company.map((link) => (
                <li key={link.href}>
                  <Link 
                    href={link.href}
                    className="text-[#8892b0] hover:text-white transition-colors text-sm flex items-center gap-2"
                  >
                    <span className="w-1 h-1 bg-[#00bfff] rounded-full opacity-60" />
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Legal & Social */}
          <div>
            <h4 className="font-mono text-xs text-[#00bfff]/70 tracking-[0.15em] uppercase mb-6">
              [ LEGAL ]
            </h4>
            <ul className="space-y-3 mb-8">
              {footerLinks.legal.map((link) => (
                <li key={link.href}>
                  <Link 
                    href={link.href}
                    className="text-[#8892b0] hover:text-white transition-colors text-sm flex items-center gap-2"
                  >
                    <span className="w-1 h-1 bg-[#00bfff] rounded-full opacity-60" />
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>

            {/* Social Icons */}
            <h4 className="font-mono text-xs text-[#00bfff]/70 tracking-[0.15em] uppercase mb-4">
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
                    w-10 h-10 rounded-lg flex items-center justify-center
                    bg-white/[0.02] border border-white/[0.06]
                    text-[#8892b0] hover:text-[#00bfff] hover:border-[#00bfff]/30
                    transition-all duration-300
                  "
                >
                  {social.icon}
                </a>
              ))}
            </div>

            {/* Email */}
            <a 
              href="mailto:alienation2innovation@gmail.com"
              className="block mt-4 text-xs text-[#8892b0]/60 hover:text-[#00bfff] transition-colors truncate"
            >
              alienation2innovation@gmail.com
            </a>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="py-6 border-t border-white/[0.04] flex flex-col sm:flex-row items-center justify-between gap-4">
          <p className="text-[#8892b0]/40 text-xs font-mono">
            © {new Date().getFullYear()} BARRIOS A2I INC. ALL RIGHTS RESERVED.
          </p>
          <div className="flex items-center gap-6">
            <Link href="/privacy" className="text-[#8892b0]/40 hover:text-[#8892b0] text-xs transition-colors">
              Privacy
            </Link>
            <Link href="/terms" className="text-[#8892b0]/40 hover:text-[#8892b0] text-xs transition-colors">
              Terms
            </Link>
            <Link href="/data" className="text-[#8892b0]/40 hover:text-[#8892b0] text-xs transition-colors">
              Data
            </Link>
          </div>
        </div>
      </div>
    </footer>
  );
}
