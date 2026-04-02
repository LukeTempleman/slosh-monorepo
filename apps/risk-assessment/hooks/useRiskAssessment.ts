/**
 * useRiskAssessment Hook
 * Manages risk data and operations with real API integration
 * Isolated from UI - can be tested independently
 */

import { useState, useCallback, useEffect } from "react";
import {
  fetchRisks,
  calculateRiskSummary,
  getRiskDistribution,
  updateRiskStatus as updateRiskStatusService,
  mitigateRisk as mitigateRiskService,
  escalateRisk as escalateRiskService,
  resolveRisk as resolveRiskService,
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
   * Fetch risk assessments from API
   */
  const loadRisks = useCallback(async () => {
    try {
      setIsLoading(true);
      setError(null);
      const data = await fetchRisks();
      setRisks(data);
      setSummary(calculateRiskSummary(data));
      setDistribution(getRiskDistribution(data));
    } catch (err) {
      const message = err instanceof Error ? err.message : "Failed to load risks";
      setError(message);
      // Provide user feedback about the error
      throw new Error(`Could not load risk assessments: ${message}. Please check your connection and try again.`);
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
   * Update risk status via API
   */
  const updateRiskStatus = useCallback(
    async (id: string, status: "active" | "resolved", notes?: string) => {
      try {
        setIsLoading(true);
        setError(null);
        
        // Implement with timeout
        const updatePromise = updateRiskStatusService(id, status, notes);
        const timeoutPromise = new Promise((_, reject) => 
          setTimeout(() => reject(new Error('Request timeout')), 10000)
        );
        
        const updatedRisk = await Promise.race([updatePromise, timeoutPromise]) as any;

        const updated = risks.map((r) =>
          r.id === id ? updatedRisk : r
        );
        setRisks(updated);
        setSummary(calculateRiskSummary(updated));
        setDistribution(getRiskDistribution(updated));
      } catch (err) {
        const message = err instanceof Error ? err.message : "Update failed";
        setError(message);
        // Provide user feedback about the error
        throw new Error(`Failed to update risk status: ${message}. Please try again.`);
      } finally {
        setIsLoading(false);
      }
    },
    [risks]
  );

  /**
   * Mitigate risk via API
   */
  const mitigateRisk = useCallback(
    async (id: string) => {
      try {
        setIsLoading(true);
        setError(null);
        
        // Implement with timeout
        const mitigatePromise = mitigateRiskService(id);
        const timeoutPromise = new Promise((_, reject) => 
          setTimeout(() => reject(new Error('Request timeout')), 10000)
        );
        
        await Promise.race([mitigatePromise, timeoutPromise]);

        // Update UI accordingly
        const updated = risks.map((r) => {
          if (r.id === id) {
            return { ...r, status: "active", mitigationInProgress: true };
          }
          return r;
        });
        setRisks(updated);
        setSummary(calculateRiskSummary(updated));
        setDistribution(getRiskDistribution(updated));
      } catch (err) {
        const message = err instanceof Error ? err.message : "Mitigation failed";
        setError(message);
        throw new Error(`Failed to mitigate risk: ${message}. Please try again.`);
      } finally {
        setIsLoading(false);
      }
    },
    [risks]
  );

  /**
   * Resolve risk via API
   */
  const resolveRisk = useCallback(
    async (id: string) => {
      try {
        setIsLoading(true);
        setError(null);
        
        // Implement with timeout
        const resolvePromise = resolveRiskService(id);
        const timeoutPromise = new Promise((_, reject) => 
          setTimeout(() => reject(new Error('Request timeout')), 10000)
        );
        
        await Promise.race([resolvePromise, timeoutPromise]);

        const updated = risks.map((r) => {
          if (r.id === id) {
            return { ...r, status: "resolved" };
          }
          return r;
        });
        setRisks(updated);
        setSummary(calculateRiskSummary(updated));
        setDistribution(getRiskDistribution(updated));
      } catch (err) {
        const message = err instanceof Error ? err.message : "Resolution failed";
        setError(message);
        throw new Error(`Failed to resolve risk: ${message}. Please try again.`);
      } finally {
        setIsLoading(false);
      }
    },
    [risks]
  );

  /**
   * Escalate risk via API
   */
  const escalateRisk = useCallback(
    async (id: string, reason: string) => {
      try {
        setIsLoading(true);
        setError(null);
        
        // Implement with timeout
        const escalatePromise = escalateRiskService(id, reason);
        const timeoutPromise = new Promise((_, reject) => 
          setTimeout(() => reject(new Error('Request timeout')), 10000)
        );
        
        await Promise.race([escalatePromise, timeoutPromise]);

        // Update UI to show escalated status
        const updated = risks.map((r) => {
          if (r.id === id) {
            return { ...r, escalated: true };
          }
          return r;
        });
        setRisks(updated);
      } catch (err) {
        const message = err instanceof Error ? err.message : "Escalation failed";
        setError(message);
        throw new Error(`Failed to escalate risk: ${message}. Please try again.`);
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
    mitigateRisk,
    resolveRisk,
    escalateRisk,
  };
};
