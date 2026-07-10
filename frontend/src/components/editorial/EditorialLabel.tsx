import type { ReactNode } from 'react';
import { cn } from '@/utils/cn';

interface EditorialLabelProps {
  children: ReactNode;
  className?: string;
  variant?: 'light' | 'dark' | 'muted';
}

export function EditorialLabel({ children, className, variant = 'muted' }: EditorialLabelProps) {
  return (
    <p
      className={cn(
        'font-mono text-xs uppercase tracking-[0.18em]',
        variant === 'light' && 'text-white/60',
        variant === 'dark' && 'text-primary-800/70',
        variant === 'muted' && 'text-slate-500',
        className,
      )}
    >
      <span className="text-brand-gold-500">—</span> {children}
    </p>
  );
}

interface SectionIndexProps {
  index: string;
  total?: string;
  className?: string;
}

export function SectionIndex({ index, total, className }: SectionIndexProps) {
  return (
    <span className={cn('font-mono text-sm tabular-nums text-brand-gold-500', className)}>
      {index}
      {total && <span className="text-slate-400"> / {total}</span>}
    </span>
  );
}
