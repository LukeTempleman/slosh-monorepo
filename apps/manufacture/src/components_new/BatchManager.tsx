import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter, DialogTrigger } from "@/components/ui/dialog";
import { Progress } from "@/components/ui/progress";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Upload, Download, Eye, Key, CheckCircle, Clock, AlertCircle, Shield, Lock, Copy, Save } from "lucide-react";
import { useToast } from "@/hooks/use-toast";

const BatchManager = () => {
  const { toast } = useToast();
  const [isUploading, setIsUploading] = useState(false);
  const [uploadProgress, setUploadProgress] = useState(0);
  const [uploadStage, setUploadStage] = useState("");
  const [encryptionDialogOpen, setEncryptionDialogOpen] = useState(false);
  const [encryptionKey, setEncryptionKey] = useState("");
  const [encryptionAlgorithm, setEncryptionAlgorithm] = useState("AES-256");
  const [keyStrength, setKeyStrength] = useState("strong");

  const batches = [
    {
      id: "JW-2024-001",
      product: "Jameson Irish Whiskey 750ml",
      quantity: 5000,
      status: "completed",
      date: "2024-01-15",
      location: "Cork Distillery, Ireland",
      encrypted: true
    },
    {
      id: "CR-2024-002", 
      product: "Chivas Regal 12 Year 750ml",
      quantity: 3200,
      status: "processing",
      date: "2024-01-14",
      location: "Speyside, Scotland",
      encrypted: true
    },
    {
      id: "AB-2024-003",
      product: "Absolut Vodka 750ml",
      quantity: 8000,
      status: "pending",
      date: "2024-01-13", 
      location: "Åhus, Sweden",
      encrypted: false
    },
    {
      id: "MT-2024-004",
      product: "Martell Cordon Bleu 750ml",
      quantity: 1500,
      status: "failed",
      date: "2024-01-12",
      location: "Cognac, France", 
      encrypted: false
    }
  ];

  const getStatusIcon = (status: string) => {
    switch (status) {
      case "completed": return <CheckCircle className="h-4 w-4 text-emerald-600 dark:text-emerald-400" />;
      case "processing": return <Clock className="h-4 w-4 text-blue-600 dark:text-blue-400" />;
      case "pending": return <Clock className="h-4 w-4 text-slate-500 dark:text-slate-400" />;
      case "failed": return <AlertCircle className="h-4 w-4 text-red-600 dark:text-red-400" />;
      default: return null;
    }
  };

  const getStatusBadge = (status: string) => {
    switch (status) {
      case "completed": 
        return (
          <Badge className="bg-gradient-to-r from-emerald-500 to-emerald-600 text-white border-0 shadow-sm hover:shadow-md transition-all duration-200">
            <CheckCircle className="h-3 w-3 mr-1" />
            Completed
          </Badge>
        );
      case "processing": 
        return (
          <Badge className="bg-gradient-to-r from-blue-500 to-blue-600 text-white border-0 shadow-sm hover:shadow-md transition-all duration-200">
            <Clock className="h-3 w-3 mr-1 animate-spin" />
            Processing
          </Badge>
        );
      case "pending": 
        return (
          <Badge className="bg-gradient-to-r from-slate-500 to-slate-600 text-white border-0 shadow-sm hover:shadow-md transition-all duration-200">
            <Clock className="h-3 w-3 mr-1" />
            Pending
          </Badge>
        );
      case "failed": 
        return (
          <Badge className="bg-gradient-to-r from-red-500 to-red-600 text-white border-0 shadow-sm hover:shadow-md transition-all duration-200">
            <AlertCircle className="h-3 w-3 mr-1" />
            Failed
          </Badge>
        );
      default: return null;
    }
  };

  const generateRandomKey = () => {
    const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789!@#$%^&*';
    let result = '';
    for (let i = 0; i < 32; i++) {
      result += chars.charAt(Math.floor(Math.random() * chars.length));
    }
    setEncryptionKey(result);
  };

  const copyKeyToClipboard = () => {
    navigator.clipboard.writeText(encryptionKey);
    toast({
      title: "Key Copied",
      description: "Encryption key has been copied to clipboard",
    });
  };

  const saveEncryptionSettings = () => {
    if (!encryptionKey) {
      toast({
        title: "Error",
        description: "Please enter an encryption key",
        variant: "destructive",
      });
      return;
    }
    
    setEncryptionDialogOpen(false);
    toast({
      title: "Encryption Settings Saved",
      description: `${encryptionAlgorithm} encryption configured successfully`,
    });
  };

  const handleUpload = () => {
    setIsUploading(true);
    setUploadProgress(0);
    
    const stages = [
      { stage: "Validating batch data...", duration: 800 },
      { stage: "Generating NXT tags...", duration: 1200 },
      { stage: "Applying encryption...", duration: 1000 },
      { stage: "Uploading to blockchain...", duration: 1500 },
      { stage: "Finalizing batch...", duration: 500 }
    ];

    let currentStage = 0;
    let currentProgress = 0;

    const updateProgress = () => {
      if (currentStage < stages.length) {
        setUploadStage(stages[currentStage].stage);
        
        const stageProgress = 100 / stages.length;
        const targetProgress = (currentStage + 1) * stageProgress;
        
        const progressInterval = setInterval(() => {
          currentProgress += 2;
          setUploadProgress(Math.min(currentProgress, targetProgress));
          
          if (currentProgress >= targetProgress) {
            clearInterval(progressInterval);
            currentStage++;
            
            if (currentStage < stages.length) {
              setTimeout(updateProgress, 200);
            } else {
              setIsUploading(false);
              setUploadProgress(100);
              setUploadStage("Upload Complete!");
              toast({
                title: "Batch Upload Successful",
                description: "NXT tags have been encrypted and uploaded to the system",
              });
              
              // Reset after a delay
              setTimeout(() => {
                setUploadProgress(0);
                setUploadStage("");
              }, 2000);
            }
          }
        }, stages[currentStage].duration / (stageProgress / 2));
      }
    };

    updateProgress();
  };

  return (
    <div className="space-y-6">
      {/* Upload Section */}
      <Card className="card-professional">
        <CardHeader>
          <CardTitle className="text-heading flex items-center gap-2">
            <Upload className="h-5 w-5" />
            New Batch Upload
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid md:grid-cols-2 gap-4">
            <div>
              <Label htmlFor="product-name" className="text-data-label">Product Line</Label>
              <Input 
                id="product-name" 
                placeholder="e.g., Jameson Irish Whiskey 750ml"
                className="mt-1"
              />
            </div>
            <div>
              <Label htmlFor="batch-quantity" className="text-data-label">Batch Quantity</Label>
              <Input 
                id="batch-quantity" 
                type="number" 
                placeholder="e.g., 5000"
                className="mt-1"
              />
            </div>
            <div>
              <Label htmlFor="production-location" className="text-data-label">Production Location</Label>
              <Input 
                id="production-location" 
                placeholder="e.g., Cork Distillery, Ireland"
                className="mt-1"
              />
            </div>
            <div>
              <Label htmlFor="batch-id" className="text-data-label">Batch ID</Label>
              <Input 
                id="batch-id" 
                placeholder="Auto-generated"
                disabled
                className="mt-1"
              />
            </div>
          </div>
          
          {/* Upload Progress */}
          {isUploading && (
            <div className="space-y-3 p-4 bg-gradient-to-r from-blue-50 to-indigo-50 dark:from-blue-950/30 dark:to-indigo-950/30 rounded-lg border border-blue-200/50 dark:border-blue-800/50">
              <div className="flex items-center justify-between">
                <span className="text-sm font-medium text-blue-700 dark:text-blue-300">{uploadStage}</span>
                <div className="flex items-center gap-2">
                  <div className="w-2 h-2 bg-blue-500 rounded-full animate-pulse"></div>
                  <span className="text-sm font-semibold text-blue-600 dark:text-blue-400">{Math.round(uploadProgress)}%</span>
                </div>
              </div>
              <Progress 
                value={uploadProgress} 
                className="h-3 bg-blue-100 dark:bg-blue-900/50 border border-blue-200/50 dark:border-blue-800/50 rounded-full overflow-hidden"
              />
              <div className="flex items-center gap-2 text-sm text-blue-600 dark:text-blue-400">
                <Clock className="h-4 w-4 animate-spin" />
                <span className="font-medium">Processing batch upload...</span>
              </div>
            </div>
          )}
          
          <div className="flex items-center gap-4">
            <Button 
              onClick={handleUpload} 
              disabled={isUploading}
              className="gradient-primary"
            >
              {isUploading ? (
                <>
                  <Clock className="h-4 w-4 animate-spin mr-2" />
                  Uploading...
                </>
              ) : (
                <>
                  <Upload className="h-4 w-4 mr-2" />
                  Upload Batch
                </>
              )}
            </Button>
            
            <Dialog open={encryptionDialogOpen} onOpenChange={setEncryptionDialogOpen}>
              <DialogTrigger asChild>
                <Button variant="outline">
                  <Key className="h-4 w-4 mr-2" />
                  Encryption Settings
                </Button>
              </DialogTrigger>
              <DialogContent className="sm:max-w-[600px]">
                <DialogHeader>
                  <DialogTitle className="flex items-center gap-2">
                    <Shield className="h-5 w-5 text-blue-500" />
                    Encryption Configuration
                  </DialogTitle>
                  <DialogDescription>
                    Configure encryption settings for your batch uploads. All NXT tags will be secured using your specified encryption parameters.
                  </DialogDescription>
                </DialogHeader>
                
                <div className="space-y-6">
                  {/* Encryption Algorithm */}
                  <div className="space-y-2">
                    <Label htmlFor="algorithm" className="text-data-label flex items-center gap-2">
                      <Lock className="h-4 w-4" />
                      Encryption Algorithm
                    </Label>
                    <Select value={encryptionAlgorithm} onValueChange={setEncryptionAlgorithm}>
                      <SelectTrigger>
                        <SelectValue placeholder="Select encryption algorithm" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="AES-256">AES-256 (Recommended)</SelectItem>
                        <SelectItem value="AES-192">AES-192</SelectItem>
                        <SelectItem value="AES-128">AES-128</SelectItem>
                        <SelectItem value="ChaCha20">ChaCha20</SelectItem>
                      </SelectContent>
                    </Select>
                    <p className="text-xs text-muted-foreground">
                      AES-256 provides the highest level of security and is recommended for production use.
                    </p>
                  </div>

                  {/* Key Strength Indicator */}
                  <div className="space-y-2">
                    <Label className="text-data-label">Key Strength</Label>
                    <div className="flex items-center gap-2">
                      <div className={`h-3 w-full rounded-full border transition-all duration-300 ${
                        keyStrength === 'weak' ? 'bg-red-50 dark:bg-red-950/30 border-red-200 dark:border-red-800' :
                        keyStrength === 'medium' ? 'bg-amber-50 dark:bg-amber-950/30 border-amber-200 dark:border-amber-800' : 
                        'bg-emerald-50 dark:bg-emerald-950/30 border-emerald-200 dark:border-emerald-800'
                      }`}>
                        <div className={`h-full rounded-full transition-all duration-500 ${
                          keyStrength === 'weak' ? 'w-1/3 bg-gradient-to-r from-red-500 to-red-600' :
                          keyStrength === 'medium' ? 'w-2/3 bg-gradient-to-r from-amber-500 to-amber-600' : 
                          'w-full bg-gradient-to-r from-emerald-500 to-emerald-600'
                        }`} />
                      </div>
                      <Badge className={`border-0 text-white shadow-sm transition-all duration-300 ${
                        keyStrength === 'weak' ? 'bg-gradient-to-r from-red-500 to-red-600' :
                        keyStrength === 'medium' ? 'bg-gradient-to-r from-amber-500 to-amber-600' : 
                        'bg-gradient-to-r from-emerald-500 to-emerald-600'
                      }`}>
                        {keyStrength === 'weak' && '⚠️ '}
                        {keyStrength === 'medium' && '🔒 '}
                        {keyStrength === 'strong' && '🛡️ '}
                        {keyStrength.charAt(0).toUpperCase() + keyStrength.slice(1)}
                      </Badge>
                    </div>
                  </div>

                  {/* Encryption Key */}
                  <div className="space-y-2">
                    <Label htmlFor="encryption-key" className="text-data-label">Master Encryption Key</Label>
                    <div className="flex gap-2">
                      <Textarea 
                        id="encryption-key"
                        value={encryptionKey}
                        onChange={(e) => {
                          setEncryptionKey(e.target.value);
                          // Update key strength based on length and complexity
                          const key = e.target.value;
                          if (key.length < 16) setKeyStrength('weak');
                          else if (key.length < 24) setKeyStrength('medium');
                          else setKeyStrength('strong');
                        }}
                        placeholder="Enter your secret encryption key..."
                        className="font-mono text-sm resize-none"
                        rows={3}
                      />
                      <div className="flex flex-col gap-2">
                        <Button 
                          type="button" 
                          variant="outline" 
                          size="sm"
                          onClick={generateRandomKey}
                          className="whitespace-nowrap"
                        >
                          Generate
                        </Button>
                        <Button 
                          type="button" 
                          variant="outline" 
                          size="sm"
                          onClick={copyKeyToClipboard}
                          disabled={!encryptionKey}
                          className="whitespace-nowrap"
                        >
                          <Copy className="h-3 w-3" />
                        </Button>
                      </div>
                    </div>
                    <p className="text-xs text-muted-foreground">
                      Store this key securely. You'll need it to decrypt your NXT data. Lost keys cannot be recovered.
                    </p>
                  </div>

                  {/* Security Notice */}
                  <div className="p-4 bg-blue-50 dark:bg-blue-950 border border-blue-200 dark:border-blue-800 rounded-lg">
                    <div className="flex items-start gap-3">
                      <Shield className="h-5 w-5 text-blue-500 flex-shrink-0 mt-0.5" />
                      <div className="space-y-1">
                        <p className="text-sm font-medium text-blue-900 dark:text-blue-100">Security Best Practices</p>
                        <ul className="text-xs text-blue-800 dark:text-blue-200 space-y-1">
                          <li>• Use a minimum of 24 characters for your encryption key</li>
                          <li>• Include uppercase, lowercase, numbers, and special characters</li>
                          <li>• Store your key in a secure password manager</li>
                          <li>• Never share your encryption key via email or unsecured channels</li>
                        </ul>
                      </div>
                    </div>
                  </div>
                </div>

                <DialogFooter>
                  <Button variant="outline" onClick={() => setEncryptionDialogOpen(false)}>
                    Cancel
                  </Button>
                  <Button onClick={saveEncryptionSettings} className="gradient-primary">
                    <Save className="h-4 w-4 mr-2" />
                    Save Settings
                  </Button>
                </DialogFooter>
              </DialogContent>
            </Dialog>
          </div>
        </CardContent>
      </Card>

      {/* Batch History */}
      <Card className="card-professional">
        <CardHeader>
          <div className="flex items-center justify-between">
            <CardTitle className="text-heading">Batch History</CardTitle>
            <div className="flex gap-2">
              <Button variant="outline" size="sm">
                <Download className="h-4 w-4 mr-2" />
                Export
              </Button>
              <Button variant="outline" size="sm">
                <Eye className="h-4 w-4 mr-2" />
                View All
              </Button>
            </div>
          </div>
        </CardHeader>
        <CardContent>
          <div className="rounded-lg border border-border/50 overflow-hidden">
            <Table>
              <TableHeader>
                <TableRow className="bg-muted/50">
                  <TableHead className="text-data-label">Batch ID</TableHead>
                  <TableHead className="text-data-label">Product</TableHead>
                  <TableHead className="text-data-label">Quantity</TableHead>
                  <TableHead className="text-data-label">Status</TableHead>
                  <TableHead className="text-data-label">Date</TableHead>
                  <TableHead className="text-data-label">Encryption</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {batches.map((batch) => (
                  <TableRow key={batch.id} className="hover:bg-muted/30 transition-smooth">
                    <TableCell className="font-mono text-sm font-medium">{batch.id}</TableCell>
                    <TableCell>
                      <div>
                        <div className="font-medium">{batch.product}</div>
                        <div className="text-sm text-muted-foreground">{batch.location}</div>
                      </div>
                    </TableCell>
                    <TableCell className="font-semibold">{batch.quantity.toLocaleString()}</TableCell>
                    <TableCell>
                      <div className="flex items-center gap-2">
                        {getStatusIcon(batch.status)}
                        {getStatusBadge(batch.status)}
                      </div>
                    </TableCell>
                    <TableCell className="text-muted-foreground">{batch.date}</TableCell>
                    <TableCell>
                      <Badge 
                        className={batch.encrypted 
                          ? "bg-gradient-to-r from-emerald-500 to-emerald-600 text-white border-0 shadow-sm hover:shadow-md transition-all duration-200" 
                          : "bg-gradient-to-r from-amber-500 to-amber-600 text-white border-0 shadow-sm hover:shadow-md transition-all duration-200"
                        }
                      >
                        {batch.encrypted ? (
                          <>
                            <Shield className="h-3 w-3 mr-1" />
                            Encrypted
                          </>
                        ) : (
                          <>
                            <Lock className="h-3 w-3 mr-1" />
                            Not Encrypted
                          </>
                        )}
                      </Badge>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default BatchManager;