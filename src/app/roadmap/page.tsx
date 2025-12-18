"use client";

import { useState, useEffect } from "react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { createClient } from "@/lib/supabase/client";
import { Brain, Map, CheckCircle2, Circle, ArrowLeft, Sun, Moon, Clock, BookOpen, Code, Trophy, Rocket } from "lucide-react";
import { DeveloperWatermark } from "@/components/DeveloperWatermark";
import { AIChatbot } from "@/components/AIChatbot";
import { NotificationPanel } from "@/components/NotificationPanel";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useTheme } from "@/components/ThemeProvider";

interface RoadmapPhase {
  title: string;
  duration: string;
  topics: { name: string; completed: boolean }[];
  completed: boolean;
  icon: any;
}

const roadmapsByField: Record<string, RoadmapPhase[]> = {
  "Web Development": [
    {
      title: "Foundation Phase",
      duration: "Weeks 1-4",
      icon: BookOpen,
      topics: [
        { name: "HTML5 & Semantic Markup", completed: false },
        { name: "CSS3 & Flexbox/Grid", completed: false },
        { name: "JavaScript Fundamentals", completed: false },
        { name: "Version Control with Git", completed: false },
      ],
      completed: false,
    },
    {
      title: "Frontend Development",
      duration: "Weeks 5-8",
      icon: Code,
      topics: [
        { name: "React.js Fundamentals", completed: false },
        { name: "State Management (Redux/Context)", completed: false },
        { name: "Responsive Design", completed: false },
        { name: "API Integration", completed: false },
      ],
      completed: false,
    },
    {
      title: "Backend Development",
      duration: "Weeks 9-12",
      icon: Rocket,
      topics: [
        { name: "Node.js & Express", completed: false },
        { name: "Database Design (SQL/NoSQL)", completed: false },
        { name: "Authentication & Security", completed: false },
        { name: "RESTful API Design", completed: false },
      ],
      completed: false,
    },
    {
      title: "Full Stack Mastery",
      duration: "Weeks 13-16",
      icon: Trophy,
      topics: [
        { name: "Full Stack Project", completed: false },
        { name: "Deployment & DevOps", completed: false },
        { name: "Performance Optimization", completed: false },
        { name: "Portfolio & Job Prep", completed: false },
      ],
      completed: false,
    },
  ],
  "Data Science & AI": [
    {
      title: "Foundation Phase",
      duration: "Weeks 1-4",
      icon: BookOpen,
      topics: [
        { name: "Python Programming", completed: false },
        { name: "Statistics & Probability", completed: false },
        { name: "NumPy & Pandas", completed: false },
        { name: "Data Visualization", completed: false },
      ],
      completed: false,
    },
    {
      title: "Machine Learning Basics",
      duration: "Weeks 5-8",
      icon: Code,
      topics: [
        { name: "Supervised Learning", completed: false },
        { name: "Unsupervised Learning", completed: false },
        { name: "Model Evaluation", completed: false },
        { name: "Feature Engineering", completed: false },
      ],
      completed: false,
    },
    {
      title: "Deep Learning",
      duration: "Weeks 9-12",
      icon: Rocket,
      topics: [
        { name: "Neural Networks", completed: false },
        { name: "CNN for Computer Vision", completed: false },
        { name: "RNN & NLP", completed: false },
        { name: "TensorFlow/PyTorch", completed: false },
      ],
      completed: false,
    },
    {
      title: "AI Mastery",
      duration: "Weeks 13-16",
      icon: Trophy,
      topics: [
        { name: "Advanced ML Projects", completed: false },
        { name: "MLOps & Deployment", completed: false },
        { name: "Research Papers", completed: false },
        { name: "Kaggle Competitions", completed: false },
      ],
      completed: false,
    },
  ],
  "Cybersecurity": [
    {
      title: "Foundation Phase",
      duration: "Weeks 1-4",
      icon: BookOpen,
      topics: [
        { name: "Networking Fundamentals", completed: false },
        { name: "Linux Administration", completed: false },
        { name: "Security Concepts", completed: false },
        { name: "Cryptography Basics", completed: false },
      ],
      completed: false,
    },
    {
      title: "Offensive Security",
      duration: "Weeks 5-8",
      icon: Code,
      topics: [
        { name: "Penetration Testing", completed: false },
        { name: "Web Application Security", completed: false },
        { name: "Network Attacks", completed: false },
        { name: "Social Engineering", completed: false },
      ],
      completed: false,
    },
    {
      title: "Defensive Security",
      duration: "Weeks 9-12",
      icon: Rocket,
      topics: [
        { name: "Incident Response", completed: false },
        { name: "SIEM & Monitoring", completed: false },
        { name: "Malware Analysis", completed: false },
        { name: "Compliance & Governance", completed: false },
      ],
      completed: false,
    },
    {
      title: "Expert Level",
      duration: "Weeks 13-16",
      icon: Trophy,
      topics: [
        { name: "Advanced Exploitation", completed: false },
        { name: "Red Team Operations", completed: false },
        { name: "Bug Bounty Hunting", completed: false },
        { name: "Certifications (CEH, OSCP)", completed: false },
      ],
      completed: false,
    },
  ],
};

