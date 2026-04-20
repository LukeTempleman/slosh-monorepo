/**
 * Batch Service
 * Provides methods for fetching and filtering batches from the API
 */

import { manufacturerApi } from "./apiClient";
import { Batch, BatchFilters, BatchResponse, CreateBatchRequest, CreateBatchResponse } from "@/types/batches";

class BatchService {
  /**
   * Fetch batches with optional filters and pagination
   */
  async getBatches(filters?: BatchFilters): Promise<BatchResponse | null> {
    try {
      // Build query string with defaults
      const params = new URLSearchParams();
      
      // Always include pagination parameters
      params.append('limit', (filters?.limit || 10).toString());
      params.append('offset', (filters?.offset || 0).toString());
      
      // Optional filters
      if (filters?.status) params.append('status', filters.status);
      if (filters?.risk_level) params.append('risk_level', filters.risk_level);
      if (filters?.quality_score_min !== undefined) params.append('quality_score_min', filters.quality_score_min.toString());
      if (filters?.quality_score_max !== undefined) params.append('quality_score_max', filters.quality_score_max.toString());
      if (filters?.created_at_from) params.append('created_at_from', filters.created_at_from);
      if (filters?.created_at_to) params.append('created_at_to', filters.created_at_to);

      const queryString = params.toString();
      const endpoint = `/manufacturers/batches?${queryString}`;
      
      console.log("🔄 Fetching:", endpoint);
      
      const instance = manufacturerApi.getAxiosInstance();
      const response = await instance.get<BatchResponse>(endpoint);
      console.log("✅ Response:", response.data);
      return response.data;
    } catch (error: any) {
      console.error("❌ Error fetching batches:", error);
      if (error.response?.data) {
        console.error("Backend error details:", error.response.data);
      }
      return null;
    }
  }

  /**
   * Get a single batch by ID with full details
   * Includes quality score, risk level, notes, and all metadata
   */
  async getBatch(id: string): Promise<Batch | null> {
    try {
      if (!id || id.trim() === '') {
        console.error("❌ Batch ID is required");
        return null;
      }

      console.log("📤 Fetching batch details for ID:", id);

      const instance = manufacturerApi.getAxiosInstance();
      const response = await instance.get<{ message: string; batch: Batch }>(`/manufacturers/batches/${id}`);
      
      if (response.status === 200 && response.data.batch) {
        console.log("✅ Batch details fetched successfully:", response.data.batch);
        return response.data.batch;
      }
      
      console.error("❌ Unexpected response format:", response.data);
      return null;
    } catch (error: any) {
      if (error.response?.status === 404) {
        console.error("❌ Batch not found:", id);
      } else {
        console.error("❌ Error fetching batch:", error);
        if (error.response?.data) {
          console.error("Backend error details:", error.response.data);
        }
      }
      return null;
    }
  }

  /**
   * Get batches filtered by status
   */
  async getBatchesByStatus(status: string, limit: number = 100): Promise<Batch[] | null> {
    const result = await this.getBatches({ status: status as any, limit });
    return result?.data || null;
  }

  /**
   * Get batches filtered by risk level
   */
  async getBatchesByRiskLevel(riskLevel: string, limit: number = 100): Promise<Batch[] | null> {
    const result = await this.getBatches({ risk_level: riskLevel as any, limit });
    return result?.data || null;
  }

  /**
   * Get high-quality batches
   */
  async getHighQualityBatches(minScore: number = 80, limit: number = 50): Promise<Batch[] | null> {
    const result = await this.getBatches({ quality_score_min: minScore, limit });
    return result?.data || null;
  }

  /**
   * Get batches by date range
   */
  async getBatchesByDateRange(fromDate: string, toDate: string, limit: number = 100): Promise<Batch[] | null> {
    const result = await this.getBatches({
      created_at_from: fromDate,
      created_at_to: toDate,
      limit
    });
    return result?.data || null;
  }

