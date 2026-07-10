import type { HTMLAttributes } from 'react';
import { cn } from '@/utils/cn';

const variants = {
  default: 'bg-primary-100 text-primary-800',
  accent: 'bg-brand-gold-500/15 text-brand-gold-700',
  success: 'bg-primary-100 text-primary-800',
  warning: 'bg-brand-gold-500/15 text-brand-gold-700',
  danger: 'bg-brand-red-500/10 text-brand-red-700',
} as const;

export interface BadgeProps extends HTMLAttributes<HTMLSpanElement> {
  variant?: keyof typeof variants;
}

export function Badge({ className, variant = 'default', children, ...props }: BadgeProps) {
  return (
    <span
      className={cn(
        'inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-medium',
        variants[variant],
        className,
      )}
      {...props}
    >
      {children}
    </span>
  );
}
