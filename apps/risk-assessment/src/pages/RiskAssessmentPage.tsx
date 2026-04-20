import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Progress } from "@/components/ui/progress";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { ChartContainer, ChartTooltip, ChartTooltipContent } from "@/components/ui/chart";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Separator } from "@/components/ui/separator";
import { BarChart, Bar, XAxis, YAxis, ResponsiveContainer, LineChart, Line, PieChart, Pie, Cell, AreaChart, Area } from "recharts";
import { 
  ArrowLeft, 
  TrendingUp, 
  MapPin, 
  AlertTriangle, 
  Users, 
  Activity,
  Shield,
  Eye,
  RefreshCw,
  BarChart3,
  Map,
  Search,
  Clock,
  Target,
  Zap,
  FileText,
  Download,
  Filter,
  Globe,
  Fingerprint,
  Database,
  Network,
  Settings,
  Bell,
  AlertCircle,
  TrendingDown,
  Calendar,
  Building,
  Package,
  Truck,
  DollarSign,
  Percent,
  Camera,
  MapPin as LocationIcon,
  Phone,
  Mail,
  ExternalLink,
  History,
  Lock,
  Unlock,
  CheckCircle,
  XCircle,
  MinusCircle,
  Info
} from "lucide-react";
import { useNavigate } from "react-router-dom";

interface AlertData {
  id: number;
  type: string;
  location: string;
  description: string;
  timestamp: string;
  scans: number;
  severity: string;
  retailer: string;
  confidence: number;
  category: string;
  evidence: string[];
}

