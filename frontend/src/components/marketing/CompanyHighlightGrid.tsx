import { motion } from 'framer-motion';
import type { CompanyHighlight } from '@/types';
import { cn } from '@/utils/cn';

function HighlightCard({
  item,
  displayIndex,
  isDark,
}: {
  item: CompanyHighlight;
  displayIndex: number;
  isDark: boolean;
}) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 16 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ delay: displayIndex * 0.05, duration: 0.4 }}
      className={cn(
        'group relative flex h-full flex-col overflow-hidden rounded-2xl border p-7 transition-all duration-300',
        isDark
          ? 'border-white/10 bg-white/[0.03] hover:border-brand-gold-400/40 hover:bg-white/[0.06]'
          : 'border-slate-200 bg-white hover:-translate-y-1 hover:border-brand-gold-400/60 hover:shadow-[0_24px_50px_-30px_rgba(10,26,46,0.5)]',
      )}
    >
      <span
        className={cn(
          'pointer-events-none absolute -right-2 -top-4 select-none text-7xl font-bold leading-none transition-colors',
          isDark ? 'text-white/[0.04]' : 'text-primary-900/[0.04]',
        )}
      >
        {String(displayIndex).padStart(2, '0')}
      </span>

      <span
        className={cn(
          'relative flex h-11 w-11 items-center justify-center rounded-xl text-base font-bold text-white shadow-sm',
          'bg-gradient-to-br from-primary-700 via-primary-800 to-primary-900',
        )}
      >
        {displayIndex}
        <span
          className={cn(
            'absolute -bottom-0.5 -right-0.5 h-3 w-3 rounded-full bg-brand-gold-500 ring-2 transition-transform duration-300 group-hover:scale-110',
            isDark ? 'ring-primary-900' : 'ring-white',
          )}
        />
      </span>

      <h3
        className={cn(
          'relative mt-5 text-lg font-semibold tracking-tight',
          isDark ? 'text-white' : 'text-primary-900',
        )}
      >
        {item.title}
      </h3>
      <p
        className={cn(
          'relative mt-2.5 text-sm leading-relaxed',
          isDark ? 'text-slate-400' : 'text-slate-600',
        )}
      >
        {item.description}
      </p>

      <span className="mt-6 h-px w-full origin-left scale-x-0 bg-gradient-to-r from-brand-gold-500/70 to-transparent transition-transform duration-300 group-hover:scale-x-100" />
    </motion.div>
  );
}

function HighlightRow({
  items,
  startIndex,
  isDark,
}: {
  items: CompanyHighlight[];
  startIndex: number;
  isDark: boolean;
}) {
  if (items.length === 0) return null;

  return (
    <div className="flex flex-wrap justify-center gap-5">
      {items.map((item, index) => (
        <div
          key={item.id}
          className="w-full max-w-md sm:w-[calc(50%-0.625rem)] sm:max-w-[calc(50%-0.625rem)] lg:w-[calc(33.333%-0.84rem)] lg:max-w-[calc(33.333%-0.84rem)]"
        >
          <HighlightCard item={item} displayIndex={startIndex + index + 1} isDark={isDark} />
        </div>
      ))}
    </div>
  );
}

export interface CompanyHighlightGridProps {
  highlights: CompanyHighlight[];
  isDark: boolean;
  useHomepageRows?: boolean;
}

export function CompanyHighlightGrid({
  highlights,
  isDark,
  useHomepageRows = true,
}: CompanyHighlightGridProps) {
  const sorted = [...highlights].sort((a, b) => a.sortOrder - b.sortOrder);

  if (useHomepageRows) {
    const row1 = sorted.filter((h) => (h.homepageRow ?? 1) === 1);
    const row2 = sorted.filter((h) => (h.homepageRow ?? 1) === 2);

    return (
      <div className="space-y-5">
        <HighlightRow items={row1} startIndex={0} isDark={isDark} />
        <HighlightRow items={row2} startIndex={row1.length} isDark={isDark} />
      </div>
    );
  }

  return (
    <div className="flex flex-wrap justify-center gap-5">
      {sorted.map((item, index) => (
        <div
          key={item.id}
          className="w-full max-w-md sm:w-[calc(50%-0.625rem)] sm:max-w-[calc(50%-0.625rem)] lg:w-[calc(33.333%-0.84rem)] lg:max-w-[calc(33.333%-0.84rem)]"
        >
          <HighlightCard item={item} displayIndex={index + 1} isDark={isDark} />
        </div>
      ))}
    </div>
  );
}
