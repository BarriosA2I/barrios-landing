import { getOrCreateDbUser, getUserAccounts } from '@/lib/auth';
import Link from 'next/link';

export const dynamic = 'force-dynamic';

export default async function DashboardPage() {
  const user = await getOrCreateDbUser();
  const accounts = await getUserAccounts();
  const defaultAccount = accounts[0];

  return (
    <div className="space-y-8">
      <div className="space-y-2">
        <h1 className="text-3xl font-bold">
          Welcome back, {user?.firstName || 'there'}
        </h1>
        <p className="text-zinc-400">
          Manage your Commercial Lab productions and Nexus installations.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="p-6 rounded-xl border border-[#27272a] bg-[#141414]">
          <div className="flex items-center justify-between mb-4">
            <span className="text-sm text-zinc-400">Token Balance</span>
            <span className="text-xs px-2 py-1 rounded-full bg-[#00CED1]/10 text-[#00CED1]">
              Commercial Lab
            </span>
          </div>
          <div className="text-4xl font-bold gradient-text">0</div>
          <p className="text-sm text-zinc-500 mt-2">tokens remaining this cycle</p>
        </div>

        <div className="p-6 rounded-xl border border-[#27272a] bg-[#141414]">
          <div className="flex items-center justify-between mb-4">
            <span className="text-sm text-zinc-400">Active Productions</span>
            <span className="text-xs px-2 py-1 rounded-full bg-purple-500/10 text-purple-400">
              In Progress
            </span>
          </div>
          <div className="text-4xl font-bold">0</div>
          <p className="text-sm text-zinc-500 mt-2">videos being processed</p>
        </div>

        <div className="p-6 rounded-xl border border-[#27272a] bg-[#141414]">
          <div className="flex items-center justify-between mb-4">
            <span className="text-sm text-zinc-400">Nexus Installation</span>
            <span className="text-xs px-2 py-1 rounded-full bg-yellow-500/10 text-yellow-400">
              Not Started
            </span>
          </div>
          <div className="text-lg font-medium">No active installation</div>
          <p className="text-sm text-zinc-500 mt-2">Configure your personal AI</p>
        </div>
      </div>

      <div className="space-y-4">
        <h2 className="text-xl font-semibold">Quick Actions</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          <Link href="/dashboard/lab" className="p-4 rounded-lg border border-[#27272a] bg-[#141414] hover:border-[#00CED1] transition-colors">
            <h3 className="font-medium">New Production</h3>
            <p className="text-sm text-zinc-500">Start a new video project</p>
          </Link>
          <Link href="/dashboard/lab" className="p-4 rounded-lg border border-[#27272a] bg-[#141414] hover:border-[#00CED1] transition-colors">
            <h3 className="font-medium">Voice Clone</h3>
            <p className="text-sm text-zinc-500">Create a voice profile</p>
          </Link>
          <Link href="/dashboard/nexus" className="p-4 rounded-lg border border-[#27272a] bg-[#141414] hover:border-[#00CED1] transition-colors">
            <h3 className="font-medium">Nexus Status</h3>
            <p className="text-sm text-zinc-500">Check installation health</p>
          </Link>
          <Link href="/dashboard/billing" className="p-4 rounded-lg border border-[#27272a] bg-[#141414] hover:border-[#00CED1] transition-colors">
            <h3 className="font-medium">Billing</h3>
            <p className="text-sm text-zinc-500">Manage subscriptions</p>
          </Link>
        </div>
      </div>
    </div>
  );
}
