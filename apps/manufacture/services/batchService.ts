/**
 * Batch Service Layer
 * Handles batch CRUD operations and business logic
 * Uses real API calls to backend services
 */

import type {
  Batch,
  BatchMetrics,
  BatchStatus,
  CreateBatchPayload,
} from "../types";
import { batchApi } from "./batchApi";

/**
 * Fetch batches from backend API
 */
export const fetchBatches = async (): Promise<Batch[]> => {
  return batchApi.getAllBatches();
};

/**
 * Calculate batch metrics from batch list
 */
export const calculateMetrics = (batches: Batch[]): BatchMetrics => {
  const total = batches.length;
  const active = batches.filter((b) => b.status === "production").length;
  const completed = batches.filter((b) => b.status === "completed").length;
  const rejected = batches.filter((b) => b.status === "rejected").length;
  const avgQuality =
    batches.length > 0
      ? batches.reduce((sum, b) => sum + b.qualityScore, 0) / batches.length
      : 0;

  return {
    totalBatches: total,
    activeBatches: active,
    completedBatches: completed,
    rejectedBatches: rejected,
    averageQualityScore: Number(avgQuality.toFixed(2)),
    productionRate: 250, // Units per hour (mock value, would come from real data in full implementation)
  };
};

/**
 * Create new batch via API
 */
export const createBatch = async (
  payload: CreateBatchPayload
): Promise<Batch> => {
  return batchApi.createBatch(payload);
};

/**
 * Update batch status via API
 */
export const updateBatchStatus = async (
  batchId: string,
  status: BatchStatus,
  qualityScore?: number
): Promise<Batch> => {
  return batchApi.updateBatchStatus(batchId, status, qualityScore);
};

/**
 * Delete batch via API
 */
export const deleteBatch = async (batchId: string): Promise<void> => {
  return batchApi.deleteBatch(batchId);
};

/**
 * Get risk level color for UI
 */
export const getRiskLevelColor = (
  riskLevel: string
): "destructive" | "default" | "secondary" | "outline" => {
  switch (riskLevel) {
    case "high":
      return "destructive";
    case "medium":
      return "secondary";
    case "low":
      return "default";
    default:
      return "outline";
  }
};

/**
 * Get batch status label
 */
export const getStatusLabel = (status: BatchStatus): string => {
  const labels: Record<BatchStatus, string> = {
    pending: "Pending",
    production: "In Production",
    completed: "Completed",
    rejected: "Rejected",
  };
  return labels[status];
};

/**
 * Format date for display
 */
export const formatDate = (date: Date): string => {
  return new Intl.DateTimeFormat("en-US", {
    month: "short",
    day: "numeric",
    year: "numeric",
  }).format(new Date(date));
};

/**
 * Check if batch is editable
 */
export const isBatchEditable = (batch: Batch): boolean => {
  return batch.status === "pending" || batch.status === "production";
};

/**
 * Get batch status label
 */
export const getStatusLabel = (status: BatchStatus): string => {
  const labels: Record<BatchStatus, string> = {
    pending: "Pending",
    production: "In Production",
    completed: "Completed",
    rejected: "Rejected",
  };
  return labels[status];
};

/**
 * Format date for display
 */
export const formatDate = (date: Date): string => {
  return new Intl.DateTimeFormat("en-US", {
    month: "short",
    day: "numeric",
    year: "numeric",
  }).format(new Date(date));
};

/**
 * Check if batch is editable
 */
export const isBatchEditable = (batch: Batch): boolean => {
  return batch.status === "pending" || batch.status === "production";
};
