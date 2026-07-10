import { cn } from '@/utils/cn';

interface TechBackgroundProps {
  className?: string;
  /** grid | scan | nodes | full */
  intensity?: 'subtle' | 'medium' | 'strong';
  showGrid?: boolean;
  showScan?: boolean;
  showNodes?: boolean;
  showHex?: boolean;
}

const nodePositions = [
  { top: '12%', left: '8%', delay: '0s' },
  { top: '28%', left: '72%', delay: '1.2s' },
  { top: '55%', left: '18%', delay: '2.4s' },
  { top: '68%', left: '85%', delay: '0.8s' },
  { top: '82%', left: '42%', delay: '1.8s' },
  { top: '38%', left: '48%', delay: '3s' },
];

export function TechBackground({
  className,
  intensity = 'medium',
  showGrid = true,
  showScan = true,
  showNodes = true,
  showHex = false,
}: TechBackgroundProps) {
  const opacity =
    intensity === 'subtle' ? 'opacity-40' : intensity === 'strong' ? 'opacity-100' : 'opacity-70';

  return (
    <div
      className={cn('pointer-events-none absolute inset-0 overflow-hidden', opacity, className)}
      aria-hidden
    >
      {showGrid && <div className="tech-grid-animated absolute inset-0" />}

      {showScan && (
        <div className="tech-scan-line absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-brand-gold-400/60 to-transparent shadow-[0_0_12px_rgba(212,160,23,0.35)]" />
      )}

      {showNodes && (
        <svg className="absolute inset-0 h-full w-full" xmlns="http://www.w3.org/2000/svg">
          <defs>
            <linearGradient id="tech-line-grad" x1="0%" y1="0%" x2="100%" y2="100%">
              <stop offset="0%" stopColor="rgba(212,160,23,0.35)" />
              <stop offset="100%" stopColor="rgba(61,111,150,0.2)" />
            </linearGradient>
          </defs>
          <line x1="8%" y1="12%" x2="48%" y2="38%" stroke="url(#tech-line-grad)" strokeWidth="1" className="tech-line-pulse" />
          <line x1="48%" y1="38%" x2="72%" y2="28%" stroke="url(#tech-line-grad)" strokeWidth="1" className="tech-line-pulse" style={{ animationDelay: '1s' }} />
          <line x1="18%" y1="55%" x2="42%" y2="82%" stroke="url(#tech-line-grad)" strokeWidth="1" className="tech-line-pulse" style={{ animationDelay: '2s' }} />
          <line x1="72%" y1="28%" x2="85%" y2="68%" stroke="url(#tech-line-grad)" strokeWidth="1" className="tech-line-pulse" style={{ animationDelay: '0.5s' }} />
        </svg>
      )}

      {showNodes &&
        nodePositions.map((node, i) => (
          <span
            key={i}
            className="tech-node absolute h-2 w-2 rounded-full bg-brand-gold-400/80 shadow-[0_0_8px_rgba(212,160,23,0.6)]"
            style={{ top: node.top, left: node.left, animationDelay: node.delay }}
          />
        ))}

      {showHex && (
        <>
          <div className="tech-hex-float absolute -right-8 top-16 h-24 w-24 border border-white/10" style={{ animationDelay: '0s' }} />
          <div className="tech-hex-float absolute bottom-24 left-12 h-16 w-16 border border-brand-gold-400/20" style={{ animationDelay: '2s' }} />
        </>
      )}

      <div className="absolute inset-0 bg-gradient-to-b from-transparent via-transparent to-primary-950/30" />
    </div>
  );
}

interface TechSectionMeshProps {
  className?: string;
  variant?: 'light' | 'dark';
}

/** Subtle animated mesh for light sections */
export function TechSectionMesh({ className, variant = 'light' }: TechSectionMeshProps) {
  return (
    <div
      className={cn(
        'pointer-events-none absolute inset-0 overflow-hidden',
        variant === 'light' ? 'tech-mesh-light' : 'tech-mesh-dark',
        className,
      )}
      aria-hidden
    />
  );
}
