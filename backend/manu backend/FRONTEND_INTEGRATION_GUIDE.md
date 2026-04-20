# Frontend Integration Guide - Batches API

## Overview

This guide helps frontend developers integrate the Manufacturing Backend's Batches API into their applications. The API provides batch filtering, pagination, and robust error handling.

---

## Prerequisites

- JWT authentication token (obtained from `/auth/login`)
- Base URL: `http://localhost:5001` (or your backend URL)
- Understanding of async/await and error handling

---

## 1. Setting Up the API Client

### TypeScript Interface
```typescript
// types/batch.ts
export interface Batch {
  id: string;
  product_name: string;
  quantity: number;
  status: 'pending' | 'production' | 'completed' | 'rejected';
  quality_score: number;
  risk_level: 'low' | 'medium' | 'high';
  location: string;
  created_at: string;
  updated_at: string;
  created_by: number;
  notes: string;
}

export interface BatchFilters {
  status?: 'pending' | 'production' | 'completed' | 'rejected';
  created_at_from?: string;
  created_at_to?: string;
  quality_score_min?: number;
  quality_score_max?: number;
  risk_level?: 'low' | 'medium' | 'high';
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
  filters_applied: BatchFilters;
}
```

### API Service Class
```typescript
// services/batchService.ts
import { BatchFilters, BatchResponse } from '../types/batch';

class BatchService {
  private baseUrl = 'http://localhost:5001';
  private batchesEndpoint = `${this.baseUrl}/api/batches`;

  /**
   * Get batches with optional filters
   */
  async getBatches(filters?: BatchFilters): Promise<BatchResponse> {
    const token = localStorage.getItem('access_token');
    
    if (!token) {
      throw new Error('Authentication token not found');
    }

    // Build query string
    const params = new URLSearchParams();
    if (filters) {
      if (filters.status) params.append('status', filters.status);
      if (filters.created_at_from) params.append('created_at_from', filters.created_at_from);
      if (filters.created_at_to) params.append('created_at_to', filters.created_at_to);
      if (filters.quality_score_min !== undefined) params.append('quality_score_min', String(filters.quality_score_min));
      if (filters.quality_score_max !== undefined) params.append('quality_score_max', String(filters.quality_score_max));
      if (filters.risk_level) params.append('risk_level', filters.risk_level);
      params.append('limit', String(filters.limit || 100));
      params.append('offset', String(filters.offset || 0));
    }

    const url = `${this.batchesEndpoint}?${params.toString()}`;

    try {
      const response = await fetch(url, {
        method: 'GET',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        }
      });

      if (!response.ok) {
        const error = await response.json();
        throw new Error(error.error || `HTTP ${response.status}`);
      }

      return await response.json();
    } catch (error) {
      console.error('Error fetching batches:', error);
      throw error;
    }
  }

  /**
   * Get batches with status filter
   */
  async getBatchesByStatus(status: string, limit = 100): Promise<BatchResponse> {
    return this.getBatches({ status: status as any, limit });
  }

  /**
   * Get high-risk batches
   */
  async getHighRiskBatches(limit = 100): Promise<BatchResponse> {
    return this.getBatches({ risk_level: 'high', limit });
  }

  /**
   * Get recent batches
   */
  async getRecentBatches(daysBack = 7, limit = 100): Promise<BatchResponse> {
    const fromDate = new Date();
    fromDate.setDate(fromDate.getDate() - daysBack);
    
    return this.getBatches({
      created_at_from: fromDate.toISOString().split('T')[0],
      limit
    });
  }

  /**
   * Get low-quality batches
   */
  async getLowQualityBatches(maxScore = 70, limit = 100): Promise<BatchResponse> {
    return this.getBatches({
      quality_score_max: maxScore,
      limit
    });
  }
}

export default new BatchService();
```

---

## 2. Using in React Components

### Basic Example
```typescript
// pages/ManufacturerPage.tsx
import { useState, useEffect } from 'react';
import batchService from '../services/batchService';
import { Batch, BatchResponse } from '../types/batch';

export default function ManufacturerPage() {
  const [batches, setBatches] = useState<Batch[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    loadBatches();
  }, []);

  const loadBatches = async () => {
    setLoading(true);
    setError(null);
    try {
      const response = await batchService.getBatches({ limit: 50 });
      setBatches(response.data);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to load batches');
    } finally {
      setLoading(false);
    }
  };

  if (loading) return <div>Loading batches...</div>;
  if (error) return <div className="error">{error}</div>;

  return (
    <div>
      <h1>Batches</h1>
      <div className="batch-list">
        {batches.map(batch => (
          <div key={batch.id} className="batch-card">
            <h3>{batch.product_name}</h3>
            <p>Status: {batch.status}</p>
            <p>Quality Score: {batch.quality_score}%</p>
            <p>Risk Level: {batch.risk_level}</p>
          </div>
        ))}
      </div>
    </div>
  );
}
```

