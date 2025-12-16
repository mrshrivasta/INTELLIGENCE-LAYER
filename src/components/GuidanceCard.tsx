"use client";

import { GuidanceRecommendation } from "@/lib/types";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import {
  Compass,
  Clock,
  AlertTriangle,
  Lightbulb,
  ArrowRight,
} from "lucide-react";

interface GuidanceCardProps {
  guidance: GuidanceRecommendation;
}

export function GuidanceCard({ guidance }: GuidanceCardProps) {
  const getPriorityColor = () => {
    switch (guidance.priority) {
      case "high":
        return "bg-rose-500/10 text-rose-500 border-rose-500/20";
      case "medium":
        return "bg-amber-500/10 text-amber-500 border-amber-500/20";
      default:
        return "bg-emerald-500/10 text-emerald-500 border-emerald-500/20";
    }
  };

  return (
    <Card className="border-slate-200 bg-white shadow-sm">
      <CardHeader className="pb-3">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-gradient-to-br from-violet-500 to-fuchsia-500">
              <Compass className="h-5 w-5 text-white" />
            </div>
            <CardTitle className="text-base font-semibold text-slate-900">
              What to Focus On Next
            </CardTitle>
          </div>
          <Badge className={getPriorityColor()}>
            {guidance.priority} priority
          </Badge>
        </div>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="rounded-xl bg-gradient-to-r from-violet-50 to-fuchsia-50 p-4">
          <div className="flex items-center gap-2">
            <ArrowRight className="h-5 w-5 text-violet-600" />
            <h3 className="text-lg font-semibold text-violet-900">
              {guidance.recommendedTopic}
            </h3>
          </div>
          <p className="mt-2 text-sm text-slate-600">{guidance.reason}</p>
        </div>

        <div className="flex items-center gap-2 rounded-lg bg-slate-50 p-3">
          <Clock className="h-4 w-4 text-slate-500" />
          <span className="text-sm text-slate-700">
            <span className="font-medium">Time Investment:</span>{" "}
            {guidance.suggestedTimeInvestment}
          </span>
        </div>

        <div className="grid gap-3 sm:grid-cols-2">
          <div className="rounded-lg border border-amber-200 bg-amber-50 p-3">
            <div className="mb-2 flex items-center gap-2">
              <AlertTriangle className="h-4 w-4 text-amber-600" />
              <span className="text-xs font-semibold uppercase tracking-wider text-amber-700">
                Common Mistake
              </span>
            </div>
            <p className="text-sm text-amber-800">{guidance.commonMistake}</p>
          </div>

          <div className="rounded-lg border border-emerald-200 bg-emerald-50 p-3">
            <div className="mb-2 flex items-center gap-2">
              <Lightbulb className="h-4 w-4 text-emerald-600" />
              <span className="text-xs font-semibold uppercase tracking-wider text-emerald-700">
                Pro Tip
              </span>
            </div>
            <p className="text-sm text-emerald-800">{guidance.improvementTip}</p>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
