import { Link, useLocation } from 'react-router-dom';
import { ChevronRight, ExternalLink, Menu, Terminal } from 'lucide-react';
import { adminPageTitles } from '@/constants/navigation';
import { useAuthStore } from '@/store/authStore';

interface AdminTopBarProps {
  onMenuClick?: () => void;
}

export function AdminTopBar({ onMenuClick }: AdminTopBarProps) {
  const { pathname } = useLocation();
  const user = useAuthStore((s) => s.user);

  const pageTitle = adminPageTitles[pathname] ?? 'Admin';
  const isDashboard = pathname === '/admin';

  return (
    <header className="sticky top-0 z-30 shrink-0 border-b border-slate-200/80 bg-white/90 backdrop-blur-md">
      <div className="flex h-14 items-center justify-between gap-4 px-4 sm:px-6">
        <div className="flex min-w-0 items-center gap-3">
          <button
            type="button"
            onClick={onMenuClick}
            className="rounded-lg p-2 text-slate-600 transition-colors hover:bg-slate-100 lg:hidden"
            aria-label="Open menu"
          >
            <Menu className="h-5 w-5" />
          </button>

          <nav className="flex min-w-0 items-center gap-1.5 text-sm">
            <Link
              to="/admin"
              className="hidden items-center gap-1.5 text-slate-500 transition-colors hover:text-primary-800 sm:inline-flex"
            >
              <Terminal className="h-3.5 w-3.5 text-brand-gold-500" />
              CMS
            </Link>
            {!isDashboard && (
              <>
                <ChevronRight className="hidden h-4 w-4 shrink-0 text-slate-300 sm:block" />
                <span className="truncate font-medium text-primary-900">{pageTitle}</span>
              </>
            )}
            {isDashboard && (
              <span className="truncate font-medium text-primary-900 sm:hidden">Dashboard</span>
            )}
          </nav>
        </div>

        <div className="flex shrink-0 items-center gap-2 sm:gap-3">
          <span className="hidden rounded-full border border-primary-100 bg-primary-50 px-2.5 py-1 text-[10px] font-medium uppercase tracking-wider text-primary-700 md:inline">
            Dev CMS
          </span>
          <a
            href="/"
            target="_blank"
            rel="noopener noreferrer"
            className="hidden items-center gap-1.5 rounded-lg border border-slate-200 px-3 py-1.5 text-xs font-medium text-slate-600 transition-colors hover:border-brand-gold-500/40 hover:bg-brand-gold-500/5 hover:text-primary-800 sm:inline-flex"
          >
            View site
            <ExternalLink className="h-3.5 w-3.5" />
          </a>

          {user && (
            <div className="flex items-center gap-2 border-l border-slate-200 pl-2 sm:pl-3">
              <div className="hidden text-right sm:block">
                <p className="text-xs font-medium text-primary-900">
                  {user.firstName} {user.lastName}
                </p>
                <p className="text-[10px] uppercase tracking-wide text-slate-400">{user.role}</p>
              </div>
              <div className="flex h-8 w-8 items-center justify-center rounded-full bg-gradient-to-br from-primary-800 to-primary-900 text-xs font-medium text-brand-gold-400 ring-2 ring-brand-gold-500/20">
                {user.firstName?.[0]}
                {user.lastName?.[0]}
              </div>
            </div>
          )}
        </div>
      </div>
      <div className="h-0.5 bg-gradient-to-r from-brand-red-500 via-brand-gold-500 to-primary-700" />
    </header>
  );
}