### With Filters
```typescript
// pages/BatchList.tsx
import { useState } from 'react';
import batchService from '../services/batchService';
import { Batch, BatchFilters, BatchResponse } from '../types/batch';

export default function BatchList() {
  const [batches, setBatches] = useState<Batch[]>([]);
  const [filters, setFilters] = useState<BatchFilters>({});
  const [pagination, setPagination] = useState({ total: 0, page: 0, pageSize: 50 });

  const handleFilterChange = (newFilters: BatchFilters) => {
    setFilters(newFilters);
    handleSearch(newFilters);
  };

  const handleSearch = async (searchFilters: BatchFilters) => {
    try {
      const response = await batchService.getBatches({
        ...searchFilters,
        limit: pagination.pageSize
      });
      setBatches(response.data);
      setPagination({
        total: response.pagination.total,
        page: 0,
        pageSize: pagination.pageSize
      });
    } catch (error) {
      console.error('Filter error:', error);
    }
  };

  const handlePagination = async (page: number) => {
    try {
      const response = await batchService.getBatches({
        ...filters,
        limit: pagination.pageSize,
        offset: page * pagination.pageSize
      });
      setBatches(response.data);
      setPagination(p => ({ ...p, page }));
    } catch (error) {
      console.error('Pagination error:', error);
    }
  };

  return (
    <div>
      <BatchFilters onFilter={handleFilterChange} />
      <BatchTable batches={batches} />
      <Pagination 
        current={pagination.page}
        total={Math.ceil(pagination.total / pagination.pageSize)}
        onChange={handlePagination}
      />
    </div>
  );
}
```

### Filter Component
```typescript
// components/BatchFilters.tsx
import { useState } from 'react';
import { BatchFilters } from '../types/batch';
import { Select, Input, Button, DatePicker } from '@/components/ui';

export default function BatchFilters({ onFilter }: { onFilter: (filters: BatchFilters) => void }) {
  const [filters, setFilters] = useState<BatchFilters>({});

  const handleSubmit = () => {
    onFilter(filters);
  };

  return (
    <div className="filters">
      <Select
        label="Status"
        value={filters.status || ''}
        onChange={(e) => setFilters({ ...filters, status: e.target.value as any })}
      >
        <option value="">All Status</option>
        <option value="pending">Pending</option>
        <option value="production">Production</option>
        <option value="completed">Completed</option>
        <option value="rejected">Rejected</option>
      </Select>

      <Select
        label="Risk Level"
        value={filters.risk_level || ''}
        onChange={(e) => setFilters({ ...filters, risk_level: e.target.value as any })}
      >
        <option value="">All Risk</option>
        <option value="low">Low</option>
        <option value="medium">Medium</option>
        <option value="high">High</option>
      </Select>

      <Input
        label="Quality Score Min"
        type="number"
        min={0}
        max={100}
        value={filters.quality_score_min || ''}
        onChange={(e) => setFilters({ ...filters, quality_score_min: parseInt(e.target.value) })}
      />

      <Input
        label="Quality Score Max"
        type="number"
        min={0}
        max={100}
        value={filters.quality_score_max || ''}
        onChange={(e) => setFilters({ ...filters, quality_score_max: parseInt(e.target.value) })}
      />

      <DatePicker
        label="Created From"
        value={filters.created_at_from || ''}
        onChange={(date) => setFilters({ ...filters, created_at_from: date })}
      />

      <DatePicker
        label="Created To"
        value={filters.created_at_to || ''}
        onChange={(date) => setFilters({ ...filters, created_at_to: date })}
      />

      <Button onClick={handleSubmit}>Apply Filters</Button>
      <Button onClick={() => { setFilters({}); onFilter({}); }} variant="outline">Reset</Button>
    </div>
  );
}
```

---

## 3. Error Handling

