import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
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

const ManufacturerAnalytics = () => {
  const analytics = {
    overview: {
      totalBatches: 847,
      totalProducts: 2.1, // million
      successRate: 97.3,
      activeScans: 1205
    },
    products: [
      { name: "Jameson Irish Whiskey", scans: 4521, success: 98.2, color: "text-emerald-600" },
      { name: "Chivas Regal 12 Year", scans: 3247, success: 96.8, color: "text-emerald-600" },
      { name: "Absolut Vodka", scans: 2876, success: 97.9, color: "text-emerald-600" },
      { name: "Martell Cordon Bleu", scans: 1893, success: 95.4, color: "text-amber-600" }
    ],
    regions: [
      { 
        region: "Gauteng", 
        scans: 6234, 
        success: 4987, 
        failed: 1247, 
        percentage: 40.4,
        retailers: ["Pick n Pay", "Makro", "Checkers", "Tops @ Spar"]
      },
      { 
        region: "Western Cape", 
        scans: 4521, 
        success: 4234, 
        failed: 287, 
        percentage: 29.3,
        retailers: ["Woolworths", "Shoprite", "Pick n Pay", "Liquor City"]
      },
      { 
        region: "KwaZulu-Natal", 
        scans: 2876, 
        success: 2654, 
        failed: 222, 
        percentage: 18.6,
        retailers: ["Game", "Makro", "Ultra Liquors", "Norman Goodfellows"]
      },
      { 
        region: "Eastern Cape", 
        scans: 1801, 
        success: 1645, 
        failed: 156, 
        percentage: 11.7,
        retailers: ["Pick n Pay", "Shoprite", "Checkers", "Tops @ Spar"]
      }
    ],
    scanTypes: {
      authentic: { count: 14987, percentage: 97.1 },
      failed: { count: 287, percentage: 1.9 },
      unknown: { count: 158, percentage: 1.0 }
    }
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
          value={analytics.overview.totalBatches.toLocaleString()}
          icon={Package}
          trend="+12% this month"
          gradientFrom="from-blue-500"
          gradientTo="to-blue-600"
        />
        <KPICard
          title="Products Tracked"
          value={`${analytics.overview.totalProducts}M`}
          icon={Shield}
          trend="+8% this month"
          gradientFrom="from-emerald-500"
          gradientTo="to-emerald-600"
        />
        <KPICard
          title="Success Rate"
          value={`${analytics.overview.successRate}%`}
          icon={Target}
          trend="+0.3% this week"
          gradientFrom="from-amber-500"
          gradientTo="to-amber-600"
        />
        <KPICard
          title="Active Scans"
          value={analytics.overview.activeScans.toLocaleString()}
          icon={Activity}
          trend="Live"
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
                <Badge variant="outline" className="ml-auto">4 Products</Badge>
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-6">
              {analytics.products.map((product, index) => (
                <div key={index} className="group">
                  <div className="flex justify-between items-center mb-3">
                    <div className="font-semibold text-gray-900 dark:text-white">{product.name}</div>
                    <div className="flex items-center gap-3">
                      <span className="text-sm text-muted-foreground">
                        {product.scans.toLocaleString()} scans
                      </span>
                      <Badge 
                        variant="secondary" 
                        className={`${product.success >= 98 ? 'bg-emerald-100 text-emerald-700 border-emerald-200' : 
                                   product.success >= 96 ? 'bg-amber-100 text-amber-700 border-amber-200' : 
                                   'bg-red-100 text-red-700 border-red-200'}`}
                      >
                        {product.success}%
                      </Badge>
                    </div>
                  </div>
                  <Progress 
                    value={product.success} 
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
              
              {/* Authentic Scans */}
              <div className="p-4 bg-gradient-to-r from-emerald-50 to-emerald-50/50 dark:from-emerald-950/30 dark:to-emerald-950/10 rounded-xl border border-emerald-200/50 dark:border-emerald-800/30">
                <div className="flex items-center gap-3 mb-2">
                  <CheckCircle className="h-5 w-5 text-emerald-600" />
                  <span className="font-semibold text-emerald-900 dark:text-emerald-100">Authentic</span>
                </div>
                <div className="flex justify-between items-end">
                  <div className="text-2xl font-bold text-emerald-700 dark:text-emerald-300">
                    {analytics.scanTypes.authentic.count.toLocaleString()}
                  </div>
                  <div className="text-sm font-medium text-emerald-600">
                    {analytics.scanTypes.authentic.percentage}%
                  </div>
                </div>
              </div>

              {/* Failed Verification */}
              <div className="p-4 bg-gradient-to-r from-amber-50 to-amber-50/50 dark:from-amber-950/30 dark:to-amber-950/10 rounded-xl border border-amber-200/50 dark:border-amber-800/30">
                <div className="flex items-center gap-3 mb-2">
                  <AlertTriangle className="h-5 w-5 text-amber-600" />
                  <span className="font-semibold text-amber-900 dark:text-amber-100">Failed</span>
                </div>
                <div className="flex justify-between items-end">
                  <div className="text-2xl font-bold text-amber-700 dark:text-amber-300">
                    {analytics.scanTypes.failed.count}
                  </div>
                  <div className="text-sm font-medium text-amber-600">
                    {analytics.scanTypes.failed.percentage}%
                  </div>
                </div>
              </div>

              {/* Unknown/Error */}
              <div className="p-4 bg-gradient-to-r from-gray-50 to-gray-50/50 dark:from-gray-800/30 dark:to-gray-800/10 rounded-xl border border-gray-200/50 dark:border-gray-700/30">
                <div className="flex items-center gap-3 mb-2">
                  <XCircle className="h-5 w-5 text-gray-600" />
                  <span className="font-semibold text-gray-900 dark:text-gray-100">Unknown</span>
                </div>
                <div className="flex justify-between items-end">
                  <div className="text-2xl font-bold text-gray-700 dark:text-gray-300">
                    {analytics.scanTypes.unknown.count}
                  </div>
                  <div className="text-sm font-medium text-gray-600">
                    {analytics.scanTypes.unknown.percentage}%
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
            <Badge variant="outline" className="ml-auto">{analytics.regions.length} Provinces</Badge>
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid md:grid-cols-2 gap-8">
            {analytics.regions.map((region, index) => (
              <div key={index} className="space-y-4 p-6 bg-gradient-to-br from-gray-50 to-white dark:from-gray-800/50 dark:to-gray-900/50 rounded-xl border border-gray-200/50 dark:border-gray-700/50">
                
                {/* Region Header */}
                <div className="flex items-center justify-between mb-4">
                  <h4 className="text-lg font-semibold text-gray-900 dark:text-white">{region.region}</h4>
                  <Badge variant="outline" className="bg-white dark:bg-gray-800">
                    {region.percentage}% of total
                  </Badge>
                </div>
                
                {/* Stats Grid */}
                <div className="grid grid-cols-3 gap-3">
                  <div className="text-center p-3 bg-emerald-50 dark:bg-emerald-950/30 rounded-lg border border-emerald-200/50 dark:border-emerald-800/30">
                    <div className="text-xl font-bold text-emerald-700 dark:text-emerald-300">
                      {region.success.toLocaleString()}
                    </div>
                    <div className="text-xs font-medium text-emerald-600 uppercase tracking-wide">
                      Success
                    </div>
                  </div>
                  
                  <div className="text-center p-3 bg-red-50 dark:bg-red-950/30 rounded-lg border border-red-200/50 dark:border-red-800/30">
                    <div className="text-xl font-bold text-red-700 dark:text-red-300">
                      {region.failed}
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

                {/* Retailers */}
                <div className="pt-2">
                  <p className="text-sm font-medium text-gray-700 dark:text-gray-300 mb-3">Key Retailers</p>
                  <div className="flex flex-wrap gap-2">
                    {region.retailers.map((retailer, idx) => (
                      <Badge 
                        key={idx} 
                        variant="secondary" 
                        className="text-xs bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors"
                      >
                        {retailer}
                      </Badge>
                    ))}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default ManufacturerAnalytics;