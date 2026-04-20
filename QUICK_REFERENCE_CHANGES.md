# Quick Reference: Specific Implementation Differences

## 1. MANUFACTURER PAGE - Required Changes

### Current State (Slosh):
- Direct dashboard access (no auth)
- Horizontal tab navigation
- All content inline in single file
- Gradient background only
- No sidebar
- No theme toggle or user display

### Target State (Veritas):
- Multi-step authentication (username/password → 2FA)
- Sidebar-based navigation (vertical panel)
- Separate component modules imported
- Animated FuturisticBackground overlay
- Persistent sidebar with section rendering
- Theme toggle + user display + logout button

---

### 1.1 Structural Changes Required

**Remove:**
```tsx
// Tab-based navigation
const tabs = ["Overview", "Batches", "Quality", "Reports", "Analytics"];
{tabs.map(tab => ...)} // Tab rendering logic
{activeTab === "Overview" && ...} // Conditional content
```

**Replace With:**
```tsx
// Sidebar-based navigation
<SidePanel activeSection={activeSection} onSectionChange={setActiveSection} />

// Dynamic section rendering
{renderSectionContent()} // Calls different components based on activeSection
```

**Authentication Gate:**
```tsx
if (!isLoggedIn) {
  return (
    <div className="...login form...">
      {/* Show login card, 2FA, etc. */}
    </div>
  );
}

// Then show main dashboard
return (
  <div className="...main dashboard...">
```

---

### 1.2 Component Modules to Create/Import

Create or import these components:
- `SidePanel` - Navigation sidebar
- `BatchManager` - Batch management section
- `ManufacturerAnalytics` - Main analytics dashboard
- `BrandAnalytics` - Brand-specific analytics
- `ReportsAnalytics` - Reports section
- `SystemSettings` - Settings section
- `LiveFeed` - Live updates sidebar widget
- `FuturisticBackground` - Animated background

**In current ManufacturerPage.tsx:**
```tsx
// Current approach (all inline)
{activeTab === "Overview" && <div>...KPI cards...</div>}
{activeTab === "Batches" && <div>...table...</div>}

// Change to:
import ManufacturerAnalytics from "@/components/ManufacturerAnalytics";
import BatchManager from "@/components/BatchManager";
```

---

### 1.3 Authentication UI Elements

**Login Card:**
```tsx
<Card className="w-full max-w-md card-professional bg-card/85 
                 backdrop-blur-xl border-primary/20 
                 shadow-elevated hover:border-primary/30 
                 transition-smooth relative z-10">
  {/* Header with Factory icon */}
  <CardHeader className="text-center pb-2">
    <div className="flex justify-center mb-4">
      <div className="gradient-primary p-3 rounded-xl shadow-primary">
        <Factory className="h-8 w-8 text-white" />
      </div>
    </div>
    <CardTitle className="text-heading text-2xl">
      Manufacturer Access
    </CardTitle>
    <p className="text-muted-foreground">
      Pernod Ricard Secure Portal
    </p>
  </CardHeader>
```

**Credential Inputs:**
```tsx
<input
  className="mt-1 w-full px-3 py-2 border border-primary/20 
             rounded-lg bg-background/60 backdrop-blur-sm 
             focus:outline-none focus:ring-2 focus:ring-primary 
             focus:border-primary/40 transition-smooth"
  placeholder="Enter username (demo: pernod_admin)"
/>
```

**2FA Input:**
```tsx
<input
  className="mt-1 w-full px-3 py-2 border border-success/30 
             rounded-lg bg-background/60 backdrop-blur-sm 
             focus:outline-none focus:ring-2 focus:ring-success 
             focus:border-success/50 transition-smooth 
             text-center text-lg tracking-widest"
  placeholder="Enter 6-digit code (demo: 123456)"
  maxLength={6}
/>
```

**Buttons:**
```tsx
<Button onClick={handleLogin} className="w-full gradient-primary">
  Sign In
</Button>

<Button onClick={handleTwoFA} className="w-full gradient-success">
  Verify & Continue
</Button>

<Button variant="ghost" className="gap-2 bg-background/40 
                                  backdrop-blur-sm border 
                                  border-primary/20 hover:bg-background/60 
                                  hover:border-primary/30">
  <ArrowLeft className="h-4 w-4" />
  Back to Dashboard
</Button>
```

**Security Features Grid (Bottom of Login):**
```tsx
<div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-center">
  <div className="p-3 bg-card/70 backdrop-blur-xl rounded-lg 
                  border border-primary/20 hover:border-primary/30 
                  transition-smooth">
    <div className="text-lg mb-1">🏭</div>
    <div className="text-xs text-muted-foreground">Manufacturing</div>
  </div>
  {/* Similar for 2FA, Analytics, NXT Tags */}
</div>
```

---

### 1.4 Header Changes (Post-Login)

