import Link from 'next/link';

export default function SignInLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="fixed inset-0 z-[100] bg-[#0A0A0F]">
      {/* Minimal Auth Header - Logo Only */}
      <header className="absolute top-0 left-0 right-0 z-[110] px-6 py-4">
        <div className="max-w-7xl mx-auto flex items-center justify-between">
          {/* Logo */}
          <Link href="/" className="flex items-center gap-3 group">
            <img
              src="/brand/barrios-a2i-shard-logo.png"
              alt="Barrios A2I"
              className="w-10 h-10 object-contain transition-all duration-300 group-hover:drop-shadow-[0_0_12px_rgba(0,206,209,0.5)]"
            />
            <div className="flex flex-col">
              <span className="text-lg font-bold tracking-tight">
                <span className="text-[#fafafa]">BARRIOS</span>
                <span className="text-[#00CED1] ml-1">A2I</span>
              </span>
            </div>
          </Link>

          {/* Single CTA - Sign Up (since we're on sign-in) */}
          <Link
            href="/sign-up"
            className="px-5 py-2 text-sm font-medium text-[#00CED1] border border-[#00CED1]/30 rounded-lg hover:bg-[#00CED1]/10 hover:border-[#00CED1]/50 transition-all duration-300"
          >
            Create Account
          </Link>
        </div>
      </header>

      {/* Auth page content */}
      <div className="h-full overflow-auto">
        {children}
      </div>
    </div>
  );
}
