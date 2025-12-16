"use client";

import { TestScore } from "@/lib/types";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  Area,
  AreaChart,
} from "recharts";
import { Activity } from "lucide-react";

interface ScoreHistoryChartProps {
  scores: TestScore[];
}

export function ScoreHistoryChart({ scores }: ScoreHistoryChartProps) {
  const chartData = scores.map((score) => ({
    name: score.testName.split(" ").slice(0, 2).join(" "),
    score: Math.round((score.score / score.maxScore) * 100),
    date: new Date(score.date).toLocaleDateString("en-US", {
      month: "short",
      day: "numeric",
    }),
  }));

  return (
    <Card className="border-slate-200 bg-white shadow-sm">
      <CardHeader className="pb-3">
        <div className="flex items-center gap-2">
          <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-gradient-to-br from-cyan-500 to-blue-500">
            <Activity className="h-5 w-5 text-white" />
          </div>
          <CardTitle className="text-base font-semibold text-slate-900">
            Score Trend
          </CardTitle>
        </div>
      </CardHeader>
      <CardContent>
        <div className="h-[200px] w-full">
          <ResponsiveContainer width="100%" height="100%">
            <AreaChart data={chartData} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
              <defs>
                <linearGradient id="scoreGradient" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#8b5cf6" stopOpacity={0.3} />
                  <stop offset="95%" stopColor="#8b5cf6" stopOpacity={0} />
                </linearGradient>
              </defs>
              <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" />
              <XAxis
                dataKey="date"
                tick={{ fontSize: 11, fill: "#64748b" }}
                axisLine={{ stroke: "#e2e8f0" }}
                tickLine={false}
              />
              <YAxis
                domain={[0, 100]}
                tick={{ fontSize: 11, fill: "#64748b" }}
                axisLine={{ stroke: "#e2e8f0" }}
                tickLine={false}
              />
              <Tooltip
                contentStyle={{
                  backgroundColor: "#1e293b",
                  border: "none",
                  borderRadius: "8px",
                  color: "#f8fafc",
                  fontSize: "12px",
                }}
                labelStyle={{ color: "#94a3b8" }}
                formatter={(value: number) => [`${value}%`, "Score"]}
              />
              <Area
                type="monotone"
                dataKey="score"
                stroke="#8b5cf6"
                strokeWidth={2}
                fill="url(#scoreGradient)"
              />
            </AreaChart>
          </ResponsiveContainer>
        </div>
        <div className="mt-4 grid grid-cols-3 gap-2">
          {scores.slice(-3).map((score, idx) => (
            <div
              key={idx}
              className="rounded-lg bg-slate-50 p-2 text-center"
            >
              <p className="text-xs text-slate-500 truncate">{score.testName}</p>
              <p className="text-sm font-semibold text-slate-900">
                {Math.round((score.score / score.maxScore) * 100)}%
              </p>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  );
}
