import { useEffect, useId, useState } from 'react';
import { Link } from 'react-router-dom';
import { ArrowRight, CheckCircle2, ChevronLeft, ChevronRight, Star } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import type { SoftwareProduct } from '@/types';
import { Container } from '@/components/common/Container';
import { PageSection, SectionHeading } from '@/components/common/SectionHeading';
import { Button } from '@/components/ui/Button';
import { HexagonBadge } from '@/components/marketing/HexagonBadge';
import { useSectionContent } from '@/hooks/useSectionContent';
import { useFeaturedProductAppearance } from '@/hooks/useFeaturedProductAppearance';
import type { FeaturedProductColorTokens } from '@/constants/featuredProductAppearance';
import { resolveMediaUrl } from '@/utils/media';
import { parseJsonArray } from '@/utils/jsonArray';
import { hexToRgba } from '@/utils/color';
import { cn } from '@/utils/cn';

const SLIDE_INTERVAL_MS = 4500;

const HEX_CLIP =
  'polygon(50% 0%, 100% 25%, 100% 75%, 50% 100%, 0% 75%, 0% 25%)';

const UNEVEN_HEX_PATH =
  'M50.4 1.8 L97.2 27.1 L98.6 85.4 L49.1 113.2 L2.4 87.6 L1.2 26.3 Z';

const CLEAN_HEX_PATH =
  'M50 2 L98 26.5 L98 88.5 L50 113 L2 88.5 L2 26.5 Z';

const HEX_PATH = 'M50 4 L96 28 L96 76 L50 100 L4 76 L4 28 Z';

const HONEYCOMB: { x: number; y: number; s: number }[] = [
  { x: 30, y: 28, s: 20 },
  { x: 64, y: 28, s: 20 },
  { x: 98, y: 28, s: 20 },
  { x: 47, y: 52, s: 20 },
  { x: 81, y: 52, s: 20 },
  { x: 30, y: 76, s: 20 },
  { x: 64, y: 76, s: 20 },
  { x: 98, y: 76, s: 20 },
  { x: 47, y: 100, s: 20 },
  { x: 81, y: 100, s: 20 },
  { x: 30, y: 124, s: 20 },
  { x: 64, y: 124, s: 20 },
  { x: 98, y: 124, s: 20 },
  { x: 47, y: 148, s: 20 },
  { x: 81, y: 148, s: 20 },
];

function hexPoints(cx: number, cy: number, r: number) {
  return Array.from({ length: 6 }, (_, i) => {
    const angle = (Math.PI / 180) * (60 * i - 30);
    return `${cx + r * Math.cos(angle)},${cy + r * Math.sin(angle)}`;
  }).join(' ');
}

