/**
 * NFC Service Layer
 * Handles all NFC reading operations and data parsing with real API integration
 * NO direct component coupling - pure business logic
 */

import type { NDEFRecord, ScanData, ScanResult } from "../types";
import { nfcApi } from "./nfcApi";

/**
 * Parse NDEF records into structured scan data
 */
export const parseNDEFRecords = (records: NDEFRecord[]): ScanData | null => {
  if (records.length === 0) return null;

  try {
    const decoder = new TextDecoder();
    const recordData = records[0].data;
    const text = decoder.decode(recordData);
    const data = JSON.parse(text);

    return {
      nfcId: data.id || data.productId || "",
      productName: data.product || data.productName || "",
      manufacturer: data.manufacturer || "",
      timestamp: new Date(),
      verificationStatus: data.verified ? "success" : "unmatch",
      confidence: data.confidence || 0.95,
    };
  } catch (error) {
    console.error("Failed to parse NDEF records:", error);
    return null;
  }
};

/**
 * Verify product with backend verification API
 */
export const verifyProduct = async (
  productId: string
): Promise<ScanResult> => {
  try {
    const result = await nfcApi.verifyProduct(productId);
    return result;
  } catch (error) {
    console.error("Verification failed:", error);
    return "unknown";
  }
};

/**
 * Format scan result for display
 */
export const formatScanResult = (result: ScanResult): string => {
  const formatMap: Record<string, string> = {
    success: "✓ Product Verified",
    unmatch: "✗ Counterfeit Detected",
    unknown: "? Unknown",
  };
  return result ? formatMap[result] || "No Result" : "No Result";
};

/**
 * Get status color for UI
 */
export const getScanResultColor = (result: ScanResult): string => {
  const colorMap: Record<string, string> = {
    success: "text-green-600 bg-green-50",
    unmatch: "text-red-600 bg-red-50",
    unknown: "text-yellow-600 bg-yellow-50",
  };
  return result ? colorMap[result] || "text-gray-600 bg-gray-50" : "text-gray-600 bg-gray-50";
};
