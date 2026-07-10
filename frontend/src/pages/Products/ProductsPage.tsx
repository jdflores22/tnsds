import { Link } from 'react-router-dom';
import { ArrowRight, ArrowUpRight } from 'lucide-react';
import { useProducts } from '@/api/hooks';
import { Container } from '@/components/common/Container';
import { PageHero } from '@/components/common/PageHero';
import { PageSEO } from '@/components/common/PageSEO';
import { Card, CardBody } from '@/components/ui/Card';
import { PageLoader } from '@/components/ui/Spinner';
import { resolveMediaUrl } from '@/utils/media';
import { cn } from '@/utils/cn';

const brandBorders = [
  'border-b-brand-gold-500',
  'border-b-primary-700',
  'border-b-brand-gold-600',
] as const;

export default function ProductsPage() {
  const { data: products, isLoading } = useProducts();
  const sorted = [...(products ?? [])].sort((a, b) => a.sortOrder - b.sortOrder);

  if (isLoading) return <PageLoader />;

  return (
    <>
      <PageSEO
        pageKey="products"
        title="Software Products | TRANS-NET"
        description="Enterprise software products — ECMS, CRM, ERP and customizable solutions from TRANS-NET."
      />
      <PageHero
        title="Software Products"
        subtitle="Ready-to-deploy and customizable enterprise software built for real-world operations."
      />
      <Container className="py-16">
        {sorted.length === 0 ? (
          <p className="text-center text-slate-500">No products published yet.</p>
        ) : (
          <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {sorted.map((product, index) => {
              const logoUrl = product.logoUrl ? resolveMediaUrl(product.logoUrl) : null;
              return (
                <Link key={product.id} to={`/products/${product.slug}`} className="group">
                  <Card
                    className={cn(
                      'h-full overflow-hidden border-b-4 transition-all hover:-translate-y-0.5 hover:shadow-lg',
                      brandBorders[index % brandBorders.length],
                    )}
                  >
                    <CardBody>
                      <div className="mb-4 flex h-16 w-16 items-center justify-center rounded-xl bg-primary-50">
                        {logoUrl ? (
                          <img src={logoUrl} alt="" className="max-h-12 max-w-12 object-contain" />
                        ) : (
                          <span className="text-xl font-semibold text-primary-800">
                            {product.name.charAt(0)}
                          </span>
                        )}
                      </div>
                      <h2 className="text-lg font-semibold text-primary-900 group-hover:text-primary-700">
                        {product.name}
                      </h2>
                      <p className="mt-2 line-clamp-3 text-sm text-slate-600">
                        {product.shortDescription}
                      </p>
                      <span className="mt-4 inline-flex items-center gap-1 text-sm font-semibold text-primary-800 group-hover:text-brand-gold-600">
                        View product
                        <ArrowUpRight className="h-4 w-4 transition-transform group-hover:translate-x-0.5 group-hover:-translate-y-0.5" />
                      </span>
                    </CardBody>
                  </Card>
                </Link>
              );
            })}
          </div>
        )}

        <div className="mt-16 rounded-2xl border border-primary-100 bg-gradient-to-br from-primary-50 to-white p-8 text-center sm:p-10">
          <h2 className="text-xl font-semibold text-primary-900">Need a custom demo or deployment?</h2>
          <p className="mx-auto mt-2 max-w-xl text-sm text-slate-600">
            Our team can tailor any product to your workflows, integrate with existing systems, and support you in production.
          </p>
          <Link
            to="/contact"
            className="mt-6 inline-flex items-center gap-2 rounded-lg bg-primary-900 px-6 py-3 text-sm font-semibold text-white transition-colors hover:bg-primary-800"
          >
            Request a demo
            <ArrowRight className="h-4 w-4" />
          </Link>
        </div>
      </Container>
    </>
  );
}
