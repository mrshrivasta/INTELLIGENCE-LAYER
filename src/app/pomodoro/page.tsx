"use client";

import { useState, useEffect, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
  Clock, Play, Pause, RotateCcw, Coffee, Brain, Sparkles, ArrowLeft,
  Volume2, VolumeX, Settings, CheckCircle, Flame, Target, Trophy,
} from "lucide-react";
import Link from "next/link";
import { createClient } from "@/lib/supabase/client";

type SessionType = "work" | "shortBreak" | "longBreak";

const DEFAULT_TIMES = {
  work: 25 * 60,
  shortBreak: 5 * 60,
  longBreak: 15 * 60,
};

export default function PomodoroPage() {
  const [time, setTime] = useState(DEFAULT_TIMES.work);
  const [isRunning, setIsRunning] = useState(false);
  const [sessionType, setSessionType] = useState<SessionType>("work");
  const [completedSessions, setCompletedSessions] = useState(0);
  const [totalFocusTime, setTotalFocusTime] = useState(0);
  const [soundEnabled, setSoundEnabled] = useState(true);
  const [showSettings, setShowSettings] = useState(false);
  const [customTimes, setCustomTimes] = useState(DEFAULT_TIMES);
  const intervalRef = useRef<NodeJS.Timeout | null>(null);

  useEffect(() => {
    if (isRunning && time > 0) {
      intervalRef.current = setInterval(() => {
        setTime(prev => prev - 1);
      }, 1000);
    } else if (time === 0) {
      handleSessionComplete();
    }

    return () => {
      if (intervalRef.current) clearInterval(intervalRef.current);
    };
  }, [isRunning, time]);

  function handleSessionComplete() {
    setIsRunning(false);
    if (soundEnabled) {
      const audio = new Audio("/notification.mp3");
      audio.play().catch(() => {});
    }

    if (sessionType === "work") {
      const newCompletedSessions = completedSessions + 1;
      setCompletedSessions(newCompletedSessions);
      setTotalFocusTime(prev => prev + customTimes.work);
      saveSession();

      if (newCompletedSessions % 4 === 0) {
        setSessionType("longBreak");
        setTime(customTimes.longBreak);
      } else {
        setSessionType("shortBreak");
        setTime(customTimes.shortBreak);
      }
    } else {
      setSessionType("work");
      setTime(customTimes.work);
    }
  }

  async function saveSession() {
    const supabase = createClient();
    const { data: { user } } = await supabase.auth.getUser();
    
    if (user) {
      await supabase.from("pomodoro_sessions").insert({
        user_id: user.id,
        duration_minutes: customTimes.work / 60,
        session_type: "work",
        completed: true,
      });
    }
  }

  function toggleTimer() {
    setIsRunning(!isRunning);
  }

  function resetTimer() {
    setIsRunning(false);
    setTime(customTimes[sessionType]);
  }

  function switchSession(type: SessionType) {
    setIsRunning(false);
    setSessionType(type);
    setTime(customTimes[type]);
  }

  function formatTime(seconds: number) {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins.toString().padStart(2, "0")}:${secs.toString().padStart(2, "0")}`;
  }

  const progress = (1 - time / customTimes[sessionType]) * 100;
  const circumference = 2 * Math.PI * 140;
  const strokeDashoffset = circumference - (progress / 100) * circumference;

  const sessionColors = {
    work: { bg: "from-rose-500 to-orange-500", text: "text-rose-500", ring: "stroke-rose-500" },
    shortBreak: { bg: "from-emerald-500 to-teal-500", text: "text-emerald-500", ring: "stroke-emerald-500" },
    longBreak: { bg: "from-blue-500 to-cyan-500", text: "text-blue-500", ring: "stroke-blue-500" },
  };

  return (
    <div className="min-h-screen bg-background text-foreground">
      <div className="fixed inset-0 pointer-events-none overflow-hidden">
        <motion.div
          animate={{
            scale: isRunning ? [1, 1.2, 1] : 1,
            opacity: isRunning ? [0.05, 0.1, 0.05] : 0.05,
          }}
          transition={{ duration: 4, repeat: Infinity }}
          className={`absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[800px] rounded-full bg-gradient-to-br ${sessionColors[sessionType].bg} blur-3xl`}
        />
      </div>

      <header className="sticky top-0 z-50 border-b border-border bg-background/80 backdrop-blur-xl">
        <div className="mx-auto flex h-16 max-w-7xl items-center justify-between px-6">
          <div className="flex items-center gap-4">
            <Link href="/dashboard">
              <Button variant="ghost" size="sm">
                <ArrowLeft className="h-4 w-4 mr-2" />
                Back
              </Button>
            </Link>
            <div className="flex items-center gap-2">
              <div className={`p-2 rounded-xl bg-gradient-to-br ${sessionColors[sessionType].bg}`}>
                <Clock className="h-5 w-5 text-white" />
              </div>
              <h1 className="text-xl font-bold">Pomodoro Timer</h1>
            </div>
          </div>

          <div className="flex items-center gap-4">
            <div className="flex items-center gap-2 px-4 py-2 rounded-xl bg-card border border-border">
              <Flame className="h-5 w-5 text-orange-500" />
              <span className="font-bold">{completedSessions} sessions</span>
            </div>
            <Button
              variant="ghost"
              size="sm"
              onClick={() => setSoundEnabled(!soundEnabled)}
            >
              {soundEnabled ? <Volume2 className="h-4 w-4" /> : <VolumeX className="h-4 w-4" />}
            </Button>
            <Button
              variant="ghost"
              size="sm"
              onClick={() => setShowSettings(!showSettings)}
            >
              <Settings className="h-4 w-4" />
            </Button>
          </div>
        </div>
      </header>

      <main className="mx-auto max-w-2xl px-6 py-12">
        <div className="flex justify-center gap-2 mb-12">
          {[
            { type: "work" as SessionType, label: "Focus", icon: Brain },
            { type: "shortBreak" as SessionType, label: "Short Break", icon: Coffee },
            { type: "longBreak" as SessionType, label: "Long Break", icon: Coffee },
          ].map(({ type, label, icon: Icon }) => (
            <Button
              key={type}
              variant={sessionType === type ? "default" : "outline"}
              onClick={() => switchSession(type)}
              className={sessionType === type ? `bg-gradient-to-r ${sessionColors[type].bg} text-white border-0` : ""}
            >
              <Icon className="h-4 w-4 mr-2" />
              {label}
            </Button>
          ))}
        </div>

        <div className="flex flex-col items-center">
          <div className="relative w-80 h-80 mb-8">
            <svg className="w-full h-full transform -rotate-90">
              <circle
                cx="160"
                cy="160"
                r="140"
                stroke="currentColor"
                strokeWidth="8"
                fill="none"
                className="text-muted"
              />
              <motion.circle
                cx="160"
                cy="160"
                r="140"
                strokeWidth="8"
                fill="none"
                strokeLinecap="round"
                className={sessionColors[sessionType].ring}
                strokeDasharray={circumference}
                initial={{ strokeDashoffset: circumference }}
                animate={{ strokeDashoffset }}
                transition={{ duration: 0.5 }}
              />
            </svg>

            <div className="absolute inset-0 flex flex-col items-center justify-center">
              <Badge className={`mb-4 bg-gradient-to-r ${sessionColors[sessionType].bg} text-white border-0`}>
                {sessionType === "work" ? "Focus Time" : sessionType === "shortBreak" ? "Short Break" : "Long Break"}
              </Badge>
              <motion.span
                key={time}
                initial={{ scale: 1.1, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                className="text-7xl font-bold font-mono"
              >
                {formatTime(time)}
              </motion.span>
              <p className="text-muted-foreground mt-2">
                {isRunning ? "Stay focused!" : "Ready to start?"}
              </p>
            </div>

            {isRunning && (
              <motion.div
                className="absolute inset-0"
                animate={{ rotate: 360 }}
                transition={{ duration: 60, repeat: Infinity, ease: "linear" }}
              >
                <div className={`absolute top-0 left-1/2 -translate-x-1/2 w-3 h-3 rounded-full bg-gradient-to-r ${sessionColors[sessionType].bg}`} />
              </motion.div>
            )}
          </div>

          <div className="flex items-center gap-4">
            <Button
              size="lg"
              variant="outline"
              onClick={resetTimer}
              className="w-14 h-14 rounded-full p-0"
            >
              <RotateCcw className="h-6 w-6" />
            </Button>

            <Button
              size="lg"
              onClick={toggleTimer}
              className={`w-20 h-20 rounded-full p-0 bg-gradient-to-r ${sessionColors[sessionType].bg} text-white hover:opacity-90 shadow-lg`}
            >
              {isRunning ? <Pause className="h-8 w-8" /> : <Play className="h-8 w-8 ml-1" />}
            </Button>

            <Button
              size="lg"
              variant="outline"
              onClick={() => switchSession(sessionType === "work" ? "shortBreak" : "work")}
              className="w-14 h-14 rounded-full p-0"
            >
              {sessionType === "work" ? <Coffee className="h-6 w-6" /> : <Brain className="h-6 w-6" />}
            </Button>
          </div>
        </div>

        <div className="grid grid-cols-3 gap-4 mt-12">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="rounded-2xl bg-card border border-border p-6 text-center"
          >
            <div className="p-3 rounded-xl bg-orange-500/20 w-fit mx-auto mb-3">
              <CheckCircle className="h-6 w-6 text-orange-500" />
            </div>
            <p className="text-3xl font-bold">{completedSessions}</p>
            <p className="text-sm text-muted-foreground">Sessions</p>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="rounded-2xl bg-card border border-border p-6 text-center"
          >
            <div className="p-3 rounded-xl bg-primary/20 w-fit mx-auto mb-3">
              <Clock className="h-6 w-6 text-primary" />
            </div>
            <p className="text-3xl font-bold">{Math.floor(totalFocusTime / 60)}</p>
            <p className="text-sm text-muted-foreground">Minutes</p>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="rounded-2xl bg-card border border-border p-6 text-center"
          >
            <div className="p-3 rounded-xl bg-purple-500/20 w-fit mx-auto mb-3">
              <Target className="h-6 w-6 text-purple-500" />
            </div>
            <p className="text-3xl font-bold">{4 - (completedSessions % 4)}</p>
            <p className="text-sm text-muted-foreground">Until Long Break</p>
          </motion.div>
        </div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
          className="mt-8 rounded-2xl bg-gradient-to-r from-primary/10 to-cyan-500/10 border border-primary/20 p-6"
        >
          <div className="flex items-center gap-3 mb-4">
            <Sparkles className="h-5 w-5 text-primary" />
            <h3 className="font-bold">Today&apos;s Progress</h3>
          </div>
          <div className="h-3 bg-muted rounded-full overflow-hidden">
            <motion.div
              initial={{ width: 0 }}
              animate={{ width: `${Math.min((completedSessions / 8) * 100, 100)}%` }}
              className="h-full bg-gradient-to-r from-primary to-cyan-500 rounded-full"
            />
          </div>
          <p className="text-sm text-muted-foreground mt-2">
            {completedSessions} / 8 sessions (goal)
          </p>
        </motion.div>

        <AnimatePresence>
          {showSettings && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm p-4"
              onClick={() => setShowSettings(false)}
            >
              <motion.div
                initial={{ scale: 0.9 }}
                animate={{ scale: 1 }}
                exit={{ scale: 0.9 }}
                onClick={e => e.stopPropagation()}
                className="bg-card rounded-2xl p-6 max-w-md w-full border border-border"
              >
                <h2 className="text-xl font-bold mb-4">Timer Settings</h2>
                <div className="space-y-4">
                  {[
                    { key: "work", label: "Focus Duration (minutes)" },
                    { key: "shortBreak", label: "Short Break (minutes)" },
                    { key: "longBreak", label: "Long Break (minutes)" },
                  ].map(({ key, label }) => (
                    <div key={key}>
                      <label className="text-sm font-medium mb-2 block">{label}</label>
                      <input
                        type="number"
                        value={customTimes[key as keyof typeof customTimes] / 60}
                        onChange={e => setCustomTimes(prev => ({
                          ...prev,
                          [key]: parseInt(e.target.value) * 60 || 0,
                        }))}
                        className="w-full px-4 py-2 rounded-xl bg-muted border border-border focus:border-primary outline-none"
                        min={1}
                        max={120}
                      />
                    </div>
                  ))}
                </div>
                <div className="flex gap-3 mt-6">
                  <Button
                    variant="outline"
                    className="flex-1"
                    onClick={() => {
                      setCustomTimes(DEFAULT_TIMES);
                      setTime(DEFAULT_TIMES[sessionType]);
                    }}
                  >
                    Reset to Default
                  </Button>
                  <Button
                    className="flex-1"
                    onClick={() => {
                      setTime(customTimes[sessionType]);
                      setShowSettings(false);
                    }}
                  >
                    Save
                  </Button>
                </div>
              </motion.div>
            </motion.div>
          )}
        </AnimatePresence>
      </main>
    </div>
  );
}
