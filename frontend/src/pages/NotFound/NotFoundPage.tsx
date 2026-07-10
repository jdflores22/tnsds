import { Link } from 'react-router-dom';
import { SEOHead } from '@/components/common/SEOHead';
import { Container } from '@/components/common/Container';
import { Button } from '@/components/ui/Button';

export default function NotFoundPage() {
  return (
    <>
      <SEOHead title="404 | Page Not Found" />
      <Container className="flex min-h-[60vh] flex-col items-center justify-center py-20 text-center">
        <p className="text-6xl font-bold text-accent-500">404</p>
        <h1 className="mt-4 text-2xl font-bold text-primary-900">Page Not Found</h1>
        <p className="mt-2 text-slate-600">The page you&apos;re looking for doesn&apos;t exist.</p>
        <Link to="/" className="mt-8">
          <Button>Back to Home</Button>
        </Link>
      </Container>
    </>
  );
}
