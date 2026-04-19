import Link from "next/link"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Progress } from "@/components/ui/progress"
import { Briefcase, BookOpen, Target, CheckCircle2 } from "lucide-react"

export default function StudentPortal() {
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
                <div className="h-6 w-6 rounded-full border-2 border-slate-300 flex items-center justify-center">
                  <div className="h-2 w-2 rounded-full bg-slate-300"></div>
                </div>
              </div>
              <div>
                <h4 className="font-semibold text-slate-500">Upcoming: Mock Interview</h4>
                <p className="text-sm text-muted-foreground">Will unlock after certification.</p>
              </div>
            </div>
          </CardContent>
        </Card>
      </main>
    </div>
  )
}
