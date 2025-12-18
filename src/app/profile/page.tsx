"use client";

import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
  User,
  Mail,
  GraduationCap,
  Target,
  Trophy,
  Clock,
  AlertTriangle,
  CheckCircle2,
  LogOut,
  Home,
  Sun,
  Moon,
  BookOpen,
  Brain,
  TrendingUp,
  Calendar,
  BarChart3,
  Sparkles,
  Edit2,
  Save,
  X,
} from "lucide-react";
import Link from "next/link";
import { createClient } from "@/lib/supabase/client";
import { useRouter } from "next/navigation";
import { motion } from "framer-motion";
import { useTheme } from "@/components/ThemeProvider";

interface UserProfile {
  id: string;
  full_name: string | null;
  email: string;
  education_level: string | null;
  institution_name: string | null;
  field_of_interest: string | null;
  target_role: string | null;
  created_at: string;
}

interface WeakTopic {
  id: string;
  accuracy_percentage: number;
  attempts: number;
  last_attempt_at: string;
  topic: { name: string; chapter: { name: string; subject: { name: string } } };
}

interface Submission {
  id: string;
  score: number;
  total_marks: number;
  percentage: number;
  submitted_at: string;
  assignment: { title: string };
}

interface TopicProgress {
  id: string;
  status: string;
  completed_at: string;
  topic: { name: string };
}

