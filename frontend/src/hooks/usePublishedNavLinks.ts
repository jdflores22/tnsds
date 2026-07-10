import { useMemo } from 'react';
import { mainNavLinks } from '@/constants/navigation';
import { hrefToPageKey } from '@/constants/pageVisibility';
import { usePageVisibilityMap } from '@/hooks/usePageVisibility';

export function usePublishedNavLinks() {
  const { map, isLoading } = usePageVisibilityMap();

  return useMemo(() => {
    if (isLoading) return mainNavLinks;
    return mainNavLinks.filter((link) => {
      const key = hrefToPageKey(link.href);
      const page = map[key];
      return page ? page.isPublished !== false : true;
    });
  }, [isLoading, map]);
}
