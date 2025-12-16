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
import { GraduationCap, ArrowRight, Sparkles } from "lucide-react";
import { supabase } from "@/lib/supabase/client";
import { DeveloperWatermark } from "@/components/DeveloperWatermark";

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

  return (
    <div className="min-h-screen bg-gradient-to-br from-indigo-50 via-purple-50 to-pink-50 flex items-center justify-center p-4">
      <Card className="w-full max-w-2xl p-8 shadow-2xl">
        <div className="text-center mb-8">
          <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-gradient-to-br from-indigo-600 to-purple-600 mb-4">
            <GraduationCap className="w-8 h-8 text-white" />
          </div>
          <h1 className="text-3xl font-bold text-gray-900 mb-2">Welcome to Your Learning Journey</h1>
          <p className="text-gray-600">Let's personalize your experience</p>
        </div>

        <div className="mb-8">
          <div className="flex items-center justify-between mb-4">
            {[1, 2, 3].map((s) => (
              <div key={s} className="flex items-center flex-1">
                <div className={`w-10 h-10 rounded-full flex items-center justify-center font-bold ${
                  step >= s ? "bg-indigo-600 text-white" : "bg-gray-200 text-gray-500"
                }`}>
                  {s}
                </div>
                {s < 3 && <div className={`flex-1 h-1 mx-2 ${step > s ? "bg-indigo-600" : "bg-gray-200"}`} />}
              </div>
            ))}
          </div>
        </div>

        {step === 1 && (
          <div className="space-y-6">
            <div>
              <Label htmlFor="fullName">Full Name</Label>
              <Input
                id="fullName"
                placeholder="Enter your full name"
                value={formData.fullName}
                onChange={(e) => handleInputChange("fullName", e.target.value)}
              />
            </div>
            <div>
              <Label htmlFor="educationLevel">Education Level</Label>
              <Select value={formData.educationLevel} onValueChange={(v) => handleInputChange("educationLevel", v)}>
                <SelectTrigger>
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
              <Label htmlFor="institutionName">School / College / University</Label>
              <Input
                id="institutionName"
                placeholder="Enter your institution name"
                value={formData.institutionName}
                onChange={(e) => handleInputChange("institutionName", e.target.value)}
              />
            </div>
          </div>
        )}

        {step === 2 && (
          <div className="space-y-6">
            <div>
              <Label htmlFor="fieldOfInterest">Which field are you interested in?</Label>
              <Select value={formData.fieldOfInterest} onValueChange={(v) => handleInputChange("fieldOfInterest", v)}>
                <SelectTrigger>
                  <SelectValue placeholder="Select a field" />
                </SelectTrigger>
                <SelectContent>
                  {fieldsOfInterest.map((field) => (
                    <SelectItem key={field} value={field}>{field}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <div>
              <Label htmlFor="targetRole">Target Role (Optional)</Label>
              <Input
                id="targetRole"
                placeholder="e.g., Frontend Developer, Data Analyst"
                value={formData.targetRole}
                onChange={(e) => handleInputChange("targetRole", e.target.value)}
              />
            </div>
          </div>
        )}

        {step === 3 && (
          <div className="space-y-6">
            <div>
              <Label htmlFor="hoursPerWeek">Hours available per week</Label>
              <Select value={formData.hoursPerWeek} onValueChange={(v) => handleInputChange("hoursPerWeek", v)}>
                <SelectTrigger>
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
              <Label htmlFor="goalTimeline">Goal Timeline</Label>
              <Select value={formData.goalTimeline} onValueChange={(v) => handleInputChange("goalTimeline", v)}>
                <SelectTrigger>
                  <SelectValue placeholder="Select timeline" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="short_term">Short Term (1-3 months)</SelectItem>
                  <SelectItem value="medium_term">Medium Term (3-6 months)</SelectItem>
                  <SelectItem value="long_term">Long Term (6+ months)</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div className="p-4 bg-indigo-50 rounded-lg border border-indigo-200">
              <div className="flex items-start gap-3">
                <Sparkles className="w-5 h-5 text-indigo-600 mt-1" />
                <div>
                  <h3 className="font-semibold text-indigo-900 mb-1">AI-Powered Personalization</h3>
                  <p className="text-sm text-indigo-700">Based on your answers, we'll create a personalized learning roadmap, daily guidance, and tailored assessments just for you.</p>
                </div>
              </div>
            </div>
          </div>
        )}

        <div className="flex justify-between mt-8">
          {step > 1 && (
            <Button variant="outline" onClick={() => setStep(step - 1)}>
              Back
            </Button>
          )}
          {step < 3 ? (
            <Button onClick={() => setStep(step + 1)} className="ml-auto">
              Next <ArrowRight className="w-4 h-4 ml-2" />
            </Button>
          ) : (
            <Button onClick={handleSubmit} disabled={loading} className="ml-auto">
              {loading ? "Completing..." : "Complete Setup"}
            </Button>
          )}
        </div>
      </Card>
      <DeveloperWatermark />
    </div>
  );
}
