"use client";

import { useState, useEffect } from "react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import { createClient } from "@/lib/supabase/client";
import { Calendar, Target, CheckCircle2, ArrowLeft, Sun, Moon, Compass, Sparkles, BookOpen, Trophy, Rocket } from "lucide-react";
import { DeveloperWatermark } from "@/components/DeveloperWatermark";
import { AIChatbot } from "@/components/AIChatbot";
import { NotificationPanel } from "@/components/NotificationPanel";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useTheme } from "@/components/ThemeProvider";
import { motion } from "framer-motion";
import { Badge } from "@/components/ui/badge";

const guidanceByField: Record<string, { today: string[]; week: string[]; month: string[] }> = {
  "Web Development": {
    today: [
      "Practice HTML/CSS fundamentals for 30 minutes",
      "Complete 2 JavaScript coding challenges",
      "Watch a React tutorial video",
      "Review your code from yesterday",
    ],
    week: [
      "Build a responsive landing page",
      "Learn React hooks in depth",
      "Complete 10 coding exercises",
      "Start a mini portfolio project",
      "Join a web dev community forum",
    ],
    month: [
      "Deploy your first full-stack application",
      "Master state management with Redux",
      "Build 3 portfolio-worthy projects",
      "Contribute to an open-source project",
      "Prepare for technical interviews",
      "Network with industry professionals",
    ],
  },
  "Data Science & AI": {
    today: [
      "Review Python fundamentals for 30 minutes",
      "Complete 2 data analysis exercises",
      "Watch a machine learning basics video",
      "Practice with a Kaggle dataset",
    ],
    week: [
      "Build a data visualization dashboard",
      "Learn pandas and numpy in depth",
      "Complete a mini ML project",
      "Study statistics fundamentals",
      "Join data science communities",
    ],
    month: [
      "Complete a full ML pipeline project",
      "Master deep learning basics",
      "Participate in a Kaggle competition",
      "Build an AI-powered application",
      "Prepare for data science interviews",
      "Create data science portfolio",
    ],
  },
  "Cybersecurity": {
    today: [
      "Study networking fundamentals for 30 minutes",
      "Complete 2 security labs",
      "Watch a penetration testing video",
      "Practice with security tools",
    ],
    week: [
      "Set up a home lab environment",
      "Learn Linux administration",
      "Complete CTF challenges",
      "Study cryptography basics",
      "Join security forums and communities",
    ],
    month: [
      "Complete a security certification module",
      "Build a security monitoring system",
      "Participate in bug bounty programs",
      "Master penetration testing tools",
      "Prepare for security certifications",
      "Network with security professionals",
    ],
  },
};

function getDefaultGuidance(field: string) {
  return {
    today: [
      `Study ${field} fundamentals for 30 minutes`,
      "Complete 2 practice exercises",
      "Watch an educational video",
      "Review your progress",
    ],
    week: [
      `Build a mini ${field} project`,
      "Learn core concepts in depth",
      "Complete 10 practice problems",
      "Join relevant communities",
      "Document your learning",
    ],
    month: [
      `Complete a comprehensive ${field} project`,
      "Master advanced concepts",
      "Build portfolio-worthy projects",
      "Contribute to open-source",
      "Prepare for job interviews",
      "Network with professionals",
    ],
  };
}

