/**
 * API Tester Component
 * Shows connection status and allows manual testing
 */

import { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { useAuth } from "@/contexts/AuthContext";
import { batchService } from "@/services/batchService";

export const APITester = () => {
  const { isAuthenticated, user } = useAuth();
  const [status, setStatus] = useState<string>("checking");
  const [batchCount, setBatchCount] = useState<number | null>(null);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const testConnection = async () => {
      try {
        setStatus("loading");
        setError(null);

        if (!isAuthenticated) {
          setStatus("not-authenticated");
          return;
        }

        const response = await batchService.getBatches({ limit: 5 });
        if (response?.data) {
          setBatchCount(response.data.length);
          setStatus("success");
        } else {
          setError("No response from API");
          setStatus("error");
        }
      } catch (err) {
        const msg = err instanceof Error ? err.message : "Unknown error";
        setError(msg);
        setStatus("error");
      }
    };

    testConnection();
  }, [isAuthenticated]);

  const statusColor = {
    "checking": "bg-blue-500",
    "loading": "bg-yellow-500",
    "success": "bg-green-500",
    "error": "bg-red-500",
    "not-authenticated": "bg-orange-500"
  };

  return (
    <Card className="w-full">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          API Connection Status
          <Badge className={statusColor[status] + " text-white"}>
            {status === "checking" ? "Checking..." :
             status === "loading" ? "Loading..." :
             status === "success" ? "✅ Connected" :
             status === "error" ? "❌ Error" :
             "⚠️ Not Auth"}
          </Badge>
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-3">
        <div>
          <p className="text-sm text-muted-foreground">User: {user?.username || "Not logged in"}</p>
          <p className="text-sm text-muted-foreground">Auth: {isAuthenticated ? "✅ Yes" : "❌ No"}</p>
        </div>

        {status === "success" && (
          <div className="p-3 bg-green-50 rounded border border-green-200">
            <p className="text-sm text-green-800">✅ API is working!</p>
            <p className="text-sm text-green-700 mt-1">Fetched {batchCount} batches</p>
          </div>
        )}

        {error && (
          <div className="p-3 bg-red-50 rounded border border-red-200">
            <p className="text-sm font-medium text-red-800">Error:</p>
            <p className="text-xs text-red-700 mt-1 font-mono">{error}</p>
          </div>
        )}

        {status === "not-authenticated" && (
          <div className="p-3 bg-yellow-50 rounded border border-yellow-200">
            <p className="text-sm text-yellow-800">Please log in to test API</p>
          </div>
        )}

        <Button 
          onClick={() => window.location.reload()}
          variant="outline"
          size="sm"
          className="w-full"
        >
          Retry
        </Button>
      </CardContent>
    </Card>
  );
};
