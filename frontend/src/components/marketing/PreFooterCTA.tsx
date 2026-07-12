import { Link } from 'react-router-dom';
import { ArrowRight } from 'lucide-react';
import { Container } from '@/components/common/Container';
import { PageSection } from '@/components/common/SectionHeading';
import { Button } from '@/components/ui/Button';
import { useSiteSettingsMap } from '@/hooks/useSiteSettingsMap';
import { usePageSectionTheme } from '@/hooks/useSectionContent';
import { cn } from '@/utils/cn';

export function PreFooterCTA() {
  const { get } = useSiteSettingsMap();
  const theme = usePageSectionTheme('home_cta');
  const title = get('home_cta_title', 'Ready to build your next software solution?');
  const subtitle = get(
    'home_cta_subtitle',
    "Let's discuss how we can help you plan, build, and maintain software that fits your business.",
  );

  return (
    <PageSection sectionId="home_cta" variant="muted" className="!py-16 sm:!py-20">
      <Container>
        <div
          className={cn(
            'mx-auto max-w-3xl rounded-2xl border px-8 py-12 text-center sm:px-12 sm:py-14',
            theme === 'dark' ? 'border-white/15 bg-white/5' : 'border-slate-200 bg-white',
          )}
        >
          <h2 className={cn('text-3xl font-semibold tracking-tight sm:text-4xl', theme === 'dark' ? 'text-white' : 'text-primary-900')}>
            {title}
          </h2>
          {subtitle && (
            <p className={cn('mx-auto mt-4 max-w-2xl text-base leading-relaxed sm:text-lg', theme === 'dark' ? 'text-slate-300' : 'text-slate-600')}>
              {subtitle}
            </p>
          )}
          <div className="mt-8 flex flex-wrap justify-center gap-3">
            <Link to="/contact">
              <Button size="lg">
                Contact us
                <ArrowRight className="h-4 w-4" />
              </Button>
            </Link>
            <Link to="/portfolio">
              <Button
                variant="outline"
                size="lg"
                className={cn(
                  theme === 'dark' &&
                    'border-white/25 bg-transparent text-white hover:border-white/40 hover:bg-white/10 hover:text-white',
                )}
              >
                View case studies
              </Button>
            </Link>
          </div>
        </div>
      </Container>
    </PageSection>
  );
}
