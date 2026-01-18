import Link from 'next/link';
import { auth } from '@clerk/nextjs/server';
import { redirect } from 'next/navigation';

export const dynamic = 'force-dynamic';

export default async function HomePage() {
  const { userId } = await auth();

  if (userId) {
    redirect('/dashboard');
  }

  return (
    <main className="min-h-screen flex flex-col items-center justify-center p-8">
      <div className="max-w-4xl mx-auto text-center space-y-8">
        <h1 className="text-5xl md:text-7xl font-bold">
          <span className="gradient-text">Barrios A2I</span>
        </h1>
        <p className="text-xl md:text-2xl text-zinc-400 max-w-2xl mx-auto">
          World-class RAG agents running everything with zero human interaction.
        </p>
        <div className="flex flex-col sm:flex-row gap-4 justify-center pt-8">
          <Link
            href="/sign-in"
            className="px-8 py-4 bg-[#00CED1] text-black font-semibold rounded-lg hover:bg-[#00b5b8] transition-colors"
          >
            Sign In
          </Link>
          <Link
            href="/sign-up"
            className="px-8 py-4 border border-[#27272a] text-white font-semibold rounded-lg hover:border-[#00CED1] transition-colors"
          >
            Get Started
          </Link>
        </div>
      </div>
    </main>
  );
}
