"use client";

import { useState, useEffect } from "react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { createClient } from "@/lib/supabase/client";
import { UserProfileCard } from "@/components/UserProfileCard";
import { ScoreHistoryChart } from "@/components/ScoreHistoryChart";
import { TopicAccuracyChart } from "@/components/TopicAccuracyChart";
import { Brain, TrendingUp, Target, Clock } from "lucide-react";
import { DeveloperWatermark } from "@/components/DeveloperWatermark";
import { AIChatbot } from "@/components/AIChatbot";
import { NotificationPanel } from "@/components/NotificationPanel";
import Link from "next/link";

export default function OverviewPage() {
  const [profile, setProfile] = useState<any>(null);
  const [stats, setStats] = useState({
    totalTests: 0,
    averageScore: 0,
    hoursStudied: 0,
    streak: 0,
  });

  useEffect(() => {
    loadUserData();
  }, []);

  async function loadUserData() {
    const supabase = createClient();
    const { data: { user } } = await supabase.auth.getUser();
    
    if (user) {
      const { data: profileData } = await supabase
        .from("user_profiles")
        .select("*")
        .eq("id", user.id)
        .single();
      
      const { data: assessments } = await supabase
        .from("assessments")
        .select("*")
        .eq("user_id", user.id)
        .order("created_at", { ascending: false });

      if (profileData) {
        setProfile({
          ...profileData,
          testScoreHistory: assessments?.map((a: any) => a.score) || [],
          topicAccuracyMap: {},
        });
        
        const totalTests = assessments?.length || 0;
        const avgScore = assessments?.length 
          ? Math.round(assessments.reduce((sum: number, a: any) => sum + (a.score || 0), 0) / assessments.length)
          : 0;
        
        setStats({
          totalTests,
          averageScore: avgScore,
          hoursStudied: Math.floor(totalTests * 0.5),
          streak: 7,
        });
      }
    }
  }

  if (!profile) {
    return (
      <div className="flex min-h-screen items-center justify-center">
        <div className="text-center">
          <Brain className="mx-auto h-12 w-12 animate-pulse text-violet-600" />
          <p className="mt-4 text-slate-600">Loading your overview...</p>
        </div>
      </div>
    );
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
              <h1 className="text-lg font-bold tracking-tight text-slate-900">Overview</h1>
              <p className="text-xs text-slate-500">Your Learning Summary</p>
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
                <p className="mt-2 text-3xl font-bold text-slate-900">{stats.totalTests}</p>
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
                <p className="mt-2 text-3xl font-bold text-slate-900">{stats.averageScore}%</p>
              </div>
              <div className="rounded-full bg-fuchsia-100 p-3">
                <TrendingUp className="h-6 w-6 text-fuchsia-600" />
              </div>
            </div>
          </Card>

          <Card className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-slate-600">Hours Studied</p>
                <p className="mt-2 text-3xl font-bold text-slate-900">{stats.hoursStudied}</p>
              </div>
              <div className="rounded-full bg-indigo-100 p-3">
                <Clock className="h-6 w-6 text-indigo-600" />
              </div>
            </div>
          </Card>

          <Card className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-slate-600">Day Streak</p>
                <p className="mt-2 text-3xl font-bold text-slate-900">{stats.streak}</p>
              </div>
              <div className="rounded-full bg-amber-100 p-3">
                <Brain className="h-6 w-6 text-amber-600" />
              </div>
            </div>
          </Card>
        </div>

        <div className="grid gap-6 lg:grid-cols-3">
          <div className="lg:col-span-1">
            <UserProfileCard profile={profile} />
          </div>
          <div className="space-y-6 lg:col-span-2">
            <ScoreHistoryChart scores={profile.testScoreHistory} />
            <TopicAccuracyChart topics={profile.topicAccuracyMap} />
          </div>
        </div>

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
