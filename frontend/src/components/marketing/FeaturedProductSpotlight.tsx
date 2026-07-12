import { Link } from 'react-router-dom';
import { ArrowRight, CheckCircle2, Star } from 'lucide-react';
import { motion } from 'framer-motion';
import type { SoftwareProduct } from '@/types';
import { Container } from '@/components/common/Container';
import { PageSection, SectionHeading } from '@/components/common/SectionHeading';
import { Button } from '@/components/ui/Button';
import { useSectionContent } from '@/hooks/useSectionContent';
import { useFeaturedProductAppearance } from '@/hooks/useFeaturedProductAppearance';
import { resolveMediaUrl } from '@/utils/media';
import { parseJsonArray } from '@/utils/jsonArray';
import { hexToRgba } from '@/utils/color';
import { cn } from '@/utils/cn';

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
  const screenshots = parseJsonArray(product.screenshotsJson);
  const screenshotUrl = screenshots[0] ? resolveMediaUrl(screenshots[0]) : null;
  const features = parseJsonArray(product.featuresJson).slice(0, 4);

  return (
    <PageSection
      sectionId={sectionId}
      variant="white"
      style={sectionStyle}
      id={anchorId}
      className={cn('!py-16 sm:!py-20', isDark && 'text-white', className)}
    >
      <Container>
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
              {logoUrl ? (
                <img
                  src={logoUrl}
                  alt=""
                  className="h-14 w-14 rounded-xl p-2 object-contain ring-1"
                  style={{
                    backgroundColor: isDark ? 'rgba(255,255,255,0.1)' : '#f8fafc',
                    borderColor: colors.cardBorder,
                  }}
                />
              ) : (
                <div
                  className="flex h-14 w-14 items-center justify-center rounded-xl text-xl font-bold ring-1"
                  style={{
                    backgroundColor: hexToRgba(colors.accent, 0.15),
                    color: colors.accent,
                    borderColor: hexToRgba(colors.accent, 0.35),
                  }}
                >
                  {product.name.charAt(0)}
                </div>
              )}
              <div>
                <p
                  className="text-xs font-semibold uppercase tracking-[0.16em]"
                  style={{ color: colors.eyebrow }}
                >
                  Spotlight
                </p>
                <h3 className="text-2xl font-semibold tracking-tight sm:text-3xl" style={{ color: colors.title }}>
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
              <ul className="mt-6 space-y-2.5">
                {features.map((feature) => (
                  <li
                    key={feature}
                    className="flex items-start gap-2.5 text-sm sm:text-base"
                    style={{ color: colors.body }}
                  >
                    <CheckCircle2
                      className="mt-0.5 h-4 w-4 shrink-0"
                      style={{ color: colors.accent }}
                      strokeWidth={1.5}
                    />
                    <span>{feature}</span>
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
            className="relative"
          >
            <div
              className="absolute -inset-4 rounded-3xl blur-2xl"
              style={{ backgroundColor: hexToRgba(colors.accent, 0.12) }}
              aria-hidden
            />
            <div
              className="relative overflow-hidden rounded-2xl border shadow-2xl"
              style={{
                backgroundColor: colors.cardBg,
                borderColor: colors.cardBorder,
                boxShadow: isDark ? '0 25px 50px -12px rgba(0,0,0,0.45)' : undefined,
              }}
            >
              {screenshotUrl ? (
                <img
                  src={screenshotUrl}
                  alt={product.name}
                  className="aspect-[4/3] w-full object-cover object-top"
                />
              ) : logoUrl ? (
                <div
                  className="flex aspect-[4/3] items-center justify-center p-12"
                  style={{
                    background: isDark
                      ? `linear-gradient(to bottom right, ${hexToRgba(colors.accent, 0.08)}, ${colors.bg})`
                      : 'linear-gradient(to bottom right, #f1f5f9, #ffffff)',
                  }}
                >
                  <img src={logoUrl} alt={product.name} className="max-h-32 max-w-full object-contain" />
                </div>
              ) : (
                <div
                  className="flex aspect-[4/3] items-center justify-center p-12"
                  style={{ backgroundColor: hexToRgba(colors.accent, 0.06) }}
                >
                  <span className="text-5xl font-bold opacity-20" style={{ color: colors.title }}>
                    {product.name.charAt(0)}
                  </span>
                </div>
              )}
            </div>
          </motion.div>
        </div>
      </Container>
    </PageSection>
  );
}
