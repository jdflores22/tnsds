import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import apiClient, { authApi, publicApiClient } from '@/api/client';
import { createResourceHooks } from '@/api/hooks/createResourceHooks';
import type {
  ApiResponse,
  AuthUser,
  Blog,
  Career,
  Client,
  ContactFormRequest,
  ContactMessage,
  CreateBlog,
  CreateCareer,
  CreateClient,
  CreatePortfolio,
  CreateProject,
  CreateService,
  CreateSoftwareProduct,
  CreateIndustry,
  CreateFaqItem,
  CreateSiteStat,
  CreateCompanyHighlight,
  CreateProcessStep,
  CreateSeoSetting,
  CreateSiteSetting,
  CreateTechnology,
  CreateTestimonial,
  CreateUser,
  DashboardStats,
  Industry,
  FaqItem,
  SiteStat,
  CompanyHighlight,
  ProcessStep,
  LoginRequest,
  Portfolio,
  Project,
  SeoSetting,
  Service,
  SiteSetting,
  SoftwareProduct,
  SubscribeRequest,
  Technology,
  Testimonial,
  UpdateBlog,
  UpdateCareer,
  UpdateClient,
  UpdatePortfolio,
  UpdateProject,
  UpdateService,
  UpdateSoftwareProduct,
  UpdateIndustry,
  UpdateFaqItem,
  UpdateSiteStat,
  UpdateCompanyHighlight,
  UpdateProcessStep,
  UpdateSeoSetting,
  UpdateSiteSetting,
  UpdateTechnology,
  UpdateTestimonial,
  UpdateUser,
  User,
  ActivityLog,
  MediaFile,
  Role,
  Subscriber,
  JobApplication,
} from '@/types';
import { useAuthStore } from '@/store/authStore';
import { toast } from '@/store/toastStore';

function invalidateSettings(queryClient: ReturnType<typeof useQueryClient>) {
  queryClient.invalidateQueries({ queryKey: ['settings'] });
  queryClient.invalidateQueries({ queryKey: ['settings', 'public'] });
}

export const servicesHooks = createResourceHooks<Service, CreateService, UpdateService>(
  'services',
  true,
);
export const useServices = servicesHooks.useList;
export const useAdminServices = servicesHooks.useAdminList;
export const useService = servicesHooks.useBySlug;
export const useServiceById = servicesHooks.useById;
export const useCreateService = servicesHooks.useCreate;
export const useUpdateService = servicesHooks.useUpdate;
export const useDeleteService = servicesHooks.useDelete;
export const useReorderServices = servicesHooks.useReorder;

export const productsHooks = createResourceHooks<
  SoftwareProduct,
  CreateSoftwareProduct,
  UpdateSoftwareProduct
>('products', true);
export const useProducts = productsHooks.useList;
export const useAdminProducts = productsHooks.useAdminList;
export const useProductBySlug = productsHooks.useBySlug;
export const useCreateProduct = productsHooks.useCreate;
export const useUpdateProduct = productsHooks.useUpdate;
export const useDeleteProduct = productsHooks.useDelete;
export const useReorderProducts = productsHooks.useReorder;

export const industriesHooks = createResourceHooks<
  Industry,
  CreateIndustry,
  UpdateIndustry
>('industries', true);
export const useIndustries = industriesHooks.useList;
export const useAdminIndustries = industriesHooks.useAdminList;
export const useCreateIndustry = industriesHooks.useCreate;
export const useUpdateIndustry = industriesHooks.useUpdate;
export const useDeleteIndustry = industriesHooks.useDelete;
export const useReorderIndustries = industriesHooks.useReorder;

export const faqHooks = createResourceHooks<FaqItem, CreateFaqItem, UpdateFaqItem>('faq', true);
export const useFaqItems = faqHooks.useList;
export const useAdminFaqItems = faqHooks.useAdminList;
export const useCreateFaqItem = faqHooks.useCreate;
export const useUpdateFaqItem = faqHooks.useUpdate;
export const useDeleteFaqItem = faqHooks.useDelete;
export const useReorderFaqItems = faqHooks.useReorder;

export const siteStatsHooks = createResourceHooks<SiteStat, CreateSiteStat, UpdateSiteStat>('SiteStats', true);
export const useSiteStats = siteStatsHooks.useList;
export const useAdminSiteStats = siteStatsHooks.useAdminList;
export const useCreateSiteStat = siteStatsHooks.useCreate;
export const useUpdateSiteStat = siteStatsHooks.useUpdate;
export const useDeleteSiteStat = siteStatsHooks.useDelete;
export const useReorderSiteStats = siteStatsHooks.useReorder;

