"use client";

import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
  FileText, Plus, ArrowLeft, Search, Star, StarOff, Trash2, Edit3,
  Tag, Clock, Sparkles, Grid, List, SortAsc, Filter,
} from "lucide-react";
import Link from "next/link";
import { createClient } from "@/lib/supabase/client";

interface Note {
  id: string;
  title: string;
  content: string;
  subject: string;
  tags: string[];
  is_favorite: boolean;
  created_at: string;
  updated_at: string;
}

export default function NotesPage() {
  const [notes, setNotes] = useState<Note[]>([]);
  const [selectedNote, setSelectedNote] = useState<Note | null>(null);
  const [showNewNote, setShowNewNote] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [viewMode, setViewMode] = useState<"grid" | "list">("grid");
  const [filterSubject, setFilterSubject] = useState("");
  const [newNote, setNewNote] = useState({ title: "", content: "", subject: "", tags: "" });
  const [editMode, setEditMode] = useState(false);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadNotes();
  }, []);

  async function loadNotes() {
    const supabase = createClient();
    const { data: { user } } = await supabase.auth.getUser();
    
    if (user) {
      const { data } = await supabase
        .from("notes")
        .select("*")
        .eq("user_id", user.id)
        .order("updated_at", { ascending: false });
      
      if (data) setNotes(data);
    }

    if (notes.length === 0) {
      setNotes([
        { id: "1", title: "JavaScript Closures", content: "A closure is a function that retains access to its lexical scope...", subject: "JavaScript", tags: ["functions", "scope"], is_favorite: true, created_at: new Date().toISOString(), updated_at: new Date().toISOString() },
        { id: "2", title: "React Hooks Overview", content: "useState, useEffect, useContext are the most common hooks...", subject: "React", tags: ["hooks", "state"], is_favorite: false, created_at: new Date().toISOString(), updated_at: new Date().toISOString() },
        { id: "3", title: "CSS Flexbox Guide", content: "Flexbox is a one-dimensional layout method...", subject: "CSS", tags: ["layout", "flexbox"], is_favorite: true, created_at: new Date().toISOString(), updated_at: new Date().toISOString() },
      ]);
    }

    setLoading(false);
  }

  async function createNote() {
    if (!newNote.title || !newNote.content) return;
    
    const supabase = createClient();
    const { data: { user } } = await supabase.auth.getUser();
    
    if (user) {
      const { data, error } = await supabase
        .from("notes")
        .insert({
          user_id: user.id,
          title: newNote.title,
          content: newNote.content,
          subject: newNote.subject,
          tags: newNote.tags.split(",").map(t => t.trim()).filter(Boolean),
        })
        .select()
        .single();
      
      if (data) {
        setNotes(prev => [data, ...prev]);
      }
    } else {
      const note: Note = {
        id: Date.now().toString(),
        title: newNote.title,
        content: newNote.content,
        subject: newNote.subject,
        tags: newNote.tags.split(",").map(t => t.trim()).filter(Boolean),
        is_favorite: false,
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString(),
      };
      setNotes(prev => [note, ...prev]);
    }
    
    setShowNewNote(false);
    setNewNote({ title: "", content: "", subject: "", tags: "" });
  }

  async function toggleFavorite(note: Note) {
    const supabase = createClient();
    await supabase
      .from("notes")
      .update({ is_favorite: !note.is_favorite })
      .eq("id", note.id);
    
    setNotes(prev => prev.map(n => 
      n.id === note.id ? { ...n, is_favorite: !n.is_favorite } : n
    ));
    
    if (selectedNote?.id === note.id) {
      setSelectedNote(prev => prev ? { ...prev, is_favorite: !prev.is_favorite } : null);
    }
  }

  async function deleteNote(noteId: string) {
    const supabase = createClient();
    await supabase.from("notes").delete().eq("id", noteId);
    setNotes(prev => prev.filter(n => n.id !== noteId));
    if (selectedNote?.id === noteId) setSelectedNote(null);
  }

  async function updateNote() {
    if (!selectedNote) return;
    
    const supabase = createClient();
    await supabase
      .from("notes")
      .update({
        title: selectedNote.title,
        content: selectedNote.content,
        subject: selectedNote.subject,
        updated_at: new Date().toISOString(),
      })
      .eq("id", selectedNote.id);
    
    setNotes(prev => prev.map(n => 
      n.id === selectedNote.id ? selectedNote : n
    ));
    setEditMode(false);
  }

  const filteredNotes = notes.filter(note => {
    const matchesSearch = note.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         note.content.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesSubject = !filterSubject || note.subject === filterSubject;
    return matchesSearch && matchesSubject;
  });

  const subjects = [...new Set(notes.map(n => n.subject).filter(Boolean))];

  if (loading) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <motion.div animate={{ rotate: 360 }} transition={{ duration: 1, repeat: Infinity }}>
          <FileText className="h-12 w-12 text-primary" />
        </motion.div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background text-foreground">
      <div className="fixed inset-0 pointer-events-none overflow-hidden">
        <div className="absolute top-20 left-10 w-72 h-72 bg-amber-500/5 rounded-full blur-3xl animate-blob" />
        <div className="absolute bottom-20 right-10 w-96 h-96 bg-primary/5 rounded-full blur-3xl animate-blob" style={{ animationDelay: "2s" }} />
      </div>

      <header className="sticky top-0 z-50 border-b border-border bg-background/80 backdrop-blur-xl">
        <div className="mx-auto flex h-16 max-w-7xl items-center justify-between px-6">
          <div className="flex items-center gap-4">
            <Link href="/dashboard">
              <Button variant="ghost" size="sm">
                <ArrowLeft className="h-4 w-4 mr-2" />
                Back
              </Button>
            </Link>
            <div className="flex items-center gap-2">
              <div className="p-2 rounded-xl bg-gradient-to-br from-amber-500 to-orange-500">
                <FileText className="h-5 w-5 text-white" />
              </div>
              <h1 className="text-xl font-bold">Notes</h1>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <input
                type="text"
                placeholder="Search notes..."
                value={searchQuery}
                onChange={e => setSearchQuery(e.target.value)}
                className="pl-10 pr-4 py-2 w-64 rounded-xl bg-muted border border-border focus:border-primary outline-none text-sm"
              />
            </div>
            <Button
              variant="outline"
              size="sm"
              onClick={() => setViewMode(viewMode === "grid" ? "list" : "grid")}
            >
              {viewMode === "grid" ? <List className="h-4 w-4" /> : <Grid className="h-4 w-4" />}
            </Button>
            <Button
              onClick={() => setShowNewNote(true)}
              className="bg-gradient-to-r from-amber-500 to-orange-500 text-white"
            >
              <Plus className="h-4 w-4 mr-2" />
              New Note
            </Button>
          </div>
        </div>
      </header>

      <main className="mx-auto max-w-7xl px-6 py-8">
        {subjects.length > 0 && (
          <div className="flex items-center gap-2 mb-6 flex-wrap">
            <Button
              variant={!filterSubject ? "default" : "outline"}
              size="sm"
              onClick={() => setFilterSubject("")}
            >
              All
            </Button>
            {subjects.map(subject => (
              <Button
                key={subject}
                variant={filterSubject === subject ? "default" : "outline"}
                size="sm"
                onClick={() => setFilterSubject(subject)}
              >
                {subject}
              </Button>
            ))}
          </div>
        )}

        <div className="flex gap-6">
          <div className={`flex-1 ${selectedNote ? "hidden lg:block" : ""}`}>
            {filteredNotes.length === 0 ? (
              <div className="text-center py-12">
                <FileText className="h-12 w-12 mx-auto text-muted-foreground mb-4" />
                <h3 className="text-lg font-bold mb-2">No notes yet</h3>
                <p className="text-muted-foreground mb-4">Create your first note to get started</p>
                <Button onClick={() => setShowNewNote(true)}>
                  <Plus className="h-4 w-4 mr-2" />
                  Create Note
                </Button>
              </div>
            ) : (
              <div className={viewMode === "grid" ? "grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4" : "space-y-3"}>
                {filteredNotes.map((note, index) => (
                  <motion.div
                    key={note.id}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: index * 0.05 }}
                    onClick={() => setSelectedNote(note)}
                    className={`group cursor-pointer rounded-2xl bg-card border border-border p-5 transition-all hover:border-primary/30 hover:shadow-lg hover-lift ${
                      selectedNote?.id === note.id ? "ring-2 ring-primary" : ""
                    }`}
                  >
                    <div className="flex items-start justify-between mb-3">
                      <h3 className="font-bold group-hover:text-primary transition-colors line-clamp-1">
                        {note.title}
                      </h3>
                      <button
                        onClick={e => { e.stopPropagation(); toggleFavorite(note); }}
                        className="p-1 rounded hover:bg-muted"
                      >
                        {note.is_favorite ? (
                          <Star className="h-4 w-4 text-amber-500 fill-amber-500" />
                        ) : (
                          <StarOff className="h-4 w-4 text-muted-foreground" />
                        )}
                      </button>
                    </div>
                    <p className="text-sm text-muted-foreground line-clamp-2 mb-4">
                      {note.content}
                    </p>
                    <div className="flex items-center justify-between">
                      {note.subject && (
                        <Badge className="bg-primary/10 text-primary border-0 text-xs">
                          {note.subject}
                        </Badge>
                      )}
                      <span className="text-xs text-muted-foreground">
                        {new Date(note.updated_at).toLocaleDateString()}
                      </span>
                    </div>
                  </motion.div>
                ))}
              </div>
            )}
          </div>

          <AnimatePresence>
            {selectedNote && (
              <motion.div
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: 20 }}
                className="w-full lg:w-1/2 xl:w-2/5"
              >
                <div className="sticky top-24 rounded-2xl bg-card border border-border p-6">
                  <div className="flex items-center justify-between mb-4">
                    {editMode ? (
                      <input
                        type="text"
                        value={selectedNote.title}
                        onChange={e => setSelectedNote(prev => prev ? { ...prev, title: e.target.value } : null)}
                        className="text-xl font-bold bg-transparent border-b border-primary outline-none flex-1"
                      />
                    ) : (
                      <h2 className="text-xl font-bold">{selectedNote.title}</h2>
                    )}
                    <div className="flex items-center gap-2">
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => toggleFavorite(selectedNote)}
                      >
                        {selectedNote.is_favorite ? (
                          <Star className="h-4 w-4 text-amber-500 fill-amber-500" />
                        ) : (
                          <StarOff className="h-4 w-4" />
                        )}
                      </Button>
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => {
                          if (editMode) updateNote();
                          else setEditMode(true);
                        }}
                      >
                        {editMode ? <Sparkles className="h-4 w-4" /> : <Edit3 className="h-4 w-4" />}
                      </Button>
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => deleteNote(selectedNote.id)}
                        className="text-red-500 hover:text-red-600"
                      >
                        <Trash2 className="h-4 w-4" />
                      </Button>
                      <Button
                        variant="ghost"
                        size="sm"
                        className="lg:hidden"
                        onClick={() => setSelectedNote(null)}
                      >
                        ×
                      </Button>
                    </div>
                  </div>

                  <div className="flex items-center gap-4 text-sm text-muted-foreground mb-4">
                    <span className="flex items-center gap-1">
                      <Clock className="h-3 w-3" />
                      {new Date(selectedNote.updated_at).toLocaleString()}
                    </span>
                    {selectedNote.subject && (
                      <Badge className="bg-primary/10 text-primary border-0">{selectedNote.subject}</Badge>
                    )}
                  </div>

                  {editMode ? (
                    <textarea
                      value={selectedNote.content}
                      onChange={e => setSelectedNote(prev => prev ? { ...prev, content: e.target.value } : null)}
                      className="w-full h-96 bg-muted rounded-xl p-4 border border-border focus:border-primary outline-none resize-none"
                    />
                  ) : (
                    <div className="prose prose-sm dark:prose-invert max-w-none">
                      <p className="whitespace-pre-wrap">{selectedNote.content}</p>
                    </div>
                  )}

                  {selectedNote.tags && selectedNote.tags.length > 0 && (
                    <div className="mt-4 flex flex-wrap gap-2">
                      {selectedNote.tags.map((tag, i) => (
                        <Badge key={i} variant="outline" className="text-xs">
                          <Tag className="h-2 w-2 mr-1" />
                          {tag}
                        </Badge>
                      ))}
                    </div>
                  )}
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>

        <AnimatePresence>
          {showNewNote && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm p-4"
              onClick={() => setShowNewNote(false)}
            >
              <motion.div
                initial={{ scale: 0.9 }}
                animate={{ scale: 1 }}
                exit={{ scale: 0.9 }}
                onClick={e => e.stopPropagation()}
                className="bg-card rounded-2xl p-6 max-w-lg w-full border border-border"
              >
                <h2 className="text-xl font-bold mb-4">Create New Note</h2>
                <div className="space-y-4">
                  <div>
                    <label className="text-sm font-medium mb-2 block">Title</label>
                    <input
                      type="text"
                      value={newNote.title}
                      onChange={e => setNewNote(prev => ({ ...prev, title: e.target.value }))}
                      className="w-full px-4 py-2 rounded-xl bg-muted border border-border focus:border-primary outline-none"
                      placeholder="Note title..."
                    />
                  </div>
                  <div>
                    <label className="text-sm font-medium mb-2 block">Subject</label>
                    <input
                      type="text"
                      value={newNote.subject}
                      onChange={e => setNewNote(prev => ({ ...prev, subject: e.target.value }))}
                      className="w-full px-4 py-2 rounded-xl bg-muted border border-border focus:border-primary outline-none"
                      placeholder="e.g., JavaScript"
                    />
                  </div>
                  <div>
                    <label className="text-sm font-medium mb-2 block">Content</label>
                    <textarea
                      value={newNote.content}
                      onChange={e => setNewNote(prev => ({ ...prev, content: e.target.value }))}
                      className="w-full px-4 py-2 rounded-xl bg-muted border border-border focus:border-primary outline-none resize-none h-40"
                      placeholder="Write your note..."
                    />
                  </div>
                  <div>
                    <label className="text-sm font-medium mb-2 block">Tags (comma separated)</label>
                    <input
                      type="text"
                      value={newNote.tags}
                      onChange={e => setNewNote(prev => ({ ...prev, tags: e.target.value }))}
                      className="w-full px-4 py-2 rounded-xl bg-muted border border-border focus:border-primary outline-none"
                      placeholder="e.g., functions, scope, closures"
                    />
                  </div>
                </div>
                <div className="flex gap-3 mt-6">
                  <Button variant="outline" className="flex-1" onClick={() => setShowNewNote(false)}>
                    Cancel
                  </Button>
                  <Button className="flex-1" onClick={createNote}>
                    Create Note
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
