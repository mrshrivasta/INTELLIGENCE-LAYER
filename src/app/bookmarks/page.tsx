"use client";

import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Bookmark, Search, Filter, Grid, List, Trash2, ExternalLink,
  BookOpen, Video, FileText, Code, Star, Clock, Tag, Folder,
  ChevronDown, MoreVertical, Plus, SortAsc
} from "lucide-react";
import Link from "next/link";
import { supabase } from "@/lib/supabase/client";

interface BookmarkItem {
  id: string;
  title: string;
  description: string;
  type: "lesson" | "video" | "article" | "code";
  url: string;
  tags: string[];
  createdAt: string;
  isFavorite: boolean;
}

export default function BookmarksPage() {
  const [bookmarks, setBookmarks] = useState<BookmarkItem[]>([]);
  const [filteredBookmarks, setFilteredBookmarks] = useState<BookmarkItem[]>([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [viewMode, setViewMode] = useState<"grid" | "list">("grid");
  const [selectedType, setSelectedType] = useState<string>("all");
  const [selectedFolder, setSelectedFolder] = useState<string>("all");
  const [isLoading, setIsLoading] = useState(true);

  const folders = [
    { id: "all", name: "All Bookmarks", count: 24 },
    { id: "javascript", name: "JavaScript", count: 8 },
    { id: "react", name: "React", count: 6 },
    { id: "python", name: "Python", count: 5 },
    { id: "career", name: "Career", count: 5 },
  ];

  const types = [
    { id: "all", name: "All Types", icon: <Bookmark className="w-4 h-4" /> },
    { id: "lesson", name: "Lessons", icon: <BookOpen className="w-4 h-4" /> },
    { id: "video", name: "Videos", icon: <Video className="w-4 h-4" /> },
    { id: "article", name: "Articles", icon: <FileText className="w-4 h-4" /> },
    { id: "code", name: "Code", icon: <Code className="w-4 h-4" /> },
  ];

  useEffect(() => {
    fetchBookmarks();
  }, []);

  useEffect(() => {
    filterBookmarks();
  }, [searchQuery, selectedType, selectedFolder, bookmarks]);

  const fetchBookmarks = async () => {
    setIsLoading(true);
    await new Promise(resolve => setTimeout(resolve, 600));
    
    const mockBookmarks: BookmarkItem[] = [
      { id: "1", title: "Advanced React Patterns", description: "Learn advanced patterns for building scalable React applications", type: "lesson", url: "/lessons/react-patterns", tags: ["react", "advanced"], createdAt: "2024-12-15", isFavorite: true },
      { id: "2", title: "JavaScript Closures Explained", description: "Deep dive into closures and how they work in JavaScript", type: "video", url: "/videos/js-closures", tags: ["javascript", "fundamentals"], createdAt: "2024-12-14", isFavorite: false },
      { id: "3", title: "Building REST APIs with Node.js", description: "Complete guide to building robust REST APIs", type: "article", url: "/articles/rest-apis", tags: ["nodejs", "backend"], createdAt: "2024-12-13", isFavorite: true },
      { id: "4", title: "Python Data Structures", description: "Master Python data structures with practical examples", type: "lesson", url: "/lessons/python-ds", tags: ["python", "data-structures"], createdAt: "2024-12-12", isFavorite: false },
      { id: "5", title: "CSS Grid Layout Cheatsheet", description: "Quick reference for CSS Grid properties", type: "code", url: "/snippets/css-grid", tags: ["css", "layout"], createdAt: "2024-12-11", isFavorite: true },
      { id: "6", title: "TypeScript Generics Tutorial", description: "Understanding generics in TypeScript", type: "video", url: "/videos/ts-generics", tags: ["typescript", "advanced"], createdAt: "2024-12-10", isFavorite: false },
      { id: "7", title: "System Design Interview Prep", description: "Comprehensive guide for system design interviews", type: "article", url: "/articles/system-design", tags: ["career", "interviews"], createdAt: "2024-12-09", isFavorite: true },
      { id: "8", title: "React Hooks Deep Dive", description: "Master all React hooks with practical examples", type: "lesson", url: "/lessons/react-hooks", tags: ["react", "hooks"], createdAt: "2024-12-08", isFavorite: false },
    ];
    
    setBookmarks(mockBookmarks);
    setIsLoading(false);
  };

  const filterBookmarks = () => {
    let filtered = [...bookmarks];
    
    if (searchQuery) {
      filtered = filtered.filter(b => 
        b.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
        b.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
        b.tags.some(t => t.toLowerCase().includes(searchQuery.toLowerCase()))
      );
    }
    
    if (selectedType !== "all") {
      filtered = filtered.filter(b => b.type === selectedType);
    }
    
    setFilteredBookmarks(filtered);
  };

  const toggleFavorite = (id: string) => {
    setBookmarks(prev => 
      prev.map(b => b.id === id ? { ...b, isFavorite: !b.isFavorite } : b)
    );
  };

  const removeBookmark = (id: string) => {
    setBookmarks(prev => prev.filter(b => b.id !== id));
  };

  const getTypeIcon = (type: string) => {
    switch (type) {
      case "lesson": return <BookOpen className="w-4 h-4 text-emerald-500" />;
      case "video": return <Video className="w-4 h-4 text-red-500" />;
      case "article": return <FileText className="w-4 h-4 text-blue-500" />;
      case "code": return <Code className="w-4 h-4 text-purple-500" />;
      default: return <Bookmark className="w-4 h-4" />;
    }
  };

  return (
    <div className="min-h-screen bg-background p-6">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-8"
        >
          <div>
            <h1 className="text-4xl font-bold bg-gradient-to-r from-amber-400 via-orange-400 to-red-400 bg-clip-text text-transparent flex items-center gap-3">
              <Bookmark className="w-10 h-10 text-amber-500" />
              Bookmarks
            </h1>
            <p className="text-muted-foreground mt-2">{filteredBookmarks.length} saved items</p>
          </div>
          <div className="flex items-center gap-3">
            <Button variant="outline" size="icon" onClick={() => setViewMode(viewMode === "grid" ? "list" : "grid")}>
              {viewMode === "grid" ? <List className="w-4 h-4" /> : <Grid className="w-4 h-4" />}
            </Button>
            <Button className="gap-2 bg-gradient-to-r from-amber-500 to-orange-500 hover:from-amber-600 hover:to-orange-600">
              <Plus className="w-4 h-4" />
              Add Bookmark
            </Button>
          </div>
        </motion.div>

        <div className="grid lg:grid-cols-4 gap-6">
          {/* Sidebar */}
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            className="lg:col-span-1 space-y-4"
          >
            {/* Search */}
            <Card className="p-4 bg-card/50 backdrop-blur">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                <Input
                  placeholder="Search bookmarks..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="pl-10"
                />
              </div>
            </Card>

            {/* Folders */}
            <Card className="p-4 bg-card/50 backdrop-blur">
              <h3 className="font-semibold mb-3 flex items-center gap-2">
                <Folder className="w-4 h-4" />
                Folders
              </h3>
              <div className="space-y-1">
                {folders.map((folder) => (
                  <button
                    key={folder.id}
                    onClick={() => setSelectedFolder(folder.id)}
                    className={`w-full flex items-center justify-between p-2 rounded-lg transition-all ${
                      selectedFolder === folder.id
                        ? "bg-primary/20 text-primary"
                        : "hover:bg-muted/50"
                    }`}
                  >
                    <span className="text-sm">{folder.name}</span>
                    <span className="text-xs bg-muted px-2 py-0.5 rounded-full">{folder.count}</span>
                  </button>
                ))}
              </div>
            </Card>

            {/* Types */}
            <Card className="p-4 bg-card/50 backdrop-blur">
              <h3 className="font-semibold mb-3 flex items-center gap-2">
                <Filter className="w-4 h-4" />
                Types
              </h3>
              <div className="space-y-1">
                {types.map((type) => (
                  <button
                    key={type.id}
                    onClick={() => setSelectedType(type.id)}
                    className={`w-full flex items-center gap-2 p-2 rounded-lg transition-all ${
                      selectedType === type.id
                        ? "bg-primary/20 text-primary"
                        : "hover:bg-muted/50"
                    }`}
                  >
                    {type.icon}
                    <span className="text-sm">{type.name}</span>
                  </button>
                ))}
              </div>
            </Card>
          </motion.div>

          {/* Main Content */}
          <div className="lg:col-span-3">
            {/* Sort Bar */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="flex items-center justify-between mb-4"
            >
              <Button variant="ghost" size="sm" className="gap-2">
                <SortAsc className="w-4 h-4" />
                Sort by Date
                <ChevronDown className="w-3 h-3" />
              </Button>
              <span className="text-sm text-muted-foreground">
                Showing {filteredBookmarks.length} of {bookmarks.length}
              </span>
            </motion.div>

            {/* Bookmarks Grid/List */}
            {isLoading ? (
              <div className="grid gap-4 md:grid-cols-2">
                {[1, 2, 3, 4].map((i) => (
                  <Card key={i} className="p-4 bg-card/50 backdrop-blur animate-pulse">
                    <div className="h-4 bg-muted rounded w-3/4 mb-2" />
                    <div className="h-3 bg-muted rounded w-full mb-4" />
                    <div className="flex gap-2">
                      <div className="h-5 bg-muted rounded-full w-16" />
                      <div className="h-5 bg-muted rounded-full w-16" />
                    </div>
                  </Card>
                ))}
              </div>
            ) : (
              <AnimatePresence mode="popLayout">
                <div className={viewMode === "grid" ? "grid gap-4 md:grid-cols-2" : "space-y-3"}>
                  {filteredBookmarks.map((bookmark, index) => (
                    <motion.div
                      key={bookmark.id}
                      layout
                      initial={{ opacity: 0, scale: 0.9 }}
                      animate={{ opacity: 1, scale: 1 }}
                      exit={{ opacity: 0, scale: 0.9 }}
                      transition={{ delay: index * 0.05 }}
                    >
                      <Card className={`bg-card/50 backdrop-blur border-border hover:border-primary/50 transition-all group ${
                        viewMode === "list" ? "p-4" : "p-5"
                      }`}>
                        <div className={viewMode === "list" ? "flex items-center gap-4" : ""}>
                          <div className={`flex items-start gap-3 ${viewMode === "list" ? "flex-1" : "mb-3"}`}>
                            <div className="p-2 bg-muted rounded-lg">
                              {getTypeIcon(bookmark.type)}
                            </div>
                            <div className="flex-1 min-w-0">
                              <h4 className="font-semibold truncate group-hover:text-primary transition-colors">
                                {bookmark.title}
                              </h4>
                              {viewMode === "grid" && (
                                <p className="text-sm text-muted-foreground line-clamp-2 mt-1">
                                  {bookmark.description}
                                </p>
                              )}
                            </div>
                          </div>
                          
                          {viewMode === "grid" && (
                            <div className="flex flex-wrap gap-1 mb-3">
                              {bookmark.tags.map((tag) => (
                                <span
                                  key={tag}
                                  className="px-2 py-0.5 text-xs bg-muted rounded-full"
                                >
                                  {tag}
                                </span>
                              ))}
                            </div>
                          )}
                          
                          <div className={`flex items-center gap-2 ${viewMode === "list" ? "" : "justify-between"}`}>
                            {viewMode === "grid" && (
                              <span className="text-xs text-muted-foreground flex items-center gap-1">
                                <Clock className="w-3 h-3" />
                                {bookmark.createdAt}
                              </span>
                            )}
                            <div className="flex items-center gap-1">
                              <Button
                                variant="ghost"
                                size="icon"
                                className="h-8 w-8"
                                onClick={() => toggleFavorite(bookmark.id)}
                              >
                                <Star className={`w-4 h-4 ${bookmark.isFavorite ? "fill-amber-500 text-amber-500" : ""}`} />
                              </Button>
                              <Button variant="ghost" size="icon" className="h-8 w-8">
                                <ExternalLink className="w-4 h-4" />
                              </Button>
                              <Button
                                variant="ghost"
                                size="icon"
                                className="h-8 w-8 text-destructive hover:text-destructive"
                                onClick={() => removeBookmark(bookmark.id)}
                              >
                                <Trash2 className="w-4 h-4" />
                              </Button>
                            </div>
                          </div>
                        </div>
                      </Card>
                    </motion.div>
                  ))}
                </div>
              </AnimatePresence>
            )}

            {filteredBookmarks.length === 0 && !isLoading && (
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                className="text-center py-16"
              >
                <Bookmark className="w-16 h-16 mx-auto text-muted-foreground/50 mb-4" />
                <h3 className="text-xl font-semibold mb-2">No bookmarks found</h3>
                <p className="text-muted-foreground">Try adjusting your search or filters</p>
              </motion.div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
