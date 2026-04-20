# Specific ClassName Changes - Detailed Mapping

## Changes to Transform Slosh into Veritas Style

### 1. HEADER CHANGES

**Current Slosh:**
```tsx
<div className="bg-card border border-border rounded-lg p-6 mb-8 shadow-sm">
  <div className="flex items-center justify-between gap-4 flex-col sm:flex-row">
    <div className="flex items-center gap-3">
      <div className="w-12 h-12 bg-gradient-to-br from-primary to-primary/70 rounded-lg ...">
        <Smartphone className="w-6 h-6 text-primary-foreground" />
      </div>
```

**Change to Veritas Style:**
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

**Key Changes:**
- Remove: `bg-card border border-border rounded-lg p-6 mb-8 shadow-sm`
- Add: `border-b bg-card/80 backdrop-blur-sm`
- Remove icon gradient box workaround
- Add icon directly: `h-8 w-8 text-success`
- Add back button with ArrowLeft icon
- Change container to full-width strip
- Move content to `container mx-auto px-6 py-6`
- Remove "Scan New" button from header

---

### 2. TABS REMOVAL

**Current Slosh:**
```tsx
const tabs = ["Scan", "Results", "History", "Analytics"] as const;
<div className="flex gap-2 mb-6 border-b border-border pb-4">
  {tabs.map((tab) => (
    <button key={tab} onClick={() => setActiveTab(tab)} className={...}>
      {tab}
    </button>
  ))}
</div>
```

**Change to Veritas Style:**
```tsx
// Remove tabs entirely
// Replace with conditional rendering based on state:
{!isLoggedIn ? (
  /* Login Card */
) : (
  <>
    {/* NFC Status Card */}
    {/* Scanner Card */}
    {/* Scan Result Card */}
    {/* Report Form (conditional) */}
  </>
)}
```

**Key Changes:**
- Delete tabs array
- Delete tab navigation JSX
- Replace activeTab state with isLoggedIn boolean
- Use conditional rendering for page sections

---

### 3. SCAN AREA - INTERFACE CHANGES

**Current Slosh:**
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

**Change to Veritas Style:**
```tsx
<Card className="shadow-premium relative">
  {/* Demo Mode Toggle */}
  <div className="absolute top-4 right-4 flex items-center gap-2 z-10">
    <Label htmlFor="demo-mode" className="text-xs text-muted-foreground">
      Demo
    </Label>
    <Switch
      id="demo-mode"
      checked={demoMode}
      onCheckedChange={setDemoMode}
      className="scale-75"
    />
  </div>

  <CardContent className="p-8 text-center">
    {isScanning ? (
      <div className="space-y-6">
        <div className="w-24 h-24 mx-auto rounded-full gradient-primary shadow-gold flex items-center justify-center">
          <Scan className="h-12 w-12 text-white animate-spin" />
        </div>
        <div>
          <h3 className="text-xl font-semibold mb-2">Scanning NFC Tag...</h3>
          <p className="text-muted-foreground">
            {demoMode ? "Demo mode - simulating scan..." : "Hold your NFC-enabled product near the device"}
          </p>
        </div>
        <Button onClick={stopNFCScan} variant="outline" size="sm">
          Stop Scanning
        </Button>
      </div>
    ) : (
      <div className="space-y-6">
        <div className="w-24 h-24 mx-auto rounded-full gradient-primary shadow-gold flex items-center justify-center">
          <Scan className="h-12 w-12 text-white" />
        </div>
        <div>
          <h3 className="text-xl font-semibold mb-2">Ready to Scan</h3>
          <p className="text-muted-foreground">
            {demoMode 
              ? "Demo mode enabled - will simulate scanning process" 
              : "Tap the button below and hold your NFC-enabled product near your device"}
          </p>
        </div>
        <Button 
          onClick={startNXTScan}
          size="lg"
          className="gradient-security shadow-security transition-premium hover:scale-105"
        >
          {demoMode ? "Start Demo Scan" : "Start NFC Scan"}
        </Button>
      </div>
    )}
  </CardContent>
</Card>
```

**Key Changes:**
- Remove: `border-2 border-dashed border-primary`
- Add: `shadow-premium` card wrapper
- Remove: `p-12`
- Add: `p-8`
- Icon circle: Change from `w-20 h-20 bg-primary/10 rounded-lg` to `w-24 h-24 rounded-full gradient-primary shadow-gold`
- Icon: Change from `w-10 h-10` to `h-12 w-12`
- Icon wrapper: Change from `rounded-lg` to `rounded-full`
- Heading: Change from `text-2xl` to `text-xl`
- Button: Change from default to `gradient-security shadow-security transition-premium hover:scale-105`
- Add demo toggle: `absolute top-4 right-4` with Switch component
- Add two states: scanning/not scanning with conditional content
- Add `animate-spin` to icon when scanning

