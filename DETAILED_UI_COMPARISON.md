# Detailed UI Comparison: VerifiAI Scanner Pages
**veritas-scan-track vs slosh-monorepo**

---

## SECTION 1: PAGE STRUCTURE & LAYOUT

### 1.1 Overall Container Structure
| Aspect | Veritas VerifiAI.tsx | Slosh VerifiAIPage.tsx |
|--------|----------------------|----------------------|
| **Main Container** | `<div className="min-h-screen bg-gradient-to-br from-background via-secondary/20 to-accent/30">` Full-height gradient background | `<div className="min-h-screen bg-background">` Simple background |
| **Max Width Wrapper** | `<div className="container mx-auto px-6 py-6">` in header, then separate content container | `<div className="max-w-6xl mx-auto p-6">` Wraps everything |
| **Content Alignment** | `<div className="max-w-2xl mx-auto space-y-8">` Narrower, centered, large gaps | Full width dashboard layout |
| **Spacing System** | Generous spacing: `space-y-8` and `py-8`, `py-6` | Tighter spacing: `p-6`, `gap-6` |

### 1.2 Header Section
**Veritas:**
```tsx
<div className="border-b bg-card/80 backdrop-blur-sm">
  <div className="container mx-auto px-6 py-6">
    <div className="flex items-center gap-4">
      <Button variant="ghost" ... />
      <Scan className="h-8 w-8 text-success" />
      <div>
        <h1 className="text-2xl font-bold text-primary">Verifi-AI Scanner</h1>
        <p className="text-muted-foreground">Consumer alcohol authentication system</p>
      </div>
    </div>
  </div>
</div>
```
- Separate header bar with border-bottom
- Back button, icon (h-8 w-8), title, subtitle
- Blur effect: `bg-card/80 backdrop-blur-sm`
- Styling: border-b, py-6, px-6

**Slosh:**
```tsx
<div className="bg-card border border-border rounded-lg p-6 mb-8 shadow-sm">
  <div className="flex items-center justify-between gap-4 flex-col sm:flex-row">
    <div className="flex items-center gap-3">
      <div className="w-12 h-12 bg-gradient-to-br from-primary to-primary/70 rounded-lg ...">
        <Smartphone className="w-6 h-6 text-primary-foreground" />
      </div>
      <div>
        <h1 className="text-2xl font-bold text-card-foreground">NFC Scanner</h1>
        <p className="text-sm text-muted-foreground">Product Authentication & Verification</p>
      </div>
    </div>
    <Button size="sm" variant="gradient-primary"><RefreshCw className="w-4 h-4" /> Scan New</Button>
  </div>
</div>
```
- Contained card within page (not full-width bar)
- Icon in gradient box (from-primary to-primary/70)
- Button on right: "Scan New" with refresh icon
- More compact: rounded-lg, p-6, mb-8
- h-12 w-12 icon box vs h-8 w-8 inline icon

**CHANGES NEEDED:**
- Remove header bar separation, integrate into card
- Add "Scan New" button to right
- Create icon gradient box: `w-12 h-12 bg-gradient-to-br from-primary to-primary/70 rounded-lg`
- Reduce icon size from h-8 w-8 to h-6 w-6
- Add responsive flex: `flex-col sm:flex-row`
- Remove back button

---

## SECTION 2: LOGIN FLOW

### 2.1 Login Interface
**Veritas:**
- Full dedicated login card with:
  - User icon (h-6 w-6 centered)
  - Title: "Access Verifi-AI Scanner"
  - Subtitle: "Please login to continue"
  - Three fields: Username, Email (Optional), Password
  - Password toggle (Eye/EyeOff icons)
  - Submit button with Lock icon: "Access Scanner"
  - Info text: "This is a demonstration login system"
  - Shadow: `shadow-premium`
  - Max width: `max-w-2xl mx-auto`

**Slosh:**
- NO LOGIN INTERFACE
- Direct dashboard access

**CHANGES NEEDED:**
- Remove entire login UI from VerifiAIPage if implementing Veritas version
- OR: Add login flow to VerifiAIPage (implement full login card)

---

## SECTION 3: TABS & NAVIGATION

### 3.1 Tab Structure
**Veritas:**
- NO TABS - Uses conditional rendering based on state
- Two main states: `isLoggedIn` boolean
- When logged in: NFC Status → Scanner Interface → Scan Results

