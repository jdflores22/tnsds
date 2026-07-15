import {
  ArrowRight,
  Building2,
  Cloud,
  Code2,
  Database,
  Plug,
  Server,
  Smartphone,
  Sparkles,
  Users,
  Wrench,
  type LucideIcon,
} from 'lucide-react';
import { Link } from 'react-router-dom';
import { useServices } from '@/api/hooks';
import { PageSEO } from '@/components/common/PageSEO';
import { PageHero } from '@/components/common/PageHero';
import { Container } from '@/components/common/Container';
import { SectionHeading } from '@/components/common/SectionHeading';
import { HexagonBadge } from '@/components/marketing/HexagonBadge';
import { Button } from '@/components/ui/Button';
import { PageLoader } from '@/components/ui/Spinner';
import { useSiteSettingsMap } from '@/hooks/useSiteSettingsMap';
import { useSectionContent, usePageHeroContent, useSectionDarkBackground } from '@/hooks/useSectionContent';
import { sectionSurfaceClass } from '@/utils/sectionSurface';
import { resolveMediaUrl } from '@/utils/media';
import type { Service } from '@/types';
import { cn } from '@/utils/cn';

const brandAccents = [
  {
    border: 'border-brand-gold-500',
    iconBg: 'bg-brand-gold-500/10',
    iconColor: 'text-brand-gold-600',
  },
  {
    border: 'border-primary-700',
    iconBg: 'bg-primary-50',
    iconColor: 'text-primary-800',
  },
  {
    border: 'border-brand-red-500',
    iconBg: 'bg-brand-red-500/10',
    iconColor: 'text-brand-red-600',
  },
] as const;

const fallbackIcons = [Code2, Smartphone, Cloud, Wrench, Database, Sparkles] as const;

function getServiceIcon(service: Service, index: number): LucideIcon {
  const hay = `${service.slug} ${service.title} ${service.icon}`.toLowerCase();

  if (hay.includes('mobile')) return Smartphone;
  if (hay.includes('web')) return Code2;
  if (hay.includes('cloud')) return Cloud;
  if (hay.includes('enterprise')) return Building2;
  if (hay.includes('api') || hay.includes('integration')) return Plug;
  if (hay.includes('maintenance') || hay.includes('support')) return Wrench;
  if (hay.includes('ai') || hay.includes('machine')) return Sparkles;
  if (hay.includes('consult')) return Users;
  if (hay.includes('database')) return Database;
  if (hay.includes('devops')) return Server;

  return fallbackIcons[index % fallbackIcons.length];
}

function getServiceCategory(title: string): string {
  const t = title.toLowerCase();
  if (t.includes('consult') || t.includes('maintenance')) return 'Advisory & Support';
  if (t.includes('cloud') || t.includes('devops') || t.includes('database')) return 'Infrastructure';
  if (t.includes('ai') || t.includes('automation') || t.includes('api')) return 'Integration & Automation';
  return 'Product Development';
}

function groupServices(services: Service[]) {
  return services.reduce<Record<string, Service[]>>((acc, service) => {
    const category = getServiceCategory(service.title);
    if (!acc[category]) acc[category] = [];
    acc[category].push(service);
    return acc;
  }, {});
}

const categoryOrder = [
  'Product Development',
  'Integration & Automation',
  'Infrastructure',
  'Advisory & Support',
];

