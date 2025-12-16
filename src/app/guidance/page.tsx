"use client";

import { useState, useEffect } from "react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import { createClient } from "@/lib/supabase/client";
import { Brain, Calendar, Target, CheckCircle2 } from "lucide-react";
import { DeveloperWatermark } from "@/components/DeveloperWatermark";
import { AIChatbot } from "@/components/AIChatbot";
import { NotificationPanel } from "@/components/NotificationPanel";
import Link from "next/link";

export default function GuidancePage() {
  const [profile, setProfile] = useState<any>(null);
  const [guidance, setGuidance] = useState({
    today: [] as string[],
    week: [] as string[],
    month: [] as string[],
  });

  useEffect(() => {
    loadGuidance();
  }, []);

  async function loadGuidance() {
    const supabase = createClient();
    const { data: { user } } = await supabase.auth.getUser();
    
    if (user) {
      const { data: profileData } = await supabase
        .from("user_profiles")
        .select("*")
        .eq("id", user.id)
        .single();

      if (profileData) {
        setProfile(profileData);
        generateGuidance(profileData);
      }
    }
  }

  function generateGuidance(profile: any) {
    const field = profile.field_of_interest || "General";
    
    setGuidance({
      today: [
        `Review fundamentals of ${field}`,
        "Complete 1 practice problem",
        "Watch a 15-minute tutorial video",
        "Take notes on key concepts",
      ],
      week: [
        `Master core ${field} concepts`,
        "Complete 5 practice assessments",
        "Build a mini-project",
        "Join study group or forum",
        "Review and revise weak topics",
      ],
      month: [
        `Achieve proficiency in ${field}`,
        "Complete 20+ practice assessments",
        "Build 2-3 portfolio projects",
        "Contribute to open-source (if applicable)",
        "Prepare for certification exam",
        "Network with professionals in the field",
      ],
    });
  }

  if (!profile) {
    return (
      <div className="flex min-h-screen items-center justify-center">
        <div className="text-center">
          <Brain className="mx-auto h-12 w-12 animate-pulse text-violet-600" />
          <p className="mt-4 text-slate-600">Loading guidance...</p>
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
              <h1 className="text-lg font-bold tracking-tight text-slate-900">Guidance</h1>
              <p className="text-xs text-slate-500">Your Learning Path</p>
            </div>
          </Link>
        </div>
      </header>

      <main className="mx-auto max-w-5xl px-4 py-8 sm:px-6 lg:px-8">
        <Card className="mb-8 bg-gradient-to-r from-violet-600 to-fuchsia-600 p-8 text-white">
          <h2 className="mb-2 text-2xl font-bold">Personalized Learning Guidance</h2>
          <p className="text-violet-100">
            Your AI-powered roadmap for {profile.field_of_interest || "your chosen field"}
          </p>
        </Card>

        <Tabs defaultValue="today" className="space-y-6">
          <TabsList className="grid w-full grid-cols-3 bg-white shadow-sm">
            <TabsTrigger value="today" className="gap-2">
              <Target className="h-4 w-4" />
              Today
            </TabsTrigger>
            <TabsTrigger value="week" className="gap-2">
              <Calendar className="h-4 w-4" />
              This Week
            </TabsTrigger>
            <TabsTrigger value="month" className="gap-2">
              <CheckCircle2 className="h-4 w-4" />
              This Month
            </TabsTrigger>
          </TabsList>

          <TabsContent value="today">
            <Card className="p-6">
              <h3 className="mb-4 text-xl font-bold text-slate-900">Today's Goals</h3>
              <div className="space-y-3">
                {guidance.today.map((item, i) => (
                  <div key={i} className="flex items-start gap-3 rounded-lg bg-violet-50 p-4">
                    <div className="mt-0.5 flex h-6 w-6 items-center justify-center rounded-full bg-violet-600 text-xs font-bold text-white">
                      {i + 1}
                    </div>
                    <p className="flex-1 text-slate-700">{item}</p>
                  </div>
                ))}
              </div>
            </Card>
          </TabsContent>

          <TabsContent value="week">
            <Card className="p-6">
              <h3 className="mb-4 text-xl font-bold text-slate-900">This Week's Goals</h3>
              <div className="space-y-3">
                {guidance.week.map((item, i) => (
                  <div key={i} className="flex items-start gap-3 rounded-lg bg-fuchsia-50 p-4">
                    <div className="mt-0.5 flex h-6 w-6 items-center justify-center rounded-full bg-fuchsia-600 text-xs font-bold text-white">
                      {i + 1}
                    </div>
                    <p className="flex-1 text-slate-700">{item}</p>
                  </div>
                ))}
              </div>
            </Card>
          </TabsContent>

          <TabsContent value="month">
            <Card className="p-6">
              <h3 className="mb-4 text-xl font-bold text-slate-900">This Month's Goals</h3>
              <div className="space-y-3">
                {guidance.month.map((item, i) => (
                  <div key={i} className="flex items-start gap-3 rounded-lg bg-indigo-50 p-4">
                    <div className="mt-0.5 flex h-6 w-6 items-center justify-center rounded-full bg-indigo-600 text-xs font-bold text-white">
                      {i + 1}
                    </div>
                    <p className="flex-1 text-slate-700">{item}</p>
                  </div>
                ))}
              </div>
            </Card>
          </TabsContent>
        </Tabs>

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
