'use client';

import { motion } from 'framer-motion';
import { useUser } from '@clerk/nextjs';
import {
  User,
  Mail,
  CheckCircle,
  AlertCircle,
  CreditCard,
  Calendar,
  Copy,
  Check,
  ExternalLink
} from 'lucide-react';
import { useState } from 'react';

interface AccountDetailsProps {
  subscription?: {
    tier: string;
    billingCycle?: 'MONTHLY' | 'YEARLY';
    nextBillingDate?: Date;
  };
}

export default function AccountDetails({ subscription }: AccountDetailsProps) {
  const { user } = useUser();
  const [copiedField, setCopiedField] = useState<string | null>(null);

  const handleCopy = async (value: string, field: string) => {
    await navigator.clipboard.writeText(value);
    setCopiedField(field);
    setTimeout(() => setCopiedField(null), 2000);
  };

  const isVerified = user?.primaryEmailAddress?.verification?.status === 'verified';

  const detailItems = [
    {
      id: 'userId',
      icon: User,
      label: 'User ID',
      value: user?.id || 'Unknown',
      displayValue: user?.id ? `${user.id.slice(0, 20)}...` : 'Unknown',
      copyable: true,
      mono: true
    },
    {
      id: 'email',
      icon: Mail,
      label: 'Email Address',
      value: user?.primaryEmailAddress?.emailAddress || 'No email',
      displayValue: user?.primaryEmailAddress?.emailAddress || 'No email',
      copyable: true,
      mono: false
    },
    {
      id: 'verified',
      icon: isVerified ? CheckCircle : AlertCircle,
      label: 'Email Status',
      value: isVerified ? 'Verified' : 'Pending verification',
      displayValue: isVerified ? 'Verified' : 'Pending',
      copyable: false,
      mono: false,
      statusColor: isVerified ? 'text-green-400' : 'text-amber-400'
    },
    {
      id: 'subscription',
      icon: CreditCard,
      label: 'Subscription',
      value: subscription?.tier || 'Free Tier',
      displayValue: subscription?.tier || 'Free Tier',
      copyable: false,
      mono: false
    },
    {
      id: 'billing',
      icon: Calendar,
      label: 'Billing Cycle',
      value: subscription?.billingCycle || '—',
      displayValue: subscription?.billingCycle
        ? subscription.billingCycle.charAt(0) + subscription.billingCycle.slice(1).toLowerCase()
        : '—',
      copyable: false,
      mono: false
    }
  ];

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 0.5 }}
      className="relative overflow-hidden rounded-2xl border border-white/10 bg-white/5 backdrop-blur-xl p-6"
    >
      {/* Header */}
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-lg font-black uppercase tracking-tight flex items-center gap-2">
          <User className="w-5 h-5 text-[#00CED1]" />
          Account Details
        </h2>
        <a
          href="/dashboard/settings"
          className="text-xs text-slate-500 hover:text-[#00CED1] transition-colors flex items-center gap-1"
        >
          Edit
          <ExternalLink className="w-3 h-3" />
        </a>
      </div>

      {/* Details List */}
      <div className="space-y-1">
        {detailItems.map((item, index) => {
          const Icon = item.icon;
          const isCopied = copiedField === item.id;

          return (
            <motion.div
              key={item.id}
              initial={{ opacity: 0, x: -10 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.5 + index * 0.05 }}
              className="group flex items-center justify-between py-3 border-b border-white/5 last:border-0"
            >
              <div className="flex items-center gap-3">
                <div className="w-8 h-8 rounded-lg bg-white/5 flex items-center justify-center">
                  <Icon className={`w-4 h-4 ${item.statusColor || 'text-slate-500'}`} />
                </div>
                <span className="text-sm text-slate-400">{item.label}</span>
              </div>

              <div className="flex items-center gap-2">
                <span
                  className={`text-sm ${item.statusColor || 'text-slate-200'} ${
                    item.mono ? 'font-mono text-xs' : ''
                  }`}
                >
                  {item.displayValue}
                </span>

                {item.copyable && (
                  <button
                    onClick={() => handleCopy(item.value, item.id)}
                    className="p-1.5 rounded-md opacity-0 group-hover:opacity-100 hover:bg-white/10 transition-all"
                    title="Copy to clipboard"
                  >
                    {isCopied ? (
                      <Check className="w-3.5 h-3.5 text-green-400" />
                    ) : (
                      <Copy className="w-3.5 h-3.5 text-slate-500" />
                    )}
                  </button>
                )}
              </div>
            </motion.div>
          );
        })}
      </div>

      {/* Next billing notice */}
      {subscription?.nextBillingDate && (
        <div className="mt-4 pt-4 border-t border-white/5">
          <div className="flex items-center gap-2 text-xs text-slate-500">
            <Calendar className="w-3.5 h-3.5" />
            <span>
              Next billing:{' '}
              {new Date(subscription.nextBillingDate).toLocaleDateString('en-US', {
                month: 'long',
                day: 'numeric',
                year: 'numeric'
              })}
            </span>
          </div>
        </div>
      )}
    </motion.div>
  );
}