**Current Slosh Header:**
```tsx
<div className="border-b bg-card/80 backdrop-blur-sm rounded-t-lg p-6">
  <div className="flex items-center gap-3">
    <Factory className="w-6 h-6 text-primary-foreground" />
    <h1 className="text-2xl font-bold">Manufacturing Dashboard</h1>
  </div>
  <Button><RefreshCw className="w-4 h-4" /> Refresh</Button>
</div>
```

**Change to Veritas Header:**
```tsx
<div className="bg-card border-b border-border/50 shadow-card">
  <div className="px-6 py-4">
    <div className="flex items-center justify-between">
      <div className="flex items-center gap-4">
        <Button variant="ghost" onClick={() => navigate("/")} 
                className="gap-2">
          <ArrowLeft className="h-4 w-4" />
          Back
        </Button>
        <div>
          <h1 className="text-heading text-xl">
            Manufacturer Portal
          </h1>
          <p className="text-sm text-muted-foreground">
            Pernod Ricard NXT Management System
          </p>
        </div>
      </div>
      <div className="flex items-center gap-3">
        <div className="text-right">
          <div className="text-sm font-medium text-primary">
            Administrator
          </div>
          <div className="text-xs text-muted-foreground">
            pernod_admin
          </div>
        </div>
        <ThemeToggle />
        <Button onClick={() => setIsLoggedIn(false)} 
                variant="outline" size="sm" className="gap-2">
          <LogOut className="h-4 w-4" />
          Logout
        </Button>
      </div>
    </div>
  </div>
</div>
```

---

### 1.5 Layout Structure Change

**Current Slosh (Flat):**
```tsx
<div className="min-h-screen bg-gradient-to-br ...">
  <div className="max-w-6xl mx-auto p-6">
    {/* Header */}
    {/* Tabs */}
    {/* Content based on activeTab */}
  </div>
</div>
```

**Change to Veritas (With Sidebar):**
```tsx
<div className="min-h-screen bg-background flex">
  {/* Side Panel */}
  <SidePanel activeSection={activeSection} 
             onSectionChange={setActiveSection} />

  {/* Main Content */}
  <div className="flex-1 flex flex-col">
    {/* Header */}
    <div className="bg-card border-b border-border/50 shadow-card">
      {/* Header content */}
    </div>

    {/* Content Area */}
    <div className="flex-1 p-6 overflow-auto">
      <div className="flex gap-6 h-full">
        {/* Main Content */}
        <div className="flex-1">
          {renderSectionContent()}
        </div>
        
        {/* Live Feed Sidebar - Only on dashboard */}
        {activeSection === 'dashboard' && (
          <div className="w-80 flex-shrink-0">
            <LiveFeed />
          </div>
        )}
      </div>
    </div>
  </div>
</div>
```

---

### 1.6 Background Components

**Remove:**
```tsx
className="bg-gradient-to-br from-background via-secondary/20 to-accent/30"
```

**Add:**
```tsx
// In login state:
<div className="min-h-screen bg-background relative flex items-center justify-center p-6">
  <FuturisticBackground intensity="medium" />
  {/* Login card content */}
</div>

// In authenticated state:
// Use simple bg-background (FuturisticBackground only on login)
```

---

## 2. RISK ASSESSMENT PAGE - Required Changes

### Current State (Slosh):
- Simplified alert data structure (5 properties per alert)
- Tab-based navigation (Overview, Alerts, Hotspots, Cases, Intelligence)
- Alert cards displayed inline
- No investigation modal
- No detailed technical data
- No evidence chain or forensic analysis

### Target State (Veritas):
- Comprehensive alert data structure (10+ properties)
- Investigation Modal Dialog system
- Deep-dive detail views for alerts
- Device information, scan analysis, evidence chain
- Network analysis and threat assessment
- Related incidents tracking

---

### 2.1 Alert Data Structure Expansion

**Current Slosh Alert:**
```tsx
interface AlertData {
  id: number;
  type: string; // "HIGH", "MEDIUM", "LOW"
  location: string;
  description: string;
  severity: string;
}

const alertsData = [
  { id: 1, type: "HIGH", location: "Johannesburg CBD", 
    description: "Coordinated counterfeit operation", severity: "Critical" },
];
```