**Slosh:**
```tsx
const tabs = ["Scan", "Results", "History", "Analytics"] as const;
type Tab = typeof tabs[number];

<div className="flex gap-2 mb-6 border-b border-border pb-4">
  {tabs.map((tab) => (
    <button key={tab} onClick={() => setActiveTab(tab)} 
      className={`px-4 py-2 text-sm font-medium border-b-2 transition-colors 
      ${activeTab === tab ? "text-primary border-primary" : "text-muted-foreground border-transparent hover:text-foreground"}`}>
      {tab}
    </button>
  ))}
</div>
```
- Underline tab style (border-b-2)
- Active: text-primary border-primary
- Inactive: text-muted-foreground border-transparent
- Spacing: px-4 py-2
- Font: text-sm font-medium
- Responsive bottom border: `border-b border-border pb-4`

**CHANGES NEEDED:**
- Add tab component similar to Slosh
- Implement 4 tabs: Scan, Results, History, Analytics
- Use border-b-2 underline styling
- Color states: primary when active, muted-foreground when inactive

---

## SECTION 4: NFC STATUS CARD

### 4.1 NFC Status Display
**Veritas:**
```tsx
<Card>
  <CardContent className="p-6">
    <div className="flex items-center gap-4">
      <Wifi className={`h-5 w-5 ${demoMode ? 'text-warning' : NXTSupported ? 'text-success' : 'text-muted-foreground'}`} />
      <div>
        <p className="font-semibold">NFC Status</p>
        <p className="text-sm text-muted-foreground">
          {demoMode ? "Demo mode enabled - simulated scanning" : NXTSupported ? "NFC Ready - Tap bottle to scan" : "NFC not supported - Demo mode active"}
        </p>
      </div>
      <Badge variant={demoMode ? "outline" : NXTSupported ? "default" : "secondary"} className="ml-auto">
        {demoMode ? "Demo" : NXTSupported ? "NFC" : "Demo"}
      </Badge>
    </div>
  </CardContent>
</Card>
```
- Conditional icon color based on state
- Badge on right: dynamic variant
- No border styling (uses default Card)
- Spacing: gap-4, p-6

**Slosh:**
- NO NFC STATUS CARD - Not present in interface

**CHANGES NEEDED:**
- Slosh missing this component - could add if needed

---

## SECTION 5: SCAN INTERFACE & BUTTON STYLING

### 5.1 Scan Area Button
**Veritas:**
```tsx
<Card className="shadow-premium relative">
  {/* Demo Mode Toggle in top right */}
  <div className="absolute top-4 right-4 flex items-center gap-2 z-10">
    <Label htmlFor="demo-mode" className="text-xs text-muted-foreground">Demo</Label>
    <Switch id="demo-mode" checked={demoMode} onCheckedChange={setDemoMode} className="scale-75" />
  </div>
  
  <CardContent className="p-8 text-center">
    {!isScanning ? (
      <div className="space-y-6">
        <div className="w-24 h-24 mx-auto rounded-full gradient-primary shadow-gold flex items-center justify-center">
          <Scan className="h-12 w-12 text-white" />
        </div>
        <div>
          <h3 className="text-xl font-semibold mb-2">Ready to Scan</h3>
          <p className="text-muted-foreground">Tap the button below...</p>
        </div>
        <Button 
          onClick={startNXTScan}
          size="lg"
          className="gradient-security shadow-security transition-premium hover:scale-105"
        >
          {demoMode ? "Start Demo Scan" : NXTSupported ? "Start NFC Scan" : "Start Demo Scan"}
        </Button>
      </div>
    ) : (
      /* Scanning state */
    )}
  </CardContent>
</Card>
```
- Circular icon container: `w-24 h-24 rounded-full gradient-primary shadow-gold`
- Icon: h-12 w-12 (large)
- Button: gradient-security, shadow-security, hover:scale-105
- Demo toggle switch in absolute position (top-4 right-4)
- Shadow: shadow-premium on card

