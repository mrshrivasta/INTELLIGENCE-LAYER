"use client";

import { useState, useEffect } from "react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { createClient } from "@/lib/supabase/client";
import { Brain, TrendingUp, Award, Target } from "lucide-react";
import { DeveloperWatermark } from "@/components/DeveloperWatermark";
import { AIChatbot } from "@/components/AIChatbot";
import { NotificationPanel } from "@/components/NotificationPanel";
import Link from "next/link";

export default function AnalyticsPage() {
  const [assessments, setAssessments] = useState<any[]>([]);
  const [stats, setStats] = useState({
    total: 0,
    average: 0,
    highest: 0,
    lowest: 100,
    improvement: 0,
  });

  useEffect(() => {
    loadAnalytics();
  }, []);

  async function loadAnalytics() {
    const supabase = createClient();
    const { data: { user } } = await supabase.auth.getUser();
    
    if (user) {
      const { data } = await supabase
        .from("assessments")
        .select("*")
        .eq("user_id", user.id)
        .order("created_at", { ascending: false });

      if (data && data.length > 0) {
        setAssessments(data);
        
        const scores = data.map((a: any) => a.score || 0);
        const total = data.length;
        const average = Math.round(scores.reduce((a: number, b: number) => a + b, 0) / total);
        const highest = Math.max(...scores);
        const lowest = Math.min(...scores);
        
        let improvement = 0;
        if (scores.length >= 2) {
          improvement = scores[0] - scores[scores.length - 1];
        }
        
        setStats({ total, average, highest, lowest, improvement });
      }
    }
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-violet-50/30 to-slate-50">
      <header className="sticky top-0 z-50 border-b border-slate-200/80 bg-white/80 backdrop-blur-lg">
        <div className="mx-auto flex h-16 max-w-7xl items-center justify-between px-4 sm:px-6 lg:px-8">
          <Link href="/dashboard" className="flex items-center gap-3">
            <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-gradient-to-br from-violet-600 to-fuchsia-600 shadow-lg">
              <Brain className="h-6 w-6 text-white" />
            </div>
            <div>
              <h1 className="text-lg font-bold tracking-tight text-slate-900">Analytics</h1>
              <p className="text-xs text-slate-500">Performance Insights</p>
            </div>
          </Link>
        </div>
      </header>

      <main className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
        <div className="mb-8 grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
          <Card className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-slate-600">Total Tests</p>
                <p className="mt-2 text-3xl font-bold text-slate-900">{stats.total}</p>
              </div>
              <div className="rounded-full bg-violet-100 p-3">
                <Target className="h-6 w-6 text-violet-600" />
              </div>
            </div>
          </Card>

          <Card className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-slate-600">Average Score</p>
                <p className="mt-2 text-3xl font-bold text-slate-900">{stats.average}%</p>
              </div>
              <div className="rounded-full bg-fuchsia-100 p-3">
                <TrendingUp className="h-6 w-6 text-fuchsia-600" />
              </div>
            </div>
          </Card>

          <Card className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-slate-600">Highest Score</p>
                <p className="mt-2 text-3xl font-bold text-slate-900">{stats.highest}%</p>
              </div>
              <div className="rounded-full bg-green-100 p-3">
                <Award className="h-6 w-6 text-green-600" />
              </div>
            </div>
          </Card>

          <Card className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-slate-600">Improvement</p>
                <p className="mt-2 text-3xl font-bold text-slate-900">
                  {stats.improvement > 0 ? "+" : ""}{stats.improvement}%
                </p>
              </div>
              <div className="rounded-full bg-indigo-100 p-3">
                <Brain className="h-6 w-6 text-indigo-600" />
              </div>
            </div>
          </Card>
        </div>

        <Card className="p-6">
          <h2 className="mb-6 text-xl font-bold text-slate-900">Recent Assessments</h2>
          <div className="space-y-4">
            {assessments.length === 0 ? (
              <div className="py-12 text-center">
                <Brain className="mx-auto h-12 w-12 text-slate-300" />
                <p className="mt-4 text-slate-600">No assessments yet</p>
                <Link href="/assessment">
                  <Button className="mt-4">Take Your First Assessment</Button>
                </Link>
              </div>
            ) : (
              assessments.map((assessment) => (
                <div
                  key={assessment.id}
                  className="flex items-center justify-between rounded-lg border border-slate-200 bg-white p-4"
                >
                  <div>
                    <p className="font-semibold text-slate-900">{assessment.field}</p>
                    <p className="text-sm text-slate-600">
                      {new Date(assessment.created_at).toLocaleDateString()} • {assessment.difficulty}
                    </p>
                  </div>
                  <div className="text-right">
                    <p className="text-2xl font-bold text-slate-900">{assessment.score}%</p>
                    <p className="text-sm text-slate-600">
                      {Math.floor(assessment.duration_seconds / 60)}m {assessment.duration_seconds % 60}s
                    </p>
                  </div>
                </div>
              ))
            )}
          </div>
        </Card>

        <div className="mt-8 text-center">
          <Link href="/dashboard">
            <Button>Back to Dashboard</Button>
          </Link>
        </div>
      </main>

      <AIChatbot />
      <NotificationPanel />
      <DeveloperWatermark />
    </div>
  );
}
