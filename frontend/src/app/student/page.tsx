import Link from "next/link"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Progress } from "@/components/ui/progress"
import { Briefcase, BookOpen, Target, CheckCircle2, Upload, Loader2, IndianRupee } from "lucide-react"
import { useState } from "react"
import { supabase } from "@/lib/supabase"

export default function StudentPortal() {
  const [resumeText, setResumeText] = useState("")
  const [isScanning, setIsScanning] = useState(false)
  const [scanResult, setScanResult] = useState<any>(null)

  const handleScanResume = async () => {
    if (!resumeText) return;
    setIsScanning(true);
    try {
      const { data: { session } } = await supabase.auth.getSession();
      const res = await fetch("http://localhost:8000/v1/resume/predict-salary", {
        method: "POST",
        headers: { 
          "Content-Type": "application/json",
          Authorization: `Bearer ${session?.access_token}` 
        },
        body: JSON.stringify({ resume_text: resumeText })
      });
      const data = await res.json();
      setScanResult(data);
    } catch (err) {
      console.error(err);
    } finally {
      setIsScanning(false);
    }
  };

  return (
    <div className="flex min-h-screen w-full bg-slate-50 dark:bg-slate-950 flex-col">
      {/* Navigation */}
      <header className="flex h-16 items-center border-b bg-white dark:bg-slate-900 px-6 justify-between">
        <div className="flex items-center gap-2 font-semibold text-lg">
          <Briefcase className="h-6 w-6 text-indigo-600" />
          <span className="bg-gradient-to-r from-indigo-600 to-purple-600 bg-clip-text text-transparent">Career Co-Pilot</span>
        </div>
        <div className="flex items-center gap-4">
          <span className="text-sm font-medium">Rahul Sharma</span>
          <div className="h-8 w-8 rounded-full bg-slate-200 dark:bg-slate-700"></div>
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
          <CardContent className="flex flex-col items-center py-6">
            <div className="relative flex items-center justify-center h-32 w-32 rounded-full border-8 border-amber-500">
              <span className="text-3xl font-bold">55%</span>
            </div>
            <p className="mt-4 text-sm text-center text-muted-foreground">
              You are currently trailing the baseline for Tier 2 Computer Science students.
            </p>
          </CardContent>
        </Card>

        {/* Actionable Roadmap */}
        <Card className="md:col-span-2">
          <CardHeader>
            <CardTitle>Your Personalized Roadmap</CardTitle>
            <CardDescription>Step-by-step path to your first job offer</CardDescription>
          </CardHeader>
          <CardContent className="space-y-6">
            <div className="flex gap-4">
              <div className="flex flex-col items-center">
                <CheckCircle2 className="h-6 w-6 text-green-500" />
                <div className="h-full w-px bg-slate-200 dark:bg-slate-700 my-1"></div>
              </div>
              <div className="pb-6">
                <h4 className="font-semibold text-slate-900 dark:text-slate-100">Semester 6: Resume Upload</h4>
                <p className="text-sm text-muted-foreground">Completed successfully.</p>
              </div>
            </div>

            <div className="flex gap-4">
              <div className="flex flex-col items-center">
                <Target className="h-6 w-6 text-indigo-500" />
                <div className="h-full w-px bg-slate-200 dark:bg-slate-700 my-1"></div>
              </div>
              <div className="pb-6 w-full">
                <div className="flex justify-between items-center mb-2">
                  <h4 className="font-semibold text-indigo-700 dark:text-indigo-400">Current Step: Cloud Certification</h4>
                  <span className="text-xs font-medium px-2 py-1 bg-indigo-100 text-indigo-700 rounded-full">High Impact</span>
                </div>
                <p className="text-sm text-muted-foreground mb-3">
                  Completing an AWS or Azure certification will boost your readiness score by 15%.
                </p>
                <Progress value={30} className="h-2 mb-2" />
                <div className="flex justify-between text-xs text-muted-foreground">
                  <span>In Progress</span>
                  <span>30%</span>
                </div>
              </div>
            </div>

              <div className="flex gap-4">
              <div className="flex flex-col items-center">
                <div className="h-6 w-6 rounded-full border-2 border-indigo-500 flex items-center justify-center">
                  <div className="h-2 w-2 rounded-full bg-indigo-500 animate-pulse"></div>
                </div>
              </div>
              <div className="w-full">
                <div className="flex justify-between items-center">
                  <h4 className="font-semibold text-slate-900 dark:text-white">Active: AI Mock Interview</h4>
                  <Link href="/student/mock-interview">
                    <Button size="sm" className="bg-indigo-600 hover:bg-indigo-700">Start Session</Button>
                  </Link>
                </div>
                <p className="text-sm text-muted-foreground mt-1">Practice your speaking skills and tech confidence with our Voice AI.</p>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* AI Resume Scanner & Salary Predictor */}
        <Card className="md:col-span-3 border-indigo-100 dark:border-indigo-900">
          <CardHeader className="bg-indigo-50/50 dark:bg-indigo-900/10">
            <CardTitle className="flex items-center gap-2 text-indigo-700 dark:text-indigo-400">
              <Upload className="h-5 w-5" /> AI Resume Scanner & Salary Predictor
            </CardTitle>
            <CardDescription>Paste your raw resume text to instantly extract features and predict your starting salary based on our ML model.</CardDescription>
          </CardHeader>
          <CardContent className="pt-6 grid md:grid-cols-2 gap-6">
            <div className="flex flex-col gap-4">
              <textarea 
                className="w-full h-48 p-3 rounded-md border border-input bg-transparent shadow-sm focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring text-sm"
                placeholder="Paste your full text resume here..."
                value={resumeText}
                onChange={(e) => setResumeText(e.target.value)}
              />
              <Button onClick={handleScanResume} disabled={isScanning || !resumeText} className="w-full bg-indigo-600 hover:bg-indigo-700">
                {isScanning ? <><Loader2 className="mr-2 h-4 w-4 animate-spin" /> Scanning with LLM...</> : "Predict Market Salary"}
              </Button>
            </div>
            
            <div className="flex flex-col">
              {scanResult ? (
                <div className="bg-slate-50 dark:bg-slate-900 border rounded-lg p-6 flex flex-col h-full justify-center">
                  <div className="text-center mb-6">
                    <p className="text-sm text-muted-foreground font-medium uppercase tracking-wider mb-2">Predicted Starting Offer</p>
                    <div className="flex items-center justify-center text-5xl font-extrabold text-green-600 dark:text-green-500">
                      <IndianRupee className="h-8 w-8 mr-1 opacity-80" /> {scanResult.predicted_salary_lpa} <span className="text-2xl text-muted-foreground ml-2">LPA</span>
                    </div>
                  </div>
                  
                  <div className="space-y-2 text-sm border-t pt-4">
                    <p className="font-semibold text-slate-700 dark:text-slate-300 mb-3">Extracted Profile:</p>
                    <div className="grid grid-cols-2 gap-x-4 gap-y-2">
                      <div className="flex justify-between border-b pb-1">
                        <span className="text-muted-foreground">Institute Tier</span>
                        <span className="font-medium text-right">{scanResult.extracted_classifications.institute_tier}</span>
                      </div>
                      <div className="flex justify-between border-b pb-1">
                        <span className="text-muted-foreground">Highest Project</span>
                        <span className="font-medium text-right truncate w-32" title={scanResult.extracted_classifications.highest_project_level}>{scanResult.extracted_classifications.highest_project_level}</span>
                      </div>
                      <div className="flex justify-between border-b pb-1">
                        <span className="text-muted-foreground">Coding Rank</span>
                        <span className="font-medium text-right">{scanResult.extracted_classifications.coding_level}</span>
                      </div>
                      <div className="flex justify-between border-b pb-1">
                        <span className="text-muted-foreground">Top Internship</span>
                        <span className="font-medium text-right truncate w-32" title={scanResult.extracted_classifications.highest_internship_level}>{scanResult.extracted_classifications.highest_internship_level}</span>
                      </div>
                    </div>
                  </div>
                </div>
              ) : (
                <div className="border-2 border-dashed rounded-lg flex items-center justify-center h-full text-muted-foreground bg-slate-50/50 dark:bg-slate-900/50">
                  Waiting for resume...
                </div>
              )}
            </div>
          </CardContent>
        </Card>
      </main>
    </div>
  )
}