**Slosh:**
```tsx
<div className="border-2 border-dashed border-primary rounded-lg p-12 text-center mb-6 bg-card">
  <div className="w-20 h-20 bg-primary/10 rounded-lg flex items-center justify-center mx-auto mb-6">
    <Radio className="w-10 h-10 text-primary" />
  </div>
  <h2 className="text-2xl font-semibold text-card-foreground mb-2">Ready to Scan</h2>
  <p className="text-muted-foreground mb-6">Place your device near an NFC tag or product</p>
  <Button>Start Scanning</Button>
</div>
```
- DASHED BORDER: `border-2 border-dashed border-primary`
- Icon box: square `rounded-lg`, not circular
- Larger padding: `p-12`
- Icon: w-10 h-10 (medium, not large)
- Icon background: `bg-primary/10` (subtle fill)
- Button: standard, no gradient styling
- No demo toggle

**CHANGES NEEDED FOR SLOSH to match Veritas:**
- Change border from dashed to solid
- Make icon container circular: `rounded-full` instead of `rounded-lg`
- Enlarge icon to h-12 w-12
- Change icon background to gradient: `gradient-primary`
- Add shadow: `shadow-gold`
- Add demo toggle switch in top-right absolute position
- Add gradient button: `gradient-security shadow-security hover:scale-105`
- Reduce padding: `p-8` instead of `p-12`
- Add card shadow: `shadow-premium`

---

## SECTION 6: KPI CARDS

### 6.1 KPI Card Styling
**Veritas:**
- NO KPI CARDS (has different scan result cards instead)

**Slosh:**
```tsx
{kpis.map((kpi) => (
  <div key={kpi.label} className="relative overflow-hidden bg-gradient-to-br from-card to-card/50 dark:from-card dark:to-card/70 border-0 rounded-lg shadow-card hover:shadow-elevated transition-all duration-200">
    <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-primary to-primary/70"></div>
    <div className="p-6">
      <div className="flex items-start justify-between">
        <div className="space-y-1">
          <p className="text-sm font-medium text-muted-foreground">{kpi.label}</p>
          <p className="text-3xl font-bold text-card-foreground">{kpi.value}</p>
        </div>
        <div className="p-3 rounded-xl bg-gradient-to-br from-primary to-primary/70 shadow-primary">
          <kpi.icon className="w-6 h-6 text-white" />
        </div>
      </div>
    </div>
  </div>
))}
```
- Top border gradient: `absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-primary to-primary/70`
- Card background: `bg-gradient-to-br from-card to-card/50`
- Border: `border-0` (none)
- Spacing: `p-6`
- Icon box: `p-3 rounded-xl bg-gradient-to-br from-primary to-primary/70 shadow-primary`
- Icon size: `w-6 h-6 text-white`
- Layout: flex justify-between (label left, icon right)
- Hover effect: `hover:shadow-elevated transition-all duration-200`
- Grid: `grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6`

**CHANGES NEEDED FOR VERITAS to have KPI cards:**
- Veritas doesn't have KPI section currently
- Could be added to scanner dashboard if desired

---

## SECTION 7: SCAN RESULT CARDS (Success/Unmatch/Unknown)

### 7.1 Success Result Card
**Veritas:**
```tsx
<Card className="border-success/20 bg-success/5">
  <CardHeader>
    <div className="flex items-center gap-2">
      <CheckCircle className="h-5 w-5 text-success" />
      <CardTitle className="text-success">Authentic Product Verified</CardTitle>
    </div>
  </CardHeader>
  <CardContent className="space-y-4">
    <div className="grid grid-cols-2 gap-4">
      <div>
        <p className="text-sm text-muted-foreground">Brand</p>
        <p className="font-semibold">{mockScanResults.success.brand}</p>
      </div>
      {/* More fields */}
    </div>
    <div className="bg-success/10 p-4 rounded-lg">
      <div className="flex items-center gap-2 mb-2">
        <MapPin className="h-4 w-4 text-success" />
        <span className="font-semibold text-success">Retailer Information</span>
      </div>
      <p className="text-sm">{mockScanResults.success.retailer}</p>
      <p className="text-sm font-semibold text-success">{mockScanResults.success.price}</p>
    </div>
  </CardContent>
</Card>
```
- Border: `border-success/20`
- Background: `bg-success/5`
- Icon: CheckCircle h-5 w-5 text-success
- Title color: `text-success`
- Content sections with grid: `grid grid-cols-2 gap-4`
- Sub-section: `bg-success/10 p-4 rounded-lg`
- Conditional info box with MapPin icon

