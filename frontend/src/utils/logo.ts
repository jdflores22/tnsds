/** True for formats that typically support transparency (PNG, SVG, WebP). */
export function isTransparentLogoUrl(url: string, mediaHint?: string): boolean {
  const hint = mediaHint?.toLowerCase();
  if (hint === 'png' || hint === 'svg' || hint === 'webp') return true;
  if (hint === 'jpg' || hint === 'jpeg') return false;

  const path = url.split('?')[0].split('#')[0].toLowerCase();
  return path.endsWith('.png') || path.endsWith('.svg') || path.endsWith('.webp');
}

export function isCustomUploadedLogo(url: string): boolean {
  return url.includes('/uploads/') || url.startsWith('http');
}
