"use client";

import { UserProfile } from "@/lib/types";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import {
  User,
  GraduationCap,
  Target,
  TrendingUp,
  TrendingDown,
  Minus,
  Clock,
  Briefcase,
} from "lucide-react";

interface UserProfileCardProps {
  profile: UserProfile;
}

export function UserProfileCard({ profile }: UserProfileCardProps) {
  const getTrendIcon = () => {
    switch (profile.improvementTrend) {
      case "improving":
        return <TrendingUp className="h-4 w-4 text-emerald-500" />;
      case "declining":
        return <TrendingDown className="h-4 w-4 text-rose-500" />;
      default:
        return <Minus className="h-4 w-4 text-amber-500" />;
    }
  };

  const getTrendColor = () => {
    switch (profile.improvementTrend) {
      case "improving":
        return "bg-emerald-500/10 text-emerald-600 border-emerald-500/20";
      case "declining":
        return "bg-rose-500/10 text-rose-600 border-rose-500/20";
      default:
        return "bg-amber-500/10 text-amber-600 border-amber-500/20";
    }
  };

  const avgAccuracy =
    profile.topicAccuracyMap.reduce((acc, t) => acc + t.accuracy, 0) /
    profile.topicAccuracyMap.length;

  return (
    <Card className="border-0 bg-gradient-to-br from-slate-900 to-slate-800 text-white shadow-xl">
      <CardHeader className="pb-4">
        <div className="flex items-start justify-between">
          <div className="flex items-center gap-3">
            <div className="flex h-12 w-12 items-center justify-center rounded-full bg-gradient-to-br from-violet-500 to-fuchsia-500">
              <User className="h-6 w-6" />
            </div>
            <div>
              <CardTitle className="text-lg font-semibold">
                {profile.userId}
              </CardTitle>
              <p className="text-sm text-slate-400">{profile.userType.replace("_", " ")}</p>
            </div>
          </div>
          <Badge className={`${getTrendColor()} flex items-center gap-1`}>
            {getTrendIcon()}
            {profile.improvementTrend}
          </Badge>
        </div>
      </CardHeader>
      <CardContent className="space-y-5">
        <div className="grid grid-cols-2 gap-4">
          <div className="flex items-center gap-2 text-sm">
            <GraduationCap className="h-4 w-4 text-slate-400" />
            <span className="text-slate-300">{profile.educationLevel}</span>
          </div>
          <div className="flex items-center gap-2 text-sm">
            <Target className="h-4 w-4 text-slate-400" />
            <span className="text-slate-300">{profile.primaryGoal}</span>
          </div>
          <div className="flex items-center gap-2 text-sm">
            <Clock className="h-4 w-4 text-slate-400" />
            <span className="text-slate-300">{profile.hoursPerWeek}h/week</span>
          </div>
          <div className="flex items-center gap-2 text-sm">
            <Briefcase className="h-4 w-4 text-slate-400" />
            <span className="text-slate-300">{profile.targetRole}</span>
          </div>
        </div>

        <div className="space-y-2">
          <div className="flex items-center justify-between text-sm">
            <span className="text-slate-400">Overall Accuracy</span>
            <span className="font-medium">{avgAccuracy.toFixed(0)}%</span>
          </div>
          <Progress value={avgAccuracy} className="h-2 bg-slate-700" />
        </div>

        <div className="space-y-3">
          <div>
            <p className="mb-2 text-xs font-medium uppercase tracking-wider text-slate-500">
              Strong Areas
            </p>
            <div className="flex flex-wrap gap-1.5">
              {profile.strongAreas.map((area) => (
                <Badge
                  key={area}
                  variant="secondary"
                  className="bg-emerald-500/10 text-emerald-400 border-emerald-500/20 text-xs"
                >
                  {area}
                </Badge>
              ))}
            </div>
          </div>
          <div>
            <p className="mb-2 text-xs font-medium uppercase tracking-wider text-slate-500">
              Areas to Improve
            </p>
            <div className="flex flex-wrap gap-1.5">
              {profile.weakAreas.map((area) => (
                <Badge
                  key={area}
                  variant="secondary"
                  className="bg-rose-500/10 text-rose-400 border-rose-500/20 text-xs"
                >
                  {area}
                </Badge>
              ))}
            </div>
          </div>
        </div>

        <div className="grid grid-cols-3 gap-3 pt-2">
          <div className="rounded-lg bg-slate-800/50 p-3 text-center">
            <p className="text-xl font-bold text-violet-400">
              {profile.testScoreHistory.length}
            </p>
            <p className="text-xs text-slate-500">Tests Taken</p>
          </div>
          <div className="rounded-lg bg-slate-800/50 p-3 text-center">
            <p className="text-xl font-bold text-fuchsia-400">
              {profile.skillLevel}
            </p>
            <p className="text-xs text-slate-500">Skill Level</p>
          </div>
          <div className="rounded-lg bg-slate-800/50 p-3 text-center">
            <p className="text-xl font-bold text-cyan-400">
              {profile.consistencyScore}
            </p>
            <p className="text-xs text-slate-500">Consistency</p>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
