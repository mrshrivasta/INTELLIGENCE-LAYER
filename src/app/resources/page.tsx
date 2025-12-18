"use client";

import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Library, Search, Filter, BookOpen, Video, FileText,
  Link as LinkIcon, Download, Star, Clock, Eye, Heart,
  ChevronRight, Bookmark, ExternalLink, Play, Lock
} from "lucide-react";
import Link from "next/link";

interface Resource {
  id: string;
  title: string;
  description: string;
  type: "article" | "video" | "ebook" | "course" | "tool";
  category: string;
  difficulty: string;
  duration: string;
  author: string;
  rating: number;
  views: number;
  isPremium: boolean;
  isBookmarked: boolean;
  url: string;
  thumbnail: string;
}

export default function ResourcesPage() {
  const [resources, setResources] = useState<Resource[]>([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedType, setSelectedType] = useState("all");
  const [selectedCategory, setSelectedCategory] = useState("all");
  const [isLoading, setIsLoading] = useState(true);

  const types = [
    { id: "all", name: "All", icon: <Library className="w-4 h-4" /> },
    { id: "article", name: "Articles", icon: <FileText className="w-4 h-4" /> },
    { id: "video", name: "Videos", icon: <Video className="w-4 h-4" /> },
    { id: "ebook", name: "E-Books", icon: <BookOpen className="w-4 h-4" /> },
    { id: "course", name: "Courses", icon: <Play className="w-4 h-4" /> },
    { id: "tool", name: "Tools", icon: <LinkIcon className="w-4 h-4" /> },
  ];

  const categories = ["all", "JavaScript", "Python", "React", "Node.js", "DevOps", "Data Science", "Career"];

  useEffect(() => {
    fetchResources();
  }, []);

  const fetchResources = async () => {
    setIsLoading(true);
    await new Promise(resolve => setTimeout(resolve, 600));
    
    const mockResources: Resource[] = [
      {
        id: "1",
        title: "The Complete JavaScript Guide 2024",
        description: "Master JavaScript from basics to advanced concepts with hands-on projects",
        type: "ebook",
        category: "JavaScript",
        difficulty: "Beginner",
        duration: "8 hours read",
        author: "John Doe",
        rating: 4.9,
        views: 15420,
        isPremium: false,
        isBookmarked: true,
        url: "#",
        thumbnail: "js"
      },
      {
        id: "2",
        title: "Building Scalable APIs with Node.js",
        description: "Learn to build production-ready REST APIs with best practices",
        type: "video",
        category: "Node.js",
        difficulty: "Intermediate",
        duration: "4 hours",
        author: "Sarah Chen",
        rating: 4.8,
        views: 8930,
        isPremium: true,
        isBookmarked: false,
        url: "#",
        thumbnail: "node"
      },
      {
        id: "3",
        title: "React Performance Optimization",
        description: "Advanced techniques to make your React apps blazing fast",
        type: "article",
        category: "React",
        difficulty: "Advanced",
        duration: "15 min read",
        author: "Mike Johnson",
        rating: 4.7,
        views: 12340,
        isPremium: false,
        isBookmarked: true,
        url: "#",
        thumbnail: "react"
      },
      {
        id: "4",
        title: "Python for Data Science",
        description: "Complete course covering Python, NumPy, Pandas, and visualization",
        type: "course",
        category: "Data Science",
        difficulty: "Beginner",
        duration: "20 hours",
        author: "Emily Zhang",
        rating: 4.95,
        views: 25670,
        isPremium: true,
        isBookmarked: false,
        url: "#",
        thumbnail: "python"
      },
      {
        id: "5",
        title: "VS Code Extensions for Developers",
        description: "Essential VS Code extensions to boost your productivity",
        type: "tool",
        category: "DevOps",
        difficulty: "All Levels",
        duration: "5 min read",
        author: "Dev Tools",
        rating: 4.6,
        views: 9870,
        isPremium: false,
        isBookmarked: false,
        url: "#",
        thumbnail: "tools"
      },
      {
        id: "6",
        title: "System Design Interview Guide",
        description: "Comprehensive guide to ace system design interviews",
        type: "ebook",
        category: "Career",
        difficulty: "Advanced",
        duration: "6 hours read",
        author: "Tech Lead",
        rating: 4.85,
        views: 18920,
        isPremium: true,
        isBookmarked: true,
        url: "#",
        thumbnail: "career"
      },
    ];
    
    setResources(mockResources);
    setIsLoading(false);
  };

  const toggleBookmark = (id: string) => {
    setResources(prev =>
      prev.map(r => r.id === id ? { ...r, isBookmarked: !r.isBookmarked } : r)
    );
  };

  const filteredResources = resources.filter(resource => {
    if (selectedType !== "all" && resource.type !== selectedType) return false;
    if (selectedCategory !== "all" && resource.category !== selectedCategory) return false;
    if (searchQuery && !resource.title.toLowerCase().includes(searchQuery.toLowerCase())) return false;
    return true;
  });

  const getTypeIcon = (type: string) => {
    switch (type) {
      case "article": return <FileText className="w-4 h-4" />;
      case "video": return <Video className="w-4 h-4" />;
      case "ebook": return <BookOpen className="w-4 h-4" />;
      case "course": return <Play className="w-4 h-4" />;
      case "tool": return <LinkIcon className="w-4 h-4" />;
      default: return <Library className="w-4 h-4" />;
    }
  };

  const getThumbnailGradient = (type: string) => {
    switch (type) {
      case "js": return "from-yellow-500 to-amber-500";
      case "node": return "from-green-500 to-emerald-500";
      case "react": return "from-cyan-500 to-blue-500";
      case "python": return "from-blue-500 to-indigo-500";
      case "tools": return "from-purple-500 to-pink-500";
      case "career": return "from-orange-500 to-red-500";
      default: return "from-gray-500 to-slate-500";
    }
  };

  const getDifficultyColor = (difficulty: string) => {
    switch (difficulty) {
      case "Beginner": return "text-emerald-500 bg-emerald-500/10";
      case "Intermediate": return "text-amber-500 bg-amber-500/10";
      case "Advanced": return "text-red-500 bg-red-500/10";
      default: return "text-blue-500 bg-blue-500/10";
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
          <h1 className="text-4xl font-bold bg-gradient-to-r from-orange-400 via-red-400 to-pink-400 bg-clip-text text-transparent flex items-center justify-center gap-3">
            <Library className="w-10 h-10 text-orange-500" />
            Resource Library
          </h1>
          <p className="text-muted-foreground mt-2 max-w-2xl mx-auto">
            Curated collection of learning materials, tutorials, and tools to accelerate your growth
          </p>
        </motion.div>

        {/* Search & Filters */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="space-y-4"
        >
          <div className="relative">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground" />
            <Input
              placeholder="Search resources..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-12 h-14 text-lg"
            />
          </div>
          
          {/* Type Filters */}
          <div className="flex gap-2 flex-wrap">
            {types.map((type) => (
              <Button
                key={type.id}
                variant={selectedType === type.id ? "default" : "outline"}
                onClick={() => setSelectedType(type.id)}
                className={`gap-2 ${selectedType === type.id ? "bg-gradient-to-r from-orange-500 to-red-500" : ""}`}
              >
                {type.icon}
                {type.name}
              </Button>
            ))}
          </div>

          {/* Category Filters */}
          <div className="flex gap-2 flex-wrap">
            {categories.map((cat) => (
              <button
                key={cat}
                onClick={() => setSelectedCategory(cat)}
                className={`px-3 py-1 rounded-full text-sm font-medium transition-all ${
                  selectedCategory === cat
                    ? "bg-primary text-primary-foreground"
                    : "bg-muted hover:bg-muted/80"
                }`}
              >
                {cat}
              </button>
            ))}
          </div>
        </motion.div>

        {/* Resources Grid */}
        {isLoading ? (
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {[1, 2, 3, 4, 5, 6].map((i) => (
              <Card key={i} className="overflow-hidden bg-card/50 animate-pulse">
                <div className="h-32 bg-muted" />
                <div className="p-5">
                  <div className="h-5 bg-muted rounded w-3/4 mb-2" />
                  <div className="h-4 bg-muted rounded w-full mb-4" />
                  <div className="flex gap-2">
                    <div className="h-6 bg-muted rounded-full w-16" />
                    <div className="h-6 bg-muted rounded-full w-16" />
                  </div>
                </div>
              </Card>
            ))}
          </div>
        ) : (
          <AnimatePresence mode="popLayout">
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
              {filteredResources.map((resource, index) => (
                <motion.div
                  key={resource.id}
                  layout
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, scale: 0.9 }}
                  transition={{ delay: index * 0.05 }}
                >
                  <Card className="overflow-hidden bg-card/50 backdrop-blur border-border hover:border-primary/50 transition-all group h-full flex flex-col">
                    {/* Thumbnail */}
                    <div className={`h-32 bg-gradient-to-br ${getThumbnailGradient(resource.thumbnail)} relative overflow-hidden`}>
                      <div className="absolute inset-0 bg-black/10" />
                      <div className="absolute top-3 left-3 flex items-center gap-2">
                        <span className="px-2 py-1 rounded-lg bg-white/20 backdrop-blur text-white text-xs font-medium flex items-center gap-1">
                          {getTypeIcon(resource.type)}
                          {resource.type}
                        </span>
                      </div>
                      {resource.isPremium && (
                        <div className="absolute top-3 right-3 px-2 py-1 rounded-lg bg-amber-500 text-white text-xs font-medium flex items-center gap-1">
                          <Lock className="w-3 h-3" />
                          Premium
                        </div>
                      )}
                      <div className="absolute bottom-3 right-3">
                        <button
                          onClick={() => toggleBookmark(resource.id)}
                          className={`p-2 rounded-full ${
                            resource.isBookmarked
                              ? "bg-primary text-primary-foreground"
                              : "bg-white/20 text-white hover:bg-white/30"
                          } transition-all`}
                        >
                          <Bookmark className={`w-4 h-4 ${resource.isBookmarked ? "fill-current" : ""}`} />
                        </button>
                      </div>
                    </div>

                    {/* Content */}
                    <div className="p-5 flex-1 flex flex-col">
                      <div className="flex items-center gap-2 mb-2">
                        <span className={`px-2 py-0.5 rounded text-xs font-medium ${getDifficultyColor(resource.difficulty)}`}>
                          {resource.difficulty}
                        </span>
                        <span className="text-xs text-muted-foreground">{resource.category}</span>
                      </div>

                      <h3 className="font-semibold text-lg mb-2 group-hover:text-primary transition-colors line-clamp-2">
                        {resource.title}
                      </h3>
                      <p className="text-sm text-muted-foreground line-clamp-2 mb-4 flex-1">
                        {resource.description}
                      </p>

                      {/* Meta */}
                      <div className="flex items-center justify-between text-sm text-muted-foreground mb-4">
                        <span className="flex items-center gap-1">
                          <Clock className="w-3 h-3" />
                          {resource.duration}
                        </span>
                        <span className="flex items-center gap-1">
                          <Eye className="w-3 h-3" />
                          {resource.views.toLocaleString()}
                        </span>
                        <span className="flex items-center gap-1 text-amber-500">
                          <Star className="w-3 h-3 fill-current" />
                          {resource.rating}
                        </span>
                      </div>

                      {/* Author & Action */}
                      <div className="flex items-center justify-between pt-4 border-t border-border">
                        <span className="text-sm text-muted-foreground">by {resource.author}</span>
                        <Button size="sm" variant="ghost" className="gap-1">
                          {resource.type === "video" || resource.type === "course" ? "Watch" : "Read"}
                          <ExternalLink className="w-3 h-3" />
                        </Button>
                      </div>
                    </div>
                  </Card>
                </motion.div>
              ))}
            </div>
          </AnimatePresence>
        )}

        {filteredResources.length === 0 && !isLoading && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="text-center py-16"
          >
            <Library className="w-16 h-16 mx-auto text-muted-foreground/50 mb-4" />
            <h3 className="text-xl font-semibold mb-2">No resources found</h3>
            <p className="text-muted-foreground">Try adjusting your search or filters</p>
          </motion.div>
        )}
      </div>
    </div>
  );
}
