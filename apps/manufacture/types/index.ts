/**
 * Manufacturer Feature Types
 * Domain-specific types for batch management and production analytics
 */

export type BatchStatus = "pending" | "production" | "completed" | "rejected";
export type ManufacturerRole = "admin" | "supervisor" | "operator";

export interface Batch {
  id: string;
  productId: string;
  productName: string;
  quantity: number;
  status: BatchStatus;
  createdAt: Date;
  completedAt?: Date;
  riskLevel: "low" | "medium" | "high";
  qualityScore: number;
  notes: string;
}

export interface BatchMetrics {
  totalBatches: number;
  activeBatches: number;
  completedBatches: number;
  rejectedBatches: number;
  averageQualityScore: number;
  productionRate: number; // units per hour
}

export interface ManufacturerUser {
  id: string;
  name: string;
  email: string;
  role: ManufacturerRole;
  facilityId: string;
  createdAt: Date;
}

export interface Facility {
  id: string;
  name: string;
  location: string;
  capacity: number;
  currentLoad: number;
}

export interface BatchUpdate {
  id: string;
  status: BatchStatus;
  qualityScore?: number;
  notes?: string;
  timestamp: Date;
}

/**
 * Batch creation payload (for API)
 */
export interface CreateBatchPayload {
  productId: string;
  productName: string;
  quantity: number;
  facilityId: string;
  notes?: string;
}

/**
 * API response types (future integration)
 */
export interface ManufacturerApiResponse<T> {
  success: boolean;
  data: T;
  message?: string;
  timestamp: Date;
}
