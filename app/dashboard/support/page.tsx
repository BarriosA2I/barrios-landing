import { MessageSquare, Mail, FileText, ExternalLink, Clock, CheckCircle } from 'lucide-react';
import Link from 'next/link';

export const dynamic = 'force-dynamic';

const supportOptions = [
  {
    title: 'Live Chat',
    description: 'Chat with our AI-powered support assistant for instant help.',
    icon: MessageSquare,
    action: 'Start Chat',
    href: '#',
    available: true,
    responseTime: 'Instant',
  },
  {
    title: 'Email Support',
    description: 'Send us a detailed message and we\'ll respond within 24 hours.',
    icon: Mail,
    action: 'Send Email',
    href: 'mailto:support@barriosa2i.com',
    available: true,
    responseTime: '< 24 hours',
  },
  {
    title: 'Documentation',
    description: 'Browse our comprehensive guides and API documentation.',
    icon: FileText,
    action: 'View Docs',
    href: '/docs',
    available: true,
    responseTime: 'Self-service',
  },
];

const recentTickets = [
  {
    id: 'TKT-001',
    subject: 'API Integration Question',
    status: 'resolved',
    date: '2 days ago',
  },
  {
    id: 'TKT-002',
    subject: 'Billing Inquiry',
    status: 'open',
    date: '5 hours ago',
  },
];

export default function SupportPage() {
  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="space-y-2">
        <h1 className="text-3xl font-bold text-white">Support Center</h1>
        <p className="text-zinc-400">
          Get help with your account, billing, or technical questions.
        </p>
      </div>

      {/* Support Options */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {supportOptions.map((option) => (
          <div
            key={option.title}
            className="group relative p-6 rounded-lg border border-white/5 bg-[#141414] transition-all duration-300 hover:border-[#00CED1]/30 hover:shadow-[0_0_30px_rgba(0,206,209,0.1)]"
          >
            <div className="flex items-start justify-between mb-4">
              <div className="p-2 rounded-lg bg-[#00CED1]/10">
                <option.icon className="h-6 w-6 text-[#00CED1]" />
              </div>
              <div className="flex items-center gap-1 text-xs text-zinc-500">
                <Clock className="h-3 w-3" />
                {option.responseTime}
              </div>
            </div>
            <h3 className="text-lg font-semibold text-white mb-2">{option.title}</h3>
            <p className="text-sm text-zinc-400 mb-4">{option.description}</p>
            <Link
              href={option.href}
              className="inline-flex items-center gap-2 text-sm font-medium text-[#00CED1] transition-colors hover:text-[#00CED1]/80"
            >
              {option.action}
              <ExternalLink className="h-4 w-4" />
            </Link>
          </div>
        ))}
      </div>

      {/* Recent Tickets */}
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <h2 className="text-xl font-semibold text-white">Recent Tickets</h2>
          <button className="text-sm text-[#00CED1] hover:text-[#00CED1]/80 transition-colors">
            View All
          </button>
        </div>

        {recentTickets.length > 0 ? (
          <div className="rounded-lg border border-white/5 bg-[#141414] divide-y divide-white/5">
            {recentTickets.map((ticket) => (
              <div
                key={ticket.id}
                className="flex items-center justify-between p-4 hover:bg-white/[0.02] transition-colors"
              >
                <div className="flex items-center gap-4">
                  <span className="text-xs font-mono text-zinc-500">{ticket.id}</span>
                  <span className="text-sm text-white">{ticket.subject}</span>
                </div>
                <div className="flex items-center gap-4">
                  <span className="text-xs text-zinc-500">{ticket.date}</span>
                  <span
                    className={`inline-flex items-center gap-1 text-xs px-2 py-1 rounded-full ${
                      ticket.status === 'resolved'
                        ? 'bg-green-500/10 text-green-400'
                        : 'bg-yellow-500/10 text-yellow-400'
                    }`}
                  >
                    {ticket.status === 'resolved' && <CheckCircle className="h-3 w-3" />}
                    {ticket.status.charAt(0).toUpperCase() + ticket.status.slice(1)}
                  </span>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="p-8 rounded-lg border border-white/5 bg-[#141414] text-center">
            <p className="text-zinc-500">No support tickets yet.</p>
          </div>
        )}
      </div>

      {/* FAQ Section */}
      <div className="space-y-4">
        <h2 className="text-xl font-semibold text-white">Frequently Asked Questions</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {[
            { q: 'How do I upgrade my plan?', a: 'Go to Billing → Change Plan' },
            { q: 'Can I cancel anytime?', a: 'Yes, no long-term contracts' },
            { q: 'How do tokens work?', a: 'Tokens are consumed per video generation' },
            { q: 'What is NEXUS Personal?', a: 'A private AI assistant for your business' },
          ].map((faq, i) => (
            <div
              key={i}
              className="p-4 rounded-lg border border-white/5 bg-[#141414] hover:border-white/10 transition-colors"
            >
              <h4 className="text-sm font-medium text-white mb-1">{faq.q}</h4>
              <p className="text-sm text-zinc-500">{faq.a}</p>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
