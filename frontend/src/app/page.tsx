import Link from "next/link";
import {
  Building2, GraduationCap, ArrowRight, Activity,
  LineChart, BrainCircuit, Target, ShieldCheck, Zap, Users,
} from "lucide-react";

export default function Home() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-white to-indigo-50/30 dark:from-slate-950 dark:via-slate-950 dark:to-indigo-950/20 flex flex-col items-center justify-center p-6">
      <div className="max-w-4xl w-full space-y-12">

        {/* Header */}
        <div className="text-center space-y-4">
          <div className="flex justify-center mb-6">
            <div className="h-16 w-16 bg-gradient-to-br from-indigo-600 to-purple-600 rounded-2xl flex items-center justify-center shadow-lg shadow-indigo-600/25 ring-4 ring-indigo-100 dark:ring-indigo-900/30">
              <Activity className="h-8 w-8 text-white" />
            </div>
          </div>
          <h1 className="text-5xl font-extrabold tracking-tight text-slate-900 dark:text-white">
            Placement<span className="text-indigo-600">IQ</span>
          </h1>
          <p className="text-xl text-slate-500 dark:text-slate-400 max-w-2xl mx-auto leading-relaxed">
            AI-powered employability tracking and placement risk mitigation for education lending.
          </p>
        </div>

        {/* Stats row */}
        <div className="grid grid-cols-3 gap-6">
          {[
            { icon: Users, label: "Students Tracked", value: "5,000+" },
            { icon: ShieldCheck, label: "Risk Accuracy", value: "94.2%" },
            { icon: Zap, label: "Prediction Time", value: "< 2s" },
          ].map(({ icon: Icon, label, value }) => (
            <div key={label} className="text-center">
              <Icon className="h-5 w-5 text-indigo-400 mx-auto mb-1" />
              <div className="text-2xl font-bold text-slate-900 dark:text-white">{value}</div>
              <div className="text-xs text-muted-foreground mt-0.5">{label}</div>
            </div>
          ))}
        </div>

        {/* Portal Selection Cards */}
        <div className="grid md:grid-cols-2 gap-6">

          {/* Lender Portal Card */}
          <Link href="/dashboard" className="group block">
            <div className="h-full bg-white dark:bg-slate-900 rounded-3xl p-8 border border-slate-200 dark:border-slate-800 shadow-sm transition-all duration-300 hover:shadow-xl hover:shadow-blue-500/10 hover:-translate-y-1 hover:border-blue-200 dark:hover:border-blue-800 flex flex-col">
              <div className="h-14 w-14 bg-blue-50 dark:bg-blue-900/30 text-blue-600 dark:text-blue-400 rounded-2xl flex items-center justify-center mb-6 group-hover:scale-110 group-hover:bg-blue-100 transition-all duration-300">
                <Building2 className="h-7 w-7" />
              </div>
              <h2 className="text-2xl font-bold text-slate-900 dark:text-white mb-3 flex items-center justify-between">
                Lender Dashboard
                <ArrowRight className="h-5 w-5 text-slate-300 group-hover:text-blue-600 group-hover:translate-x-1 transition-all duration-300" />
              </h2>
              <p className="text-slate-500 dark:text-slate-400 flex-1 leading-relaxed text-sm">
                For Banks and NBFCs. Monitor real-time portfolio risk, track student employability scores, and manage at-risk loans before defaults happen.
              </p>

              <div className="mt-6 pt-6 border-t border-slate-100 dark:border-slate-800 grid grid-cols-2 gap-3">
                <div className="flex items-center gap-2 text-sm text-slate-600 dark:text-slate-400">
                  <LineChart className="h-4 w-4 text-blue-500 shrink-0" />
                  Risk Tracking
                </div>
                <div className="flex items-center gap-2 text-sm text-slate-600 dark:text-slate-400">
                  <Activity className="h-4 w-4 text-blue-500 shrink-0" />
                  Alert Inbox
                </div>
                <div className="flex items-center gap-2 text-sm text-slate-600 dark:text-slate-400">
                  <Users className="h-4 w-4 text-blue-500 shrink-0" />
                  At-Risk Students
                </div>
                <div className="flex items-center gap-2 text-sm text-slate-600 dark:text-slate-400">
                  <ShieldCheck className="h-4 w-4 text-blue-500 shrink-0" />
                  What-If Scenarios
                </div>
              </div>
            </div>
          </Link>

          {/* Student Portal Card */}
          <Link href="/login" className="group block">
            <div className="h-full bg-white dark:bg-slate-900 rounded-3xl p-8 border border-slate-200 dark:border-slate-800 shadow-sm transition-all duration-300 hover:shadow-xl hover:shadow-purple-500/10 hover:-translate-y-1 hover:border-purple-200 dark:hover:border-purple-800 flex flex-col">
              <div className="h-14 w-14 bg-purple-50 dark:bg-purple-900/30 text-purple-600 dark:text-purple-400 rounded-2xl flex items-center justify-center mb-6 group-hover:scale-110 group-hover:bg-purple-100 transition-all duration-300">
                <GraduationCap className="h-7 w-7" />
              </div>
              <h2 className="text-2xl font-bold text-slate-900 dark:text-white mb-3 flex items-center justify-between">
                Student Portal
                <ArrowRight className="h-5 w-5 text-slate-300 group-hover:text-purple-600 group-hover:translate-x-1 transition-all duration-300" />
              </h2>
              <p className="text-slate-500 dark:text-slate-400 flex-1 leading-relaxed text-sm">
                For Borrowers. Access your Career Co-Pilot, upload resumes for instant market salary predictions, and practice with the AI Mock Interviewer.
              </p>

              <div className="mt-6 pt-6 border-t border-slate-100 dark:border-slate-800 grid grid-cols-2 gap-3">
                <div className="flex items-center gap-2 text-sm text-slate-600 dark:text-slate-400">
                  <BrainCircuit className="h-4 w-4 text-purple-500 shrink-0" />
                  ML Resume Scanner
                </div>
                <div className="flex items-center gap-2 text-sm text-slate-600 dark:text-slate-400">
                  <Target className="h-4 w-4 text-purple-500 shrink-0" />
                  AI Video Interviews
                </div>
                <div className="flex items-center gap-2 text-sm text-slate-600 dark:text-slate-400">
                  <Activity className="h-4 w-4 text-purple-500 shrink-0" />
                  Readiness Score
                </div>
                <div className="flex items-center gap-2 text-sm text-slate-600 dark:text-slate-400">
                  <ShieldCheck className="h-4 w-4 text-purple-500 shrink-0" />
                  Action Roadmap
                </div>
              </div>
            </div>
          </Link>
        </div>

        <div className="text-center text-sm text-slate-400 pt-2">
          TenzorX Engineering &bull; Advanced Placement Intelligence
        </div>
      </div>
    </div>
  );
}
