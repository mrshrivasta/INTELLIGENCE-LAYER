"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
  Users, ChevronLeft, MessageSquare, Heart, Share2, Bookmark,
  Search, Filter, TrendingUp, Clock, Award, Star, Flame, ThumbsUp,
  MessageCircle, Eye, Plus, Send, Image, Link2, Code, AtSign,
  Hash, Bell, Settings, MoreHorizontal, ChevronUp, ChevronDown,
  Crown, Shield, Sparkles, Zap, CheckCircle
} from "lucide-react";
import Link from "next/link";
import { motion, AnimatePresence } from "framer-motion";

interface Post {
  id: string;
  author: {
    name: string;
    avatar: string;
    level: number;
    badge?: string;
    isVerified?: boolean;
  };
  content: string;
  code?: string;
  tags: string[];
  likes: number;
  comments: number;
  views: number;
  timestamp: string;
  isLiked?: boolean;
  isBookmarked?: boolean;
  category: "question" | "discussion" | "showcase" | "help" | "resource";
}

const categories = [
  { id: "all", label: "All Posts", icon: MessageSquare },
  { id: "question", label: "Questions", icon: MessageCircle },
  { id: "discussion", label: "Discussions", icon: Users },
  { id: "showcase", label: "Showcase", icon: Star },
  { id: "help", label: "Help Needed", icon: Heart },
  { id: "resource", label: "Resources", icon: Link2 },
];

const trendingTopics = [
  { tag: "react", count: 1234 },
  { tag: "javascript", count: 987 },
  { tag: "typescript", count: 756 },
  { tag: "nextjs", count: 543 },
  { tag: "tailwind", count: 432 },
];

const topContributors = [
  { name: "Alex Chen", avatar: "A", level: 42, points: 12450, badge: "mentor" },
  { name: "Sarah Kim", avatar: "S", level: 38, points: 10230, badge: "expert" },
  { name: "Mike Ross", avatar: "M", level: 35, points: 8920, badge: "helper" },
  { name: "Emma Li", avatar: "E", level: 32, points: 7650 },
  { name: "John Doe", avatar: "J", level: 28, points: 5430 },
];

const initialPosts: Post[] = [
  {
    id: "1",
    author: { name: "Alex Chen", avatar: "A", level: 42, badge: "mentor", isVerified: true },
    content: "Just finished building a real-time chat application using WebSockets and React! Here's how I handled the reconnection logic to ensure a smooth user experience.",
    code: `const useWebSocket = (url) => {
  const [socket, setSocket] = useState(null);
  
  useEffect(() => {
    const ws = new WebSocket(url);
    ws.onopen = () => console.log('Connected');
    setSocket(ws);
    return () => ws.close();
  }, [url]);
  
  return socket;
};`,
    tags: ["react", "websockets", "realtime"],
    likes: 234,
    comments: 45,
    views: 1250,
    timestamp: "2 hours ago",
    category: "showcase",
    isLiked: true
  },
  {
    id: "2",
    author: { name: "Sarah Kim", avatar: "S", level: 38, badge: "expert" },
    content: "Can someone explain the difference between useMemo and useCallback? I've read the docs but I'm still confused about when to use each one.",
    tags: ["react", "hooks", "performance"],
    likes: 156,
    comments: 32,
    views: 890,
    timestamp: "4 hours ago",
    category: "question"
  },
  {
    id: "3",
    author: { name: "Mike Ross", avatar: "M", level: 35, badge: "helper" },
    content: "Pro tip: Use the new CSS :has() selector to create parent selectors without JavaScript! This is a game changer for styling complex components.",
    tags: ["css", "tips", "frontend"],
    likes: 312,
    comments: 28,
    views: 2100,
    timestamp: "6 hours ago",
    category: "resource",
    isBookmarked: true
  },
  {
    id: "4",
    author: { name: "Emma Li", avatar: "E", level: 32 },
    content: "Struggling with TypeScript generics. Can anyone recommend good resources or explain with examples? I want to understand them deeply.",
    tags: ["typescript", "generics", "learning"],
    likes: 89,
    comments: 21,
    views: 560,
    timestamp: "8 hours ago",
    category: "help"
  },
  {
    id: "5",
    author: { name: "John Doe", avatar: "J", level: 28 },
    content: "What's everyone's thoughts on the new React 19 features? The new hooks look promising but I'm curious about the performance implications.",
    tags: ["react", "react19", "discussion"],
    likes: 198,
    comments: 67,
    views: 1450,
    timestamp: "12 hours ago",
    category: "discussion"
  },
];

