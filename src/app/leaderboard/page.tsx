"use client";

import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
  Trophy, Crown, Medal, Award, ArrowLeft, TrendingUp, Users,
  Flame, Sparkles, Star, ChevronUp, ChevronDown, Minus,
} from "lucide-react";
import Link from "next/link";
import { createClient } from "@/lib/supabase/client";

interface LeaderboardUser {
  id: string;
  full_name: string;
  total_xp: number;
  level: number;
  current_streak: number;
  rank: number;
  change: number;
}

export default function LeaderboardPage() {
  const [users, setUsers] = useState<LeaderboardUser[]>([]);
  const [currentUserId, setCurrentUserId] = useState<string | null>(null);
  const [timeframe, setTimeframe] = useState<"weekly" | "monthly" | "all">("weekly");
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadData();
  }, [timeframe]);

  async function loadData() {
    const supabase = createClient();
    
    const { data: { user } } = await supabase.auth.getUser();
    if (user) setCurrentUserId(user.id);

    const { data: profilesData } = await supabase
      .from("user_profiles")
      .select("id, full_name");

    const { data: xpData } = await supabase
      .from("user_xp")
      .select("*")
      .order("total_xp", { ascending: false });

    if (profilesData && xpData) {
      const combined = xpData.map((xp, index) => {
        const profile = profilesData.find(p => p.id === xp.user_id);
        return {
          id: xp.user_id,
          full_name: profile?.full_name || "Anonymous",
          total_xp: xp.total_xp,
          level: xp.level,
          current_streak: xp.current_streak,
          rank: index + 1,
          change: Math.floor(Math.random() * 5) - 2,
        };
      });
      setUsers(combined);
    }

    if (users.length === 0) {
      setUsers([
        { id: "1", full_name: "Alex Chen", total_xp: 15420, level: 15, current_streak: 45, rank: 1, change: 0 },
        { id: "2", full_name: "Sarah Johnson", total_xp: 14890, level: 14, current_streak: 38, rank: 2, change: 1 },
        { id: "3", full_name: "Mike Williams", total_xp: 13560, level: 13, current_streak: 30, rank: 3, change: -1 },
        { id: "4", full_name: "Emily Brown", total_xp: 12340, level: 12, current_streak: 25, rank: 4, change: 2 },
        { id: "5", full_name: "David Lee", total_xp: 11200, level: 11, current_streak: 20, rank: 5, change: 0 },
        { id: "6", full_name: "Lisa Wang", total_xp: 10500, level: 10, current_streak: 18, rank: 6, change: -2 },
        { id: "7", full_name: "James Miller", total_xp: 9800, level: 9, current_streak: 15, rank: 7, change: 1 },
        { id: "8", full_name: "Emma Davis", total_xp: 8900, level: 8, current_streak: 12, rank: 8, change: 0 },
        { id: "9", full_name: "Ryan Taylor", total_xp: 8200, level: 8, current_streak: 10, rank: 9, change: -1 },
        { id: "10", full_name: "Sophia Martinez", total_xp: 7500, level: 7, current_streak: 8, rank: 10, change: 3 },
      ]);
    }

    setLoading(false);
  }

  const getRankIcon = (rank: number) => {
    if (rank === 1) return <Crown className="h-6 w-6 text-amber-400" />;
    if (rank === 2) return <Medal className="h-6 w-6 text-gray-400" />;
    if (rank === 3) return <Medal className="h-6 w-6 text-amber-700" />;
    return <span className="text-lg font-bold text-muted-foreground">{rank}</span>;
  };

  const getRankBg = (rank: number) => {
    if (rank === 1) return "bg-gradient-to-r from-amber-500/20 to-yellow-500/20 border-amber-500/30";
    if (rank === 2) return "bg-gradient-to-r from-gray-400/20 to-slate-400/20 border-gray-400/30";
    if (rank === 3) return "bg-gradient-to-r from-amber-700/20 to-orange-700/20 border-amber-700/30";
    return "bg-card border-border";
  };

  const getChangeIcon = (change: number) => {
    if (change > 0) return <ChevronUp className="h-4 w-4 text-green-500" />;
    if (change < 0) return <ChevronDown className="h-4 w-4 text-red-500" />;
    return <Minus className="h-4 w-4 text-muted-foreground" />;
  };

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

  const topThree = users.slice(0, 3);
  const rest = users.slice(3);

  return (
    <div className="min-h-screen bg-background text-foreground">
      <div className="fixed inset-0 pointer-events-none overflow-hidden">
        <div className="absolute top-20 left-10 w-72 h-72 bg-amber-500/5 rounded-full blur-3xl animate-blob" />
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
              <div className="p-2 rounded-xl bg-gradient-to-br from-amber-500 to-orange-500">
                <Trophy className="h-5 w-5 text-white" />
              </div>
              <h1 className="text-xl font-bold">Leaderboard</h1>
            </div>
          </div>

          <div className="flex items-center gap-2">
            {(["weekly", "monthly", "all"] as const).map((tf) => (
              <Button
                key={tf}
                variant={timeframe === tf ? "default" : "outline"}
                size="sm"
                onClick={() => setTimeframe(tf)}
                className="capitalize"
              >
                {tf === "all" ? "All Time" : tf}
              </Button>
            ))}
          </div>
        </div>
      </header>

      <main className="mx-auto max-w-4xl px-6 py-8">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="flex items-end justify-center gap-4 mb-12"
        >
          {[topThree[1], topThree[0], topThree[2]].filter(Boolean).map((user, i) => {
            const isFirst = i === 1;
            const heights = ["h-32", "h-44", "h-28"];
            const positions = [2, 1, 3];
            
            return (
              <motion.div
                key={user.id}
                initial={{ opacity: 0, y: 50 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: i * 0.2 }}
                className="text-center"
              >
                <div className={`relative mb-4 ${isFirst ? "animate-bounce-slow" : ""}`}>
                  <div className={`w-20 h-20 rounded-full bg-gradient-to-br ${
                    isFirst ? "from-amber-400 to-amber-600" : 
                    i === 0 ? "from-gray-300 to-gray-500" : "from-amber-600 to-amber-800"
                  } flex items-center justify-center text-2xl font-bold text-white mx-auto shadow-lg`}>
                    {user.full_name.charAt(0)}
                  </div>
                  {isFirst && (
                    <motion.div
                      animate={{ y: [0, -5, 0] }}
                      transition={{ duration: 1, repeat: Infinity }}
                      className="absolute -top-6 left-1/2 -translate-x-1/2"
                    >
                      <Crown className="h-8 w-8 text-amber-400" />
                    </motion.div>
                  )}
                </div>
                
                <p className="font-bold mb-1">{user.full_name}</p>
                <p className="text-sm text-muted-foreground mb-2">{user.total_xp.toLocaleString()} XP</p>
                
                <div className={`${heights[i]} w-24 rounded-t-xl bg-gradient-to-t ${
                  isFirst ? "from-amber-500/50 to-amber-500/20" :
                  i === 0 ? "from-gray-400/50 to-gray-400/20" : "from-amber-700/50 to-amber-700/20"
                } flex items-end justify-center pb-2`}>
                  <span className="text-4xl font-bold">{positions[i]}</span>
                </div>
              </motion.div>
            );
          })}
        </motion.div>

        <div className="space-y-3">
          {rest.map((user, index) => (
            <motion.div
              key={user.id}
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: index * 0.05 }}
              className={`flex items-center gap-4 p-4 rounded-xl border transition-all hover:scale-[1.02] ${getRankBg(user.rank)} ${
                user.id === currentUserId ? "ring-2 ring-primary" : ""
              }`}
            >
              <div className="w-10 h-10 flex items-center justify-center">
                {getRankIcon(user.rank)}
              </div>

              <div className="w-12 h-12 rounded-full bg-gradient-to-br from-primary/20 to-cyan-500/20 flex items-center justify-center text-lg font-bold">
                {user.full_name.charAt(0)}
              </div>

              <div className="flex-1">
                <div className="flex items-center gap-2">
                  <p className="font-bold">{user.full_name}</p>
                  {user.id === currentUserId && (
                    <Badge className="text-xs bg-primary/20 text-primary border-0">You</Badge>
                  )}
                </div>
                <div className="flex items-center gap-3 text-sm text-muted-foreground">
                  <span className="flex items-center gap-1">
                    <Star className="h-3 w-3" /> Level {user.level}
                  </span>
                  <span className="flex items-center gap-1">
                    <Flame className="h-3 w-3 text-orange-500" /> {user.current_streak} days
                  </span>
                </div>
              </div>

              <div className="text-right">
                <p className="font-bold text-lg">{user.total_xp.toLocaleString()}</p>
                <p className="text-xs text-muted-foreground">XP</p>
              </div>

              <div className="flex items-center gap-1 w-16 justify-end">
                {getChangeIcon(user.change)}
                <span className={`text-sm ${
                  user.change > 0 ? "text-green-500" : 
                  user.change < 0 ? "text-red-500" : "text-muted-foreground"
                }`}>
                  {Math.abs(user.change) || "-"}
                </span>
              </div>
            </motion.div>
          ))}
        </div>
      </main>
    </div>
  );
}
