import type { LucideIcon } from 'lucide-react';
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
    <div className={cn(!hasImage && 'mx-auto max-w-3xl text-center')}>
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
      <p className={cn(isDark ? 'pro-eyebrow-dark mt-6' : 'pro-eyebrow mt-6', !hasImage && 'justify-center')}>
        {eyebrow}
      </p>
      <p
        className={cn(
          'mt-4 text-base leading-relaxed sm:text-lg sm:leading-relaxed',
          isDark ? 'text-slate-300' : 'text-slate-600',
        )}
      >
        {body}
      </p>
    </div>
  );

  const imageBlock = hasImage ? (
    <div className="relative">
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
    </div>
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
