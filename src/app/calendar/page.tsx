"use client";

import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
  Calendar as CalendarIcon, ChevronLeft, ChevronRight, Plus, Clock, BookOpen,
  Target, CheckCircle, Trash2, Edit2, X, Bell, Repeat, MapPin, Users,
  Video, FileText, Zap, Star, Flame, AlertCircle
} from "lucide-react";
import Link from "next/link";
import { motion, AnimatePresence } from "framer-motion";

interface Event {
  id: string;
  title: string;
  date: Date;
  time: string;
  duration: string;
  type: "study" | "assignment" | "exam" | "live" | "reminder";
  subject?: string;
  description?: string;
  completed?: boolean;
  recurring?: boolean;
  color: string;
}

const eventTypes = {
  study: { icon: BookOpen, color: "emerald", label: "Study Session" },
  assignment: { icon: FileText, color: "blue", label: "Assignment" },
  exam: { icon: AlertCircle, color: "red", label: "Exam" },
  live: { icon: Video, color: "violet", label: "Live Session" },
  reminder: { icon: Bell, color: "amber", label: "Reminder" },
};

const DAYS = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];
const MONTHS = ["January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December"];

export default function CalendarPage() {
  const [currentDate, setCurrentDate] = useState(new Date());
  const [selectedDate, setSelectedDate] = useState<Date | null>(new Date());
  const [events, setEvents] = useState<Event[]>([
    { id: "1", title: "JavaScript Fundamentals", date: new Date(), time: "09:00", duration: "2h", type: "study", subject: "JavaScript", color: "emerald" },
    { id: "2", title: "React Quiz Due", date: new Date(), time: "23:59", duration: "1h", type: "assignment", subject: "React", color: "blue" },
    { id: "3", title: "Live Coding Session", date: new Date(Date.now() + 86400000), time: "14:00", duration: "1.5h", type: "live", subject: "Node.js", color: "violet" },
    { id: "4", title: "Final Exam", date: new Date(Date.now() + 86400000 * 3), time: "10:00", duration: "3h", type: "exam", subject: "Full Stack", color: "red" },
    { id: "5", title: "Review Notes", date: new Date(Date.now() + 86400000 * 2), time: "16:00", duration: "1h", type: "reminder", color: "amber" },
  ]);
  const [showAddModal, setShowAddModal] = useState(false);
  const [newEvent, setNewEvent] = useState<Partial<Event>>({ type: "study", color: "emerald" });
  const [view, setView] = useState<"month" | "week" | "day">("month");
  const [showEventDetails, setShowEventDetails] = useState<Event | null>(null);

  const getDaysInMonth = (date: Date) => {
    const year = date.getFullYear();
    const month = date.getMonth();
    const firstDay = new Date(year, month, 1);
    const lastDay = new Date(year, month + 1, 0);
    const daysInMonth = lastDay.getDate();
    const startingDay = firstDay.getDay();
    
    const days: (Date | null)[] = [];
    for (let i = 0; i < startingDay; i++) days.push(null);
    for (let i = 1; i <= daysInMonth; i++) days.push(new Date(year, month, i));
    return days;
  };

  const getEventsForDate = (date: Date) => {
    return events.filter(e => 
      e.date.getDate() === date.getDate() &&
      e.date.getMonth() === date.getMonth() &&
      e.date.getFullYear() === date.getFullYear()
    );
  };

  const isToday = (date: Date) => {
    const today = new Date();
    return date.getDate() === today.getDate() &&
      date.getMonth() === today.getMonth() &&
      date.getFullYear() === today.getFullYear();
  };

  const isSameDay = (d1: Date, d2: Date) => {
    return d1.getDate() === d2.getDate() &&
      d1.getMonth() === d2.getMonth() &&
      d1.getFullYear() === d2.getFullYear();
  };

  const navigateMonth = (direction: number) => {
    setCurrentDate(new Date(currentDate.getFullYear(), currentDate.getMonth() + direction, 1));
  };

  const addEvent = () => {
    if (!newEvent.title || !selectedDate) return;
    const event: Event = {
      id: Date.now().toString(),
      title: newEvent.title,
      date: selectedDate,
      time: newEvent.time || "09:00",
      duration: newEvent.duration || "1h",
      type: newEvent.type as Event["type"],
      subject: newEvent.subject,
      description: newEvent.description,
      color: eventTypes[newEvent.type as keyof typeof eventTypes]?.color || "emerald",
    };
    setEvents([...events, event]);
    setShowAddModal(false);
    setNewEvent({ type: "study", color: "emerald" });
  };

  const deleteEvent = (id: string) => {
    setEvents(events.filter(e => e.id !== id));
    setShowEventDetails(null);
  };

  const toggleComplete = (id: string) => {
    setEvents(events.map(e => e.id === id ? { ...e, completed: !e.completed } : e));
  };

  const days = getDaysInMonth(currentDate);
  const selectedDateEvents = selectedDate ? getEventsForDate(selectedDate) : [];

  const upcomingEvents = events
    .filter(e => e.date >= new Date())
    .sort((a, b) => a.date.getTime() - b.date.getTime())
    .slice(0, 5);

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
          <div className="flex items-center gap-2">
            {["month", "week", "day"].map((v) => (
              <Button
                key={v}
                variant={view === v ? "default" : "ghost"}
                size="sm"
                onClick={() => setView(v as typeof view)}
                className={view === v ? "bg-primary text-white" : ""}
              >
                {v.charAt(0).toUpperCase() + v.slice(1)}
              </Button>
            ))}
          </div>
          <Button onClick={() => setShowAddModal(true)} className="bg-gradient-to-r from-emerald-500 to-cyan-500">
            <Plus className="mr-2 h-4 w-4" /> Add Event
          </Button>
        </div>
      </header>

      <main className="max-w-7xl mx-auto p-6">
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
          <div className="lg:col-span-3">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="rounded-2xl border border-border bg-card/50 backdrop-blur-sm overflow-hidden"
            >
              <div className="p-6 border-b border-border flex items-center justify-between">
                <div className="flex items-center gap-4">
                  <Button variant="ghost" size="icon" onClick={() => navigateMonth(-1)}>
                    <ChevronLeft className="h-5 w-5" />
                  </Button>
                  <h2 className="text-2xl font-bold text-foreground">
                    {MONTHS[currentDate.getMonth()]} {currentDate.getFullYear()}
                  </h2>
                  <Button variant="ghost" size="icon" onClick={() => navigateMonth(1)}>
                    <ChevronRight className="h-5 w-5" />
                  </Button>
                </div>
                <Button variant="outline" size="sm" onClick={() => setCurrentDate(new Date())}>
                  Today
                </Button>
              </div>

              <div className="grid grid-cols-7 border-b border-border">
                {DAYS.map(day => (
                  <div key={day} className="p-3 text-center text-sm font-medium text-muted-foreground">
                    {day}
                  </div>
                ))}
              </div>

              <div className="grid grid-cols-7">
                {days.map((date, i) => {
                  if (!date) return <div key={i} className="min-h-[120px] border-b border-r border-border bg-muted/30" />;
                  
                  const dayEvents = getEventsForDate(date);
                  const isSelected = selectedDate && isSameDay(date, selectedDate);
                  
                  return (
                    <motion.button
                      key={i}
                      whileHover={{ backgroundColor: "rgba(16, 185, 129, 0.05)" }}
                      onClick={() => setSelectedDate(date)}
                      className={`min-h-[120px] p-2 border-b border-r border-border text-left transition-all relative ${
                        isToday(date) ? "bg-primary/5" : ""
                      } ${isSelected ? "ring-2 ring-primary ring-inset" : ""}`}
                    >
                      <span className={`inline-flex items-center justify-center w-8 h-8 rounded-full text-sm font-medium ${
                        isToday(date) ? "bg-primary text-white" : "text-foreground"
                      }`}>
                        {date.getDate()}
                      </span>
                      
                      <div className="mt-1 space-y-1">
                        {dayEvents.slice(0, 3).map((event, j) => {
                          const typeInfo = eventTypes[event.type];
                          return (
                            <motion.div
                              key={event.id}
                              initial={{ opacity: 0, x: -10 }}
                              animate={{ opacity: 1, x: 0 }}
                              transition={{ delay: j * 0.05 }}
                              onClick={(e) => { e.stopPropagation(); setShowEventDetails(event); }}
                              className={`text-xs p-1 rounded truncate cursor-pointer hover:opacity-80 ${
                                event.completed ? "line-through opacity-50" : ""
                              }`}
                              style={{
                                backgroundColor: `rgb(var(--${typeInfo.color}-500) / 0.2)`,
                                color: `rgb(var(--${typeInfo.color}-500))`
                              }}
                            >
                              <span className="font-medium">{event.time}</span> {event.title}
                            </motion.div>
                          );
                        })}
                        {dayEvents.length > 3 && (
                          <p className="text-xs text-muted-foreground">+{dayEvents.length - 3} more</p>
                        )}
                      </div>
                    </motion.button>
                  );
                })}
              </div>
            </motion.div>
          </div>

          <div className="space-y-6">
            <motion.div
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              className="rounded-2xl border border-border bg-card/50 backdrop-blur-sm p-6"
            >
              <h3 className="text-lg font-bold text-foreground mb-4 flex items-center gap-2">
                <CalendarIcon className="h-5 w-5 text-primary" />
                {selectedDate ? (
                  <span>{selectedDate.toLocaleDateString("en-US", { weekday: "long", month: "long", day: "numeric" })}</span>
                ) : "Select a date"}
              </h3>

              {selectedDateEvents.length === 0 ? (
                <div className="text-center py-8">
                  <CalendarIcon className="h-12 w-12 text-muted-foreground mx-auto mb-3 opacity-50" />
                  <p className="text-muted-foreground">No events for this day</p>
                  <Button
                    variant="outline"
                    size="sm"
                    className="mt-4"
                    onClick={() => setShowAddModal(true)}
                  >
                    <Plus className="mr-2 h-4 w-4" /> Add Event
                  </Button>
                </div>
              ) : (
                <div className="space-y-3">
                  {selectedDateEvents.map((event, i) => {
                    const typeInfo = eventTypes[event.type];
                    const Icon = typeInfo.icon;
                    return (
                      <motion.div
                        key={event.id}
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: i * 0.1 }}
                        className={`p-3 rounded-xl border border-border bg-card hover:border-primary/30 transition-all cursor-pointer ${
                          event.completed ? "opacity-50" : ""
                        }`}
                        onClick={() => setShowEventDetails(event)}
                      >
                        <div className="flex items-start gap-3">
                          <div className={`p-2 rounded-lg bg-${typeInfo.color}-500/10`}>
                            <Icon className={`h-4 w-4 text-${typeInfo.color}-500`} />
                          </div>
                          <div className="flex-1 min-w-0">
                            <p className={`font-medium text-foreground ${event.completed ? "line-through" : ""}`}>
                              {event.title}
                            </p>
                            <div className="flex items-center gap-2 text-xs text-muted-foreground mt-1">
                              <Clock className="h-3 w-3" />
                              <span>{event.time}</span>
                              <span>•</span>
                              <span>{event.duration}</span>
                            </div>
                            {event.subject && (
                              <Badge variant="outline" className="mt-2 text-xs">
                                {event.subject}
                              </Badge>
                            )}
                          </div>
                          <Button
                            variant="ghost"
                            size="icon"
                            className="h-8 w-8"
                            onClick={(e) => { e.stopPropagation(); toggleComplete(event.id); }}
                          >
                            <CheckCircle className={`h-4 w-4 ${event.completed ? "text-primary fill-primary" : "text-muted-foreground"}`} />
                          </Button>
                        </div>
                      </motion.div>
                    );
                  })}
                </div>
              )}
            </motion.div>

            <motion.div
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.2 }}
              className="rounded-2xl border border-border bg-card/50 backdrop-blur-sm p-6"
            >
              <h3 className="text-lg font-bold text-foreground mb-4 flex items-center gap-2">
                <Zap className="h-5 w-5 text-amber-400" />
                Upcoming
              </h3>
              <div className="space-y-3">
                {upcomingEvents.map((event, i) => {
                  const typeInfo = eventTypes[event.type];
                  const Icon = typeInfo.icon;
                  const daysUntil = Math.ceil((event.date.getTime() - new Date().getTime()) / 86400000);
                  return (
                    <motion.div
                      key={event.id}
                      initial={{ opacity: 0, x: 10 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: i * 0.1 }}
                      className="flex items-center gap-3 p-2 rounded-lg hover:bg-muted/50 transition-all cursor-pointer"
                      onClick={() => setShowEventDetails(event)}
                    >
                      <div className={`p-1.5 rounded-lg bg-${typeInfo.color}-500/10`}>
                        <Icon className={`h-3 w-3 text-${typeInfo.color}-500`} />
                      </div>
                      <div className="flex-1 min-w-0">
                        <p className="text-sm font-medium text-foreground truncate">{event.title}</p>
                        <p className="text-xs text-muted-foreground">
                          {daysUntil === 0 ? "Today" : daysUntil === 1 ? "Tomorrow" : `In ${daysUntil} days`}
                        </p>
                      </div>
                    </motion.div>
                  );
                })}
              </div>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.3 }}
              className="rounded-2xl border border-border bg-gradient-to-br from-primary/10 to-cyan-500/10 p-6"
            >
              <div className="flex items-center gap-3 mb-4">
                <Flame className="h-6 w-6 text-orange-400" />
                <div>
                  <p className="text-2xl font-bold text-foreground">12</p>
                  <p className="text-sm text-muted-foreground">Day Streak</p>
                </div>
              </div>
              <div className="flex gap-1">
                {[...Array(7)].map((_, i) => (
                  <div
                    key={i}
                    className={`flex-1 h-2 rounded-full ${i < 5 ? "bg-primary" : "bg-muted"}`}
                  />
                ))}
              </div>
              <p className="text-xs text-muted-foreground mt-2">5/7 days this week</p>
            </motion.div>
          </div>
        </div>
      </main>

      <AnimatePresence>
        {showAddModal && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 flex items-center justify-center bg-background/80 backdrop-blur-sm p-4"
            onClick={() => setShowAddModal(false)}
          >
            <motion.div
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.9, opacity: 0 }}
              className="w-full max-w-md rounded-2xl border border-border bg-card p-6"
              onClick={e => e.stopPropagation()}
            >
              <div className="flex items-center justify-between mb-6">
                <h3 className="text-xl font-bold text-foreground">Add Event</h3>
                <Button variant="ghost" size="icon" onClick={() => setShowAddModal(false)}>
                  <X className="h-5 w-5" />
                </Button>
              </div>

              <div className="space-y-4">
                <div>
                  <label className="text-sm font-medium text-foreground">Title</label>
                  <input
                    type="text"
                    value={newEvent.title || ""}
                    onChange={(e) => setNewEvent({ ...newEvent, title: e.target.value })}
                    placeholder="Event title..."
                    className="mt-1 w-full px-4 py-2 rounded-lg bg-muted border border-border focus:ring-2 focus:ring-primary outline-none"
                  />
                </div>

                <div>
                  <label className="text-sm font-medium text-foreground">Type</label>
                  <div className="grid grid-cols-5 gap-2 mt-1">
                    {Object.entries(eventTypes).map(([key, value]) => {
                      const Icon = value.icon;
                      return (
                        <button
                          key={key}
                          onClick={() => setNewEvent({ ...newEvent, type: key as Event["type"] })}
                          className={`p-2 rounded-lg border transition-all ${
                            newEvent.type === key
                              ? "border-primary bg-primary/10"
                              : "border-border hover:border-primary/50"
                          }`}
                        >
                          <Icon className={`h-5 w-5 mx-auto text-${value.color}-500`} />
                        </button>
                      );
                    })}
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="text-sm font-medium text-foreground">Time</label>
                    <input
                      type="time"
                      value={newEvent.time || "09:00"}
                      onChange={(e) => setNewEvent({ ...newEvent, time: e.target.value })}
                      className="mt-1 w-full px-4 py-2 rounded-lg bg-muted border border-border focus:ring-2 focus:ring-primary outline-none"
                    />
                  </div>
                  <div>
                    <label className="text-sm font-medium text-foreground">Duration</label>
                    <select
                      value={newEvent.duration || "1h"}
                      onChange={(e) => setNewEvent({ ...newEvent, duration: e.target.value })}
                      className="mt-1 w-full px-4 py-2 rounded-lg bg-muted border border-border focus:ring-2 focus:ring-primary outline-none"
                    >
                      <option value="30m">30 minutes</option>
                      <option value="1h">1 hour</option>
                      <option value="1.5h">1.5 hours</option>
                      <option value="2h">2 hours</option>
                      <option value="3h">3 hours</option>
                    </select>
                  </div>
                </div>

                <div>
                  <label className="text-sm font-medium text-foreground">Subject (optional)</label>
                  <input
                    type="text"
                    value={newEvent.subject || ""}
                    onChange={(e) => setNewEvent({ ...newEvent, subject: e.target.value })}
                    placeholder="e.g., JavaScript, React..."
                    className="mt-1 w-full px-4 py-2 rounded-lg bg-muted border border-border focus:ring-2 focus:ring-primary outline-none"
                  />
                </div>

                <div>
                  <label className="text-sm font-medium text-foreground">Description (optional)</label>
                  <textarea
                    value={newEvent.description || ""}
                    onChange={(e) => setNewEvent({ ...newEvent, description: e.target.value })}
                    placeholder="Add notes..."
                    rows={3}
                    className="mt-1 w-full px-4 py-2 rounded-lg bg-muted border border-border focus:ring-2 focus:ring-primary outline-none resize-none"
                  />
                </div>

                <div className="flex gap-3 pt-4">
                  <Button variant="outline" className="flex-1" onClick={() => setShowAddModal(false)}>
                    Cancel
                  </Button>
                  <Button className="flex-1 bg-gradient-to-r from-emerald-500 to-cyan-500" onClick={addEvent}>
                    Add Event
                  </Button>
                </div>
              </div>
            </motion.div>
          </motion.div>
        )}

        {showEventDetails && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 flex items-center justify-center bg-background/80 backdrop-blur-sm p-4"
            onClick={() => setShowEventDetails(null)}
          >
            <motion.div
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.9, opacity: 0 }}
              className="w-full max-w-md rounded-2xl border border-border bg-card p-6"
              onClick={e => e.stopPropagation()}
            >
              <div className="flex items-start justify-between mb-4">
                <div className="flex items-center gap-3">
                  {(() => {
                    const typeInfo = eventTypes[showEventDetails.type];
                    const Icon = typeInfo.icon;
                    return (
                      <div className={`p-3 rounded-xl bg-${typeInfo.color}-500/10`}>
                        <Icon className={`h-6 w-6 text-${typeInfo.color}-500`} />
                      </div>
                    );
                  })()}
                  <div>
                    <Badge className="mb-1">{eventTypes[showEventDetails.type].label}</Badge>
                    <h3 className="text-xl font-bold text-foreground">{showEventDetails.title}</h3>
                  </div>
                </div>
                <Button variant="ghost" size="icon" onClick={() => setShowEventDetails(null)}>
                  <X className="h-5 w-5" />
                </Button>
              </div>

              <div className="space-y-4 mb-6">
                <div className="flex items-center gap-3 text-muted-foreground">
                  <CalendarIcon className="h-5 w-5" />
                  <span>{showEventDetails.date.toLocaleDateString("en-US", { weekday: "long", month: "long", day: "numeric", year: "numeric" })}</span>
                </div>
                <div className="flex items-center gap-3 text-muted-foreground">
                  <Clock className="h-5 w-5" />
                  <span>{showEventDetails.time} • {showEventDetails.duration}</span>
                </div>
                {showEventDetails.subject && (
                  <div className="flex items-center gap-3 text-muted-foreground">
                    <BookOpen className="h-5 w-5" />
                    <span>{showEventDetails.subject}</span>
                  </div>
                )}
                {showEventDetails.description && (
                  <p className="text-muted-foreground p-3 rounded-lg bg-muted/50">
                    {showEventDetails.description}
                  </p>
                )}
              </div>

              <div className="flex gap-3">
                <Button
                  variant="outline"
                  className="flex-1"
                  onClick={() => toggleComplete(showEventDetails.id)}
                >
                  <CheckCircle className={`mr-2 h-4 w-4 ${showEventDetails.completed ? "text-primary" : ""}`} />
                  {showEventDetails.completed ? "Completed" : "Mark Complete"}
                </Button>
                <Button
                  variant="outline"
                  className="text-red-500 hover:text-red-600"
                  onClick={() => deleteEvent(showEventDetails.id)}
                >
                  <Trash2 className="h-4 w-4" />
                </Button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
