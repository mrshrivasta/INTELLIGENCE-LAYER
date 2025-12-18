"use client";

import { useState, useEffect } from "react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { createClient } from "@/lib/supabase/client";
import { Brain, TrendingUp, Target, Clock, ArrowLeft, Sun, Moon, User, BookOpen, Award, BarChart3 } from "lucide-react";
import { DeveloperWatermark } from "@/components/DeveloperWatermark";
import { AIChatbot } from "@/components/AIChatbot";
import { NotificationPanel } from "@/components/NotificationPanel";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { motion } from "framer-motion";
import { useTheme } from "@/components/ThemeProvider";

export default function OverviewPage() {
  const router = useRouter();
  const { theme, toggleTheme } = useTheme();
  const [profile, setProfile] = useState<any>(null);
  const [stats, setStats] = useState({
    totalTests: 0,
    averageScore: 0,
    hoursStudied: 0,
    streak: 7,
  });
  const [recentScores, setRecentScores] = useState<number[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadUserData();
  }, []);

  async function loadUserData() {
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

    const { data: assessments } = await supabase
      .from("assessments")
      .select("*")
      .eq("user_id", user.id)
      .order("created_at", { ascending: false })
      .limit(10);

    setProfile(profileData);
    
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

    setRecentScores(assessments?.map((a: any) => a.score) || []);
    setLoading(false);
  }

  if (loading) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-background">
        <div className="text-center">
          <User className="mx-auto h-12 w-12 animate-pulse text-primary" />
          <p className="mt-4 text-muted-foreground font-medium">Loading your overview...</p>
        </div>
      </div>
    );
  }

  const container = {
    hidden: { opacity: 0 },
    show: {
      opacity: 1,
      transition: { staggerChildren: 0.1 }
    }
  };

  const item = {
    hidden: { opacity: 0, y: 20 },
    show: { opacity: 1, y: 0 }
  };

  return (
    <div className="min-h-screen bg-background text-foreground transition-colors duration-300">
      <header className="sticky top-0 z-50 border-b border-border bg-background/80 backdrop-blur-xl">
        <div className="mx-auto flex h-16 max-w-7xl items-center justify-between px-4 sm:px-6 lg:px-8">
          <Link href="/dashboard" className="flex items-center gap-3 group">
            <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-gradient-to-br from-cyan-500 to-blue-600 shadow-lg">
              <User className="h-6 w-6 text-white" />
            </div>
            <div>
              <h1 className="text-lg font-bold tracking-tight text-foreground">Overview</h1>
              <p className="text-xs text-muted-foreground">Your Learning Summary</p>
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
          variants={container}
          initial="hidden"
          animate="show"
          className="space-y-8"
        >
          <motion.div variants={item}>
            <Card className="p-6 bg-gradient-to-r from-cyan-500 to-blue-600 text-white border-0">
              <div className="flex flex-col sm:flex-row sm:items-center gap-6">
                <div className="h-20 w-20 rounded-2xl bg-white/10 flex items-center justify-center text-4xl font-bold">
                  {profile?.full_name?.[0]?.toUpperCase() || "S"}
                </div>
                <div className="flex-1">
                  <h2 className="text-2xl font-bold">{profile?.full_name || "Student"}</h2>
                  <p className="text-white/80">{profile?.email}</p>
                  <div className="mt-3 flex flex-wrap gap-2">
                    <Badge className="bg-white/20 text-white border-0">
                      <BookOpen className="h-3 w-3 mr-1" />
                      {profile?.field_of_interest || "Not Selected"}
                    </Badge>
                    <Badge className="bg-white/20 text-white border-0">
                      <Award className="h-3 w-3 mr-1" />
                      {profile?.education_level || "Student"}
                    </Badge>
                  </div>
                </div>
              </div>
            </Card>
          </motion.div>

          <motion.div variants={item} className="grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
            <Card className="p-6 bg-card border-border hover:shadow-lg transition-all duration-300 group">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-muted-foreground">Total Tests</p>
                  <p className="mt-2 text-3xl font-bold text-foreground">{stats.totalTests}</p>
                </div>
                <div className="rounded-full bg-violet-500/10 p-3">
                  <Target className="h-6 w-6 text-violet-500" />
                </div>
              </div>
            </Card>

            <Card className="p-6 bg-card border-border hover:shadow-lg transition-all duration-300 group">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-muted-foreground">Average Score</p>
                  <p className="mt-2 text-3xl font-bold text-foreground">{stats.averageScore}%</p>
                </div>
                <div className="rounded-full bg-emerald-500/10 p-3">
                  <TrendingUp className="h-6 w-6 text-emerald-500" />
                </div>
              </div>
            </Card>

            <Card className="p-6 bg-card border-border hover:shadow-lg transition-all duration-300 group">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-muted-foreground">Hours Studied</p>
                  <p className="mt-2 text-3xl font-bold text-foreground">{stats.hoursStudied}</p>
                </div>
                <div className="rounded-full bg-blue-500/10 p-3">
                  <Clock className="h-6 w-6 text-blue-500" />
                </div>
              </div>
            </Card>

            <Card className="p-6 bg-card border-border hover:shadow-lg transition-all duration-300 group">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-muted-foreground">Day Streak</p>
                  <p className="mt-2 text-3xl font-bold text-foreground">{stats.streak}</p>
                </div>
                <div className="rounded-full bg-amber-500/10 p-3">
                  <Brain className="h-6 w-6 text-amber-500" />
                </div>
              </div>
            </Card>
          </motion.div>

          <motion.div variants={item}>
            <Card className="p-6 bg-card border-border">
              <h3 className="text-lg font-bold text-foreground mb-4 flex items-center gap-2">
                <BarChart3 className="h-5 w-5 text-primary" />
                Recent Assessment Scores
              </h3>
              {recentScores.length > 0 ? (
                <div className="space-y-3">
                  {recentScores.slice(0, 5).map((score, i) => (
                    <div key={i} className="flex items-center gap-4">
                      <span className="text-sm text-muted-foreground w-20">Test {i + 1}</span>
                      <div className="flex-1 h-3 bg-muted rounded-full overflow-hidden">
                        <div 
                          className={`h-full rounded-full transition-all ${
                            score >= 70 ? "bg-green-500" : score >= 50 ? "bg-amber-500" : "bg-red-500"
                          }`}
                          style={{ width: `${score}%` }}
                        />
                      </div>
                      <span className="text-sm font-bold text-foreground w-12">{score}%</span>
                    </div>
                  ))}
                </div>
              ) : (
                <p className="text-muted-foreground text-center py-8">
                  No assessments taken yet. Start your first assessment to see your progress!
                </p>
              )}
            </Card>
          </motion.div>

          <motion.div variants={item} className="grid gap-6 md:grid-cols-2">
            <Card className="p-6 bg-card border-border">
              <h3 className="text-lg font-bold text-foreground mb-4">Learning Profile</h3>
              <div className="space-y-4">
                <div className="flex justify-between items-center py-2 border-b border-border">
                  <span className="text-muted-foreground">Field of Interest</span>
                  <span className="font-medium text-foreground">{profile?.field_of_interest || "Not Selected"}</span>
                </div>
                <div className="flex justify-between items-center py-2 border-b border-border">
                  <span className="text-muted-foreground">Education Level</span>
                  <span className="font-medium text-foreground">{profile?.education_level || "Not Set"}</span>
                </div>
                <div className="flex justify-between items-center py-2 border-b border-border">
                  <span className="text-muted-foreground">Institution</span>
                  <span className="font-medium text-foreground">{profile?.institution_name || "Not Set"}</span>
                </div>
                <div className="flex justify-between items-center py-2">
                  <span className="text-muted-foreground">Target Role</span>
                  <span className="font-medium text-foreground">{profile?.target_role || "Not Set"}</span>
                </div>
              </div>
            </Card>

            <Card className="p-6 bg-card border-border">
              <h3 className="text-lg font-bold text-foreground mb-4">Quick Actions</h3>
              <div className="grid gap-3">
                <Link href="/assessment">
                  <Button className="w-full justify-start gap-2" variant="outline">
                    <Target className="h-4 w-4" />
                    Take Assessment
                  </Button>
                </Link>
                <Link href="/roadmap">
                  <Button className="w-full justify-start gap-2" variant="outline">
                    <BookOpen className="h-4 w-4" />
                    View Roadmap
                  </Button>
                </Link>
                <Link href="/analytics">
                  <Button className="w-full justify-start gap-2" variant="outline">
                    <BarChart3 className="h-4 w-4" />
                    View Analytics
                  </Button>
                </Link>
                <Link href="/settings">
                  <Button className="w-full justify-start gap-2" variant="outline">
                    <User className="h-4 w-4" />
                    Edit Profile
                  </Button>
                </Link>
              </div>
            </Card>
          </motion.div>
        </motion.div>
      </main>

      <AIChatbot />
      <NotificationPanel />
      <DeveloperWatermark />
    </div>
  );
}
