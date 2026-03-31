# VerifiAI Scanner Feature

**Purpose**: NFC-based product verification and authenticity checking

## Architecture

### Layers

1. **Types** (`types/index.ts`)
   - `ScanResult`: "success" | "unmatch" | "unknown"
   - `ScanData`: Parsed product info from NFC tag
   - `VerificationResponse`: Future API response type

2. **Services** (`services/nfcService.ts`)
   - `parseNDEFRecords()`: Parse raw NFC data
   - `verifyProduct()`: Verify with backend API
   - UI formatting helpers (colors, labels)

3. **Hooks** (`hooks/useNFCScanner.ts`)
   - `useNFCScanner()`: Manages scan lifecycle
   - Handles device support detection
   - Error handling and state management

4. **Components** (`components/`)
   - `ScannerUI.tsx`: Dumb presentation component
   - Receives data and callbacks
   - No business logic

5. **Page** (`pages/VerifiAIPage.tsx`)
   - Feature entry point
   - Orchestrates hooks, services, components
   - Handles login (future: move to shared auth)

## Data Flow

```
User Action: Click "Start Scan"
    ↓
useNFCScanner Hook
    ├─ startScan()
    └─ Browser prompts NFC permission
    ↓
NFC Tag Detected
    ├─ "reading" event fires
    ├─ nfcService.parseNDEFRecords()
    └─ Extract product ID
    ↓
Verification Service
    ├─ verifyProduct(productId)
    └─ Call API (or mock)
    ↓
Result State Update
    ├─ setScanResult("success" | "unmatch" | "unknown")
    └─ Hook returns updated state
    ↓
ScannerUI Re-renders
    ├─ Receives latest state
    ├─ Displays result in UI
    └─ User sees outcome
```

## Isolation Benefits

✅ **Self-contained**: All NFC logic here
✅ **Testable**: Services can be unit tested
✅ **Reusable**: Hook can be used in other features
✅ **Scalable**: Easy to add new verification modes
✅ **No coupling**: Doesn't depend on other features

## Future Enhancements

- [ ] Backend API integration (`verifyProduct()` currently mocked)
- [ ] Scan history tracking
- [ ] Batch scans for inventory checks
- [ ] QR code fallback for non-NFC devices
- [ ] Risk level display (integrate with risk-assessment feature)
- [ ] Export scan reports
