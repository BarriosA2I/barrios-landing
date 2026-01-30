'use client';

import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  ListTodo,
  Clock,
  CheckCircle2,
  XCircle,
  Loader2,
  Mail,
  User,
  Building2,
  MessageSquare,
  ExternalLink,
  ChevronDown,
  ChevronUp,
  Play,
  Send,
  RefreshCw,
} from 'lucide-react';

interface CommercialRequest {
  id: string;
  brandName: string;
  product: string;
  targetAudience: string;
  tone: string;
  keyMessage: string;
  cta: string;
  clientEmail: string;
  clientName: string | null;
  status: 'PENDING' | 'IN_PROGRESS' | 'DELIVERED' | 'CANCELLED';
  priority: 'STANDARD' | 'RUSH';
  internalNotes: string | null;
  deliveryUrl: string | null;
  createdAt: string;
  deliveredAt: string | null;
  account?: { name: string } | null;
}

interface StatusCounts {
  PENDING: number;
  IN_PROGRESS: number;
  DELIVERED: number;
  CANCELLED: number;
}

// Glass Card Component
const GlassCard = ({ children, className = "" }: { children: React.ReactNode, className?: string }) => (
  <div className={`relative overflow-hidden rounded-2xl border border-white/10 bg-white/5 backdrop-blur-xl transition-all duration-300 hover:border-white/20 ${className}`}>
    {children}
  </div>
);

// Status Badge Component
const StatusBadge = ({ status }: { status: string }) => {
  const config: Record<string, { bg: string; text: string; icon: React.ReactNode }> = {
    PENDING: { bg: 'bg-amber-500/10', text: 'text-amber-400', icon: <Clock size={12} /> },
    IN_PROGRESS: { bg: 'bg-blue-500/10', text: 'text-blue-400', icon: <Play size={12} /> },
    DELIVERED: { bg: 'bg-emerald-500/10', text: 'text-emerald-400', icon: <CheckCircle2 size={12} /> },
    CANCELLED: { bg: 'bg-red-500/10', text: 'text-red-400', icon: <XCircle size={12} /> },
  };

  const { bg, text, icon } = config[status] || config.PENDING;

  return (
    <span className={`inline-flex items-center gap-1 rounded-full ${bg} px-2 py-0.5 text-[10px] font-bold uppercase ${text}`}>
      {icon}
      {status.replace('_', ' ')}
    </span>
  );
};

// Stat Card Component
const StatCard = ({
  label,
  value,
  icon: Icon,
  color = 'cyan',
}: {
  label: string;
  value: number;
  icon: React.ElementType;
  color?: 'cyan' | 'amber' | 'emerald' | 'red';
}) => {
  const colorMap = {
    cyan: 'text-[#00bfff]',
    amber: 'text-amber-400',
    emerald: 'text-emerald-400',
    red: 'text-red-400',
  };

  return (
    <GlassCard className="p-4">
      <div className="flex items-center justify-between">
        <div>
          <p className="text-xs text-slate-500 uppercase tracking-widest">{label}</p>
          <p className="text-2xl font-bold text-white mt-1">{value}</p>
        </div>
        <div className={`h-10 w-10 rounded-xl bg-white/5 border border-white/10 flex items-center justify-center ${colorMap[color]}`}>
          <Icon size={20} />
        </div>
      </div>
    </GlassCard>
  );
};

