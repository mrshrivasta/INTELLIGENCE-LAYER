"use client";

import { useState } from "react";
import { LearningRoadmap, RoadmapPhase } from "@/lib/types";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  Map,
  BookOpen,
  Rocket,
  Trophy,
  ChevronRight,
  AlertTriangle,
  Brain,
  CheckCircle,
  Target,
} from "lucide-react";

interface RoadmapCardProps {
  roadmap: LearningRoadmap;
}

function PhaseCard({ phase, phaseType }: { phase: RoadmapPhase; phaseType: string }) {
  const getPhaseIcon = () => {
    switch (phaseType) {
      case "foundational":
        return <BookOpen className="h-5 w-5" />;
      case "intermediate":
        return <Rocket className="h-5 w-5" />;
      default:
        return <Trophy className="h-5 w-5" />;
    }
  };

  const getPhaseColor = () => {
    switch (phaseType) {
      case "foundational":
        return "from-emerald-500 to-teal-500";
      case "intermediate":
        return "from-amber-500 to-orange-500";
      default:
        return "from-violet-500 to-purple-500";
    }
  };

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case "high":
        return "bg-rose-100 text-rose-700 border-rose-200";
      case "medium":
        return "bg-amber-100 text-amber-700 border-amber-200";
      default:
        return "bg-emerald-100 text-emerald-700 border-emerald-200";
    }
  };

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div
            className={`flex h-10 w-10 items-center justify-center rounded-xl bg-gradient-to-br ${getPhaseColor()} text-white`}
          >
            {getPhaseIcon()}
          </div>
          <div>
            <h3 className="font-semibold text-slate-900">{phase.name}</h3>
            <p className="text-sm text-slate-500">Duration: {phase.duration}</p>
          </div>
        </div>
      </div>

      <div className="space-y-3">
        {phase.topics.map((topic, idx) => (
          <div
            key={idx}
            className="rounded-lg border border-slate-200 bg-white p-4 transition-all hover:border-violet-200 hover:shadow-sm"
          >
            <div className="mb-2 flex items-center justify-between">
              <h4 className="font-medium text-slate-900">{topic.name}</h4>
              <Badge className={getPriorityColor(topic.priority)}>
                {topic.priority}
              </Badge>
            </div>
            <p className="mb-2 text-sm text-slate-600">{topic.importance}</p>
            <div className="flex items-start gap-2 rounded-lg bg-slate-50 p-2">
              <Target className="mt-0.5 h-4 w-4 shrink-0 text-violet-500" />
              <span className="text-xs text-slate-600">
                <span className="font-medium">Expected Outcome:</span>{" "}
                {topic.expectedOutcome}
              </span>
            </div>
            {topic.dependencies && topic.dependencies.length > 0 && (
              <div className="mt-2 flex items-center gap-2">
                <span className="text-xs text-slate-500">Requires:</span>
                {topic.dependencies.map((dep, i) => (
                  <Badge
                    key={i}
                    variant="outline"
                    className="text-xs text-slate-600"
                  >
                    {dep}
                  </Badge>
                ))}
              </div>
            )}
          </div>
        ))}
      </div>

      <div className="rounded-lg border border-violet-200 bg-violet-50 p-4">
        <p className="mb-2 text-xs font-semibold uppercase tracking-wider text-violet-700">
          Milestones
        </p>
        <ul className="space-y-2">
          {phase.milestones.map((milestone, idx) => (
            <li key={idx} className="flex items-center gap-2">
              <CheckCircle className="h-4 w-4 text-violet-600" />
              <span className="text-sm text-violet-800">{milestone}</span>
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
}

export function RoadmapCard({ roadmap }: RoadmapCardProps) {
  const [activePhase, setActivePhase] = useState("foundational");

  return (
    <Card className="border-slate-200 bg-white shadow-sm">
      <CardHeader className="pb-3">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-gradient-to-br from-rose-500 to-pink-500">
              <Map className="h-5 w-5 text-white" />
            </div>
            <div>
              <CardTitle className="text-base font-semibold text-slate-900">
                Learning Roadmap
              </CardTitle>
              <p className="text-xs text-slate-500">
                {roadmap.field} • {roadmap.targetRole || "General Path"}
              </p>
            </div>
          </div>
          <div className="flex gap-2">
            <Badge variant="outline" className="text-slate-600">
              {roadmap.userLevel}
            </Badge>
            <Badge className="bg-violet-100 text-violet-700">
              {roadmap.timeline.replace("_", " ")}
            </Badge>
          </div>
        </div>
      </CardHeader>
      <CardContent className="space-y-4">
        <Tabs value={activePhase} onValueChange={setActivePhase}>
          <TabsList className="grid w-full grid-cols-3">
            <TabsTrigger value="foundational" className="text-xs">
              Foundation
            </TabsTrigger>
            <TabsTrigger value="intermediate" className="text-xs">
              Intermediate
            </TabsTrigger>
            <TabsTrigger value="advanced" className="text-xs">
              Advanced
            </TabsTrigger>
          </TabsList>
          <TabsContent value="foundational" className="mt-4">
            <PhaseCard phase={roadmap.phases.foundational} phaseType="foundational" />
          </TabsContent>
          <TabsContent value="intermediate" className="mt-4">
            <PhaseCard phase={roadmap.phases.intermediate} phaseType="intermediate" />
          </TabsContent>
          <TabsContent value="advanced" className="mt-4">
            <PhaseCard phase={roadmap.phases.advanced} phaseType="advanced" />
          </TabsContent>
        </Tabs>

        <div className="rounded-xl border border-slate-200 bg-slate-50 p-4">
          <div className="mb-3 flex items-center gap-2">
            <BookOpen className="h-5 w-5 text-slate-600" />
            <h4 className="font-semibold text-slate-900">Practice Guidance</h4>
          </div>
          <div className="grid gap-3 sm:grid-cols-2">
            <div>
              <p className="text-xs font-medium text-slate-500">Type</p>
              <p className="text-sm text-slate-700">{roadmap.practiceGuidance.type}</p>
            </div>
            <div>
              <p className="text-xs font-medium text-slate-500">Validation</p>
              <p className="text-sm text-slate-700">
                {roadmap.practiceGuidance.validationMethod}
              </p>
            </div>
          </div>
          <p className="mt-3 text-sm text-slate-600">
            {roadmap.practiceGuidance.description}
          </p>
          <div className="mt-3">
            <p className="mb-2 text-xs font-medium text-rose-600">Avoid Over-Focusing On:</p>
            <div className="flex flex-wrap gap-1.5">
              {roadmap.practiceGuidance.avoidOverFocus.map((item, idx) => (
                <Badge
                  key={idx}
                  variant="outline"
                  className="text-xs text-rose-600 border-rose-200"
                >
                  {item}
                </Badge>
              ))}
            </div>
          </div>
        </div>

        <div className="grid gap-4 sm:grid-cols-2">
          <div className="rounded-xl border border-amber-200 bg-amber-50 p-4">
            <div className="mb-3 flex items-center gap-2">
              <AlertTriangle className="h-5 w-5 text-amber-600" />
              <h4 className="font-semibold text-amber-900">Common Misconceptions</h4>
            </div>
            <ul className="space-y-2">
              {roadmap.commonMisconceptions.map((item, idx) => (
                <li key={idx} className="flex items-start gap-2">
                  <ChevronRight className="mt-0.5 h-4 w-4 shrink-0 text-amber-600" />
                  <span className="text-sm text-amber-800">{item}</span>
                </li>
              ))}
            </ul>
          </div>

          <div className="rounded-xl border border-emerald-200 bg-emerald-50 p-4">
            <div className="mb-3 flex items-center gap-2">
              <Brain className="h-5 w-5 text-emerald-600" />
              <h4 className="font-semibold text-emerald-900">Learning Mindset</h4>
            </div>
            <ul className="space-y-2">
              {roadmap.learningMindset.map((item, idx) => (
                <li key={idx} className="flex items-start gap-2">
                  <CheckCircle className="mt-0.5 h-4 w-4 shrink-0 text-emerald-600" />
                  <span className="text-sm text-emerald-800">{item}</span>
                </li>
              ))}
            </ul>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
