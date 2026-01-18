import { getAccountById, getUserAccounts } from '@/lib/auth';
import Link from 'next/link';

export default async function LabPage() {
  const accounts = await getUserAccounts();
  const account = accounts[0] ? await getAccountById(accounts[0].id) : null;
  
  const subscription = account?.labSubscription;
  const currentCycle = subscription?.cycles?.[0];
  const tokenBalance = currentCycle 
    ? currentCycle.tokensAllocated - currentCycle.tokensUsed 
    : 0;

  return (
    <div className="space-y-8">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold">Commercial Lab</h1>
          <p className="text-zinc-400">AI-powered video production pipeline</p>
        </div>
        <button className="px-6 py-3 bg-[#00CED1] text-black font-semibold rounded-lg hover:bg-[#00b5b8] transition-colors">
          New Production
        </button>
      </div>

      {/* Token Balance Hero */}
      <div className="relative overflow-hidden p-8 rounded-2xl border border-[#27272a] bg-gradient-to-br from-[#141414] to-[#1a1a1a]">
        <div className="absolute top-0 right-0 w-64 h-64 bg-[#00CED1]/5 rounded-full blur-3xl" />
        <div className="relative">
          <p className="text-sm text-zinc-400 mb-2">Available Tokens</p>
          <div className="flex items-end gap-4">
            <span className="text-6xl font-bold gradient-text">{tokenBalance}</span>
            <span className="text-zinc-500 mb-2">/ {currentCycle?.tokensAllocated || 0} this cycle</span>
          </div>
          {subscription && (
            <p className="text-sm text-zinc-500 mt-4">
              {subscription.tier} Plan - Resets {currentCycle ? new Date(currentCycle.periodEnd).toLocaleDateString() : 'N/A'}
            </p>
          )}
        </div>
      </div>

      {/* Production Queue */}
      <div className="space-y-4">
        <h2 className="text-xl font-semibold">Production Queue</h2>
        {account?.productions && account.productions.length > 0 ? (
          <div className="grid gap-4">
            {account.productions.map((production) => (
              <div
                key={production.id}
                className="p-6 rounded-xl border border-[#27272a] bg-[#141414] flex items-center justify-between"
              >
                <div className="space-y-1">
                  <h3 className="font-medium text-lg">{production.title}</h3>
                  <p className="text-sm text-zinc-500">
                    {production.format} | {production.duration}s | {production.tokensRequired} tokens
                  </p>
                </div>
                <div className="flex items-center gap-4">
                  <span className={}>
                    {production.status}
                  </span>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="p-12 rounded-xl border border-dashed border-[#27272a] bg-[#141414]/50 text-center">
            <p className="text-zinc-500 mb-4">No productions in queue</p>
            <button className="px-6 py-2 bg-[#00CED1] text-black font-medium rounded-lg hover:bg-[#00b5b8] transition-colors">
              Create Your First Video
            </button>
          </div>
        )}
      </div>

      {/* Clone Library */}
      <div className="space-y-4">
        <h2 className="text-xl font-semibold">Clone Library</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {account?.cloneProfiles && account.cloneProfiles.length > 0 ? (
            account.cloneProfiles.map((clone) => (
              <div key={clone.id} className="p-6 rounded-xl border border-[#27272a] bg-[#141414]">
                <div className="flex items-center gap-4">
                  <div className={}>
                    {clone.type === 'VOICE' ? 'V' : 'A'}
                  </div>
                  <div>
                    <h3 className="font-medium">{clone.name}</h3>
                    <p className="text-sm text-zinc-500">{clone.type} Clone - {clone.status}</p>
                  </div>
                </div>
              </div>
            ))
          ) : (
            <div className="col-span-2 p-8 rounded-xl border border-dashed border-[#27272a] bg-[#141414]/50 text-center">
              <p className="text-zinc-500">No clones created yet</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