export const companyHighlightsHooks = createResourceHooks<CompanyHighlight, CreateCompanyHighlight, UpdateCompanyHighlight>('CompanyHighlights', true);
export const useCompanyHighlights = companyHighlightsHooks.useList;
export const useAdminCompanyHighlights = companyHighlightsHooks.useAdminList;
export const useCreateCompanyHighlight = companyHighlightsHooks.useCreate;
export const useUpdateCompanyHighlight = companyHighlightsHooks.useUpdate;
export const useDeleteCompanyHighlight = companyHighlightsHooks.useDelete;
export const useReorderCompanyHighlights = companyHighlightsHooks.useReorder;

export const processStepsHooks = createResourceHooks<ProcessStep, CreateProcessStep, UpdateProcessStep>('ProcessSteps', true);
export const useProcessSteps = processStepsHooks.useList;
export const useAdminProcessSteps = processStepsHooks.useAdminList;
export const useCreateProcessStep = processStepsHooks.useCreate;
export const useUpdateProcessStep = processStepsHooks.useUpdate;
export const useDeleteProcessStep = processStepsHooks.useDelete;
export const useReorderProcessSteps = processStepsHooks.useReorder;

export const technologiesHooks = createResourceHooks<Technology, CreateTechnology, UpdateTechnology>(
  'technologies',
  true,
);
export const useTechnologies = technologiesHooks.useList;
export const useAdminTechnologies = technologiesHooks.useAdminList;
export const useCreateTechnology = technologiesHooks.useCreate;
export const useUpdateTechnology = technologiesHooks.useUpdate;
export const useDeleteTechnology = technologiesHooks.useDelete;
export const useReorderTechnologies = technologiesHooks.useReorder;

export const portfolioHooks = createResourceHooks<Portfolio, CreatePortfolio, UpdatePortfolio>(
  'portfolio',
  true,
);
export const usePortfolio = portfolioHooks.useList;
export const useAdminPortfolio = portfolioHooks.useAdminList;
export const usePortfolioItem = portfolioHooks.useBySlug;
export const useCreatePortfolio = portfolioHooks.useCreate;
export const useUpdatePortfolio = portfolioHooks.useUpdate;
export const useDeletePortfolio = portfolioHooks.useDelete;
export const useReorderPortfolio = portfolioHooks.useReorder;

export const blogsHooks = createResourceHooks<Blog, CreateBlog, UpdateBlog>('blogs', true);
export const useBlogs = blogsHooks.useList;
export const useAdminBlogs = blogsHooks.useAdminList;
export const useBlog = blogsHooks.useBySlug;
export const useCreateBlog = blogsHooks.useCreate;
export const useUpdateBlog = blogsHooks.useUpdate;
export const useDeleteBlog = blogsHooks.useDelete;

export const clientsHooks = createResourceHooks<Client, CreateClient, UpdateClient>('clients', true);
export const useClients = clientsHooks.useList;
export const useAdminClients = clientsHooks.useAdminList;
export const useCreateClient = clientsHooks.useCreate;
export const useUpdateClient = clientsHooks.useUpdate;
export const useDeleteClient = clientsHooks.useDelete;
/** @deprecated use useClients */
export const usePublicClients = useClients;

export const careersHooks = createResourceHooks<Career, CreateCareer, UpdateCareer>('careers', true);
export const useCareers = careersHooks.useList;
export const useAdminCareers = careersHooks.useAdminList;
export const useCareer = careersHooks.useBySlug;
export const useCreateCareer = careersHooks.useCreate;
export const useUpdateCareer = careersHooks.useUpdate;
export const useDeleteCareer = careersHooks.useDelete;

export const projectsHooks = createResourceHooks<Project, CreateProject, UpdateProject>('projects');
export const useProjects = projectsHooks.useList;
export const useAdminProjects = projectsHooks.useAdminList;
export const useCreateProject = projectsHooks.useCreate;
export const useUpdateProject = projectsHooks.useUpdate;
export const useDeleteProject = projectsHooks.useDelete;

export const testimonialsHooks = createResourceHooks<
  Testimonial,
  CreateTestimonial,
  UpdateTestimonial
