"use client";

import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Users, Search, Filter, Star, Calendar, Clock, Video,
  MessageSquare, Award, Briefcase, MapPin, Globe, Heart,
  ChevronRight, CheckCircle2, Sparkles
} from "lucide-react";

interface Mentor {
  id: string;
  name: string;
  avatar: string;
  title: string;
  company: string;
  expertise: string[];
  bio: string;
  rating: number;
  reviewCount: number;
  sessionsCompleted: number;
  hourlyRate: number;
  available: boolean;
  location: string;
  languages: string[];
  nextAvailable: string;
}

export default function MentorsPage() {
  const [mentors, setMentors] = useState<Mentor[]>([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedExpertise, setSelectedExpertise] = useState<string>("all");
  const [isLoading, setIsLoading] = useState(true);
  const [selectedMentor, setSelectedMentor] = useState<Mentor | null>(null);

  const expertiseOptions = ["all", "Frontend", "Backend", "Full Stack", "Data Science", "DevOps", "Mobile", "AI/ML"];

  useEffect(() => {
    fetchMentors();
  }, []);

  const fetchMentors = async () => {
    setIsLoading(true);
    await new Promise(resolve => setTimeout(resolve, 800));
    
    const mockMentors: Mentor[] = [
      {
        id: "1",
        name: "Sarah Chen",
        avatar: "SC",
        title: "Senior Software Engineer",
        company: "Google",
        expertise: ["React", "TypeScript", "System Design"],
        bio: "10+ years of experience building scalable web applications. Passionate about mentoring the next generation of developers.",
        rating: 4.9,
        reviewCount: 128,
        sessionsCompleted: 342,
        hourlyRate: 150,
        available: true,
        location: "San Francisco, CA",
        languages: ["English", "Mandarin"],
        nextAvailable: "Today, 3:00 PM"
      },
      {
        id: "2",
        name: "Michael Rodriguez",
        avatar: "MR",
        title: "Tech Lead",
        company: "Microsoft",
        expertise: ["Node.js", "AWS", "Microservices"],
        bio: "Specializing in backend architecture and cloud solutions. Love helping developers level up their skills.",
        rating: 4.8,
        reviewCount: 95,
        sessionsCompleted: 256,
        hourlyRate: 120,
        available: true,
        location: "Seattle, WA",
        languages: ["English", "Spanish"],
        nextAvailable: "Tomorrow, 10:00 AM"
      },
      {
        id: "3",
        name: "Emily Johnson",
        avatar: "EJ",
        title: "Data Scientist",
        company: "Meta",
        expertise: ["Python", "Machine Learning", "Data Analysis"],
        bio: "PhD in Computer Science. Helping aspiring data scientists break into the field.",
        rating: 4.95,
        reviewCount: 78,
        sessionsCompleted: 189,
        hourlyRate: 180,
        available: false,
        location: "New York, NY",
        languages: ["English"],
        nextAvailable: "Dec 20, 2:00 PM"
      },
      {
        id: "4",
        name: "David Kim",
        avatar: "DK",
        title: "Mobile Developer",
        company: "Uber",
        expertise: ["React Native", "iOS", "Android"],
        bio: "Built apps with millions of downloads. Expert in cross-platform mobile development.",
        rating: 4.7,
        reviewCount: 62,
        sessionsCompleted: 145,
        hourlyRate: 100,
        available: true,
        location: "Austin, TX",
        languages: ["English", "Korean"],
        nextAvailable: "Today, 5:00 PM"
      },
      {
        id: "5",
        name: "Lisa Wang",
        avatar: "LW",
        title: "DevOps Engineer",
        company: "Netflix",
        expertise: ["Kubernetes", "CI/CD", "Docker"],
        bio: "Infrastructure expert with a passion for automation. Making DevOps accessible to everyone.",
        rating: 4.85,
        reviewCount: 54,
        sessionsCompleted: 167,
        hourlyRate: 130,
        available: true,
        location: "Los Angeles, CA",
        languages: ["English", "Cantonese"],
        nextAvailable: "Today, 7:00 PM"
      },
    ];
    
    setMentors(mockMentors);
    setIsLoading(false);
  };

  const filteredMentors = mentors.filter(mentor => {
    if (searchQuery && !mentor.name.toLowerCase().includes(searchQuery.toLowerCase()) &&
        !mentor.expertise.some(e => e.toLowerCase().includes(searchQuery.toLowerCase()))) {
      return false;
    }
    if (selectedExpertise !== "all" && !mentor.expertise.some(e => 
      e.toLowerCase().includes(selectedExpertise.toLowerCase())
    )) {
      return false;
    }
    return true;
  });

  return (
    <div className="min-h-screen bg-background p-6">
      <div className="max-w-7xl mx-auto space-y-8">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center"
        >
          <h1 className="text-4xl font-bold bg-gradient-to-r from-pink-400 via-rose-400 to-red-400 bg-clip-text text-transparent">
            Find Your Perfect Mentor
          </h1>
          <p className="text-muted-foreground mt-2 max-w-2xl mx-auto">
            Connect with industry experts who can guide you through your learning journey and career growth
          </p>
        </motion.div>

        {/* Search & Filters */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="flex flex-col md:flex-row gap-4"
        >
          <div className="flex-1 relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground" />
            <Input
              placeholder="Search by name or expertise..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-10 h-12"
            />
          </div>
          <div className="flex gap-2 flex-wrap">
            {expertiseOptions.map((expertise) => (
              <Button
                key={expertise}
                variant={selectedExpertise === expertise ? "default" : "outline"}
                size="sm"
                onClick={() => setSelectedExpertise(expertise)}
                className={selectedExpertise === expertise ? "bg-gradient-to-r from-pink-500 to-rose-500" : ""}
              >
                {expertise}
              </Button>
            ))}
          </div>
        </motion.div>

        {/* Stats */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="grid grid-cols-2 md:grid-cols-4 gap-4"
        >
          {[
            { label: "Expert Mentors", value: "150+", icon: <Users className="w-5 h-5" /> },
            { label: "Sessions Completed", value: "10K+", icon: <Video className="w-5 h-5" /> },
            { label: "Average Rating", value: "4.9", icon: <Star className="w-5 h-5" /> },
            { label: "Success Stories", value: "5K+", icon: <Award className="w-5 h-5" /> },
          ].map((stat, index) => (
            <Card key={stat.label} className="p-4 bg-card/50 backdrop-blur text-center">
              <div className="w-10 h-10 mx-auto rounded-full bg-primary/10 flex items-center justify-center text-primary mb-2">
                {stat.icon}
              </div>
              <p className="text-2xl font-bold">{stat.value}</p>
              <p className="text-sm text-muted-foreground">{stat.label}</p>
            </Card>
          ))}
        </motion.div>

        {/* Mentors Grid */}
        {isLoading ? (
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {[1, 2, 3].map((i) => (
              <Card key={i} className="p-6 bg-card/50 animate-pulse">
                <div className="flex items-center gap-4 mb-4">
                  <div className="w-16 h-16 rounded-full bg-muted" />
                  <div className="flex-1">
                    <div className="h-5 bg-muted rounded w-3/4 mb-2" />
                    <div className="h-4 bg-muted rounded w-1/2" />
                  </div>
                </div>
                <div className="h-16 bg-muted rounded mb-4" />
                <div className="flex gap-2">
                  <div className="h-6 bg-muted rounded-full w-16" />
                  <div className="h-6 bg-muted rounded-full w-16" />
                </div>
              </Card>
            ))}
          </div>
        ) : (
          <AnimatePresence mode="popLayout">
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
              {filteredMentors.map((mentor, index) => (
                <motion.div
                  key={mentor.id}
                  layout
                  initial={{ opacity: 0, scale: 0.9 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0, scale: 0.9 }}
                  transition={{ delay: index * 0.05 }}
                >
                  <Card className="p-6 bg-card/50 backdrop-blur border-border hover:border-primary/50 transition-all group h-full flex flex-col">
                    <div className="flex items-start gap-4 mb-4">
                      <div className="w-16 h-16 rounded-full bg-gradient-to-br from-pink-500 to-rose-500 flex items-center justify-center text-white text-xl font-bold">
                        {mentor.avatar}
                      </div>
                      <div className="flex-1">
                        <div className="flex items-center gap-2">
                          <h3 className="font-semibold text-lg">{mentor.name}</h3>
                          {mentor.available && (
                            <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
                          )}
                        </div>
                        <p className="text-sm text-muted-foreground">{mentor.title}</p>
                        <p className="text-sm text-primary flex items-center gap-1">
                          <Briefcase className="w-3 h-3" />
                          {mentor.company}
                        </p>
                      </div>
                    </div>

                    <p className="text-sm text-muted-foreground line-clamp-2 mb-4 flex-1">
                      {mentor.bio}
                    </p>

                    <div className="flex flex-wrap gap-1 mb-4">
                      {mentor.expertise.map((skill) => (
                        <span
                          key={skill}
                          className="px-2 py-0.5 text-xs bg-primary/10 text-primary rounded-full"
                        >
                          {skill}
                        </span>
                      ))}
                    </div>

                    <div className="grid grid-cols-3 gap-2 mb-4 text-center">
                      <div className="p-2 bg-muted/50 rounded-lg">
                        <div className="flex items-center justify-center gap-1 text-amber-500">
                          <Star className="w-4 h-4 fill-current" />
                          <span className="font-semibold">{mentor.rating}</span>
                        </div>
                        <p className="text-xs text-muted-foreground">{mentor.reviewCount} reviews</p>
                      </div>
                      <div className="p-2 bg-muted/50 rounded-lg">
                        <p className="font-semibold">{mentor.sessionsCompleted}</p>
                        <p className="text-xs text-muted-foreground">Sessions</p>
                      </div>
                      <div className="p-2 bg-muted/50 rounded-lg">
                        <p className="font-semibold">${mentor.hourlyRate}</p>
                        <p className="text-xs text-muted-foreground">/hour</p>
                      </div>
                    </div>

                    <div className="flex items-center justify-between text-sm text-muted-foreground mb-4">
                      <span className="flex items-center gap-1">
                        <MapPin className="w-3 h-3" />
                        {mentor.location}
                      </span>
                      <span className="flex items-center gap-1">
                        <Globe className="w-3 h-3" />
                        {mentor.languages.join(", ")}
                      </span>
                    </div>

                    <div className="flex items-center justify-between pt-4 border-t border-border">
                      <div className="text-sm">
                        <span className="text-muted-foreground">Next available: </span>
                        <span className={mentor.available ? "text-emerald-500" : "text-muted-foreground"}>
                          {mentor.nextAvailable}
                        </span>
                      </div>
                      <Button 
                        size="sm" 
                        className="gap-1 bg-gradient-to-r from-pink-500 to-rose-500 hover:from-pink-600 hover:to-rose-600"
                        onClick={() => setSelectedMentor(mentor)}
                      >
                        Book
                        <Calendar className="w-4 h-4" />
                      </Button>
                    </div>
                  </Card>
                </motion.div>
              ))}
            </div>
          </AnimatePresence>
        )}

        {filteredMentors.length === 0 && !isLoading && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="text-center py-16"
          >
            <Users className="w-16 h-16 mx-auto text-muted-foreground/50 mb-4" />
            <h3 className="text-xl font-semibold mb-2">No mentors found</h3>
            <p className="text-muted-foreground">Try adjusting your search or filters</p>
          </motion.div>
        )}

        {/* Booking Modal would go here */}
        <AnimatePresence>
          {selectedMentor && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="fixed inset-0 bg-background/80 backdrop-blur-sm z-50 flex items-center justify-center p-4"
              onClick={() => setSelectedMentor(null)}
            >
              <motion.div
                initial={{ scale: 0.9, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                exit={{ scale: 0.9, opacity: 0 }}
                className="bg-card border border-border rounded-2xl p-6 max-w-md w-full shadow-xl"
                onClick={(e) => e.stopPropagation()}
              >
                <div className="flex items-center gap-4 mb-6">
                  <div className="w-16 h-16 rounded-full bg-gradient-to-br from-pink-500 to-rose-500 flex items-center justify-center text-white text-xl font-bold">
                    {selectedMentor.avatar}
                  </div>
                  <div>
                    <h3 className="text-xl font-bold">{selectedMentor.name}</h3>
                    <p className="text-muted-foreground">{selectedMentor.title}</p>
                  </div>
                </div>

                <div className="space-y-4 mb-6">
                  <div className="p-4 bg-muted/50 rounded-lg">
                    <h4 className="font-semibold mb-2 flex items-center gap-2">
                      <Calendar className="w-4 h-4" />
                      Select Time Slot
                    </h4>
                    <div className="grid grid-cols-2 gap-2">
                      {["Today, 3:00 PM", "Today, 5:00 PM", "Tomorrow, 10:00 AM", "Tomorrow, 2:00 PM"].map((slot) => (
                        <button
                          key={slot}
                          className="p-2 text-sm border border-border rounded-lg hover:border-primary hover:bg-primary/5 transition-all"
                        >
                          {slot}
                        </button>
                      ))}
                    </div>
                  </div>

                  <div className="p-4 bg-muted/50 rounded-lg">
                    <h4 className="font-semibold mb-2 flex items-center gap-2">
                      <Clock className="w-4 h-4" />
                      Session Duration
                    </h4>
                    <div className="flex gap-2">
                      {["30 min", "45 min", "60 min"].map((duration) => (
                        <button
                          key={duration}
                          className="flex-1 p-2 text-sm border border-border rounded-lg hover:border-primary hover:bg-primary/5 transition-all"
                        >
                          {duration}
                        </button>
                      ))}
                    </div>
                  </div>
                </div>

                <div className="flex items-center justify-between mb-6">
                  <span className="text-muted-foreground">Total</span>
                  <span className="text-2xl font-bold">${selectedMentor.hourlyRate}</span>
                </div>

                <div className="flex gap-3">
                  <Button variant="outline" className="flex-1" onClick={() => setSelectedMentor(null)}>
                    Cancel
                  </Button>
                  <Button className="flex-1 bg-gradient-to-r from-pink-500 to-rose-500 hover:from-pink-600 hover:to-rose-600">
                    Confirm Booking
                  </Button>
                </div>
              </motion.div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
}
