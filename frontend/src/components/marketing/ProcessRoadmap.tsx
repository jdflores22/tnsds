import { motion } from 'framer-motion';
import type { ProcessStep } from '@/types';
import { HexagonBadge } from '@/components/marketing/HexagonBadge';
import { cn } from '@/utils/cn';

const GOLD_STROKE = '#d4a017';

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
      <ol
        className={cn(
          'grid gap-4 sm:grid-cols-2',
          steps.length <= 4 ? 'lg:grid-cols-4' : 'lg:grid-cols-3 xl:grid-cols-6',
        )}
      >
        {steps.map((step, index) => (
          <motion.li
            key={step.id}
            initial={{ opacity: 0, y: 16 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: index * 0.06, duration: 0.4 }}
            className={cn(
              'group relative flex h-full flex-col overflow-hidden rounded-2xl border p-6 transition-all duration-300',
              isDark
                ? 'border-white/10 bg-white/[0.03] hover:border-brand-gold-400/40 hover:bg-white/[0.06]'
                : 'border-slate-200 bg-white hover:-translate-y-1 hover:border-brand-gold-400/60 hover:shadow-[0_24px_50px_-30px_rgba(10,26,46,0.5)]',
            )}
          >
            <div className="mb-5">
              <HexagonBadge
                size="md"
                stroke={GOLD_STROKE}
                isDark={isDark}
                fillClassName={cn(
                  isDark
                    ? 'bg-white/[0.08] text-brand-gold-400 group-hover:bg-brand-gold-400/15'
                    : 'bg-brand-gold-500/10 text-brand-gold-600 group-hover:bg-brand-gold-500 group-hover:text-white',
                )}
              >
                <span className="text-sm font-bold tabular-nums transition-colors duration-300">
                  {step.stepLabel}
                </span>
              </HexagonBadge>
            </div>

            <h3
              className={cn(
                'text-lg font-semibold tracking-tight',
                isDark ? 'text-white' : 'text-primary-900',
              )}
            >
              {step.title}
            </h3>
            <p
              className={cn(
                'mt-2 flex-1 text-sm leading-relaxed',
                isDark ? 'text-slate-400' : 'text-slate-600',
              )}
            >
              {step.description}
            </p>

            <span className="mt-5 h-px w-full origin-left scale-x-0 bg-gradient-to-r from-brand-gold-500/70 to-transparent transition-transform duration-300 group-hover:scale-x-100" />
          </motion.li>
        ))}
      </ol>
    </div>
  );
}
