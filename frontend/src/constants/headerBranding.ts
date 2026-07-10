export const HEADER_COMPANY_NAME_COLOR_KEY = 'header_company_name_color';
export const HEADER_COMPANY_NAME_ACCENT_COLOR_KEY = 'header_company_name_accent_color';
export const HEADER_COMPANY_TAGLINE_COLOR_KEY = 'header_company_tagline_color';

export const HEADER_TEXT_DEFAULTS = {
  light: {
    name: '#ffffff',
    accent: '#f5c842',
    tagline: '#cbd5e1',
  },
  dark: {
    name: '#0a1a2e',
    accent: '#d4a017',
    tagline: '#2d5580',
  },
} as const;

export const HEADER_TEXT_COLOR_FIELDS = [
  { key: HEADER_COMPANY_NAME_COLOR_KEY, label: 'Company name color', token: 'name' as const },
  {
    key: HEADER_COMPANY_NAME_ACCENT_COLOR_KEY,
    label: 'Name accent color',
    token: 'accent' as const,
  },
  { key: HEADER_COMPANY_TAGLINE_COLOR_KEY, label: 'Tagline color', token: 'tagline' as const },
] as const;
