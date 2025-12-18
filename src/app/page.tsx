"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
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
  Shield,
  Lock,
  CheckCircle2,
  TrendingUp,
  BookOpen,
  Target,
  GraduationCap,
  Moon,
  Sun,
} from "lucide-react";
import { DeveloperWatermark } from "@/components/DeveloperWatermark";
import { AIChatbot } from "@/components/AIChatbot";
import { NotificationPanel } from "@/components/NotificationPanel";
import Link from "next/link";
import { motion } from "framer-motion";
import { useTheme } from "@/components/ThemeProvider";
import { createClient } from "@/lib/supabase/client";

interface UserProfile {
  id: string;
  full_name: string | null;
  email: string;
  field_of_interest: string | null;
  target_role: string | null;
  onboarding_completed: boolean;
}

export default function HomePage() {
  const router = useRouter();
  const { theme, toggleTheme } = useTheme();
  const [voiceActive, setVoiceActive] = useState(false);
  const [aiInsight, setAiInsight] = useState("Analyzing your learning patterns...");
  const [showChatbot, setShowChatbot] = useState(false);
  const [showNotifications, setShowNotifications] = useState(false);
  const [profile, setProfile] = useState<UserProfile | null>(null);
  const [isLoggedIn, setIsLoggedIn] = useState(false);

  useEffect(() => {
    loadUserProfile();
  }, []);

  async function loadUserProfile() {
    const supabase = createClient();
    const { data: { user } } = await supabase.auth.getUser();
    
    if (user) {
      setIsLoggedIn(true);
      const { data: profileData } = await supabase
        .from("user_profiles")
        .select("*")
        .eq("id", user.id)
        .single();
      
      if (profileData) {
        if (!profileData.onboarding_completed) {
          router.push("/onboarding");
          return;
        }
        setProfile(profileData);
      } else {
        router.push("/onboarding");
      }
    }
  }

  const insights = [
    "Your skills improved 23% this week - keep it up!",
    "AI recommends focusing on your weak areas",
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
    { label: "Learning Streak", value: "24 days", icon: Zap, color: "text-amber-400", bg: "from-amber-500/20 to-orange-500/20" },
    { label: "Skills Mastered", value: "12", icon: Award, color: "text-emerald-400", bg: "from-emerald-500/20 to-teal-500/20" },
    { label: "Study Time", value: "48h", icon: Clock, color: "text-cyan-400", bg: "from-cyan-500/20 to-blue-500/20" },
    { label: "AI Score", value: "87%", icon: Brain, color: "text-pink-400", bg: "from-pink-500/20 to-rose-500/20" },
  ];

  const aiFeatures = [
    {
      title: "AI Voice Assistant",
      desc: "Talk to your learning companion",
      icon: Mic,
      gradient: "from-cyan-500 to-blue-600",
      href: "/overview"
    },
    {
      title: "Smart Analytics",
      desc: "Real-time skill gap analysis",
      icon: BarChart3,
      gradient: "from-violet-500 to-purple-600",
      href: "/analytics"
    },
    {
      title: "Adaptive Tests",
      desc: "AI-generated assessments",
      icon: FileQuestion,
      gradient: "from-pink-500 to-rose-600",
      href: "/assessment"
    },
    {
      title: "Learning Roadmap",
      desc: "Personalized career path",
      icon: Map,
      gradient: "from-orange-500 to-red-600",
      href: "/roadmap"
    },
    {
      title: "AI Guidance",
      desc: "Daily personalized tips",
      icon: Compass,
      gradient: "from-emerald-500 to-teal-600",
      href: "/guidance"
    },
    {
      title: "Content Generator",
      desc: "AI-powered study materials",
      icon: Lightbulb,
      gradient: "from-yellow-500 to-amber-600",
      href: "/overview"
    },
  ];

  const securityFeatures = [
    { icon: Shield, text: "End-to-End Encryption" },
    { icon: Lock, text: "Secure Authentication" },
    { icon: CheckCircle2, text: "GDPR Compliant" },
  ];

  const displayName = profile?.full_name || "Student";
  const displayRole = profile?.target_role || profile?.field_of_interest || "Learner";

  return (
    <div className="min-h-screen bg-background text-foreground overflow-hidden transition-colors duration-300">
      <div className="fixed inset-0 bg-[radial-gradient(ellipse_at_top,_var(--tw-gradient-stops))] from-primary/10 via-transparent to-transparent pointer-events-none" />
      <div className="fixed inset-0 opacity-30 pointer-events-none" style={{backgroundImage: "radial-gradient(circle at 1px 1px, currentColor 1px, transparent 0)", backgroundSize: "40px 40px", color: "var(--muted-foreground)", opacity: 0.05}} />
      
      <header className="sticky top-0 z-50 border-b border-border bg-background/80 backdrop-blur-xl">
        <div className="mx-auto flex h-16 max-w-7xl items-center justify-between px-6 lg:px-8">
          <div className="flex items-center gap-3">
            <div className="relative">
              <div className="absolute inset-0 rounded-xl bg-gradient-to-br from-emerald-500 to-cyan-500 blur-lg opacity-50" />
              <div className="relative flex h-10 w-10 items-center justify-center rounded-xl bg-gradient-to-br from-emerald-500 to-cyan-500">
                <GraduationCap className="h-5 w-5 text-white" />
              </div>
            </div>
            <div>
              <h1 className="text-lg font-bold text-foreground">
                Shrivasta AI
              </h1>
              <p className="text-[10px] text-primary font-medium tracking-wide">INTELLIGENCE LAYER</p>
            </div>
          </div>
          
          <div className="flex items-center gap-2">
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
              onClick={() => setShowChatbot(!showChatbot)}
            >
              <MessageSquare className="h-4 w-4" />
            </Button>
            <Button
              variant="ghost"
              size="sm"
              className="text-muted-foreground hover:text-foreground hover:bg-muted"
              onClick={toggleTheme}
              title={theme === "dark" ? "Switch to light mode" : "Switch to dark mode"}
            >
              {theme === "dark" ? <Sun className="h-4 w-4" /> : <Moon className="h-4 w-4" />}
            </Button>
            <Link href="/settings">
              <Button variant="ghost" size="sm" className="text-muted-foreground hover:text-foreground hover:bg-muted">
                <Settings className="h-4 w-4" />
              </Button>
            </Link>
            <Link href={isLoggedIn ? "/profile" : "/login"}>
              <div className="flex h-9 w-9 items-center justify-center rounded-full bg-gradient-to-br from-emerald-500 to-cyan-500 text-sm font-bold text-white shadow-lg shadow-primary/25 cursor-pointer ring-2 ring-primary/20 hover:ring-primary/40 transition-all">
                {displayName.charAt(0).toUpperCase()}
              </div>
            </Link>
          </div>
        </div>
      </header>

      <main className="relative mx-auto max-w-7xl px-6 py-12 lg:px-8">
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="relative isolate overflow-hidden rounded-3xl bg-card border border-border px-6 pt-16 shadow-2xl sm:px-16 md:pt-24 lg:flex lg:gap-x-20 lg:px-24 lg:pt-0 mb-12"
        >
          <div className="absolute inset-0 bg-[radial-gradient(circle_at_30%_20%,_var(--tw-gradient-stops))] from-primary/10 via-transparent to-transparent" />
          <div className="absolute inset-0 bg-[radial-gradient(circle_at_70%_80%,_var(--tw-gradient-stops))] from-cyan-500/10 via-transparent to-transparent" />
          
          <div className="mx-auto max-w-md text-center lg:mx-0 lg:flex-auto lg:py-24 lg:text-left relative z-10">
            <motion.div 
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2 }}
              className="mb-6 flex items-center justify-center lg:justify-start gap-2 flex-wrap"
            >
              <Badge className="rounded-full bg-primary/10 px-3 py-1 text-xs font-medium text-primary border border-primary/20">
                {displayRole}
              </Badge>
              <Badge className="rounded-full bg-cyan-500/10 px-3 py-1 text-xs font-medium text-cyan-500 border border-cyan-500/20 flex items-center gap-1.5">
                <span className="relative flex h-2 w-2">
                  <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-cyan-400 opacity-75"></span>
                  <span className="relative inline-flex rounded-full h-2 w-2 bg-cyan-500"></span>
                </span>
                AI Active
              </Badge>
            </motion.div>
            
            <motion.h2 
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.3 }}
              className="text-3xl font-bold tracking-tight text-foreground sm:text-4xl lg:text-5xl"
            >
              Welcome back,
              <br />
              <span className="bg-gradient-to-r from-emerald-400 via-cyan-400 to-emerald-400 bg-clip-text text-transparent">
                {displayName}
              </span>
            </motion.h2>
            
            <motion.p 
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.4 }}
              className="mt-6 text-lg leading-8 text-muted-foreground"
            >
              {aiInsight || "Analyzing your learning patterns..."}
            </motion.p>
            
            <motion.div 
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.5 }}
              className="mt-10 flex items-center justify-center gap-4 lg:justify-start flex-wrap"
            >
              <Link href={isLoggedIn ? "/dashboard" : "/login"}>
                <Button size="lg" className="bg-gradient-to-r from-emerald-500 to-cyan-500 text-white hover:from-emerald-600 hover:to-cyan-600 font-semibold shadow-lg shadow-primary/25 border-0">
                  {isLoggedIn ? "Go to Dashboard" : "Get Started"}
                  <ArrowRight className="ml-2 h-4 w-4" />
                </Button>
              </Link>
              <Button
                size="lg"
                variant="outline"
                className="border-border bg-muted/50 text-foreground hover:bg-muted backdrop-blur-sm"
                onClick={() => setVoiceActive(!voiceActive)}
              >
                {voiceActive ? <Volume2 className="mr-2 h-4 w-4 text-primary" /> : <Mic className="mr-2 h-4 w-4" />}
                {voiceActive ? "Listening..." : "Voice Assistant"}
              </Button>
            </motion.div>

            <motion.div 
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.6 }}
              className="mt-8 flex items-center justify-center lg:justify-start gap-6"
            >
              {securityFeatures.map((feature, i) => {
                const Icon = feature.icon;
                return (
                  <div key={i} className="flex items-center gap-2 text-xs text-muted-foreground">
                    <Icon className="h-3.5 w-3.5 text-primary/60" />
                    <span>{feature.text}</span>
                  </div>
                );
              })}
            </motion.div>
          </div>
          
          <div className="hidden lg:flex lg:items-center lg:justify-center lg:flex-1 relative">
              <div className="relative w-80 h-80">
                <motion.div 
                  animate={{ scale: [1, 1.1, 1], opacity: [0.5, 0.8, 0.5] }}
                  transition={{ duration: 4, repeat: Infinity, ease: "easeInOut" }}
                  className="absolute inset-0 rounded-full bg-gradient-to-br from-primary/20 to-cyan-500/20 blur-3xl" 
                />
                <motion.div
                  animate={{ rotate: 360 }}
                  transition={{ duration: 30, repeat: Infinity, ease: "linear" }}
                  className="absolute inset-4 rounded-full border border-dashed border-primary/20"
                />
                <motion.div
                  animate={{ rotate: -360 }}
                  transition={{ duration: 20, repeat: Infinity, ease: "linear" }}
                  className="absolute inset-12 rounded-full border border-dashed border-cyan-500/20"
                />
                <div className="absolute inset-8 rounded-full bg-gradient-to-br from-primary/10 to-cyan-500/10 border border-border flex items-center justify-center">
                  <motion.div
                    animate={{ scale: [1, 1.05, 1] }}
                    transition={{ duration: 2, repeat: Infinity }}
                  >
                    <Brain className="h-24 w-24 text-primary/30" />
                  </motion.div>
                </div>
                <motion.div 
                  animate={{ y: [0, -10, 0] }}
                  transition={{ duration: 3, repeat: Infinity, ease: "easeInOut" }}
                  className="absolute top-4 right-8 p-3 rounded-xl bg-card border border-border shadow-xl"
                >
                  <TrendingUp className="h-5 w-5 text-primary" />
                </motion.div>
                <motion.div 
                  animate={{ y: [0, 10, 0] }}
                  transition={{ duration: 3.5, repeat: Infinity, ease: "easeInOut", delay: 0.5 }}
                  className="absolute bottom-8 left-4 p-3 rounded-xl bg-card border border-border shadow-xl"
                >
                  <Target className="h-5 w-5 text-cyan-500" />
                </motion.div>
                <motion.div 
                  animate={{ x: [0, 5, 0] }}
                  transition={{ duration: 2.5, repeat: Infinity, ease: "easeInOut", delay: 1 }}
                  className="absolute top-1/2 -right-4 p-3 rounded-xl bg-card border border-border shadow-xl"
                >
                  <BookOpen className="h-5 w-5 text-pink-500" />
                </motion.div>
                <motion.div 
                  animate={{ x: [0, -5, 0], y: [0, 5, 0] }}
                  transition={{ duration: 4, repeat: Infinity, ease: "easeInOut", delay: 1.5 }}
                  className="absolute top-12 left-0 p-3 rounded-xl bg-card border border-border shadow-xl"
                >
                  <Sparkles className="h-5 w-5 text-amber-500" />
                </motion.div>
                <motion.div 
                  animate={{ scale: [1, 1.2, 1] }}
                  transition={{ duration: 2, repeat: Infinity, ease: "easeInOut", delay: 0.7 }}
                  className="absolute bottom-4 right-12 p-2 rounded-lg bg-gradient-to-br from-emerald-500 to-cyan-500 shadow-xl"
                >
                  <Zap className="h-4 w-4 text-white" />
                </motion.div>
              </div>
            </div>
        </motion.div>

        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="grid grid-cols-2 gap-4 lg:grid-cols-4 mb-12"
        >
          {quickStats.map((stat, i) => {
            const Icon = stat.icon;
            return (
              <motion.div 
                key={i}
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ delay: 0.3 + i * 0.1 }}
                className="group relative overflow-hidden rounded-2xl border border-border bg-card/50 backdrop-blur-sm p-6 transition-all hover:border-primary/30 hover:bg-card/80"
              >
                <div className={`absolute inset-0 bg-gradient-to-br ${stat.bg} opacity-0 group-hover:opacity-100 transition-opacity`} />
                <Icon className={`h-8 w-8 ${stat.color} mb-4 relative z-10`} />
                <p className="text-3xl font-bold text-foreground mb-1 relative z-10">{stat.value}</p>
                <p className="text-sm font-medium text-muted-foreground relative z-10">{stat.label}</p>
              </motion.div>
            );
          })}
        </motion.div>

        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4 }}
          className="mb-12"
        >
          <div className="mb-8 flex items-end justify-between">
            <div>
              <h3 className="text-2xl font-bold text-foreground mb-2 flex items-center gap-2">
                <Sparkles className="h-5 w-5 text-primary" />
                AI Tools
              </h3>
              <p className="text-muted-foreground">Explore your personalized AI-powered learning suite</p>
            </div>
            <Link href="/features" className="text-sm font-semibold text-primary hover:text-primary/80 hidden sm:block transition-colors">
              View all features &rarr;
            </Link>
          </div>

          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {aiFeatures.map((feature, i) => {
              const Icon = feature.icon;
              return (
                <motion.div
                  key={i}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.5 + i * 0.1 }}
                >
                  <Link href={feature.href}>
                    <div className="group h-full rounded-2xl border border-border bg-card/50 backdrop-blur-sm p-6 transition-all hover:border-primary/30 hover:bg-card/80 hover:shadow-lg hover:shadow-primary/5">
                      <div className={`mb-4 inline-flex h-12 w-12 items-center justify-center rounded-xl bg-gradient-to-br ${feature.gradient} text-white shadow-lg transition-transform group-hover:scale-110 group-hover:rotate-3`}>
                        <Icon className="h-6 w-6" />
                      </div>
                      <h4 className="text-lg font-bold text-foreground mb-2 group-hover:text-primary transition-colors">
                        {feature.title}
                      </h4>
                      <p className="text-sm text-muted-foreground leading-relaxed">
                        {feature.desc}
                      </p>
                    </div>
                  </Link>
                </motion.div>
              );
            })}
          </div>
        </motion.div>

        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.6 }}
          className="relative overflow-hidden rounded-2xl border border-border bg-card/50 backdrop-blur-sm p-8"
        >
          <div className="absolute top-0 right-0 -mt-4 -mr-4 h-40 w-40 rounded-full bg-gradient-to-br from-primary/10 to-cyan-500/10 blur-3xl" />
          
          <div className="relative">
            <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between mb-6 gap-4">
              <div>
                <div className="flex items-center gap-2 mb-1">
                  <h4 className="text-xl font-bold text-foreground">Current Focus</h4>
                  <Badge className="border-primary/20 text-primary bg-primary/10">High Priority</Badge>
                </div>
                <p className="text-muted-foreground">{profile?.field_of_interest || "Start your learning journey"}</p>
              </div>
              <Link href={isLoggedIn ? "/overview" : "/signup"}>
                <Button variant="outline" className="border-border bg-muted/50 text-foreground hover:bg-muted">
                  {isLoggedIn ? "Continue Learning" : "Sign Up"} <ArrowRight className="ml-2 h-4 w-4" />
                </Button>
              </Link>
            </div>
            
            <div className="space-y-2">
              <div className="flex justify-between text-sm font-medium">
                <span className="text-muted-foreground">Progress</span>
                <span className="text-primary">67%</span>
              </div>
              <div className="h-3 bg-muted rounded-full overflow-hidden">
                <motion.div 
                  initial={{ width: 0 }}
                  animate={{ width: "67%" }}
                  transition={{ delay: 0.8, duration: 1, ease: "easeOut" }}
                  className="h-full bg-gradient-to-r from-emerald-500 to-cyan-500 rounded-full"
                />
              </div>
              <div className="flex justify-between text-xs text-muted-foreground mt-2">
                <span>12 of 18 modules completed</span>
                <span>Est. 2 weeks remaining</span>
              </div>
            </div>
          </div>
        </motion.div>
      </main>

      {showChatbot && <AIChatbot onClose={() => setShowChatbot(false)} />}
      {showNotifications && <NotificationPanel onClose={() => setShowNotifications(false)} />}
      <DeveloperWatermark />
    </div>
  );
}
