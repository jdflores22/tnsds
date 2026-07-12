import { Link } from 'react-router-dom';
import { ArrowRight } from 'lucide-react';
import { motion } from 'framer-motion';
import type { HeroSlide } from '@/constants/heroCarousel';
import type { HeroColorTokens } from '@/constants/heroAppearance';
import { Button } from '@/components/ui/Button';
import { cn } from '@/utils/cn';

type HeroSlideContentProps = {
  slide: HeroSlide;
  colors: HeroColorTokens;
  isDark: boolean;
  animate?: boolean;
  /** Pin CTAs to the bottom inside a fixed-height carousel slide */
  fillHeight?: boolean;
};

export function HeroSlideContent({
  slide,
  colors,
  isDark,
  animate = true,
  fillHeight = false,
}: HeroSlideContentProps) {
  const wrapperClass = fillHeight ? 'flex h-full min-h-full flex-1 flex-col' : undefined;
  const ctaClass = fillHeight ? 'mt-auto flex flex-wrap gap-3 pt-6' : 'mt-10 flex flex-wrap gap-3';

  const body = (
    <div className={wrapperClass}>
      {slide.eyebrow && (
        <p
          className="mb-5 text-xs font-semibold uppercase tracking-[0.16em]"
          style={{ color: colors.eyebrow }}
        >
          {slide.eyebrow}
        </p>
      )}
      <h1 className="max-w-5xl text-[2.25rem] font-semibold leading-[1.08] tracking-tight sm:text-4xl lg:text-5xl">
        <span style={{ color: colors.title }}>{slide.titleLine1}</span>
        {slide.titleHighlight ? (
          <>
            <br />
            <span style={{ color: colors.titleHighlight }}>{slide.titleHighlight}</span>
          </>
        ) : null}
      </h1>

      {slide.description && (
        <p
          className="mt-6 max-w-2xl text-base leading-relaxed sm:mt-8 sm:text-lg sm:leading-relaxed lg:text-xl"
          style={{ color: colors.body }}
        >
          {slide.description}
        </p>
      )}

      <div className={ctaClass}>
        {slide.ctaLabel && slide.ctaHref && (
          <Link to={slide.ctaHref}>
            <Button size="lg" variant={isDark ? 'secondary' : 'primary'}>
              {slide.ctaLabel}
              <ArrowRight className="h-4 w-4" />
            </Button>
          </Link>
        )}
        {slide.secondaryCtaLabel && slide.secondaryCtaHref && (
          <Link to={slide.secondaryCtaHref}>
            <Button
              size="lg"
              variant="outline"
              className={cn(
                isDark &&
                  'border-white/25 bg-transparent text-white hover:border-white/40 hover:bg-white/10',
              )}
            >
              {slide.secondaryCtaLabel}
            </Button>
          </Link>
        )}
      </div>
    </div>
  );

  if (!animate) {
    return body;
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 12 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -8 }}
      transition={{ duration: 0.4 }}
    >
      {body}
    </motion.div>
  );
}
