export type HeroThemePreset = 'light' | 'navy' | 'gold' | 'custom';

export type HeroColorTokens = {
  bg: string;
  accentNavy: string;
  accentGold: string;
  title: string;
  titleHighlight: string;
  body: string;
  eyebrow: string;
  panelBg: string;
  panelBorder: string;
  highlightsBg: string;
  highlightsBorder: string;
  highlightsTitle: string;
  highlightsBody: string;
  link: string;
};

export const HERO_THEME_PRESETS: Record<HeroThemePreset, HeroColorTokens> = {
  light: {
    bg: '#f8fafc',
    accentNavy: '#1a3a66',
    accentGold: '#d4a017',
    title: '#0a1a2e',
    titleHighlight: '#0a1a2e',
    body: '#475569',
    eyebrow: '#2d5580',
    panelBg: 'rgba(255, 255, 255, 0.9)',
    panelBorder: 'rgba(226, 232, 240, 0.9)',
    highlightsBg: '#ffffff',
    highlightsBorder: '#e2e8f0',
    highlightsTitle: '#0a1a2e',
    highlightsBody: '#475569',
    link: '#0f2744',
  },
  navy: {
    bg: '#0a1a2e',
    accentNavy: '#1a3a66',
    accentGold: '#d4a017',
    title: '#ffffff',
    titleHighlight: '#f5c842',
    body: '#cbd5e1',
    eyebrow: '#d4a017',
    panelBg: 'rgba(255, 255, 255, 0.06)',
    panelBorder: 'rgba(255, 255, 255, 0.12)',
    highlightsBg: '#0f2744',
    highlightsBorder: 'rgba(255, 255, 255, 0.1)',
    highlightsTitle: '#ffffff',
    highlightsBody: '#cbd5e1',
    link: '#f5c842',
  },
  gold: {
    bg: '#fffbeb',
    accentNavy: '#1a3a66',
    accentGold: '#d4a017',
    title: '#0a1a2e',
    titleHighlight: '#926f0c',
    body: '#57534e',
    eyebrow: '#b8890f',
    panelBg: 'rgba(255, 255, 255, 0.85)',
    panelBorder: 'rgba(212, 160, 23, 0.35)',
    highlightsBg: '#ffffff',
    highlightsBorder: '#fde68a',
    highlightsTitle: '#0a1a2e',
    highlightsBody: '#57534e',
    link: '#926f0c',
  },
  custom: {
    bg: '#f8fafc',
    accentNavy: '#1a3a66',
    accentGold: '#d4a017',
    title: '#0a1a2e',
    titleHighlight: '#0a1a2e',
    body: '#475569',
    eyebrow: '#2d5580',
    panelBg: 'rgba(255, 255, 255, 0.9)',
    panelBorder: 'rgba(226, 232, 240, 0.9)',
    highlightsBg: '#ffffff',
    highlightsBorder: '#e2e8f0',
    highlightsTitle: '#0a1a2e',
    highlightsBody: '#475569',
    link: '#0f2744',
  },
};

export const HERO_COLOR_FIELDS = [
  { key: 'hero_bg_color', label: 'Background', token: 'bg' as const },
  { key: 'hero_accent_navy_color', label: 'Navy glow accent', token: 'accentNavy' as const },
  { key: 'hero_accent_gold_color', label: 'Gold glow accent', token: 'accentGold' as const },
  { key: 'hero_title_color', label: 'Title line 1', token: 'title' as const },
  { key: 'hero_title_highlight_color', label: 'Title highlight', token: 'titleHighlight' as const },
  { key: 'hero_body_color', label: 'Description text', token: 'body' as const },
  { key: 'hero_eyebrow_color', label: 'Eyebrow / label', token: 'eyebrow' as const },
  { key: 'hero_panel_bg_color', label: 'Side panel background', token: 'panelBg' as const },
  { key: 'hero_highlights_bg_color', label: 'Highlight cards background', token: 'highlightsBg' as const },
] as const;

export const HERO_PRESET_OPTIONS: { value: HeroThemePreset; label: string }[] = [
  { value: 'light', label: 'Light (default)' },
  { value: 'navy', label: 'Navy' },
  { value: 'gold', label: 'Gold wash' },
  { value: 'custom', label: 'Custom colors' },
];
