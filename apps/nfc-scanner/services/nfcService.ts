/**
 * NFC Service Layer
 * Handles all NFC reading operations and data parsing
 * NO direct component coupling - pure business logic
 */

import type { NDEFRecord, ScanData, ScanResult } from "../types";

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
 * Verify product with verification API
 * Future: Replace with actual backend call
 */
export const verifyProduct = async (
  _productId: string
  // Future: Add API client parameter
): Promise<ScanResult> => {
  try {
    // Mock verification
    // In production:
    // const response = await apiClient.post(`/verify/${_productId}`);
    // return response.verified ? "success" : "unmatch";

    // Simulate async operation
    await new Promise((resolve) => setTimeout(resolve, 500));

    // 90% success rate for demo
    return Math.random() > 0.1 ? "success" : "unmatch";
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
