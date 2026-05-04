const API_BASE = process.env.NEXT_PUBLIC_API_URL || "http://localhost:8000";

interface ApiOptions {
  method?: string;
  body?: unknown;
  headers?: Record<string, string>;
}

class ApiClient {
  private baseUrl: string;

  constructor(baseUrl: string) {
    this.baseUrl = baseUrl;
  }

  private getToken(): string | null {
    if (typeof window === "undefined") return null;
    return localStorage.getItem("access_token");
  }

  async request<T>(endpoint: string, options: ApiOptions = {}): Promise<T> {
    const { method = "GET", body, headers = {} } = options;
    const token = this.getToken();

    const config: RequestInit = {
      method,
      headers: {
        "Content-Type": "application/json",
        ...(token ? { Authorization: `Bearer ${token}` } : {}),
        ...headers,
      },
    };

    if (body) {
      config.body = JSON.stringify(body);
    }

    const response = await fetch(`${this.baseUrl}${endpoint}`, config);

    if (response.status === 401) {
      // Try to refresh token
      const refreshed = await this.refreshToken();
      if (refreshed) {
        return this.request<T>(endpoint, options);
      }
      // Clear tokens and redirect to login
      localStorage.removeItem("access_token");
      localStorage.removeItem("refresh_token");
      if (typeof window !== "undefined") {
        window.location.href = "/";
      }
      throw new Error("Unauthorized");
    }

    if (!response.ok) {
      const error = await response.json().catch(() => ({ detail: "Request failed" }));
      throw new Error(error.detail || `HTTP ${response.status}`);
    }

    return response.json();
  }

  private async refreshToken(): Promise<boolean> {
    const refreshToken = localStorage.getItem("refresh_token");
    if (!refreshToken) return false;

    try {
      const response = await fetch(`${this.baseUrl}/api/v1/auth/refresh`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ refresh_token: refreshToken }),
      });

      if (!response.ok) return false;

      const data = await response.json();
      localStorage.setItem("access_token", data.access_token);
      localStorage.setItem("refresh_token", data.refresh_token);
      return true;
    } catch {
      return false;
    }
  }

  // Auth — Legacy
  async register(email: string, password: string, displayName?: string) {
    return this.request<{ access_token: string; refresh_token: string }>("/api/v1/auth/register", {
      method: "POST",
      body: { email, password, display_name: displayName },
    });
  }

  // Auth — Creator
  async registerCreator(
    email: string,
    password: string,
    displayName?: string,
    niche?: string,
    socialLinks?: Record<string, string>,
    followerCount?: number,
  ) {
    return this.request<{ access_token: string; refresh_token: string }>("/api/v1/auth/register/creator", {
      method: "POST",
      body: {
        email,
        password,
        display_name: displayName,
        niche,
        social_links: socialLinks || {},
        follower_count: followerCount || 0,
      },
    });
  }

  // Auth — Brand
  async registerBrand(
    email: string,
    password: string,
    companyName?: string,
    industry?: string,
    website?: string,
    budgetRange?: string,
  ) {
    return this.request<{ access_token: string; refresh_token: string }>("/api/v1/auth/register/brand", {
      method: "POST",
      body: {
        email,
        password,
        company_name: companyName,
        industry,
        website,
        budget_range: budgetRange,
      },
    });
  }

  async login(email: string, password: string) {
    return this.request<{ access_token: string; refresh_token: string }>("/api/v1/auth/login", {
      method: "POST",
      body: { email, password },
    });
  }

  async getMe() {
    return this.request<User>("/api/v1/auth/me");
  }

  async updateMe(data: Partial<User>) {
    return this.request<User>("/api/v1/auth/me", { method: "PATCH", body: data });
  }

  // Manager
  async getManagerCreators() {
    return this.request<ManagerUser[]>("/api/v1/manager/creators");
  }

  async getManagerBrands() {
    return this.request<ManagerUser[]>("/api/v1/manager/brands");
  }

}

export interface User {
  id: string;
  email: string;
  display_name: string | null;
  avatar_url: string | null;
  bio: string | null;
  niche: string | null;
  location: string | null;
  user_type: string;
  created_at: string;
}

export interface ManagerUser {
  id: string;
  email: string;
  display_name: string | null;
  avatar_url: string | null;
  user_type: string;
  created_at: string;
  profile: Record<string, unknown> | null;
}

export const api = new ApiClient(API_BASE);