**Veritas Unmatch Result:**
```tsx
<Card className="border-warning/20 bg-warning/5">
  <CardHeader>
    <div className="flex items-center gap-2">
      <AlertTriangle className="h-5 w-5 text-warning" />
      <CardTitle className="text-warning">Verification Mismatch</CardTitle>
    </div>
  </CardHeader>
  <CardContent className="space-y-4">
    <div className="space-y-2">
      <p className="font-semibold text-warning">{mockScanResults.unmatch.brand}</p>
      <p className="text-sm">{mockScanResults.unmatch.details}</p>
      <Badge variant="destructive" className="gradient-alert">
        {mockScanResults.unmatch.risk} RISK
      </Badge>
    </div>
    <div className="bg-warning/10 p-4 rounded-lg">
      <p className="text-sm font-semibold mb-2">Report Suspicious Product</p>
      <Button size="sm" className="gradient-alert">File Report</Button>
    </div>
  </CardContent>
</Card>
```
- Border: `border-warning/20`
- Background: `bg-warning/5`
- Icon: AlertTriangle h-5 w-5 text-warning
- Badge: `variant="destructive" className="gradient-alert"`
- Sub-section: `bg-warning/10 p-4 rounded-lg`

**Veritas Unknown Result:**
```tsx
<Card className="border-destructive/20 bg-destructive/5">
  <CardHeader>
    <div className="flex items-center gap-2">
      <XCircle className="h-5 w-5 text-destructive" />
      <CardTitle className="text-destructive">Scan Failed</CardTitle>
    </div>
  </CardHeader>
  <CardContent className="space-y-4">
    <div className="space-y-2">
      <p className="font-semibold">{mockScanResults.unknown.error}</p>
      <p className="text-sm text-muted-foreground">{mockScanResults.unknown.suggestion}</p>
    </div>
    <div className="bg-destructive/10 p-4 rounded-lg">
      <p className="text-sm font-semibold mb-2 text-destructive">Potential Illicit Product</p>
      <Button size="sm" variant="destructive" className="gradient-alert" onClick={() => setShowReportForm(true)}>
        <FileText className="h-4 w-4 mr-2" />
        Report Illicit Alcohol
      </Button>
    </div>
  </CardContent>
</Card>
```
- Border: `border-destructive/20`
- Background: `bg-destructive/5`
- Icon: XCircle h-5 w-5 text-destructive
- Button: `variant="destructive" className="gradient-alert"`

**Slosh:**
- NO INDIVIDUAL RESULT CARDS in Scan tab
- Has Results tab with product cards instead

**CHANGES NEEDED:**
- Slosh needs scan result cards similar to Veritas
- Create three result types: success (green), unmatch/warning (amber), unknown (red)
- Use semi-transparent background: bg-{color}/5
- Use semi-transparent borders: border-{color}/20
- Use semi-transparent info sections: bg-{color}/10
- Include relevant icons (CheckCircle, AlertTriangle, XCircle)

---

## SECTION 8: RESULTS TAB CARDS (Slosh-specific)

### 8.1 Product Result Cards
**Slosh Results Tab:**
```tsx
<div className="bg-card border border-border rounded-lg p-6 flex gap-5 flex-col sm:flex-row">
  <div className="w-24 h-24 bg-primary/10 rounded-lg flex items-center justify-center text-3xl flex-shrink-0">🥃</div>
  <div className="flex-1">
    <h3 className="text-base font-semibold text-card-foreground mb-1">{p.name}</h3>
    <span className={`text-xs font-medium px-3 py-1 rounded-full inline-block mb-2 ${p.status === "authentic" ? "bg-success/10 text-success" : "bg-warning/10 text-warning"}`}>{p.statusLabel}</span>
    <p className="text-sm text-muted-foreground">SKU: {p.sku} • Batch: {p.batch}</p>
    <div className="flex gap-2 mt-3">
      {p.actions.map((a) => <Button key={a} variant="outline" size="sm">{a}</Button>)}
    </div>
  </div>
</div>
```
- Card: `bg-card border border-border rounded-lg p-6`
- Flexible layout: `flex gap-5 flex-col sm:flex-row`
- Emoji section: `w-24 h-24 bg-primary/10 rounded-lg flex-shrink-0`
- Badge: status-specific color (success or warning)
- Action buttons: `variant="outline" size="sm"`
- Typography: text-base, text-xs, text-sm

