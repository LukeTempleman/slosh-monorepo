# Complete Page Structure & Styling Comparison
## veritas-scan-track vs slosh-monorepo

**Generated:** April 13, 2026  
**Scope:** All three major page pairs

---

## 📋 COMPARISON 1: Manufacturer Pages

### File Paths
- **Veritas:** veritas-scan-track/src/pages/Manufacturer.tsx
- **Slosh:** slosh-monorepo/apps/manufacture/src/pages/ManufacturerPage.tsx

---

### 1.1 Page Architecture & Overall Structure

#### VERITAS Structure:
- **Two-Stage System:**
  1. **Login/Auth Gate** - Required before accessing main dashboard
  2. **Authenticated Dashboard** - Main content area with sidebar

- **Authentication Flow:**
  ```
  Credentials input → 2FA verification → Authenticated state
  ```
  - Login page shows: Username, Password fields
  - 2FA stage: 6-digit code input with emoji (🔐)
  - Toast notifications for feedback

- **Layout Architecture:**
  - `min-h-screen` with flex layout
  - Two parallel sections when logged in: Main content + Sidebar
  - FuturisticBackground component for visual depth

#### SLOSH Structure:
- **Direct Dashboard Access** - No auth required
- **Single Flat Layout:**
  - Header at top
  - Tab navigation below header
  - Content area displays tab-based sections
- **Background:** Gradient-to-br background (via Tailwind classes directly)

#### Differences:
| Aspect | Veritas | Slosh |
|--------|---------|-------|
| Auth | REQUIRED (multi-step) | NONE |
| Initial Loading | Login card | Direct dashboard |
| Layout Pattern | Sidebar + Main | Tabs + Content |
| Navigation Type | Dynamic section rendering | Tab-based switching |
| Sidebar | Yes (persistent) | No |
| Live Feed | Yes (dynamic widget) | No |

---

### 1.2 Login/Authentication Section

#### VERITAS Login Page Elements:
```tsx
// Card styling
className="card-professional bg-card/85 backdrop-blur-xl 
           border-primary/20 shadow-elevated hover:border-primary/30 
           transition-smooth"

// Input fields
className="border border-primary/20 rounded-lg bg-background/60 
           backdrop-blur-sm focus:ring-2 focus:ring-primary"

// Buttons
- Sign In: className="gradient-primary"
- Verify & Continue: className="gradient-success"
- Back: className="bg-background/40 border border-primary/20"
```

**Veritas Login Features:**
- Company branding (Pernod Ricard)
- Factory icon with gradient background
- 2FA code with custom styling (tracking-widest, text-center)
- Demo credentials shown in placeholder text
- Security features grid at bottom (4 cards)
  - 🏭 Manufacturing, 🔐 2FA Security, 📊 Analytics, 🏷️ NXT Tags
  - Each card: p-3, bg-card/70, border-primary/20, hover:border-primary/30

#### Slosh:
- **No login section** - Direct dashboard access

#### Styling Differences:
| Element | Veritas | Slosh |
|---------|---------|-------|
| Login Card | card-professional, bg-card/85, backdrop-blur-xl | N/A |
| Input Border | border-primary/20 | N/A |
| Input Background | bg-background/60, backdrop-blur-sm | N/A |
| Focus State | focus:ring-2 focus:ring-primary | N/A |
| Buttons | gradient-primary/success | N/A |
| Icon Size | h-8 w-8 | N/A |

---

### 1.3 Header Section Styling

#### VERITAS Header (Post-Login):
```tsx
className="bg-card border-b border-border/50 shadow-card"

// Inside header
px-6 py-4 // Padding
gap-4 // Icon/text spacing
text-heading text-xl // Typography

// Right side
- Administrator label
- Theme toggle
- Logout button with icon
```

**Visual Elements:**
- Grid with "pernod_admin" username displayed
- Back button with ArrowLeft icon
- Company portal name: "Manufacturer Portal"
- Subtitle: "Pernod Ricard NXT Management System"

