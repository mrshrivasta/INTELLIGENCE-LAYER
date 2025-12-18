"use client";

import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import {
  Gift, Zap, Star, Crown, Sparkles, ShoppingBag, Lock,
  CheckCircle2, Clock, Gem, Ticket, Award, Heart, Coffee
} from "lucide-react";

interface Reward {
  id: string;
  name: string;
  description: string;
  type: "badge" | "theme" | "avatar" | "coupon" | "feature";
  xpCost: number;
  icon: string;
  rarity: "common" | "rare" | "epic" | "legendary";
  stock: number | null;
  isOwned: boolean;
  isNew: boolean;
}

export default function RewardsPage() {
  const [rewards, setRewards] = useState<Reward[]>([]);
  const [userXP, setUserXP] = useState(2450);
  const [selectedCategory, setSelectedCategory] = useState("all");
  const [isLoading, setIsLoading] = useState(true);
  const [showConfetti, setShowConfetti] = useState(false);

  const categories = [
    { id: "all", name: "All Rewards", icon: <Gift className="w-4 h-4" /> },
    { id: "badge", name: "Badges", icon: <Award className="w-4 h-4" /> },
    { id: "theme", name: "Themes", icon: <Sparkles className="w-4 h-4" /> },
    { id: "avatar", name: "Avatars", icon: <Heart className="w-4 h-4" /> },
    { id: "coupon", name: "Coupons", icon: <Ticket className="w-4 h-4" /> },
    { id: "feature", name: "Features", icon: <Star className="w-4 h-4" /> },
  ];

  useEffect(() => {
    fetchRewards();
  }, []);

  const fetchRewards = async () => {
    setIsLoading(true);
    await new Promise(resolve => setTimeout(resolve, 600));
    
    const mockRewards: Reward[] = [
      { id: "1", name: "Dark Mode Pro", description: "Unlock premium dark mode themes", type: "theme", xpCost: 500, icon: "🌙", rarity: "common", stock: null, isOwned: true, isNew: false },
      { id: "2", name: "Gold Badge", description: "Show off your achievements with a gold badge", type: "badge", xpCost: 1000, icon: "🏆", rarity: "rare", stock: null, isOwned: false, isNew: true },
      { id: "3", name: "Robot Avatar", description: "Cute robot avatar for your profile", type: "avatar", xpCost: 750, icon: "🤖", rarity: "common", stock: null, isOwned: false, isNew: false },
      { id: "4", name: "20% Course Discount", description: "Get 20% off any premium course", type: "coupon", xpCost: 2000, icon: "🎫", rarity: "rare", stock: 50, isOwned: false, isNew: true },
      { id: "5", name: "Custom Profile Banner", description: "Upload your own profile banner", type: "feature", xpCost: 1500, icon: "🖼️", rarity: "rare", stock: null, isOwned: false, isNew: false },
      { id: "6", name: "Legendary Badge", description: "The ultimate badge for top learners", type: "badge", xpCost: 5000, icon: "👑", rarity: "legendary", stock: 10, isOwned: false, isNew: false },
      { id: "7", name: "Neon Theme", description: "Vibrant neon color theme", type: "theme", xpCost: 800, icon: "✨", rarity: "common", stock: null, isOwned: true, isNew: false },
      { id: "8", name: "Free Coffee ☕", description: "Redeem for a free coffee at partner cafes", type: "coupon", xpCost: 3000, icon: "☕", rarity: "epic", stock: 20, isOwned: false, isNew: true },
      { id: "9", name: "AI Tutor Access", description: "1 month of premium AI tutor access", type: "feature", xpCost: 4000, icon: "🧠", rarity: "epic", stock: null, isOwned: false, isNew: false },
      { id: "10", name: "Ninja Avatar", description: "Stealthy ninja avatar", type: "avatar", xpCost: 600, icon: "🥷", rarity: "common", stock: null, isOwned: false, isNew: false },
      { id: "11", name: "Diamond Frame", description: "Diamond profile picture frame", type: "feature", xpCost: 10000, icon: "💎", rarity: "legendary", stock: 5, isOwned: false, isNew: true },
      { id: "12", name: "Early Access", description: "Get early access to new features", type: "feature", xpCost: 2500, icon: "🚀", rarity: "rare", stock: null, isOwned: false, isNew: false },
    ];
    
    setRewards(mockRewards);
    setIsLoading(false);
  };

  const redeemReward = (reward: Reward) => {
    if (userXP >= reward.xpCost && !reward.isOwned) {
      setUserXP(prev => prev - reward.xpCost);
      setRewards(prev => prev.map(r => 
        r.id === reward.id ? { ...r, isOwned: true } : r
      ));
      setShowConfetti(true);
      setTimeout(() => setShowConfetti(false), 3000);
    }
  };

  const filteredRewards = rewards.filter(r => 
    selectedCategory === "all" || r.type === selectedCategory
  );

  const getRarityColor = (rarity: string) => {
    switch (rarity) {
      case "common": return "from-slate-400 to-slate-500 border-slate-400/50";
      case "rare": return "from-blue-400 to-cyan-500 border-blue-400/50";
      case "epic": return "from-purple-400 to-pink-500 border-purple-400/50";
      case "legendary": return "from-amber-400 to-orange-500 border-amber-400/50";
      default: return "from-gray-400 to-gray-500 border-gray-400/50";
    }
  };

  const getRarityBg = (rarity: string) => {
    switch (rarity) {
      case "common": return "bg-slate-500/10";
      case "rare": return "bg-blue-500/10";
      case "epic": return "bg-purple-500/10";
      case "legendary": return "bg-amber-500/10";
      default: return "bg-gray-500/10";
    }
  };

  return (
    <div className="min-h-screen bg-background p-6">
      {/* Confetti Effect */}
      <AnimatePresence>
        {showConfetti && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 pointer-events-none z-50"
          >
            {[...Array(50)].map((_, i) => (
              <motion.div
                key={i}
                initial={{ 
                  x: Math.random() * window.innerWidth, 
                  y: -20,
                  rotate: 0
                }}
                animate={{ 
                  y: window.innerHeight + 20,
                  rotate: Math.random() * 720 - 360
                }}
                transition={{ 
                  duration: 2 + Math.random() * 2,
                  delay: Math.random() * 0.5
                }}
                className="absolute w-3 h-3 rounded-sm"
                style={{
                  backgroundColor: ["#10b981", "#f59e0b", "#ec4899", "#8b5cf6", "#06b6d4"][Math.floor(Math.random() * 5)]
                }}
              />
            ))}
          </motion.div>
        )}
      </AnimatePresence>

      <div className="max-w-6xl mx-auto space-y-8">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center"
        >
          <h1 className="text-4xl font-bold bg-gradient-to-r from-amber-400 via-orange-400 to-red-400 bg-clip-text text-transparent flex items-center justify-center gap-3">
            <Gift className="w-10 h-10 text-amber-500" />
            Rewards Shop
          </h1>
          <p className="text-muted-foreground mt-2">Redeem your XP for exclusive rewards</p>
        </motion.div>

        {/* XP Balance */}
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ delay: 0.1 }}
        >
          <Card className="p-6 bg-gradient-to-br from-amber-500/20 via-orange-500/10 to-red-500/20 border-amber-500/30">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">Your Balance</p>
                <div className="flex items-center gap-2 mt-1">
                  <Zap className="w-8 h-8 text-amber-500" />
                  <span className="text-4xl font-bold">{userXP.toLocaleString()}</span>
                  <span className="text-xl text-muted-foreground">XP</span>
                </div>
              </div>
              <div className="text-right">
                <p className="text-sm text-muted-foreground">Rewards Owned</p>
                <p className="text-2xl font-bold">{rewards.filter(r => r.isOwned).length}</p>
              </div>
            </div>
          </Card>
        </motion.div>

        {/* Categories */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.2 }}
          className="flex gap-2 flex-wrap"
        >
          {categories.map((cat) => (
            <Button
              key={cat.id}
              variant={selectedCategory === cat.id ? "default" : "outline"}
              onClick={() => setSelectedCategory(cat.id)}
              className={`gap-2 ${selectedCategory === cat.id ? "bg-gradient-to-r from-amber-500 to-orange-500" : ""}`}
            >
              {cat.icon}
              {cat.name}
            </Button>
          ))}
        </motion.div>

        {/* Rewards Grid */}
        {isLoading ? (
          <div className="grid md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
            {[1, 2, 3, 4, 5, 6, 7, 8].map((i) => (
              <Card key={i} className="p-4 bg-card/50 animate-pulse">
                <div className="w-16 h-16 rounded-full bg-muted mx-auto mb-4" />
                <div className="h-5 bg-muted rounded w-3/4 mx-auto mb-2" />
                <div className="h-4 bg-muted rounded w-full mb-4" />
                <div className="h-10 bg-muted rounded" />
              </Card>
            ))}
          </div>
        ) : (
          <AnimatePresence mode="popLayout">
            <div className="grid md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
              {filteredRewards.map((reward, index) => {
                const canAfford = userXP >= reward.xpCost;
                const isAvailable = reward.stock === null || reward.stock > 0;
                
                return (
                  <motion.div
                    key={reward.id}
                    layout
                    initial={{ opacity: 0, scale: 0.9 }}
                    animate={{ opacity: 1, scale: 1 }}
                    exit={{ opacity: 0, scale: 0.9 }}
                    transition={{ delay: index * 0.05 }}
                  >
                    <Card className={`p-5 bg-card/50 backdrop-blur border-border hover:border-primary/50 transition-all relative overflow-hidden ${
                      reward.isOwned ? "opacity-75" : ""
                    }`}>
                      {/* New Badge */}
                      {reward.isNew && !reward.isOwned && (
                        <div className="absolute top-2 right-2 px-2 py-0.5 rounded-full bg-red-500 text-white text-xs font-medium animate-pulse">
                          NEW
                        </div>
                      )}
                      
                      {/* Rarity Border */}
                      <div className={`absolute inset-0 bg-gradient-to-br ${getRarityColor(reward.rarity)} opacity-20 pointer-events-none`} />
                      
                      {/* Icon */}
                      <div className={`w-16 h-16 mx-auto rounded-full ${getRarityBg(reward.rarity)} flex items-center justify-center mb-4 text-4xl`}>
                        {reward.icon}
                      </div>
                      
                      {/* Info */}
                      <div className="text-center mb-4">
                        <h3 className="font-semibold">{reward.name}</h3>
                        <p className="text-xs text-muted-foreground mt-1 line-clamp-2">
                          {reward.description}
                        </p>
                        <div className="flex items-center justify-center gap-2 mt-2">
                          <span className={`px-2 py-0.5 rounded-full text-xs capitalize ${getRarityBg(reward.rarity)}`}>
                            {reward.rarity}
                          </span>
                          {reward.stock !== null && (
                            <span className="px-2 py-0.5 rounded-full text-xs bg-muted">
                              {reward.stock} left
                            </span>
                          )}
                        </div>
                      </div>
                      
                      {/* Price & Action */}
                      <div className="space-y-2">
                        <div className="flex items-center justify-center gap-1 text-lg font-bold">
                          <Zap className="w-5 h-5 text-amber-500" />
                          {reward.xpCost.toLocaleString()}
                        </div>
                        
                        {reward.isOwned ? (
                          <Button disabled className="w-full gap-2">
                            <CheckCircle2 className="w-4 h-4" />
                            Owned
                          </Button>
                        ) : !isAvailable ? (
                          <Button disabled className="w-full gap-2">
                            <Clock className="w-4 h-4" />
                            Sold Out
                          </Button>
                        ) : !canAfford ? (
                          <Button disabled variant="outline" className="w-full gap-2">
                            <Lock className="w-4 h-4" />
                            {(reward.xpCost - userXP).toLocaleString()} XP needed
                          </Button>
                        ) : (
                          <Button
                            onClick={() => redeemReward(reward)}
                            className="w-full gap-2 bg-gradient-to-r from-amber-500 to-orange-500 hover:from-amber-600 hover:to-orange-600"
                          >
                            <ShoppingBag className="w-4 h-4" />
                            Redeem
                          </Button>
                        )}
                      </div>
                    </Card>
                  </motion.div>
                );
              })}
            </div>
          </AnimatePresence>
        )}

        {filteredRewards.length === 0 && !isLoading && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="text-center py-16"
          >
            <Gift className="w-16 h-16 mx-auto text-muted-foreground/50 mb-4" />
            <h3 className="text-xl font-semibold mb-2">No rewards in this category</h3>
            <p className="text-muted-foreground">Check back later for new rewards</p>
          </motion.div>
        )}
      </div>
    </div>
  );
}
