/* eslint-disable @typescript-eslint/no-explicit-any */
/**
 * API Client for Recruitsss Backend
 * Handles all HTTP requests to Django backend
 */

import axios, { AxiosInstance, AxiosRequestConfig, AxiosResponse } from "axios";

const API_BASE_URL =
  process.env.NEXT_PUBLIC_API_URL || "http://localhost:8000/api/v1";

class APIClient {
  private client: AxiosInstance;

  constructor() {
    this.client = axios.create({
      baseURL: API_BASE_URL,
      headers: {
        "Content-Type": "application/json",
      },
      timeout: 30000,
    });

    // Request interceptor to add auth token
    this.client.interceptors.request.use(
      (config) => {
        const token = this.getAccessToken();
        if (token) {
          config.headers.Authorization = `Bearer ${token}`;
        }
        return config;
      },
      (error) => Promise.reject(error)
    );

    // Response interceptor to handle errors
    this.client.interceptors.response.use(
      (response) => response,
      async (error) => {
        const originalRequest = error.config;

        // If error is 401 and we haven't retried yet, try to refresh token
        if (error.response?.status === 401 && !originalRequest._retry) {
          originalRequest._retry = true;

          try {
            const refreshToken = this.getRefreshToken();
            if (refreshToken) {
              const response = await this.client.post("/auth/token/refresh/", {
                refresh: refreshToken,
              });

              const { access } = response.data;
              this.setAccessToken(access);

              // Retry original request with new token
              originalRequest.headers.Authorization = `Bearer ${access}`;
              return this.client(originalRequest);
            }
          } catch (refreshError) {
            // Refresh failed, redirect to login
            this.clearTokens();
            if (typeof window !== "undefined") {
              window.location.href = "/auth/login";
            }
            return Promise.reject(refreshError);
          }
        }

        return Promise.reject(error);
      }
    );
  }

  // Token management
  private getAccessToken(): string | null {
    if (typeof window === "undefined") return null;
    return localStorage.getItem("access_token");
  }

  private getRefreshToken(): string | null {
    if (typeof window === "undefined") return null;
    return localStorage.getItem("refresh_token");
  }

  private setAccessToken(token: string): void {
    if (typeof window !== "undefined") {
      localStorage.setItem("access_token", token);
    }
  }

  private setRefreshToken(token: string): void {
    if (typeof window !== "undefined") {
      localStorage.setItem("refresh_token", token);
    }
  }

  private clearTokens(): void {
    if (typeof window !== "undefined") {
      localStorage.removeItem("access_token");
      localStorage.removeItem("refresh_token");
    }
  }

  // HTTP Methods
  async get<T = any>(url: string, config?: AxiosRequestConfig): Promise<T> {
    const response = await this.client.get<T>(url, config);
    return response.data;
  }

  async post<T = any>(
    url: string,
    data?: any,
    config?: AxiosRequestConfig
  ): Promise<T> {
    const response = await this.client.post<T>(url, data, config);
    return response.data;
  }

  async put<T = any>(
    url: string,
    data?: any,
    config?: AxiosRequestConfig
  ): Promise<T> {
    const response = await this.client.put<T>(url, data, config);
    return response.data;
  }

  async patch<T = any>(
    url: string,
    data?: any,
    config?: AxiosRequestConfig
  ): Promise<T> {
    const response = await this.client.patch<T>(url, data, config);
    return response.data;
  }

  async delete<T = any>(url: string, config?: AxiosRequestConfig): Promise<T> {
    const response = await this.client.delete<T>(url, config);
    return response.data;
  }

  // Authentication methods
  async login(email: string, password: string): Promise<any> {
    const response = await this.post("/auth/login/", { email, password });
    if (response.tokens) {
      this.setAccessToken(response.tokens.access);
      this.setRefreshToken(response.tokens.refresh);
    }
    return response;
  }

  async register(data: any): Promise<any> {
    const response = await this.post("/auth/register/", data);
    if (response.tokens) {
      this.setAccessToken(response.tokens.access);
      this.setRefreshToken(response.tokens.refresh);
    }
    return response;
  }

  async logout(): Promise<void> {
    const refreshToken = this.getRefreshToken();
    try {
      await this.post("/auth/logout/", { refresh_token: refreshToken });
    } finally {
      this.clearTokens();
    }
  }

  // User methods
  async getCurrentUser(): Promise<any> {
    return this.get("/users/me/");
  }

  async updateProfile(data: any): Promise<any> {
    return this.put("/users/update_profile/", data);
  }

  // Job methods
  async getJobs(params?: any): Promise<any> {
    return this.get("/jobs/", { params });
  }

  async getJob(id: string): Promise<any> {
    return this.get(`/jobs/${id}/`);
  }

  async createJob(data: any): Promise<any> {
    return this.post("/jobs/", data);
  }

  async updateJob(id: string, data: any): Promise<any> {
    return this.patch(`/jobs/${id}/`, data);
  }

  async publishJob(id: string): Promise<any> {
    return this.post(`/jobs/${id}/publish/`);
  }

  async closeJob(id: string): Promise<any> {
    return this.post(`/jobs/${id}/close/`);
  }

  // Application methods
  async getApplications(params?: any): Promise<any> {
    return this.get("/applications/", { params });
  }

  async getApplication(id: string): Promise<any> {
    return this.get(`/applications/${id}/`);
  }

  async createApplication(data: any): Promise<any> {
    return this.post("/applications/", data);
  }

  async withdrawApplication(id: string): Promise<any> {
    return this.post(`/applications/${id}/withdraw/`);
  }

  async updateApplicationStatus(id: string, data: any): Promise<any> {
    return this.patch(`/applications/${id}/`, data);
  }

  async shortlistApplication(id: string): Promise<any> {
    return this.post(`/applications/${id}/shortlist/`);
  }

  async acceptApplication(id: string): Promise<any> {
    return this.post(`/applications/${id}/accept/`);
  }

  async rejectApplication(id: string): Promise<any> {
    return this.post(`/applications/${id}/reject/`);
  }

  // Notification methods
  async getNotifications(params?: any): Promise<any> {
    return this.get("/notifications/", { params });
  }

  async markNotificationAsRead(id: string): Promise<any> {
    return this.post(`/notifications/${id}/mark_read/`);
  }

  async markAllNotificationsAsRead(): Promise<any> {
    return this.post("/notifications/mark_all_read/");
  }

  async getUnreadNotificationCount(): Promise<number> {
    const response = await this.get("/notifications/unread/");
    return response.count || 0;
  }

  // Saved jobs methods
  async getSavedJobs(): Promise<any> {
    return this.get("/saved-jobs/");
  }

  async saveJob(jobId: string): Promise<any> {
    return this.post("/saved-jobs/", { job_offer: jobId });
  }

  async unsaveJob(id: string): Promise<any> {
    return this.delete(`/saved-jobs/${id}/`);
  }
}

// Export singleton instance
export const apiClient = new APIClient();
export default apiClient;
