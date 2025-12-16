"use client";

import { useState, useEffect } from "react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { createClient } from "@/lib/supabase/client";
import { UserProfileCard } from "@/components/UserProfileCard";
import { ScoreHistoryChart } from "@/components/ScoreHistoryChart";
import { TopicAccuracyChart } from "@/components/TopicAccuracyChart";
import { Brain, TrendingUp, Target, Clock, ArrowLeft } from "lucide-react";
import { DeveloperWatermark } from "@/components/DeveloperWatermark";
import { AIChatbot } from "@/components/AIChatbot";
import { NotificationPanel } from "@/components/NotificationPanel";
import Link from "next/link";
import { motion } from "framer-motion";

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
      <div className="flex min-h-screen items-center justify-center bg-slate-50">
        <div className="text-center">
          <Brain className="mx-auto h-12 w-12 animate-pulse text-violet-600" />
          <p className="mt-4 text-slate-600 font-medium">Loading your overview...</p>
        </div>
      </div>
    );
  }

  const container = {
    hidden: { opacity: 0 },
    show: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1
      }
    }
  };

  const item = {
    hidden: { opacity: 0, y: 20 },
    show: { opacity: 1, y: 0 }
  };

  return (
    <div className="min-h-screen bg-[radial-gradient(ellipse_at_top,_var(--tw-gradient-stops))] from-violet-100 via-slate-50 to-slate-100">
      <header className="sticky top-0 z-50 border-b border-white/20 bg-white/60 backdrop-blur-xl supports-[backdrop-filter]:bg-white/60">
        <div className="mx-auto flex h-16 max-w-7xl items-center justify-between px-4 sm:px-6 lg:px-8">
          <Link href="/dashboard" className="flex items-center gap-3 group">
            <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-gradient-to-br from-violet-600 to-fuchsia-600 shadow-lg shadow-violet-500/20 group-hover:scale-105 transition-transform duration-200">
              <Brain className="h-6 w-6 text-white" />
            </div>
            <div>
              <h1 className="text-lg font-bold tracking-tight text-slate-900">Overview</h1>
              <p className="text-xs text-slate-500">Your Learning Summary</p>
            </div>
          </Link>
          <Link href="/dashboard">
            <Button variant="ghost" size="sm" className="gap-2 text-slate-600 hover:text-violet-600 hover:bg-violet-50">
              <ArrowLeft className="h-4 w-4" />
              Back to Dashboard
            </Button>
          </Link>
        </div>
      </header>

      <main className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
        <motion.div 
          variants={container}
          initial="hidden"
          animate="show"
          className="space-y-8"
        >
          <motion.div variants={item} className="grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
            <Card className="p-6 border-slate-200/60 bg-white/60 backdrop-blur-sm hover:shadow-lg hover:shadow-violet-500/5 transition-all duration-300 group">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-slate-500 group-hover:text-violet-600 transition-colors">Total Tests</p>
                  <p className="mt-2 text-3xl font-bold text-slate-900">{stats.totalTests}</p>
                </div>
                <div className="rounded-full bg-violet-100 p-3 group-hover:scale-110 transition-transform duration-200">
                  <Target className="h-6 w-6 text-violet-600" />
                </div>
              </div>
            </Card>

            <Card className="p-6 border-slate-200/60 bg-white/60 backdrop-blur-sm hover:shadow-lg hover:shadow-fuchsia-500/5 transition-all duration-300 group">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-slate-500 group-hover:text-fuchsia-600 transition-colors">Average Score</p>
                  <p className="mt-2 text-3xl font-bold text-slate-900">{stats.averageScore}%</p>
                </div>
                <div className="rounded-full bg-fuchsia-100 p-3 group-hover:scale-110 transition-transform duration-200">
                  <TrendingUp className="h-6 w-6 text-fuchsia-600" />
                </div>
              </div>
            </Card>

            <Card className="p-6 border-slate-200/60 bg-white/60 backdrop-blur-sm hover:shadow-lg hover:shadow-indigo-500/5 transition-all duration-300 group">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-slate-500 group-hover:text-indigo-600 transition-colors">Hours Studied</p>
                  <p className="mt-2 text-3xl font-bold text-slate-900">{stats.hoursStudied}</p>
                </div>
                <div className="rounded-full bg-indigo-100 p-3 group-hover:scale-110 transition-transform duration-200">
                  <Clock className="h-6 w-6 text-indigo-600" />
                </div>
              </div>
            </Card>

            <Card className="p-6 border-slate-200/60 bg-white/60 backdrop-blur-sm hover:shadow-lg hover:shadow-amber-500/5 transition-all duration-300 group">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-slate-500 group-hover:text-amber-600 transition-colors">Day Streak</p>
                  <p className="mt-2 text-3xl font-bold text-slate-900">{stats.streak}</p>
                </div>
                <div className="rounded-full bg-amber-100 p-3 group-hover:scale-110 transition-transform duration-200">
                  <Brain className="h-6 w-6 text-amber-600" />
                </div>
              </div>
            </Card>
          </motion.div>

          <div className="grid gap-6 lg:grid-cols-3">
            <motion.div variants={item} className="lg:col-span-1 h-full">
              <div className="h-full transform transition-all duration-300 hover:translate-y-[-4px]">
                <UserProfileCard profile={profile} />
              </div>
            </motion.div>
            <motion.div variants={item} className="space-y-6 lg:col-span-2">
              <div className="transform transition-all duration-300 hover:translate-y-[-4px]">
                <ScoreHistoryChart scores={profile.testScoreHistory} />
              </div>
              <div className="transform transition-all duration-300 hover:translate-y-[-4px]">
                <TopicAccuracyChart topics={profile.topicAccuracyMap} />
              </div>
            </motion.div>
          </div>
        </motion.div>
      </main>

      <AIChatbot />
      <NotificationPanel />
      <DeveloperWatermark />
    </div>
  );
}