#### SLOSH Header:
```tsx
// Header container
className="border-b bg-card/80 backdrop-blur-sm rounded-t-lg 
           p-6 mb-8 shadow-sm"

// Icon + Text area
gap-3 // spacing between icon and text

// Icons
<Factory className="w-6 h-6 text-primary-foreground" />

// Text
h1: text-2xl font-bold
p: text-sm text-muted-foreground

// Right side
Refresh button only (no theme toggle, no logout)
```

#### Header Differences:
| Aspect | Veritas | Slosh |
|---------|---------|-------|
| Background | bg-card, border-bottom | bg-card/80, rounded-top |
| Padding | px-6 py-4 | p-6 |
| Icon Size | h-8 w-8 | w-6 h-6 |
| Subtitle Present | Yes | Yes |
| Theme Toggle | YES | NO |
| Logout Button | YES (with icon) | NO |
| User Display | YES (Administrator) | NO |
| Refresh Button | NO | YES (only action) |

---

### 1.4 Navigation Structure

#### VERITAS Navigation:
**SidePanel Component:**
- Persistent sidebar on left
- Section-based navigation (not tabs)
- Dynamic section changes trigger `renderSectionContent()`
- Sections:
  - dashboard
  - batch-manager
  - analytics
  - reports
  - settings
- Component rendering: Each section maps to a different component module

**Displayed Sections:**
```jsx
case "dashboard": return <ManufacturerAnalytics />;
case "batch-manager": return <BatchManager />;
case "analytics": return <BrandAnalytics />;
case "reports": return <ReportsAnalytics />;
case "settings": return <SystemSettings />;
```

#### SLOSH Navigation:
**Tab-Based System:**
- Horizontal tabs below header
- Tab states: Overview, Batches, Quality, Reports, Analytics
- Direct inline content rendering (not separate components)
- Tab styling:
  ```tsx
  className={`px-4 py-2 text-sm font-medium border-b-2 
              transition-colors whitespace-nowrap
              ${activeTab === tab 
                ? "text-primary border-primary" 
                : "text-muted-foreground border-transparent hover:text-foreground"}`}
  ```

#### Navigation Differences:
| Aspect | Veritas | Slosh |
|--------|---------|-------|
| Type | Sidebar panel | Horizontal tabs |
| Navigation Area | Left side (persistent) | Below header |
| Scrollable | No (fixed) | Yes (overflow-x-auto) |
| Component Model | Modular (separate components) | Inline (single file) |
| Styling Approach | SidePanel component | Conditional rendering |
| Active State | Dynamic section state | Tab comparison |
| Visual Indicator | Unknown (see SidePanel) | Border-bottom-2 |

---

### 1.5 KPI/Metrics Cards Styling

#### VERITAS:
- **No generic KPI cards visible** (uses separate component modules)
- Components like ManufacturerAnalytics likely contain KPI displays
- Styling likely includes:
  - gradient-primary on icons
  - Custom styling per component

#### SLOSH KPI Cards:
```tsx
className="relative overflow-hidden bg-gradient-to-br 
           from-card to-card/50 dark:from-card dark:to-card/70 
           border-0 rounded-lg shadow-card 
           hover:shadow-elevated transition-all duration-200"

// Top accent bar
className="absolute top-0 left-0 w-full h-1 
           bg-gradient-to-r from-primary to-primary/70"

// Card content
p-6 // padding

// Icon styling
className="p-3 rounded-xl bg-gradient-to-br from-primary 
           to-primary/70 shadow-primary"
// Icon size: w-6 h-6
```

**SLOSH KPI Layout:**
```
├─ Card (4 columns on lg, 2 on sm, 1 on mobile)
│  ├─ Top accent bar (h-1)
│  └─ Content
│     ├─ Icon area (right-aligned)
│     └─ Label + Value
│        ├─ Label: text-sm font-medium, muted-foreground
│        └─ Value: text-3xl font-bold
```

**SLOSH KPI Data:**
4 cards in grid:
- Total Batches: 324
- Verified: 312
- Issues: 12
- Quality Score: 98.2%

