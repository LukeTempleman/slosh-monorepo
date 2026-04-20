import { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { Loader2 } from "lucide-react";
import { 
  BarChart3, 
  TrendingUp, 
  MapPin, 
  Shield, 
  Users, 
  Package,
  CheckCircle,
  AlertTriangle,
  XCircle,
  Activity,
  Target
} from "lucide-react";
import { batchService } from "@/services/batchService";

const ManufacturerAnalytics = () => {
  const [metrics, setMetrics] = useState<any>(null);
  const [analytics, setAnalytics] = useState<any>(null);
  const [reports, setReports] = useState<any>(null);
  const [liveFeed, setLiveFeed] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchData();
    const interval = setInterval(fetchData, 30000);
    return () => clearInterval(interval);
  }, []);

  const fetchData = async () => {
    try {
      setLoading(true);
      const [metricsData, analyticsData, reportsData, feedData] = await Promise.all([
        batchService.getBatchMetrics(),
        batchService.getAnalytics(),
        batchService.getReports(),
        batchService.getLiveFeed()
      ]);

      if (metricsData) setMetrics(metricsData);
      if (analyticsData) setAnalytics(analyticsData);
      if (reportsData) setReports(reportsData);
      if (feedData) setLiveFeed(feedData);
    } catch (error) {
      console.error("Failed to fetch dashboard data:", error);
    } finally {
      setLoading(false);
    }
  };

  if (loading || !metrics || !analytics || !reports) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-center">
          <Loader2 className="h-12 w-12 animate-spin mx-auto text-blue-500 mb-4" />
          <p className="text-slate-600 dark:text-slate-400">Loading dashboard...</p>
        </div>
      </div>
    );
  }

  const dashboardData = {
    overview: {
      totalBatches: metrics.summary.total,
      activeScans: metrics.summary.active,
      completedBatches: metrics.summary.completed,
      successRate: ((metrics.summary.completed / metrics.summary.total) * 100).toFixed(1),
      avgQuality: metrics.summary.avg_quality
    },
    products: analytics?.brands || [],
    regions: analytics?.regional?.map((region: any) => ({
      region: region.region,
      scans: region.scans,
      successRate: region.successRate,
      activeRetailers: region.activeRetailers
    })) || [],
    scanTypes: {
      authentic: { 
        count: Math.round(metrics.summary.completed), 
        percentage: ((metrics.summary.completed / metrics.summary.total) * 100).toFixed(1)
      },
      failed: { 
        count: metrics.summary.rejected, 
        percentage: ((metrics.summary.rejected / metrics.summary.total) * 100).toFixed(1)
      },
      unknown: { 
        count: metrics.summary.active, 
        percentage: ((metrics.summary.active / metrics.summary.total) * 100).toFixed(1)
      }
    }
  };

  const getStatusColor = (status: string) => {
    const lowerStatus = status.toLowerCase();
    switch (lowerStatus) {
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

  const getTimeAgo = (timestamp: string): string => {
    const now = new Date();
    const time = new Date(timestamp);
    const secondsAgo = Math.floor((now.getTime() - time.getTime()) / 1000);
    
    if (secondsAgo < 60) return `${secondsAgo}s ago`;
    if (secondsAgo < 3600) return `${Math.floor(secondsAgo / 60)}m ago`;
    if (secondsAgo < 86400) return `${Math.floor(secondsAgo / 3600)}h ago`;
    return `${Math.floor(secondsAgo / 86400)}d ago`;
  };

  interface KPICardProps {
    title: string;
    value: string;
    subtitle?: string;
    icon: React.ComponentType<{ className?: string }>;
    trend?: string;
    gradientFrom: string;
    gradientTo: string;
  }

  const KPICard = ({ title, value, subtitle, icon: Icon, trend, gradientFrom, gradientTo }: KPICardProps) => (
    <Card className="relative overflow-hidden bg-gradient-to-br from-white to-gray-50/50 dark:from-gray-900 dark:to-gray-800/50 border-0 shadow-sm hover:shadow-md transition-all duration-200">
      <div className={`absolute top-0 left-0 w-full h-1 bg-gradient-to-r ${gradientFrom} ${gradientTo}`}></div>
      <CardContent className="p-6">
        <div className="flex items-start justify-between">
          <div className="space-y-1">
            <p className="text-sm font-medium text-muted-foreground">{title}</p>
            <div className="text-3xl font-bold text-gray-900 dark:text-white">{value}</div>
            {subtitle && (
              <p className="text-sm text-muted-foreground">{subtitle}</p>
            )}
          </div>
          <div className="flex flex-col items-end gap-3">
            <div className={`p-3 rounded-xl bg-gradient-to-br ${gradientFrom} ${gradientTo} shadow-sm`}>
              <Icon className="h-6 w-6 text-white" />
            </div>
            {trend && (
              <Badge variant="secondary" className="text-xs bg-gray-100 dark:bg-gray-800 text-gray-700 dark:text-gray-300 border-0">
                {trend}
              </Badge>
            )}
          </div>
        </div>
      </CardContent>
    </Card>
  );

  return (
    <div className="space-y-8">
      {/* Header Section */}
      <div className="mb-8">
        <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-2">Manufacturing Overview</h2>
        <p className="text-muted-foreground">Real-time insights into production, authentication, and distribution performance</p>
      </div>

      {/* KPI Overview */}
      <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-6">
        <KPICard
          title="Total Batches"
          value={dashboardData.overview.totalBatches.toLocaleString()}
          icon={Package}
          trend="+12% this month"
          gradientFrom="from-blue-500"
          gradientTo="to-blue-600"
        />
        <KPICard
          title="Active Batches"
          value={dashboardData.overview.activeScans.toLocaleString()}
          icon={Activity}
          trend="In progress"
          gradientFrom="from-emerald-500"
          gradientTo="to-emerald-600"
        />
        <KPICard
          title="Success Rate"
          value={`${dashboardData.overview.successRate}%`}
          icon={Target}
          trend="+0.3% this week"
          gradientFrom="from-amber-500"
          gradientTo="to-amber-600"
        />
        <KPICard
          title="Avg Quality Score"
          value={`${dashboardData.overview.avgQuality.toFixed(1)}%`}
          icon={Shield}
          trend="Very Good"
          gradientFrom="from-purple-500"
          gradientTo="to-purple-600"
        />
      </div>

      {/* Main Content Grid */}
      <div className="grid lg:grid-cols-3 gap-8">
        
        {/* Product Performance - Spans 2 columns */}
        <div className="lg:col-span-2">
          <Card className="h-full border-0 shadow-sm bg-white dark:bg-gray-900">
            <CardHeader className="pb-4">
              <CardTitle className="flex items-center gap-3 text-lg font-semibold">
                <div className="p-2 bg-gradient-to-br from-blue-500 to-blue-600 rounded-lg">
                  <BarChart3 className="h-5 w-5 text-white" />
                </div>
                Product Performance
                <Badge variant="outline" className="ml-auto">{dashboardData.products.length} Products</Badge>
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-6">
              {dashboardData.products.map((product, index) => (
                <div key={index} className="group">
                  <div className="flex justify-between items-center mb-3">
                    <div className="font-semibold text-gray-900 dark:text-white">{product.name}</div>
                    <div className="flex items-center gap-3">
                      <span className="text-sm text-muted-foreground">
                        {product.totalScans?.toLocaleString()} scans
                      </span>
                      <Badge 
                        variant="secondary" 
                        className={`${product.successRate >= 98 ? 'bg-emerald-100 text-emerald-700 border-emerald-200' : 
                                   product.successRate >= 96 ? 'bg-amber-100 text-amber-700 border-amber-200' : 
                                   'bg-red-100 text-red-700 border-red-200'}`}
                      >
                        {product.successRate}%
                      </Badge>
                    </div>
                  </div>
                  <Progress 
                    value={product.successRate} 
                    className="h-2 bg-gray-100 dark:bg-gray-800"
                  />
                </div>
              ))}
            </CardContent>
          </Card>
        </div>

        {/* Scan Results Summary */}
        <div className="lg:col-span-1">
          <Card className="h-full border-0 shadow-sm bg-white dark:bg-gray-900">
            <CardHeader className="pb-4">
              <CardTitle className="flex items-center gap-3 text-lg font-semibold">
                <div className="p-2 bg-gradient-to-br from-emerald-500 to-emerald-600 rounded-lg">
                  <Shield className="h-5 w-5 text-white" />
                </div>
                Authentication Summary
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              
              {/* Authenticated Batches */}
              <div className="p-4 bg-gradient-to-r from-emerald-50 to-emerald-50/50 dark:from-emerald-950/30 dark:to-emerald-950/10 rounded-xl border border-emerald-200/50 dark:border-emerald-800/30">
                <div className="flex items-center gap-3 mb-2">
                  <CheckCircle className="h-5 w-5 text-emerald-600" />
                  <span className="font-semibold text-emerald-900 dark:text-emerald-100">Completed</span>
                </div>
                <div className="flex justify-between items-end">
                  <div className="text-2xl font-bold text-emerald-700 dark:text-emerald-300">
                    {dashboardData.scanTypes.authentic.count.toLocaleString()}
                  </div>
                  <div className="text-sm font-medium text-emerald-600">
                    {dashboardData.scanTypes.authentic.percentage}%
                  </div>
                </div>
              </div>

              {/* Rejected Batches */}
              <div className="p-4 bg-gradient-to-r from-amber-50 to-amber-50/50 dark:from-amber-950/30 dark:to-amber-950/10 rounded-xl border border-amber-200/50 dark:border-amber-800/30">
                <div className="flex items-center gap-3 mb-2">
                  <AlertTriangle className="h-5 w-5 text-amber-600" />
                  <span className="font-semibold text-amber-900 dark:text-amber-100">Rejected</span>
                </div>
                <div className="flex justify-between items-end">
                  <div className="text-2xl font-bold text-amber-700 dark:text-amber-300">
                    {dashboardData.scanTypes.failed.count}
                  </div>
                  <div className="text-sm font-medium text-amber-600">
                    {dashboardData.scanTypes.failed.percentage}%
                  </div>
                </div>
              </div>

              {/* Active Batches */}
              <div className="p-4 bg-gradient-to-r from-gray-50 to-gray-50/50 dark:from-gray-800/30 dark:to-gray-800/10 rounded-xl border border-gray-200/50 dark:border-gray-700/30">
                <div className="flex items-center gap-3 mb-2">
                  <Activity className="h-5 w-5 text-gray-600" />
                  <span className="font-semibold text-gray-900 dark:text-gray-100">Active</span>
                </div>
                <div className="flex justify-between items-end">
                  <div className="text-2xl font-bold text-gray-700 dark:text-gray-300">
                    {dashboardData.scanTypes.unknown.count.toLocaleString()}
                  </div>
                  <div className="text-sm font-medium text-gray-600">
                    {dashboardData.scanTypes.unknown.percentage}%
                  </div>
                </div>
              </div>

            </CardContent>
          </Card>
        </div>
      </div>

      {/* Regional Distribution */}
      <Card className="border-0 shadow-sm bg-white dark:bg-gray-900">
        <CardHeader className="pb-6">
          <CardTitle className="flex items-center gap-3 text-lg font-semibold">
            <div className="p-2 bg-gradient-to-br from-purple-500 to-purple-600 rounded-lg">
              <MapPin className="h-5 w-5 text-white" />
            </div>
            Regional Distribution & Retailer Network
            <Badge variant="outline" className="ml-auto">{dashboardData.regions.length} Regions</Badge>
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid md:grid-cols-2 gap-8">
            {dashboardData.regions.map((region, index) => {
              const successCount = Math.round(region.scans * (region.successRate / 100));
              const failedCount = region.scans - successCount;
              return (
              <div key={index} className="space-y-4 p-6 bg-gradient-to-br from-gray-50 to-white dark:from-gray-800/50 dark:to-gray-900/50 rounded-xl border border-gray-200/50 dark:border-gray-700/50">
                
                {/* Region Header */}
                <div className="flex items-center justify-between mb-4">
                  <h4 className="text-lg font-semibold text-gray-900 dark:text-white">{region.region}</h4>
                  <Badge variant="outline" className="bg-white dark:bg-gray-800">
                    {region.successRate}% success
                  </Badge>
                </div>
                
                {/* Stats Grid */}
                <div className="grid grid-cols-3 gap-3">
                  <div className="text-center p-3 bg-emerald-50 dark:bg-emerald-950/30 rounded-lg border border-emerald-200/50 dark:border-emerald-800/30">
                    <div className="text-xl font-bold text-emerald-700 dark:text-emerald-300">
                      {successCount.toLocaleString()}
                    </div>
                    <div className="text-xs font-medium text-emerald-600 uppercase tracking-wide">
                      Success
                    </div>
                  </div>
                  
                  <div className="text-center p-3 bg-red-50 dark:bg-red-950/30 rounded-lg border border-red-200/50 dark:border-red-800/30">
                    <div className="text-xl font-bold text-red-700 dark:text-red-300">
                      {failedCount.toLocaleString()}
                    </div>
                    <div className="text-xs font-medium text-red-600 uppercase tracking-wide">
                      Failed
                    </div>
                  </div>
                  
                  <div className="text-center p-3 bg-gray-50 dark:bg-gray-800/50 rounded-lg border border-gray-200/50 dark:border-gray-700/30">
                    <div className="text-xl font-bold text-gray-700 dark:text-gray-300">
                      {region.scans.toLocaleString()}
                    </div>
                    <div className="text-xs font-medium text-gray-600 uppercase tracking-wide">
                      Total
                    </div>
                  </div>
                </div>

                {/* Total Scans */}
                <div>
                  <p className="text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">Total Scans</p>
                  <div className="text-lg font-bold text-gray-900 dark:text-white">
                    {region.scans.toLocaleString()}
                  </div>
                </div>
              </div>
            );
            })}
          </div>
        </CardContent>
      </Card>

      {/* Live Scan Feed */}
      <Card className="border-0 shadow-sm bg-white dark:bg-gray-900">
        <CardHeader className="pb-4">
          <CardTitle className="flex items-center gap-3 text-lg font-semibold">
            <div className="p-2 bg-gradient-to-br from-blue-500 to-blue-600 rounded-lg">
              <Activity className="h-5 w-5 text-white animate-pulse" />
            </div>
            Live Scan Feed
            <Badge variant="outline" className="ml-auto">{liveFeed.length} Recent</Badge>
          </CardTitle>
          <p className="text-sm text-muted-foreground mt-2">Real-time verification scans</p>
        </CardHeader>
        <CardContent>
          {liveFeed.length === 0 ? (
            <div className="text-center py-8 text-muted-foreground">
              <Activity className="h-8 w-8 mx-auto mb-2 opacity-50" />
              <p>No recent scans</p>
            </div>
          ) : (
            <div className="space-y-3">
              {liveFeed.map((item, idx) => (
                <div key={idx} className="flex items-center justify-between p-4 bg-gradient-to-r from-gray-50 to-white dark:from-gray-800/50 dark:to-gray-900/50 rounded-lg border border-gray-200/50 dark:border-gray-700/50 hover:bg-gray-100 dark:hover:bg-gray-800/70 transition-colors">
                  <div className="flex-1">
                    <h4 className="font-semibold text-gray-900 dark:text-white">{item.product}</h4>
                    <p className="text-xs text-muted-foreground mt-1">
                      {item.retailer} • {item.location}
                    </p>
                  </div>
                  <div className="flex items-center gap-3 ml-4">
                    <div className="text-right">
                      <p className="text-xs text-muted-foreground">{getTimeAgo(item.timestamp)}</p>
                    </div>
                    <Badge className={`${getStatusColor(item.status)} border`}>
                      {item.status === "Authentic" ? "✓" : item.status === "Suspicious" ? "⚠" : "✕"} {item.status}
                    </Badge>
                  </div>
                </div>
              ))}
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
};

export default ManufacturerAnalytics;