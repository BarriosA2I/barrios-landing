import { CreativeDirectorChat } from '@/components/CreativeDirectorChat';

export default function CreatePage() {
  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-950 to-black">
      {/* Header */}
      <div className="border-b border-gray-800 bg-gray-950/50 backdrop-blur-sm">
        <div className="max-w-7xl mx-auto px-4 py-6">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-gradient-to-br from-cyan-500 to-teal-600 rounded-lg flex items-center justify-center">
              <span className="text-2xl">🎬</span>
            </div>
            <div>
              <h1 className="text-2xl font-bold text-white">Creative Director AI</h1>
              <p className="text-sm text-gray-400">Powered by RAGNAROK 9-Agent System</p>
            </div>
          </div>
        </div>
      </div>

      {/* Main content */}
      <div className="max-w-7xl mx-auto px-4 py-8">
        <div className="mb-6">
          <h2 className="text-xl font-semibold text-white mb-2">Create Your AI Video</h2>
          <p className="text-gray-400">
            Chat with our AI Creative Director to design your perfect video commercial.
            We'll guide you through the process and generate a professional 64-second video.
          </p>
        </div>

        <CreativeDirectorChat />

        {/* Info cards */}
        <div className="grid md:grid-cols-3 gap-4 mt-8">
          <div className="bg-gray-900/50 border border-gray-800 rounded-lg p-4">
            <div className="text-cyan-400 text-2xl mb-2">⚡</div>
            <h3 className="font-semibold text-white mb-1">Fast-Track Mode</h3>
            <p className="text-sm text-gray-400">
              In a hurry? Just provide all details at once and we'll process them instantly.
            </p>
          </div>

          <div className="bg-gray-900/50 border border-gray-800 rounded-lg p-4">
            <div className="text-cyan-400 text-2xl mb-2">🤖</div>
            <h3 className="font-semibold text-white mb-1">23-Agent Pipeline</h3>
            <p className="text-sm text-gray-400">
              Powered by RAGNAROK's 23-agent system including Trinity market intelligence.
            </p>
          </div>

          <div className="bg-gray-900/50 border border-gray-800 rounded-lg p-4">
            <div className="text-cyan-400 text-2xl mb-2">📊</div>
            <h3 className="font-semibold text-white mb-1">Real-Time Progress</h3>
            <p className="text-sm text-gray-400">
              Watch your video being created with live updates from each production phase.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
