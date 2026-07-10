import { Link } from 'react-router-dom';
import { ArrowRight, ArrowUpRight, Code2, Layers, Smartphone, Wrench } from 'lucide-react';
import { motion } from 'framer-motion';
import { useServices } from '@/api/hooks';
import { Container } from '@/components/common/Container';
import { PageSection } from '@/components/common/SectionHeading';
import { SectionHeading } from '@/components/common/SectionHeading';
import { Spinner } from '@/components/ui/Spinner';
import { useSectionContent, usePageSectionTheme } from '@/hooks/useSectionContent';
import { cn } from '@/utils/cn';

const icons = [Code2, Smartphone, Layers, Wrench];

export function ServicesSection() {
  const { data: services, isLoading } = useServices();
  const displayServices = services?.slice(0, 4) ?? [];
  const section = useSectionContent('home_services', {
    eyebrow: 'Services',
    title: 'Engineering aligned to your business',
    subtitle: 'From discovery to delivery and support — we help you build software that performs in production.',
  });
  const theme = usePageSectionTheme('home_services');
  const isDark = theme === 'dark';

  return (
    <PageSection sectionId="home_services" variant="muted" id="services">
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
        ) : displayServices.length === 0 ? (
          <p className={cn('text-center', isDark ? 'text-slate-400' : 'text-slate-500')}>
            No services published yet.
          </p>
        ) : (
          <div className="grid gap-5 lg:grid-cols-2">
            {displayServices.map((service, index) => {
              const Icon = icons[index % icons.length];
              return (
                <motion.div
                  key={service.id}
                  initial={{ opacity: 0, y: 16 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: index * 0.06, duration: 0.4 }}
                >
                  <Link
                    to={`/services/${service.slug}`}
                    className={cn(
                      'group relative flex h-full flex-col overflow-hidden rounded-2xl border p-8 transition-all duration-300',
                      isDark
                        ? 'border-white/10 bg-white/[0.03] hover:border-brand-gold-400/40 hover:bg-white/[0.06]'
                        : 'border-slate-200 bg-white hover:border-brand-gold-400/60 hover:shadow-[0_20px_45px_-25px_rgba(10,26,46,0.45)]',
                    )}
                  >
                    {/* Top accent bar reveals on hover */}
                    <span className="absolute inset-x-0 top-0 h-1 origin-left scale-x-0 bg-gradient-to-r from-primary-600 via-brand-gold-500 to-brand-red-500 transition-transform duration-300 group-hover:scale-x-100" />

                    <div className="mb-6 flex items-start justify-between">
                      <div
                        className={cn(
                          'flex h-14 w-14 items-center justify-center rounded-xl transition-colors duration-300',
                          isDark
                            ? 'bg-white/5 text-brand-gold-400 group-hover:bg-brand-gold-400/15'
                            : 'bg-primary-50 text-primary-800 group-hover:bg-primary-900 group-hover:text-white',
                        )}
                      >
                        <Icon className="h-6 w-6" strokeWidth={1.5} />
                      </div>
                      <span
                        className={cn(
                          'font-mono text-sm font-semibold tabular-nums',
                          isDark ? 'text-white/25' : 'text-slate-300',
                        )}
                      >
                        {String(index + 1).padStart(2, '0')}
                      </span>
                    </div>

                    <h3
                      className={cn(
                        'text-xl font-semibold tracking-tight',
                        isDark ? 'text-white' : 'text-primary-900',
                      )}
                    >
                      {service.title}
                    </h3>
                    <p
                      className={cn(
                        'mt-3 flex-1 text-sm leading-relaxed',
                        isDark ? 'text-slate-400' : 'text-slate-600',
                      )}
                    >
                      {service.shortDescription}
                    </p>

                    <span
                      className={cn(
                        'mt-6 inline-flex items-center gap-1.5 text-sm font-semibold transition-colors',
                        isDark
                          ? 'text-brand-gold-400 group-hover:text-brand-gold-300'
                          : 'text-primary-800 group-hover:text-brand-gold-600',
                      )}
                    >
                      Learn more
                      <ArrowUpRight className="h-4 w-4 transition-transform duration-300 group-hover:translate-x-0.5 group-hover:-translate-y-0.5" />
                    </span>
                  </Link>
                </motion.div>
              );
            })}
          </div>
        )}

        <div className="mt-12 text-center">
          <Link
            to="/services"
            className={cn(
              'inline-flex items-center gap-2 rounded-full border px-6 py-3 text-sm font-semibold transition-all duration-300',
              isDark
                ? 'border-white/15 text-white hover:border-brand-gold-400/60 hover:bg-white/5'
                : 'border-slate-300 text-primary-900 hover:border-brand-gold-400/60 hover:bg-white hover:shadow-sm',
            )}
          >
            Explore all services
            <ArrowRight className="h-4 w-4" />
          </Link>
        </div>
      </Container>
    </PageSection>
  );
}
