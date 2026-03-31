/**
 * Risk Assessment Feature Page (Entry Point)
 * Orchestrates risk dashboard
 */

import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { ArrowLeft } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { useToast } from "@/hooks/use-toast";
import { RiskMetrics } from "../components/RiskMetrics";
import { RiskAlertList } from "../components/RiskAlertList";
import { useRiskAssessment } from "../hooks/useRiskAssessment";

const RiskAssessmentPage = () => {
  const navigate = useNavigate();
  const { toast } = useToast();
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [credentials, setCredentials] = useState({ username: "", password: "" });

  // Use risk assessment hook
  const { risks, summary, isLoading, error, updateRiskStatus } =
    useRiskAssessment();

  const handleLogin = () => {
    if (credentials.username && credentials.password) {
      setIsLoggedIn(true);
      toast({
        title: "Login Successful",
        description: "Welcome to Risk Assessment Dashboard",
      });
    } else {
      toast({
        title: "Error",
        description: "Please enter credentials",
        variant: "destructive",
      });
    }
  };

  const handleResolveRisk = async (riskId: string) => {
    try {
      await updateRiskStatus(riskId, "resolved");
      toast({
        title: "Risk Resolved",
        description: `Risk ${riskId} has been marked as resolved`,
      });
    } catch (err) {
      toast({
        title: "Error",
        description: "Failed to resolve risk",
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
            <CardTitle>Risk Assessment</CardTitle>
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

  // Render dashboard
  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 to-slate-800 p-6">
      <div className="max-w-7xl mx-auto space-y-6">
        {/* Header */}
        <div className="flex items-center gap-3">
          <Button variant="outline" size="icon" onClick={() => navigate("/")}>
            <ArrowLeft className="w-4 h-4" />
          </Button>
          <h1 className="text-3xl font-bold text-white">Risk Assessment</h1>
        </div>

        {/* Error Display */}
        {error && (
          <div className="p-3 bg-red-50 border border-red-200 rounded text-red-700">
            ❌ {error}
          </div>
        )}

        {/* Risk Metrics */}
        <RiskMetrics summary={summary} isLoading={isLoading} />

        {/* Active Risks */}
        <Card>
          <CardHeader>
            <CardTitle>Active Risk Alerts</CardTitle>
          </CardHeader>
          <CardContent>
            <RiskAlertList
              risks={risks}
              onResolve={handleResolveRisk}
              isLoading={isLoading}
            />
          </CardContent>
        </Card>

        {/* Risk Trends */}
        <Card>
          <CardHeader>
            <CardTitle>Risk Trends by Category</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              {summary?.trends.map((trend) => (
                <div
                  key={trend.category}
                  className="p-4 border rounded-lg hover:bg-gray-50"
                >
                  <div className="flex justify-between items-start mb-2">
                    <p className="font-medium capitalize">{trend.category}</p>
                    <span
                      className={`text-xs font-semibold px-2 py-1 rounded ${
                        trend.trend === "increasing"
                          ? "bg-red-100 text-red-800"
                          : trend.trend === "stable"
                            ? "bg-yellow-100 text-yellow-800"
                            : "bg-green-100 text-green-800"
                      }`}
                    >
                      {trend.trend}
                    </span>
                  </div>
                  <p className="text-sm text-gray-600">Count: {trend.count}</p>
                  <p className="text-sm text-gray-600">
                    Avg Score: {trend.avgScore.toFixed(1)}%
                  </p>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default RiskAssessmentPage;
