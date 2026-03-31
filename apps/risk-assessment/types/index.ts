/**
 * Risk Assessment Feature Types
 * Domain-specific types for risk analytics and intelligence
 */

export type RiskLevel = "low" | "medium" | "high" | "critical";
export type RiskCategory =
  | "counterfeit"
  | "quality"
  | "supply_chain"
  | "regulatory"
  | "market";

export interface RiskAssessment {
  id: string;
  productId: string;
  productName: string;
  riskLevel: RiskLevel;
  riskScore: number; // 0-100
  category: RiskCategory;
  factors: RiskFactor[];
  detectedAt: Date;
  status: "active" | "resolved";
  recommendations: string[];
}

export interface RiskFactor {
  name: string;
  weight: number; // 0-1 (importance)
  impact: number; // 0-100
  source: string;
}

export interface RiskMetric {
  category: RiskCategory;
  count: number;
  avgScore: number;
  trend: "increasing" | "stable" | "decreasing";
}

export interface RiskSummary {
  totalAssessments: number;
  activeRisks: number;
  criticalRisks: number;
  highRisks: number;
  mediumRisks: number;
  lowRisks: number;
  avgRiskScore: number;
  trends: RiskMetric[];
}

export interface RiskDistribution {
  critical: number;
  high: number;
  medium: number;
  low: number;
}

/**
 * Risk action payload (future API)
 */
export interface RiskActionPayload {
  assessmentId: string;
  action: "mitigate" | "escalate" | "monitor" | "resolve";
  notes: string;
}
