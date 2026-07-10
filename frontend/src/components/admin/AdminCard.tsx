import type { ReactNode } from 'react';
import { cn } from '@/utils/cn';

export type AdminCardAccent = 'none' | 'gold' | 'navy' | 'red';

const accentTop: Record<AdminCardAccent, string> = {
  none: '',
  gold: 'border-t-[3px] border-t-brand-gold-500',
  navy: 'border-t-[3px] border-t-primary-700',
  red: 'border-t-[3px] border-t-brand-red-500',
};

export function AdminCard({
  className,
  children,
  accent = 'none',
}: {
  className?: string;
  children: ReactNode;
  accent?: AdminCardAccent;
}) {
  return (
    <div
      className={cn(
        'overflow-hidden rounded-xl border border-slate-200/80 bg-white shadow-sm',
        accentTop[accent],
        className,
      )}
    >
      {children}
    </div>
  );
}

export function AdminCardHeader({
  className,
  children,
}: {
  className?: string;
  children: ReactNode;
}) {
  return (
    <div
      className={cn(
        'border-b border-slate-100 bg-slate-50/50 px-5 py-4 sm:px-6',
        className,
      )}
    >
      {children}
    </div>
  );
}

export function AdminCardBody({
  className,
  children,
}: {
  className?: string;
  children: ReactNode;
}) {
  return <div className={cn('p-5 sm:p-6', className)}>{children}</div>;
}

export function AdminCardToolbar({
  className,
  children,
}: {
  className?: string;
  children: ReactNode;
}) {
  return (
    <div
      className={cn(
        'flex flex-wrap items-center justify-between gap-3 border-b border-slate-100 px-5 py-3 sm:px-6',
        className,
      )}
    >
      {children}
    </div>
  );
}
