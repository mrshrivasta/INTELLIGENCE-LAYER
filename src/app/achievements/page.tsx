"use client";

import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
  Trophy, Star, Zap, Flame, Award, Crown, Medal, Target,
  BookOpen, CheckCircle, Clock, Brain, Heart, Share2, Layers,
  FileText, Sparkles, Gem, Moon, Sun as Sunrise, Timer, Activity,
  Search, GraduationCap, ArrowLeft, Lock, Gift, TrendingUp,
} from "lucide-react";
import Link from "next/link";
import { createClient } from "@/lib/supabase/client";

const iconMap: Record<string, React.ElementType> = {
  Trophy, Star, Zap, Flame, Award, Crown, Medal, Target,
  BookOpen, CheckCircle, Clock, Brain, Heart, Share2, Layers,
  FileText, Sparkles, Gem, Moon, Sunrise, Timer, Activity,
  Search, GraduationCap, Footprints: Target,
};

const rarityColors: Record<string, { bg: string; border: string; text: string; glow: string }> = {
  common: { bg: "from-gray-500/20 to-slate-500/20", border: "border-gray-500/30", text: "text-gray-400", glow: "shadow-gray-500/20" },
  rare: { bg: "from-blue-500/20 to-cyan-500/20", border: "border-blue-500/30", text: "text-blue-400", glow: "shadow-blue-500/20" },
  epic: { bg: "from-purple-500/20 to-pink-500/20", border: "border-purple-500/30", text: "text-purple-400", glow: "shadow-purple-500/20" },
  legendary: { bg: "from-amber-500/20 to-orange-500/20", border: "border-amber-500/30", text: "text-amber-400", glow: "shadow-amber-500/20" },
};

interface Achievement {
  id: string;
  name: string;
  description: string;
  icon: string;
  xp_reward: number;
  category: string;
  requirement_type: string;
  requirement_value: number;
  rarity: string;
}

interface UserAchievement {
  achievement_id: string;
  unlocked_at: string;
}

