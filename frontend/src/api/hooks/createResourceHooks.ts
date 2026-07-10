import {
  useMutation,
  useQuery,
  useQueryClient,
  type UseMutationOptions,
  type UseQueryOptions,
} from '@tanstack/react-query';
import apiClient, { publicApiClient } from '@/api/client';
import type { ApiResponse, PaginatedResponse } from '@/types';

async function fetchList<T>(
  client: typeof apiClient,
  path: string,
  params?: Record<string, unknown>,
): Promise<T[]> {
  const { data } = await client.get<ApiResponse<T[]> | PaginatedResponse<T>>(path, { params });
  if ('data' in data && Array.isArray(data.data)) return data.data as T[];
  if ('items' in data && Array.isArray(data.items)) return data.items as T[];
  return [];
}

export function createResourceHooks<T, Create = Partial<T>, Update = Partial<T>>(
  resource: string,
  publicOnly = false,
) {
  const path = `/${resource}`;
  const readClient = publicOnly ? publicApiClient : apiClient;

  const keys = {
    all: [resource] as const,
    lists: () => [...keys.all, 'list'] as const,
    list: (params?: Record<string, unknown>) => [...keys.lists(), params] as const,
    details: () => [...keys.all, 'detail'] as const,
    detail: (id: string) => [...keys.details(), id] as const,
    slug: (slug: string) => [...keys.details(), 'slug', slug] as const,
  };

  const cmsQueryOptions = {
    staleTime: 30_000,
    refetchOnWindowFocus: true,
  };

  return {
    keys,
    useList: (
      params?: Record<string, unknown>,
      options?: Omit<UseQueryOptions<T[]>, 'queryKey' | 'queryFn'>,
    ) =>
      useQuery({
        queryKey: keys.list(params),
        queryFn: (): Promise<T[]> => fetchList<T>(readClient, path, params),
        ...cmsQueryOptions,
        ...options,
      }),
    useAdminList: (
      params?: Record<string, unknown>,
      options?: Omit<UseQueryOptions<T[]>, 'queryKey' | 'queryFn'>,
    ) =>
      useQuery({
        queryKey: [...keys.list(params), 'admin'],
        queryFn: (): Promise<T[]> => fetchList<T>(apiClient, path, params),
        ...options,
      }),
    useById: (id: string, options?: Omit<UseQueryOptions<T>, 'queryKey' | 'queryFn'>) =>
      useQuery({
        queryKey: keys.detail(id),
        queryFn: async () => {
          const { data } = await readClient.get<ApiResponse<T>>(`${path}/${id}`);
          return data.data;
        },
        enabled: !!id,
        ...cmsQueryOptions,
        ...options,
      }),
    useBySlug: (slug: string, options?: Omit<UseQueryOptions<T>, 'queryKey' | 'queryFn'>) =>
      useQuery({
        queryKey: keys.slug(slug),
        queryFn: async () => {
          const { data } = await readClient.get<ApiResponse<T>>(`${path}/slug/${slug}`);
          return data.data;
        },
        enabled: !!slug,
        ...cmsQueryOptions,
        ...options,
      }),
    useCreate: (options?: UseMutationOptions<T, Error, Create>) => {
      const queryClient = useQueryClient();
      return useMutation({
        mutationFn: async (payload: Create) => {
          const { data } = await apiClient.post<ApiResponse<T>>(path, payload);
          return data.data;
        },
        onSuccess: (...args) => {
          queryClient.invalidateQueries({ queryKey: keys.all });
          options?.onSuccess?.(...args);
        },
        ...options,
      });
    },
    useUpdate: (options?: UseMutationOptions<T, Error, { id: string; data: Update }>) => {
      const queryClient = useQueryClient();
      return useMutation({
        mutationFn: async ({ id, data: payload }: { id: string; data: Update }) => {
          const { data } = await apiClient.put<ApiResponse<T>>(`${path}/${id}`, payload);
          return data.data;
        },
        onSuccess: (...args) => {
          queryClient.invalidateQueries({ queryKey: keys.all });
          options?.onSuccess?.(...args);
        },
        ...options,
      });
    },
    useDelete: (options?: UseMutationOptions<void, Error, string>) => {
      const queryClient = useQueryClient();
      return useMutation({
        mutationFn: async (id: string) => {
          await apiClient.delete(`${path}/${id}`);
        },
        onSuccess: (...args) => {
          queryClient.invalidateQueries({ queryKey: keys.all });
          options?.onSuccess?.(...args);
        },
        ...options,
      });
    },
  };
}
