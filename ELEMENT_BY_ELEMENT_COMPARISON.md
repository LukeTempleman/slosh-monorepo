# Element-by-Element Visual Comparison

## 1. HEADER STYLING

### Veritas Header
```
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
│ [←] [🔍] Verifi-AI Scanner
│           Consumer alcohol auth system
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

Layout:
- Full-width strip (border-b)
- Back button with ArrowLeft icon
- Icon: h-8 w-8 text-success
- Title: text-2xl font-bold text-primary
- Subtitle: text-muted-foreground
- Backdrop: bg-card/80 backdrop-blur-sm
- No rounded corners
```

**Code:**
```tsx
<div className="border-b bg-card/80 backdrop-blur-sm">
  <div className="container mx-auto px-6 py-6">
    <div className="flex items-center gap-4">
      <Button variant="ghost" onClick={() => navigate("/")} className="gap-2">
        <ArrowLeft className="h-4 w-4" />
        Back
      </Button>
      <Scan className="h-8 w-8 text-success" />
      <div>
        <h1 className="text-2xl font-bold text-primary">Verifi-AI Scanner</h1>
        <p className="text-muted-foreground">Consumer alcohol authentication system</p>
      </div>
    </div>
  </div>
</div>
```

### Slosh Header
```
┌──────────────────────────────────────────┐
│ [📱 in box] NFC Scanner      [↻ Scan New]│
│             Product Auth...               │
└──────────────────────────────────────────┘

Layout:
- Contained card (border all sides)
- Icon in gradient box: w-12 h-12
- Title: text-2xl font-bold text-card-foreground
- Subtitle: text-sm text-muted-foreground
- Button on right: variant="gradient-primary"
- Rounded corners: rounded-lg
- Shadow: shadow-sm
- Padding: p-6
- Margin: mb-8
```

**Code:**
```tsx
<div className="bg-card border border-border rounded-lg p-6 mb-8 shadow-sm">
  <div className="flex items-center justify-between gap-4 flex-col sm:flex-row">
    <div className="flex items-center gap-3">
      <div className="w-12 h-12 bg-gradient-to-br from-primary to-primary/70 rounded-lg flex items-center justify-center">
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

---

## 2. SCAN INTERFACE STYLING

### Veritas Scanner Card
```
┌────────────────────────────────────────────┐
│                Demo [•••] ↗ (top-right)    │
│                                            │
│                ⭕ (green gradient)         │
│               /  \                         │
│              |  🔍  | (h-12 w-12)         │
│               \  /                         │
│                                            │
│         Ready to Scan                      │
│      Tap button below and hold...         │
│                                            │
│   [🟢 Start NFC Scan] (green gradient)    │
│                                            │
└────────────────────────────────────────────┘

Layout:
- Card shadow: shadow-premium
- Icon circle: w-24 h-24 rounded-full gradient-primary shadow-gold
- Icon: h-12 w-12 text-white
- Button: gradient-security shadow-security hover:scale-105
- Padding: p-8
- Demo toggle: absolute top-4 right-4
- Can animate to scanning state
```

**Code:**
```tsx
<Card className="shadow-premium relative">
  <div className="absolute top-4 right-4 flex items-center gap-2 z-10">
    <Label htmlFor="demo-mode" className="text-xs text-muted-foreground">Demo</Label>
    <Switch id="demo-mode" checked={demoMode} onCheckedChange={setDemoMode} className="scale-75" />
  </div>
  
  <CardContent className="p-8 text-center">
    <div className="space-y-6">
      <div className="w-24 h-24 mx-auto rounded-full gradient-primary shadow-gold flex items-center justify-center">
        <Scan className="h-12 w-12 text-white" />
      </div>
      <div>
        <h3 className="text-xl font-semibold mb-2">Ready to Scan</h3>
        <p className="text-muted-foreground">Tap the button below and hold your device...</p>
      </div>
      <Button 
        onClick={startNXTScan}
        size="lg"
        className="gradient-security shadow-security transition-premium hover:scale-105"
      >
        Start NFC Scan
      </Button>
    </div>
  </CardContent>
