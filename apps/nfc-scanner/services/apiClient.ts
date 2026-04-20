/**
 * API Client for GONXT Backend
 * Handles NFC verification and authentication
 */

class ApiClient {
  private baseUrl: string;
  private token: string | null;

  constructor(baseUrl: string) {
    this.baseUrl = baseUrl;
    this.token = localStorage.getItem('nfcAuthToken');
  }

  setAuthToken(token: string | null) {
    this.token = token;
    if (token) {
      localStorage.setItem('nfcAuthToken', token);
    } else {
      localStorage.removeItem('nfcAuthToken');
    }
  }

  private async request<T>(
    endpoint: string,
    options: RequestInit = {}
  ): Promise<{ success: boolean; data: T; message?: string }> {
    const url = `${this.baseUrl}${endpoint}`;
    const headers = {
      'Content-Type': 'application/json',
      ...(this.token && { 'Authorization': `Bearer ${this.token}` }),
      ...options.headers,
    };

    try {
      const response = await fetch(url, {
        ...options,
        headers,
      });

      if (!response.ok) {
        const errorText = await response.text();
        throw new Error(`HTTP ${response.status}: ${errorText || response.statusText}`);
      }

      const data = await response.json();
      return { success: true, data };
    } catch (error) {
      console.error(`API request failed: ${error}`);
      throw error;
    }
  }

  // Authentication endpoints
  async login(credentials: { username: string; password: string }) {
    return this.request<{ access_token: string; user: any }>('/api/auth/login', {
      method: 'POST',
      body: JSON.stringify(credentials),
    });
  }

  async register(userData: { username: string; email: string; password: string }) {
    return this.request<{ access_token: string; user: any }>('/api/auth/register', {
      method: 'POST',
      body: JSON.stringify(userData),
    });
  }

  async getCurrentUser() {
    return this.request<any>('/api/auth/me', {
      method: 'GET',
    });
  }

  // NFC Verification endpoints
  async verifyCode(code: string) {
    return this.request<{ verified: boolean; data: any }>('/api/codes/verify', {
      method: 'POST',
      body: JSON.stringify({ code }),
    });
  }
}

export const gonxtApi = new ApiClient('http://localhost:5000');
