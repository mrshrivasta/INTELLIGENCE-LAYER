"use client";

import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { sampleUserProfile } from "@/lib/sample-data";
import {
  Brain,
  Sparkles,
  TrendingUp,
  Target,
  Zap,
  Cpu,
  GraduationCap,
  BarChart3,
  Compass,
  FileQuestion,
  Map,
  Mic,
  Volume2,
  Settings,
  BookOpen,
  Award,
  Clock,
  ArrowRight,
  Lightbulb,
  Shield,
  MessageSquare,
  Bell,
} from "lucide-react";
import { DeveloperWatermark } from "@/components/DeveloperWatermark";
import { AIChatbot } from "@/components/AIChatbot";
import { NotificationPanel } from "@/components/NotificationPanel";
import Link from "next/link";

export default function Home() {
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
  ];

  useEffect(() => {
    const interval = setInterval(() => {
      setAiInsight(insights[Math.floor(Math.random() * insights.length)]);
    }, 5000);
    return () => clearInterval(interval);
  }, []);

  const quickStats = [
    { label: "Learning Streak", value: "24 days", icon: Target, color: "text-emerald-600" },
    { label: "Skills Mastered", value: "12", icon: Award, color: "text-violet-600" },
    { label: "Study Time", value: "48h", icon: Clock, color: "text-blue-600" },
    { label: "AI Score", value: "87%", icon: Brain, color: "text-fuchsia-600" },
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
    <div className="min-h-screen bg-gradient-to-br from-slate-950 via-violet-950 to-slate-950">
      <div className="absolute inset-0 bg-[url('/grid.svg')] opacity-20"></div>
      
      <header className="sticky top-0 z-50 border-b border-white/10 bg-slate-950/80 backdrop-blur-xl">
        <div className="mx-auto flex h-16 max-w-7xl items-center justify-between px-4 sm:px-6 lg:px-8">
          <div className="flex items-center gap-3">
            <div className="relative flex h-10 w-10 items-center justify-center rounded-xl bg-gradient-to-br from-violet-500 via-fuchsia-500 to-pink-500 shadow-2xl shadow-violet-500/50">
              <Brain className="h-6 w-6 text-white animate-pulse" />
              <div className="absolute inset-0 rounded-xl bg-gradient-to-br from-violet-500 via-fuchsia-500 to-pink-500 opacity-50 blur-xl"></div>
            </div>
            <div>
              <h1 className="text-lg font-bold tracking-tight text-white">
                AI Intelligence Layer
              </h1>
              <p className="text-xs text-violet-300">Next-Gen Learning Platform</p>
            </div>
          </div>
          
          <div className="flex items-center gap-2">
            <Button
              variant="ghost"
              size="sm"
              className="gap-2 text-white hover:bg-white/10"
              onClick={() => setShowNotifications(!showNotifications)}
            >
              <Bell className="h-4 w-4" />
            </Button>
            <Button
              variant="ghost"
              size="sm"
              className="gap-2 text-white hover:bg-white/10"
              onClick={() => setShowChatbot(!showChatbot)}
            >
              <MessageSquare className="h-4 w-4" />
            </Button>
            <Link href="/settings">
              <Button variant="ghost" size="sm" className="gap-2 text-white hover:bg-white/10">
                <Settings className="h-4 w-4" />
              </Button>
            </Link>
            <Link href="/profile">
              <div className="flex h-9 w-9 items-center justify-center rounded-full bg-gradient-to-br from-violet-500 to-fuchsia-500 text-sm font-bold text-white shadow-lg ring-2 ring-violet-400/50">
                {profile.userId.charAt(0).toUpperCase()}
              </div>
            </Link>
          </div>
        </div>
      </header>

      <main className="relative mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
        <div className="mb-8 overflow-hidden rounded-3xl border border-white/10 bg-gradient-to-r from-violet-600/20 via-fuchsia-600/20 to-pink-600/20 p-8 backdrop-blur-xl">
          <div className="flex flex-col gap-6 lg:flex-row lg:items-center lg:justify-between">
            <div className="flex-1">
              <div className="mb-3 flex items-center gap-2">
                <Badge className="gap-1 bg-emerald-500/20 text-emerald-300 border-emerald-500/30">
                  <Sparkles className="h-3 w-3" />
                  AI Active
                </Badge>
                <Badge className="gap-1 bg-violet-500/20 text-violet-300 border-violet-500/30">
                  <Target className="h-3 w-3" />
                  {profile.targetRole}
                </Badge>
              </div>
              <h2 className="text-3xl font-bold text-white lg:text-4xl">
                Welcome back, <span className="text-transparent bg-clip-text bg-gradient-to-r from-violet-400 to-fuchsia-400">{profile.userId}</span>
              </h2>
              <p className="mt-2 text-lg text-slate-300">
                Your AI-powered learning companion is ready
              </p>
              
              {aiInsight && (
                <div className="mt-4 flex items-start gap-2 rounded-xl bg-white/5 p-4 border border-white/10">
                  <Cpu className="h-5 w-5 text-cyan-400 mt-0.5 flex-shrink-0" />
                  <div className="flex-1">
                    <p className="text-sm font-medium text-cyan-300">AI Insight</p>
                    <p className="text-sm text-slate-300">{aiInsight}</p>
                  </div>
                </div>
              )}
            </div>
            
            <div className="flex flex-col gap-3">
              <Button
                size="lg"
                className="gap-2 bg-gradient-to-r from-violet-600 to-fuchsia-600 hover:from-violet-500 hover:to-fuchsia-500 text-white shadow-lg shadow-violet-500/50"
                onClick={() => setVoiceActive(!voiceActive)}
              >
                {voiceActive ? <Volume2 className="h-5 w-5" /> : <Mic className="h-5 w-5" />}
                {voiceActive ? "Voice Active" : "Activate Voice AI"}
              </Button>
              <Link href="/dashboard">
                <Button size="lg" variant="outline" className="w-full gap-2 border-white/20 text-white hover:bg-white/10">
                  <BookOpen className="h-5 w-5" />
                  Go to Dashboard
                </Button>
              </Link>
            </div>
          </div>

          <div className="mt-6 grid grid-cols-2 gap-4 lg:grid-cols-4">
            {quickStats.map((stat, i) => {
              const Icon = stat.icon;
              return (
                <Card key={i} className="border-white/10 bg-white/5 p-4 backdrop-blur">
                  <div className="flex items-center gap-3">
                    <div className={`rounded-lg bg-gradient-to-br p-2 ${stat.color === 'text-emerald-600' ? 'from-emerald-500/20 to-emerald-600/20' : stat.color === 'text-violet-600' ? 'from-violet-500/20 to-violet-600/20' : stat.color === 'text-blue-600' ? 'from-blue-500/20 to-blue-600/20' : 'from-fuchsia-500/20 to-fuchsia-600/20'}`}>
                      <Icon className={`h-5 w-5 ${stat.color}`} />
                    </div>
                    <div>
                      <p className="text-xs text-slate-400">{stat.label}</p>
                      <p className="text-xl font-bold text-white">{stat.value}</p>
                    </div>
                  </div>
                </Card>
              );
            })}
          </div>
        </div>

        <div className="mb-6">
          <div className="flex items-center justify-between mb-4">
            <div>
              <h3 className="text-2xl font-bold text-white">AI-Powered Features</h3>
              <p className="text-sm text-slate-400">Next-generation learning tools</p>
            </div>
            <Badge className="gap-1 bg-fuchsia-500/20 text-fuchsia-300 border-fuchsia-500/30 px-3 py-1">
              <Zap className="h-3 w-3" />
              2025 Edition
            </Badge>
          </div>

          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {aiFeatures.map((feature, i) => {
              const Icon = feature.icon;
              return (
                <Link key={i} href={feature.href}>
                  <Card className="group cursor-pointer overflow-hidden border-white/10 bg-white/5 p-6 backdrop-blur transition-all hover:scale-105 hover:border-white/20 hover:bg-white/10 hover:shadow-2xl hover:shadow-violet-500/20">
                    <div className={`mb-4 inline-flex rounded-xl bg-gradient-to-br ${feature.gradient} p-3 shadow-lg`}>
                      <Icon className="h-6 w-6 text-white" />
                    </div>
                    <h4 className="mb-2 text-lg font-bold text-white">{feature.title}</h4>
                    <p className="text-sm text-slate-400">{feature.desc}</p>
                    <div className="mt-4 flex items-center gap-2 text-sm font-medium text-violet-400 opacity-0 transition-opacity group-hover:opacity-100">
                      Explore <ArrowRight className="h-4 w-4" />
                    </div>
                  </Card>
                </Link>
              );
            })}
          </div>
        </div>

        <Card className="border-white/10 bg-gradient-to-r from-violet-600/10 via-fuchsia-600/10 to-pink-600/10 p-6 backdrop-blur">
          <div className="flex items-start gap-4">
            <div className="rounded-full bg-gradient-to-br from-violet-500 to-fuchsia-500 p-3">
              <TrendingUp className="h-6 w-6 text-white" />
            </div>
            <div className="flex-1">
              <h4 className="text-lg font-bold text-white mb-2">Your Learning Progress</h4>
              <p className="text-sm text-slate-400 mb-4">Currently mastering: React Advanced Patterns</p>
              <Progress value={67} className="h-2 bg-white/10" />
              <div className="mt-2 flex items-center justify-between text-xs text-slate-400">
                <span>67% Complete</span>
                <span>Est. 2 weeks remaining</span>
              </div>
            </div>
            <Link href="/overview">
              <Button variant="ghost" size="sm" className="gap-2 text-white hover:bg-white/10">
                View All <ArrowRight className="h-4 w-4" />
              </Button>
            </Link>
          </div>
        </Card>

        <footer className="mt-12 border-t border-white/10 pt-8">
          <div className="flex flex-col items-center justify-between gap-4 sm:flex-row">
            <div className="flex items-center gap-2 text-sm text-slate-400">
              <Brain className="h-4 w-4 text-violet-400" />
              <span>AI Intelligence Layer v2.0</span>
              <Badge variant="outline" className="border-emerald-500/30 text-emerald-400">2025</Badge>
            </div>
            <div className="flex gap-4 text-xs text-slate-500">
              <Link href="/privacy" className="hover:text-violet-400 transition-colors">Privacy</Link>
              <Link href="/terms" className="hover:text-violet-400 transition-colors">Terms</Link>
              <Link href="/security" className="hover:text-violet-400 transition-colors">Security</Link>
              <Link href="/help" className="hover:text-violet-400 transition-colors">Help</Link>
            </div>
          </div>
        </footer>
      </main>

      {showChatbot && <AIChatbot onClose={() => setShowChatbot(false)} />}
      {showNotifications && <NotificationPanel onClose={() => setShowNotifications(false)} />}
      <DeveloperWatermark />
    </div>
  );
}
