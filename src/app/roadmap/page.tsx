"use client";

import { useState, useEffect } from "react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { createClient } from "@/lib/supabase/client";
import { Brain, Map, CheckCircle2, Circle } from "lucide-react";
import { DeveloperWatermark } from "@/components/DeveloperWatermark";
import { AIChatbot } from "@/components/AIChatbot";
import { NotificationPanel } from "@/components/NotificationPanel";
import Link from "next/link";

interface RoadmapPhase {
  title: string;
  duration: string;
  topics: string[];
  completed: boolean;
}

export default function RoadmapPage() {
  const [profile, setProfile] = useState<any>(null);
  const [roadmap, setRoadmap] = useState<RoadmapPhase[]>([]);

  useEffect(() => {
    loadRoadmap();
  }, []);

  async function loadRoadmap() {
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
        generateRoadmap(profileData);
      }
    }
  }

  function generateRoadmap(profile: any) {
    const field = profile.field_of_interest || "General";
    
    const phases: RoadmapPhase[] = [
      {
        title: "Foundation Phase",
        duration: "Weeks 1-4",
        topics: [
          `Introduction to ${field}`,
          "Core concepts and terminology",
          "Basic tools and setup",
          "Fundamentals practice",
        ],
        completed: false,
      },
      {
        title: "Intermediate Phase",
        duration: "Weeks 5-8",
        topics: [
          `Advanced ${field} concepts`,
          "Problem-solving techniques",
          "Best practices",
          "Mini projects",
        ],
        completed: false,
      },
      {
        title: "Advanced Phase",
        duration: "Weeks 9-12",
        topics: [
          "Complex problem solving",
          "Optimization techniques",
          "Real-world applications",
          "Portfolio projects",
        ],
        completed: false,
      },
      {
        title: "Mastery Phase",
        duration: "Weeks 13-16",
        topics: [
          "Expert-level challenges",
          "Industry best practices",
          "Certification preparation",
          "Career readiness",
        ],
        completed: false,
      },
    ];

    setRoadmap(phases);
  }

  if (!profile) {
    return (
      <div className="flex min-h-screen items-center justify-center">
        <div className="text-center">
          <Brain className="mx-auto h-12 w-12 animate-pulse text-violet-600" />
          <p className="mt-4 text-slate-600">Loading roadmap...</p>
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
              <h1 className="text-lg font-bold tracking-tight text-slate-900">Roadmap</h1>
              <p className="text-xs text-slate-500">Your Learning Journey</p>
            </div>
          </Link>
        </div>
      </header>

      <main className="mx-auto max-w-5xl px-4 py-8 sm:px-6 lg:px-8">
        <Card className="mb-8 bg-gradient-to-r from-violet-600 to-fuchsia-600 p-8 text-white">
          <div className="flex items-center gap-3">
            <Map className="h-8 w-8" />
            <div>
              <h2 className="text-2xl font-bold">Learning Roadmap</h2>
              <p className="text-violet-100">
                Your personalized path to mastering {profile.field_of_interest || "your field"}
              </p>
            </div>
          </div>
        </Card>

        <div className="space-y-6">
          {roadmap.map((phase, index) => (
            <Card key={index} className="p-6">
              <div className="flex items-start gap-4">
                <div className="mt-1">
                  {phase.completed ? (
                    <CheckCircle2 className="h-8 w-8 text-green-600" />
                  ) : (
                    <Circle className="h-8 w-8 text-slate-300" />
                  )}
                </div>
                <div className="flex-1">
                  <div className="mb-4 flex items-center justify-between">
                    <div>
                      <h3 className="text-xl font-bold text-slate-900">{phase.title}</h3>
                      <p className="text-sm text-slate-600">{phase.duration}</p>
                    </div>
                    {phase.completed && (
                      <span className="rounded-full bg-green-100 px-3 py-1 text-sm font-medium text-green-700">
                        Completed
                      </span>
                    )}
                  </div>
                  <div className="space-y-2">
                    {phase.topics.map((topic, i) => (
                      <div
                        key={i}
                        className="flex items-center gap-3 rounded-lg bg-slate-50 p-3"
                      >
                        <div className="h-2 w-2 rounded-full bg-violet-600" />
                        <p className="text-slate-700">{topic}</p>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </Card>
          ))}
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
