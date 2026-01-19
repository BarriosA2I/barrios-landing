'use client';

import { motion } from 'framer-motion';
import { Activity, CheckCircle, TrendingUp, CreditCard, Users, Target, Zap } from 'lucide-react';
import KPICard from '@/components/analytics/KPICard';

// Mock data for demo
const MOCK_KPIs = [
  { title: 'Sync Starts', value: '2,847', change: { value: 12.5, label: 'vs last week' }, icon: Activity, color: 'cyan' as const },
  { title: 'Completions', value: '1,923', change: { value: 8.2, label: 'vs last week' }, icon: CheckCircle, color: 'green' as const },
  { title: 'Conversion Rate', value: '67.5%', change: { value: 3.1, label: 'vs last week' }, icon: TrendingUp, color: 'gold' as const },
  { title: 'Revenue', value: '$48,290', change: { value: 15.8, label: 'vs last month' }, icon: CreditCard, color: 'cyan' as const },
];

const FUNNEL_DATA = [
  { stage: 'Visitors', value: 10000, percent: 100 },
  { stage: 'Signups', value: 3200, percent: 32 },
  { stage: 'Trials', value: 1600, percent: 16 },
  { stage: 'Paid', value: 640, percent: 6.4 },
];

const TIER_DATA = [
  { tier: 'Starter', count: 245, revenue: 110025, color: '#00bfff' },
  { tier: 'Creator', count: 180, revenue: 161820, color: '#10b981' },
  { tier: 'Growth', count: 95, revenue: 161405, color: '#8b5cf6' },
  { tier: 'Scale', count: 42, revenue: 134358, color: '#ffd700' },
];

const REVENUE_TREND = [
  { day: 'Mon', value: 4200 },
  { day: 'Tue', value: 5800 },
  { day: 'Wed', value: 4900 },
  { day: 'Thu', value: 7200 },
  { day: 'Fri', value: 6100 },
  { day: 'Sat', value: 3800 },
  { day: 'Sun', value: 4500 },
];

const maxRevenue = Math.max(...REVENUE_TREND.map(d => d.value));

