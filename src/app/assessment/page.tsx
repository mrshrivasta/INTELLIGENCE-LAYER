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
import { Brain, Clock, CheckCircle2, XCircle } from "lucide-react";
import { DeveloperWatermark } from "@/components/DeveloperWatermark";
import { NotificationPanel } from "@/components/NotificationPanel";
import Link from "next/link";

interface Question {
  id: string;
  question: string;
  options: string[];
  correctAnswer: number;
}

export default function AssessmentPage() {
  const [difficulty, setDifficulty] = useState<string>("medium");
  const [started, setStarted] = useState(false);
  const [questions, setQuestions] = useState<Question[]>([]);
  const [currentQuestion, setCurrentQuestion] = useState(0);
  const [answers, setAnswers] = useState<Record<number, number>>({});
  const [timeLeft, setTimeLeft] = useState(1800);
  const [completed, setCompleted] = useState(false);
  const [score, setScore] = useState(0);
  const [profile, setProfile] = useState<any>(null);

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
    
    if (user) {
      const { data: profileData } = await supabase
        .from("user_profiles")
        .select("*")
        .eq("id", user.id)
        .single();

      if (profileData) {
        setProfile(profileData);
      }
    }
  }

  function generateQuestions(field: string, diff: string) {
    const topics = [
      "Fundamentals", "Advanced Concepts", "Best Practices", 
      "Problem Solving", "Optimization", "Architecture",
      "Design Patterns", "Testing", "Security", "Performance"
    ];
    
    const questionCount = diff === "easy" ? 10 : diff === "medium" ? 15 : 20;
    
    return Array.from({ length: questionCount }, (_, i) => ({
      id: `q-${Date.now()}-${i}`,
      question: `${topics[i % topics.length]} question ${i + 1} in ${field}?`,
      options: [
        `Option A for ${topics[i % topics.length]}`,
        `Option B for ${topics[i % topics.length]}`,
        `Option C for ${topics[i % topics.length]}`,
        `Option D for ${topics[i % topics.length]}`,
      ],
      correctAnswer: Math.floor(Math.random() * 4),
    }));
  }

  function handleStart() {
    const field = profile?.field_of_interest || "General";
    const generatedQuestions = generateQuestions(field, difficulty);
    setQuestions(generatedQuestions);
    setStarted(true);
    setTimeLeft(difficulty === "easy" ? 900 : difficulty === "medium" ? 1800 : 3600);
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
        duration_seconds: difficulty === "easy" ? 900 - timeLeft : difficulty === "medium" ? 1800 - timeLeft : 3600 - timeLeft,
        completed_at: new Date().toISOString(),
      });
    }
  }

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs.toString().padStart(2, "0")}`;
  };

  if (!profile) {
    return (
      <div className="flex min-h-screen items-center justify-center">
        <div className="text-center">
          <Brain className="mx-auto h-12 w-12 animate-pulse text-violet-600" />
          <p className="mt-4 text-slate-600">Loading assessment...</p>
        </div>
      </div>
    );
  }

  if (completed) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-50 via-violet-50/30 to-slate-50 p-8">
        <div className="mx-auto max-w-2xl">
          <Card className="p-8 text-center">
            {score >= 70 ? (
              <CheckCircle2 className="mx-auto h-16 w-16 text-green-600" />
            ) : (
              <XCircle className="mx-auto h-16 w-16 text-orange-600" />
            )}
            <h2 className="mt-4 text-3xl font-bold text-slate-900">Assessment Complete!</h2>
            <p className="mt-2 text-xl text-slate-600">Your Score: {score}%</p>
            <p className="mt-4 text-slate-600">
              You answered {Object.keys(answers).length} out of {questions.length} questions
            </p>
            <div className="mt-8 flex gap-4 justify-center">
              <Link href="/analytics">
                <Button>View Analytics</Button>
              </Link>
              <Link href="/dashboard">
                <Button variant="outline">Back to Dashboard</Button>
              </Link>
            </div>
          </Card>
        </div>
        <DeveloperWatermark />
        <NotificationPanel />
      </div>
    );
  }

  if (!started) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-50 via-violet-50/30 to-slate-50">
        <header className="sticky top-0 z-50 border-b border-slate-200/80 bg-white/80 backdrop-blur-lg">
          <div className="mx-auto flex h-16 max-w-7xl items-center justify-between px-4 sm:px-6 lg:px-8">
            <Link href="/dashboard" className="flex items-center gap-3">
              <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-gradient-to-br from-violet-600 to-fuchsia-600 shadow-lg">
                <Brain className="h-6 w-6 text-white" />
              </div>
              <div>
                <h1 className="text-lg font-bold tracking-tight text-slate-900">Assessment</h1>
                <p className="text-xs text-slate-500">Test Your Knowledge</p>
              </div>
            </Link>
          </div>
        </header>

        <main className="mx-auto max-w-2xl px-4 py-12 sm:px-6 lg:px-8">
          <Card className="p-8">
            <h2 className="mb-6 text-2xl font-bold text-slate-900">Start New Assessment</h2>
            <div className="space-y-6">
              <div>
                <Label className="mb-2 block text-sm font-medium">Select Difficulty</Label>
                <Select value={difficulty} onValueChange={setDifficulty}>
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="easy">Easy (10 questions, 15 min)</SelectItem>
                    <SelectItem value="medium">Medium (15 questions, 30 min)</SelectItem>
                    <SelectItem value="hard">Hard (20 questions, 60 min)</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className="rounded-lg bg-violet-50 p-4">
                <h3 className="mb-2 font-semibold text-violet-900">Assessment Info</h3>
                <ul className="space-y-1 text-sm text-violet-700">
                  <li>• Field: {profile.field_of_interest || "General"}</li>
                  <li>• Questions are unique for each assessment</li>
                  <li>• Timer starts when you begin</li>
                  <li>• AI chatbot is disabled during assessment</li>
                </ul>
              </div>

              <Button onClick={handleStart} className="w-full" size="lg">
                Start Assessment
              </Button>
            </div>
          </Card>
        </main>

        <NotificationPanel />
        <DeveloperWatermark />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-violet-50/30 to-slate-50">
      <header className="sticky top-0 z-50 border-b border-slate-200/80 bg-white/80 backdrop-blur-lg">
        <div className="mx-auto flex h-16 max-w-7xl items-center justify-between px-4 sm:px-6 lg:px-8">
          <div className="flex items-center gap-3">
            <Brain className="h-8 w-8 text-violet-600" />
            <div>
              <p className="text-sm text-slate-600">Question {currentQuestion + 1} of {questions.length}</p>
            </div>
          </div>
          <div className="flex items-center gap-2 rounded-full bg-violet-100 px-4 py-2">
            <Clock className="h-4 w-4 text-violet-600" />
            <span className="font-mono text-sm font-bold text-violet-900">{formatTime(timeLeft)}</span>
          </div>
        </div>
      </header>

      <main className="mx-auto max-w-3xl px-4 py-8 sm:px-6 lg:px-8">
        <Card className="p-8">
          <h3 className="mb-6 text-xl font-semibold text-slate-900">
            {questions[currentQuestion]?.question}
          </h3>

          <RadioGroup
            value={answers[currentQuestion]?.toString()}
            onValueChange={(val) => handleAnswer(currentQuestion, parseInt(val))}
          >
            <div className="space-y-3">
              {questions[currentQuestion]?.options.map((option, i) => (
                <div key={i} className="flex items-center space-x-3 rounded-lg border border-slate-200 p-4 hover:bg-slate-50">
                  <RadioGroupItem value={i.toString()} id={`option-${i}`} />
                  <Label htmlFor={`option-${i}`} className="flex-1 cursor-pointer">
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
      </main>

      <DeveloperWatermark />
      <NotificationPanel />
    </div>
  );
}
