import axios from 'axios';
import type { AxiosError, AxiosInstance, InternalAxiosRequestConfig } from 'axios';
import { API_BASE_URL, REFRESH_TOKEN_KEY, TOKEN_KEY } from '@/constants/api';
import { useAuthStore } from '@/store/authStore';
import type { ApiResponse, LoginRequest, LoginResponse } from '@/types';

export const apiClient = axios.create({
  baseURL: API_BASE_URL,
  headers: { 'Content-Type': 'application/json' },
});

/** Anonymous client for public pages — never sends admin JWT (shows published content only). */
export const publicApiClient = axios.create({
  baseURL: API_BASE_URL,
  headers: { 'Content-Type': 'application/json' },
});

apiClient.interceptors.request.use((config: InternalAxiosRequestConfig) => {
  const token = localStorage.getItem(TOKEN_KEY);
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

let isRefreshing = false;
let failedQueue: Array<{
  resolve: (token: string) => void;
  reject: (error: unknown) => void;
}> = [];

const processQueue = (error: unknown, token: string | null = null) => {
  failedQueue.forEach((prom) => {
    if (error) {
      prom.reject(error);
    } else if (token) {
      prom.resolve(token);
    }
  });
  failedQueue = [];
};

const attachAuthRefresh = (client: AxiosInstance) => {
  client.interceptors.response.use(
    (response) => response,
    async (error: AxiosError) => {
      const originalRequest = error.config as InternalAxiosRequestConfig & { _retry?: boolean };

      if (error.response?.status !== 401 || originalRequest._retry) {
        return Promise.reject(error);
      }

      if (isRefreshing) {
        return new Promise<string>((resolve, reject) => {
          failedQueue.push({ resolve, reject });
        }).then((token) => {
          originalRequest.headers.Authorization = `Bearer ${token}`;
          return client(originalRequest);
        });
      }

      originalRequest._retry = true;
      isRefreshing = true;

      const refreshToken = localStorage.getItem(REFRESH_TOKEN_KEY);
      if (!refreshToken) {
        useAuthStore.getState().logout();
        isRefreshing = false;
        redirectToAdminLogin();
        return Promise.reject(error);
      }

      try {
        const { data } = await axios.post<ApiResponse<LoginResponse>>(
          `${API_BASE_URL}/auth/refresh`,
          { refreshToken },
        );
        const { accessToken, refreshToken: newRefreshToken } = data.data;
        useAuthStore.getState().setTokens(accessToken, newRefreshToken);
        processQueue(null, accessToken);
        originalRequest.headers.Authorization = `Bearer ${accessToken}`;
        return client(originalRequest);
      } catch (refreshError) {
        processQueue(refreshError, null);
        useAuthStore.getState().logout();
        redirectToAdminLogin();
        return Promise.reject(refreshError);
      } finally {
        isRefreshing = false;
      }
    },
  );
};

attachAuthRefresh(apiClient);

function redirectToAdminLogin() {
  if (typeof window === 'undefined') return;
  if (!window.location.pathname.startsWith('/admin/login')) {
    window.location.assign('/admin/login');
  }
}

export const authApi = {
  login: (payload: LoginRequest) =>
    apiClient.post<ApiResponse<LoginResponse>>('/auth/login', payload),
  logout: () => apiClient.post('/auth/logout'),
  me: () => apiClient.get<ApiResponse<{ user: LoginResponse['user'] }>>('/auth/me'),
};

export default apiClient;
