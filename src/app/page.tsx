"use client";

import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { sampleUserProfile } from "@/lib/sample-data";
import {
  Brain,
  BarChart3,
  Compass,
  FileQuestion,
  Map,
  Mic,
  Volume2,
  Settings,
  Award,
  Clock,
  ArrowRight,
  Lightbulb,
  MessageSquare,
  Bell,
  Sparkles,
  Zap,
} from "lucide-react";
import { DeveloperWatermark } from "@/components/DeveloperWatermark";
import { AIChatbot } from "@/components/AIChatbot";
import { NotificationPanel } from "@/components/NotificationPanel";
import Link from "next/link";

export default function HomePage() {
  const [profile] = useState(sampleUserProfile);
  const [voiceActive, setVoiceActive] = useState(false);
  const [aiInsight, setAiInsight] = useState("");
  const [showChatbot, setShowChatbot] = useState(false);
  const [showNotifications, setShowNotifications] = useState(false);

  const insights = [
    "Your React skills improved 23% this week - keep it up!",
    "AI recommends focusing on TypeScript next",
    "3 new learning paths match your interests",
    "You're in top 15% of learners this month",
    "New AI-powered assessment available",
    "Personalized roadmap updated with latest trends",
    "Daily guidance available - check your recommendations",
  ];

  useEffect(() => {
    const interval = setInterval(() => {
      setAiInsight(insights[Math.floor(Math.random() * insights.length)]);
    }, 5000);
    return () => clearInterval(interval);
  }, []);

  const quickStats = [
    { label: "Learning Streak", value: "24 days", icon: Zap, color: "text-amber-500", bg: "bg-amber-500/10" },
    { label: "Skills Mastered", value: "12", icon: Award, color: "text-violet-600", bg: "bg-violet-600/10" },
    { label: "Study Time", value: "48h", icon: Clock, color: "text-blue-600", bg: "bg-blue-600/10" },
    { label: "AI Score", value: "87%", icon: Brain, color: "text-fuchsia-600", bg: "bg-fuchsia-600/10" },
  ];

  const aiFeatures = [
    {
      title: "AI Voice Assistant",
      desc: "Talk to your learning companion",
      icon: Mic,
      gradient: "from-blue-500 to-cyan-500",
      href: "/overview"
    },
    {
      title: "Smart Analytics",
      desc: "Real-time skill gap analysis",
      icon: BarChart3,
      gradient: "from-violet-500 to-purple-500",
      href: "/analytics"
    },
    {
      title: "Adaptive Tests",
      desc: "AI-generated assessments",
      icon: FileQuestion,
      gradient: "from-fuchsia-500 to-pink-500",
      href: "/assessment"
    },
    {
      title: "Learning Roadmap",
      desc: "Personalized career path",
      icon: Map,
      gradient: "from-orange-500 to-red-500",
      href: "/roadmap"
    },
    {
      title: "AI Guidance",
      desc: "Daily personalized tips",
      icon: Compass,
      gradient: "from-green-500 to-emerald-500",
      href: "/guidance"
    },
    {
      title: "Content Generator",
      desc: "AI-powered study materials",
      icon: Lightbulb,
      gradient: "from-yellow-500 to-amber-500",
      href: "/overview"
    },
  ];

  return (
    <div className="min-h-screen bg-slate-50">
      {/* Header */}
      <header className="sticky top-0 z-50 border-b border-white/20 bg-white/80 backdrop-blur-xl supports-[backdrop-filter]:bg-white/60">
        <div className="mx-auto flex h-16 max-w-7xl items-center justify-between px-6 lg:px-8">
          <div className="flex items-center gap-3">
            <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-gradient-to-br from-violet-600 to-fuchsia-600 shadow-lg shadow-violet-500/20">
              <Brain className="h-5 w-5 text-white" />
            </div>
            <div>
              <h1 className="text-base font-bold text-slate-900">
                Orchids AI
              </h1>
            </div>
          </div>
          
          <div className="flex items-center gap-3">
            <Button
              variant="ghost"
              size="sm"
              className="text-slate-600 hover:text-slate-900 hover:bg-slate-100"
              onClick={() => setShowNotifications(!showNotifications)}
            >
              <Bell className="h-4 w-4" />
            </Button>
            <Button
              variant="ghost"
              size="sm"
              className="text-slate-600 hover:text-slate-900 hover:bg-slate-100"
              onClick={() => setShowChatbot(!showChatbot)}
            >
              <MessageSquare className="h-4 w-4" />
            </Button>
            <Link href="/settings">
              <Button variant="ghost" size="sm" className="text-slate-600 hover:text-slate-900 hover:bg-slate-100">
                <Settings className="h-4 w-4" />
              </Button>
            </Link>
            <Link href="/profile">
              <div className="flex h-8 w-8 items-center justify-center rounded-full bg-gradient-to-br from-slate-800 to-slate-900 text-xs font-medium text-white shadow-md cursor-pointer ring-2 ring-white hover:ring-violet-200 transition-all">
                {profile.userId.charAt(0).toUpperCase()}
              </div>
            </Link>
          </div>
        </div>
      </header>

      <main className="relative mx-auto max-w-7xl px-6 py-12 lg:px-8">
        {/* Hero section */}
        <div className="relative isolate overflow-hidden rounded-3xl bg-gradient-to-br from-slate-900 via-violet-950 to-slate-900 px-6 pt-16 shadow-2xl sm:px-16 md:pt-24 lg:flex lg:gap-x-20 lg:px-24 lg:pt-0 mb-12">
          <svg
            viewBox="0 0 1024 1024"
            className="absolute left-1/2 top-1/2 -z-10 h-[64rem] w-[64rem] -translate-y-1/2 [mask-image:radial-gradient(closest-side,white,transparent)] sm:left-full sm:-ml-80 lg:left-1/2 lg:ml-0 lg:-translate-x-1/2 lg:translate-y-0"
            aria-hidden="true"
          >
            <circle cx={512} cy={512} r={512} fill="url(#759c1415-0410-454c-8f7c-9a820de03641)" fillOpacity="0.7" />
            <defs>
              <radialGradient id="759c1415-0410-454c-8f7c-9a820de03641">
                <stop stopColor="#7775D6" />
                <stop offset={1} stopColor="#E935C1" />
              </radialGradient>
            </defs>
          </svg>
          <div className="mx-auto max-w-md text-center lg:mx-0 lg:flex-auto lg:py-24 lg:text-left">
             <div className="mb-6 flex items-center justify-center lg:justify-start gap-2">
              <Badge className="rounded-full bg-white/10 px-3 py-1 text-xs font-medium text-white backdrop-blur-sm border-0">
                {profile.targetRole}
              </Badge>
              <Badge className="rounded-full bg-emerald-500/20 px-3 py-1 text-xs font-medium text-emerald-300 backdrop-blur-sm border-0 flex items-center gap-1">
                <span className="relative flex h-2 w-2">
                  <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
                  <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-500"></span>
                </span>
                AI Active
              </Badge>
            </div>
            <h2 className="text-3xl font-bold tracking-tight text-white sm:text-4xl">
              Welcome back, {profile.userId}
              <br />
              <span className="text-violet-300">Ready to level up?</span>
            </h2>
            <p className="mt-6 text-lg leading-8 text-gray-300">
              {aiInsight || "Analyzing your learning patterns..."}
            </p>
            <div className="mt-10 flex items-center justify-center gap-x-6 lg:justify-start">
              <Link href="/dashboard">
                <Button size="lg" className="bg-white text-slate-900 hover:bg-slate-100 font-semibold shadow-lg shadow-white/10">
                  Go to Dashboard
                  <ArrowRight className="ml-2 h-4 w-4" />
                </Button>
              </Link>
              <Button
                size="lg"
                variant="outline"
                className="border-white/20 bg-white/5 text-white hover:bg-white/10 backdrop-blur-sm"
                onClick={() => setVoiceActive(!voiceActive)}
              >
                {voiceActive ? <Volume2 className="mr-2 h-4 w-4" /> : <Mic className="mr-2 h-4 w-4" />}
                {voiceActive ? "Listening..." : "Voice Assistant"}
              </Button>
            </div>
          </div>
        </div>

        {/* Quick Stats */}
        <div className="grid grid-cols-2 gap-4 lg:grid-cols-4 mb-12">
          {quickStats.map((stat, i) => {
            const Icon = stat.icon;
            return (
              <div key={i} className="group relative overflow-hidden rounded-2xl border border-slate-200 bg-white p-6 transition-all hover:shadow-lg hover:-translate-y-1">
                <div className={`absolute right-4 top-4 h-12 w-12 rounded-full ${stat.bg} opacity-20 transition-transform group-hover:scale-150 group-hover:opacity-30`} />
                <Icon className={`h-8 w-8 ${stat.color} mb-4 relative z-10`} />
                <p className="text-3xl font-bold text-slate-900 mb-1 relative z-10">{stat.value}</p>
                <p className="text-sm font-medium text-slate-500 relative z-10">{stat.label}</p>
              </div>
            );
          })}
        </div>

        {/* AI Features */}
        <div className="mb-12">
          <div className="mb-8 flex items-end justify-between">
            <div>
              <h3 className="text-2xl font-bold text-slate-900 mb-2 flex items-center gap-2">
                <Sparkles className="h-5 w-5 text-violet-600" />
                AI Tools
              </h3>
              <p className="text-slate-600">Explore your personalized AI-powered learning suite</p>
            </div>
            <Link href="/features" className="text-sm font-semibold text-violet-600 hover:text-violet-700 hidden sm:block">
              View all features &rarr;
            </Link>
          </div>

          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {aiFeatures.map((feature, i) => {
              const Icon = feature.icon;
              return (
                <Link key={i} href={feature.href}>
                  <div className="group h-full rounded-2xl border border-slate-200 bg-white p-6 shadow-sm transition-all hover:shadow-lg hover:border-violet-200">
                    <div className={`mb-4 inline-flex h-12 w-12 items-center justify-center rounded-xl bg-gradient-to-br ${feature.gradient} text-white shadow-md transition-transform group-hover:scale-110 group-hover:rotate-3`}>
                      <Icon className="h-6 w-6" />
                    </div>
                    <h4 className="text-lg font-bold text-slate-900 mb-2 group-hover:text-violet-600 transition-colors">
                      {feature.title}
                    </h4>
                    <p className="text-sm text-slate-600 leading-relaxed">
                      {feature.desc}
                    </p>
                  </div>
                </Link>
              );
            })}
          </div>
        </div>

        {/* Progress card */}
        <div className="relative overflow-hidden rounded-2xl border border-slate-200 bg-white p-8 shadow-sm">
          <div className="absolute top-0 right-0 -mt-4 -mr-4 h-32 w-32 rounded-full bg-gradient-to-br from-violet-600/10 to-fuchsia-600/10 blur-2xl" />
          
          <div className="relative">
            <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between mb-6 gap-4">
              <div>
                <div className="flex items-center gap-2 mb-1">
                  <h4 className="text-xl font-bold text-slate-900">Current Focus</h4>
                  <Badge variant="outline" className="border-violet-200 text-violet-700 bg-violet-50">High Priority</Badge>
                </div>
                <p className="text-slate-600">React Advanced Patterns & Performance</p>
              </div>
              <Link href="/overview">
                <Button variant="outline" className="hover:bg-slate-50">
                  Continue Learning <ArrowRight className="ml-2 h-4 w-4" />
                </Button>
              </Link>
            </div>
            
            <div className="space-y-2">
              <div className="flex justify-between text-sm font-medium">
                <span className="text-slate-700">Progress</span>
                <span className="text-violet-600">67%</span>
              </div>
              <Progress value={67} className="h-3 bg-slate-100" />
              <div className="flex justify-between text-xs text-slate-500 mt-2">
                <span>12 of 18 modules completed</span>
                <span>Est. 2 weeks remaining</span>
              </div>
            </div>
          </div>
        </div>
      </main>

      {showChatbot && <AIChatbot onClose={() => setShowChatbot(false)} />}
      {showNotifications && <NotificationPanel onClose={() => setShowNotifications(false)} />}
      <DeveloperWatermark />
    </div>
  );
}
