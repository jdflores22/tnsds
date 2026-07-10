/** Rough reading time from HTML or plain text (200 wpm). */
export function estimateReadTime(content: string): number {
  const text = content.replace(/<[^>]+>/g, ' ').replace(/\s+/g, ' ').trim();
  if (!text) return 1;
  const words = text.split(' ').filter(Boolean).length;
  return Math.max(1, Math.ceil(words / 200));
}
