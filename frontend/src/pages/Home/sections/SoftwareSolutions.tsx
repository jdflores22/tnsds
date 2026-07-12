import { Link } from 'react-router-dom';
import { ArrowUpRight } from 'lucide-react';
import { useProducts } from '@/api/hooks';
import type { SoftwareProduct } from '@/types';
import { Container } from '@/components/common/Container';
import { PageSection, SectionHeading } from '@/components/common/SectionHeading';
import { Card, CardBody } from '@/components/ui/Card';
import { Spinner } from '@/components/ui/Spinner';
import { useSectionContent, usePageSectionTheme } from '@/hooks/useSectionContent';
import { resolveMediaUrl } from '@/utils/media';
import { cn } from '@/utils/cn';

const brandBorders = [
  'border-b-brand-gold-500',
  'border-b-primary-700',
  'border-b-brand-gold-600',
] as const;

function ProductCard({ product, index }: { product: SoftwareProduct; index: number }) {
  const logoUrl = product.logoUrl ? resolveMediaUrl(product.logoUrl) : null;

  return (
    <Link to={`/products/${product.slug}`} className="group block">
      <Card
        className={cn(
          'overflow-hidden border-b-4 transition-shadow hover:shadow-md',
          brandBorders[index % brandBorders.length],
        )}
      >
        <CardBody className="text-center">
          <div className="mx-auto mb-3 flex h-14 w-14 items-center justify-center rounded-xl bg-primary-50">
            {logoUrl ? (
              <img src={logoUrl} alt={product.name} className="max-h-10 max-w-10 object-contain" />
            ) : (
              <span className="text-lg font-medium text-primary-800">{product.name.charAt(0)}</span>
            )}
          </div>
          <h3 className="text-sm font-medium text-primary-900">{product.name}</h3>
          {product.shortDescription && (
            <p className="mt-2 line-clamp-2 text-xs text-slate-500">{product.shortDescription}</p>
          )}
          <span className="mt-3 inline-flex items-center gap-1 text-xs font-semibold text-primary-800 group-hover:text-brand-gold-600">
            Learn more
            <ArrowUpRight className="h-3 w-3" />
          </span>
        </CardBody>
      </Card>
    </Link>
  );
}

function ProductRow({ products }: { products: SoftwareProduct[] }) {
  if (products.length === 0) return null;

  return (
    <div className="flex flex-wrap justify-center gap-4">
      {products.map((product, index) => (
        <div
          key={product.id}
          className="w-full max-w-sm sm:w-[calc(50%-0.5rem)] sm:max-w-[calc(50%-0.5rem)] lg:w-[calc(25%-0.75rem)] lg:max-w-[calc(25%-0.75rem)]"
        >
          <ProductCard product={product} index={index} />
        </div>
      ))}
    </div>
  );
}

export function SoftwareSolutions() {
  const { data: products, isLoading } = useProducts();
  const sorted = [...(products ?? [])].sort((a, b) => a.sortOrder - b.sortOrder);
  const row1 = sorted.filter((p) => (p.homepageRow ?? 1) === 1);
  const row2 = sorted.filter((p) => (p.homepageRow ?? 1) === 2);

  const section = useSectionContent('home_products', {
    eyebrow: 'Products',
    title: 'Software Solutions',
    subtitle: 'Ready-to-deploy and customizable enterprise software products.',
  });

  const theme = usePageSectionTheme('home_products');

  return (
    <PageSection sectionId="home_products" variant="white" className="!py-20">
      <Container>
        <SectionHeading eyebrow={section.eyebrow} title={section.title} subtitle={section.subtitle} theme={theme} />
        {isLoading ? (
          <div className="flex justify-center py-12">
            <Spinner size="lg" />
          </div>
        ) : sorted.length === 0 ? (
          <p className="text-center text-slate-500">No software products published yet.</p>
        ) : (
          <div className="space-y-4">
            <ProductRow products={row1} />
            <ProductRow products={row2} />
          </div>
        )}
      </Container>
    </PageSection>
  );
}