function FeaturedAtmosphere({ accent, isDark }: { accent: string; isDark: boolean }) {
  const gold = hexToRgba(accent, isDark ? 0.28 : 0.2);
  const goldSoft = hexToRgba(accent, isDark ? 0.12 : 0.1);
  const ink = isDark ? 'rgba(255,255,255,0.07)' : 'rgba(10,26,46,0.05)';
  const fill = hexToRgba(accent, isDark ? 0.045 : 0.035);

  return (
    <div className="pointer-events-none absolute inset-0 overflow-hidden" aria-hidden>
      <div
        className="absolute inset-0"
        style={{
          background: isDark
            ? `radial-gradient(ellipse 60% 50% at 85% 30%, ${hexToRgba(accent, 0.16)} 0%, transparent 55%), radial-gradient(ellipse 50% 45% at 10% 80%, rgba(61,111,150,0.18) 0%, transparent 50%)`
            : `radial-gradient(ellipse 55% 45% at 88% 25%, ${hexToRgba(accent, 0.1)} 0%, transparent 55%), radial-gradient(ellipse 45% 40% at 8% 75%, rgba(26,58,102,0.06) 0%, transparent 50%)`,
        }}
      />

      <svg
        className="absolute -left-[5%] top-[6%] h-[90%] w-[38%] max-w-sm opacity-80"
        viewBox="0 0 140 180"
        fill="none"
        style={{
          maskImage: 'linear-gradient(90deg, black 0%, black 40%, transparent 95%)',
          WebkitMaskImage: 'linear-gradient(90deg, black 0%, black 40%, transparent 95%)',
        }}
      >
        {HONEYCOMB.map((cell, i) => (
          <polygon
            key={`fl-${i}`}
            points={hexPoints(cell.x, cell.y, cell.s * 0.9)}
            stroke={i % 5 === 0 ? goldSoft : ink}
            strokeWidth={i % 5 === 0 ? 1 : 0.65}
            fill={i % 7 === 0 ? fill : 'none'}
          />
        ))}
      </svg>

      <svg
        className="absolute -right-[3%] bottom-[2%] h-[70%] w-[32%] max-w-xs opacity-70"
        viewBox="0 0 140 180"
        fill="none"
        style={{
          maskImage: 'linear-gradient(270deg, black 0%, black 35%, transparent 90%)',
          WebkitMaskImage: 'linear-gradient(270deg, black 0%, black 35%, transparent 90%)',
        }}
      >
        {HONEYCOMB.slice(0, 12).map((cell, i) => (
          <polygon
            key={`fr-${i}`}
            points={hexPoints(cell.x, cell.y, cell.s * 0.9)}
            stroke={i % 4 === 1 ? goldSoft : ink}
            strokeWidth={0.7}
            fill="none"
          />
        ))}
      </svg>

      <svg
        className="absolute left-[18%] bottom-[8%] hidden h-28 w-24 opacity-45 lg:block"
        viewBox="0 0 100 104"
        fill="none"
      >
        <path d={HEX_PATH} stroke={gold} strokeWidth="1" strokeDasharray="3 5" />
      </svg>
    </div>
  );
}

function HexagonStroke({ accent, isDark }: { accent: string; isDark: boolean }) {
  const uid = useId();
  const filterId = `hex-glow-${uid.replace(/:/g, '')}`;

  return (
    <svg
      viewBox="0 0 100 115"
      className="pointer-events-none absolute inset-0 h-full w-full overflow-visible"
      aria-hidden
    >
      <defs>
        <filter id={filterId} x="-20%" y="-20%" width="140%" height="140%">
          <feGaussianBlur stdDeviation="1.2" result="blur" />
          <feMerge>
            <feMergeNode in="blur" />
            <feMergeNode in="SourceGraphic" />
          </feMerge>
        </filter>
      </defs>
      <path
        d={UNEVEN_HEX_PATH}
        fill="none"
        stroke={hexToRgba(accent, isDark ? 0.55 : 0.7)}
        strokeWidth="2.4"
        strokeLinejoin="round"
        strokeLinecap="round"
        vectorEffect="non-scaling-stroke"
        filter={`url(#${filterId})`}
        style={{ strokeDasharray: '14 5 3 5 9 4' }}
      />
      <path
        d="M51.8 4.2 L95.1 29.4 L96.8 83.1 L48.2 110.6 L4.8 84.9 L3.6 28.8 Z"
        fill="none"
        stroke={hexToRgba(accent, isDark ? 0.28 : 0.35)}
        strokeWidth="1.1"
        strokeLinejoin="round"
        vectorEffect="non-scaling-stroke"
        style={{ strokeDasharray: '2 6 11 4' }}
      />
      <path
        d={CLEAN_HEX_PATH}
        fill="none"
        stroke={hexToRgba(accent, isDark ? 0.85 : 0.9)}
        strokeWidth="1.35"
        strokeLinejoin="round"
        vectorEffect="non-scaling-stroke"
      />
    </svg>
  );
}

function SatelliteHex({
  className,
  accent,
  dashed,
}: {
  className?: string;
  accent: string;
  dashed?: boolean;
}) {
  return (
    <svg className={cn('pointer-events-none absolute', className)} viewBox="0 0 100 104" fill="none" aria-hidden>
      <path
        d={HEX_PATH}
        stroke={hexToRgba(accent, dashed ? 0.35 : 0.5)}
        strokeWidth="1.2"
        strokeDasharray={dashed ? '4 5' : undefined}
      />
    </svg>
  );
}