#### KPI Differences:
| Aspect | Veritas | Slosh |
|--------|---------|-------|
| Card Background | Unknown | bg-gradient-to-br, multiple colors |
| Card Border | Unknown | border-0 (no border) |
| Accent Bar (top) | Unknown | YES, gradient bar |
| Icon Background | gradient-primary (assumed) | gradient-to-br, shadow-primary |
| Icon Size | Unknown (h-8?) | w-6 h-6 |
| Value Font Size | Unknown | text-3xl font-bold |
| Layout | Unknown | grid-responsive |

---

### 1.6 Content Sections Styling

#### SLOSH Content Areas:

**Overview Tab - Production/Quality Cards:**
```tsx
className="relative overflow-hidden bg-gradient-to-br 
           from-card to-card/50 dark:from-card dark:to-card/70 
           border-0 rounded-lg shadow-card hover:shadow-elevated"

// Accent bar (specific colors per card)
// Production: from-primary to-primary/70
// Quality: from-success to-success/70
```

**Batches Tab - Table Container:**
```tsx
className="relative overflow-hidden bg-gradient-to-br 
           from-card to-card/50 dark:from-card dark:to-card/70 
           border-0 rounded-lg shadow-card"

// Table styling
tr: "border-b border-border hover:bg-primary/5 transition-colors"
th: "text-left text-sm font-semibold text-muted-foreground py-3 px-3"
td: "py-3 px-3"

// Status badge
className="bg-success/10 text-success" // for Completed
className="bg-primary/10 text-primary" // for In Progress
className="bg-muted/10 text-muted-foreground" // for Pending
```

**Quality Tab - Alert Containers:**
```tsx
className="p-4 rounded-lg bg-warning/10 border border-warning/30 
           flex gap-3 items-start"
className="p-4 rounded-lg bg-success/10 border border-success/30 
           flex gap-3 items-start"
```

#### Content Styling Summary:
| Element | Styling |
|---------|---------|
| Content Cards | bg-gradient-to-br, shadow-card, border-0 |
| Accent Bars | h-1, gradient-to-r, color-coded |
| Tables | border-border separators, hover:bg-primary/5 |
| Alert Cards | bg-{color}/10, border-{color}/30 |
| Icons in alerts | w-5 h-5, flex-shrink-0, mt-0.5 |
| Badges | px-3 py-1, rounded-full, bg-{color}/10 text-{color} |

---

### 1.7 Background & Overall Page Styling

#### VERITAS:
```tsx
className="min-h-screen bg-background relative flex items-center 
           justify-center p-6"

// Has FuturisticBackground component
<FuturisticBackground intensity="medium" />
```

#### SLOSH:
```tsx
className="min-h-screen bg-gradient-to-br 
           from-background via-secondary/20 to-accent/30"
```

#### Differences:
| Aspect | Veritas | Slosh |
|--------|---------|-------|
| Background Type | Solid + animated component | Gradient-to-br |
| Animation | YES (FuturisticBackground) | NO (static gradient) |
| Colors | background color | background → secondary → accent |
| Gradient Direction | N/A (animated) | br (bottom-right) via blend |

---

### 1.8 Button Variants

#### VERITAS Buttons:
```tsx
// Sign In / Verify
className="w-full gradient-primary" 
className="w-full gradient-success"

// Back button in header
className="gap-2" (with ArrowLeft icon)

// Logout
className="gap-2"
```

#### SLOSH Buttons:
```tsx
// Refresh
<Button size="sm" variant="gradient-primary">
  <RefreshCw className="w-4 h-4" /> Refresh
</Button>

// Tab buttons
// interactive with border-b-2 state

// New Batch / View
variant="outline"
size="sm"

// Quality alerts actions
// Built into alert cards
```

#### Button Differences:
| Aspect | Veritas | Slosh |
|--------|---------|-------|
| Primary Button | gradient-primary (full width) | gradient-primary (w/ icon) |
| Secondary | gradient-success | outline |
| Icon Sizes | h-4 w-4 (assumed) | w-4 h-4 |
| Size Variants | Standard, w-full | "sm" size |