---

### 4. KPI CARDS - REMOVAL/REPLACEMENT

**Current Slosh:**
```tsx
<div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-6">
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
</div>
```

**Change to Veritas Style:**
```tsx
{/* Remove KPI grid entirely for pure Veritas style */}
{/* OR: Keep but move to different tab/section */}
{/* Not present in main Veritas scanner flow */}
```

**Key Changes:**
- Delete entire KPI cards section from Scan tab
- Move to separate Analytics section if desired
- Veritas doesn't have metrics dashboard in scanner

---

### 5. ACTIVE SCANS SECTION - REMOVAL

**Current Slosh:**
```tsx
<div className="relative overflow-hidden bg-gradient-to-br from-card to-card/50 dark:from-card dark:to-card/70 border-0 rounded-lg shadow-card">
  <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-primary to-primary/70"></div>
  <div className="p-6">
    <div className="flex items-center justify-between mb-4 pb-3 border-b border-border">
      <h3 className="text-lg font-semibold text-card-foreground flex items-center gap-2">
        <Smartphone className="w-5 h-5" /> Active Scans
      </h3>
      <Button variant="outline" size="sm">All</Button>
    </div>
    <div className="flex items-center justify-between p-3 rounded-lg hover:bg-accent/50 transition-colors">
      <!-- Active scan item -->
    </div>
  </div>
</div>
```

**Change to Veritas Style:**
```tsx
{/* Remove this section entirely */}
{/* Veritas shows scan results only after scanning */}
```

---

### 6. ADD LOGIN FLOW (Veritas)

**Insert before main content:**
```tsx
{!isLoggedIn ? (
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
      
      <div className="space-y-2">
        <Label htmlFor="email">Email (Optional)</Label>
        <Input
          id="email"
          type="email"
          placeholder="Enter your email"
          value={loginForm.email}
          onChange={handleInputChange('email')}
          className="transition-premium"
        />
      </div>
      
      <div className="space-y-2">
        <Label htmlFor="password">Password</Label>
        <div className="relative">
          <Input
            id="password"
            type={showPassword ? "text" : "password"}
            placeholder="Enter your password"
            value={loginForm.password}
            onChange={handleInputChange('password')}
            className="pr-10 transition-premium"
          />
          <Button
            type="button"
            variant="ghost"
            size="sm"
            className="absolute right-0 top-0 h-full px-3"
            onClick={() => setShowPassword(!showPassword)}
          >
            {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
          </Button>
        </div>
      </div>
      
      <Button 
        onClick={handleLogin}
        className="w-full gradient-primary shadow-gold transition-premium hover:scale-105"
        size="lg"
        disabled={!loginForm.username.trim() || !loginForm.password.trim()}
      >
        <Lock className="h-4 w-4 mr-2" />
        Access Scanner
      </Button>
      
      <div className="text-center text-sm text-muted-foreground">
        <p>Enter any username and password to proceed</p>
        <p className="mt-1">This is a demonstration login system</p>
      </div>
    </CardContent>
  </Card>
) : (
  /* Scanner content follows */
)}
```

---

### 7. ADD NFC STATUS CARD

**Insert after login, before scanner:**
```tsx
<Card>
  <CardContent className="p-6">
    <div className="flex items-center gap-4">
      <Wifi className={`h-5 w-5 ${demoMode ? 'text-warning' : NXTSupported ? 'text-success' : 'text-muted-foreground'}`} />
      <div>
        <p className="font-semibold">NFC Status</p>
        <p className="text-sm text-muted-foreground">
          {demoMode 
            ? "Demo mode enabled - simulated scanning" 
            : NXTSupported 
              ? "NFC Ready - Tap bottle to scan" 
              : "NFC not supported - Demo mode active"
          }
        </p>
      </div>
      <Badge variant={demoMode ? "outline" : NXTSupported ? "default" : "secondary"} className="ml-auto">
        {demoMode ? "Demo" : NXTSupported ? "NFC" : "Demo"}
      </Badge>
    </div>
  </CardContent>
</Card>
```

---

### 8. ADD SCAN RESULT CARDS

