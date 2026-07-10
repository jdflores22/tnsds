import { useCallback, useEffect, useRef, useState } from 'react';
import { Link } from 'react-router-dom';
import { ArrowRight, ChevronLeft, ChevronRight } from 'lucide-react';
import type { Technology } from '@/types';
import { resolveMediaUrl } from '@/utils/media';
import { cn } from '@/utils/cn';

const FLAVOR_ACCENTS = [
  {
    card: 'border-brand-gold-400/60 bg-gradient-to-br from-brand-gold-500/15 via-white to-white',
    stripe: 'bg-brand-gold-500',
    icon: 'bg-brand-gold-500/15 text-brand-gold-600',
    label: 'text-brand-gold-700',
  },
  {
    card: 'border-primary-400/50 bg-gradient-to-br from-primary-100 via-white to-white',
    stripe: 'bg-primary-600',
    icon: 'bg-primary-100 text-primary-700',
    label: 'text-primary-800',
  },
  {
    card: 'border-sky-300/70 bg-gradient-to-br from-sky-50 via-white to-white',
    stripe: 'bg-sky-500',
    icon: 'bg-sky-100 text-sky-600',
    label: 'text-sky-800',
  },
  {
    card: 'border-emerald-300/70 bg-gradient-to-br from-emerald-50 via-white to-white',
    stripe: 'bg-emerald-500',
    icon: 'bg-emerald-100 text-emerald-600',
    label: 'text-emerald-800',
  },
  {
    card: 'border-violet-300/70 bg-gradient-to-br from-violet-50 via-white to-white',
    stripe: 'bg-violet-500',
    icon: 'bg-violet-100 text-violet-600',
    label: 'text-violet-800',
  },
  {
    card: 'border-amber-300/70 bg-gradient-to-br from-amber-50 via-white to-white',
    stripe: 'bg-amber-500',
    icon: 'bg-amber-100 text-amber-600',
    label: 'text-amber-800',
  },
] as const;

function TechCarouselCard({ tech, index }: { tech: Technology; index: number }) {
  const accent = FLAVOR_ACCENTS[index % FLAVOR_ACCENTS.length];
  const iconSrc = tech.iconUrl ? resolveMediaUrl(tech.iconUrl) : null;

  return (
    <article
      className={cn(
        'group relative flex h-full w-[11.5rem] shrink-0 snap-start flex-col overflow-hidden rounded-2xl border p-5 shadow-sm transition-all duration-300 hover:-translate-y-1 hover:shadow-md sm:w-[13rem]',
        accent.card,
      )}
    >
      <span className={cn('absolute inset-x-0 top-0 h-1', accent.stripe)} aria-hidden />

      <div
        className={cn(
          'mb-4 flex h-14 w-14 items-center justify-center rounded-xl transition-transform duration-300 group-hover:scale-105',
          accent.icon,
        )}
      >
        {iconSrc ? (
          <img
            src={iconSrc}
            alt=""
            className="h-8 w-8 object-contain"
            onError={(e) => {
              e.currentTarget.style.display = 'none';
            }}
          />
        ) : (
          <span className="text-lg font-semibold">{tech.name.charAt(0)}</span>
        )}
      </div>

      <h3 className={cn('text-sm font-semibold leading-snug', accent.label)}>{tech.name}</h3>
    </article>
  );
}

interface TechStackShowcaseProps {
  technologies: Technology[];
  showCta?: boolean;
  autoPlay?: boolean;
}

