export type HeroSlide = {
  eyebrow: string;
  titleLine1: string;
  titleHighlight: string;
  description: string;
  ctaLabel: string;
  ctaHref: string;
  secondaryCtaLabel: string;
  secondaryCtaHref: string;
  backgroundImage: string;
};

export type HeroLayoutMode = 'static' | 'carousel';

export const DEFAULT_HERO_SLIDES: HeroSlide[] = [
  {
    eyebrow: 'Enterprise software development',
    titleLine1: 'Driven by engineering,',
    titleHighlight: 'empowered by people',
    description:
      'We turn software into business value by delivering domain expertise, modern engineering, and dependable delivery that helps organizations grow.',
    ctaLabel: 'Learn more',
    ctaHref: '/about',
    secondaryCtaLabel: 'Contact us',
    secondaryCtaHref: '/contact',
    backgroundImage: '',
  },
  {
    eyebrow: 'Custom applications',
    titleLine1: 'Software built for',
    titleHighlight: 'how you work',
    description:
      'From web platforms and mobile apps to enterprise systems — we design and deliver solutions tailored to your teams, customers, and operations.',
    ctaLabel: 'Our services',
    ctaHref: '/services',
    secondaryCtaLabel: 'Start a project',
    secondaryCtaHref: '/contact',
    backgroundImage: '',
  },
  {
    eyebrow: 'Long-term partnership',
    titleLine1: 'Engineering teams',
    titleHighlight: 'you can rely on',
    description:
      'Transparent delivery, maintainable code, and support that keeps your software performing in production — season after season.',
    ctaLabel: 'View portfolio',
    ctaHref: '/portfolio',
    secondaryCtaLabel: 'Contact us',
    secondaryCtaHref: '/contact',
    backgroundImage: '',
  },
];

export function emptyHeroSlide(): HeroSlide {
  return {
    eyebrow: '',
    titleLine1: '',
    titleHighlight: '',
    description: '',
    ctaLabel: 'Learn more',
    ctaHref: '/services',
    secondaryCtaLabel: 'Contact us',
    secondaryCtaHref: '/contact',
    backgroundImage: '',
  };
}

export function parseHeroSlides(raw: string | undefined): HeroSlide[] {
  if (!raw?.trim()) return [];

  try {
    const parsed = JSON.parse(raw) as unknown;
    if (!Array.isArray(parsed)) return [];
    return parsed
      .map(normalizeSlide)
      .filter((slide) => slide.titleLine1.trim() || slide.titleHighlight.trim());
  } catch {
    return parseHeroSlidesPipeFormat(raw);
  }
}

function normalizeSlide(value: unknown): HeroSlide {
  const slide = (value && typeof value === 'object' ? value : {}) as Partial<HeroSlide>;
  return {
    eyebrow: String(slide.eyebrow ?? '').trim(),
    titleLine1: String(slide.titleLine1 ?? '').trim(),
    titleHighlight: String(slide.titleHighlight ?? '').trim(),
    description: String(slide.description ?? '').trim(),
    ctaLabel: String(slide.ctaLabel ?? 'Learn more').trim() || 'Learn more',
    ctaHref: String(slide.ctaHref ?? '/services').trim() || '/services',
    secondaryCtaLabel: String(slide.secondaryCtaLabel ?? 'Contact us').trim() || 'Contact us',
    secondaryCtaHref: String(slide.secondaryCtaHref ?? '/contact').trim() || '/contact',
    backgroundImage: String(slide.backgroundImage ?? '').trim(),
  };
}

/** Legacy: Eyebrow|Title1|Highlight|Description|CTA|/href|/image;; */
function parseHeroSlidesPipeFormat(raw: string): HeroSlide[] {
  return raw
    .split(';;')
    .map((entry) => {
      const [
        eyebrow = '',
        titleLine1 = '',
        titleHighlight = '',
        description = '',
        ctaLabel = 'Learn more',
        ctaHref = '/services',
        backgroundImage = '',
      ] = entry.split('|');
      return normalizeSlide({
        eyebrow,
        titleLine1,
        titleHighlight,
        description,
        ctaLabel,
        ctaHref,
        secondaryCtaLabel: 'Contact us',
        secondaryCtaHref: '/contact',
        backgroundImage,
      });
    })
    .filter((slide) => slide.titleLine1 || slide.titleHighlight);
}

export function serializeHeroSlides(slides: HeroSlide[]): string {
  return JSON.stringify(slides, null, 2);
}
