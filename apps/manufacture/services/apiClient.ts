/**
 * API Client for Manufacturing Backend
 * Handles all communication with the backend API
 */

class ApiClient {
  private baseUrl: string;
  private token: string | null;

  constructor(baseUrl: string) {
    this.baseUrl = baseUrl;
    this.token = localStorage.getItem('authToken');
  }

  setAuthToken(token: string | null) {
    this.token = token;
    if (token) {
      localStorage.setItem('authToken', token);
    } else {
      localStorage.removeItem('authToken');
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
    return this.request<{ token: string; user: any }>('/api/auth/login', {
      method: 'POST',
      body: JSON.stringify(credentials),
    });
  }

  async register(userData: { username: string; email: string; password: string }) {
    return this.request<{ token: string; user: any }>('/api/auth/register', {
      method: 'POST',
      body: JSON.stringify(userData),
    });
  }

  async getCurrentUser() {
    return this.request<any>('/api/auth/me', {
      method: 'GET',
    });
  }

  // Secret key management
  async getSecretKey() {
    return this.request<{ key: string }>('/api/auth/me/secret-key', {
      method: 'GET',
    });
  }

  async setSecretKey(key: string) {
    return this.request<{ message: string }>('/api/auth/me/secret-key', {
      method: 'POST',
      body: JSON.stringify({ key }),
    });
  }

  async generateSecretKey() {
    return this.request<{ key: string }>('/api/auth/me/secret-key/generate', {
      method: 'POST',
    });
  }

  async resetSecretKey() {
    return this.request<{ message: string }>('/api/auth/me/secret-key', {
      method: 'DELETE',
    });
  }

  // User management (admin)
  async listUsers() {
    return this.request<any[]>('/api/auth/admin/users', {
      method: 'GET',
    });
  }

  async updateUserRole(userId: string, role: string) {
    return this.request<any>(`/api/auth/admin/users/${userId}/role`, {
      method: 'PATCH',
      body: JSON.stringify({ role }),
    });
  }

  async updateUserStatus(userId: string, status: string) {
    return this.request<any>(`/api/auth/admin/users/${userId}/status`, {
      method: 'PATCH',
      body: JSON.stringify({ status }),
    });
  }
}

export const manufacturingApi = new ApiClient('http://localhost:5001');

/**
 * API Client for GONXT Backend
 */
class GONXTApiClient {
  private baseUrl: string;
  private token: string | null;

  constructor(baseUrl: string) {
    this.baseUrl = baseUrl;
    this.token = localStorage.getItem('gonxtToken');
  }

  setAuthToken(token: string | null) {
    this.token = token;
    if (token) {
      localStorage.setItem('gonxtToken', token);
    } else {
      localStorage.removeItem('gonxtToken');
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
      console.error(`GONXT API request failed: ${error}`);
      throw error;
    }
  }

  async login(credentials: { username: string; password: string }) {
    return this.request<{ token: string; user: any }>('/api/auth/login', {
      method: 'POST',
      body: JSON.stringify(credentials),
    });
  }

  async getKeys() {
    return this.request<any[]>('/api/keys', {
      method: 'GET',
    });
  }

  async getKeyDetails(keyId: string) {
    return this.request<any>(`/api/keys/${keyId}`, {
      method: 'GET',
    });
  }

  async getKeyCodes(keyId: string) {
    return this.request<any>(`/api/keys/${keyId}/codes`, {
      method: 'GET',
    });
  }

  async createKey(keyData: { name: string; description?: string }) {
    return this.request<any>('/api/keys', {
      method: 'POST',
      body: JSON.stringify(keyData),
    });
  }

  async deleteKey(keyId: string) {
    return this.request<any>(`/api/keys/${keyId}`, {
      method: 'DELETE',
    });
  }

  async verifyCode(code: string) {
    return this.request<any>('/api/keys/verify', {
      method: 'POST',
      body: JSON.stringify({ code }),
    });
  }
}

export const gonxtApi = new GONXTApiClient('http://localhost:5000');