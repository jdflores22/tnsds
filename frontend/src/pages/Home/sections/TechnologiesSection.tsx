import { useTechnologies } from '@/api/hooks';
import { Container } from '@/components/common/Container';
import { PageSection } from '@/components/common/SectionHeading';
import { SectionHeading } from '@/components/common/SectionHeading';
import { TechStackShowcase } from '@/components/marketing/TechStackShowcase';
import { Spinner } from '@/components/ui/Spinner';
import { useSectionContent, usePageSectionTheme } from '@/hooks/useSectionContent';

export function TechnologiesSection() {
  const { data: technologies, isLoading } = useTechnologies();
  const items = [...(technologies ?? [])].sort((a, b) => a.sortOrder - b.sortOrder);

  const section = useSectionContent('home_technologies', {
    eyebrow: 'Technologies',
    title: 'Modern Tech Stack',
    subtitle: 'From frontend to backend — we choose reliable, maintainable tools for every layer of your software.',
  });

  const theme = usePageSectionTheme('home_technologies');

  return (
    <PageSection sectionId="home_technologies" variant="white">
      <Container>
        <SectionHeading
          eyebrow={section.eyebrow}
          title={section.title}
          subtitle={section.subtitle}
          size="large"
          theme={theme}
        />
      </Container>

      <div className="relative mt-10 overflow-hidden">
        <div
          className="pointer-events-none absolute inset-0 opacity-60"
          aria-hidden
          style={{
            background:
              'radial-gradient(ellipse 80% 50% at 50% 0%, rgba(212,160,23,0.08) 0%, transparent 55%), radial-gradient(ellipse 60% 40% at 20% 100%, rgba(45,85,128,0.06) 0%, transparent 50%), radial-gradient(ellipse 50% 35% at 85% 80%, rgba(14,165,233,0.05) 0%, transparent 50%)',
          }}
        />

        <Container className="relative">
          {isLoading ? (
            <div className="flex justify-center py-12">
              <Spinner size="lg" />
            </div>
          ) : (
            <TechStackShowcase technologies={items} />
          )}
        </Container>
      </div>
    </PageSection>
  );
}
