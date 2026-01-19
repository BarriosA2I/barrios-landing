'use client';

import { useUser, useClerk } from '@clerk/nextjs';
import Link from 'next/link';
import { useRouter } from 'next/navigation';

export default function ProfilePage() {
  const { user, isLoaded } = useUser();
  const { signOut } = useClerk();
  const router = useRouter();

  const handleSignOut = async () => {
    await signOut();
    router.push('/');
  };

  if (!isLoaded) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <div className="animate-spin h-8 w-8 border-2 border-[#00CED1] border-t-transparent rounded-full" />
      </div>
    );
  }

  const createdAt = user?.createdAt
    ? new Date(user.createdAt).toLocaleDateString('en-US', {
        year: 'numeric',
        month: 'long',
        day: 'numeric'
      })
    : 'Unknown';

  return (
    <div className="space-y-8 max-w-4xl mx-auto">
      {/* Profile Header */}
      <div className="p-8 rounded-xl border border-[#27272a] bg-[#141414]">
        <div className="flex flex-col md:flex-row items-center md:items-start gap-6">
          {/* Avatar */}
          <div className="relative">
            <img
              src={user?.imageUrl || '/default-avatar.png'}
              alt={user?.fullName || 'User avatar'}
              className="w-32 h-32 rounded-full border-4 border-[#00CED1]/30 object-cover"
            />
            <div className="absolute -bottom-2 -right-2 w-8 h-8 bg-green-500 rounded-full border-4 border-[#141414]" title="Online" />
          </div>

          {/* User Info */}
          <div className="flex-1 text-center md:text-left space-y-2">
            <h1 className="text-3xl font-bold">
              {user?.fullName || user?.firstName || 'User'}
            </h1>
            <p className="text-zinc-400">
              {user?.primaryEmailAddress?.emailAddress || 'No email'}
            </p>
            <p className="text-sm text-zinc-500">
              Member since {createdAt}
            </p>

            {/* Subscription Badge */}
            <div className="inline-flex items-center gap-2 mt-3">
              <span className="px-3 py-1 rounded-full text-sm font-medium bg-[#00CED1]/10 text-[#00CED1] border border-[#00CED1]/30">
                Free Tier
              </span>
              <Link
                href="/dashboard/billing"
                className="text-sm text-[#00CED1] hover:underline"
              >
                Upgrade
              </Link>
            </div>
          </div>

          {/* Actions */}
          <div className="flex flex-col gap-3">
            <Link
              href="/dashboard/settings"
              className="px-6 py-2 rounded-lg border border-[#27272a] bg-[#0a0a0a] hover:border-[#00CED1] transition-colors text-center"
            >
              Settings
            </Link>
            <button
              onClick={handleSignOut}
              className="px-6 py-2 rounded-lg border border-red-500/30 bg-red-500/10 text-red-400 hover:bg-red-500/20 transition-colors"
            >
              Sign Out
            </button>
          </div>
        </div>
      </div>

      {/* Quick Stats */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <div className="p-6 rounded-xl border border-[#27272a] bg-[#141414] text-center">
          <div className="text-3xl font-bold gradient-text">0</div>
          <p className="text-sm text-zinc-500 mt-1">Tokens Used</p>
        </div>
        <div className="p-6 rounded-xl border border-[#27272a] bg-[#141414] text-center">
          <div className="text-3xl font-bold">0</div>
          <p className="text-sm text-zinc-500 mt-1">Productions</p>
        </div>
        <div className="p-6 rounded-xl border border-[#27272a] bg-[#141414] text-center">
          <div className="text-3xl font-bold">0</div>
          <p className="text-sm text-zinc-500 mt-1">Voice Clones</p>
        </div>
        <div className="p-6 rounded-xl border border-[#27272a] bg-[#141414] text-center">
          <div className="text-3xl font-bold text-yellow-400">—</div>
          <p className="text-sm text-zinc-500 mt-1">Nexus Status</p>
        </div>
      </div>

      {/* Account Details */}
      <div className="p-6 rounded-xl border border-[#27272a] bg-[#141414]">
        <h2 className="text-xl font-semibold mb-6">Account Details</h2>
        <div className="space-y-4">
          <div className="flex justify-between items-center py-3 border-b border-[#27272a]">
            <span className="text-zinc-400">User ID</span>
            <span className="font-mono text-sm text-zinc-300">{user?.id?.slice(0, 20)}...</span>
          </div>
          <div className="flex justify-between items-center py-3 border-b border-[#27272a]">
            <span className="text-zinc-400">Email</span>
            <span className="text-zinc-300">{user?.primaryEmailAddress?.emailAddress}</span>
          </div>
          <div className="flex justify-between items-center py-3 border-b border-[#27272a]">
            <span className="text-zinc-400">Email Verified</span>
            <span className={user?.primaryEmailAddress?.verification?.status === 'verified' ? 'text-green-400' : 'text-yellow-400'}>
              {user?.primaryEmailAddress?.verification?.status === 'verified' ? 'Yes' : 'Pending'}
            </span>
          </div>
          <div className="flex justify-between items-center py-3 border-b border-[#27272a]">
            <span className="text-zinc-400">Subscription</span>
            <span className="text-zinc-300">Free Tier</span>
          </div>
          <div className="flex justify-between items-center py-3">
            <span className="text-zinc-400">Billing Cycle</span>
            <span className="text-zinc-500">—</span>
          </div>
        </div>
      </div>

      {/* Quick Links */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <Link
          href="/dashboard/billing"
          className="p-4 rounded-lg border border-[#27272a] bg-[#141414] hover:border-[#00CED1] transition-colors group"
        >
          <h3 className="font-medium group-hover:text-[#00CED1] transition-colors">Billing & Subscription</h3>
          <p className="text-sm text-zinc-500">Manage your plan and payments</p>
        </Link>
        <Link
          href="/dashboard/settings"
          className="p-4 rounded-lg border border-[#27272a] bg-[#141414] hover:border-[#00CED1] transition-colors group"
        >
          <h3 className="font-medium group-hover:text-[#00CED1] transition-colors">Account Settings</h3>
          <p className="text-sm text-zinc-500">Update profile and preferences</p>
        </Link>
        <Link
          href="/dashboard/support"
          className="p-4 rounded-lg border border-[#27272a] bg-[#141414] hover:border-[#00CED1] transition-colors group"
        >
          <h3 className="font-medium group-hover:text-[#00CED1] transition-colors">Support</h3>
          <p className="text-sm text-zinc-500">Get help and contact us</p>
        </Link>
      </div>
    </div>
  );
}
