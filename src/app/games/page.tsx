"use client";

import { useState, useEffect, useCallback } from "react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
  Gamepad2, Trophy, Star, Zap, Timer, Brain, Target, Puzzle,
  Rocket, Heart, Shield, Flame, Crown, Sparkles, Play, Pause,
  RotateCcw, Volume2, VolumeX, ChevronLeft, Award, TrendingUp,
  Lock, CheckCircle, XCircle, HelpCircle, Lightbulb, ArrowRight
} from "lucide-react";
import Link from "next/link";
import { motion, AnimatePresence } from "framer-motion";
import { useTheme } from "@/components/ThemeProvider";

interface GameCard {
  id: string;
  name: string;
  description: string;
  icon: React.ElementType;
  gradient: string;
  difficulty: "easy" | "medium" | "hard";
  xpReward: number;
  playTime: string;
  category: string;
  locked: boolean;
  highScore?: number;
}

const games: GameCard[] = [
  { id: "word-scramble", name: "Word Scramble", description: "Unscramble programming terms", icon: Puzzle, gradient: "from-violet-500 to-purple-600", difficulty: "easy", xpReward: 50, playTime: "2-3 min", category: "vocabulary", locked: false, highScore: 850 },
  { id: "code-quiz", name: "Code Quiz", description: "Test your coding knowledge", icon: Brain, gradient: "from-cyan-500 to-blue-600", difficulty: "medium", xpReward: 100, playTime: "5 min", category: "quiz", locked: false, highScore: 920 },
  { id: "memory-match", name: "Memory Match", description: "Match programming concepts", icon: Target, gradient: "from-emerald-500 to-teal-600", difficulty: "easy", xpReward: 75, playTime: "3-4 min", category: "memory", locked: false, highScore: 780 },
  { id: "typing-race", name: "Typing Race", description: "Type code snippets fast", icon: Rocket, gradient: "from-orange-500 to-red-600", difficulty: "hard", xpReward: 150, playTime: "2 min", category: "speed", locked: false },
  { id: "bug-hunter", name: "Bug Hunter", description: "Find bugs in code", icon: Shield, gradient: "from-pink-500 to-rose-600", difficulty: "hard", xpReward: 200, playTime: "5-10 min", category: "debugging", locked: true },
  { id: "algorithm-race", name: "Algorithm Race", description: "Solve algorithms quickly", icon: Zap, gradient: "from-amber-500 to-yellow-600", difficulty: "hard", xpReward: 250, playTime: "10 min", category: "algorithms", locked: true },
  { id: "syntax-builder", name: "Syntax Builder", description: "Build correct syntax", icon: Puzzle, gradient: "from-indigo-500 to-blue-600", difficulty: "medium", xpReward: 100, playTime: "4 min", category: "syntax", locked: false },
  { id: "concept-connect", name: "Concept Connect", description: "Connect related concepts", icon: Sparkles, gradient: "from-fuchsia-500 to-pink-600", difficulty: "medium", xpReward: 125, playTime: "5 min", category: "concepts", locked: false },
];

const wordScrambleWords = [
  { word: "FUNCTION", hint: "Reusable block of code" },
  { word: "VARIABLE", hint: "Stores data values" },
  { word: "ARRAY", hint: "Collection of elements" },
  { word: "OBJECT", hint: "Key-value pairs" },
  { word: "STRING", hint: "Text data type" },
  { word: "BOOLEAN", hint: "True or false" },
  { word: "LOOP", hint: "Repeats code" },
  { word: "CLASS", hint: "Blueprint for objects" },
];

const quizQuestions = [
  { question: "What does CSS stand for?", options: ["Cascading Style Sheets", "Computer Style Sheets", "Creative Style Sheets", "Colorful Style Sheets"], correct: 0 },
  { question: "Which is NOT a JavaScript data type?", options: ["String", "Boolean", "Float", "Undefined"], correct: 2 },
  { question: "What does API stand for?", options: ["Application Programming Interface", "Advanced Program Integration", "Automated Process Interface", "Application Process Integration"], correct: 0 },
  { question: "Which symbol is used for comments in Python?", options: ["//", "/* */", "#", "--"], correct: 2 },
  { question: "What is the time complexity of binary search?", options: ["O(n)", "O(log n)", "O(n²)", "O(1)"], correct: 1 },
];

