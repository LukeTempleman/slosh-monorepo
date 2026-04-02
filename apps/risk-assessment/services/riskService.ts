/**
 * Risk Assessment Service Layer
 * Handles risk calculations and analysis with real API integration
 */

import type {
  RiskAssessment,
  RiskLevel,
  RiskCategory,
  RiskMetric,
  RiskSummary,
  RiskDistribution,
} from "../types";
import { riskApi } from "./riskApi";

/**
 * Fetch risk assessments from backend API
 */
export const fetchRisks = async (): Promise<RiskAssessment[]> => {
  return riskApi.getAllRisks();
};

/**
 * Update risk status via API
 */
export const updateRiskStatus = async (
  riskId: string,
  status: 'active' | 'resolved',
  notes?: string
): Promise<RiskAssessment> => {
  return riskApi.updateRiskStatus(riskId, status, notes);
};

/**
 * Mitigate risk via API
 */
export const mitigateRisk = async (riskId: string): Promise<void> => {
  return riskApi.mitigateRisk(riskId);
};

/**
 * Escalate risk via API
 */
export const escalateRisk = async (riskId: string, reason: string): Promise<void> => {
  return riskApi.escalateRisk(riskId, reason);
};

/**
 * Resolve risk via API
 */
export const resolveRisk = async (riskId: string): Promise<void> => {
  return riskApi.updateRiskStatus(riskId, 'resolved');
};

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
    { critical: 0, high: 0, medium: 0, low: 0 } as Record<RiskLevel, number>
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
