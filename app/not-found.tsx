import Link from 'next/link';

export const dynamic = 'force-dynamic';

export default function NotFound() {
  return (
    <main className="min-h-screen flex flex-col items-center justify-center p-8 bg-[#0a0a0a]">
      <div className="max-w-md mx-auto text-center space-y-6">
        <h1 className="text-8xl font-bold text-[#00CED1]">404</h1>
        <h2 className="text-2xl font-semibold text-white">Page Not Found</h2>
        <p className="text-zinc-400">
          The page you're looking for doesn't exist or has been moved.
        </p>
        <Link
          href="/"
          className="inline-block px-6 py-3 bg-[#00CED1] text-black font-semibold rounded-lg hover:bg-[#00b5b8] transition-colors"
        >
          Return Home
        </Link>
      </div>
    </main>
  );
}