function getDefaultRoadmap(field: string): RoadmapPhase[] {
  return [
    {
      title: "Foundation Phase",
      duration: "Weeks 1-4",
      icon: BookOpen,
      topics: [
        { name: `Introduction to ${field}`, completed: false },
        { name: "Core concepts and terminology", completed: false },
        { name: "Basic tools and setup", completed: false },
        { name: "Fundamentals practice", completed: false },
      ],
      completed: false,
    },
    {
      title: "Intermediate Phase",
      duration: "Weeks 5-8",
      icon: Code,
      topics: [
        { name: `Advanced ${field} concepts`, completed: false },
        { name: "Problem-solving techniques", completed: false },
        { name: "Best practices", completed: false },
        { name: "Mini projects", completed: false },
      ],
      completed: false,
    },
    {
      title: "Advanced Phase",
      duration: "Weeks 9-12",
      icon: Rocket,
      topics: [
        { name: "Complex problem solving", completed: false },
        { name: "Optimization techniques", completed: false },
        { name: "Real-world applications", completed: false },
        { name: "Portfolio projects", completed: false },
      ],
      completed: false,
    },
    {
      title: "Mastery Phase",
      duration: "Weeks 13-16",
      icon: Trophy,
      topics: [
        { name: "Expert-level challenges", completed: false },
        { name: "Industry best practices", completed: false },
        { name: "Certification preparation", completed: false },
        { name: "Career readiness", completed: false },
      ],
      completed: false,
    },
  ];
}

