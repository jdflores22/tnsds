import { useMemo } from 'react';
import { useQuery } from '@tanstack/react-query';
import { publicApiClient } from '@/api/client';
import type { ApiResponse, SiteSetting } from '@/types';

export function usePublicSiteSettings() {
  return useQuery({
    queryKey: ['settings', 'public'],
    queryFn: async () => {
      const { data } = await publicApiClient.get<ApiResponse<SiteSetting[]>>('/settings');
      return data.data;
    },
    staleTime: 30_000,
    refetchOnWindowFocus: true,
  });
}

export function useSiteSettingsMap() {
  const query = usePublicSiteSettings();

  const map = useMemo(() => {
    const entries: Record<string, string> = {};
    query.data?.forEach((setting) => {
      entries[setting.key] = setting.value;
    });
    return entries;
  }, [query.data]);

  const get = (key: string, fallback = '') => map[key] ?? fallback;

  return { ...query, map, get };
}
