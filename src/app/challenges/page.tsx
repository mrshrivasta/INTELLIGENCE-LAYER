"use client";

import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
  Target, ArrowLeft, Flame, Sparkles, Clock, CheckCircle, Gift,
  BookOpen, FileQuestion, Layers, Timer, Zap, Trophy, Star,
} from "lucide-react";
import Link from "next/link";
import { createClient } from "@/lib/supabase/client";

interface Challenge {
  id: string;
  title: string;
  description: string;
  challenge_type: string;
  xp_reward: number;
  target_value: number;
  active_date: string;
}

interface UserChallenge {
  challenge_id: string;
  progress: number;
  completed: boolean;
}

const challengeIcons: Record<string, React.ElementType> = {
  lessons: BookOpen,
  quizzes: FileQuestion,
  flashcards: Layers,
  notes: FileQuestion,
  pomodoro: Timer,
};

export default function ChallengesPage() {
  const [challenges, setChallenges] = useState<Challenge[]>([]);
  const [userChallenges, setUserChallenges] = useState<UserChallenge[]>([]);
  const [loading, setLoading] = useState(true);
  const [claimedRewards, setClaimedRewards] = useState<Set<string>>(new Set());

  useEffect(() => {
    loadData();
  }, []);

  async function loadData() {
    const supabase = createClient();
    
    const today = new Date().toISOString().split("T")[0];
    const { data: challengesData } = await supabase
      .from("daily_challenges")
      .select("*")
      .eq("active_date", today);
    
    if (challengesData && challengesData.length > 0) {
      setChallenges(challengesData);
    } else {
      setChallenges([
        { id: "1", title: "Quick Learner", description: "Complete 3 lessons today", challenge_type: "lessons", xp_reward: 100, target_value: 3, active_date: today },
        { id: "2", title: "Quiz Time", description: "Pass 2 quizzes today", challenge_type: "quizzes", xp_reward: 75, target_value: 2, active_date: today },
        { id: "3", title: "Flashcard Review", description: "Review 20 flashcards", challenge_type: "flashcards", xp_reward: 50, target_value: 20, active_date: today },
        { id: "4", title: "Note Taking", description: "Create 2 notes", challenge_type: "notes", xp_reward: 50, target_value: 2, active_date: today },
        { id: "5", title: "Focus Mode", description: "Complete 3 pomodoro sessions", challenge_type: "pomodoro", xp_reward: 100, target_value: 3, active_date: today },
      ]);
    }

    const { data: { user } } = await supabase.auth.getUser();
    if (user) {
      const { data: userChallengesData } = await supabase
        .from("user_challenges")
        .select("challenge_id, progress, completed")
        .eq("user_id", user.id);
      
      if (userChallengesData) setUserChallenges(userChallengesData);
    }

    setUserChallenges([
      { challenge_id: "1", progress: 2, completed: false },
      { challenge_id: "2", progress: 1, completed: false },
      { challenge_id: "3", progress: 15, completed: false },
      { challenge_id: "4", progress: 2, completed: true },
      { challenge_id: "5", progress: 1, completed: false },
    ]);

    setLoading(false);
  }

  function getUserChallenge(challengeId: string) {
    return userChallenges.find(uc => uc.challenge_id === challengeId) || { progress: 0, completed: false };
  }

  async function claimReward(challengeId: string) {
    setClaimedRewards(prev => new Set([...prev, challengeId]));
  }

  const completedCount = userChallenges.filter(uc => uc.completed).length;
  const totalXpAvailable = challenges.reduce((acc, c) => acc + c.xp_reward, 0);
  const earnedXp = challenges
    .filter(c => getUserChallenge(c.id).completed)
    .reduce((acc, c) => acc + c.xp_reward, 0);

  if (loading) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <motion.div
          animate={{ rotate: 360 }}
          transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
        >
          <Target className="h-12 w-12 text-primary" />
        </motion.div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background text-foreground">
      <div className="fixed inset-0 pointer-events-none overflow-hidden">
        <div className="absolute top-20 left-10 w-72 h-72 bg-orange-500/5 rounded-full blur-3xl animate-blob" />
        <div className="absolute bottom-20 right-10 w-96 h-96 bg-primary/5 rounded-full blur-3xl animate-blob" style={{ animationDelay: "2s" }} />
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
              <div className="p-2 rounded-xl bg-gradient-to-br from-orange-500 to-red-500">
                <Target className="h-5 w-5 text-white" />
              </div>
              <h1 className="text-xl font-bold">Daily Challenges</h1>
            </div>
          </div>

          <div className="flex items-center gap-4">
            <div className="flex items-center gap-2 px-4 py-2 rounded-xl bg-card border border-border">
              <Clock className="h-5 w-5 text-muted-foreground" />
              <span className="text-sm">Resets in 12h 34m</span>
            </div>
          </div>
        </div>
      </header>

      <main className="mx-auto max-w-4xl px-6 py-8">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8"
        >
          <div className="rounded-2xl bg-card border border-border p-6 text-center">
            <div className="p-3 rounded-xl bg-orange-500/20 w-fit mx-auto mb-3">
              <Target className="h-6 w-6 text-orange-500" />
            </div>
            <p className="text-3xl font-bold">{completedCount}/{challenges.length}</p>
            <p className="text-sm text-muted-foreground">Challenges</p>
          </div>

          <div className="rounded-2xl bg-card border border-border p-6 text-center">
            <div className="p-3 rounded-xl bg-primary/20 w-fit mx-auto mb-3">
              <Sparkles className="h-6 w-6 text-primary" />
            </div>
            <p className="text-3xl font-bold">{earnedXp}</p>
            <p className="text-sm text-muted-foreground">XP Earned</p>
          </div>

          <div className="rounded-2xl bg-card border border-border p-6 text-center">
            <div className="p-3 rounded-xl bg-amber-500/20 w-fit mx-auto mb-3">
              <Gift className="h-6 w-6 text-amber-500" />
            </div>
            <p className="text-3xl font-bold">{totalXpAvailable - earnedXp}</p>
            <p className="text-sm text-muted-foreground">XP Available</p>
          </div>
        </motion.div>

        <div className="space-y-4">
          {challenges.map((challenge, index) => {
            const userChallenge = getUserChallenge(challenge.id);
            const progress = Math.min((userChallenge.progress / challenge.target_value) * 100, 100);
            const Icon = challengeIcons[challenge.challenge_type] || Target;
            const isCompleted = userChallenge.completed || userChallenge.progress >= challenge.target_value;
            const isClaimed = claimedRewards.has(challenge.id);

            return (
              <motion.div
                key={challenge.id}
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: index * 0.1 }}
                className={`rounded-2xl border p-6 transition-all ${
                  isCompleted 
                    ? "bg-gradient-to-r from-primary/10 to-cyan-500/10 border-primary/30" 
                    : "bg-card border-border"
                }`}
              >
                <div className="flex items-start gap-4">
                  <div className={`p-4 rounded-xl ${
                    isCompleted ? "bg-primary/20" : "bg-muted"
                  }`}>
                    <Icon className={`h-8 w-8 ${isCompleted ? "text-primary" : "text-muted-foreground"}`} />
                  </div>

                  <div className="flex-1">
                    <div className="flex items-start justify-between mb-2">
                      <div>
                        <h3 className="font-bold text-lg flex items-center gap-2">
                          {challenge.title}
                          {isCompleted && (
                            <motion.div
                              initial={{ scale: 0 }}
                              animate={{ scale: 1 }}
                              className="text-primary"
                            >
                              <CheckCircle className="h-5 w-5" />
                            </motion.div>
                          )}
                        </h3>
                        <p className="text-muted-foreground">{challenge.description}</p>
                      </div>

                      <div className="flex items-center gap-2">
                        <Badge className={`${
                          isCompleted ? "bg-primary/20 text-primary" : "bg-amber-500/20 text-amber-500"
                        } border-0`}>
                          <Sparkles className="h-3 w-3 mr-1" />
                          {challenge.xp_reward} XP
                        </Badge>
                      </div>
                    </div>

                    <div className="mt-4">
                      <div className="flex items-center justify-between text-sm mb-2">
                        <span className="text-muted-foreground">Progress</span>
                        <span className={isCompleted ? "text-primary font-medium" : ""}>
                          {userChallenge.progress} / {challenge.target_value}
                        </span>
                      </div>
                      <div className="h-3 bg-muted rounded-full overflow-hidden">
                        <motion.div
                          initial={{ width: 0 }}
                          animate={{ width: `${progress}%` }}
                          transition={{ duration: 0.5, delay: index * 0.1 }}
                          className={`h-full rounded-full ${
                            isCompleted 
                              ? "bg-gradient-to-r from-primary to-cyan-500" 
                              : "bg-gradient-to-r from-orange-500 to-red-500"
                          }`}
                        />
                      </div>
                    </div>

                    {isCompleted && !isClaimed && (
                      <motion.div
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        className="mt-4"
                      >
                        <Button
                          onClick={() => claimReward(challenge.id)}
                          className="bg-gradient-to-r from-primary to-cyan-500 text-white"
                        >
                          <Gift className="h-4 w-4 mr-2" />
                          Claim Reward
                        </Button>
                      </motion.div>
                    )}

                    {isClaimed && (
                      <motion.p
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        className="mt-4 text-sm text-primary flex items-center gap-2"
                      >
                        <CheckCircle className="h-4 w-4" />
                        Reward claimed!
                      </motion.p>
                    )}
                  </div>
                </div>
              </motion.div>
            );
          })}
        </div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.5 }}
          className="mt-8 rounded-2xl bg-gradient-to-r from-amber-500/10 to-orange-500/10 border border-amber-500/20 p-6"
        >
          <div className="flex items-center gap-4">
            <div className="p-4 rounded-xl bg-gradient-to-br from-amber-500 to-orange-500">
              <Trophy className="h-8 w-8 text-white" />
            </div>
            <div className="flex-1">
              <h3 className="font-bold text-lg">Complete All Challenges</h3>
              <p className="text-muted-foreground">Finish all daily challenges to earn a bonus reward!</p>
            </div>
            <div className="text-right">
              <Badge className="bg-amber-500/20 text-amber-500 border-0 text-lg px-4 py-2">
                <Star className="h-4 w-4 mr-2" />
                +500 XP Bonus
              </Badge>
            </div>
          </div>
          <div className="mt-4 h-3 bg-muted rounded-full overflow-hidden">
            <motion.div
              initial={{ width: 0 }}
              animate={{ width: `${(completedCount / challenges.length) * 100}%` }}
              transition={{ duration: 0.5 }}
              className="h-full bg-gradient-to-r from-amber-500 to-orange-500 rounded-full"
            />
          </div>
          <p className="text-sm text-muted-foreground mt-2 text-right">
            {completedCount} / {challenges.length} completed
          </p>
        </motion.div>
      </main>
    </div>
  );
}
