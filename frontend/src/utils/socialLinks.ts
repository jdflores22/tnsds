/** Whether a social profile should appear on the public site. */
export function isSocialLinkVisible(url: string | undefined, enabledFlag: string | undefined) {
  if (!url?.trim()) return false;
  if (enabledFlag === 'false') return false;
  return true;
}
