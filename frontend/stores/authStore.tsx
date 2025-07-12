import axios, {
  AxiosError,
  AxiosResponse,
  InternalAxiosRequestConfig,
} from 'axios';
import { create } from 'zustand';

import { api } from '../api/BaseAPI';

interface AuthState {
  accessToken: string | null;
  setAccessToken: (token: string | null) => void;
}

interface AxiosRequestConfigWithRetry extends InternalAxiosRequestConfig {
  _retry?: boolean;
}

export const useAuthStore = create<AuthState>((set, get) => {
  const setAccessToken = (token: string | null) => {
    set({ accessToken: token });
  };

  // ✅ Request Interceptor
  api.interceptors.request.use(
    (config: InternalAxiosRequestConfig) => {
      const token = get().accessToken;
      if (token) {
        config.headers.Authorization = `Bearer ${token}`;
      }
      return config;
    },
    (error: Error) => {
      return Promise.reject(error);
    }
  );

  // ✅ Response Interceptor with auto refresh
  api.interceptors.response.use(
    (response: AxiosResponse) => response,
    async (error: AxiosError) => {
      const originalRequest =
        error.config as AxiosRequestConfigWithRetry | undefined;

      if (!originalRequest || originalRequest._retry) {
        return Promise.reject(error);
      }

      if (error.response?.status === 401) {
        originalRequest._retry = true;

        try {
          const res = await axios.post<{ accessToken: string }>(
            `${import.meta.env.VITE_BASE_URL}/users/refresh`,
            {},
            { withCredentials: true }
          );

          const newToken = res.data.accessToken;
          set({ accessToken: newToken });

          originalRequest.headers.Authorization = `Bearer ${newToken}`;

          return axios(originalRequest);
        } catch (refreshError) {
          window.location.href = '/login';
          return Promise.reject(refreshError);
        }
      }

      return Promise.reject(error);
    }
  );

  return {
    accessToken: null,
    setAccessToken,
  };
});
