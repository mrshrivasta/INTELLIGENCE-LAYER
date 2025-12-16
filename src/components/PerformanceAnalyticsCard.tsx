"use client";

import { PerformanceAnalysis, AdaptiveLearningDecision, ProfileFeedback } from "@/lib/types";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import {
  BarChart3,
  TrendingUp,
  TrendingDown,
  AlertCircle,
  CheckCircle,
  ArrowUpRight,
  ArrowDownRight,
  Minus,
  Zap,
  MessageSquare,
} from "lucide-react";

interface PerformanceAnalyticsCardProps {
  analysis: PerformanceAnalysis;
  adaptiveDecision: AdaptiveLearningDecision;
  feedback: ProfileFeedback;
}

export function PerformanceAnalyticsCard({
  analysis,
  adaptiveDecision,
  feedback,
}: PerformanceAnalyticsCardProps) {
  const getActionIcon = () => {
    switch (adaptiveDecision.action) {
      case "increase_complexity":
        return <ArrowUpRight className="h-5 w-5 text-emerald-500" />;
      case "reduce_difficulty":
        return <ArrowDownRight className="h-5 w-5 text-amber-500" />;
      default:
        return <Minus className="h-5 w-5 text-blue-500" />;
    }
  };

  const getActionColor = () => {
    switch (adaptiveDecision.action) {
      case "increase_complexity":
        return "bg-emerald-100 text-emerald-700 border-emerald-200";
      case "reduce_difficulty":
        return "bg-amber-100 text-amber-700 border-amber-200";
      default:
        return "bg-blue-100 text-blue-700 border-blue-200";
    }
  };

  const getCauseIcon = (cause: string) => {
    switch (cause) {
      case "conceptual_gap":
        return <AlertCircle className="h-4 w-4 text-rose-500" />;
      case "practice_gap":
        return <BarChart3 className="h-4 w-4 text-amber-500" />;
      default:
        return <AlertCircle className="h-4 w-4 text-blue-500" />;
    }
  };

  const getCauseColor = (cause: string) => {
    switch (cause) {
      case "conceptual_gap":
        return "bg-rose-50 border-rose-200 text-rose-700";
      case "practice_gap":
        return "bg-amber-50 border-amber-200 text-amber-700";
      default:
        return "bg-blue-50 border-blue-200 text-blue-700";
    }
  };

  return (
    <div className="space-y-4">
      <Card className="border-slate-200 bg-white shadow-sm">
        <CardHeader className="pb-3">
          <div className="flex items-center gap-2">
            <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-gradient-to-br from-amber-500 to-orange-500">
              <BarChart3 className="h-5 w-5 text-white" />
            </div>
            <CardTitle className="text-base font-semibold text-slate-900">
              Performance Analysis
            </CardTitle>
          </div>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="rounded-lg bg-slate-50 p-4">
            <p className="text-sm text-slate-700">{analysis.overallAssessment}</p>
          </div>

          <div className="grid gap-4 sm:grid-cols-2">
            <div className="rounded-lg border border-emerald-200 bg-emerald-50 p-4">
              <div className="mb-3 flex items-center gap-2">
                <TrendingUp className="h-4 w-4 text-emerald-600" />
                <span className="text-xs font-semibold uppercase tracking-wider text-emerald-700">
                  Improving Topics
                </span>
              </div>
              <div className="flex flex-wrap gap-1.5">
                {analysis.improving.length > 0 ? (
                  analysis.improving.map((topic) => (
                    <Badge
                      key={topic}
                      className="bg-emerald-100 text-emerald-700 border-emerald-200"
                    >
                      {topic}
                    </Badge>
                  ))
                ) : (
                  <span className="text-sm text-emerald-600">Keep practicing to see improvements</span>
                )}
              </div>
            </div>

            <div className="rounded-lg border border-rose-200 bg-rose-50 p-4">
              <div className="mb-3 flex items-center gap-2">
                <TrendingDown className="h-4 w-4 text-rose-600" />
                <span className="text-xs font-semibold uppercase tracking-wider text-rose-700">
                  Needs Attention
                </span>
              </div>
              <div className="flex flex-wrap gap-1.5">
                {analysis.stagnating.length > 0 ? (
                  analysis.stagnating.map((topic) => (
                    <Badge
                      key={topic}
                      className="bg-rose-100 text-rose-700 border-rose-200"
                    >
                      {topic}
                    </Badge>
                  ))
                ) : (
                  <span className="text-sm text-rose-600">All topics on track</span>
                )}
              </div>
            </div>
          </div>

          {analysis.rootCauses.length > 0 && (
            <div className="space-y-2">
              <p className="text-xs font-semibold uppercase tracking-wider text-slate-500">
                Root Causes Identified
              </p>
              <div className="space-y-2">
                {analysis.rootCauses.map((rc, idx) => (
                  <div
                    key={idx}
                    className={`flex items-start gap-3 rounded-lg border p-3 ${getCauseColor(
                      rc.cause
                    )}`}
                  >
                    {getCauseIcon(rc.cause)}
                    <div>
                      <p className="text-sm font-medium">{rc.area}</p>
                      <p className="text-xs opacity-80">{rc.details}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          <div className="space-y-2">
            <p className="text-xs font-semibold uppercase tracking-wider text-slate-500">
              Recommended Actions
            </p>
            <ul className="space-y-2">
              {analysis.improvementActions.map((action, idx) => (
                <li
                  key={idx}
                  className="flex items-start gap-2 rounded-lg bg-violet-50 p-3"
                >
                  <CheckCircle className="mt-0.5 h-4 w-4 shrink-0 text-violet-600" />
                  <span className="text-sm text-violet-800">{action}</span>
                </li>
              ))}
            </ul>
          </div>
        </CardContent>
      </Card>

      <Card className="border-slate-200 bg-white shadow-sm">
        <CardHeader className="pb-3">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-gradient-to-br from-violet-500 to-purple-500">
                <Zap className="h-5 w-5 text-white" />
              </div>
              <CardTitle className="text-base font-semibold text-slate-900">
                Adaptive Learning Decision
              </CardTitle>
            </div>
            <Badge className={`flex items-center gap-1 ${getActionColor()}`}>
              {getActionIcon()}
              {adaptiveDecision.action.replace("_", " ")}
            </Badge>
          </div>
        </CardHeader>
        <CardContent className="space-y-4">
          <p className="text-sm text-slate-600">{adaptiveDecision.reasoning}</p>
          <div className="space-y-2">
            {adaptiveDecision.recommendations.map((rec, idx) => (
              <div
                key={idx}
                className="flex items-center gap-2 rounded-lg bg-slate-50 p-3"
              >
                <span className="flex h-5 w-5 items-center justify-center rounded-full bg-violet-500 text-xs font-bold text-white">
                  {idx + 1}
                </span>
                <span className="text-sm text-slate-700">{rec}</span>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      <Card className="border-slate-200 bg-gradient-to-br from-slate-900 to-slate-800 text-white shadow-sm">
        <CardHeader className="pb-3">
          <div className="flex items-center gap-2">
            <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-gradient-to-br from-cyan-400 to-blue-500">
              <MessageSquare className="h-5 w-5 text-white" />
            </div>
            <CardTitle className="text-base font-semibold">
              Personalized Feedback
            </CardTitle>
          </div>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="rounded-lg bg-white/10 p-4">
            <p className="mb-2 text-xs font-medium uppercase tracking-wider text-slate-400">
              Progress Summary
            </p>
            <p className="text-sm text-slate-200">{feedback.progressSummary}</p>
          </div>

          <div className="rounded-lg bg-white/10 p-4">
            <p className="mb-2 text-xs font-medium uppercase tracking-wider text-slate-400">
              Trend Analysis
            </p>
            <p className="text-sm text-slate-200">{feedback.trendAnalysis}</p>
          </div>

          <div className="rounded-lg bg-gradient-to-r from-violet-500/20 to-fuchsia-500/20 p-4 border border-violet-500/30">
            <p className="mb-2 text-xs font-medium uppercase tracking-wider text-violet-300">
              High Impact Action
            </p>
            <p className="text-sm font-medium text-white">{feedback.highImpactAction}</p>
          </div>

          <div className="rounded-lg bg-emerald-500/20 p-4 border border-emerald-500/30">
            <p className="text-sm italic text-emerald-200">{feedback.encouragement}</p>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