**CHANGES NEEDED:**
- Slosh has this pattern (good), Veritas doesn't need it

---

## SECTION 9: TABLE STYLING (History Tab)

### 9.1 Scan History Table
**Slosh History Tab:**
```tsx
<div className="relative overflow-hidden bg-gradient-to-br from-card to-card/50 dark:from-card dark:to-card/70 border-0 rounded-lg shadow-card">
  <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-primary to-primary/70"></div>
  <div className="p-6">
    <div className="flex items-center justify-between mb-4 pb-3 border-b border-border">
      <h3 className="text-lg font-semibold text-card-foreground flex items-center gap-2">
        <Clock className="w-5 h-5" /> Scan History
      </h3>
      <Button variant="outline" size="sm">Export</Button>
    </div>
    <div className="overflow-x-auto">
      <table className="w-full">
        <thead>
          <tr className="border-b border-border">
            {["Product", "Status", "Location", "Timestamp", "Action"].map((h) => (
              <th key={h} className="text-left text-sm font-semibold text-muted-foreground py-3 px-3">{h}</th>
            ))}
          </tr>
        </thead>
        <tbody>
          {historyData.map((h) => (
            <tr key={h.time} className="border-b border-border hover:bg-primary/5 transition-colors">
              <td className="py-3 px-3 text-sm text-card-foreground">{h.product}</td>
              <td className="py-3 px-3">
                <span className={`text-xs font-medium px-3 py-1 rounded-full ${h.status === "Verified" ? "bg-success/10 text-success" : "bg-warning/10 text-warning"}`}>{h.status}</span>
              </td>
              <td className="py-3 px-3 text-sm text-muted-foreground">{h.location}</td>
              <td className="py-3 px-3 text-sm text-muted-foreground">{h.time}</td>
              <td className="py-3 px-3"><Button variant="outline" size="sm">View</Button></td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  </div>
</div>
```

**Table Styling Details:**
- Container: gradient `from-card to-card/50`, h-1 top border gradient
- Header border: `pb-3 border-b border-border`
- Table header cells: `text-left text-sm font-semibold text-muted-foreground py-3 px-3`
- Rows: `border-b border-border hover:bg-primary/5 transition-colors`
- Cell padding: `py-3 px-3`
- Status badges: color-based (success/warning variants)
- Action buttons: `variant="outline" size="sm"`

**Veritas:**
- NO TABLE in main interface (only scan results cards)

---

## SECTION 10: REPORT FORM (Veritas-specific)

### 10.1 Illicit Alcohol Report Form
**Veritas Report Modal:**
```tsx
{showReportForm && (
  <Card className="border-destructive/20 bg-destructive/5 shadow-premium">
    <CardHeader>
      <div className="flex items-center gap-2">
        <FileText className="h-5 w-5 text-destructive" />
        <CardTitle className="text-destructive">Report Illicit Alcohol Product</CardTitle>
      </div>
      <p className="text-sm text-muted-foreground">Help protect consumers...</p>
    </CardHeader>
    <CardContent className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div className="space-y-2">
          <Label htmlFor="productName">Product Name *</Label>
          <Input id="productName" placeholder="e.g., Jameson Irish Whiskey" ... />
        </div>
        <div className="space-y-2">
          <Label htmlFor="retailer">Retailer/Store</Label>
          <Input id="retailer" placeholder="e.g., Local Liquor Store" ... />
        </div>
      </div>
      
      <div className="space-y-2">
        <Label htmlFor="location">Location *</Label>
        <Input id="location" placeholder="e.g., Johannesburg, Gauteng" ... />
      </div>

      <div className="space-y-2">
        <Label htmlFor="suspiciousDetails">Suspicious Details *</Label>
        <Textarea id="suspiciousDetails" placeholder="Describe what makes this product suspicious..." rows={4} />
      </div>

      <div className="border-t pt-4">
        <h4 className="font-semibold mb-4 flex items-center gap-2">
          <User className="h-4 w-4" />
          Contact Information (Optional)
        </h4>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="space-y-2">
            <Label htmlFor="contactName">Full Name</Label>
            <Input id="contactName" placeholder="Your full name" ... />
          </div>
          
          <div className="space-y-2">
            <Label htmlFor="contactPhone">Phone Number</Label>
            <div className="relative">
              <Phone className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
              <Input id="contactPhone" placeholder="+27 123 456 789" className="pl-10" ... />
            </div>
          </div>
        </div>
        
        <div className="space-y-2 mt-4">
          <Label htmlFor="contactEmail">Email Address</Label>
          <div className="relative">
            <Mail className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
            <Input id="contactEmail" type="email" placeholder="your.email@example.com" className="pl-10" ... />
          </div>
        </div>
      </div>

      <div className="flex gap-4 pt-4">
        <Button onClick={handleReportSubmit} className="flex-1 gradient-alert shadow-security" disabled={...}>
          <FileText className="h-4 w-4 mr-2" />
          Submit Report
        </Button>
        <Button variant="outline" onClick={() => setShowReportForm(false)} className="flex-1">
          Cancel
        </Button>
      </div>

      <div className="bg-muted/50 p-4 rounded-lg">
        <p className="text-sm text-muted-foreground">
          <strong>Note:</strong> Your report will be forwarded to relevant authorities...
        </p>
      </div>
    </CardContent>
  </Card>
)}
```

