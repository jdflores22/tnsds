import type { SoftwareProduct } from '@/types';
import { Container } from '@/components/common/Container';
import { SectionHeading } from '@/components/common/SectionHeading';
import { useSectionContent, useSectionDarkBackground } from '@/hooks/useSectionContent';
import { sectionSurfaceClass } from '@/utils/sectionSurface';
import { ProductCatalogCard } from '@/pages/Products/sections/ProductCatalogCard';

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
    <section className={sectionSurfaceClass(isDark)}>
      <Container>
        <SectionHeading
          eyebrow={section.eyebrow}
          title={section.title}
          subtitle={section.subtitle}
          size="large"
          theme={isDark ? 'dark' : 'light'}
        />

        <div className="flex flex-wrap justify-center gap-5">
          {products.map((product, index) => (
            <ProductCatalogCard key={product.id} product={product} index={index} />
          ))}
        </div>
      </Container>
    </section>
  );
}
