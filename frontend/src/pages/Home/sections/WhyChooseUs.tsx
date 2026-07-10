import { motion } from 'framer-motion';
import { useCompanyHighlights } from '@/api/hooks';
import { Container } from '@/components/common/Container';
import { PageSection } from '@/components/common/SectionHeading';
import { SectionHeading } from '@/components/common/SectionHeading';
import { Spinner } from '@/components/ui/Spinner';
import { useSectionContent, usePageSectionTheme } from '@/hooks/useSectionContent';

export function WhyChooseUs() {
  const { data: highlights, isLoading } = useCompanyHighlights();
  const sorted = [...(highlights ?? [])].sort((a, b) => a.sortOrder - b.sortOrder);
  const section = useSectionContent('home_why', {
    eyebrow: 'Why TRANS-NET',
    title: 'Built around what matters to you',
    subtitle: 'Engagements tied to delivery milestones, transparent scope, and outcomes you can measure.',
  });
  const theme = usePageSectionTheme('home_why');

  return (
    <PageSection sectionId="home_why" variant="muted">
      <Container>
        <SectionHeading
          eyebrow={section.eyebrow}
          title={section.title}
          subtitle={section.subtitle}
          size="large"
          theme={theme}
        />
        {isLoading ? (
          <div className="flex justify-center py-12">
            <Spinner size="lg" />
          </div>
        ) : sorted.length === 0 ? (
          <p className="text-center text-slate-500">No highlights published yet.</p>
        ) : (
          <div className="mx-auto grid max-w-5xl gap-6 md:grid-cols-2">
            {sorted.map((item, index) => (
              <motion.div
                key={item.id}
                initial={{ opacity: 0, y: 10 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: index * 0.05 }}
                className="sm-card flex gap-5 p-6"
              >
                <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-primary-50 text-sm font-semibold text-primary-800">
                  {index + 1}
                </span>
                <div>
                  <h3 className="text-base font-semibold text-primary-900">{item.title}</h3>
                  <p className="mt-2 text-sm leading-relaxed text-slate-600">{item.description}</p>
                </div>
              </motion.div>
            ))}
          </div>
        )}
      </Container>
    </PageSection>
  );
}