const RiskAssessment = () => {
  const navigate = useNavigate();
  const [isRefreshing, setIsRefreshing] = useState(false);
  const [selectedAlert, setSelectedAlert] = useState<AlertData | null>(null);
  const [isInvestigationModalOpen, setIsInvestigationModalOpen] = useState(false);

  // Comprehensive Security Analytics Data
  const securityData = {
    // Real-time operational metrics
    realTimeStats: {
      activeUsers: 2847,
      dailyScans: 1432,
      illicitDetected: 89,
      riskScore: 7.2,
      systemHealth: 98.7,
      threatLevel: "ELEVATED",
      activeInvestigations: 23,
      blockedProducts: 156,
      suspiciousLocations: 34,
      networkThreats: 12
    },

    // Critical security alerts
    alerts: [
      {
        id: 1,
        type: "HIGH",
        location: "Johannesburg CBD",
        description: "Coordinated counterfeit operation detected across 5 locations",
        timestamp: "12 minutes ago",
        scans: 47,
        severity: "Critical",
        retailer: "Street Vendors Network",
        confidence: 94,
        category: "Organized Crime",
        evidence: ["Pattern matching", "Geographic clustering", "Time correlation"]
      },
      {
        id: 2,
        type: "MEDIUM", 
        location: "Cape Town Waterfront",
        description: "Anomalous scanning behavior - potential reconnaissance",
        timestamp: "34 minutes ago",
        scans: 23,
        severity: "Medium",
        retailer: "V&A Waterfront Stores",
        confidence: 76,
        category: "Surveillance",
        evidence: ["Behavioral analysis", "Device fingerprinting"]
      },
      {
        id: 3,
        type: "LOW",
        location: "Durban North",
        description: "Tampered NXT tag detected - single incident",
        timestamp: "2 hours ago",
        scans: 1,
        severity: "Low",
        retailer: "Gateway Shopping Centre",
        confidence: 89,
        category: "Tag Tampering",
        evidence: ["Hardware analysis", "Authentication failure"]
      }
    ],

    // Threat intelligence metrics
    threatIntelligence: {
      knownCounterfeiters: 47,
      suspiciousSuppliers: 23,
      blacklistedLocations: 156,
      compromisedTags: 89,
      activeInvestigations: 12,
      prosecutionsCases: 8
    },

    // Financial impact analysis
    financialImpact: {
      estimatedLosses: 2850000,
      recoveredValue: 450000,
      investigationCosts: 125000,
      preventedLosses: 1200000,
      legalFees: 75000,
      complianceCosts: 89000
    },

    // Geographic risk analysis
    hotspots: [
      {
        area: "Johannesburg CBD",
        risk: "HIGH",
        illicitRate: 23.4,
        totalScans: 1247,
        coordinates: [-26.2041, 28.0473],
        trend: "↗ +15%",
        retailers: ["Taxi Ranks", "Street Vendors", "Small Shops"],
        threatTypes: ["Counterfeiting", "Tag Cloning", "Network Operations"],
        investigations: 5,
        evidenceStrength: "Strong"
      },
      {
        area: "Cape Town CBD", 
        risk: "MEDIUM",
        illicitRate: 12.8,
        totalScans: 892,
        coordinates: [-33.9249, 18.4241],
        trend: "↘ -3%",
        retailers: ["Pick n Pay", "Shoprite", "Liquor City"],
        threatTypes: ["Grey Market", "Tampering"],
        investigations: 2,
        evidenceStrength: "Moderate"
      },
      {
        area: "Pretoria Central",
        risk: "MEDIUM",
        illicitRate: 8.9,
        totalScans: 634,
        coordinates: [-25.7479, 28.2293],
        trend: "→ 0%",
        retailers: ["Makro", "Checkers", "Ultra Liquors"],
        threatTypes: ["Supply Chain", "Authentication"],
        investigations: 1,
        evidenceStrength: "Weak"
      }
    ],

    // Supply chain intelligence
    supplyChain: [
      {
        supplier: "Premium Spirits SA",
        riskLevel: "HIGH",
        totalProducts: 15420,
        flaggedProducts: 234,
        lastIncident: "2024-09-20",
        investigations: 3,
        complianceScore: 45
      },
      {
        supplier: "Cape Distribution Hub",
        riskLevel: "MEDIUM", 
        totalProducts: 8750,
        flaggedProducts: 67,
        lastIncident: "2024-08-15",
        investigations: 1,
        complianceScore: 72
      },
      {
        supplier: "KZN Wholesale Network",
        riskLevel: "LOW",
        totalProducts: 12300,
        flaggedProducts: 12,
        lastIncident: "2024-06-03",
        investigations: 0,
        complianceScore: 89
      }
    ],

    // Forensic analysis patterns
    forensicPatterns: [
      {
        pattern: "Tag Cloning Network",
        frequency: 89,
        locations: ["JHB CBD", "Pretoria", "Sandton"],
        modus: "Mass production of cloned NXT tags",
        confidence: 96,
        lastSeen: "2024-09-25"
      },
      {
        pattern: "Tourism Area Targeting",
        frequency: 34,
        locations: ["V&A Waterfront", "Gold Reef City", "Sun City"],
        modus: "Premium brand counterfeiting for tourists",
        confidence: 78,
        lastSeen: "2024-09-24"
      },
      {
        pattern: "Supply Chain Infiltration",
        frequency: 12,
        locations: ["OR Tambo", "Durban Port", "Cape Town Harbor"],
        modus: "Legitimate channel compromise",
        confidence: 85,
        lastSeen: "2024-09-23"
      }
    ],

    // Brand protection metrics
    brandMetrics: {
      jameson: { totalScans: 4521, illicitRate: 15.2, investigations: 8 },
      chivas: { totalScans: 2876, illicitRate: 8.9, investigations: 3 },
      absolut: { totalScans: 6234, illicitRate: 12.4, investigations: 5 },
      martell: { totalScans: 1847, illicitRate: 6.7, investigations: 2 }
    },

    // Trend analysis data
    trendData: [
      { month: "Mar", illicit: 234, investigations: 12, prosecutions: 3 },
      { month: "Apr", illicit: 189, investigations: 15, prosecutions: 4 },
      { month: "May", illicit: 267, investigations: 18, prosecutions: 2 },
      { month: "Jun", illicit: 198, investigations: 14, prosecutions: 6 },
      { month: "Jul", illicit: 345, investigations: 22, prosecutions: 8 },
      { month: "Aug", illicit: 278, investigations: 19, prosecutions: 5 },
      { month: "Sep", illicit: 298, investigations: 23, prosecutions: 7 }
    ]
  };

  const getRiskColor = (risk: string) => {
    switch (risk) {
      case "HIGH": return "text-destructive bg-destructive/10 border-destructive/20";
      case "MEDIUM": return "text-warning bg-warning/10 border-warning/20";
      case "LOW": return "text-success bg-success/10 border-success/20";
      default: return "text-muted bg-muted/10 border-border";
    }
  };

  const getRiskBadgeVariant = (risk: string): "destructive" | "secondary" | "default" | "outline" => {
    switch (risk) {
      case "HIGH": return "destructive";
      case "MEDIUM": return "secondary"; 
      case "LOW": return "default";
      default: return "outline";
    }
  };

  const handleRefresh = () => {
    setIsRefreshing(true);
    setTimeout(() => setIsRefreshing(false), 2000);
  };

  const handleInvestigate = (alert: AlertData) => {
    setSelectedAlert(alert);
    setIsInvestigationModalOpen(true);
  };

  // Generate detailed investigation data based on alert
  const getInvestigationDetails = (alert: AlertData | null) => {
    if (!alert) return null;

    return {
      alertTriggers: {
        primaryTrigger: alert.category === "Organized Crime" ? "Pattern Recognition Algorithm" : 
                       alert.category === "Surveillance" ? "Behavioral Analysis System" : 
                       "Hardware Authentication Failure",
        secondaryTriggers: alert.category === "Organized Crime" ? 
          ["Geographic clustering detected", "Time correlation analysis", "Volume anomaly detection"] :
          alert.category === "Surveillance" ? 
          ["Device fingerprint mismatch", "Scan pattern irregularities", "Location history analysis"] :
          ["NXT tag authentication failed", "Hardware integrity check failed", "Digital signature invalid"],
        confidenceScore: alert.confidence,
        riskFactors: alert.category === "Organized Crime" ? 
          ["Multiple locations involved", "Coordinated timing", "High volume of activity"] :
          ["Unusual behavior patterns", "Device anomalies", "Geographic inconsistencies"]
      },
      technicalDetails: {
        deviceInfo: {
          deviceId: `DEV-${Math.random().toString(36).substr(2, 9).toUpperCase()}`,
          deviceType: "Mobile Scanner",
          osVersion: "Android 14",
          appVersion: "3.2.1",
          lastKnownLocation: alert.location,
          ipAddress: "196.45." + Math.floor(Math.random() * 255) + "." + Math.floor(Math.random() * 255),
          userAgent: "VeritasScan/3.2.1 (Android 14; SM-G998B)"
        },
        scanDetails: {
          totalScans: alert.scans,
          failedScans: Math.floor(alert.scans * 0.7),
          scanTimeframe: "14:23:15 - 14:47:32",
          scanFrequency: alert.category === "Organized Crime" ? "Rapid succession" : "Irregular intervals",
          productsScanned: alert.category === "Organized Crime" ? 
            ["Jameson Irish Whiskey", "Chivas Regal 12", "Absolut Vodka", "Unknown brands"] :
            ["Premium spirits", "Luxury bottles", "Tourist-targeted brands"],
          nxtTagStatus: alert.category === "Tag Tampering" ? "Compromised" : "Authentication failed"
        },
        networkAnalysis: {
          relatedDevices: alert.category === "Organized Crime" ? 5 : 0,
          networkCluster: alert.category === "Organized Crime" ? "Criminal Network A" : "Individual actor",
          communicationPatterns: alert.category === "Organized Crime" ? 
            "Coordinated across multiple devices" : "Single device operation",
          geographicSpread: alert.category === "Organized Crime" ? 
            "5km radius, 12 locations" : "Single location"
        }
      },
      evidenceChain: [
        {
          timestamp: "14:23:15",
          event: "Initial scan attempt detected",
          details: `Device ${alert.location} initiated product scan`,
          evidenceType: "System Log",
          integrity: "Verified"
        },
        {
          timestamp: "14:25:42",
          event: alert.category === "Tag Tampering" ? "Tag authentication failure" : "Anomalous pattern detected",
          details: alert.category === "Tag Tampering" ? 
            "NXT tag failed cryptographic verification" : 
            "Behavioral analysis flagged unusual scanning pattern",
          evidenceType: "Technical Analysis",
          integrity: "Verified"
        },
        {
          timestamp: "14:30:18",
          event: "Risk threshold exceeded",
          details: `Confidence score reached ${alert.confidence}% triggering security alert`,
          evidenceType: "Risk Assessment",
          integrity: "Verified"
        },
        {
          timestamp: "14:31:05",
          event: "Alert generated",
          details: `${alert.type} risk alert created for investigation`,
          evidenceType: "System Alert",
          integrity: "Verified"
        }
      ],
      relatedIncidents: alert.category === "Organized Crime" ? [
        {
          incidentId: "INC-2024-087",
          date: "2024-09-20",
          location: "Sandton City",
          similarity: "92%",
          status: "Under Investigation"
        },
        {
          incidentId: "INC-2024-063",
          date: "2024-09-15", 
          location: "Rosebank Mall",
          similarity: "87%",
          status: "Closed - Prosecution"
        }
      ] : [],
      threatAssessment: {
        immediateRisk: alert.type === "HIGH" ? "Critical" : alert.type === "MEDIUM" ? "Moderate" : "Low",
        impactRadius: alert.category === "Organized Crime" ? "City-wide" : "Local",
        estimatedLoss: alert.category === "Organized Crime" ? "R250,000 - R500,000" : "R5,000 - R15,000",
        recommendedActions: alert.type === "HIGH" ? 
          ["Immediate field investigation", "Coordinate with law enforcement", "Implement regional lockdown"] :
          ["Schedule field verification", "Monitor related locations", "Update risk profiles"],
        urgencyLevel: alert.type === "HIGH" ? "Immediate" : alert.type === "MEDIUM" ? "24 hours" : "72 hours"
      }
    };
  };

  const InvestigationModal = () => {
    const investigationData = getInvestigationDetails(selectedAlert);
    if (!selectedAlert || !investigationData) return null;

    return (
      <Dialog open={isInvestigationModalOpen} onOpenChange={setIsInvestigationModalOpen}>
        <DialogContent className="max-w-6xl max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2">
              <Search className="h-5 w-5 text-primary" />
              Investigation Details - Alert #{selectedAlert.id}
            </DialogTitle>
          </DialogHeader>

          <div className="space-y-6">
            {/* Alert Summary */}
            <Card className="card-professional">
              <CardHeader>
                <CardTitle className="text-heading flex items-center gap-2">
                  <AlertTriangle className="h-5 w-5 text-destructive" />
                  Alert Summary
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid md:grid-cols-2 gap-4">
                  <div className="space-y-3">
                    <div className="flex justify-between">
                      <span className="text-data-label">Alert Type</span>
                      <Badge variant={getRiskBadgeVariant(selectedAlert.type)}>{selectedAlert.type}</Badge>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-data-label">Category</span>
                      <span className="font-medium">{selectedAlert.category}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-data-label">Location</span>
                      <span className="font-medium">{selectedAlert.location}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-data-label">Confidence</span>
                      <span className="font-bold text-success">{selectedAlert.confidence}%</span>
                    </div>
                  </div>
                  <div className="space-y-3">
                    <div className="flex justify-between">
                      <span className="text-data-label">Timestamp</span>
                      <span className="font-medium">{selectedAlert.timestamp}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-data-label">Scans Involved</span>
                      <span className="font-medium">{selectedAlert.scans}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-data-label">Severity</span>
                      <Badge variant={selectedAlert.severity === "Critical" ? "destructive" : "secondary"}>
                        {selectedAlert.severity}
                      </Badge>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-data-label">Retailer</span>
                      <span className="font-medium">{selectedAlert.retailer}</span>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Alert Triggers */}
            <Card className="card-professional">
              <CardHeader>
                <CardTitle className="text-heading flex items-center gap-2">
                  <Zap className="h-5 w-5 text-warning" />
                  What Triggered This Alert
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div>
                    <h4 className="font-semibold text-primary mb-2">Primary Trigger</h4>
                    <div className="p-3 bg-primary/10 border border-primary/20 rounded-lg">
                      <div className="flex items-center gap-2">
                        <Target className="h-4 w-4 text-primary" />
                        <span className="font-medium">{investigationData.alertTriggers.primaryTrigger}</span>
                      </div>
                    </div>
                  </div>

                  <div>
                    <h4 className="font-semibold text-warning mb-2">Secondary Triggers</h4>
                    <div className="grid md:grid-cols-2 gap-2">
                      {investigationData.alertTriggers.secondaryTriggers.map((trigger, index) => (
                        <div key={index} className="p-2 bg-warning/10 border border-warning/20 rounded-lg text-sm">
                          <div className="flex items-center gap-2">
                            <AlertCircle className="h-3 w-3 text-warning" />
                            <span>{trigger}</span>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>

                  <div>
                    <h4 className="font-semibold text-destructive mb-2">Risk Factors</h4>
                    <div className="space-y-1">
                      {investigationData.alertTriggers.riskFactors.map((factor, index) => (
                        <div key={index} className="flex items-center gap-2 text-sm">
                          <XCircle className="h-3 w-3 text-destructive" />
                          <span>{factor}</span>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Technical Details */}
            <div className="grid md:grid-cols-2 gap-6">
              <Card className="card-professional">
                <CardHeader>
                  <CardTitle className="text-heading flex items-center gap-2">
                    <Phone className="h-5 w-5" />
                    Device Information
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-3 text-sm">
                    <div className="flex justify-between">
                      <span className="text-muted-foreground">Device ID</span>
                      <span className="font-mono text-xs bg-muted px-2 py-1 rounded">
                        {investigationData.technicalDetails.deviceInfo.deviceId}
                      </span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-muted-foreground">Device Type</span>
                      <span>{investigationData.technicalDetails.deviceInfo.deviceType}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-muted-foreground">OS Version</span>
                      <span>{investigationData.technicalDetails.deviceInfo.osVersion}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-muted-foreground">App Version</span>
                      <span>{investigationData.technicalDetails.deviceInfo.appVersion}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-muted-foreground">IP Address</span>
                      <span className="font-mono text-xs">{investigationData.technicalDetails.deviceInfo.ipAddress}</span>
                    </div>
                  </div>
                </CardContent>
              </Card>

              <Card className="card-professional">
                <CardHeader>
                  <CardTitle className="text-heading flex items-center gap-2">
                    <Activity className="h-5 w-5" />
                    Scan Analysis
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-3 text-sm">
                    <div className="flex justify-between">
                      <span className="text-muted-foreground">Total Scans</span>
                      <span className="font-bold">{investigationData.technicalDetails.scanDetails.totalScans}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-muted-foreground">Failed Scans</span>
                      <span className="font-bold text-destructive">{investigationData.technicalDetails.scanDetails.failedScans}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-muted-foreground">Time Frame</span>
                      <span>{investigationData.technicalDetails.scanDetails.scanTimeframe}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-muted-foreground">Frequency</span>
                      <span>{investigationData.technicalDetails.scanDetails.scanFrequency}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-muted-foreground">NXT Tag Status</span>
                      <Badge variant={investigationData.technicalDetails.scanDetails.nxtTagStatus === "Compromised" ? "destructive" : "secondary"}>
                        {investigationData.technicalDetails.scanDetails.nxtTagStatus}
                      </Badge>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>

            {/* Evidence Chain */}
            <Card className="card-professional">
              <CardHeader>
                <CardTitle className="text-heading flex items-center gap-2">
                  <History className="h-5 w-5" />
                  Evidence Chain
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {investigationData.evidenceChain.map((evidence, index) => (
                    <div key={index} className="flex items-start gap-4 p-3 border rounded-lg">
                      <div className="flex-shrink-0 w-16 text-xs text-muted-foreground font-mono">
                        {evidence.timestamp}
                      </div>
                      <div className="flex-1">
                        <div className="font-semibold text-sm mb-1">{evidence.event}</div>
                        <div className="text-sm text-muted-foreground mb-2">{evidence.details}</div>
                        <div className="flex items-center gap-2">
                          <Badge variant="outline" className="text-xs">{evidence.evidenceType}</Badge>
                          <Badge className="text-xs bg-success text-white">{evidence.integrity}</Badge>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>

            {/* Threat Assessment */}
            <Card className="card-professional">
              <CardHeader>
                <CardTitle className="text-heading flex items-center gap-2">
                  <Shield className="h-5 w-5 text-destructive" />
                  Threat Assessment & Recommendations
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid md:grid-cols-2 gap-6">
                  <div className="space-y-4">
                    <div>
                      <h4 className="font-semibold mb-2">Risk Analysis</h4>
                      <div className="space-y-2 text-sm">
                        <div className="flex justify-between">
                          <span>Immediate Risk</span>
                          <Badge variant={investigationData.threatAssessment.immediateRisk === "Critical" ? "destructive" : "secondary"}>
                            {investigationData.threatAssessment.immediateRisk}
                          </Badge>
                        </div>
                        <div className="flex justify-between">
                          <span>Impact Radius</span>
                          <span className="font-medium">{investigationData.threatAssessment.impactRadius}</span>
                        </div>
                        <div className="flex justify-between">
                          <span>Estimated Loss</span>
                          <span className="font-medium text-destructive">{investigationData.threatAssessment.estimatedLoss}</span>
                        </div>
                      </div>
                    </div>
                  </div>
                  <div className="space-y-4">
                    <div>
                      <h4 className="font-semibold mb-2">Recommended Actions</h4>
                      <div className="space-y-1">
                        {investigationData.threatAssessment.recommendedActions.map((action, index) => (
                          <div key={index} className="flex items-center gap-2 text-sm">
                            <CheckCircle className="h-3 w-3 text-success" />
                            <span>{action}</span>
                          </div>
                        ))}
                      </div>
                      <div className="mt-3 p-2 bg-warning/10 border border-warning/20 rounded">
                        <div className="text-sm font-medium text-warning">
                          Urgency: {investigationData.threatAssessment.urgencyLevel}
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Action Buttons */}
            <div className="flex justify-end gap-3 pt-4 border-t">
              <Button variant="outline" onClick={() => setIsInvestigationModalOpen(false)}>
                Close Investigation
              </Button>
              <Button variant="secondary" className="gap-2">
                <Download className="h-4 w-4" />
                Export Report
              </Button>
              <Button className="gap-2 gradient-primary">
                <FileText className="h-4 w-4" />
                Create Case File
              </Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>
    );
  };

  interface KPICardProps {
    title: string;
    value: string | number;
    subtitle?: string;
    icon: React.ComponentType<{ className?: string }>;
    trend?: string;
    color?: string;
    onClick?: () => void;
  }

  const KPICard = ({ title, value, subtitle, icon: Icon, trend, color = "text-primary", onClick }: KPICardProps) => (
    <Card className={`card-professional ${onClick ? 'cursor-pointer hover:shadow-primary' : ''}`} onClick={onClick}>
      <CardContent className="p-6">
        <div className="flex items-center justify-between">
          <div className="flex-1">
            <p className="text-data-label mb-1">{title}</p>
            <div className={`text-2xl font-bold ${color}`}>{value}</div>
            {subtitle && <p className="text-sm text-muted-foreground">{subtitle}</p>}
          </div>
          <div className="flex flex-col items-center gap-2">
            <Icon className={`h-8 w-8 ${color}`} />
            {trend && (
              <Badge variant="secondary" className="text-xs">
                {trend}
              </Badge>
            )}
          </div>
        </div>
      </CardContent>
    </Card>
  );

  return (
    <div className="min-h-screen bg-background">
      {/* Investigation Modal */}
      <InvestigationModal />
      
      {/* Header */}
      <div className="bg-card border-b border-border/50 shadow-card">
        <div className="container mx-auto px-6 py-6">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <Button
                variant="ghost"
                onClick={() => navigate("/")}
                className="gap-2"
              >
                <ArrowLeft className="h-4 w-4" />
                Back
              </Button>
              <div className="gradient-alert p-2 rounded-lg shadow-primary">
                <TrendingUp className="h-6 w-6 text-white" />
              </div>
              <div>
                <h1 className="text-heading text-xl">Risk Assessment Dashboard</h1>
                <p className="text-muted-foreground">Real-time illicit alcohol monitoring across South Africa</p>
              </div>
            </div>
            <Button 
              onClick={handleRefresh}
              variant="outline"
              className="gap-2"
              disabled={isRefreshing}
            >
              <RefreshCw className={`h-4 w-4 ${isRefreshing ? 'animate-spin' : ''}`} />
              Refresh Data
            </Button>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="container mx-auto px-6 py-8">
        <Tabs defaultValue="overview" className="flex gap-8">
          {/* Sidebar Navigation */}
          <div className="w-64 flex-shrink-0">
            <div className="sticky top-8">
              <TabsList className="flex flex-col h-auto w-full p-2 bg-card">
                <TabsTrigger 
                  value="overview" 
                  className="w-full justify-start gap-2 mb-1 data-[state=active]:bg-primary data-[state=active]:text-primary-foreground"
                >
                  <Activity className="h-4 w-4" />
                  Overview
                </TabsTrigger>
                <TabsTrigger 
                  value="threats" 
                  className="w-full justify-start gap-2 mb-1 data-[state=active]:bg-primary data-[state=active]:text-primary-foreground"
                >
                  <AlertTriangle className="h-4 w-4" />
                  Threats
                </TabsTrigger>
                <TabsTrigger 
                  value="forensics" 
                  className="w-full justify-start gap-2 mb-1 data-[state=active]:bg-primary data-[state=active]:text-primary-foreground"
                >
                  <Camera className="h-4 w-4" />
                  Forensics
                </TabsTrigger>
                <TabsTrigger 
                  value="intelligence" 
                  className="w-full justify-start gap-2 mb-1 data-[state=active]:bg-primary data-[state=active]:text-primary-foreground"
                >
                  <Database className="h-4 w-4" />
                  Intelligence
                </TabsTrigger>
                <TabsTrigger 
                  value="financial" 
                  className="w-full justify-start gap-2 mb-1 data-[state=active]:bg-primary data-[state=active]:text-primary-foreground"
                >
                  <DollarSign className="h-4 w-4" />
                  Financial
                </TabsTrigger>
                <TabsTrigger 
                  value="investigations" 
                  className="w-full justify-start gap-2 data-[state=active]:bg-primary data-[state=active]:text-primary-foreground"
                >
                  <FileText className="h-4 w-4" />
                  Cases
                </TabsTrigger>
              </TabsList>
            </div>
          </div>

          {/* Main Content Area */}
          <div className="flex-1 space-y-6">

          <TabsContent value="overview" className="space-y-8">
            {/* Enhanced Real-time Security Metrics */}
            <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6 gap-4">
              <KPICard
                title="Active Users"
                value={securityData.realTimeStats.activeUsers.toLocaleString()}
                icon={Users}
                trend="Live"
                color="text-primary"
              />
              <KPICard
                title="Daily Scans"
                value={securityData.realTimeStats.dailyScans.toLocaleString()}
                icon={Activity}
                trend="+12%"
                color="text-success"
              />
              <KPICard
                title="Illicit Detected"
                value={securityData.realTimeStats.illicitDetected}
                icon={AlertTriangle}
                trend="+5%"
                color="text-destructive"
              />
              <KPICard
                title="Risk Score"
                value={`${securityData.realTimeStats.riskScore}/10`}
                icon={TrendingUp}
                trend="ELEVATED"
                color="text-warning"
              />
              <KPICard
                title="Active Cases"
                value={securityData.realTimeStats.activeInvestigations}
                icon={Search}
                trend="+3 New"
                color="text-primary"
              />
              <KPICard
                title="Network Threats"
                value={securityData.realTimeStats.networkThreats}
                icon={Network}
                trend="Monitor"
                color="text-destructive"
              />
            </div>

            {/* Threat Level & System Status */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <Card className="card-professional">
                <CardContent className="p-6">
                  <div className="flex items-center justify-between mb-4">
                    <h3 className="text-heading text-lg">Threat Level</h3>
                    <Badge variant="destructive" className="animate-pulse">
                      {securityData.realTimeStats.threatLevel}
                    </Badge>
                  </div>
                  <div className="space-y-3">
                    <div className="flex justify-between text-sm">
                      <span>Current Risk Score</span>
                      <span className="font-bold text-destructive">{securityData.realTimeStats.riskScore}/10</span>
                    </div>
                    <Progress value={securityData.realTimeStats.riskScore * 10} className="h-3" />
                    <p className="text-xs text-muted-foreground">
                      Elevated due to coordinated activities in Gauteng region
                    </p>
                  </div>
                </CardContent>
              </Card>

              <Card className="card-professional">
                <CardContent className="p-6">
                  <div className="flex items-center justify-between mb-4">
                    <h3 className="text-heading text-lg">System Health</h3>
                    <Badge className="bg-success text-white">
                      OPTIMAL
                    </Badge>
                  </div>
                  <div className="space-y-3">
                    <div className="flex justify-between text-sm">
                      <span>Uptime</span>
                      <span className="font-bold text-success">{securityData.realTimeStats.systemHealth}%</span>
                    </div>
                    <Progress value={securityData.realTimeStats.systemHealth} className="h-3" />
                    <p className="text-xs text-muted-foreground">
                      All monitoring systems operational
                    </p>
                  </div>
                </CardContent>
              </Card>

              <Card className="card-professional">
                <CardContent className="p-6">
                  <div className="flex items-center justify-between mb-4">
                    <h3 className="text-heading text-lg">Response Status</h3>
                    <Badge variant="secondary">
                      ACTIVE
                    </Badge>
                  </div>
                  <div className="space-y-2 text-sm">
                    <div className="flex justify-between">
                      <span>Blocked Products</span>
                      <span className="font-bold">{securityData.realTimeStats.blockedProducts}</span>
                    </div>
                    <div className="flex justify-between">
                      <span>Flagged Locations</span>
                      <span className="font-bold">{securityData.realTimeStats.suspiciousLocations}</span>
                    </div>
                    <p className="text-xs text-muted-foreground">
                      Real-time protection active
                    </p>
                  </div>
                </CardContent>
              </Card>
            </div>

            {/* Enhanced Security Alerts */}
            <Card className="card-professional">
              <CardHeader>
                <div className="flex items-center justify-between">
                  <CardTitle className="text-heading flex items-center gap-2">
                    <AlertTriangle className="h-5 w-5 text-destructive" />
                    Security Intelligence Alerts
                  </CardTitle>
                  <div className="flex items-center gap-2">
                    <Badge variant="destructive" className="animate-pulse">
                      {securityData.alerts.length} Critical
                    </Badge>
                    <Button size="sm" variant="outline" className="gap-1">
                      <Filter className="h-3 w-3" />
                      Filter
                    </Button>
                  </div>
                </div>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {securityData.alerts.map((alert) => (
                    <div key={alert.id} className={`p-4 rounded-lg border ${getRiskColor(alert.type)}`}>
                      <div className="flex items-start justify-between mb-3">
                        <div className="flex items-center gap-3">
                          <Badge variant={getRiskBadgeVariant(alert.type)}>
                            {alert.type} RISK
                          </Badge>
                          <Badge variant="outline" className="text-xs">
                            {alert.category}
                          </Badge>
                          <div className="flex items-center gap-1 text-sm">
                            <LocationIcon className="h-3 w-3" />
                            <span className="font-medium">{alert.location}</span>
                          </div>
                        </div>
                        <div className="text-right">
                          <span className="text-sm text-muted-foreground">{alert.timestamp}</span>
                          <div className="text-xs text-success">{alert.confidence}% confidence</div>
                        </div>
                      </div>
                      <p className="text-sm mb-3 font-medium">{alert.description}</p>
                      <div className="space-y-2 mb-3">
                        <div className="text-xs text-muted-foreground">
                          <strong>Evidence:</strong> {alert.evidence.join(" • ")}
                        </div>
                      </div>
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-4 text-xs text-muted-foreground">
                          <span>{alert.scans} scan{alert.scans !== 1 ? 's' : ''}</span>
                          <span>•</span>
                          <span>{alert.retailer}</span>
                          <span>•</span>
                          <span className="text-destructive font-medium">{alert.severity}</span>
                        </div>
                        <div className="flex gap-2">
                          <Button size="sm" variant="outline" className="gap-1" onClick={() => handleInvestigate(alert)}>
                            <Eye className="h-3 w-3" />
                            Investigate
                          </Button>
                          <Button size="sm" variant="default" className="gap-1">
                            <FileText className="h-3 w-3" />
                            Report
                          </Button>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>

            {/* Enhanced Geographic Risk Hotspots */}
            <Card className="card-professional">
              <CardHeader>
                <div className="flex items-center justify-between">
                  <CardTitle className="text-heading flex items-center gap-2">
                    <MapPin className="h-5 w-5" />
                    Geographic Risk Intelligence
                  </CardTitle>
                  <Button size="sm" variant="outline" className="gap-1">
                    <Map className="h-3 w-3" />
                    View Map
                  </Button>
                </div>
              </CardHeader>
              <CardContent>
                <div className="grid md:grid-cols-2 gap-6">
                  {securityData.hotspots.map((hotspot, index) => (
                    <div key={index} className={`p-4 border rounded-lg ${getRiskColor(hotspot.risk)}`}>
                      <div className="flex items-center justify-between mb-3">
                        <div className="flex items-center gap-2">
                          <span className="font-semibold text-lg">{hotspot.area}</span>
                          <Badge variant={getRiskBadgeVariant(hotspot.risk)}>
                            {hotspot.risk}
                          </Badge>
                        </div>
                        <span className="text-sm font-medium">{hotspot.trend}</span>
                      </div>
                      
                      <div className="space-y-2 mb-3">
                        <div className="flex justify-between text-sm">
                          <span className="text-muted-foreground">Illicit Rate</span>
                          <span className="font-semibold text-destructive">{hotspot.illicitRate}%</span>
                        </div>
                        <Progress value={hotspot.illicitRate} className="h-2" />
                        <div className="grid grid-cols-2 gap-4 text-sm">
                          <div className="flex justify-between">
                            <span className="text-muted-foreground">Total Scans</span>
                            <span className="font-semibold">{hotspot.totalScans.toLocaleString()}</span>
                          </div>
                          <div className="flex justify-between">
                            <span className="text-muted-foreground">Active Cases</span>
                            <span className="font-semibold">{hotspot.investigations}</span>
                          </div>
                        </div>
                      </div>

                      <div className="space-y-3">
                        <div>
                          <p className="text-data-label mb-1">Threat Types</p>
                          <div className="flex flex-wrap gap-1">
                            {hotspot.threatTypes.map((threat, idx) => (
                              <Badge key={idx} variant="secondary" className="text-xs">
                                {threat}
                              </Badge>
                            ))}
                          </div>
                        </div>
                        <div>
                          <p className="text-data-label mb-1">Top Retailers</p>
                          <div className="flex flex-wrap gap-1">
                            {hotspot.retailers.map((retailer, idx) => (
                              <Badge key={idx} variant="outline" className="text-xs">
                                {retailer}
                              </Badge>
                            ))}
                          </div>
                        </div>
                        <div className="flex items-center justify-between pt-2 border-t">
                          <div className="text-xs">
                            <span className="text-muted-foreground">Evidence: </span>
                            <span className={`font-medium ${hotspot.evidenceStrength === 'Strong' ? 'text-success' : 
                              hotspot.evidenceStrength === 'Moderate' ? 'text-warning' : 'text-muted-foreground'}`}>
                              {hotspot.evidenceStrength}
                            </span>
                          </div>
                          <Button size="sm" variant="outline" className="gap-1 text-xs h-7 px-2">
                            <Target className="h-3 w-3" />
                            Focus
                          </Button>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Threats Tab */}
          <TabsContent value="threats" className="space-y-6">
            {/* Threat Intelligence Overview */}
            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
              <KPICard
                title="Known Threats"
                value={securityData.threatIntelligence.knownCounterfeiters}
                icon={Target}
                trend="Monitored"
                color="text-destructive"
              />
              <KPICard
                title="Suspicious Suppliers"
                value={securityData.threatIntelligence.suspiciousSuppliers}
                icon={Building}
                trend="+2 New"
                color="text-warning"
              />
              <KPICard
                title="Blacklisted Sites"
                value={securityData.threatIntelligence.blacklistedLocations}
                icon={MapPin}
                trend="Updated"
                color="text-destructive"
              />
              <KPICard
                title="Compromised Tags"
                value={securityData.threatIntelligence.compromisedTags}
                icon={Lock}
                trend="+7 Today"
                color="text-destructive"
              />
              <KPICard
                title="Active Cases"
                value={securityData.threatIntelligence.activeInvestigations}
                icon={Search}
                trend="In Progress"
                color="text-primary"
              />
              <KPICard
                title="Prosecutions"
                value={securityData.threatIntelligence.prosecutionsCases}
                icon={FileText}
                trend="Pending"
                color="text-success"
              />
            </div>

            {/* Threat Patterns Analysis */}
            <div className="grid md:grid-cols-2 gap-6">
              <Card className="card-professional">
                <CardHeader>
                  <CardTitle className="text-heading flex items-center gap-2">
                    <Fingerprint className="h-5 w-5" />
                    Threat Pattern Analysis
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    {securityData.forensicPatterns.map((pattern, index) => (
                      <div key={index} className="p-3 border rounded-lg hover:bg-muted/20 transition-smooth">
                        <div className="flex items-center justify-between mb-2">
                          <h4 className="font-semibold text-sm">{pattern.pattern}</h4>
                          <Badge className={`${pattern.confidence > 90 ? 'bg-destructive text-white' : 
                            pattern.confidence > 75 ? 'bg-warning text-warning-foreground' : 
                            'bg-secondary text-secondary-foreground'}`}>
                            {pattern.confidence}%
                          </Badge>
                        </div>
                        <p className="text-xs text-muted-foreground mb-2">{pattern.modus}</p>
                        <div className="flex items-center justify-between text-xs">
                          <span>Frequency: <strong>{pattern.frequency}</strong></span>
                          <span>Last seen: <strong>{pattern.lastSeen}</strong></span>
                        </div>
                        <div className="flex flex-wrap gap-1 mt-2">
                          {pattern.locations.map((location, idx) => (
                            <Badge key={idx} variant="outline" className="text-xs">
                              {location}
                            </Badge>
                          ))}
                        </div>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>

              <Card className="card-professional">
                <CardHeader>
                  <CardTitle className="text-heading flex items-center gap-2">
                    <TrendingUp className="h-5 w-5" />
                    Threat Trend Analysis
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <ChartContainer config={{ illicit: { label: "Illicit Products", color: "#dc2626" }, 
                    investigations: { label: "Investigations", color: "#2563eb" },
                    prosecutions: { label: "Prosecutions", color: "#16a34a" } }}>
                    <ResponsiveContainer width="100%" height={300}>
                      <LineChart data={securityData.trendData}>
                        <XAxis dataKey="month" />
                        <YAxis />
                        <ChartTooltip />
                        <Line type="monotone" dataKey="illicit" stroke="var(--color-illicit)" strokeWidth={3} />
                        <Line type="monotone" dataKey="investigations" stroke="var(--color-investigations)" strokeWidth={2} />
                        <Line type="monotone" dataKey="prosecutions" stroke="var(--color-prosecutions)" strokeWidth={2} />
                      </LineChart>
                    </ResponsiveContainer>
                  </ChartContainer>
                </CardContent>
              </Card>
            </div>
          </TabsContent>

          {/* Forensics Tab */}
          <TabsContent value="forensics" className="space-y-6">
            {/* Forensic Analysis Dashboard */}
            <div className="grid md:grid-cols-2 gap-6">
              <Card className="card-professional">
                <CardHeader>
                  <CardTitle className="text-heading flex items-center gap-2">
                    <Camera className="h-5 w-5" />
                    Digital Evidence Analysis
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    <div className="grid grid-cols-2 gap-4">
                      <div className="p-3 bg-muted/30 rounded-lg">
                        <div className="text-2xl font-bold text-primary">247</div>
                        <div className="text-sm text-muted-foreground">Digital Signatures</div>
                      </div>
                      <div className="p-3 bg-muted/30 rounded-lg">
                        <div className="text-2xl font-bold text-warning">89</div>
                        <div className="text-sm text-muted-foreground">Tampered Tags</div>
                      </div>
                      <div className="p-3 bg-muted/30 rounded-lg">
                        <div className="text-2xl font-bold text-destructive">34</div>
                        <div className="text-sm text-muted-foreground">Cloned IDs</div>
                      </div>
                      <div className="p-3 bg-muted/30 rounded-lg">
                        <div className="text-2xl font-bold text-success">156</div>
                        <div className="text-sm text-muted-foreground">Verified Authentic</div>
                      </div>
                    </div>
                    <Button className="w-full gap-2">
                      <Download className="h-4 w-4" />
                      Export Forensic Report
                    </Button>
                  </div>
                </CardContent>
              </Card>

              <Card className="card-professional">
                <CardHeader>
                  <CardTitle className="text-heading flex items-center gap-2">
                    <Database className="h-5 w-5" />
                    Chain of Custody
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-3">
                    <div className="flex items-center gap-3 p-2 border-l-4 border-l-primary">
                      <CheckCircle className="h-4 w-4 text-success" />
                      <div className="text-sm">
                        <div className="font-medium">Evidence Collected</div>
                        <div className="text-muted-foreground">Manufacturing site - JHB</div>
                      </div>
                      <span className="text-xs text-muted-foreground ml-auto">09:45</span>
                    </div>
                    <div className="flex items-center gap-3 p-2 border-l-4 border-l-warning">
                      <Clock className="h-4 w-4 text-warning" />
                      <div className="text-sm">
                        <div className="font-medium">Lab Analysis Pending</div>
                        <div className="text-muted-foreground">NXT tag verification</div>
                      </div>
                      <span className="text-xs text-muted-foreground ml-auto">11:20</span>
                    </div>
                    <div className="flex items-center gap-3 p-2 border-l-4 border-l-muted">
                      <MinusCircle className="h-4 w-4 text-muted-foreground" />
                      <div className="text-sm">
                        <div className="font-medium">Awaiting Legal Review</div>
                        <div className="text-muted-foreground">Case file preparation</div>
                      </div>
                      <span className="text-xs text-muted-foreground ml-auto">Pending</span>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>

            {/* Brand Protection Analysis */}
            <Card className="card-professional">
              <CardHeader>
                <CardTitle className="text-heading flex items-center gap-2">
                  <Shield className="h-5 w-5" />
                  Brand Protection Analysis
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid md:grid-cols-4 gap-4">
                  {Object.entries(securityData.brandMetrics).map(([brand, metrics]) => (
                    <div key={brand} className="p-4 border rounded-lg">
                      <div className="flex items-center justify-between mb-3">
                        <h4 className="font-semibold capitalize">{brand}</h4>
                        <Badge variant={metrics.illicitRate > 10 ? "destructive" : metrics.illicitRate > 5 ? "secondary" : "default"}>
                          {metrics.illicitRate}%
                        </Badge>
                      </div>
                      <div className="space-y-2 text-sm">
                        <div className="flex justify-between">
                          <span className="text-muted-foreground">Total Scans</span>
                          <span className="font-medium">{metrics.totalScans.toLocaleString()}</span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-muted-foreground">Active Cases</span>
                          <span className="font-medium">{metrics.investigations}</span>
                        </div>
                        <Progress value={metrics.illicitRate} className="h-2 mt-2" />
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Intelligence Tab */}
          <TabsContent value="intelligence" className="space-y-6">
            {/* Supply Chain Intelligence */}
            <Card className="card-professional">
              <CardHeader>
                <CardTitle className="text-heading flex items-center gap-2">
                  <Truck className="h-5 w-5" />
                  Supply Chain Intelligence
                </CardTitle>
              </CardHeader>
              <CardContent>
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Supplier</TableHead>
                      <TableHead>Risk Level</TableHead>
                      <TableHead>Total Products</TableHead>
                      <TableHead>Flagged</TableHead>
                      <TableHead>Last Incident</TableHead>
                      <TableHead>Compliance Score</TableHead>
                      <TableHead>Actions</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {securityData.supplyChain.map((supplier, index) => (
                      <TableRow key={index}>
                        <TableCell className="font-medium">{supplier.supplier}</TableCell>
                        <TableCell>
                          <Badge variant={getRiskBadgeVariant(supplier.riskLevel)}>
                            {supplier.riskLevel}
                          </Badge>
                        </TableCell>
                        <TableCell>{supplier.totalProducts.toLocaleString()}</TableCell>
                        <TableCell className="text-destructive font-medium">{supplier.flaggedProducts}</TableCell>
                        <TableCell className="text-muted-foreground">{supplier.lastIncident}</TableCell>
                        <TableCell>
                          <div className="flex items-center gap-2">
                            <Progress value={supplier.complianceScore} className="h-2 w-16" />
                            <span className="text-sm font-medium">{supplier.complianceScore}%</span>
                          </div>
                        </TableCell>
                        <TableCell>
                          <div className="flex gap-1">
                            <Button size="sm" variant="outline" className="h-8 px-2">
                              <Eye className="h-3 w-3" />
                            </Button>
                            <Button size="sm" variant="outline" className="h-8 px-2">
                              <AlertCircle className="h-3 w-3" />
                            </Button>
                          </div>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </CardContent>
            </Card>

            {/* Network Analysis */}
            <div className="grid md:grid-cols-2 gap-6">
              <Card className="card-professional">
                <CardHeader>
                  <CardTitle className="text-heading flex items-center gap-2">
                    <Network className="h-5 w-5" />
                    Criminal Network Analysis
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="aspect-square bg-gradient-to-br from-muted/30 to-muted/10 rounded-lg flex items-center justify-center border border-border/50">
                    <div className="text-center">
                      <Network className="h-16 w-16 text-muted-foreground mx-auto mb-4" />
                      <h3 className="text-heading text-lg mb-2">Network Graph</h3>
                      <p className="text-muted-foreground mb-4">Interactive visualization of criminal connections</p>
                      <Button className="gap-2">
                        <Globe className="h-4 w-4" />
                        Load Network Map
                      </Button>
                    </div>
                  </div>
                </CardContent>
              </Card>

              <Card className="card-professional">
                <CardHeader>
                  <CardTitle className="text-heading flex items-center gap-2">
                    <Bell className="h-5 w-5" />
                    Intelligence Alerts
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-3">
                    <div className="flex items-start gap-3 p-3 bg-destructive/10 border border-destructive/20 rounded-lg">
                      <AlertTriangle className="h-4 w-4 text-destructive mt-0.5" />
                      <div className="text-sm">
                        <div className="font-medium">High-Risk Supplier Alert</div>
                        <div className="text-muted-foreground">Premium Spirits SA flagged for suspicious activity</div>
                        <div className="text-xs text-muted-foreground mt-1">2 hours ago</div>
                      </div>
                    </div>
                    <div className="flex items-start gap-3 p-3 bg-warning/10 border border-warning/20 rounded-lg">
                      <Info className="h-4 w-4 text-warning mt-0.5" />
                      <div className="text-sm">
                        <div className="font-medium">Pattern Recognition</div>
                        <div className="text-muted-foreground">New counterfeiting method detected</div>
                        <div className="text-xs text-muted-foreground mt-1">5 hours ago</div>
                      </div>
                    </div>
                    <div className="flex items-start gap-3 p-3 bg-primary/10 border border-primary/20 rounded-lg">
                      <CheckCircle className="h-4 w-4 text-primary mt-0.5" />
                      <div className="text-sm">
                        <div className="font-medium">Case Resolution</div>
                        <div className="text-muted-foreground">JHB CBD investigation completed successfully</div>
                        <div className="text-xs text-muted-foreground mt-1">1 day ago</div>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>
          </TabsContent>

          {/* Financial Tab */}
          <TabsContent value="financial" className="space-y-6">
            {/* Financial Impact Analysis */}
            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
              <KPICard
                title="Estimated Losses"
                value={`R${(securityData.financialImpact.estimatedLosses / 1000000).toFixed(1)}M`}
                icon={TrendingDown}
                trend="This Year"
                color="text-destructive"
              />
              <KPICard
                title="Recovered Value"
                value={`R${(securityData.financialImpact.recoveredValue / 1000).toFixed(0)}K`}
                icon={DollarSign}
                trend="+15%"
                color="text-success"
              />
              <KPICard
                title="Prevented Losses"
                value={`R${(securityData.financialImpact.preventedLosses / 1000000).toFixed(1)}M`}
                icon={Shield}
                trend="Protected"
                color="text-primary"
              />
              <KPICard
                title="Investigation Costs"
                value={`R${(securityData.financialImpact.investigationCosts / 1000).toFixed(0)}K`}
                icon={Search}
                trend="Monthly"
                color="text-warning"
              />
              <KPICard
                title="Legal Fees"
                value={`R${(securityData.financialImpact.legalFees / 1000).toFixed(0)}K`}
                icon={FileText}
                trend="Ongoing"
                color="text-muted-foreground"
              />
              <KPICard
                title="Compliance Costs"
                value={`R${(securityData.financialImpact.complianceCosts / 1000).toFixed(0)}K`}
                icon={CheckCircle}
                trend="Annual"
                color="text-primary"
              />
            </div>

            {/* Financial Impact Breakdown */}
            <div className="grid md:grid-cols-2 gap-6">
              <Card className="card-professional">
                <CardHeader>
                  <CardTitle className="text-heading flex items-center gap-2">
                    <DollarSign className="h-5 w-5" />
                    Cost-Benefit Analysis
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    <div className="p-4 bg-success/10 border border-success/20 rounded-lg">
                      <div className="flex items-center justify-between mb-2">
                        <h4 className="font-semibold text-success">Revenue Protected</h4>
                        <span className="text-2xl font-bold text-success">
                          R{(securityData.financialImpact.preventedLosses / 1000000).toFixed(1)}M
                        </span>
                      </div>
                      <p className="text-sm text-muted-foreground">
                        Illicit products blocked from market entry
                      </p>
                    </div>
                    
                    <div className="p-4 bg-destructive/10 border border-destructive/20 rounded-lg">
                      <div className="flex items-center justify-between mb-2">
                        <h4 className="font-semibold text-destructive">Revenue Lost</h4>
                        <span className="text-2xl font-bold text-destructive">
                          R{(securityData.financialImpact.estimatedLosses / 1000000).toFixed(1)}M
                        </span>
                      </div>
                      <p className="text-sm text-muted-foreground">
                        Estimated market value of illicit products
                      </p>
                    </div>

                    <div className="p-4 bg-primary/10 border border-primary/20 rounded-lg">
                      <div className="flex items-center justify-between mb-2">
                        <h4 className="font-semibold text-primary">ROI Analysis</h4>
                        <span className="text-2xl font-bold text-primary">467%</span>
                      </div>
                      <p className="text-sm text-muted-foreground">
                        Return on anti-illicit program investment
                      </p>
                    </div>
                  </div>
                </CardContent>
              </Card>

              <Card className="card-professional">
                <CardHeader>
                  <CardTitle className="text-heading flex items-center gap-2">
                    <BarChart3 className="h-5 w-5" />
                    Monthly Financial Trends
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <ChartContainer config={{
                    losses: { label: "Losses", color: "#dc2626" },
                    recovered: { label: "Recovered", color: "#16a34a" },
                    prevented: { label: "Prevented", color: "#2563eb" }
                  }}>
                    <ResponsiveContainer width="100%" height={300}>
                      <AreaChart data={[
                        { month: "Jul", losses: 2.1, recovered: 0.3, prevented: 0.8 },
                        { month: "Aug", losses: 2.3, recovered: 0.4, prevented: 1.1 },
                        { month: "Sep", losses: 2.8, recovered: 0.5, prevented: 1.2 }
                      ]}>
                        <XAxis dataKey="month" />
                        <YAxis />
                        <ChartTooltip />
                        <Area type="monotone" dataKey="losses" stackId="1" stroke="var(--color-losses)" fill="var(--color-losses)" fillOpacity={0.6} />
                        <Area type="monotone" dataKey="recovered" stackId="2" stroke="var(--color-recovered)" fill="var(--color-recovered)" fillOpacity={0.6} />
                        <Area type="monotone" dataKey="prevented" stackId="3" stroke="var(--color-prevented)" fill="var(--color-prevented)" fillOpacity={0.6} />
                      </AreaChart>
                    </ResponsiveContainer>
                  </ChartContainer>
                </CardContent>
              </Card>
            </div>
          </TabsContent>

          {/* Investigations Tab */}
          <TabsContent value="investigations" className="space-y-6">
            {/* Active Cases Overview */}
            <div className="grid md:grid-cols-4 gap-4">
              <Card className="card-professional">
                <CardContent className="p-6">
                  <div className="flex items-center gap-3">
                    <div className="p-2 bg-destructive/10 rounded-lg">
                      <AlertTriangle className="h-6 w-6 text-destructive" />
                    </div>
                    <div>
                      <div className="text-2xl font-bold text-destructive">23</div>
                      <div className="text-sm text-muted-foreground">Active Cases</div>
                    </div>
                  </div>
                </CardContent>
              </Card>
              <Card className="card-professional">
                <CardContent className="p-6">
                  <div className="flex items-center gap-3">
                    <div className="p-2 bg-warning/10 rounded-lg">
                      <Clock className="h-6 w-6 text-warning" />
                    </div>
                    <div>
                      <div className="text-2xl font-bold text-warning">8</div>
                      <div className="text-sm text-muted-foreground">Pending Review</div>
                    </div>
                  </div>
                </CardContent>
              </Card>
              <Card className="card-professional">
                <CardContent className="p-6">
                  <div className="flex items-center gap-3">
                    <div className="p-2 bg-success/10 rounded-lg">
                      <CheckCircle className="h-6 w-6 text-success" />
                    </div>
                    <div>
                      <div className="text-2xl font-bold text-success">12</div>
                      <div className="text-sm text-muted-foreground">Closed This Month</div>
                    </div>
                  </div>
                </CardContent>
              </Card>
              <Card className="card-professional">
                <CardContent className="p-6">
                  <div className="flex items-center gap-3">
                    <div className="p-2 bg-primary/10 rounded-lg">
                      <FileText className="h-6 w-6 text-primary" />
                    </div>
                    <div>
                      <div className="text-2xl font-bold text-primary">7</div>
                      <div className="text-sm text-muted-foreground">Legal Actions</div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>

            {/* Case Management Table */}
            <Card className="card-professional">
              <CardHeader>
                <div className="flex items-center justify-between">
                  <CardTitle className="text-heading flex items-center gap-2">
                    <FileText className="h-5 w-5" />
                    Active Investigation Cases
                  </CardTitle>
                  <div className="flex gap-2">
                    <Button size="sm" variant="outline" className="gap-1">
                      <Filter className="h-3 w-3" />
                      Filter
                    </Button>
                    <Button size="sm" variant="default" className="gap-1">
                      <FileText className="h-3 w-3" />
                      New Case
                    </Button>
                  </div>
                </div>
              </CardHeader>
              <CardContent>
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Case ID</TableHead>
                      <TableHead>Location</TableHead>
                      <TableHead>Threat Type</TableHead>
                      <TableHead>Priority</TableHead>
                      <TableHead>Investigator</TableHead>
                      <TableHead>Status</TableHead>
                      <TableHead>Last Update</TableHead>
                      <TableHead>Actions</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    <TableRow>
                      <TableCell className="font-medium">INV-2024-001</TableCell>
                      <TableCell>Johannesburg CBD</TableCell>
                      <TableCell>Counterfeiting Ring</TableCell>
                      <TableCell><Badge variant="destructive">Critical</Badge></TableCell>
                      <TableCell>Agent Smith</TableCell>
                      <TableCell><Badge className="bg-warning text-warning-foreground">Investigation</Badge></TableCell>
                      <TableCell>2 hours ago</TableCell>
                      <TableCell>
                        <div className="flex gap-1">
                          <Button size="sm" variant="outline" className="h-8 px-2">
                            <Eye className="h-3 w-3" />
                          </Button>
                          <Button size="sm" variant="outline" className="h-8 px-2">
                            <FileText className="h-3 w-3" />
                          </Button>
                        </div>
                      </TableCell>
                    </TableRow>
                    <TableRow>
                      <TableCell className="font-medium">INV-2024-002</TableCell>
                      <TableCell>Cape Town Waterfront</TableCell>
                      <TableCell>Grey Market</TableCell>
                      <TableCell><Badge variant="secondary">Medium</Badge></TableCell>
                      <TableCell>Agent Jones</TableCell>
                      <TableCell><Badge className="bg-primary text-white">Evidence Review</Badge></TableCell>
                      <TableCell>1 day ago</TableCell>
                      <TableCell>
                        <div className="flex gap-1">
                          <Button size="sm" variant="outline" className="h-8 px-2">
                            <Eye className="h-3 w-3" />
                          </Button>
                          <Button size="sm" variant="outline" className="h-8 px-2">
                            <FileText className="h-3 w-3" />
                          </Button>
                        </div>
                      </TableCell>
                    </TableRow>
                    <TableRow>
                      <TableCell className="font-medium">INV-2024-003</TableCell>
                      <TableCell>Durban Port</TableCell>
                      <TableCell>Supply Chain</TableCell>
                      <TableCell><Badge variant="default">Low</Badge></TableCell>
                      <TableCell>Agent Brown</TableCell>
                      <TableCell><Badge className="bg-success text-white">Ready for Closure</Badge></TableCell>
                      <TableCell>3 days ago</TableCell>
                      <TableCell>
                        <div className="flex gap-1">
                          <Button size="sm" variant="outline" className="h-8 px-2">
                            <Eye className="h-3 w-3" />
                          </Button>
                          <Button size="sm" variant="outline" className="h-8 px-2">
                            <CheckCircle className="h-3 w-3" />
                          </Button>
                        </div>
                      </TableCell>
                    </TableRow>
                  </TableBody>
                </Table>
              </CardContent>
            </Card>

            {/* Investigation Timeline */}
            <div className="grid md:grid-cols-2 gap-6">
              <Card className="card-professional">
                <CardHeader>
                  <CardTitle className="text-heading flex items-center gap-2">
                    <History className="h-5 w-5" />
                    Recent Case Activity
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    <div className="flex items-start gap-3">
                      <div className="w-2 h-2 bg-destructive rounded-full mt-2"></div>
                      <div className="text-sm">
                        <div className="font-medium">Evidence collected at JHB CBD location</div>
                        <div className="text-muted-foreground">Case INV-2024-001 • 2 hours ago</div>
                      </div>
                    </div>
                    <div className="flex items-start gap-3">
                      <div className="w-2 h-2 bg-warning rounded-full mt-2"></div>
                      <div className="text-sm">
                        <div className="font-medium">Forensic analysis completed</div>
                        <div className="text-muted-foreground">Case INV-2024-002 • 1 day ago</div>
                      </div>
                    </div>
                    <div className="flex items-start gap-3">
                      <div className="w-2 h-2 bg-success rounded-full mt-2"></div>
                      <div className="text-sm">
                        <div className="font-medium">Legal action initiated</div>
                        <div className="text-muted-foreground">Case INV-2024-003 • 3 days ago</div>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>

              <Card className="card-professional">
                <CardHeader>
                  <CardTitle className="text-heading flex items-center gap-2">
                    <Target className="h-5 w-5" />
                    Investigation Efficiency
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    <div className="flex items-center justify-between">
                      <span className="text-sm text-muted-foreground">Average Resolution Time</span>
                      <span className="font-bold">12.4 days</span>
                    </div>
                    <Progress value={75} className="h-2" />
                    <div className="grid grid-cols-2 gap-4 text-sm">
                      <div>
                        <div className="text-muted-foreground">Success Rate</div>
                        <div className="text-2xl font-bold text-success">87%</div>
                      </div>
                      <div>
                        <div className="text-muted-foreground">Cases This Month</div>
                        <div className="text-2xl font-bold text-primary">15</div>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>
          </TabsContent>
          </div>
        </Tabs>
      </div>
    </div>
  );
};

export default RiskAssessment;