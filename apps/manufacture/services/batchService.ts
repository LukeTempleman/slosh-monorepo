/**
 * Batch Service Layer
 * Handles batch CRUD operations and business logic
 * Future: Replace implementation with actual API calls
 */

import type {
  Batch,
  BatchMetrics,
  BatchStatus,
  CreateBatchPayload,
} from "../types";

/**
 * Generate mock batch data
 * Future: apiClient.get("/batches")
 */
export const generateMockBatches = (): Batch[] => [
  {
    id: "BTH-2024-001",
    productId: "PRD-VAC-100",
    productName: "Premium Vaccine",
    quantity: 5000,
    status: "completed",
    createdAt: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000),
    completedAt: new Date(Date.now() - 6 * 24 * 60 * 60 * 1000),
    riskLevel: "low",
    qualityScore: 0.98,
    notes: "High quality batch, zero defects",
  },
  {
    id: "BTH-2024-002",
    productId: "PRD-ANT-50",
    productName: "Antibiotics",
    quantity: 3000,
    status: "production",
    createdAt: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000),
    riskLevel: "low",
    qualityScore: 0.95,
    notes: "In production - Day 2/5",
  },
  {
    id: "BTH-2024-003",
    productId: "PRD-VIT-200",
    productName: "Vitamins",
    quantity: 8000,
    status: "production",
    createdAt: new Date(Date.now() - 1 * 24 * 60 * 60 * 1000),
    riskLevel: "medium",
    qualityScore: 0.87,
    notes: "Quality review required",
  },
];

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
    productionRate: 250, // Mock: units per hour
  };
};

/**
 * Create new batch
 * Future: apiClient.post("/batches", payload)
 */
export const createBatch = async (
  payload: CreateBatchPayload
): Promise<Batch> => {
  // Simulate async operation
  await new Promise((resolve) => setTimeout(resolve, 300));

  return {
    id: `BTH-${Date.now()}`,
    productId: payload.productId,
    productName: payload.productName,
    quantity: payload.quantity,
    status: "pending",
    createdAt: new Date(),
    riskLevel: "low",
    qualityScore: 1.0,
    notes: payload.notes || "",
  };
};

/**
 * Update batch status
 * Future: apiClient.patch(`/batches/${id}`, update)
 */
export const updateBatchStatus = async (
  batchId: string,
  status: BatchStatus,
  qualityScore?: number
): Promise<Batch> => {
  // Simulate async operation
  await new Promise((resolve) => setTimeout(resolve, 200));

  const batches = generateMockBatches();
  const batch = batches.find((b) => b.id === batchId);

  if (!batch) throw new Error(`Batch ${batchId} not found`);

  return {
    ...batch,
    status,
    qualityScore: qualityScore ?? batch.qualityScore,
    completedAt: status === "completed" ? new Date() : batch.completedAt,
  };
};

/**
 * Delete batch
 * Future: apiClient.delete(`/batches/${id}`)
 */
export const deleteBatch = async (_batchId: string): Promise<void> => {
  // Simulate async operation
  await new Promise((resolve) => setTimeout(resolve, 200));
  // Mock implementation
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