**Form Styling Details:**
- Card border: `border-destructive/20 bg-destructive/5 shadow-premium`
- Grid layout for fields: `grid grid-cols-1 md:grid-cols-2 gap-4`
- Input fields: standard with placeholders
- Icon inputs: relative positioning with icon `absolute left-3 top-3`
- Input padding for icons: `pl-10`
- Required field indicators: *
- Textarea: `rows={4}`
- Button layout: `flex gap-4` with `flex-1` (equal width)
- Info box: `bg-muted/50 p-4 rounded-lg`
- Divider: `border-t pt-4`

**Slosh:**
- NO REPORT FORM

**CHANGES NEEDED:**
- Add report form modal/card to Slosh if implementing Veritas flow

---

## SECTION 11: ICON STYLING

### 11.1 Icons Used
**Veritas Icons:**
- Scan (h-8 w-8 in header, h-12 w-12 in scanner, h-4 w-4 details)
- ArrowLeft (h-4 w-4)
- CheckCircle (h-5 w-5)
- AlertTriangle (h-5 w-5)
- XCircle (h-5 w-5)
- Wifi (h-5 w-5)
- MapPin (h-4 w-4)
- FileText (h-5 w-5)
- Phone (h-4 w-4)
- Mail (h-4 w-4)
- User (h-6 w-6, h-4 w-4)
- Lock (h-4 w-4)
- Eye/EyeOff (h-4 w-4)

**Slosh Icons:**
- Smartphone (w-6 h-6)
- RefreshCw (w-4 h-4)
- Radio (w-10 h-10)
- BarChart3 (w-6 h-6)
- CheckCircle (w-5 h-5)
- AlertTriangle (w-5 h-5)
- Shield (w-6 h-6)
- Clock (w-5 h-5)
- TrendingUp (w-5 h-5)
- Target (w-5 h-5)
- Bell (w-5 h-5)

**Color Patterns:**
- **Veritas**: Semantic colors (text-primary, text-success, text-warning, text-destructive, text-white)
- **Slosh**: Semantic colors (text-primary-foreground, text-card-foreground, text-white)

---

## SECTION 12: CARD STYLING & BORDERS

### 12.1 Card Borders and Shadows
| Type | Veritas | Slosh |
|------|---------|-------|
| **Regular Card** | No border specified, default Card styles | `border border-border` |
| **Success Card** | `border-success/20 bg-success/5` | N/A individually in scan tab |
| **Warning Card** | `border-warning/20 bg-warning/5` | N/A individually |
| **Destructive Card** | `border-destructive/20 bg-destructive/5` | N/A individually |
| **KPI Card Shadow** | Default | `shadow-card`, `hover:shadow-elevated` |
| **Report Card** | `shadow-premium` | N/A |
| **NFC Card** | Default Card | N/A |

### 12.2 Background Gradients
**Veritas:**
- Page background: `bg-gradient-to-br from-background via-secondary/20 to-accent/30`
- Gradient classes: `gradient-primary`, `gradient-security`, `gradient-alert`

**Slosh:**
- Page background: `bg-background` (flat)
- KPI cards: `bg-gradient-to-br from-card to-card/50 dark:from-card dark:to-card/70`
- Top border gradient: `bg-gradient-to-r from-primary to-primary/70`
- Icon box: `bg-gradient-to-br from-primary to-primary/70`

