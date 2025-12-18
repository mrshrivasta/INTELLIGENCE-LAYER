"use client";

import { useState, useEffect, useCallback } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import {
  Brain, Clock, Trophy, Star, Zap, CheckCircle2, XCircle,
  ArrowRight, RotateCcw, Play, Pause, Target, Award, Flame
} from "lucide-react";

interface Question {
  id: string;
  question: string;
  options: string[];
  correctAnswer: number;
  explanation: string;
}

interface Quiz {
  id: string;
  title: string;
  description: string;
  subject: string;
  difficulty: "easy" | "medium" | "hard";
  questionCount: number;
  timeLimit: number;
  xpReward: number;
  passingScore: number;
  attempts: number;
  bestScore: number | null;
}

export default function QuizzesPage() {
  const [quizzes, setQuizzes] = useState<Quiz[]>([]);
  const [selectedQuiz, setSelectedQuiz] = useState<Quiz | null>(null);
  const [currentQuestion, setCurrentQuestion] = useState(0);
  const [questions, setQuestions] = useState<Question[]>([]);
  const [selectedAnswer, setSelectedAnswer] = useState<number | null>(null);
  const [showResult, setShowResult] = useState(false);
  const [score, setScore] = useState(0);
  const [timeLeft, setTimeLeft] = useState(0);
  const [isQuizStarted, setIsQuizStarted] = useState(false);
  const [answers, setAnswers] = useState<{questionId: string; selected: number; correct: boolean}[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [showExplanation, setShowExplanation] = useState(false);

  useEffect(() => {
    fetchQuizzes();
  }, []);

  const endQuiz = useCallback(() => {
    setIsQuizStarted(false);
    setShowResult(true);
  }, []);

  useEffect(() => {
    let timer: NodeJS.Timeout;
    if (isQuizStarted && timeLeft > 0) {
      timer = setInterval(() => {
        setTimeLeft(prev => {
          if (prev <= 1) {
            endQuiz();
            return 0;
          }
          return prev - 1;
        });
      }, 1000);
    }
    return () => clearInterval(timer);
  }, [isQuizStarted, timeLeft, endQuiz]);

  const fetchQuizzes = async () => {
    setIsLoading(true);
    await new Promise(resolve => setTimeout(resolve, 500));
    
    const mockQuizzes: Quiz[] = [
      { id: "1", title: "JavaScript Fundamentals", description: "Test your knowledge of JavaScript basics", subject: "JavaScript", difficulty: "easy", questionCount: 10, timeLimit: 10, xpReward: 100, passingScore: 70, attempts: 3, bestScore: 80 },
      { id: "2", title: "React Hooks Deep Dive", description: "Advanced React hooks concepts", subject: "React", difficulty: "medium", questionCount: 15, timeLimit: 15, xpReward: 150, passingScore: 70, attempts: 2, bestScore: null },
      { id: "3", title: "Data Structures", description: "Arrays, linked lists, trees, and more", subject: "Computer Science", difficulty: "hard", questionCount: 20, timeLimit: 25, xpReward: 250, passingScore: 75, attempts: 1, bestScore: 65 },
      { id: "4", title: "CSS Flexbox & Grid", description: "Modern CSS layout techniques", subject: "CSS", difficulty: "easy", questionCount: 10, timeLimit: 8, xpReward: 80, passingScore: 70, attempts: 0, bestScore: null },
      { id: "5", title: "Node.js Essentials", description: "Server-side JavaScript concepts", subject: "Node.js", difficulty: "medium", questionCount: 12, timeLimit: 12, xpReward: 120, passingScore: 70, attempts: 5, bestScore: 92 },
    ];
    
    setQuizzes(mockQuizzes);
    setIsLoading(false);
  };

  const startQuiz = (quiz: Quiz) => {
    setSelectedQuiz(quiz);
    setTimeLeft(quiz.timeLimit * 60);
    setCurrentQuestion(0);
    setScore(0);
    setAnswers([]);
    setShowResult(false);
    
    const mockQuestions: Question[] = [
      { id: "1", question: "What is the output of typeof null in JavaScript?", options: ["null", "undefined", "object", "string"], correctAnswer: 2, explanation: "This is a known bug in JavaScript. typeof null returns 'object' due to how null was implemented in the original version." },
      { id: "2", question: "Which method is used to add elements to the end of an array?", options: ["push()", "pop()", "shift()", "unshift()"], correctAnswer: 0, explanation: "push() adds one or more elements to the end of an array and returns the new length." },
      { id: "3", question: "What does the '===' operator check?", options: ["Value only", "Type only", "Value and type", "Reference"], correctAnswer: 2, explanation: "The strict equality operator (===) checks both value and type without type coercion." },
      { id: "4", question: "Which is NOT a JavaScript data type?", options: ["Symbol", "BigInt", "Float", "Boolean"], correctAnswer: 2, explanation: "Float is not a JavaScript data type. JavaScript uses Number for all numeric values." },
      { id: "5", question: "What is closure in JavaScript?", options: ["A bug", "A function with access to outer scope", "A loop type", "An error"], correctAnswer: 1, explanation: "A closure is a function that has access to variables from its outer (enclosing) scope, even after the outer function has returned." },
    ];
    
    setQuestions(mockQuestions);
    setIsQuizStarted(true);
  };

  const handleAnswer = (answerIndex: number) => {
    if (selectedAnswer !== null) return;
    
    setSelectedAnswer(answerIndex);
    const isCorrect = answerIndex === questions[currentQuestion].correctAnswer;
    
    if (isCorrect) {
      setScore(prev => prev + 1);
    }
    
    setAnswers(prev => [...prev, {
      questionId: questions[currentQuestion].id,
      selected: answerIndex,
      correct: isCorrect
    }]);
    
    setShowExplanation(true);
  };

  const nextQuestion = () => {
    setSelectedAnswer(null);
    setShowExplanation(false);
    
    if (currentQuestion < questions.length - 1) {
      setCurrentQuestion(prev => prev + 1);
    } else {
      endQuiz();
    }
  };

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs.toString().padStart(2, "0")}`;
  };

  const getDifficultyColor = (difficulty: string) => {
    switch (difficulty) {
      case "easy": return "text-emerald-500 bg-emerald-500/10";
      case "medium": return "text-amber-500 bg-amber-500/10";
      case "hard": return "text-red-500 bg-red-500/10";
      default: return "text-muted-foreground bg-muted";
    }
  };

  const scorePercentage = questions.length > 0 ? Math.round((score / questions.length) * 100) : 0;
  const passed = selectedQuiz ? scorePercentage >= selectedQuiz.passingScore : false;

  return (
    <div className="min-h-screen bg-background p-6">
      <div className="max-w-4xl mx-auto">
        {!isQuizStarted && !showResult && (
          <>
            {/* Header */}
            <motion.div
              initial={{ opacity: 0, y: -20 }}
              animate={{ opacity: 1, y: 0 }}
              className="text-center mb-8"
            >
              <h1 className="text-4xl font-bold bg-gradient-to-r from-purple-400 via-pink-400 to-red-400 bg-clip-text text-transparent flex items-center justify-center gap-3">
                <Brain className="w-10 h-10 text-purple-500" />
                Quizzes
              </h1>
              <p className="text-muted-foreground mt-2">Test your knowledge and earn XP</p>
            </motion.div>

            {/* Quiz List */}
            <div className="space-y-4">
              {isLoading ? (
                [1, 2, 3].map((i) => (
                  <Card key={i} className="p-6 bg-card/50 animate-pulse">
                    <div className="h-6 bg-muted rounded w-1/2 mb-2" />
                    <div className="h-4 bg-muted rounded w-3/4" />
                  </Card>
                ))
              ) : (
                quizzes.map((quiz, index) => (
                  <motion.div
                    key={quiz.id}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: index * 0.1 }}
                  >
                    <Card className="p-6 bg-card/50 backdrop-blur border-border hover:border-primary/50 transition-all">
                      <div className="flex items-start justify-between">
                        <div className="flex-1">
                          <div className="flex items-center gap-2 mb-2">
                            <h3 className="text-xl font-semibold">{quiz.title}</h3>
                            <span className={`px-2 py-0.5 rounded text-xs font-medium ${getDifficultyColor(quiz.difficulty)}`}>
                              {quiz.difficulty}
                            </span>
                          </div>
                          <p className="text-sm text-muted-foreground mb-4">{quiz.description}</p>
                          <div className="flex items-center gap-4 text-sm text-muted-foreground">
                            <span className="flex items-center gap-1">
                              <Target className="w-4 h-4" />
                              {quiz.questionCount} questions
                            </span>
                            <span className="flex items-center gap-1">
                              <Clock className="w-4 h-4" />
                              {quiz.timeLimit} min
                            </span>
                            <span className="flex items-center gap-1 text-amber-500">
                              <Zap className="w-4 h-4" />
                              {quiz.xpReward} XP
                            </span>
                            {quiz.bestScore !== null && (
                              <span className="flex items-center gap-1 text-emerald-500">
                                <Trophy className="w-4 h-4" />
                                Best: {quiz.bestScore}%
                              </span>
                            )}
                          </div>
                        </div>
                        <Button
                          onClick={() => startQuiz(quiz)}
                          className="gap-2 bg-gradient-to-r from-purple-500 to-pink-500 hover:from-purple-600 hover:to-pink-600"
                        >
                          <Play className="w-4 h-4" />
                          Start
                        </Button>
                      </div>
                    </Card>
                  </motion.div>
                ))
              )}
            </div>
          </>
        )}

        {/* Quiz In Progress */}
        {isQuizStarted && !showResult && questions.length > 0 && (
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            className="space-y-6"
          >
            {/* Quiz Header */}
            <Card className="p-4 bg-card/50 backdrop-blur">
              <div className="flex items-center justify-between">
                <div>
                  <h2 className="font-semibold">{selectedQuiz?.title}</h2>
                  <p className="text-sm text-muted-foreground">
                    Question {currentQuestion + 1} of {questions.length}
                  </p>
                </div>
                <div className="flex items-center gap-4">
                  <div className="flex items-center gap-2 text-emerald-500">
                    <CheckCircle2 className="w-5 h-5" />
                    <span className="font-semibold">{score}</span>
                  </div>
                  <div className={`flex items-center gap-2 px-3 py-1 rounded-lg ${
                    timeLeft < 60 ? "bg-red-500/20 text-red-500" : "bg-muted"
                  }`}>
                    <Clock className="w-4 h-4" />
                    <span className="font-mono font-semibold">{formatTime(timeLeft)}</span>
                  </div>
                </div>
              </div>
              <Progress value={((currentQuestion + 1) / questions.length) * 100} className="mt-4" />
            </Card>

            {/* Question */}
            <Card className="p-6 bg-card/50 backdrop-blur">
              <h3 className="text-xl font-semibold mb-6">{questions[currentQuestion].question}</h3>
              <div className="space-y-3">
                {questions[currentQuestion].options.map((option, index) => {
                  const isSelected = selectedAnswer === index;
                  const isCorrect = index === questions[currentQuestion].correctAnswer;
                  const showCorrectness = selectedAnswer !== null;
                  
                  return (
                    <motion.button
                      key={index}
                      whileHover={{ scale: selectedAnswer === null ? 1.01 : 1 }}
                      whileTap={{ scale: selectedAnswer === null ? 0.99 : 1 }}
                      onClick={() => handleAnswer(index)}
                      disabled={selectedAnswer !== null}
                      className={`w-full p-4 rounded-lg border text-left transition-all ${
                        showCorrectness
                          ? isCorrect
                            ? "border-emerald-500 bg-emerald-500/10"
                            : isSelected
                              ? "border-red-500 bg-red-500/10"
                              : "border-border bg-muted/30"
                          : isSelected
                            ? "border-primary bg-primary/10"
                            : "border-border bg-muted/30 hover:border-primary/50"
                      }`}
                    >
                      <div className="flex items-center gap-3">
                        <span className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-medium ${
                          showCorrectness
                            ? isCorrect
                              ? "bg-emerald-500 text-white"
                              : isSelected
                                ? "bg-red-500 text-white"
                                : "bg-muted"
                            : "bg-muted"
                        }`}>
                          {showCorrectness ? (
                            isCorrect ? <CheckCircle2 className="w-4 h-4" /> : isSelected ? <XCircle className="w-4 h-4" /> : String.fromCharCode(65 + index)
                          ) : (
                            String.fromCharCode(65 + index)
                          )}
                        </span>
                        <span className="flex-1">{option}</span>
                      </div>
                    </motion.button>
                  );
                })}
              </div>

              {/* Explanation */}
              <AnimatePresence>
                {showExplanation && (
                  <motion.div
                    initial={{ opacity: 0, height: 0 }}
                    animate={{ opacity: 1, height: "auto" }}
                    exit={{ opacity: 0, height: 0 }}
                    className="mt-6 p-4 bg-primary/5 rounded-lg border border-primary/20"
                  >
                    <h4 className="font-semibold mb-2 flex items-center gap-2">
                      <Brain className="w-4 h-4 text-primary" />
                      Explanation
                    </h4>
                    <p className="text-sm text-muted-foreground">
                      {questions[currentQuestion].explanation}
                    </p>
                  </motion.div>
                )}
              </AnimatePresence>

              {/* Next Button */}
              {selectedAnswer !== null && (
                <motion.div
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="mt-6 flex justify-end"
                >
                  <Button onClick={nextQuestion} className="gap-2">
                    {currentQuestion < questions.length - 1 ? "Next Question" : "Finish Quiz"}
                    <ArrowRight className="w-4 h-4" />
                  </Button>
                </motion.div>
              )}
            </Card>
          </motion.div>
        )}

        {/* Results */}
        {showResult && (
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            className="text-center"
          >
            <Card className="p-8 bg-card/50 backdrop-blur">
              <div className={`w-24 h-24 mx-auto rounded-full flex items-center justify-center mb-6 ${
                passed ? "bg-emerald-500/20" : "bg-red-500/20"
              }`}>
                {passed ? (
                  <Trophy className="w-12 h-12 text-emerald-500" />
                ) : (
                  <XCircle className="w-12 h-12 text-red-500" />
                )}
              </div>
              
              <h2 className="text-3xl font-bold mb-2">
                {passed ? "Congratulations!" : "Keep Practicing!"}
              </h2>
              <p className="text-muted-foreground mb-6">
                {passed 
                  ? "You passed the quiz! Great job!" 
                  : `You need ${selectedQuiz?.passingScore}% to pass. Try again!`}
              </p>

              <div className="text-6xl font-bold mb-2 bg-gradient-to-r from-purple-400 to-pink-400 bg-clip-text text-transparent">
                {scorePercentage}%
              </div>
              <p className="text-muted-foreground mb-8">
                {score} out of {questions.length} correct
              </p>

              <div className="grid grid-cols-3 gap-4 mb-8">
                <div className="p-4 bg-muted/50 rounded-lg">
                  <Zap className="w-6 h-6 mx-auto mb-2 text-amber-500" />
                  <p className="text-2xl font-bold">{passed ? selectedQuiz?.xpReward : 0}</p>
                  <p className="text-xs text-muted-foreground">XP Earned</p>
                </div>
                <div className="p-4 bg-muted/50 rounded-lg">
                  <Clock className="w-6 h-6 mx-auto mb-2 text-blue-500" />
                  <p className="text-2xl font-bold">{formatTime((selectedQuiz?.timeLimit || 0) * 60 - timeLeft)}</p>
                  <p className="text-xs text-muted-foreground">Time Taken</p>
                </div>
                <div className="p-4 bg-muted/50 rounded-lg">
                  <Flame className="w-6 h-6 mx-auto mb-2 text-orange-500" />
                  <p className="text-2xl font-bold">{answers.filter((a, i) => i < 3 && a.correct).length}</p>
                  <p className="text-xs text-muted-foreground">Streak</p>
                </div>
              </div>

              <div className="flex gap-4 justify-center">
                <Button
                  variant="outline"
                  onClick={() => {
                    setShowResult(false);
                    setSelectedQuiz(null);
                  }}
                  className="gap-2"
                >
                  Back to Quizzes
                </Button>
                <Button
                  onClick={() => selectedQuiz && startQuiz(selectedQuiz)}
                  className="gap-2 bg-gradient-to-r from-purple-500 to-pink-500"
                >
                  <RotateCcw className="w-4 h-4" />
                  Try Again
                </Button>
              </div>
            </Card>
          </motion.div>
        )}
      </div>
    </div>
  );
}
