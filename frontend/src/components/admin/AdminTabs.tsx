import type { LucideIcon } from 'lucide-react';
import { cn } from '@/utils/cn';

export interface AdminTabItem<T extends string = string> {
  id: T;
  label: string;
  icon?: LucideIcon;
}

interface AdminTabsProps<T extends string> {
  tabs: readonly AdminTabItem<T>[];
  active: T;
  onChange: (id: T) => void;
  className?: string;
}

export function AdminTabs<T extends string>({
  tabs,
  active,
  onChange,
  className,
}: AdminTabsProps<T>) {
  return (
    <div
      className={cn(
        'inline-flex flex-wrap gap-1 rounded-xl border border-slate-200/80 bg-white p-1 shadow-sm',
        className,
      )}
    >
      {tabs.map(({ id, label, icon: Icon }) => (
        <button
          key={id}
          type="button"
          onClick={() => onChange(id)}
          className={cn(
            'inline-flex items-center gap-2 rounded-lg px-4 py-2 text-sm font-medium transition-all',
            active === id
              ? 'bg-primary-900 text-white shadow-sm ring-1 ring-primary-800'
              : 'text-slate-600 hover:bg-slate-50 hover:text-primary-900',
          )}
        >
          {Icon && <Icon className="h-4 w-4 shrink-0 opacity-90" />}
          {label}
        </button>
      ))}
    </div>
  );
}