**Replace conditional rendering from activeTab:**
```tsx
{/* Success Result */}
{scanResult === "success" && (
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
        {/* More grid items */}
      </div>
      <div className="bg-success/10 p-4 rounded-lg">
        {/* Success details */}
      </div>
    </CardContent>
  </Card>
)}

{/* Unmatch Result */}
{scanResult === "unmatch" && (
  <Card className="border-warning/20 bg-warning/5">
    {/* Warning card content */}
  </Card>
)}

{/* Unknown Result */}
{scanResult === "unknown" && (
  <Card className="border-destructive/20 bg-destructive/5">
    {/* Error card content */}
  </Card>
)}
```

**Key Changes:**
- Border: `border-{color}/20`
- Background: `bg-{color}/5`
- Icons: `h-5 w-5 text-{color}`
- Titles: `text-{color}`
- Sub-sections: `bg-{color}/10 p-4 rounded-lg`

---

### 9. ADD REPORT FORM (Conditional)

**Insert after scan results:**
```tsx
{showReportForm && (
  <Card className="border-destructive/20 bg-destructive/5 shadow-premium">
    <CardHeader>
      <div className="flex items-center gap-2">
        <FileText className="h-5 w-5 text-destructive" />
        <CardTitle className="text-destructive">Report Illicit Alcohol Product</CardTitle>
      </div>
      <p className="text-sm text-muted-foreground">
        Help protect consumers by reporting suspicious or counterfeit alcohol products
      </p>
    </CardHeader>
    <CardContent className="space-y-6">
      {/* Form fields */}
    </CardContent>
  </Card>
)}
```

---

### 10. RESULTS TAB → CONVERT IF KEEPING

**If keeping Results tab (not pure Veritas), update styling:**

**Current:**
```tsx
<div className="bg-card border border-border rounded-lg p-6 flex gap-5 flex-col sm:flex-row">
```

**Verify correct:**
- Already matches Veritas card styling
- Keep as-is if implementing tab structure

---

### 11. HISTORY TAB → UPDATE STYLING

**Current styling is mostly correct, but verify:**

**Table row hover:**
```tsx
className="border-b border-border hover:bg-primary/5 transition-colors"
```

This is correct and matches Veritas patterns.

---

### 12. ANALYTICS TAB → UPDATE STYLING

**Progress bars styling (keep current):**
```tsx
<div className="w-full h-2 bg-muted rounded-full overflow-hidden mb-2">
  <div className="h-full bg-gradient-to-r from-primary to-primary/70 rounded-full" 
    style={{ width: "96.6%" }} />
</div>
```

This matches Veritas gradient patterns.

**Alerts section:**
```tsx
<div className="p-4 rounded-lg bg-destructive/10 border border-destructive/30 flex gap-3 items-start">
  <AlertTriangle className="w-5 h-5 text-destructive flex-shrink-0 mt-0.5" />
  {/* Alert content */}
</div>
```

This matches Veritas alert styling - good to keep.

---

## Changes to Transform Veritas into Slosh Style

### 1. HEADER CHANGES (Reverse)

**Current Veritas:**
```tsx
<div className="border-b bg-card/80 backdrop-blur-sm">
  <div className="container mx-auto px-6 py-6">
    <div className="flex items-center gap-4">
      <Button variant="ghost" onClick={() => navigate("/")} className="gap-2">
        <ArrowLeft className="h-4 w-4" />
      </Button>
      <Scan className="h-8 w-8 text-success" />
```

**Change to Slosh Style:**
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
    <Button size="sm" variant="gradient-primary">
      <RefreshCw className="w-4 h-4" /> Scan New
    </Button>
  </div>
