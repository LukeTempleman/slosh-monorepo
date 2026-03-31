/**
 * VerifiAI Feature Types
 * Domain-specific types for NFC scanning and product verification
 */

export type ScanResult = "success" | "unmatch" | "unknown" | null;

export interface NDEFRecord {
  recordType: string;
  data: ArrayBuffer;
  encoding?: string;
  lang?: string;
}

export interface NDEFReadingEvent {
  message: {
    records: NDEFRecord[];
  };
}

export interface ScanData {
  nfcId: string;
  productName: string;
  manufacturer: string;
  timestamp: Date;
  verificationStatus: ScanResult;
  confidence: number;
}

export interface ScannerState {
  isSupported: boolean;
  isScanning: boolean;
  scanResult: ScanResult;
  error: string | null;
}

/**
 * Verification response from API (future integration)
 */
export interface VerificationResponse {
  productId: string;
  verified: boolean;
  riskLevel: "low" | "medium" | "high" | "critical";
  lastVerified: Date;
  details?: {
    manufacturer: string;
    batchNumber?: string;
    expiryDate?: Date;
  };
}

/**
 * Browser NFC API Types
 */
export interface NDEFReader {
  scan(): Promise<void>;
  addEventListener(type: string, listener: (event: NDEFReadingEvent) => void): void;
}
