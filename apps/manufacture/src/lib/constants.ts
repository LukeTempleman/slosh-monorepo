/**
 * API and application constants
 */

// API Configuration
export const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:5001/api';

// API Endpoints
export const API_ENDPOINTS = {
  // Auth
  AUTH_REGISTER: '/auth/register',
  AUTH_LOGIN: '/auth/login',
  AUTH_REFRESH: '/auth/refresh',
  AUTH_ME: '/auth/me',

  // Tags
  TAGS_PROVISION: '/tags/provision',
  TAGS_STATUS: '/tags/status',
  TAGS_LOCK: '/tags/lock',

  // Config
  CONFIG_SETUP: '/config/setup',
  CONFIG_GET: '/config/get',
};

// UI Constants
export const APP_NAME = 'Slosh Manufacturing';
export const APP_VERSION = '1.0.0';

// Pagination
export const DEFAULT_PAGE_SIZE = 20;
export const PAGE_SIZES = [10, 20, 50, 100];

// Timeouts (ms)
export const API_TIMEOUT = 30000;
export const TOKEN_REFRESH_INTERVAL = 5 * 60 * 1000; // 5 minutes

// Role-based access control
export const ROLES = {
  ADMIN: 'admin',
  USER: 'user',
  VIEWER: 'viewer',
};

export const ROLE_PERMISSIONS = {
  admin: ['read', 'write', 'delete', 'admin'],
  user: ['read', 'write'],
  viewer: ['read'],
};
