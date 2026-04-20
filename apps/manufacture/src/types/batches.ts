/**
 * Batch Types for Manufacturing App
 * Matches backend API response structure
 */

export type BatchStatus = 'pending' | 'production' | 'completed' | 'rejected';
export type RiskLevel = 'low' | 'medium' | 'high';

export interface Batch {
  id: string;
  product_name: string;
  status: BatchStatus;
  risk_level: RiskLevel;
  quantity: number;
  quality_score: number;
  location: string;
  created_at: string;
  updated_at: string;
  created_by: number;
  notes: string;
}

export interface BatchFilters {
  status?: BatchStatus;
  risk_level?: RiskLevel;
  quality_score_min?: number;
  quality_score_max?: number;
  created_at_from?: string;
  created_at_to?: string;
  limit?: number;
  offset?: number;
}

export interface BatchResponse {
  data: Batch[];
  pagination: {
    total: number;
    limit: number;
    offset: number;
    returned: number;
  };
  filters_applied: Record<string, any>;
}

export interface BatchError {
  error: string;
  details?: Record<string, string>;
}

export interface CreateBatchRequest {
  product_name: string;
  quantity: number;
  location?: string;
  quality_score?: number;
  risk_level?: RiskLevel;
  notes?: string;
}

export interface CreateBatchResponse {
  message: string;
  batch: Batch;
}
