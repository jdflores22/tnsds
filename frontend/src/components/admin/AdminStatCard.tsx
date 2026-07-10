import type { LucideIcon } from 'lucide-react';
import type { ReactNode } from 'react';
import { Link } from 'react-router-dom';
import { cn } from '@/utils/cn';

type Accent = 'navy' | 'gold' | 'red' | 'neutral';

const accents: Record<Accent, { icon: string; value: string }> = {
  navy: { icon: 'bg-primary-100 text-primary-700', value: 'text-primary-900' },
  gold: { icon: 'bg-brand-gold-500/15 text-brand-gold-600', value: 'text-brand-gold-600' },
  red: { icon: 'bg-brand-red-500/10 text-brand-red-600', value: 'text-brand-red-600' },
  neutral: { icon: 'bg-slate-100 text-slate-600', value: 'text-primary-900' },
};

interface AdminStatCardProps {
  label: string;
  value: ReactNode;
  icon?: LucideIcon;
  accent?: Accent;
  href?: string;
  className?: string;
}

export function AdminStatCard({
  label,
  value,
  icon: Icon,
  accent = 'neutral',
  href,
  className,
}: AdminStatCardProps) {
  const style = accents[accent];

  const inner = (
    <div
      className={cn(
        'rounded-xl border border-slate-200/80 bg-white p-5 shadow-sm transition-all',
        href && 'hover:border-brand-gold-500/30 hover:shadow-md',
        className,
      )}
    >
      <div className="flex items-start justify-between gap-3">
        <div className="min-w-0">
          <p className="text-[11px] font-medium uppercase tracking-wider text-slate-400">
            {label}
          </p>
          <p className={cn('mt-2 text-2xl font-medium tabular-nums sm:text-3xl', style.value)}>
            {value}
          </p>
        </div>
        {Icon && (
          <div
            className={cn(
              'flex h-10 w-10 shrink-0 items-center justify-center rounded-xl',
              style.icon,
            )}
          >
            <Icon className="h-5 w-5" strokeWidth={1.5} />
          </div>
        )}
      </div>
    </div>
  );

  if (href) {
    return (
      <Link to={href} className="block">
        {inner}
      </Link>
    );
  }

  return inner;
}
