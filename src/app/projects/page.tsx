"use client";

import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Progress } from "@/components/ui/progress";
import {
  FolderKanban, Plus, Search, Filter, Github, ExternalLink,
  Clock, CheckCircle2, Circle, PlayCircle, MoreVertical,
  Star, Users, Calendar, Tag, ArrowRight, Rocket, Code2
} from "lucide-react";
import Link from "next/link";

interface Project {
  id: string;
  title: string;
  description: string;
  status: "planning" | "in_progress" | "review" | "completed";
  progress: number;
  techStack: string[];
  githubUrl?: string;
  liveUrl?: string;
  dueDate: string;
  collaborators: number;
  tasks: { total: number; completed: number };
}

export default function ProjectsPage() {
  const [projects, setProjects] = useState<Project[]>([]);
  const [filter, setFilter] = useState<string>("all");
  const [searchQuery, setSearchQuery] = useState("");
  const [isLoading, setIsLoading] = useState(true);
  const [showNewProject, setShowNewProject] = useState(false);

  useEffect(() => {
    fetchProjects();
  }, []);

  const fetchProjects = async () => {
    setIsLoading(true);
    await new Promise(resolve => setTimeout(resolve, 600));
    
    const mockProjects: Project[] = [
      {
        id: "1",
        title: "E-Commerce Dashboard",
        description: "Full-stack e-commerce admin dashboard with analytics, inventory management, and order processing",
        status: "in_progress",
        progress: 65,
        techStack: ["React", "Node.js", "PostgreSQL", "Tailwind"],
        githubUrl: "https://github.com",
        liveUrl: "https://demo.com",
        dueDate: "Dec 25, 2024",
        collaborators: 3,
        tasks: { total: 24, completed: 16 }
      },
      {
        id: "2",
        title: "AI Chat Application",
        description: "Real-time chat application with AI-powered responses and sentiment analysis",
        status: "in_progress",
        progress: 40,
        techStack: ["Next.js", "OpenAI", "Socket.io", "MongoDB"],
        githubUrl: "https://github.com",
        dueDate: "Jan 5, 2025",
        collaborators: 2,
        tasks: { total: 18, completed: 7 }
      },
      {
        id: "3",
        title: "Portfolio Website",
        description: "Personal portfolio with 3D animations and interactive elements",
        status: "completed",
        progress: 100,
        techStack: ["React", "Three.js", "Framer Motion"],
        githubUrl: "https://github.com",
        liveUrl: "https://portfolio.com",
        dueDate: "Dec 10, 2024",
        collaborators: 1,
        tasks: { total: 12, completed: 12 }
      },
      {
        id: "4",
        title: "Task Management API",
        description: "RESTful API for task management with authentication and real-time updates",
        status: "review",
        progress: 90,
        techStack: ["Express", "TypeScript", "Prisma", "Redis"],
        githubUrl: "https://github.com",
        dueDate: "Dec 20, 2024",
        collaborators: 2,
        tasks: { total: 15, completed: 14 }
      },
      {
        id: "5",
        title: "Mobile Fitness App",
        description: "Cross-platform fitness tracking app with workout plans and progress analytics",
        status: "planning",
        progress: 10,
        techStack: ["React Native", "Firebase", "Redux"],
        dueDate: "Feb 1, 2025",
        collaborators: 4,
        tasks: { total: 30, completed: 3 }
      },
    ];
    
    setProjects(mockProjects);
    setIsLoading(false);
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case "planning": return "bg-slate-500";
      case "in_progress": return "bg-blue-500";
      case "review": return "bg-amber-500";
      case "completed": return "bg-emerald-500";
      default: return "bg-muted";
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case "planning": return <Circle className="w-4 h-4" />;
      case "in_progress": return <PlayCircle className="w-4 h-4" />;
      case "review": return <Clock className="w-4 h-4" />;
      case "completed": return <CheckCircle2 className="w-4 h-4" />;
      default: return <Circle className="w-4 h-4" />;
    }
  };

  const filteredProjects = projects.filter(p => {
    if (filter !== "all" && p.status !== filter) return false;
    if (searchQuery && !p.title.toLowerCase().includes(searchQuery.toLowerCase())) return false;
    return true;
  });

  const statusCounts = {
    all: projects.length,
    planning: projects.filter(p => p.status === "planning").length,
    in_progress: projects.filter(p => p.status === "in_progress").length,
    review: projects.filter(p => p.status === "review").length,
    completed: projects.filter(p => p.status === "completed").length,
  };

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
            <h1 className="text-4xl font-bold bg-gradient-to-r from-violet-400 via-purple-400 to-fuchsia-400 bg-clip-text text-transparent flex items-center gap-3">
              <FolderKanban className="w-10 h-10 text-violet-500" />
              Projects
            </h1>
            <p className="text-muted-foreground mt-2">Manage and track your coding projects</p>
          </div>
          <Button 
            className="gap-2 bg-gradient-to-r from-violet-500 to-purple-500 hover:from-violet-600 hover:to-purple-600"
            onClick={() => setShowNewProject(true)}
          >
            <Plus className="w-4 h-4" />
            New Project
          </Button>
        </motion.div>

        {/* Stats */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="grid grid-cols-2 md:grid-cols-5 gap-4"
        >
          {[
            { key: "all", label: "All", color: "from-slate-500 to-slate-600" },
            { key: "planning", label: "Planning", color: "from-slate-400 to-slate-500" },
            { key: "in_progress", label: "In Progress", color: "from-blue-500 to-cyan-500" },
            { key: "review", label: "Review", color: "from-amber-500 to-orange-500" },
            { key: "completed", label: "Completed", color: "from-emerald-500 to-green-500" },
          ].map((status, index) => (
            <motion.button
              key={status.key}
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: index * 0.05 }}
              onClick={() => setFilter(status.key)}
              className={`p-4 rounded-xl transition-all ${
                filter === status.key 
                  ? `bg-gradient-to-br ${status.color} text-white shadow-lg scale-105` 
                  : "bg-card/50 hover:bg-card/80 border border-border"
              }`}
            >
              <p className="text-2xl font-bold">{statusCounts[status.key as keyof typeof statusCounts]}</p>
              <p className="text-sm opacity-80">{status.label}</p>
            </motion.button>
          ))}
        </motion.div>

        {/* Search */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.2 }}
        >
          <Card className="p-4 bg-card/50 backdrop-blur">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
              <Input
                placeholder="Search projects..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-10"
              />
            </div>
          </Card>
        </motion.div>

        {/* Projects Grid */}
        {isLoading ? (
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {[1, 2, 3].map((i) => (
              <Card key={i} className="p-6 bg-card/50 animate-pulse">
                <div className="h-6 bg-muted rounded w-3/4 mb-4" />
                <div className="h-4 bg-muted rounded w-full mb-2" />
                <div className="h-4 bg-muted rounded w-2/3 mb-4" />
                <div className="h-2 bg-muted rounded-full mb-4" />
                <div className="flex gap-2">
                  <div className="h-6 bg-muted rounded-full w-16" />
                  <div className="h-6 bg-muted rounded-full w-16" />
                </div>
              </Card>
            ))}
          </div>
        ) : (
          <AnimatePresence mode="popLayout">
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
              {filteredProjects.map((project, index) => (
                <motion.div
                  key={project.id}
                  layout
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, scale: 0.9 }}
                  transition={{ delay: index * 0.05 }}
                >
                  <Card className="p-6 bg-card/50 backdrop-blur border-border hover:border-primary/50 transition-all group h-full flex flex-col">
                    <div className="flex items-start justify-between mb-4">
                      <div className={`px-3 py-1 rounded-full text-xs font-medium text-white flex items-center gap-1 ${getStatusColor(project.status)}`}>
                        {getStatusIcon(project.status)}
                        {project.status.replace("_", " ")}
                      </div>
                      <Button variant="ghost" size="icon" className="h-8 w-8">
                        <MoreVertical className="w-4 h-4" />
                      </Button>
                    </div>
                    
                    <h3 className="text-xl font-semibold mb-2 group-hover:text-primary transition-colors">
                      {project.title}
                    </h3>
                    <p className="text-sm text-muted-foreground line-clamp-2 mb-4 flex-1">
                      {project.description}
                    </p>
                    
                    <div className="space-y-4">
                      <div>
                        <div className="flex items-center justify-between text-sm mb-1">
                          <span className="text-muted-foreground">Progress</span>
                          <span className="font-medium">{project.progress}%</span>
                        </div>
                        <Progress value={project.progress} className="h-2" />
                      </div>
                      
                      <div className="flex flex-wrap gap-1">
                        {project.techStack.slice(0, 4).map((tech) => (
                          <span
                            key={tech}
                            className="px-2 py-0.5 text-xs bg-muted rounded-full"
                          >
                            {tech}
                          </span>
                        ))}
                        {project.techStack.length > 4 && (
                          <span className="px-2 py-0.5 text-xs bg-muted rounded-full">
                            +{project.techStack.length - 4}
                          </span>
                        )}
                      </div>
                      
                      <div className="flex items-center justify-between text-sm text-muted-foreground">
                        <div className="flex items-center gap-4">
                          <span className="flex items-center gap-1">
                            <CheckCircle2 className="w-3 h-3" />
                            {project.tasks.completed}/{project.tasks.total}
                          </span>
                          <span className="flex items-center gap-1">
                            <Users className="w-3 h-3" />
                            {project.collaborators}
                          </span>
                        </div>
                        <span className="flex items-center gap-1">
                          <Calendar className="w-3 h-3" />
                          {project.dueDate}
                        </span>
                      </div>
                      
                      <div className="flex items-center gap-2 pt-2 border-t border-border">
                        {project.githubUrl && (
                          <Button variant="ghost" size="sm" className="gap-1" asChild>
                            <a href={project.githubUrl} target="_blank" rel="noopener noreferrer">
                              <Github className="w-4 h-4" />
                              Code
                            </a>
                          </Button>
                        )}
                        {project.liveUrl && (
                          <Button variant="ghost" size="sm" className="gap-1" asChild>
                            <a href={project.liveUrl} target="_blank" rel="noopener noreferrer">
                              <ExternalLink className="w-4 h-4" />
                              Live
                            </a>
                          </Button>
                        )}
                        <Button variant="ghost" size="sm" className="gap-1 ml-auto">
                          Open
                          <ArrowRight className="w-4 h-4" />
                        </Button>
                      </div>
                    </div>
                  </Card>
                </motion.div>
              ))}
            </div>
          </AnimatePresence>
        )}

        {filteredProjects.length === 0 && !isLoading && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="text-center py-16"
          >
            <Rocket className="w-16 h-16 mx-auto text-muted-foreground/50 mb-4" />
            <h3 className="text-xl font-semibold mb-2">No projects found</h3>
            <p className="text-muted-foreground mb-4">Start your first project and track your progress</p>
            <Button className="gap-2" onClick={() => setShowNewProject(true)}>
              <Plus className="w-4 h-4" />
              Create Project
            </Button>
          </motion.div>
        )}
      </div>
    </div>
  );
}
