'use client';

import { useState } from 'react';
import { motion } from 'framer-motion';
import { User, Bell, Shield, Key, Globe, Palette, Save, Check, Eye, EyeOff, Copy, RotateCcw } from 'lucide-react';
import { useUser } from '@clerk/nextjs';

// Glass Card Component
const GlassCard = ({ children, className = "" }: { children: React.ReactNode, className?: string }) => (
  <div className={`relative overflow-hidden rounded-2xl border border-white/10 bg-white/5 backdrop-blur-xl transition-all duration-300 hover:border-white/20 ${className}`}>
    {children}
  </div>
);

// Toggle Switch Component
const ToggleSwitch = ({ checked, onChange }: { checked: boolean, onChange: () => void }) => (
  <button
    onClick={onChange}
    className={`relative h-6 w-11 rounded-full transition-colors ${checked ? 'bg-[#00bfff]' : 'bg-white/10'}`}
  >
    <motion.div
      initial={false}
      animate={{ x: checked ? 20 : 2 }}
      className="absolute top-1 h-4 w-4 rounded-full bg-white shadow-md"
    />
  </button>
);

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
  const [showApiKey, setShowApiKey] = useState(false);
  const [notifications, setNotifications] = useState({
    production: true,
    billing: true,
    tokenLow: true,
    nexusUpdates: false,
    marketing: false,
  });

  const handleSave = () => {
    setSaved(true);
    setTimeout(() => setSaved(false), 2000);
  };

  const toggleNotification = (key: keyof typeof notifications) => {
    setNotifications(prev => ({ ...prev, [key]: !prev[key] }));
  };

  return (
    <div className="space-y-10">
      {/* Header */}
      <header>
        <h2 className="text-3xl font-black text-white uppercase tracking-tighter">
          System <span className="text-[#ffd700]">Settings</span>
        </h2>
        <p className="text-slate-400">Configure your account preferences and system integration.</p>
      </header>

      {/* Tabs */}
      <div className="flex flex-wrap gap-2 p-1.5 rounded-xl bg-white/5 border border-white/10 w-fit">
        {tabs.map((tab) => (
          <button
            key={tab.id}
            onClick={() => setActiveTab(tab.id)}
            className={`flex items-center gap-2 px-5 py-2.5 rounded-lg text-sm font-bold uppercase tracking-tight transition-all ${
              activeTab === tab.id
                ? 'bg-gradient-to-r from-[#00bfff]/20 to-[#ffd700]/20 text-white border border-[#00bfff]/30'
                : 'text-slate-400 hover:text-white hover:bg-white/5'
            }`}
          >
            <tab.icon size={16} />
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
              <GlassCard className="p-6">
                <h3 className="text-sm font-black uppercase tracking-widest text-[#00bfff] mb-6">Profile Identity</h3>
                <div className="space-y-5">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-[10px] font-bold uppercase tracking-widest text-slate-500 mb-2">
                        First Name
                      </label>
                      <input
                        type="text"
                        defaultValue={user?.firstName || ''}
                        className="w-full px-4 py-3 rounded-xl bg-[#0B1220]/50 border border-white/10 text-white placeholder:text-slate-600 focus:border-[#00bfff] focus:ring-1 focus:ring-[#00bfff]/50 outline-none transition-all"
                      />
                    </div>
                    <div>
                      <label className="block text-[10px] font-bold uppercase tracking-widest text-slate-500 mb-2">
                        Last Name
                      </label>
                      <input
                        type="text"
                        defaultValue={user?.lastName || ''}
                        className="w-full px-4 py-3 rounded-xl bg-[#0B1220]/50 border border-white/10 text-white placeholder:text-slate-600 focus:border-[#00bfff] focus:ring-1 focus:ring-[#00bfff]/50 outline-none transition-all"
                      />
                    </div>
                  </div>
                  <div>
                    <label className="block text-[10px] font-bold uppercase tracking-widest text-slate-500 mb-2">
                      Email Address
                    </label>
                    <input
                      type="email"
                      defaultValue={user?.primaryEmailAddress?.emailAddress || ''}
                      disabled
                      className="w-full px-4 py-3 rounded-xl bg-[#0B1220]/80 border border-white/5 text-slate-500 cursor-not-allowed"
                    />
                    <p className="text-[10px] text-slate-600 mt-2">
                      Email is managed through your sign-in provider
                    </p>
                  </div>
                  <div>
                    <label className="block text-[10px] font-bold uppercase tracking-widest text-slate-500 mb-2">
                      Timezone
                    </label>
                    <select className="w-full px-4 py-3 rounded-xl bg-[#0B1220]/50 border border-white/10 text-white focus:border-[#00bfff] focus:ring-1 focus:ring-[#00bfff]/50 outline-none transition-all cursor-pointer">
                      <option value="America/New_York">Eastern Time (ET)</option>
                      <option value="America/Chicago">Central Time (CT)</option>
                      <option value="America/Denver">Mountain Time (MT)</option>
                      <option value="America/Los_Angeles">Pacific Time (PT)</option>
                    </select>
                  </div>
                </div>
              </GlassCard>

              {/* Company Info */}
              <GlassCard className="p-6">
                <h3 className="text-sm font-black uppercase tracking-widest text-[#ffd700] mb-6">Organization</h3>
                <div className="space-y-5">
                  <div>
                    <label className="block text-[10px] font-bold uppercase tracking-widest text-slate-500 mb-2">
                      Company Name
                    </label>
                    <input
                      type="text"
                      placeholder="Your company name"
                      className="w-full px-4 py-3 rounded-xl bg-[#0B1220]/50 border border-white/10 text-white placeholder:text-slate-600 focus:border-[#00bfff] focus:ring-1 focus:ring-[#00bfff]/50 outline-none transition-all"
                    />
                  </div>
                  <div>
                    <label className="block text-[10px] font-bold uppercase tracking-widest text-slate-500 mb-2">
                      Website
                    </label>
                    <div className="flex">
                      <span className="px-4 py-3 rounded-l-xl bg-white/5 border border-r-0 border-white/10 text-slate-500 text-sm">
                        https://
                      </span>
                      <input
                        type="text"
                        placeholder="yourcompany.com"
                        className="flex-1 px-4 py-3 rounded-r-xl bg-[#0B1220]/50 border border-white/10 text-white placeholder:text-slate-600 focus:border-[#00bfff] focus:ring-1 focus:ring-[#00bfff]/50 outline-none transition-all"
                      />
                    </div>
                  </div>
                </div>
              </GlassCard>
            </div>
          )}

          {activeTab === 'notifications' && (
            <GlassCard className="p-6">
              <h3 className="text-sm font-black uppercase tracking-widest text-[#00bfff] mb-6">Notification Preferences</h3>
              <div className="space-y-3">
                {[
                  { key: 'production' as const, label: 'Production Completed', desc: 'When a video finishes rendering' },
                  { key: 'billing' as const, label: 'Billing Alerts', desc: 'Payment reminders and invoice updates' },
                  { key: 'tokenLow' as const, label: 'Token Low Warning', desc: 'When token balance falls below 10%' },
                  { key: 'nexusUpdates' as const, label: 'NEXUS Updates', desc: 'New features and system updates' },
                  { key: 'marketing' as const, label: 'Marketing', desc: 'Tips, tutorials, and promotions' },
                ].map((item) => (
                  <div
                    key={item.key}
                    className="flex items-center justify-between p-4 rounded-xl bg-[#0B1220]/50 border border-white/5 hover:border-white/10 transition-colors"
                  >
                    <div>
                      <p className="text-sm font-bold text-white">{item.label}</p>
                      <p className="text-[10px] text-slate-500 uppercase tracking-wide">{item.desc}</p>
                    </div>
                    <ToggleSwitch
                      checked={notifications[item.key]}
                      onChange={() => toggleNotification(item.key)}
                    />
                  </div>
                ))}
              </div>
            </GlassCard>
          )}

          {activeTab === 'security' && (
            <div className="space-y-6">
              <GlassCard className="p-6">
                <h3 className="text-sm font-black uppercase tracking-widest text-[#00bfff] mb-6">Security Settings</h3>
                <div className="space-y-4">
                  <div className="flex items-center justify-between p-4 rounded-xl bg-[#0B1220]/50 border border-white/5">
                    <div>
                      <p className="text-sm font-bold text-white">Two-Factor Authentication</p>
                      <p className="text-[10px] text-slate-500 uppercase tracking-wide">Add an extra layer of security</p>
                    </div>
                    <button className="px-5 py-2 text-xs font-black uppercase tracking-tight rounded-lg bg-[#00bfff] text-[#0B1220] hover:brightness-110 transition-all">
                      Enable
                    </button>
                  </div>
                  <div className="flex items-center justify-between p-4 rounded-xl bg-[#0B1220]/50 border border-white/5">
                    <div>
                      <p className="text-sm font-bold text-white">Active Sessions</p>
                      <p className="text-[10px] text-slate-500 uppercase tracking-wide">Manage devices where you're logged in</p>
                    </div>
                    <button className="px-5 py-2 text-xs font-bold uppercase tracking-tight rounded-lg border border-white/10 text-slate-400 hover:text-white hover:border-white/20 transition-colors">
                      View All
                    </button>
                  </div>
                  <div className="flex items-center justify-between p-4 rounded-xl bg-[#0B1220]/50 border border-white/5">
                    <div>
                      <p className="text-sm font-bold text-white">Password</p>
                      <p className="text-[10px] text-slate-500 uppercase tracking-wide">Last changed 30 days ago</p>
                    </div>
                    <button className="px-5 py-2 text-xs font-bold uppercase tracking-tight rounded-lg border border-white/10 text-slate-400 hover:text-white hover:border-white/20 transition-colors">
                      Change
                    </button>
                  </div>
                </div>
              </GlassCard>
            </div>
          )}

          {activeTab === 'api' && (
            <GlassCard className="p-6">
              <h3 className="text-sm font-black uppercase tracking-widest text-[#ffd700] mb-2">API Infrastructure</h3>
              <p className="text-xs text-slate-500 mb-6">
                Use API keys to integrate Barrios A2I services into your applications.
              </p>
              <div className="space-y-4">
                <div className="p-4 rounded-xl bg-[#0B1220]/50 border border-white/5">
                  <div className="flex items-center justify-between mb-3">
                    <span className="text-sm font-bold text-white">Production Key</span>
                    <span className="text-[10px] px-2 py-1 rounded-full bg-emerald-500/10 text-emerald-400 font-bold uppercase">Active</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <div className="flex-1 px-4 py-3 rounded-lg bg-[#0B1220] border border-white/5 font-mono text-sm text-slate-400 overflow-x-auto">
                      {showApiKey ? 'ba_live_sk_1234567890abcdef' : 'ba_live_••••••••••••••••'}
                    </div>
                    <button
                      onClick={() => setShowApiKey(!showApiKey)}
                      className="p-3 rounded-lg border border-white/10 text-slate-400 hover:text-white hover:bg-white/5 transition-all"
                    >
                      {showApiKey ? <EyeOff size={16} /> : <Eye size={16} />}
                    </button>
                    <button className="p-3 rounded-lg border border-white/10 text-slate-400 hover:text-white hover:bg-white/5 transition-all">
                      <Copy size={16} />
                    </button>
                  </div>
                  <p className="text-[10px] text-slate-600 mt-2">Created on Jan 15, 2026</p>
                </div>

                <div className="p-4 rounded-xl bg-[#0B1220]/50 border border-white/5">
                  <div className="flex items-center justify-between mb-3">
                    <span className="text-sm font-bold text-white">Test Key</span>
                    <span className="text-[10px] px-2 py-1 rounded-full bg-[#ffd700]/10 text-[#ffd700] font-bold uppercase">Sandbox</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <div className="flex-1 px-4 py-3 rounded-lg bg-[#0B1220] border border-white/5 font-mono text-sm text-slate-400">
                      ba_test_••••••••••••••••
                    </div>
                    <button className="p-3 rounded-lg border border-white/10 text-slate-400 hover:text-white hover:bg-white/5 transition-all">
                      <Eye size={16} />
                    </button>
                    <button className="p-3 rounded-lg border border-white/10 text-slate-400 hover:text-white hover:bg-white/5 transition-all">
                      <Copy size={16} />
                    </button>
                  </div>
                </div>

                <button className="w-full py-4 rounded-xl border border-dashed border-white/10 text-sm font-bold text-slate-500 hover:text-white hover:border-white/20 transition-colors flex items-center justify-center gap-2">
                  <RotateCcw size={16} />
                  Generate New Key
                </button>
              </div>
            </GlassCard>
          )}
        </div>

        {/* Sidebar */}
        <div className="space-y-6">
          {/* Save Button */}
          <motion.button
            onClick={handleSave}
            whileTap={{ scale: 0.98 }}
            className={`w-full flex items-center justify-center gap-2 px-6 py-4 rounded-xl font-black uppercase tracking-tighter text-sm transition-all ${
              saved
                ? 'bg-emerald-500 text-white'
                : 'bg-gradient-to-r from-[#00bfff] to-[#ffd700] text-[#0B1220] hover:shadow-[0_0_30px_rgba(0,191,255,0.3)]'
            }`}
          >
            {saved ? (
              <>
                <Check size={18} />
                Saved!
              </>
            ) : (
              <>
                <Save size={18} />
                Save Changes
              </>
            )}
          </motion.button>

          {/* Quick Links */}
          <GlassCard className="p-6">
            <h4 className="text-[10px] font-black uppercase tracking-widest text-slate-500 mb-4">Quick Links</h4>
            <div className="space-y-2">
              {[
                { icon: Globe, label: 'View Public Profile' },
                { icon: Palette, label: 'Brand Assets' },
                { icon: Key, label: 'Connected Apps' },
              ].map((link, i) => (
                <button
                  key={i}
                  className="w-full flex items-center gap-3 px-4 py-3 rounded-xl text-sm text-slate-400 hover:text-white hover:bg-white/5 transition-colors"
                >
                  <link.icon size={16} className="text-[#00bfff]" />
                  {link.label}
                </button>
              ))}
            </div>
          </GlassCard>

          {/* Danger Zone */}
          <div className="p-6 rounded-2xl border border-red-500/20 bg-red-500/5">
            <h4 className="text-xs font-black uppercase tracking-widest text-red-400 mb-2">Danger Zone</h4>
            <p className="text-[10px] text-slate-500 mb-4">
              Permanently delete your account and all associated data.
            </p>
            <button className="w-full px-4 py-3 text-xs font-bold uppercase tracking-tight rounded-xl border border-red-500/30 text-red-400 hover:bg-red-500/10 transition-colors">
              Delete Account
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
