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
    <div className="min-h-screen bg-gradient-to-br from-gray-50 via-purple-50/30 to-gray-50">
      <header className="sticky top-0 z-50 border-b border-gray-200 bg-white/80 backdrop-blur-xl">
        <div className="mx-auto flex h-16 max-w-7xl items-center justify-between px-6 lg:px-8">
          <div className="flex items-center gap-3">
            <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-gradient-to-br from-purple-600 to-purple-700 shadow-sm">
              <Brain className="h-5 w-5 text-white" />
            </div>
            <div>
              <h1 className="text-base font-bold tracking-tight text-gray-900">
                AI Intelligence Layer
              </h1>
            </div>
          </div>
          
          <div className="flex items-center gap-2">
            <Button
              variant="ghost"
              size="sm"
              className="gap-2 text-gray-600 hover:text-gray-900 hover:bg-gray-100"
              onClick={() => setShowNotifications(!showNotifications)}
            >
              <Bell className="h-4 w-4" />
            </Button>
            <Button
              variant="ghost"
              size="sm"
              className="gap-2 text-gray-600 hover:text-gray-900 hover:bg-gray-100"
              onClick={() => setShowChatbot(!showChatbot)}
            >
              <MessageSquare className="h-4 w-4" />
            </Button>
            <Link href="/settings">
              <Button variant="ghost" size="sm" className="gap-2 text-gray-600 hover:text-gray-900 hover:bg-gray-100">
                <Settings className="h-4 w-4" />
              </Button>
            </Link>
            <Link href="/profile">
              <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-purple-100 text-sm font-semibold text-purple-700 hover:bg-purple-200 transition-all cursor-pointer">
                {profile.userId.charAt(0).toUpperCase()}
              </div>
            </Link>
          </div>
        </div>
      </header>

      <main className="relative mx-auto max-w-7xl px-6 py-8 lg:px-8">
        {/* Hero section */}
        <div className="mb-8 overflow-hidden rounded-2xl border border-gray-200 bg-white p-8 shadow-sm">
          <div className="flex flex-col gap-6 lg:flex-row lg:items-center lg:justify-between">
            <div className="flex-1">
              <div className="mb-4 flex items-center gap-2">
                <Badge className="gap-1.5 bg-emerald-50 text-emerald-700 border-emerald-200 px-2.5 py-0.5 text-xs font-medium">
                  <Sparkles className="h-3 w-3" />
                  AI Active
                </Badge>
                <Badge className="gap-1.5 bg-purple-50 text-purple-700 border-purple-200 px-2.5 py-0.5 text-xs font-medium">
                  <Target className="h-3 w-3" />
                  {profile.targetRole}
                </Badge>
              </div>
              <h2 className="text-3xl font-bold text-gray-900 lg:text-4xl mb-2">
                Welcome back, {profile.userId}
              </h2>
              <p className="text-base text-gray-600">
                Your AI-powered learning companion is ready to accelerate your growth
              </p>
              
              {aiInsight && (
                <div className="mt-4 flex items-start gap-3 rounded-xl bg-blue-50 p-4 border border-blue-100">
                  <Cpu className="h-5 w-5 text-blue-600 mt-0.5 flex-shrink-0" />
                  <div className="flex-1">
                    <p className="text-xs font-semibold text-blue-900 mb-0.5">AI Insight</p>
                    <p className="text-sm text-gray-700">{aiInsight}</p>
                  </div>
                </div>
              )}
            </div>
            
            <div className="flex flex-col gap-3">
              <Button
                size="default"
                className="gap-2 bg-purple-600 hover:bg-purple-700 text-white px-6"
                onClick={() => setVoiceActive(!voiceActive)}
              >
                {voiceActive ? <Volume2 className="h-4 w-4" /> : <Mic className="h-4 w-4" />}
                {voiceActive ? "Voice Active" : "Activate Voice AI"}
              </Button>
              <Link href="/dashboard">
                <Button size="default" variant="outline" className="w-full gap-2 border-gray-300 text-gray-700 hover:bg-gray-50 px-6">
                  <BookOpen className="h-4 w-4" />
                  Go to Dashboard
                </Button>
              </Link>
            </div>
          </div>

          <div className="mt-6 grid grid-cols-2 gap-4 lg:grid-cols-4">
            {quickStats.map((stat, i) => {
              const Icon = stat.icon;
              return (
                <Card key={i} className="border-gray-200 bg-gray-50 p-4 hover:shadow-md transition-shadow">
                  <div className="flex items-center gap-3">
                    <div className={`rounded-lg p-2 ${stat.color === 'text-emerald-600' ? 'bg-emerald-100' : stat.color === 'text-violet-600' ? 'bg-purple-100' : stat.color === 'text-blue-600' ? 'bg-blue-100' : 'bg-pink-100'}`}>
                      <Icon className={`h-5 w-5 ${stat.color}`} />
                    </div>
                    <div>
                      <p className="text-xs text-gray-600">{stat.label}</p>
                      <p className="text-xl font-bold text-gray-900">{stat.value}</p>
                    </div>
                  </div>
                </Card>
              );
            })}
          </div>
        </div>

        {/* AI Features */}
        <div className="mb-8">
          <div className="flex items-center justify-between mb-5">
            <div>
              <h3 className="text-2xl font-bold text-gray-900 mb-1">AI-Powered Features</h3>
              <p className="text-sm text-gray-600">Revolutionary learning tools powered by advanced AI</p>
            </div>
          </div>

          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {aiFeatures.map((feature, i) => {
              const Icon = feature.icon;
              return (
                <Link key={i} href={feature.href}>
                  <Card className="group cursor-pointer overflow-hidden border-gray-200 bg-white p-6 transition-all hover:shadow-lg">
                    <div className="mb-4 inline-flex rounded-xl bg-purple-100 p-3">
                      <Icon className="h-6 w-6 text-purple-600" />
                    </div>
                    <h4 className="mb-2 text-lg font-semibold text-gray-900">{feature.title}</h4>
                    <p className="text-sm text-gray-600 mb-3">{feature.desc}</p>
                    <div className="flex items-center gap-1.5 text-sm font-medium text-purple-600 opacity-0 transition-opacity group-hover:opacity-100">
                      Explore Now <ArrowRight className="h-4 w-4" />
                    </div>
                  </Card>
                </Link>
              );
            })}
          </div>
        </div>

        {/* Progress card */}
        <Card className="border-gray-200 bg-white p-6 shadow-sm mb-8">
          <div className="flex items-start gap-5">
            <div className="rounded-xl bg-purple-100 p-3">
              <TrendingUp className="h-6 w-6 text-purple-600" />
            </div>
            <div className="flex-1">
              <h4 className="text-xl font-semibold text-gray-900 mb-2">Your Learning Progress</h4>
              <p className="text-sm text-gray-600 mb-4">Currently mastering: React Advanced Patterns</p>
              <Progress value={67} className="h-2 bg-gray-100" />
              <div className="mt-2 flex items-center justify-between text-xs text-gray-500">
                <span>67% Complete</span>
                <span>Est. 2 weeks remaining</span>
              </div>
            </div>
            <Link href="/overview">
              <Button variant="ghost" size="sm" className="gap-2 text-purple-600 hover:text-purple-700 hover:bg-purple-50">
                View All <ArrowRight className="h-4 w-4" />
              </Button>
            </Link>
          </div>
        </Card>

        {/* All Pages Directory */}
        <div className="mt-12 border-t border-gray-200 pt-8">
          <div className="mb-6 text-center">
            <h3 className="text-2xl font-bold text-gray-900 mb-2">Platform Directory</h3>
            <p className="text-sm text-gray-600">Explore all pages and features available in the platform</p>
          </div>

          <div className="space-y-6">
            {categories.map((category) => {
              const pagesInCategory = allPages.filter(p => p.category === category);
              if (pagesInCategory.length === 0) return null;

              return (
                <div key={category}>
                  <h4 className="text-base font-semibold text-gray-900 mb-3 flex items-center gap-2">
                    <div className="h-1 w-1 rounded-full bg-purple-600"></div>
                    {category}
                  </h4>
                  <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
                    {pagesInCategory.map((page, i) => {
                      const Icon = page.icon;
                      return (
                        <Link key={i} href={page.href}>
                          <Card className="group cursor-pointer border-gray-200 bg-white p-4 transition-all hover:shadow-md">
                            <div className="flex items-center gap-3">
                              <div className="rounded-lg bg-gray-100 p-2 group-hover:bg-purple-100 transition-colors">
                                <Icon className="h-4 w-4 text-gray-600 group-hover:text-purple-600 transition-colors" />
                              </div>
                              <div className="flex-1">
                                <p className="text-sm font-medium text-gray-900 group-hover:text-purple-600 transition-colors">{page.name}</p>
                              </div>
                              <ArrowRight className="h-4 w-4 text-gray-400 group-hover:text-purple-600 transition-colors" />
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
        <footer className="mt-12 border-t border-gray-200 pt-8">
          <div className="flex flex-col items-center justify-between gap-4 sm:flex-row">
            <div className="flex items-center gap-2 text-sm text-gray-600">
              <Brain className="h-4 w-4 text-purple-600" />
              <span>AI Intelligence Layer v2.0</span>
            </div>
            <div className="flex gap-5 text-sm text-gray-600">
              <Link href="/privacy" className="hover:text-purple-600 transition-colors">Privacy</Link>
              <Link href="/terms" className="hover:text-purple-600 transition-colors">Terms</Link>
              <Link href="/security" className="hover:text-purple-600 transition-colors">Security</Link>
              <Link href="/help" className="hover:text-purple-600 transition-colors">Help</Link>
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