**Expand to Veritas Alert:**
```tsx
interface AlertData {
  id: number;
  type: string; // "HIGH", "MEDIUM", "LOW"
  location: string;
  description: string;
  timestamp: string; // "12 minutes ago"
  scans: number; // 47
  severity: string; // "Critical", "Medium", "Low"
  retailer: string; // "Street Vendors Network"
  confidence: number; // 94
  category: string; // "Organized Crime", "Surveillance", "Tag Tampering"
  evidence: string[]; // ["Pattern matching", "Geographic clustering"]
}

const securityData = {
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
  alerts: [
    {
      id: 1,
      type: "HIGH",
      location: "Johannesburg CBD",
      description: "Coordinated counterfeit operation",
      timestamp: "12 minutes ago",
      scans: 47,
      severity: "Critical",
      retailer: "Street Vendors Network",
      confidence: 94,
      category: "Organized Crime",
      evidence: ["Pattern matching", "Geographic clustering"]
    }
  ],
  threatIntelligence: {
    knownCounterfeiters: 47,
    suspiciousSuppliers: 23,
    blacklistedLocations: 156,
    compromisedTags: 89,
    activeInvestigations: 12,
    prosecutionsCases: 8
  },
  financialImpact: {
    estimatedLosses: 2850000,
    recoveredValue: 450000,
    investigationCosts: 125000,
    preventedLosses: 1200000,
    legalFees: 75000,
    complianceCosts: 89000
  }
};
```

---

### 2.2 Investigation Modal System

**Add State:**
```tsx
const [isInvestigationModalOpen, setIsInvestigationModalOpen] = useState(false);
const [selectedAlert, setSelectedAlert] = useState<AlertData | null>(null);

const handleInvestigate = (alert: AlertData) => {
  setSelectedAlert(alert);
  setIsInvestigationModalOpen(true);
};
```

**Add Modal Component:**
```tsx
const InvestigationModal = () => {
  const investigationData = getInvestigationDetails(selectedAlert);
  if (!selectedAlert || !investigationData) return null;

  return (
    <Dialog open={isInvestigationModalOpen} 
            onOpenChange={setIsInvestigationModalOpen}>
      <DialogContent className="max-w-6xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <Search className="h-5 w-5 text-primary" />
            Investigation Details - Alert #{selectedAlert.id}
          </DialogTitle>
        </DialogHeader>

        <div className="space-y-6">
          {/* See 2.3 below for modal sections */}
        </div>
      </DialogContent>
    </Dialog>
  );
};
```

---

### 2.3 Investigation Modal Sections

**Add Helper Function:**
```tsx
const getInvestigationDetails = (alert: AlertData | null) => {
  if (!alert) return null;

  return {
    alertTriggers: {
      primaryTrigger: alert.category === "Organized Crime" 
        ? "Pattern Recognition Algorithm" 
        : alert.category === "Surveillance" 
        ? "Behavioral Analysis System" 
        : "Hardware Authentication Failure",
      secondaryTriggers: [
        alert.category === "Organized Crime" 
          ? "Geographic clustering detected" 
          : "Device fingerprint mismatch",
        // ... more triggers
      ],
      confidenceScore: alert.confidence,
      riskFactors: [
        "Multiple locations involved",
        "Coordinated timing",
      ]
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
        productsScanned: ["Jameson Irish", "Chivas Regal"],
        nxtTagStatus: alert.category === "Tag Tampering" ? "Compromised" : "Authentication failed"
      }
    },
    evidenceChain: [
      {
        timestamp: "14:23:15",
        event: "Initial scan attempt detected",
        details: `Device ${alert.location} initiated scan`,
        evidenceType: "System Log",
        integrity: "Verified"
      },
      // ... more events
    ],
    threatAssessment: {
      immediateRisk: alert.type === "HIGH" ? "Critical" : "Moderate",
      impactRadius: alert.category === "Organized Crime" ? "City-wide" : "Local",
      estimatedLoss: alert.category === "Organized Crime" ? "R250,000 - R500,000" : "R5,000",
      recommendedActions: [
        "Immediate field investigation",
        "Coordinate with law enforcement"
      ],
      urgencyLevel: alert.type === "HIGH" ? "Immediate" : "24 hours"
    }
  };
};
```

**Modal Content Sections:**

**1. Alert Summary Card:**
```tsx
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
          <Badge variant={getRiskBadgeVariant(selectedAlert.type)}>
            {selectedAlert.type}
          </Badge>
        </div>
        <div className="flex justify-between">
          <span className="text-data-label">Category</span>
          <span className="font-medium">{selectedAlert.category}</span>
        </div>
        {/* Similar for Location, Confidence, Timestamp, Scans, Severity, Retailer */}
      </div>
    </div>
  </CardContent>
</Card>
```

**2. Alert Triggers Card:**
```tsx
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
            <span className="font-medium">
              {investigationData.alertTriggers.primaryTrigger}
            </span>
          </div>
        </div>
      </div>

      <div>
        <h4 className="font-semibold text-warning mb-2">Secondary Triggers</h4>
        <div className="grid md:grid-cols-2 gap-2">
          {investigationData.alertTriggers.secondaryTriggers.map(
            (trigger, index) => (
              <div key={index} 
                   className="p-2 bg-warning/10 border border-warning/20 
                             rounded-lg text-sm">
                <div className="flex items-center gap-2">
                  <AlertCircle className="h-3 w-3 text-warning" />
                  <span>{trigger}</span>
                </div>
              </div>
            )
          )}
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
```

