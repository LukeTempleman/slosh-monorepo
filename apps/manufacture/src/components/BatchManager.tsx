import { useState, useEffect } from "react";
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
import { Upload, Download, Eye, Key, CheckCircle, Clock, AlertCircle, Shield, Lock, Copy, Edit, Trash2, Loader2, Filter, X, TrendingUp, Activity, Zap, AlertTriangle } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { useBatches } from "@/hooks/useBatches";
import { Batch, BatchStatus, RiskLevel, CreateBatchRequest } from "@/types/batches";
import { batchService } from "@/services/batchService";

const BatchManager = () => {
  const { toast } = useToast();
  const {
    batches,
    loading,
    error,
    pagination,
    filters,
    setStatus,
    setRiskLevel,
    setQualityScore,
    clearFilters,
    previousPage,
    nextPage,
    refetch
  } = useBatches({ autoFetch: true, initialFilters: { limit: 10, offset: 0 } });

  // Form state
  const [productName, setProductName] = useState("");
  const [quantity, setQuantity] = useState("");
  const [location, setLocation] = useState("");
  const [qualityScore, setQualityScoreInput] = useState("");
  const [riskLevel, setRiskLevelInput] = useState("low");
  const [notes, setNotes] = useState("");
  const [isCreatingBatch, setIsCreatingBatch] = useState(false);

  // Search state
  const [searchBatchId, setSearchBatchId] = useState("");
  const [selectedBatch, setSelectedBatch] = useState<Batch | null>(null);
  const [isSearching, setIsSearching] = useState(false);
  const [searchError, setSearchError] = useState<string | null>(null);
  const [searchDialogOpen, setSearchDialogOpen] = useState(false);

  // Edit state
  const [editDialogOpen, setEditDialogOpen] = useState(false);
  const [editingBatch, setEditingBatch] = useState<Batch | null>(null);
  const [editStatus, setEditStatus] = useState("");
  const [editQualityScore, setEditQualityScore] = useState("");
  const [editRiskLevel, setEditRiskLevel] = useState("low");
  const [editNotes, setEditNotes] = useState("");
  const [isUpdatingBatch, setIsUpdatingBatch] = useState(false);
  const [editError, setEditError] = useState<string | null>(null);

  // Delete state
  const [deleteConfirmDialogOpen, setDeleteConfirmDialogOpen] = useState(false);
  const [batchToDelete, setBatchToDelete] = useState<Batch | null>(null);
  const [isDeletingBatch, setIsDeletingBatch] = useState(false);
  const [deleteError, setDeleteError] = useState<string | null>(null);
  const [hardDeleteMode, setHardDeleteMode] = useState(false);

  // Metrics state
  const [metrics, setMetrics] = useState<any | null>(null);
  const [metricsLoading, setMetricsLoading] = useState(false);

  const [isUploading, setIsUploading] = useState(false);
  const [uploadProgress, setUploadProgress] = useState(0);
  const [uploadStage, setUploadStage] = useState("");
  const [encryptionDialogOpen, setEncryptionDialogOpen] = useState(false);
  const [encryptionKey, setEncryptionKey] = useState("");
  const [encryptionAlgorithm, setEncryptionAlgorithm] = useState("AES-256");
  const [keyStrength, setKeyStrength] = useState("strong");
  const [showFilters, setShowFilters] = useState(false);

  // Fetch metrics on mount and when data refreshes
  useEffect(() => {
    const fetchMetrics = async () => {
      setMetricsLoading(true);
      try {
        const metricsData = await batchService.getBatchMetrics();
        setMetrics(metricsData);
      } catch (err) {
        console.error("Error fetching metrics:", err);
      } finally {
        setMetricsLoading(false);
      }
    };

    fetchMetrics();
  }, []);

  const refreshMetrics = async () => {
    try {
      const metricsData = await batchService.getBatchMetrics();
      setMetrics(metricsData);
    } catch (err) {
      console.error("Error refreshing metrics:", err);
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case "completed": return <CheckCircle className="h-4 w-4 text-emerald-600 dark:text-emerald-400" />;
      case "production": return <Clock className="h-4 w-4 text-blue-600 dark:text-blue-400" />;
      case "pending": return <Clock className="h-4 w-4 text-slate-500 dark:text-slate-400" />;
      case "rejected": return <AlertCircle className="h-4 w-4 text-red-600 dark:text-red-400" />;
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
      case "production": 
        return (
          <Badge className="bg-gradient-to-r from-blue-500 to-blue-600 text-white border-0 shadow-sm hover:shadow-md transition-all duration-200">
            <Clock className="h-3 w-3 mr-1 animate-spin" />
            Production
          </Badge>
        );
      case "pending": 
        return (
          <Badge className="bg-gradient-to-r from-slate-500 to-slate-600 text-white border-0 shadow-sm hover:shadow-md transition-all duration-200">
            <Clock className="h-3 w-3 mr-1" />
            Pending
          </Badge>
        );
      case "rejected": 
        return (
          <Badge className="bg-gradient-to-r from-red-500 to-red-600 text-white border-0 shadow-sm hover:shadow-md transition-all duration-200">
            <AlertCircle className="h-3 w-3 mr-1" />
            Rejected
          </Badge>
        );
      default: return null;
    }
  };

  const getRiskLevelBadge = (level: string) => {
    switch (level) {
      case "low":
        return <Badge className="bg-gradient-to-r from-emerald-500 to-emerald-600 text-white border-0">Low</Badge>;
      case "medium":
        return <Badge className="bg-gradient-to-r from-amber-500 to-amber-600 text-white border-0">Medium</Badge>;
      case "high":
        return <Badge className="bg-gradient-to-r from-red-500 to-red-600 text-white border-0">High</Badge>;
      default:
        return null;
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

  const handleCreateBatch = async () => {
    // Validate required fields
    if (!productName.trim()) {
      toast({
        title: "Error",
        description: "Product name is required",
        variant: "destructive",
      });
      return;
    }

    if (!quantity || Number(quantity) <= 0) {
      toast({
        title: "Error",
        description: "Quantity must be a positive number",
        variant: "destructive",
      });
      return;
    }

    const qualityScoreNum = qualityScore ? Number(qualityScore) : 0;
    if (qualityScoreNum < 0 || qualityScoreNum > 100) {
      toast({
        title: "Error",
        description: "Quality score must be between 0 and 100",
        variant: "destructive",
      });
      return;
    }

    setIsCreatingBatch(true);

    try {
      const batchData: CreateBatchRequest = {
        product_name: productName.trim(),
        quantity: Number(quantity),
        ...(location.trim() && { location: location.trim() }),
        ...(qualityScore && { quality_score: qualityScoreNum }),
        ...(riskLevel && { risk_level: riskLevel as RiskLevel }),
        ...(notes.trim() && { notes: notes.trim() })
      };

      console.log("Creating batch:", batchData);
      const newBatch = await batchService.createBatch(batchData);

      if (newBatch) {
        toast({
          title: "Success",
          description: `Batch ${newBatch.id} created successfully`,
        });

        // Reset form
        setProductName("");
        setQuantity("");
        setLocation("");
        setQualityScoreInput("");
        setRiskLevelInput("low");
        setNotes("");

        // Refetch the batches list and metrics
        console.log("Refetching batches after creation...");
        await refetch();
        await refreshMetrics();
      } else {
        toast({
          title: "Error",
          description: "Failed to create batch",
          variant: "destructive",
        });
      }
    } catch (err) {
      console.error("Error creating batch:", err);
      toast({
        title: "Error",
        description: err instanceof Error ? err.message : "Failed to create batch",
        variant: "destructive",
      });
    } finally {
      setIsCreatingBatch(false);
    }
  };

  const handleSearchBatch = async () => {
    if (!searchBatchId.trim()) {
      setSearchError("Please enter a batch ID");
      return;
    }

    setIsSearching(true);
    setSearchError(null);
    setSelectedBatch(null);

    try {
      console.log("Searching for batch:", searchBatchId);
      const batch = await batchService.getBatch(searchBatchId.trim());

      if (batch) {
        setSelectedBatch(batch);
        console.log("Batch found:", batch);
      } else {
        setSearchError(`Batch ${searchBatchId} not found`);
      }
    } catch (err) {
      console.error("Error searching batch:", err);
      setSearchError(err instanceof Error ? err.message : "Failed to search batch");
    } finally {
      setIsSearching(false);
    }
  };

  const openEditDialog = (batch: Batch) => {
    setEditingBatch(batch);
    setEditStatus(batch.status);
    setEditQualityScore(batch.quality_score.toString());
    setEditRiskLevel(batch.risk_level);
    setEditNotes(batch.notes || "");
    setEditError(null);
    setEditDialogOpen(true);
  };

  const getValidStatusTransitions = (currentStatus: string): string[] => {
    const transitions: Record<string, string[]> = {
      pending: ['production', 'rejected'],
      production: ['completed', 'rejected'],
      completed: [],
      rejected: []
    };
    return transitions[currentStatus] || [];
  };

  const handleUpdateBatch = async () => {
    if (!editingBatch) return;

    // Validate quality score
    const qualityScoreNum = editQualityScore ? Number(editQualityScore) : null;
    if (qualityScoreNum !== null && (qualityScoreNum < 0 || qualityScoreNum > 100)) {
      setEditError("Quality score must be between 0 and 100");
      return;
    }

    // Validate status transition
    const validTransitions = getValidStatusTransitions(editingBatch.status);
    if (editStatus !== editingBatch.status && !validTransitions.includes(editStatus)) {
      setEditError(`Cannot transition from ${editingBatch.status} to ${editStatus}`);
      return;
    }

    setIsUpdatingBatch(true);
    setEditError(null);

    try {
      const updates: any = {};
      
      if (editStatus !== editingBatch.status) updates.status = editStatus;
      if (qualityScoreNum !== null && qualityScoreNum !== editingBatch.quality_score) updates.quality_score = qualityScoreNum;
      if (editRiskLevel !== editingBatch.risk_level) updates.risk_level = editRiskLevel;
      if (editNotes !== (editingBatch.notes || "")) updates.notes = editNotes;

      if (Object.keys(updates).length === 0) {
        setEditError("No changes made");
        return;
      }

      console.log("Updating batch:", editingBatch.id, updates);
      const updatedBatch = await batchService.updateBatch(editingBatch.id, updates);

      if (updatedBatch) {
        toast({
          title: "Success",
          description: `Batch ${editingBatch.id} updated successfully`,
        });

        // Update search results
        if (selectedBatch?.id === editingBatch.id) {
          setSelectedBatch(updatedBatch);
        }

        // Refresh the batch list and metrics
        await refetch();
        await refreshMetrics();
        setEditDialogOpen(false);
      } else {
        setEditError("Failed to update batch");
      }
    } catch (err) {
      console.error("Error updating batch:", err);
      setEditError(err instanceof Error ? err.message : "Failed to update batch");
    } finally {
      setIsUpdatingBatch(false);
    }
  };

  const openDeleteConfirmDialog = (batch: Batch) => {
    setBatchToDelete(batch);
    setDeleteError(null);
    setHardDeleteMode(false);
    setDeleteConfirmDialogOpen(true);
  };

  const handleDeleteBatch = async () => {
    if (!batchToDelete) return;

    setIsDeletingBatch(true);
    setDeleteError(null);

    try {
      console.log("Deleting batch (hard_delete:", hardDeleteMode, "):", batchToDelete.id);
      const success = await batchService.deleteBatch(batchToDelete.id, hardDeleteMode);

      if (success) {
        toast({
          title: "Success",
          description: `Batch ${batchToDelete.id} ${hardDeleteMode ? 'permanently deleted' : 'marked as deleted'}`,
        });

        // Clear selected batch if it was deleted
        if (selectedBatch?.id === batchToDelete.id) {
          setSelectedBatch(null);
        }

        // Refresh the batch list and metrics
        await refetch();
        await refreshMetrics();
        setDeleteConfirmDialogOpen(false);
      } else {
        setDeleteError("Failed to delete batch");
      }
    } catch (err) {
      console.error("Error deleting batch:", err);
      setDeleteError(err instanceof Error ? err.message : "Failed to delete batch");
    } finally {
      setIsDeletingBatch(false);
    }
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
      {/* Metrics Summary */}
      <Card className="card-professional bg-gradient-to-br from-slate-900 to-slate-800 border-slate-700">
        <CardHeader>
          <CardTitle className="text-heading flex items-center gap-2 text-white">
            <TrendingUp className="h-5 w-5 text-blue-400" />
            Batch KPIs
          </CardTitle>
        </CardHeader>
        <CardContent>
          {metricsLoading ? (
            <div className="flex items-center justify-center py-8">
              <Loader2 className="h-6 w-6 animate-spin text-blue-400" />
              <span className="ml-2 text-slate-300">Loading metrics...</span>
            </div>
          ) : metrics ? (
            <div className="grid grid-cols-2 md:grid-cols-5 gap-4">
              {/* Total */}
              <div className="bg-slate-800 p-4 rounded-lg border border-slate-700 hover:border-slate-600 transition-colors">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-xs text-slate-400 uppercase tracking-wider">Total</p>
                    <p className="text-2xl font-bold text-white mt-1">{metrics.summary.total}</p>
                  </div>
                  <Activity className="h-8 w-8 text-blue-400 opacity-50" />
                </div>
              </div>

              {/* Active */}
              <div className="bg-slate-800 p-4 rounded-lg border border-slate-700 hover:border-slate-600 transition-colors">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-xs text-slate-400 uppercase tracking-wider">Active</p>
                    <p className="text-2xl font-bold text-blue-400 mt-1">{metrics.summary.active}</p>
                  </div>
                  <Zap className="h-8 w-8 text-blue-400 opacity-50" />
                </div>
              </div>

              {/* Completed */}
              <div className="bg-slate-800 p-4 rounded-lg border border-slate-700 hover:border-slate-600 transition-colors">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-xs text-slate-400 uppercase tracking-wider">Completed</p>
                    <p className="text-2xl font-bold text-emerald-400 mt-1">{metrics.summary.completed}</p>
                  </div>
                  <CheckCircle className="h-8 w-8 text-emerald-400 opacity-50" />
                </div>
              </div>

              {/* Rejected */}
              <div className="bg-slate-800 p-4 rounded-lg border border-slate-700 hover:border-slate-600 transition-colors">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-xs text-slate-400 uppercase tracking-wider">Rejected</p>
                    <p className="text-2xl font-bold text-red-400 mt-1">{metrics.summary.rejected}</p>
                  </div>
                  <AlertTriangle className="h-8 w-8 text-red-400 opacity-50" />
                </div>
              </div>

              {/* Avg Quality */}
              <div className="bg-slate-800 p-4 rounded-lg border border-slate-700 hover:border-slate-600 transition-colors">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-xs text-slate-400 uppercase tracking-wider">Avg Quality</p>
                    <p className="text-2xl font-bold text-amber-400 mt-1">{metrics.summary.avg_quality.toFixed(1)}%</p>
                  </div>
                  <Shield className="h-8 w-8 text-amber-400 opacity-50" />
                </div>
              </div>
            </div>
          ) : (
            <p className="text-slate-400">Unable to load metrics</p>
          )}
        </CardContent>
      </Card>

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
              <Label htmlFor="product-name" className="text-data-label">Product Name *</Label>
              <Input 
                id="product-name" 
                placeholder="e.g., Jameson Irish Whiskey 750ml"
                value={productName}
                onChange={(e) => setProductName(e.target.value)}
                className="mt-1"
                disabled={isCreatingBatch}
              />
            </div>
            <div>
              <Label htmlFor="batch-quantity" className="text-data-label">Batch Quantity *</Label>
              <Input 
                id="batch-quantity" 
                type="number" 
                placeholder="e.g., 5000"
                value={quantity}
                onChange={(e) => setQuantity(e.target.value)}
                className="mt-1"
                disabled={isCreatingBatch}
              />
            </div>
            <div>
              <Label htmlFor="production-location" className="text-data-label">Production Location</Label>
              <Input 
                id="production-location" 
                placeholder="e.g., Cork Distillery, Ireland"
                value={location}
                onChange={(e) => setLocation(e.target.value)}
                className="mt-1"
                disabled={isCreatingBatch}
              />
            </div>
            <div>
              <Label htmlFor="quality-score" className="text-data-label">Quality Score (0-100)</Label>
              <Input 
                id="quality-score" 
                type="number"
                min="0"
                max="100"
                placeholder="e.g., 95"
                value={qualityScore}
                onChange={(e) => setQualityScoreInput(e.target.value)}
                className="mt-1"
                disabled={isCreatingBatch}
              />
            </div>
            <div>
              <Label htmlFor="risk-level" className="text-data-label">Risk Level</Label>
              <select 
                id="risk-level"
                value={riskLevel}
                onChange={(e) => setRiskLevelInput(e.target.value)}
                className="mt-1 w-full h-9 px-3 py-1 rounded-md border border-input bg-background"
                disabled={isCreatingBatch}
              >
                <option value="low">Low</option>
                <option value="medium">Medium</option>
                <option value="high">High</option>
              </select>
            </div>
            <div>
              <Label htmlFor="notes" className="text-data-label">Notes</Label>
              <Input 
                id="notes" 
                placeholder="Additional information..."
                value={notes}
                onChange={(e) => setNotes(e.target.value)}
                className="mt-1"
                disabled={isCreatingBatch}
              />
            </div>
          </div>
          
          <div className="flex items-center gap-4">
            <Button 
              onClick={handleCreateBatch} 
              disabled={isCreatingBatch || !productName.trim() || !quantity}
              className="gradient-primary"
            >
              {isCreatingBatch ? (
                <>
                  <Loader2 className="h-4 w-4 animate-spin mr-2" />
                  Creating Batch...
                </>
              ) : (
                <>
                  <Upload className="h-4 w-4 mr-2" />
                  Create Batch
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
                    <Edit className="h-4 w-4 mr-2" />
                    Save Settings
                  </Button>
                </DialogFooter>
              </DialogContent>
            </Dialog>
          </div>
        </CardContent>
      </Card>

      {/* Search Batch by ID */}
      <Card className="card-professional">
        <CardHeader>
          <CardTitle className="text-heading flex items-center gap-2">
            <Eye className="h-5 w-5" />
            Search Batch by ID
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex gap-2">
            <div className="flex-1">
              <Input 
                placeholder="e.g., BN0001"
                value={searchBatchId}
                onChange={(e) => {
                  setSearchBatchId(e.target.value.toUpperCase());
                  setSearchError(null);
                }}
                onKeyPress={(e) => e.key === 'Enter' && handleSearchBatch()}
                disabled={isSearching}
                className="font-mono"
              />
            </div>
            <Button 
              onClick={handleSearchBatch} 
              disabled={isSearching || !searchBatchId.trim()}
              className="gradient-primary"
            >
              {isSearching ? (
                <>
                  <Loader2 className="h-4 w-4 animate-spin mr-2" />
                  Searching...
                </>
              ) : (
                <>
                  <Eye className="h-4 w-4 mr-2" />
                  Search
                </>
              )}
            </Button>
          </div>

          {searchError && (
            <div className="mt-4 p-4 bg-red-50 dark:bg-red-950/30 border border-red-200 dark:border-red-800 rounded-lg text-sm text-red-700 dark:text-red-200">
              {searchError}
            </div>
          )}

          {selectedBatch && (
            <div className="mt-4 p-4 bg-gradient-to-r from-blue-50 to-indigo-50 dark:from-blue-950/30 dark:to-indigo-950/30 border border-blue-200 dark:border-blue-800 rounded-lg">
              <div className="grid md:grid-cols-2 gap-4">
                <div>
                  <div className="text-xs text-data-label uppercase tracking-wider">Batch ID</div>
                  <div className="text-lg font-mono font-semibold mt-1">{selectedBatch.id}</div>
                </div>
                <div>
                  <div className="text-xs text-data-label uppercase tracking-wider">Product</div>
                  <div className="text-lg font-semibold mt-1">{selectedBatch.product_name}</div>
                </div>
                <div>
                  <div className="text-xs text-data-label uppercase tracking-wider">Quantity</div>
                  <div className="text-lg font-semibold mt-1">{selectedBatch.quantity.toLocaleString()}</div>
                </div>
                <div>
                  <div className="text-xs text-data-label uppercase tracking-wider">Status</div>
                  <div className="flex items-center gap-2 mt-1">
                    {getStatusIcon(selectedBatch.status)}
                    {getStatusBadge(selectedBatch.status)}
                  </div>
                </div>
                <div>
                  <div className="text-xs text-data-label uppercase tracking-wider">Quality Score</div>
                  <div className="flex items-center gap-2 mt-1">
                    <div className="w-20 bg-muted rounded-full h-2">
                      <div 
                        className={`h-full rounded-full ${
                          selectedBatch.quality_score >= 80 ? 'bg-emerald-500' :
                          selectedBatch.quality_score >= 60 ? 'bg-amber-500' :
                          'bg-red-500'
                        }`}
                        style={{ width: `${selectedBatch.quality_score}%` }}
                      />
                    </div>
                    <span className="text-sm font-semibold">{selectedBatch.quality_score.toFixed(1)}%</span>
                  </div>
                </div>
                <div>
                  <div className="text-xs text-data-label uppercase tracking-wider">Risk Level</div>
                  <div className="mt-1">{getRiskLevelBadge(selectedBatch.risk_level)}</div>
                </div>
                <div>
                  <div className="text-xs text-data-label uppercase tracking-wider">Location</div>
                  <div className="text-sm mt-1">{selectedBatch.location || "N/A"}</div>
                </div>
                <div>
                  <div className="text-xs text-data-label uppercase tracking-wider">Created Date</div>
                  <div className="text-sm mt-1">{new Date(selectedBatch.created_at).toLocaleDateString()}</div>
                </div>
                {selectedBatch.notes && (
                  <div className="md:col-span-2">
                    <div className="text-xs text-data-label uppercase tracking-wider">Notes</div>
                    <div className="text-sm mt-1 italic">{selectedBatch.notes}</div>
                  </div>
                )}
                <div className="md:col-span-2 flex gap-2 mt-2">
                  <Button 
                    onClick={() => openEditDialog(selectedBatch)}
                    className="gradient-primary"
                    size="sm"
                  >
                    <Edit className="h-4 w-4 mr-2" />
                    Edit Batch
                  </Button>
                  <Button 
                    onClick={() => openDeleteConfirmDialog(selectedBatch)}
                    variant="destructive"
                    size="sm"
                  >
                    <Trash2 className="h-4 w-4 mr-2" />
                    Delete Batch
                  </Button>
                </div>
              </div>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Edit Batch Dialog */}
      <Dialog open={editDialogOpen} onOpenChange={setEditDialogOpen}>
        <DialogContent className="sm:max-w-[600px]">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2">
              <Edit className="h-5 w-5 text-blue-500" />
              Edit Batch {editingBatch?.id}
            </DialogTitle>
            <DialogDescription>
              Update batch details including status, quality score, risk level, and notes.
            </DialogDescription>
          </DialogHeader>

          {editError && (
            <div className="p-3 bg-red-50 dark:bg-red-950/30 border border-red-200 dark:border-red-800 rounded text-sm text-red-700 dark:text-red-200">
              {editError}
            </div>
          )}

          <div className="space-y-4">
            {/* Status */}
            <div>
              <Label className="text-data-label">Status</Label>
              <p className="text-xs text-muted-foreground mt-1">Current: <span className="font-semibold">{editingBatch?.status}</span></p>
              <select 
                value={editStatus}
                onChange={(e) => {
                  setEditStatus(e.target.value);
                  setEditError(null);
                }}
                className="mt-2 w-full h-9 px-3 py-1 rounded-md border border-input bg-background"
              >
                <option value={editingBatch?.status || "pending"}>{editingBatch?.status}</option>
                {getValidStatusTransitions(editingBatch?.status || "pending").map(status => (
                  <option key={status} value={status}>{status}</option>
                ))}
              </select>
            </div>

            {/* Quality Score */}
            <div>
              <Label htmlFor="edit-quality" className="text-data-label">Quality Score (0-100)</Label>
              <Input 
                id="edit-quality"
                type="number"
                min="0"
                max="100"
                placeholder="e.g., 95"
                value={editQualityScore}
                onChange={(e) => {
                  setEditQualityScore(e.target.value);
                  setEditError(null);
                }}
                className="mt-1"
              />
              <p className="text-xs text-muted-foreground mt-1">Current: {editingBatch?.quality_score.toFixed(1)}%</p>
            </div>

            {/* Risk Level */}
            <div>
              <Label className="text-data-label">Risk Level</Label>
              <select 
                value={editRiskLevel}
                onChange={(e) => {
                  setEditRiskLevel(e.target.value);
                  setEditError(null);
                }}
                className="mt-1 w-full h-9 px-3 py-1 rounded-md border border-input bg-background"
              >
                <option value="low">Low</option>
                <option value="medium">Medium</option>
                <option value="high">High</option>
              </select>
              <p className="text-xs text-muted-foreground mt-1">Current: {editingBatch?.risk_level}</p>
            </div>

            {/* Notes */}
            <div>
              <Label htmlFor="edit-notes" className="text-data-label">Notes</Label>
              <Textarea 
                id="edit-notes"
                placeholder="Add or update batch notes..."
                value={editNotes}
                onChange={(e) => {
                  setEditNotes(e.target.value);
                  setEditError(null);
                }}
                rows={3}
                className="mt-1"
              />
              <p className="text-xs text-muted-foreground mt-1">{editNotes.length}/1000 characters</p>
            </div>
          </div>

          <DialogFooter>
            <Button 
              variant="outline" 
              onClick={() => setEditDialogOpen(false)}
              disabled={isUpdatingBatch}
            >
              Cancel
            </Button>
            <Button 
              onClick={handleUpdateBatch}
              disabled={isUpdatingBatch}
              className="gradient-primary"
            >
              {isUpdatingBatch ? (
                <>
                  <Loader2 className="h-4 w-4 animate-spin mr-2" />
                  Updating...
                </>
              ) : (
                <>
                  <Edit className="h-4 w-4 mr-2" />
                  Update Batch
                </>
              )}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Delete Confirmation Dialog */}
      <Dialog open={deleteConfirmDialogOpen} onOpenChange={setDeleteConfirmDialogOpen}>
        <DialogContent className="sm:max-w-[500px]">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2 text-red-600">
              <Trash2 className="h-5 w-5" />
              Delete Batch
            </DialogTitle>
            <DialogDescription>
              Are you sure you want to delete batch {batchToDelete?.id}? This action {hardDeleteMode ? 'permanently removes' : 'marks'} the batch from the system.
            </DialogDescription>
          </DialogHeader>

          {deleteError && (
            <div className="p-3 bg-red-50 dark:bg-red-950/30 border border-red-200 dark:border-red-800 rounded text-sm text-red-700 dark:text-red-200">
              {deleteError}
            </div>
          )}

          <div className="space-y-4 py-4">
            <div className="bg-slate-50 dark:bg-slate-900 p-4 rounded-lg space-y-2">
              <div className="text-sm">
                <span className="text-data-label">Product:</span>
                <span className="ml-2 font-medium">{batchToDelete?.product_name}</span>
              </div>
              <div className="text-sm">
                <span className="text-data-label">Status:</span>
                <span className="ml-2">{getStatusBadge(batchToDelete?.status || '')}</span>
              </div>
              <div className="text-sm">
                <span className="text-data-label">Created:</span>
                <span className="ml-2">{batchToDelete && new Date(batchToDelete.created_at).toLocaleDateString()}</span>
              </div>
            </div>

            <div className="flex items-center gap-2">
              <input 
                type="checkbox"
                id="hard-delete"
                checked={hardDeleteMode}
                onChange={(e) => setHardDeleteMode(e.target.checked)}
                className="rounded border-input"
              />
              <label htmlFor="hard-delete" className="text-sm cursor-pointer">
                <span className="font-semibold">Permanent Delete (Hard Delete)</span>
                <p className="text-xs text-muted-foreground mt-1">Removes the batch permanently. Cannot be undone.</p>
              </label>
            </div>

            {!hardDeleteMode && (
              <p className="text-xs text-amber-600 dark:text-amber-400 bg-amber-50 dark:bg-amber-950/30 p-2 rounded">
                💡 Soft delete marks the batch as deleted but keeps it in the database for audit purposes. You can restore it if needed.
              </p>
            )}
            {hardDeleteMode && (
              <p className="text-xs text-red-600 dark:text-red-400 bg-red-50 dark:bg-red-950/30 p-2 rounded">
                ⚠️ Hard delete is permanent and cannot be reversed. All related data may also be deleted.
              </p>
            )}
          </div>

          <DialogFooter>
            <Button 
              variant="outline" 
              onClick={() => setDeleteConfirmDialogOpen(false)}
              disabled={isDeletingBatch}
            >
              Cancel
            </Button>
            <Button 
              onClick={handleDeleteBatch}
              disabled={isDeletingBatch}
              variant="destructive"
            >
              {isDeletingBatch ? (
                <>
                  <Loader2 className="h-4 w-4 animate-spin mr-2" />
                  Deleting...
                </>
              ) : (
                <>
                  <Trash2 className="h-4 w-4 mr-2" />
                  {hardDeleteMode ? 'Permanently Delete' : 'Delete Batch'}
                </>
              )}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Batch History with Filters */}
      <Card className="card-professional">
        <CardHeader>
          <div className="flex items-center justify-between">
            <CardTitle className="text-heading">Batch History</CardTitle>
            <div className="flex gap-2">
              <Button 
                variant="outline" 
                size="sm"
                onClick={() => setShowFilters(!showFilters)}
                className="gap-2"
              >
                <Filter className="h-4 w-4" />
                {showFilters ? "Hide" : "Show"} Filters
              </Button>
              <Button variant="outline" size="sm">
                <Download className="h-4 w-4 mr-2" />
                Export
              </Button>
            </div>
          </div>
        </CardHeader>

        {/* Filter Panel - Separate Section */}
        {showFilters && (
          <div className="px-6 py-4 border-b border-border/50 bg-muted/20">
            <div className="grid md:grid-cols-4 gap-4">
              {/* Status Filter */}
              <div>
                <Label className="text-data-label text-xs">Status</Label>
                <select 
                  value={filters.status || ""} 
                  onChange={(e) => setStatus(e.target.value ? (e.target.value as BatchStatus) : undefined)}
                  className="mt-1 w-full h-9 px-3 py-1 rounded-md border border-input bg-background"
                >
                  <option value="">All Statuses</option>
                  <option value="pending">Pending</option>
                  <option value="production">Production</option>
                  <option value="completed">Completed</option>
                  <option value="rejected">Rejected</option>
                </select>
              </div>

              {/* Risk Level Filter */}
              <div>
                <Label className="text-data-label text-xs">Risk Level</Label>
                <select 
                  value={filters.risk_level || ""} 
                  onChange={(e) => setRiskLevel(e.target.value ? (e.target.value as RiskLevel) : undefined)}
                  className="mt-1 w-full h-9 px-3 py-1 rounded-md border border-input bg-background"
                >
                  <option value="">All Levels</option>
                  <option value="low">Low</option>
                  <option value="medium">Medium</option>
                  <option value="high">High</option>
                </select>
              </div>

              {/* Quality Score Min */}
              <div>
                <Label className="text-data-label text-xs">Min Quality Score</Label>
                <Input 
                  type="number" 
                  placeholder="0"
                  min="0"
                  max="100"
                  value={filters.quality_score_min || ""}
                  onChange={(e) => setQualityScore(e.target.value ? Number(e.target.value) : undefined, filters.quality_score_max)}
                  className="mt-1"
                />
              </div>

              {/* Quality Score Max */}
              <div>
                <Label className="text-data-label text-xs">Max Quality Score</Label>
                <Input 
                  type="number" 
                  placeholder="100"
                  min="0"
                  max="100"
                  value={filters.quality_score_max || ""}
                  onChange={(e) => setQualityScore(filters.quality_score_min, e.target.value ? Number(e.target.value) : undefined)}
                  className="mt-1"
                />
              </div>
            </div>

            {/* Clear Filters Button */}
            {(filters.status || filters.risk_level || filters.quality_score_min || filters.quality_score_max) && (
              <Button 
                variant="ghost" 
                size="sm" 
                onClick={clearFilters}
                className="mt-4 gap-2"
              >
                <X className="h-4 w-4" />
                Clear All Filters
              </Button>
            )}
          </div>
        )}

        <CardContent>
          {error && (
            <div className="mb-4 p-4 bg-red-50 dark:bg-red-950/30 border border-red-200 dark:border-red-800 rounded-lg text-sm text-red-700 dark:text-red-200">
              {error}
            </div>
          )}

          {loading ? (
            <div className="flex items-center justify-center py-12">
              <Loader2 className="h-8 w-8 animate-spin text-blue-500" />
              <span className="ml-2 text-muted-foreground">Loading batches...</span>
            </div>
          ) : batches.length === 0 ? (
            <div className="flex flex-col items-center justify-center py-12 text-center">
              <AlertCircle className="h-12 w-12 text-muted-foreground mb-3" />
              <p className="text-muted-foreground">No batches found</p>
            </div>
          ) : (
            <>
              <div className="rounded-lg border border-border/50 overflow-hidden">
                <Table>
                  <TableHeader>
                    <TableRow className="bg-muted/50">
                      <TableHead className="text-data-label">Batch ID</TableHead>
                      <TableHead className="text-data-label">Product</TableHead>
                      <TableHead className="text-data-label">Quantity</TableHead>
                      <TableHead className="text-data-label">Status</TableHead>
                      <TableHead className="text-data-label">Risk Level</TableHead>
                      <TableHead className="text-data-label">Quality Score</TableHead>
                      <TableHead className="text-data-label">Location</TableHead>
                      <TableHead className="text-data-label">Date</TableHead>
                      <TableHead className="text-data-label text-center">Actions</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {batches.map((batch: Batch) => (
                      <TableRow key={batch.id} className="hover:bg-muted/30 transition-smooth">
                        <TableCell className="font-mono text-sm font-medium">{batch.id}</TableCell>
                        <TableCell>
                          <div>
                            <div className="font-medium">{batch.product_name}</div>
                          </div>
                        </TableCell>
                        <TableCell className="font-semibold">{batch.quantity.toLocaleString()}</TableCell>
                        <TableCell>
                          <div className="flex items-center gap-2">
                            {getStatusIcon(batch.status)}
                            {getStatusBadge(batch.status)}
                          </div>
                        </TableCell>
                        <TableCell>
                          {getRiskLevelBadge(batch.risk_level)}
                        </TableCell>
                        <TableCell>
                          <div className="flex items-center gap-2">
                            <div className="w-16 bg-muted rounded-full h-2">
                              <div 
                                className={`h-full rounded-full transition-all ${
                                  batch.quality_score >= 80 ? 'bg-emerald-500' :
                                  batch.quality_score >= 60 ? 'bg-amber-500' :
                                  'bg-red-500'
                                }`}
                                style={{ width: `${batch.quality_score}%` }}
                              />
                            </div>
                            <span className="text-sm font-medium">{batch.quality_score.toFixed(1)}%</span>
                          </div>
                        </TableCell>
                        <TableCell className="text-muted-foreground">{batch.location}</TableCell>
                        <TableCell className="text-muted-foreground text-sm">
                          {new Date(batch.created_at).toLocaleDateString()}
                        </TableCell>
                        <TableCell className="text-center">
                          <Button 
                            onClick={() => openEditDialog(batch)}
                            variant="ghost"
                            size="sm"
                            className="h-7 px-2"
                            title="Edit batch"
                          >
                            <Edit className="h-4 w-4" />
                          </Button>
                          <Button 
                            onClick={() => openDeleteConfirmDialog(batch)}
                            variant="ghost"
                            size="sm"
                            className="h-7 px-2 text-red-600 hover:text-red-700 hover:bg-red-50 dark:hover:bg-red-950/20"
                            title="Delete batch"
                          >
                            <Trash2 className="h-4 w-4" />
                          </Button>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </div>

              {/* Pagination */}
              <div className="mt-4 flex items-center justify-between">
                <p className="text-sm text-muted-foreground">
                  Showing {batches.length} of {pagination.total} batches
                </p>
                <div className="flex gap-2">
                  <Button 
                    variant="outline" 
                    size="sm"
                    onClick={previousPage}
                    disabled={pagination.offset === 0}
                  >
                    Previous
                  </Button>
                  <div className="flex items-center gap-2 px-3">
                    <span className="text-sm text-muted-foreground">
                      Page {Math.floor(pagination.offset / pagination.limit) + 1}
                    </span>
                  </div>
                  <Button 
                    variant="outline" 
                    size="sm"
                    onClick={nextPage}
                    disabled={!pagination.hasMore}
                  >
                    Next
                  </Button>
                </div>
              </div>
            </>
          )}
        </CardContent>
      </Card>
    </div>
  );
};

export default BatchManager;