import { Link } from 'react-router-dom';
import { MapPin, Briefcase } from 'lucide-react';
import { useCareers } from '@/api/hooks';
import { PageSEO } from '@/components/common/PageSEO';
import { PageHero } from '@/components/common/PageHero';
import { Container } from '@/components/common/Container';
import { Card, CardBody, CardTitle } from '@/components/ui/Card';
import { Badge } from '@/components/ui/Badge';
import { PageLoader } from '@/components/ui/Spinner';
import { usePageHeroContent } from '@/hooks/useSectionContent';

export default function CareersPage() {
  const { data: careers, isLoading } = useCareers();
  const hero = usePageHeroContent('careers_page', {
    title: 'Careers',
    subtitle: 'Build the future of enterprise software with us.',
  });

  if (isLoading) return <PageLoader />;

  return (
    <>
      <PageSEO pageKey="careers" title="Careers | TRANS-NET" description="Join the TRANS-NET team." />
      <PageHero title={hero.title} subtitle={hero.subtitle} />
      <Container className="py-16">
        <div className="space-y-4">
          {(careers || []).map((career) => (
            <Card key={career.id}>
              <CardBody className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
                <div>
                  <CardTitle>{career.title}</CardTitle>
                  <div className="mt-2 flex flex-wrap gap-3 text-sm text-slate-500">
                    <span className="flex items-center gap-1">
                      <Briefcase className="h-4 w-4" /> {career.department}
                    </span>
                    <span className="flex items-center gap-1">
                      <MapPin className="h-4 w-4" /> {career.location}
                    </span>
                  </div>
                </div>
                <Badge>{career.type}</Badge>
              </CardBody>
            </Card>
          ))}
          {!careers?.length && (
            <p className="text-center text-slate-500">No open positions at the moment. Check back soon!</p>
          )}
        </div>
        <div className="mt-12 text-center">
          <Link to="/contact" className="text-accent-600 hover:text-accent-700">
            Send us your resume →
          </Link>
        </div>
      </Container>
    </>
  );
}