</Card>
```

### Slosh Scanner Card
```
╌ ╌ ╌ ╌ ╌ ╌ ╌ ╌ ╌ ╌ (dashed border)
│                                    │
│              ▢ (box)              │
│             /   \                 │
│            |  📶  | (w-10 h-10)   │
│             \   /                 │
│                                    │
│         Ready to Scan              │
│    Place device near NFC tag      │
│                                    │
│     [Start Scanning] (default)    │
│                                    │
╌ ╌ ╌ ╌ ╌ ╌ ╌ ╌ ╌ ╌

Layout:
- Dashed border: border-2 border-dashed border-primary
- Icon square: w-20 h-20 rounded-lg bg-primary/10
- Icon: w-10 h-10 text-primary
- Button: default (no gradient)
- Padding: p-12
- No demo toggle
- Static (no scanning state animation)
```

**Code:**
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

---

## 3. SCAN RESULT CARDS

### Veritas - Success Result
```
┌─────────────────────────────────────┐ ← border-success/20
│ [✓] Authentic Product Verified      │ ← bg-success/5
├─────────────────────────────────────┤ ← text-success
│ Brand: Jameson     | Batch: 2024-SA │
│ Date: 2024-08-15   | Origin: Cork   │
│                                     │
│ ┌──────────────────────────────────┐│
│ │ [📍] Retailer Information        ││ ← bg-success/10
│ │ Makro Menlyn, Pretoria           ││
│ │ R 329.99                         ││
│ └──────────────────────────────────┘│
└─────────────────────────────────────┘

Colors:
- Border: border-success/20
- Background: bg-success/5
- Icon: text-success
- Title: text-success
- Sub-section: bg-success/10
```

**Code:**
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
    </div>
  </CardContent>
</Card>
```

### Veritas - Warning Result
```
┌─────────────────────────────────────┐ ← border-warning/20
│ [⚠️] Verification Mismatch           │ ← bg-warning/5
├─────────────────────────────────────┤ ← text-warning
│ Suspected Counterfeit               │
│ NXT tag detected but failed          │
│ [HIGH RISK] badge                   │
│                                     │
│ ┌──────────────────────────────────┐│
│ │ Report Suspicious Product        ││ ← bg-warning/10
│ │ [File Report] button             ││
│ └──────────────────────────────────┘│
└─────────────────────────────────────┘

Colors:
- Border: border-warning/20
- Background: bg-warning/5
- Icon: text-warning (AlertTriangle)
- Title: text-warning
- Sub-section: bg-warning/10
- Badge: variant="destructive" gradient-alert
```

### Veritas - Error Result
```
┌─────────────────────────────────────┐ ← border-destructive/20
│ [❌] Scan Failed                    │ ← bg-destructive/5
├─────────────────────────────────────┤ ← text-destructive
│ Unable to read NXT tag              │
│ Product may be illicit or damaged   │
│                                     │
│ ┌──────────────────────────────────┐│
│ │ Potential Illicit Product        ││ ← bg-destructive/10
│ │ [Report Illicit Alcohol] button  ││ ← variant="destructive"
│ └──────────────────────────────────┘│
└─────────────────────────────────────┘

Colors:
- Border: border-destructive/20
- Background: bg-destructive/5
- Icon: text-destructive (XCircle)
- Title: text-destructive
- Sub-section: bg-destructive/10
- Button: variant="destructive" gradient-alert
```

### Slosh - No Result Cards in Scan Tab
- Results are shown in separate "Results" tab
- Product cards have emoji icon box and action buttons

---

## 4. KPI CARDS

### Slosh KPI Card
```
┌─ ─ ─ ─ ─ ─ ─ ─ ─ ─ ─ ┐ ← h-1 gradient top border
│                       │ ← bg-gradient-to-br (from-card to-card/50)
│ Today              │  │ ← p-3 gradient icon box
│ 147  [Icon box]    │  │ ← w-6 h-6 icon
│      text-3xl      │  │
│      bold          │  │
│                   │
└─ ─ ─ ─ ─ ─ ─ ─ ─ ─ ─ ┘

Layout:
- Top border: absolute h-1 gradient-to-r from-primary to-primary/70
- Card: bg-gradient-to-br from-card to-card/50
- Padding: p-6
- Icon box: p-3 rounded-xl gradient-to-br from-primary to-primary/70 shadow-primary
- Icon: w-6 h-6 text-white
- Value: text-3xl font-bold text-card-foreground
- Grid: grid-cols-1 sm:cols-2 lg:cols-4 gap-6
```

