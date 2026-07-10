import { motion } from 'framer-motion';
import type { ProcessStep } from '@/types';
import { cn } from '@/utils/cn';

interface ProcessRoadmapProps {
  steps: ProcessStep[];
  className?: string;
  variant?: 'light' | 'dark';
}

export function ProcessRoadmap({ steps, className, variant = 'light' }: ProcessRoadmapProps) {
  const isDark = variant === 'dark';

  if (steps.length === 0) return null;

  return (
    <div className={cn('w-full', className)}>
      {/* Desktop: horizontal roadmap */}
      <div className="hidden lg:block">
        <div className="relative">
          <div
            className={cn(
              'absolute left-[8%] right-[8%] top-6 h-0.5',
              isDark
                ? 'bg-gradient-to-r from-primary-700 via-brand-gold-500 to-primary-700'
                : 'bg-gradient-to-r from-primary-200 via-brand-gold-400 to-primary-200',
            )}
            aria-hidden
          />

          <ol
            className="grid gap-6"
            style={{ gridTemplateColumns: `repeat(${steps.length}, minmax(0, 1fr))` }}
          >
            {steps.map((step, index) => (
              <motion.li
                key={step.id}
                initial={{ opacity: 0, y: 16 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: index * 0.07 }}
                className="relative flex flex-col items-center text-center"
              >
                <div
                  className={cn(
                    'relative z-10 flex h-12 w-12 items-center justify-center rounded-full border-2 text-xs font-bold tabular-nums',
                    isDark
                      ? 'border-brand-gold-500 bg-primary-900 text-brand-gold-400'
                      : 'border-brand-gold-500 bg-white text-primary-900 shadow-sm',
                  )}
                >
                  {step.stepLabel}
                </div>

                <div
                  className={cn(
                    'mt-6 w-full rounded-xl border p-4',
                    isDark
                      ? 'border-white/10 bg-white/5'
                      : 'border-slate-200 bg-white sm-card',
                  )}
                >
                  <h3
                    className={cn(
                      'text-sm font-semibold uppercase tracking-wide',
                      isDark ? 'text-white' : 'text-primary-900',
                    )}
                  >
                    {step.title}
                  </h3>
                  <p
                    className={cn(
                      'mt-2 text-sm leading-relaxed',
                      isDark ? 'text-slate-300' : 'text-slate-600',
                    )}
                  >
                    {step.description}
                  </p>
                </div>
              </motion.li>
            ))}
          </ol>
        </div>
      </div>

      {/* Mobile / tablet: vertical roadmap */}
      <ol className="relative space-y-0 lg:hidden">
        <div
          className={cn(
            'absolute bottom-4 left-[1.375rem] top-4 w-0.5',
            isDark
              ? 'bg-gradient-to-b from-primary-700 via-brand-gold-500 to-primary-700'
              : 'bg-gradient-to-b from-primary-200 via-brand-gold-400 to-primary-200',
          )}
          aria-hidden
        />

        {steps.map((step, index) => (
          <motion.li
            key={step.id}
            initial={{ opacity: 0, x: -12 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ delay: index * 0.06 }}
            className="relative flex gap-5 pb-10 last:pb-0"
          >
            <div
              className={cn(
                'relative z-10 mt-0.5 flex h-11 w-11 shrink-0 items-center justify-center rounded-full border-2 text-xs font-bold tabular-nums',
                isDark
                  ? 'border-brand-gold-500 bg-primary-900 text-brand-gold-400'
                  : 'border-brand-gold-500 bg-white text-primary-900 shadow-sm',
              )}
            >
              {step.stepLabel}
            </div>

            <div
              className={cn(
                'flex-1 rounded-xl border p-4',
                isDark ? 'border-white/10 bg-white/5' : 'border-slate-200 bg-white sm-card',
              )}
            >
              <h3
                className={cn(
                  'text-sm font-semibold uppercase tracking-wide',
                  isDark ? 'text-white' : 'text-primary-900',
                )}
              >
                {step.title}
              </h3>
              <p
                className={cn(
                  'mt-2 text-sm leading-relaxed',
                  isDark ? 'text-slate-300' : 'text-slate-600',
                )}
              >
                {step.description}
              </p>
            </div>
          </motion.li>
        ))}
      </ol>
    </div>
  );
}
