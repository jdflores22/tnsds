import { useEffect, useState } from 'react';
import { AnimatePresence, motion } from 'framer-motion';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import type { HeroSlide } from '@/constants/heroCarousel';
import type { HeroColorTokens } from '@/constants/heroAppearance';
import { HeroSlideContent } from '@/components/marketing/HeroSlideContent';
import { cn } from '@/utils/cn';

type HeroCarouselProps = {
  slides: HeroSlide[];
  colors: HeroColorTokens;
  isDark: boolean;
  intervalMs: number;
  autoplay: boolean;
  onSlideChange?: (index: number) => void;
};

export function HeroCarousel({
  slides,
  colors,
  isDark,
  intervalMs,
  autoplay,
  onSlideChange,
}: HeroCarouselProps) {
  const [active, setActive] = useState(0);
  const total = slides.length;
  const current = slides[active] ?? slides[0];

  useEffect(() => {
    onSlideChange?.(active);
  }, [active, onSlideChange]);

  useEffect(() => {
    if (!autoplay || total <= 1) return;
    const id = window.setInterval(() => {
      setActive((i) => (i + 1) % total);
    }, intervalMs);
    return () => window.clearInterval(id);
  }, [autoplay, intervalMs, total]);

  const go = (dir: -1 | 1) => {
    setActive((i) => (i + dir + total) % total);
  };

  if (!current) return null;

  return (
    <div className="relative">
      <div className="min-h-[280px] sm:min-h-[320px]">
        <AnimatePresence mode="wait">
          <motion.div
            key={`${active}-${current.titleLine1}-${current.titleHighlight}`}
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -8 }}
            transition={{ duration: 0.4 }}
          >
            <HeroSlideContent slide={current} colors={colors} isDark={isDark} animate={false} />
          </motion.div>
        </AnimatePresence>
      </div>

      {total > 1 && (
        <div className="mt-8 flex flex-wrap items-center gap-4">
          <div className="flex items-center gap-2">
            <button
              type="button"
              aria-label="Previous slide"
              onClick={() => go(-1)}
              className={cn(
                'inline-flex h-9 w-9 items-center justify-center rounded-full border transition-colors',
                isDark
                  ? 'border-white/20 text-white hover:bg-white/10'
                  : 'border-slate-200 text-primary-800 hover:bg-slate-50',
              )}
            >
              <ChevronLeft className="h-4 w-4" />
            </button>
            <button
              type="button"
              aria-label="Next slide"
              onClick={() => go(1)}
              className={cn(
                'inline-flex h-9 w-9 items-center justify-center rounded-full border transition-colors',
                isDark
                  ? 'border-white/20 text-white hover:bg-white/10'
                  : 'border-slate-200 text-primary-800 hover:bg-slate-50',
              )}
            >
              <ChevronRight className="h-4 w-4" />
            </button>
          </div>

          <div className="flex items-center gap-2" role="tablist" aria-label="Hero slides">
            {slides.map((slide, index) => (
              <button
                key={`${slide.titleLine1}-${index}`}
                type="button"
                role="tab"
                aria-selected={index === active}
                aria-label={`Go to slide ${index + 1}: ${slide.titleLine1}`}
                onClick={() => setActive(index)}
                className={cn(
                  'h-2 rounded-full transition-all',
                  index === active
                    ? cn('w-8', isDark ? 'bg-brand-gold-400' : 'bg-brand-gold-500')
                    : cn('w-2', isDark ? 'bg-white/30 hover:bg-white/50' : 'bg-slate-300 hover:bg-slate-400'),
                )}
              />
            ))}
          </div>

          <span
            className={cn('text-xs tabular-nums', isDark ? 'text-slate-400' : 'text-slate-500')}
          >
            {String(active + 1).padStart(2, '0')} / {String(total).padStart(2, '0')}
          </span>
        </div>
      )}
    </div>
  );
}
