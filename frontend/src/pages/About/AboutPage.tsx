import {
  ArrowRight,
  Award,
  Building2,
  CheckCircle2,
  Code2,
  Eye,
  Headphones,
  Shield,
  Target,
  Users,
  Zap,
  type LucideIcon,
} from 'lucide-react';
import { Link } from 'react-router-dom';
import { useIndustries, useSiteStats, useCompanyHighlights, useProcessSteps } from '@/api/hooks';
import { PageSEO } from '@/components/common/PageSEO';
import { Container } from '@/components/common/Container';
import { SectionHeading } from '@/components/common/SectionHeading';
import { Button } from '@/components/ui/Button';
import { useSiteSettingsMap } from '@/hooks/useSiteSettingsMap';
import { useAboutSectionsVisibility, useSectionsDarkBackground, useSectionContent } from '@/hooks/useSectionContent';
import { resolveMediaUrl } from '@/utils/media';
import { ProcessRoadmap } from '@/components/marketing/ProcessRoadmap';
import {
  AboutStatementSection,
  parseImagePosition,
} from '@/components/marketing/AboutStatementSection';
import { sectionSurfaceClass } from '@/utils/sectionSurface';

const whyIcons: LucideIcon[] = [Building2, Zap, Shield, Users];

const whyAccents = [
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
    border: 'border-sky-500',
    iconBg: 'bg-sky-50',
    iconColor: 'text-sky-700',
  },
  {
    border: 'border-emerald-500',
    iconBg: 'bg-emerald-50',
    iconColor: 'text-emerald-700',
  },
] as const;

const statIcons = {
  users: Users,
  code: Code2,
  award: Award,
  headset: Headphones,
} as const;

import { cn } from '@/utils/cn';

function aboutSectionSurface(dark: boolean, lightVariant: 'white' | 'muted' = 'white') {
  return sectionSurfaceClass(dark, lightVariant);
}