// Request Row Component
const RequestRow = ({
  request,
  isExpanded,
  onToggle,
  onUpdateStatus,
  isUpdating,
}: {
  request: CommercialRequest;
  isExpanded: boolean;
  onToggle: () => void;
  onUpdateStatus: (id: string, status: string, deliveryUrl?: string) => void;
  isUpdating: boolean;
}) => {
  const [deliveryUrl, setDeliveryUrl] = useState(request.deliveryUrl || '');
  const [notes, setNotes] = useState(request.internalNotes || '');

  const createdDate = new Date(request.createdAt).toLocaleDateString('en-US', {
    month: 'short',
    day: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
  });

  return (
    <div className="border-b border-white/5 last:border-b-0">
      {/* Main Row */}
      <div
        className="flex items-center gap-4 px-6 py-4 cursor-pointer hover:bg-white/[0.02] transition-colors"
        onClick={onToggle}
      >
        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-2">
            <h3 className="font-bold text-white truncate">{request.brandName}</h3>
            {request.priority === 'RUSH' && (
              <span className="text-[10px] font-bold uppercase bg-red-500/20 text-red-400 px-2 py-0.5 rounded-full">
                RUSH
              </span>
            )}
          </div>
          <p className="text-xs text-slate-500 truncate">{request.product}</p>
        </div>

        <div className="hidden md:block">
          <p className="text-sm text-white">{request.clientName || 'Anonymous'}</p>
          <p className="text-xs text-slate-500">{request.clientEmail}</p>
        </div>

        <div className="hidden lg:block text-xs text-slate-500">
          {createdDate}
        </div>

        <StatusBadge status={request.status} />

        <button className="text-slate-500 hover:text-white transition-colors">
          {isExpanded ? <ChevronUp size={16} /> : <ChevronDown size={16} />}
        </button>
      </div>

      {/* Expanded Details */}
      <AnimatePresence>
        {isExpanded && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: 'auto', opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            className="overflow-hidden"
          >
            <div className="px-6 pb-6 space-y-4 border-t border-white/5 pt-4 bg-white/[0.02]">
              {/* Client Info */}
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                <div>
                  <p className="text-[10px] text-slate-500 uppercase tracking-widest mb-1">Target Audience</p>
                  <p className="text-sm text-white">{request.targetAudience}</p>
                </div>
                <div>
                  <p className="text-[10px] text-slate-500 uppercase tracking-widest mb-1">Tone</p>
                  <p className="text-sm text-white capitalize">{request.tone}</p>
                </div>
                <div>
                  <p className="text-[10px] text-slate-500 uppercase tracking-widest mb-1">Key Message</p>
                  <p className="text-sm text-white">{request.keyMessage}</p>
                </div>
                <div>
                  <p className="text-[10px] text-slate-500 uppercase tracking-widest mb-1">CTA</p>
                  <p className="text-sm text-white">{request.cta}</p>
                </div>
              </div>

              {/* Contact Info */}
              <div className="flex items-center gap-4 text-sm">
                <span className="flex items-center gap-1 text-slate-400">
                  <User size={14} />
                  {request.clientName || 'No name'}
                </span>
                <a
                  href={`mailto:${request.clientEmail}`}
                  className="flex items-center gap-1 text-[#00bfff] hover:underline"
                  onClick={(e) => e.stopPropagation()}
                >
                  <Mail size={14} />
                  {request.clientEmail}
                </a>
              </div>

              {/* Actions */}
              {request.status !== 'DELIVERED' && request.status !== 'CANCELLED' && (
                <div className="space-y-3 pt-2">
                  {/* Delivery URL Input */}
                  <div>
                    <label className="text-[10px] text-slate-500 uppercase tracking-widest mb-1 block">
                      Delivery URL (Video Link)
                    </label>
                    <input
                      type="url"
                      value={deliveryUrl}
                      onChange={(e) => setDeliveryUrl(e.target.value)}
                      placeholder="https://..."
                      className="w-full px-3 py-2 rounded-lg bg-white/5 border border-white/10 text-white text-sm placeholder:text-slate-500 focus:outline-none focus:border-[#00bfff]"
                      onClick={(e) => e.stopPropagation()}
                    />
                  </div>

                  {/* Action Buttons */}
                  <div className="flex items-center gap-2">
                    {request.status === 'PENDING' && (
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          onUpdateStatus(request.id, 'IN_PROGRESS');
                        }}
                        disabled={isUpdating}
                        className="flex items-center gap-2 px-4 py-2 rounded-lg bg-blue-500/20 text-blue-400 text-sm font-bold hover:bg-blue-500/30 transition-colors disabled:opacity-50"
                      >
                        {isUpdating ? <Loader2 size={14} className="animate-spin" /> : <Play size={14} />}
                        Start Working
                      </button>
                    )}

                    {request.status === 'IN_PROGRESS' && (
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          onUpdateStatus(request.id, 'DELIVERED', deliveryUrl);
                        }}
                        disabled={isUpdating || !deliveryUrl}
                        className="flex items-center gap-2 px-4 py-2 rounded-lg bg-emerald-500/20 text-emerald-400 text-sm font-bold hover:bg-emerald-500/30 transition-colors disabled:opacity-50"
                      >
                        {isUpdating ? <Loader2 size={14} className="animate-spin" /> : <Send size={14} />}
                        Mark Delivered & Notify Client
                      </button>
                    )}

                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        onUpdateStatus(request.id, 'CANCELLED');
                      }}
                      disabled={isUpdating}
                      className="flex items-center gap-2 px-4 py-2 rounded-lg bg-red-500/10 text-red-400 text-sm hover:bg-red-500/20 transition-colors disabled:opacity-50"
                    >
                      <XCircle size={14} />
                      Cancel
                    </button>
                  </div>
                </div>
              )}

              {/* Delivered Info */}
              {request.status === 'DELIVERED' && request.deliveryUrl && (
                <div className="flex items-center gap-2">
                  <CheckCircle2 size={14} className="text-emerald-400" />
                  <span className="text-sm text-slate-400">Delivered:</span>
                  <a
                    href={request.deliveryUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-sm text-[#00bfff] hover:underline flex items-center gap-1"
                    onClick={(e) => e.stopPropagation()}
                  >
                    {request.deliveryUrl}
                    <ExternalLink size={12} />
                  </a>
                </div>
              )}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default function ProductionQueuePage() {
  const [requests, setRequests] = useState<CommercialRequest[]>([]);
  const [counts, setCounts] = useState<StatusCounts>({
    PENDING: 0,
    IN_PROGRESS: 0,
    DELIVERED: 0,
    CANCELLED: 0,
  });
  const [isLoading, setIsLoading] = useState(true);
  const [expandedId, setExpandedId] = useState<string | null>(null);
  const [updatingId, setUpdatingId] = useState<string | null>(null);
  const [filterStatus, setFilterStatus] = useState<string>('');

  // Fetch requests
  const fetchRequests = async () => {
    try {
      const params = new URLSearchParams();
      if (filterStatus) params.set('status', filterStatus);

      const res = await fetch(`/api/commercial-request?${params}`);
      const data = await res.json();

      if (data.requests) {
        setRequests(data.requests);
        setCounts(data.counts);
      }
    } catch (error) {
      console.error('Failed to fetch requests:', error);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchRequests();
  }, [filterStatus]);

  // Update request status
  const handleUpdateStatus = async (id: string, status: string, deliveryUrl?: string) => {
    setUpdatingId(id);
    try {
      const res = await fetch(`/api/commercial-request/${id}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ status, deliveryUrl }),
      });

      if (res.ok) {
        await fetchRequests();
        if (status === 'DELIVERED') {
          setExpandedId(null);
        }
      }
    } catch (error) {
      console.error('Failed to update request:', error);
    } finally {
      setUpdatingId(null);
    }
  };

  return (
    <div className="space-y-8">
      {/* Header */}
      <header className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
        <div>
          <h2 className="text-3xl font-black text-white uppercase tracking-tighter">
            Production <span className="text-[#00bfff]">Queue</span>
          </h2>
          <p className="text-slate-400">Manage commercial requests and deliveries</p>
        </div>

        <button
          onClick={() => {
            setIsLoading(true);
            fetchRequests();
          }}
          className="flex items-center gap-2 px-4 py-2 rounded-lg bg-white/5 border border-white/10 text-white text-sm hover:bg-white/10 transition-colors"
        >
          <RefreshCw size={14} className={isLoading ? 'animate-spin' : ''} />
          Refresh
        </button>
      </header>

      {/* Stats */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <StatCard label="Pending" value={counts.PENDING} icon={Clock} color="amber" />
        <StatCard label="In Progress" value={counts.IN_PROGRESS} icon={Play} color="cyan" />
        <StatCard label="Delivered" value={counts.DELIVERED} icon={CheckCircle2} color="emerald" />
        <StatCard label="Cancelled" value={counts.CANCELLED} icon={XCircle} color="red" />
      </div>

      {/* Filter */}
      <div className="flex items-center gap-2">
        <span className="text-xs text-slate-500 uppercase tracking-widest">Filter:</span>
        {['', 'PENDING', 'IN_PROGRESS', 'DELIVERED'].map((status) => (
          <button
            key={status}
            onClick={() => setFilterStatus(status)}
            className={`px-3 py-1 rounded-lg text-xs font-bold transition-colors ${
              filterStatus === status
                ? 'bg-[#00bfff] text-[#0B1220]'
                : 'bg-white/5 text-slate-400 hover:bg-white/10'
            }`}
          >
            {status || 'All'}
          </button>
        ))}
      </div>

      {/* Requests List */}
      <GlassCard>
        {isLoading ? (
          <div className="flex items-center justify-center py-12">
            <Loader2 size={24} className="animate-spin text-[#00bfff]" />
          </div>
        ) : requests.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-12 text-center">
            <ListTodo size={48} className="text-slate-600 mb-4" />
            <p className="text-slate-400">No requests found</p>
            <p className="text-xs text-slate-500 mt-1">
              Commercial requests will appear here when clients submit them
            </p>
          </div>
        ) : (
          <div>
            {/* Table Header */}
            <div className="hidden md:flex items-center gap-4 px-6 py-3 border-b border-white/10 bg-white/[0.02] text-[10px] font-bold uppercase tracking-widest text-slate-500">
              <div className="flex-1">Brand / Product</div>
              <div className="w-40">Client</div>
              <div className="w-28 hidden lg:block">Submitted</div>
              <div className="w-24">Status</div>
              <div className="w-8"></div>
            </div>

            {/* Requests */}
            {requests.map((request) => (
              <RequestRow
                key={request.id}
                request={request}
                isExpanded={expandedId === request.id}
                onToggle={() => setExpandedId(expandedId === request.id ? null : request.id)}
                onUpdateStatus={handleUpdateStatus}
                isUpdating={updatingId === request.id}
              />
            ))}
          </div>
        )}
      </GlassCard>
    </div>
  );
}
