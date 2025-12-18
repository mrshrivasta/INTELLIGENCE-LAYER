"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
  Brain,
  BarChart3,
  Compass,
  FileQuestion,
  Map,
  Settings as SettingsIcon,
  LogOut,
  User,
  Bell,
  MessageSquare,
  GraduationCap,
  Sparkles,
  Shield,
  TrendingUp,
  Calendar,
  Target,
  Zap,
} from "lucide-react";
import { DeveloperWatermark } from "@/components/DeveloperWatermark";
import { AIChatbot } from "@/components/AIChatbot";
import { NotificationPanel } from "@/components/NotificationPanel";
import Link from "next/link";
import { supabase } from "@/lib/supabase/client";
import { useRouter } from "next/navigation";
import { motion } from "framer-motion";

export default function DashboardPage() {
  const router = useRouter();
  const [showNotifications, setShowNotifications] = useState(false);
  const [showChat, setShowChat] = useState(false);

  const handleSignOut = async () => {
    await supabase.auth.signOut();
    router.push("/login");
  };

  const sections = [
    {
      title: "Overview",
      description: "View your profile and recent activity",
      icon: User,
      href: "/overview",
      color: "from-cyan-500 to-blue-600"
    },
    {
      title: "Guidance",
      description: "Get AI-powered learning recommendations",
      icon: Compass,
      href: "/guidance",
      color: "from-violet-500 to-purple-600"
    },
    {
      title: "Assessment",
      description: "Take adaptive tests and quizzes",
      icon: FileQuestion,
      href: "/assessment",
      color: "from-pink-500 to-rose-600"
    },
    {
      title: "Analytics",
      description: "Track your performance and progress",
      icon: BarChart3,
      href: "/analytics",
      color: "from-emerald-500 to-teal-600"
    },
    {
      title: "Roadmap",
      description: "Follow your personalized learning path",
      icon: Map,
      href: "/roadmap",
      color: "from-orange-500 to-red-600"
    },
    {
      title: "Settings",
      description: "Manage your preferences and profile",
      icon: SettingsIcon,
      href: "/settings",
      color: "from-slate-500 to-gray-600"
    },
  ];

  const quickActions = [
    { icon: Calendar, label: "Daily Goals", value: "3/5 completed" },
    { icon: Target, label: "Weekly Target", value: "85%" },
    { icon: Zap, label: "Streak", value: "24 days" },
    { icon: TrendingUp, label: "Progress", value: "+12%" },
  ];

  return (
    <div className="min-h-screen bg-[#0a0a0f] text-white overflow-hidden">
      <div className="fixed inset-0 bg-[radial-gradient(ellipse_at_top_right,_var(--tw-gradient-stops))] from-emerald-900/20 via-transparent to-transparent pointer-events-none" />
      <div className="fixed inset-0 opacity-30 pointer-events-none" style={{backgroundImage: "radial-gradient(circle at 1px 1px, rgba(156, 146, 172, 0.15) 1px, transparent 0)", backgroundSize: "40px 40px"}} />

      <header className="sticky top-0 z-50 border-b border-white/5 bg-[#0a0a0f]/80 backdrop-blur-xl">
        <div className="mx-auto flex h-16 max-w-7xl items-center justify-between px-4 sm:px-6 lg:px-8">
          <Link href="/" className="flex items-center gap-3">
            <div className="relative">
              <div className="absolute inset-0 rounded-xl bg-gradient-to-br from-emerald-500 to-cyan-500 blur-lg opacity-50" />
              <div className="relative flex h-10 w-10 items-center justify-center rounded-xl bg-gradient-to-br from-emerald-500 to-cyan-500">
                <GraduationCap className="h-5 w-5 text-white" />
              </div>
            </div>
            <div>
              <h1 className="text-lg font-bold bg-gradient-to-r from-white to-white/80 bg-clip-text text-transparent">
                Shrivasta AI
              </h1>
              <p className="text-[10px] text-emerald-400/80 font-medium tracking-wide">DASHBOARD</p>
            </div>
          </Link>
          <div className="flex items-center gap-2">
            <Button
              variant="ghost"
              size="sm"
              className="text-white/60 hover:text-white hover:bg-white/5 relative"
              onClick={() => setShowNotifications(!showNotifications)}
            >
              <Bell className="h-4 w-4" />
              <span className="absolute top-1 right-1 h-2 w-2 rounded-full bg-emerald-500 animate-pulse" />
            </Button>
            <Button
              variant="ghost"
              size="sm"
              className="text-white/60 hover:text-white hover:bg-white/5"
              onClick={() => setShowChat(!showChat)}
            >
              <MessageSquare className="h-4 w-4" />
            </Button>
            <Button 
              variant="ghost" 
              size="sm" 
              className="text-white/60 hover:text-white hover:bg-white/5" 
              onClick={handleSignOut}
            >
              <LogOut className="h-4 w-4" />
            </Button>
          </div>
        </div>
      </header>

      <main className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8 relative">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="mb-8"
        >
          <div className="flex items-center gap-2 mb-2">
            <h2 className="text-3xl font-bold text-white">Welcome Back!</h2>
            <Badge className="bg-emerald-500/10 text-emerald-400 border-emerald-500/20">
              <Shield className="h-3 w-3 mr-1" />
              Secure
            </Badge>
          </div>
          <p className="text-lg text-white/60">
            Choose a section to continue your learning journey
          </p>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-8"
        >
          {quickActions.map((action, i) => {
            const Icon = action.icon;
            return (
              <div key={i} className="rounded-xl border border-white/5 bg-[#111827]/50 backdrop-blur-sm p-4 flex items-center gap-3">
                <div className="h-10 w-10 rounded-lg bg-emerald-500/10 flex items-center justify-center">
                  <Icon className="h-5 w-5 text-emerald-400" />
                </div>
                <div>
                  <p className="text-xs text-white/50">{action.label}</p>
                  <p className="text-sm font-bold text-white">{action.value}</p>
                </div>
              </div>
            );
          })}
        </motion.div>

        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3 mb-8">
          {sections.map((section, index) => {
            const Icon = section.icon;
            return (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.2 + index * 0.1 }}
              >
                <Link href={section.href}>
                  <div className="group h-full rounded-2xl border border-white/5 bg-[#111827]/50 backdrop-blur-sm p-6 transition-all hover:border-white/10 hover:bg-[#111827]/80 hover:shadow-lg hover:shadow-emerald-500/5">
                    <div className={`mb-4 inline-flex h-12 w-12 items-center justify-center rounded-xl bg-gradient-to-br ${section.color} shadow-lg transition-transform group-hover:scale-110 group-hover:rotate-3`}>
                      <Icon className="h-6 w-6 text-white" />
                    </div>
                    <h3 className="mb-2 text-xl font-bold text-white group-hover:text-emerald-400 transition-colors">{section.title}</h3>
                    <p className="text-sm text-white/50">{section.description}</p>
                  </div>
                </Link>
              </motion.div>
            );
          })}
        </div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.6 }}
          className="rounded-2xl bg-gradient-to-r from-emerald-600/90 to-cyan-600/90 p-6 text-white shadow-xl shadow-emerald-500/10 border border-white/10"
        >
          <div className="flex flex-col items-center gap-4 sm:flex-row sm:justify-between">
            <div className="flex items-center gap-4">
              <div className="h-12 w-12 rounded-xl bg-white/10 flex items-center justify-center">
                <Sparkles className="h-6 w-6" />
              </div>
              <div>
                <h3 className="mb-1 text-xl font-bold">Need Help?</h3>
                <p className="text-sm text-white/80">
                  Access our AI assistant or browse the help center
                </p>
              </div>
            </div>
            <div className="flex gap-2">
              <Button 
                size="sm" 
                className="bg-white text-emerald-600 hover:bg-white/90 font-semibold"
                onClick={() => setShowChat(true)}
              >
                <MessageSquare className="mr-2 h-4 w-4" />
                Ask AI
              </Button>
              <Link href="/help">
                <Button variant="outline" size="sm" className="border-white/20 bg-white/10 text-white hover:bg-white/20">
                  Help Center
                </Button>
              </Link>
            </div>
          </div>
        </motion.div>
      </main>

      {showNotifications && <NotificationPanel onClose={() => setShowNotifications(false)} />}
      {showChat && <AIChatbot onClose={() => setShowChat(false)} />}
      <DeveloperWatermark />
    </div>
  );
}
