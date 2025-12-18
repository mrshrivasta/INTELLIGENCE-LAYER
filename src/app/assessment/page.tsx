"use client";

import { useState, useEffect } from "react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { createClient } from "@/lib/supabase/client";
import { Brain, Clock, CheckCircle2, XCircle, ArrowLeft, Sun, Moon, FileQuestion, Target, Award } from "lucide-react";
import { DeveloperWatermark } from "@/components/DeveloperWatermark";
import { NotificationPanel } from "@/components/NotificationPanel";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useTheme } from "@/components/ThemeProvider";
import { motion } from "framer-motion";
import { Badge } from "@/components/ui/badge";

interface Question {
  id: string;
  question: string;
  options: string[];
  correctAnswer: number;
}

const questionsByField: Record<string, { easy: Question[]; medium: Question[]; hard: Question[] }> = {
  "Web Development": {
    easy: [
      { id: "wd-e1", question: "What does HTML stand for?", options: ["Hyper Text Markup Language", "High Tech Modern Language", "Home Tool Markup Language", "Hyperlink Text Mode Language"], correctAnswer: 0 },
      { id: "wd-e2", question: "Which CSS property is used to change text color?", options: ["font-color", "text-color", "color", "foreground"], correctAnswer: 2 },
      { id: "wd-e3", question: "What is the correct way to declare a JavaScript variable?", options: ["variable x = 5;", "var x = 5;", "v x = 5;", "declare x = 5;"], correctAnswer: 1 },
      { id: "wd-e4", question: "Which tag is used for the largest heading in HTML?", options: ["<h6>", "<heading>", "<h1>", "<head>"], correctAnswer: 2 },
      { id: "wd-e5", question: "What does CSS stand for?", options: ["Creative Style Sheets", "Cascading Style Sheets", "Computer Style Sheets", "Colorful Style Sheets"], correctAnswer: 1 },
    ],
    medium: [
      { id: "wd-m1", question: "What is the virtual DOM in React?", options: ["A copy of the real DOM for faster updates", "A database for React", "A CSS framework", "A testing library"], correctAnswer: 0 },
      { id: "wd-m2", question: "Which HTTP method is used to update data?", options: ["GET", "POST", "PUT", "DELETE"], correctAnswer: 2 },
      { id: "wd-m3", question: "What is a closure in JavaScript?", options: ["A way to close the browser", "A function with access to its outer scope", "A CSS animation", "A React component"], correctAnswer: 1 },
      { id: "wd-m4", question: "What is the purpose of useState in React?", options: ["To fetch data", "To manage component state", "To style components", "To route pages"], correctAnswer: 1 },
      { id: "wd-m5", question: "What is REST API?", options: ["A sleeping interface", "Representational State Transfer API", "Rapid Exchange Service Tool", "Real-time Execution System"], correctAnswer: 1 },
      { id: "wd-m6", question: "Which is NOT a JavaScript framework?", options: ["React", "Angular", "Vue", "Django"], correctAnswer: 3 },
      { id: "wd-m7", question: "What is the box model in CSS?", options: ["A 3D modeling tool", "Content, padding, border, margin structure", "A JavaScript library", "A database schema"], correctAnswer: 1 },
    ],
    hard: [
      { id: "wd-h1", question: "What is the time complexity of Array.prototype.sort() in JavaScript?", options: ["O(n)", "O(n log n)", "O(n²)", "O(1)"], correctAnswer: 1 },
      { id: "wd-h2", question: "What is server-side rendering (SSR)?", options: ["Rendering on the client only", "Pre-rendering pages on the server", "A CSS technique", "A database operation"], correctAnswer: 1 },
      { id: "wd-h3", question: "What is the purpose of React.memo()?", options: ["To store data", "To prevent unnecessary re-renders", "To create memos", "To handle events"], correctAnswer: 1 },
      { id: "wd-h4", question: "What is a WebSocket?", options: ["A power socket for web servers", "A bidirectional communication protocol", "A CSS framework", "A JavaScript variable type"], correctAnswer: 1 },
      { id: "wd-h5", question: "What is hydration in Next.js?", options: ["Adding water to components", "Making server-rendered HTML interactive", "A caching mechanism", "A styling technique"], correctAnswer: 1 },
      { id: "wd-h6", question: "What is tree shaking?", options: ["A physical movement", "Removing unused code from bundles", "A debugging technique", "A testing method"], correctAnswer: 1 },
      { id: "wd-h7", question: "What is the purpose of useCallback in React?", options: ["To call APIs", "To memoize functions", "To handle routing", "To style components"], correctAnswer: 1 },
      { id: "wd-h8", question: "What is a service worker?", options: ["A human employee", "A script that runs in the background", "A CSS property", "A database"], correctAnswer: 1 },
      { id: "wd-h9", question: "What is code splitting?", options: ["Breaking code into smaller files", "Writing code in multiple languages", "A debugging method", "A testing approach"], correctAnswer: 0 },
      { id: "wd-h10", question: "What is the Critical Rendering Path?", options: ["A hiking trail", "Steps browser takes to render a page", "A CSS animation path", "A JavaScript function"], correctAnswer: 1 },
    ],
  },
};

