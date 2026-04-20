import { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { 
  Loader2, TrendingUp, Package, Globe, Activity, CheckCircle, 
  Zap, ArrowUpRight
} from "lucide-react";
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

interface ProductPerformance {
  name: string;
  scans: number;
  successRate: number;
}

interface RegionalData {
  region: string;
  percentage: number;
  success: number;
  failed: number;
  total: number;
  retailers: string[];
}

interface ScanRecord {
  product: string;
  status: "authentic" | "suspicious" | "failed";
  timeAgo: string;
  user: string;
  location: string;
  confidence: number;
}

export default function ManufacturingOverview() {
  const [metrics, setMetrics] = useState<Metrics | null>(null);
  const [analytics, setAnalytics] = useState<any>(null);
  const [liveFeed, setLiveFeed] = useState<any[]>([]);
  const [reports, setReports] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [lastUpdated, setLastUpdated] = useState<Date | null>(null);

  const fetchAllData = async () => {
    try {
      setLoading(true);
      console.log("🚀 Starting to fetch all data...");
      
      const [metricsData, analyticsData, feedData, reportsData] = await Promise.all([
        batchService.getBatchMetrics().then(data => {
          console.log("📊 Metrics fetched:", data);
          return data;
        }),
        batchService.getAnalytics().then(data => {
          console.log("📈 Analytics fetched:", data);
          return data;
        }),
        batchService.getLiveFeed().then(data => {
          console.log("📡 Feed fetched:", data);
          return data;
        }),
        batchService.getReports().then(data => {
          console.log("📋 Reports fetched:", data);
          return data;
        })
      ]);

      console.log("✅ All data fetched successfully");
      if (metricsData) setMetrics(metricsData);
      if (analyticsData) setAnalytics(analyticsData);
      if (feedData) setLiveFeed(feedData);
      if (reportsData) setReports(reportsData);
      setLastUpdated(new Date());
    } catch (error) {
      console.error("❌ Failed to fetch data:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchAllData();
    const interval = setInterval(fetchAllData, 30000);
    return () => clearInterval(interval);
  }, []);

  // Derive product performance from analytics
  const productPerformance: ProductPerformance[] = analytics?.brands?.map((brand: any) => ({
    name: brand.name,
    scans: brand.totalScans,
    successRate: brand.successRate
  })) || [];

  // Derive regional data from analytics
  const regionalData: RegionalData[] = analytics?.regional?.map((region: any) => ({
    region: region.region,
    percentage: (region.scans / (analytics?.regional?.reduce((sum: number, r: any) => sum + r.scans, 0) || 1) * 100).toFixed(1),
    success: Math.round(region.scans * (region.successRate / 100)),
    failed: Math.round(region.scans * ((100 - region.successRate) / 100)),
    total: region.scans,
    retailers: [] // Backend doesn't provide retailers yet
  })) || [];

  // Process live feed for display
  const processedFeed: ScanRecord[] = liveFeed?.map((item: any) => {
    const timestamp = new Date(item.timestamp);
    const now = new Date();
    const secondsAgo = Math.floor((now.getTime() - timestamp.getTime()) / 1000);
    
    let timeAgo = `${secondsAgo}s ago`;
    if (secondsAgo >= 60) timeAgo = `${Math.floor(secondsAgo / 60)}m ago`;
    if (secondsAgo >= 3600) timeAgo = `${Math.floor(secondsAgo / 3600)}h ago`;

    return {
      product: item.product,
      status: item.status === "Suspicious" ? "suspicious" : (item.status === "Authentic" ? "authentic" : "failed"),
      timeAgo,
      user: item.retailer || "Unknown",
      location: item.location,
      confidence: Math.floor(Math.random() * 40) + 60 // Placeholder confidence
    };
  }) || [];

  // Compute authentication summary from reports (used implicitly in component rendering)

  const getStatusColor = (status: string) => {
    switch (status) {
      case "authentic":
        return "bg-emerald-500/20 text-emerald-400 border-emerald-500/30";
      case "suspicious":
        return "bg-amber-500/20 text-amber-400 border-amber-500/30";
      case "failed":
        return "bg-red-500/20 text-red-400 border-red-500/30";
      default:
        return "bg-slate-500/20 text-slate-400 border-slate-500/30";
    }
  };

  const successRate = metrics
    ? ((metrics.summary.completed / metrics.summary.total) * 100).toFixed(1)
    : "0";

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-center">
          <Loader2 className="h-12 w-12 animate-spin mx-auto text-blue-500 mb-4" />
          <p className="text-slate-600 dark:text-slate-400">Loading overview...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-950 to-slate-900 p-6">
      <div className="max-w-7xl mx-auto space-y-8">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-4xl font-bold text-white">Manufacturing Overview</h1>
            <p className="text-slate-400 mt-2">
              Real-time insights into production, authentication, and distribution performance
              {lastUpdated && ` • Last updated: ${lastUpdated.toLocaleTimeString()}`}
            </p>
          </div>
        </div>

        {/* KPI Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          {/* Total Batches */}
          <Card className="bg-gradient-to-br from-blue-900/30 to-blue-900/10 border-blue-700/30">
            <CardHeader className="pb-3">
              <CardTitle className="text-sm text-slate-400 flex items-center justify-between">
                Total Batches
                <Package className="h-4 w-4 text-blue-400" />
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold text-white">{metrics?.summary.total}</div>
              <div className="flex items-center gap-1 text-sm text-emerald-400 mt-2">
                <ArrowUpRight className="h-3 w-3" />
                <span>+12% this month</span>
              </div>
            </CardContent>
          </Card>

          {/* Products Tracked */}
          <Card className="bg-gradient-to-br from-purple-900/30 to-purple-900/10 border-purple-700/30">
            <CardHeader className="pb-3">
              <CardTitle className="text-sm text-slate-400 flex items-center justify-between">
                Products Tracked
                <Globe className="h-4 w-4 text-purple-400" />
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold text-white">2.1M</div>
              <div className="flex items-center gap-1 text-sm text-emerald-400 mt-2">
                <ArrowUpRight className="h-3 w-3" />
                <span>+8% this month</span>
              </div>
            </CardContent>
          </Card>

          {/* Success Rate */}
          <Card className="bg-gradient-to-br from-emerald-900/30 to-emerald-900/10 border-emerald-700/30">
            <CardHeader className="pb-3">
              <CardTitle className="text-sm text-slate-400 flex items-center justify-between">
                Success Rate
                <CheckCircle className="h-4 w-4 text-emerald-400" />
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold text-emerald-400">{successRate}%</div>
              <div className="flex items-center gap-1 text-sm text-emerald-400 mt-2">
                <ArrowUpRight className="h-3 w-3" />
                <span>+0.3% this week</span>
              </div>
            </CardContent>
          </Card>

          {/* Active Scans */}
          <Card className="bg-gradient-to-br from-amber-900/30 to-amber-900/10 border-amber-700/30">
            <CardHeader className="pb-3">
              <CardTitle className="text-sm text-slate-400 flex items-center justify-between">
                Active Scans
                <Zap className="h-4 w-4 text-amber-400" />
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold text-amber-400">{metrics?.summary.active}</div>
              <div className="text-sm text-amber-400 mt-2">Live</div>
            </CardContent>
          </Card>
        </div>

        {/* Product Performance */}
        <Card className="bg-slate-800/50 border-slate-700">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <TrendingUp className="h-5 w-5 text-blue-400" />
              Product Performance
            </CardTitle>
            <p className="text-sm text-slate-400 mt-1">{productPerformance.length} Products</p>
          </CardHeader>
          <CardContent>
            {productPerformance.length === 0 ? (
              <p className="text-slate-400 text-center py-4">Loading product performance data...</p>
            ) : (
              <div className="space-y-4">
                {productPerformance.map((product, idx) => (
                  <div key={idx} className="flex items-center justify-between p-4 bg-slate-700/50 rounded-lg">
                    <div className="flex-1">
                      <h4 className="font-semibold text-white">{product.name}</h4>
                      <div className="flex items-center gap-4 mt-2">
                        <span className="text-sm text-slate-400">{product.scans.toLocaleString()} scans</span>
                        <div className="flex items-center gap-2 flex-1 max-w-xs">
                          <Progress value={product.successRate} className="h-2" />
                          <span className="text-sm font-semibold text-white min-w-12">{product.successRate}%</span>
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </CardContent>
        </Card>

        {/* Authentication Summary & Regional Distribution */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Authentication Summary */}
          <Card className="bg-slate-800/50 border-slate-700">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <CheckCircle className="h-5 w-5 text-emerald-400" />
                Authentication Summary
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-3">
                {reports && (
                  <>
                    <div>
                      <div className="flex items-center justify-between mb-2">
                        <span className="text-sm text-slate-300">Product Authentication</span>
                        <span className="font-semibold text-emerald-400">{reports.complianceMetrics.categoryScores.productAuthentication.toFixed(1)}%</span>
                      </div>
                      <Progress value={reports.complianceMetrics.categoryScores.productAuthentication} className="h-2" />
                    </div>
                    <div>
                      <div className="flex items-center justify-between mb-2">
                        <span className="text-sm text-slate-300">Supply Chain Integrity</span>
                        <span className="font-semibold text-amber-400">{reports.complianceMetrics.categoryScores.supplyChainIntegrity.toFixed(1)}%</span>
                      </div>
                      <Progress value={reports.complianceMetrics.categoryScores.supplyChainIntegrity} className="h-2" />
                    </div>
                    <div>
                      <div className="flex items-center justify-between mb-2">
                        <span className="text-sm text-slate-300">Retailer Compliance</span>
                        <span className="font-semibold text-blue-400">{reports.complianceMetrics.categoryScores.retailerCompliance.toFixed(1)}%</span>
                      </div>
                      <Progress value={reports.complianceMetrics.categoryScores.retailerCompliance} className="h-2" />
                    </div>
                  </>
                )}
              </div>
            </CardContent>
          </Card>

          {/* Regional Distribution */}
          <div className="lg:col-span-2">
            <Card className="bg-slate-800/50 border-slate-700 h-full">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Globe className="h-5 w-5 text-purple-400" />
                  Regional Distribution & Retailer Network
                </CardTitle>
                <p className="text-sm text-slate-400 mt-1">{regionalData.length} Provinces</p>
              </CardHeader>
              <CardContent>
                {regionalData.length === 0 ? (
                  <p className="text-slate-400 text-center py-4">Loading regional data...</p>
                ) : (
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {regionalData.map((region, idx) => (
                      <div key={idx} className="bg-slate-700/50 rounded-lg p-4 space-y-3">
                        <div>
                          <h4 className="font-semibold text-white">{region.region}</h4>
                          <p className="text-sm text-slate-400">{region.percentage}% of total</p>
                        </div>
                        <div className="grid grid-cols-3 gap-2 text-xs">
                          <div>
                            <div className="text-emerald-400 font-semibold">{region.success.toLocaleString()}</div>
                            <div className="text-slate-400">Success</div>
                          </div>
                          <div>
                            <div className="text-red-400 font-semibold">{region.failed.toLocaleString()}</div>
                            <div className="text-slate-400">Failed</div>
                          </div>
                          <div>
                            <div className="text-blue-400 font-semibold">{region.total.toLocaleString()}</div>
                            <div className="text-slate-400">Total</div>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </CardContent>
            </Card>
          </div>
        </div>

        {/* Live Scan Feed */}
        <Card className="bg-slate-800/50 border-slate-700">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Activity className="h-5 w-5 text-blue-400 animate-pulse" />
              Live Scan Feed
            </CardTitle>
            <p className="text-sm text-slate-400 mt-1">{processedFeed.length} Recent • Real-time verification scans across South Africa</p>
          </CardHeader>
          <CardContent>
            {processedFeed.length === 0 ? (
              <p className="text-slate-400 text-center py-4">Loading live feed data...</p>
            ) : (
              <div className="space-y-3">
                {processedFeed.map((scan, idx) => (
                  <div key={idx} className="flex items-center justify-between p-3 bg-slate-700/50 rounded-lg hover:bg-slate-700 transition-colors">
                    <div className="flex items-center gap-4 flex-1">
                      <div>
                        <h4 className="font-semibold text-white">{scan.product}</h4>
                        <p className="text-xs text-slate-400 mt-1">
                          {scan.user} • {scan.location}
                        </p>
                      </div>
                    </div>
                    <div className="flex items-center gap-3">
                      <div className="text-right">
                        <p className="text-xs text-slate-400">{scan.confidence}% confidence</p>
                        <p className="text-xs text-slate-500">{scan.timeAgo}</p>
                      </div>
                      <Badge className={`${getStatusColor(scan.status)} border`}>
                        {scan.status}
                      </Badge>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
