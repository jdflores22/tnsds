import { Link } from 'react-router-dom';
import { ArrowRight, ArrowUpRight } from 'lucide-react';
import { motion } from 'framer-motion';
import { useProducts } from '@/api/hooks';
import type { SoftwareProduct } from '@/types';
import { Container } from '@/components/common/Container';
import { PageSection, SectionHeading } from '@/components/common/SectionHeading';
import { HexagonBadge } from '@/components/marketing/HexagonBadge';
import { Spinner } from '@/components/ui/Spinner';
import { useSectionContent, usePageSectionTheme } from '@/hooks/useSectionContent';
import { resolveMediaUrl } from '@/utils/media';
import { cn } from '@/utils/cn';

const GOLD_STROKE = '#d4a017';
const HEX_PATH = 'M50 4 L96 28 L96 76 L50 100 L4 76 L4 28 Z';

/** Pointy-top hex tile centers for a calm honeycomb field (viewBox 0 0 240 200). */
const HONEYCOMB: { x: number; y: number; s: number }[] = [
  { x: 30, y: 28, s: 22 },
  { x: 64, y: 28, s: 22 },
  { x: 98, y: 28, s: 22 },
  { x: 47, y: 54, s: 22 },
  { x: 81, y: 54, s: 22 },
  { x: 30, y: 80, s: 22 },
  { x: 64, y: 80, s: 22 },
  { x: 98, y: 80, s: 22 },
  { x: 47, y: 106, s: 22 },
  { x: 81, y: 106, s: 22 },
  { x: 30, y: 132, s: 22 },
  { x: 64, y: 132, s: 22 },
  { x: 98, y: 132, s: 22 },
  { x: 47, y: 158, s: 22 },
  { x: 81, y: 158, s: 22 },
];

function hexPoints(cx: number, cy: number, r: number) {
  // Pointy-top regular hexagon vertices
  return Array.from({ length: 6 }, (_, i) => {
    const angle = (Math.PI / 180) * (60 * i - 30);
    return `${cx + r * Math.cos(angle)},${cy + r * Math.sin(angle)}`;
  }).join(' ');
}

