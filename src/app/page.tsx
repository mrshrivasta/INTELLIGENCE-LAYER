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
  Users,
  HelpCircle,
  Mail,
  Home,
  Info,
  Lock,
  UserPlus,
  LogIn,
  Cookie,
  LayoutDashboard,
  Star,
  CheckCircle,
  Activity,
  Network,
  Briefcase,
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

  const allPages = [
    { name: "Home", href: "/", icon: Home, category: "Main" },
    { name: "Dashboard", href: "/dashboard", icon: LayoutDashboard, category: "Main" },
    { name: "Overview", href: "/overview", icon: Activity, category: "Learning" },
    { name: "Analytics", href: "/analytics", icon: BarChart3, category: "Learning" },
    { name: "Assessment", href: "/assessment", icon: FileQuestion, category: "Learning" },
    { name: "Guidance", href: "/guidance", icon: Compass, category: "Learning" },
    { name: "Roadmap", href: "/roadmap", icon: Map, category: "Learning" },
    { name: "Features", href: "/features", icon: Star, category: "Info" },
    { name: "About", href: "/about", icon: Info, category: "Info" },
    { name: "How It Works", href: "/how-it-works", icon: CheckCircle, category: "Info" },
    { name: "Contact", href: "/contact", icon: Mail, category: "Info" },
    { name: "Help", href: "/help", icon: HelpCircle, category: "Support" },
    { name: "FAQ", href: "/help", icon: MessageSquare, category: "Support" },
    { name: "Profile", href: "/profile", icon: Users, category: "Account" },
    { name: "Settings", href: "/settings", icon: Settings, category: "Account" },
    { name: "Onboarding", href: "/onboarding", icon: Target, category: "Account" },
    { name: "Login", href: "/login", icon: LogIn, category: "Auth" },
    { name: "Sign Up", href: "/signup", icon: UserPlus, category: "Auth" },
    { name: "Forgot Password", href: "/forgot-password", icon: Lock, category: "Auth" },
    { name: "Verify Email", href: "/verify-email", icon: Mail, category: "Auth" },
    { name: "Privacy Policy", href: "/privacy", icon: Shield, category: "Legal" },
    { name: "Terms & Conditions", href: "/terms", icon: FileQuestion, category: "Legal" },
    { name: "Cookie Policy", href: "/cookies", icon: Cookie, category: "Legal" },
    { name: "Security", href: "/security", icon: Lock, category: "Legal" },
    { name: "Admin", href: "/admin", icon: Briefcase, category: "Admin" },
  ];

  const categories = ["Main", "Learning", "Info", "Support", "Account", "Auth", "Legal", "Admin"];

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-950 via-indigo-950 to-slate-950 relative overflow-hidden">
      {/* Animated background effects */}
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top,_var(--tw-gradient-stops))] from-violet-900/20 via-transparent to-transparent"></div>
      <div className="absolute inset-0 bg-[url('/grid.svg')] opacity-10"></div>
      <div className="absolute top-0 left-1/4 w-96 h-96 bg-violet-500/10 rounded-full blur-3xl animate-pulse"></div>
      <div className="absolute bottom-0 right-1/4 w-96 h-96 bg-fuchsia-500/10 rounded-full blur-3xl animate-pulse delay-700"></div>
      
      <header className="sticky top-0 z-50 border-b border-white/5 bg-slate-950/60 backdrop-blur-2xl">
        <div className="mx-auto flex h-20 max-w-7xl items-center justify-between px-6 lg:px-8">
          <div className="flex items-center gap-4">
            <div className="relative flex h-12 w-12 items-center justify-center rounded-2xl bg-gradient-to-br from-violet-600 via-fuchsia-600 to-pink-600 shadow-2xl shadow-violet-500/50">
              <Brain className="h-7 w-7 text-white animate-pulse" />
              <div className="absolute inset-0 rounded-2xl bg-gradient-to-br from-violet-600 via-fuchsia-600 to-pink-600 opacity-40 blur-2xl"></div>
            </div>
            <div>
              <h1 className="text-xl font-black tracking-tight text-white">
                AI Intelligence Layer
              </h1>
              <p className="text-xs font-medium text-violet-300">Advanced Learning Platform 2025</p>
            </div>
          </div>
          
          <div className="flex items-center gap-3">
            <Button
              variant="ghost"
              size="sm"
              className="gap-2 text-white hover:bg-white/10 hover:text-violet-300 transition-all"
              onClick={() => setShowNotifications(!showNotifications)}
            >
              <Bell className="h-5 w-5" />
            </Button>
            <Button
              variant="ghost"
              size="sm"
              className="gap-2 text-white hover:bg-white/10 hover:text-violet-300 transition-all"
              onClick={() => setShowChatbot(!showChatbot)}
            >
              <MessageSquare className="h-5 w-5" />
            </Button>
            <Link href="/settings">
              <Button variant="ghost" size="sm" className="gap-2 text-white hover:bg-white/10 hover:text-violet-300 transition-all">
                <Settings className="h-5 w-5" />
              </Button>
            </Link>
            <Link href="/profile">
              <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-gradient-to-br from-violet-600 to-fuchsia-600 text-base font-black text-white shadow-xl ring-2 ring-violet-400/30 hover:ring-violet-400/60 transition-all cursor-pointer">
                {profile.userId.charAt(0).toUpperCase()}
              </div>
            </Link>
          </div>
        </div>
      </header>

      <main className="relative mx-auto max-w-7xl px-6 py-12 lg:px-8">
        {/* Hero section */}
        <div className="mb-12 overflow-hidden rounded-3xl border border-white/10 bg-gradient-to-r from-violet-600/10 via-fuchsia-600/10 to-pink-600/10 p-10 backdrop-blur-2xl shadow-2xl">
          <div className="flex flex-col gap-8 lg:flex-row lg:items-center lg:justify-between">
            <div className="flex-1">
              <div className="mb-4 flex items-center gap-3">
                <Badge className="gap-1.5 bg-emerald-500/20 text-emerald-300 border-emerald-500/40 px-3 py-1 text-xs font-semibold">
                  <Sparkles className="h-3.5 w-3.5" />
                  AI Active
                </Badge>
                <Badge className="gap-1.5 bg-violet-500/20 text-violet-300 border-violet-500/40 px-3 py-1 text-xs font-semibold">
                  <Target className="h-3.5 w-3.5" />
                  {profile.targetRole}
                </Badge>
                <Badge className="gap-1.5 bg-blue-500/20 text-blue-300 border-blue-500/40 px-3 py-1 text-xs font-semibold">
                  <Network className="h-3.5 w-3.5" />
                  Connected
                </Badge>
              </div>
              <h2 className="text-4xl font-black text-white lg:text-5xl mb-3">
                Welcome back, <span className="text-transparent bg-clip-text bg-gradient-to-r from-violet-400 via-fuchsia-400 to-pink-400">{profile.userId}</span>
              </h2>
              <p className="text-xl text-slate-300 font-medium">
                Your AI-powered learning companion is ready to accelerate your growth
              </p>
              
              {aiInsight && (
                <div className="mt-6 flex items-start gap-3 rounded-2xl bg-gradient-to-r from-cyan-500/10 to-blue-500/10 p-5 border border-cyan-500/20 shadow-lg">
                  <Cpu className="h-6 w-6 text-cyan-400 mt-0.5 flex-shrink-0 animate-pulse" />
                  <div className="flex-1">
                    <p className="text-sm font-bold text-cyan-300 mb-1">AI Insight</p>
                    <p className="text-base text-slate-200 font-medium">{aiInsight}</p>
                  </div>
                </div>
              )}
            </div>
            
            <div className="flex flex-col gap-4">
              <Button
                size="lg"
                className="gap-2 bg-gradient-to-r from-violet-600 to-fuchsia-600 hover:from-violet-500 hover:to-fuchsia-500 text-white shadow-2xl shadow-violet-500/50 px-8 py-6 text-base font-bold transition-all hover:scale-105"
                onClick={() => setVoiceActive(!voiceActive)}
              >
                {voiceActive ? <Volume2 className="h-6 w-6" /> : <Mic className="h-6 w-6" />}
                {voiceActive ? "Voice Active" : "Activate Voice AI"}
              </Button>
              <Link href="/dashboard">
                <Button size="lg" variant="outline" className="w-full gap-2 border-white/30 text-white hover:bg-white/10 px-8 py-6 text-base font-bold transition-all hover:scale-105">
                  <BookOpen className="h-6 w-6" />
                  Go to Dashboard
                </Button>
              </Link>
            </div>
          </div>

          <div className="mt-8 grid grid-cols-2 gap-5 lg:grid-cols-4">
            {quickStats.map((stat, i) => {
              const Icon = stat.icon;
              return (
                <Card key={i} className="border-white/10 bg-gradient-to-br from-white/5 to-white/10 p-5 backdrop-blur-xl shadow-lg hover:shadow-2xl transition-all hover:scale-105">
                  <div className="flex items-center gap-4">
                    <div className={`rounded-xl bg-gradient-to-br p-3 shadow-lg ${stat.color === 'text-emerald-600' ? 'from-emerald-500/20 to-emerald-600/30' : stat.color === 'text-violet-600' ? 'from-violet-500/20 to-violet-600/30' : stat.color === 'text-blue-600' ? 'from-blue-500/20 to-blue-600/30' : 'from-fuchsia-500/20 to-fuchsia-600/30'}`}>
                      <Icon className={`h-6 w-6 ${stat.color}`} />
                    </div>
                    <div>
                      <p className="text-xs text-slate-400 font-medium">{stat.label}</p>
                      <p className="text-2xl font-black text-white">{stat.value}</p>
                    </div>
                  </div>
                </Card>
              );
            })}
          </div>
        </div>

        {/* AI Features */}
        <div className="mb-12">
          <div className="flex items-center justify-between mb-6">
            <div>
              <h3 className="text-3xl font-black text-white mb-2">AI-Powered Features</h3>
              <p className="text-base text-slate-400 font-medium">Revolutionary learning tools powered by advanced AI</p>
            </div>
            <Badge className="gap-1.5 bg-fuchsia-500/20 text-fuchsia-300 border-fuchsia-500/40 px-4 py-2 text-sm font-bold">
              <Zap className="h-4 w-4" />
              2025 Edition
            </Badge>
          </div>

          <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {aiFeatures.map((feature, i) => {
              const Icon = feature.icon;
              return (
                <Link key={i} href={feature.href}>
                  <Card className="group cursor-pointer overflow-hidden border-white/10 bg-gradient-to-br from-white/5 to-white/10 p-8 backdrop-blur-xl transition-all hover:scale-105 hover:border-white/30 hover:bg-white/15 hover:shadow-2xl hover:shadow-violet-500/30">
                    <div className={`mb-5 inline-flex rounded-2xl bg-gradient-to-br ${feature.gradient} p-4 shadow-2xl group-hover:scale-110 transition-transform`}>
                      <Icon className="h-7 w-7 text-white" />
                    </div>
                    <h4 className="mb-3 text-xl font-black text-white">{feature.title}</h4>
                    <p className="text-sm text-slate-400 font-medium mb-4">{feature.desc}</p>
                    <div className="flex items-center gap-2 text-sm font-bold text-violet-400 opacity-0 transition-opacity group-hover:opacity-100">
                      Explore Now <ArrowRight className="h-4 w-4" />
                    </div>
                  </Card>
                </Link>
              );
            })}
          </div>
        </div>

        {/* Progress card */}
        <Card className="border-white/10 bg-gradient-to-r from-violet-600/10 via-fuchsia-600/10 to-pink-600/10 p-8 backdrop-blur-xl shadow-xl mb-12">
          <div className="flex items-start gap-6">
            <div className="rounded-2xl bg-gradient-to-br from-violet-600 to-fuchsia-600 p-4 shadow-2xl">
              <TrendingUp className="h-8 w-8 text-white" />
            </div>
            <div className="flex-1">
              <h4 className="text-2xl font-black text-white mb-3">Your Learning Progress</h4>
              <p className="text-base text-slate-300 mb-5 font-medium">Currently mastering: React Advanced Patterns</p>
              <Progress value={67} className="h-3 bg-white/10" />
              <div className="mt-3 flex items-center justify-between text-sm text-slate-400 font-medium">
                <span>67% Complete</span>
                <span>Est. 2 weeks remaining</span>
              </div>
            </div>
            <Link href="/overview">
              <Button variant="ghost" size="sm" className="gap-2 text-white hover:bg-white/10 font-bold">
                View All <ArrowRight className="h-5 w-5" />
              </Button>
            </Link>
          </div>
        </Card>

        {/* All Pages Directory */}
        <div className="mt-16 border-t border-white/10 pt-12">
          <div className="mb-8 text-center">
            <h3 className="text-3xl font-black text-white mb-3">Platform Directory</h3>
            <p className="text-base text-slate-400 font-medium">Explore all pages and features available in the platform</p>
          </div>

          <div className="space-y-8">
            {categories.map((category) => {
              const pagesInCategory = allPages.filter(p => p.category === category);
              if (pagesInCategory.length === 0) return null;

              return (
                <div key={category}>
                  <h4 className="text-xl font-black text-white mb-4 flex items-center gap-2">
                    <div className="h-1.5 w-1.5 rounded-full bg-gradient-to-r from-violet-500 to-fuchsia-500"></div>
                    {category}
                  </h4>
                  <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
                    {pagesInCategory.map((page, i) => {
                      const Icon = page.icon;
                      return (
                        <Link key={i} href={page.href}>
                          <Card className="group cursor-pointer border-white/10 bg-gradient-to-br from-white/5 to-white/10 p-5 backdrop-blur-xl transition-all hover:scale-105 hover:border-white/30 hover:bg-white/15 hover:shadow-xl hover:shadow-violet-500/20">
                            <div className="flex items-center gap-3">
                              <div className="rounded-lg bg-gradient-to-br from-violet-500/20 to-fuchsia-500/20 p-2.5 group-hover:from-violet-500/30 group-hover:to-fuchsia-500/30 transition-all">
                                <Icon className="h-5 w-5 text-violet-400" />
                              </div>
                              <div className="flex-1">
                                <p className="text-sm font-bold text-white group-hover:text-violet-300 transition-colors">{page.name}</p>
                              </div>
                              <ArrowRight className="h-4 w-4 text-slate-500 group-hover:text-violet-400 transition-colors" />
                            </div>
                          </Card>
                        </Link>
                      );
                    })}
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Footer */}
        <footer className="mt-16 border-t border-white/10 pt-10">
          <div className="flex flex-col items-center justify-between gap-6 sm:flex-row">
            <div className="flex items-center gap-3 text-sm text-slate-400 font-medium">
              <Brain className="h-5 w-5 text-violet-400" />
              <span>AI Intelligence Layer v2.0</span>
              <Badge variant="outline" className="border-emerald-500/40 text-emerald-400 font-bold">2025</Badge>
            </div>
            <div className="flex gap-6 text-sm text-slate-500 font-medium">
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
