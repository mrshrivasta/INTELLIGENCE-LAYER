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
    <div className="min-h-screen bg-white">
      <header className="sticky top-0 z-50 border-b bg-white">
        <div className="mx-auto flex h-16 max-w-7xl items-center justify-between px-6 lg:px-8">
          <div className="flex items-center gap-3">
            <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-purple-600">
              <Brain className="h-5 w-5 text-white" />
            </div>
            <div>
              <h1 className="text-base font-semibold text-gray-900">
                AI Intelligence Layer
              </h1>
            </div>
          </div>
          
          <div className="flex items-center gap-3">
            <Button
              variant="ghost"
              size="sm"
              className="text-gray-600 hover:text-gray-900"
              onClick={() => setShowNotifications(!showNotifications)}
            >
              <Bell className="h-4 w-4" />
            </Button>
            <Button
              variant="ghost"
              size="sm"
              className="text-gray-600 hover:text-gray-900"
              onClick={() => setShowChatbot(!showChatbot)}
            >
              <MessageSquare className="h-4 w-4" />
            </Button>
            <Link href="/settings">
              <Button variant="ghost" size="sm" className="text-gray-600 hover:text-gray-900">
                <Settings className="h-4 w-4" />
              </Button>
            </Link>
            <Link href="/profile">
              <div className="flex h-8 w-8 items-center justify-center rounded-full bg-gray-900 text-xs font-medium text-white cursor-pointer">
                {profile.userId.charAt(0).toUpperCase()}
              </div>
            </Link>
          </div>
        </div>
      </header>

      <main className="relative mx-auto max-w-7xl px-6 py-12 lg:px-8">
        {/* Hero section */}
        <div className="mb-12">
          <div className="mb-6">
            <div className="mb-3 flex items-center gap-2">
              <Badge className="rounded-md bg-gray-100 px-2 py-1 text-xs font-normal text-gray-700 border-0">
                {profile.targetRole}
              </Badge>
              <Badge className="rounded-md bg-gray-100 px-2 py-1 text-xs font-normal text-gray-700 border-0">
                AI Active
              </Badge>
            </div>
            <h2 className="text-4xl font-semibold text-gray-900 mb-3">
              Welcome back, {profile.userId}
            </h2>
            <p className="text-lg text-gray-600">
              Track your progress and explore learning tools
            </p>
          </div>

          <div className="grid grid-cols-2 gap-4 lg:grid-cols-4 mb-8">
            {quickStats.map((stat, i) => {
              const Icon = stat.icon;
              return (
                <div key={i} className="border rounded-lg p-5 bg-white hover:border-gray-900 transition-colors">
                  <div className="flex items-center justify-between mb-3">
                    <Icon className="h-5 w-5 text-gray-400" />
                  </div>
                  <p className="text-2xl font-semibold text-gray-900 mb-1">{stat.value}</p>
                  <p className="text-sm text-gray-600">{stat.label}</p>
                </div>
              );
            })}
          </div>

          <div className="flex flex-col sm:flex-row gap-3">
            <Link href="/dashboard" className="flex-1">
              <Button size="lg" className="w-full bg-gray-900 hover:bg-gray-800 text-white">
                Go to Dashboard
                <ArrowRight className="ml-2 h-4 w-4" />
              </Button>
            </Link>
            <Button
              size="lg"
              variant="outline"
              className="flex-1 border-gray-300 hover:bg-gray-50"
              onClick={() => setVoiceActive(!voiceActive)}
            >
              {voiceActive ? <Volume2 className="mr-2 h-4 w-4" /> : <Mic className="mr-2 h-4 w-4" />}
              {voiceActive ? "Voice Active" : "Voice Assistant"}
            </Button>
          </div>
        </div>

        {/* AI Features */}
        <div className="mb-12">
          <div className="mb-6">
            <h3 className="text-2xl font-semibold text-gray-900 mb-2">Features</h3>
            <p className="text-base text-gray-600">Explore AI-powered learning tools</p>
          </div>

          <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
            {aiFeatures.map((feature, i) => {
              const Icon = feature.icon;
              return (
                <Link key={i} href={feature.href}>
                  <div className="group border rounded-lg p-6 bg-white hover:border-gray-900 transition-colors">
                    <Icon className="h-6 w-6 text-gray-900 mb-4" />
                    <h4 className="text-base font-semibold text-gray-900 mb-2">{feature.title}</h4>
                    <p className="text-sm text-gray-600">{feature.desc}</p>
                  </div>
                </Link>
              );
            })}
          </div>
        </div>

        {/* Progress card */}
        <div className="border rounded-lg p-6 bg-white mb-12">
          <div className="flex items-start justify-between mb-4">
            <div>
              <h4 className="text-lg font-semibold text-gray-900 mb-1">Current Progress</h4>
              <p className="text-sm text-gray-600">React Advanced Patterns</p>
            </div>
            <Link href="/overview">
              <Button variant="ghost" size="sm" className="text-gray-600 hover:text-gray-900">
                View All <ArrowRight className="ml-1 h-4 w-4" />
              </Button>
            </Link>
          </div>
          <Progress value={67} className="h-2 bg-gray-100 mb-2" />
          <div className="flex items-center justify-between text-xs text-gray-500">
            <span>67% Complete</span>
            <span>2 weeks remaining</span>
          </div>
        </div>

        {/* All Pages Directory */}
        <div className="border-t pt-12">
          <div className="mb-8">
            <h3 className="text-2xl font-semibold text-gray-900 mb-2">All Pages</h3>
            <p className="text-base text-gray-600">Navigate to any section of the platform</p>
          </div>

          <div className="space-y-8">
            {categories.map((category) => {
              const pagesInCategory = allPages.filter(p => p.category === category);
              if (pagesInCategory.length === 0) return null;

              return (
                <div key={category}>
                  <h4 className="text-sm font-semibold text-gray-900 mb-3 uppercase tracking-wide">
                    {category}
                  </h4>
                  <div className="grid gap-2 sm:grid-cols-2 lg:grid-cols-4">
                    {pagesInCategory.map((page, i) => {
                      const Icon = page.icon;
                      return (
                        <Link key={i} href={page.href}>
                          <div className="group flex items-center gap-3 border rounded-lg p-3 bg-white hover:border-gray-900 transition-colors">
                            <Icon className="h-4 w-4 text-gray-400 flex-shrink-0" />
                            <p className="text-sm font-medium text-gray-700 group-hover:text-gray-900">{page.name}</p>
                          </div>
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
        <footer className="mt-16 border-t pt-8 pb-8">
          <div className="flex flex-col items-center justify-between gap-4 sm:flex-row">
            <div className="flex items-center gap-2 text-sm text-gray-600">
              <span>© 2025 AI Intelligence Layer</span>
            </div>
            <div className="flex gap-6 text-sm text-gray-600">
              <Link href="/privacy" className="hover:text-gray-900 transition-colors">Privacy</Link>
              <Link href="/terms" className="hover:text-gray-900 transition-colors">Terms</Link>
              <Link href="/security" className="hover:text-gray-900 transition-colors">Security</Link>
              <Link href="/help" className="hover:text-gray-900 transition-colors">Help</Link>
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
