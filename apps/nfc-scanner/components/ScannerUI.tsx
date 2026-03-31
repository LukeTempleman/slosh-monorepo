/**
 * Scanner UI Component (Presentation Layer)
 * Dumb component - receives data & callbacks, renders UI
 * NO business logic here
 */

import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Scan, CheckCircle, AlertTriangle, XCircle } from "lucide-react";
import { getScanResultColor, formatScanResult } from "../services/nfcService";
import type { ScanResult } from "../types";

interface ScannerUIProps {
  isScanning: boolean;
  scanResult: ScanResult;
  error: string | null;
  nfcSupported: boolean;
  onStartScan: () => void;
  onStopScan: () => void;
  onReset: () => void;
}

export const ScannerUI = ({
  isScanning,
  scanResult,
  error,
  nfcSupported,
  onStartScan,
  onStopScan,
  onReset,
}: ScannerUIProps) => {
  const getStatusIcon = () => {
    switch (scanResult) {
      case "success":
        return <CheckCircle className="w-16 h-16 text-green-500" />;
      case "unmatch":
        return <XCircle className="w-16 h-16 text-red-500" />;
      case "unknown":
        return <AlertTriangle className="w-16 h-16 text-yellow-500" />;
      default:
        return <Scan className="w-16 h-16 text-blue-500 animate-pulse" />;
    }
  };

  const showResult = scanResult !== null;
  const colorClasses = getScanResultColor(scanResult);

  return (
    <Card className="w-full">
      <CardHeader>
        <CardTitle>NFC Product Scanner</CardTitle>
      </CardHeader>
      <CardContent className="space-y-6">
        {/* Icons & Status */}
        <div className="flex flex-col items-center gap-4">
          {getStatusIcon()}

          {showResult && (
            <span className={`text-lg font-semibold ${colorClasses}`}>
              {formatScanResult(scanResult)}
            </span>
          )}

          {isScanning && (
            <p className="text-sm text-blue-600 animate-pulse">
              ⏳ Scanning... Hold NFC tag near device
            </p>
          )}
        </div>

        {/* Error Display */}
        {error && (
          <div className="p-3 bg-red-50 border border-red-200 rounded text-sm text-red-700">
            ❌ {error}
          </div>
        )}

        {/* Action Buttons */}
        <div className="flex gap-3 justify-center flex-wrap">
          <Button
            onClick={onStartScan}
            disabled={isScanning || !nfcSupported}
            className="gap-2"
          >
            <Scan className="w-4 h-4" />
            Start Scan
          </Button>

          <Button onClick={onStopScan} disabled={!isScanning} variant="secondary">
            Stop
          </Button>

          {showResult && (
            <Button onClick={onReset} variant="outline">
              New Scan
            </Button>
          )}
        </div>

        {/* Device Status */}
        <div className="p-3 bg-gray-50 rounded text-sm">
          {nfcSupported ? (
            <p className="text-green-700">✓ NFC Available</p>
          ) : (
            <p className="text-red-700">✗ NFC Not Supported</p>
          )}
        </div>

        {/* Scan Result Badge */}
        {showResult && (
          <div className="flex justify-center">
            <Badge className={colorClasses}>
              {formatScanResult(scanResult)}
            </Badge>
          </div>
        )}
      </CardContent>
    </Card>
  );
};
