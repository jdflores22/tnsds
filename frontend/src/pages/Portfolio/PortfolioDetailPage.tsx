import { Link, useParams } from 'react-router-dom';
import { ArrowLeft } from 'lucide-react';
import { usePortfolioItem } from '@/api/hooks';
import { SEOHead } from '@/components/common/SEOHead';
import { Container } from '@/components/common/Container';
import { Badge } from '@/components/ui/Badge';
import { PageLoader } from '@/components/ui/Spinner';
import { parsePortfolioImages, parseTechStack } from '@/utils/portfolio';
import { resolveMediaUrl } from '@/utils/media';

export default function PortfolioDetailPage() {
  const { slug } = useParams<{ slug: string }>();
  const { data: item, isLoading, isError } = usePortfolioItem(slug || '');

  if (isLoading) return <PageLoader />;
  if (isError || !item) {
    return (
      <Container className="py-20 text-center">
        <h1 className="text-2xl font-bold">Project not found</h1>
        <Link to="/portfolio" className="mt-4 inline-block text-brand-gold-600">
          Back to portfolio
        </Link>
      </Container>
    );
  }

  const techStack = parseTechStack(item.techStackJson);
  const images = parsePortfolioImages(item.imagesJson);
  const coverImage = images[0];
  const galleryImages = images.slice(1);

  return (
    <>
      <SEOHead title={`${item.title} | TRANS-NET Portfolio`} description={item.description} />

      {coverImage ? (
        <div className="relative h-64 overflow-hidden bg-primary-900 sm:h-80 lg:h-96">
          <img src={coverImage} alt={item.title} className="h-full w-full object-cover opacity-90" />
          <div className="absolute inset-0 bg-gradient-to-t from-primary-900/90 via-primary-900/40 to-transparent" />
          <Container className="absolute inset-x-0 bottom-0 pb-10">
            <Link
              to="/portfolio"
              className="mb-4 inline-flex items-center gap-1.5 text-sm text-slate-300 hover:text-white"
            >
              <ArrowLeft className="h-4 w-4" />
              Back to portfolio
            </Link>
            <div className="flex items-end gap-4">
              {item.logoUrl && (
                <div className="flex h-16 w-16 shrink-0 items-center justify-center rounded-xl bg-white p-2 shadow-lg">
                  <img
                    src={resolveMediaUrl(item.logoUrl)}
                    alt={`${item.title} logo`}
                    className="max-h-full max-w-full object-contain"
                  />
                </div>
              )}
              <div>
                <h1 className="text-3xl font-medium uppercase tracking-tight text-white sm:text-4xl">
                  {item.title}
                </h1>
                {item.description && (
                  <p className="mt-3 max-w-2xl text-lg text-slate-300">{item.description}</p>
                )}
              </div>
            </div>
          </Container>
        </div>
      ) : (
        <section className="bg-primary-900 py-16 text-white circuit-bg">
          <Container>
            <Link
              to="/portfolio"
              className="mb-4 inline-flex items-center gap-1.5 text-sm text-slate-300 hover:text-white"
            >
              <ArrowLeft className="h-4 w-4" />
              Back to portfolio
            </Link>
            <div className="flex items-start gap-4">
              {item.logoUrl && (
                <div className="flex h-16 w-16 shrink-0 items-center justify-center rounded-xl bg-white p-2 shadow-md">
                  <img
                    src={resolveMediaUrl(item.logoUrl)}
                    alt={`${item.title} logo`}
                    className="max-h-full max-w-full object-contain"
                  />
                </div>
              )}
              <div>
                <h1 className="text-3xl font-medium uppercase tracking-tight sm:text-4xl">{item.title}</h1>
                {item.description && (
                  <p className="mt-3 max-w-2xl text-lg text-slate-300">{item.description}</p>
                )}
              </div>
            </div>
          </Container>
        </section>
      )}

      <Container className="py-16">
        <div className="mx-auto max-w-3xl">
          {techStack.length > 0 && (
            <div className="mb-8 flex flex-wrap gap-2">
              {techStack.map((tech) => (
                <Badge key={tech}>{tech}</Badge>
              ))}
            </div>
          )}

          {galleryImages.length > 0 && (
            <div className="mb-10 grid gap-4 sm:grid-cols-2">
              {galleryImages.map((src) => (
                <img
                  key={src}
                  src={src}
                  alt=""
                  className="rounded-lg border border-slate-200 object-cover"
                  loading="lazy"
                />
              ))}
            </div>
          )}

          <div className="prose prose-slate max-w-none whitespace-pre-wrap text-slate-700">
            {item.content || item.description}
          </div>
        </div>
      </Container>
    </>
  );
}
