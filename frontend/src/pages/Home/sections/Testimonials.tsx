import { useEffect, useState } from 'react';
import { AnimatePresence, motion } from 'framer-motion';
import { Quote } from 'lucide-react';
import { useTestimonials } from '@/api/hooks';
import { Container } from '@/components/common/Container';
import { PageSection } from '@/components/common/SectionHeading';
import { SectionHeading } from '@/components/common/SectionHeading';
import { Spinner } from '@/components/ui/Spinner';
import { useSectionContent, usePageSectionTheme } from '@/hooks/useSectionContent';

export function Testimonials() {
  const { data: testimonials, isLoading } = useTestimonials();
  const items = testimonials ?? [];
  const [active, setActive] = useState(0);

  const section = useSectionContent('home_testimonials', {
    eyebrow: 'Client Testimonials',
    title: 'What our partners say',
    subtitle: 'Long-term relationships built on transparency, quality, and delivery you can count on.',
  });

  useEffect(() => {
    if (items.length <= 1) return;
    const id = window.setInterval(() => setActive((i) => (i + 1) % items.length), 7000);
    return () => window.clearInterval(id);
  }, [items.length]);

  const current = items[active];
  const theme = usePageSectionTheme('home_testimonials');

  if (!isLoading && items.length === 0) return null;

  return (
    <PageSection sectionId="home_testimonials" variant="white">
      <Container>
        <SectionHeading
          eyebrow={section.eyebrow}
          title={section.title}
          subtitle={section.subtitle}
          theme={theme}
        />

        {isLoading ? (
          <div className="flex justify-center py-12">
            <Spinner size="lg" />
          </div>
        ) : items.length === 0 ? null : (
          <div className="mx-auto max-w-4xl">
            <div className="pro-card relative px-8 py-10 sm:px-12 sm:py-12">
              <Quote className="absolute left-6 top-6 h-8 w-8 text-brand-gold-500/30 sm:left-8 sm:top-8" />
              <AnimatePresence mode="wait">
                <motion.div
                  key={current.id}
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                  transition={{ duration: 0.35 }}
                  className="text-center"
                >
                  <p className="text-lg leading-relaxed text-slate-700 sm:text-xl">
                    &ldquo;{current.quote}&rdquo;
                  </p>
                  <div className="mt-8 border-t border-slate-100 pt-6">
                    <p className="font-semibold text-primary-900">{current.name}</p>
                    <p className="mt-1 text-sm text-slate-500">{current.company}</p>
                  </div>
                </motion.div>
              </AnimatePresence>
            </div>

            {items.length > 1 && (
              <div className="mt-8 flex justify-center gap-2">
                {items.map((_, i) => (
                  <button
                    key={i}
                    type="button"
                    aria-label={`Show testimonial ${i + 1}`}
                    onClick={() => setActive(i)}
                    className={`h-2 rounded-full transition-all ${
                      i === active ? 'w-8 bg-brand-gold-500' : 'w-2 bg-slate-300 hover:bg-slate-400'
                    }`}
                  />
                ))}
              </div>
            )}
          </div>
        )}
      </Container>
    </PageSection>
  );
}