**Code:**
```tsx
<div className="relative overflow-hidden bg-gradient-to-br from-card to-card/50 dark:from-card dark:to-card/70 border-0 rounded-lg shadow-card hover:shadow-elevated transition-all duration-200">
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
```

### Veritas - No KPI Cards in Main Scan Interface
- Analytics are in separate Slosh tab (not in Veritas)

---

## 5. RESULT PRODUCT CARDS

### Slosh Product Card
```
┌────────────────────────────────────────┐
│ [🥃]│ Jameson Irish Whiskey    [View]  │
│ 24x24│ ✓ AUTHENTIC                     │
│emoji │ SKU: JAM-001 • Batch: 2024-09   │
│     │ [View Details] [Report]         │
└────────────────────────────────────────┘

Layout:
- Flex: gap-5 flex-col sm:flex-row
- Image: w-24 h-24 flex-shrink-0 bg-primary/10 rounded-lg
- Status badge: text-xs inline-block px-3 py-1 rounded-full
- Buttons: variant="outline" size="sm"
```

**Code:**
```tsx
<div className="bg-card border border-border rounded-lg p-6 flex gap-5 flex-col sm:flex-row">
  <div className="w-24 h-24 bg-primary/10 rounded-lg flex items-center justify-center text-3xl flex-shrink-0">🥃</div>
  <div className="flex-1">
    <h3 className="text-base font-semibold text-card-foreground mb-1">{p.name}</h3>
    <span className={`text-xs font-medium px-3 py-1 rounded-full inline-block mb-2 ${p.status === "authentic" ? "bg-success/10 text-success" : "bg-warning/10 text-warning"}`}>
      {p.statusLabel}
    </span>
    <p className="text-sm text-muted-foreground">SKU: {p.sku} • Batch: {p.batch}</p>
    <div className="flex gap-2 mt-3">
      {p.actions.map((a) => <Button key={a} variant="outline" size="sm">{a}</Button>)}
    </div>
  </div>
</div>
```

---

## 6. TABLE STYLING (History Tab)

### Slosh History Table
```
┌─ ─ ─ ─ ─ ─ ─ ─ ─ ─ ─ ─ ─ ─ ─ ─ ─┐ ← h-1 gradient
│ [🕐] Scan History     [Export]   │
├─────────────────────────────────┤
│ Product │ Status  │ Loc  │ Time  │ ← thead
├─────────────────────────────────┤
│ Jameson │ Verified│ JHB  │ 14:32 │ ← hover:bg-primary/5
├─────────────────────────────────┤
│ Chivas  │Suspicious│Cape │ 13:15 │
├─────────────────────────────────┤
│ Absolut │ Verified│ Dur  │ 11:45 │
└─ ─ ─ ─ ─ ─ ─ ─ ─ ─ ─ ─ ─ ─ ─ ─ ─┘

Layout:
- Container: gradient-to-br from-card to-card/50
- Top border: h-1 gradient
- Padding: p-6
- Header: py-3 px-3, text-sm font-semibold text-muted-foreground
- Rows: py-3 px-3, border-b, hover:bg-primary/5
- Status badge: text-xs px-3 py-1 rounded-full
- Action: variant="outline" size="sm"
```

**Code:**
```tsx
<table className="w-full">
  <thead>
    <tr className="border-b border-border">
      {["Product", "Status", "Location", "Timestamp", "Action"].map((h) => (
        <th key={h} className="text-left text-sm font-semibold text-muted-foreground py-3 px-3">
          {h}
        </th>
      ))}
    </tr>
  </thead>
  <tbody>
    {historyData.map((h) => (
      <tr key={h.time} className="border-b border-border hover:bg-primary/5 transition-colors">
        <td className="py-3 px-3 text-sm text-card-foreground">{h.product}</td>
        <td className="py-3 px-3">
          <span className={`text-xs font-medium px-3 py-1 rounded-full ${
            h.status === "Verified" ? "bg-success/10 text-success" : "bg-warning/10 text-warning"
          }`}>
            {h.status}
          </span>
        </td>
        {/* More cells */}
      </tr>
    ))}
  </tbody>
</table>
```

---

