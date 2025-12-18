"use client";

import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
  BookOpen,
  ChevronRight,
  Clock,
  CheckCircle2,
  Circle,
  Lock,
  Play,
  ArrowLeft,
  Home,
  Sun,
  Moon,
  Layers,
  Target,
  Trophy,
  Sparkles,
} from "lucide-react";
import Link from "next/link";
import { createClient } from "@/lib/supabase/client";
import { useRouter } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";
import { useTheme } from "@/components/ThemeProvider";

interface Subject {
  id: string;
  name: string;
  description: string;
  icon: string;
  color: string;
  field_of_interest: string;
  order_index: number;
  chapters: Chapter[];
}

interface Chapter {
  id: string;
  name: string;
  description: string;
  order_index: number;
  estimated_hours: number;
  difficulty: string;
  topics: Topic[];
}

interface Topic {
  id: string;
  name: string;
  description: string;
  order_index: number;
  estimated_minutes: number;
}

interface TopicProgress {
  topic_id: string;
  status: string;
  completed_at: string | null;
}

type ViewType = "subjects" | "chapters" | "topics";

export default function SubjectsPage() {
  const router = useRouter();
  const { theme, toggleTheme } = useTheme();
  const [view, setView] = useState<ViewType>("subjects");
  const [subjects, setSubjects] = useState<Subject[]>([]);
  const [selectedSubject, setSelectedSubject] = useState<Subject | null>(null);
  const [selectedChapter, setSelectedChapter] = useState<Chapter | null>(null);
  const [progress, setProgress] = useState<TopicProgress[]>([]);
  const [loading, setLoading] = useState(true);
  const [userId, setUserId] = useState<string | null>(null);
  const [fieldOfInterest, setFieldOfInterest] = useState<string>("");

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
    setUserId(user.id);

    const { data: profileArr } = await supabase
      .from("user_profiles")
      .select("field_of_interest, onboarding_completed")
      .eq("id", user.id);

    const profile = profileArr?.[0];

    if (!profile?.onboarding_completed) {
      router.push("/onboarding");
      return;
    }

    if (profile?.field_of_interest) {
      setFieldOfInterest(profile.field_of_interest);
    }

    const { data: subjectsData } = await supabase
      .from("subjects")
      .select(`
        *,
        chapters(
          *,
          topics(*)
        )
      `)
      .order("order_index", { ascending: true });

    if (subjectsData) {
      const filtered = profile?.field_of_interest
        ? subjectsData.filter((s: Subject) => s.field_of_interest === profile.field_of_interest)
        : subjectsData;
      setSubjects(filtered as Subject[]);
    }

    const { data: progressData } = await supabase
      .from("topic_progress")
      .select("*")
      .eq("user_id", user.id);

    if (progressData) {
      setProgress(progressData as TopicProgress[]);
    }

    setLoading(false);
  }

  async function markTopicComplete(topicId: string) {
    if (!userId) return;
    
    const supabase = createClient();
    await supabase.from("topic_progress").upsert({
      user_id: userId,
      topic_id: topicId,
      status: "completed",
      completed_at: new Date().toISOString()
    }, { onConflict: "user_id,topic_id" });

    setProgress(prev => {
      const existing = prev.find(p => p.topic_id === topicId);
      if (existing) {
        return prev.map(p => p.topic_id === topicId ? { ...p, status: "completed", completed_at: new Date().toISOString() } : p);
      }
      return [...prev, { topic_id: topicId, status: "completed", completed_at: new Date().toISOString() }];
    });
  }

  function getTopicStatus(topicId: string): string {
    const p = progress.find(p => p.topic_id === topicId);
    return p?.status || "not_started";
  }

  function getChapterProgress(chapter: Chapter): number {
    if (!chapter.topics || chapter.topics.length === 0) return 0;
    const completed = chapter.topics.filter(t => getTopicStatus(t.id) === "completed").length;
    return Math.round((completed / chapter.topics.length) * 100);
  }

  function getSubjectProgress(subject: Subject): number {
    if (!subject.chapters || subject.chapters.length === 0) return 0;
    const allTopics = subject.chapters.flatMap(c => c.topics || []);
    if (allTopics.length === 0) return 0;
    const completed = allTopics.filter(t => getTopicStatus(t.id) === "completed").length;
    return Math.round((completed / allTopics.length) * 100);
  }

  const colorMap: Record<string, string> = {
    orange: "from-orange-500 to-amber-500",
    yellow: "from-yellow-500 to-amber-500",
    cyan: "from-cyan-500 to-blue-500",
    green: "from-green-500 to-emerald-500",
    blue: "from-blue-500 to-indigo-500",
    purple: "from-purple-500 to-violet-500",
    pink: "from-pink-500 to-rose-500",
    red: "from-red-500 to-orange-500",
  };

  if (loading) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-background">
        <div className="text-center">
          <BookOpen className="mx-auto h-12 w-12 animate-pulse text-primary" />
          <p className="mt-4 text-muted-foreground font-medium">Loading subjects...</p>
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
                <div className="absolute inset-0 rounded-xl bg-gradient-to-br from-emerald-500 to-teal-500 blur-lg opacity-50" />
                <div className="relative flex h-10 w-10 items-center justify-center rounded-xl bg-gradient-to-br from-emerald-500 to-teal-500">
                  <BookOpen className="h-5 w-5 text-white" />
                </div>
              </div>
              <div>
                <h1 className="text-lg font-bold text-foreground">Subjects</h1>
                <p className="text-[10px] text-primary font-medium tracking-wide">LEARNING PATH</p>
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
          </div>
        </div>
      </header>

      <main className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8 relative">
        <AnimatePresence mode="wait">
          {view === "subjects" && (
            <motion.div
              key="subjects"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
            >
              <div className="mb-8">
                <h2 className="text-3xl font-bold text-foreground mb-2">Your Learning Path</h2>
                <p className="text-muted-foreground">
                  {fieldOfInterest ? `Master ${fieldOfInterest} step by step` : "Select a subject to begin learning"}
                </p>
              </div>

              <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
                <div className="rounded-xl border border-border bg-card/50 backdrop-blur-sm p-4">
                  <div className="flex items-center gap-3">
                    <div className="h-10 w-10 rounded-lg bg-blue-500/10 flex items-center justify-center">
                      <BookOpen className="h-5 w-5 text-blue-500" />
                    </div>
                    <div>
                      <p className="text-2xl font-bold text-foreground">{subjects.length}</p>
                      <p className="text-xs text-muted-foreground">Subjects</p>
                    </div>
                  </div>
                </div>
                <div className="rounded-xl border border-border bg-card/50 backdrop-blur-sm p-4">
                  <div className="flex items-center gap-3">
                    <div className="h-10 w-10 rounded-lg bg-purple-500/10 flex items-center justify-center">
                      <Layers className="h-5 w-5 text-purple-500" />
                    </div>
                    <div>
                      <p className="text-2xl font-bold text-foreground">{subjects.reduce((a, s) => a + (s.chapters?.length || 0), 0)}</p>
                      <p className="text-xs text-muted-foreground">Chapters</p>
                    </div>
                  </div>
                </div>
                <div className="rounded-xl border border-border bg-card/50 backdrop-blur-sm p-4">
                  <div className="flex items-center gap-3">
                    <div className="h-10 w-10 rounded-lg bg-green-500/10 flex items-center justify-center">
                      <CheckCircle2 className="h-5 w-5 text-green-500" />
                    </div>
                    <div>
                      <p className="text-2xl font-bold text-foreground">{progress.filter(p => p.status === "completed").length}</p>
                      <p className="text-xs text-muted-foreground">Completed</p>
                    </div>
                  </div>
                </div>
                <div className="rounded-xl border border-border bg-card/50 backdrop-blur-sm p-4">
                  <div className="flex items-center gap-3">
                    <div className="h-10 w-10 rounded-lg bg-amber-500/10 flex items-center justify-center">
                      <Trophy className="h-5 w-5 text-amber-500" />
                    </div>
                    <div>
                      <p className="text-2xl font-bold text-foreground">
                        {subjects.length > 0 ? Math.round(subjects.reduce((a, s) => a + getSubjectProgress(s), 0) / subjects.length) : 0}%
                      </p>
                      <p className="text-xs text-muted-foreground">Overall</p>
                    </div>
                  </div>
                </div>
              </div>

              <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
                {subjects.map((subject, i) => {
                  const prog = getSubjectProgress(subject);
                  const gradient = colorMap[subject.color] || "from-blue-500 to-indigo-500";
                  
                  return (
                    <motion.div
                      key={subject.id}
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: i * 0.1 }}
                    >
                      <button
                        onClick={() => { setSelectedSubject(subject); setView("chapters"); }}
                        className="w-full text-left rounded-2xl border border-border bg-card/50 backdrop-blur-sm p-6 hover:border-primary/30 transition-all group"
                      >
                        <div className={`mb-4 inline-flex h-12 w-12 items-center justify-center rounded-xl bg-gradient-to-br ${gradient} shadow-lg transition-transform group-hover:scale-110`}>
                          <BookOpen className="h-6 w-6 text-white" />
                        </div>
                        <h3 className="text-xl font-bold text-foreground mb-1 group-hover:text-primary transition-colors">{subject.name}</h3>
                        <p className="text-sm text-muted-foreground mb-4">{subject.description}</p>
                        <div className="flex items-center justify-between text-sm text-muted-foreground mb-2">
                          <span>{subject.chapters?.length || 0} chapters</span>
                          <span>{prog}% complete</span>
                        </div>
                        <div className="w-full bg-muted rounded-full h-2">
                          <div className={`bg-gradient-to-r ${gradient} h-2 rounded-full transition-all`} style={{ width: `${prog}%` }} />
                        </div>
                      </button>
                    </motion.div>
                  );
                })}
              </div>
            </motion.div>
          )}

          {view === "chapters" && selectedSubject && (
            <motion.div
              key="chapters"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
            >
              <Button variant="ghost" onClick={() => setView("subjects")} className="mb-6 text-muted-foreground hover:text-foreground">
                <ArrowLeft className="mr-2 h-4 w-4" />
                Back to Subjects
              </Button>

              <div className="mb-8">
                <Badge className="mb-2 bg-primary/10 text-primary">{selectedSubject.field_of_interest}</Badge>
                <h2 className="text-3xl font-bold text-foreground mb-2">{selectedSubject.name}</h2>
                <p className="text-muted-foreground">{selectedSubject.description}</p>
              </div>

              <div className="space-y-4">
                {selectedSubject.chapters?.sort((a, b) => a.order_index - b.order_index).map((chapter, i) => {
                  const prog = getChapterProgress(chapter);
                  const isCompleted = prog === 100;
                  
                  return (
                    <motion.div
                      key={chapter.id}
                      initial={{ opacity: 0, x: -20 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: i * 0.1 }}
                    >
                      <button
                        onClick={() => { setSelectedChapter(chapter); setView("topics"); }}
                        className="w-full text-left rounded-2xl border border-border bg-card/50 backdrop-blur-sm p-6 hover:border-primary/30 transition-all"
                      >
                        <div className="flex items-start gap-4">
                          <div className={`h-12 w-12 rounded-xl flex items-center justify-center shrink-0 ${isCompleted ? "bg-green-500/20" : "bg-primary/10"}`}>
                            {isCompleted ? (
                              <CheckCircle2 className="h-6 w-6 text-green-500" />
                            ) : (
                              <span className="text-xl font-bold text-primary">{i + 1}</span>
                            )}
                          </div>
                          <div className="flex-1 min-w-0">
                            <div className="flex items-center gap-2 mb-1 flex-wrap">
                              <h3 className="text-lg font-bold text-foreground">{chapter.name}</h3>
                              <Badge className={`${
                                chapter.difficulty === "easy" ? "bg-green-500/10 text-green-500" :
                                chapter.difficulty === "medium" ? "bg-amber-500/10 text-amber-500" :
                                "bg-red-500/10 text-red-500"
                              }`}>
                                {chapter.difficulty}
                              </Badge>
                            </div>
                            <p className="text-sm text-muted-foreground mb-3">{chapter.description}</p>
                            <div className="flex items-center gap-4 text-sm text-muted-foreground">
                              <span className="flex items-center gap-1">
                                <Target className="h-4 w-4" />
                                {chapter.topics?.length || 0} topics
                              </span>
                              <span className="flex items-center gap-1">
                                <Clock className="h-4 w-4" />
                                {chapter.estimated_hours}h
                              </span>
                            </div>
                            <div className="mt-3 w-full bg-muted rounded-full h-2">
                              <div className="bg-gradient-to-r from-emerald-500 to-teal-500 h-2 rounded-full transition-all" style={{ width: `${prog}%` }} />
                            </div>
                          </div>
                          <ChevronRight className="h-5 w-5 text-muted-foreground shrink-0" />
                        </div>
                      </button>
                    </motion.div>
                  );
                })}
              </div>
            </motion.div>
          )}

          {view === "topics" && selectedChapter && (
            <motion.div
              key="topics"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
            >
              <Button variant="ghost" onClick={() => setView("chapters")} className="mb-6 text-muted-foreground hover:text-foreground">
                <ArrowLeft className="mr-2 h-4 w-4" />
                Back to Chapters
              </Button>

              <div className="mb-8">
                <Badge className="mb-2 bg-primary/10 text-primary">{selectedSubject?.name}</Badge>
                <h2 className="text-3xl font-bold text-foreground mb-2">{selectedChapter.name}</h2>
                <p className="text-muted-foreground">{selectedChapter.description}</p>
              </div>

              <div className="space-y-3">
                {selectedChapter.topics?.sort((a, b) => a.order_index - b.order_index).map((topic, i) => {
                  const status = getTopicStatus(topic.id);
                  const isCompleted = status === "completed";
                  const prevTopicCompleted = i === 0 || getTopicStatus(selectedChapter.topics[i - 1]?.id) === "completed";
                  const isLocked = i > 0 && !prevTopicCompleted;
                  
                  return (
                    <motion.div
                      key={topic.id}
                      initial={{ opacity: 0, x: -20 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: i * 0.05 }}
                      className={`rounded-xl border p-4 transition-all ${
                        isCompleted ? "border-green-500/30 bg-green-500/5" :
                        isLocked ? "border-border bg-muted/30 opacity-60" :
                        "border-border bg-card/50 hover:border-primary/30"
                      }`}
                    >
                      <div className="flex items-center gap-4">
                        <div className={`h-10 w-10 rounded-lg flex items-center justify-center shrink-0 ${
                          isCompleted ? "bg-green-500" :
                          isLocked ? "bg-muted" :
                          "bg-primary/10"
                        }`}>
                          {isCompleted ? (
                            <CheckCircle2 className="h-5 w-5 text-white" />
                          ) : isLocked ? (
                            <Lock className="h-5 w-5 text-muted-foreground" />
                          ) : (
                            <Circle className="h-5 w-5 text-primary" />
                          )}
                        </div>
                        <div className="flex-1 min-w-0">
                          <h4 className="font-semibold text-foreground">{topic.name}</h4>
                          <p className="text-sm text-muted-foreground">{topic.description}</p>
                          <div className="flex items-center gap-2 mt-1 text-xs text-muted-foreground">
                            <Clock className="h-3 w-3" />
                            <span>{topic.estimated_minutes} min</span>
                          </div>
                        </div>
                        {!isLocked && !isCompleted && (
                          <Button
                            size="sm"
                            onClick={() => markTopicComplete(topic.id)}
                            className="bg-gradient-to-r from-emerald-500 to-teal-500 text-white hover:from-emerald-600 hover:to-teal-600"
                          >
                            <Play className="mr-1 h-4 w-4" />
                            Complete
                          </Button>
                        )}
                        {isCompleted && (
                          <Badge className="bg-green-500/10 text-green-500">
                            <Sparkles className="mr-1 h-3 w-3" />
                            Done
                          </Badge>
                        )}
                      </div>
                    </motion.div>
                  );
                })}
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </main>
    </div>
  );
}