```typescript
// utils/apiErrorHandler.ts
export class APIError extends Error {
  constructor(
    public statusCode: number,
    message: string,
    public isNetworkError = false
  ) {
    super(message);
  }
}

export async function handleAPICall<T>(
  apiCall: () => Promise<T>
): Promise<T> {
  try {
    return await apiCall();
  } catch (error) {
    if (error instanceof TypeError) {
      // Network error
      throw new APIError(0, 'Network error. Check your connection.', true);
    }
    
    if (error instanceof Error) {
      if (error.message.includes('401')) {
        throw new APIError(401, 'Session expired. Please login again.');
      }
      if (error.message.includes('400')) {
        throw new APIError(400, 'Invalid filter parameters.');
      }
      if (error.message.includes('500')) {
        throw new APIError(500, 'Server error. Please try again later.');
      }
    }
    
    throw error;
  }
}
```

---

## 4. State Management (if using Redux/Context)

```typescript
// slices/batchSlice.ts (Redux)
import { createAsyncThunk, createSlice } from '@reduxjs/toolkit';
import batchService from '../services/batchService';
import { Batch, BatchFilters } from '../types/batch';

export const fetchBatches = createAsyncThunk(
  'batch/fetchBatches',
  async (filters?: BatchFilters, { rejectWithValue }) => {
    try {
      return await batchService.getBatches(filters);
    } catch (error) {
      return rejectWithValue(error instanceof Error ? error.message : 'Failed to fetch');
    }
  }
);

interface BatchState {
  items: Batch[];
  loading: boolean;
  error: string | null;
  pagination: { total: number; limit: number; offset: number };
}

const initialState: BatchState = {
  items: [],
  loading: false,
  error: null,
  pagination: { total: 0, limit: 100, offset: 0 }
};

const batchSlice = createSlice({
  name: 'batch',
  initialState,
  extraReducers: (builder) => {
    builder
      .addCase(fetchBatches.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchBatches.fulfilled, (state, action) => {
        state.loading = false;
        state.items = action.payload.data;
        state.pagination = action.payload.pagination;
      })
      .addCase(fetchBatches.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      });
  }
});

export default batchSlice.reducer;
```

---

## 5. Testing

```typescript
// __tests__/batchService.test.ts
import batchService from '../services/batchService';

describe('BatchService', () => {
  it('should fetch batches with authentication', async () => {
    localStorage.setItem('access_token', 'test_token');
    
    const response = await batchService.getBatches();
    
    expect(response.data).toBeDefined();
    expect(response.pagination).toBeDefined();
  });

  it('should filter by status', async () => {
    const response = await batchService.getBatches({ status: 'completed' });
    
    expect(response.filters_applied.status).toBe('completed');
  });

  it('should throw error without token', async () => {
    localStorage.removeItem('access_token');
    
    await expect(batchService.getBatches()).rejects.toThrow();
  });
});
```

---

## 6. Common Patterns

### Polling for Updates
```typescript
function usePollingBatches(interval = 5000) {
  const [batches, setBatches] = useState<Batch[]>([]);

  useEffect(() => {
    const timer = setInterval(async () => {
      try {
        const response = await batchService.getBatches();
        setBatches(response.data);
      } catch (error) {
        console.error('Polling error:', error);
      }
    }, interval);

    return () => clearInterval(timer);
  }, [interval]);

  return batches;
}
```

### Infinite Scroll
```typescript
function useBatchesInfiniteScroll() {
  const [batches, setBatches] = useState<Batch[]>([]);
  const [hasMore, setHasMore] = useState(true);
  const [offset, setOffset] = useState(0);

  const loadMore = async () => {
    const response = await batchService.getBatches({
      limit: 20,
      offset
    });
    
    setBatches(prev => [...prev, ...response.data]);
    setHasMore(response.pagination.returned > 0);
    setOffset(offset + 20);
  };

  return { batches, hasMore, loadMore };
}
```

---

## Troubleshooting

| Issue | Solution |
|-------|----------|
| 401 Unauthorized | Check token is valid and not expired |
| 400 Bad Request | Verify filter parameters match allowed values |
| 500 Server Error | Check backend logs: `docker logs -f manu_flask` |
| Empty results | Verify sample data was seeded |
| CORS errors | Check backend CORS configuration |

---

## Support

- **API Documentation**: See `docs/BATCHES_API.md`
- **Quick Reference**: See `BATCHES_API_QUICK_REFERENCE.md`
- **Backend Tests**: Run `python test_batches_api.py` or `.\test_batches_api.ps1`
