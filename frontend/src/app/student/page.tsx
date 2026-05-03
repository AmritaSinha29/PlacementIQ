"use client";

import Link from "next/link";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import {
  Briefcase, BookOpen, Target, CheckCircle2, Upload,
  Loader2, IndianRupee, LogOut, BarChart3, Mic,
} from "lucide-react";
import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";

export default function StudentPortal() {
  const router = useRouter();
  const [resumeFile, setResumeFile] = useState<File | null>(null);
  const [isScanning, setIsScanning] = useState(false);
  const [scanResult, setScanResult] = useState<any>(null);
  const [authChecked, setAuthChecked] = useState(false);

  useEffect(() => {
    if (!localStorage.getItem("placement_iq_token")) {
      router.push("/login");
    } else {
      setAuthChecked(true);
    }
  }, [router]);

  const handleLogout = () => {
    localStorage.removeItem("placement_iq_token");
    localStorage.removeItem("placement_iq_role");
    router.push("/login");
  };

  const handleScanResume = async () => {
    if (!resumeFile) return;
    setIsScanning(true);
    setScanResult(null);
    try {
      const token = localStorage.getItem("placement_iq_token");
      const formData = new FormData();
      formData.append("resume", resumeFile);
      const res = await fetch("http://localhost:8000/v1/resume/predict-salary", {
        method: "POST",
        headers: { Authorization: `Bearer ${token}` },
        body: formData,
      });
      if (!res.ok) throw new Error(await res.text());
      setScanResult(await res.json());
    } catch (err) {
      console.error(err);
      alert("Failed to process document. Please ensure it's a valid PDF or DOCX and the backend is running.");
    } finally {
      setIsScanning(false);
    }
  };

  // Auth loading guard — prevents content flash before redirect
  if (!authChecked) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-slate-50 dark:bg-slate-950">
        <Loader2 className="h-8 w-8 animate-spin text-indigo-500" />
      </div>
    );
  }

  return (
    <div className="flex min-h-screen w-full bg-slate-50 dark:bg-slate-950 flex-col">
      {/* Navigation */}
      <header className="flex h-16 items-center border-b bg-white dark:bg-slate-900 px-6 justify-between shrink-0">
        <div className="flex items-center gap-2 font-semibold text-lg">
          <Briefcase className="h-6 w-6 text-indigo-600" />
          <span className="bg-gradient-to-r from-indigo-600 to-purple-600 bg-clip-text text-transparent">
            Career Co-Pilot
          </span>
        </div>
        <div className="flex items-center gap-3">
          <Link
            href="/dashboard"
            className="hidden md:flex items-center gap-1.5 text-sm font-medium text-slate-500 hover:text-slate-900 dark:hover:text-white border border-slate-200 dark:border-slate-700 px-3 py-1.5 rounded-lg transition-colors"
          >
            <BarChart3 className="h-3.5 w-3.5" />
            Lender View
          </Link>
          <div className="flex items-center gap-2">
            <div className="h-8 w-8 rounded-full bg-gradient-to-br from-indigo-500 to-purple-600 flex items-center justify-center text-white text-xs font-bold">
              RS
            </div>
            <span className="text-sm font-medium hidden sm:block">Rahul Sharma</span>
          </div>
          <button
            onClick={handleLogout}
            className="p-2 rounded-lg text-slate-400 hover:text-slate-600 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
            title="Logout"
          >
            <LogOut className="h-4 w-4" />
          </button>
        </div>
      </header>

      {/* Main Content */}
      <main className="flex-1 p-6 max-w-5xl mx-auto w-full grid gap-6 md:grid-cols-3">
        {/* Readiness Score */}
        <Card className="md:col-span-1">
          <CardHeader>
            <CardTitle>Placement Readiness</CardTitle>
            <CardDescription>Your current probability of placement before graduation</CardDescription>
          </CardHeader>
          <CardContent className="flex flex-col items-center py-6 gap-4">
            {/* Circular score display */}
            <div className="relative h-36 w-36">
              <svg className="w-full h-full -rotate-90" viewBox="0 0 36 36">
                <circle
                  cx="18" cy="18" r="15.9"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2.5"
                  className="text-slate-100 dark:text-slate-800"
                />
                <circle
                  cx="18" cy="18" r="15.9"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2.5"
                  strokeDasharray={`${55} ${100 - 55}`}
                  strokeLinecap="round"
                  className="text-amber-500 transition-all duration-700"
                />
              </svg>
              <div className="absolute inset-0 flex flex-col items-center justify-center">
                <span className="text-3xl font-black text-slate-900 dark:text-white">55%</span>
                <span className="text-xs font-medium text-amber-500 uppercase tracking-wider">Medium</span>
              </div>
            </div>
            <p className="text-sm text-center text-muted-foreground leading-relaxed">
              Trailing the Tier 2 CS baseline by <strong>12 points</strong>. Complete 2 recommended actions to reach the safe zone.
            </p>
            <div className="w-full space-y-1.5">
              <div className="flex justify-between text-xs text-muted-foreground">
                <span>Towards Safe Zone (75%)</span>
                <span>55 / 75</span>
              </div>
              <Progress value={(55 / 75) * 100} className="h-2" />
            </div>
          </CardContent>
        </Card>

        {/* Actionable Roadmap */}
        <Card className="md:col-span-2">
          <CardHeader>
            <CardTitle>Your Personalized Roadmap</CardTitle>
            <CardDescription>Step-by-step path to your first job offer</CardDescription>
          </CardHeader>
          <CardContent className="space-y-5">
            {/* Step 1 — Done */}
            <div className="flex gap-4">
              <div className="flex flex-col items-center shrink-0">
                <CheckCircle2 className="h-6 w-6 text-green-500" />
                <div className="flex-1 w-px bg-slate-200 dark:bg-slate-700 my-1" />
              </div>
              <div className="pb-5">
                <h4 className="font-semibold text-slate-900 dark:text-slate-100">
                  Semester 6: Resume Upload ✓
                </h4>
                <p className="text-sm text-muted-foreground">Completed successfully.</p>
              </div>
            </div>

            {/* Step 2 — In progress */}
            <div className="flex gap-4">
              <div className="flex flex-col items-center shrink-0">
                <Target className="h-6 w-6 text-indigo-500" />
                <div className="flex-1 w-px bg-slate-200 dark:bg-slate-700 my-1" />
              </div>
              <div className="pb-5 w-full">
                <div className="flex justify-between items-center mb-1.5">
                  <h4 className="font-semibold text-indigo-700 dark:text-indigo-400">
                    Cloud Certification (AWS/Azure)
                  </h4>
                  <span className="text-xs font-medium px-2 py-0.5 bg-indigo-100 text-indigo-700 rounded-full dark:bg-indigo-900/30 dark:text-indigo-400">
                    +15% score
                  </span>
                </div>
                <p className="text-sm text-muted-foreground mb-2">
                  Completing a cloud certification boosts readiness by 15 points.
                </p>
                <Progress value={30} className="h-2 mb-1.5" />
                <div className="flex justify-between text-xs text-muted-foreground">
                  <span>In Progress</span>
                  <span>30%</span>
                </div>
              </div>
            </div>

            {/* Step 3 — Active */}
            <div className="flex gap-4">
              <div className="flex flex-col items-center shrink-0">
                <div className="h-6 w-6 rounded-full border-2 border-indigo-500 flex items-center justify-center">
                  <div className="h-2 w-2 rounded-full bg-indigo-500 animate-pulse" />
                </div>
              </div>
              <div className="w-full">
                <div className="flex justify-between items-center">
                  <h4 className="font-semibold text-slate-900 dark:text-white flex items-center gap-2">
                    <Mic className="h-4 w-4 text-indigo-500" />
                    AI Mock Interview
                  </h4>
                  <Link href="/student/mock-interview">
                    <Button size="sm" className="bg-indigo-600 hover:bg-indigo-700 text-white">
                      Start Session →
                    </Button>
                  </Link>
                </div>
                <p className="text-sm text-muted-foreground mt-1">
                  Practice technical communication — voice + body language scored by AI.
                </p>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* AI Resume Scanner */}
        <Card className="md:col-span-3 border-indigo-100 dark:border-indigo-900">
          <CardHeader className="bg-gradient-to-r from-indigo-50/80 to-purple-50/80 dark:from-indigo-900/20 dark:to-purple-900/20 rounded-t-xl">
            <CardTitle className="flex items-center gap-2 text-indigo-700 dark:text-indigo-400">
              <Upload className="h-5 w-5" />
              AI Resume Scanner &amp; Salary Predictor
            </CardTitle>
            <CardDescription>
              Upload your PDF or DOCX resume. Our LLM extracts your profile and the ML model predicts your starting salary.
            </CardDescription>
          </CardHeader>
          <CardContent className="pt-6 grid md:grid-cols-2 gap-6">
            {/* Upload panel */}
            <div className="flex flex-col gap-4">
              <label
                htmlFor="resume-upload"
                className="border-2 border-dashed border-indigo-200 dark:border-indigo-800 rounded-xl p-8 flex flex-col items-center justify-center bg-white dark:bg-slate-900 h-48 cursor-pointer hover:bg-indigo-50/50 dark:hover:bg-indigo-900/20 transition-colors group"
              >
                <Upload className="h-10 w-10 text-indigo-300 group-hover:text-indigo-500 mb-3 transition-colors" />
                <p className="text-sm font-medium text-slate-700 dark:text-slate-300 text-center">
                  {resumeFile ? (
                    <span className="text-indigo-600 font-semibold">{resumeFile.name}</span>
                  ) : (
                    "Click or drag & drop your resume"
                  )}
                </p>
                <p className="text-xs text-slate-400 mt-1.5">PDF, DOCX supported</p>
                <input
                  id="resume-upload"
                  type="file"
                  accept=".pdf,.docx,.txt"
                  className="hidden"
                  onChange={(e) => { setResumeFile(e.target.files?.[0] || null); setScanResult(null); }}
                />
              </label>
              <Button
                onClick={handleScanResume}
                disabled={isScanning || !resumeFile}
                className="w-full bg-indigo-600 hover:bg-indigo-700 disabled:opacity-50"
              >
                {isScanning ? (
                  <><Loader2 className="mr-2 h-4 w-4 animate-spin" /> Extracting with LLM...</>
                ) : (
                  "Predict Market Salary"
                )}
              </Button>
              {!resumeFile && (
                <p className="text-xs text-center text-slate-400">
                  Backend must be running on port 8000 with a valid GROQ_API_KEY.
                </p>
              )}
            </div>

            {/* Result panel */}
            <div className="flex flex-col">
              {scanResult ? (
                <div className="bg-slate-50 dark:bg-slate-900 border rounded-xl p-6 flex flex-col h-full justify-center gap-4">
                  <div className="text-center">
                    <p className="text-xs text-muted-foreground font-semibold uppercase tracking-widest mb-2">
                      Predicted Starting Offer
                    </p>
                    <div className="flex items-center justify-center text-5xl font-extrabold text-green-600 dark:text-green-500 gap-1">
                      <IndianRupee className="h-8 w-8 opacity-80" />
                      {scanResult.predicted_salary_lpa}
                      <span className="text-2xl text-muted-foreground ml-1">LPA</span>
                    </div>
                  </div>

                  <div className="border-t pt-4 space-y-2 text-sm">
                    <p className="font-semibold text-slate-700 dark:text-slate-300">Extracted Profile:</p>
                    <div className="grid grid-cols-2 gap-x-4 gap-y-1.5">
                      {[
                        ["Institute Tier", scanResult.extracted_classifications.institute_tier],
                        ["Highest Project", scanResult.extracted_classifications.highest_project_level],
                        ["Coding Level", scanResult.extracted_classifications.coding_level],
                        ["Top Internship", scanResult.extracted_classifications.highest_internship_level],
                        ["Hackathon", scanResult.extracted_classifications.highest_hackathon_level],
                        ["CGPA", scanResult.extracted_classifications.cgpa],
                      ].map(([label, val]) => (
                        <div key={label as string} className="flex justify-between border-b pb-1">
                          <span className="text-muted-foreground">{label}</span>
                          <span className="font-medium text-right truncate max-w-[120px]" title={String(val)}>
                            {val}
                          </span>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              ) : (
                <div className="border-2 border-dashed rounded-xl flex flex-col items-center justify-center h-full text-muted-foreground bg-slate-50/50 dark:bg-slate-900/50 gap-3 p-6">
                  <BookOpen className="h-10 w-10 text-slate-200 dark:text-slate-700" />
                  <p className="text-sm text-center">
                    Upload your resume and click <strong>Predict Market Salary</strong> to see your AI-powered results.
                  </p>
                </div>
              )}
            </div>
          </CardContent>
        </Card>
      </main>
    </div>
  );
}
