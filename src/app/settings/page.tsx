"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { 
  GraduationCap, Save, ArrowLeft, CheckCircle, Download, FileJson, 
  FileSpreadsheet, FileText, Sun, Moon, Map, BarChart3, Trophy, ClipboardList
} from "lucide-react";
import { DeveloperWatermark } from "@/components/DeveloperWatermark";
import { useTheme } from "@/components/ThemeProvider";
import { createClient } from "@/lib/supabase/client";
import Link from "next/link";
import { motion } from "framer-motion";

const availableFields = [
  "Web Development",
  "Mobile Development",
  "Data Science & AI",
  "Cloud Computing",
  "Cybersecurity",
  "DevOps",
  "Blockchain",
  "Game Development"
];

export default function SettingsPage() {
  const router = useRouter();
  const { theme, toggleTheme } = useTheme();
  const [saved, setSaved] = useState(false);
  const [loading, setLoading] = useState(true);
  const [exporting, setExporting] = useState(false);
  const [settings, setSettings] = useState({
    fullName: "",
    email: "",
    fieldOfInterest: "",
    targetRole: "",
    educationLevel: "",
    institutionName: "",
  });
  const [userData, setUserData] = useState<any>({
    profile: null,
    progress: [],
    assignments: [],
    achievements: [],
    roadmap: null
  });

  useEffect(() => {
    loadUserData();
  }, []);

  async function loadUserData() {
    const supabase = createClient();
    const { data: { user } } = await supabase.auth.getUser();

    if (!user) {
      router.push("/login");
      return;
    }

    const { data: profileArr } = await supabase
      .from("user_profiles")
      .select("*")
      .eq("id", user.id);

    const profile = profileArr?.[0];

    if (!profile?.onboarding_completed) {
      router.push("/onboarding");
      return;
    }

    if (profile) {
      setSettings({
        fullName: profile.full_name || "",
        email: profile.email || user.email || "",
        fieldOfInterest: profile.field_of_interest || "",
        targetRole: profile.target_role || "",
        educationLevel: profile.education_level || "",
        institutionName: profile.institution_name || "",
      });
    }

    const { data: progress } = await supabase
      .from("topic_progress")
      .select("*")
      .eq("user_id", user.id);

    const { data: assignments } = await supabase
      .from("assignment_submissions")
      .select("*")
      .eq("user_id", user.id);

    setUserData({
      profile,
      progress: progress || [],
      assignments: assignments || [],
      achievements: [],
      roadmap: profile?.field_of_interest ? generateRoadmap(profile.field_of_interest) : null
    });

    setLoading(false);
  }

  function generateRoadmap(field: string) {
    const roadmaps: Record<string, any> = {
      "Web Development": {
        phases: [
          { name: "Foundation", topics: ["HTML", "CSS", "JavaScript Basics"], duration: "4 weeks" },
          { name: "Frontend", topics: ["React/Vue/Angular", "State Management", "Responsive Design"], duration: "6 weeks" },
          { name: "Backend", topics: ["Node.js/Python", "REST APIs", "Databases"], duration: "6 weeks" },
          { name: "Advanced", topics: ["TypeScript", "Testing", "Deployment"], duration: "4 weeks" }
        ]
      },
      "Data Science & AI": {
        phases: [
          { name: "Foundation", topics: ["Python", "Statistics", "Linear Algebra"], duration: "4 weeks" },
          { name: "Data Analysis", topics: ["Pandas", "NumPy", "Data Visualization"], duration: "4 weeks" },
          { name: "Machine Learning", topics: ["Scikit-learn", "Supervised Learning", "Unsupervised Learning"], duration: "6 weeks" },
          { name: "Deep Learning", topics: ["Neural Networks", "TensorFlow/PyTorch", "NLP/CV"], duration: "6 weeks" }
        ]
      },
      "Cybersecurity": {
        phases: [
          { name: "Foundation", topics: ["Networking", "Operating Systems", "Linux"], duration: "4 weeks" },
          { name: "Security Basics", topics: ["Cryptography", "Security Protocols", "Risk Assessment"], duration: "4 weeks" },
          { name: "Offensive Security", topics: ["Penetration Testing", "Ethical Hacking", "Vulnerability Assessment"], duration: "6 weeks" },
          { name: "Defensive Security", topics: ["Incident Response", "SIEM", "Security Architecture"], duration: "6 weeks" }
        ]
      }
    };
    return roadmaps[field] || { phases: [{ name: "Custom Learning Path", topics: ["Explore resources"], duration: "Flexible" }] };
  }

  const handleSave = async () => {
    const supabase = createClient();
    const { data: { user } } = await supabase.auth.getUser();

    if (user) {
      await supabase.from("user_profiles").update({
        full_name: settings.fullName,
        education_level: settings.educationLevel,
        institution_name: settings.institutionName,
        field_of_interest: settings.fieldOfInterest,
        target_role: settings.targetRole
      }).eq("id", user.id);

      setSaved(true);
      setTimeout(() => setSaved(false), 3000);
    }
  };

  const exportData = async (format: "json" | "csv" | "pdf", dataType: "all" | "progress" | "roadmap" | "assignments") => {
    setExporting(true);
    
    let dataToExport: any = {};
    let filename = `shrivasta_ai_${dataType}_${new Date().toISOString().split('T')[0]}`;

    if (dataType === "all" || dataType === "progress") {
      dataToExport.profile = {
        name: settings.fullName,
        email: settings.email,
        education: settings.educationLevel,
        institution: settings.institutionName,
        field: settings.fieldOfInterest,
        targetRole: settings.targetRole
      };
      dataToExport.progress = userData.progress.map((p: any) => ({
        topic: p.topic_id,
        status: p.status,
        score: p.score,
        completedAt: p.completed_at
      }));
      dataToExport.stats = {
        topicsCompleted: userData.progress.filter((p: any) => p.status === "completed").length,
        assignmentsCompleted: userData.assignments.length,
        averageScore: userData.assignments.length > 0 
          ? Math.round(userData.assignments.reduce((a: number, b: any) => a + (b.percentage || 0), 0) / userData.assignments.length)
          : 0
      };
    }

    if (dataType === "all" || dataType === "roadmap") {
      dataToExport.roadmap = userData.roadmap;
    }

    if (dataType === "all" || dataType === "assignments") {
      dataToExport.assignments = userData.assignments.map((a: any) => ({
        id: a.assignment_id,
        score: a.percentage,
        completedAt: a.submitted_at
      }));
    }

    if (format === "json") {
      const blob = new Blob([JSON.stringify(dataToExport, null, 2)], { type: "application/json" });
      downloadBlob(blob, `${filename}.json`);
    } else if (format === "csv") {
      let csv = "";
      
      if (dataToExport.profile) {
        csv += "=== PROFILE ===\n";
        csv += "Name,Email,Education,Institution,Field,Target Role\n";
        csv += `"${dataToExport.profile.name}","${dataToExport.profile.email}","${dataToExport.profile.education}","${dataToExport.profile.institution}","${dataToExport.profile.field}","${dataToExport.profile.targetRole}"\n\n`;
      }

      if (dataToExport.stats) {
        csv += "=== STATISTICS ===\n";
        csv += "Topics Completed,Assignments Completed,Average Score\n";
        csv += `${dataToExport.stats.topicsCompleted},${dataToExport.stats.assignmentsCompleted},${dataToExport.stats.averageScore}%\n\n`;
      }

      if (dataToExport.roadmap) {
        csv += "=== ROADMAP ===\n";
        csv += "Phase,Topics,Duration\n";
        dataToExport.roadmap.phases.forEach((phase: any) => {
          csv += `"${phase.name}","${phase.topics.join(', ')}","${phase.duration}"\n`;
        });
        csv += "\n";
      }

      if (dataToExport.progress && dataToExport.progress.length > 0) {
        csv += "=== PROGRESS ===\n";
        csv += "Topic,Status,Score,Completed At\n";
        dataToExport.progress.forEach((p: any) => {
          csv += `"${p.topic}","${p.status}","${p.score || 'N/A'}","${p.completedAt || 'N/A'}"\n`;
        });
      }

      const blob = new Blob([csv], { type: "text/csv" });
      downloadBlob(blob, `${filename}.csv`);
    } else if (format === "pdf") {
      let html = `
        <html>
        <head>
          <title>Shrivasta AI - Learning Report</title>
          <style>
            body { font-family: Arial, sans-serif; padding: 40px; }
            h1 { color: #10b981; }
            h2 { color: #6366f1; margin-top: 30px; }
            table { width: 100%; border-collapse: collapse; margin: 15px 0; }
            th, td { border: 1px solid #ddd; padding: 10px; text-align: left; }
            th { background: #f3f4f6; }
            .stat { display: inline-block; margin: 10px 20px 10px 0; padding: 15px; background: #f0fdf4; border-radius: 8px; }
            .stat-value { font-size: 24px; font-weight: bold; color: #10b981; }
            .stat-label { font-size: 12px; color: #666; }
          </style>
        </head>
        <body>
          <h1>🎓 Shrivasta AI Learning Report</h1>
          <p>Generated on ${new Date().toLocaleDateString()}</p>
      `;

      if (dataToExport.profile) {
        html += `
          <h2>Profile</h2>
          <table>
            <tr><th>Name</th><td>${dataToExport.profile.name}</td></tr>
            <tr><th>Email</th><td>${dataToExport.profile.email}</td></tr>
            <tr><th>Education</th><td>${dataToExport.profile.education}</td></tr>
            <tr><th>Institution</th><td>${dataToExport.profile.institution}</td></tr>
            <tr><th>Field of Interest</th><td>${dataToExport.profile.field}</td></tr>
            <tr><th>Target Role</th><td>${dataToExport.profile.targetRole}</td></tr>
          </table>
        `;
      }

      if (dataToExport.stats) {
        html += `
          <h2>Statistics</h2>
          <div class="stat">
            <div class="stat-value">${dataToExport.stats.topicsCompleted}</div>
            <div class="stat-label">Topics Completed</div>
          </div>
          <div class="stat">
            <div class="stat-value">${dataToExport.stats.assignmentsCompleted}</div>
            <div class="stat-label">Assignments</div>
          </div>
          <div class="stat">
            <div class="stat-value">${dataToExport.stats.averageScore}%</div>
            <div class="stat-label">Average Score</div>
          </div>
        `;
      }

      if (dataToExport.roadmap) {
        html += `<h2>Learning Roadmap</h2><table><tr><th>Phase</th><th>Topics</th><th>Duration</th></tr>`;
        dataToExport.roadmap.phases.forEach((phase: any) => {
          html += `<tr><td>${phase.name}</td><td>${phase.topics.join(', ')}</td><td>${phase.duration}</td></tr>`;
        });
        html += `</table>`;
      }

      html += `</body></html>`;

      const blob = new Blob([html], { type: "text/html" });
      downloadBlob(blob, `${filename}.html`);
    }

    setExporting(false);
  };

  const downloadBlob = (blob: Blob, filename: string) => {
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = filename;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  };

  if (loading) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-background">
        <div className="text-center">
          <GraduationCap className="mx-auto h-12 w-12 animate-pulse text-primary" />
          <p className="mt-4 text-muted-foreground">Loading settings...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background text-foreground transition-colors duration-300">
      <div className="fixed inset-0 bg-[radial-gradient(ellipse_at_top,_var(--tw-gradient-stops))] from-primary/10 via-transparent to-transparent pointer-events-none" />

      <header className="sticky top-0 z-50 border-b border-border bg-background/80 backdrop-blur-xl">
        <div className="mx-auto flex h-16 max-w-7xl items-center justify-between px-4 sm:px-6 lg:px-8">
          <Link href="/dashboard" className="flex items-center gap-3">
            <div className="relative">
              <div className="absolute inset-0 rounded-xl bg-gradient-to-br from-emerald-500 to-cyan-500 blur-lg opacity-50" />
              <div className="relative flex h-10 w-10 items-center justify-center rounded-xl bg-gradient-to-br from-emerald-500 to-cyan-500">
                <GraduationCap className="h-5 w-5 text-white" />
              </div>
            </div>
            <div>
              <h1 className="text-lg font-bold text-foreground">Settings</h1>
              <p className="text-[10px] text-primary font-medium tracking-wide">ACCOUNT & DATA</p>
            </div>
          </Link>
          <div className="flex items-center gap-2">
            <Button variant="ghost" size="sm" onClick={toggleTheme} className="text-muted-foreground hover:text-foreground">
              {theme === "dark" ? <Sun className="h-4 w-4" /> : <Moon className="h-4 w-4" />}
            </Button>
            <Link href="/dashboard">
              <Button variant="ghost" size="sm" className="text-muted-foreground hover:text-foreground">
                <ArrowLeft className="h-4 w-4 mr-2" />
                Dashboard
              </Button>
            </Link>
          </div>
        </div>
      </header>

      <main className="mx-auto max-w-4xl px-4 py-8 sm:px-6 lg:px-8 relative">
        {saved && (
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            className="mb-6 flex items-center gap-2 rounded-lg bg-emerald-500/10 border border-emerald-500/20 p-4 text-emerald-500"
          >
            <CheckCircle className="h-5 w-5" />
            <span>Settings saved successfully!</span>
          </motion.div>
        )}

        <div className="space-y-6">
          <Card className="bg-card/50 border-border backdrop-blur-sm">
            <CardHeader>
              <CardTitle className="text-foreground">Personal Information</CardTitle>
              <CardDescription className="text-muted-foreground">Update your profile details</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <label className="mb-2 block text-sm font-medium text-foreground">Full Name</label>
                <Input
                  value={settings.fullName}
                  onChange={(e) => setSettings({ ...settings, fullName: e.target.value })}
                  className="bg-muted/30 border-border"
                />
              </div>
              <div>
                <label className="mb-2 block text-sm font-medium text-foreground">Email Address</label>
                <Input
                  type="email"
                  value={settings.email}
                  disabled
                  className="bg-muted/50 border-border text-muted-foreground"
                />
                <p className="mt-1 text-xs text-muted-foreground">Email cannot be changed</p>
              </div>
            </CardContent>
          </Card>

          <Card className="bg-card/50 border-border backdrop-blur-sm">
            <CardHeader>
              <CardTitle className="text-foreground">Education & Career</CardTitle>
              <CardDescription className="text-muted-foreground">Your learning preferences</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <label className="mb-2 block text-sm font-medium text-foreground">Education Level</label>
                <Select value={settings.educationLevel} onValueChange={(value) => setSettings({ ...settings, educationLevel: value })}>
                  <SelectTrigger className="bg-muted/30 border-border">
                    <SelectValue placeholder="Select education level" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="10th Grade">10th Grade</SelectItem>
                    <SelectItem value="12th Grade">12th Grade</SelectItem>
                    <SelectItem value="Undergraduate">Undergraduate</SelectItem>
                    <SelectItem value="Postgraduate">Postgraduate</SelectItem>
                    <SelectItem value="Working Professional">Working Professional</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div>
                <label className="mb-2 block text-sm font-medium text-foreground">Institution Name</label>
                <Input
                  value={settings.institutionName}
                  onChange={(e) => setSettings({ ...settings, institutionName: e.target.value })}
                  className="bg-muted/30 border-border"
                />
              </div>
              <div>
                <label className="mb-2 block text-sm font-medium text-foreground">Field of Interest</label>
                <Select value={settings.fieldOfInterest} onValueChange={(value) => setSettings({ ...settings, fieldOfInterest: value })}>
                  <SelectTrigger className="bg-muted/30 border-border">
                    <SelectValue placeholder="Select field" />
                  </SelectTrigger>
                  <SelectContent>
                    {availableFields.map((field) => (
                      <SelectItem key={field} value={field}>{field}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              <div>
                <label className="mb-2 block text-sm font-medium text-foreground">Target Role</label>
                <Input
                  value={settings.targetRole}
                  onChange={(e) => setSettings({ ...settings, targetRole: e.target.value })}
                  placeholder="e.g., Full Stack Developer"
                  className="bg-muted/30 border-border"
                />
              </div>
            </CardContent>
          </Card>

          <Card className="bg-card/50 border-border backdrop-blur-sm">
            <CardHeader>
              <CardTitle className="text-foreground flex items-center gap-2">
                <Download className="h-5 w-5 text-primary" />
                Export Your Data
              </CardTitle>
              <CardDescription className="text-muted-foreground">Download your progress, roadmap, and learning data</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid gap-4 md:grid-cols-2">
                <Card className="bg-muted/30 border-border">
                  <CardHeader className="pb-2">
                    <CardTitle className="text-base text-foreground flex items-center gap-2">
                      <BarChart3 className="h-4 w-4 text-emerald-500" />
                      All Progress Data
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-2">
                    <Button variant="outline" className="w-full justify-start" onClick={() => exportData("json", "all")} disabled={exporting}>
                      <FileJson className="h-4 w-4 mr-2 text-amber-500" />
                      Export as JSON
                    </Button>
                    <Button variant="outline" className="w-full justify-start" onClick={() => exportData("csv", "all")} disabled={exporting}>
                      <FileSpreadsheet className="h-4 w-4 mr-2 text-emerald-500" />
                      Export as CSV
                    </Button>
                    <Button variant="outline" className="w-full justify-start" onClick={() => exportData("pdf", "all")} disabled={exporting}>
                      <FileText className="h-4 w-4 mr-2 text-red-500" />
                      Export as HTML Report
                    </Button>
                  </CardContent>
                </Card>

                <Card className="bg-muted/30 border-border">
                  <CardHeader className="pb-2">
                    <CardTitle className="text-base text-foreground flex items-center gap-2">
                      <Map className="h-4 w-4 text-violet-500" />
                      Learning Roadmap
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-2">
                    <Button variant="outline" className="w-full justify-start" onClick={() => exportData("json", "roadmap")} disabled={exporting}>
                      <FileJson className="h-4 w-4 mr-2 text-amber-500" />
                      Roadmap JSON
                    </Button>
                    <Button variant="outline" className="w-full justify-start" onClick={() => exportData("csv", "roadmap")} disabled={exporting}>
                      <FileSpreadsheet className="h-4 w-4 mr-2 text-emerald-500" />
                      Roadmap CSV
                    </Button>
                  </CardContent>
                </Card>

                <Card className="bg-muted/30 border-border">
                  <CardHeader className="pb-2">
                    <CardTitle className="text-base text-foreground flex items-center gap-2">
                      <Trophy className="h-4 w-4 text-amber-500" />
                      Progress Only
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-2">
                    <Button variant="outline" className="w-full justify-start" onClick={() => exportData("json", "progress")} disabled={exporting}>
                      <FileJson className="h-4 w-4 mr-2 text-amber-500" />
                      Progress JSON
                    </Button>
                    <Button variant="outline" className="w-full justify-start" onClick={() => exportData("csv", "progress")} disabled={exporting}>
                      <FileSpreadsheet className="h-4 w-4 mr-2 text-emerald-500" />
                      Progress CSV
                    </Button>
                  </CardContent>
                </Card>

                <Card className="bg-muted/30 border-border">
                  <CardHeader className="pb-2">
                    <CardTitle className="text-base text-foreground flex items-center gap-2">
                      <ClipboardList className="h-4 w-4 text-pink-500" />
                      Assignments
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-2">
                    <Button variant="outline" className="w-full justify-start" onClick={() => exportData("json", "assignments")} disabled={exporting}>
                      <FileJson className="h-4 w-4 mr-2 text-amber-500" />
                      Assignments JSON
                    </Button>
                    <Button variant="outline" className="w-full justify-start" onClick={() => exportData("csv", "assignments")} disabled={exporting}>
                      <FileSpreadsheet className="h-4 w-4 mr-2 text-emerald-500" />
                      Assignments CSV
                    </Button>
                  </CardContent>
                </Card>
              </div>
            </CardContent>
          </Card>

          <Button onClick={handleSave} className="w-full gap-2 bg-gradient-to-r from-emerald-500 to-cyan-500" size="lg">
            <Save className="h-4 w-4" />
            Save Changes
          </Button>
        </div>
      </main>
      <DeveloperWatermark />
    </div>
  );
}
