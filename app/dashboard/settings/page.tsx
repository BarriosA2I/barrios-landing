'use client';

import { useState } from 'react';
import { User, Bell, Shield, Key, Globe, Palette, Save, Check } from 'lucide-react';
import { useUser } from '@clerk/nextjs';

const tabs = [
  { id: 'profile', name: 'Profile', icon: User },
  { id: 'notifications', name: 'Notifications', icon: Bell },
  { id: 'security', name: 'Security', icon: Shield },
  { id: 'api', name: 'API Keys', icon: Key },
];

export default function SettingsPage() {
  const { user } = useUser();
  const [activeTab, setActiveTab] = useState('profile');
  const [saved, setSaved] = useState(false);

  const handleSave = () => {
    setSaved(true);
    setTimeout(() => setSaved(false), 2000);
  };

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="space-y-2">
        <h1 className="text-3xl font-bold text-white">Settings</h1>
        <p className="text-zinc-400">
          Manage your account preferences and configuration.
        </p>
      </div>

      {/* Tabs */}
      <div className="flex gap-1 p-1 rounded-lg bg-[#141414] border border-white/5 w-fit">
        {tabs.map((tab) => (
          <button
            key={tab.id}
            onClick={() => setActiveTab(tab.id)}
            className={`flex items-center gap-2 px-4 py-2 rounded-md text-sm font-medium transition-all ${
              activeTab === tab.id
                ? 'bg-[#00CED1]/10 text-[#00CED1]'
                : 'text-zinc-400 hover:text-white hover:bg-white/5'
            }`}
          >
            <tab.icon className="h-4 w-4" />
            {tab.name}
          </button>
        ))}
      </div>

      {/* Content */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Main Settings */}
        <div className="lg:col-span-2 space-y-6">
          {activeTab === 'profile' && (
            <div className="space-y-6">
              {/* Profile Info */}
              <div className="p-6 rounded-lg border border-white/5 bg-[#141414]">
                <h3 className="text-lg font-semibold text-white mb-4">Profile Information</h3>
                <div className="space-y-4">
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-medium text-zinc-400 mb-2">
                        First Name
                      </label>
                      <input
                        type="text"
                        defaultValue={user?.firstName || ''}
                        className="w-full px-4 py-2 rounded-lg bg-[#0a0a0a] border border-white/10 text-white placeholder-zinc-500 focus:outline-none focus:border-[#00CED1]/50 transition-colors"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-zinc-400 mb-2">
                        Last Name
                      </label>
                      <input
                        type="text"
                        defaultValue={user?.lastName || ''}
                        className="w-full px-4 py-2 rounded-lg bg-[#0a0a0a] border border-white/10 text-white placeholder-zinc-500 focus:outline-none focus:border-[#00CED1]/50 transition-colors"
                      />
                    </div>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-zinc-400 mb-2">
                      Email Address
                    </label>
                    <input
                      type="email"
                      defaultValue={user?.primaryEmailAddress?.emailAddress || ''}
                      disabled
                      className="w-full px-4 py-2 rounded-lg bg-[#0a0a0a] border border-white/10 text-zinc-500 cursor-not-allowed"
                    />
                    <p className="text-xs text-zinc-500 mt-1">
                      Email is managed through your sign-in provider
                    </p>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-zinc-400 mb-2">
                      Timezone
                    </label>
                    <select className="w-full px-4 py-2 rounded-lg bg-[#0a0a0a] border border-white/10 text-white focus:outline-none focus:border-[#00CED1]/50 transition-colors">
                      <option value="America/New_York">Eastern Time (ET)</option>
                      <option value="America/Chicago">Central Time (CT)</option>
                      <option value="America/Denver">Mountain Time (MT)</option>
                      <option value="America/Los_Angeles">Pacific Time (PT)</option>
                    </select>
                  </div>
                </div>
              </div>

              {/* Company Info */}
              <div className="p-6 rounded-lg border border-white/5 bg-[#141414]">
                <h3 className="text-lg font-semibold text-white mb-4">Company Information</h3>
                <div className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium text-zinc-400 mb-2">
                      Company Name
                    </label>
                    <input
                      type="text"
                      placeholder="Your company name"
                      className="w-full px-4 py-2 rounded-lg bg-[#0a0a0a] border border-white/10 text-white placeholder-zinc-500 focus:outline-none focus:border-[#00CED1]/50 transition-colors"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-zinc-400 mb-2">
                      Website
                    </label>
                    <div className="flex">
                      <span className="px-4 py-2 rounded-l-lg bg-[#1a1a1a] border border-r-0 border-white/10 text-zinc-500">
                        https://
                      </span>
                      <input
                        type="text"
                        placeholder="yourcompany.com"
                        className="flex-1 px-4 py-2 rounded-r-lg bg-[#0a0a0a] border border-white/10 text-white placeholder-zinc-500 focus:outline-none focus:border-[#00CED1]/50 transition-colors"
                      />
                    </div>
                  </div>
                </div>
              </div>
            </div>
          )}

          {activeTab === 'notifications' && (
            <div className="p-6 rounded-lg border border-white/5 bg-[#141414]">
              <h3 className="text-lg font-semibold text-white mb-4">Notification Preferences</h3>
              <div className="space-y-4">
                {[
                  { label: 'Production Completed', desc: 'When a video finishes rendering', default: true },
                  { label: 'Billing Alerts', desc: 'Payment reminders and invoice updates', default: true },
                  { label: 'Token Low Warning', desc: 'When token balance falls below 10%', default: true },
                  { label: 'NEXUS Updates', desc: 'New features and system updates', default: false },
                  { label: 'Marketing', desc: 'Tips, tutorials, and promotions', default: false },
                ].map((item) => (
                  <label
                    key={item.label}
                    className="flex items-center justify-between p-4 rounded-lg bg-[#0a0a0a] border border-white/5 cursor-pointer hover:border-white/10 transition-colors"
                  >
                    <div>
                      <p className="text-sm font-medium text-white">{item.label}</p>
                      <p className="text-xs text-zinc-500">{item.desc}</p>
                    </div>
                    <input
                      type="checkbox"
                      defaultChecked={item.default}
                      className="w-5 h-5 rounded border-white/20 bg-[#141414] text-[#00CED1] focus:ring-[#00CED1] focus:ring-offset-0"
                    />
                  </label>
                ))}
              </div>
            </div>
          )}

          {activeTab === 'security' && (
            <div className="space-y-6">
              <div className="p-6 rounded-lg border border-white/5 bg-[#141414]">
                <h3 className="text-lg font-semibold text-white mb-4">Security Settings</h3>
                <div className="space-y-4">
                  <div className="flex items-center justify-between p-4 rounded-lg bg-[#0a0a0a] border border-white/5">
                    <div>
                      <p className="text-sm font-medium text-white">Two-Factor Authentication</p>
                      <p className="text-xs text-zinc-500">Add an extra layer of security</p>
                    </div>
                    <button className="px-4 py-2 text-sm font-medium rounded-lg bg-[#00CED1]/10 text-[#00CED1] hover:bg-[#00CED1]/20 transition-colors">
                      Enable
                    </button>
                  </div>
                  <div className="flex items-center justify-between p-4 rounded-lg bg-[#0a0a0a] border border-white/5">
                    <div>
                      <p className="text-sm font-medium text-white">Active Sessions</p>
                      <p className="text-xs text-zinc-500">Manage devices where you're logged in</p>
                    </div>
                    <button className="px-4 py-2 text-sm font-medium rounded-lg border border-white/10 text-zinc-400 hover:text-white hover:border-white/20 transition-colors">
                      View All
                    </button>
                  </div>
                </div>
              </div>
            </div>
          )}

          {activeTab === 'api' && (
            <div className="p-6 rounded-lg border border-white/5 bg-[#141414]">
              <h3 className="text-lg font-semibold text-white mb-4">API Keys</h3>
              <p className="text-sm text-zinc-400 mb-4">
                Use API keys to integrate Barrios A2I services into your applications.
              </p>
              <div className="space-y-4">
                <div className="p-4 rounded-lg bg-[#0a0a0a] border border-white/5">
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-sm font-medium text-white">Production Key</span>
                    <span className="text-xs px-2 py-1 rounded-full bg-green-500/10 text-green-400">Active</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <code className="flex-1 px-3 py-2 rounded bg-[#141414] text-sm text-zinc-400 font-mono">
                      ba_live_••••••••••••••••
                    </code>
                    <button className="px-3 py-2 text-sm rounded-lg border border-white/10 text-zinc-400 hover:text-white transition-colors">
                      Copy
                    </button>
                  </div>
                </div>
                <button className="w-full px-4 py-3 text-sm font-medium rounded-lg border border-dashed border-white/10 text-zinc-400 hover:text-white hover:border-white/20 transition-colors">
                  + Generate New Key
                </button>
              </div>
            </div>
          )}
        </div>

        {/* Sidebar */}
        <div className="space-y-6">
          {/* Save Button */}
          <button
            onClick={handleSave}
            className="w-full flex items-center justify-center gap-2 px-4 py-3 rounded-lg bg-[#00CED1] text-black font-medium hover:bg-[#00CED1]/90 active:scale-[0.98] transition-all"
          >
            {saved ? (
              <>
                <Check className="h-5 w-5" />
                Saved!
              </>
            ) : (
              <>
                <Save className="h-5 w-5" />
                Save Changes
              </>
            )}
          </button>

          {/* Quick Links */}
          <div className="p-6 rounded-lg border border-white/5 bg-[#141414]">
            <h4 className="text-sm font-semibold text-white mb-4">Quick Links</h4>
            <div className="space-y-2">
              {[
                { icon: Globe, label: 'View Public Profile' },
                { icon: Palette, label: 'Brand Assets' },
                { icon: Key, label: 'Connected Apps' },
              ].map((link, i) => (
                <button
                  key={i}
                  className="w-full flex items-center gap-3 px-3 py-2 rounded-lg text-sm text-zinc-400 hover:text-white hover:bg-white/5 transition-colors"
                >
                  <link.icon className="h-4 w-4" />
                  {link.label}
                </button>
              ))}
            </div>
          </div>

          {/* Danger Zone */}
          <div className="p-6 rounded-lg border border-red-500/20 bg-red-500/5">
            <h4 className="text-sm font-semibold text-red-400 mb-2">Danger Zone</h4>
            <p className="text-xs text-zinc-500 mb-4">
              Permanently delete your account and all associated data.
            </p>
            <button className="w-full px-4 py-2 text-sm font-medium rounded-lg border border-red-500/30 text-red-400 hover:bg-red-500/10 transition-colors">
              Delete Account
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
