"use client";

import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import {
  Code2, Play, CheckCircle2, XCircle, Clock, Trophy,
  Terminal, Lightbulb, RotateCcw, ChevronRight, Zap,
  Filter, Search, Star, Lock, Flame
} from "lucide-react";
import { Input } from "@/components/ui/input";

interface Challenge {
  id: string;
  title: string;
  difficulty: "easy" | "medium" | "hard";
  category: string;
  xpReward: number;
  completedBy: number;
  isCompleted: boolean;
  isLocked: boolean;
}

export default function PracticePage() {
  const [code, setCode] = useState(`function solution(arr) {\n  // Write your code here\n  \n}`);
  const [output, setOutput] = useState<string>("");
  const [isRunning, setIsRunning] = useState(false);
  const [testResults, setTestResults] = useState<{passed: boolean; input: string; expected: string; got: string}[]>([]);
  const [currentChallenge, setCurrentChallenge] = useState<Challenge | null>(null);
  const [challenges, setChallenges] = useState<Challenge[]>([]);
  const [selectedCategory, setSelectedCategory] = useState("all");
  const [timer, setTimer] = useState(0);
  const [isTimerRunning, setIsTimerRunning] = useState(false);

  const categories = ["all", "arrays", "strings", "math", "algorithms", "data-structures"];

  useEffect(() => {
    fetchChallenges();
  }, []);

  useEffect(() => {
    let interval: NodeJS.Timeout;
    if (isTimerRunning) {
      interval = setInterval(() => {
        setTimer(prev => prev + 1);
      }, 1000);
    }
    return () => clearInterval(interval);
  }, [isTimerRunning]);

  const fetchChallenges = async () => {
    const mockChallenges: Challenge[] = [
      { id: "1", title: "Two Sum", difficulty: "easy", category: "arrays", xpReward: 50, completedBy: 15420, isCompleted: true, isLocked: false },
      { id: "2", title: "Reverse String", difficulty: "easy", category: "strings", xpReward: 50, completedBy: 12890, isCompleted: true, isLocked: false },
      { id: "3", title: "Palindrome Check", difficulty: "easy", category: "strings", xpReward: 50, completedBy: 11230, isCompleted: false, isLocked: false },
      { id: "4", title: "FizzBuzz", difficulty: "easy", category: "math", xpReward: 50, completedBy: 18940, isCompleted: true, isLocked: false },
      { id: "5", title: "Binary Search", difficulty: "medium", category: "algorithms", xpReward: 100, completedBy: 8750, isCompleted: false, isLocked: false },
      { id: "6", title: "Merge Sort", difficulty: "medium", category: "algorithms", xpReward: 100, completedBy: 6420, isCompleted: false, isLocked: false },
      { id: "7", title: "Valid Parentheses", difficulty: "medium", category: "data-structures", xpReward: 100, completedBy: 9180, isCompleted: false, isLocked: false },
      { id: "8", title: "LRU Cache", difficulty: "hard", category: "data-structures", xpReward: 200, completedBy: 3240, isCompleted: false, isLocked: true },
      { id: "9", title: "Graph Traversal", difficulty: "hard", category: "algorithms", xpReward: 200, completedBy: 2890, isCompleted: false, isLocked: true },
    ];
    setChallenges(mockChallenges);
    setCurrentChallenge(mockChallenges[2]);
  };

  const runCode = async () => {
    setIsRunning(true);
    setOutput("Running tests...");
    
    await new Promise(resolve => setTimeout(resolve, 1500));
    
    const mockResults = [
      { passed: true, input: '"racecar"', expected: "true", got: "true" },
      { passed: true, input: '"hello"', expected: "false", got: "false" },
      { passed: false, input: '"A man a plan a canal Panama"', expected: "true", got: "false" },
    ];
    
    setTestResults(mockResults);
    const passedCount = mockResults.filter(r => r.passed).length;
    setOutput(`${passedCount}/${mockResults.length} tests passed`);
    setIsRunning(false);
  };

  const submitSolution = async () => {
    setIsRunning(true);
    await new Promise(resolve => setTimeout(resolve, 2000));
    setIsTimerRunning(false);
    setIsRunning(false);
  };

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins.toString().padStart(2, "0")}:${secs.toString().padStart(2, "0")}`;
  };

  const getDifficultyColor = (difficulty: string) => {
    switch (difficulty) {
      case "easy": return "text-emerald-500 bg-emerald-500/10";
      case "medium": return "text-amber-500 bg-amber-500/10";
      case "hard": return "text-red-500 bg-red-500/10";
      default: return "text-muted-foreground bg-muted";
    }
  };

  const filteredChallenges = challenges.filter(c => 
    selectedCategory === "all" || c.category === selectedCategory
  );

  return (
    <div className="min-h-screen bg-background">
      <div className="grid lg:grid-cols-3 h-screen">
        {/* Challenges Sidebar */}
        <motion.div
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          className="lg:col-span-1 border-r border-border bg-card/50 overflow-hidden flex flex-col"
        >
          <div className="p-4 border-b border-border">
            <h1 className="text-2xl font-bold bg-gradient-to-r from-cyan-400 to-blue-400 bg-clip-text text-transparent flex items-center gap-2">
              <Code2 className="w-6 h-6 text-cyan-500" />
              Practice
            </h1>
            <div className="mt-3 relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
              <Input placeholder="Search challenges..." className="pl-10" />
            </div>
          </div>
          
          {/* Categories */}
          <div className="p-4 border-b border-border">
            <div className="flex flex-wrap gap-2">
              {categories.map((cat) => (
                <button
                  key={cat}
                  onClick={() => setSelectedCategory(cat)}
                  className={`px-3 py-1 rounded-full text-xs font-medium transition-all ${
                    selectedCategory === cat
                      ? "bg-primary text-primary-foreground"
                      : "bg-muted hover:bg-muted/80"
                  }`}
                >
                  {cat}
                </button>
              ))}
            </div>
          </div>
          
          {/* Challenges List */}
          <div className="flex-1 overflow-y-auto p-4 space-y-2">
            {filteredChallenges.map((challenge, index) => (
              <motion.button
                key={challenge.id}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.05 }}
                onClick={() => !challenge.isLocked && setCurrentChallenge(challenge)}
                disabled={challenge.isLocked}
                className={`w-full p-3 rounded-lg text-left transition-all ${
                  currentChallenge?.id === challenge.id
                    ? "bg-primary/20 border border-primary"
                    : challenge.isLocked
                      ? "bg-muted/30 opacity-50 cursor-not-allowed"
                      : "bg-muted/50 hover:bg-muted/80 border border-transparent"
                }`}
              >
                <div className="flex items-start justify-between">
                  <div className="flex items-center gap-2">
                    {challenge.isCompleted ? (
                      <CheckCircle2 className="w-4 h-4 text-emerald-500" />
                    ) : challenge.isLocked ? (
                      <Lock className="w-4 h-4 text-muted-foreground" />
                    ) : (
                      <Circle className="w-4 h-4 text-muted-foreground" />
                    )}
                    <span className="font-medium">{challenge.title}</span>
                  </div>
                  <span className={`px-2 py-0.5 rounded text-xs ${getDifficultyColor(challenge.difficulty)}`}>
                    {challenge.difficulty}
                  </span>
                </div>
                <div className="flex items-center gap-3 mt-2 text-xs text-muted-foreground">
                  <span className="flex items-center gap-1">
                    <Zap className="w-3 h-3" />
                    {challenge.xpReward} XP
                  </span>
                  <span className="flex items-center gap-1">
                    <Trophy className="w-3 h-3" />
                    {challenge.completedBy.toLocaleString()}
                  </span>
                </div>
              </motion.button>
            ))}
          </div>
        </motion.div>

        {/* Code Editor */}
        <div className="lg:col-span-2 flex flex-col overflow-hidden">
          {/* Challenge Header */}
          <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            className="p-4 border-b border-border bg-card/50"
          >
            <div className="flex items-center justify-between">
              <div>
                <h2 className="text-xl font-bold">{currentChallenge?.title || "Select a Challenge"}</h2>
                <div className="flex items-center gap-3 mt-1">
                  {currentChallenge && (
                    <>
                      <span className={`px-2 py-0.5 rounded text-xs ${getDifficultyColor(currentChallenge.difficulty)}`}>
                        {currentChallenge.difficulty}
                      </span>
                      <span className="text-sm text-muted-foreground">{currentChallenge.category}</span>
                      <span className="text-sm text-amber-500 flex items-center gap-1">
                        <Zap className="w-3 h-3" />
                        {currentChallenge.xpReward} XP
                      </span>
                    </>
                  )}
                </div>
              </div>
              <div className="flex items-center gap-3">
                <div className="flex items-center gap-2 px-3 py-1 bg-muted rounded-lg">
                  <Clock className="w-4 h-4" />
                  <span className="font-mono">{formatTime(timer)}</span>
                </div>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => setIsTimerRunning(!isTimerRunning)}
                >
                  {isTimerRunning ? "Pause" : "Start"} Timer
                </Button>
              </div>
            </div>
          </motion.div>

          {/* Problem Description */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="p-4 border-b border-border bg-muted/30 max-h-32 overflow-y-auto"
          >
            <p className="text-sm text-muted-foreground">
              Given a string, determine if it is a palindrome. A palindrome is a word, phrase, number, 
              or other sequence that reads the same forward and backward (ignoring spaces, punctuation, and capitalization).
            </p>
            <div className="mt-3 p-3 bg-background rounded-lg">
              <p className="text-xs text-muted-foreground mb-1">Example:</p>
              <code className="text-sm">Input: &quot;racecar&quot; → Output: true</code>
            </div>
          </motion.div>

          {/* Code Editor Area */}
          <div className="flex-1 flex flex-col overflow-hidden">
            <div className="flex items-center justify-between px-4 py-2 border-b border-border bg-card/30">
              <div className="flex items-center gap-2">
                <Terminal className="w-4 h-4 text-primary" />
                <span className="text-sm font-medium">JavaScript</span>
              </div>
              <div className="flex items-center gap-2">
                <Button variant="ghost" size="sm" onClick={() => setCode(`function solution(arr) {\n  // Write your code here\n  \n}`)}>
                  <RotateCcw className="w-4 h-4 mr-1" />
                  Reset
                </Button>
                <Button variant="ghost" size="sm">
                  <Lightbulb className="w-4 h-4 mr-1" />
                  Hint
                </Button>
              </div>
            </div>
            
            <div className="flex-1 p-4 bg-[#1e1e1e] overflow-auto">
              <textarea
                value={code}
                onChange={(e) => setCode(e.target.value)}
                className="w-full h-full bg-transparent text-emerald-400 font-mono text-sm resize-none outline-none"
                spellCheck={false}
              />
            </div>
          </div>

          {/* Output & Test Results */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="border-t border-border bg-card/50"
          >
            <div className="p-3 border-b border-border flex items-center justify-between">
              <span className="text-sm font-medium">Test Results</span>
              <span className={`text-sm ${testResults.filter(r => r.passed).length === testResults.length && testResults.length > 0 ? "text-emerald-500" : "text-muted-foreground"}`}>
                {output}
              </span>
            </div>
            <div className="p-4 max-h-40 overflow-y-auto space-y-2">
              {testResults.map((result, index) => (
                <div
                  key={index}
                  className={`p-2 rounded-lg text-sm ${
                    result.passed ? "bg-emerald-500/10 border border-emerald-500/20" : "bg-red-500/10 border border-red-500/20"
                  }`}
                >
                  <div className="flex items-center gap-2">
                    {result.passed ? (
                      <CheckCircle2 className="w-4 h-4 text-emerald-500" />
                    ) : (
                      <XCircle className="w-4 h-4 text-red-500" />
                    )}
                    <span className="font-medium">Test {index + 1}</span>
                  </div>
                  <div className="mt-1 text-xs text-muted-foreground font-mono">
                    <div>Input: {result.input}</div>
                    <div>Expected: {result.expected}</div>
                    {!result.passed && <div className="text-red-400">Got: {result.got}</div>}
                  </div>
                </div>
              ))}
            </div>
            <div className="p-4 border-t border-border flex items-center justify-end gap-3">
              <Button variant="outline" onClick={runCode} disabled={isRunning}>
                <Play className="w-4 h-4 mr-2" />
                Run Tests
              </Button>
              <Button 
                className="bg-gradient-to-r from-emerald-500 to-cyan-500 hover:from-emerald-600 hover:to-cyan-600"
                onClick={submitSolution}
                disabled={isRunning}
              >
                {isRunning ? "Submitting..." : "Submit Solution"}
                <ChevronRight className="w-4 h-4 ml-2" />
              </Button>
            </div>
          </motion.div>
        </div>
      </div>
    </div>
  );
}

function Circle({ className }: { className?: string }) {
  return (
    <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
      <circle cx="12" cy="12" r="10" />
    </svg>
  );
}
