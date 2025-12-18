"use client";

import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
  Calendar,
  CheckCircle2,
  Circle,
  Clock,
  Target,
  Sparkles,
  Home,
  Sun,
  Moon,
  Plus,
  Trash2,
  Brain,
  BookOpen,
  FileQuestion,
  ChevronLeft,
  ChevronRight,
} from "lucide-react";
import Link from "next/link";
import { createClient } from "@/lib/supabase/client";
import { useRouter } from "next/navigation";
import { motion } from "framer-motion";
import { useTheme } from "@/components/ThemeProvider";

interface StudyPlan {
  id: string;
  plan_date: string;
  topics: { id: string; name: string; completed: boolean }[];
  assignments: { id: string; title: string; completed: boolean }[];
  goals: { id: string; text: string; completed: boolean }[];
  completed: boolean;
}

interface Topic {
  id: string;
  name: string;
  chapter: { name: string; subject: { name: string } };
}

interface Assignment {
  id: string;
  title: string;
  subject: { name: string };
}

export default function StudyPlanPage() {
  const router = useRouter();
  const { theme, toggleTheme } = useTheme();
  const [selectedDate, setSelectedDate] = useState(new Date());
  const [plan, setPlan] = useState<StudyPlan | null>(null);
  const [availableTopics, setAvailableTopics] = useState<Topic[]>([]);
  const [availableAssignments, setAvailableAssignments] = useState<Assignment[]>([]);
  const [loading, setLoading] = useState(true);
  const [userId, setUserId] = useState<string | null>(null);
  const [newGoal, setNewGoal] = useState("");

  useEffect(() => {
    loadData();
  }, [selectedDate]);

  async function loadData() {
    const supabase = createClient();
    const { data: { user } } = await supabase.auth.getUser();
    
    if (!user) {
      router.push("/login");
      return;
    }
    setUserId(user.id);

    const dateStr = selectedDate.toISOString().split("T")[0];
    
    const { data: planData } = await supabase
      .from("daily_study_plans")
      .select("*")
      .eq("user_id", user.id)
      .eq("plan_date", dateStr)
      .single();

    if (planData) {
      setPlan(planData as StudyPlan);
    } else {
      setPlan(null);
    }

    const { data: topicsData } = await supabase
      .from("topics")
      .select("id, name, chapter:chapters(name, subject:subjects(name))")
      .limit(20);

    if (topicsData) {
      setAvailableTopics(topicsData as unknown as Topic[]);
    }

    const { data: assignmentsData } = await supabase
      .from("assignments")
      .select("id, title, subject:subjects(name)")
      .limit(10);

    if (assignmentsData) {
      setAvailableAssignments(assignmentsData as unknown as Assignment[]);
    }

    setLoading(false);
  }

  async function createPlan() {
    if (!userId) return;
    
    const supabase = createClient();
    const dateStr = selectedDate.toISOString().split("T")[0];
    
    const defaultTopics = availableTopics.slice(0, 3).map(t => ({ id: t.id, name: t.name, completed: false }));
    const defaultAssignments = availableAssignments.slice(0, 1).map(a => ({ id: a.id, title: a.title, completed: false }));
    const defaultGoals = [
      { id: "1", text: "Complete at least 2 topics", completed: false },
      { id: "2", text: "Take one practice quiz", completed: false },
      { id: "3", text: "Review yesterday's weak areas", completed: false },
    ];

    const { data } = await supabase
      .from("daily_study_plans")
      .insert({
        user_id: userId,
        plan_date: dateStr,
        topics: defaultTopics,
        assignments: defaultAssignments,
        goals: defaultGoals,
        completed: false
      })
      .select()
      .single();

    if (data) {
      setPlan(data as StudyPlan);
    }
  }

  async function updatePlan(updates: Partial<StudyPlan>) {
    if (!plan || !userId) return;
    
    const supabase = createClient();
    await supabase
      .from("daily_study_plans")
      .update(updates)
      .eq("id", plan.id);

    setPlan({ ...plan, ...updates });
  }

  function toggleTopicComplete(topicId: string) {
    if (!plan) return;
    const updatedTopics = plan.topics.map(t => 
      t.id === topicId ? { ...t, completed: !t.completed } : t
    );
    updatePlan({ topics: updatedTopics });
  }

  function toggleAssignmentComplete(assignmentId: string) {
    if (!plan) return;
    const updatedAssignments = plan.assignments.map(a => 
      a.id === assignmentId ? { ...a, completed: !a.completed } : a
    );
    updatePlan({ assignments: updatedAssignments });
  }

  function toggleGoalComplete(goalId: string) {
    if (!plan) return;
    const updatedGoals = plan.goals.map(g => 
      g.id === goalId ? { ...g, completed: !g.completed } : g
    );
    updatePlan({ goals: updatedGoals });
  }

  function addGoal() {
    if (!plan || !newGoal.trim()) return;
    const updatedGoals = [...plan.goals, { id: Date.now().toString(), text: newGoal.trim(), completed: false }];
    updatePlan({ goals: updatedGoals });
    setNewGoal("");
  }

  function removeGoal(goalId: string) {
    if (!plan) return;
    const updatedGoals = plan.goals.filter(g => g.id !== goalId);
    updatePlan({ goals: updatedGoals });
  }

  function changeDate(days: number) {
    const newDate = new Date(selectedDate);
    newDate.setDate(newDate.getDate() + days);
    setSelectedDate(newDate);
    setLoading(true);
  }

  function formatDate(date: Date): string {
    return date.toLocaleDateString("en-US", { weekday: "long", month: "long", day: "numeric" });
  }

  function isToday(date: Date): boolean {
    const today = new Date();
    return date.toDateString() === today.toDateString();
  }

  const completedTopics = plan?.topics.filter(t => t.completed).length || 0;
  const totalTopics = plan?.topics.length || 0;
  const completedGoals = plan?.goals.filter(g => g.completed).length || 0;
  const totalGoals = plan?.goals.length || 0;

  if (loading) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-background">
        <div className="text-center">
          <Calendar className="mx-auto h-12 w-12 animate-pulse text-primary" />
          <p className="mt-4 text-muted-foreground font-medium">Loading study plan...</p>
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
                <div className="absolute inset-0 rounded-xl bg-gradient-to-br from-violet-500 to-purple-500 blur-lg opacity-50" />
                <div className="relative flex h-10 w-10 items-center justify-center rounded-xl bg-gradient-to-br from-violet-500 to-purple-500">
                  <Calendar className="h-5 w-5 text-white" />
                </div>
              </div>
              <div>
                <h1 className="text-lg font-bold text-foreground">Study Plan</h1>
                <p className="text-[10px] text-primary font-medium tracking-wide">DAILY SCHEDULE</p>
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
        <div className="mb-8">
          <div className="flex items-center justify-between mb-4 flex-wrap gap-4">
            <div className="flex items-center gap-4">
              <Button variant="outline" size="icon" onClick={() => changeDate(-1)}>
                <ChevronLeft className="h-4 w-4" />
              </Button>
              <div className="text-center">
                <h2 className="text-2xl font-bold text-foreground">{formatDate(selectedDate)}</h2>
                {isToday(selectedDate) && <Badge className="bg-primary/10 text-primary">Today</Badge>}
              </div>
              <Button variant="outline" size="icon" onClick={() => changeDate(1)}>
                <ChevronRight className="h-4 w-4" />
              </Button>
            </div>
            {!isToday(selectedDate) && (
              <Button variant="outline" onClick={() => setSelectedDate(new Date())}>
                Go to Today
              </Button>
            )}
          </div>
        </div>

        {!plan ? (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-center py-16"
          >
            <div className="mx-auto w-20 h-20 rounded-full bg-primary/10 flex items-center justify-center mb-4">
              <Calendar className="h-10 w-10 text-primary" />
            </div>
            <h3 className="text-xl font-bold text-foreground mb-2">No Study Plan for This Day</h3>
            <p className="text-muted-foreground mb-6">Create a personalized study plan to stay on track</p>
            <Button onClick={createPlan} className="bg-gradient-to-r from-violet-500 to-purple-500 text-white hover:from-violet-600 hover:to-purple-600">
              <Sparkles className="mr-2 h-4 w-4" />
              Generate AI Study Plan
            </Button>
          </motion.div>
        ) : (
          <div className="grid gap-6 lg:grid-cols-3">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="lg:col-span-2 space-y-6"
            >
              <div className="rounded-2xl border border-border bg-card/50 backdrop-blur-sm p-6">
                <div className="flex items-center justify-between mb-4">
                  <h3 className="text-lg font-bold text-foreground flex items-center gap-2">
                    <BookOpen className="h-5 w-5 text-primary" />
                    Topics to Study
                  </h3>
                  <Badge className="bg-primary/10 text-primary">{completedTopics}/{totalTopics}</Badge>
                </div>
                <div className="space-y-3">
                  {plan.topics.map((topic, i) => (
                    <motion.div
                      key={topic.id}
                      initial={{ opacity: 0, x: -20 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: i * 0.05 }}
                      className={`flex items-center gap-3 p-3 rounded-xl border transition-all cursor-pointer ${
                        topic.completed ? "border-green-500/30 bg-green-500/5" : "border-border bg-card/50 hover:border-primary/30"
                      }`}
                      onClick={() => toggleTopicComplete(topic.id)}
                    >
                      <div className={`h-6 w-6 rounded-full flex items-center justify-center ${topic.completed ? "bg-green-500" : "bg-muted"}`}>
                        {topic.completed ? <CheckCircle2 className="h-4 w-4 text-white" /> : <Circle className="h-4 w-4 text-muted-foreground" />}
                      </div>
                      <span className={`flex-1 ${topic.completed ? "line-through text-muted-foreground" : "text-foreground"}`}>{topic.name}</span>
                    </motion.div>
                  ))}
                </div>
              </div>

              <div className="rounded-2xl border border-border bg-card/50 backdrop-blur-sm p-6">
                <div className="flex items-center justify-between mb-4">
                  <h3 className="text-lg font-bold text-foreground flex items-center gap-2">
                    <FileQuestion className="h-5 w-5 text-pink-500" />
                    Assignments
                  </h3>
                </div>
                <div className="space-y-3">
                  {plan.assignments.map((assignment, i) => (
                    <motion.div
                      key={assignment.id}
                      initial={{ opacity: 0, x: -20 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: i * 0.05 }}
                      className={`flex items-center gap-3 p-3 rounded-xl border transition-all cursor-pointer ${
                        assignment.completed ? "border-green-500/30 bg-green-500/5" : "border-border bg-card/50 hover:border-primary/30"
                      }`}
                      onClick={() => toggleAssignmentComplete(assignment.id)}
                    >
                      <div className={`h-6 w-6 rounded-full flex items-center justify-center ${assignment.completed ? "bg-green-500" : "bg-muted"}`}>
                        {assignment.completed ? <CheckCircle2 className="h-4 w-4 text-white" /> : <Circle className="h-4 w-4 text-muted-foreground" />}
                      </div>
                      <span className={`flex-1 ${assignment.completed ? "line-through text-muted-foreground" : "text-foreground"}`}>{assignment.title}</span>
                      <Link href="/assignments">
                        <Button variant="ghost" size="sm" className="text-primary">Start</Button>
                      </Link>
                    </motion.div>
                  ))}
                </div>
              </div>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2 }}
              className="space-y-6"
            >
              <div className="rounded-2xl border border-border bg-card/50 backdrop-blur-sm p-6">
                <div className="flex items-center justify-between mb-4">
                  <h3 className="text-lg font-bold text-foreground flex items-center gap-2">
                    <Target className="h-5 w-5 text-amber-500" />
                    Daily Goals
                  </h3>
                  <Badge className="bg-amber-500/10 text-amber-500">{completedGoals}/{totalGoals}</Badge>
                </div>
                <div className="space-y-3 mb-4">
                  {plan.goals.map((goal, i) => (
                    <motion.div
                      key={goal.id}
                      initial={{ opacity: 0, x: -20 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: i * 0.05 }}
                      className={`flex items-center gap-3 p-3 rounded-xl border transition-all ${
                        goal.completed ? "border-green-500/30 bg-green-500/5" : "border-border bg-card/50"
                      }`}
                    >
                      <button
                        onClick={() => toggleGoalComplete(goal.id)}
                        className={`h-5 w-5 rounded-full flex items-center justify-center shrink-0 ${goal.completed ? "bg-green-500" : "bg-muted"}`}
                      >
                        {goal.completed && <CheckCircle2 className="h-3 w-3 text-white" />}
                      </button>
                      <span className={`flex-1 text-sm ${goal.completed ? "line-through text-muted-foreground" : "text-foreground"}`}>{goal.text}</span>
                      <button onClick={() => removeGoal(goal.id)} className="text-muted-foreground hover:text-red-500">
                        <Trash2 className="h-4 w-4" />
                      </button>
                    </motion.div>
                  ))}
                </div>
                <div className="flex gap-2">
                  <input
                    type="text"
                    value={newGoal}
                    onChange={(e) => setNewGoal(e.target.value)}
                    placeholder="Add a goal..."
                    className="flex-1 px-3 py-2 rounded-lg border border-border bg-background text-foreground text-sm placeholder:text-muted-foreground focus:border-primary focus:outline-none"
                    onKeyDown={(e) => e.key === "Enter" && addGoal()}
                  />
                  <Button size="sm" onClick={addGoal} className="bg-amber-500 text-white hover:bg-amber-600">
                    <Plus className="h-4 w-4" />
                  </Button>
                </div>
              </div>

              <div className="rounded-2xl border border-border bg-gradient-to-br from-violet-500/10 to-purple-500/10 backdrop-blur-sm p-6">
                <div className="flex items-center gap-2 mb-4">
                  <Brain className="h-5 w-5 text-violet-500" />
                  <h3 className="text-lg font-bold text-foreground">AI Suggestion</h3>
                </div>
                <p className="text-sm text-muted-foreground mb-4">
                  Based on your progress, focus on completing the JavaScript topics today. 
                  You're making great progress in HTML & CSS!
                </p>
                <div className="flex items-center gap-2 text-xs text-muted-foreground">
                  <Clock className="h-3 w-3" />
                  <span>Estimated study time: 2.5 hours</span>
                </div>
              </div>

              <div className="rounded-2xl border border-border bg-card/50 backdrop-blur-sm p-6">
                <h3 className="text-lg font-bold text-foreground mb-4">Progress</h3>
                <div className="space-y-4">
                  <div>
                    <div className="flex justify-between text-sm mb-1">
                      <span className="text-muted-foreground">Topics</span>
                      <span className="text-foreground font-medium">{Math.round((completedTopics / Math.max(totalTopics, 1)) * 100)}%</span>
                    </div>
                    <div className="w-full bg-muted rounded-full h-2">
                      <div className="bg-gradient-to-r from-emerald-500 to-teal-500 h-2 rounded-full transition-all" style={{ width: `${(completedTopics / Math.max(totalTopics, 1)) * 100}%` }} />
                    </div>
                  </div>
                  <div>
                    <div className="flex justify-between text-sm mb-1">
                      <span className="text-muted-foreground">Goals</span>
                      <span className="text-foreground font-medium">{Math.round((completedGoals / Math.max(totalGoals, 1)) * 100)}%</span>
                    </div>
                    <div className="w-full bg-muted rounded-full h-2">
                      <div className="bg-gradient-to-r from-amber-500 to-orange-500 h-2 rounded-full transition-all" style={{ width: `${(completedGoals / Math.max(totalGoals, 1)) * 100}%` }} />
                    </div>
                  </div>
                </div>
              </div>
            </motion.div>
          </div>
        )}
      </main>
    </div>
  );
}
