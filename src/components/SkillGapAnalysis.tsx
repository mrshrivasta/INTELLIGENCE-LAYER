"use client";

import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { Button } from "@/components/ui/button";
import {
  Target,
  TrendingUp,
  TrendingDown,
  AlertCircle,
  CheckCircle,
  Brain,
  Zap,
  Award,
} from "lucide-react";

interface SkillData {
  name: string;
  current: number;
  target: number;
  trend: "up" | "down" | "stable";
  priority: "high" | "medium" | "low";
}

export function SkillGapAnalysis() {
  const skills: SkillData[] = [
    { name: "React", current: 85, target: 95, trend: "up", priority: "high" },
    { name: "TypeScript", current: 65, target: 90, trend: "up", priority: "high" },
    { name: "Node.js", current: 70, target: 85, trend: "stable", priority: "medium" },
    { name: "GraphQL", current: 45, target: 80, trend: "up", priority: "high" },
    { name: "Testing", current: 55, target: 85, trend: "down", priority: "high" },
    { name: "CI/CD", current: 40, target: 75, trend: "stable", priority: "medium" },
  ];

  const getGapPercentage = (skill: SkillData) => {
    return Math.round(((skill.target - skill.current) / skill.target) * 100);
  };

  const getStatusColor = (skill: SkillData) => {
    const gap = getGapPercentage(skill);
    if (gap < 10) return "text-emerald-500";
    if (gap < 30) return "text-yellow-500";
    return "text-red-500";
  };

  const overallProgress = Math.round(
    skills.reduce((acc, s) => acc + s.current, 0) / skills.length
  );

  return (
    <div className="space-y-6">
      <Card className="border-white/10 bg-gradient-to-r from-violet-600/10 via-fuchsia-600/10 to-pink-600/10 p-6 backdrop-blur">
        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center gap-3">
            <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-gradient-to-br from-violet-500 to-fuchsia-500">
              <Brain className="h-6 w-6 text-white" />
            </div>
            <div>
              <h3 className="text-xl font-bold text-white">AI Skill Gap Analysis</h3>
              <p className="text-sm text-slate-400">
                Real-time analysis powered by machine learning
              </p>
            </div>
          </div>
          <Badge className="gap-1 bg-emerald-500/20 text-emerald-300 border-emerald-500/30">
            <Zap className="h-3 w-3" />
            Live
          </Badge>
        </div>

        <div className="mb-6 rounded-xl border border-white/10 bg-white/5 p-4">
          <div className="flex items-center justify-between mb-2">
            <span className="text-sm text-slate-400">Overall Progress</span>
            <span className="text-xl font-bold text-white">{overallProgress}%</span>
          </div>
          <Progress value={overallProgress} className="h-3" />
          <p className="mt-2 text-xs text-slate-400">
            {overallProgress >= 80
              ? "Excellent! You're on track for your target role"
              : overallProgress >= 60
              ? "Good progress. Focus on high-priority skills"
              : "Keep learning! AI recommendations below"}
          </p>
        </div>

        <div className="space-y-4">
          {skills.map((skill, idx) => {
            const gap = getGapPercentage(skill);
            return (
              <div
                key={idx}
                className="rounded-xl border border-white/10 bg-white/5 p-4 transition-all hover:border-white/20 hover:bg-white/10"
              >
                <div className="mb-3 flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <span className="font-semibold text-white">{skill.name}</span>
                    {skill.trend === "up" && (
                      <TrendingUp className="h-4 w-4 text-emerald-500" />
                    )}
                    {skill.trend === "down" && (
                      <TrendingDown className="h-4 w-4 text-red-500" />
                    )}
                    {skill.priority === "high" && (
                      <Badge variant="outline" className="border-red-500/30 text-red-400 text-xs">
                        High Priority
                      </Badge>
                    )}
                  </div>
                  <div className="flex items-center gap-3">
                    <span className="text-sm text-slate-400">
                      {skill.current}% → {skill.target}%
                    </span>
                    <span className={`text-sm font-bold ${getStatusColor(skill)}`}>
                      {gap}% gap
                    </span>
                  </div>
                </div>

                <div className="relative">
                  <Progress value={skill.current} className="h-2 bg-slate-700" />
                  <div
                    className="absolute top-0 h-2 rounded-full border-2 border-violet-400 bg-transparent"
                    style={{
                      width: `${skill.target}%`,
                      left: 0,
                    }}
                  />
                </div>

                <div className="mt-2 flex items-center justify-between text-xs">
                  <span className="text-slate-500">Current: {skill.current}%</span>
                  <span className="text-violet-400">Target: {skill.target}%</span>
                </div>
              </div>
            );
          })}
        </div>

        <div className="mt-6 grid gap-4 sm:grid-cols-2">
          <Card className="border-emerald-500/20 bg-emerald-500/10 p-4">
            <div className="flex items-center gap-2 mb-2">
              <CheckCircle className="h-5 w-5 text-emerald-500" />
              <h4 className="font-semibold text-emerald-400">Strengths</h4>
            </div>
            <ul className="space-y-1 text-sm text-slate-300">
              <li>• React fundamentals (85%)</li>
              <li>• Node.js backend (70%)</li>
              <li>• Strong learning velocity</li>
            </ul>
          </Card>

          <Card className="border-red-500/20 bg-red-500/10 p-4">
            <div className="flex items-center gap-2 mb-2">
              <AlertCircle className="h-5 w-5 text-red-500" />
              <h4 className="font-semibold text-red-400">Focus Areas</h4>
            </div>
            <ul className="space-y-1 text-sm text-slate-300">
              <li>• TypeScript (25% gap)</li>
              <li>• GraphQL (35% gap)</li>
              <li>• Testing practices (30% gap)</li>
            </ul>
          </Card>
        </div>

        <div className="mt-6 rounded-xl border border-violet-500/30 bg-violet-500/10 p-4">
          <div className="flex items-center gap-2 mb-3">
            <Brain className="h-5 w-5 text-violet-400" />
            <h4 className="font-semibold text-violet-300">AI Recommendations</h4>
          </div>
          <ul className="space-y-2 text-sm text-slate-300">
            <li className="flex items-start gap-2">
              <Award className="h-4 w-4 text-violet-400 mt-0.5 flex-shrink-0" />
              <span>Complete TypeScript course (Est. 2 weeks) to close 25% gap</span>
            </li>
            <li className="flex items-start gap-2">
              <Award className="h-4 w-4 text-violet-400 mt-0.5 flex-shrink-0" />
              <span>Focus on testing frameworks - take daily assessments</span>
            </li>
            <li className="flex items-start gap-2">
              <Award className="h-4 w-4 text-violet-400 mt-0.5 flex-shrink-0" />
              <span>GraphQL tutorial + practice project (Est. 3 weeks)</span>
            </li>
          </ul>
          <Button className="mt-4 w-full gap-2 bg-gradient-to-r from-violet-600 to-fuchsia-600 hover:from-violet-500 hover:to-fuchsia-500">
            <Target className="h-4 w-4" />
            Start AI-Guided Learning Path
          </Button>
        </div>
      </Card>
    </div>
  );
}