export default function AboutPage() {
  const { get } = useSiteSettingsMap();
  const sections = useAboutSectionsVisibility();
  const darkBg = useSectionsDarkBackground();
  const { data: industries } = useIndustries();
  const { data: siteStats } = useSiteStats();
  const { data: highlights } = useCompanyHighlights();
  const { data: processSteps } = useProcessSteps();
  const sortedIndustries = [...(industries ?? [])].sort((a, b) => a.sortOrder - b.sortOrder);
  const sortedStats = [...(siteStats ?? [])].sort((a, b) => a.sortOrder - b.sortOrder);
  const sortedHighlights = [...(highlights ?? [])].sort((a, b) => a.sortOrder - b.sortOrder);
  const sortedSteps = [...(processSteps ?? [])].sort((a, b) => a.sortOrder - b.sortOrder);

  const industriesSection = useSectionContent('about_industries', {
    eyebrow: 'Industries',
    title: 'Sector Expertise',
    subtitle: 'Deep domain knowledge across diverse industries — from healthcare to logistics.',
  });
  const whySection = useSectionContent('home_why', {
    eyebrow: 'What we do',
    title: 'We help companies build better software',
    subtitle: 'Custom development, dedicated teams, and long-term support tailored to your goals.',
  });
  const processSection = useSectionContent('home_process', {
    eyebrow: 'Process',
    title: 'Our Development Process',
    subtitle: 'A proven methodology for delivering successful projects on time and on budget.',
  });

  const companyName = get('company_name', 'TRANS-NET');
  const heroTitle = get('about_page_title', 'Delivering software expertise and results');
  const heroSubtitle = get(
    'about_page_subtitle',
    'For over a decade, we have been a software development partner driven by engineering and empowered by people — building custom applications that create lasting business impact.',
  );
  const heroImage = resolveMediaUrl(get('about_hero_image') || '');

  const mission = get(
    'about_mission',
    'Deliver reliable, scalable custom software that solves real business problems and creates lasting value for every client we serve.',
  );
  const vision = get(
    'about_vision',
    'Be the technology partner organizations trust for innovation, quality engineering, and long-term growth.',
  );
  const missionImage = resolveMediaUrl(get('about_mission_image') || '');
  const visionImage = resolveMediaUrl(get('about_vision_image') || '');
  const missionImagePosition = parseImagePosition(get('about_mission_image_position'), 'right');
  const visionImagePosition = parseImagePosition(get('about_vision_image_position'), 'left');

  const storyEyebrow = get('about_story_eyebrow', 'Our story');
  const storyTitle = get(
    'about_story_title',
    'From focused software studio to trusted development partner',
  );
  const intro = get(
    'about_intro',
    'TRANS-NET is a software development company specializing in custom enterprise applications, web and mobile products, and long-term software support.',
  );
  const secondary = get(
    'about_secondary',
    'With over a decade of experience, we have helped organizations across healthcare, finance, logistics, and more achieve their technology goals through innovative, scalable software. Our path has been shaped by the same challenges our clients face — evolving requirements, new markets, and the need to integrate modern tools without disrupting operations.',
  );
  const statsTitle = get('about_stats_title', 'The support you need, for results you want');

  return (
    <>
      <PageSEO
        pageKey="about"
        title={`About Us | ${companyName}`}
        description="Learn about TRANS-NET's vision, mission, values, and expertise in custom software development."
      />

      {/* Hero — Software Mind style: light, large headline */}
      <section className="relative overflow-hidden border-b border-slate-200/60 hero-heading-bg">
        {heroImage && (
          <>
            <img
              src={heroImage}
              alt=""
              aria-hidden
              className="absolute inset-0 h-full w-full object-cover object-center"
            />
            <div
              className="absolute inset-0"
              style={{
                background:
                  'linear-gradient(105deg, rgba(248,250,252,0.97) 0%, rgba(255,255,255,0.92) 42%, rgba(255,255,255,0.78) 68%, rgba(255,255,255,0.55) 100%)',
              }}
            />
          </>
        )}

        <Container className="relative py-16 sm:py-20 lg:py-24">
          <div className="max-w-4xl">
            <p className="pro-eyebrow mb-4">About {companyName}</p>
            <h1 className="text-[2.25rem] font-semibold leading-[1.08] tracking-tight text-primary-900 sm:text-5xl lg:text-[3.25rem]">
              {heroTitle}
            </h1>
            <p className="mt-6 max-w-3xl text-lg leading-relaxed text-slate-600 sm:text-xl">
              {heroSubtitle}
            </p>
            <div className="mt-10">
              <Link to="/contact">
                <Button size="lg">
                  Contact us
                  <ArrowRight className="h-4 w-4" />
                </Button>
              </Link>
            </div>
          </div>
        </Container>
      </section>

      <AboutStatementSection
        sectionId="about_mission"
        eyebrow="Our mission"
        body={mission}
        icon={Target}
        imageUrl={missionImage || undefined}
        imagePosition={missionImagePosition}
        variant="mission"
      />

      <AboutStatementSection
        sectionId="about_vision"
        eyebrow="Our vision"
        body={vision}
        icon={Eye}
        imageUrl={visionImage || undefined}
        imagePosition={visionImagePosition}
        variant="vision"
      />

      {/* Company story */}
      <section className={aboutSectionSurface(darkBg.about_story)}>
        <Container>
          <div className="grid items-center gap-12 lg:grid-cols-2 lg:gap-16">
            <div>
              <SectionHeading
                eyebrow={storyEyebrow}
                title={storyTitle}
                showAccent
                align="left"
                className="mb-0"
                theme={darkBg.about_story ? 'dark' : 'light'}
              />
              <div
                className={cn(
                  'mt-8 space-y-6 text-base leading-relaxed sm:text-lg',
                  darkBg.about_story ? 'text-slate-300' : 'text-slate-600',
                )}
              >
                <p>{intro}</p>
                <p>{secondary}</p>
              </div>
              <div className="mt-8 flex flex-wrap gap-3">
                <Link to="/services">
                  <Button variant="outline" size="sm">
                    Our services
                    <ArrowRight className="h-4 w-4" />
                  </Button>
                </Link>
                <Link to="/portfolio">
                  <Button variant="ghost" size="sm">
                    View portfolio
                  </Button>
                </Link>
              </div>
            </div>

            <div className="relative">
              {heroImage ? (
                <div className="overflow-hidden rounded-2xl border border-slate-200 shadow-sm">
                  <img
                    src={heroImage}
                    alt=""
                    className="aspect-[4/3] w-full object-cover"
                  />
                </div>
              ) : (
                <div className="flex aspect-[4/3] items-center justify-center rounded-2xl border border-slate-200 bg-slate-50">
                  <div className="text-center px-8">
                    <Building2 className="mx-auto h-12 w-12 text-primary-300" strokeWidth={1.25} />
                    <p className="mt-4 text-sm font-medium text-slate-500">
                      Upload a team or office photo in Admin → Settings → About page
                    </p>
                  </div>
                </div>
              )}
              <div
                className="pointer-events-none absolute -bottom-4 -right-4 -z-10 h-full w-full rounded-2xl bg-brand-gold-500/10"
                aria-hidden
              />
            </div>
          </div>
        </Container>
      </section>

      {/* Stats */}
      {(sections.about_stats || sections.about_stats_bar) && sortedStats.length > 0 && (
        <section className={aboutSectionSurface(darkBg.about_stats, 'muted')}>
          <Container>
            <SectionHeading
              title={statsTitle}
              size="large"
              className="mb-12 text-center"
              theme={darkBg.about_stats ? 'dark' : 'light'}
            />

            <div className="grid grid-cols-2 gap-8 lg:grid-cols-4 lg:gap-10">
              {sortedStats.map((stat, index) => {
                const Icon = statIcons[stat.icon as keyof typeof statIcons] ?? Users;
                const accent = darkBg.about_stats
                  ? 'text-brand-gold-400'
                  : index % 3 === 0
                    ? 'text-brand-gold-600'
                    : index % 3 === 1
                      ? 'text-primary-700'
                      : 'text-sky-600';

                return (
                  <div key={stat.id} className="text-center">
                    <div
                      className={cn(
                        'mx-auto mb-4 flex h-12 w-12 items-center justify-center rounded-full border',
                        darkBg.about_stats
                          ? 'border-white/20 bg-white/5'
                          : 'border-slate-200 bg-white',
                        accent,
                      )}
                    >
                      <Icon className="h-5 w-5" strokeWidth={1.5} />
                    </div>
                    <p
                      className={cn(
                        'text-3xl font-semibold tabular-nums sm:text-4xl',
                        darkBg.about_stats ? 'text-brand-gold-400' : 'text-primary-900',
                      )}
                    >
                      {stat.value}
                    </p>
                    <p className={cn('mt-2 text-sm', darkBg.about_stats ? 'text-slate-300' : 'text-slate-600')}>
                      {stat.label}
                    </p>
                  </div>
                );
              })}
            </div>
          </Container>
        </section>
      )}

      {sections.about_why && (
        <section className={aboutSectionSurface(darkBg.about_why)}>
          <Container>
            <SectionHeading
              eyebrow={whySection.eyebrow}
              title={whySection.title}
              subtitle={whySection.subtitle}
              size="large"
              theme={darkBg.about_why ? 'dark' : 'light'}
            />

            <div className="mt-10 grid gap-6 sm:grid-cols-2">
              {sortedHighlights.map((item, index) => {
                const style = whyAccents[index % whyAccents.length];
                const Icon = whyIcons[index % whyIcons.length];

                return (
                  <article
                    key={item.id}
                    className={cn(
                      'group flex gap-5 rounded-xl border p-6 shadow-sm transition-all hover:-translate-y-0.5 hover:shadow-md',
                      'border-t-4',
                      darkBg.about_why
                        ? 'border-white/10 bg-white/5 border-t-brand-gold-500'
                        : cn('border-slate-200 bg-white', style.border),
                    )}
                  >
                    <div
                      className={cn(
                        'flex h-12 w-12 shrink-0 items-center justify-center rounded-lg',
                        darkBg.about_why ? 'bg-brand-gold-500/15 text-brand-gold-400' : style.iconBg,
                      )}
                    >
                      <Icon
                        className={cn('h-5 w-5', darkBg.about_why ? 'text-brand-gold-400' : style.iconColor)}
                        strokeWidth={1.5}
                      />
                    </div>
                    <div>
                      <h3
                        className={cn(
                          'text-sm font-semibold uppercase tracking-wide',
                          darkBg.about_why ? 'text-white' : 'text-primary-900',
                        )}
                      >
                        {item.title}
                      </h3>
                      <p
                        className={cn(
                          'mt-2 text-sm leading-relaxed',
                          darkBg.about_why ? 'text-slate-300' : 'text-slate-600',
                        )}
                      >
                        {item.description}
                      </p>
                    </div>
                  </article>
                );
              })}
            </div>
          </Container>
        </section>
      )}

      {sections.about_process && (
        <section className={aboutSectionSurface(darkBg.about_process)}>
          <Container>
            <SectionHeading
              eyebrow={processSection.eyebrow}
              title={processSection.title}
              subtitle={processSection.subtitle}
              theme={darkBg.about_process ? 'dark' : 'light'}
              size="large"
            />

            {sortedSteps.length === 0 ? (
              <p className={cn('text-center', darkBg.about_process ? 'text-slate-400' : 'text-slate-500')}>
                No process steps published yet.
              </p>
            ) : (
              <ProcessRoadmap steps={sortedSteps} variant={darkBg.about_process ? 'dark' : 'light'} />
            )}
          </Container>
        </section>
      )}

      {sections.about_industries && (
        <section className={aboutSectionSurface(darkBg.about_industries, 'muted')}>
          <Container>
            <SectionHeading
              eyebrow={industriesSection.eyebrow}
              title={industriesSection.title}
              subtitle={industriesSection.subtitle}
              theme={darkBg.about_industries ? 'dark' : 'light'}
            />

            <div className="mt-10 grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
              {sortedIndustries.map((industry, index) => (
                <div
                  key={industry.id}
                  className={cn(
                    'flex items-center gap-3 rounded-lg border px-4 py-3 transition-colors',
                    darkBg.about_industries
                      ? 'border-white/10 bg-white/5 hover:border-brand-gold-500/40'
                      : 'border-slate-200 bg-white hover:border-brand-gold-400/40 hover:shadow-sm',
                  )}
                >
                  <CheckCircle2
                    className={cn(
                      'h-4 w-4 shrink-0',
                      darkBg.about_industries
                        ? 'text-brand-gold-400'
                        : index % 3 === 0
                          ? 'text-brand-gold-600'
                          : index % 3 === 1
                            ? 'text-primary-700'
                            : 'text-sky-600',
                    )}
                  />
                  <span
                    className={cn(
                      'text-sm font-medium',
                      darkBg.about_industries ? 'text-white' : 'text-primary-900',
                    )}
                  >
                    {industry.name}
                  </span>
                </div>
              ))}
            </div>

            <div className="mt-8 text-center">
              <Link
                to="/industries"
                className={darkBg.about_industries ? 'text-sm font-semibold text-brand-gold-400 hover:text-brand-gold-300' : 'sm-link'}
              >
                Explore all industries →
              </Link>
            </div>
          </Container>
        </section>
      )}

      {sections.about_cta && (
        <section className={aboutSectionSurface(darkBg.about_cta)}>
          <Container>
            <div className="mx-auto flex max-w-3xl flex-col items-center gap-6 text-center">
              <SectionHeading
                title="We'd love to hear from you"
                subtitle="Tell us about your project — we'll get back to you as soon as possible."
                showAccent
                theme={darkBg.about_cta ? 'dark' : 'light'}
              />
              <Link to="/contact">
                <Button size="lg">
                  Get in touch
                  <ArrowRight className="h-4 w-4" />
                </Button>
              </Link>
            </div>
          </Container>
        </section>
      )}
    </>
  );
}
