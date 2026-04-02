/**
 * useBatchManager Hook
 * Manages batch operations and state with real API integration
 * Isolated from UI - can be tested independently
 */

import { useState, useCallback, useEffect } from "react";
import {
  fetchBatches,
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
   * Fetch batches from API
   */
  const loadBatches = useCallback(async () => {
    try {
      setIsLoading(true);
      setError(null);
      const data = await fetchBatches();
      setBatches(data);
      setMetrics(calculateMetrics(data));
    } catch (err) {
      const message = err instanceof Error ? err.message : "Failed to load batches";
      setError(message);
      // Show user-friendly error message
      throw new Error(`Could not load batches: ${message}. Please check your connection and try again.`);
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
        const newBatchPromise = createBatchService(payload);
        const timeoutPromise = new Promise((_, reject) => 
          setTimeout(() => reject(new Error('Request timeout')), 10000)
        );
        
        const newBatch = await Promise.race([newBatchPromise, timeoutPromise]) as any;
        
        setBatches(prevBatches => [newBatch, ...prevBatches]);
        setMetrics(prevMetrics => {
          if (prevMetrics) {
            return calculateMetrics([newBatch, ...batches]);
          }
          return calculateMetrics([newBatch]);
        });
        return newBatch;
      } catch (err) {
        const message = err instanceof Error ? err.message : "Creation failed";
        setError(message);
        // Provide user feedback about the error
        throw new Error(`Failed to create batch: ${message}. Please check your input and try again.`);
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
        
        const updatePromise = updateBatchStatusService(
          batchId,
          status as any,
          qualityScore
        );
        
        const timeoutPromise = new Promise((_, reject) => 
          setTimeout(() => reject(new Error('Request timeout')), 10000)
        );
        
        const updated = await Promise.race([updatePromise, timeoutPromise]) as any;

        const newBatches = batches.map((b) => (b.id === batchId ? updated : b));
        setBatches(newBatches);
        setMetrics(calculateMetrics(newBatches));
        return updated;
      } catch (err) {
        const message = err instanceof Error ? err.message : "Update failed";
        setError(message);
        // Provide user feedback about the error
        throw new Error(`Failed to update batch status: ${message}. Please try again.`);
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
        
        const deletePromise = deleteBatchService(batchId);
        const timeoutPromise = new Promise((_, reject) => 
          setTimeout(() => reject(new Error('Request timeout')), 10000)
        );
        
        await Promise.race([deletePromise, timeoutPromise]);

        const newBatches = batches.filter((b) => b.id !== batchId);
        setBatches(newBatches);
        setMetrics(calculateMetrics(newBatches));
      } catch (err) {
        const message = err instanceof Error ? err.message : "Deletion failed";
        setError(message);
        // Provide user feedback about the error
        throw new Error(`Failed to delete batch: ${message}. Please try again.`);
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
