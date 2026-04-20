import { useState } from "react";
import { Smartphone, RefreshCw, Radio, BarChart3, CheckCircle, AlertTriangle, Shield, Clock, TrendingUp, Target, Bell } from "lucide-react";
import { Button } from "@/components/ui/button";

const tabs = ["Scan", "Results", "History", "Analytics"] as const;
type Tab = typeof tabs[number];

const kpis = [
  { label: "Today's Scans", value: "147", icon: BarChart3 },
  { label: "Verified", value: "142", icon: CheckCircle },
  { label: "Suspicious", value: "5", icon: AlertTriangle },
  { label: "Authenticity", value: "96.6%", icon: Shield },
];

const historyData = [
  { product: "Jameson Irish Whiskey", status: "Verified", location: "JHB CBD", time: "14:32" },
  { product: "Chivas Regal 12", status: "Suspicious", location: "Cape Town", time: "13:15" },
  { product: "Absolut Vodka", status: "Verified", location: "Durban", time: "11:45" },
];

const products = [
  { name: "Jameson Irish Whiskey", status: "authentic" as const, statusLabel: "✓ AUTHENTIC", sku: "JAM-001", batch: "2024-09", actions: ["View Details", "Report"] },
  { name: "Unknown Spirit", status: "suspicious" as const, statusLabel: "⚠ SUSPICIOUS", sku: "Unknown", batch: "No Batch Info", actions: ["Investigate", "Block"] },
];

const VerifiAIPage = () => {
  const [activeTab, setActiveTab] = useState<Tab>("Scan");

  // Initially check for NFC support
  useEffect(() => {
    checkNFCSupport();
    // Check if already logged in
    const token = localStorage.getItem('nfcAuthToken');
    if (token) {
      setIsLoggedIn(true);
    }
  }, [checkNFCSupport]);

  const handleLogin = async () => {
    if (!credentials.username || !credentials.password) {
      toast({
        title: "Error",
        description: "Please enter username and password",
        variant: "destructive",
      });
      return;
    }

    setIsLoggingIn(true);
    try {
      const response = await gonxtApi.login(credentials);
      
      if (response.success && response.data.access_token) {
        gonxtApi.setAuthToken(response.data.access_token);
        setIsLoggedIn(true);
        toast({
          title: "Login Successful",
          description: "Welcome to VerifiAI Scanner",
        });
      }
    } catch (error: any) {
      toast({
        title: "Login Failed",
        description: error.message || "Invalid credentials",
        variant: "destructive",
      });
    } finally {
      setIsLoggingIn(false);
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
            <div className="space-y-2">
              <Label htmlFor="username">Username</Label>
              <Input
                id="username"
                type="text"
                value={credentials.username}
                onChange={(e) =>
                  setCredentials({ ...credentials, username: e.target.value })
                }
                placeholder="Enter username"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="password">Password</Label>
              <Input
                id="password"
                type="password"
                value={credentials.password}
                onChange={(e) =>
                  setCredentials({ ...credentials, password: e.target.value })
                }
                placeholder="Enter password"
              />
            </div>
            <Button onClick={handleLogin} className="w-full" disabled={isLoggingIn}>
              {isLoggingIn ? "Logging in..." : "Login"}
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