export default function RoadmapPage() {
  const router = useRouter();
  const { theme, toggleTheme } = useTheme();
  const [profile, setProfile] = useState<any>(null);
  const [roadmap, setRoadmap] = useState<RoadmapPhase[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadRoadmap();
  }, []);

  async function loadRoadmap() {
    const supabase = createClient();
    const { data: { user } } = await supabase.auth.getUser();
    
    if (!user) {
      router.push("/login");
      return;
    }

    const { data: profileArr } = await supabase
      .from("user_profiles")
      .select("*")
      .eq("id", user.id);

    const profileData = profileArr?.[0];

    if (!profileData?.onboarding_completed) {
      router.push("/onboarding");
      return;
    }

    setProfile(profileData);
    
    const field = profileData.field_of_interest || "General";
    const fieldRoadmap = roadmapsByField[field] || getDefaultRoadmap(field);
    setRoadmap(fieldRoadmap);
    setLoading(false);
  }

  if (loading) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-background">
        <div className="text-center">
          <Map className="mx-auto h-12 w-12 animate-pulse text-primary" />
          <p className="mt-4 text-muted-foreground font-medium">Loading your roadmap...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background text-foreground transition-colors duration-300">
      <header className="sticky top-0 z-50 border-b border-border bg-background/80 backdrop-blur-xl">
        <div className="mx-auto flex h-16 max-w-7xl items-center justify-between px-4 sm:px-6 lg:px-8">
          <Link href="/dashboard" className="flex items-center gap-3">
            <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-gradient-to-br from-orange-500 to-red-600 shadow-lg">
              <Map className="h-6 w-6 text-white" />
            </div>
            <div>
              <h1 className="text-lg font-bold tracking-tight text-foreground">Roadmap</h1>
              <p className="text-xs text-muted-foreground">Your Learning Journey</p>
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

      <main className="mx-auto max-w-5xl px-4 py-8 sm:px-6 lg:px-8">
        <Card className="mb-8 bg-gradient-to-r from-orange-500 to-red-600 p-8 text-white border-0">
          <div className="flex items-center gap-4">
            <div className="h-14 w-14 rounded-xl bg-white/10 flex items-center justify-center">
              <Map className="h-8 w-8" />
            </div>
            <div>
              <h2 className="text-2xl font-bold">Learning Roadmap</h2>
              <p className="text-white/80">
                Your personalized path to mastering {profile?.field_of_interest || "your field"}
              </p>
            </div>
          </div>
          <div className="mt-6 flex items-center gap-4">
            <Badge className="bg-white/20 text-white border-0">
              <Clock className="h-3 w-3 mr-1" />
              16 Weeks
            </Badge>
            <Badge className="bg-white/20 text-white border-0">
              <BookOpen className="h-3 w-3 mr-1" />
              {roadmap.reduce((acc, phase) => acc + phase.topics.length, 0)} Topics
            </Badge>
          </div>
        </Card>

        <div className="space-y-6">
          {roadmap.map((phase, index) => {
            const PhaseIcon = phase.icon;
            return (
              <Card key={index} className="p-6 bg-card border-border">
                <div className="flex items-start gap-4">
                  <div className="mt-1">
                    <div className={`h-12 w-12 rounded-xl flex items-center justify-center ${
                      phase.completed 
                        ? "bg-green-500/10 text-green-500" 
                        : "bg-primary/10 text-primary"
                    }`}>
                      <PhaseIcon className="h-6 w-6" />
                    </div>
                  </div>
                  <div className="flex-1">
                    <div className="mb-4 flex items-center justify-between">
                      <div>
                        <h3 className="text-xl font-bold text-foreground">{phase.title}</h3>
                        <p className="text-sm text-muted-foreground">{phase.duration}</p>
                      </div>
                      {phase.completed ? (
                        <Badge className="bg-green-500/10 text-green-500 border-green-500/20">
                          <CheckCircle2 className="h-3 w-3 mr-1" />
                          Completed
                        </Badge>
                      ) : index === 0 ? (
                        <Badge className="bg-primary/10 text-primary border-primary/20">
                          In Progress
                        </Badge>
                      ) : null}
                    </div>
                    <div className="grid gap-2 sm:grid-cols-2">
                      {phase.topics.map((topic, i) => (
                        <div
                          key={i}
                          className="flex items-center gap-3 rounded-lg bg-muted/50 p-3 border border-border"
                        >
                          {topic.completed ? (
                            <CheckCircle2 className="h-5 w-5 text-green-500 flex-shrink-0" />
                          ) : (
                            <Circle className="h-5 w-5 text-muted-foreground flex-shrink-0" />
                          )}
                          <p className="text-sm text-foreground">{topic.name}</p>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              </Card>
            );
          })}
        </div>

        <div className="mt-8 flex justify-center gap-4">
          <Link href="/assessment">
            <Button size="lg" className="gap-2">
              Start Assessment
            </Button>
          </Link>
          <Link href="/dashboard">
            <Button variant="outline" size="lg">Back to Dashboard</Button>
          </Link>
        </div>
      </main>

      <AIChatbot />
      <NotificationPanel />
      <DeveloperWatermark />
    </div>
  );
}
