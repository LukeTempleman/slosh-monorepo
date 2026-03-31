/**
 * Risk Metrics Component
 * Displays risk KPIs in a 2x3 grid
 */

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  AlertTriangle,
  AlertCircle,
  Gauge,
  Activity,
  Zap,
} from "lucide-react";
import type { RiskSummary } from "../types";

interface RiskMetricsProps {
  summary: RiskSummary | null;
  isLoading?: boolean;
}

export const RiskMetrics = ({ summary, isLoading = false }: RiskMetricsProps) => {
  if (isLoading || !summary) {
    return <div className="text-gray-500">Loading risk metrics...</div>;
  }

  const metrics = [
    {
      label: "Total Risks",
      value: summary.totalAssessments,
      icon: Gauge,
      color: "bg-blue-50",
    },
    {
      label: "Critical",
      value: summary.criticalRisks,
      icon: AlertTriangle,
      color: "bg-red-50",
      highlight: true,
    },
    {
      label: "High",
      value: summary.highRisks,
      icon: AlertCircle,
      color: "bg-orange-50",
    },
    {
      label: "Active Risks",
      value: summary.activeRisks,
      icon: Activity,
      color: "bg-yellow-50",
    },
    {
      label: "Avg Score",
      value: `${summary.avgRiskScore}%`,
      icon: Gauge,
      color: "bg-purple-50",
    },
    {
      label: "Medium",
      value: summary.mediumRisks,
      icon: Zap,
      color: "bg-indigo-50",
    },
  ];

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
      {metrics.map((metric) => {
        const Icon = metric.icon;
        return (
          <Card key={metric.label} className={metric.color}>
            <CardHeader className="pb-2">
              <div className="flex items-center gap-2">
                <Icon className="w-5 h-5 text-gray-600" />
                <CardTitle className="text-sm font-medium text-gray-600">
                  {metric.label}
                </CardTitle>
              </div>
            </CardHeader>
            <CardContent>
              <p
                className={`text-3xl font-bold ${metric.highlight ? "text-red-600" : "text-gray-900"}`}
              >
                {metric.value}
              </p>
            </CardContent>
          </Card>
        );
      })}
    </div>
  );
};