function ProductsAtmosphere({ isDark }: { isDark: boolean }) {
  const gold = isDark ? 'rgba(212,160,23,0.28)' : 'rgba(212,160,23,0.22)';
  const goldSoft = isDark ? 'rgba(212,160,23,0.12)' : 'rgba(212,160,23,0.1)';
  const ink = isDark ? 'rgba(255,255,255,0.07)' : 'rgba(10,26,46,0.055)';
  const fill = isDark ? 'rgba(212,160,23,0.04)' : 'rgba(212,160,23,0.035)';

  return (
    <div className="pointer-events-none absolute inset-0 overflow-hidden" aria-hidden>
      {/* Soft brand washes */}
      <div
        className="absolute inset-0"
        style={{
          background: isDark
            ? 'radial-gradient(ellipse 65% 50% at 8% 18%, rgba(212,160,23,0.12) 0%, transparent 55%), radial-gradient(ellipse 55% 45% at 92% 78%, rgba(61,111,150,0.18) 0%, transparent 50%)'
            : 'radial-gradient(ellipse 65% 50% at 8% 15%, rgba(212,160,23,0.09) 0%, transparent 55%), radial-gradient(ellipse 50% 40% at 92% 82%, rgba(26,58,102,0.06) 0%, transparent 50%)',
        }}
      />

      {/* Honeycomb field — left side, soft mask so cards stay readable */}
      <svg
        className="absolute -left-[6%] top-[4%] h-[92%] w-[42%] max-w-md opacity-90"
        viewBox="0 0 140 190"
        fill="none"
        style={{
          maskImage: 'linear-gradient(90deg, black 0%, black 45%, transparent 95%)',
          WebkitMaskImage: 'linear-gradient(90deg, black 0%, black 45%, transparent 95%)',
        }}
      >
        {HONEYCOMB.map((cell, i) => (
          <polygon
            key={`L-${i}`}
            points={hexPoints(cell.x, cell.y, cell.s * 0.92)}
            stroke={i % 5 === 0 ? goldSoft : ink}
            strokeWidth={i % 5 === 0 ? 1.1 : 0.7}
            fill={i % 7 === 0 ? fill : 'none'}
          />
        ))}
      </svg>

      {/* Honeycomb field — right side */}
      <svg
        className="absolute -right-[4%] top-[8%] h-[88%] w-[40%] max-w-md opacity-90"
        viewBox="0 0 140 190"
        fill="none"
        style={{
          maskImage: 'linear-gradient(270deg, black 0%, black 40%, transparent 92%)',
          WebkitMaskImage: 'linear-gradient(270deg, black 0%, black 40%, transparent 92%)',
        }}
      >
        {HONEYCOMB.map((cell, i) => (
          <polygon
            key={`R-${i}`}
            points={hexPoints(cell.x, cell.y, cell.s * 0.92)}
            stroke={i % 4 === 1 ? goldSoft : ink}
            strokeWidth={i % 4 === 1 ? 1.05 : 0.7}
            fill={i % 8 === 2 ? fill : 'none'}
          />
        ))}
      </svg>

      {/* Larger featured hex frames — corners only, professional accent */}
      <svg
        className="absolute right-[2%] top-[6%] h-48 w-40 sm:h-56 sm:w-48"
        viewBox="0 0 100 104"
        fill="none"
      >
        <path d={HEX_PATH} stroke={gold} strokeWidth="1.35" />
        <path
          d={HEX_PATH}
          stroke={ink}
          strokeWidth="0.8"
          strokeDasharray="5 4"
          transform="translate(7 5) scale(0.86)"
        />
        <path
          d={HEX_PATH}
          stroke={goldSoft}
          strokeWidth="0.7"
          transform="translate(14 10) scale(0.72)"
        />
      </svg>

      <svg
        className="absolute bottom-[4%] left-[1%] h-36 w-32 sm:h-44 sm:w-40"
        viewBox="0 0 100 104"
        fill="none"
      >
        <path d={HEX_PATH} stroke={ink} strokeWidth="1.2" />
        <path
          d={HEX_PATH}
          stroke={gold}
          strokeWidth="0.9"
          strokeDasharray="4 5"
          transform="translate(8 6) scale(0.84)"
        />
      </svg>

      {/* Quiet center accent — single dashed hex, low opacity */}
      <svg
        className="absolute left-1/2 top-[42%] hidden h-28 w-24 -translate-x-1/2 opacity-40 lg:block"
        viewBox="0 0 100 104"
        fill="none"
      >
        <path d={HEX_PATH} stroke={goldSoft} strokeWidth="1" strokeDasharray="2 6" />
      </svg>
    </div>
  );
}

