/**
 * Batch List Component
 * Displays batch data in a table with sorting and filtering
 */

import { useState } from "react";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  getRiskLevelColor,
  getStatusLabel,
  formatDate,
  isBatchEditable,
} from "../services/batchService";
import type { Batch, BatchStatus } from "../types";

interface BatchListProps {
  batches: Batch[];
  onStatusChange: (batchId: string, status: BatchStatus) => void;
  onDelete: (batchId: string) => void;
  isLoading?: boolean;
}

export const BatchList = ({
  batches,
  onStatusChange,
  onDelete,
  isLoading = false,
}: BatchListProps) => {
  const [filterStatus, setFilterStatus] = useState<BatchStatus | null>(null);

  const filteredBatches = filterStatus
    ? batches.filter((b) => b.status === filterStatus)
    : batches;

  if (isLoading) {
    return <div className="text-gray-500">Loading batches...</div>;
  }

  return (
    <div className="space-y-4">
      {/* Filter */}
      <div className="flex gap-2">
        <Select
          value={filterStatus || "all"}
          onValueChange={(value) =>
            setFilterStatus(value === "all" ? null : (value as BatchStatus))
          }
        >
          <SelectTrigger className="w-32">
            <SelectValue placeholder="Filter by status" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All</SelectItem>
            <SelectItem value="pending">Pending</SelectItem>
            <SelectItem value="production">Production</SelectItem>
            <SelectItem value="completed">Completed</SelectItem>
            <SelectItem value="rejected">Rejected</SelectItem>
          </SelectContent>
        </Select>
      </div>

      {/* Table */}
      <div className="border rounded-lg overflow-hidden">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Batch ID</TableHead>
              <TableHead>Product</TableHead>
              <TableHead>Qty</TableHead>
              <TableHead>Status</TableHead>
              <TableHead>Risk</TableHead>
              <TableHead>Quality</TableHead>
              <TableHead>Created</TableHead>
              <TableHead>Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {filteredBatches.length === 0 ? (
              <TableRow>
                <TableCell colSpan={8} className="text-center py-8 text-gray-500">
                  No batches found
                </TableCell>
              </TableRow>
            ) : (
              filteredBatches.map((batch) => (
                <TableRow key={batch.id}>
                  <TableCell className="font-mono text-sm">{batch.id}</TableCell>
                  <TableCell>{batch.productName}</TableCell>
                  <TableCell>{batch.quantity.toLocaleString()}</TableCell>
                  <TableCell>
                    <Badge variant="outline">{getStatusLabel(batch.status)}</Badge>
                  </TableCell>
                  <TableCell>
                    <Badge variant={getRiskLevelColor(batch.riskLevel)}>
                      {batch.riskLevel}
                    </Badge>
                  </TableCell>
                  <TableCell>
                    <span className="font-semibold">
                      {(batch.qualityScore * 100).toFixed(0)}%
                    </span>
                  </TableCell>
                  <TableCell className="text-sm text-gray-600">
                    {formatDate(batch.createdAt)}
                  </TableCell>
                  <TableCell>
                    {isBatchEditable(batch) && (
                      <div className="flex gap-1">
                        <Select
                          value=""
                          onValueChange={(status) =>
                            onStatusChange(batch.id, status as BatchStatus)
                          }
                        >
                          <SelectTrigger className="h-8 w-24">
                            <SelectValue placeholder="Update" />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="production">Start</SelectItem>
                            <SelectItem value="completed">Complete</SelectItem>
                            <SelectItem value="rejected">Reject</SelectItem>
                          </SelectContent>
                        </Select>
                        <Button
                          size="sm"
                          variant="destructive"
                          onClick={() => onDelete(batch.id)}
                        >
                          Delete
                        </Button>
                      </div>
                    )}
                  </TableCell>
                </TableRow>
              ))
            )}
          </TableBody>
        </Table>
      </div>
    </div>
  );
};
