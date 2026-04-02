/**
 * NFC Scanner API Service
 * Handles NFC scanning and product verification via API
 * Communicates with the GONXT verification backend
 */

import { gonxtApi } from '../../manufacture/services/apiClient';
import type { ScanResult, VerificationResponse } from '../types';

class NFCApiService {
  private baseUrl = '/api/nfc';

  /**
   * Verify a product using its NFC identifier
   * @param nfcId - The NFC identifier from the scanned tag
   * @returns Promise resolving to scan result and product verification details
   */
  async verifyProduct(nfcId: string): Promise<ScanResult> {
    try {
      // In production, this would be the real API call:
      // const response = await gonxtApi.verifyCode(nfcId);
      
      // Mock implementation with timeout for realistic behavior
      await new Promise(resolve => setTimeout(resolve, 500));
      
      // Simulate verification results based on ID format or random chance
      if (nfcId.includes("FAKE") || Math.random() < 0.1) {
        return "unmatch"; // 10% of the time, return unmatch for testing
      } else if (nfcId === "" || nfcId.includes("INVALID")) {
        return "unknown";
      } else {
        return "success";
      }
    } catch (error) {
      console.error('Verification API call failed:', error);
      throw error;
    }
  }

  /**
   * Process raw NFC scan data to extract product identifiers
   * @param rawData - Raw NFC scan data
   * @returns Extracted product identifier
   */
  extractProductId(rawData: string): string {
    // In a real implementation, this would parse NDEF records or other NFC formats
    try {
      // Simple extraction - in reality this could be more complex based on data format
      const cleanData = rawData.trim();
      
      // Check if data is valid UUID-like format or product ID format
      if (cleanData.match(/^[A-Za-z0-9]{8}-[A-Za-z0-9]{4}-[A-Za-z0-9]{4}-[A-Za-z0-9]{4}-[A-Za-z0-9]{12}$/)) {
        return cleanData;
      }
      
      // Check if data contains structured product information
      if (cleanData.startsWith('{') && cleanData.endsWith('}')) {
        try {
          const parsed = JSON.parse(cleanData);
          return parsed.id || parsed.productId || parsed.nfcId || "";
        } catch (e) {
          // Continue with simple processing
        }
      }
      
      // Basic cleaning for standard ID formats
      return cleanData.replace(/[^A-Za-z0-9\-_]/g, '');
    } catch (error) {
      console.error('Failed to extract product ID from raw NFC data:', error);
      return "";
    }
  }

  /**
   * Get detailed verification information for a product
   * @param productId - The product identifier
   * @returns Promise resolving to verification details
   */
  async getProductDetails(productId: string): Promise<VerificationResponse> {
    try {
      // In production, this would fetch from manufacturing API or database
      await new Promise(resolve => setTimeout(resolve, 300));
      
      return {
        productId,
        verified: true,
        riskLevel: "low", // This would come from risk assessment system in real implementation
        lastVerified: new Date(),
        details: {
          manufacturer: "ACME Pharmaceuticals Corp",
          batchNumber: `BATCH-${Math.floor(Math.random() * 10000)}`,
          expiryDate: new Date(Date.now() + 365 * 24 * 60 * 60 * 1000) // 1 year from now
        }
      };
    } catch (error) {
      console.error(`Failed to fetch product details for ${productId}:`, error);
      throw error;
    }
  }
}

export const nfcApi = new NFCApiService();