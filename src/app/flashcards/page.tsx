"use client";

import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
  Layers, Plus, ArrowLeft, RotateCcw, ChevronLeft, ChevronRight,
  Sparkles, Brain, Check, X, Clock, Shuffle, BookOpen, Edit3, Trash2,
} from "lucide-react";
import Link from "next/link";
import { createClient } from "@/lib/supabase/client";

interface Flashcard {
  id: string;
  front_text: string;
  back_text: string;
  difficulty: string;
  times_reviewed: number;
  times_correct: number;
}

interface Deck {
  id: string;
  title: string;
  description: string;
  subject: string;
  card_count: number;
}

export default function FlashcardsPage() {
  const [decks, setDecks] = useState<Deck[]>([]);
  const [selectedDeck, setSelectedDeck] = useState<Deck | null>(null);
  const [cards, setCards] = useState<Flashcard[]>([]);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isFlipped, setIsFlipped] = useState(false);
  const [studyMode, setStudyMode] = useState(false);
  const [showNewDeck, setShowNewDeck] = useState(false);
  const [showNewCard, setShowNewCard] = useState(false);
  const [newDeck, setNewDeck] = useState({ title: "", description: "", subject: "" });
  const [newCard, setNewCard] = useState({ front_text: "", back_text: "" });
  const [score, setScore] = useState({ correct: 0, incorrect: 0 });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadDecks();
  }, []);

  async function loadDecks() {
    const supabase = createClient();
    const { data } = await supabase
      .from("flashcard_decks")
      .select("*")
      .order("created_at", { ascending: false });
    
    if (data) setDecks(data);
    
    if (!data || data.length === 0) {
      setDecks([
        { id: "1", title: "JavaScript Basics", description: "Core JS concepts", subject: "JavaScript", card_count: 10 },
        { id: "2", title: "React Hooks", description: "useState, useEffect & more", subject: "React", card_count: 8 },
        { id: "3", title: "CSS Flexbox", description: "Flexbox layout mastery", subject: "CSS", card_count: 6 },
      ]);
    }
    setLoading(false);
  }

  async function loadCards(deckId: string) {
    const supabase = createClient();
    const { data } = await supabase
      .from("flashcards")
      .select("*")
      .eq("deck_id", deckId)
      .order("order_index");
    
    if (data && data.length > 0) {
      setCards(data);
    } else {
      setCards([
        { id: "1", front_text: "What is a closure?", back_text: "A function that has access to variables from its outer scope, even after the outer function has returned.", difficulty: "medium", times_reviewed: 5, times_correct: 3 },
        { id: "2", front_text: "What is hoisting?", back_text: "JavaScript's behavior of moving declarations to the top of their scope during compilation.", difficulty: "medium", times_reviewed: 3, times_correct: 2 },
        { id: "3", front_text: "What does 'this' refer to?", back_text: "The object that is executing the current function. Its value depends on how the function is called.", difficulty: "hard", times_reviewed: 4, times_correct: 1 },
        { id: "4", front_text: "What is the event loop?", back_text: "A mechanism that handles asynchronous callbacks by continuously checking the call stack and callback queue.", difficulty: "hard", times_reviewed: 2, times_correct: 1 },
        { id: "5", front_text: "Difference between let and var?", back_text: "let is block-scoped, var is function-scoped. let doesn't get hoisted the same way.", difficulty: "easy", times_reviewed: 6, times_correct: 5 },
      ]);
    }
  }

  function selectDeck(deck: Deck) {
    setSelectedDeck(deck);
    loadCards(deck.id);
    setCurrentIndex(0);
    setIsFlipped(false);
    setScore({ correct: 0, incorrect: 0 });
  }

  function nextCard() {
    if (currentIndex < cards.length - 1) {
      setCurrentIndex(prev => prev + 1);
      setIsFlipped(false);
    }
  }

  function prevCard() {
    if (currentIndex > 0) {
      setCurrentIndex(prev => prev - 1);
      setIsFlipped(false);
    }
  }

  function markCard(correct: boolean) {
    if (correct) {
      setScore(prev => ({ ...prev, correct: prev.correct + 1 }));
    } else {
      setScore(prev => ({ ...prev, incorrect: prev.incorrect + 1 }));
    }
    nextCard();
  }

  function shuffleCards() {
    setCards(prev => [...prev].sort(() => Math.random() - 0.5));
    setCurrentIndex(0);
    setIsFlipped(false);
  }

  function resetStudy() {
    setCurrentIndex(0);
    setIsFlipped(false);
    setScore({ correct: 0, incorrect: 0 });
  }

  async function createDeck() {
    if (!newDeck.title) return;
    
    const supabase = createClient();
    const { data: { user } } = await supabase.auth.getUser();
    
    const { data, error } = await supabase
      .from("flashcard_decks")
      .insert({
        user_id: user?.id,
        title: newDeck.title,
        description: newDeck.description,
        subject: newDeck.subject,
        card_count: 0,
      })
      .select()
      .single();
    
    if (data) {
      setDecks(prev => [data, ...prev]);
      setShowNewDeck(false);
      setNewDeck({ title: "", description: "", subject: "" });
    }
  }

  async function createCard() {
    if (!newCard.front_text || !newCard.back_text || !selectedDeck) return;
    
    const supabase = createClient();
    const { data, error } = await supabase
      .from("flashcards")
      .insert({
        deck_id: selectedDeck.id,
        front_text: newCard.front_text,
        back_text: newCard.back_text,
      })
      .select()
      .single();
    
    if (data) {
      setCards(prev => [...prev, data]);
      setShowNewCard(false);
      setNewCard({ front_text: "", back_text: "" });
    }
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <motion.div animate={{ rotateY: 360 }} transition={{ duration: 1, repeat: Infinity }}>
          <Layers className="h-12 w-12 text-primary" />
        </motion.div>
      </div>
    );
  }

  const currentCard = cards[currentIndex];
  const progress = cards.length > 0 ? ((currentIndex + 1) / cards.length) * 100 : 0;

  return (
    <div className="min-h-screen bg-background text-foreground">
      <div className="fixed inset-0 pointer-events-none overflow-hidden">
        <div className="absolute top-20 left-10 w-72 h-72 bg-purple-500/5 rounded-full blur-3xl animate-blob" />
        <div className="absolute bottom-20 right-10 w-96 h-96 bg-cyan-500/5 rounded-full blur-3xl animate-blob" style={{ animationDelay: "2s" }} />
      </div>

      <header className="sticky top-0 z-50 border-b border-border bg-background/80 backdrop-blur-xl">
        <div className="mx-auto flex h-16 max-w-7xl items-center justify-between px-6">
          <div className="flex items-center gap-4">
            <Link href={selectedDeck ? "#" : "/dashboard"} onClick={() => selectedDeck && setSelectedDeck(null)}>
              <Button variant="ghost" size="sm">
                <ArrowLeft className="h-4 w-4 mr-2" />
                {selectedDeck ? "Back to Decks" : "Back"}
              </Button>
            </Link>
            <div className="flex items-center gap-2">
              <div className="p-2 rounded-xl bg-gradient-to-br from-purple-500 to-pink-500">
                <Layers className="h-5 w-5 text-white" />
              </div>
              <h1 className="text-xl font-bold">{selectedDeck?.title || "Flashcards"}</h1>
            </div>
          </div>

          {!selectedDeck && (
            <Button onClick={() => setShowNewDeck(true)} className="bg-gradient-to-r from-purple-500 to-pink-500 text-white">
              <Plus className="h-4 w-4 mr-2" />
              New Deck
            </Button>
          )}

          {selectedDeck && (
            <div className="flex items-center gap-2">
              <Button variant="outline" size="sm" onClick={shuffleCards}>
                <Shuffle className="h-4 w-4 mr-2" />
                Shuffle
              </Button>
              <Button variant="outline" size="sm" onClick={resetStudy}>
                <RotateCcw className="h-4 w-4 mr-2" />
                Reset
              </Button>
              <Button onClick={() => setShowNewCard(true)} size="sm">
                <Plus className="h-4 w-4 mr-2" />
                Add Card
              </Button>
            </div>
          )}
        </div>
      </header>

      <main className="mx-auto max-w-5xl px-6 py-8">
        {!selectedDeck ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {decks.map((deck, index) => (
              <motion.div
                key={deck.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.1 }}
                onClick={() => selectDeck(deck)}
                className="group cursor-pointer rounded-2xl bg-card border border-border p-6 transition-all hover:border-primary/30 hover:shadow-lg hover:shadow-primary/5 hover-lift"
              >
                <div className="flex items-start justify-between mb-4">
                  <div className="p-3 rounded-xl bg-gradient-to-br from-purple-500/20 to-pink-500/20">
                    <Layers className="h-6 w-6 text-purple-500" />
                  </div>
                  <Badge className="bg-muted text-muted-foreground border-0">
                    {deck.card_count} cards
                  </Badge>
                </div>
                <h3 className="font-bold text-lg mb-2 group-hover:text-primary transition-colors">{deck.title}</h3>
                <p className="text-sm text-muted-foreground mb-4">{deck.description}</p>
                <Badge className="bg-primary/10 text-primary border-0">{deck.subject}</Badge>
              </motion.div>
            ))}
          </div>
        ) : (
          <div className="max-w-2xl mx-auto">
            <div className="mb-6">
              <div className="flex items-center justify-between mb-2">
                <span className="text-sm text-muted-foreground">
                  Card {currentIndex + 1} of {cards.length}
                </span>
                <div className="flex items-center gap-4 text-sm">
                  <span className="text-green-500">✓ {score.correct}</span>
                  <span className="text-red-500">✗ {score.incorrect}</span>
                </div>
              </div>
              <div className="h-2 bg-muted rounded-full overflow-hidden">
                <motion.div
                  initial={{ width: 0 }}
                  animate={{ width: `${progress}%` }}
                  className="h-full bg-gradient-to-r from-purple-500 to-pink-500 rounded-full"
                />
              </div>
            </div>

            {currentCard && (
              <motion.div
                key={currentCard.id}
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                className="perspective-1000"
              >
                <div
                  onClick={() => setIsFlipped(!isFlipped)}
                  className="relative h-80 cursor-pointer"
                  style={{ transformStyle: "preserve-3d" }}
                >
                  <motion.div
                    animate={{ rotateY: isFlipped ? 180 : 0 }}
                    transition={{ duration: 0.6 }}
                    style={{ transformStyle: "preserve-3d" }}
                    className="absolute inset-0"
                  >
                    <div
                      className="absolute inset-0 rounded-3xl bg-gradient-to-br from-purple-500/10 to-pink-500/10 border border-border p-8 flex flex-col items-center justify-center text-center backface-hidden"
                      style={{ backfaceVisibility: "hidden" }}
                    >
                      <Badge className="mb-4 bg-purple-500/20 text-purple-400 border-0">Front</Badge>
                      <p className="text-2xl font-bold">{currentCard.front_text}</p>
                      <p className="mt-6 text-sm text-muted-foreground">Click to flip</p>
                    </div>

                    <div
                      className="absolute inset-0 rounded-3xl bg-gradient-to-br from-cyan-500/10 to-emerald-500/10 border border-border p-8 flex flex-col items-center justify-center text-center"
                      style={{ backfaceVisibility: "hidden", transform: "rotateY(180deg)" }}
                    >
                      <Badge className="mb-4 bg-cyan-500/20 text-cyan-400 border-0">Back</Badge>
                      <p className="text-lg">{currentCard.back_text}</p>
                      <p className="mt-6 text-sm text-muted-foreground">Click to flip back</p>
                    </div>
                  </motion.div>
                </div>
              </motion.div>
            )}

            <div className="flex items-center justify-center gap-4 mt-8">
              <Button
                variant="outline"
                size="lg"
                onClick={prevCard}
                disabled={currentIndex === 0}
              >
                <ChevronLeft className="h-5 w-5" />
              </Button>

              <Button
                size="lg"
                variant="outline"
                className="border-red-500/30 text-red-500 hover:bg-red-500/10"
                onClick={() => markCard(false)}
              >
                <X className="h-5 w-5 mr-2" />
                Incorrect
              </Button>

              <Button
                size="lg"
                className="bg-gradient-to-r from-green-500 to-emerald-500 text-white"
                onClick={() => markCard(true)}
              >
                <Check className="h-5 w-5 mr-2" />
                Correct
              </Button>

              <Button
                variant="outline"
                size="lg"
                onClick={nextCard}
                disabled={currentIndex === cards.length - 1}
              >
                <ChevronRight className="h-5 w-5" />
              </Button>
            </div>

            {currentIndex === cards.length - 1 && (score.correct + score.incorrect === cards.length) && (
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className="mt-8 p-6 rounded-2xl bg-gradient-to-r from-primary/10 to-cyan-500/10 border border-primary/20 text-center"
              >
                <h3 className="text-2xl font-bold mb-2">Session Complete!</h3>
                <p className="text-muted-foreground mb-4">
                  You got {score.correct} out of {cards.length} correct ({Math.round((score.correct / cards.length) * 100)}%)
                </p>
                <Button onClick={resetStudy}>Study Again</Button>
              </motion.div>
            )}
          </div>
        )}

        <AnimatePresence>
          {showNewDeck && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm p-4"
              onClick={() => setShowNewDeck(false)}
            >
              <motion.div
                initial={{ scale: 0.9 }}
                animate={{ scale: 1 }}
                exit={{ scale: 0.9 }}
                onClick={e => e.stopPropagation()}
                className="bg-card rounded-2xl p-6 max-w-md w-full border border-border"
              >
                <h2 className="text-xl font-bold mb-4">Create New Deck</h2>
                <div className="space-y-4">
                  <div>
                    <label className="text-sm font-medium mb-2 block">Title</label>
                    <input
                      type="text"
                      value={newDeck.title}
                      onChange={e => setNewDeck(prev => ({ ...prev, title: e.target.value }))}
                      className="w-full px-4 py-2 rounded-xl bg-muted border border-border focus:border-primary outline-none"
                      placeholder="e.g., JavaScript Basics"
                    />
                  </div>
                  <div>
                    <label className="text-sm font-medium mb-2 block">Description</label>
                    <input
                      type="text"
                      value={newDeck.description}
                      onChange={e => setNewDeck(prev => ({ ...prev, description: e.target.value }))}
                      className="w-full px-4 py-2 rounded-xl bg-muted border border-border focus:border-primary outline-none"
                      placeholder="Brief description"
                    />
                  </div>
                  <div>
                    <label className="text-sm font-medium mb-2 block">Subject</label>
                    <input
                      type="text"
                      value={newDeck.subject}
                      onChange={e => setNewDeck(prev => ({ ...prev, subject: e.target.value }))}
                      className="w-full px-4 py-2 rounded-xl bg-muted border border-border focus:border-primary outline-none"
                      placeholder="e.g., Programming"
                    />
                  </div>
                </div>
                <div className="flex gap-3 mt-6">
                  <Button variant="outline" className="flex-1" onClick={() => setShowNewDeck(false)}>
                    Cancel
                  </Button>
                  <Button className="flex-1" onClick={createDeck}>
                    Create Deck
                  </Button>
                </div>
              </motion.div>
            </motion.div>
          )}

          {showNewCard && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm p-4"
              onClick={() => setShowNewCard(false)}
            >
              <motion.div
                initial={{ scale: 0.9 }}
                animate={{ scale: 1 }}
                exit={{ scale: 0.9 }}
                onClick={e => e.stopPropagation()}
                className="bg-card rounded-2xl p-6 max-w-md w-full border border-border"
              >
                <h2 className="text-xl font-bold mb-4">Add New Card</h2>
                <div className="space-y-4">
                  <div>
                    <label className="text-sm font-medium mb-2 block">Front (Question)</label>
                    <textarea
                      value={newCard.front_text}
                      onChange={e => setNewCard(prev => ({ ...prev, front_text: e.target.value }))}
                      className="w-full px-4 py-2 rounded-xl bg-muted border border-border focus:border-primary outline-none resize-none h-24"
                      placeholder="Enter your question..."
                    />
                  </div>
                  <div>
                    <label className="text-sm font-medium mb-2 block">Back (Answer)</label>
                    <textarea
                      value={newCard.back_text}
                      onChange={e => setNewCard(prev => ({ ...prev, back_text: e.target.value }))}
                      className="w-full px-4 py-2 rounded-xl bg-muted border border-border focus:border-primary outline-none resize-none h-24"
                      placeholder="Enter your answer..."
                    />
                  </div>
                </div>
                <div className="flex gap-3 mt-6">
                  <Button variant="outline" className="flex-1" onClick={() => setShowNewCard(false)}>
                    Cancel
                  </Button>
                  <Button className="flex-1" onClick={createCard}>
                    Add Card
                  </Button>
                </div>
              </motion.div>
            </motion.div>
          )}
        </AnimatePresence>
      </main>
    </div>
  );
}
