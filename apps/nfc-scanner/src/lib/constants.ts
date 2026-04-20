/**
 * API and application constants for NFC Scanner
 */

// API Configuration
export const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000/api';

// API Endpoints
export const API_ENDPOINTS = {
  // Auth
  AUTH_REGISTER: '/auth/register',
  AUTH_LOGIN: '/auth/login',
  AUTH_REFRESH: '/auth/refresh',
  AUTH_ME: '/auth/me',

  // Scan Verification
  SCAN_VERIFY: '/scan/verify',
  PRODUCT_INFO: '/product',
  REPORT_COUNTERFEIT: '/report-counterfeit',
};

// UI Constants
export const APP_NAME = 'Verifi-AI Scanner';
export const APP_VERSION = '1.0.0';

// Scan Configuration
export const SCAN_TIMEOUT = 15000; // 15 seconds
export const MAX_RETRIES = 3;

// Timeouts (ms)
export const API_TIMEOUT = 30000;
export const TOKEN_REFRESH_INTERVAL = 5 * 60 * 1000; // 5 minutes

// Role-based access control
export const ROLES = {
  CONSUMER: 'consumer',
  ADMIN: 'admin',
};

// Scan Result Status
export enum ScanStatus {
  LEGITIMATE = 'LEGITIMATE',
  FRAUDULENT = 'FRAUDULENT',
  UNKNOWN = 'UNKNOWN',
  PENDING = 'PENDING',
}

// NFC Configuration
export const NFC_CONFIG = {
  SUPPORTED: 'NDEFReader' in window,
  TIMEOUT: 10000,
};
