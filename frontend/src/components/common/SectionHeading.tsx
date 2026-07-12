import type { CSSProperties, ReactNode } from 'react';
import { cn } from '@/utils/cn';
import { useSectionDarkBackground } from '@/hooks/useSectionContent';

export interface SectionHeadingProps {
  eyebrow?: string;
  title: string;
  titleHighlight?: string;
  subtitle?: string;
  align?: 'left' | 'center';
  className?: string;
  showAccent?: boolean;
  size?: 'default' | 'large';
  theme?: 'light' | 'dark';
}

export function SectionHeading({
  eyebrow,
  title,
  titleHighlight,
  subtitle,
  align = 'center',
  className,
  showAccent = false,
  size = 'default',
  theme = 'light',
}: SectionHeadingProps) {
  return (
    <div
      className={cn(
        'mb-12 max-w-3xl',
        align === 'center' && 'mx-auto text-center',
        className,
      )}
    >
      {eyebrow && (
        <p
          className={cn(
            theme === 'dark' ? 'pro-eyebrow-dark mb-3' : 'pro-eyebrow mb-3',
          )}
        >
          {eyebrow}
        </p>
      )}
      <h2
        className={cn(
          'font-semibold tracking-tight',
          theme === 'dark' ? 'text-white' : 'text-primary-900',
          size === 'large'
            ? 'text-3xl sm:text-4xl lg:text-[2.75rem] lg:leading-tight'
            : 'text-2xl sm:text-3xl lg:text-4xl',
        )}
      >
        {title}
        {titleHighlight && (
          <>
            {' '}
            <span className="text-primary-800">{titleHighlight}</span>
          </>
        )}
      </h2>
      {showAccent && (
        <div className={cn('accent-line mt-5', align === 'left' && '!mx-0')} />
      )}
      {subtitle && (
        <p
          className={cn(
            'mt-5 text-base leading-relaxed sm:text-lg',
            theme === 'dark' ? 'text-slate-300' : 'text-slate-600',
            align === 'center' && 'mx-auto max-w-2xl',
          )}
        >
          {subtitle}
        </p>
      )}
    </div>
  );
}

interface PageSectionProps {
  children: ReactNode;
  className?: string;
  id?: string;
  variant?: 'white' | 'muted' | 'dark' | 'navy';
  /** When set, navy background is controlled from Settings → Section visibility. */
  sectionId?: string;
  defaultDark?: boolean;
  style?: CSSProperties;
}

const sectionVariants = {
  white: 'bg-white',
  muted: 'bg-slate-50',
  dark: 'bg-primary-900 text-white',
  navy: 'bg-slate-50',
};

export function PageSection({
  children,
  className,
  id,
  variant = 'white',
  sectionId,
  defaultDark,
  style,
}: PageSectionProps) {
  const darkFromSettings = sectionId ? useSectionDarkBackground(sectionId, defaultDark) : false;
  const isDark = darkFromSettings || variant === 'dark';
  const resolvedVariant = isDark ? 'dark' : variant;

  return (
    <section
      id={id}
      style={style}
      className={cn(
        'section-padding border-b',
        isDark ? 'border-white/10 circuit-bg' : 'border-slate-200',
        !style?.backgroundColor && sectionVariants[resolvedVariant],
        className,
      )}
    >
      {children}
    </section>
  );
}
