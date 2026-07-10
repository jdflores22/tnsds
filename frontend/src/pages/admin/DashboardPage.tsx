import { Link } from 'react-router-dom';
import {
  ArrowRight,
  Briefcase,
  FileWarning,
  FolderKanban,
  Inbox,
  Mail,
  Newspaper,
  Package,
  Settings,
  Sparkles,
  Wrench,
} from 'lucide-react';
import {
  useAdminBlogs,
  useAdminPortfolio,
  useAdminServices,
  useDashboardStats,
  useMessages,
} from '@/api/hooks';
import { MessageStatus } from '@/types';
import { AdminCard, AdminCardBody } from '@/components/admin/AdminCard';
import { AdminPageHeader } from '@/components/admin/AdminPageHeader';
import { AdminStatCard } from '@/components/admin/AdminStatCard';
import { Badge } from '@/components/ui/Badge';
import { useAuthStore } from '@/store/authStore';
import { PageLoader } from '@/components/ui/Spinner';

const statCards = [
  {
    key: 'totalProjects',
    label: 'Projects',
    icon: FolderKanban,
    href: '/admin/projects',
    accent: 'navy' as const,
  },
  {
    key: 'totalServices',
    label: 'Services',
    icon: Wrench,
    href: '/admin/services',
    accent: 'gold' as const,
  },
  {
    key: 'totalPortfolio',
    label: 'Portfolio',
    icon: Briefcase,
    href: '/admin/portfolio',
    accent: 'navy' as const,
  },
  {
    key: 'unreadMessages',
    label: 'Unread messages',
    icon: Mail,
    href: '/admin/messages',
    accent: 'red' as const,
  },
  {
    key: 'totalBlogs',
    label: 'Blog posts',
    icon: Newspaper,
    href: '/admin/blog',
    accent: 'gold' as const,
  },
] as const;

const quickLinks = [
  { label: 'Software products', href: '/admin/products', icon: Package, desc: 'ECMS, CRM, ERP & more' },
  { label: 'Site settings', href: '/admin/settings', icon: Settings, desc: 'Branding & content' },
  { label: 'Messages inbox', href: '/admin/messages', icon: Mail, desc: 'Contact submissions' },
  { label: 'Portfolio', href: '/admin/portfolio', icon: Briefcase, desc: 'Client case studies' },
];

const messageStatusMeta: Record<MessageStatus, { label: string; variant: 'warning' | 'accent' | 'success' }> = {
  [MessageStatus.New]: { label: 'New', variant: 'warning' },
  [MessageStatus.InProgress]: { label: 'In progress', variant: 'accent' },
  [MessageStatus.Closed]: { label: 'Closed', variant: 'success' },
};