---

### SUMMARY: Manufacturer Page Changes Needed

To make **ManufacturerPage.tsx match Manufacturer.tsx**:

**MAJOR STRUCTURAL CHANGES:**
1. ❌ Remove tab-based navigation → Replace with sidebar panel navigation
2. ❌ Remove inline content rendering → Add separate component imports
3. ❌ Add authentication system (login + 2FA)
4. ❌ Add FuturisticBackground component
5. ✅ Keep similar KPI card styling (already similar)

**STYLING CHANGES:**
1. Update header with user display + logout button (remove refresh button)
2. Add Theme Toggle to header
3. Update card accent bars (h-1 gradient bars match already)
4. Add sidebar styling configuration
5. Add login page styling (background, cards, inputs, buttons)

**COMPONENT CHANGES:**
1. Split content into separate component modules:
   - ManufacturerAnalytics
   - BatchManager
   - BrandAnalytics
   - ReportsAnalytics
   - SystemSettings
   - LiveFeed (sidebar)

2. Import SidePanel component for navigation

---

## 📋 COMPARISON 2: Risk Assessment Pages

### File Paths
- **Veritas:** veritas-scan-track/src/pages/RiskAssessment.tsx
- **Slosh:** slosh-monorepo/apps/risk-assessment/src/pages/RiskAssessmentPage.tsx

---

### 2.1 Page Architecture & Overall Structure

#### VERITAS Structure:
- **Single page application** - No login gating
- **Stateful with Modal Support:**
  - Main view with KPI cards, tabs, and alert list
  - Investigation Modal overlay
  - Investigation modal displays complex forensic data
- **Layout:**
  - Full-screen content without sidebar
  - KPI grid at top
  - Tab-based content section below
  - Alerts can trigger a detailed investigation modal

#### SLOSH Structure:
- **Tab-based architecture** (same as Manufacturer)
- Tabs: Overview, Alerts, Hotspots, Cases, Intelligence
- Direct inline content rendering (no modals)
- No investigation modal system

#### Differences:
| Aspect | Veritas | Slosh |
|--------|---------|-------|
| Modal System | YES (Investigation modal) | NO |
| Investigation Detail | Dialog + 90vh height | N/A |
| Data Complexity | Extensive (device info, scan analysis, evidence) | Simplified |
| Navigation | Could have modals over tabs | Pure tabs |
| Layout Pattern | Tab-based with modal overlay | Tab-based only |

---

### 2.2 Data Structure Complexity

#### VERITAS Data Structure:
```jsx
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
      id, type, location, description, timestamp, scans,
      severity, retailer, confidence, category, evidence[]
    }
  ],
  
  threatIntelligence: { /* 6 metrics */ },
  financialImpact: { /* 6 metrics */ },
  hotspots: [ /* 3+ locations with detailed arrays */ ],
  supplyChain: [ /* supplier data with arrays */ ],
  forensicPatterns: [ /* 3+ patterns with details */ ],
  brandMetrics: { /* multiple brands with metrics */ },
  trendData: [ /* monthly trend arrays */ ]
}
```

**Alert Data Structure:**
```jsx
interface AlertData {
  id: number;
  type: string; // "HIGH", "MEDIUM", "LOW"
  location: string;
  description: string;
  timestamp: string;
  scans: number;
  severity: string; // "Critical", "Medium", "Low"
  retailer: string;
  confidence: number; // percentage
  category: string; // "Organized Crime", "Surveillance", "Tag Tampering"
  evidence: string[];
}
```

#### SLOSH Data Structure:
```jsx
const kpis = [
  { label: "Risk Score", value: "7.2/10", icon: TrendingUp },
  { label: "Active Cases", value: "23", icon: Search },
  { label: "Threat Level", value: "ELEVATED", icon: AlertTriangle },
  { label: "Detection Rate", value: "96.6%", icon: CheckCircle },
];

const alertsData = [
  {
    id, type, location, description, severity
    // 5 properties only
  }
];
```

