/**
 * useNFCScanner Hook
 * Manages NFC scanning state and lifecycle
 * Isolated from UI - can be tested independently
 */

import { useState, useCallback } from "react";
import { parseNDEFRecords, verifyProduct } from "../services/nfcService";
import type { NDEFReader, NDEFReadingEvent, ScanResult } from "../types";

interface UseNFCScannerOptions {
  onScanComplete?: (result: ScanResult) => void;
}

export const useNFCScanner = (options: UseNFCScannerOptions = {}) => {
  const [isSupported, setIsSupported] = useState(false);
  const [isScanning, setIsScanning] = useState(false);
  const [scanResult, setScanResult] = useState<ScanResult>(null);
  const [error, setError] = useState<string | null>(null);
  const [scannedData, setScannedData] = useState<string | null>(null);

  /**
   * Check if device supports NFC API
   */
  const checkNFCSupport = useCallback(() => {
    const supported = "NDEFReader" in window;
    setIsSupported(supported);
    return supported;
  }, []);

  /**
   * Start NFC scan with real API integration
   * Flow: Prompt → Read → Parse → Verify → Result
   */
  const startScan = useCallback(async () => {
    if (!checkNFCSupport()) {
      setError("NFC not supported on this device");
      return;
    }

    try {
      setIsScanning(true);
      setError(null);
      setScanResult(null);

      const reader = new (window.NDEFReader as new () => NDEFReader)();

      // Success listener
      reader.addEventListener("reading", async (event: NDEFReadingEvent) => {
        try {
          // Parse NFC data
          const scanData = parseNDEFRecords(event.message.records);

          if (!scanData) {
            setScanResult("unknown");
            setError("Could not parse product data");
            setIsScanning(false);
            return;
          }

          setScannedData(JSON.stringify(scanData));

          // Verify product with backend with timeout management
          const verifyPromise = verifyProduct(scanData.nfcId);
          const timeoutPromise = new Promise<ScanResult>((_, reject) => 
            setTimeout(() => reject(new Error('Verification timed out')), 10000)
          );
          
          const verificationResult = await Promise.race([verifyPromise, timeoutPromise]);
          setScanResult(verificationResult);

          setIsScanning(false);
          options.onScanComplete?.(verificationResult);
        } catch (err) {
          setError(err instanceof Error ? err.message : "Product verification failed");
          setIsScanning(false);
        }
      });

      // Error listener
      reader.addEventListener("error", (event: ErrorEvent) => {
        setError(`NFC read error: ${event.message || 'Failed to read NFC tag'}`);
        setIsScanning(false);
      });

      // Initiate scan
      await reader.scan();
    } catch (err) {
      const message = err instanceof Error ? err.message : "Scan initiation failed";
      setError(message);
      setIsScanning(false);
    }
  }, [checkNFCSupport, options]);

  /**
   * Stop ongoing scan
   */
  const stopScan = useCallback(() => {
    setIsScanning(false);
  }, []);

  /**
   * Reset scanner state
   */
  const reset = useCallback(() => {
    setIsScanning(false);
    setScanResult(null);
    setError(null);
    setScannedData(null);
  }, []);

  return {
    // State
    isSupported,
    isScanning,
    scanResult,
    error,
    scannedData,

    // Actions
    checkNFCSupport,
    startScan,
    stopScan,
    reset,
  };
};
