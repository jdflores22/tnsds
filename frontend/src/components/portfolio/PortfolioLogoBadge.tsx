import { resolveMediaUrl } from '@/utils/media';
import { cn } from '@/utils/cn';

interface PortfolioLogoBadgeProps {
  logoUrl?: string;
  title: string;
  className?: string;
  size?: 'sm' | 'md' | 'lg';
}

const sizes = {
  sm: 'h-10 w-10 p-1',
  md: 'h-12 w-12 p-1.5',
  lg: 'h-16 w-16 p-2',
};

export function PortfolioLogoBadge({
  logoUrl,
  title,
  className,
  size = 'md',
}: PortfolioLogoBadgeProps) {
  const src = logoUrl ? resolveMediaUrl(logoUrl) : '';
  if (!src) return null;

  return (
    <div
      className={cn(
        'absolute bottom-3 left-3 flex items-center justify-center rounded-lg bg-white shadow-md ring-1 ring-slate-200/80',
        sizes[size],
        className,
      )}
    >
      <img src={src} alt={`${title} logo`} className="max-h-full max-w-full object-contain" />
    </div>
  );
}
