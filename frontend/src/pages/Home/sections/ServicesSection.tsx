import { Link } from 'react-router-dom';
import { ArrowRight, Code2, Layers, Smartphone, Wrench } from 'lucide-react';
import { motion } from 'framer-motion';
import { useServices } from '@/api/hooks';
import { Container } from '@/components/common/Container';
import { PageSection } from '@/components/common/SectionHeading';
import { SectionHeading } from '@/components/common/SectionHeading';
import { Spinner } from '@/components/ui/Spinner';
import { useSectionContent, usePageSectionTheme } from '@/hooks/useSectionContent';

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
          <p className="text-center text-slate-500">No services published yet.</p>
        ) : (
          <div className="grid gap-6 sm:grid-cols-2">
            {displayServices.map((service, index) => {
              const Icon = icons[index % icons.length];
              return (
                <motion.article
                  key={service.id}
                  initial={{ opacity: 0, y: 12 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: index * 0.05 }}
                  className="sm-card group flex flex-col p-8"
                >
                  <div className="mb-5 flex h-11 w-11 items-center justify-center rounded-lg bg-slate-100 text-primary-800">
                    <Icon className="h-5 w-5" strokeWidth={1.5} />
                  </div>
                  <h3 className="text-xl font-semibold tracking-tight text-primary-900">{service.title}</h3>
                  <p className="mt-3 flex-1 text-sm leading-relaxed text-slate-600">
                    {service.shortDescription}
                  </p>
                  <Link
                    to={`/services/${service.slug}`}
                    className="sm-link mt-6 inline-flex items-center gap-1.5"
                  >
                    Learn more
                    <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-0.5" />
                  </Link>
                </motion.article>
              );
            })}
          </div>
        )}

        <div className="mt-12 text-center">
          <Link
            to="/services"
            className="sm-link inline-flex items-center gap-2"
          >
            Explore all services
            <ArrowRight className="h-4 w-4" />
          </Link>
        </div>
      </Container>
    </PageSection>
  );
}
