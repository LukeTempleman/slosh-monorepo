import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Progress } from "@/components/ui/progress";
import AIDataChatBot from "@/components/AIDataChatBot";
import { 
  BarChart, 
  LineChart, 
  Download, 
  Calendar,
  TrendingUp, 
  TrendingDown,
  Shield,
  Globe,
  Package,
  AlertTriangle,
  CheckCircle2,
  DollarSign,
  Users,
  MapPin,
  Filter,
  FileText,
  PieChart,
  Activity,
  Bot
} from "lucide-react";

const ReportsAnalytics = () => {
  const [dateRange, setDateRange] = useState("30d");
  const [reportType, setReportType] = useState("overview");

  // Mock KPI data
  const kpiData = {
    totalProducts: { value: 847200, change: 12.5, trend: "up" },
    authenticatedScans: { value: 324568, change: 8.2, trend: "up" },
    counterfeitDetected: { value: 1247, change: -15.3, trend: "down" },
    globalReach: { value: 9, change: 4.1, trend: "up" },
    revenueProtected: { value: 428000000, change: 18.7, trend: "up" },
    complianceScore: { value: 97.8, change: 2.1, trend: "up" }
  };

  // Mock regional data - South African provinces
  const regionalData = [
    { region: "Gauteng", products: 235000, authentications: 89500, counterfeits: 234, compliance: 98.2 },
    { region: "Western Cape", products: 198000, authentications: 78200, counterfeits: 189, compliance: 97.9 },
    { region: "KwaZulu-Natal", products: 156000, authentications: 62400, counterfeits: 145, compliance: 96.8 },
    { region: "Eastern Cape", products: 87500, authentications: 28900, counterfeits: 98, compliance: 97.5 },
    { region: "Mpumalanga", products: 45600, authentications: 18240, counterfeits: 67, compliance: 98.1 },
    { region: "Limpopo", products: 34200, authentications: 13680, counterfeits: 45, compliance: 97.8 },
    { region: "North West", products: 28700, authentications: 11480, counterfeits: 34, compliance: 98.3 },
    { region: "Free State", products: 23400, authentications: 9360, counterfeits: 28, compliance: 97.6 },
    { region: "Northern Cape", products: 14700, authentications: 5880, counterfeits: 18, compliance: 98.8 }
  ];

  // Mock product performance data
  const productPerformance = [
    { product: "Jameson Irish Whiskey", category: "Whiskey", totalUnits: 125000, scans: 48200, counterfeit: 89, riskLevel: "Low" },
    { product: "Chivas Regal 12 Year", category: "Whiskey", totalUnits: 98000, scans: 39100, counterfeit: 145, riskLevel: "Medium" },
    { product: "Absolut Vodka", category: "Vodka", totalUnits: 156000, scans: 62400, counterfeit: 234, riskLevel: "Medium" },
    { product: "Martell Cordon Bleu", category: "Cognac", totalUnits: 45000, scans: 18900, counterfeit: 67, riskLevel: "Low" },
    { product: "Ballantine's 17 Year", category: "Whiskey", totalUnits: 23000, scans: 9200, counterfeit: 123, riskLevel: "High" }
  ];

  // Mock compliance alerts
  const complianceAlerts = [
    { id: 1, type: "Critical", message: "High counterfeit activity detected in Southeast Asia region", timestamp: "2024-01-15 14:30", status: "Active" },
    { id: 2, type: "Warning", message: "Authentication server response time above threshold", timestamp: "2024-01-15 12:15", status: "Resolved" },
    { id: 3, type: "Info", message: "New regulatory requirements in EU market effective Feb 1st", timestamp: "2024-01-14 16:45", status: "Pending" },
    { id: 4, type: "Critical", message: "Unusual scanning pattern detected for Batch JW-2024-001", timestamp: "2024-01-14 09:22", status: "Investigating" }
  ];

  const formatNumber = (num: number) => {
    if (num >= 1000000) return `${(num / 1000000).toFixed(1)}M`;
    if (num >= 1000) return `${(num / 1000).toFixed(1)}K`;
    return num.toString();
  };

  const formatCurrency = (num: number) => {
    return new Intl.NumberFormat('en-ZA', {
      style: 'currency',
      currency: 'ZAR',
      notation: 'compact',
      maximumFractionDigits: 1
    }).format(num);
  };

  const getRiskBadge = (level: string) => {
    switch (level) {
      case "Low": return <Badge className="bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200">Low Risk</Badge>;
      case "Medium": return <Badge className="bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-200">Medium Risk</Badge>;
      case "High": return <Badge className="bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200">High Risk</Badge>;
      default: return null;
    }
  };

  const getAlertBadge = (type: string) => {
    switch (type) {
      case "Critical": return <Badge variant="destructive">Critical</Badge>;
      case "Warning": return <Badge className="bg-yellow-500 text-white">Warning</Badge>;
      case "Info": return <Badge variant="secondary">Info</Badge>;
      default: return null;
    }
  };

  return (
    <div className="space-y-6">
      {/* Header Controls */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold text-heading">Analytics & Reports</h2>
          <p className="text-muted-foreground">Comprehensive insights into product authenticity and market performance</p>
        </div>
        <div className="flex gap-3">
          <Select value={dateRange} onValueChange={setDateRange}>
            <SelectTrigger className="w-32">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="7d">Last 7 days</SelectItem>
              <SelectItem value="30d">Last 30 days</SelectItem>
              <SelectItem value="90d">Last 90 days</SelectItem>
              <SelectItem value="1y">Last year</SelectItem>
            </SelectContent>
          </Select>
          <Button variant="outline">
            <Filter className="h-4 w-4 mr-2" />
            Filters
          </Button>
          <Button className="gradient-primary">
            <Download className="h-4 w-4 mr-2" />
            Export Report
          </Button>
        </div>
      </div>

      {/* KPI Overview */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        <Card className="card-professional">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">Total Products Protected</p>
                <p className="text-2xl font-bold text-heading">{formatNumber(kpiData.totalProducts.value)}</p>
              </div>
              <div className="p-3 bg-blue-100 dark:bg-blue-900 rounded-full">
                <Package className="h-6 w-6 text-blue-600 dark:text-blue-300" />
              </div>
            </div>
            <div className="flex items-center gap-1 mt-2">
              {kpiData.totalProducts.trend === "up" ? (
                <TrendingUp className="h-4 w-4 text-green-500" />
              ) : (
                <TrendingDown className="h-4 w-4 text-red-500" />
              )}
              <span className={`text-sm ${kpiData.totalProducts.trend === "up" ? "text-green-500" : "text-red-500"}`}>
                {kpiData.totalProducts.change > 0 ? "+" : ""}{kpiData.totalProducts.change}%
              </span>
              <span className="text-sm text-muted-foreground">vs last period</span>
            </div>
          </CardContent>
        </Card>

        <Card className="card-professional">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">Authentications</p>
                <p className="text-2xl font-bold text-heading">{formatNumber(kpiData.authenticatedScans.value)}</p>
              </div>
              <div className="p-3 bg-green-100 dark:bg-green-900 rounded-full">
                <CheckCircle2 className="h-6 w-6 text-green-600 dark:text-green-300" />
              </div>
            </div>
            <div className="flex items-center gap-1 mt-2">
              <TrendingUp className="h-4 w-4 text-green-500" />
              <span className="text-sm text-green-500">+{kpiData.authenticatedScans.change}%</span>
              <span className="text-sm text-muted-foreground">vs last period</span>
            </div>
          </CardContent>
        </Card>

        <Card className="card-professional">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">Counterfeits Detected</p>
                <p className="text-2xl font-bold text-heading">{formatNumber(kpiData.counterfeitDetected.value)}</p>
              </div>
              <div className="p-3 bg-red-100 dark:bg-red-900 rounded-full">
                <AlertTriangle className="h-6 w-6 text-red-600 dark:text-red-300" />
              </div>
            </div>
            <div className="flex items-center gap-1 mt-2">
              <TrendingDown className="h-4 w-4 text-green-500" />
              <span className="text-sm text-green-500">{kpiData.counterfeitDetected.change}%</span>
              <span className="text-sm text-muted-foreground">reduction</span>
            </div>
          </CardContent>
        </Card>

        <Card className="card-professional">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">SA Provinces</p>
                <p className="text-2xl font-bold text-heading">{kpiData.globalReach.value}</p>
              </div>
              <div className="p-3 bg-purple-100 dark:bg-purple-900 rounded-full">
                <Globe className="h-6 w-6 text-purple-600 dark:text-purple-300" />
              </div>
            </div>
            <div className="flex items-center gap-1 mt-2">
              <TrendingUp className="h-4 w-4 text-green-500" />
              <span className="text-sm text-green-500">+{kpiData.globalReach.change}%</span>
              <span className="text-sm text-muted-foreground">new markets</span>
            </div>
          </CardContent>
        </Card>

        <Card className="card-professional">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">Revenue Protected</p>
                <p className="text-2xl font-bold text-heading">{formatCurrency(kpiData.revenueProtected.value)}</p>
              </div>
              <div className="p-3 bg-yellow-100 dark:bg-yellow-900 rounded-full">
                <DollarSign className="h-6 w-6 text-yellow-600 dark:text-yellow-300" />
              </div>
            </div>
            <div className="flex items-center gap-1 mt-2">
              <TrendingUp className="h-4 w-4 text-green-500" />
              <span className="text-sm text-green-500">+{kpiData.revenueProtected.change}%</span>
              <span className="text-sm text-muted-foreground">vs last period</span>
            </div>
          </CardContent>
        </Card>

        <Card className="card-professional">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">Compliance Score</p>
                <p className="text-2xl font-bold text-heading">{kpiData.complianceScore.value}%</p>
              </div>
              <div className="p-3 bg-indigo-100 dark:bg-indigo-900 rounded-full">
                <Shield className="h-6 w-6 text-indigo-600 dark:text-indigo-300" />
              </div>
            </div>
            <div className="flex items-center gap-1 mt-2">
              <Progress value={kpiData.complianceScore.value} className="flex-1 h-2" />
              <span className="text-sm text-muted-foreground ml-2">Excellent</span>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Detailed Analytics */}
      <Tabs defaultValue="regional" className="space-y-6">
        <TabsList className="grid w-full grid-cols-5">
          <TabsTrigger value="regional">Regional Analysis</TabsTrigger>
          <TabsTrigger value="products">Product Performance</TabsTrigger>
          <TabsTrigger value="compliance">Compliance & Alerts</TabsTrigger>
          <TabsTrigger value="trends">Market Trends</TabsTrigger>
          <TabsTrigger value="ai-chat" className="gap-2">
            <Bot className="h-4 w-4" />
            AI Assistant
          </TabsTrigger>
        </TabsList>

        <TabsContent value="regional" className="space-y-6">
          <Card className="card-professional">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <MapPin className="h-5 w-5" />
                Regional Performance Overview
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="overflow-x-auto">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Region</TableHead>
                      <TableHead>Products Protected</TableHead>
                      <TableHead>Authentications</TableHead>
                      <TableHead>Counterfeits Detected</TableHead>
                      <TableHead>Compliance Rate</TableHead>
                      <TableHead>Market Penetration</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {regionalData.map((region) => (
                      <TableRow key={region.region}>
                        <TableCell className="font-medium">{region.region}</TableCell>
                        <TableCell>{formatNumber(region.products)}</TableCell>
                        <TableCell>{formatNumber(region.authentications)}</TableCell>
                        <TableCell>
                          <div className="flex items-center gap-2">
                            <span>{region.counterfeits}</span>
                            <Badge variant={region.counterfeits > 300 ? "destructive" : region.counterfeits > 200 ? "secondary" : "outline"}>
                              {region.counterfeits > 300 ? "High" : region.counterfeits > 200 ? "Medium" : "Low"}
                            </Badge>
                          </div>
                        </TableCell>
                        <TableCell>
                          <div className="flex items-center gap-2">
                            <Progress value={region.compliance} className="flex-1 h-2" />
                            <span className="text-sm font-medium">{region.compliance}%</span>
                          </div>
                        </TableCell>
                        <TableCell>
                          <div className="w-20 h-2 bg-muted rounded-full">
                            <div 
                              className="h-full bg-primary rounded-full" 
                              style={{ width: `${(region.authentications / region.products) * 100}%` }}
                            />
                          </div>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="products" className="space-y-6">
          <Card className="card-professional">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <BarChart className="h-5 w-5" />
                Product Line Performance
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="overflow-x-auto">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Product</TableHead>
                      <TableHead>Category</TableHead>
                      <TableHead>Total Units</TableHead>
                      <TableHead>Scans Performed</TableHead>
                      <TableHead>Counterfeits</TableHead>
                      <TableHead>Risk Level</TableHead>
                      <TableHead>Authentication Rate</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {productPerformance.map((product) => (
                      <TableRow key={product.product}>
                        <TableCell>
                          <div>
                            <div className="font-medium">{product.product}</div>
                            <div className="text-sm text-muted-foreground">{product.category}</div>
                          </div>
                        </TableCell>
                        <TableCell>
                          <Badge variant="outline">{product.category}</Badge>
                        </TableCell>
                        <TableCell className="font-semibold">{formatNumber(product.totalUnits)}</TableCell>
                        <TableCell>{formatNumber(product.scans)}</TableCell>
                        <TableCell>
                          <span className={product.counterfeit > 150 ? "text-red-500 font-medium" : "text-foreground"}>
                            {product.counterfeit}
                          </span>
                        </TableCell>
                        <TableCell>{getRiskBadge(product.riskLevel)}</TableCell>
                        <TableCell>
                          <div className="flex items-center gap-2">
                            <Progress 
                              value={(product.scans / product.totalUnits) * 100} 
                              className="flex-1 h-2" 
                            />
                            <span className="text-sm">
                              {((product.scans / product.totalUnits) * 100).toFixed(1)}%
                            </span>
                          </div>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="compliance" className="space-y-6">
          <Card className="card-professional">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <AlertTriangle className="h-5 w-5" />
                Compliance Alerts & Monitoring
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {complianceAlerts.map((alert) => (
                  <div key={alert.id} className="p-4 border border-border rounded-lg">
                    <div className="flex items-start justify-between">
                      <div className="flex items-start gap-3">
                        <div className="mt-1">
                          {getAlertBadge(alert.type)}
                        </div>
                        <div className="flex-1">
                          <p className="font-medium text-foreground">{alert.message}</p>
                          <div className="flex items-center gap-4 mt-2 text-sm text-muted-foreground">
                            <span className="flex items-center gap-1">
                              <Calendar className="h-3 w-3" />
                              {alert.timestamp}
                            </span>
                            <Badge variant={alert.status === "Active" ? "destructive" : alert.status === "Resolved" ? "default" : "secondary"}>
                              {alert.status}
                            </Badge>
                          </div>
                        </div>
                      </div>
                      <Button variant="outline" size="sm">
                        View Details
                      </Button>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="trends" className="space-y-6">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <Card className="card-professional">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <LineChart className="h-5 w-5" />
                  Authentication Trends
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="h-64 flex items-center justify-center bg-muted/20 rounded-lg">
                  <div className="text-center">
                    <Activity className="h-12 w-12 mx-auto mb-2 text-muted-foreground" />
                    <p className="text-muted-foreground">Interactive chart visualization</p>
                    <p className="text-sm text-muted-foreground">Authentication trends over time</p>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card className="card-professional">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <PieChart className="h-5 w-5" />
                  Market Distribution
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="h-64 flex items-center justify-center bg-muted/20 rounded-lg">
                  <div className="text-center">
                    <Globe className="h-12 w-12 mx-auto mb-2 text-muted-foreground" />
                    <p className="text-muted-foreground">Market share by region</p>
                    <p className="text-sm text-muted-foreground">Global distribution analysis</p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        <TabsContent value="ai-chat" className="space-y-6">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 h-[calc(100vh-300px)] max-h-[800px]">
            {/* AI Chat Bot */}
            <div className="lg:col-span-2 h-full">
              <AIDataChatBot />
            </div>
            
            {/* Quick Stats Sidebar */}
            <div className="space-y-4 h-full overflow-y-auto">
              <Card className="card-professional">
                <CardHeader>
                  <CardTitle className="text-lg">Quick Stats</CardTitle>
                  <p className="text-sm text-muted-foreground">
                    Key metrics available for AI analysis
                  </p>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="flex items-center justify-between p-3 bg-muted/50 rounded-lg">
                    <div className="flex items-center gap-2">
                      <Package className="h-4 w-4 text-blue-600" />
                      <span className="text-sm">Total Products</span>
                    </div>
                    <span className="font-semibold">{formatNumber(kpiData.totalProducts.value)}</span>
                  </div>
                  
                  <div className="flex items-center justify-between p-3 bg-muted/50 rounded-lg">
                    <div className="flex items-center gap-2">
                      <CheckCircle2 className="h-4 w-4 text-green-600" />
                      <span className="text-sm">Authentications</span>
                    </div>
                    <span className="font-semibold">{formatNumber(kpiData.authenticatedScans.value)}</span>
                  </div>
                  
                  <div className="flex items-center justify-between p-3 bg-muted/50 rounded-lg">
                    <div className="flex items-center gap-2">
                      <AlertTriangle className="h-4 w-4 text-red-600" />
                      <span className="text-sm">Counterfeits</span>
                    </div>
                    <span className="font-semibold">{formatNumber(kpiData.counterfeitDetected.value)}</span>
                  </div>
                  
                  <div className="flex items-center justify-between p-3 bg-muted/50 rounded-lg">
                    <div className="flex items-center gap-2">
                      <DollarSign className="h-4 w-4 text-green-600" />
                      <span className="text-sm">Revenue Protected</span>
                    </div>
                    <span className="font-semibold">{formatCurrency(kpiData.revenueProtected.value)}</span>
                  </div>
                  
                  <div className="flex items-center justify-between p-3 bg-muted/50 rounded-lg">
                    <div className="flex items-center gap-2">
                      <Shield className="h-4 w-4 text-primary" />
                      <span className="text-sm">Compliance Score</span>
                    </div>
                    <span className="font-semibold">{kpiData.complianceScore.value}%</span>
                  </div>
                </CardContent>
              </Card>

              <Card className="card-professional">
                <CardHeader>
                  <CardTitle className="text-lg">AI Chat Tips</CardTitle>
                </CardHeader>
                <CardContent className="space-y-3">
                  <div className="p-3 bg-blue-50 dark:bg-blue-950/30 rounded-lg border border-blue-200 dark:border-blue-800">
                    <p className="text-sm text-blue-800 dark:text-blue-200">
                      💡 Ask about specific metrics like "What's my authentication rate?" or "Show me regional performance"
                    </p>
                  </div>
                  
                  <div className="p-3 bg-green-50 dark:bg-green-950/30 rounded-lg border border-green-200 dark:border-green-800">
                    <p className="text-sm text-green-800 dark:text-green-200">
                      🎯 Try asking comparative questions like "Which region has the highest risk?" 
                    </p>
                  </div>
                  
                  <div className="p-3 bg-purple-50 dark:bg-purple-950/30 rounded-lg border border-purple-200 dark:border-purple-800">
                    <p className="text-sm text-purple-800 dark:text-purple-200">
                      📊 Request insights about trends, compliance alerts, or improvement strategies
                    </p>
                  </div>
                </CardContent>
              </Card>
            </div>
          </div>
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default ReportsAnalytics;