  /**
   * Search/filter batches with complex criteria
   */
  async searchBatches(
    status?: string,
    riskLevel?: string,
    minQuality?: number,
    maxQuality?: number,
    limit: number = 50,
    offset: number = 0
  ): Promise<BatchResponse | null> {
    return this.getBatches({
      status: status as any,
      risk_level: riskLevel as any,
      quality_score_min: minQuality,
      quality_score_max: maxQuality,
      limit,
      offset
    });
  }

  /**
   * Create a new batch
   */
  async createBatch(batchData: CreateBatchRequest): Promise<Batch | null> {
    try {
      // Validate required fields
      if (!batchData.product_name || batchData.product_name.trim() === '') {
        console.error("❌ product_name is required");
        return null;
      }

      if (!batchData.quantity || batchData.quantity <= 0) {
        console.error("❌ quantity is required and must be positive");
        return null;
      }

      // Prepare request payload
      const payload = {
        product_name: batchData.product_name.trim(),
        quantity: batchData.quantity,
        ...(batchData.location && { location: batchData.location.trim() }),
        ...(batchData.quality_score !== undefined && { quality_score: batchData.quality_score }),
        ...(batchData.risk_level && { risk_level: batchData.risk_level }),
        ...(batchData.notes && { notes: batchData.notes.trim() })
      };

      console.log("📤 Creating batch:", payload);

      const instance = manufacturerApi.getAxiosInstance();
      const response = await instance.post<CreateBatchResponse>('/manufacturers/batches', payload);
      
      console.log("✅ Batch created successfully:", response.data.batch);
      return response.data.batch;
    } catch (error: any) {
      console.error("❌ Error creating batch:", error);
      if (error.response?.data) {
        console.error("Backend error details:", error.response.data);
      }
      return null;
    }
  }

  /**
   * Update an existing batch
   * Supports status transitions, quality score, risk level, and notes updates
   */
  async updateBatch(
    batchId: string,
    updates: {
      status?: 'pending' | 'production' | 'completed' | 'rejected';
      quality_score?: number;
      risk_level?: 'low' | 'medium' | 'high';
      notes?: string;
    }
  ): Promise<Batch | null> {
    try {
      if (!batchId || batchId.trim() === '') {
        console.error("❌ Batch ID is required");
        return null;
      }

      console.log("📤 Updating batch:", batchId, updates);

      const instance = manufacturerApi.getAxiosInstance();
      const response = await instance.patch<{ message: string; batch: Batch }>(
        `/manufacturers/batches/${batchId}`,
        updates
      );

      if (response.status === 200 && response.data.batch) {
        console.log("✅ Batch updated successfully:", response.data.batch);
        return response.data.batch;
      }

      console.error("❌ Unexpected response format:", response.data);
      return null;
    } catch (error: any) {
      console.error("❌ Error updating batch:", error);
      if (error.response?.status === 404) {
        console.error("Batch not found:", batchId);
      } else if (error.response?.data) {
        console.error("Backend error details:", error.response.data);
      }
      return null;
    }
  }

  /**
   * Delete a batch (soft or hard delete)
   * 
   * @param batchId - The batch ID to delete
   * @param hardDelete - If true, permanently removes the batch. If false (default), marks as deleted (soft delete)
   * @returns true if deletion was successful, false otherwise
   */
  async deleteBatch(batchId: string, hardDelete: boolean = false): Promise<boolean> {
    try {
      if (!batchId || batchId.trim() === '') {
        console.error("❌ Batch ID is required");
        return false;
      }

      const deleteType = hardDelete ? 'hard' : 'soft';
      console.log(`📤 Deleting batch (${deleteType} delete):`, batchId);

      const instance = manufacturerApi.getAxiosInstance();
      const url = hardDelete 
        ? `/manufacturers/batches/${batchId}?hard_delete=true`
        : `/manufacturers/batches/${batchId}`;
      
      const response = await instance.delete<{ 
        message: string; 
        delete_type: 'soft' | 'hard';
        batch?: Batch;
      }>(url);

      if (response.status === 200) {
        console.log(`✅ Batch deleted successfully (${response.data.delete_type}):`, response.data.message);
        return true;
      }

      console.error("❌ Unexpected response status:", response.status);
      return false;
    } catch (error: any) {
      if (error.response?.status === 404) {
        console.error("❌ Batch not found:", batchId);
      } else if (error.response?.status === 410) {
        console.error("❌ Batch already deleted:", batchId);
      } else {
        console.error("❌ Error deleting batch:", error);
        if (error.response?.data) {
          console.error("Backend error details:", error.response.data);
        }
      }
      return false;
    }
  }