#### Data Structure Differences:
| Aspect | Veritas | Slosh |
|--------|---------|-------|
| Alerts per item | 10+ properties | 5 properties |
| Nested data | YES (forensics, suppliers, etc.) | NO |
| Financial data | YES (losses, recovery, etc.) | NO |
| Supply chain | YES (detailed supplier data) | NO |
| Brand metrics | YES (brands breakdown) | NO |
| Trend data | YES (monthly data) | NO |
| Evidence arrays | YES | NO |
| Investigation helpers | YES (getInvestigationDetails) | NO |
| Modal state | YES (investigation modal) | NO |

---

### 2.3 Investigation Modal System

#### VERITAS Investigation Modal:
```tsx
<Dialog open={isInvestigationModalOpen} 
        onOpenChange={setIsInvestigationModalOpen}>
  <DialogContent className="max-w-6xl max-h-[90vh] overflow-y-auto">
    <DialogHeader>
      <DialogTitle className="flex items-center gap-2">
        <Search className="h-5 w-5 text-primary" />
        Investigation Details - Alert #{selectedAlert.id}
      </DialogTitle>
    </DialogHeader>
```

**Modal Sections:**
1. **Alert Summary Card**
   - 2-column grid
   - Alert Type, Category, Location, Confidence (left)
   - Timestamp, Scans, Severity, Retailer (right)
   - Uses Badge components for type indicators

2. **Alert Triggers Card**
   - Primary Trigger (p-3 bg-primary/10 border-primary/20)
   - Secondary Triggers (grid md:grid-cols-2)
   - Risk Factors (space-y-1)

3. **Technical Details Cards** (2-column grid)
   - **Device Information:**
     - Device ID, Device Type, OS Version, App Version, IP Address
     - Uses font-mono for code values
   - **Scan Analysis:**
     - Total Scans, Failed Scans, Time Frame, Frequency, NXT Tag Status
     - Bold values for emphasis

4. **Evidence Chain** (continued in file)
5. **Network Analysis** (continued in file)
6. **Related Incidents** (continued in file)
7. **Threat Assessment** (continued in file)

**Modal Card Styling:**
```tsx
className="card-professional"

// Inside cards
<CardHeader>
  <CardTitle className="text-heading flex items-center gap-2">
    <IconComponent className="h-5 w-5 text-{color}" />
    Title
  </CardTitle>
</CardHeader>
<CardContent>
  <div className="grid md:grid-cols-2 gap-4">
    <div className="space-y-3">
      <div className="flex justify-between">
        <span className="text-data-label">Label</span>
        <span className="font-medium">Value</span>
      </div>
    </div>
  </div>
</CardContent>
```

#### SLOSH Investigation View:
- **No modal** - Uses tab content instead
- Alerts displayed in simple cards:
  ```tsx
  className="bg-card border rounded-lg p-6"
  // Border color based on type
  ${alert.type === "HIGH" ? "border-destructive/30" : 
    alert.type === "MEDIUM" ? "border-warning/30" : 
    "border-success/30"}
  ```

#### Investigation System Differences:
| Aspect | Veritas | Slosh |
|--------|---------|-------|
| Modal System | YES (Dialog) | NO |
| Modal Size | max-w-6xl max-h-[90vh] | N/A |
| Overflow | overflow-y-auto | N/A |
| Detail Level | 7+ card sections | 1 simplified card |
| Device Details | YES (ID, type, OS, app, IP) | NO |
| Scan Analysis | Detailed (total, failed, timeframe) | NO |
| Evidence Chain | YES (4+ events) | NO |
| Network Analysis | YES (device clusters) | NO |
| Related Incidents | YES (list with data) | NO |
| Threat Assessment | YES (risk details) | NO |

---

### 2.4 Alert Display Styling

#### VERITAS Alert Card (in main view):
```tsx
// Alert would be displayed in a list or grid
// (Investigation modal is the detail view)
// Main alerts shown in tabs or sections

// Based on investigation modal structure,
// alerts use Badge and color-coded styling
```

