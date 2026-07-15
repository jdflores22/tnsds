import { Link } from 'react-router-dom';
import { ArrowRight } from 'lucide-react';
import { motion } from 'framer-motion';
import { Container } from '@/components/common/Container';
import { PageSection } from '@/components/common/SectionHeading';
import { Button } from '@/components/ui/Button';
import { useSiteSettingsMap } from '@/hooks/useSiteSettingsMap';
import { usePageSectionTheme } from '@/hooks/useSectionContent';
import { cn } from '@/utils/cn';

export function PreFooterCTA() {
  const { get } = useSiteSettingsMap();
  const theme = usePageSectionTheme('home_cta');
  const isDark = theme === 'dark';

  const title = get('home_cta_title', 'Ready to Transform Your Business?');
  const subtitle = get(
    'home_cta_subtitle',
    "Let's discuss how we can help you plan, build, and maintain software that fits your business.",
  );
  const primaryLabel = get('home_cta_primary_label', 'Get Started');
  const secondaryLabel = get('home_cta_secondary_label', 'Explore Services');

  return (
    <PageSection sectionId="home_cta" variant="muted" className="!py-10 sm:!py-12">
      <Container>
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.35 }}
          className="relative flex flex-col items-start gap-4 sm:flex-row sm:items-center sm:justify-between sm:gap-8"
        >
          <span
            className={cn(
              'absolute inset-x-0 -top-10 h-px bg-gradient-to-r from-transparent to-transparent sm:-top-12',
              isDark ? 'via-brand-gold-400/80' : 'via-brand-gold-500/70',
            )}
            aria-hidden
          />

          <div className="min-w-0 flex-1">
            <p
              className={cn(
                'text-[11px] font-semibold uppercase tracking-[0.2em]',
                isDark ? 'text-brand-gold-400' : 'text-brand-gold-600',
              )}
            >
              Next step
            </p>
            <h2
              className={cn(
                'mt-1.5 text-xl font-semibold tracking-tight sm:text-2xl',
                isDark ? 'text-white' : 'text-primary-900',
              )}
            >
              {title}
            </h2>
            {subtitle && (
              <p
                className={cn(
                  'mt-1.5 max-w-xl text-sm leading-relaxed line-clamp-2',
                  isDark ? 'text-slate-300' : 'text-slate-600',
                )}
              >
                {subtitle}
              </p>
            )}
          </div>

          <div className="flex shrink-0 flex-wrap items-center gap-2.5">
            <Link to="/contact">
              {isDark ? (
                <Button
                  size="md"
                  className="bg-brand-gold-500 text-primary-950 hover:bg-brand-gold-400"
                >
                  {primaryLabel}
                  <ArrowRight className="h-4 w-4" />
                </Button>
              ) : (
                <Button size="md">
                  {primaryLabel}
                  <ArrowRight className="h-4 w-4" />
                </Button>
              )}
            </Link>
            <Link
              to="/services"
              className={cn(
                'inline-flex items-center gap-1 px-2 py-2 text-sm font-medium transition-colors',
                isDark
                  ? 'text-slate-300 hover:text-brand-gold-400'
                  : 'text-primary-800 hover:text-brand-gold-600',
              )}
            >
              {secondaryLabel}
            </Link>
          </div>
        </motion.div>
      </Container>
    </PageSection>
  );
}
