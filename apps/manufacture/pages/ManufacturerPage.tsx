/**
 * Manufacturer Feature Page (Entry Point)
 * Orchestrates batch management UI with real API integration
 */

import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { ArrowLeft, Plus } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { useToast } from "@/hooks/use-toast";
import { MetricsOverview } from "../components/MetricsOverview";
import { BatchList } from "../components/BatchList";
import { useBatchManager } from "../hooks/useBatchManager";
import { authService } from "../services/authService";
import type { CreateBatchPayload } from "../types";

const ManufacturerPage = () => {
  const navigate = useNavigate();
  const { toast } = useToast();
  const [isLoggedIn, setIsLoggedIn] = useState(authService.isAuthenticatedUser());
  const [credentials, setCredentials] = useState({ username: "", password: "" });
  const [loginError, setLoginError] = useState<string | null>(null);
  const [isLoggingIn, setIsLoggingIn] = useState(false);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [formData, setFormData] = useState<CreateBatchPayload>({
    productId: "",
    productName: "",
    quantity: 0,
    facilityId: "FAC-001",
  });

  // Use batch manager hook
  const {
    batches,
    metrics,
    isLoading,
    error,
    createBatch,
    updateStatus,
    deleteBatch,
  } = useBatchManager();

  const handleLogin = async () => {
    if (!credentials.username.trim() || !credentials.password.trim()) {
      toast({
        title: "Error",
        description: "Please enter both username and password",
        variant: "destructive",
      });
      return;
    }

    try {
      setIsLoggingIn(true);
      setLoginError(null);
      
      const success = await authService.login(credentials.username, credentials.password);
      
      if (success) {
        setIsLoggedIn(true);
        toast({
          title: "Login Successful",
          description: "Welcome to Manufacturer Dashboard",
        });
      } else {
        setLoginError("Invalid credentials. Please try again.");
        toast({
          title: "Login Failed",
          description: "Invalid username or password",
          variant: "destructive",
        });
      }
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : "Unknown error occurred";
      setLoginError(`Login failed: ${errorMessage}`);
      toast({
        title: "Login Error",
        description: errorMessage,
        variant: "destructive",
      });
    } finally {
      setIsLoggingIn(false);
    }
  };

  const handleCreateBatch = async () => {
    try {
      if (!formData.productId || !formData.productName || formData.quantity <= 0) {
        toast({
          title: "Validation Error",
          description: "Please fill all required fields",
          variant: "destructive",
        });
        return;
      }

      await createBatch(formData);
      toast({
        title: "Batch Created",
        description: `New batch created successfully`,
      });
      setIsDialogOpen(false);
      setFormData({
        productId: "",
        productName: "",
        quantity: 0,
        facilityId: "FAC-001",
      });
    } catch (err) {
      const message = err instanceof Error ? err.message : "Failed to create batch";
      toast({
        title: "Error",
        description: message,
        variant: "destructive",
      });
    }
  };

  // Render login screen
  if (!isLoggedIn) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-900 to-slate-800 flex items-center justify-center p-4">
        <Card className="w-full max-w-sm">
          <CardHeader>
            <CardTitle>Manufacturer Dashboard</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            {loginError && (
              <div className="p-2 bg-red-100 border border-red-300 rounded text-red-700 text-sm">
                {loginError}
              </div>
            )}
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
                disabled={isLoggingIn}
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
                disabled={isLoggingIn}
              />
            </div>
            <Button 
              onClick={handleLogin} 
              className="w-full"
              disabled={isLoggingIn}
            >
              {isLoggingIn ? "Logging in..." : "Login"}
            </Button>
          </CardContent>
        </Card>
      </div>
    );
  }

  // Render dashboard
  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 to-slate-800 p-6">
      <div className="max-w-7xl mx-auto space-y-6">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <Button
              variant="outline"
              size="icon"
              onClick={() => navigate("/")}
            >
              <ArrowLeft className="w-4 h-4" />
            </Button>
            <h1 className="text-3xl font-bold text-white">Manufacturer</h1>
          </div>

          {/* Create Batch Dialog */}
          <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
            <DialogTrigger asChild>
              <Button className="gap-2">
                <Plus className="w-4 h-4" />
                New Batch
              </Button>
            </DialogTrigger>
            <DialogContent>
              <DialogHeader>
                <DialogTitle>Create New Batch</DialogTitle>
              </DialogHeader>
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium mb-1">
                    Product ID
                  </label>
                  <input
                    type="text"
                    value={formData.productId}
                    onChange={(e) =>
                      setFormData({ ...formData, productId: e.target.value })
                    }
                    className="w-full px-3 py-2 border rounded-lg"
                    placeholder="PRD-001"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium mb-1">
                    Product Name
                  </label>
                  <input
                    type="text"
                    value={formData.productName}
                    onChange={(e) =>
                      setFormData({ ...formData, productName: e.target.value })
                    }
                    className="w-full px-3 py-2 border rounded-lg"
                    placeholder="Product name"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium mb-1">
                    Quantity
                  </label>
                  <input
                    type="number"
                    value={formData.quantity}
                    onChange={(e) =>
                      setFormData({
                        ...formData,
                        quantity: parseInt(e.target.value) || 0,
                      })
                    }
                    className="w-full px-3 py-2 border rounded-lg"
                    placeholder="5000"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium mb-1">Notes</label>
                  <input
                    type="text"
                    value={formData.notes || ""}
                    onChange={(e) =>
                      setFormData({ ...formData, notes: e.target.value })
                    }
                    className="w-full px-3 py-2 border rounded-lg"
                    placeholder="Optional notes"
                  />
                </div>
                <Button onClick={handleCreateBatch} className="w-full">
                  Create Batch
                </Button>
              </div>
            </DialogContent>
          </Dialog>
        </div>

        {/* Error Display */}
        {error && (
          <div className="p-3 bg-red-50 border border-red-200 rounded text-red-700">
            ❌ {error}
          </div>
        )}

        {/* Metrics */}
        <MetricsOverview metrics={metrics} isLoading={isLoading} />

        {/* Batch List */}
        <Card>
          <CardHeader>
            <CardTitle>Batch Management</CardTitle>
          </CardHeader>
          <CardContent>
            <BatchList
              batches={batches}
              onStatusChange={updateStatus}
              onDelete={deleteBatch}
              isLoading={isLoading}
            />
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default ManufacturerPage;
