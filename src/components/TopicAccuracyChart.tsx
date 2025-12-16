"use client";

import { TopicAccuracy } from "@/lib/types";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  Cell,
} from "recharts";
import { PieChart as PieChartIcon } from "lucide-react";

interface TopicAccuracyChartProps {
  topics: TopicAccuracy[];
}

export function TopicAccuracyChart({ topics }: TopicAccuracyChartProps) {
  const chartData = topics.map((topic) => ({
    name: topic.topic.length > 12 ? topic.topic.slice(0, 12) + "..." : topic.topic,
    fullName: topic.topic,
    accuracy: topic.accuracy,
    attempts: topic.totalAttempts,
  }));

  const getBarColor = (accuracy: number) => {
    if (accuracy >= 75) return "#10b981";
    if (accuracy >= 50) return "#f59e0b";
    return "#ef4444";
  };

  return (
    <Card className="border-slate-200 bg-white shadow-sm">
      <CardHeader className="pb-3">
        <div className="flex items-center gap-2">
          <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-gradient-to-br from-fuchsia-500 to-pink-500">
            <PieChartIcon className="h-5 w-5 text-white" />
          </div>
          <CardTitle className="text-base font-semibold text-slate-900">
            Topic Accuracy
          </CardTitle>
        </div>
      </CardHeader>
      <CardContent>
        <div className="h-[200px] w-full">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart
              data={chartData}
              layout="vertical"
              margin={{ top: 5, right: 10, left: 0, bottom: 5 }}
            >
              <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" horizontal={false} />
              <XAxis
                type="number"
                domain={[0, 100]}
                tick={{ fontSize: 11, fill: "#64748b" }}
                axisLine={{ stroke: "#e2e8f0" }}
                tickLine={false}
              />
              <YAxis
                type="category"
                dataKey="name"
                tick={{ fontSize: 11, fill: "#64748b" }}
                axisLine={{ stroke: "#e2e8f0" }}
                tickLine={false}
                width={80}
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
                  formatter={(value: number) => [`${value}%`, "Accuracy"]}
                />
              <Bar dataKey="accuracy" radius={[0, 4, 4, 0]}>
                {chartData.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={getBarColor(entry.accuracy)} />
                ))}
              </Bar>
            </BarChart>
          </ResponsiveContainer>
        </div>
        <div className="mt-4 flex items-center justify-center gap-4">
          <div className="flex items-center gap-2">
            <div className="h-3 w-3 rounded-full bg-emerald-500" />
            <span className="text-xs text-slate-600">Strong (75%+)</span>
          </div>
          <div className="flex items-center gap-2">
            <div className="h-3 w-3 rounded-full bg-amber-500" />
            <span className="text-xs text-slate-600">Moderate (50-74%)</span>
          </div>
          <div className="flex items-center gap-2">
            <div className="h-3 w-3 rounded-full bg-rose-500" />
            <span className="text-xs text-slate-600">Needs Work (&lt;50%)</span>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
