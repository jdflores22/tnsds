import { useClients } from '@/api/hooks';
import { Container } from '@/components/common/Container';
import { PageSection } from '@/components/common/SectionHeading';
import { SectionHeading } from '@/components/common/SectionHeading';
import { ClientLogoMarquee } from '@/components/effects/ClientLogoMarquee';
import { Spinner } from '@/components/ui/Spinner';
import { useSectionContent, usePageSectionTheme } from '@/hooks/useSectionContent';

export function TrustedCompanies() {
  const { data: clients, isLoading } = useClients();

  const section = useSectionContent('home_clients', {
    eyebrow: 'Trusted By',
    title: 'Organizations that rely on us',
    subtitle: 'We partner with companies across healthcare, finance, logistics, and technology to deliver software that performs in production.',
  });

  const theme = usePageSectionTheme('home_clients');

  if (!isLoading && !clients?.length) return null;

  return (
    <PageSection sectionId="home_clients" variant="muted" className="!py-14 lg:!py-16">
      <Container className="mb-10">
        <SectionHeading
          eyebrow={section.eyebrow}
          title={section.title}
          subtitle={section.subtitle}
          theme={theme}
        />
      </Container>

      {isLoading ? (
        <div className="flex justify-center py-8">
          <Spinner />
        </div>
      ) : (
        <ClientLogoMarquee clients={clients!} variant="light" />
      )}
    </PageSection>
  );
}
