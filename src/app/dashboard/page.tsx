"use client";

import { useState, useEffect } from "react";
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
  Sun,
  Moon,
  BookOpen,
  ClipboardList,
  Trophy,
  Gamepad2,
  Award,
  Users,
  Video,
  Flame,
  Clock,
  Layers,
  Timer,
  Bookmark,
  FolderKanban,
  Code2,
  UserCheck,
  Library,
  Gift,
  TrendingUp as Stats,
} from "lucide-react";
import { DeveloperWatermark } from "@/components/DeveloperWatermark";
import { AIChatbot } from "@/components/AIChatbot";
import { NotificationPanel } from "@/components/NotificationPanel";
import Link from "next/link";
import { createClient } from "@/lib/supabase/client";
import { useRouter } from "next/navigation";
import { motion } from "framer-motion";
import { useTheme } from "@/components/ThemeProvider";

interface UserProfile {
  id: string;
  full_name: string | null;
  email: string;
  field_of_interest: string | null;
  education_level: string | null;
  onboarding_completed: boolean;
}

export default function DashboardPage() {
  const router = useRouter();
  const { theme, toggleTheme } = useTheme();
  const [showNotifications, setShowNotifications] = useState(false);
  const [showChat, setShowChat] = useState(false);
  const [profile, setProfile] = useState<UserProfile | null>(null);
  const [loading, setLoading] = useState(true);
  const [stats, setStats] = useState({ completed: 0, avgScore: 0, streak: 0, assignments: 0 });

  useEffect(() => {
    loadProfile();
  }, []);

  async function loadProfile() {
    const supabase = createClient();
    const { data: { user } } = await supabase.auth.getUser();
    
    if (!user) {
      router.push("/login");
      return;
    }

    const { data: profileArr } = await supabase
      .from("user_profiles")
      .select("*")
      .eq("id", user.id);

    const profileData = profileArr?.[0];

    if (!profileData || !profileData.onboarding_completed) {
      router.push("/onboarding");
      return;
    }

    setProfile(profileData);

    const { data: progressData } = await supabase
      .from("topic_progress")
      .select("id")
      .eq("user_id", user.id)
      .eq("status", "completed");

    const { data: submissionsData } = await supabase
      .from("assignment_submissions")
      .select("percentage")
      .eq("user_id", user.id);

    const avgScore = submissionsData && submissionsData.length > 0
      ? Math.round(submissionsData.reduce((a, b) => a + (b.percentage || 0), 0) / submissionsData.length)
      : 0;

    setStats({
      completed: progressData?.length || 0,
      avgScore,
      streak: 24,
      assignments: submissionsData?.length || 0
    });

    setLoading(false);
  }

  const handleSignOut = async () => {
    const supabase = createClient();
    await supabase.auth.signOut();
    router.push("/login");
  };

  const sections = [
    {
      title: "Subjects",
      description: "Browse subjects, chapters and topics",
      icon: BookOpen,
      href: "/subjects",
      color: "from-emerald-500 to-teal-600"
    },
    {
      title: "Group Study",
      description: "Study with friends",
      icon: Users,
      href: "/group-study",
      color: "from-violet-500 to-fuchsia-600"
    },
    {
      title: "Practice",
      description: "Coding challenges & exercises",
      icon: Code2,
      href: "/practice",
      color: "from-cyan-500 to-blue-600"
    },
    {
      title: "Quizzes",
      description: "Test your knowledge",
      icon: FileQuestion,
      href: "/quizzes",
      color: "from-pink-500 to-rose-600"
    },
    {
      title: "Games",
      description: "Learn while playing",
      icon: Gamepad2,
      href: "/games",
      color: "from-fuchsia-500 to-pink-600"
    },
    {
      title: "Statistics",
      description: "Track your progress",
      icon: BarChart3,
      href: "/statistics",
      color: "from-emerald-500 to-green-600"
    },
    {
      title: "Projects",
      description: "Build real projects",
      icon: FolderKanban,
      href: "/projects",
      color: "from-violet-500 to-purple-600"
    },
    {
      title: "Mentors",
      description: "Get expert guidance",
      icon: UserCheck,
      href: "/mentors",
      color: "from-pink-500 to-rose-600"
    },
    {
      title: "Workshops",
      description: "Live learning events",
      icon: Video,
      href: "/workshops",
      color: "from-red-500 to-orange-600"
    },
    {
      title: "Resources",
      description: "Learning materials",
      icon: Library,
      href: "/resources",
      color: "from-orange-500 to-amber-600"
    },
    {
      title: "Rewards",
      description: "Redeem your XP",
      icon: Gift,
      href: "/rewards",
      color: "from-amber-500 to-yellow-600"
    },
    {
      title: "Calendar",
      description: "Schedule study sessions",
      icon: Calendar,
      href: "/calendar",
      color: "from-indigo-500 to-blue-600"
    },
    {
      title: "Bookmarks",
      description: "Saved content",
      icon: Bookmark,
      href: "/bookmarks",
      color: "from-amber-500 to-orange-600"
    },
    {
      title: "Live Sessions",
      description: "Join live classes",
      icon: Video,
      href: "/live-sessions",
      color: "from-red-500 to-pink-600"
    },
    {
      title: "Community",
      description: "Connect with learners",
      icon: Users,
      href: "/community",
      color: "from-teal-500 to-cyan-600"
    },
    {
      title: "Certificates",
      description: "View your achievements",
      icon: Award,
      href: "/certificates",
      color: "from-amber-500 to-yellow-600"
    },
    {
      title: "Flashcards",
      description: "Quick revision cards",
      icon: Layers,
      href: "/flashcards",
      color: "from-lime-500 to-green-600"
    },
    {
      title: "Achievements",
      description: "Track your badges",
      icon: Trophy,
      href: "/achievements",
      color: "from-orange-500 to-red-600"
    },
    {
      title: "Pomodoro",
      description: "Focus timer",
      icon: Timer,
      href: "/pomodoro",
      color: "from-rose-500 to-pink-600"
    },
    {
      title: "Leaderboard",
      description: "Compete with others",
      icon: Flame,
      href: "/leaderboard",
      color: "from-yellow-500 to-orange-600"
    },
    {
      title: "Notes",
      description: "Your study notes",
      icon: ClipboardList,
      href: "/notes",
      color: "from-sky-500 to-blue-600"
    },
    {
      title: "Guidance",
      description: "AI recommendations",
      icon: Compass,
      href: "/guidance",
      color: "from-cyan-500 to-blue-600"
    },
    {
      title: "Study Plan",
      description: "Daily schedule",
      icon: Target,
      href: "/study-plan",
      color: "from-violet-500 to-purple-600"
    },
    {
      title: "Assignments",
      description: "Practice tests",
      icon: FileQuestion,
      href: "/assignments",
      color: "from-pink-500 to-rose-600"
    },
    {
      title: "Settings",
      description: "Manage preferences",
      icon: SettingsIcon,
      href: "/settings",
      color: "from-slate-500 to-gray-600"
    },
  ];

  const quickActions = [
    { icon: Target, label: "Topics Done", value: stats.completed.toString(), color: "text-emerald-500", bg: "bg-emerald-500/10" },
    { icon: Trophy, label: "Avg Score", value: `${stats.avgScore}%`, color: "text-amber-500", bg: "bg-amber-500/10" },
    { icon: Zap, label: "Streak", value: `${stats.streak} days`, color: "text-pink-500", bg: "bg-pink-500/10" },
    { icon: ClipboardList, label: "Assessments", value: stats.assignments.toString(), color: "text-violet-500", bg: "bg-violet-500/10" },
  ];

  if (loading) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-background">
        <div className="text-center">
          <GraduationCap className="mx-auto h-12 w-12 animate-pulse text-primary" />
          <p className="mt-4 text-muted-foreground font-medium">Loading dashboard...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background text-foreground overflow-hidden transition-colors duration-300">
      <div className="fixed inset-0 bg-[radial-gradient(ellipse_at_top_right,_var(--tw-gradient-stops))] from-primary/10 via-transparent to-transparent pointer-events-none" />
      <div className="fixed inset-0 opacity-30 pointer-events-none dark:opacity-20" style={{backgroundImage: "radial-gradient(circle at 1px 1px, currentColor 1px, transparent 0)", backgroundSize: "40px 40px", color: "var(--muted-foreground)", opacity: 0.1}} />

      <header className="sticky top-0 z-50 border-b border-border bg-background/80 backdrop-blur-xl">
        <div className="mx-auto flex h-16 max-w-7xl items-center justify-between px-4 sm:px-6 lg:px-8">
          <Link href="/" className="flex items-center gap-3">
            <div className="relative">
              <div className="absolute inset-0 rounded-xl bg-gradient-to-br from-emerald-500 to-cyan-500 blur-lg opacity-50" />
              <div className="relative flex h-10 w-10 items-center justify-center rounded-xl bg-gradient-to-br from-emerald-500 to-cyan-500">
                <GraduationCap className="h-5 w-5 text-white" />
              </div>
            </div>
            <div>
              <h1 className="text-lg font-bold text-foreground">
                AI Intelligence Layer
              </h1>
              <p className="text-[10px] text-primary font-medium tracking-wide">DASHBOARD</p>
            </div>
          </Link>
          <div className="flex items-center gap-2">
            <Button
              variant="ghost"
              size="sm"
              className="text-muted-foreground hover:text-foreground hover:bg-muted"
              onClick={toggleTheme}
            >
              {theme === "dark" ? <Sun className="h-4 w-4" /> : <Moon className="h-4 w-4" />}
            </Button>
            <Button
              variant="ghost"
              size="sm"
              className="text-muted-foreground hover:text-foreground hover:bg-muted relative"
              onClick={() => setShowNotifications(!showNotifications)}
            >
              <Bell className="h-4 w-4" />
              <span className="absolute top-1 right-1 h-2 w-2 rounded-full bg-primary animate-pulse" />
            </Button>
            <Button
              variant="ghost"
              size="sm"
              className="text-muted-foreground hover:text-foreground hover:bg-muted"
              onClick={() => setShowChat(!showChat)}
            >
              <MessageSquare className="h-4 w-4" />
            </Button>
            <Button 
              variant="ghost" 
              size="sm" 
              className="text-muted-foreground hover:text-foreground hover:bg-muted" 
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
<h2 className="text-3xl font-bold text-foreground">
                Welcome back, {profile?.full_name || "Student"}!
              </h2>
            <Badge className="bg-primary/10 text-primary border-primary/20">
              <Shield className="h-3 w-3 mr-1" />
              Secure
            </Badge>
          </div>
          <p className="text-lg text-muted-foreground">
            {profile?.field_of_interest 
              ? `Continue your journey in ${profile.field_of_interest}` 
              : "Choose a section to continue your learning journey"}
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
              <div key={i} className="rounded-xl border border-border bg-card/50 backdrop-blur-sm p-4 flex items-center gap-3">
                <div className={`h-10 w-10 rounded-lg ${action.bg} flex items-center justify-center`}>
                  <Icon className={`h-5 w-5 ${action.color}`} />
                </div>
                <div>
                  <p className="text-xs text-muted-foreground">{action.label}</p>
                  <p className="text-lg font-bold text-foreground">{action.value}</p>
                </div>
              </div>
            );
          })}
        </motion.div>

        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4 mb-8">
          {sections.map((section, index) => {
            const Icon = section.icon;
            return (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.2 + index * 0.05 }}
              >
                <Link href={section.href}>
                  <div className="group h-full rounded-2xl border border-border bg-card/50 backdrop-blur-sm p-6 transition-all hover:border-primary/30 hover:bg-card/80 hover:shadow-lg hover:shadow-primary/5">
                    <div className={`mb-4 inline-flex h-12 w-12 items-center justify-center rounded-xl bg-gradient-to-br ${section.color} shadow-lg transition-transform group-hover:scale-110 group-hover:rotate-3`}>
                      <Icon className="h-6 w-6 text-white" />
                    </div>
                    <h3 className="mb-2 text-lg font-bold text-foreground group-hover:text-primary transition-colors">{section.title}</h3>
                    <p className="text-sm text-muted-foreground">{section.description}</p>
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
          className="rounded-2xl bg-gradient-to-r from-emerald-600/90 to-cyan-600/90 p-6 text-white shadow-xl shadow-primary/10 border border-white/10"
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