export default function GuidancePage() {
  const router = useRouter();
  const { theme, toggleTheme } = useTheme();
  const [profile, setProfile] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [guidance, setGuidance] = useState({
    today: [] as string[],
    week: [] as string[],
    month: [] as string[],
  });
  const [completedTasks, setCompletedTasks] = useState<Set<string>>(new Set());

  useEffect(() => {
    loadGuidance();
  }, []);

  async function loadGuidance() {
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
    
    const field = profileData.field_of_interest || "General";
    const fieldGuidance = guidanceByField[field] || getDefaultGuidance(field);
    setGuidance(fieldGuidance);
    setLoading(false);
  }

  const toggleTask = (task: string) => {
    const newCompleted = new Set(completedTasks);
    if (newCompleted.has(task)) {
      newCompleted.delete(task);
    } else {
      newCompleted.add(task);
    }
    setCompletedTasks(newCompleted);
  };

  if (loading) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-background">
        <div className="text-center">
          <Compass className="mx-auto h-12 w-12 animate-pulse text-primary" />
          <p className="mt-4 text-muted-foreground font-medium">Loading guidance...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background text-foreground transition-colors duration-300">
      <header className="sticky top-0 z-50 border-b border-border bg-background/80 backdrop-blur-xl">
        <div className="mx-auto flex h-16 max-w-7xl items-center justify-between px-4 sm:px-6 lg:px-8">
          <Link href="/dashboard" className="flex items-center gap-3">
            <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-gradient-to-br from-violet-500 to-purple-600 shadow-lg">
              <Compass className="h-6 w-6 text-white" />
            </div>
            <div>
              <h1 className="text-lg font-bold tracking-tight text-foreground">Guidance</h1>
              <p className="text-xs text-muted-foreground">AI-Powered Learning Path</p>
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

      <main className="mx-auto max-w-5xl px-4 py-8 sm:px-6 lg:px-8">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
        >
          <Card className="mb-8 bg-gradient-to-r from-violet-500 to-purple-600 p-8 text-white border-0">
            <div className="flex items-center gap-4">
              <div className="h-14 w-14 rounded-xl bg-white/10 flex items-center justify-center">
                <Sparkles className="h-8 w-8" />
              </div>
              <div>
                <h2 className="text-2xl font-bold">Personalized Learning Guidance</h2>
                <p className="text-white/80">
                  AI-powered roadmap for {profile?.field_of_interest || "your chosen field"}
                </p>
              </div>
            </div>
            <div className="mt-6 flex items-center gap-4">
              <Badge className="bg-white/20 text-white border-0">
                <Target className="h-3 w-3 mr-1" />
                {completedTasks.size} Tasks Completed
              </Badge>
              <Badge className="bg-white/20 text-white border-0">
                <BookOpen className="h-3 w-3 mr-1" />
                {profile?.field_of_interest || "General"}
              </Badge>
            </div>
          </Card>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
        >
          <Tabs defaultValue="today" className="space-y-6">
            <TabsList className="grid w-full grid-cols-3 bg-card border border-border">
              <TabsTrigger value="today" className="gap-2 data-[state=active]:bg-primary data-[state=active]:text-primary-foreground">
                <Target className="h-4 w-4" />
                Today
              </TabsTrigger>
              <TabsTrigger value="week" className="gap-2 data-[state=active]:bg-primary data-[state=active]:text-primary-foreground">
                <Calendar className="h-4 w-4" />
                This Week
              </TabsTrigger>
              <TabsTrigger value="month" className="gap-2 data-[state=active]:bg-primary data-[state=active]:text-primary-foreground">
                <Trophy className="h-4 w-4" />
                This Month
              </TabsTrigger>
            </TabsList>

            <TabsContent value="today">
              <Card className="p-6 bg-card border-border">
                <h3 className="mb-4 text-xl font-bold text-foreground flex items-center gap-2">
                  <Target className="h-5 w-5 text-primary" />
                  Today&apos;s Goals
                </h3>
                <div className="space-y-3">
                  {guidance.today.map((item, i) => (
                    <motion.div
                      key={i}
                      initial={{ opacity: 0, x: -20 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: i * 0.1 }}
                      onClick={() => toggleTask(`today-${i}`)}
                      className={`flex items-start gap-3 rounded-lg p-4 cursor-pointer transition-all ${
                        completedTasks.has(`today-${i}`)
                          ? "bg-primary/10 border border-primary/20"
                          : "bg-muted/50 border border-border hover:bg-muted"
                      }`}
                    >
                      <div className={`mt-0.5 flex h-6 w-6 items-center justify-center rounded-full text-xs font-bold ${
                        completedTasks.has(`today-${i}`)
                          ? "bg-primary text-primary-foreground"
                          : "bg-violet-500 text-white"
                      }`}>
                        {completedTasks.has(`today-${i}`) ? <CheckCircle2 className="h-4 w-4" /> : i + 1}
                      </div>
                      <p className={`flex-1 ${
                        completedTasks.has(`today-${i}`)
                          ? "text-muted-foreground line-through"
                          : "text-foreground"
                      }`}>{item}</p>
                    </motion.div>
                  ))}
                </div>
              </Card>
            </TabsContent>

            <TabsContent value="week">
              <Card className="p-6 bg-card border-border">
                <h3 className="mb-4 text-xl font-bold text-foreground flex items-center gap-2">
                  <Calendar className="h-5 w-5 text-primary" />
                  This Week&apos;s Goals
                </h3>
                <div className="space-y-3">
                  {guidance.week.map((item, i) => (
                    <motion.div
                      key={i}
                      initial={{ opacity: 0, x: -20 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: i * 0.1 }}
                      onClick={() => toggleTask(`week-${i}`)}
                      className={`flex items-start gap-3 rounded-lg p-4 cursor-pointer transition-all ${
                        completedTasks.has(`week-${i}`)
                          ? "bg-primary/10 border border-primary/20"
                          : "bg-muted/50 border border-border hover:bg-muted"
                      }`}
                    >
                      <div className={`mt-0.5 flex h-6 w-6 items-center justify-center rounded-full text-xs font-bold ${
                        completedTasks.has(`week-${i}`)
                          ? "bg-primary text-primary-foreground"
                          : "bg-fuchsia-500 text-white"
                      }`}>
                        {completedTasks.has(`week-${i}`) ? <CheckCircle2 className="h-4 w-4" /> : i + 1}
                      </div>
                      <p className={`flex-1 ${
                        completedTasks.has(`week-${i}`)
                          ? "text-muted-foreground line-through"
                          : "text-foreground"
                      }`}>{item}</p>
                    </motion.div>
                  ))}
                </div>
              </Card>
            </TabsContent>

            <TabsContent value="month">
              <Card className="p-6 bg-card border-border">
                <h3 className="mb-4 text-xl font-bold text-foreground flex items-center gap-2">
                  <Trophy className="h-5 w-5 text-primary" />
                  This Month&apos;s Goals
                </h3>
                <div className="space-y-3">
                  {guidance.month.map((item, i) => (
                    <motion.div
                      key={i}
                      initial={{ opacity: 0, x: -20 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: i * 0.1 }}
                      onClick={() => toggleTask(`month-${i}`)}
                      className={`flex items-start gap-3 rounded-lg p-4 cursor-pointer transition-all ${
                        completedTasks.has(`month-${i}`)
                          ? "bg-primary/10 border border-primary/20"
                          : "bg-muted/50 border border-border hover:bg-muted"
                      }`}
                    >
                      <div className={`mt-0.5 flex h-6 w-6 items-center justify-center rounded-full text-xs font-bold ${
                        completedTasks.has(`month-${i}`)
                          ? "bg-primary text-primary-foreground"
                          : "bg-indigo-500 text-white"
                      }`}>
                        {completedTasks.has(`month-${i}`) ? <CheckCircle2 className="h-4 w-4" /> : i + 1}
                      </div>
                      <p className={`flex-1 ${
                        completedTasks.has(`month-${i}`)
                          ? "text-muted-foreground line-through"
                          : "text-foreground"
                      }`}>{item}</p>
                    </motion.div>
                  ))}
                </div>
              </Card>
            </TabsContent>
          </Tabs>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4 }}
          className="mt-8 flex justify-center gap-4"
        >
          <Link href="/roadmap">
            <Button size="lg" className="gap-2">
              <Rocket className="h-4 w-4" />
              View Full Roadmap
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
