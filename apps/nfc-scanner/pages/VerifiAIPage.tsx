/**
 * VerifiAI Feature Page (Entry Point)
 * Orchestrates the feature - connects hooks, services, and components
 */

import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { ArrowLeft } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { useToast } from "@/hooks/use-toast";
import { ScannerUI } from "../components/ScannerUI";
import { useNFCScanner } from "../hooks/useNFCScanner";

const VerifiAIPage = () => {
  const navigate = useNavigate();
  const { toast } = useToast();
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [credentials, setCredentials] = useState({ username: "", password: "" });

  // Use the NFC scanner hook
  const {
    isSupported,
    isScanning,
    scanResult,
    error,
    checkNFCSupport,
    startScan,
    stopScan,
    reset,
  } = useNFCScanner({
    onScanComplete: (result) => {
      if (result === "success") {
        toast({
          title: "✓ Product Verified",
          description: "Authentic product confirmed",
        });
      } else if (result === "unmatch") {
        toast({
          title: "⚠️ Counterfeit Detected",
          description: "This product may be counterfeit",
          variant: "destructive",
        });
      }
    },
  });

  // Initially check for NFC support
  useEffect(() => {
    checkNFCSupport();
  }, [checkNFCSupport]);

  const handleLogin = () => {
    if (credentials.username && credentials.password) {
      setIsLoggedIn(true);
      toast({
        title: "Login Successful",
        description: "Welcome to VerifiAI Scanner",
      });
    } else {
      toast({
        title: "Error",
        description: "Please enter credentials",
        variant: "destructive",
      });
    }
  };

  // Render login screen
  if (!isLoggedIn) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-900 to-indigo-900 flex items-center justify-center p-4">
        <Card className="w-full max-w-sm">
          <CardHeader>
            <CardTitle>VerifiAI Scanner</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div>
              <label className="block text-sm font-medium mb-2">Username</label>
              <input
                type="text"
                value={credentials.username}
                onChange={(e) =>
                  setCredentials({ ...credentials, username: e.target.value })
                }
                className="w-full px-3 py-2 border rounded-lg"
                placeholder="Enter username"
              />
            </div>
            <div>
              <label className="block text-sm font-medium mb-2">Password</label>
              <input
                type="password"
                value={credentials.password}
                onChange={(e) =>
                  setCredentials({ ...credentials, password: e.target.value })
                }
                className="w-full px-3 py-2 border rounded-lg"
                placeholder="Enter password"
              />
            </div>
            <Button onClick={handleLogin} className="w-full">
              Login
            </Button>
          </CardContent>
        </Card>
      </div>
    );
  }

  // Render scanner
  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 to-slate-800 p-6">
      <div className="max-w-2xl mx-auto space-y-6">
        {/* Header */}
        <div className="flex items-center gap-3">
          <Button
            variant="outline"
            size="icon"
            onClick={() => navigate("/")}
          >
            <ArrowLeft className="w-4 h-4" />
          </Button>
          <h1 className="text-3xl font-bold text-white">VerifiAI Scanner</h1>
        </div>

        {/* Scanner Component */}
        <ScannerUI
          isScanning={isScanning}
          scanResult={scanResult}
          error={error}
          nfcSupported={isSupported}
          onStartScan={startScan}
          onStopScan={stopScan}
          onReset={reset}
        />

        {/* Info Card */}
        <Card>
          <CardHeader>
            <CardTitle className="text-lg">How It Works</CardTitle>
          </CardHeader>
          <CardContent className="space-y-2 text-sm text-gray-600">
            <p>1. Click "Start Scan" to begin scanning</p>
            <p>2. Hold an NFC-enabled product near your device</p>
            <p>3. Wait for the verification result</p>
            <p>4. See if the product is authentic or counterfeit</p>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default VerifiAIPage;
