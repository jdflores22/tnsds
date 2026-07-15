import { useId, type ReactNode } from 'react';
import { cn } from '@/utils/cn';

/** Pointy-top regular hexagon — diagram vertices A→F. */
export const HEX_CLIP =
  'polygon(50% 0%, 100% 25%, 100% 75%, 50% 100%, 0% 75%, 0% 25%)';

const UNEVEN_HEX_PATH =
  'M50.4 1.8 L97.2 27.1 L98.6 85.4 L49.1 113.2 L2.4 87.6 L1.2 26.3 Z';

const CLEAN_HEX_PATH =
  'M50 2 L98 26.5 L98 88.5 L50 113 L2 88.5 L2 26.5 Z';

function withAlpha(hex: string, alpha: number) {
  const raw = hex.replace('#', '');
  if (raw.length !== 6) return hex;
  const r = Number.parseInt(raw.slice(0, 2), 16);
  const g = Number.parseInt(raw.slice(2, 4), 16);
  const b = Number.parseInt(raw.slice(4, 6), 16);
  return `rgba(${r},${g},${b},${alpha})`;
}

type HexagonBadgeProps = {
  children: ReactNode;
  className?: string;
  size?: 'sm' | 'md' | 'lg';
  fillClassName?: string;
  stroke?: string;
  isDark?: boolean;
  showUnevenStroke?: boolean;
};

const sizeClass = {
  sm: 'h-12 w-[42px]',
  md: 'h-16 w-[56px]',
  lg: 'h-20 w-[70px]',
} as const;

export function HexagonBadge({
  children,
  className,
  size = 'md',
  fillClassName,
  stroke = '#d4a017',
  isDark = false,
  showUnevenStroke = true,
}: HexagonBadgeProps) {
  const uid = useId();
  const filterId = `hex-badge-${uid.replace(/:/g, '')}`;

  return (
    <div className={cn('relative shrink-0', sizeClass[size], className)}>
      {showUnevenStroke && (
        <svg
          viewBox="0 0 100 115"
          className="pointer-events-none absolute inset-0 h-full w-full overflow-visible"
          aria-hidden
        >
          <defs>
            <filter id={filterId} x="-25%" y="-25%" width="150%" height="150%">
              <feGaussianBlur stdDeviation="0.8" result="blur" />
              <feMerge>
                <feMergeNode in="blur" />
                <feMergeNode in="SourceGraphic" />
              </feMerge>
            </filter>
          </defs>
          <path
            d={UNEVEN_HEX_PATH}
            fill="none"
            stroke={withAlpha(stroke, isDark ? 0.55 : 0.65)}
            strokeWidth="3"
            strokeLinejoin="round"
            strokeLinecap="round"
            vectorEffect="non-scaling-stroke"
            filter={`url(#${filterId})`}
            style={{ strokeDasharray: '10 4 2 4 7 3' }}
          />
          <path
            d={CLEAN_HEX_PATH}
            fill="none"
            stroke={withAlpha(stroke, isDark ? 0.9 : 0.95)}
            strokeWidth="1.6"
            strokeLinejoin="round"
            vectorEffect="non-scaling-stroke"
          />
        </svg>
      )}

      <div
        className={cn(
          'absolute inset-[7%] flex items-center justify-center overflow-hidden transition-colors duration-300',
          fillClassName,
        )}
        style={{ clipPath: HEX_CLIP }}
      >
        {children}
      </div>
    </div>
  );
}
