"use client";

import { useState, useEffect, useCallback } from "react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
  FileQuestion,
  Clock,
  Target,
  Trophy,
  ChevronRight,
  Play,
  CheckCircle2,
  XCircle,
  AlertCircle,
  ArrowLeft,
  Timer,
  Lightbulb,
  RefreshCw,
  Save,
  Send,
  GraduationCap,
  Sun,
  Moon,
  Home,
  BarChart3,
  BookOpen,
  Brain,
  Sparkles,
} from "lucide-react";
import Link from "next/link";
import { createClient } from "@/lib/supabase/client";
import { useRouter } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";
import { useTheme } from "@/components/ThemeProvider";

interface Assignment {
  id: string;
  title: string;
  description: string;
  difficulty: string;
  assignment_type: string;
  total_marks: number;
  time_limit_minutes: number | null;
  attempt_limit: number;
  subject: { name: string; color: string };
  chapter: { name: string };
  questions: Question[];
}

interface Question {
  id: string;
  question_type: string;
  question_text: string;
  options: string[];
  correct_answer: string;
  explanation: string;
  common_mistakes: string;
  marks: number;
  order_index: number;
}

interface Submission {
  id: string;
  assignment_id: string;
  score: number;
  total_marks: number;
  percentage: number;
  attempt_number: number;
  submitted_at: string;
}

type ViewType = "list" | "take" | "result";

