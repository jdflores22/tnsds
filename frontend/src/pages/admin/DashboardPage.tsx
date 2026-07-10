import { Link } from 'react-router-dom';
import {
  ArrowRight,
  Briefcase,
  FolderKanban,
  Mail,
  Newspaper,
  Package,
  Settings,
  Sparkles,
  Wrench,
} from 'lucide-react';
import { useDashboardStats } from '@/api/hooks';
import { AdminCard, AdminCardBody } from '@/components/admin/AdminCard';
import { AdminPageHeader } from '@/components/admin/AdminPageHeader';
import { AdminStatCard } from '@/components/admin/AdminStatCard';
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

export default function DashboardPage() {
  const { data: stats, isLoading } = useDashboardStats();
  const user = useAuthStore((s) => s.user);

  if (isLoading) return <PageLoader />;

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

  return (
    <div>
      <AdminCard accent="gold" className="mb-8">
        <AdminCardBody className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <div className="flex items-center gap-2 text-brand-gold-600">
              <Sparkles className="h-4 w-4" />
              <span className="text-[11px] font-medium uppercase tracking-wider">CMS Dashboard</span>
            </div>
            <h2 className="mt-2 text-xl font-medium text-primary-900 sm:text-2xl">{greeting}</h2>
            <p className="mt-1 max-w-xl text-sm text-slate-500">
              Manage your software development services website — content, portfolio, and client
              inquiries in one place.
            </p>
          </div>
          <a
            href="/"
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex shrink-0 items-center gap-2 rounded-lg border border-primary-200 bg-primary-50 px-4 py-2.5 text-sm font-medium text-primary-800 transition-colors hover:border-brand-gold-500/40 hover:bg-brand-gold-500/10"
          >
            Preview live site
            <ArrowRight className="h-4 w-4" />
          </a>
        </AdminCardBody>
      </AdminCard>

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

        <AdminCard>
          <AdminCardBody>
            <h2 className="text-base font-medium text-primary-900">Publishing checklist</h2>
            <ul className="mt-4 space-y-3 text-sm text-slate-600">
              <li className="flex gap-3 rounded-lg border border-slate-100 bg-slate-50/80 px-4 py-3">
                <span className="mt-0.5 text-brand-gold-500">✓</span>
                <span>
                  Mark items as <strong className="font-medium text-primary-800">Published</strong>{' '}
                  to show them on the public site.
                </span>
              </li>
              <li className="flex gap-3 rounded-lg border border-slate-100 bg-slate-50/80 px-4 py-3">
                <span className="mt-0.5 text-brand-gold-500">✓</span>
                <span>
                  Update branding under{' '}
                  <Link to="/admin/settings" className="font-medium text-primary-800 hover:underline">
                    Settings → Branding
                  </Link>
                  .
                </span>
              </li>
              <li className="flex gap-3 rounded-lg border border-slate-100 bg-slate-50/80 px-4 py-3">
                <span className="mt-0.5 text-brand-gold-500">✓</span>
                <span>
                  Manage software products (ECMS, CRM) under{' '}
                  <Link to="/admin/products" className="font-medium text-primary-800 hover:underline">
                    Products
                  </Link>
                  — use Portfolio for client case studies.
                </span>
              </li>
            </ul>
          </AdminCardBody>
        </AdminCard>
      </div>
    </div>
  );
}
