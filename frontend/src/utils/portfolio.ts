import { resolveMediaUrl } from '@/utils/media';

function parseJsonArray(raw: string): unknown[] {
  try {
    const parsed = JSON.parse(raw || '[]');
    return Array.isArray(parsed) ? parsed : [];
  } catch {
    return [];
  }
}

/** Parse portfolio imagesJson into resolved browser URLs. */
export function parsePortfolioImages(imagesJson: string): string[] {
  return parseJsonArray(imagesJson)
    .map((item) => {
      if (typeof item === 'string') return resolveMediaUrl(item);
      if (item && typeof item === 'object' && 'url' in item) {
        return resolveMediaUrl(String((item as { url: string }).url));
      }
      return '';
    })
    .filter(Boolean);
}

export function getPortfolioCoverImage(imagesJson: string): string | null {
  const images = parsePortfolioImages(imagesJson);
  return images[0] ?? null;
}

export function parseTechStack(techStackJson: string): string[] {
  return parseJsonArray(techStackJson)
    .map((item) => (typeof item === 'string' ? item : ''))
    .filter(Boolean);
}

export function serializePortfolioImages(urls: string[]): string {
  return JSON.stringify(urls.filter(Boolean));
}

/** Raw URLs as stored in CMS (not resolved for display). */
export function parseRawPortfolioImages(imagesJson: string): string[] {
  return parseJsonArray(imagesJson)
    .map((item) => {
      if (typeof item === 'string') return item;
      if (item && typeof item === 'object' && 'url' in item) {
        return String((item as { url: string }).url);
      }
      return '';
    })
    .filter(Boolean);
}