**3. Device Information Card:**
```tsx
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
      {/* Device Type, OS Version, App Version, IP Address */}
    </div>
  </CardContent>
</Card>
```

**4. Scan Analysis Card:**
```tsx
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
        <span className="font-bold">
          {investigationData.technicalDetails.scanDetails.totalScans}
        </span>
      </div>
      {/* Failed Scans, Time Frame, Frequency, NXT Tag Status */}
    </div>
  </CardContent>
</Card>
```

---

### 2.4 Update Alert Display in Main Page

**Current Slosh Alert Card:**
```tsx
<div className={`bg-card border rounded-lg p-6 
               ${alert.type === "HIGH" ? "border-destructive/30" : ...}`}>
  <div className="flex items-start justify-between mb-3">
    <span className="...badge...">{alert.type} RISK</span>
  </div>
  <p className="text-sm mb-3 font-medium">{alert.description}</p>
  <div className="flex items-center justify-between">
    <span className="text-sm font-medium">{alert.severity}</span>
    <div className="flex gap-2">
      <Button size="sm" variant="outline">View</Button>
      <Button size="sm" variant="default">Investigate</Button>
    </div>
  </div>
</div>
```

**Add Investigate Handler:**
```tsx
<Button size="sm" variant="default" 
        onClick={() => handleInvestigate(alert)}>
  Investigate
</Button>
```

**Render Modal:**
```tsx
<InvestigationModal />

// After the main content
```

---

### 2.5 Helper Functions to Add

```tsx
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
```

---

## 3. STYLE CLASSES TO ADD/UPDATE

### Utility Classes Used in Veritas But Maybe Missing in Slosh:

```css
/* Shadow utilities */
.shadow-elevated (larger shadow than shadow-card)
.shadow-primary (colored shadow)

/* Custom gradient classes */
.gradient-primary { @apply bg-gradient-to-r from-primary to-primary/70; }
.gradient-success { @apply bg-gradient-to-r from-success to-success/70; }
.gradient-gold { @apply bg-gradient-to-r from-yellow-400 to-yellow-500; }

/* Card styling */
.card-professional
.transition-smooth
.text-heading (font styling)
.text-data-label (smaller label styling)
```

**Check if these are defined in:**
- `globals.css`
- `tailwind.config.js`
- Component-level CSS
- CSS variables

If missing, add to globals.css:
```css
.card-professional {
  @apply bg-card border border-border rounded-lg shadow-card;
}

.gradient-primary {
  @apply bg-gradient-to-r from-primary to-primary/70;
}

.gradient-success {
  @apply bg-gradient-to-r from-success to-success/70;
}

.transition-smooth {
  @apply transition-all duration-300 ease-in-out;
}

.shadow-elevated {
  @apply shadow-lg;
}

.shadow-primary {
  @apply shadow-lg shadow-primary/20;
}
```

---

## 4. ICON SIZE CONVERSIONS

| Veritas | Slosh | Context |
|---------|-------|---------|
| h-8 w-8 | w-6 h-6 | Large icons (headers, login) |
| h-5 w-5 | w-4 h-4 | Medium icons (badges, titles) |
| h-4 w-4 | h-3 w-3 | Small icons (inline, alerts) |

**Update all icon sizes to match Veritas patterns.**

---

## 5. COMPONENT IMPORTS TO ADD

### For Manufacturer Page:
```tsx
import { Stack, SidePanel, LiveFeed } from "@/components";
import BatchManager from "@/components/BatchManager";
import ManufacturerAnalytics from "@/components/ManufacturerAnalytics";
import BrandAnalytics from "@/components/BrandAnalytics";
import ReportsAnalytics from "@/components/ReportsAnalytics";
import SystemSettings from "@/components/SystemSettings";
import FuturisticBackground from "@/components/FuturisticBackground";
import { ThemeToggle } from "@/components/ThemeToggle";
```

### For RiskAssessment Page:
```tsx
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Badge } from "@/components/ui/badge";
```

---

## 6. STATE MANAGEMENT UPDATES

### Manufacturer Page:
```tsx
const [isLoggedIn, setIsLoggedIn] = useState(false);
const [showTwoFA, setShowTwoFA] = useState(false);
const [credentials, setCredentials] = useState({ username: "", password: "" });
const [twoFACode, setTwoFACode] = useState("");
const [activeSection, setActiveSection] = useState("dashboard");
```

### RiskAssessment Page:
```tsx
const [isRefreshing, setIsRefreshing] = useState(false);
const [selectedAlert, setSelectedAlert] = useState<AlertData | null>(null);
const [isInvestigationModalOpen, setIsInvestigationModalOpen] = useState(false);
```

