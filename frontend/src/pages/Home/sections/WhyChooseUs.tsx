import { motion } from 'framer-motion';
import { useCompanyHighlights } from '@/api/hooks';
import { Container } from '@/components/common/Container';
import { PageSection } from '@/components/common/SectionHeading';
import { SectionHeading } from '@/components/common/SectionHeading';
import { Spinner } from '@/components/ui/Spinner';
import { useSectionContent, usePageSectionTheme } from '@/hooks/useSectionContent';
import { cn } from '@/utils/cn';

export function WhyChooseUs() {
  const { data: highlights, isLoading } = useCompanyHighlights();
  const sorted = [...(highlights ?? [])].sort((a, b) => a.sortOrder - b.sortOrder);
  const section = useSectionContent('home_why', {
    eyebrow: 'Why TRANS-NET',
    title: 'Built around what matters to you',
    subtitle: 'Engagements tied to delivery milestones, transparent scope, and outcomes you can measure.',
  });
  const theme = usePageSectionTheme('home_why');
  const isDark = theme === 'dark';

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
          <p className={cn('text-center', isDark ? 'text-slate-400' : 'text-slate-500')}>
            No highlights published yet.
          </p>
        ) : (
          <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
            {sorted.map((item, index) => (
              <motion.div
                key={item.id}
                initial={{ opacity: 0, y: 16 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: index * 0.05, duration: 0.4 }}
                className={cn(
                  'group relative flex flex-col overflow-hidden rounded-2xl border p-7 transition-all duration-300',
                  isDark
                    ? 'border-white/10 bg-white/[0.03] hover:border-brand-gold-400/40 hover:bg-white/[0.06]'
                    : 'border-slate-200 bg-white hover:-translate-y-1 hover:border-brand-gold-400/60 hover:shadow-[0_24px_50px_-30px_rgba(10,26,46,0.5)]',
                )}
              >
                {/* Oversized watermark index */}
                <span
                  className={cn(
                    'pointer-events-none absolute -right-2 -top-4 select-none text-7xl font-bold leading-none transition-colors',
                    isDark ? 'text-white/[0.04]' : 'text-primary-900/[0.04]',
                  )}
                >
                  {String(index + 1).padStart(2, '0')}
                </span>

                <span
                  className={cn(
                    'relative flex h-11 w-11 items-center justify-center rounded-xl text-base font-bold text-white shadow-sm',
                    'bg-gradient-to-br from-primary-700 via-primary-800 to-primary-900',
                  )}
                >
                  {index + 1}
                  <span
                    className={cn(
                      'absolute -bottom-0.5 -right-0.5 h-3 w-3 rounded-full bg-brand-gold-500 ring-2 transition-transform duration-300 group-hover:scale-110',
                      isDark ? 'ring-primary-900' : 'ring-white',
                    )}
                  />
                </span>

                <h3
                  className={cn(
                    'relative mt-5 text-lg font-semibold tracking-tight',
                    isDark ? 'text-white' : 'text-primary-900',
                  )}
                >
                  {item.title}
                </h3>
                <p
                  className={cn(
                    'relative mt-2.5 text-sm leading-relaxed',
                    isDark ? 'text-slate-400' : 'text-slate-600',
                  )}
                >
                  {item.description}
                </p>

                <span className="mt-6 h-px w-full origin-left scale-x-0 bg-gradient-to-r from-brand-gold-500/70 to-transparent transition-transform duration-300 group-hover:scale-x-100" />
              </motion.div>
            ))}
          </div>
        )}
      </Container>
    </PageSection>
  );
}
