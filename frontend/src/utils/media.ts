import { API_BASE_URL } from '@/constants/api';

const API_ORIGIN = API_BASE_URL.replace(/\/api\/v1\/?$/, '');

/** Resolve a media path from CMS or uploads to a full browser URL. */
export function resolveMediaUrl(path: string): string {
  if (!path) return '';
  if (path.startsWith('http://') || path.startsWith('https://')) return path;
  if (path.startsWith('/uploads/')) return `${API_ORIGIN}${path}`;
  return path;
}

/** Normalize a website value for use in an href. */
export function formatWebsiteHref(website: string): string {
  if (!website) return '#';
  if (website.startsWith('http://') || website.startsWith('https://')) return website;
  return `https://${website.replace(/^\/\//, '')}`;
}

/** Google Maps search link for a plain-text address. */
export function formatMapSearchHref(address: string): string {
  if (!address.trim()) return '#';
  return `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(address.trim())}`;
}

const GENERIC_MAP_ADDRESSES = new Set(
  ['', 'global headquarters', '123 tech boulevard, suite 500'].map((value) => value.toLowerCase()),
);

/** Query-based Google Maps iframe URL from a street address or place name. */
export function buildGoogleMapEmbedUrlFromQuery(query: string): string | null {
  const trimmed = query.trim();
  if (!trimmed) return null;

  const params = new URLSearchParams({
    q: trimmed,
    hl: 'en',
    z: '15',
    output: 'embed',
  });

  return `https://maps.google.com/maps?${params.toString()}`;
}

/** Build an embed URL from the company address when it is specific enough. */
export function buildGoogleMapEmbedUrlFromAddress(address: string): string | null {
  const trimmed = address.trim();
  if (!trimmed || GENERIC_MAP_ADDRESSES.has(trimmed.toLowerCase())) return null;
  return buildGoogleMapEmbedUrlFromQuery(trimmed);
}

/** Strip iframe markup / trailing attributes so only the embed URL remains. */
export function normalizeGoogleMapEmbedInput(input: string): string {
  const text = input.trim();
  if (!text) return '';

  const iframeMatch = text.match(/src\s*=\s*["']([^"']+)["']/i);
  if (iframeMatch?.[1]) return iframeMatch[1].trim();

  const googleMatch = text.match(/https:\/\/(?:www\.)?google\.com\/maps\/[^\s"'<>]+/i);
  if (googleMatch?.[0]) return googleMatch[0].replace(/\\?["']+$/, '');

  const mapsMatch = text.match(/https:\/\/maps\.google\.com\/[^\s"'<>]+/i);
  if (mapsMatch?.[0]) return mapsMatch[0].replace(/\\?["']+$/, '');

  return text.split(/\s+(?:width|height|style|frameborder|allowfullscreen)=/i)[0]?.replace(/\\?["']+$/, '').trim() ?? text;
}

/** Allow only Google Maps embed URLs for iframe src. */
export function sanitizeGoogleMapEmbedUrl(url: string): string | null {
  const normalized = normalizeGoogleMapEmbedInput(url);
  if (!normalized) return null;

  try {
    const parsed = new URL(normalized);
    if (parsed.protocol !== 'https:') return null;

    const host = parsed.hostname.replace(/^www\./, '');
    const isGoogleMapsHost =
      host === 'google.com' ||
      host === 'maps.google.com' ||
      host.endsWith('.google.com');

    if (!isGoogleMapsHost) return null;

    // Official embed iframe src from Google Maps → Share → Embed a map
    if (parsed.pathname.includes('/maps/embed')) return parsed.toString();

    // Query-based embed (maps?q=...&output=embed)
    if (
      parsed.pathname.startsWith('/maps') &&
      parsed.searchParams.get('output') === 'embed' &&
      parsed.searchParams.get('q')
    ) {
      return parsed.toString();
    }

    return null;
  } catch {
    return null;
  }
}

/** Prefer a saved embed URL, then address, then company-name search. */
export function resolveGoogleMapEmbedUrl(
  address: string,
  configuredUrl = '',
  searchFallback = '',
): string | null {
  const explicit = sanitizeGoogleMapEmbedUrl(configuredUrl);
  if (explicit) return explicit;

  const fromAddress = buildGoogleMapEmbedUrlFromAddress(address);
  if (fromAddress) return fromAddress;

  const fallbackQuery = searchFallback.trim();
  if (fallbackQuery) return buildGoogleMapEmbedUrlFromQuery(fallbackQuery);

  return null;
}

export interface OfficeHoursRow {
  label: string;
  hours: string;
}

/** Each line: `Mon–Fri|9:00 AM – 6:00 PM` or plain text when no pipe. */
export function parseOfficeHoursLines(text: string): OfficeHoursRow[] {
  return text
    .split('\n')
    .map((line) => line.trim())
    .filter(Boolean)
    .map((line) => {
      const pipeIndex = line.indexOf('|');
      if (pipeIndex === -1) return { label: '', hours: line };
      return {
        label: line.slice(0, pipeIndex).trim(),
        hours: line.slice(pipeIndex + 1).trim(),
      };
    });
}