export function TechStackShowcase({
  technologies,
  showCta = true,
  autoPlay = true,
}: TechStackShowcaseProps) {
  const trackRef = useRef<HTMLDivElement>(null);
  const [canScrollLeft, setCanScrollLeft] = useState(false);
  const [canScrollRight, setCanScrollRight] = useState(false);
  const [isPaused, setIsPaused] = useState(false);

  const updateScrollState = useCallback(() => {
    const track = trackRef.current;
    if (!track) return;

    const maxScroll = track.scrollWidth - track.clientWidth;
    setCanScrollLeft(track.scrollLeft > 8);
    setCanScrollRight(track.scrollLeft < maxScroll - 8);
  }, []);

  const scrollByCards = useCallback((direction: -1 | 1) => {
    const track = trackRef.current;
    if (!track) return;

    const card = track.querySelector<HTMLElement>('article');
    const gap = 16;
    const step = (card?.offsetWidth ?? 208) + gap;
    track.scrollBy({ left: direction * step, behavior: 'smooth' });
  }, []);

  useEffect(() => {
    const track = trackRef.current;
    if (!track) return;

    updateScrollState();
    track.addEventListener('scroll', updateScrollState, { passive: true });
    window.addEventListener('resize', updateScrollState);

    return () => {
      track.removeEventListener('scroll', updateScrollState);
      window.removeEventListener('resize', updateScrollState);
    };
  }, [technologies.length, updateScrollState]);

  useEffect(() => {
    if (!autoPlay || technologies.length <= 1 || isPaused) return;

    const id = window.setInterval(() => {
      const track = trackRef.current;
      if (!track) return;

      const maxScroll = track.scrollWidth - track.clientWidth;
      if (track.scrollLeft >= maxScroll - 8) {
        track.scrollTo({ left: 0, behavior: 'smooth' });
      } else {
        scrollByCards(1);
      }
    }, 3500);

    return () => window.clearInterval(id);
  }, [autoPlay, isPaused, scrollByCards, technologies.length]);

  if (technologies.length === 0) {
    return <p className="text-center text-slate-500">No technologies published yet.</p>;
  }

  return (
    <div>
      <div
        className="relative"
        onMouseEnter={() => setIsPaused(true)}
        onMouseLeave={() => setIsPaused(false)}
        onFocusCapture={() => setIsPaused(true)}
        onBlurCapture={() => setIsPaused(false)}
      >
        <div className="pointer-events-none absolute inset-y-0 left-0 z-10 w-10 bg-gradient-to-r from-white to-transparent sm:w-16" />
        <div className="pointer-events-none absolute inset-y-0 right-0 z-10 w-10 bg-gradient-to-l from-white to-transparent sm:w-16" />

        <div
          ref={trackRef}
          className="flex gap-4 overflow-x-auto scroll-smooth px-1 py-2 [-ms-overflow-style:none] [scrollbar-width:none] snap-x snap-mandatory [&::-webkit-scrollbar]:hidden"
          aria-label="Technology stack carousel"
        >
          {technologies.map((tech, index) => (
            <TechCarouselCard key={tech.id} tech={tech} index={index} />
          ))}
        </div>

        {technologies.length > 1 && (
          <div className="mt-6 flex items-center justify-center gap-3">
            <button
              type="button"
              aria-label="Previous technologies"
              onClick={() => scrollByCards(-1)}
              disabled={!canScrollLeft}
              className="inline-flex h-10 w-10 items-center justify-center rounded-full border border-slate-200 bg-white text-primary-800 shadow-sm transition-colors hover:border-brand-gold-400 hover:text-brand-gold-600 disabled:pointer-events-none disabled:opacity-35"
            >
              <ChevronLeft className="h-5 w-5" />
            </button>
            <button
              type="button"
              aria-label="Next technologies"
              onClick={() => scrollByCards(1)}
              disabled={!canScrollRight}
              className="inline-flex h-10 w-10 items-center justify-center rounded-full border border-slate-200 bg-white text-primary-800 shadow-sm transition-colors hover:border-brand-gold-400 hover:text-brand-gold-600 disabled:pointer-events-none disabled:opacity-35"
            >
              <ChevronRight className="h-5 w-5" />
            </button>
          </div>
        )}
      </div>

      {showCta && (
        <div className="mt-8 text-center">
          <Link to="/technologies" className="sm-link inline-flex items-center gap-2">
            Explore our full technology stack
            <ArrowRight className="h-4 w-4" />
          </Link>
        </div>
      )}
    </div>
  );
}
