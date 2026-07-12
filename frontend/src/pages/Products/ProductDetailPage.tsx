import { Link, useParams } from 'react-router-dom';
import { ArrowRight, CheckCircle2 } from 'lucide-react';
import { useProductBySlug } from '@/api/hooks';
import { Container } from '@/components/common/Container';
import { PageSEO } from '@/components/common/PageSEO';
import { Button } from '@/components/ui/Button';
import { PageLoader } from '@/components/ui/Spinner';
import { resolveMediaUrl } from '@/utils/media';
import { parseJsonArray } from '@/utils/jsonArray';

export default function ProductDetailPage() {
  const { slug } = useParams<{ slug: string }>();
  const { data: product, isLoading, isError } = useProductBySlug(slug ?? '');

  if (isLoading) return <PageLoader />;
  if (isError || !product) {
    return (
      <Container className="py-20 text-center">
        <h1 className="text-2xl font-bold">Product not found</h1>
        <Link to="/products" className="mt-4 inline-block text-accent-600">Back to products</Link>
      </Container>
    );
  }

  const features = parseJsonArray(product.featuresJson);
  const screenshots = parseJsonArray(product.screenshotsJson);
  const logoUrl = product.logoUrl ? resolveMediaUrl(product.logoUrl) : null;

  return (
    <>
      <PageSEO
        title={`${product.name} | TRANS-NET Software`}
        description={product.shortDescription || product.description?.slice(0, 160)}
      />
      <section className="border-b border-slate-200 bg-gradient-to-br from-primary-950 via-primary-900 to-primary-950 py-16 text-white">
        <Container>
          <div className="flex flex-col gap-8 lg:flex-row lg:items-center lg:justify-between">
            <div className="max-w-2xl">
              <p className="text-xs font-semibold uppercase tracking-widest text-brand-gold-400">Software product</p>
              <div className="mt-4 flex items-center gap-4">
                {logoUrl && (
                  <img src={logoUrl} alt="" className="h-16 w-16 rounded-xl bg-white p-2 object-contain" />
                )}
                <h1 className="text-3xl font-bold tracking-tight sm:text-4xl">{product.name}</h1>
              </div>
              <p className="mt-4 text-lg text-slate-300">{product.shortDescription}</p>
              <div className="mt-8 flex flex-wrap gap-3">
                <Link to="/contact">
                  <Button className="bg-brand-gold-500 text-primary-950 hover:bg-brand-gold-400">
                    Request demo
                    <ArrowRight className="ml-2 h-4 w-4" />
                  </Button>
                </Link>
                <Link to="/products">
                  <Button variant="outline" className="border-white/20 text-white hover:bg-white/10">
                    All products
                  </Button>
                </Link>
              </div>
            </div>
          </div>
        </Container>
      </section>

      <Container className="py-16">
        <div className="grid gap-12 lg:grid-cols-3">
          <div className="lg:col-span-2 space-y-10">
            {product.description && (
              <section>
                <h2 className="text-xl font-semibold text-primary-900">Overview</h2>
                <div
                  className="prose prose-slate mt-4 max-w-none prose-p:text-slate-600"
                  dangerouslySetInnerHTML={{ __html: product.description }}
                />
              </section>
            )}

            {screenshots.length > 0 && (
              <section>
                <h2 className="text-xl font-semibold text-primary-900">Screenshots</h2>
                <div className="mt-4 grid gap-4 sm:grid-cols-2">
                  {screenshots.map((url) => (
                    <img
                      key={url}
                      src={resolveMediaUrl(url)}
                      alt=""
                      className="rounded-xl border border-slate-200 shadow-sm"
                      loading="lazy"
                    />
                  ))}
                </div>
              </section>
            )}
          </div>

          {features.length > 0 && (
            <aside>
              <div className="sticky top-24 rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
                <h2 className="text-lg font-semibold text-primary-900">Key features</h2>
                <ul className="mt-4 space-y-3">
                  {features.map((feature) => (
                    <li key={feature} className="flex gap-2.5 text-sm text-slate-600">
                      <CheckCircle2 className="mt-0.5 h-4 w-4 shrink-0 text-brand-gold-500" />
                      {feature}
                    </li>
                  ))}
                </ul>
                <Link to="/contact" className="mt-6 block">
                  <Button className="w-full">Talk to sales</Button>
                </Link>
              </div>
            </aside>
          )}
        </div>
      </Container>
    </>
  );
}