function ProductCard({
  product,
  index,
  isDark,
}: {
  product: SoftwareProduct;
  index: number;
  isDark: boolean;
}) {
  const logoUrl = product.logoUrl ? resolveMediaUrl(product.logoUrl) : null;

  return (
    <motion.div
      initial={{ opacity: 0, y: 16 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ delay: index * 0.06, duration: 0.4 }}
    >
      <Link
        to={`/products/${product.slug}`}
        className={cn(
          'group relative flex h-full flex-col overflow-hidden rounded-2xl border p-6 transition-all duration-300',
          isDark
            ? 'border-white/10 bg-white/[0.03] hover:border-brand-gold-400/40 hover:bg-white/[0.06]'
            : 'border-slate-200 bg-white/90 backdrop-blur-[2px] hover:border-brand-gold-400/60 hover:shadow-[0_20px_45px_-25px_rgba(10,26,46,0.45)]',
        )}
      >
        <span className="absolute inset-x-0 top-0 h-1 origin-left scale-x-0 bg-gradient-to-r from-transparent via-brand-gold-500 to-transparent transition-transform duration-300 group-hover:scale-x-100" />

        <div className="mb-5 flex items-start justify-between gap-3">
          <HexagonBadge
            size="md"
            stroke={GOLD_STROKE}
            isDark={isDark}
            fillClassName={cn(
              isDark
                ? 'bg-white/[0.08] text-brand-gold-400 group-hover:bg-brand-gold-400/15'
                : 'bg-brand-gold-500/10 text-brand-gold-700 group-hover:bg-brand-gold-500 group-hover:text-white',
            )}
          >
            {logoUrl ? (
              <img
                src={logoUrl}
                alt=""
                className="max-h-7 max-w-7 object-contain transition-transform duration-300 group-hover:scale-105"
              />
            ) : (
              <span className="text-sm font-bold tabular-nums transition-colors duration-300">
                {product.name.charAt(0)}
              </span>
            )}
          </HexagonBadge>
          <span
            className={cn(
              'font-mono text-sm font-semibold tabular-nums',
              isDark ? 'text-white/25' : 'text-slate-300',
            )}
          >
            {String(index + 1).padStart(2, '0')}
          </span>
        </div>

        <h3
          className={cn(
            'text-lg font-semibold tracking-tight',
            isDark ? 'text-white' : 'text-primary-900',
          )}
        >
          {product.name}
        </h3>
        {product.shortDescription && (
          <p
            className={cn(
              'mt-2 flex-1 text-sm leading-relaxed line-clamp-3',
              isDark ? 'text-slate-400' : 'text-slate-600',
            )}
          >
            {product.shortDescription}
          </p>
        )}

        <span
          className={cn(
            'mt-5 inline-flex items-center gap-1.5 text-sm font-semibold transition-colors',
            isDark
              ? 'text-brand-gold-400 group-hover:text-brand-gold-300'
              : 'text-primary-800 group-hover:text-brand-gold-600',
          )}
        >
          View product
          <ArrowUpRight className="h-4 w-4 transition-transform duration-300 group-hover:translate-x-0.5 group-hover:-translate-y-0.5" />
        </span>
      </Link>
    </motion.div>
  );
}

export function SoftwareSolutions() {
  const { data: products, isLoading } = useProducts();
  const sorted = [...(products ?? [])].sort((a, b) => a.sortOrder - b.sortOrder);
  const row1 = sorted.filter((p) => (p.homepageRow ?? 1) === 1);
  const row2 = sorted.filter((p) => (p.homepageRow ?? 1) === 2);
  const preferred = [...row1, ...row2];
  const display = (preferred.length > 0 ? preferred : sorted).slice(0, 8);

  const section = useSectionContent('home_products', {
    eyebrow: 'Products',
    title: 'Software Solutions',
    subtitle: 'Ready-to-deploy and customizable enterprise software products.',
  });

  const theme = usePageSectionTheme('home_products');
  const isDark = theme === 'dark';

  return (
    <PageSection
      sectionId="home_products"
      variant="white"
      id="products"
      className="relative overflow-hidden"
    >
      <ProductsAtmosphere isDark={isDark} />
      <Container className="relative z-10">
        <SectionHeading
          eyebrow={section.eyebrow}
          title={section.title}
          subtitle={section.subtitle}
          size="large"
          theme={theme}
        />

        {isLoading ? (
          <div className="flex justify-center py-12">
            <Spinner size="lg" />
          </div>
        ) : display.length === 0 ? (
          <p className={cn('text-center', isDark ? 'text-slate-400' : 'text-slate-500')}>
            No software products published yet.
          </p>
        ) : (
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
            {display.map((product, index) => (
              <ProductCard key={product.id} product={product} index={index} isDark={isDark} />
            ))}
          </div>
        )}

        {display.length > 0 && (
          <div className="mt-12 text-center">
            <Link
              to="/products"
              className={cn(
                'inline-flex items-center gap-2 rounded-full border px-6 py-3 text-sm font-semibold transition-all duration-300',
                isDark
                  ? 'border-white/15 text-white hover:border-brand-gold-400/60 hover:bg-white/5'
                  : 'border-slate-300 text-primary-900 hover:border-brand-gold-400/60 hover:bg-white hover:shadow-sm',
              )}
            >
              Explore all products
              <ArrowRight className="h-4 w-4" />
            </Link>
          </div>
        )}
      </Container>
    </PageSection>
  );
}