>('testimonials', true);
export const useTestimonials = testimonialsHooks.useList;
export const useAdminTestimonials = testimonialsHooks.useAdminList;
export const useCreateTestimonial = testimonialsHooks.useCreate;
export const useUpdateTestimonial = testimonialsHooks.useUpdate;
export const useDeleteTestimonial = testimonialsHooks.useDelete;
export const useReorderTestimonials = testimonialsHooks.useReorder;

export function useAuth() {
  const setAuth = useAuthStore((s) => s.setAuth);
  const logout = useAuthStore((s) => s.logout);
  const user = useAuthStore((s) => s.user);
  const isAuthenticated = useAuthStore((s) => s.isAuthenticated);

  const loginMutation = useMutation({
    mutationFn: async (payload: LoginRequest) => {
      const { data } = await authApi.login(payload);
      return data.data;
    },
    onSuccess: (data) => {
      const user: AuthUser = {
        ...data.user,
        role: data.user.roleName ?? data.user.role,
      };
      setAuth(user, data.accessToken, data.refreshToken);
    },
  });

  const logoutMutation = useMutation({
    mutationFn: async () => {
      try {
        await authApi.logout();
      } finally {
        logout();
      }
    },
  });

  return { user, isAuthenticated, loginMutation, logoutMutation };
}

export function useDashboardStats() {
  return useQuery({
    queryKey: ['dashboard', 'stats'],
    queryFn: async () => {
      const { data } = await apiClient.get<ApiResponse<DashboardStats>>('/dashboard/stats');
      return data.data;
    },
  });
}

export function useMessages() {
  return useQuery({
    queryKey: ['messages'],
    queryFn: async () => {
      const { data } = await apiClient.get<ApiResponse<ContactMessage[]>>('/messages');
      return data.data;
    },
  });
}

export function useUpdateMessageStatus() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async ({ id, status }: { id: string; status: number }) => {
      const { data } = await apiClient.patch<ApiResponse<ContactMessage>>(`/messages/${id}`, {
        status,
      });
      return data.data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['messages'] });
    },
  });
}

export function useSubmitContact() {
  return useMutation({
    mutationFn: async (payload: ContactFormRequest) => {
      const { data } = await apiClient.post<ApiResponse<void>>('/messages', payload);
      return data;
    },
  });
}

export function useSubscribe() {
  return useMutation({
    mutationFn: async (payload: SubscribeRequest) => {
      const { data } = await apiClient.post<ApiResponse<void>>('/subscribers', payload);
      return data;
    },
    onSuccess: () => toast.success('Subscribed successfully'),
    onError: () => toast.error('Could not subscribe — try again'),
  });
}

export function useSubscribers(page = 1, pageSize = 50) {
  return useQuery({
    queryKey: ['subscribers', page, pageSize],
    queryFn: async () => {
      const { data } = await apiClient.get<ApiResponse<Subscriber[]>>('/subscribers', {
        params: { page, pageSize },
      });
      return { items: data.data, meta: data.meta };
    },
  });
}

export function useUnsubscribe() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (id: string) => {
      await apiClient.post(`/subscribers/${id}/unsubscribe`);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['subscribers'] });
      toast.success('Subscriber unsubscribed');
    },
  });
}

export function useDeleteSubscriber() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (id: string) => {
      await apiClient.delete(`/subscribers/${id}`);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['subscribers'] });
      toast.success('Subscriber removed');
    },
  });
}

export function useJobApplications(page = 1, pageSize = 25) {
  return useQuery({
    queryKey: ['job-applications', page, pageSize],
    queryFn: async () => {
      const { data } = await apiClient.get<ApiResponse<JobApplication[]>>('/careers/applications', {
        params: { page, pageSize },
      });
      return { items: data.data, meta: data.meta };
    },
  });
}

export function useSubmitJobApplication() {
  return useMutation({
    mutationFn: async (payload: {
      careerId: string;
      fullName: string;
      email: string;
      phone: string;
      coverLetter: string;
      resumeUrl: string;
    }) => {
      const { data } = await apiClient.post<ApiResponse<JobApplication>>('/careers/applications', payload);
      return data.data;
    },
    onSuccess: () => toast.success('Application submitted'),
    onError: () => toast.error('Could not submit application'),
  });
}

export function useUpdateJobApplicationStatus() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async ({ id, status }: { id: string; status: number }) => {
      const { data } = await apiClient.put<ApiResponse<JobApplication>>(`/careers/applications/${id}`, {
        status,
      });
      return data.data;
    },
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ['job-applications'] }),
  });
}