## 7. ALERT BOXES

### Slosh Alert (Error)
```
┌────────────────────────────────────────┐
│ [❌] High-Risk Detection               │ ← p-4, bg-destructive/10, border-destructive/30
│                                        │
│ Counterfeit product detected in region │
└────────────────────────────────────────┘

Layout:
- Flex: gap-3 items-start
- Icon: w-5 h-5 text-destructive flex-shrink-0 mt-0.5
- Background: bg-destructive/10 border border-destructive/30
- Padding: p-4
- Border radius: rounded-lg
```

**Code:**
```tsx
<div className="p-4 rounded-lg bg-destructive/10 border border-destructive/30 flex gap-3 items-start">
  <AlertTriangle className="w-5 h-5 text-destructive flex-shrink-0 mt-0.5" />
  <div>
    <h4 className="text-sm font-semibold text-destructive">High-Risk Detection</h4>
    <p className="text-sm text-destructive/80">Counterfeit product detected in JHB CBD region</p>
  </div>
</div>
```

### Slosh Alert (Warning)
```
┌────────────────────────────────────────┐
│ [🕐] Suspicious Pattern                │ ← p-4, bg-warning/10, border-warning/30
│                                        │
│ Multiple scans from same location      │
└────────────────────────────────────────┘

Layout:
- Same as error but with warning colors
- Icon: w-5 h-5 text-warning
- Background: bg-warning/10 border border-warning/30
```

### Slosh Alert (Success)
```
┌────────────────────────────────────────┐
│ [✓] Successful Verification            │ ← p-4, bg-success/10, border-success/30
│                                        │
│ 142 products verified exceeds target   │
└────────────────────────────────────────┘

Layout:
- Same as error but with success colors
- Icon: w-5 h-5 text-success
- Background: bg-success/10 border border-success/30
```

---

## 8. BUTTONS - STYLING COMPARISON

### Veritas Gradient Buttons
```
[🟢 Start NFC Scan]  ← gradient-security hover:scale-105
[🔴 Report Issue]    ← gradient-alert
[⚡ Access Scanner]  ← gradient-primary shadow-gold
```

### Slosh Standard Buttons
```
[↻ Scan New]         ← variant="gradient-primary"
[View]               ← variant="outline" size="sm"
[File Report]        ← variant="outline" size="sm"
```

---

## 9. TABS (Slosh-specific)

### Tab Navigation Styling
```
[Scan] [Results] [History] [Analytics]
────                          
border-b-2 text-primary border-primary (active)
border-b-2 border-transparent (inactive)

Hover: text-foreground
Font: text-sm font-medium
Padding: px-4 py-2
Spacing: gap-2
```

**Code:**
```tsx
<div className="flex gap-2 mb-6 border-b border-border pb-4">
  {tabs.map((tab) => (
    <button 
      key={tab} 
      onClick={() => setActiveTab(tab)} 
      className={`px-4 py-2 text-sm font-medium border-b-2 transition-colors ${
        activeTab === tab 
          ? "text-primary border-primary" 
          : "text-muted-foreground border-transparent hover:text-foreground"
      }`}
    >
      {tab}
    </button>
  ))}
</div>
```

---

## 10. LOGIN FORM (Veritas-specific)

### Login Card Styling
```
┌──────────────────────────────────────────┐
│     [👤] Access Verifi-AI Scanner        │ ← h-6 w-6
│        Please login to continue          │
├──────────────────────────────────────────┤
│                                          │
│ Username                                 │
│ [_____________________________]           │ ← transition-premium
│                                          │
│ Email (Optional)                         │
│ [_____________________________]           │
│                                          │
│ Password                                 │
│ [____________________________] [👁️]     │ ← Eye toggle
│                                          │
│ [⚡ Access Scanner]                      │ ← gradient-primary
│ (Full width, lg size)                    │ ← hover:scale-105
│                                          │
│ Enter any username and password          │
│ This is a demonstration login system     │
└──────────────────────────────────────────┘

Layout:
- Card: shadow-premium
- Padding: p-6
- Content spacing: space-y-6
- Max width: max-w-2xl mx-auto
- Header: flex items-center gap-2 justify-center
- Icon: h-6 w-6 text-primary
- Title: CardTitle text-2xl
- Subtitle: text-center text-muted-foreground
```

