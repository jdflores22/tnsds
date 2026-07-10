import {
  useMutation,
  useQuery,
  useQueryClient,
  type UseMutationOptions,
  type UseQueryOptions,
} from '@tanstack/react-query';
import apiClient, { publicApiClient } from '@/api/client';
import type { ApiResponse, PaginatedResponse } from '@/types';
import { toast } from '@/store/toastStore';

/** Turn a resource key like "ProcessSteps" or "site-stats" into "Process step". */
function humanizeSingular(resource: string): string {
  const spaced = resource
    .replace(/[-_]/g, ' ')
    .replace(/([a-z])([A-Z])/g, '$1 $2')
    .trim()
    .toLowerCase();
  const singular = spaced.endsWith('ies')
    ? `${spaced.slice(0, -3)}y`
    : spaced.endsWith('s')
      ? spaced.slice(0, -1)
      : spaced;
  return singular.charAt(0).toUpperCase() + singular.slice(1);
}

function errorMessage(error: unknown): string | undefined {
  if (error && typeof error === 'object') {
    const maybe = error as { response?: { data?: { message?: string } }; message?: string };
    return maybe.response?.data?.message ?? maybe.message;
  }
  return undefined;
}

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
  const label = humanizeSingular(resource);

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
        ...options,
        mutationFn: async (payload: Create) => {
          const { data } = await apiClient.post<ApiResponse<T>>(path, payload);
          return data.data;
        },
        onSuccess: (...args) => {
          queryClient.invalidateQueries({ queryKey: keys.all });
          toast.success(`${label} created`);
          options?.onSuccess?.(...args);
        },
        onError: (error, ...rest) => {
          toast.error(`Could not create ${label.toLowerCase()}`, errorMessage(error));
          options?.onError?.(error, ...rest);
        },
      });
    },
    useUpdate: (options?: UseMutationOptions<T, Error, { id: string; data: Update }>) => {
      const queryClient = useQueryClient();
      return useMutation({
        ...options,
        mutationFn: async ({ id, data: payload }: { id: string; data: Update }) => {
          const { data } = await apiClient.put<ApiResponse<T>>(`${path}/${id}`, payload);
          return data.data;
        },
        onSuccess: (...args) => {
          queryClient.invalidateQueries({ queryKey: keys.all });
          toast.success(`${label} updated`);
          options?.onSuccess?.(...args);
        },
        onError: (error, ...rest) => {
          toast.error(`Could not update ${label.toLowerCase()}`, errorMessage(error));
          options?.onError?.(error, ...rest);
        },
      });
    },
    useDelete: (options?: UseMutationOptions<void, Error, string>) => {
      const queryClient = useQueryClient();
      return useMutation({
        ...options,
        mutationFn: async (id: string) => {
          await apiClient.delete(`${path}/${id}`);
        },
        onSuccess: (...args) => {
          queryClient.invalidateQueries({ queryKey: keys.all });
          toast.success(`${label} deleted`);
          options?.onSuccess?.(...args);
        },
        onError: (error, ...rest) => {
          toast.error(`Could not delete ${label.toLowerCase()}`, errorMessage(error));
          options?.onError?.(error, ...rest);
        },
      });
    },
    /**
     * Persists a new display order by writing each item's array index to its
     * `sortOrder`. Sends the full object per item (PUT endpoints expect the
     * complete DTO) and surfaces a single toast instead of one per item.
     */
    useReorder: () => {
      const queryClient = useQueryClient();
      return useMutation({
        mutationFn: async (ordered: (T & { id: string; sortOrder?: number })[]) => {
          await Promise.all(
            ordered.map((item, index) =>
              item.sortOrder === index
                ? Promise.resolve()
                : apiClient.put(`${path}/${item.id}`, { ...item, sortOrder: index }),
            ),
          );
        },
        onSuccess: () => {
          queryClient.invalidateQueries({ queryKey: keys.all });
          toast.success(`${label} order saved`);
        },
        onError: (error) => {
          toast.error(`Could not save ${label.toLowerCase()} order`, errorMessage(error));
        },
      });
    },
  };
}
