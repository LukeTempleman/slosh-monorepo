import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { AuthService, User } from '../services/authService';

interface AuthContextType {
  user: User | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  error: string | null;
  login: (username: string, password: string) => Promise<void>;
  logout: () => void;
  refreshUser: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Initialize auth on mount
  useEffect(() => {
    const initAuth = async () => {
      try {
        console.log('🔄 AuthContext initializing...');
        const storedUser = AuthService.getUser();
        const token = AuthService.getToken();
        const refreshToken = AuthService.getRefreshToken();
        
        console.log('📦 Stored data check:', { 
          hasUser: !!storedUser, 
          hasToken: !!token, 
          hasRefreshToken: !!refreshToken,
          username: storedUser?.username
        });
        
        // If we have both stored user and valid token, restore the session
        if (storedUser && token && AuthService.isTokenValid()) {
          console.log('✅ Restoring session from storage - user:', storedUser.username);
          setUser(storedUser);
        } else if (token && AuthService.isTokenValid()) {
          // Token is valid but no user in storage, fetch current user
          console.log('📥 Token valid, fetching current user from backend');
          const currentUser = await AuthService.getCurrentUser();
          setUser(currentUser);
        } else if (refreshToken) {
          // Try to refresh token
          console.log('🔄 Attempting token refresh');
          await AuthService.refreshToken();
          const currentUser = await AuthService.getCurrentUser();
          setUser(currentUser);
        } else {
          console.log('❌ No valid session data found in storage');
        }
      } catch (err) {
        console.error('❌ Auth initialization failed:', err);
        AuthService.logout();
      } finally {
        setIsLoading(false);
      }
    };

    initAuth();
  }, []);

  const login = async (username: string, password: string) => {
    try {
      console.log('🔐 AuthContext.login() called with username:', username);
      setError(null);
      setIsLoading(true);
      const response = await AuthService.login({ username, password });
      console.log('✅ AuthService.login() returned successfully, setting user:', response.user);
      
      // Ensure token is in localStorage with the right key for apiClient
      if (response.access_token) {
        localStorage.setItem('auth_token', response.access_token);
        console.log('✅ Token stored in localStorage for apiClient');
      }
      
      setUser(response.user);
      setIsLoading(false);
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Login failed';
      console.error('❌ AuthContext.login() caught error:', errorMessage);
      setError(errorMessage);
      setIsLoading(false);
      throw err;
    }
  };

  const logout = () => {
    AuthService.logout();
    setUser(null);
    setError(null);
  };

  const refreshUser = async () => {
    try {
      const currentUser = await AuthService.getCurrentUser();
      setUser(currentUser);
      setError(null);
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Failed to refresh user';
      setError(errorMessage);
      throw err;
    }
  };

  const value: AuthContextType = {
    user,
    isAuthenticated: !!user,
    isLoading,
    error,
    login,
    logout,
    refreshUser,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within AuthProvider');
  }
  return context;
};