function FeaturedProductMedia({
  productName,
  screenshotUrls,
  logoUrl,
  colors,
  isDark,
}: {
  productName: string;
  screenshotUrls: string[];
  logoUrl: string | null;
  colors: FeaturedProductColorTokens;
  isDark: boolean;
}) {
  const isSlider = screenshotUrls.length >= 2;
  const [active, setActive] = useState(0);
  const [paused, setPaused] = useState(false);
  const total = screenshotUrls.length;
  const screenshotsKey = screenshotUrls.join('|');

  useEffect(() => {
    setActive(0);
  }, [screenshotsKey]);

  useEffect(() => {
    if (!isSlider || paused) return;
    const id = window.setInterval(() => {
      setActive((i) => (i + 1) % total);
    }, SLIDE_INTERVAL_MS);
    return () => window.clearInterval(id);
  }, [isSlider, paused, total]);

  const go = (dir: -1 | 1) => {
    setActive((i) => (i + dir + total) % total);
  };

  const renderFallback = () => {
    if (logoUrl) {
      return (
        <div
          className="flex h-full w-full items-center justify-center p-10"
          style={{
            background: isDark
              ? `linear-gradient(to bottom right, ${hexToRgba(colors.accent, 0.12)}, ${colors.cardBg})`
              : `linear-gradient(to bottom right, ${hexToRgba(colors.accent, 0.08)}, #ffffff)`,
          }}
        >
          <img src={logoUrl} alt={productName} className="max-h-28 max-w-[70%] object-contain" />
        </div>
      );
    }

    return (
      <div
        className="flex h-full w-full items-center justify-center"
        style={{ backgroundColor: hexToRgba(colors.accent, 0.08) }}
      >
        <span className="text-5xl font-bold opacity-25" style={{ color: colors.title }}>
          {productName.charAt(0)}
        </span>
      </div>
    );
  };

  const renderSlideContent = () => {
    if (screenshotUrls.length === 0) return renderFallback();

    if (!isSlider) {
      return (
        <img
          src={screenshotUrls[0]}
          alt={productName}
          className="h-full w-full object-cover object-top"
        />
      );
    }

    return (
      <AnimatePresence mode="wait" initial={false}>
        <motion.img
          key={screenshotUrls[active]}
          src={screenshotUrls[active]}
          alt={`${productName} screenshot ${active + 1}`}
          className="absolute inset-0 h-full w-full object-cover object-top"
          initial={{ opacity: 0, scale: 1.04 }}
          animate={{ opacity: 1, scale: 1 }}
          exit={{ opacity: 0, scale: 0.98 }}
          transition={{ duration: 0.4 }}
        />
      </AnimatePresence>
    );
  };

  return (
    <div
      className="relative mx-auto w-full max-w-md lg:max-w-none"
      onMouseEnter={() => setPaused(true)}
      onMouseLeave={() => setPaused(false)}
      onFocusCapture={() => setPaused(true)}
      onBlurCapture={() => setPaused(false)}
    >
      <div
        className="absolute left-1/2 top-1/2 h-[88%] w-[78%] -translate-x-1/2 -translate-y-1/2 blur-2xl"
        style={{
          backgroundColor: hexToRgba(colors.accent, isDark ? 0.22 : 0.16),
          clipPath: HEX_CLIP,
        }}
        aria-hidden
      />

      {/* Satellite hexes around the main media */}
      <SatelliteHex
        accent={colors.accent}
        dashed
        className="left-[-6%] top-[8%] h-16 w-14 opacity-70 sm:h-20 sm:w-16"
      />
      <SatelliteHex
        accent={colors.accent}
        className="right-[-4%] top-[28%] h-12 w-10 opacity-60 sm:h-14 sm:w-12"
      />
      <SatelliteHex
        accent={colors.accent}
        dashed
        className="bottom-[10%] left-[-2%] hidden h-14 w-12 opacity-50 sm:block"
      />

      <div className="relative mx-auto aspect-[100/115] w-full max-w-[420px]">
        <HexagonStroke accent={colors.accent} isDark={isDark} />

        <div
          className="absolute inset-[4.5%] overflow-hidden"
          style={{
            clipPath: HEX_CLIP,
            backgroundColor: colors.cardBg,
            boxShadow: isDark
              ? '0 25px 50px -12px rgba(0,0,0,0.5)'
              : '0 25px 50px -18px rgba(10,26,46,0.35)',
          }}
        >
          <div className="relative h-full w-full">{renderSlideContent()}</div>
        </div>
      </div>

      {isSlider && (
        <div className="mt-5 flex items-center justify-center gap-3">
          <button
            type="button"
            aria-label="Previous screenshot"
            onClick={() => go(-1)}
            className={cn(
              'inline-flex h-9 w-9 items-center justify-center rounded-full border transition',
              isDark
                ? 'border-white/20 text-white hover:bg-white/10'
                : 'border-slate-200 text-primary-800 hover:bg-slate-50',
            )}
          >
            <ChevronLeft className="h-4 w-4" />
          </button>

          <div className="flex items-center gap-1.5" role="tablist" aria-label="Product screenshots">
            {screenshotUrls.map((url, index) => (
              <button
                key={`${url}-${index}`}
                type="button"
                role="tab"
                aria-selected={index === active}
                aria-label={`Go to screenshot ${index + 1}`}
                onClick={() => setActive(index)}
                className={cn(
                  'h-1.5 rounded-full transition-all',
                  index === active
                    ? 'w-6'
                    : cn('w-1.5', isDark ? 'bg-white/35 hover:bg-white/55' : 'bg-slate-300 hover:bg-slate-400'),
                )}
                style={index === active ? { backgroundColor: colors.accent } : undefined}
              />
            ))}
          </div>

          <button
            type="button"
            aria-label="Next screenshot"
            onClick={() => go(1)}
            className={cn(
              'inline-flex h-9 w-9 items-center justify-center rounded-full border transition',
              isDark
                ? 'border-white/20 text-white hover:bg-white/10'
                : 'border-slate-200 text-primary-800 hover:bg-slate-50',
            )}
          >
            <ChevronRight className="h-4 w-4" />
          </button>
        </div>
      )}
    </div>
  );
}