#### SLOSH Alert Cards:
```tsx
className="bg-card border rounded-lg p-6"

// Border colors
${alert.type === "HIGH" ? "border-destructive/30" : 
  alert.type === "MEDIUM" ? "border-warning/30" : 
  "border-success/30"}

// Badge styling
className="text-xs font-medium px-3 py-1 rounded-full"
${alert.type === "HIGH" ? "bg-destructive/10 text-destructive" : ...}

// Content layout
<div className="flex items-start justify-between mb-3">
  <span className="...badge...">HIGH RISK</span>
  <span className="flex items-center gap-1 text-sm">
    <MapPin className="h-3 w-3" />
    {alert.location}
  </span>
</div>

// Description
<p className="text-sm mb-3 font-medium">{alert.description}</p>

// Actions
<Button size="sm" variant="outline">View</Button>
<Button size="sm" variant="default">Investigate</Button>
```

#### Alert Styling Differences:
| Element | Veritas | Slosh |
|--------|---------|-------|
| Card Background | Unknown (in modal) | bg-card |
| Card Border | Unknown | color-coded borders |
| Type Badge | Color-coded | px-3 py-1, rounded-full |
| Badge Background | Inferred from modal | {color}/10 {color}/70 |
| Location Display | In modal details | Inline with MapPin icon |
| Icon Sizes | h-5 w-5 (modal) | h-3 w-3 (inline) |
| Action Buttons | In modal | View + Investigate buttons |

---

### 2.5 Hotspots/Cases Sections

#### SLOSH Hotspots Tab:
```tsx
className="relative overflow-hidden bg-gradient-to-br 
           from-card to-card/50 dark:from-card dark:to-card/70 
           border-0 rounded-lg shadow-card"

// Accent bar
className="absolute top-0 left-0 w-full h-1 
           bg-gradient-to-r from-primary to-primary/70"

// Hotspot items
className="p-4 border border-border rounded-lg"

// Risk badge
className="text-xs font-medium px-2 py-1 rounded 
           bg-destructive/10 text-destructive" // HIGH
className="text-xs font-medium px-2 py-1 rounded 
           bg-warning/10 text-warning" // MEDIUM

// Progress bar
<div className="w-full h-2 bg-muted rounded-full overflow-hidden">
  <div className="h-full bg-destructive rounded-full" 
       style={{ width: "23.4%" }} />
</div>
```

**Hotspots Data:**
- Johannesburg CBD: HIGH risk, 23.4% illicit rate, 1,247 scans
- Cape Town CBD: MEDIUM risk, 12.8% illicit rate, 892 scans

#### SLOSH Cases Tab:
```tsx
// Table in card container (same gradient styling)
<table className="w-full">
  <thead>
    <tr className="border-b border-border">
      <th className="text-left text-sm font-semibold 
                    text-muted-foreground py-3 px-3">
        {header}
      </th>
    </tr>
  </thead>
  <tbody>
    <tr className="border-b border-border hover:bg-primary/5 
                  transition-colors">
      <td className="py-3 px-3 text-sm font-medium">{value}</td>
    </tr>
  </tbody>
</table>
```

**Cases Data:**
- Case ID, Location, Status, Priority, Date, Action columns
- 2 example cases

#### Hotspots/Cases Styling:
| Element | Styling |
|---------|---------|
| Container | bg-gradient-to-br, border-0, shadow-card |
| Accent Bar | h-1, gradient-to-r {color} |
| Item Cards | p-4, border-border, rounded-lg |
| Risk Badge | px-2 py-1, {color}/10 {color} |
| Progress Bars | h-2, rounded-full, width-based |
| Tables | border-b-border, hover:bg-primary/5 |
| Headers | text-muted-foreground, py-3 px-3 |

---

### 2.6 Header & KPI Styling

#### SLOSH Header:
```tsx
className="border-b bg-card/80 backdrop-blur-sm rounded-t-lg 
           p-6 mb-8 shadow-sm"

// Icon
<Shield className="w-6 h-6 text-primary-foreground" />

// Title
h1: text-2xl font-bold text-card-foreground
p: text-sm text-muted-foreground

// Refresh button
<Button size="sm" variant="gradient-primary">
  <RefreshCw className="w-4 h-4" /> Refresh
</Button>
```

