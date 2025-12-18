"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Card } from "@/components/ui/card";
import { GraduationCap, ArrowRight, Sparkles, ArrowLeft, CheckCircle2 } from "lucide-react";
import { supabase } from "@/lib/supabase/client";
import { DeveloperWatermark } from "@/components/DeveloperWatermark";
import { motion } from "framer-motion";

const educationLevels = ["10th Grade", "12th Grade", "Undergraduate", "Postgraduate", "Working Professional"];
const fieldsOfInterest = [
  "Web Development",
  "Mobile Development", 
  "Data Science & AI",
  "Cloud Computing",
  "Cybersecurity",
  "DevOps",
  "Blockchain",
  "Game Development"
];

export default function OnboardingPage() {
  const router = useRouter();
  const [step, setStep] = useState(1);
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({
    fullName: "",
    educationLevel: "",
    institutionName: "",
    fieldOfInterest: "",
    targetRole: "",
    hoursPerWeek: "",
    goalTimeline: "",
  });

  const handleInputChange = (field: string, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  const handleSubmit = async () => {
    setLoading(true);
    try {
      const { data: { user } } = await supabase.auth.getUser();
      
      if (user) {
        await supabase.from("user_profiles").upsert({
          id: user.id,
          email: user.email,
          full_name: formData.fullName,
          education_level: formData.educationLevel,
          institution_name: formData.institutionName,
          field_of_interest: formData.fieldOfInterest,
          target_role: formData.targetRole,
          learning_preferences: {
            hoursPerWeek: formData.hoursPerWeek,
            goalTimeline: formData.goalTimeline,
          },
          onboarding_completed: true,
        });

        router.push("/dashboard");
      }
    } catch (error) {
      console.error("Error saving profile:", error);
    } finally {
      setLoading(false);
    }
  };

  const canProceed = () => {
    if (step === 1) return formData.fullName && formData.educationLevel;
    if (step === 2) return formData.fieldOfInterest;
    if (step === 3) return formData.hoursPerWeek && formData.goalTimeline;
    return false;
  };

  return (
    <div className="min-h-screen bg-background flex items-center justify-center p-4">
      <div className="fixed inset-0 bg-[radial-gradient(ellipse_at_top,_var(--tw-gradient-stops))] from-primary/10 via-transparent to-transparent pointer-events-none" />
      
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="w-full max-w-2xl relative z-10"
      >
        <Card className="p-8 shadow-2xl bg-card border-border">
          <div className="text-center mb-8">
            <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-gradient-to-br from-emerald-500 to-cyan-500 mb-4 shadow-lg shadow-primary/20">
              <GraduationCap className="w-8 h-8 text-white" />
            </div>
            <h1 className="text-3xl font-bold text-foreground mb-2">Welcome to Shrivasta AI</h1>
            <p className="text-muted-foreground">Let&apos;s personalize your learning experience</p>
          </div>

          <div className="mb-8">
            <div className="flex items-center justify-between mb-4">
              {[1, 2, 3].map((s) => (
                <div key={s} className="flex items-center flex-1">
                  <div className={`w-10 h-10 rounded-full flex items-center justify-center font-bold transition-all ${
                    step > s 
                      ? "bg-primary text-primary-foreground" 
                      : step === s 
                        ? "bg-primary text-primary-foreground ring-4 ring-primary/20" 
                        : "bg-muted text-muted-foreground"
                  }`}>
                    {step > s ? <CheckCircle2 className="h-5 w-5" /> : s}
                  </div>
                  {s < 3 && <div className={`flex-1 h-1 mx-2 rounded-full transition-all ${step > s ? "bg-primary" : "bg-muted"}`} />}
                </div>
              ))}
            </div>
            <div className="flex justify-between text-xs text-muted-foreground">
              <span>Personal Info</span>
              <span>Interests</span>
              <span>Goals</span>
            </div>
          </div>

          {step === 1 && (
            <motion.div
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              className="space-y-6"
            >
              <div>
                <Label htmlFor="fullName" className="text-foreground">Full Name</Label>
                <Input
                  id="fullName"
                  placeholder="Enter your full name"
                  value={formData.fullName}
                  onChange={(e) => handleInputChange("fullName", e.target.value)}
                  className="mt-2 bg-background border-border"
                />
              </div>
              <div>
                <Label htmlFor="educationLevel" className="text-foreground">Education Level</Label>
                <Select value={formData.educationLevel} onValueChange={(v) => handleInputChange("educationLevel", v)}>
                  <SelectTrigger className="mt-2 bg-background border-border">
                    <SelectValue placeholder="Select your education level" />
                  </SelectTrigger>
                  <SelectContent>
                    {educationLevels.map((level) => (
                      <SelectItem key={level} value={level}>{level}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              <div>
                <Label htmlFor="institutionName" className="text-foreground">School / College / University (Optional)</Label>
                <Input
                  id="institutionName"
                  placeholder="Enter your institution name"
                  value={formData.institutionName}
                  onChange={(e) => handleInputChange("institutionName", e.target.value)}
                  className="mt-2 bg-background border-border"
                />
              </div>
            </motion.div>
          )}

          {step === 2 && (
            <motion.div
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              className="space-y-6"
            >
              <div>
                <Label className="text-foreground mb-4 block">Which field are you interested in?</Label>
                <div className="grid grid-cols-2 gap-3">
                  {fieldsOfInterest.map((field) => (
                    <button
                      key={field}
                      onClick={() => handleInputChange("fieldOfInterest", field)}
                      className={`p-4 rounded-lg border text-left transition-all ${
                        formData.fieldOfInterest === field
                          ? "border-primary bg-primary/10 text-foreground"
                          : "border-border bg-muted/30 text-foreground hover:border-primary/50 hover:bg-muted/50"
                      }`}
                    >
                      <span className="font-medium">{field}</span>
                    </button>
                  ))}
                </div>
              </div>
              <div>
                <Label htmlFor="targetRole" className="text-foreground">Target Role (Optional)</Label>
                <Input
                  id="targetRole"
                  placeholder="e.g., Frontend Developer, Data Analyst"
                  value={formData.targetRole}
                  onChange={(e) => handleInputChange("targetRole", e.target.value)}
                  className="mt-2 bg-background border-border"
                />
              </div>
            </motion.div>
          )}

          {step === 3 && (
            <motion.div
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              className="space-y-6"
            >
              <div>
                <Label htmlFor="hoursPerWeek" className="text-foreground">Hours available per week</Label>
                <Select value={formData.hoursPerWeek} onValueChange={(v) => handleInputChange("hoursPerWeek", v)}>
                  <SelectTrigger className="mt-2 bg-background border-border">
                    <SelectValue placeholder="Select hours" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="5-10">5-10 hours</SelectItem>
                    <SelectItem value="10-20">10-20 hours</SelectItem>
                    <SelectItem value="20+">20+ hours</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div>
                <Label htmlFor="goalTimeline" className="text-foreground">Goal Timeline</Label>
                <Select value={formData.goalTimeline} onValueChange={(v) => handleInputChange("goalTimeline", v)}>
                  <SelectTrigger className="mt-2 bg-background border-border">
                    <SelectValue placeholder="Select timeline" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="short_term">Short Term (1-3 months)</SelectItem>
                    <SelectItem value="medium_term">Medium Term (3-6 months)</SelectItem>
                    <SelectItem value="long_term">Long Term (6+ months)</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div className="p-4 bg-primary/5 rounded-lg border border-primary/10">
                <div className="flex items-start gap-3">
                  <Sparkles className="w-5 h-5 text-primary mt-1" />
                  <div>
                    <h3 className="font-semibold text-foreground mb-1">AI-Powered Personalization</h3>
                    <p className="text-sm text-muted-foreground">Based on your answers, we&apos;ll create a personalized learning roadmap, daily guidance, and tailored assessments just for you.</p>
                  </div>
                </div>
              </div>
            </motion.div>
          )}

          <div className="flex justify-between mt-8">
            {step > 1 && (
              <Button variant="outline" onClick={() => setStep(step - 1)} className="gap-2">
                <ArrowLeft className="w-4 h-4" />
                Back
              </Button>
            )}
            {step < 3 ? (
              <Button 
                onClick={() => setStep(step + 1)} 
                className="ml-auto gap-2"
                disabled={!canProceed()}
              >
                Next <ArrowRight className="w-4 h-4" />
              </Button>
            ) : (
              <Button 
                onClick={handleSubmit} 
                disabled={loading || !canProceed()} 
                className="ml-auto gap-2 bg-gradient-to-r from-emerald-500 to-cyan-500 hover:from-emerald-600 hover:to-cyan-600"
              >
                {loading ? "Setting up..." : "Complete Setup"}
                <Sparkles className="w-4 h-4" />
              </Button>
            )}
          </div>
        </Card>
      </motion.div>
      <DeveloperWatermark />
    </div>
  );
}