export interface FeaturedProductSpotlightProps {
  product: SoftwareProduct;
  contentPrefix?: string;
  showHeading?: boolean;
  sectionId?: string;
  anchorId?: string;
  className?: string;
}

export function FeaturedProductSpotlight({
  product,
  contentPrefix = 'home_featured_product',
  showHeading = true,
  sectionId = 'home_featured_product',
  anchorId = 'featured-product',
  className,
}: FeaturedProductSpotlightProps) {
  const { colors, isDark, sectionStyle } = useFeaturedProductAppearance(sectionId);
  const theme = isDark ? 'dark' : 'light';

  const section = useSectionContent(contentPrefix, {
    eyebrow: 'Featured product',
    title: 'Software built for real operations',
    subtitle: 'Explore our flagship solution — designed for teams that need reliability, visibility, and scale.',
  });

  const logoUrl = product.logoUrl ? resolveMediaUrl(product.logoUrl) : null;
  const screenshotUrls = parseJsonArray(product.screenshotsJson)
    .map((url) => resolveMediaUrl(url))
    .filter(Boolean);
  const features = parseJsonArray(product.featuresJson).slice(0, 4);

  return (
    <PageSection
      sectionId={sectionId}
      variant="white"
      style={sectionStyle}
      id={anchorId}
      className={cn('relative overflow-hidden !py-16 sm:!py-20', isDark && 'text-white', className)}
    >
      <FeaturedAtmosphere accent={colors.accent} isDark={isDark} />
      <Container className="relative z-10">
        {showHeading && (
          <SectionHeading
            eyebrow={section.eyebrow}
            title={section.title}
            subtitle={section.subtitle}
            theme={theme}
            className="mb-12"
          />
        )}

        <div
          className={cn(
            'grid items-center gap-10 lg:grid-cols-2 lg:gap-14',
            !showHeading && 'lg:gap-12',
          )}
        >
          <motion.div
            initial={{ opacity: 0, x: -16 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.45 }}
          >
            <div className="mb-5 flex flex-wrap items-center gap-3">
              <span
                className="inline-flex items-center gap-1.5 rounded-full px-3 py-1 text-xs font-semibold uppercase tracking-wider"
                style={{
                  backgroundColor: hexToRgba(colors.accent, 0.15),
                  color: colors.accent,
                }}
              >
                <Star className="h-3 w-3 fill-current" />
                Featured
              </span>
            </div>

            <div className="mb-5 flex items-center gap-4">
              <HexagonBadge
                size="lg"
                stroke={colors.accent}
                isDark={isDark}
                fillClassName={isDark ? 'bg-white/[0.08]' : 'bg-white'}
              >
                {logoUrl ? (
                  <img src={logoUrl} alt="" className="max-h-9 max-w-9 object-contain" />
                ) : (
                  <span className="text-lg font-bold" style={{ color: colors.accent }}>
                    {product.name.charAt(0)}
                  </span>
                )}
              </HexagonBadge>
              <div>
                <p
                  className="text-xs font-semibold uppercase tracking-[0.16em]"
                  style={{ color: colors.eyebrow }}
                >
                  Spotlight
                </p>
                <h3
                  className="text-2xl font-semibold tracking-tight sm:text-3xl"
                  style={{ color: colors.title }}
                >
                  {product.name}
                </h3>
              </div>
            </div>

            {product.shortDescription && (
              <p className="max-w-xl text-base leading-relaxed sm:text-lg" style={{ color: colors.body }}>
                {product.shortDescription}
              </p>
            )}

            {features.length > 0 && (
              <ul className="mt-6 space-y-3">
                {features.map((feature, index) => (
                  <li
                    key={feature}
                    className="flex items-start gap-3 text-sm sm:text-base"
                    style={{ color: colors.body }}
                  >
                    <span
                      className="mt-0.5 flex h-6 w-6 shrink-0 items-center justify-center"
                      style={{
                        clipPath: HEX_CLIP,
                        backgroundColor: hexToRgba(colors.accent, 0.15),
                        color: colors.accent,
                      }}
                    >
                      <CheckCircle2 className="h-3.5 w-3.5" strokeWidth={2} />
                    </span>
                    <span>
                      <span
                        className="mr-2 font-mono text-[11px] font-semibold tabular-nums opacity-50"
                        aria-hidden
                      >
                        {String(index + 1).padStart(2, '0')}
                      </span>
                      {feature}
                    </span>
                  </li>
                ))}
              </ul>
            )}

            <div className="mt-8 flex flex-wrap gap-3">
              <Link to={`/products/${product.slug}`}>
                <Button
                  className="text-primary-950 hover:opacity-90"
                  style={{ backgroundColor: colors.accent }}
                >
                  View product
                  <ArrowRight className="ml-2 h-4 w-4" />
                </Button>
              </Link>
              <Link to="/contact">
                <Button
                  variant="outline"
                  className={cn(
                    isDark
                      ? 'border-white/25 text-white hover:border-white/40 hover:bg-white/10'
                      : 'border-slate-300 text-primary-900 hover:bg-slate-50',
                  )}
                >
                  Request demo
                </Button>
              </Link>
            </div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, x: 16 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.45, delay: 0.08 }}
            className="relative flex justify-center lg:justify-end"
          >
            <FeaturedProductMedia
              productName={product.name}
              screenshotUrls={screenshotUrls}
              logoUrl={logoUrl}
              colors={colors}
              isDark={isDark}
            />
          </motion.div>
        </div>
      </Container>
    </PageSection>
  );
}
