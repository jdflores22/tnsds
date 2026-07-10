import { useCallback, useMemo, useState } from 'react';
import { AnimatePresence, motion } from 'framer-motion';
import { usePageVisibilityMap } from '@/hooks/usePageVisibility';
import { useHeroAppearance } from '@/hooks/useHeroAppearance';
import {
  useHeroCarouselOptions,
  useHeroLayoutMode,
  useHeroSlides,
} from '@/hooks/useHeroSlides';
import { HeroCarousel } from '@/components/marketing/HeroCarousel';
import { HeroHighlights } from '@/components/marketing/HeroHighlights';
import { HeroPromoPanel } from '@/components/marketing/HeroPromoPanel';
import { HeroSlideContent } from '@/components/marketing/HeroSlideContent';
import type { HeroSlide } from '@/constants/heroCarousel';
import { useSiteSettingsMap } from '@/hooks/useSiteSettingsMap';
import { resolveMediaUrl } from '@/utils/media';
import { hexToRgba } from '@/utils/color';
import { cn } from '@/utils/cn';

export function Hero() {
  const { isPagePublished } = usePageVisibilityMap();
  const showAbout = isPagePublished('about');
  const { get } = useSiteSettingsMap();
  const { colors, isDark, mainStyle, cssVars, imageOverlayOpacity } = useHeroAppearance();
  const layoutMode = useHeroLayoutMode();
  const carouselSlides = useHeroSlides();
  const { intervalMs, showPanel, autoplay } = useHeroCarouselOptions();
  const [carouselIndex, setCarouselIndex] = useState(0);

  const staticSlide = useMemo<HeroSlide>(
    () => ({
      eyebrow: get('hero_agency_label', '') || get('hero_tagline', 'Enterprise software development'),
      titleLine1: get('hero_title_line1', 'Driven by engineering,'),
      titleHighlight: get('hero_title_highlight', 'empowered by people'),
      description: get(
        'hero_description',
        'We turn software into business value by delivering domain expertise, modern engineering, and dependable delivery that helps organizations grow — in any market environment.',
      ),
      ctaLabel: 'Learn more',
      ctaHref: showAbout ? '/about' : '/services',
      secondaryCtaLabel: 'Contact us',
      secondaryCtaHref: '/contact',
      backgroundImage: get('hero_background_image', ''),
    }),
    [get, showAbout],
  );

  const isCarousel = layoutMode === 'carousel' && carouselSlides.length > 0;
  const activeSlide = isCarousel ? carouselSlides[carouselIndex] ?? carouselSlides[0] : staticSlide;
  const backgroundImage = resolveMediaUrl(
    activeSlide?.backgroundImage || get('hero_background_image') || '',
  );

  const onSlideChange = useCallback((index: number) => {
    setCarouselIndex(index);
  }, []);

  const imageOverlayStyle = isDark
    ? `linear-gradient(105deg, ${hexToRgba(colors.bg, 0.94)} 0%, ${hexToRgba(colors.bg, 0.88)} 42%, ${hexToRgba(colors.bg, 0.72)} 68%, ${hexToRgba(colors.bg, 0.55)} 100%)`
    : `linear-gradient(105deg, rgba(248,250,252,${imageOverlayOpacity}) 0%, rgba(255,255,255,${Math.max(0.75, imageOverlayOpacity - 0.05)}) 42%, rgba(255,255,255,${Math.max(0.6, imageOverlayOpacity - 0.2)}) 68%, rgba(255,255,255,${Math.max(0.45, imageOverlayOpacity - 0.3)}) 100%)`;

  const showPromoPanel = !isCarousel || showPanel;
  const gridCols = showPromoPanel ? 'lg:grid-cols-[1.05fr_0.95fr]' : 'lg:grid-cols-1';

  return (
    <section style={{ ...cssVars, backgroundColor: colors.highlightsBg }}>
      <div
        className={cn('relative overflow-hidden border-b', isDark ? 'border-white/10' : 'border-slate-200/60')}
        style={backgroundImage ? { backgroundColor: colors.bg } : mainStyle}
      >
        <AnimatePresence mode="wait">
          {backgroundImage && (
            <motion.div
              key={backgroundImage}
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.5 }}
              className="absolute inset-0"
            >
              <img
                src={backgroundImage}
                alt=""
                aria-hidden
                className="absolute inset-0 h-full w-full object-cover object-center"
              />
              <div className="absolute inset-0" style={{ background: imageOverlayStyle }} />
            </motion.div>
          )}
        </AnimatePresence>

        <div
          className={cn(
            'relative z-10 mx-auto grid max-w-7xl items-center gap-10 px-4 pb-16 pt-14 sm:px-6 sm:pb-20 sm:pt-20 lg:gap-12 lg:px-8 lg:pb-24 lg:pt-24',
            gridCols,
          )}
        >
          <div>
            {isCarousel ? (
              <HeroCarousel
                slides={carouselSlides}
                colors={colors}
                isDark={isDark}
                intervalMs={intervalMs}
                autoplay={autoplay}
                onSlideChange={onSlideChange}
              />
            ) : (
              <HeroSlideContent slide={staticSlide} colors={colors} isDark={isDark} animate={false} />
            )}
          </div>

          {showPromoPanel && <HeroPromoPanel isDark={isDark} />}
        </div>
      </div>

      <HeroHighlights />
    </section>
  );
}