export default function ProfilePage() {
  const router = useRouter();
  const { theme, toggleTheme } = useTheme();
  const [profile, setProfile] = useState<UserProfile | null>(null);
  const [weakTopics, setWeakTopics] = useState<WeakTopic[]>([]);
  const [submissions, setSubmissions] = useState<Submission[]>([]);
  const [topicProgress, setTopicProgress] = useState<TopicProgress[]>([]);
  const [loading, setLoading] = useState(true);
  const [editing, setEditing] = useState(false);
  const [editForm, setEditForm] = useState({ full_name: "", target_role: "", institution_name: "" });

  useEffect(() => {
    loadData();
  }, []);

  async function loadData() {
    const supabase = createClient();
    const { data: { user } } = await supabase.auth.getUser();
    
    if (!user) {
      router.push("/login");
      return;
    }

    const { data: profileData } = await supabase
      .from("user_profiles")
      .select("*")
      .eq("id", user.id)
      .single();

    if (profileData) {
      setProfile(profileData as UserProfile);
      setEditForm({
        full_name: profileData.full_name || "",
        target_role: profileData.target_role || "",
        institution_name: profileData.institution_name || ""
      });
    }

    const { data: weakData } = await supabase
      .from("weak_topics")
      .select("*, topic:topics(name, chapter:chapters(name, subject:subjects(name)))")
      .eq("user_id", user.id)
      .order("accuracy_percentage", { ascending: true })
      .limit(10);

    if (weakData) {
      setWeakTopics(weakData as unknown as WeakTopic[]);
    }

    const { data: submissionsData } = await supabase
      .from("assignment_submissions")
      .select("*, assignment:assignments(title)")
      .eq("user_id", user.id)
      .order("submitted_at", { ascending: false })
      .limit(10);

    if (submissionsData) {
      setSubmissions(submissionsData as unknown as Submission[]);
    }

    const { data: progressData } = await supabase
      .from("topic_progress")
      .select("*, topic:topics(name)")
      .eq("user_id", user.id)
      .eq("status", "completed")
      .order("completed_at", { ascending: false })
      .limit(10);

    if (progressData) {
      setTopicProgress(progressData as unknown as TopicProgress[]);
    }

    setLoading(false);
  }

  async function handleSaveProfile() {
    if (!profile) return;
    
    const supabase = createClient();
    await supabase
      .from("user_profiles")
      .update({
        full_name: editForm.full_name,
        target_role: editForm.target_role,
        institution_name: editForm.institution_name
      })
      .eq("id", profile.id);

    setProfile({ ...profile, ...editForm });
    setEditing(false);
  }

  async function handleSignOut() {
    const supabase = createClient();
    await supabase.auth.signOut();
    router.push("/login");
  }

  const totalCompleted = topicProgress.length;
  const avgScore = submissions.length > 0 
    ? Math.round(submissions.reduce((a, s) => a + s.percentage, 0) / submissions.length) 
    : 0;
  const studyDays = Math.floor((Date.now() - new Date(profile?.created_at || Date.now()).getTime()) / (1000 * 60 * 60 * 24));

  if (loading) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-background">
        <div className="text-center">
          <User className="mx-auto h-12 w-12 animate-pulse text-primary" />
          <p className="mt-4 text-muted-foreground font-medium">Loading profile...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background text-foreground transition-colors duration-300">
      <div className="fixed inset-0 bg-[radial-gradient(ellipse_at_top,_var(--tw-gradient-stops))] from-primary/10 via-transparent to-transparent pointer-events-none" />

      <header className="sticky top-0 z-50 border-b border-border bg-background/80 backdrop-blur-xl">
        <div className="mx-auto flex h-16 max-w-7xl items-center justify-between px-4 sm:px-6 lg:px-8">
          <div className="flex items-center gap-4">
            <Link href="/dashboard" className="flex items-center gap-3">
              <div className="relative">
                <div className="absolute inset-0 rounded-xl bg-gradient-to-br from-cyan-500 to-blue-500 blur-lg opacity-50" />
                <div className="relative flex h-10 w-10 items-center justify-center rounded-xl bg-gradient-to-br from-cyan-500 to-blue-500">
                  <User className="h-5 w-5 text-white" />
                </div>
              </div>
              <div>
                <h1 className="text-lg font-bold text-foreground">Profile</h1>
                <p className="text-[10px] text-primary font-medium tracking-wide">STUDENT PROFILE</p>
              </div>
            </Link>
          </div>
          <div className="flex items-center gap-2">
            <Link href="/dashboard">
              <Button variant="ghost" size="sm" className="text-muted-foreground hover:text-foreground">
                <Home className="h-4 w-4" />
              </Button>
            </Link>
            <Button variant="ghost" size="sm" onClick={toggleTheme} className="text-muted-foreground hover:text-foreground">
              {theme === "dark" ? <Sun className="h-4 w-4" /> : <Moon className="h-4 w-4" />}
            </Button>
            <Button variant="ghost" size="sm" onClick={handleSignOut} className="text-red-500 hover:text-red-600 hover:bg-red-500/10">
              <LogOut className="h-4 w-4" />
            </Button>
          </div>
        </div>
      </header>

      <main className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8 relative">
        <div className="grid gap-6 lg:grid-cols-3">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="lg:col-span-1 space-y-6"
          >
            <div className="rounded-2xl border border-border bg-card/50 backdrop-blur-sm p-6">
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-lg font-bold text-foreground">Profile Info</h3>
                {!editing ? (
                  <Button variant="ghost" size="sm" onClick={() => setEditing(true)}>
                    <Edit2 className="h-4 w-4" />
                  </Button>
                ) : (
                  <div className="flex gap-1">
                    <Button variant="ghost" size="sm" onClick={handleSaveProfile}>
                      <Save className="h-4 w-4 text-green-500" />
                    </Button>
                    <Button variant="ghost" size="sm" onClick={() => setEditing(false)}>
                      <X className="h-4 w-4 text-red-500" />
                    </Button>
                  </div>
                )}
              </div>
              
              <div className="flex flex-col items-center text-center mb-6">
                <div className="w-20 h-20 rounded-full bg-gradient-to-br from-cyan-500 to-blue-500 flex items-center justify-center text-3xl font-bold text-white mb-3">
                  {profile?.full_name?.charAt(0).toUpperCase() || "S"}
                </div>
                {editing ? (
                  <input
                    type="text"
                    value={editForm.full_name}
                    onChange={(e) => setEditForm({ ...editForm, full_name: e.target.value })}
                    className="text-xl font-bold text-foreground text-center bg-transparent border-b border-primary focus:outline-none"
                    placeholder="Your name"
                  />
                ) : (
                  <h4 className="text-xl font-bold text-foreground">{profile?.full_name || "Student"}</h4>
                )}
                <p className="text-sm text-muted-foreground flex items-center gap-1 mt-1">
                  <Mail className="h-3 w-3" />
                  {profile?.email}
                </p>
              </div>

              <div className="space-y-3">
                <div className="flex items-center gap-3 p-3 rounded-xl bg-muted/30">
                  <GraduationCap className="h-5 w-5 text-primary" />
                  <div>
                    <p className="text-xs text-muted-foreground">Education</p>
                    <p className="text-sm font-medium text-foreground">{profile?.education_level || "Not specified"}</p>
                  </div>
                </div>
                <div className="flex items-center gap-3 p-3 rounded-xl bg-muted/30">
                  <BookOpen className="h-5 w-5 text-emerald-500" />
                  <div>
                    <p className="text-xs text-muted-foreground">Field of Interest</p>
                    <p className="text-sm font-medium text-foreground">{profile?.field_of_interest || "Not specified"}</p>
                  </div>
                </div>
                <div className="flex items-center gap-3 p-3 rounded-xl bg-muted/30">
                  <Target className="h-5 w-5 text-pink-500" />
                  <div>
                    <p className="text-xs text-muted-foreground">Target Role</p>
                    {editing ? (
                      <input
                        type="text"
                        value={editForm.target_role}
                        onChange={(e) => setEditForm({ ...editForm, target_role: e.target.value })}
                        className="text-sm font-medium text-foreground bg-transparent border-b border-primary focus:outline-none w-full"
                        placeholder="Your target role"
                      />
                    ) : (
                      <p className="text-sm font-medium text-foreground">{profile?.target_role || "Not specified"}</p>
                    )}
                  </div>
                </div>
                <div className="flex items-center gap-3 p-3 rounded-xl bg-muted/30">
                  <Calendar className="h-5 w-5 text-violet-500" />
                  <div>
                    <p className="text-xs text-muted-foreground">Member Since</p>
                    <p className="text-sm font-medium text-foreground">
                      {new Date(profile?.created_at || Date.now()).toLocaleDateString()}
                    </p>
                  </div>
                </div>
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div className="rounded-xl border border-border bg-card/50 backdrop-blur-sm p-4 text-center">
                <Trophy className="h-6 w-6 text-amber-500 mx-auto mb-2" />
                <p className="text-2xl font-bold text-foreground">{avgScore}%</p>
                <p className="text-xs text-muted-foreground">Avg Score</p>
              </div>
              <div className="rounded-xl border border-border bg-card/50 backdrop-blur-sm p-4 text-center">
                <CheckCircle2 className="h-6 w-6 text-green-500 mx-auto mb-2" />
                <p className="text-2xl font-bold text-foreground">{totalCompleted}</p>
                <p className="text-xs text-muted-foreground">Completed</p>
              </div>
              <div className="rounded-xl border border-border bg-card/50 backdrop-blur-sm p-4 text-center">
                <Clock className="h-6 w-6 text-cyan-500 mx-auto mb-2" />
                <p className="text-2xl font-bold text-foreground">{studyDays}</p>
                <p className="text-xs text-muted-foreground">Days Active</p>
              </div>
              <div className="rounded-xl border border-border bg-card/50 backdrop-blur-sm p-4 text-center">
                <BarChart3 className="h-6 w-6 text-purple-500 mx-auto mb-2" />
                <p className="text-2xl font-bold text-foreground">{submissions.length}</p>
                <p className="text-xs text-muted-foreground">Assessments</p>
              </div>
            </div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="lg:col-span-2 space-y-6"
          >
            <div className="rounded-2xl border border-border bg-card/50 backdrop-blur-sm p-6">
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-lg font-bold text-foreground flex items-center gap-2">
                  <AlertTriangle className="h-5 w-5 text-amber-500" />
                  Weak Topics
                </h3>
                <Badge className="bg-amber-500/10 text-amber-500">{weakTopics.length} areas</Badge>
              </div>
              {weakTopics.length > 0 ? (
                <div className="space-y-3">
                  {weakTopics.map((weak, i) => (
                    <motion.div
                      key={weak.id}
                      initial={{ opacity: 0, x: -20 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: i * 0.05 }}
                      className="flex items-center justify-between p-3 rounded-xl border border-border bg-card/50"
                    >
                      <div className="flex-1">
                        <p className="font-medium text-foreground">{weak.topic?.name || "Unknown Topic"}</p>
                        <p className="text-xs text-muted-foreground">
                          {weak.topic?.chapter?.subject?.name} → {weak.topic?.chapter?.name}
                        </p>
                      </div>
                      <div className="text-right">
                        <p className={`text-lg font-bold ${weak.accuracy_percentage < 50 ? "text-red-500" : "text-amber-500"}`}>
                          {Math.round(weak.accuracy_percentage)}%
                        </p>
                        <p className="text-xs text-muted-foreground">{weak.attempts} attempts</p>
                      </div>
                    </motion.div>
                  ))}
                </div>
              ) : (
                <div className="text-center py-8">
                  <Sparkles className="h-10 w-10 text-green-500 mx-auto mb-2" />
                  <p className="text-muted-foreground">No weak topics identified yet!</p>
                  <p className="text-sm text-muted-foreground">Complete some assignments to see areas for improvement</p>
                </div>
              )}
            </div>

            <div className="rounded-2xl border border-border bg-card/50 backdrop-blur-sm p-6">
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-lg font-bold text-foreground flex items-center gap-2">
                  <TrendingUp className="h-5 w-5 text-primary" />
                  Recent Assessments
                </h3>
                <Link href="/analytics">
                  <Button variant="ghost" size="sm" className="text-primary">View All</Button>
                </Link>
              </div>
              {submissions.length > 0 ? (
                <div className="space-y-3">
                  {submissions.slice(0, 5).map((sub, i) => (
                    <motion.div
                      key={sub.id}
                      initial={{ opacity: 0, x: -20 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: i * 0.05 }}
                      className="flex items-center justify-between p-3 rounded-xl border border-border bg-card/50"
                    >
                      <div>
                        <p className="font-medium text-foreground">{sub.assignment?.title || "Assessment"}</p>
                        <p className="text-xs text-muted-foreground">
                          {new Date(sub.submitted_at).toLocaleDateString()}
                        </p>
                      </div>
                      <Badge className={`${
                        sub.percentage >= 70 ? "bg-green-500/10 text-green-500" :
                        sub.percentage >= 50 ? "bg-amber-500/10 text-amber-500" :
                        "bg-red-500/10 text-red-500"
                      }`}>
                        {sub.score}/{sub.total_marks} ({sub.percentage}%)
                      </Badge>
                    </motion.div>
                  ))}
                </div>
              ) : (
                <div className="text-center py-8">
                  <Brain className="h-10 w-10 text-muted-foreground mx-auto mb-2" />
                  <p className="text-muted-foreground">No assessments completed yet</p>
                  <Link href="/assignments">
                    <Button className="mt-4 bg-gradient-to-r from-primary to-cyan-500 text-white">
                      Start Learning
                    </Button>
                  </Link>
                </div>
              )}
            </div>

            <div className="rounded-2xl border border-border bg-card/50 backdrop-blur-sm p-6">
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-lg font-bold text-foreground flex items-center gap-2">
                  <CheckCircle2 className="h-5 w-5 text-green-500" />
                  Learning History
                </h3>
                <Link href="/subjects">
                  <Button variant="ghost" size="sm" className="text-primary">View All</Button>
                </Link>
              </div>
              {topicProgress.length > 0 ? (
                <div className="space-y-2">
                  {topicProgress.slice(0, 5).map((prog, i) => (
                    <motion.div
                      key={prog.id}
                      initial={{ opacity: 0, x: -20 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: i * 0.05 }}
                      className="flex items-center gap-3 p-2 rounded-lg"
                    >
                      <div className="h-2 w-2 rounded-full bg-green-500" />
                      <span className="flex-1 text-sm text-foreground">{prog.topic?.name || "Topic"}</span>
                      <span className="text-xs text-muted-foreground">
                        {new Date(prog.completed_at).toLocaleDateString()}
                      </span>
                    </motion.div>
                  ))}
                </div>
              ) : (
                <div className="text-center py-8">
                  <BookOpen className="h-10 w-10 text-muted-foreground mx-auto mb-2" />
                  <p className="text-muted-foreground">No topics completed yet</p>
                </div>
              )}
            </div>
          </motion.div>
        </div>
      </main>
    </div>
  );
}
