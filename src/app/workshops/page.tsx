"use client";

import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Video, Calendar, Clock, Users, Star, Play, Bell,
  Search, Filter, ChevronRight, CheckCircle2, Globe,
  Mic, Share2, Heart, ArrowRight
} from "lucide-react";
import Link from "next/link";

interface Workshop {
  id: string;
  title: string;
  description: string;
  instructor: string;
  instructorAvatar: string;
  date: string;
  time: string;
  duration: string;
  participants: number;
  maxParticipants: number;
  category: string;
  level: string;
  isFree: boolean;
  price?: number;
  isLive: boolean;
  isRegistered: boolean;
  thumbnail: string;
  tags: string[];
}

export default function WorkshopsPage() {
  const [workshops, setWorkshops] = useState<Workshop[]>([]);
  const [filter, setFilter] = useState<"upcoming" | "live" | "recorded">("upcoming");
  const [searchQuery, setSearchQuery] = useState("");
  const [isLoading, setIsLoading] = useState(true);
  const [selectedCategory, setSelectedCategory] = useState("all");

  const categories = ["all", "Web Dev", "Data Science", "DevOps", "Mobile", "Career"];

  useEffect(() => {
    fetchWorkshops();
  }, []);

  const fetchWorkshops = async () => {
    setIsLoading(true);
    await new Promise(resolve => setTimeout(resolve, 600));
    
    const mockWorkshops: Workshop[] = [
      {
        id: "1",
        title: "Building Modern React Applications",
        description: "Learn best practices for building scalable React apps with hooks, context, and modern patterns",
        instructor: "Sarah Chen",
        instructorAvatar: "SC",
        date: "Dec 20, 2024",
        time: "2:00 PM EST",
        duration: "2 hours",
        participants: 156,
        maxParticipants: 200,
        category: "Web Dev",
        level: "Intermediate",
        isFree: false,
        price: 29,
        isLive: false,
        isRegistered: true,
        thumbnail: "react",
        tags: ["React", "Hooks", "Best Practices"]
      },
      {
        id: "2",
        title: "Live Coding: Building a REST API",
        description: "Watch and learn as we build a complete REST API from scratch with Node.js and Express",
        instructor: "Mike Johnson",
        instructorAvatar: "MJ",
        date: "Today",
        time: "Now",
        duration: "1.5 hours",
        participants: 89,
        maxParticipants: 150,
        category: "Web Dev",
        level: "Beginner",
        isFree: true,
        isLive: true,
        isRegistered: false,
        thumbnail: "nodejs",
        tags: ["Node.js", "Express", "API"]
      },
      {
        id: "3",
        title: "Machine Learning Fundamentals",
        description: "Introduction to ML concepts, algorithms, and practical applications with Python",
        instructor: "Emily Zhang",
        instructorAvatar: "EZ",
        date: "Dec 22, 2024",
        time: "10:00 AM EST",
        duration: "3 hours",
        participants: 234,
        maxParticipants: 300,
        category: "Data Science",
        level: "Beginner",
        isFree: false,
        price: 49,
        isLive: false,
        isRegistered: false,
        thumbnail: "ml",
        tags: ["Python", "ML", "AI"]
      },
      {
        id: "4",
        title: "Docker & Kubernetes Masterclass",
        description: "Master containerization and orchestration for modern cloud deployments",
        instructor: "David Park",
        instructorAvatar: "DP",
        date: "Dec 25, 2024",
        time: "3:00 PM EST",
        duration: "4 hours",
        participants: 178,
        maxParticipants: 250,
        category: "DevOps",
        level: "Advanced",
        isFree: false,
        price: 59,
        isLive: false,
        isRegistered: true,
        thumbnail: "docker",
        tags: ["Docker", "K8s", "Cloud"]
      },
      {
        id: "5",
        title: "Career Workshop: Acing Tech Interviews",
        description: "Tips and strategies for landing your dream tech job",
        instructor: "Lisa Wang",
        instructorAvatar: "LW",
        date: "Dec 28, 2024",
        time: "1:00 PM EST",
        duration: "2 hours",
        participants: 312,
        maxParticipants: 500,
        category: "Career",
        level: "All Levels",
        isFree: true,
        isLive: false,
        isRegistered: false,
        thumbnail: "career",
        tags: ["Interview", "Career", "Tips"]
      },
    ];
    
    setWorkshops(mockWorkshops);
    setIsLoading(false);
  };

  const filteredWorkshops = workshops.filter(workshop => {
    if (filter === "live" && !workshop.isLive) return false;
    if (filter === "upcoming" && workshop.isLive) return false;
    if (selectedCategory !== "all" && workshop.category !== selectedCategory) return false;
    if (searchQuery && !workshop.title.toLowerCase().includes(searchQuery.toLowerCase())) return false;
    return true;
  });

  const getLevelColor = (level: string) => {
    switch (level) {
      case "Beginner": return "text-emerald-500 bg-emerald-500/10";
      case "Intermediate": return "text-amber-500 bg-amber-500/10";
      case "Advanced": return "text-red-500 bg-red-500/10";
      default: return "text-blue-500 bg-blue-500/10";
    }
  };

  const getThumbnailGradient = (type: string) => {
    switch (type) {
      case "react": return "from-cyan-500 to-blue-500";
      case "nodejs": return "from-green-500 to-emerald-500";
      case "ml": return "from-purple-500 to-pink-500";
      case "docker": return "from-blue-500 to-indigo-500";
      case "career": return "from-amber-500 to-orange-500";
      default: return "from-gray-500 to-slate-500";
    }
  };

  return (
    <div className="min-h-screen bg-background p-6">
      <div className="max-w-7xl mx-auto space-y-8">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center"
        >
          <h1 className="text-4xl font-bold bg-gradient-to-r from-indigo-400 via-purple-400 to-pink-400 bg-clip-text text-transparent">
            Live Workshops & Events
          </h1>
          <p className="text-muted-foreground mt-2 max-w-2xl mx-auto">
            Join live interactive sessions with industry experts and level up your skills
          </p>
        </motion.div>

        {/* Live Now Banner */}
        {workshops.some(w => w.isLive) && (
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            className="relative overflow-hidden rounded-2xl bg-gradient-to-r from-red-500/20 via-pink-500/20 to-purple-500/20 border border-red-500/30 p-6"
          >
            <div className="absolute top-0 left-0 w-full h-full bg-[radial-gradient(ellipse_at_center,_var(--tw-gradient-stops))] from-red-500/10 via-transparent to-transparent" />
            <div className="relative flex items-center justify-between">
              <div className="flex items-center gap-4">
                <div className="w-12 h-12 rounded-full bg-red-500 flex items-center justify-center animate-pulse">
                  <Video className="w-6 h-6 text-white" />
                </div>
                <div>
                  <div className="flex items-center gap-2">
                    <span className="px-2 py-0.5 rounded-full bg-red-500 text-white text-xs font-medium animate-pulse">
                      LIVE NOW
                    </span>
                    <span className="text-sm text-muted-foreground">89 watching</span>
                  </div>
                  <h3 className="text-xl font-semibold mt-1">Live Coding: Building a REST API</h3>
                  <p className="text-sm text-muted-foreground">with Mike Johnson</p>
                </div>
              </div>
              <Button className="gap-2 bg-red-500 hover:bg-red-600">
                <Play className="w-4 h-4" />
                Join Now
              </Button>
            </div>
          </motion.div>
        )}

        {/* Filters */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="flex flex-col md:flex-row gap-4"
        >
          <div className="flex-1 relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground" />
            <Input
              placeholder="Search workshops..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-10 h-12"
            />
          </div>
          <div className="flex gap-2">
            {(["upcoming", "live", "recorded"] as const).map((f) => (
              <Button
                key={f}
                variant={filter === f ? "default" : "outline"}
                onClick={() => setFilter(f)}
                className={filter === f ? "bg-gradient-to-r from-indigo-500 to-purple-500" : ""}
              >
                {f === "live" && <span className="w-2 h-2 rounded-full bg-red-500 mr-2 animate-pulse" />}
                {f.charAt(0).toUpperCase() + f.slice(1)}
              </Button>
            ))}
          </div>
        </motion.div>

        {/* Categories */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.2 }}
          className="flex gap-2 flex-wrap"
        >
          {categories.map((cat) => (
            <button
              key={cat}
              onClick={() => setSelectedCategory(cat)}
              className={`px-4 py-2 rounded-full text-sm font-medium transition-all ${
                selectedCategory === cat
                  ? "bg-primary text-primary-foreground"
                  : "bg-muted hover:bg-muted/80"
              }`}
            >
              {cat}
            </button>
          ))}
        </motion.div>

        {/* Workshops Grid */}
        {isLoading ? (
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {[1, 2, 3].map((i) => (
              <Card key={i} className="overflow-hidden bg-card/50 animate-pulse">
                <div className="h-40 bg-muted" />
                <div className="p-6">
                  <div className="h-6 bg-muted rounded w-3/4 mb-2" />
                  <div className="h-4 bg-muted rounded w-full mb-4" />
                  <div className="flex gap-2">
                    <div className="h-6 bg-muted rounded-full w-20" />
                    <div className="h-6 bg-muted rounded-full w-20" />
                  </div>
                </div>
              </Card>
            ))}
          </div>
        ) : (
          <AnimatePresence mode="popLayout">
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
              {filteredWorkshops.map((workshop, index) => (
                <motion.div
                  key={workshop.id}
                  layout
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, scale: 0.9 }}
                  transition={{ delay: index * 0.05 }}
                >
                  <Card className="overflow-hidden bg-card/50 backdrop-blur border-border hover:border-primary/50 transition-all group h-full flex flex-col">
                    {/* Thumbnail */}
                    <div className={`h-40 bg-gradient-to-br ${getThumbnailGradient(workshop.thumbnail)} relative overflow-hidden`}>
                      <div className="absolute inset-0 bg-black/20" />
                      {workshop.isLive && (
                        <div className="absolute top-3 left-3 px-2 py-1 rounded-full bg-red-500 text-white text-xs font-medium flex items-center gap-1 animate-pulse">
                          <span className="w-2 h-2 rounded-full bg-white" />
                          LIVE
                        </div>
                      )}
                      {workshop.isRegistered && (
                        <div className="absolute top-3 right-3 px-2 py-1 rounded-full bg-emerald-500 text-white text-xs font-medium flex items-center gap-1">
                          <CheckCircle2 className="w-3 h-3" />
                          Registered
                        </div>
                      )}
                      <div className="absolute bottom-3 left-3 flex items-center gap-2">
                        <span className={`px-2 py-0.5 rounded text-xs font-medium ${getLevelColor(workshop.level)}`}>
                          {workshop.level}
                        </span>
                        {workshop.isFree ? (
                          <span className="px-2 py-0.5 rounded text-xs font-medium text-emerald-500 bg-emerald-500/10">
                            FREE
                          </span>
                        ) : (
                          <span className="px-2 py-0.5 rounded text-xs font-medium text-white bg-white/20">
                            ${workshop.price}
                          </span>
                        )}
                      </div>
                      <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity bg-black/30">
                        <Button size="icon" className="rounded-full w-14 h-14 bg-white/20 backdrop-blur hover:bg-white/30">
                          <Play className="w-6 h-6 text-white" />
                        </Button>
                      </div>
                    </div>

                    {/* Content */}
                    <div className="p-5 flex-1 flex flex-col">
                      <h3 className="font-semibold text-lg mb-2 group-hover:text-primary transition-colors line-clamp-2">
                        {workshop.title}
                      </h3>
                      <p className="text-sm text-muted-foreground line-clamp-2 mb-4 flex-1">
                        {workshop.description}
                      </p>

                      {/* Instructor */}
                      <div className="flex items-center gap-3 mb-4">
                        <div className="w-8 h-8 rounded-full bg-gradient-to-br from-indigo-500 to-purple-500 flex items-center justify-center text-white text-xs font-bold">
                          {workshop.instructorAvatar}
                        </div>
                        <span className="text-sm">{workshop.instructor}</span>
                      </div>

                      {/* Tags */}
                      <div className="flex flex-wrap gap-1 mb-4">
                        {workshop.tags.map((tag) => (
                          <span
                            key={tag}
                            className="px-2 py-0.5 text-xs bg-muted rounded-full"
                          >
                            {tag}
                          </span>
                        ))}
                      </div>

                      {/* Meta */}
                      <div className="flex items-center justify-between text-sm text-muted-foreground pt-4 border-t border-border">
                        <div className="flex items-center gap-3">
                          <span className="flex items-center gap-1">
                            <Calendar className="w-3 h-3" />
                            {workshop.date}
                          </span>
                          <span className="flex items-center gap-1">
                            <Clock className="w-3 h-3" />
                            {workshop.duration}
                          </span>
                        </div>
                        <span className="flex items-center gap-1">
                          <Users className="w-3 h-3" />
                          {workshop.participants}/{workshop.maxParticipants}
                        </span>
                      </div>

                      {/* Action */}
                      <Button 
                        className={`w-full mt-4 gap-2 ${
                          workshop.isLive 
                            ? "bg-red-500 hover:bg-red-600" 
                            : workshop.isRegistered
                              ? "bg-emerald-500 hover:bg-emerald-600"
                              : "bg-gradient-to-r from-indigo-500 to-purple-500 hover:from-indigo-600 hover:to-purple-600"
                        }`}
                      >
                        {workshop.isLive ? (
                          <>
                            <Play className="w-4 h-4" />
                            Join Live
                          </>
                        ) : workshop.isRegistered ? (
                          <>
                            <Bell className="w-4 h-4" />
                            Set Reminder
                          </>
                        ) : (
                          <>
                            Register
                            <ArrowRight className="w-4 h-4" />
                          </>
                        )}
                      </Button>
                    </div>
                  </Card>
                </motion.div>
              ))}
            </div>
          </AnimatePresence>
        )}

        {filteredWorkshops.length === 0 && !isLoading && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="text-center py-16"
          >
            <Video className="w-16 h-16 mx-auto text-muted-foreground/50 mb-4" />
            <h3 className="text-xl font-semibold mb-2">No workshops found</h3>
            <p className="text-muted-foreground">Check back later for new events</p>
          </motion.div>
        )}
      </div>
    </div>
  );
}