const badgeColors: Record<string, string> = {
  mentor: "from-amber-500 to-orange-500",
  expert: "from-violet-500 to-purple-500",
  helper: "from-emerald-500 to-teal-500",
};

const categoryColors: Record<string, string> = {
  question: "bg-blue-500/10 text-blue-500",
  discussion: "bg-violet-500/10 text-violet-500",
  showcase: "bg-amber-500/10 text-amber-500",
  help: "bg-red-500/10 text-red-500",
  resource: "bg-emerald-500/10 text-emerald-500",
};

export default function CommunityPage() {
  const [posts, setPosts] = useState(initialPosts);
  const [selectedCategory, setSelectedCategory] = useState("all");
  const [sortBy, setSortBy] = useState<"trending" | "latest" | "top">("trending");
  const [searchQuery, setSearchQuery] = useState("");
  const [showNewPost, setShowNewPost] = useState(false);
  const [newPostContent, setNewPostContent] = useState("");

  const filteredPosts = posts.filter(post => {
    if (selectedCategory !== "all" && post.category !== selectedCategory) return false;
    if (searchQuery && !post.content.toLowerCase().includes(searchQuery.toLowerCase())) return false;
    return true;
  });

  const toggleLike = (postId: string) => {
    setPosts(posts.map(p => {
      if (p.id === postId) {
        return { ...p, isLiked: !p.isLiked, likes: p.isLiked ? p.likes - 1 : p.likes + 1 };
      }
      return p;
    }));
  };

  const toggleBookmark = (postId: string) => {
    setPosts(posts.map(p => {
      if (p.id === postId) {
        return { ...p, isBookmarked: !p.isBookmarked };
      }
      return p;
    }));
  };

  return (
    <div className="min-h-screen bg-background">
      <div className="fixed inset-0 bg-[radial-gradient(ellipse_at_top,_var(--tw-gradient-stops))] from-primary/5 via-transparent to-transparent pointer-events-none" />

      <header className="sticky top-0 z-50 border-b border-border bg-background/80 backdrop-blur-xl">
        <div className="mx-auto flex h-16 items-center justify-between px-6 max-w-7xl">
          <Link href="/dashboard">
            <Button variant="ghost">
              <ChevronLeft className="mr-2 h-4 w-4" /> Dashboard
            </Button>
          </Link>
          <div className="flex-1 max-w-md mx-4">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <input
                type="text"
                placeholder="Search discussions..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-10 pr-4 py-2 rounded-full bg-muted border border-border focus:ring-2 focus:ring-primary outline-none text-sm"
              />
            </div>
          </div>
          <div className="flex items-center gap-2">
            <Button variant="ghost" size="icon">
              <Bell className="h-5 w-5" />
            </Button>
            <Button onClick={() => setShowNewPost(true)} className="bg-gradient-to-r from-emerald-500 to-cyan-500">
              <Plus className="mr-2 h-4 w-4" /> New Post
            </Button>
          </div>
        </div>
      </header>

      <main className="max-w-7xl mx-auto p-6">
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
          <div className="lg:col-span-1 space-y-6">
            <motion.div
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              className="rounded-2xl border border-border bg-card/50 backdrop-blur-sm p-4"
            >
              <h3 className="font-bold text-foreground mb-4">Categories</h3>
              <div className="space-y-1">
                {categories.map((cat) => {
                  const Icon = cat.icon;
                  return (
                    <button
                      key={cat.id}
                      onClick={() => setSelectedCategory(cat.id)}
                      className={`w-full flex items-center gap-3 px-3 py-2 rounded-lg transition-all ${
                        selectedCategory === cat.id
                          ? "bg-primary/10 text-primary"
                          : "text-muted-foreground hover:bg-muted hover:text-foreground"
                      }`}
                    >
                      <Icon className="h-4 w-4" />
                      <span className="text-sm font-medium">{cat.label}</span>
                    </button>
                  );
                })}
              </div>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.1 }}
              className="rounded-2xl border border-border bg-card/50 backdrop-blur-sm p-4"
            >
              <h3 className="font-bold text-foreground mb-4 flex items-center gap-2">
                <TrendingUp className="h-4 w-4 text-primary" />
                Trending Topics
              </h3>
              <div className="space-y-2">
                {trendingTopics.map((topic, i) => (
                  <motion.button
                    key={topic.tag}
                    initial={{ opacity: 0, x: -10 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: i * 0.05 }}
                    className="w-full flex items-center justify-between px-3 py-2 rounded-lg hover:bg-muted transition-all"
                  >
                    <span className="text-sm font-medium text-foreground">#{topic.tag}</span>
                    <span className="text-xs text-muted-foreground">{topic.count}</span>
                  </motion.button>
                ))}
              </div>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.2 }}
              className="rounded-2xl border border-border bg-card/50 backdrop-blur-sm p-4"
            >
              <h3 className="font-bold text-foreground mb-4 flex items-center gap-2">
                <Award className="h-4 w-4 text-amber-400" />
                Top Contributors
              </h3>
              <div className="space-y-3">
                {topContributors.map((user, i) => (
                  <motion.div
                    key={user.name}
                    initial={{ opacity: 0, x: -10 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: i * 0.05 }}
                    className="flex items-center gap-3"
                  >
                    <span className="text-sm font-bold text-muted-foreground w-4">{i + 1}</span>
                    <div className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-bold text-white ${
                      user.badge ? `bg-gradient-to-br ${badgeColors[user.badge]}` : "bg-primary"
                    }`}>
                      {user.avatar}
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-medium text-foreground truncate">{user.name}</p>
                      <p className="text-xs text-muted-foreground">Level {user.level}</p>
                    </div>
                    <span className="text-xs font-medium text-primary">{user.points.toLocaleString()}</span>
                  </motion.div>
                ))}
              </div>
            </motion.div>
          </div>

          <div className="lg:col-span-3 space-y-6">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="flex items-center justify-between"
            >
              <div className="flex items-center gap-2">
                <h2 className="text-xl font-bold text-foreground">
                  {categories.find(c => c.id === selectedCategory)?.label || "All Posts"}
                </h2>
                <Badge variant="outline">{filteredPosts.length}</Badge>
              </div>
              <div className="flex items-center gap-2">
                {["trending", "latest", "top"].map((sort) => (
                  <Button
                    key={sort}
                    variant={sortBy === sort ? "default" : "ghost"}
                    size="sm"
                    onClick={() => setSortBy(sort as typeof sortBy)}
                    className={sortBy === sort ? "bg-primary text-white" : ""}
                  >
                    {sort.charAt(0).toUpperCase() + sort.slice(1)}
                  </Button>
                ))}
              </div>
            </motion.div>

            <div className="space-y-4">
              {filteredPosts.map((post, i) => (
                <motion.div
                  key={post.id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: i * 0.1 }}
                  className="rounded-2xl border border-border bg-card/50 backdrop-blur-sm p-6 hover:border-primary/30 transition-all"
                >
                  <div className="flex items-start gap-4">
                    <div className={`w-12 h-12 rounded-full flex items-center justify-center text-lg font-bold text-white shrink-0 ${
                      post.author.badge ? `bg-gradient-to-br ${badgeColors[post.author.badge]}` : "bg-primary"
                    }`}>
                      {post.author.avatar}
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2 flex-wrap mb-2">
                        <span className="font-bold text-foreground">{post.author.name}</span>
                        {post.author.isVerified && (
                          <CheckCircle className="h-4 w-4 text-primary fill-primary" />
                        )}
                        {post.author.badge && (
                          <Badge className={`bg-gradient-to-r ${badgeColors[post.author.badge]} text-white text-xs border-0`}>
                            {post.author.badge}
                          </Badge>
                        )}
                        <span className="text-xs text-muted-foreground">Level {post.author.level}</span>
                        <span className="text-xs text-muted-foreground">•</span>
                        <span className="text-xs text-muted-foreground">{post.timestamp}</span>
                        <Badge className={`${categoryColors[post.category]} text-xs border-0`}>
                          {post.category}
                        </Badge>
                      </div>

                      <p className="text-foreground mb-3">{post.content}</p>

                      {post.code && (
                        <div className="mb-3 rounded-lg bg-muted/80 p-4 overflow-x-auto">
                          <pre className="text-sm text-foreground font-mono">
                            <code>{post.code}</code>
                          </pre>
                        </div>
                      )}

                      <div className="flex flex-wrap gap-2 mb-4">
                        {post.tags.map((tag) => (
                          <Badge key={tag} variant="outline" className="text-xs">
                            #{tag}
                          </Badge>
                        ))}
                      </div>

                      <div className="flex items-center gap-6">
                        <button
                          onClick={() => toggleLike(post.id)}
                          className={`flex items-center gap-2 text-sm transition-all ${
                            post.isLiked ? "text-red-500" : "text-muted-foreground hover:text-red-500"
                          }`}
                        >
                          <Heart className={`h-4 w-4 ${post.isLiked ? "fill-current" : ""}`} />
                          <span>{post.likes}</span>
                        </button>
                        <button className="flex items-center gap-2 text-sm text-muted-foreground hover:text-primary transition-all">
                          <MessageCircle className="h-4 w-4" />
                          <span>{post.comments}</span>
                        </button>
                        <button className="flex items-center gap-2 text-sm text-muted-foreground">
                          <Eye className="h-4 w-4" />
                          <span>{post.views}</span>
                        </button>
                        <div className="flex-1" />
                        <button
                          onClick={() => toggleBookmark(post.id)}
                          className={`p-2 rounded-lg transition-all ${
                            post.isBookmarked ? "text-primary" : "text-muted-foreground hover:text-primary"
                          }`}
                        >
                          <Bookmark className={`h-4 w-4 ${post.isBookmarked ? "fill-current" : ""}`} />
                        </button>
                        <button className="p-2 rounded-lg text-muted-foreground hover:text-primary transition-all">
                          <Share2 className="h-4 w-4" />
                        </button>
                      </div>
                    </div>
                  </div>
                </motion.div>
              ))}
            </div>
          </div>
        </div>
      </main>

      <AnimatePresence>
        {showNewPost && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 flex items-center justify-center bg-background/80 backdrop-blur-sm p-4"
            onClick={() => setShowNewPost(false)}
          >
            <motion.div
              initial={{ scale: 0.9, opacity: 0, y: 20 }}
              animate={{ scale: 1, opacity: 1, y: 0 }}
              exit={{ scale: 0.9, opacity: 0, y: 20 }}
              className="w-full max-w-2xl rounded-2xl border border-border bg-card p-6"
              onClick={e => e.stopPropagation()}
            >
              <h3 className="text-xl font-bold text-foreground mb-4">Create New Post</h3>
              
              <div className="space-y-4">
                <div className="flex gap-2 mb-4">
                  {["question", "discussion", "showcase", "help", "resource"].map((cat) => (
                    <Button key={cat} variant="outline" size="sm" className={categoryColors[cat]}>
                      {cat}
                    </Button>
                  ))}
                </div>

                <textarea
                  value={newPostContent}
                  onChange={(e) => setNewPostContent(e.target.value)}
                  placeholder="What's on your mind? Share your thoughts, questions, or discoveries..."
                  rows={6}
                  className="w-full px-4 py-3 rounded-lg bg-muted border border-border focus:ring-2 focus:ring-primary outline-none resize-none"
                />

                <div className="flex items-center gap-2 border-t border-border pt-4">
                  <Button variant="ghost" size="icon">
                    <Image className="h-5 w-5" />
                  </Button>
                  <Button variant="ghost" size="icon">
                    <Code className="h-5 w-5" />
                  </Button>
                  <Button variant="ghost" size="icon">
                    <Link2 className="h-5 w-5" />
                  </Button>
                  <Button variant="ghost" size="icon">
                    <AtSign className="h-5 w-5" />
                  </Button>
                  <Button variant="ghost" size="icon">
                    <Hash className="h-5 w-5" />
                  </Button>
                  <div className="flex-1" />
                  <Button variant="outline" onClick={() => setShowNewPost(false)}>
                    Cancel
                  </Button>
                  <Button className="bg-gradient-to-r from-emerald-500 to-cyan-500">
                    <Send className="mr-2 h-4 w-4" /> Post
                  </Button>
                </div>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