const memoryCards = [
  { id: 1, content: "HTML", match: 2 },
  { id: 2, content: "Markup", match: 1 },
  { id: 3, content: "CSS", match: 4 },
  { id: 4, content: "Styling", match: 3 },
  { id: 5, content: "JS", match: 6 },
  { id: 6, content: "Logic", match: 5 },
  { id: 7, content: "React", match: 8 },
  { id: 8, content: "Components", match: 7 },
];

function scrambleWord(word: string): string {
  const arr = word.split("");
  for (let i = arr.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [arr[i], arr[j]] = [arr[j], arr[i]];
  }
  return arr.join("");
}

export default function GamesPage() {
  const { theme } = useTheme();
  const [selectedGame, setSelectedGame] = useState<string | null>(null);
  const [score, setScore] = useState(0);
  const [lives, setLives] = useState(3);
  const [streak, setStreak] = useState(0);
  const [gameState, setGameState] = useState<"menu" | "playing" | "paused" | "ended">("menu");
  const [soundEnabled, setSoundEnabled] = useState(true);
  const [timeLeft, setTimeLeft] = useState(60);
  const [currentQuestion, setCurrentQuestion] = useState(0);
  const [userAnswer, setUserAnswer] = useState("");
  const [showHint, setShowHint] = useState(false);
  const [currentWord, setCurrentWord] = useState(wordScrambleWords[0]);
  const [scrambled, setScrambled] = useState("");
  const [flippedCards, setFlippedCards] = useState<number[]>([]);
  const [matchedPairs, setMatchedPairs] = useState<number[]>([]);
  const [memoryGameCards, setMemoryGameCards] = useState(memoryCards);
  const [totalXP, setTotalXP] = useState(2450);
  const [showConfetti, setShowConfetti] = useState(false);

  useEffect(() => {
    if (selectedGame === "word-scramble" && gameState === "playing") {
      const word = wordScrambleWords[Math.floor(Math.random() * wordScrambleWords.length)];
      setCurrentWord(word);
      setScrambled(scrambleWord(word.word));
    }
  }, [selectedGame, gameState]);

  useEffect(() => {
    if (gameState === "playing" && timeLeft > 0) {
      const timer = setInterval(() => setTimeLeft(t => t - 1), 1000);
      return () => clearInterval(timer);
    } else if (timeLeft === 0) {
      setGameState("ended");
    }
  }, [gameState, timeLeft]);

  useEffect(() => {
    if (selectedGame === "memory-match" && gameState === "playing") {
      const shuffled = [...memoryCards].sort(() => Math.random() - 0.5);
      setMemoryGameCards(shuffled);
    }
  }, [selectedGame, gameState]);

  const startGame = (gameId: string) => {
    setSelectedGame(gameId);
    setGameState("playing");
    setScore(0);
    setLives(3);
    setStreak(0);
    setTimeLeft(60);
    setCurrentQuestion(0);
    setUserAnswer("");
    setShowHint(false);
    setFlippedCards([]);
    setMatchedPairs([]);
  };

  const handleWordSubmit = () => {
    if (userAnswer.toUpperCase() === currentWord.word) {
      const points = showHint ? 50 : 100;
      setScore(s => s + points + (streak * 10));
      setStreak(s => s + 1);
      setShowConfetti(true);
      setTimeout(() => setShowConfetti(false), 2000);
      const newWord = wordScrambleWords[Math.floor(Math.random() * wordScrambleWords.length)];
      setCurrentWord(newWord);
      setScrambled(scrambleWord(newWord.word));
      setUserAnswer("");
      setShowHint(false);
    } else {
      setLives(l => l - 1);
      setStreak(0);
      if (lives <= 1) setGameState("ended");
    }
  };

  const handleQuizAnswer = (index: number) => {
    if (index === quizQuestions[currentQuestion].correct) {
      setScore(s => s + 100 + (streak * 20));
      setStreak(s => s + 1);
      setShowConfetti(true);
      setTimeout(() => setShowConfetti(false), 1500);
    } else {
      setLives(l => l - 1);
      setStreak(0);
      if (lives <= 1) {
        setGameState("ended");
        return;
      }
    }
    if (currentQuestion < quizQuestions.length - 1) {
      setCurrentQuestion(q => q + 1);
    } else {
      setGameState("ended");
      setTotalXP(x => x + score);
    }
  };

  const handleCardFlip = (cardId: number) => {
    if (flippedCards.length === 2 || matchedPairs.includes(cardId) || flippedCards.includes(cardId)) return;
    
    const newFlipped = [...flippedCards, cardId];
    setFlippedCards(newFlipped);

    if (newFlipped.length === 2) {
      const [first, second] = newFlipped;
      const card1 = memoryGameCards.find(c => c.id === first);
      const card2 = memoryGameCards.find(c => c.id === second);
      
      if (card1 && card2 && card1.match === second) {
        setMatchedPairs(p => [...p, first, second]);
        setScore(s => s + 50);
        setStreak(s => s + 1);
        setFlippedCards([]);
        if (matchedPairs.length + 2 === memoryCards.length) {
          setGameState("ended");
          setTotalXP(x => x + score + 50);
        }
      } else {
        setStreak(0);
        setTimeout(() => setFlippedCards([]), 1000);
      }
    }
  };

  const renderGame = () => {
    if (selectedGame === "word-scramble") {
      return (
        <div className="space-y-8">
          <div className="text-center">
            <motion.div
              key={scrambled}
              initial={{ scale: 0.8, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              className="text-5xl font-bold tracking-[0.3em] text-primary mb-4"
            >
              {scrambled}
            </motion.div>
            {showHint && (
              <motion.p
                initial={{ opacity: 0, y: -10 }}
                animate={{ opacity: 1, y: 0 }}
                className="text-muted-foreground"
              >
                Hint: {currentWord.hint}
              </motion.p>
            )}
          </div>
          <div className="flex gap-4 justify-center">
            <input
              type="text"
              value={userAnswer}
              onChange={(e) => setUserAnswer(e.target.value.toUpperCase())}
              onKeyDown={(e) => e.key === "Enter" && handleWordSubmit()}
              placeholder="Type your answer..."
              className="px-6 py-3 text-xl text-center bg-muted border border-border rounded-xl focus:ring-2 focus:ring-primary outline-none w-64"
            />
          </div>
          <div className="flex gap-4 justify-center">
            <Button onClick={handleWordSubmit} className="bg-gradient-to-r from-emerald-500 to-cyan-500">
              Submit <ArrowRight className="ml-2 h-4 w-4" />
            </Button>
            <Button variant="outline" onClick={() => setShowHint(true)} disabled={showHint}>
              <Lightbulb className="mr-2 h-4 w-4" /> Hint (-50 pts)
            </Button>
          </div>
        </div>
      );
    }

    if (selectedGame === "code-quiz") {
      const q = quizQuestions[currentQuestion];
      return (
        <div className="space-y-6">
          <div className="text-center mb-8">
            <Badge className="mb-4">Question {currentQuestion + 1} / {quizQuestions.length}</Badge>
            <h3 className="text-2xl font-bold text-foreground">{q.question}</h3>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {q.options.map((option, i) => (
              <motion.button
                key={i}
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                onClick={() => handleQuizAnswer(i)}
                className="p-4 rounded-xl border border-border bg-card/50 hover:bg-card hover:border-primary/50 text-left transition-all"
              >
                <span className="inline-flex items-center justify-center w-8 h-8 rounded-lg bg-primary/10 text-primary font-bold mr-3">
                  {String.fromCharCode(65 + i)}
                </span>
                {option}
              </motion.button>
            ))}
          </div>
        </div>
      );
    }

    if (selectedGame === "memory-match") {
      return (
        <div className="grid grid-cols-4 gap-4 max-w-lg mx-auto">
          {memoryGameCards.map((card) => {
            const isFlipped = flippedCards.includes(card.id) || matchedPairs.includes(card.id);
            return (
              <motion.button
                key={card.id}
                whileHover={{ scale: isFlipped ? 1 : 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={() => handleCardFlip(card.id)}
                className={`aspect-square rounded-xl text-lg font-bold transition-all duration-300 ${
                  isFlipped
                    ? matchedPairs.includes(card.id)
                      ? "bg-gradient-to-br from-emerald-500 to-cyan-500 text-white"
                      : "bg-primary text-white"
                    : "bg-muted hover:bg-muted/80"
                }`}
                style={{ transformStyle: "preserve-3d" }}
              >
                {isFlipped ? card.content : "?"}
              </motion.button>
            );
          })}
        </div>
      );
    }

    return null;
  };

  if (gameState === "playing" || gameState === "paused") {
    return (
      <div className="min-h-screen bg-background">
        <header className="sticky top-0 z-50 border-b border-border bg-background/80 backdrop-blur-xl">
          <div className="mx-auto flex h-16 items-center justify-between px-6 max-w-7xl">
            <Button variant="ghost" onClick={() => { setGameState("menu"); setSelectedGame(null); }}>
              <ChevronLeft className="mr-2 h-4 w-4" /> Back
            </Button>
            <div className="flex items-center gap-6">
              <div className="flex items-center gap-2">
                <Timer className="h-5 w-5 text-primary" />
                <span className={`font-mono text-xl font-bold ${timeLeft < 10 ? "text-red-500 animate-pulse" : "text-foreground"}`}>
                  {Math.floor(timeLeft / 60)}:{(timeLeft % 60).toString().padStart(2, "0")}
                </span>
              </div>
              <div className="flex items-center gap-2">
                <Star className="h-5 w-5 text-amber-400" />
                <span className="font-bold text-foreground">{score}</span>
              </div>
              <div className="flex items-center gap-1">
                {[...Array(3)].map((_, i) => (
                  <Heart key={i} className={`h-5 w-5 ${i < lives ? "text-red-500 fill-red-500" : "text-muted"}`} />
                ))}
              </div>
              {streak > 0 && (
                <Badge className="bg-gradient-to-r from-orange-500 to-red-500 text-white animate-pulse">
                  <Flame className="h-3 w-3 mr-1" /> {streak}x Streak
                </Badge>
              )}
            </div>
            <div className="flex items-center gap-2">
              <Button variant="ghost" size="icon" onClick={() => setGameState(gameState === "playing" ? "paused" : "playing")}>
                {gameState === "playing" ? <Pause className="h-5 w-5" /> : <Play className="h-5 w-5" />}
              </Button>
              <Button variant="ghost" size="icon" onClick={() => setSoundEnabled(!soundEnabled)}>
                {soundEnabled ? <Volume2 className="h-5 w-5" /> : <VolumeX className="h-5 w-5" />}
              </Button>
            </div>
          </div>
        </header>

        <main className="max-w-4xl mx-auto p-8">
          {gameState === "paused" ? (
            <motion.div
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              className="text-center py-20"
            >
              <Pause className="h-20 w-20 text-primary mx-auto mb-6" />
              <h2 className="text-3xl font-bold text-foreground mb-4">Game Paused</h2>
              <div className="flex gap-4 justify-center">
                <Button onClick={() => setGameState("playing")} className="bg-gradient-to-r from-emerald-500 to-cyan-500">
                  <Play className="mr-2 h-4 w-4" /> Resume
                </Button>
                <Button variant="outline" onClick={() => { setGameState("menu"); setSelectedGame(null); }}>
                  Quit Game
                </Button>
              </div>
            </motion.div>
          ) : (
            renderGame()
          )}
        </main>

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
                    rotate: 0,
                    scale: Math.random() * 0.5 + 0.5
                  }}
                  animate={{ 
                    y: window.innerHeight + 20,
                    rotate: Math.random() * 360,
                    x: Math.random() * window.innerWidth
                  }}
                  transition={{ duration: Math.random() * 2 + 1, ease: "linear" }}
                  className="absolute w-3 h-3 rounded-full"
                  style={{ 
                    backgroundColor: ["#10b981", "#06b6d4", "#8b5cf6", "#f59e0b", "#ef4444"][Math.floor(Math.random() * 5)]
                  }}
                />
              ))}
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    );
  }

  if (gameState === "ended") {
    const xpEarned = Math.floor(score / 10);
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <motion.div
          initial={{ opacity: 0, scale: 0.8 }}
          animate={{ opacity: 1, scale: 1 }}
          className="text-center max-w-md mx-auto p-8"
        >
          <motion.div
            animate={{ rotate: [0, 10, -10, 0], scale: [1, 1.1, 1] }}
            transition={{ duration: 0.5 }}
          >
            <Trophy className="h-24 w-24 text-amber-400 mx-auto mb-6" />
          </motion.div>
          <h2 className="text-4xl font-bold text-foreground mb-2">Game Over!</h2>
          <p className="text-muted-foreground mb-8">Great effort! Keep practicing to improve.</p>
          
          <div className="grid grid-cols-2 gap-4 mb-8">
            <div className="p-4 rounded-xl bg-card border border-border">
              <Star className="h-8 w-8 text-amber-400 mx-auto mb-2" />
              <p className="text-2xl font-bold text-foreground">{score}</p>
              <p className="text-sm text-muted-foreground">Final Score</p>
            </div>
            <div className="p-4 rounded-xl bg-card border border-border">
              <Zap className="h-8 w-8 text-primary mx-auto mb-2" />
              <p className="text-2xl font-bold text-foreground">+{xpEarned}</p>
              <p className="text-sm text-muted-foreground">XP Earned</p>
            </div>
          </div>

          <div className="flex gap-4 justify-center">
            <Button onClick={() => startGame(selectedGame!)} className="bg-gradient-to-r from-emerald-500 to-cyan-500">
              <RotateCcw className="mr-2 h-4 w-4" /> Play Again
            </Button>
            <Button variant="outline" onClick={() => { setGameState("menu"); setSelectedGame(null); }}>
              Back to Games
            </Button>
          </div>
        </motion.div>
      </div>
    );
  }

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
          <div className="flex items-center gap-4">
            <div className="flex items-center gap-2 px-4 py-2 rounded-full bg-gradient-to-r from-amber-500/10 to-orange-500/10 border border-amber-500/20">
              <Zap className="h-5 w-5 text-amber-400" />
              <span className="font-bold text-foreground">{totalXP} XP</span>
            </div>
          </div>
        </div>
      </header>

      <main className="max-w-7xl mx-auto p-6">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-12"
        >
          <div className="flex items-center gap-4 mb-4">
            <div className="p-3 rounded-2xl bg-gradient-to-br from-violet-500 to-purple-600">
              <Gamepad2 className="h-8 w-8 text-white" />
            </div>
            <div>
              <h1 className="text-4xl font-bold text-foreground">Learning Games</h1>
              <p className="text-muted-foreground">Learn while having fun!</p>
            </div>
          </div>

          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mt-8">
            {[
              { label: "Games Played", value: "47", icon: Gamepad2, color: "text-violet-400" },
              { label: "High Scores", value: "12", icon: Trophy, color: "text-amber-400" },
              { label: "Win Streak", value: "5", icon: Flame, color: "text-orange-400" },
              { label: "Achievements", value: "23", icon: Award, color: "text-emerald-400" },
            ].map((stat, i) => (
              <motion.div
                key={i}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: i * 0.1 }}
                className="p-4 rounded-xl border border-border bg-card/50 backdrop-blur-sm"
              >
                <stat.icon className={`h-6 w-6 ${stat.color} mb-2`} />
                <p className="text-2xl font-bold text-foreground">{stat.value}</p>
                <p className="text-sm text-muted-foreground">{stat.label}</p>
              </motion.div>
            ))}
          </div>
        </motion.div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {games.map((game, i) => {
            const Icon = game.icon;
            return (
              <motion.div
                key={game.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: i * 0.1 }}
                whileHover={{ y: -5 }}
                className={`relative group rounded-2xl border border-border bg-card/50 backdrop-blur-sm overflow-hidden ${game.locked ? "opacity-60" : ""}`}
              >
                {game.locked && (
                  <div className="absolute inset-0 z-10 flex items-center justify-center bg-background/80 backdrop-blur-sm">
                    <div className="text-center">
                      <Lock className="h-8 w-8 text-muted-foreground mx-auto mb-2" />
                      <p className="text-sm text-muted-foreground">Unlock at Level 5</p>
                    </div>
                  </div>
                )}
                
                <div className={`h-32 bg-gradient-to-br ${game.gradient} flex items-center justify-center relative overflow-hidden`}>
                  <div className="absolute inset-0 bg-black/20" />
                  <motion.div
                    animate={{ rotate: [0, 5, -5, 0] }}
                    transition={{ duration: 4, repeat: Infinity }}
                  >
                    <Icon className="h-16 w-16 text-white relative z-10" />
                  </motion.div>
                  <div className="absolute top-2 right-2">
                    <Badge className={`
                      ${game.difficulty === "easy" ? "bg-emerald-500/80" : ""}
                      ${game.difficulty === "medium" ? "bg-amber-500/80" : ""}
                      ${game.difficulty === "hard" ? "bg-red-500/80" : ""}
                      text-white text-xs
                    `}>
                      {game.difficulty}
                    </Badge>
                  </div>
                </div>

                <div className="p-4">
                  <h3 className="text-lg font-bold text-foreground mb-1">{game.name}</h3>
                  <p className="text-sm text-muted-foreground mb-4">{game.description}</p>
                  
                  <div className="flex items-center justify-between text-xs text-muted-foreground mb-4">
                    <span className="flex items-center gap-1">
                      <Timer className="h-3 w-3" /> {game.playTime}
                    </span>
                    <span className="flex items-center gap-1">
                      <Zap className="h-3 w-3 text-amber-400" /> +{game.xpReward} XP
                    </span>
                  </div>

                  {game.highScore && (
                    <div className="flex items-center gap-2 mb-4 p-2 rounded-lg bg-muted/50">
                      <Trophy className="h-4 w-4 text-amber-400" />
                      <span className="text-sm text-foreground font-medium">High Score: {game.highScore}</span>
                    </div>
                  )}

                  <Button
                    onClick={() => !game.locked && startGame(game.id)}
                    disabled={game.locked}
                    className={`w-full bg-gradient-to-r ${game.gradient} text-white border-0`}
                  >
                    <Play className="mr-2 h-4 w-4" /> Play Now
                  </Button>
                </div>
              </motion.div>
            );
          })}
        </div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.5 }}
          className="mt-12 p-6 rounded-2xl border border-border bg-gradient-to-r from-primary/5 to-cyan-500/5"
        >
          <div className="flex items-center justify-between">
            <div>
              <h3 className="text-xl font-bold text-foreground mb-2">Daily Challenge</h3>
              <p className="text-muted-foreground">Complete today's challenge for bonus XP!</p>
            </div>
            <div className="text-right">
              <Badge className="bg-gradient-to-r from-amber-500 to-orange-500 text-white mb-2">
                <Flame className="h-3 w-3 mr-1" /> +500 XP
              </Badge>
              <p className="text-sm text-muted-foreground">Ends in 8h 23m</p>
            </div>
          </div>
          <div className="mt-4">
            <div className="flex justify-between text-sm mb-2">
              <span className="text-muted-foreground">Progress</span>
              <span className="text-primary">2/3 Games</span>
            </div>
            <div className="h-3 bg-muted rounded-full overflow-hidden">
              <motion.div
                initial={{ width: 0 }}
                animate={{ width: "66%" }}
                transition={{ duration: 1, ease: "easeOut" }}
                className="h-full bg-gradient-to-r from-emerald-500 to-cyan-500 rounded-full"
              />
            </div>
          </div>
        </motion.div>
      </main>
    </div>
  );
}
