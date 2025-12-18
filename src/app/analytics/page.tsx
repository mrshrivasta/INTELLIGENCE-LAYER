"use client";

import { useState, useEffect } from "react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { createClient } from "@/lib/supabase/client";
import { Brain, TrendingUp, Award, Target, ArrowLeft, Sun, Moon, BarChart3, Clock, Calendar } from "lucide-react";
import { DeveloperWatermark } from "@/components/DeveloperWatermark";
import { AIChatbot } from "@/components/AIChatbot";
import { NotificationPanel } from "@/components/NotificationPanel";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useTheme } from "@/components/ThemeProvider";
import { motion } from "framer-motion";
import { Badge } from "@/components/ui/badge";

export default function AnalyticsPage() {
  const router = useRouter();
  const { theme, toggleTheme } = useTheme();
  const [assessments, setAssessments] = useState<any[]>([]);
  const [profile, setProfile] = useState<any>(null);
  const [loading, setLoading] = useState(true);
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
    
    if (!user) {
      router.push("/login");
      return;
    }

    const { data: profileData } = await supabase
      .from("user_profiles")
      .select("*")
      .eq("id", user.id)
      .single();

    if (!profileData) {
      router.push("/onboarding");
      return;
    }

    setProfile(profileData);

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
    
    setLoading(false);
  }

  if (loading) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-background">
        <div className="text-center">
          <BarChart3 className="mx-auto h-12 w-12 animate-pulse text-primary" />
          <p className="mt-4 text-muted-foreground font-medium">Loading analytics...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background text-foreground transition-colors duration-300">
      <header className="sticky top-0 z-50 border-b border-border bg-background/80 backdrop-blur-xl">
        <div className="mx-auto flex h-16 max-w-7xl items-center justify-between px-4 sm:px-6 lg:px-8">
          <Link href="/dashboard" className="flex items-center gap-3">
            <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-gradient-to-br from-emerald-500 to-teal-600 shadow-lg">
              <BarChart3 className="h-6 w-6 text-white" />
            </div>
            <div>
              <h1 className="text-lg font-bold tracking-tight text-foreground">Analytics</h1>
              <p className="text-xs text-muted-foreground">Performance Insights</p>
            </div>
          </Link>
          <div className="flex items-center gap-2">
            <Button variant="ghost" size="sm" onClick={toggleTheme} className="text-muted-foreground hover:text-foreground">
              {theme === "dark" ? <Sun className="h-4 w-4" /> : <Moon className="h-4 w-4" />}
            </Button>
            <Link href="/dashboard">
              <Button variant="ghost" size="sm" className="gap-2 text-muted-foreground hover:text-foreground">
                <ArrowLeft className="h-4 w-4" />
                Back
              </Button>
            </Link>
          </div>
        </div>
      </header>

      <main className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-8"
        >
          <Card className="p-6 bg-gradient-to-r from-emerald-500 to-teal-600 text-white border-0">
            <div className="flex items-center gap-4">
              <div className="h-14 w-14 rounded-xl bg-white/10 flex items-center justify-center">
                <TrendingUp className="h-8 w-8" />
              </div>
              <div>
                <h2 className="text-2xl font-bold">Performance Analytics</h2>
                <p className="text-white/80">
                  Track your progress in {profile?.field_of_interest || "your field"}
                </p>
              </div>
            </div>
          </Card>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="mb-8 grid gap-6 sm:grid-cols-2 lg:grid-cols-4"
        >
          <Card className="p-6 bg-card border-border hover:shadow-lg transition-all">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">Total Tests</p>
                <p className="mt-2 text-3xl font-bold text-foreground">{stats.total}</p>
              </div>
              <div className="rounded-full bg-violet-500/10 p-3">
                <Target className="h-6 w-6 text-violet-500" />
              </div>
            </div>
          </Card>

          <Card className="p-6 bg-card border-border hover:shadow-lg transition-all">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">Average Score</p>
                <p className="mt-2 text-3xl font-bold text-foreground">{stats.average}%</p>
              </div>
              <div className="rounded-full bg-fuchsia-500/10 p-3">
                <TrendingUp className="h-6 w-6 text-fuchsia-500" />
              </div>
            </div>
          </Card>

          <Card className="p-6 bg-card border-border hover:shadow-lg transition-all">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">Highest Score</p>
                <p className="mt-2 text-3xl font-bold text-foreground">{stats.highest}%</p>
              </div>
              <div className="rounded-full bg-green-500/10 p-3">
                <Award className="h-6 w-6 text-green-500" />
              </div>
            </div>
          </Card>

          <Card className="p-6 bg-card border-border hover:shadow-lg transition-all">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">Improvement</p>
                <p className="mt-2 text-3xl font-bold text-foreground">
                  {stats.improvement > 0 ? "+" : ""}{stats.improvement}%
                </p>
              </div>
              <div className="rounded-full bg-indigo-500/10 p-3">
                <Brain className="h-6 w-6 text-indigo-500" />
              </div>
            </div>
          </Card>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
        >
          <Card className="p-6 bg-card border-border">
            <h2 className="mb-6 text-xl font-bold text-foreground flex items-center gap-2">
              <Calendar className="h-5 w-5 text-primary" />
              Recent Assessments
            </h2>
            <div className="space-y-4">
              {assessments.length === 0 ? (
                <div className="py-12 text-center">
                  <Brain className="mx-auto h-12 w-12 text-muted-foreground/30" />
                  <p className="mt-4 text-muted-foreground">No assessments yet</p>
                  <Link href="/assessment">
                    <Button className="mt-4">Take Your First Assessment</Button>
                  </Link>
                </div>
              ) : (
                assessments.map((assessment, index) => (
                  <motion.div
                    key={assessment.id}
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: index * 0.1 }}
                    className="flex items-center justify-between rounded-lg border border-border bg-card p-4 hover:bg-muted/50 transition-all"
                  >
                    <div className="flex items-center gap-4">
                      <div className={`h-10 w-10 rounded-lg flex items-center justify-center ${
                        assessment.score >= 70 ? "bg-green-500/10" : assessment.score >= 50 ? "bg-amber-500/10" : "bg-red-500/10"
                      }`}>
                        <Target className={`h-5 w-5 ${
                          assessment.score >= 70 ? "text-green-500" : assessment.score >= 50 ? "text-amber-500" : "text-red-500"
                        }`} />
                      </div>
                      <div>
                        <p className="font-semibold text-foreground">{assessment.field}</p>
                        <div className="flex items-center gap-2 text-sm text-muted-foreground">
                          <span>{new Date(assessment.created_at).toLocaleDateString()}</span>
                          <span>•</span>
                          <Badge variant="outline" className="text-xs">
                            {assessment.difficulty}
                          </Badge>
                        </div>
                      </div>
                    </div>
                    <div className="text-right">
                      <p className={`text-2xl font-bold ${
                        assessment.score >= 70 ? "text-green-500" : assessment.score >= 50 ? "text-amber-500" : "text-red-500"
                      }`}>{assessment.score}%</p>
                      <p className="text-sm text-muted-foreground flex items-center gap-1">
                        <Clock className="h-3 w-3" />
                        {Math.floor(assessment.duration_seconds / 60)}m {assessment.duration_seconds % 60}s
                      </p>
                    </div>
                  </motion.div>
                ))
              )}
            </div>
          </Card>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
          className="mt-8 flex justify-center gap-4"
        >
          <Link href="/assessment">
            <Button size="lg" className="gap-2">
              <Target className="h-4 w-4" />
              Take New Assessment
            </Button>
          </Link>
          <Link href="/dashboard">
            <Button variant="outline" size="lg">Back to Dashboard</Button>
          </Link>
        </motion.div>
      </main>

      <AIChatbot />
      <NotificationPanel />
      <DeveloperWatermark />
    </div>
  );
}
