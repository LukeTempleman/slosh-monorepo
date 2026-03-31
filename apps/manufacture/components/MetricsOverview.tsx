/**
 * Metrics Overview Component
 * Displays batch KPIs in a grid layout
 */

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  Package,
  CheckCircle,
  AlertCircle,
  TrendingUp,
  Zap,
} from "lucide-react";
import type { BatchMetrics } from "../types";

interface MetricsOverviewProps {
  metrics: BatchMetrics | null;
  isLoading?: boolean;
}

export const MetricsOverview = ({
  metrics,
  isLoading = false,
}: MetricsOverviewProps) => {
  if (isLoading || !metrics) {
    return <div className="text-gray-500">Loading metrics...</div>;
  }

  const metricItems = [
    {
      label: "Total Batches",
      value: metrics.totalBatches,
      icon: Package,
      color: "bg-blue-50",
    },
    {
      label: "Active",
      value: metrics.activeBatches,
      icon: TrendingUp,
      color: "bg-green-50",
    },
    {
      label: "Completed",
      value: metrics.completedBatches,
      icon: CheckCircle,
      color: "bg-emerald-50",
    },
    {
      label: "Rejected",
      value: metrics.rejectedBatches,
      icon: AlertCircle,
      color: "bg-red-50",
    },
    {
      label: "Avg Quality",
      value: `${(metrics.averageQualityScore * 100).toFixed(1)}%`,
      icon: Zap,
      color: "bg-yellow-50",
    },
    {
      label: "Production Rate",
      value: `${metrics.productionRate}/hr`,
      icon: Package,
      color: "bg-purple-50",
    },
  ];

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
      {metricItems.map((item) => {
        const Icon = item.icon;
        return (
          <Card key={item.label} className={item.color}>
            <CardHeader className="pb-2">
              <div className="flex items-center gap-2">
                <Icon className="w-5 h-5 text-gray-600" />
                <CardTitle className="text-sm font-medium text-gray-600">
                  {item.label}
                </CardTitle>
              </div>
            </CardHeader>
            <CardContent>
              <p className="text-3xl font-bold text-gray-900">{item.value}</p>
            </CardContent>
          </Card>
        );
      })}
    </div>
  );
};
