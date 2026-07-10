import { Link, NavLink } from 'react-router-dom';
import { Code2, ExternalLink, LogOut, X } from 'lucide-react';
import { adminNavGroups } from '@/constants/navigation';
import { useAuth } from '@/api/hooks';
import { useAuthStore } from '@/store/authStore';
import { CompanyLogoImage } from '@/components/common/CompanyLogoImage';
import { resolveMediaUrl } from '@/utils/media';
import { cn } from '@/utils/cn';

export interface AdminSidebarProps {
  onNavigate?: () => void;
}

export function AdminSidebar({ onNavigate }: AdminSidebarProps) {
  const { logoutMutation } = useAuth();
  const user = useAuthStore((s) => s.user);

  return (
    <aside className="admin-sidebar-bg flex h-full w-[17.5rem] flex-col text-white">
      <div className="border-b border-white/10 px-5 py-5">
        <Link to="/admin" className="flex items-center gap-3" onClick={onNavigate}>
          <CompanyLogoImage
            src={resolveMediaUrl('/logo.png')}
            alt="TRANS-NET"
            size="sm"
            mediaHint="png"
          />
          <div className="min-w-0 leading-tight">
            <span className="block truncate text-sm font-medium">TRANS-NET</span>
            <span className="mt-0.5 flex items-center gap-1 text-[10px] uppercase tracking-wider text-brand-gold-400/90">
              <Code2 className="h-3 w-3" />
              CMS Console
            </span>
          </div>
        </Link>
        <p className="mt-3 text-[11px] leading-relaxed text-slate-500">
          Software development services — content & site management
        </p>
      </div>

      <nav className="flex-1 space-y-6 overflow-y-auto px-3 py-4">
        {adminNavGroups.map((group) => (
          <div key={group.label}>
            <p className="mb-2 px-3 text-[10px] font-medium uppercase tracking-widest text-slate-500">
              {group.label}
            </p>
            <ul className="space-y-0.5">
              {group.links.map((link) => (
                <li key={link.href}>
                  <NavLink
                    to={link.href}
                    end={link.href === '/admin'}
                    onClick={onNavigate}
                    className={({ isActive }) =>
                      cn(
                        'group relative flex items-center gap-3 rounded-lg px-3 py-2.5 text-sm font-medium transition-all',
                        isActive
                          ? 'bg-brand-gold-500/10 text-brand-gold-400'
                          : 'text-slate-400 hover:bg-white/5 hover:text-white',
                      )
                    }
                  >
                    {({ isActive }) => (
                      <>
                        {isActive && (
                          <span className="absolute left-0 top-1/2 h-6 w-0.5 -translate-y-1/2 rounded-full bg-brand-gold-500" />
                        )}
                        <link.icon
                          className={cn(
                            'h-4 w-4 shrink-0',
                            isActive ? 'text-brand-gold-400' : 'opacity-70 group-hover:opacity-100',
                          )}
                        />
                        {link.label}
                      </>
                    )}
                  </NavLink>
                </li>
              ))}
            </ul>
          </div>
        ))}
      </nav>

      <div className="space-y-2 border-t border-white/10 p-4">
        {user && (
          <div className="mb-2 rounded-lg border border-white/10 bg-white/5 px-3 py-2.5">
            <p className="truncate text-xs font-medium text-white">
              {user.firstName} {user.lastName}
            </p>
            <p className="truncate text-[10px] text-slate-500">{user.email}</p>
          </div>
        )}
        <a
          href="/"
          target="_blank"
          rel="noopener noreferrer"
          className="flex items-center gap-2 rounded-lg px-3 py-2 text-sm text-slate-400 transition-colors hover:bg-white/5 hover:text-white"
        >
          <ExternalLink className="h-4 w-4" />
          View website
        </a>
        <button
          type="button"
          onClick={() => logoutMutation.mutate()}
          className="flex w-full items-center gap-2 rounded-lg px-3 py-2 text-sm text-slate-400 transition-colors hover:bg-brand-red-500/10 hover:text-brand-red-400"
        >
          <LogOut className="h-4 w-4" />
          Sign out
        </button>
      </div>
    </aside>
  );
}

export interface MobileAdminSidebarProps {
  isOpen: boolean;
  onClose: () => void;
}

export function MobileAdminSidebar({ isOpen, onClose }: MobileAdminSidebarProps) {
  if (!isOpen) return null;
  return (
    <div className="fixed inset-0 z-50 lg:hidden">
      <div className="absolute inset-0 bg-primary-950/70 backdrop-blur-sm" onClick={onClose} />
      <div className="relative h-full w-[17.5rem] shadow-2xl">
        <button
          type="button"
          className="absolute right-3 top-3 z-10 rounded-lg p-2 text-white/80 hover:bg-white/10"
          onClick={onClose}
          aria-label="Close sidebar"
        >
          <X className="h-5 w-5" />
        </button>
        <AdminSidebar onNavigate={onClose} />
      </div>
    </div>
  );
}
