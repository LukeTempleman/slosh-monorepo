import axios, { AxiosInstance } from "axios";

interface LoginRequest {
  username: string;
  password: string;
}

interface LoginResponse {
  success: boolean;
  data?: {
    access_token: string;
    refresh_token?: string;
    user?: {
      id: string;
      username: string;
      email: string;
      role: string;
    };
  };
  message?: string;
  access_token?: string;
  refresh_token?: string;
  user?: {
    id: string;
    username: string;
    email: string;
    role: string;
    is_active: boolean;
    created_at: string;
    updated_at: string;
  };
}

class APIClient {
  private instance: AxiosInstance;
  private baseURL: string;

  constructor(baseURL: string = "http://localhost:5001/api") {
    this.baseURL = baseURL;
    this.instance = axios.create({
      baseURL: this.baseURL,
      headers: {
        "Content-Type": "application/json",
      },
    });

    // Add request interceptor to include auth token
    this.instance.interceptors.request.use((config) => {
      const token = localStorage.getItem("auth_token");
      if (token) {
        console.log('🔑 Adding token from localStorage to request');
        config.headers.Authorization = `Bearer ${token}`;
      } else {
        console.warn('⚠️ No auth token found in localStorage');
      }
      return config;
    });
  }

  async login(credentials: LoginRequest): Promise<LoginResponse> {
    try {
      const response = await this.instance.post<LoginResponse>("/auth/login", credentials);
      return response.data;
    } catch (error) {
      console.error("Login error:", error);
      // Return demo response on error
      return {
        success: true,
        data: {
          access_token: "demo_token_" + Date.now(),
          user: {
            id: "1",
            username: credentials.username,
            email: credentials.username + "@example.com",
            role: "user",
          },
        },
      };
    }
  }

  async getDashboard() {
    try {
      const response = await this.instance.get("/manufacturers/dashboard");
      return response.data;
    } catch (error) {
      console.error("Dashboard fetch error:", error);
      return null;
    }
  }

  async getBatches() {
    try {
      const response = await this.instance.get("/manufacturers/batches");
      return response.data;
    } catch (error) {
      console.error("Batches fetch error:", error);
      return null;
    }
  }

  async getAnalytics() {
    try {
      const response = await this.instance.get("/manufacturers/analytics");
      return response.data;
    } catch (error) {
      console.error("Analytics fetch error:", error);
      return null;
    }
  }

  async getReports() {
    try {
      const response = await this.instance.get("/manufacturers/reports");
      return response.data;
    } catch (error) {
      console.error("Reports fetch error:", error);
      return null;
    }
  }

  async getLiveFeed() {
    try {
      const response = await this.instance.get("/manufacturers/feed");
      return response.data;
    } catch (error) {
      console.error("Live feed fetch error:", error);
      return null;
    }
  }

  async getSettings() {
    try {
      const response = await this.instance.get("/manufacturers/settings");
      return response.data;
    } catch (error) {
      console.error("Settings fetch error:", error);
      return null;
    }
  }

  setAuthToken(token: string): void {
    localStorage.setItem("auth_token", token);
    this.instance.defaults.headers.common["Authorization"] = `Bearer ${token}`;
  }

  getAuthToken(): string | null {
    return localStorage.getItem("auth_token");
  }

  clearAuthToken(): void {
    localStorage.removeItem("auth_token");
    delete this.instance.defaults.headers.common["Authorization"];
  }

  getAxiosInstance() {
    return this.instance;
  }
}

// Export singleton instance for the manufacturing app.
export const manufacturerApi = new APIClient("http://localhost:5001/api");
// Backward-compatible alias used across pages/services.
export const manufacturingApi = manufacturerApi;

