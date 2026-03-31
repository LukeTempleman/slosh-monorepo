/**
 * Risk Alert List Component
 * Displays active risks with details and actions
 */

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { AlertTriangle, AlertCircle } from "lucide-react";
import { getRiskLevelColor, formatRiskScore } from "../services/riskService";
import type { RiskAssessment } from "../types";

interface RiskAlertListProps {
  risks: RiskAssessment[];
  onResolve?: (riskId: string) => void;
  isLoading?: boolean;
}

export const RiskAlertList = ({
  risks,
  onResolve,
  isLoading = false,
}: RiskAlertListProps) => {
  if (isLoading) {
    return <div className="text-gray-500">Loading risks...</div>;
  }

  const activeRisks = risks.filter((r) => r.status === "active");

  if (activeRisks.length === 0) {
    return (
      <div className="p-8 text-center text-gray-500">
        ✓ No active risks detected
      </div>
    );
  }

  return (
    <div className="space-y-4">
      {activeRisks.map((risk) => (
        <Card
          key={risk.id}
          className={`border-l-4 ${
            risk.riskLevel === "critical"
              ? "border-l-red-600 bg-red-50"
              : risk.riskLevel === "high"
                ? "border-l-orange-600 bg-orange-50"
                : "border-l-yellow-600 bg-yellow-50"
          }`}
        >
          <CardHeader className="pb-2">
            <div className="flex items-start justify-between">
              <div className="flex gap-3 items-start flex-1">
                {risk.riskLevel === "critical" ? (
                  <AlertTriangle className="w-5 h-5 text-red-600 mt-1" />
                ) : (
                  <AlertCircle className="w-5 h-5 text-orange-600 mt-1" />
                )}
                <div>
                  <CardTitle className="text-lg">{risk.productName}</CardTitle>
                  <p className="text-sm text-gray-600">ID: {risk.id}</p>
                </div>
              </div>
              <Badge className={getRiskLevelColor(risk.riskLevel)}>
                {formatRiskScore(risk.riskScore)}
              </Badge>
            </div>
          </CardHeader>
          <CardContent className="space-y-3">
            {/* Category & Factors */}
            <div>
              <p className="text-sm font-medium text-gray-700 mb-1">
                Category: <span className="capitalize">{risk.category}</span>
              </p>
              <div className="space-y-1">
                {risk.factors.slice(0, 2).map((factor) => (
                  <p key={factor.name} className="text-xs text-gray-600">
                    • {factor.name}: {factor.impact}% impact
                  </p>
                ))}
              </div>
            </div>

            {/* Recommendations */}
            <div>
              <p className="text-sm font-medium text-gray-700 mb-1">
                Recommended Actions:
              </p>
              <ul className="space-y-1">
                {risk.recommendations.slice(0, 2).map((rec, idx) => (
                  <li key={idx} className="text-sm text-gray-600 flex gap-2">
                    <span>→</span>
                    <span>{rec}</span>
                  </li>
                ))}
              </ul>
            </div>

            {/* Actions */}
            {onResolve && (
              <div className="flex gap-2 pt-2">
                <Button
                  size="sm"
                  onClick={() => onResolve(risk.id)}
                  className="flex-1"
                >
                  Resolve
                </Button>
                <Button size="sm" variant="outline" className="flex-1">
                  Investigate
                </Button>
              </div>
            )}
          </CardContent>
        </Card>
      ))}
    </div>
  );
};
