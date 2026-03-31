/**
 * useRiskAssessment Hook
 * Manages risk data and operations
 * Isolated from UI - can be tested independently
 */

import { useState, useCallback, useEffect } from "react";
import {
  generateMockRisks,
  calculateRiskSummary,
  getRiskDistribution,
} from "../services/riskService";
import type { RiskAssessment, RiskSummary, RiskDistribution } from "../types";

export const useRiskAssessment = () => {
  const [risks, setRisks] = useState<RiskAssessment[]>([]);
  const [summary, setSummary] = useState<RiskSummary | null>(null);
  const [distribution, setDistribution] = useState<RiskDistribution | null>(
    null
  );
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  /**
   * Load risks on mount
   */
  useEffect(() => {
    loadRisks();
  }, []);

  /**
   * Fetch risk assessments
   */
  const loadRisks = useCallback(async () => {
    try {
      setIsLoading(true);
      setError(null);
      const data = generateMockRisks();
      setRisks(data);
      setSummary(calculateRiskSummary(data));
      setDistribution(getRiskDistribution(data));
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to load risks");
    } finally {
      setIsLoading(false);
    }
  }, []);

  /**
   * Get risks filtered by level
   */
  const getRisksByLevel = useCallback((level: string): RiskAssessment[] => {
    return risks.filter((r) => r.riskLevel === level);
  }, [risks]);

  /**
   * Get active risks only
   */
  const getActiveRisks = useCallback((): RiskAssessment[] => {
    return risks.filter((r) => r.status === "active");
  }, [risks]);

  /**
   * Get risk by ID
   */
  const getRiskById = useCallback(
    (id: string): RiskAssessment | undefined => {
      return risks.find((r) => r.id === id);
    },
    [risks]
  );

  /**
   * Update risk status
   */
  const updateRiskStatus = useCallback(
    async (id: string, status: "active" | "resolved") => {
      try {
        setIsLoading(true);
        // Simulate API call
        await new Promise((resolve) => setTimeout(resolve, 200));

        const updated = risks.map((r) =>
          r.id === id ? { ...r, status } : r
        );
        setRisks(updated);
        setSummary(calculateRiskSummary(updated));
        setDistribution(getRiskDistribution(updated));
      } catch (err) {
        const message = err instanceof Error ? err.message : "Update failed";
        setError(message);
      } finally {
        setIsLoading(false);
      }
    },
    [risks]
  );

  return {
    // State
    risks,
    summary,
    distribution,
    isLoading,
    error,

    // Actions
    loadRisks,
    getRisksByLevel,
    getActiveRisks,
    getRiskById,
    updateRiskStatus,
  };
};
