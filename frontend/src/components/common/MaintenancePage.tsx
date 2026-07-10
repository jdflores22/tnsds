import { Link } from 'react-router-dom';
import { Construction } from 'lucide-react';
import { Container } from '@/components/common/Container';
import { Button } from '@/components/ui/Button';
import { PAGE_VISIBILITY_LABELS } from '@/constants/pageVisibility';

interface MaintenancePageProps {
  pageKey: string;
  message?: string;
}

export function MaintenancePage({ pageKey, message }: MaintenancePageProps) {
  const pageLabel = PAGE_VISIBILITY_LABELS[pageKey]?.label ?? 'This page';
  const displayMessage =
    message?.trim() ||
    `${pageLabel} is temporarily unavailable while we make improvements. Please check back soon.`;

  return (
    <section className="flex min-h-[60vh] items-center bg-slate-50 py-20">
      <Container>
        <div className="mx-auto max-w-lg text-center">
          <div className="mx-auto mb-6 flex h-16 w-16 items-center justify-center rounded-2xl bg-brand-gold-500/15">
            <Construction className="h-8 w-8 text-brand-gold-600" strokeWidth={1.5} />
          </div>
          <p className="text-sm font-medium uppercase tracking-[0.2em] text-brand-gold-600">
            Under maintenance
          </p>
          <h1 className="mt-3 text-2xl font-medium text-primary-900 sm:text-3xl">
            {pageLabel} is offline
          </h1>
          <p className="mt-4 text-slate-600">{displayMessage}</p>
          <div className="mt-8 flex flex-wrap justify-center gap-3">
            <Link to="/">
              <Button>Back to homepage</Button>
            </Link>
            <Link to="/contact">
              <Button variant="outline">Contact us</Button>
            </Link>
          </div>
        </div>
      </Container>
    </section>
  );
}
