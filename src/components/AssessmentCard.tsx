"use client";

import { useState } from "react";
import { Assessment, AssessmentQuestion } from "@/lib/types";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  FileQuestion,
  Clock,
  ChevronRight,
  Check,
  X,
  Info,
} from "lucide-react";

interface AssessmentCardProps {
  assessment: Assessment;
}

export function AssessmentCard({ assessment }: AssessmentCardProps) {
  const [currentQuestion, setCurrentQuestion] = useState(0);
  const [selectedAnswer, setSelectedAnswer] = useState<string | null>(null);
  const [showExplanation, setShowExplanation] = useState(false);
  const [score, setScore] = useState(0);
  const [answeredQuestions, setAnsweredQuestions] = useState<Set<number>>(
    new Set()
  );

  const question = assessment.questions[currentQuestion];
  const isAnswered = answeredQuestions.has(currentQuestion);
  const isCorrect = selectedAnswer === question?.correctAnswer;

  const handleAnswer = (answer: string) => {
    if (isAnswered) return;
    setSelectedAnswer(answer);
    setShowExplanation(true);
    setAnsweredQuestions((prev) => new Set(prev).add(currentQuestion));
    if (answer === question.correctAnswer) {
      setScore((prev) => prev + 1);
    }
  };

  const nextQuestion = () => {
    if (currentQuestion < assessment.questions.length - 1) {
      setCurrentQuestion((prev) => prev + 1);
      setSelectedAnswer(null);
      setShowExplanation(false);
    }
  };

  const prevQuestion = () => {
    if (currentQuestion > 0) {
      setCurrentQuestion((prev) => prev - 1);
      setSelectedAnswer(null);
      setShowExplanation(false);
    }
  };

  const getOptionClass = (option: string) => {
    if (!isAnswered) {
      return "border-slate-200 hover:border-violet-300 hover:bg-violet-50 cursor-pointer";
    }
    if (option === question.correctAnswer) {
      return "border-emerald-500 bg-emerald-50 text-emerald-900";
    }
    if (option === selectedAnswer && option !== question.correctAnswer) {
      return "border-rose-500 bg-rose-50 text-rose-900";
    }
    return "border-slate-200 opacity-50";
  };

  if (!question) {
    return (
      <Card className="border-slate-200 bg-white">
        <CardContent className="flex items-center justify-center p-8">
          <p className="text-slate-500">No questions available</p>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className="border-slate-200 bg-white shadow-sm">
      <CardHeader className="pb-3">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-gradient-to-br from-cyan-500 to-blue-500">
              <FileQuestion className="h-5 w-5 text-white" />
            </div>
            <div>
              <CardTitle className="text-base font-semibold text-slate-900">
                {assessment.title}
              </CardTitle>
              <p className="text-xs text-slate-500">
                {assessment.description}
              </p>
            </div>
          </div>
          <div className="flex items-center gap-2">
            <Badge variant="outline" className="text-slate-600">
              <Clock className="mr-1 h-3 w-3" />
              {assessment.duration} min
            </Badge>
            <Badge className="bg-violet-100 text-violet-700">
              {score}/{answeredQuestions.size} correct
            </Badge>
          </div>
        </div>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="flex items-center justify-between rounded-lg bg-slate-50 p-3">
          <div className="flex items-center gap-2">
            <span className="flex h-7 w-7 items-center justify-center rounded-full bg-violet-500 text-sm font-bold text-white">
              {currentQuestion + 1}
            </span>
            <span className="text-sm text-slate-600">
              of {assessment.questions.length} questions
            </span>
          </div>
          <div className="flex gap-1">
            {assessment.questions.map((_, idx) => (
              <button
                key={idx}
                onClick={() => {
                  setCurrentQuestion(idx);
                  setSelectedAnswer(null);
                  setShowExplanation(false);
                }}
                className={`h-2 w-6 rounded-full transition-colors ${
                  idx === currentQuestion
                    ? "bg-violet-500"
                    : answeredQuestions.has(idx)
                    ? "bg-emerald-400"
                    : "bg-slate-300"
                }`}
              />
            ))}
          </div>
        </div>

        <div className="rounded-xl border border-slate-200 p-4">
          <div className="mb-3 flex items-center gap-2">
            <Badge variant="outline" className="text-xs">
              {question.topic}
            </Badge>
            <Badge
              variant="secondary"
              className={
                question.difficulty === "beginner"
                  ? "bg-emerald-100 text-emerald-700"
                  : question.difficulty === "intermediate"
                  ? "bg-amber-100 text-amber-700"
                  : "bg-rose-100 text-rose-700"
              }
            >
              {question.difficulty}
            </Badge>
          </div>
          <p className="text-base font-medium text-slate-900">
            {question.question}
          </p>
        </div>

        {question.options && (
          <div className="space-y-2">
            {question.options.map((option, idx) => (
              <button
                key={idx}
                onClick={() => handleAnswer(option)}
                disabled={isAnswered}
                className={`flex w-full items-center justify-between rounded-lg border p-3 text-left transition-all ${getOptionClass(
                  option
                )}`}
              >
                <span className="flex items-center gap-3">
                  <span className="flex h-6 w-6 items-center justify-center rounded-full border text-xs font-medium">
                    {String.fromCharCode(65 + idx)}
                  </span>
                  <span className="text-sm">{option}</span>
                </span>
                {isAnswered && option === question.correctAnswer && (
                  <Check className="h-5 w-5 text-emerald-500" />
                )}
                {isAnswered &&
                  option === selectedAnswer &&
                  option !== question.correctAnswer && (
                    <X className="h-5 w-5 text-rose-500" />
                  )}
              </button>
            ))}
          </div>
        )}

        {showExplanation && (
          <div className="space-y-3">
            <div
              className={`rounded-lg p-4 ${
                isCorrect
                  ? "border border-emerald-200 bg-emerald-50"
                  : "border border-rose-200 bg-rose-50"
              }`}
            >
              <div className="mb-2 flex items-center gap-2">
                {isCorrect ? (
                  <Check className="h-5 w-5 text-emerald-600" />
                ) : (
                  <X className="h-5 w-5 text-rose-600" />
                )}
                <span
                  className={`font-semibold ${
                    isCorrect ? "text-emerald-700" : "text-rose-700"
                  }`}
                >
                  {isCorrect ? "Correct!" : "Incorrect"}
                </span>
              </div>
              <p
                className={`text-sm ${
                  isCorrect ? "text-emerald-800" : "text-rose-800"
                }`}
              >
                {question.explanation}
              </p>
            </div>

            <div className="rounded-lg border border-blue-200 bg-blue-50 p-4">
              <div className="mb-2 flex items-center gap-2">
                <Info className="h-4 w-4 text-blue-600" />
                <span className="text-xs font-semibold uppercase tracking-wider text-blue-700">
                  Error Pattern Insight
                </span>
              </div>
              <p className="text-sm text-blue-800">
                {question.errorPatternInsight}
              </p>
            </div>
          </div>
        )}

        <div className="flex items-center justify-between pt-2">
          <Button
            variant="outline"
            onClick={prevQuestion}
            disabled={currentQuestion === 0}
            className="gap-1"
          >
            Previous
          </Button>
          <Button
            onClick={nextQuestion}
            disabled={currentQuestion === assessment.questions.length - 1}
            className="gap-1 bg-violet-600 hover:bg-violet-700"
          >
            Next
            <ChevronRight className="h-4 w-4" />
          </Button>
        </div>
      </CardContent>
    </Card>
  );
}
