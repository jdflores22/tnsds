import { useState } from 'react';
import { useFaqItems } from '@/api/hooks';
import { Container } from '@/components/common/Container';
import { PageSection } from '@/components/common/SectionHeading';
import { SectionHeading } from '@/components/common/SectionHeading';
import { Spinner } from '@/components/ui/Spinner';
import { useSectionContent, usePageSectionTheme } from '@/hooks/useSectionContent';
import { ChevronDown } from 'lucide-react';
import { cn } from '@/utils/cn';

export function FAQ() {
  const [openIndex, setOpenIndex] = useState<number | null>(0);
  const { data: faqItems, isLoading } = useFaqItems();
  const sorted = [...(faqItems ?? [])].sort((a, b) => a.sortOrder - b.sortOrder);
  const section = useSectionContent('home_faq', {
    eyebrow: 'FAQ',
    title: 'Common questions',
    subtitle: 'Everything you need to know about working with us — from engagement models to timelines.',
  });

  const theme = usePageSectionTheme('home_faq');

  return (
    <PageSection sectionId="home_faq" variant="muted">
      <Container>
        <SectionHeading eyebrow={section.eyebrow} title={section.title} subtitle={section.subtitle} theme={theme} />
        {isLoading ? (
          <div className="flex justify-center py-12">
            <Spinner size="lg" />
          </div>
        ) : sorted.length === 0 ? (
          <p className="text-center text-slate-500">No FAQ items published yet.</p>
        ) : (
          <div className="mx-auto max-w-3xl space-y-3">
            {sorted.map((item, index) => (
              <div key={item.id} className="pro-card overflow-hidden">
                <button
                  type="button"
                  className="flex w-full items-center justify-between gap-4 px-6 py-5 text-left"
                  onClick={() => setOpenIndex(openIndex === index ? null : index)}
                >
                  <span className="font-semibold text-primary-900">{item.question}</span>
                  <ChevronDown
                    className={cn(
                      'h-5 w-5 shrink-0 text-slate-400 transition-transform',
                      openIndex === index && 'rotate-180',
                    )}
                  />
                </button>
                {openIndex === index && (
                  <p className="border-t border-slate-100 px-6 pb-5 pt-0 text-sm leading-relaxed text-slate-600">
                    {item.answer}
                  </p>
                )}
              </div>
            ))}
          </div>
        )}
      </Container>
    </PageSection>
  );
}