#### SLOSH KPI Cards (Overview tab):
```tsx
className="relative overflow-hidden bg-gradient-to-br 
           from-card to-card/50 dark:from-card dark:to-card/70 
           border-0 rounded-lg shadow-card 
           hover:shadow-elevated transition-all duration-200"

// Grid layout
grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6

// Icon styling
className="p-3 rounded-xl bg-gradient-to-br from-primary 
           to-primary/70 shadow-primary"
```

**KPI Values:**
- Risk Score: 7.2/10
- Active Cases: 23
- Threat Level: ELEVATED
- Detection Rate: 96.6%

#### Lower KPI Cards:
```tsx
// Risk Trend card
className="absolute top-0 left-0 w-full h-1 
           bg-gradient-to-r from-destructive to-destructive/70"

// Threat Status card
className="absolute top-0 left-0 w-full h-1 
           bg-gradient-to-r from-warning to-warning/70"

// Status breakdown (Critical, Medium, Low counts)
<div className="flex justify-between">
  <span className="text-sm text-muted-foreground">Critical</span>
  <span className="font-medium text-destructive">3</span>
</div>
```

---

### 2.7 Tab Navigation

#### SLOSH Tab Navigation:
```tsx
const tabs = ["Overview", "Alerts", "Hotspots", "Cases", "Intelligence"];

<div className="flex gap-2 mb-6 border-b border-border pb-4 
               overflow-x-auto">
  {tabs.map((tab) => (
    <button 
      onClick={() => setActiveTab(tab)}
      className={`px-4 py-2 text-sm font-medium border-b-2 
                 transition-colors whitespace-nowrap 
                 ${activeTab === tab 
                   ? "text-primary border-primary" 
                   : "text-muted-foreground border-transparent 
                     hover:text-foreground"}`}
    >
      {tab}
    </button>
  ))}
</div>
```

---

### 2.8 Intelligence Tab Content

#### SLOSH Intelligence Tab:
```tsx
// Intelligence Summary Card
className="relative overflow-hidden bg-gradient-to-br 
           from-card to-card/50 dark:from-card dark:to-card/70 
           border-0 rounded-lg shadow-card"

// Summary grid
<div className="grid grid-cols-1 md:grid-cols-3 gap-4">
  <div className="p-3 bg-muted/30 rounded-lg">
    <div className="text-2xl font-bold text-destructive">47</div>
    <div className="text-sm text-muted-foreground">Known Threats</div>
  </div>
  {/* Similar for other items */}
</div>

