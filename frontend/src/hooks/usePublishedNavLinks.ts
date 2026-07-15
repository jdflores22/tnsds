import { useMemo } from 'react';
import { footerNavLinks, mainNavLinks, type NavLink } from '@/constants/navigation';
import { hrefToPageKey } from '@/constants/pageVisibility';
import { usePageVisibilityMap } from '@/hooks/usePageVisibility';

function filterPublishedLinks(links: NavLink[], map: ReturnType<typeof usePageVisibilityMap>['map'], isLoading: boolean) {
  if (isLoading) return links;
  return links.filter((link) => {
    const key = hrefToPageKey(link.href);
    const page = map[key];
    return page ? page.isPublished !== false : true;
  });
}

export function usePublishedNavLinks() {
  const { map, isLoading } = usePageVisibilityMap();

  return useMemo(
    () => filterPublishedLinks(mainNavLinks, map, isLoading),
    [isLoading, map],
  );
}

export function usePublishedFooterLinks() {
  const { map, isLoading } = usePageVisibilityMap();

  return useMemo(
    () => filterPublishedLinks(footerNavLinks, map, isLoading),
    [isLoading, map],
  );
}

/** Shared page-publish check for footer columns and bottom legal links. */
export function usePagePublishFlags() {
  const { map, isLoading } = usePageVisibilityMap();

  return useMemo(() => {
    const published = (pageKey: string) =>
      isLoading ? true : map[pageKey]?.isPublished !== false;

    return {
      isLoading,
      services: published('services'),
      products: published('products'),
      privacy: published('privacy'),
      terms: published('terms'),
      contact: published('contact'),
    };
  }, [isLoading, map]);
}
