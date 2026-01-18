import { getAccountById, getUserAccounts } from '@/lib/auth';

export default async function NexusPage() {
  const accounts = await getUserAccounts();
  const account = accounts[0] ? await getAccountById(accounts[0].id) : null;
  const installation = account?.nexusInstallation;

  const phases = ['INTAKE', 'SCHEDULED', 'IN_PROGRESS', 'TESTING', 'HANDOFF', 'COMPLETED'];
  const currentPhaseIndex = installation ? phases.indexOf(installation.phase) : -1;

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-3xl font-bold">Nexus Personal</h1>
        <p className="text-zinc-400">Your private AI installation</p>
      </div>

      {installation ? (
        <>
          <div className="p-8 rounded-2xl border border-[#27272a] bg-[#141414]">
            <div className="flex items-center justify-between mb-6">
              <div>
                <p className="text-sm text-zinc-400">Installation Code</p>
                <p className="text-2xl font-mono font-bold text-[#00CED1]">{installation.installationCode}</p>
              </div>
              <div className="text-right">
                <p className="text-sm text-zinc-400">Status</p>
                <span className="text-lg font-medium text-[#D4AF37]">{installation.phase}</span>
              </div>
            </div>

            <div className="relative">
              <div className="absolute top-4 left-0 right-0 h-1 bg-[#27272a] rounded-full" />
              <div className="relative flex justify-between">
                {phases.map((phase, i) => (
                  <div key={phase} className="flex flex-col items-center">
                    <div className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-medium z-10 ${
                      i <= currentPhaseIndex ? 'bg-[#00CED1] text-black' : 'bg-[#27272a] text-zinc-500'
                    }`}>
                      {i + 1}
                    </div>
                    <span className="text-xs text-zinc-500 mt-2 text-center">{phase}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="p-6 rounded-xl border border-[#27272a] bg-[#141414]">
              <h3 className="font-medium mb-4">System Health</h3>
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <span className="text-zinc-400">Last Health Ping</span>
                  <span className="font-mono text-sm">
                    {installation.lastHealthPing 
                      ? new Date(installation.lastHealthPing).toLocaleString()
                      : 'Never'}
                  </span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-zinc-400">Drift Detected</span>
                  <span className={installation.driftDetected ? 'text-red-400' : 'text-green-400'}>
                    {installation.driftDetected ? 'Yes' : 'No'}
                  </span>
                </div>
              </div>
            </div>

            <div className="p-6 rounded-xl border border-[#27272a] bg-[#141414]">
              <h3 className="font-medium mb-4">Maintenance</h3>
              {installation.maintenanceSub ? (
                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <span className="text-zinc-400">Plan</span>
                    <span>{installation.maintenanceSub.interval}</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-zinc-400">Status</span>
                    <span className="text-green-400">{installation.maintenanceSub.status}</span>
                  </div>
                </div>
              ) : (
                <p className="text-zinc-500">No maintenance plan active</p>
              )}
            </div>
          </div>
        </>
      ) : (
        <div className="p-12 rounded-2xl border border-dashed border-[#27272a] bg-[#141414]/50 text-center">
          <div className="w-16 h-16 rounded-full bg-[#D4AF37]/10 flex items-center justify-center mx-auto mb-4">
            <span className="text-[#D4AF37] text-2xl">N</span>
          </div>
          <h2 className="text-xl font-semibold mb-2">No Installation Yet</h2>
          <p className="text-zinc-500 mb-6 max-w-md mx-auto">
            Get your personal AI assistant installed on your local infrastructure.
          </p>
          <button className="px-8 py-3 bg-[#D4AF37] text-black font-semibold rounded-lg hover:bg-[#c9a432] transition-colors">
            Start Installation
          </button>
        </div>
      )}
    </div>
  );
}