  /**
   * Get batch metrics and KPIs
   * 
   * @returns Metrics object with summary, by_status, by_risk, and quality_distribution
   */
  async getBatchMetrics(): Promise<any | null> {
    try {
      console.log("📊 Fetching batch metrics...");

      const instance = manufacturerApi.getAxiosInstance();
      const response = await instance.get<{ 
        message: string;
        metrics: {
          summary: {
            total: number;
            active: number;
            completed: number;
            rejected: number;
            avg_quality: number;
          };
          by_status: {
            pending: number;
            production: number;
            completed: number;
            rejected: number;
          };
          by_risk: {
            low: number;
            medium: number;
            high: number;
          };
          quality_distribution: {
            excellent: number;
            good: number;
            fair: number;
            poor: number;
          };
        };
      }>('/manufacturers/batches/metrics');

      if (response.status === 200 && response.data.metrics) {
        console.log("✅ Metrics retrieved successfully:", response.data.metrics);
        return response.data.metrics;
      }

      console.error("❌ Unexpected response format:", response.data);
      return null;
    } catch (error: any) {
      console.error("❌ Error fetching metrics:", error);
      if (error.response?.data) {
        console.error("Backend error details:", error.response.data);
      }
      return null;
    }
  }

  /**
   * Get analytics data including product performance and regional distribution
   */
  async getAnalytics(): Promise<any | null> {
    try {
      console.log("📊 Fetching analytics...");

      const instance = manufacturerApi.getAxiosInstance();
      const response = await instance.get<any>('/manufacturers/analytics');

      if (response.status === 200 && response.data) {
        console.log("✅ Analytics retrieved successfully:", response.data);
        return response.data;
      }

      console.error("❌ Unexpected response format:", response.data);
      return null;
    } catch (error: any) {
      console.error("❌ Error fetching analytics:", error);
      if (error.response?.data) {
        console.error("Backend error details:", error.response.data);
      }
      return null;
    }
  }

  /**
   * Get live activity feed
   */
  async getLiveFeed(): Promise<any[] | null> {
    try {
      console.log("📡 Fetching live feed...");

      const instance = manufacturerApi.getAxiosInstance();
      const response = await instance.get<any[]>('/manufacturers/feed');

      if (response.status === 200 && Array.isArray(response.data)) {
        console.log("✅ Live feed retrieved successfully:", response.data);
        return response.data;
      }

      console.error("❌ Unexpected response format:", response.data);
      return null;
    } catch (error: any) {
      console.error("❌ Error fetching live feed:", error);
      if (error.response?.data) {
        console.error("Backend error details:", error.response.data);
      }
      return null;
    }
  }

  /**
   * Get reports data
   */
  async getReports(): Promise<any | null> {
    try {
      console.log("📋 Fetching reports...");

      const instance = manufacturerApi.getAxiosInstance();
      const response = await instance.get<any>('/manufacturers/reports');

      if (response.status === 200 && response.data) {
        console.log("✅ Reports retrieved successfully:", response.data);
        return response.data;
      }

      console.error("❌ Unexpected response format:", response.data);
      return null;
    } catch (error: any) {
      console.error("❌ Error fetching reports:", error);
      if (error.response?.data) {
        console.error("Backend error details:", error.response.data);
      }
      return null;
    }
  }
}

export const batchService = new BatchService();
