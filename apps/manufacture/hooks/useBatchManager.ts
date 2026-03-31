/**
 * useBatchManager Hook
 * Manages batch operations and state
 * Isolated from UI - can be tested independently
 */

import { useState, useCallback, useEffect } from "react";
import {
  generateMockBatches,
  calculateMetrics,
  createBatch as createBatchService,
  updateBatchStatus as updateBatchStatusService,
  deleteBatch as deleteBatchService,
} from "../services/batchService";
import type { Batch, BatchMetrics, CreateBatchPayload } from "../types";

export const useBatchManager = () => {
  const [batches, setBatches] = useState<Batch[]>([]);
  const [metrics, setMetrics] = useState<BatchMetrics | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  /**
   * Load batches on mount
   */
  useEffect(() => {
    loadBatches();
  }, []);

  /**
   * Fetch batches from service
   */
  const loadBatches = useCallback(async () => {
    try {
      setIsLoading(true);
      setError(null);
      const data = generateMockBatches();
      setBatches(data);
      setMetrics(calculateMetrics(data));
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to load batches");
    } finally {
      setIsLoading(false);
    }
  }, []);

  /**
   * Create new batch
   */
  const createBatch = useCallback(
    async (payload: CreateBatchPayload) => {
      try {
        setIsLoading(true);
        setError(null);
        const newBatch = await createBatchService(payload);
        setBatches([newBatch, ...batches]);
        setMetrics(calculateMetrics([newBatch, ...batches]));
        return newBatch;
      } catch (err) {
        const message = err instanceof Error ? err.message : "Creation failed";
        setError(message);
        throw err;
      } finally {
        setIsLoading(false);
      }
    },
    [batches]
  );

  /**
   * Update batch status
   */
  const updateStatus = useCallback(
    async (batchId: string, status: string, qualityScore?: number) => {
      try {
        setIsLoading(true);
        setError(null);

        const updated = await updateBatchStatusService(
          batchId,
          status as any,
          qualityScore
        );

        const newBatches = batches.map((b) => (b.id === batchId ? updated : b));
        setBatches(newBatches);
        setMetrics(calculateMetrics(newBatches));
        return updated;
      } catch (err) {
        const message = err instanceof Error ? err.message : "Update failed";
        setError(message);
        throw err;
      } finally {
        setIsLoading(false);
      }
    },
    [batches]
  );

  /**
   * Delete batch
   */
  const deleteBatch = useCallback(
    async (batchId: string) => {
      try {
        setIsLoading(true);
        setError(null);
        await deleteBatchService(batchId);

        const newBatches = batches.filter((b) => b.id !== batchId);
        setBatches(newBatches);
        setMetrics(calculateMetrics(newBatches));
      } catch (err) {
        const message = err instanceof Error ? err.message : "Deletion failed";
        setError(message);
        throw err;
      } finally {
        setIsLoading(false);
      }
    },
    [batches]
  );

  /**
   * Get single batch
   */
  const getBatchById = useCallback(
    (id: string): Batch | undefined => batches.find((b) => b.id === id),
    [batches]
  );

  /**
   * Filter batches
   */
  const filterBatches = useCallback((status?: string): Batch[] => {
    if (!status) return batches;
    return batches.filter((b) => b.status === status);
  }, [batches]);

  return {
    // State
    batches,
    metrics,
    isLoading,
    error,

    // Actions
    loadBatches,
    createBatch,
    updateStatus,
    deleteBatch,
    getBatchById,
    filterBatches,
  };
};
