import { useMemo } from 'react';
import { useQuery } from '@tanstack/react-query';
import { publicApiClient } from '@/api/client';
import type { ApiResponse, SeoSetting } from '@/types';

export function usePublicSeoSettings() {
  return useQuery({
    queryKey: ['seo', 'public'],
    queryFn: async () => {
      const { data } = await publicApiClient.get<ApiResponse<SeoSetting[]>>('/seo');
      return data.data;
    },
    staleTime: 30_000,
  });
}

export function usePageVisibilityMap() {
  const query = usePublicSeoSettings();

  const map = useMemo(() => {
    const entries: Record<string, SeoSetting> = {};
    query.data?.forEach((page) => {
      entries[page.pageKey] = page;
    });
    return entries;
  }, [query.data]);

  const isPagePublished = (pageKey: string) => map[pageKey]?.isPublished !== false;

  return { ...query, map, isPagePublished };
}

export function usePageVisibility(pageKey: string | null) {
  const { map, isLoading } = usePageVisibilityMap();

  if (!pageKey) {
    return { isLoading, isPublished: true, maintenanceMessage: '' };
  }

  const page = map[pageKey];
  return {
    isLoading,
    isPublished: page ? page.isPublished !== false : true,
    maintenanceMessage: page?.maintenanceMessage ?? '',
    page,
  };
}
