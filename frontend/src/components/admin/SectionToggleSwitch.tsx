import { cn } from '@/utils/cn';

interface SectionToggleSwitchProps {
  enabled: boolean;
  disabled?: boolean;
  label: string;
  onToggle: () => void;
  size?: 'default' | 'sm';
}

const trackSizes = {
  default: 'h-8 w-14',
  sm: 'h-5 w-9',
} as const;

const thumbSizes = {
  default: 'h-6 w-6',
  sm: 'h-3.5 w-3.5',
} as const;

const thumbOn = {
  default: 'translate-x-7',
  sm: 'translate-x-5',
} as const;

const thumbOff = {
  default: 'translate-x-1',
  sm: 'translate-x-0.5',
} as const;

export function SectionToggleSwitch({
  enabled,
  disabled,
  label,
  onToggle,
  size = 'default',
}: SectionToggleSwitchProps) {
  return (
    <button
      type="button"
      role="switch"
      aria-checked={enabled}
      aria-label={`${enabled ? 'Hide' : 'Show'} ${label}`}
      disabled={disabled}
      onClick={onToggle}
      className={cn(
        'relative inline-flex shrink-0 cursor-pointer items-center rounded-full transition-colors focus:outline-none focus:ring-2 focus:ring-primary-500/30 focus:ring-offset-1 disabled:opacity-50',
        trackSizes[size],
        enabled ? 'bg-primary-700' : 'bg-slate-300',
        size === 'sm' && !enabled && 'bg-slate-200',
      )}
    >
      <span
        className={cn(
          'inline-block rounded-full bg-white shadow-sm transition-transform',
          thumbSizes[size],
          enabled ? thumbOn[size] : thumbOff[size],
        )}
      />
    </button>
  );
}
