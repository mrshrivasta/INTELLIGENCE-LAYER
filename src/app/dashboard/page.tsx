"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
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
  MessageSquare
} from "lucide-react";
import { DeveloperWatermark } from "@/components/DeveloperWatermark";
import { AIChatbot } from "@/components/AIChatbot";
import { NotificationPanel } from "@/components/NotificationPanel";
import Link from "next/link";
import { supabase } from "@/lib/supabase/client";
import { useRouter } from "next/navigation";

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
      color: "from-blue-500 to-cyan-500"
    },
    {
      title: "Guidance",
      description: "Get AI-powered learning recommendations",
      icon: Compass,
      href: "/guidance",
      color: "from-violet-500 to-purple-500"
    },
    {
      title: "Assessment",
      description: "Take adaptive tests and quizzes",
      icon: FileQuestion,
      href: "/assessment",
      color: "from-fuchsia-500 to-pink-500"
    },
    {
      title: "Analytics",
      description: "Track your performance and progress",
      icon: BarChart3,
      href: "/analytics",
      color: "from-green-500 to-emerald-500"
    },
    {
      title: "Roadmap",
      description: "Follow your personalized learning path",
      icon: Map,
      href: "/roadmap",
      color: "from-orange-500 to-red-500"
    },
    {
      title: "Settings",
      description: "Manage your preferences and profile",
      icon: SettingsIcon,
      href: "/settings",
      color: "from-slate-500 to-gray-500"
    },
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-violet-50/30 to-slate-50">
      <header className="sticky top-0 z-50 border-b border-slate-200/80 bg-white/80 backdrop-blur-lg">
        <div className="mx-auto flex h-16 max-w-7xl items-center justify-between px-4 sm:px-6 lg:px-8">
          <Link href="/" className="flex items-center gap-3">
            <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-gradient-to-br from-violet-600 to-fuchsia-600 shadow-lg">
              <Brain className="h-6 w-6 text-white" />
            </div>
            <div>
              <h1 className="text-lg font-bold tracking-tight text-slate-900">
                Student Dashboard
              </h1>
              <p className="text-xs text-slate-500">Your Learning Hub</p>
            </div>
          </Link>
          <div className="flex items-center gap-2">
            <Button
              variant="outline"
              size="sm"
              className="gap-2"
              onClick={() => setShowNotifications(!showNotifications)}
            >
              <Bell className="h-4 w-4" />
              <span className="hidden sm:inline">Notifications</span>
            </Button>
            <Button
              variant="outline"
              size="sm"
              className="gap-2"
              onClick={() => setShowChat(!showChat)}
            >
              <MessageSquare className="h-4 w-4" />
              <span className="hidden sm:inline">AI Help</span>
            </Button>
            <Button variant="outline" size="sm" className="gap-2" onClick={handleSignOut}>
              <LogOut className="h-4 w-4" />
              <span className="hidden sm:inline">Sign Out</span>
            </Button>
          </div>
        </div>
      </header>

      <main className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
        <div className="mb-8">
          <h2 className="mb-2 text-3xl font-bold text-slate-900">Welcome Back!</h2>
          <p className="text-lg text-slate-600">
            Choose a section to continue your learning journey
          </p>
        </div>

        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          {sections.map((section, index) => {
            const Icon = section.icon;
            return (
              <Link key={index} href={section.href}>
                <div className="group h-full rounded-2xl border border-slate-200 bg-white p-6 shadow-sm transition-all hover:shadow-lg hover:scale-[1.02]">
                  <div className={`mb-4 inline-flex h-12 w-12 items-center justify-center rounded-xl bg-gradient-to-br ${section.color} shadow-lg transition-transform group-hover:scale-110`}>
                    <Icon className="h-6 w-6 text-white" />
                  </div>
                  <h3 className="mb-2 text-xl font-bold text-slate-900">{section.title}</h3>
                  <p className="text-sm text-slate-600">{section.description}</p>
                </div>
              </Link>
            );
          })}
        </div>

        <div className="mt-8 rounded-2xl bg-gradient-to-r from-violet-600 to-fuchsia-600 p-6 text-white shadow-xl">
          <div className="flex flex-col items-center gap-4 sm:flex-row sm:justify-between">
            <div>
              <h3 className="mb-1 text-xl font-bold">Need Help?</h3>
              <p className="text-sm text-violet-100">
                Access our AI assistant or browse the help center
              </p>
            </div>
            <div className="flex gap-2">
              <Button variant="secondary" size="sm" onClick={() => setShowChat(true)}>
                <MessageSquare className="mr-2 h-4 w-4" />
                Ask AI
              </Button>
              <Link href="/help">
                <Button variant="outline" size="sm" className="border-white bg-white/10 text-white hover:bg-white/20">
                  Help Center
                </Button>
              </Link>
            </div>
          </div>
        </div>
      </main>

      {showNotifications && <NotificationPanel onClose={() => setShowNotifications(false)} />}
      {showChat && <AIChatbot onClose={() => setShowChat(false)} />}
      <DeveloperWatermark />
    </div>
  );
}
