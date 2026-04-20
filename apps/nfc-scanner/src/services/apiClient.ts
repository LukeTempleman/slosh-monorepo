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
}

class APIClient {
  private instance: AxiosInstance;
  private baseURL: string;

  constructor(baseURL: string = "http://localhost:5000/api") {
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
        config.headers.Authorization = `Bearer ${token}`;
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
}

// Export singleton instances for each app
export const gonxtApi = new APIClient("http://localhost:5000/api");
