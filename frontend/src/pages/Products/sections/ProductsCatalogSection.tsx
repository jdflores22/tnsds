import type { SoftwareProduct } from '@/types';
import { Container } from '@/components/common/Container';
import { SectionHeading } from '@/components/common/SectionHeading';
import { useSectionContent, useSectionDarkBackground } from '@/hooks/useSectionContent';
import { sectionSurfaceClass } from '@/utils/sectionSurface';
import { hexToRgba } from '@/utils/color';
import { ProductCatalogCard } from '@/pages/Products/sections/ProductCatalogCard';
import { cn } from '@/utils/cn';

const GOLD = '#d4a017';
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

function CatalogAtmosphere({ isDark }: { isDark: boolean }) {
  const gold = isDark ? 'rgba(212,160,23,0.26)' : 'rgba(212,160,23,0.18)';
  const goldSoft = isDark ? 'rgba(212,160,23,0.12)' : 'rgba(212,160,23,0.1)';
  const ink = isDark ? 'rgba(255,255,255,0.07)' : 'rgba(10,26,46,0.05)';
  const fill = isDark ? 'rgba(212,160,23,0.04)' : 'rgba(212,160,23,0.03)';

  return (
    <div className="pointer-events-none absolute inset-0 overflow-hidden" aria-hidden>
      <div
        className="absolute inset-0"
        style={{
          background: isDark
            ? `radial-gradient(ellipse 60% 45% at 12% 20%, ${hexToRgba(GOLD, 0.12)} 0%, transparent 55%), radial-gradient(ellipse 50% 40% at 90% 80%, rgba(61,111,150,0.16) 0%, transparent 50%)`
            : `radial-gradient(ellipse 60% 45% at 10% 15%, ${hexToRgba(GOLD, 0.08)} 0%, transparent 55%), radial-gradient(ellipse 50% 40% at 92% 85%, rgba(26,58,102,0.05) 0%, transparent 50%)`,
        }}
      />

      <svg
        className="absolute -left-[5%] top-[4%] h-[88%] w-[36%] max-w-sm opacity-85"
        viewBox="0 0 140 180"
        fill="none"
        style={{
          maskImage: 'linear-gradient(90deg, black 0%, black 40%, transparent 95%)',
          WebkitMaskImage: 'linear-gradient(90deg, black 0%, black 40%, transparent 95%)',
        }}
      >
        {HONEYCOMB.map((cell, i) => (
          <polygon
            key={`cL-${i}`}
            points={hexPoints(cell.x, cell.y, cell.s * 0.9)}
            stroke={i % 5 === 0 ? goldSoft : ink}
            strokeWidth={i % 5 === 0 ? 1 : 0.65}
            fill={i % 7 === 0 ? fill : 'none'}
          />
        ))}
      </svg>

      <svg
        className="absolute -right-[4%] top-[10%] h-[80%] w-[34%] max-w-sm opacity-80"
        viewBox="0 0 140 180"
        fill="none"
        style={{
          maskImage: 'linear-gradient(270deg, black 0%, black 35%, transparent 92%)',
          WebkitMaskImage: 'linear-gradient(270deg, black 0%, black 35%, transparent 92%)',
        }}
      >
        {HONEYCOMB.map((cell, i) => (
          <polygon
            key={`cR-${i}`}
            points={hexPoints(cell.x, cell.y, cell.s * 0.9)}
            stroke={i % 4 === 1 ? goldSoft : ink}
            strokeWidth={0.7}
            fill="none"
          />
        ))}
      </svg>

      <svg
        className="absolute right-[6%] top-[8%] h-40 w-36 opacity-60"
        viewBox="0 0 100 104"
        fill="none"
      >
        <path d={HEX_PATH} stroke={gold} strokeWidth="1.2" />
        <path
          d={HEX_PATH}
          stroke={ink}
          strokeWidth="0.8"
          strokeDasharray="4 5"
          transform="translate(8 6) scale(0.84)"
        />
      </svg>
    </div>
  );
}

interface ProductsCatalogSectionProps {
  products: SoftwareProduct[];
}

export function ProductsCatalogSection({ products }: ProductsCatalogSectionProps) {
  const isDark = useSectionDarkBackground('products_catalog');
  const section = useSectionContent('products_catalog', {
    eyebrow: 'Product catalog',
    title: 'All software solutions',
    subtitle:
      'Browse our full suite of enterprise products — each customizable to your workflows and integration needs.',
  });

  if (products.length === 0) return null;

  return (
    <section className={cn(sectionSurfaceClass(isDark), 'relative overflow-hidden')}>
      <CatalogAtmosphere isDark={isDark} />
      <Container className="relative z-10">
        <SectionHeading
          eyebrow={section.eyebrow}
          title={section.title}
          subtitle={section.subtitle}
          size="large"
          theme={isDark ? 'dark' : 'light'}
        />

        <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
          {products.map((product, index) => (
            <ProductCatalogCard key={product.id} product={product} index={index} isDark={isDark} />
          ))}
        </div>
      </Container>
    </section>
  );
}
