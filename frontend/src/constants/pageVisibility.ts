/** Maps public URL paths to SEO/page-visibility keys. */
export function pathnameToPageKey(pathname: string): string | null {
  if (pathname === '/') return 'home';
  const segment = pathname.split('/').filter(Boolean)[0];
  const keys = [
    'about',
    'services',
    'portfolio',
    'technologies',
    'industries',
    'blog',
    'careers',
    'contact',
    'privacy',
    'terms',
  ] as const;
  return keys.includes(segment as (typeof keys)[number]) ? segment! : null;
}

/** Nav href → page key (home uses "/"). */
export function hrefToPageKey(href: string): string {
  if (href === '/') return 'home';
  return href.replace(/^\//, '');
}

export const PAGE_VISIBILITY_LABELS: Record<string, { label: string; path: string }> = {
  home: { label: 'Homepage', path: '/' },
  about: { label: 'About Us', path: '/about' },
  services: { label: 'Services', path: '/services' },
  portfolio: { label: 'Portfolio', path: '/portfolio' },
  technologies: { label: 'Technologies', path: '/technologies' },
  industries: { label: 'Industries', path: '/industries' },
  blog: { label: 'Blog', path: '/blog' },
  careers: { label: 'Careers', path: '/careers' },
  contact: { label: 'Contact', path: '/contact' },
  privacy: { label: 'Privacy Policy', path: '/privacy' },
  terms: { label: 'Terms & Conditions', path: '/terms' },
};

export const PAGE_VISIBILITY_ORDER = [
  'home',
  'about',
  'services',
  'portfolio',
  'technologies',
  'industries',
  'blog',
  'careers',
  'contact',
  'privacy',
  'terms',
] as const;
