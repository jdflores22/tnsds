import { ArrowRight, Building2, Code2, Headphones } from 'lucide-react';
import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';
import { Container } from '@/components/common/Container';
import { SectionHeading } from '@/components/common/SectionHeading';
import { Button } from '@/components/ui/Button';
import { useSectionDarkBackground } from '@/hooks/useSectionContent';
import { sectionSurfaceClass } from '@/utils/sectionSurface';
import { cn } from '@/utils/cn';

const VALUE_PILLS = [
  { icon: Code2, label: 'Custom engineering' },
  { icon: Headphones, label: 'Long-term support' },
  { icon: Building2, label: 'Enterprise focus' },
] as const;

interface AboutStorySectionProps {
  eyebrow: string;
  title: string;
  intro: string;
  secondary: string;
  imageUrl?: string;
}

export function AboutStorySection({
  eyebrow,
  title,
  intro,
  secondary,
  imageUrl,
}: AboutStorySectionProps) {
  const isDark = useSectionDarkBackground('about_story');

  return (
    <section className={sectionSurfaceClass(isDark)}>
      <Container>
        <div className="grid items-center gap-12 lg:grid-cols-2 lg:gap-16">
          <motion.div
            initial={{ opacity: 0, x: -16 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.45 }}
          >
            <SectionHeading
              eyebrow={eyebrow}
              title={title}
              showAccent
              align="left"
              className="mb-0"
              theme={isDark ? 'dark' : 'light'}
            />
            <div
              className={cn(
                'mt-8 space-y-6 text-base leading-relaxed sm:text-lg',
                isDark ? 'text-slate-300' : 'text-slate-600',
              )}
            >
              <p>{intro}</p>
              <p>{secondary}</p>
            </div>

            <div className="mt-8 flex flex-wrap gap-2">
              {VALUE_PILLS.map(({ icon: Icon, label }) => (
                <span
                  key={label}
                  className={cn(
                    'inline-flex items-center gap-2 rounded-full border px-3 py-1.5 text-xs font-medium',
                    isDark
                      ? 'border-white/15 bg-white/5 text-slate-200'
                      : 'border-slate-200 bg-slate-50 text-primary-800',
                  )}
                >
                  <Icon className="h-3.5 w-3.5 text-brand-gold-600" strokeWidth={1.75} />
                  {label}
                </span>
              ))}
            </div>

            <div className="mt-8 flex flex-wrap gap-3">
              <Link to="/services">
                <Button
                  variant="outline"
                  size="sm"
                  className={cn(
                    isDark &&
                      'border-white/25 bg-transparent text-white hover:border-white/40 hover:bg-white/10 hover:text-white',
                  )}
                >
                  Our services
                  <ArrowRight className="h-4 w-4" />
                </Button>
              </Link>
              <Link to="/portfolio">
                <Button
                  variant="ghost"
                  size="sm"
                  className={cn(
                    isDark && 'text-slate-200 hover:bg-white/10 hover:text-white',
                  )}
                >
                  View portfolio
                </Button>
              </Link>
            </div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, x: 16 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.45, delay: 0.1 }}
            className="relative"
          >
            {imageUrl ? (
              <div
                className={cn(
                  'overflow-hidden rounded-2xl border shadow-sm',
                  isDark ? 'border-white/15' : 'border-slate-200',
                )}
              >
                <img src={imageUrl} alt="" className="aspect-[4/3] w-full object-cover" />
              </div>
            ) : (
              <div
                className={cn(
                  'flex aspect-[4/3] items-center justify-center rounded-2xl border',
                  isDark ? 'border-white/15 bg-white/5' : 'border-slate-200 bg-slate-50',
                )}
              >
                <div className="px-8 text-center">
                  <Building2
                    className={cn('mx-auto h-12 w-12', isDark ? 'text-brand-gold-400/60' : 'text-primary-300')}
                    strokeWidth={1.25}
                  />
                  <p className={cn('mt-4 text-sm font-medium', isDark ? 'text-slate-400' : 'text-slate-500')}>
                    Team or office photo
                  </p>
                  <p className={cn('mt-1 text-xs', isDark ? 'text-slate-500' : 'text-slate-400')}>
                    Add one in Settings → Page content → About
                  </p>
                </div>
              </div>
            )}
            <div
              className="pointer-events-none absolute -bottom-4 -right-4 -z-10 h-full w-full rounded-2xl bg-brand-gold-500/10"
              aria-hidden
            />
          </motion.div>
        </div>
      </Container>
    </section>
  );
}
