import { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { Loader2, TrendingUp, Activity, Zap, AlertTriangle, CheckCircle, AlertCircle, BarChart3, PieChart } from "lucide-react";
import { batchService } from "@/services/batchService";

interface Metrics {
  summary: {
    total: number;
    active: number;
    completed: number;
    rejected: number;
    avg_quality: number;
  };
  by_status: {
    pending: number;
    production: number;
    completed: number;
    rejected: number;
  };
  by_risk: {
    low: number;
    medium: number;
    high: number;
  };
  quality_distribution: {
    excellent: number;
    good: number;
    fair: number;
    poor: number;
  };
}

export default function Dashboard() {
  const [metrics, setMetrics] = useState<Metrics | null>(null);
  const [loading, setLoading] = useState(true);
  const [lastUpdated, setLastUpdated] = useState<Date | null>(null);

  const fetchMetrics = async () => {
    try {
      const data = await batchService.getBatchMetrics();
      if (data) {
        setMetrics(data);
        setLastUpdated(new Date());
      }
    } catch (error) {
      console.error("Failed to fetch metrics:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchMetrics();
    // Refresh metrics every 30 seconds
    const interval = setInterval(fetchMetrics, 30000);
    return () => clearInterval(interval);
  }, []);

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-center">
          <Loader2 className="h-12 w-12 animate-spin mx-auto text-blue-500 mb-4" />
          <p className="text-slate-600 dark:text-slate-400">Loading dashboard...</p>
        </div>
      </div>
    );
  }

  if (!metrics) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <Card className="w-full max-w-md">
          <CardHeader>
            <CardTitle className="text-red-600">Error Loading Dashboard</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-slate-600 dark:text-slate-400">Unable to fetch metrics from backend. Please try again.</p>
          </CardContent>
        </Card>
      </div>
    );
  }

  const statusPercentage = (count: number) => ((count / metrics.summary.total) * 100).toFixed(1);
  const riskPercentage = (count: number) => ((count / metrics.summary.total) * 100).toFixed(1);

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-950 to-slate-900 p-6">
      <div className="max-w-7xl mx-auto space-y-8">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-4xl font-bold text-white flex items-center gap-3">
              <BarChart3 className="h-10 w-10 text-blue-400" />
              Manufacturing Dashboard
            </h1>
            <p className="text-slate-400 mt-2">
              Real-time batch metrics and KPIs
              {lastUpdated && ` • Last updated: ${lastUpdated.toLocaleTimeString()}`}
            </p>
          </div>
        </div>

        {/* KPI Summary Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-4">
          {/* Total Batches */}
          <Card className="bg-gradient-to-br from-slate-800 to-slate-700 border-slate-600 hover:border-slate-500 transition-colors">
            <CardHeader className="pb-3">
              <CardTitle className="text-sm text-slate-400 flex items-center justify-between">
                <span>Total Batches</span>
                <Activity className="h-4 w-4 text-blue-400" />
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold text-white">{metrics.summary.total}</div>
              <p className="text-xs text-slate-400 mt-2">All batches in system</p>
            </CardContent>
          </Card>

          {/* Active Batches */}
          <Card className="bg-gradient-to-br from-slate-800 to-slate-700 border-slate-600 hover:border-slate-500 transition-colors">
            <CardHeader className="pb-3">
              <CardTitle className="text-sm text-slate-400 flex items-center justify-between">
                <span>Active</span>
                <Zap className="h-4 w-4 text-blue-400" />
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold text-blue-400">{metrics.summary.active}</div>
              <p className="text-xs text-slate-400 mt-2">
                {((metrics.summary.active / metrics.summary.total) * 100).toFixed(1)}% in progress
              </p>
            </CardContent>
          </Card>

          {/* Completed */}
          <Card className="bg-gradient-to-br from-slate-800 to-slate-700 border-slate-600 hover:border-slate-500 transition-colors">
            <CardHeader className="pb-3">
              <CardTitle className="text-sm text-slate-400 flex items-center justify-between">
                <span>Completed</span>
                <CheckCircle className="h-4 w-4 text-emerald-400" />
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold text-emerald-400">{metrics.summary.completed}</div>
              <p className="text-xs text-slate-400 mt-2">
                {((metrics.summary.completed / metrics.summary.total) * 100).toFixed(1)}% success rate
              </p>
            </CardContent>
          </Card>

          {/* Rejected */}
          <Card className="bg-gradient-to-br from-slate-800 to-slate-700 border-slate-600 hover:border-slate-500 transition-colors">
            <CardHeader className="pb-3">
              <CardTitle className="text-sm text-slate-400 flex items-center justify-between">
                <span>Rejected</span>
                <AlertTriangle className="h-4 w-4 text-red-400" />
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold text-red-400">{metrics.summary.rejected}</div>
              <p className="text-xs text-slate-400 mt-2">
                {((metrics.summary.rejected / metrics.summary.total) * 100).toFixed(1)}% rejection rate
              </p>
            </CardContent>
          </Card>

          {/* Average Quality */}
          <Card className="bg-gradient-to-br from-slate-800 to-slate-700 border-slate-600 hover:border-slate-500 transition-colors">
            <CardHeader className="pb-3">
              <CardTitle className="text-sm text-slate-400 flex items-center justify-between">
                <span>Avg Quality</span>
                <TrendingUp className="h-4 w-4 text-amber-400" />
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold text-amber-400">{metrics.summary.avg_quality.toFixed(1)}%</div>
              <p className="text-xs text-slate-400 mt-2">Quality score average</p>
            </CardContent>
          </Card>
        </div>

        {/* Status Breakdown and Risk Level */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Status Distribution */}
          <Card className="bg-slate-800/50 border-slate-700">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <PieChart className="h-5 w-5 text-blue-400" />
                Status Distribution
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              {/* Pending */}
              <div>
                <div className="flex items-center justify-between mb-2">
                  <div className="flex items-center gap-2">
                    <Badge className="bg-slate-600 text-slate-100">Pending</Badge>
                    <span className="text-sm text-slate-300">{metrics.by_status.pending}</span>
                  </div>
                  <span className="text-sm text-slate-400">{statusPercentage(metrics.by_status.pending)}%</span>
                </div>
                <Progress value={parseFloat(statusPercentage(metrics.by_status.pending))} className="h-2" />
              </div>

              {/* Production */}
              <div>
                <div className="flex items-center justify-between mb-2">
                  <div className="flex items-center gap-2">
                    <Badge className="bg-blue-600 text-white">Production</Badge>
                    <span className="text-sm text-slate-300">{metrics.by_status.production}</span>
                  </div>
                  <span className="text-sm text-slate-400">{statusPercentage(metrics.by_status.production)}%</span>
                </div>
                <Progress value={parseFloat(statusPercentage(metrics.by_status.production))} className="h-2" />
              </div>

              {/* Completed */}
              <div>
                <div className="flex items-center justify-between mb-2">
                  <div className="flex items-center gap-2">
                    <Badge className="bg-emerald-600 text-white">Completed</Badge>
                    <span className="text-sm text-slate-300">{metrics.by_status.completed}</span>
                  </div>
                  <span className="text-sm text-slate-400">{statusPercentage(metrics.by_status.completed)}%</span>
                </div>
                <Progress value={parseFloat(statusPercentage(metrics.by_status.completed))} className="h-2" />
              </div>

              {/* Rejected */}
              <div>
                <div className="flex items-center justify-between mb-2">
                  <div className="flex items-center gap-2">
                    <Badge className="bg-red-600 text-white">Rejected</Badge>
                    <span className="text-sm text-slate-300">{metrics.by_status.rejected}</span>
                  </div>
                  <span className="text-sm text-slate-400">{statusPercentage(metrics.by_status.rejected)}%</span>
                </div>
                <Progress value={parseFloat(statusPercentage(metrics.by_status.rejected))} className="h-2" />
              </div>
            </CardContent>
          </Card>

          {/* Risk Level Distribution */}
          <Card className="bg-slate-800/50 border-slate-700">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <AlertCircle className="h-5 w-5 text-amber-400" />
                Risk Distribution
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              {/* Low Risk */}
              <div>
                <div className="flex items-center justify-between mb-2">
                  <div className="flex items-center gap-2">
                    <Badge className="bg-emerald-600 text-white">Low Risk</Badge>
                    <span className="text-sm text-slate-300">{metrics.by_risk.low}</span>
                  </div>
                  <span className="text-sm text-slate-400">{riskPercentage(metrics.by_risk.low)}%</span>
                </div>
                <Progress value={parseFloat(riskPercentage(metrics.by_risk.low))} className="h-2" />
              </div>

              {/* Medium Risk */}
              <div>
                <div className="flex items-center justify-between mb-2">
                  <div className="flex items-center gap-2">
                    <Badge className="bg-amber-600 text-white">Medium Risk</Badge>
                    <span className="text-sm text-slate-300">{metrics.by_risk.medium}</span>
                  </div>
                  <span className="text-sm text-slate-400">{riskPercentage(metrics.by_risk.medium)}%</span>
                </div>
                <Progress value={parseFloat(riskPercentage(metrics.by_risk.medium))} className="h-2" />
              </div>

              {/* High Risk */}
              <div>
                <div className="flex items-center justify-between mb-2">
                  <div className="flex items-center gap-2">
                    <Badge className="bg-red-600 text-white">High Risk</Badge>
                    <span className="text-sm text-slate-300">{metrics.by_risk.high}</span>
                  </div>
                  <span className="text-sm text-slate-400">{riskPercentage(metrics.by_risk.high)}%</span>
                </div>
                <Progress value={parseFloat(riskPercentage(metrics.by_risk.high))} className="h-2" />
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Quality Distribution */}
        <Card className="bg-slate-800/50 border-slate-700">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <TrendingUp className="h-5 w-5 text-blue-400" />
              Quality Distribution
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
              {/* Excellent */}
              <div className="bg-gradient-to-br from-emerald-900/50 to-emerald-900/25 border border-emerald-700 rounded-lg p-4">
                <div className="text-sm text-emerald-400 font-semibold mb-1">Excellent</div>
                <div className="text-2xl font-bold text-emerald-400">{metrics.quality_distribution.excellent}</div>
                <div className="text-xs text-slate-400 mt-2">≥90 score</div>
                <Progress value={(metrics.quality_distribution.excellent / metrics.summary.total) * 100} className="h-1 mt-2" />
              </div>

              {/* Good */}
              <div className="bg-gradient-to-br from-blue-900/50 to-blue-900/25 border border-blue-700 rounded-lg p-4">
                <div className="text-sm text-blue-400 font-semibold mb-1">Good</div>
                <div className="text-2xl font-bold text-blue-400">{metrics.quality_distribution.good}</div>
                <div className="text-xs text-slate-400 mt-2">75-89 score</div>
                <Progress value={(metrics.quality_distribution.good / metrics.summary.total) * 100} className="h-1 mt-2" />
              </div>

              {/* Fair */}
              <div className="bg-gradient-to-br from-amber-900/50 to-amber-900/25 border border-amber-700 rounded-lg p-4">
                <div className="text-sm text-amber-400 font-semibold mb-1">Fair</div>
                <div className="text-2xl font-bold text-amber-400">{metrics.quality_distribution.fair}</div>
                <div className="text-xs text-slate-400 mt-2">60-74 score</div>
                <Progress value={(metrics.quality_distribution.fair / metrics.summary.total) * 100} className="h-1 mt-2" />
              </div>

              {/* Poor */}
              <div className="bg-gradient-to-br from-red-900/50 to-red-900/25 border border-red-700 rounded-lg p-4">
                <div className="text-sm text-red-400 font-semibold mb-1">Poor</div>
                <div className="text-2xl font-bold text-red-400">{metrics.quality_distribution.poor}</div>
                <div className="text-xs text-slate-400 mt-2">&lt;60 score</div>
                <Progress value={(metrics.quality_distribution.poor / metrics.summary.total) * 100} className="h-1 mt-2" />
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