---

## SECTION 13: TYPOGRAPHY & TEXT FORMATTING

### 13.1 Heading Hierarchy
**Veritas:**
- Page title: `text-2xl font-bold text-primary`
- Card titles: CardTitle component (appears to be text-lg/xl)
- Section heading in result: `text-xl font-semibold`
- Field labels: Label component (text-sm)
- Helper text: `text-sm text-muted-foreground`

**Slosh:**
- Page title: `text-2xl font-bold text-card-foreground`
- Card titles: `text-lg font-semibold text-card-foreground`
- KPI label: `text-sm font-medium text-muted-foreground`
- KPI value: `text-3xl font-bold text-card-foreground`
- Table header: `text-sm font-semibold text-muted-foreground`
- Helper text: `text-sm text-muted-foreground`

**CHANGES NEEDED:**
- Veritas uses `text-primary` for headings, Slosh uses `text-card-foreground`
- KPI values are larger in Slosh (text-3xl)

---

## SECTION 14: SPACING & PADDING

### 14.1 Spacing Patterns
| Element | Veritas | Slosh |
|---------|---------|-------|
| **Page padding** | px-6, py-8 per section | p-6 (max-w-6xl wrapper) |
| **Card padding** | p-6, p-8 (content area) | p-6 |
| **Section gap** | space-y-8 (large) | gap-6, mb-6 |
| **Grid gaps** | gap-4 (fields), gap-6 (KPI) | gap-6, gap-5 |
| **Internal gaps** | gap-2 to gap-4 | gap-2 to gap-3 |
| **Card header padding** | Inherited from CardHeader | Inherited from Card styling |

**CHANGES NEEDED:**
- Slosh uses more consistent p-6 throughout
- Veritas uses varying padding (p-6, p-8)

---

## SECTION 15: BUTTON STYLING

### 15.1 Button Variants and States
**Veritas:**
```
- Primary login: 
  className="w-full gradient-primary shadow-gold transition-premium hover:scale-105"

- Scanner button: 
  className="gradient-security shadow-security transition-premium hover:scale-105"

- Report/Alert button: 
  className="gradient-alert shadow-security"

- Stop/Normal button:
  variant="outline"

- Header back button:
  variant="ghost"
```

**Slosh:**
```
- Primary button (Scan New):
  variant="gradient-primary"

- Buttons in cards:
  variant="outline" size="sm"

- View/Action buttons:
  variant="outline" size="sm"

- Export button:
  variant="outline" size="sm"

- Report button (implied):
  default or gradient variants
```

**Custom Classes in Veritas:**
- `gradient-primary`: Navy blue gradient
- `gradient-security`: Green gradient (for scan)
- `gradient-alert`: Red gradient (for warnings)
- `shadow-gold`: Gold-tinted shadow
- `shadow-security`: Green-tinted shadow
- `shadow-premium`: Enhanced shadow
- `transition-premium`: Smooth transitions

**CHANGES NEEDED:**
- Verify `gradient-security` and `gradient-alert` custom classes exist
- Ensure shadow classes are defined in Tailwind config
- Add `hover:scale-105` transitions to appropriate buttons
- Match button sizing expectations

---

## SECTION 16: ANIMATIONS & INTERACTIVE ELEMENTS

### 16.1 Animations
**Veritas:**
- Scan icon: `animate-spin` (while scanning)
- Gradient circle: `animate-pulse` (scanner ready state)
- Button hover: `hover:scale-105`
- Transitions: `transition-premium` custom class
- Demo toggle switch: `scale-75`

**Slosh:**
- Status indicator: `animate-pulse-dot` (spinning dot)
- Hover effects: `hover:bg-accent/50 transition-colors`
- Transitions: `transition-all duration-200`, `transition-colors`
- Progress bar: static width with gradient

**CHANGES NEEDED:**
- Verify `animate-pulse-dot` custom animation exists
- Implement `transition-premium` class if not present
- Ensure `animate-spin` works as expected

---

## SECTION 17: RESPONSIVE DESIGN

### 17.1 Responsive Patterns
**Veritas:**
- Max-width containers: `max-w-2xl mx-auto`
- Flex wrap: `flex-col sm:flex-row` in header
- Grid responsive: implicit single column

