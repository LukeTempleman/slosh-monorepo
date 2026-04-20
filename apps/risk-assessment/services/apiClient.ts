/**
 * API Client for Risk Assessment Backend
 * Handles all communication with the backend API
 */

class ApiClient {
  private baseUrl: string;
  private token: string | null;

  constructor(baseUrl: string) {
    this.baseUrl = baseUrl;
    this.token = localStorage.getItem('riskAuthToken');
  }

  setAuthToken(token: string | null) {
    this.token = token;
    if (token) {
      localStorage.setItem('riskAuthToken', token);
    } else {
      localStorage.removeItem('riskAuthToken');
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

  // Risk Assessment endpoints
  async getRisks() {
    return this.request<any[]>('/api/risks', {
      method: 'GET',
    });
  }

  async getRiskById(id: string) {
    return this.request<any>(`/api/risks/${id}`, {
      method: 'GET',
    });
  }

  async createRisk(data: any) {
    return this.request<any>('/api/risks', {
      method: 'POST',
      body: JSON.stringify(data),
    });
  }

  async updateRisk(id: string, data: any) {
    return this.request<any>(`/api/risks/${id}`, {
      method: 'PUT',
      body: JSON.stringify(data),
    });
  }

  async deleteRisk(id: string) {
    return this.request<any>(`/api/risks/${id}`, {
      method: 'DELETE',
    });
  }

  // Threat intelligence endpoints
  async getThreats() {
    return this.request<any[]>('/api/threats', {
      method: 'GET',
    });
  }

  async getAlerts() {
    return this.request<any[]>('/api/alerts', {
      method: 'GET',
    });
  }

  // Hotspots and geographic data
  async getHotspots() {
    return this.request<any[]>('/api/hotspots', {
      method: 'GET',
    });
  }

  // Cases and investigations
  async getCases() {
    return this.request<any[]>('/api/cases', {
      method: 'GET',
    });
  }

  async getCaseById(id: string) {
    return this.request<any>(`/api/cases/${id}`, {
      method: 'GET',
    });
  }
}

export const riskAssessmentApi = new ApiClient('http://localhost:5000');
