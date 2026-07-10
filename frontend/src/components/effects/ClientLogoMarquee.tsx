import { resolveMediaUrl } from '@/utils/media';
import { cn } from '@/utils/cn';

interface ClientLogoMarqueeProps {
  clients: { id: string; name: string; logoUrl?: string }[];
  className?: string;
  variant?: 'light' | 'dark';
}

export function ClientLogoMarquee({ clients, className, variant = 'light' }: ClientLogoMarqueeProps) {
  if (clients.length === 0) return null;

  const doubled = [...clients, ...clients];

  return (
    <div className={cn('relative overflow-hidden', className)} aria-hidden>
      <div
        className={cn(
          'pointer-events-none absolute inset-y-0 left-0 z-10 w-20 bg-gradient-to-r to-transparent',
          variant === 'dark' ? 'from-primary-900' : 'from-slate-50',
        )}
      />
      <div
        className={cn(
          'pointer-events-none absolute inset-y-0 right-0 z-10 w-20 bg-gradient-to-l to-transparent',
          variant === 'dark' ? 'from-primary-900' : 'from-slate-50',
        )}
      />

      <div className="tech-marquee-track-slow flex w-max items-center gap-10 py-2">
        {doubled.map((client, i) => (
          <div
            key={`${client.id}-${i}`}
            className={cn(
              'flex h-14 w-36 shrink-0 items-center justify-center rounded-lg border px-4 transition-all duration-300',
              variant === 'dark'
                ? 'border-white/10 bg-white/5 grayscale hover:grayscale-0'
                : 'border-slate-200/80 bg-white shadow-sm grayscale hover:grayscale-0 hover:shadow-md',
            )}
          >
            {client.logoUrl ? (
              <img
                src={resolveMediaUrl(client.logoUrl)}
                alt={client.name}
                className="max-h-8 max-w-full object-contain"
                loading="lazy"
              />
            ) : (
              <span className="text-xs font-medium text-primary-700">{client.name}</span>
            )}
          </div>
        ))}
      </div>
    </div>
  );
}
