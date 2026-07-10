import type { ReactNode } from 'react';
import { cn } from '@/utils/cn';
import { Container } from '@/components/common/Container';

export interface PageHeroProps {
  title: string;
  subtitle?: string;
  children?: ReactNode;
  className?: string;
  backgroundImage?: string;
}

export function PageHero({ title, subtitle, children, className, backgroundImage }: PageHeroProps) {
  return (
    <section
      className={cn(
        'border-b border-slate-200 bg-white py-16 sm:py-20',
        backgroundImage && 'relative overflow-hidden',
        className,
      )}
    >
      {backgroundImage && (
        <>
          <img
            src={backgroundImage}
            alt=""
            className="absolute inset-0 h-full w-full object-cover opacity-20"
            aria-hidden
          />
          <div className="absolute inset-0 bg-white/90" />
        </>
      )}
      <Container className="relative">
        <div className="max-w-3xl">
          <p className="pro-eyebrow mb-4">TRANS-NET</p>
          <h1 className="text-3xl font-semibold tracking-tight text-primary-900 sm:text-4xl lg:text-5xl">
            {title}
          </h1>
          {subtitle && (
            <p className="mt-5 text-lg leading-relaxed text-slate-600">{subtitle}</p>
          )}
          {children}
        </div>
      </Container>
    </section>
  );
}
