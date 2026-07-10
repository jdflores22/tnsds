import {
  HEADER_COMPANY_NAME_ACCENT_COLOR_KEY,
  HEADER_COMPANY_NAME_COLOR_KEY,
  HEADER_COMPANY_TAGLINE_COLOR_KEY,
  HEADER_TEXT_DEFAULTS,
} from '@/constants/headerBranding';
import { useSiteSettingsMap } from '@/hooks/useSiteSettingsMap';
import { isValidHexColor, normalizeHexColor } from '@/utils/color';

export type HeaderTextVariant = 'light' | 'dark';

export type CompanyTextColors = {
  nameColor: string;
  accentColor: string;
  taglineColor: string;
};

function resolveStoredColor(stored: string | undefined, fallback: string): string {
  if (stored && isValidHexColor(stored)) {
    return normalizeHexColor(stored, fallback);
  }
  return fallback;
}

function readStoredColor(
  get: (key: string, fallback?: string) => string,
  headerKey: string,
  legacyKey: string,
  fallback: string,
): string {
  const stored = get(headerKey, '') || get(legacyKey, '');
  return resolveStoredColor(stored, fallback);
}

export function resolveHeaderBrandingText(
  get: (key: string, fallback?: string) => string,
  variant: HeaderTextVariant,
): CompanyTextColors {
  const defaults = HEADER_TEXT_DEFAULTS[variant];

  return {
    nameColor: readStoredColor(get, HEADER_COMPANY_NAME_COLOR_KEY, 'company_name_color', defaults.name),
    accentColor: readStoredColor(
      get,
      HEADER_COMPANY_NAME_ACCENT_COLOR_KEY,
      'company_name_accent_color',
      defaults.accent,
    ),
    taglineColor: readStoredColor(
      get,
      HEADER_COMPANY_TAGLINE_COLOR_KEY,
      'company_tagline_color',
      defaults.tagline,
    ),
  };
}

export function useHeaderBrandingText(variant: HeaderTextVariant): CompanyTextColors {
  const { get } = useSiteSettingsMap();
  return resolveHeaderBrandingText(get, variant);
}
