import type { LucideIcon } from 'lucide-react';
import type { ReactNode } from 'react';
import { cn } from '@/utils/cn';

interface SettingsPanelProps {
  icon?: LucideIcon;
  title: string;
  description?: string;
  children: ReactNode;
  footer?: ReactNode;
  className?: string;
}

export function SettingsPanel({
  icon: Icon,
  title,
  description,
  children,
  footer,
  className,
}: SettingsPanelProps) {
  return (
    <section
      className={cn(
        'overflow-hidden rounded-xl border border-slate-200/80 bg-white shadow-sm',
        'border-t-[3px] border-t-primary-700',
        className,
      )}
    >
      <div className="border-b border-slate-100 bg-gradient-to-r from-slate-50/80 to-primary-50/30 px-5 py-4 sm:px-6">
        <div className="flex items-start gap-3">
          {Icon && (
            <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-primary-900 text-brand-gold-400">
              <Icon className="h-4 w-4" />
            </div>
          )}
          <div>
            <h2 className="text-sm font-medium text-primary-900">{title}</h2>
            {description && <p className="mt-0.5 text-sm text-slate-500">{description}</p>}
          </div>
        </div>
      </div>
      <div className="px-5 py-5 sm:px-6">{children}</div>
      {footer && (
        <div className="flex flex-wrap items-center gap-3 border-t border-slate-100 bg-slate-50/80 px-5 py-4 sm:px-6">
          {footer}
        </div>
      )}
    </section>
  );
}

interface SaveFeedbackProps {
  saved: boolean;
  isSaving: boolean;
  label?: string;
}

export function SaveFeedback({ saved, isSaving, label = 'Changes saved.' }: SaveFeedbackProps) {
  if (isSaving || !saved) return null;
  return (
    <span className="inline-flex items-center gap-1.5 text-sm text-primary-700">
      <span className="h-1.5 w-1.5 rounded-full bg-brand-gold-500" />
      {label}
    </span>
  );
}