function generateGenericQuestions(field: string, count: number): Question[] {
  return Array.from({ length: count }, (_, i) => ({
    id: `gen-${Date.now()}-${i}`,
    question: `Question ${i + 1}: What is a key concept in ${field}?`,
    options: [
      `Core principle of ${field}`,
      `Advanced technique in ${field}`,
      `Basic element of ${field}`,
      `Fundamental aspect of ${field}`,
    ],
    correctAnswer: Math.floor(Math.random() * 4),
  }));
}

export default function AssessmentPage() {
  const router = useRouter();
  const { theme, toggleTheme } = useTheme();
  const [difficulty, setDifficulty] = useState<string>("medium");
  const [started, setStarted] = useState(false);
  const [questions, setQuestions] = useState<Question[]>([]);
  const [currentQuestion, setCurrentQuestion] = useState(0);
  const [answers, setAnswers] = useState<Record<number, number>>({});
  const [timeLeft, setTimeLeft] = useState(1800);
  const [completed, setCompleted] = useState(false);
  const [score, setScore] = useState(0);
  const [profile, setProfile] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadProfile();
  }, []);

  useEffect(() => {
    if (started && !completed && timeLeft > 0) {
      const timer = setInterval(() => {
        setTimeLeft((prev) => prev - 1);
      }, 1000);
      return () => clearInterval(timer);
    } else if (timeLeft === 0 && !completed) {
      handleSubmit();
    }
  }, [started, completed, timeLeft]);

  async function loadProfile() {
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

    if (!profileData) {
      router.push("/onboarding");
      return;
    }

    setProfile(profileData);
    setLoading(false);
  }

  function handleStart() {
    const field = profile?.field_of_interest || "General";
    const fieldQuestions = questionsByField[field];
    
    let selectedQuestions: Question[];
    if (fieldQuestions) {
      const difficultyQuestions = fieldQuestions[difficulty as keyof typeof fieldQuestions] || fieldQuestions.medium;
      selectedQuestions = [...difficultyQuestions];
    } else {
      const count = difficulty === "easy" ? 5 : difficulty === "medium" ? 7 : 10;
      selectedQuestions = generateGenericQuestions(field, count);
    }
    
    setQuestions(selectedQuestions.sort(() => Math.random() - 0.5));
    setStarted(true);
    setTimeLeft(difficulty === "easy" ? 600 : difficulty === "medium" ? 900 : 1200);
  }

  function handleAnswer(questionIndex: number, answerIndex: number) {
    setAnswers({ ...answers, [questionIndex]: answerIndex });
  }

  async function handleSubmit() {
    let correctCount = 0;
    questions.forEach((q, i) => {
      if (answers[i] === q.correctAnswer) correctCount++;
    });
    
    const finalScore = Math.round((correctCount / questions.length) * 100);
    setScore(finalScore);
    setCompleted(true);

    const supabase = createClient();
    const { data: { user } } = await supabase.auth.getUser();
    
    if (user) {
      await supabase.from("assessments").insert({
        user_id: user.id,
        field: profile?.field_of_interest || "General",
        difficulty,
        questions: questions,
        answers: answers,
        score: finalScore,
        duration_seconds: difficulty === "easy" ? 600 - timeLeft : difficulty === "medium" ? 900 - timeLeft : 1200 - timeLeft,
        completed_at: new Date().toISOString(),
      });
    }
  }

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs.toString().padStart(2, "0")}`;
  };

  if (loading) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-background">
        <div className="text-center">
          <FileQuestion className="mx-auto h-12 w-12 animate-pulse text-primary" />
          <p className="mt-4 text-muted-foreground font-medium">Loading assessment...</p>
        </div>
      </div>
    );
  }

  if (completed) {
    return (
      <div className="min-h-screen bg-background text-foreground p-8 transition-colors duration-300">
        <div className="mx-auto max-w-2xl">
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.5 }}
          >
            <Card className="p-8 text-center bg-card border-border">
              {score >= 70 ? (
                <CheckCircle2 className="mx-auto h-16 w-16 text-green-500" />
              ) : (
                <XCircle className="mx-auto h-16 w-16 text-orange-500" />
              )}
              <h2 className="mt-4 text-3xl font-bold text-foreground">Assessment Complete!</h2>
              <p className="mt-2 text-xl text-muted-foreground">Your Score: <span className={score >= 70 ? "text-green-500" : "text-orange-500"}>{score}%</span></p>
              <p className="mt-4 text-muted-foreground">
                You answered {Object.keys(answers).filter(k => answers[parseInt(k)] === questions[parseInt(k)]?.correctAnswer).length} out of {questions.length} questions correctly
              </p>
              <div className="mt-6 flex gap-2 justify-center flex-wrap">
                <Badge className={score >= 70 ? "bg-green-500/10 text-green-500" : "bg-orange-500/10 text-orange-500"}>
                  <Award className="h-3 w-3 mr-1" />
                  {score >= 90 ? "Excellent!" : score >= 70 ? "Good Job!" : score >= 50 ? "Keep Practicing" : "Need Improvement"}
                </Badge>
                <Badge className="bg-primary/10 text-primary">
                  <Target className="h-3 w-3 mr-1" />
                  {profile?.field_of_interest || "General"}
                </Badge>
              </div>
              <div className="mt-8 flex gap-4 justify-center">
                <Link href="/analytics">
                  <Button>View Analytics</Button>
                </Link>
                <Link href="/dashboard">
                  <Button variant="outline">Back to Dashboard</Button>
                </Link>
              </div>
            </Card>
          </motion.div>
        </div>
        <DeveloperWatermark />
        <NotificationPanel />
      </div>
    );
  }

  if (!started) {
    return (
      <div className="min-h-screen bg-background text-foreground transition-colors duration-300">
        <header className="sticky top-0 z-50 border-b border-border bg-background/80 backdrop-blur-xl">
          <div className="mx-auto flex h-16 max-w-7xl items-center justify-between px-4 sm:px-6 lg:px-8">
            <Link href="/dashboard" className="flex items-center gap-3">
              <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-gradient-to-br from-pink-500 to-rose-600 shadow-lg">
                <FileQuestion className="h-6 w-6 text-white" />
              </div>
              <div>
                <h1 className="text-lg font-bold tracking-tight text-foreground">Assessment</h1>
                <p className="text-xs text-muted-foreground">Test Your Knowledge</p>
              </div>
            </Link>
            <div className="flex items-center gap-2">
              <Button variant="ghost" size="sm" onClick={toggleTheme} className="text-muted-foreground hover:text-foreground">
                {theme === "dark" ? <Sun className="h-4 w-4" /> : <Moon className="h-4 w-4" />}
              </Button>
              <Link href="/dashboard">
                <Button variant="ghost" size="sm" className="gap-2 text-muted-foreground hover:text-foreground">
                  <ArrowLeft className="h-4 w-4" />
                  Back
                </Button>
              </Link>
            </div>
          </div>
        </header>

        <main className="mx-auto max-w-2xl px-4 py-12 sm:px-6 lg:px-8">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
          >
            <Card className="p-8 bg-card border-border">
              <div className="flex items-center gap-4 mb-6">
                <div className="h-12 w-12 rounded-xl bg-gradient-to-br from-pink-500 to-rose-600 flex items-center justify-center">
                  <Brain className="h-6 w-6 text-white" />
                </div>
                <div>
                  <h2 className="text-2xl font-bold text-foreground">Start New Assessment</h2>
                  <p className="text-muted-foreground">Test your knowledge in {profile?.field_of_interest || "your field"}</p>
                </div>
              </div>
              
              <div className="space-y-6">
                <div>
                  <Label className="mb-2 block text-sm font-medium text-foreground">Select Difficulty</Label>
                  <Select value={difficulty} onValueChange={setDifficulty}>
                    <SelectTrigger className="bg-background border-border">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="easy">Easy (5 questions, 10 min)</SelectItem>
                      <SelectItem value="medium">Medium (7 questions, 15 min)</SelectItem>
                      <SelectItem value="hard">Hard (10 questions, 20 min)</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div className="rounded-lg bg-primary/5 border border-primary/10 p-4">
                  <h3 className="mb-2 font-semibold text-foreground flex items-center gap-2">
                    <Target className="h-4 w-4 text-primary" />
                    Assessment Info
                  </h3>
                  <ul className="space-y-1 text-sm text-muted-foreground">
                    <li>• Field: {profile?.field_of_interest || "General"}</li>
                    <li>• Questions are tailored to your field</li>
                    <li>• Timer starts when you begin</li>
                    <li>• Results are saved to your profile</li>
                  </ul>
                </div>

                <Button onClick={handleStart} className="w-full" size="lg">
                  Start Assessment
                </Button>
              </div>
            </Card>
          </motion.div>
        </main>

        <NotificationPanel />
        <DeveloperWatermark />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background text-foreground transition-colors duration-300">
      <header className="sticky top-0 z-50 border-b border-border bg-background/80 backdrop-blur-xl">
        <div className="mx-auto flex h-16 max-w-7xl items-center justify-between px-4 sm:px-6 lg:px-8">
          <div className="flex items-center gap-3">
            <FileQuestion className="h-8 w-8 text-primary" />
            <div>
              <p className="text-sm text-foreground font-medium">Question {currentQuestion + 1} of {questions.length}</p>
              <p className="text-xs text-muted-foreground">{profile?.field_of_interest || "General"}</p>
            </div>
          </div>
          <div className="flex items-center gap-2 rounded-full bg-primary/10 px-4 py-2">
            <Clock className="h-4 w-4 text-primary" />
            <span className="font-mono text-sm font-bold text-foreground">{formatTime(timeLeft)}</span>
          </div>
        </div>
      </header>

      <main className="mx-auto max-w-3xl px-4 py-8 sm:px-6 lg:px-8">
        <motion.div
          key={currentQuestion}
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.3 }}
        >
          <Card className="p-8 bg-card border-border">
            <div className="mb-4 flex items-center gap-2">
              <Badge className="bg-primary/10 text-primary">
                Question {currentQuestion + 1}
              </Badge>
              <Badge variant="outline" className="text-muted-foreground">
                {difficulty.charAt(0).toUpperCase() + difficulty.slice(1)}
              </Badge>
            </div>
            
            <h3 className="mb-6 text-xl font-semibold text-foreground">
              {questions[currentQuestion]?.question}
            </h3>

            <RadioGroup
              value={answers[currentQuestion]?.toString()}
              onValueChange={(val) => handleAnswer(currentQuestion, parseInt(val))}
            >
              <div className="space-y-3">
                {questions[currentQuestion]?.options.map((option, i) => (
                  <div 
                    key={i} 
                    className={`flex items-center space-x-3 rounded-lg border p-4 cursor-pointer transition-all ${
                      answers[currentQuestion] === i 
                        ? "border-primary bg-primary/5" 
                        : "border-border hover:bg-muted/50"
                    }`}
                    onClick={() => handleAnswer(currentQuestion, i)}
                  >
                    <RadioGroupItem value={i.toString()} id={`option-${i}`} />
                    <Label htmlFor={`option-${i}`} className="flex-1 cursor-pointer text-foreground">
                      {option}
                    </Label>
                  </div>
                ))}
              </div>
            </RadioGroup>

            <div className="mt-8 flex justify-between">
              <Button
                variant="outline"
                onClick={() => setCurrentQuestion(Math.max(0, currentQuestion - 1))}
                disabled={currentQuestion === 0}
              >
                Previous
              </Button>
              
              {currentQuestion < questions.length - 1 ? (
                <Button onClick={() => setCurrentQuestion(currentQuestion + 1)}>
                  Next
                </Button>
              ) : (
                <Button onClick={handleSubmit} className="bg-green-600 hover:bg-green-700">
                  Submit Assessment
                </Button>
              )}
            </div>
          </Card>
        </motion.div>

        <div className="mt-6 flex justify-center gap-2 flex-wrap">
          {questions.map((_, i) => (
            <button
              key={i}
              onClick={() => setCurrentQuestion(i)}
              className={`h-8 w-8 rounded-full text-xs font-bold transition-all ${
                i === currentQuestion
                  ? "bg-primary text-primary-foreground"
                  : answers[i] !== undefined
                  ? "bg-green-500/20 text-green-500 border border-green-500/30"
                  : "bg-muted text-muted-foreground hover:bg-muted/80"
              }`}
            >
              {i + 1}
            </button>
          ))}
        </div>
      </main>

      <DeveloperWatermark />
      <NotificationPanel />
    </div>
  );
}
