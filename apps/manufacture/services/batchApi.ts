/**
 * Batch API Service
 * Handles batch creation, retrieval, and management
 * Follows REST API patterns for consistency
 */

import { manufacturingApi } from './apiClient';
import type { Batch, CreateBatchPayload } from '../types';

class BatchApiService {
  private baseUrl = '/api/batches';

  async getAllBatches(): Promise<Batch[]> {
    try {
      // This is a placeholder - we would implement actual batch endpoints in the backend
      // For now, let's return mock data but with successful API call structure
      
      // Simulate API delay
      await new Promise(resolve => setTimeout(resolve, 300));
      
      // Return a mix of status types to demonstrate the UI
      const mockBatches: Batch[] = [
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
        {
          id: "BTH-2024-004",
          productId: "PRD-PED-300",
          productName: "Pediatric Formula",
          quantity: 2500,
          status: "rejected",
          createdAt: new Date(Date.now() - 3 * 24 * 60 * 60 * 1000),
          completedAt: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000),
          riskLevel: "high",
          qualityScore: 0.65,
          notes: "Failed final quality control",
        }
      ];
      
      return mockBatches;
    } catch (error) {
      console.error('Failed to fetch batches:', error);
      throw error;
    }
  }

  async createBatch(payload: CreateBatchPayload): Promise<Batch> {
    try {
      // In a real implementation, this would POST to /api/batches
      // Simulate API delay
      await new Promise(resolve => setTimeout(resolve, 500));
      
      // Create a new batch with reasonable mock data
      const newBatch: Batch = {
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
      
      return newBatch;
    } catch (error) {
      console.error('Failed to create batch:', error);
      throw error;
    }
  }

  async updateBatchStatus(batchId: string, status: string, qualityScore?: number): Promise<Batch> {
    try {
      // In a real implementation, this would PATCH to /api/batches/:id
      // Simulate API delay
      await new Promise(resolve => setTimeout(resolve, 300));
      
      // Return updated batch (using existing mock batch or creating new)
      const existingBatches = await this.getAllBatches();
      const existingBatch = existingBatches.find(b => b.id === batchId);
      
      if (existingBatch) {
        const updatedBatch = {
          ...existingBatch,
          status: status as any,
          qualityScore: qualityScore !== undefined ? qualityScore : existingBatch.qualityScore,
          completedAt: status === "completed" ? new Date() : existingBatch.completedAt,
        };
        return updatedBatch;
      } else {
        // If we don't find it, create a representative batch for demo purposes
        return {
          id: batchId,
          productId: "PRD-DEFAULT",
          productName: "Default Product",
          quantity: 1000,
          status: status as any,
          createdAt: new Date(),
          completedAt: status === "completed" ? new Date() : undefined,
          riskLevel: "low",
          qualityScore: qualityScore !== undefined ? qualityScore : 0.95,
          notes: "Updated via status change",
        };
      }
    } catch (error) {
      console.error('Failed to update batch status:', error);
      throw error;
    }
  }

  async deleteBatch(batchId: string): Promise<void> {
    try {
      // In a real implementation, this would DELETE to /api/batches/:id
      // Simulate API delay
      await new Promise(resolve => setTimeout(resolve, 200));
      
      // Success response (void)
      return;
    } catch (error) {
      console.error('Failed to delete batch:', error);
      throw error;
    }
  }
}

export const batchApi = new BatchApiService();