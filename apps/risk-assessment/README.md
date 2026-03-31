# Risk Assessment Feature

**Purpose**: Real-time risk detection, analysis, and mitigation intelligence

## Architecture

### Layers

1. **Types** (`types/index.ts`)
   - `RiskAssessment`: Core risk domain model
   - `RiskLevel`: "critical" | "high" | "medium" | "low"
   - `RiskCategory`: Counterfeit, Quality, Supply Chain, Regulatory, Market
   - `RiskSummary`: KPIs and analytics
   - `RiskFactor`: Risk component with impact weight

2. **Services** (`services/riskService.ts`)
   - `generateMockRisks()`: Load risk data
   - `calculateRiskSummary()`: Compute KPIs
   - `getRiskDistribution()`: Risk level breakdown
   - `mitigateRisk()`: Action handler
   - `resolveRisk()`: Resolution handler

3. **Hooks** (`hooks/useRiskAssessment.ts`)
   - `useRiskAssessment()`: Complete risk lifecycle
   - Load, filter, update risk status
   - Calculate metrics on demand

4. **Components** (`components/`)
   - `RiskMetrics.tsx`: KPI grid (6 metrics)
   - `RiskAlertList.tsx`: Active risk cards with actions
   - Presentation-only (no business logic)

5. **Page** (`pages/RiskAssessmentPage.tsx`)
   - Feature entry point
   - Orchestrates hook, services, components
   - Login flow
   - Risk resolution handler

## Data Flow

```
Load Risk Assessment Page
    ↓
useRiskAssessment Hook
    ├─ useEffect: loadRisks()
    ├─ generateMockRisks() → 3 sample risks
    └─ calculateRiskSummary() → metrics
    ↓
Hook Returns State
    ├─ risks: RiskAssessment[]
    ├─ summary: RiskSummary
    ├─ distribution: RiskDistribution
    └─ Loading state
    ↓
Page Renders Components
    ├─ RiskMetrics (receives summary)
    ├─ RiskAlertList (receives active risks)
    └─ Risk Trends (from summary.trends)
    ↓
User Action: Resolve Risk
    ├─ Click "Resolve" button
    ├─ Call updateRiskStatus(id, "resolved")
    └─ Hook updates state
    ↓
Components Re-render
    ├─ Risk removed from active list
    ├─ Summary metrics updated
    └─ Toast notification shown
```

## Key Features

✅ **Real-time Risk Detection**: Load and evaluate all risks
✅ **Risk Categorization**: 5 categories (counterfeit, quality, supply chain, regulatory, market)
✅ **Risk Scoring**: 0-100 point scale with weight factors
✅ **Trend Analysis**: Track risk trends by category
✅ **Quick Actions**: Resolve, investigate, mitigate risks
✅ **Alert System**: Highlight critical and high-risk items
✅ **Recommendations**: Display actionable mitigation strategies

## Isolation Benefits

✅ **Self-contained**: All risk logic isolated
✅ **Independent**: Can be deployed separately
✅ **Testable**: Services have no UI coupling
✅ **Extensible**: Easy to add risk categories
✅ **Mockable**: Services can be swapped for APIs

## Future Enhancements

- [ ] Backend API integration for real-time risk data
- [ ] Risk prediction using ML models
- [ ] Risk correlation analysis
- [ ] Automated mitigation workflows
- [ ] Risk history and audit logs
- [ ] Custom risk rule builder
- [ ] Integration with manufacturer batches
- [ ] Integration with verifi-ai scan results
- [ ] Stakeholder notifications
- [ ] Risk impact simulations
