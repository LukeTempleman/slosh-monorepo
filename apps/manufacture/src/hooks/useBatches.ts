/**
 * useBatches Hook
 * Manages batch fetching, filtering, and pagination
 */

import { useState, useEffect, useCallback } from "react";
import { batchService } from "@/services/batchService";
import { Batch, BatchFilters, BatchStatus, RiskLevel } from "@/types/batches";

interface UseBatchesOptions {
  autoFetch?: boolean;
  initialFilters?: BatchFilters;
}

interface UseBatchesResult {
  batches: Batch[];
  loading: boolean;
  error: string | null;
  pagination: {
    total: number;
    limit: number;
    offset: number;
    hasMore: boolean;
  };
  filters: BatchFilters;
  
  // Methods
  fetchBatches: (filters?: BatchFilters) => Promise<void>;
  refetch: () => Promise<void>;
  setStatus: (status?: BatchStatus) => void;
  setRiskLevel: (riskLevel?: RiskLevel) => void;
  setQualityScore: (min?: number, max?: number) => void;
  setDateRange: (from?: string, to?: string) => void;
  setPagination: (limit: number, offset: number) => void;
  clearFilters: () => void;
  previousPage: () => Promise<void>;
  nextPage: () => Promise<void>;
}

export const useBatches = (options?: UseBatchesOptions): UseBatchesResult => {
  const [batches, setBatches] = useState<Batch[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [filters, setFilters] = useState<BatchFilters>(options?.initialFilters || {
    limit: 10,
    offset: 0
  });
  const [pagination, setPagination] = useState({
    total: 0,
    limit: 10,
    offset: 0,
    hasMore: false
  });

  // Fetch batches
  const fetchBatches = useCallback(async (newFilters?: BatchFilters) => {
    setLoading(true);
    setError(null);
    
    try {
      const filtersToUse = newFilters || filters;
      console.log("Fetching batches with filters:", filtersToUse);
      const response = await batchService.getBatches(filtersToUse);
      
      if (response) {
        setBatches(response.data);
        // Calculate hasMore based on returned count
        const hasMore = (filtersToUse.offset || 0) + response.data.length < response.pagination.total;
        setPagination({
          total: response.pagination.total,
          limit: response.pagination.limit,
          offset: response.pagination.offset,
          hasMore: hasMore
        });
        setFilters(filtersToUse);
        console.log("Batches fetched successfully:", response.data.length, "of", response.pagination.total);
      } else {
        setError("Failed to fetch batches - no response from server");
        console.error("No response from batchService.getBatches");
      }
    } catch (err) {
      const message = err instanceof Error ? err.message : "An error occurred";
      setError(message);
      console.error("useBatches error:", err);
    } finally {
      setLoading(false);
    }
  }, [filters]);

  // Auto-fetch on mount
  useEffect(() => {
    if (options?.autoFetch !== false) {
      console.log("Auto-fetching batches on mount");
      fetchBatches();
    }
  }, [fetchBatches, options?.autoFetch]);

  // Filter methods
  const setStatus = useCallback((status?: BatchStatus) => {
    const newFilters = { ...filters, status, offset: 0 };
    setFilters(newFilters);
    fetchBatches(newFilters);
  }, [filters, fetchBatches]);

  const setRiskLevel = useCallback((riskLevel?: RiskLevel) => {
    const newFilters = { ...filters, risk_level: riskLevel, offset: 0 };
    setFilters(newFilters);
    fetchBatches(newFilters);
  }, [filters, fetchBatches]);

  const setQualityScore = useCallback((min?: number, max?: number) => {
    const newFilters = {
      ...filters,
      quality_score_min: min,
      quality_score_max: max,
      offset: 0
    };
    setFilters(newFilters);
    fetchBatches(newFilters);
  }, [filters, fetchBatches]);

  const setDateRange = useCallback((from?: string, to?: string) => {
    const newFilters = {
      ...filters,
      created_at_from: from,
      created_at_to: to,
      offset: 0
    };
    setFilters(newFilters);
    fetchBatches(newFilters);
  }, [filters, fetchBatches]);

  const setPaginationState = useCallback((limit: number, offset: number) => {
    const newFilters = { ...filters, limit, offset };
    setFilters(newFilters);
    fetchBatches(newFilters);
  }, [filters, fetchBatches]);

  const clearFilters = useCallback(() => {
    const newFilters = { limit: 10, offset: 0 };
    setFilters(newFilters);
    fetchBatches(newFilters);
  }, [fetchBatches]);

  const previousPage = useCallback(async () => {
    const newOffset = Math.max(0, pagination.offset - pagination.limit);
    setPaginationState(pagination.limit, newOffset);
  }, [pagination, setPaginationState]);

  const nextPage = useCallback(async () => {
    if (pagination.hasMore) {
      const newOffset = pagination.offset + pagination.limit;
      setPaginationState(pagination.limit, newOffset);
    }
  }, [pagination, setPaginationState]);

  // Refetch with current filters
  const refetch = useCallback(async () => {
    console.log("Refetching batches with current filters");
    await fetchBatches(filters);
  }, [filters, fetchBatches]);

  return {
    batches,
    loading,
    error,
    pagination,
    filters,
    fetchBatches,
    refetch,
    setStatus,
    setRiskLevel,
    setQualityScore,
    setDateRange,
    setPagination: setPaginationState,
    clearFilters,
    previousPage,
    nextPage
  };
};