</div>
```

---

### 2. REMOVE LOGIN FLOW

**Delete entirely**
```tsx
{!isLoggedIn ? (
  /* Login Card - DELETE */
) : (
```

Becomes just:
```tsx
/* Content directly */
```

---

### 3. REMOVE NFC STATUS CARD

```tsx
{/* NFC Status Card - DELETE THIS */}
<Card>
  <CardContent className="p-6">
```

---

### 4. ADD TABS NAVIGATION

**After header, add:**
```tsx
const tabs = ["Scan", "Results", "History", "Analytics"] as const;

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

---

### 5. SCAN INTERFACE UPDATES

**Current Veritas scanning card:**
```tsx
<Card className="shadow-premium relative">
  <div className="absolute top-4 right-4 flex items-center gap-2 z-10">
    {/* Demo toggle */}
  </div>
  <CardContent className="p-8 text-center">
    <div className="w-24 h-24 mx-auto rounded-full gradient-primary shadow-gold ...">
      <Scan className="h-12 w-12 text-white" />
    </div>
```

**Change to Slosh:**
```tsx
<div className="border-2 border-dashed border-primary rounded-lg p-12 text-center mb-6 bg-card">
  {/* Remove demo toggle */}
  <div className="w-20 h-20 bg-primary/10 rounded-lg flex items-center justify-center mx-auto mb-6">
    <Radio className="w-10 h-10 text-primary" />
  </div>
  {/* No scanning state, just static ready state */}
```

---

### 6. REMOVE SCAN RESULT CARDS

```tsx
{/* Delete all these */}
{scanResult === "success" && (
  <Card className="border-success/20 bg-success/5">
```

These go into Results tab instead (if tab exists).

---

### 7. REMOVE REPORT FORM

```tsx
{showReportForm && (
  <Card className="border-destructive/20 ...
  {/* DELETE ENTIRE SECTION */}
)}
```

---

### 8. ADD KPI CARDS

**Insert in Scan tab above scanning area:**
```tsx
<div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-6">
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
</div>
```

---

### 9. ADD ACTIVE SCANS SECTION

**Below KPI cards:**
```tsx
<div className="relative overflow-hidden bg-gradient-to-br from-card to-card/50 dark:from-card dark:to-card/70 border-0 rounded-lg shadow-card">
  <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-primary to-primary/70"></div>
  <div className="p-6">
    <div className="flex items-center justify-between mb-4 pb-3 border-b border-border">
      <h3 className="text-lg font-semibold text-card-foreground flex items-center gap-2">
        <Smartphone className="w-5 h-5" /> Active Scans
      </h3>
      <Button variant="outline" size="sm">All</Button>
    </div>
    <div className="flex items-center justify-between p-3 rounded-lg hover:bg-accent/50 transition-colors">
      {/* Active scan item */}
    </div>
  </div>
</div>
```

---

### 10. CREATE RESULTS TAB CONTENT

```tsx
{activeTab === "Results" && (
  <div className="space-y-4">
    {products.map((p) => (
      <div key={p.name} className="bg-card border border-border rounded-lg p-6 flex gap-5 flex-col sm:flex-row">
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
    ))}
  </div>
)}
```

---

### 11. CREATE HISTORY TAB CONTENT

```tsx
{activeTab === "History" && (
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
          {/* Table structure */}
        </table>
      </div>
    </div>
  </div>
)}
```

---

### 12. CREATE ANALYTICS TAB CONTENT

```tsx
{activeTab === "Analytics" && (
  <div className="space-y-6">
    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
      {/* Analytics cards with progress bars */}
    </div>
    <div className="relative overflow-hidden bg-gradient-to-br from-card to-card/50 dark:from-card dark:to-card/70 border-0 rounded-lg shadow-card">
      <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-destructive to-destructive/70"></div>
      <div className="p-6">
        {/* Alerts section */}
      </div>
    </div>
  </div>
)}
```

---

## Summary of All ClassName Changes

### High-Impact Changes (Structural)
| Veritas | → | Slosh |
|---------|---|-------|
| `shadow-premium` | → | `shadow-card` |
| `gradient-security` | → | `gradient-to-br from-primary to-primary/70` (for most) |
| `gradient-alert` | → | Not used in Slosh's main scan area |
| `transition-premium` | → | `transition-colors` / `transition-all` |
| `rounded-full` (scan icon) | → | `rounded-lg` |
| `h-24 w-24` (icon circle) | → | `w-20 h-20` |
| `h-12 w-12` (icon) | → | `w-10 h-10` |
| No border (scan) | → | `border-2 border-dashed` |

### Medium-Impact Changes (Styling)
| Element | Veritas | → | Slosh |
|---------|---------|---|-------|
| Card backgrounds | Varies | → | `bg-gradient-to-br from-card to-card/50` |
| Top borders | N/A | → | `absolute h-1 bg-gradient-to-r from-primary to-primary/70` |
| Text colors | `text-primary/success/etc` | → | `text-card-foreground` |
| Icon boxes | N/A | → | `p-3 rounded-xl gradient-to-br` |
| Hover effects | `hover:scale-105` | → | `hover:shadow-elevated` / `hover:bg-primary/5` |
| Padding | `p-8` (scan) | → | `p-12` (scan) |
| Grid layouts | Single/simple | → | `grid-cols-1 sm:cols-2 lg:cols-4` |

### Low-Impact Changes (Typography)
| Element | Veritas | Slosh |
|---------|---------|-------|
| KPI value size | N/A | `text-3xl font-bold` |
| Tab styling | N/A | `px-4 py-2 border-b-2` |
| Status badge | `px-3 py-1 rounded-full` | `px-3 py-1 rounded-full` (same) |