export default function AnalyticsDashboardPage() {
  return (
    <div className="min-h-screen p-6 lg:p-8">
      {/* Header */}
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        className="mb-8"
      >
        <h1 className="text-3xl font-black uppercase tracking-tighter text-white">
          Analytics Dashboard
        </h1>
        <p className="text-slate-400 mt-2">
          Track conversions, revenue, and user engagement.
        </p>
      </motion.div>

      {/* KPI Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
        {MOCK_KPIs.map((kpi, idx) => (
          <KPICard
            key={kpi.title}
            title={kpi.title}
            value={kpi.value}
            change={kpi.change}
            icon={kpi.icon}
            color={kpi.color}
            index={idx}
          />
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Conversion Funnel */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="rounded-2xl border border-white/10 bg-white/5 backdrop-blur-xl p-6"
        >
          <div className="flex items-center justify-between mb-6">
            <div>
              <h2 className="text-lg font-bold text-white">Conversion Funnel</h2>
              <p className="text-xs text-slate-500">User journey breakdown</p>
            </div>
            <div className="p-2 rounded-xl bg-[#00bfff]/10">
              <Target size={20} className="text-[#00bfff]" />
            </div>
          </div>

          <div className="space-y-4">
            {FUNNEL_DATA.map((item, idx) => (
              <motion.div
                key={item.stage}
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.3 + idx * 0.1 }}
              >
                <div className="flex items-center justify-between mb-1">
                  <span className="text-sm font-semibold text-white">{item.stage}</span>
                  <span className="text-xs text-slate-400">
                    {item.value.toLocaleString()} ({item.percent}%)
                  </span>
                </div>
                <div className="h-8 bg-white/5 rounded-lg overflow-hidden">
                  <motion.div
                    initial={{ width: 0 }}
                    animate={{ width: `${item.percent}%` }}
                    transition={{ duration: 0.8, delay: 0.4 + idx * 0.1 }}
                    className="h-full rounded-lg"
                    style={{
                      background: `linear-gradient(90deg, #00bfff, ${
                        idx === FUNNEL_DATA.length - 1 ? '#ffd700' : '#00bfff80'
                      })`,
                    }}
                  />
                </div>
              </motion.div>
            ))}
          </div>
        </motion.div>

        {/* Revenue Trend */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
          className="rounded-2xl border border-white/10 bg-white/5 backdrop-blur-xl p-6"
        >
          <div className="flex items-center justify-between mb-6">
            <div>
              <h2 className="text-lg font-bold text-white">Revenue Trend</h2>
              <p className="text-xs text-slate-500">Last 7 days</p>
            </div>
            <div className="p-2 rounded-xl bg-[#ffd700]/10">
              <TrendingUp size={20} className="text-[#ffd700]" />
            </div>
          </div>

          {/* Simple Bar Chart */}
          <div className="flex items-end justify-between h-48 gap-2">
            {REVENUE_TREND.map((item, idx) => (
              <div key={item.day} className="flex-1 flex flex-col items-center gap-2">
                <motion.div
                  initial={{ height: 0 }}
                  animate={{ height: `${(item.value / maxRevenue) * 100}%` }}
                  transition={{ duration: 0.5, delay: 0.4 + idx * 0.05 }}
                  className="w-full rounded-t-lg min-h-[4px]"
                  style={{
                    background: 'linear-gradient(180deg, #00bfff, #00bfff40)',
                  }}
                />
                <span className="text-[10px] text-slate-500">{item.day}</span>
              </div>
            ))}
          </div>

          <div className="flex items-center justify-between mt-4 pt-4 border-t border-white/10">
            <span className="text-xs text-slate-500">Total this week</span>
            <span className="text-lg font-bold text-[#00bfff]">
              ${REVENUE_TREND.reduce((a, b) => a + b.value, 0).toLocaleString()}
            </span>
          </div>
        </motion.div>

        {/* Tier Distribution */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4 }}
          className="rounded-2xl border border-white/10 bg-white/5 backdrop-blur-xl p-6"
        >
          <div className="flex items-center justify-between mb-6">
            <div>
              <h2 className="text-lg font-bold text-white">Tier Distribution</h2>
              <p className="text-xs text-slate-500">Active subscribers by plan</p>
            </div>
            <div className="p-2 rounded-xl bg-emerald-400/10">
              <Users size={20} className="text-emerald-400" />
            </div>
          </div>

          <div className="space-y-4">
            {TIER_DATA.map((item, idx) => {
              const maxCount = Math.max(...TIER_DATA.map(d => d.count));
              const percent = (item.count / maxCount) * 100;

              return (
                <motion.div
                  key={item.tier}
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: 0.5 + idx * 0.1 }}
                >
                  <div className="flex items-center justify-between mb-1">
                    <div className="flex items-center gap-2">
                      <div
                        className="w-3 h-3 rounded-full"
                        style={{ backgroundColor: item.color }}
                      />
                      <span className="text-sm font-semibold text-white">{item.tier}</span>
                    </div>
                    <div className="text-right">
                      <span className="text-xs text-slate-400">{item.count} users</span>
                      <span className="text-xs text-slate-600 ml-2">
                        ${item.revenue.toLocaleString()}
                      </span>
                    </div>
                  </div>
                  <div className="h-3 bg-white/5 rounded-full overflow-hidden">
                    <motion.div
                      initial={{ width: 0 }}
                      animate={{ width: `${percent}%` }}
                      transition={{ duration: 0.6, delay: 0.6 + idx * 0.1 }}
                      className="h-full rounded-full"
                      style={{ backgroundColor: item.color }}
                    />
                  </div>
                </motion.div>
              );
            })}
          </div>

          <div className="flex items-center justify-between mt-4 pt-4 border-t border-white/10">
            <span className="text-xs text-slate-500">Total subscribers</span>
            <span className="text-lg font-bold text-white">
              {TIER_DATA.reduce((a, b) => a + b.count, 0).toLocaleString()}
            </span>
          </div>
        </motion.div>

        {/* Quick Actions */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.5 }}
          className="rounded-2xl border border-white/10 bg-white/5 backdrop-blur-xl p-6"
        >
          <div className="flex items-center justify-between mb-6">
            <div>
              <h2 className="text-lg font-bold text-white">Quick Actions</h2>
              <p className="text-xs text-slate-500">Common analytics tasks</p>
            </div>
            <div className="p-2 rounded-xl bg-purple-400/10">
              <Zap size={20} className="text-purple-400" />
            </div>
          </div>

          <div className="grid grid-cols-2 gap-3">
            {[
              { label: 'Export CSV', icon: '📊' },
              { label: 'Generate Report', icon: '📄' },
              { label: 'Schedule Email', icon: '📧' },
              { label: 'Set Alert', icon: '🔔' },
            ].map((action, idx) => (
              <motion.button
                key={action.label}
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ delay: 0.6 + idx * 0.05 }}
                className="flex items-center gap-3 p-4 rounded-xl border border-white/10 bg-white/5 hover:bg-white/10 hover:border-white/20 transition-all text-left"
              >
                <span className="text-2xl">{action.icon}</span>
                <span className="text-sm font-semibold text-white">{action.label}</span>
              </motion.button>
            ))}
          </div>

          <p className="text-[10px] text-slate-600 mt-4 text-center">
            Full analytics export requires Pro plan or higher.
          </p>
        </motion.div>
      </div>
    </div>
  );
}
