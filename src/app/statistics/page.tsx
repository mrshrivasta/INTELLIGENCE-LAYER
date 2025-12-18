"use client";

import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { 
  BarChart3, TrendingUp, Clock, Target, Flame, Trophy, 
  BookOpen, Brain, Zap, Calendar, ArrowUp, ArrowDown,
  Activity, PieChart, LineChart, Users, Star, Award,
  ChevronLeft, ChevronRight, RefreshCw, Download, Filter
} from "lucide-react";
import Link from "next/link";
import { supabase } from "@/lib/supabase/client";

interface StatData {
  label: string;
  value: number;
  change: number;
  icon: React.ReactNode;
  color: string;
}

export default function StatisticsPage() {
  const [timeRange, setTimeRange] = useState<"week" | "month" | "year">("week");
  const [isLoading, setIsLoading] = useState(true);
  const [stats, setStats] = useState<StatData[]>([]);
  const [weeklyData, setWeeklyData] = useState<number[]>([65, 78, 52, 91, 43, 67, 85]);
  const [skillsData, setSkillsData] = useState([
    { name: "JavaScript", level: 78, color: "from-yellow-500 to-amber-500" },
    { name: "React", level: 65, color: "from-cyan-500 to-blue-500" },
    { name: "Python", level: 45, color: "from-green-500 to-emerald-500" },
    { name: "TypeScript", level: 58, color: "from-blue-500 to-indigo-500" },
    { name: "Node.js", level: 52, color: "from-lime-500 to-green-500" },
    { name: "SQL", level: 40, color: "from-purple-500 to-violet-500" },
  ]);
  const [activityHeatmap, setActivityHeatmap] = useState<number[][]>([]);
  const [achievements, setAchievements] = useState<{name: string; date: string; icon: string}[]>([]);

  useEffect(() => {
    fetchStats();
    generateHeatmap();
    fetchAchievements();
  }, [timeRange]);

  const fetchStats = async () => {
    setIsLoading(true);
    await new Promise(resolve => setTimeout(resolve, 800));
    
    setStats([
      { label: "Total XP", value: 12450, change: 12.5, icon: <Zap className="w-5 h-5" />, color: "from-amber-500 to-orange-500" },
      { label: "Lessons Completed", value: 87, change: 8.3, icon: <BookOpen className="w-5 h-5" />, color: "from-emerald-500 to-green-500" },
      { label: "Study Hours", value: 156, change: -2.1, icon: <Clock className="w-5 h-5" />, color: "from-blue-500 to-cyan-500" },
      { label: "Current Streak", value: 14, change: 40, icon: <Flame className="w-5 h-5" />, color: "from-red-500 to-orange-500" },
      { label: "Quizzes Passed", value: 32, change: 15.7, icon: <Target className="w-5 h-5" />, color: "from-purple-500 to-pink-500" },
      { label: "Achievements", value: 24, change: 4.2, icon: <Trophy className="w-5 h-5" />, color: "from-yellow-500 to-amber-500" },
    ]);
    
    setIsLoading(false);
  };

  const generateHeatmap = () => {
    const heatmap: number[][] = [];
    for (let week = 0; week < 12; week++) {
      const weekData: number[] = [];
      for (let day = 0; day < 7; day++) {
        weekData.push(Math.floor(Math.random() * 5));
      }
      heatmap.push(weekData);
    }
    setActivityHeatmap(heatmap);
  };

  const fetchAchievements = async () => {
    setAchievements([
      { name: "First Steps", date: "Dec 15", icon: "🎯" },
      { name: "Week Warrior", date: "Dec 12", icon: "🔥" },
      { name: "Quiz Master", date: "Dec 10", icon: "🧠" },
      { name: "Speed Learner", date: "Dec 8", icon: "⚡" },
    ]);
  };

  const getHeatmapColor = (value: number) => {
    const colors = [
      "bg-muted/30",
      "bg-emerald-900/50",
      "bg-emerald-700/60",
      "bg-emerald-500/70",
      "bg-emerald-400",
    ];
    return colors[value] || colors[0];
  };

  const days = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];

  return (
    <div className="min-h-screen bg-background p-6">
      <div className="max-w-7xl mx-auto space-y-8">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="flex flex-col md:flex-row md:items-center justify-between gap-4"
        >
          <div>
            <h1 className="text-4xl font-bold bg-gradient-to-r from-emerald-400 via-cyan-400 to-blue-400 bg-clip-text text-transparent">
              Statistics & Analytics
            </h1>
            <p className="text-muted-foreground mt-2">Track your learning progress and performance</p>
          </div>
          <div className="flex items-center gap-3">
            <div className="flex bg-muted/50 rounded-lg p-1">
              {(["week", "month", "year"] as const).map((range) => (
                <button
                  key={range}
                  onClick={() => setTimeRange(range)}
                  className={`px-4 py-2 rounded-md text-sm font-medium transition-all ${
                    timeRange === range
                      ? "bg-primary text-primary-foreground shadow-lg"
                      : "text-muted-foreground hover:text-foreground"
                  }`}
                >
                  {range.charAt(0).toUpperCase() + range.slice(1)}
                </button>
              ))}
            </div>
            <Button variant="outline" size="icon" onClick={fetchStats}>
              <RefreshCw className={`w-4 h-4 ${isLoading ? "animate-spin" : ""}`} />
            </Button>
            <Button variant="outline" size="icon">
              <Download className="w-4 h-4" />
            </Button>
          </div>
        </motion.div>

        {/* Stats Grid */}
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
          {stats.map((stat, index) => (
            <motion.div
              key={stat.label}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.1 }}
            >
              <Card className="p-4 bg-card/50 backdrop-blur border-border hover:border-primary/50 transition-all group">
                <div className={`w-10 h-10 rounded-lg bg-gradient-to-br ${stat.color} flex items-center justify-center mb-3 group-hover:scale-110 transition-transform`}>
                  {stat.icon}
                </div>
                <p className="text-2xl font-bold text-foreground">
                  {isLoading ? (
                    <span className="animate-pulse bg-muted rounded w-16 h-6 block" />
                  ) : (
                    stat.value.toLocaleString()
                  )}
                </p>
                <p className="text-sm text-muted-foreground">{stat.label}</p>
                <div className={`flex items-center gap-1 mt-2 text-xs ${stat.change >= 0 ? "text-emerald-500" : "text-red-500"}`}>
                  {stat.change >= 0 ? <ArrowUp className="w-3 h-3" /> : <ArrowDown className="w-3 h-3" />}
                  {Math.abs(stat.change)}%
                </div>
              </Card>
            </motion.div>
          ))}
        </div>

        {/* Charts Section */}
        <div className="grid lg:grid-cols-2 gap-6">
          {/* Weekly Activity Chart */}
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.3 }}
          >
            <Card className="p-6 bg-card/50 backdrop-blur border-border">
              <div className="flex items-center justify-between mb-6">
                <h3 className="text-lg font-semibold flex items-center gap-2">
                  <BarChart3 className="w-5 h-5 text-primary" />
                  Weekly Activity
                </h3>
                <Button variant="ghost" size="sm">
                  <Filter className="w-4 h-4 mr-2" />
                  Filter
                </Button>
              </div>
              <div className="flex items-end justify-between h-48 gap-2">
                {weeklyData.map((value, index) => (
                  <motion.div
                    key={index}
                    className="flex-1 flex flex-col items-center gap-2"
                    initial={{ height: 0 }}
                    animate={{ height: "auto" }}
                    transition={{ delay: index * 0.1 }}
                  >
                    <div className="w-full relative group">
                      <motion.div
                        className="w-full bg-gradient-to-t from-emerald-500 to-cyan-500 rounded-t-lg cursor-pointer hover:from-emerald-400 hover:to-cyan-400 transition-colors"
                        initial={{ height: 0 }}
                        animate={{ height: `${value * 1.5}px` }}
                        transition={{ delay: 0.5 + index * 0.1, duration: 0.5, type: "spring" }}
                      />
                      <div className="absolute -top-8 left-1/2 -translate-x-1/2 bg-foreground text-background px-2 py-1 rounded text-xs opacity-0 group-hover:opacity-100 transition-opacity">
                        {value}%
                      </div>
                    </div>
                    <span className="text-xs text-muted-foreground">{days[index]}</span>
                  </motion.div>
                ))}
              </div>
            </Card>
          </motion.div>

          {/* Skills Progress */}
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.4 }}
          >
            <Card className="p-6 bg-card/50 backdrop-blur border-border">
              <div className="flex items-center justify-between mb-6">
                <h3 className="text-lg font-semibold flex items-center gap-2">
                  <Brain className="w-5 h-5 text-primary" />
                  Skills Progress
                </h3>
                <Link href="/skills">
                  <Button variant="ghost" size="sm">View All</Button>
                </Link>
              </div>
              <div className="space-y-4">
                {skillsData.map((skill, index) => (
                  <motion.div
                    key={skill.name}
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: 0.5 + index * 0.1 }}
                  >
                    <div className="flex items-center justify-between mb-1">
                      <span className="text-sm font-medium">{skill.name}</span>
                      <span className="text-sm text-muted-foreground">{skill.level}%</span>
                    </div>
                    <div className="h-2 bg-muted rounded-full overflow-hidden">
                      <motion.div
                        className={`h-full bg-gradient-to-r ${skill.color} rounded-full`}
                        initial={{ width: 0 }}
                        animate={{ width: `${skill.level}%` }}
                        transition={{ delay: 0.7 + index * 0.1, duration: 0.8, type: "spring" }}
                      />
                    </div>
                  </motion.div>
                ))}
              </div>
            </Card>
          </motion.div>
        </div>

        {/* Activity Heatmap */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.5 }}
        >
          <Card className="p-6 bg-card/50 backdrop-blur border-border">
            <div className="flex items-center justify-between mb-6">
              <h3 className="text-lg font-semibold flex items-center gap-2">
                <Activity className="w-5 h-5 text-primary" />
                Activity Heatmap
              </h3>
              <div className="flex items-center gap-2 text-xs text-muted-foreground">
                <span>Less</span>
                {[0, 1, 2, 3, 4].map((level) => (
                  <div key={level} className={`w-3 h-3 rounded-sm ${getHeatmapColor(level)}`} />
                ))}
                <span>More</span>
              </div>
            </div>
            <div className="flex gap-1">
              <div className="flex flex-col gap-1 mr-2 text-xs text-muted-foreground">
                {days.map((day) => (
                  <div key={day} className="h-3 flex items-center">{day.slice(0, 1)}</div>
                ))}
              </div>
              {activityHeatmap.map((week, weekIndex) => (
                <div key={weekIndex} className="flex flex-col gap-1">
                  {week.map((day, dayIndex) => (
                    <motion.div
                      key={dayIndex}
                      className={`w-3 h-3 rounded-sm ${getHeatmapColor(day)} cursor-pointer hover:ring-2 hover:ring-primary transition-all`}
                      initial={{ scale: 0 }}
                      animate={{ scale: 1 }}
                      transition={{ delay: 0.6 + (weekIndex * 7 + dayIndex) * 0.01 }}
                      title={`${day} activities`}
                    />
                  ))}
                </div>
              ))}
            </div>
          </Card>
        </motion.div>

        {/* Recent Achievements & Study Time */}
        <div className="grid lg:grid-cols-2 gap-6">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.6 }}
          >
            <Card className="p-6 bg-card/50 backdrop-blur border-border">
              <div className="flex items-center justify-between mb-6">
                <h3 className="text-lg font-semibold flex items-center gap-2">
                  <Trophy className="w-5 h-5 text-primary" />
                  Recent Achievements
                </h3>
                <Link href="/achievements">
                  <Button variant="ghost" size="sm">View All</Button>
                </Link>
              </div>
              <div className="space-y-3">
                {achievements.map((achievement, index) => (
                  <motion.div
                    key={achievement.name}
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: 0.7 + index * 0.1 }}
                    className="flex items-center gap-3 p-3 bg-muted/30 rounded-lg hover:bg-muted/50 transition-colors"
                  >
                    <span className="text-2xl">{achievement.icon}</span>
                    <div className="flex-1">
                      <p className="font-medium">{achievement.name}</p>
                      <p className="text-xs text-muted-foreground">{achievement.date}</p>
                    </div>
                    <Award className="w-5 h-5 text-amber-500" />
                  </motion.div>
                ))}
              </div>
            </Card>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.7 }}
          >
            <Card className="p-6 bg-card/50 backdrop-blur border-border">
              <div className="flex items-center justify-between mb-6">
                <h3 className="text-lg font-semibold flex items-center gap-2">
                  <PieChart className="w-5 h-5 text-primary" />
                  Study Distribution
                </h3>
              </div>
              <div className="flex items-center justify-center">
                <div className="relative w-48 h-48">
                  <svg className="w-full h-full transform -rotate-90" viewBox="0 0 100 100">
                    {[
                      { value: 35, color: "#10b981", offset: 0 },
                      { value: 25, color: "#06b6d4", offset: 35 },
                      { value: 20, color: "#8b5cf6", offset: 60 },
                      { value: 20, color: "#f59e0b", offset: 80 },
                    ].map((segment, index) => (
                      <motion.circle
                        key={index}
                        cx="50"
                        cy="50"
                        r="40"
                        fill="none"
                        stroke={segment.color}
                        strokeWidth="20"
                        strokeDasharray={`${segment.value * 2.51} ${251 - segment.value * 2.51}`}
                        strokeDashoffset={-segment.offset * 2.51}
                        initial={{ strokeDasharray: "0 251" }}
                        animate={{ strokeDasharray: `${segment.value * 2.51} ${251 - segment.value * 2.51}` }}
                        transition={{ delay: 0.8 + index * 0.2, duration: 0.8 }}
                      />
                    ))}
                  </svg>
                  <div className="absolute inset-0 flex items-center justify-center">
                    <div className="text-center">
                      <p className="text-3xl font-bold">156h</p>
                      <p className="text-xs text-muted-foreground">Total</p>
                    </div>
                  </div>
                </div>
              </div>
              <div className="grid grid-cols-2 gap-3 mt-6">
                {[
                  { label: "JavaScript", value: "35%", color: "bg-emerald-500" },
                  { label: "React", value: "25%", color: "bg-cyan-500" },
                  { label: "Python", value: "20%", color: "bg-violet-500" },
                  { label: "Others", value: "20%", color: "bg-amber-500" },
                ].map((item, index) => (
                  <div key={item.label} className="flex items-center gap-2">
                    <div className={`w-3 h-3 rounded-full ${item.color}`} />
                    <span className="text-sm">{item.label}</span>
                    <span className="text-sm text-muted-foreground ml-auto">{item.value}</span>
                  </div>
                ))}
              </div>
            </Card>
          </motion.div>
        </div>

        {/* Navigation */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.8 }}
          className="flex justify-center"
        >
          <Link href="/dashboard">
            <Button variant="outline" className="gap-2">
              <ChevronLeft className="w-4 h-4" />
              Back to Dashboard
            </Button>
          </Link>
        </motion.div>
      </div>
    </div>
  );
}