export default function ServicesPage() {
  const { data: services, isLoading } = useServices();
  const { get } = useSiteSettingsMap();
  const hero = usePageHeroContent('services_page', { title: 'Our Services', subtitle: '' });
  const servicesSection = useSectionContent('services_section', {
    eyebrow: 'What we do',
    title: 'End-to-End Software Solutions',
    subtitle: 'We partner with businesses to design, build, deploy, and maintain software that drives real outcomes.',
  });

  const subtitle =
    get('services_page_subtitle') ||
    hero.subtitle ||
    'Comprehensive software solutions — from custom applications and web platforms to mobile apps and ongoing support.';
  const heroImage = resolveMediaUrl(get('services_hero_image') || '');

  const sorted = [...(services ?? [])].sort((a, b) => a.sortOrder - b.sortOrder);
  const grouped = groupServices(sorted);
  const categories = categoryOrder.filter((cat) => grouped[cat]?.length);

  const darkStats = useSectionDarkBackground('services_stats');
  const darkList = useSectionDarkBackground('services_list');
  const darkHowWeWork = useSectionDarkBackground('services_how_we_work', true);
  const darkCta = useSectionDarkBackground('services_cta');

  if (isLoading) return <PageLoader />;

  return (
    <>
      <PageSEO
        pageKey="services"
        title="Services | TRANS-NET"
        description="Explore our software development services."
      />

      <PageHero
        title={hero.title || 'Our Services'}
        subtitle={subtitle}
        backgroundImage={heroImage || undefined}
      />

      <section className={cn('border-b', darkStats ? sectionSurfaceClass(true) : 'border-slate-200 bg-white py-8')}>
        <Container className={darkStats ? undefined : 'py-0'}>
          <div className="grid gap-6 sm:grid-cols-3">
            <Stat value={String(sorted.length)} label="Service offerings" dark={darkStats} />
            <Stat value={String(categories.length)} label="Solution areas" dark={darkStats} />
            <Stat value="Full lifecycle" label="From idea to production" dark={darkStats} />
          </div>
        </Container>
      </section>

      <section className={sectionSurfaceClass(darkList, 'muted')}>
        <Container>
          <SectionHeading
            eyebrow={servicesSection.eyebrow}
            title={servicesSection.title}
            subtitle={servicesSection.subtitle}
            theme={darkList ? 'dark' : 'light'}
          />

          {sorted.length === 0 ? (
            <p className="text-center text-slate-500">No services published yet.</p>
          ) : (
            <div className="space-y-14">
              {categories.map((category) => {
                const items = grouped[category] ?? [];

                return (
                  <div key={category}>
                    <div className="mb-6 flex items-center gap-3">
                      <div className="h-px flex-1 bg-slate-200" />
                      <h3 className="text-xs font-medium uppercase tracking-[0.2em] text-primary-800">
                        {category}
                      </h3>
                      <div className="h-px flex-1 bg-slate-200" />
                    </div>

                    <div className="grid gap-6 sm:grid-cols-2 xl:grid-cols-3">
                      {items.map((service, index) => (
                        <ServiceCard
                          key={service.id}
                          service={service}
                          index={index}
                        />
                      ))}
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </Container>
      </section>

      <section className={sectionSurfaceClass(darkHowWeWork)}>
        <Container>
          <div className="mx-auto max-w-3xl text-center">
            <p className={darkHowWeWork ? 'pro-eyebrow-dark' : 'pro-eyebrow'}>How we work</p>
            <h2 className={`mt-3 text-2xl font-medium uppercase tracking-tight sm:text-3xl ${darkHowWeWork ? 'text-white' : 'text-primary-900'}`}>
              Built for Your Business
            </h2>
            {darkHowWeWork && <div className="accent-line mx-auto mt-5" />}
            <p className={`mt-6 text-base leading-relaxed ${darkHowWeWork ? 'text-slate-300' : 'text-slate-600'}`}>
              Every engagement starts with understanding your goals. We deliver pragmatic solutions
              with clear milestones, transparent communication, and code you can rely on long after launch.
            </p>
          </div>

          <div className="mt-12 grid gap-6 sm:grid-cols-3">
            {[
              {
                title: 'Discovery first',
                text: 'We align on requirements, scope, and success metrics before writing a line of code.',
              },
              {
                title: 'Agile delivery',
                text: 'Iterative releases keep you in the loop and reduce risk throughout the project.',
              },
              {
                title: 'Long-term support',
                text: 'Maintenance, enhancements, and monitoring so your systems stay healthy in production.',
              },
            ].map((item) => (
              <div
                key={item.title}
                className={cn(
                  'rounded-xl border p-6 backdrop-blur-sm',
                  darkHowWeWork ? 'border-white/10 bg-white/5' : 'border-slate-200 bg-white',
                )}
              >
                <h3 className={`text-sm font-medium uppercase tracking-wide ${darkHowWeWork ? 'text-brand-gold-400' : 'text-primary-900'}`}>
                  {item.title}
                </h3>
                <p className={`mt-3 text-sm leading-relaxed ${darkHowWeWork ? 'text-slate-300' : 'text-slate-600'}`}>{item.text}</p>
              </div>
            ))}
          </div>
        </Container>
      </section>

      <section className={sectionSurfaceClass(darkCta)}>
        <Container>
          <div className="flex flex-col items-center gap-6 text-center">
            <SectionHeading
              title="Ready to Get Started?"
              subtitle="Tell us about your project and we'll recommend the right service mix for your needs."
              showAccent
              theme={darkCta ? 'dark' : 'light'}
            />
            <Link to="/contact">
              <Button size="lg">
                Request a consultation
                <ArrowRight className="h-4 w-4" />
              </Button>
            </Link>
          </div>
        </Container>
      </section>
    </>
  );
}

function Stat({ value, label, dark = false }: { value: string; label: string; dark?: boolean }) {
  return (
    <div className="text-center sm:text-left">
      <p className={`text-3xl font-medium tabular-nums ${dark ? 'text-brand-gold-400' : 'text-primary-900'}`}>{value}</p>
      <p className={`mt-1 text-sm ${dark ? 'text-slate-300' : 'text-slate-500'}`}>{label}</p>
    </div>
  );
}

function ServiceCard({ service, index }: { service: Service; index: number }) {
  const style = brandAccents[index % brandAccents.length];
  const Icon = getServiceIcon(service, index);

  return (
    <article
      className={cn(
        'group flex h-full flex-col overflow-hidden rounded-xl border border-slate-200/80 bg-white shadow-sm transition-all hover:-translate-y-1 hover:shadow-lg',
        'border-t-4',
        style.border,
      )}
    >
      <div className="flex flex-1 flex-col p-6">
        <div className="mb-5 flex justify-center">
          <HexagonBadge
            size="md"
            stroke="#d4a017"
            fillClassName="bg-brand-gold-500/10 text-brand-gold-600"
          >
            <Icon className="h-7 w-7" strokeWidth={1.5} />
          </HexagonBadge>
        </div>

        <h3 className="text-center text-sm font-medium uppercase tracking-wide text-primary-900">
          {service.title}
        </h3>
        <p className="mt-3 flex-1 text-center text-sm leading-relaxed text-slate-500">
          {service.shortDescription}
        </p>

        <Link
          to={`/services/${service.slug}`}
          className="mt-5 inline-flex items-center justify-center gap-1.5 text-xs font-medium uppercase tracking-wide text-primary-800 transition-colors hover:text-brand-red-500"
        >
          Learn more
          <ArrowRight className="h-3.5 w-3.5 transition-transform group-hover:translate-x-0.5" />
        </Link>
      </div>
    </article>
  );
}
