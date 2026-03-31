/**
 * Risk Assessment Service Layer
 * Handles risk calculations and analysis
 * Future: Replace with backend API calls
 */

import type {
  RiskAssessment,
  RiskLevel,
  RiskCategory,
  RiskMetric,
  RiskSummary,
  RiskDistribution,
} from "../types";

/**
 * Generate mock risk assessments
 * Future: apiClient.get("/risks")
 */
export const generateMockRisks = (): RiskAssessment[] => [
  {
    id: "RISK-001",
    productId: "PRD-VAC-100",
    productName: "Premium Vaccine",
    riskLevel: "low",
    riskScore: 15,
    category: "counterfeit",
    factors: [
      { name: "NFC Tag Match", weight: 0.8, impact: 5, source: "NFC Scan" },
      { name: "Supply Chain Verified", weight: 0.7, impact: 10, source: "Database" },
    ],
    detectedAt: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000),
    status: "resolved",
    recommendations: ["Monitor next batch"],
  },
  {
    id: "RISK-002",
    productId: "PRD-ANT-50",
    productName: "Antibiotics",
    riskLevel: "high",
    riskScore: 72,
    category: "quality",
    factors: [
      { name: "Quality Score Low", weight: 0.9, impact: 70, source: "QA Report" },
      { name: "Batch Delay", weight: 0.6, impact: 40, source: "Production" },
    ],
    detectedAt: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000),
    status: "active",
    recommendations: [
      "Halt production",
      "Conduct full QA review",
      "Contact supplier",
    ],
  },
  {
    id: "RISK-003",
    productId: "PRD-VIT-200",
    productName: "Vitamins",
    riskLevel: "critical",
    riskScore: 89,
    category: "supply_chain",
    factors: [
      { name: "Supplier Offline", weight: 0.95, impact: 85, source: "Vendor Status" },
      { name: "Regulatory Alert", weight: 0.8, impact: 75, source: "FDA" },
    ],
    detectedAt: new Date(Date.now() - 1 * 24 * 60 * 60 * 1000),
    status: "active",
    recommendations: [
      "Find alternative supplier",
      "File regulatory report",
      "Notify customers",
    ],
  },
];

/**
 * Calculate risk summary from assessments
 */
export const calculateRiskSummary = (
  assessments: RiskAssessment[]
): RiskSummary => {
  const active = assessments.filter((r) => r.status === "active");
  const distribution = assessments.reduce(
    (acc, r) => {
      acc[r.riskLevel]++;
      return acc;
    },
    { critical: 0, high: 0, medium: 0, low: 0 }
  );

  const avgScore =
    assessments.length > 0
      ? assessments.reduce((sum, r) => sum + r.riskScore, 0) / assessments.length
      : 0;

  // Calculate trends by category
  const trends: RiskMetric[] = [
    {
      category: "counterfeit",
      count: assessments.filter((r) => r.category === "counterfeit").length,
      avgScore: calculateAvgScoreByCategory(assessments, "counterfeit"),
      trend: "stable",
    },
    {
      category: "quality",
      count: assessments.filter((r) => r.category === "quality").length,
      avgScore: calculateAvgScoreByCategory(assessments, "quality"),
      trend: "increasing",
    },
    {
      category: "supply_chain",
      count: assessments.filter((r) => r.category === "supply_chain").length,
      avgScore: calculateAvgScoreByCategory(assessments, "supply_chain"),
      trend: "decreasing",
    },
  ];

  return {
    totalAssessments: assessments.length,
    activeRisks: active.length,
    criticalRisks: distribution.critical,
    highRisks: distribution.high,
    mediumRisks: distribution.medium,
    lowRisks: distribution.low,
    avgRiskScore: Number(avgScore.toFixed(1)),
    trends,
  };
};

/**
 * Helper: Calculate average score for category
 */
const calculateAvgScoreByCategory = (
  assessments: RiskAssessment[],
  category: RiskCategory
): number => {
  const filtered = assessments.filter((r) => r.category === category);
  if (filtered.length === 0) return 0;
  return (
    filtered.reduce((sum, r) => sum + r.riskScore, 0) / filtered.length
  );
};

/**
 * Get risk distribution
 */
export const getRiskDistribution = (
  assessments: RiskAssessment[]
): RiskDistribution => {
  return {
    critical: assessments.filter((r) => r.riskLevel === "critical").length,
    high: assessments.filter((r) => r.riskLevel === "high").length,
    medium: assessments.filter((r) => r.riskLevel === "medium").length,
    low: assessments.filter((r) => r.riskLevel === "low").length,
  };
};

/**
 * Get risk level color for UI
 */
export const getRiskLevelColor = (riskLevel: RiskLevel): string => {
  const colorMap: Record<RiskLevel, string> = {
    critical: "text-red-700 bg-red-50",
    high: "text-orange-700 bg-orange-50",
    medium: "text-yellow-700 bg-yellow-50",
    low: "text-green-700 bg-green-50",
  };
  return colorMap[riskLevel];
};

/**
 * Format risk score for display
 */
export const formatRiskScore = (score: number): string => {
  return `${Math.round(score)}/100`;
};

/**
 * Mitigate risk (future: API call)
 */
export const mitigateRisk = async (_assessmentId: string): Promise<void> => {
  await new Promise((resolve) => setTimeout(resolve, 300));
  // Mock implementation
};

/**
 * Resolve risk (future: API call)
 */
export const resolveRisk = async (_assessmentId: string): Promise<void> => {
  await new Promise((resolve) => setTimeout(resolve, 300));
  // Mock implementation
};