export function useRoles() {
  return useQuery({
    queryKey: ['roles'],
    queryFn: async () => {
      const { data } = await apiClient.get<ApiResponse<Role[]>>('/users/roles');
      return data.data;
    },
  });
}

export function useUsers() {
  return useQuery({
    queryKey: ['users'],
    queryFn: async () => {
      const { data } = await apiClient.get<ApiResponse<User[]>>('/users');
      return data.data;
    },
  });
}

export function useCreateUser() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (payload: CreateUser) => {
      const { data } = await apiClient.post<ApiResponse<User>>('/users', payload);
      return data.data;
    },
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ['users'] }),
  });
}

export function useUpdateUser() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async ({ id, data: payload }: { id: string; data: UpdateUser }) => {
      const { data } = await apiClient.put<ApiResponse<User>>(`/users/${id}`, payload);
      return data.data;
    },
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ['users'] }),
  });
}

export function useDeleteUser() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (id: string) => {
      await apiClient.delete(`/users/${id}`);
    },
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ['users'] }),
  });
}

export function useSiteSettings() {
  return useQuery({
    queryKey: ['settings'],
    queryFn: async () => {
      const { data } = await apiClient.get<ApiResponse<SiteSetting[]>>('/settings');
      return data.data;
    },
  });
}

export function useUpdateSiteSetting() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async ({ id, data: payload }: { id: string; data: UpdateSiteSetting }) => {
      const { data } = await apiClient.put<ApiResponse<SiteSetting>>(`/settings/${id}`, payload);
      return data.data;
    },
    onSuccess: () => invalidateSettings(queryClient),
  });
}

export function useCreateSiteSetting() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (payload: CreateSiteSetting) => {
      const { data } = await apiClient.post<ApiResponse<SiteSetting>>('/settings', payload);
      return data.data;
    },
    onSuccess: () => invalidateSettings(queryClient),
  });
}

export function useDeleteSiteSetting() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (id: string) => {
      await apiClient.delete(`/settings/${id}`);
    },
    onSuccess: () => invalidateSettings(queryClient),
  });
}

export function useSeoSettings() {
  return useQuery({
    queryKey: ['seo'],
    queryFn: async () => {
      const { data } = await apiClient.get<ApiResponse<SeoSetting[]>>('/seo');
      return data.data;
    },
  });
}

export function useSeoByPageKey(pageKey: string) {
  return useQuery({
    queryKey: ['seo', 'page', pageKey],
    queryFn: async () => {
      const { data } = await publicApiClient.get<ApiResponse<SeoSetting>>(`/seo/page/${pageKey}`);
      return data.data;
    },
    enabled: !!pageKey,
    staleTime: 60_000,
    retry: false,
  });
}

export function useUpdateSeoSetting() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async ({ id, data: payload }: { id: string; data: UpdateSeoSetting }) => {
      const { data } = await apiClient.put<ApiResponse<SeoSetting>>(`/seo/${id}`, payload);
      return data.data;
    },
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ['seo'] }),
  });
}

export function useCreateSeoSetting() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (payload: CreateSeoSetting) => {
      const { data } = await apiClient.post<ApiResponse<SeoSetting>>('/seo', payload);
      return data.data;
    },
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ['seo'] }),
  });
}

export function useDeleteSeoSetting() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (id: string) => {
      await apiClient.delete(`/seo/${id}`);
    },
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ['seo'] }),
  });
}

export function useActivityLogs(page: number, pageSize: number, search = '') {
  return useQuery({
    queryKey: ['activity-logs', page, pageSize, search],
    queryFn: async () => {
      const { data } = await apiClient.get<ApiResponse<ActivityLog[]>>('/ActivityLogs', {
        params: { page, pageSize, search: search || undefined },
      });
      return { items: data.data, meta: data.meta };
    },
  });
}

export function useMediaFiles(folder?: string) {
  return useQuery({
    queryKey: ['media', folder ?? 'all'],
    queryFn: async () => {
      const { data } = await apiClient.get<ApiResponse<MediaFile[]>>('/upload', {
        params: folder ? { folder } : undefined,
      });
      return data.data;
    },
  });
}

export function useDeleteMedia() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (path: string) => {
      await apiClient.delete('/upload', { params: { path } });
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['media'] });
    },
  });
}