**Code:**
```tsx
<Card className="shadow-premium">
  <CardHeader>
    <div className="flex items-center gap-2 justify-center">
      <User className="h-6 w-6 text-primary" />
      <CardTitle className="text-2xl">Access Verifi-AI Scanner</CardTitle>
    </div>
    <p className="text-center text-muted-foreground">Please login to continue</p>
  </CardHeader>
  <CardContent className="space-y-6 p-6">
    <div className="space-y-2">
      <Label htmlFor="username">Username</Label>
      <Input
        id="username"
        type="text"
        placeholder="Enter your username"
        value={loginForm.username}
        onChange={handleInputChange('username')}
        className="transition-premium"
      />
    </div>
    <!-- More fields -->
    <Button 
      onClick={handleLogin}
      className="w-full gradient-primary shadow-gold transition-premium hover:scale-105"
      size="lg"
      disabled={!loginForm.username.trim() || !loginForm.password.trim()}
    >
      <Lock className="h-4 w-4 mr-2" />
      Access Scanner
    </Button>
  </CardContent>
</Card>
```

---

## 11. REPORT FORM (Veritas-specific)

### Report Form Card
```
┌──────────────────────────────────────────┐
│ [📄] Report Illicit Alcohol Product     │ ← border-destructive/20
│     Help protect consumers...           │ ← bg-destructive/5
├──────────────────────────────────────────┤
│                                          │
│ Product Name *    │ Retailer/Store      │ ← 2-col grid md:cols-2
│ [__________]      │ [__________]        │
│                                          │
│ Location *                               │
│ [____________________________]            │
│                                          │
│ Suspicious Details *                     │
│ [____________________________]            │ ← rows={4}
│ [____________________________]            │
│ [____________________________]            │
│ [____________________________]            │
│                                          │
│ ────────────────────────────────────────  ← border-t pt-4
│ 👤 Contact Information (Optional)        │
│                                          │
│ Full Name         │ Phone Number        │
│ [__________]      │ [🫙 __________]     │
│                                          │
│ Email Address                            │
│ [📧 __________________]                  │
│                                          │
│ [gradient-alert Submit] [outline Cancel]│
│                                          │
│ Note: Your report will be forwarded...  │ ← bg-muted/50 p-4 rounded-lg
└──────────────────────────────────────────┘

Layout:
- Card: border-destructive/20 bg-destructive/5 shadow-premium
- Content spacing: space-y-6
- Grid: grid grid-cols-1 md:grid-cols-2 gap-4
- Icon inputs: relative positioning with icon absolute
- Icon padding: pl-10
- Divider: border-t pt-4
- Info section: bg-muted/50 p-4 rounded-lg
- Buttons: flex gap-4 (flex-1 each)
```

---

## CUSTOM CSS CLASSES CHECKLIST

### Required Gradient Classes
```css
✓ .gradient-primary    /* Navy blue gradient - used in buttons, icons */
✓ .gradient-security   /* Green gradient - for verified state */
✓ .gradient-alert      /* Red gradient - for warnings/reports */
```

### Required Shadow Classes
```css
✓ .shadow-premium      /* Enhanced shadow for Veritas */
✓ .shadow-gold         /* Gold-tinted shadow for scan icon */
✓ .shadow-security     /* Green-tinted shadow for buttons */
✓ .shadow-card         /* Light card shadow - Slosh */
✓ .shadow-elevated     /* Elevated shadow for hover - Slosh */
```

### Required Transition Classes
```css
✓ .transition-premium  /* Smooth 0.2s cubic-bezier - Veritas */
✓ .transition-smooth   /* General smooth transition */
```

### Required Animation Classes
```css
✓ .animate-pulse-dot   /* Pulsing indicator animation - Slosh */
✓ .animate-spin        /* Already in Tailwind for scan icon */
```

---

## Color Opacity Reference
- `/2` = 20% opacity
- `/5` = 5% opacity  
- `/10` = 10% opacity
- `/30` = 30% opacity
- `/50` = 50% opacity
- `/70` = 70% opacity
- `/80` = 80% opacity

Examples:
- `border-success/20` = 20% success color border
- `bg-warning/10` = 10% warning color background
- `text-destructive/80` = 80% opacity destructive text

