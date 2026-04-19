import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert"
import { AlertTriangle, BookOpen, Briefcase, GraduationCap, ArrowLeft } from "lucide-react"
import Link from "next/link"

export default function StudentDetailView() {
  return (
    <div className="flex flex-col gap-6">
      <div>
        <Link href="/dashboard/students" className="flex items-center text-sm text-muted-foreground hover:text-slate-900 dark:hover:text-slate-50 mb-4 transition-colors">
          <ArrowLeft className="mr-2 h-4 w-4" /> Back to At-Risk List
        </Link>
        <div className="flex justify-between items-start">
          <div>
            <h2 className="text-3xl font-bold tracking-tight">Rahul Sharma</h2>
            <p className="text-muted-foreground mt-1 flex items-center gap-2">
              <GraduationCap className="h-4 w-4" /> B.Tech Computer Science | Tier 2 Institute
            </p>
          </div>
          <div className="flex gap-2">
            <Button variant="outline">Contact Student</Button>
            <Button variant="default">Log Intervention</Button>
          </div>
        </div>
      </div>

      <div className="grid gap-6 md:grid-cols-3">
        {/* Risk Score Summary Panel */}
        <Card className="md:col-span-1 bg-red-50/50 dark:bg-red-950/20 border-red-200 dark:border-red-900">
          <CardHeader>
            <CardTitle className="text-red-700 dark:text-red-400">Placement Risk Score</CardTitle>
          </CardHeader>
          <CardContent className="flex flex-col items-center justify-center py-6 gap-4">
            <div className="text-6xl font-black text-red-600 dark:text-red-500">85</div>
            <Badge variant="destructive" className="text-sm px-3 py-1 uppercase tracking-wider">Critical Risk</Badge>
            <p className="text-sm text-center text-red-600/80 dark:text-red-400/80 font-medium">
              EMI Repayment Risk: Extreme<br />
              (Due in 3 months)
            </p>
          </CardContent>
        </Card>

        {/* AI Narrative Panel */}
        <Card className="md:col-span-2">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <AlertTriangle className="h-5 w-5 text-amber-500" />
              AI Risk Narrative
            </CardTitle>
            <CardDescription>Generated via LLM using SHAP feature attribution</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="p-4 bg-slate-100 dark:bg-slate-800 rounded-lg text-slate-800 dark:text-slate-200 leading-relaxed border border-slate-200 dark:border-slate-700">
              <p>
                This student's score is elevated primarily due to <span className="font-semibold text-red-500">low internship exposure</span> (0 relevant internships recorded) and <span className="font-semibold text-red-500">below-average placement rates</span> for their specific IT branch at this Tier 2 institute.
              </p>
              <p className="mt-3">
                Furthermore, the IT hiring cycle in their region has contracted <span className="font-semibold text-red-500">18% YoY</span> according to live job portal signals, significantly reducing near-term placement probability.
              </p>
            </div>
          </CardContent>
        </Card>

        {/* Next Best Actions */}
        <Card className="md:col-span-3">
          <CardHeader>
            <CardTitle>Suggested Interventions (Next-Best Actions)</CardTitle>
            <CardDescription>Ranked actions to improve employability before first EMI</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <Alert className="border-blue-200 bg-blue-50 dark:bg-blue-950/40 dark:border-blue-900">
              <BookOpen className="h-4 w-4 text-blue-600" />
              <AlertTitle className="text-blue-800 dark:text-blue-300 font-semibold">Priority 1: Skill-Up Recommendation</AlertTitle>
              <AlertDescription className="text-blue-700 dark:text-blue-400 flex justify-between items-center mt-2">
                <span>Recommend enrollment in Cloud Computing (AWS/Azure) certification via partner portal. High demand in region.</span>
                <Button size="sm" variant="outline" className="bg-white hover:bg-blue-100 border-blue-200 text-blue-700">Trigger Action</Button>
              </AlertDescription>
            </Alert>
            <Alert className="border-emerald-200 bg-emerald-50 dark:bg-emerald-950/40 dark:border-emerald-900">
              <Briefcase className="h-4 w-4 text-emerald-600" />
              <AlertTitle className="text-emerald-800 dark:text-emerald-300 font-semibold">Priority 2: Mock Interview Program</AlertTitle>
              <AlertDescription className="text-emerald-700 dark:text-emerald-400 flex justify-between items-center mt-2">
                <span>Enroll in structured mock interview coaching matched to IT Services sector.</span>
                <Button size="sm" variant="outline" className="bg-white hover:bg-emerald-100 border-emerald-200 text-emerald-700">Trigger Action</Button>
              </AlertDescription>
            </Alert>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