export default function AchievementsPage() {
  const [achievements, setAchievements] = useState<Achievement[]>([]);
  const [userAchievements, setUserAchievements] = useState<UserAchievement[]>([]);
  const [selectedCategory, setSelectedCategory] = useState("all");
  const [selectedAchievement, setSelectedAchievement] = useState<Achievement | null>(null);
  const [userXp, setUserXp] = useState({ total_xp: 0, level: 1, current_streak: 0 });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadData();
  }, []);

  async function loadData() {
    const supabase = createClient();
    
    const { data: achievementsData } = await supabase
      .from("achievements")
      .select("*")
      .order("rarity", { ascending: true });
    
    if (achievementsData) setAchievements(achievementsData);

    const { data: { user } } = await supabase.auth.getUser();
    if (user) {
      const { data: userAchData } = await supabase
        .from("user_achievements")
        .select("achievement_id, unlocked_at")
        .eq("user_id", user.id);
      
      if (userAchData) setUserAchievements(userAchData);

      const { data: xpData } = await supabase
        .from("user_xp")
        .select("*")
        .eq("user_id", user.id)
        .single();
      
      if (xpData) setUserXp(xpData);
    }

    setLoading(false);
  }

  const categories = ["all", "learning", "assessment", "streak", "time", "social", "flashcards", "notes", "pomodoro", "xp", "leaderboard"];
  
  const filteredAchievements = selectedCategory === "all" 
    ? achievements 
    : achievements.filter(a => a.category === selectedCategory);

  const isUnlocked = (achievementId: string) => 
    userAchievements.some(ua => ua.achievement_id === achievementId);

  const unlockedCount = userAchievements.length;
  const totalCount = achievements.length;
  const progress = totalCount > 0 ? (unlockedCount / totalCount) * 100 : 0;

  const xpToNextLevel = userXp.level * 1000;
  const currentLevelXp = userXp.total_xp % 1000;
  const levelProgress = (currentLevelXp / xpToNextLevel) * 100;

  if (loading) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <motion.div
          animate={{ rotate: 360 }}
          transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
        >
          <Trophy className="h-12 w-12 text-primary" />
        </motion.div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background text-foreground">
      <div className="fixed inset-0 pointer-events-none overflow-hidden">
        <div className="absolute top-20 left-10 w-72 h-72 bg-primary/5 rounded-full blur-3xl animate-blob" />
        <div className="absolute bottom-20 right-10 w-96 h-96 bg-cyan-500/5 rounded-full blur-3xl animate-blob" style={{ animationDelay: "2s" }} />
        <div className="absolute top-1/2 left-1/2 w-64 h-64 bg-purple-500/5 rounded-full blur-3xl animate-blob" style={{ animationDelay: "4s" }} />
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
              <div className="p-2 rounded-xl bg-gradient-to-br from-amber-500 to-orange-500 animate-pulse-glow">
                <Trophy className="h-5 w-5 text-white" />
              </div>
              <h1 className="text-xl font-bold">Achievements</h1>
            </div>
          </div>

          <div className="flex items-center gap-4">
            <div className="flex items-center gap-2 px-4 py-2 rounded-xl bg-card border border-border">
              <Flame className="h-5 w-5 text-orange-500 animate-pulse" />
              <span className="font-bold">{userXp.current_streak} day streak</span>
            </div>
            <div className="flex items-center gap-2 px-4 py-2 rounded-xl bg-gradient-to-r from-primary/10 to-cyan-500/10 border border-primary/20">
              <Sparkles className="h-5 w-5 text-primary" />
              <span className="font-bold">{userXp.total_xp.toLocaleString()} XP</span>
            </div>
          </div>
        </div>
      </header>

      <main className="mx-auto max-w-7xl px-6 py-8">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-8"
        >
          <div className="lg:col-span-2 rounded-2xl bg-card border border-border p-6 relative overflow-hidden">
            <div className="absolute top-0 right-0 w-64 h-64 bg-gradient-to-br from-primary/10 to-transparent rounded-full blur-3xl" />
            
            <div className="relative flex items-center justify-between mb-6">
              <div>
                <h2 className="text-2xl font-bold mb-1">Level {userXp.level}</h2>
                <p className="text-muted-foreground">{currentLevelXp} / {xpToNextLevel} XP to next level</p>
              </div>
              <div className="relative">
                <motion.div
                  animate={{ scale: [1, 1.1, 1] }}
                  transition={{ duration: 2, repeat: Infinity }}
                  className="w-20 h-20 rounded-full bg-gradient-to-br from-primary to-cyan-500 flex items-center justify-center"
                >
                  <span className="text-3xl font-bold text-white">{userXp.level}</span>
                </motion.div>
                <div className="absolute -inset-2 rounded-full border-2 border-primary/30 animate-spin-slow" />
              </div>
            </div>

            <div className="h-4 bg-muted rounded-full overflow-hidden">
              <motion.div
                initial={{ width: 0 }}
                animate={{ width: `${levelProgress}%` }}
                transition={{ duration: 1, ease: "easeOut" }}
                className="h-full bg-gradient-to-r from-primary to-cyan-500 rounded-full relative"
              >
                <div className="absolute inset-0 animate-shimmer" />
              </motion.div>
            </div>
          </div>

          <div className="rounded-2xl bg-card border border-border p-6">
            <div className="flex items-center gap-3 mb-4">
              <div className="p-2 rounded-lg bg-purple-500/20">
                <Medal className="h-5 w-5 text-purple-500" />
              </div>
              <h3 className="font-bold">Collection Progress</h3>
            </div>
            
            <div className="text-center mb-4">
              <span className="text-4xl font-bold">{unlockedCount}</span>
              <span className="text-muted-foreground"> / {totalCount}</span>
            </div>

            <div className="h-3 bg-muted rounded-full overflow-hidden mb-2">
              <motion.div
                initial={{ width: 0 }}
                animate={{ width: `${progress}%` }}
                transition={{ duration: 1, delay: 0.3 }}
                className="h-full bg-gradient-to-r from-purple-500 to-pink-500 rounded-full"
              />
            </div>
            <p className="text-sm text-muted-foreground text-center">{progress.toFixed(1)}% complete</p>
          </div>
        </motion.div>

        <div className="flex flex-wrap gap-2 mb-8">
          {categories.map((cat) => (
            <Button
              key={cat}
              variant={selectedCategory === cat ? "default" : "outline"}
              size="sm"
              onClick={() => setSelectedCategory(cat)}
              className={`capitalize transition-all ${selectedCategory === cat ? "bg-primary text-white" : ""}`}
            >
              {cat}
            </Button>
          ))}
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
          {filteredAchievements.map((achievement, index) => {
            const Icon = iconMap[achievement.icon] || Trophy;
            const unlocked = isUnlocked(achievement.id);
            const rarity = rarityColors[achievement.rarity] || rarityColors.common;

            return (
              <motion.div
                key={achievement.id}
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ delay: index * 0.05 }}
                onClick={() => setSelectedAchievement(achievement)}
                className={`relative group cursor-pointer rounded-2xl p-5 border transition-all hover-lift ${
                  unlocked 
                    ? `bg-gradient-to-br ${rarity.bg} ${rarity.border} shadow-lg ${rarity.glow}` 
                    : "bg-card border-border opacity-60 hover:opacity-80"
                }`}
              >
                {unlocked && (
                  <motion.div
                    initial={{ scale: 0 }}
                    animate={{ scale: 1 }}
                    className="absolute -top-2 -right-2 p-1 rounded-full bg-primary"
                  >
                    <CheckCircle className="h-4 w-4 text-white" />
                  </motion.div>
                )}

                <div className={`mb-4 inline-flex p-3 rounded-xl ${unlocked ? `bg-gradient-to-br ${rarity.bg}` : "bg-muted"}`}>
                  {unlocked ? (
                    <Icon className={`h-8 w-8 ${rarity.text}`} />
                  ) : (
                    <Lock className="h-8 w-8 text-muted-foreground" />
                  )}
                </div>

                <h3 className={`font-bold mb-1 ${unlocked ? rarity.text : "text-muted-foreground"}`}>
                  {achievement.name}
                </h3>
                <p className="text-sm text-muted-foreground mb-3 line-clamp-2">
                  {achievement.description}
                </p>

                <div className="flex items-center justify-between">
                  <Badge className={`text-xs ${unlocked ? rarity.bg : "bg-muted"} ${rarity.text} border-0`}>
                    {achievement.rarity}
                  </Badge>
                  <div className="flex items-center gap-1 text-sm">
                    <Sparkles className="h-3 w-3 text-amber-500" />
                    <span className="font-medium">{achievement.xp_reward} XP</span>
                  </div>
                </div>

                {unlocked && (
                  <motion.div
                    className="absolute inset-0 rounded-2xl pointer-events-none"
                    animate={{ opacity: [0, 0.5, 0] }}
                    transition={{ duration: 2, repeat: Infinity }}
                    style={{ background: `radial-gradient(circle at center, ${rarity.text.replace("text-", "rgb(")}, transparent)`.replace("rgb(", "rgba(").replace(")", ", 0.1)") }}
                  />
                )}
              </motion.div>
            );
          })}
        </div>

        <AnimatePresence>
          {selectedAchievement && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm p-4"
              onClick={() => setSelectedAchievement(null)}
            >
              <motion.div
                initial={{ scale: 0.9, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                exit={{ scale: 0.9, opacity: 0 }}
                onClick={(e) => e.stopPropagation()}
                className="bg-card rounded-3xl p-8 max-w-md w-full border border-border relative overflow-hidden"
              >
                {isUnlocked(selectedAchievement.id) && (
                  <>
                    <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-primary via-cyan-500 to-primary animate-gradient-x" />
                    <motion.div
                      animate={{ rotate: 360 }}
                      transition={{ duration: 20, repeat: Infinity, ease: "linear" }}
                      className="absolute -top-20 -right-20 w-40 h-40 border border-primary/20 rounded-full"
                    />
                  </>
                )}

                <div className="text-center relative">
                  {(() => {
                    const Icon = iconMap[selectedAchievement.icon] || Trophy;
                    const rarity = rarityColors[selectedAchievement.rarity];
                    const unlocked = isUnlocked(selectedAchievement.id);
                    
                    return (
                      <>
                        <motion.div
                          animate={unlocked ? { scale: [1, 1.1, 1], rotate: [0, 5, -5, 0] } : {}}
                          transition={{ duration: 2, repeat: Infinity }}
                          className={`inline-flex p-6 rounded-2xl mb-6 ${unlocked ? `bg-gradient-to-br ${rarity.bg}` : "bg-muted"}`}
                        >
                          <Icon className={`h-16 w-16 ${unlocked ? rarity.text : "text-muted-foreground"}`} />
                        </motion.div>

                        <Badge className={`mb-4 ${rarity.bg} ${rarity.text} border-0 text-sm`}>
                          {selectedAchievement.rarity.toUpperCase()}
                        </Badge>

                        <h2 className="text-2xl font-bold mb-2">{selectedAchievement.name}</h2>
                        <p className="text-muted-foreground mb-6">{selectedAchievement.description}</p>

                        <div className="flex items-center justify-center gap-4 mb-6">
                          <div className="flex items-center gap-2 px-4 py-2 rounded-xl bg-amber-500/10">
                            <Sparkles className="h-5 w-5 text-amber-500" />
                            <span className="font-bold">{selectedAchievement.xp_reward} XP</span>
                          </div>
                          <div className="flex items-center gap-2 px-4 py-2 rounded-xl bg-muted">
                            <Target className="h-5 w-5 text-primary" />
                            <span className="font-medium">{selectedAchievement.requirement_value}x</span>
                          </div>
                        </div>

                        {unlocked ? (
                          <div className="flex items-center justify-center gap-2 text-primary">
                            <CheckCircle className="h-5 w-5" />
                            <span className="font-medium">Unlocked!</span>
                          </div>
                        ) : (
                          <div className="flex items-center justify-center gap-2 text-muted-foreground">
                            <Lock className="h-5 w-5" />
                            <span>Keep going to unlock!</span>
                          </div>
                        )}
                      </>
                    );
                  })()}
                </div>

                <Button
                  className="w-full mt-6"
                  variant="outline"
                  onClick={() => setSelectedAchievement(null)}
                >
                  Close
                </Button>
              </motion.div>
            </motion.div>
          )}
        </AnimatePresence>
      </main>
    </div>
  );
}
