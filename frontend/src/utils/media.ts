import { API_BASE_URL } from '@/constants/api';

const API_ORIGIN = API_BASE_URL.replace(/\/api\/v1\/?$/, '');

/** Resolve a media path from CMS or uploads to a full browser URL. */
export function resolveMediaUrl(path: string): string {
  if (!path) return '';
  if (path.startsWith('http://') || path.startsWith('https://')) return path;
  if (path.startsWith('/uploads/')) return `${API_ORIGIN}${path}`;
  return path;
}

/** Normalize a website value for use in href. */
export function formatWebsiteHref(website: string): string {
  if (!website) return '#';
  if (website.startsWith('http://') || website.startsWith('https://')) return website;
  return `https://${website.replace(/^\/\//, '')}`;
}