export default function AssignmentsPage() {
  const router = useRouter();
  const { theme, toggleTheme } = useTheme();
  const [view, setView] = useState<ViewType>("list");
  const [assignments, setAssignments] = useState<Assignment[]>([]);
  const [submissions, setSubmissions] = useState<Submission[]>([]);
  const [currentAssignment, setCurrentAssignment] = useState<Assignment | null>(null);
  const [answers, setAnswers] = useState<Record<string, string>>({});
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [timeLeft, setTimeLeft] = useState<number | null>(null);
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [result, setResult] = useState<{score: number; total: number; percentage: number; details: {questionId: string; correct: boolean; explanation: string}[]} | null>(null);
  const [showHint, setShowHint] = useState(false);
  const [userId, setUserId] = useState<string | null>(null);
  const [fieldOfInterest, setFieldOfInterest] = useState<string>("");

  useEffect(() => {
    loadData();
  }, []);

  useEffect(() => {
    if (timeLeft === null || timeLeft <= 0) return;
    const timer = setInterval(() => {
      setTimeLeft(prev => {
        if (prev === null || prev <= 1) {
          handleSubmit();
          return 0;
        }
        return prev - 1;
      });
    }, 1000);
    return () => clearInterval(timer);
  }, [timeLeft]);

  async function loadData() {
    const supabase = createClient();
    const { data: { user } } = await supabase.auth.getUser();
    
    if (!user) {
      router.push("/login");
      return;
    }
    setUserId(user.id);

    const { data: profileData } = await supabase
      .from("user_profiles")
      .select("field_of_interest, onboarding_completed")
      .eq("id", user.id);

    const profile = profileData?.[0];
    
    if (profile && !profile.onboarding_completed) {
      router.push("/onboarding");
      return;
    }

    if (profile?.field_of_interest) {
      setFieldOfInterest(profile.field_of_interest);
    }

    const { data: assignmentsData } = await supabase
      .from("assignments")
      .select(`
        *,
        subject:subjects(name, color, field_of_interest),
        chapter:chapters(name),
        questions(*)
      `)
      .order("created_at", { ascending: false });

    if (assignmentsData) {
      const filtered = assignmentsData.filter((a: Assignment & { subject: { field_of_interest?: string } }) => {
        if (!profile?.field_of_interest) return true;
        if (!a.subject?.field_of_interest) return true;
        return a.subject.field_of_interest.toLowerCase() === profile.field_of_interest.toLowerCase();
      });
      setAssignments(filtered as Assignment[]);
    }

    const { data: submissionsData } = await supabase
      .from("assignment_submissions")
      .select("*")
      .eq("user_id", user.id)
      .order("submitted_at", { ascending: false });

    if (submissionsData) {
      setSubmissions(submissionsData as Submission[]);
    }

    setLoading(false);
  }

  function startAssignment(assignment: Assignment) {
    const existingAttempts = submissions.filter(s => s.assignment_id === assignment.id).length;
    if (existingAttempts >= assignment.attempt_limit) {
      alert(`You have reached the maximum attempts (${assignment.attempt_limit}) for this assignment.`);
      return;
    }
    
    setCurrentAssignment(assignment);
    setAnswers({});
    setCurrentQuestionIndex(0);
    setShowHint(false);
    setResult(null);
    if (assignment.time_limit_minutes) {
      setTimeLeft(assignment.time_limit_minutes * 60);
    }
    setView("take");
  }

  const handleSubmit = useCallback(async () => {
    if (!currentAssignment || !userId || submitting) return;
    setSubmitting(true);

    let score = 0;
    const details: {questionId: string; correct: boolean; explanation: string}[] = [];
    
    currentAssignment.questions.forEach(q => {
      const userAnswer = answers[q.id]?.trim().toLowerCase();
      const correctAnswer = q.correct_answer.trim().toLowerCase();
      const isCorrect = userAnswer === correctAnswer;
      
      if (isCorrect) {
        score += q.marks;
      }
      
      details.push({
        questionId: q.id,
        correct: isCorrect,
        explanation: q.explanation
      });
    });

    const totalMarks = currentAssignment.questions.reduce((sum, q) => sum + q.marks, 0);
    const percentage = Math.round((score / totalMarks) * 100);

    const existingAttempts = submissions.filter(s => s.assignment_id === currentAssignment.id).length;

    const supabase = createClient();
    await supabase.from("assignment_submissions").insert({
      user_id: userId,
      assignment_id: currentAssignment.id,
      answers: answers,
      score: score,
      total_marks: totalMarks,
      percentage: percentage,
      attempt_number: existingAttempts + 1,
      status: "submitted"
    });

    const wrongQuestions = details.filter(d => !d.correct);
    if (wrongQuestions.length > 0) {
      for (const wrongQ of wrongQuestions) {
        const question = currentAssignment.questions.find(q => q.id === wrongQ.questionId);
        if (question) {
          await supabase.from("weak_topics").upsert({
            user_id: userId,
            topic_id: currentAssignment.chapter_id,
            accuracy_percentage: percentage,
            attempts: existingAttempts + 1,
            last_attempt_at: new Date().toISOString()
          }, { onConflict: "user_id,topic_id" });
        }
      }
    }

    setResult({ score, total: totalMarks, percentage, details });
    setTimeLeft(null);
    setView("result");
    setSubmitting(false);
    loadData();
  }, [currentAssignment, userId, answers, submitting, submissions]);

  function formatTime(seconds: number): string {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs.toString().padStart(2, "0")}`;
  }

  function getAttemptCount(assignmentId: string): number {
    return submissions.filter(s => s.assignment_id === assignmentId).length;
  }

  function getBestScore(assignmentId: string): number | null {
    const attemptScores = submissions
      .filter(s => s.assignment_id === assignmentId)
      .map(s => s.percentage);
    return attemptScores.length > 0 ? Math.max(...attemptScores) : null;
  }

  if (loading) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-background">
        <div className="text-center">
          <FileQuestion className="mx-auto h-12 w-12 animate-pulse text-primary" />
          <p className="mt-4 text-muted-foreground font-medium">Loading assignments...</p>
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
                <div className="absolute inset-0 rounded-xl bg-gradient-to-br from-pink-500 to-rose-500 blur-lg opacity-50" />
                <div className="relative flex h-10 w-10 items-center justify-center rounded-xl bg-gradient-to-br from-pink-500 to-rose-500">
                  <FileQuestion className="h-5 w-5 text-white" />
                </div>
              </div>
              <div>
                <h1 className="text-lg font-bold text-foreground">Assignments</h1>
                <p className="text-[10px] text-primary font-medium tracking-wide">PRACTICE & TEST</p>
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
          {view === "list" && (
            <motion.div
              key="list"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
            >
              <div className="mb-8">
                <h2 className="text-3xl font-bold text-foreground mb-2">Your Assignments</h2>
                <p className="text-muted-foreground">Practice and test your knowledge with interactive assessments</p>
              </div>

              <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
                <div className="rounded-xl border border-border bg-card/50 backdrop-blur-sm p-4">
                  <div className="flex items-center gap-3">
                    <div className="h-10 w-10 rounded-lg bg-blue-500/10 flex items-center justify-center">
                      <BookOpen className="h-5 w-5 text-blue-500" />
                    </div>
                    <div>
                      <p className="text-2xl font-bold text-foreground">{assignments.length}</p>
                      <p className="text-xs text-muted-foreground">Total</p>
                    </div>
                  </div>
                </div>
                <div className="rounded-xl border border-border bg-card/50 backdrop-blur-sm p-4">
                  <div className="flex items-center gap-3">
                    <div className="h-10 w-10 rounded-lg bg-green-500/10 flex items-center justify-center">
                      <CheckCircle2 className="h-5 w-5 text-green-500" />
                    </div>
                    <div>
                      <p className="text-2xl font-bold text-foreground">{new Set(submissions.map(s => s.assignment_id)).size}</p>
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
                        {submissions.length > 0 ? Math.round(submissions.reduce((a, b) => a + b.percentage, 0) / submissions.length) : 0}%
                      </p>
                      <p className="text-xs text-muted-foreground">Avg Score</p>
                    </div>
                  </div>
                </div>
                <div className="rounded-xl border border-border bg-card/50 backdrop-blur-sm p-4">
                  <div className="flex items-center gap-3">
                    <div className="h-10 w-10 rounded-lg bg-purple-500/10 flex items-center justify-center">
                      <BarChart3 className="h-5 w-5 text-purple-500" />
                    </div>
                    <div>
                      <p className="text-2xl font-bold text-foreground">{submissions.length}</p>
                      <p className="text-xs text-muted-foreground">Attempts</p>
                    </div>
                  </div>
                </div>
              </div>

              <div className="space-y-4">
                {assignments.map((assignment, i) => {
                  const attempts = getAttemptCount(assignment.id);
                  const bestScore = getBestScore(assignment.id);
                  const canAttempt = attempts < assignment.attempt_limit;
                  
                  return (
                    <motion.div
                      key={assignment.id}
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: i * 0.1 }}
                      className="rounded-2xl border border-border bg-card/50 backdrop-blur-sm p-6 hover:border-primary/30 transition-all"
                    >
                      <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4">
                        <div className="flex-1">
                          <div className="flex items-center gap-2 mb-2 flex-wrap">
                            <Badge className={`bg-${assignment.subject?.color || 'blue'}-500/10 text-${assignment.subject?.color || 'blue'}-500 border-${assignment.subject?.color || 'blue'}-500/20`}>
                              {assignment.subject?.name || "General"}
                            </Badge>
                            <Badge variant="outline" className="border-border">
                              {assignment.chapter?.name || "Chapter"}
                            </Badge>
                            <Badge className={`${
                              assignment.difficulty === "easy" ? "bg-green-500/10 text-green-500" :
                              assignment.difficulty === "medium" ? "bg-amber-500/10 text-amber-500" :
                              "bg-red-500/10 text-red-500"
                            }`}>
                              {assignment.difficulty}
                            </Badge>
                            <Badge className="bg-primary/10 text-primary border-primary/20">
                              {assignment.assignment_type}
                            </Badge>
                          </div>
                          <h3 className="text-xl font-bold text-foreground mb-1">{assignment.title}</h3>
                          <p className="text-sm text-muted-foreground mb-3">{assignment.description}</p>
                          <div className="flex items-center gap-4 text-sm text-muted-foreground flex-wrap">
                            <span className="flex items-center gap-1">
                              <FileQuestion className="h-4 w-4" />
                              {assignment.questions?.length || 0} questions
                            </span>
                            <span className="flex items-center gap-1">
                              <Target className="h-4 w-4" />
                              {assignment.total_marks} marks
                            </span>
                            {assignment.time_limit_minutes && (
                              <span className="flex items-center gap-1">
                                <Clock className="h-4 w-4" />
                                {assignment.time_limit_minutes} min
                              </span>
                            )}
                            <span className="flex items-center gap-1">
                              <RefreshCw className="h-4 w-4" />
                              {attempts}/{assignment.attempt_limit} attempts
                            </span>
                          </div>
                        </div>
                        <div className="flex flex-col items-end gap-2">
                          {bestScore !== null && (
                            <div className="text-right">
                              <p className="text-xs text-muted-foreground">Best Score</p>
                              <p className={`text-2xl font-bold ${bestScore >= 70 ? "text-green-500" : bestScore >= 50 ? "text-amber-500" : "text-red-500"}`}>
                                {bestScore}%
                              </p>
                            </div>
                          )}
                          <Button
                            onClick={() => startAssignment(assignment)}
                            disabled={!canAttempt}
                            className={canAttempt ? "bg-gradient-to-r from-pink-500 to-rose-500 text-white hover:from-pink-600 hover:to-rose-600" : ""}
                          >
                            {canAttempt ? (
                              <>
                                <Play className="mr-2 h-4 w-4" />
                                {attempts > 0 ? "Retry" : "Start"}
                              </>
                            ) : (
                              <>
                                <AlertCircle className="mr-2 h-4 w-4" />
                                Max Attempts
                              </>
                            )}
                          </Button>
                        </div>
                      </div>
                    </motion.div>
                  );
                })}
              </div>
            </motion.div>
          )}

          {view === "take" && currentAssignment && (
            <motion.div
              key="take"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
            >
              <div className="mb-6 flex items-center justify-between flex-wrap gap-4">
                <Button variant="ghost" onClick={() => setView("list")} className="text-muted-foreground hover:text-foreground">
                  <ArrowLeft className="mr-2 h-4 w-4" />
                  Back to Assignments
                </Button>
                {timeLeft !== null && (
                  <div className={`flex items-center gap-2 px-4 py-2 rounded-lg ${timeLeft < 60 ? "bg-red-500/10 text-red-500" : "bg-primary/10 text-primary"}`}>
                    <Timer className="h-5 w-5" />
                    <span className="text-lg font-bold font-mono">{formatTime(timeLeft)}</span>
                  </div>
                )}
              </div>

              <div className="rounded-2xl border border-border bg-card/50 backdrop-blur-sm p-6 mb-6">
                <div className="flex items-center justify-between mb-4 flex-wrap gap-2">
                  <h2 className="text-2xl font-bold text-foreground">{currentAssignment.title}</h2>
                  <Badge className="bg-primary/10 text-primary">
                    Question {currentQuestionIndex + 1} of {currentAssignment.questions.length}
                  </Badge>
                </div>
                
                <div className="w-full bg-muted rounded-full h-2 mb-6">
                  <div 
                    className="bg-gradient-to-r from-pink-500 to-rose-500 h-2 rounded-full transition-all duration-300"
                    style={{ width: `${((currentQuestionIndex + 1) / currentAssignment.questions.length) * 100}%` }}
                  />
                </div>

                {currentAssignment.questions[currentQuestionIndex] && (
                  <div>
                    <div className="flex items-center gap-2 mb-4">
                      <Badge variant="outline">{currentAssignment.questions[currentQuestionIndex].question_type.toUpperCase()}</Badge>
                      <Badge className="bg-amber-500/10 text-amber-500">{currentAssignment.questions[currentQuestionIndex].marks} marks</Badge>
                    </div>
                    
                    <p className="text-lg text-foreground mb-6">{currentAssignment.questions[currentQuestionIndex].question_text}</p>

                    {currentAssignment.questions[currentQuestionIndex].question_type === "mcq" && (
                      <div className="space-y-3">
                        {(currentAssignment.questions[currentQuestionIndex].options as string[]).map((option, i) => (
                          <button
                            key={i}
                            onClick={() => setAnswers(prev => ({ ...prev, [currentAssignment.questions[currentQuestionIndex].id]: option }))}
                            className={`w-full p-4 rounded-xl border text-left transition-all ${
                              answers[currentAssignment.questions[currentQuestionIndex].id] === option
                                ? "border-primary bg-primary/10 text-foreground"
                                : "border-border bg-card/50 text-muted-foreground hover:border-primary/50"
                            }`}
                          >
                            <span className="font-medium">{String.fromCharCode(65 + i)}.</span> {option}
                          </button>
                        ))}
                      </div>
                    )}

                    {currentAssignment.questions[currentQuestionIndex].question_type === "short_answer" && (
                      <input
                        type="text"
                        value={answers[currentAssignment.questions[currentQuestionIndex].id] || ""}
                        onChange={(e) => setAnswers(prev => ({ ...prev, [currentAssignment.questions[currentQuestionIndex].id]: e.target.value }))}
                        placeholder="Type your answer..."
                        className="w-full p-4 rounded-xl border border-border bg-card/50 text-foreground placeholder:text-muted-foreground focus:border-primary focus:outline-none"
                      />
                    )}

                    <div className="mt-6 flex items-center gap-2">
                      <Button variant="outline" size="sm" onClick={() => setShowHint(!showHint)} className="text-muted-foreground">
                        <Lightbulb className="mr-2 h-4 w-4" />
                        {showHint ? "Hide Hint" : "Show Hint"}
                      </Button>
                    </div>

                    {showHint && currentAssignment.questions[currentQuestionIndex].common_mistakes && (
                      <motion.div
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        className="mt-4 p-4 rounded-xl bg-amber-500/10 border border-amber-500/20"
                      >
                        <div className="flex items-center gap-2 text-amber-500 mb-2">
                          <Brain className="h-4 w-4" />
                          <span className="font-semibold">AI Hint</span>
                        </div>
                        <p className="text-sm text-muted-foreground">
                          Common mistake to avoid: {currentAssignment.questions[currentQuestionIndex].common_mistakes}
                        </p>
                      </motion.div>
                    )}
                  </div>
                )}
              </div>

              <div className="flex items-center justify-between flex-wrap gap-4">
                <div className="flex gap-2 flex-wrap">
                  {currentAssignment.questions.map((_, i) => (
                    <button
                      key={i}
                      onClick={() => setCurrentQuestionIndex(i)}
                      className={`w-10 h-10 rounded-lg text-sm font-medium transition-all ${
                        i === currentQuestionIndex
                          ? "bg-primary text-white"
                          : answers[currentAssignment.questions[i].id]
                          ? "bg-green-500/20 text-green-500 border border-green-500/30"
                          : "bg-muted text-muted-foreground hover:bg-muted/80"
                      }`}
                    >
                      {i + 1}
                    </button>
                  ))}
                </div>
                <div className="flex gap-2">
                  <Button
                    variant="outline"
                    onClick={() => setCurrentQuestionIndex(prev => Math.max(0, prev - 1))}
                    disabled={currentQuestionIndex === 0}
                  >
                    Previous
                  </Button>
                  {currentQuestionIndex < currentAssignment.questions.length - 1 ? (
                    <Button onClick={() => setCurrentQuestionIndex(prev => prev + 1)}>
                      Next <ChevronRight className="ml-2 h-4 w-4" />
                    </Button>
                  ) : (
                    <Button
                      onClick={handleSubmit}
                      disabled={submitting}
                      className="bg-gradient-to-r from-pink-500 to-rose-500 text-white hover:from-pink-600 hover:to-rose-600"
                    >
                      {submitting ? "Submitting..." : "Submit"} <Send className="ml-2 h-4 w-4" />
                    </Button>
                  )}
                </div>
              </div>
            </motion.div>
          )}

          {view === "result" && result && currentAssignment && (
            <motion.div
              key="result"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
            >
              <div className="text-center mb-8">
                <motion.div
                  initial={{ scale: 0 }}
                  animate={{ scale: 1 }}
                  transition={{ type: "spring", duration: 0.5 }}
                  className={`mx-auto w-32 h-32 rounded-full flex items-center justify-center mb-4 ${
                    result.percentage >= 70 ? "bg-green-500/20" : result.percentage >= 50 ? "bg-amber-500/20" : "bg-red-500/20"
                  }`}
                >
                  {result.percentage >= 70 ? (
                    <Trophy className="h-16 w-16 text-green-500" />
                  ) : result.percentage >= 50 ? (
                    <Target className="h-16 w-16 text-amber-500" />
                  ) : (
                    <RefreshCw className="h-16 w-16 text-red-500" />
                  )}
                </motion.div>
                <h2 className="text-3xl font-bold text-foreground mb-2">
                  {result.percentage >= 70 ? "Excellent!" : result.percentage >= 50 ? "Good Job!" : "Keep Practicing!"}
                </h2>
                <p className="text-muted-foreground">You scored {result.score} out of {result.total} marks</p>
                <div className={`text-5xl font-bold mt-4 ${
                  result.percentage >= 70 ? "text-green-500" : result.percentage >= 50 ? "text-amber-500" : "text-red-500"
                }`}>
                  {result.percentage}%
                </div>
              </div>

              <div className="rounded-2xl border border-border bg-card/50 backdrop-blur-sm p-6 mb-6">
                <h3 className="text-xl font-bold text-foreground mb-4 flex items-center gap-2">
                  <Sparkles className="h-5 w-5 text-primary" />
                  Question Review
                </h3>
                <div className="space-y-4">
                  {currentAssignment.questions.map((question, i) => {
                    const detail = result.details.find(d => d.questionId === question.id);
                    return (
                      <div key={question.id} className={`p-4 rounded-xl border ${detail?.correct ? "border-green-500/30 bg-green-500/5" : "border-red-500/30 bg-red-500/5"}`}>
                        <div className="flex items-start gap-3">
                          <div className={`mt-1 h-6 w-6 rounded-full flex items-center justify-center ${detail?.correct ? "bg-green-500" : "bg-red-500"}`}>
                            {detail?.correct ? <CheckCircle2 className="h-4 w-4 text-white" /> : <XCircle className="h-4 w-4 text-white" />}
                          </div>
                          <div className="flex-1">
                            <p className="font-medium text-foreground mb-1">Q{i + 1}: {question.question_text}</p>
                            <p className="text-sm text-muted-foreground">
                              Your answer: <span className={detail?.correct ? "text-green-500" : "text-red-500"}>{answers[question.id] || "Not answered"}</span>
                            </p>
                            {!detail?.correct && (
                              <p className="text-sm text-muted-foreground">
                                Correct answer: <span className="text-green-500">{question.correct_answer}</span>
                              </p>
                            )}
                            <div className="mt-2 p-3 rounded-lg bg-primary/5 border border-primary/10">
                              <p className="text-sm text-muted-foreground">
                                <span className="font-medium text-primary">Explanation:</span> {question.explanation}
                              </p>
                            </div>
                          </div>
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>

              <div className="flex items-center justify-center gap-4">
                <Button variant="outline" onClick={() => setView("list")}>
                  <ArrowLeft className="mr-2 h-4 w-4" />
                  Back to Assignments
                </Button>
                {getAttemptCount(currentAssignment.id) < currentAssignment.attempt_limit && (
                  <Button onClick={() => startAssignment(currentAssignment)} className="bg-gradient-to-r from-pink-500 to-rose-500 text-white">
                    <RefreshCw className="mr-2 h-4 w-4" />
                    Try Again
                  </Button>
                )}
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </main>
    </div>
  );
}
