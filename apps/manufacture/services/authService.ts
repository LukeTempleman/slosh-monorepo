/**
 * Authentication Service
 * Handles user authentication and token management
 */

import { manufacturingApi } from './apiClient';
import type { ManufacturerUser } from '../types';

class AuthService {
  private currentUser: ManufacturerUser | null = null;
  private isAuthenticated: boolean = false;

  async login(username: string, password: string): Promise<boolean> {
    try {
      const response = await manufacturingApi.login({ username, password });
      
      if (response.success && response.data.access_token) {
        manufacturingApi.setAuthToken(response.data.access_token);
        this.isAuthenticated = true;
        
        // Store user data if provided in response
        if (response.data.user) {
          this.currentUser = {
            id: response.data.user.id,
            name: response.data.user.username,
            email: response.data.user.email,
            role: response.data.user.role || 'operator',
            facilityId: response.data.user.facility_id || 'FAC-001',
            createdAt: new Date(response.data.user.created_at || Date.now()),
          };
        }
        
        return true;
      }
      
      return false;
    } catch (error) {
      console.error('Login failed:', error);
      throw error;
    }
  }

  async register(username: string, email: string, password: string): Promise<boolean> {
    try {
      const response = await manufacturingApi.register({ username, email, password });
      
      if (response.success && response.data.access_token) {
        manufacturingApi.setAuthToken(response.data.access_token);
        this.isAuthenticated = true;
        return true;
      }
      
      return false;
    } catch (error) {
      console.error('Registration failed:', error);
      throw error;
    }
  }

  logout(): void {
    manufacturingApi.setAuthToken(null);
    this.currentUser = null;
    this.isAuthenticated = false;
  }

  getCurrentUser(): ManufacturerUser | null {
    return this.currentUser;
  }

  isAuthenticatedUser(): boolean {
    return this.isAuthenticated;
  }

  async fetchCurrentUser(): Promise<ManufacturerUser | null> {
    try {
      const response = await manufacturingApi.getCurrentUser();
      
      if (response.success && response.data) {
        this.currentUser = {
          id: response.data.id,
          name: response.data.username,
          email: response.data.email,
          role: response.data.role || 'operator',
          facilityId: response.data.facility_id || 'FAC-001',
          createdAt: new Date(response.data.created_at || Date.now()),
        };
        return this.currentUser;
      }
      
      return null;
    } catch (error) {
      console.error('Failed to fetch current user:', error);
      return null;
    }
  }
}

export const authService = new AuthService();