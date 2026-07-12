import type { LucideIcon } from 'lucide-react';
import { motion } from 'framer-motion';
import { Container } from '@/components/common/Container';
import { useSectionDarkBackground } from '@/hooks/useSectionContent';
import { sectionSurfaceClass } from '@/utils/sectionSurface';
import { cn } from '@/utils/cn';

export type StatementImagePosition = 'left' | 'right';

interface AboutStatementSectionProps {
  sectionId: 'about_mission' | 'about_vision';
  eyebrow: string;
  body: string;
  icon: LucideIcon;
  imageUrl?: string;
  imagePosition?: StatementImagePosition;
  variant: 'mission' | 'vision';
}

export function AboutStatementSection({
  sectionId,
  eyebrow,
  body,
  icon: Icon,
  imageUrl,
  imagePosition = 'right',
  variant,
}: AboutStatementSectionProps) {
  const darkBackground = useSectionDarkBackground(sectionId);
  const imageOnLeft = imagePosition === 'left';
  const hasImage = Boolean(imageUrl);
  const isDark = darkBackground;

  const textBlock = (
    <motion.div
      initial={{ opacity: 0, y: 12 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ duration: 0.4 }}
      className={cn(!hasImage && 'mx-auto max-w-3xl text-center')}
    >
      <div
        className={cn(
          'inline-flex h-12 w-12 items-center justify-center rounded-xl',
          isDark
            ? variant === 'mission'
              ? 'bg-brand-gold-500/20 text-brand-gold-400'
              : 'bg-white/10 text-brand-gold-400'
            : variant === 'mission'
              ? 'bg-brand-gold-500/15 text-brand-gold-600'
              : 'bg-primary-100 text-primary-800',
          !hasImage && 'mx-auto',
        )}
      >
        <Icon className="h-6 w-6" strokeWidth={1.5} />
      </div>
      <p
        className={cn(
          'mt-6 text-xs font-semibold uppercase tracking-[0.2em]',
          isDark ? 'text-brand-gold-400' : 'text-brand-gold-600',
          !hasImage && 'text-center',
        )}
      >
        {variant === 'mission' ? 'Mission' : 'Vision'}
      </p>
      <h2
        className={cn(
          'mt-2 text-2xl font-semibold tracking-tight sm:text-3xl',
          isDark ? 'text-white' : 'text-primary-900',
          !hasImage && 'text-center',
        )}
      >
        {eyebrow}
      </h2>
      <p
        className={cn(
          'mt-4 text-base leading-relaxed sm:text-lg sm:leading-relaxed',
          isDark ? 'text-slate-300' : 'text-slate-600',
        )}
      >
        {body}
      </p>
    </motion.div>
  );

  const imageBlock = hasImage ? (
    <motion.div
      initial={{ opacity: 0, scale: 0.98 }}
      whileInView={{ opacity: 1, scale: 1 }}
      viewport={{ once: true }}
      transition={{ duration: 0.45, delay: 0.08 }}
      className="relative"
    >
      <div
        className={cn(
          'overflow-hidden rounded-2xl border shadow-sm',
          isDark ? 'border-white/15' : 'border-slate-200',
        )}
      >
        <img src={imageUrl} alt="" className="aspect-[4/3] w-full object-cover" />
      </div>
      {!isDark && (
        <div
          className={cn(
            'pointer-events-none absolute -bottom-4 -z-10 h-full w-full rounded-2xl',
            variant === 'mission' ? 'bg-brand-gold-500/10 -right-4' : 'bg-primary-700/10 -left-4',
          )}
          aria-hidden
        />
      )}
      {isDark && (
        <div
          className={cn(
            'pointer-events-none absolute -bottom-4 -z-10 h-full w-full rounded-2xl bg-brand-gold-500/10 blur-sm',
            variant === 'mission' ? '-right-4' : '-left-4',
          )}
          aria-hidden
        />
      )}
    </motion.div>
  ) : null;

  return (
    <section className={sectionSurfaceClass(isDark)}>
      <Container>
        <div
          className={cn(
            'grid items-center gap-10 lg:gap-16',
            hasImage && 'lg:grid-cols-2',
          )}
        >
          {hasImage && imageOnLeft ? imageBlock : null}
          {textBlock}
          {hasImage && !imageOnLeft ? imageBlock : null}
        </div>
      </Container>
    </section>
  );
}

function parseImagePosition(value: string | undefined, fallback: StatementImagePosition): StatementImagePosition {
  return value?.trim().toLowerCase() === 'left' ? 'left' : fallback;
}

export { parseImagePosition };