export default function DashboardPage() {
  const { data: stats, isLoading } = useDashboardStats();
  const { data: messages } = useMessages();
  const { data: blogs } = useAdminBlogs();
  const { data: services } = useAdminServices();
  const { data: portfolio } = useAdminPortfolio();
  const user = useAuthStore((s) => s.user);

  if (isLoading) return <PageLoader />;

  const recentMessages = [...(messages ?? [])]
    .sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime())
    .slice(0, 5);

  const drafts = [
    { label: 'Blog posts', href: '/admin/blog', count: (blogs ?? []).filter((b) => !b.isPublished).length },
    { label: 'Services', href: '/admin/services', count: (services ?? []).filter((s) => !s.isPublished).length },
    { label: 'Portfolio', href: '/admin/portfolio', count: (portfolio ?? []).filter((p) => !p.isPublished).length },
  ].filter((d) => d.count > 0);

  const displayStats = stats || {
    totalProjects: 0,
    totalServices: 0,
    totalPortfolio: 0,
    totalMessages: 0,
    totalBlogs: 0,
    totalCareers: 0,
    unreadMessages: 0,
  };

  const greeting = user?.firstName ? `Welcome back, ${user.firstName}` : 'Welcome back';
  const today = new Date().toLocaleDateString(undefined, {
    weekday: 'long',
    month: 'long',
    day: 'numeric',
  });

  return (
    <div>
      <div className="mb-8 overflow-hidden rounded-2xl border border-primary-800/40 bg-gradient-to-br from-primary-900 via-primary-900 to-primary-950 p-6 text-white shadow-sm sm:p-8">
        <div className="flex flex-col gap-5 sm:flex-row sm:items-center sm:justify-between">
          <div className="min-w-0">
            <div className="flex items-center gap-2 text-brand-gold-400">
              <Sparkles className="h-4 w-4" />
              <span className="text-[11px] font-semibold uppercase tracking-widest">
                {today}
              </span>
            </div>
            <h2 className="mt-2 text-2xl font-semibold tracking-tight sm:text-3xl">{greeting}</h2>
            <p className="mt-2 max-w-xl text-sm leading-relaxed text-slate-300">
              Manage your software development website — content, portfolio, and client inquiries
              all in one console.
            </p>
          </div>
          <a
            href="/"
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex shrink-0 items-center gap-2 rounded-lg bg-brand-gold-500 px-4 py-2.5 text-sm font-semibold text-primary-950 transition-colors hover:bg-brand-gold-400"
          >
            Preview live site
            <ArrowRight className="h-4 w-4" />
          </a>
        </div>
      </div>

      <AdminPageHeader
        title="Overview"
        description="At-a-glance metrics for your public website content."
        eyebrow="Analytics"
        className="mb-6"
      />

      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-5">
        {statCards.map(({ key, label, icon, href, accent }) => (
          <AdminStatCard
            key={key}
            label={label}
            value={displayStats[key as keyof typeof displayStats]}
            icon={icon}
            accent={accent}
            href={href}
          />
        ))}
      </div>

      <div className="mt-8 grid gap-6 lg:grid-cols-2">
        <AdminCard accent="navy">
          <AdminCardBody>
            <h2 className="text-base font-medium text-primary-900">Quick actions</h2>
            <p className="mt-1 text-sm text-slate-500">Common tasks for site administrators.</p>
            <ul className="mt-4 space-y-2">
              {quickLinks.map(({ label, href, icon: Icon, desc }) => (
                <li key={href}>
                  <Link
                    to={href}
                    className="group flex items-center justify-between rounded-lg border border-slate-100 px-4 py-3 transition-all hover:border-brand-gold-500/30 hover:bg-brand-gold-500/5"
                  >
                    <span className="flex items-center gap-3">
                      <span className="flex h-9 w-9 items-center justify-center rounded-lg bg-primary-50 text-primary-700 group-hover:bg-brand-gold-500/15 group-hover:text-brand-gold-600">
                        <Icon className="h-4 w-4" />
                      </span>
                      <span>
                        <span className="block text-sm font-medium text-primary-900">{label}</span>
                        <span className="block text-xs text-slate-400">{desc}</span>
                      </span>
                    </span>
                    <ArrowRight className="h-4 w-4 text-slate-300 transition-transform group-hover:translate-x-0.5 group-hover:text-brand-gold-500" />
                  </Link>
                </li>
              ))}
            </ul>
          </AdminCardBody>
        </AdminCard>

        <AdminCard accent="gold">
          <AdminCardBody>
            <div className="flex items-center justify-between">
              <h2 className="text-base font-medium text-primary-900">Recent messages</h2>
              <Link
                to="/admin/messages"
                className="inline-flex items-center gap-1 text-xs font-semibold text-brand-gold-600 hover:text-brand-gold-700"
              >
                View inbox
                <ArrowRight className="h-3.5 w-3.5" />
              </Link>
            </div>
            {recentMessages.length === 0 ? (
              <div className="mt-6 flex flex-col items-center gap-2 py-8 text-center">
                <Inbox className="h-8 w-8 text-slate-300" strokeWidth={1.5} />
                <p className="text-sm text-slate-400">No messages yet.</p>
              </div>
            ) : (
              <ul className="mt-4 space-y-2">
                {recentMessages.map((msg) => {
                  const meta = messageStatusMeta[msg.status];
                  return (
                    <li key={msg.id}>
                      <Link
                        to="/admin/messages"
                        className="group flex items-start justify-between gap-3 rounded-lg border border-slate-100 px-4 py-3 transition-all hover:border-brand-gold-500/30 hover:bg-brand-gold-500/5"
                      >
                        <span className="min-w-0">
                          <span className="block truncate text-sm font-medium text-primary-900">
                            {msg.name}
                          </span>
                          <span className="block truncate text-xs text-slate-400">
                            {msg.subject || msg.email}
                          </span>
                        </span>
                        <Badge variant={meta.variant} className="shrink-0">
                          {meta.label}
                        </Badge>
                      </Link>
                    </li>
                  );
                })}
              </ul>
            )}
          </AdminCardBody>
        </AdminCard>
      </div>

      {drafts.length > 0 && (
        <AdminCard accent="red" className="mt-6">
          <AdminCardBody>
            <div className="flex items-center gap-2 text-primary-900">
              <FileWarning className="h-4 w-4 text-brand-red-500" />
              <h2 className="text-base font-medium">Needs attention — unpublished drafts</h2>
            </div>
            <p className="mt-1 text-sm text-slate-500">
              These items exist but aren&apos;t visible on the public site yet.
            </p>
            <div className="mt-4 flex flex-wrap gap-3">
              {drafts.map((d) => (
                <Link
                  key={d.href}
                  to={d.href}
                  className="group inline-flex items-center gap-2 rounded-lg border border-slate-200 bg-white px-4 py-2.5 text-sm transition-all hover:border-brand-red-500/40 hover:bg-brand-red-500/5"
                >
                  <span className="flex h-6 min-w-6 items-center justify-center rounded-full bg-brand-red-500/10 px-1.5 text-xs font-bold text-brand-red-600">
                    {d.count}
                  </span>
                  <span className="font-medium text-primary-900">{d.label}</span>
                  <ArrowRight className="h-3.5 w-3.5 text-slate-300 transition-transform group-hover:translate-x-0.5 group-hover:text-brand-red-500" />
                </Link>
              ))}
            </div>
          </AdminCardBody>
        </AdminCard>
      )}

    </div>
  );
}
