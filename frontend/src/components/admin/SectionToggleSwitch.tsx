import { cn } from '@/utils/cn';

interface SectionToggleSwitchProps {
  enabled: boolean;
  disabled?: boolean;
  label: string;
  onToggle: () => void;
}

export function SectionToggleSwitch({ enabled, disabled, label, onToggle }: SectionToggleSwitchProps) {
  return (
    <button
      type="button"
      role="switch"
      aria-checked={enabled}
      aria-label={`${enabled ? 'Hide' : 'Show'} ${label} section`}
      disabled={disabled}
      onClick={onToggle}
      className={cn(
        'relative inline-flex h-8 w-14 shrink-0 cursor-pointer items-center rounded-full transition-colors focus:outline-none focus:ring-2 focus:ring-primary-500 focus:ring-offset-2 disabled:opacity-50',
        enabled ? 'bg-primary-700' : 'bg-slate-300',
      )}
    >
      <span
        className={cn(
          'inline-block h-6 w-6 transform rounded-full bg-white shadow transition-transform',
          enabled ? 'translate-x-7' : 'translate-x-1',
        )}
      />
    </button>
  );
}
