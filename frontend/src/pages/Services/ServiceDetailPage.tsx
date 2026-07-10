import { Link, useParams } from 'react-router-dom';
import { useService } from '@/api/hooks';
import { SEOHead } from '@/components/common/SEOHead';
import { PageHero } from '@/components/common/PageHero';
import { Container } from '@/components/common/Container';
import { Button } from '@/components/ui/Button';
import { PageLoader } from '@/components/ui/Spinner';

export default function ServiceDetailPage() {
  const { slug } = useParams<{ slug: string }>();
  const { data: service, isLoading, isError } = useService(slug || '');

  if (isLoading) return <PageLoader />;
  if (isError || !service) {
    return (
      <Container className="py-20 text-center">
        <h1 className="text-2xl font-bold text-primary-900">Service not found</h1>
        <Link to="/services" className="mt-4 inline-block text-accent-600">Back to services</Link>
      </Container>
    );
  }

  return (
    <>
      <SEOHead title={`${service.title} | TRANS-NET`} description={service.shortDescription} />
      <PageHero title={service.title} subtitle={service.shortDescription} />
      <Container className="py-16">
        <div className="prose prose-slate mx-auto max-w-3xl">
          <div className="whitespace-pre-wrap text-slate-700">{service.description}</div>
        </div>
        <div className="mt-12 text-center">
          <Link to="/contact">
            <Button size="lg">Request This Service</Button>
          </Link>
        </div>
      </Container>
    </>
  );
}
