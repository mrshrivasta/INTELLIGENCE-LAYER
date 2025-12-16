"use client";

import { useState } from "react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Button } from "@/components/ui/button";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { UserProfileCard } from "@/components/UserProfileCard";
import { GuidanceCard } from "@/components/GuidanceCard";
import { AssessmentCard } from "@/components/AssessmentCard";
import { PerformanceAnalyticsCard } from "@/components/PerformanceAnalyticsCard";
import { RoadmapCard } from "@/components/RoadmapCard";
import { ScoreHistoryChart } from "@/components/ScoreHistoryChart";
import { TopicAccuracyChart } from "@/components/TopicAccuracyChart";
import { sampleUserProfile, availableFields, availableRoles } from "@/lib/sample-data";
import {
  generateGuidance,
  generateAssessment,
  analyzePerformance,
  getAdaptiveLearningDecision,
  generateProfileFeedback,
  generateLearningRoadmap,
} from "@/lib/ai-service";
import {
  Brain,
  Compass,
  FileQuestion,
  BarChart3,
  Map,
  Sparkles,
  GraduationCap,
} from "lucide-react";

export default function Home() {
  const [profile] = useState(sampleUserProfile);
  const [selectedField, setSelectedField] = useState("Web Development");
  const [activeTab, setActiveTab] = useState("overview");

  const guidance = generateGuidance(profile);
  const assessment = generateAssessment(profile);
  const performanceAnalysis = analyzePerformance(profile);
  const adaptiveDecision = getAdaptiveLearningDecision(profile);
  const feedback = generateProfileFeedback(profile);
  const roadmap = generateLearningRoadmap(selectedField, profile);

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-violet-50/30 to-slate-50">
      <header className="sticky top-0 z-50 border-b border-slate-200/80 bg-white/80 backdrop-blur-lg">
        <div className="mx-auto flex h-16 max-w-7xl items-center justify-between px-4 sm:px-6 lg:px-8">
          <div className="flex items-center gap-3">
            <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-gradient-to-br from-violet-600 to-fuchsia-600 shadow-lg shadow-violet-500/25">
              <Brain className="h-6 w-6 text-white" />
            </div>
            <div>
              <h1 className="text-lg font-bold tracking-tight text-slate-900">
                AI Intelligence Layer
              </h1>
              <p className="text-xs text-slate-500">Education & Career Platform</p>
            </div>
          </div>
          <div className="flex items-center gap-3">
            <div className="hidden items-center gap-2 rounded-full bg-gradient-to-r from-violet-100 to-fuchsia-100 px-4 py-2 sm:flex">
              <Sparkles className="h-4 w-4 text-violet-600" />
              <span className="text-sm font-medium text-violet-900">
                Personalized Learning Active
              </span>
            </div>
            <div className="flex h-9 w-9 items-center justify-center rounded-full bg-gradient-to-br from-violet-500 to-fuchsia-500 text-sm font-bold text-white shadow-md">
              {profile.userId.charAt(0).toUpperCase()}
            </div>
          </div>
        </div>
      </header>

      <main className="mx-auto max-w-7xl px-4 py-6 sm:px-6 lg:px-8">
        <div className="mb-6 rounded-2xl bg-gradient-to-r from-slate-900 via-violet-900 to-slate-900 p-6 text-white shadow-xl">
          <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
            <div>
              <div className="mb-2 flex items-center gap-2">
                <GraduationCap className="h-5 w-5 text-violet-300" />
                <span className="text-sm text-violet-300">Welcome back</span>
              </div>
              <h2 className="text-2xl font-bold">
                Your Learning Dashboard
              </h2>
              <p className="mt-1 text-sm text-slate-300">
                AI-powered guidance tailored to your journey as a{" "}
                <span className="font-medium text-violet-300">
                  {profile.targetRole}
                </span>
              </p>
            </div>
            <div className="flex flex-col gap-2 sm:items-end">
              <label className="text-xs text-slate-400">Switch Learning Path</label>
              <Select value={selectedField} onValueChange={setSelectedField}>
                <SelectTrigger className="w-[200px] border-white/20 bg-white/10 text-white backdrop-blur">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {availableFields.map((field) => (
                    <SelectItem key={field} value={field}>
                      {field}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>
        </div>

        <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-6">
          <TabsList className="grid w-full grid-cols-5 bg-white shadow-sm">
            <TabsTrigger value="overview" className="gap-2 text-xs sm:text-sm">
              <BarChart3 className="h-4 w-4" />
              <span className="hidden sm:inline">Overview</span>
            </TabsTrigger>
            <TabsTrigger value="guidance" className="gap-2 text-xs sm:text-sm">
              <Compass className="h-4 w-4" />
              <span className="hidden sm:inline">Guidance</span>
            </TabsTrigger>
            <TabsTrigger value="assessment" className="gap-2 text-xs sm:text-sm">
              <FileQuestion className="h-4 w-4" />
              <span className="hidden sm:inline">Assessment</span>
            </TabsTrigger>
            <TabsTrigger value="analytics" className="gap-2 text-xs sm:text-sm">
              <Brain className="h-4 w-4" />
              <span className="hidden sm:inline">Analytics</span>
            </TabsTrigger>
            <TabsTrigger value="roadmap" className="gap-2 text-xs sm:text-sm">
              <Map className="h-4 w-4" />
              <span className="hidden sm:inline">Roadmap</span>
            </TabsTrigger>
          </TabsList>

          <TabsContent value="overview" className="space-y-6">
            <div className="grid gap-6 lg:grid-cols-3">
              <div className="lg:col-span-1">
                <UserProfileCard profile={profile} />
              </div>
              <div className="space-y-6 lg:col-span-2">
                <GuidanceCard guidance={guidance} />
                <div className="grid gap-6 sm:grid-cols-2">
                  <ScoreHistoryChart scores={profile.testScoreHistory} />
                  <TopicAccuracyChart topics={profile.topicAccuracyMap} />
                </div>
              </div>
            </div>
          </TabsContent>

          <TabsContent value="guidance" className="space-y-6">
            <div className="grid gap-6 lg:grid-cols-3">
              <div className="lg:col-span-2">
                <GuidanceCard guidance={guidance} />
              </div>
              <div>
                <UserProfileCard profile={profile} />
              </div>
            </div>
            <div className="grid gap-6 sm:grid-cols-2">
              <ScoreHistoryChart scores={profile.testScoreHistory} />
              <TopicAccuracyChart topics={profile.topicAccuracyMap} />
            </div>
          </TabsContent>

          <TabsContent value="assessment" className="space-y-6">
            <div className="grid gap-6 lg:grid-cols-3">
              <div className="lg:col-span-2">
                <AssessmentCard assessment={assessment} />
              </div>
              <div className="space-y-6">
                <UserProfileCard profile={profile} />
              </div>
            </div>
          </TabsContent>

          <TabsContent value="analytics" className="space-y-6">
            <div className="grid gap-6 lg:grid-cols-3">
              <div className="lg:col-span-2">
                <PerformanceAnalyticsCard
                  analysis={performanceAnalysis}
                  adaptiveDecision={adaptiveDecision}
                  feedback={feedback}
                />
              </div>
              <div className="space-y-6">
                <UserProfileCard profile={profile} />
                <ScoreHistoryChart scores={profile.testScoreHistory} />
                <TopicAccuracyChart topics={profile.topicAccuracyMap} />
              </div>
            </div>
          </TabsContent>

          <TabsContent value="roadmap" className="space-y-6">
            <div className="grid gap-6 lg:grid-cols-3">
              <div className="lg:col-span-2">
                <RoadmapCard roadmap={roadmap} />
              </div>
              <div className="space-y-6">
                <UserProfileCard profile={profile} />
                <div className="rounded-xl border border-slate-200 bg-white p-4 shadow-sm">
                  <h3 className="mb-3 text-sm font-semibold text-slate-900">
                    Available Roles in {selectedField}
                  </h3>
                  <div className="flex flex-wrap gap-2">
                    {availableRoles[selectedField]?.map((role) => (
                      <span
                        key={role}
                        className="rounded-full bg-violet-100 px-3 py-1 text-xs font-medium text-violet-700"
                      >
                        {role}
                      </span>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          </TabsContent>
        </Tabs>

        <footer className="mt-12 border-t border-slate-200 pt-6">
          <div className="flex flex-col items-center justify-between gap-4 sm:flex-row">
            <div className="flex items-center gap-2 text-sm text-slate-500">
              <Brain className="h-4 w-4" />
              <span>AI Intelligence Layer v1.0</span>
            </div>
            <p className="text-xs text-slate-400">
              Modular • Config-driven • Extensible • Backward-compatible
            </p>
          </div>
        </footer>
      </main>
    </div>
  );
}
