import { cn } from '@/utils/cn';

export interface SpinnerProps {
  size?: 'sm' | 'md' | 'lg';
  className?: string;
}

const sizes = {
  sm: 'h-4 w-4 border-2',
  md: 'h-8 w-8 border-2',
  lg: 'h-12 w-12 border-3',
};

export function Spinner({ size = 'md', className }: SpinnerProps) {
  return (
    <div
      className={cn(
        'animate-spin rounded-full border-accent-500 border-t-transparent',
        sizes[size],
        className,
      )}
      role="status"
      aria-label="Loading"
    />
  );
}

export function PageLoader() {
  return (
    <div className="flex min-h-screen w-full flex-1 items-center justify-center px-4 py-16">
      <div className="flex flex-col items-center gap-4 rounded-xl border border-slate-200/80 bg-white px-10 py-8 shadow-sm">
        <Spinner size="lg" className="border-brand-gold-500" />
        <p className="text-xs font-medium uppercase tracking-wider text-slate-400">Loading</p>
      </div>
    </div>
  );
}
