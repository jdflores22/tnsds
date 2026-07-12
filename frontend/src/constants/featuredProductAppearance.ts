export type FeaturedProductPreset = 'light' | 'navy' | 'custom';

export type FeaturedProductColorTokens = {
  bg: string;
  accent: string;
  title: string;
  body: string;
  eyebrow: string;
  cardBg: string;
  cardBorder: string;
};

export const FEATURED_PRODUCT_PRESET_OPTIONS = [
  { value: 'light' as const, label: 'Light' },
  { value: 'navy' as const, label: 'Navy' },
  { value: 'custom' as const, label: 'Custom' },
];

export const FEATURED_PRODUCT_THEME_PRESETS: Record<
  FeaturedProductPreset,
  FeaturedProductColorTokens
> = {
  light: {
    bg: '#ffffff',
    accent: '#d4a017',
    title: '#0a1a2e',
    body: '#475569',
    eyebrow: '#926f0c',
    cardBg: '#f8fafc',
    cardBorder: '#e2e8f0',
  },
  navy: {
    bg: '#0a1a2e',
    accent: '#f5c842',
    title: '#ffffff',
    body: '#cbd5e1',
    eyebrow: '#f5c842',
    cardBg: 'rgba(255, 255, 255, 0.04)',
    cardBorder: 'rgba(255, 255, 255, 0.1)',
  },
  custom: {
    bg: '#0a1a2e',
    accent: '#f5c842',
    title: '#ffffff',
    body: '#cbd5e1',
    eyebrow: '#f5c842',
    cardBg: 'rgba(255, 255, 255, 0.04)',
    cardBorder: 'rgba(255, 255, 255, 0.1)',
  },
};

export const FEATURED_PRODUCT_COLOR_FIELDS = [
  { key: 'home_featured_product_bg_color', label: 'Background', token: 'bg' as const },
  { key: 'home_featured_product_accent_color', label: 'Accent / highlights', token: 'accent' as const },
  { key: 'home_featured_product_title_color', label: 'Title', token: 'title' as const },
  { key: 'home_featured_product_body_color', label: 'Body text', token: 'body' as const },
  { key: 'home_featured_product_eyebrow_color', label: 'Eyebrow / spotlight', token: 'eyebrow' as const },
  { key: 'home_featured_product_card_bg_color', label: 'Image frame background', token: 'cardBg' as const },
  { key: 'home_featured_product_card_border_color', label: 'Image frame border', token: 'cardBorder' as const },
];

export const FEATURED_PRODUCT_PRESET_KEY = 'home_featured_product_theme_preset';