// Recent Alerts section (within intelligence)
className="background-gradient card with accent bar"
// Alert items with icons and descriptions
```

**Intelligence Data:**
- 47 Known Threats (destructive color)
- 23 Suspicious Suppliers (warning color)
- 156 Blacklisted Locations (primary color)

---

### SUMMARY: RiskAssessment Page Changes Needed

To make **RiskAssessmentPage.tsx match RiskAssessment.tsx**:

**MAJOR STRUCTURAL CHANGES:**
1. ❌ Add Investigation Modal Dialog system
2. ❌ Expand alert data structure (add evidence arrays, confidence, category fields)
3. ✅ Keep tab-based navigation (structure matches)

**DATA STRUCTURE CHANGES:**
1. Add comprehensive securityData object with:
   - Real-time stats (activeUsers, systemHealth, threatLevel, etc.)
   - Threat intelligence metrics
   - Financial impact data
   - Hotspots array with detailed location data
   - Supply chain analysis
   - Forensic patterns
   - Brand metrics breakdowns
   - Trend data

2. Expand AlertData interface to include:
   - confidence percentage
   - category (Organization Crime, Surveillance, Tag Tampering)
   - evidence array
   - retailer field

**COMPONENT CHANGES:**
1. Add Investigation Modal component logic:
   ```jsx
   const getInvestigationDetails(alert) // Helper function
   const InvestigationModal() // Component function
   ```

2. Modal should display:
   - Alert Summary (2-column grid)
   - Alert Triggers (primary + secondary + risk factors)
   - Device Information Card
   - Scan Analysis Card
   - Evidence Chain Section
   - Network Analysis
   - Related Incidents
   - Threat Assessment

**STYLING CHANGES:**
1. Alert cards remain similar (already styled)
2. Add modal card styling (card-professional)
3. Add modal dialog styling (max-w-6xl max-h-[90vh])
4. Add detailed technical display styling (font-mono for IDs/IPs)
5. Add evidence chain styling (timestamp, event, details, type, integrity)

---

## 📋 COMPARISON 3: VerifiAI Pages

**Status:** This comparison was completed in previous session.  
**Reference:** See DETAILED_UI_COMPARISON.md and other existing comparison documents in slosh-monorepo root.

**Key Finding Summary:**
- Tab-based architecture (similar)
- More detailed investigation capabilities in Veritas
- Different data structures and complexity levels
- Styling patterns consistent with other Veritas pages

---

## 🎯 OVERALL PATTERN ANALYSIS

### Veritas Design Patterns:
1. **Authentication Gate** - Multi-factor login system
2. **Modal Investigation System** - Deep-dive detail views
3. **Component Modularization** - Separate modules for features
4. **Enhanced Visual Design:**
   - Gradient backgrounds
   - FuturisticBackground animations
   - Premium card styling
   - Color-coded severity indicators

### Slosh Design Patterns:
1. **Direct Access** - No authentication
2. **Tab-Based Navigation** - Horizontal tabs for sections
3. **Inline Content** - All content in single file
4. **Simplified Data** - Focused metrics
5. **Consistent Styling:**
   - Gradient cards (from-card to-card/50)
   - Accent bars (h-1 gradient bars)
   - Color-coded badges and progress bars
   - Responsive grid layouts

### Color Coding Standards (Both Projects):
| Severity | Colors | Usage |
|----------|--------|-------|
| Critical/High | destructive/red | High-risk alerts, critical metrics |
| Medium | warning/orange | Medium-risk alerts, warnings |
| Low/Success | success/green | Low-risk, successful items |
| Info/Primary | primary/blue | Informational, primary actions |
| Neutral | muted/gray | Neutral data, secondary info |

---

## 📊 Conversion Difficulty Matrix

| Change Area | Difficulty | Time Est. | Impact |
|------------|-----------|----------|--------|
| Add Authentication | HIGH | 2-3 hrs | MAJOR |
| Add Sidebar Navigation | HIGH | 2-3 hrs | MAJOR |
| Component Modularization | HIGH | 3-4 hrs | MAJOR |
| Investigation Modal System | MEDIUM | 2-3 hrs | MAJOR |
| Data Structure Expansion | MEDIUM | 1-2 hrs | MEDIUM |
| Styling Updates | LOW | 1-2 hrs | MEDIUM |
| Background Animations | MEDIUM | 1-2 hrs | LOW |

**Total Estimated Time:** 12-20 hours for full Slosh → Veritas conversion

---

## 📝 Implementation Priority

### Phase 1: Data Structure (Start Here)
- [ ] Expand alert data interfaces
- [ ] Create comprehensive securityData object
- [ ] Add helper functions (getRiskColor, etc.)

### Phase 2: Authentication (Manufacturer Page)
- [ ] Create login component
- [ ] Add 2FA verification
- [ ] Add session state management
- [ ] Add FuturisticBackground component

### Phase 3: Navigation Restructure (Both Pages)
- [ ] Create SidePanel component (Manufacturer)
- [ ] Create separate feature components
- [ ] Update routing logic
- [ ] Add theme toggle integration

### Phase 4: Investigation System (Risk Assessment)
- [ ] Create Investigation Modal component
- [ ] Add investigation detail logic
- [ ] Implement modal styling
- [ ] Add evidence chain display

### Phase 5: Styling Polish
- [ ] Update card styling consistency
- [ ] Add accent bars to all cards
- [ ] Update button variants
- [ ] Add animation transitions