**Slosh:**
- Max-width container: `max-w-6xl mx-auto`
- Header flex wrap: `flex-col sm:flex-row`
- Grid responsive: `grid-cols-1 sm:grid-cols-2 lg:grid-cols-4`
- Table: `overflow-x-auto` for mobile
- Card layouts: `flex-col sm:flex-row`

**CHANGES NEEDED:**
- Add more responsive grid layouts like Slosh
- Implement mobile-first approach in tabs
- Add overflow handling for tables

---

## SECTION 18: COLOR SCHEME DIFFERENCES

### 18.1 Color Usage
**Veritas:**
- Primary: Navy blue (`text-primary`)
- Success: Green
- Warning: Amber/Yellow
- Destructive: Red
- Security/Success gradient: Green (`gradient-security`)
- Alert gradient: Red (`gradient-alert`)
- Premium shadows: Gold-tinted

**Slosh:**
- Primary: Consistent primary color
- Success: Green with `bg-success/10 text-success`
- Warning: Amber with `bg-warning/10 text-warning`
- Cards: `text-card-foreground`
- Gradients: `from-primary to-primary/70`

**Semantic Color Mappings:**
- Veritas uses `text-success`, `text-warning`, `text-destructive`
- Slosh uses `text-success`, `text-warning` with background fills

---

## SECTION 19: DEMO MODE & STATE MANAGEMENT

### 19.1 State Management
**Veritas:**
```tsx
- isLoggedIn: boolean (main flow control)
- isScanning: boolean (scanner state)
- scanResult: "success" | "unmatch" | "unknown" | null
- showPassword: boolean (login form)
- loginForm: object with username, password, email
- showReportForm: boolean (report modal)
- reportForm: object with various fields
- NXTSupported: boolean (NFC capability)
- demoMode: boolean (toggle demo scanning)
- nfcReader: NDEFReader | null
- lastScannedTag: string
```

**Slosh:**
```tsx
- activeTab: Tab ("Scan" | "Results" | "History" | "Analytics")
```

**CHANGES NEEDED:**
- Implement state management similar to Veritas if replicating
- Add tab state for navigation

---

## SECTION 20: MISSING ELEMENTS COMPARISON

### 20.1 Elements Present in Veritas but Missing in Slosh
1. ✗ Login interface (full form with password toggle)
2. ✗ NFC status card
3. ✗ Demo mode toggle
4. ✗ Scan result cards (success/unmatch/unknown)
5. ✗ Report form modal
6. ✗ Info panel about how it works
7. ✗ Custom gradient classes (gradient-security, gradient-alert, etc.)
8. ✗ Premium shadow effects

### 20.2 Elements Present in Slosh but Missing in Veritas
1. ✗ Tab-based navigation
2. ✗ KPI cards with metrics
3. ✗ Active scans section
4. ✗ Results tab with product cards
5. ✗ History tab with table
6. ✗ Analytics tab with progress charts
7. ✗ Alert system (Recent Alerts section)

---

## SUMMARY OF REQUIRED CHANGES

### To make Slosh match Veritas:
1. Add login interface before scanner
2. Add NFC status card below header
3. Change scan area from dashed border to solid with circular gradient icon
4. Add demo mode toggle in scanner card
5. Add scan result cards for three outcome types
6. Add report form modal
7. Remove tabs and use conditional rendering
8. Add custom gradient and shadow classes
9. Implement full NFC state management
10. Add info panel

### To make Veritas match Slosh:
1. Replace login conditional with direct dashboard
2. Implement tab navigation system
3. Add KPI cards section
4. Add active scans section
5. Create Results tab with product cards
6. Create History tab with table
7. Create Analytics tab with charts
8. Remove NFC status card
9. Remove report form
10. Add alert/notification system

---

## CUSTOM CSS CLASSES REQUIRED

**Veritas custom classes to verify exist:**
```css
.gradient-primary { background: gradient primary navy }
.gradient-security { background: gradient green }
.gradient-alert { background: gradient red }
.shadow-gold { box-shadow: gold-tinted }
.shadow-security { box-shadow: green-tinted }
.shadow-premium { box-shadow: enhanced effect }
.transition-premium { transition: all 0.2s cubic-bezier(...) }
```

**Slosh custom classes to verify exist:**
```css
.animate-pulse-dot { animation: pulse effect on dot }
.shadow-card { box-shadow: card effect }
.shadow-elevated { box-shadow: elevated effect }
```

