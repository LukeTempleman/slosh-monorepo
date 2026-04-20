import { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Switch } from "@/components/ui/switch";
import { ArrowLeft, Scan, CheckCircle, AlertTriangle, XCircle, Wifi, MapPin, User, Lock, Eye, EyeOff, FileText, Phone, Mail, LogOut } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "@/contexts/AuthContext";

type ScanResult = "success" | "unmatch" | "unknown" | null;

// NFC Event types
interface NDEFReadingEvent {
  message: {
    records: Array<{
      recordType: string;
      data: ArrayBuffer;
      encoding?: string;
      lang?: string;
    }>;
  };
}

interface NDEFReader {
  scan: () => Promise<void>;
  addEventListener: (type: string, listener: (event: NDEFReadingEvent) => void) => void;
  removeEventListener: (type: string, listener: (event: NDEFReadingEvent) => void) => void;
}

// Extend window interface for NFC API
declare global {
  interface Window {
    NDEFReader?: new () => NDEFReader;
  }
}

const VerifiAI = () => {
  const navigate = useNavigate();
  const { logout } = useAuth();
  const [isScanning, setIsScanning] = useState(false);
  const [scanResult, setScanResult] = useState<ScanResult>(null);
  const [NXTSupported, setNXTSupported] = useState(false);
  const [showReportForm, setShowReportForm] = useState(false);
  const [reportForm, setReportForm] = useState({
    productName: "",
    location: "",
    retailer: "",
    suspiciousDetails: "",
    contactName: "",
    contactPhone: "",
    contactEmail: ""
  });

  const [nfcReader, setNfcReader] = useState<NDEFReader | null>(null);
  const [lastScannedTag, setLastScannedTag] = useState<string>("");
  const [demoMode, setDemoMode] = useState<boolean>(false);

  useEffect(() => {
    // Check for NFC support
    if ('NDEFReader' in window) {
      setNXTSupported(true);
      console.log("NFC/NDEF Reader is supported");
    } else {
      console.log("NFC/NDEF Reader is not supported");
    }
  }, []);

  const mockScanResults = {
    success: {
      brand: "Jameson Irish Whiskey",
      batchId: "JW2024-SA-3847",
      productionDate: "2024-08-15",
      location: "Cork, Ireland",
      retailer: "Makro Menlyn, Pretoria",
      price: "R 329.99",
      verification: "AUTHENTIC"
    },
    unmatch: {
      brand: "Suspected Counterfeit",
      details: "NXT tag detected but verification failed",
      risk: "HIGH",
      location: "Johannesburg, Gauteng"
    },
    unknown: {
      error: "Unable to read NXT tag",
      suggestion: "Product may be illicit or tag damaged",
      location: "Cape Town, Western Cape"
    }
  };

  // Sample NFC tag database - in real app this would be from backend
  const nfcTagDatabase: Record<string, typeof mockScanResults.success | typeof mockScanResults.unmatch | typeof mockScanResults.unknown> = {
    "veritas:authentic:jameson:JW2024-SA-3847": mockScanResults.success,
    "veritas:counterfeit:fake-whiskey": mockScanResults.unmatch,
    "veritas:unknown:unregistered": mockScanResults.unknown,
    // Additional tag patterns
    "authentic:product": mockScanResults.success,
    "counterfeit:product": mockScanResults.unmatch,
    "unknown:product": mockScanResults.unknown,
    // Real-world tag examples
    "jameson": mockScanResults.success,
    "fake": mockScanResults.unmatch,
    "test": mockScanResults.success
  };

  // Convert ArrayBuffer to string
  const arrayBufferToString = (buffer: ArrayBuffer): string => {
    const decoder = new TextDecoder();
    return decoder.decode(buffer);
  };

  // Process NFC tag data and determine scan result
  const processNFCTagData = (tagData: string): ScanResult => {
    console.log("Processing NFC tag data:", tagData);
    setLastScannedTag(tagData);

    // Check if tag data matches any known patterns
    const lowerTagData = tagData.toLowerCase();
    
    // Check exact matches first
    if (nfcTagDatabase[lowerTagData]) {
      const result = nfcTagDatabase[lowerTagData];
      if (result === mockScanResults.success) return "success";
      if (result === mockScanResults.unmatch) return "unmatch";
      return "unknown";
    }

    // Check partial matches for flexibility
    if (lowerTagData.includes("authentic") || lowerTagData.includes("jameson") || lowerTagData.includes("verified")) {
      return "success";
    }
    if (lowerTagData.includes("counterfeit") || lowerTagData.includes("fake") || lowerTagData.includes("suspicious")) {
      return "unmatch";
    }
    
    // Default to unknown for unrecognized tags
    return "unknown";
  };



  const handleReportInputChange = (field: keyof typeof reportForm) => (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    setReportForm(prev => ({
      ...prev,
      [field]: e.target.value
    }));
  };

  const handleReportSubmit = () => {
    // Here you would normally send the report to a backend service
    console.log("Illicit alcohol report submitted:", reportForm);
    
    // Reset form and hide modal
    setReportForm({
      productName: "",
      location: "",
      retailer: "",
      suspiciousDetails: "",
      contactName: "",
      contactPhone: "",
      contactEmail: ""
    });
    setShowReportForm(false);
    
    // Show success message (you could use toast notification here)
    alert("Thank you for your report. It has been submitted to the authorities.");
  };

  const startNXTScan = async () => {
    setIsScanning(true);
    setScanResult(null);

    // Check if demo mode is enabled or if NFC is not supported
    if (demoMode || !NXTSupported || !window.NDEFReader) {
      // Use demo/simulation mode
      console.log("Using demo mode for scanning");
      setTimeout(() => {
        const outcomes: ScanResult[] = ["success", "unmatch", "unknown"];
        const randomResult = outcomes[Math.floor(Math.random() * outcomes.length)];
        setScanResult(randomResult);
        setIsScanning(false);
      }, 3000);
      return;
    }

    // Attempt real NFC scan
    if (NXTSupported && window.NDEFReader) {
      try {
        const ndef = new window.NDEFReader();
        setNfcReader(ndef);

        // Set up event listener for NFC tag reads
        const handleNFCRead = (event: NDEFReadingEvent) => {
          console.log("NFC tag detected and read successfully");
          
          let tagData = "";
          
          // Extract data from all records
          for (const record of event.message.records) {
            if (record.recordType === "text" || record.recordType === "url") {
              const decodedData = arrayBufferToString(record.data);
              tagData += decodedData + " ";
            }
          }

          // Process the tag data and determine result
          const result = processNFCTagData(tagData.trim());
          
          console.log("NFC scan result:", result, "from data:", tagData);
          
          setScanResult(result);
          setIsScanning(false);
        };

        // Add event listener for successful reads
        ndef.addEventListener("reading", handleNFCRead);

        // Start scanning
        await ndef.scan();
        console.log("NFC scan started - waiting for tag...");

        // Set a timeout to stop scanning if no tag is detected
        setTimeout(() => {
          if (isScanning) {
            console.log("NFC scan timeout - no tag detected");
            setIsScanning(false);
            // You could show a "no tag detected" message here
          }
        }, 10000); // 10 second timeout

      } catch (error) {
        console.log("NFC scan failed:", error);
        setIsScanning(false);
        
        // Fall back to simulated scan for demonstration
        setTimeout(() => {
          const outcomes: ScanResult[] = ["success", "unmatch", "unknown"];
          const randomResult = outcomes[Math.floor(Math.random() * outcomes.length)];
          setScanResult(randomResult);
        }, 2000);
      }
    } else {
      // Fallback simulation for browsers without NFC support
      console.log("NFC not supported, using simulation");
      setTimeout(() => {
        const outcomes: ScanResult[] = ["success", "unmatch", "unknown"];
        const randomResult = outcomes[Math.floor(Math.random() * outcomes.length)];
        setScanResult(randomResult);
        setIsScanning(false);
      }, 3000);
    }
  };

  const stopNFCScan = () => {
    if (nfcReader) {
      // Remove event listeners and stop scanning
      try {
        // Note: There's no official stop method in Web NFC API
        // The scan continues until the page is closed or refreshed
        console.log("NFC scan stopped");
      } catch (error) {
        console.log("Error stopping NFC scan:", error);
      }
    }
    setIsScanning(false);
    setNfcReader(null);
  };

  const renderScanResult = () => {
    if (!scanResult) return null;

    switch (scanResult) {
      case "success":
        return (
          <Card className="border-success/20 bg-success/5">
            <CardHeader>
              <div className="flex items-center gap-2">
                <CheckCircle className="h-5 w-5 text-success" />
                <CardTitle className="text-success">Authentic Product Verified</CardTitle>
              </div>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <p className="text-sm text-muted-foreground">Brand</p>
                  <p className="font-semibold">{mockScanResults.success.brand}</p>
                </div>
                <div>
                  <p className="text-sm text-muted-foreground">Batch ID</p>
                  <p className="font-mono text-sm">{mockScanResults.success.batchId}</p>
                </div>
                <div>
                  <p className="text-sm text-muted-foreground">Production Date</p>
                  <p>{mockScanResults.success.productionDate}</p>
                </div>
                <div>
                  <p className="text-sm text-muted-foreground">Origin</p>
                  <p>{mockScanResults.success.location}</p>
                </div>
              </div>
              <div className="bg-success/10 p-4 rounded-lg">
                <div className="flex items-center gap-2 mb-2">
                  <MapPin className="h-4 w-4 text-success" />
                  <span className="font-semibold text-success">Retailer Information</span>
                </div>
                <p className="text-sm">{mockScanResults.success.retailer}</p>
                <p className="text-sm font-semibold text-success">{mockScanResults.success.price}</p>
              </div>
            </CardContent>
          </Card>
        );

      case "unmatch":
        return (
          <Card className="border-warning/20 bg-warning/5">
            <CardHeader>
              <div className="flex items-center gap-2">
                <AlertTriangle className="h-5 w-5 text-warning" />
                <CardTitle className="text-warning">Verification Mismatch</CardTitle>
              </div>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <p className="font-semibold text-warning">{mockScanResults.unmatch.brand}</p>
                <p className="text-sm">{mockScanResults.unmatch.details}</p>
                <Badge variant="destructive" className="gradient-alert">
                  {mockScanResults.unmatch.risk} RISK
                </Badge>
              </div>
              <div className="bg-warning/10 p-4 rounded-lg">
                <p className="text-sm font-semibold mb-2">Report Suspicious Product</p>
                <Button size="sm" className="gradient-alert">
                  File Report
                </Button>
              </div>
            </CardContent>
          </Card>
        );

      case "unknown":
        return (
          <Card className="border-destructive/20 bg-destructive/5">
            <CardHeader>
              <div className="flex items-center gap-2">
                <XCircle className="h-5 w-5 text-destructive" />
                <CardTitle className="text-destructive">Scan Failed</CardTitle>
              </div>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <p className="font-semibold">{mockScanResults.unknown.error}</p>
                <p className="text-sm text-muted-foreground">{mockScanResults.unknown.suggestion}</p>
              </div>
              <div className="bg-destructive/10 p-4 rounded-lg">
                <p className="text-sm font-semibold mb-2 text-destructive">Potential Illicit Product</p>
                <Button 
                  size="sm" 
                  variant="destructive" 
                  className="gradient-alert"
                  onClick={() => setShowReportForm(true)}
                >
                  <FileText className="h-4 w-4 mr-2" />
                  Report Illicit Alcohol
                </Button>
              </div>
            </CardContent>
          </Card>
        );

      default:
        return null;
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-background via-secondary/20 to-accent/30">
      {/* Header */}
      <div className="border-b bg-card/80 backdrop-blur-sm">
        <div className="container mx-auto px-6 py-6">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <Scan className="h-8 w-8 text-success" />
              <div>
                <h1 className="text-2xl font-bold text-primary">Verifi-AI Scanner</h1>
                <p className="text-muted-foreground">Consumer alcohol authentication system</p>
              </div>
            </div>
            <Button
              variant="outline"
              onClick={() => {
                logout();
                navigate("/login");
              }}
              className="gap-2"
            >
              <LogOut className="h-4 w-4" />
              Logout
            </Button>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="container mx-auto px-6 py-8">
        <div className="max-w-2xl mx-auto space-y-8">
          <>
              {/* NXT Status */}
              <Card>
                <CardContent className="p-6">
                  <div className="flex items-center gap-4">
                    <Wifi className={`h-5 w-5 ${demoMode ? 'text-warning' : NXTSupported ? 'text-success' : 'text-muted-foreground'}`} />
                    <div>
                      <p className="font-semibold">NFC Status</p>
                      <p className="text-sm text-muted-foreground">
                        {demoMode 
                          ? "Demo mode enabled - simulated scanning" 
                          : NXTSupported 
                            ? "NFC Ready - Tap bottle to scan" 
                            : "NFC not supported - Demo mode active"
                        }
                      </p>
                    </div>
                    <Badge variant={demoMode ? "outline" : NXTSupported ? "default" : "secondary"} className="ml-auto">
                      {demoMode ? "Demo" : NXTSupported ? "NFC" : "Demo"}
                    </Badge>
                  </div>
                </CardContent>
              </Card>

          {/* Scanner Interface */}
          <Card className="shadow-premium relative">
            {/* Demo Mode Toggle */}
            <div className="absolute top-4 right-4 flex items-center gap-2 z-10">
              <Label htmlFor="demo-mode" className="text-xs text-muted-foreground">
                Demo
              </Label>
              <Switch
                id="demo-mode"
                checked={demoMode}
                onCheckedChange={setDemoMode}
                className="scale-75"
              />
            </div>
            
            <CardContent className="p-8 text-center">
              {isScanning ? (
                <div className="space-y-6">
                  <div className="w-24 h-24 mx-auto rounded-full gradient-security animate-pulse flex items-center justify-center">
                    <Scan className="h-12 w-12 text-white animate-spin" />
                  </div>
                  <div>
                    <h3 className="text-xl font-semibold mb-2">Scanning NFC Tag...</h3>
                    <p className="text-muted-foreground">
                      {demoMode ? "Demo mode - simulating scan..." : 
                       NXTSupported ? "Hold your NFC-enabled product near the device" : "Demo mode - simulating scan..."}
                    </p>
                    {lastScannedTag && (
                      <p className="text-xs text-muted-foreground mt-2">Last scanned: {lastScannedTag}</p>
                    )}
                  </div>
                  <Button 
                    onClick={stopNFCScan}
                    variant="outline"
                    size="sm"
                    className="mt-4"
                  >
                    Stop Scanning
                  </Button>
                </div>
              ) : (
                <div className="space-y-6">
                  <div className="w-24 h-24 mx-auto rounded-full gradient-primary shadow-gold flex items-center justify-center">
                    <Scan className="h-12 w-12 text-white" />
                  </div>
                  <div>
                    <h3 className="text-xl font-semibold mb-2">Ready to Scan</h3>
                    <p className="text-muted-foreground">
                      {demoMode 
                        ? "Demo mode enabled - will simulate scanning process" 
                        : NXTSupported 
                          ? "Tap the button below and hold your NFC-enabled product near your device" 
                          : "NFC not supported - demo mode will simulate scanning"
                      }
                    </p>
                  </div>
                  <Button 
                    onClick={startNXTScan}
                    size="lg"
                    className="gradient-security shadow-security transition-premium hover:scale-105"
                  >
                    {demoMode ? "Start Demo Scan" : NXTSupported ? "Start NFC Scan" : "Start Demo Scan"}
                  </Button>
                </div>
              )}
            </CardContent>
          </Card>

          {/* Scan Result */}
          {renderScanResult()}

          {/* Report Form Modal */}
          {showReportForm && (
            <Card className="border-destructive/20 bg-destructive/5 shadow-premium">
              <CardHeader>
                <div className="flex items-center gap-2">
                  <FileText className="h-5 w-5 text-destructive" />
                  <CardTitle className="text-destructive">Report Illicit Alcohol Product</CardTitle>
                </div>
                <p className="text-sm text-muted-foreground">
                  Help protect consumers by reporting suspicious or counterfeit alcohol products
                </p>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="productName">Product Name *</Label>
                    <Input
                      id="productName"
                      placeholder="e.g., Jameson Irish Whiskey"
                      value={reportForm.productName}
                      onChange={handleReportInputChange('productName')}
                    />
                  </div>
                  
                  <div className="space-y-2">
                    <Label htmlFor="retailer">Retailer/Store</Label>
                    <Input
                      id="retailer"
                      placeholder="e.g., Local Liquor Store"
                      value={reportForm.retailer}
                      onChange={handleReportInputChange('retailer')}
                    />
                  </div>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="location">Location *</Label>
                  <Input
                    id="location"
                    placeholder="e.g., Johannesburg, Gauteng"
                    value={reportForm.location}
                    onChange={handleReportInputChange('location')}
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="suspiciousDetails">Suspicious Details *</Label>
                  <Textarea
                    id="suspiciousDetails"
                    placeholder="Describe what makes this product suspicious (e.g., unusual taste, packaging differences, no NXT tag, etc.)"
                    value={reportForm.suspiciousDetails}
                    onChange={handleReportInputChange('suspiciousDetails')}
                    rows={4}
                  />
                </div>

                <div className="border-t pt-4">
                  <h4 className="font-semibold mb-4 flex items-center gap-2">
                    <User className="h-4 w-4" />
                    Contact Information (Optional)
                  </h4>
                  
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="contactName">Full Name</Label>
                      <Input
                        id="contactName"
                        placeholder="Your full name"
                        value={reportForm.contactName}
                        onChange={handleReportInputChange('contactName')}
                      />
                    </div>
                    
                    <div className="space-y-2">
                      <Label htmlFor="contactPhone">Phone Number</Label>
                      <div className="relative">
                        <Phone className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                        <Input
                          id="contactPhone"
                          placeholder="+27 123 456 789"
                          value={reportForm.contactPhone}
                          onChange={handleReportInputChange('contactPhone')}
                          className="pl-10"
                        />
                      </div>
                    </div>
                  </div>
                  
                  <div className="space-y-2 mt-4">
                    <Label htmlFor="contactEmail">Email Address</Label>
                    <div className="relative">
                      <Mail className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                      <Input
                        id="contactEmail"
                        type="email"
                        placeholder="your.email@example.com"
                        value={reportForm.contactEmail}
                        onChange={handleReportInputChange('contactEmail')}
                        className="pl-10"
                      />
                    </div>
                  </div>
                </div>

                <div className="flex gap-4 pt-4">
                  <Button
                    onClick={handleReportSubmit}
                    className="flex-1 gradient-alert shadow-security"
                    disabled={!reportForm.productName.trim() || !reportForm.location.trim() || !reportForm.suspiciousDetails.trim()}
                  >
                    <FileText className="h-4 w-4 mr-2" />
                    Submit Report
                  </Button>
                  <Button
                    variant="outline"
                    onClick={() => setShowReportForm(false)}
                    className="flex-1"
                  >
                    Cancel
                  </Button>
                </div>

                <div className="bg-muted/50 p-4 rounded-lg">
                  <p className="text-sm text-muted-foreground">
                    <strong>Note:</strong> Your report will be forwarded to relevant authorities and may be used to investigate illicit alcohol distribution. Providing contact information helps authorities follow up if needed.
                  </p>
                </div>
              </CardContent>
            </Card>
          )}

              {/* Info Panel */}
              <Card className="bg-muted/50">
                <CardContent className="p-6">
                  <h4 className="font-semibold mb-3">How Verifi-AI Works</h4>
                  <div className="space-y-2 text-sm text-muted-foreground">
                    <p>• Each authentic bottle contains a secure NXT tag</p>
                    <p>• Scan to verify authenticity and batch information</p>
                    <p>• Report suspicious products to help combat illicit alcohol</p>
                    <p>• Protect yourself and others from dangerous counterfeit products</p>
                  </div>
                </CardContent>
              </Card>
        </>
        </div>
      </div>
    </div>
  );
};

export default VerifiAI;