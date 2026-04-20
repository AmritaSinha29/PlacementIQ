import Link from "next/link"
import { Building2, GraduationCap, ArrowRight, Activity, LineChart, Target, BrainCircuit } from "lucide-react"

export default function Home() {
  return (
    <div className="min-h-screen bg-slate-50 dark:bg-slate-950 flex flex-col items-center justify-center p-6">
      <div className="max-w-4xl w-full space-y-12">
        
        {/* Header */}
        <div className="text-center space-y-4">
          <div className="flex justify-center mb-6">
            <div className="h-16 w-16 bg-indigo-600 rounded-2xl flex items-center justify-center shadow-lg shadow-indigo-600/20">
              <Activity className="h-8 w-8 text-white" />
            </div>
          </div>
          <h1 className="text-5xl font-extrabold tracking-tight text-slate-900 dark:text-white">
            Placement<span className="text-indigo-600">IQ</span>
          </h1>
          <p className="text-xl text-slate-500 dark:text-slate-400 max-w-2xl mx-auto">
            AI-powered employability tracking and placement risk mitigation for education lending.
          </p>
        </div>

        {/* Portal Selection Cards */}
        <div className="grid md:grid-cols-2 gap-8 pt-8">
          
          {/* Lender Portal Card */}
          <Link href="/dashboard" className="group">
            <div className="h-full bg-white dark:bg-slate-900 rounded-3xl p-8 border border-slate-200 dark:border-slate-800 shadow-sm transition-all duration-300 hover:shadow-xl hover:shadow-indigo-500/10 hover:border-indigo-200 dark:hover:border-indigo-800 flex flex-col">
              <div className="h-14 w-14 bg-blue-50 dark:bg-blue-900/30 text-blue-600 dark:text-blue-400 rounded-2xl flex items-center justify-center mb-6 group-hover:scale-110 transition-transform duration-300">
                <Building2 className="h-7 w-7" />
              </div>
              <h2 className="text-2xl font-bold text-slate-900 dark:text-white mb-3 flex items-center justify-between">
                Lender Dashboard
                <ArrowRight className="h-5 w-5 text-slate-400 group-hover:text-blue-600 group-hover:translate-x-1 transition-all" />
              </h2>
              <p className="text-slate-500 dark:text-slate-400 flex-1 leading-relaxed">
                For Banks and NBFCs. Monitor real-time portfolio risk, track student employability scores, and manage at-risk loans before defaults happen.
              </p>
              
              <div className="mt-8 pt-6 border-t border-slate-100 dark:border-slate-800 grid grid-cols-2 gap-4">
                <div className="flex items-center gap-2 text-sm text-slate-600 dark:text-slate-400">
                  <LineChart className="h-4 w-4 text-blue-500" /> Risk Tracking
                </div>
                <div className="flex items-center gap-2 text-sm text-slate-600 dark:text-slate-400">
                  <Activity className="h-4 w-4 text-blue-500" /> Alert Inbox
                </div>
              </div>
            </div>
          </Link>

          {/* Student Portal Card */}
          <Link href="/login" className="group">
            <div className="h-full bg-white dark:bg-slate-900 rounded-3xl p-8 border border-slate-200 dark:border-slate-800 shadow-sm transition-all duration-300 hover:shadow-xl hover:shadow-purple-500/10 hover:border-purple-200 dark:hover:border-purple-800 flex flex-col">
              <div className="h-14 w-14 bg-purple-50 dark:bg-purple-900/30 text-purple-600 dark:text-purple-400 rounded-2xl flex items-center justify-center mb-6 group-hover:scale-110 transition-transform duration-300">
                <GraduationCap className="h-7 w-7" />
              </div>
              <h2 className="text-2xl font-bold text-slate-900 dark:text-white mb-3 flex items-center justify-between">
                Student Portal
                <ArrowRight className="h-5 w-5 text-slate-400 group-hover:text-purple-600 group-hover:translate-x-1 transition-all" />
              </h2>
              <p className="text-slate-500 dark:text-slate-400 flex-1 leading-relaxed">
                For Borrowers. Access your Career Co-Pilot, upload resumes for instant market salary predictions, and practice with the AI Mock Interviewer.
              </p>
              
              <div className="mt-8 pt-6 border-t border-slate-100 dark:border-slate-800 grid grid-cols-2 gap-4">
                <div className="flex items-center gap-2 text-sm text-slate-600 dark:text-slate-400">
                  <BrainCircuit className="h-4 w-4 text-purple-500" /> ML Resume Scanner
                </div>
                <div className="flex items-center gap-2 text-sm text-slate-600 dark:text-slate-400">
                  <Target className="h-4 w-4 text-purple-500" /> AI Video Interviews
                </div>
              </div>
            </div>
          </Link>

        </div>
        
        <div className="text-center text-sm text-slate-400 pt-8">
          TenzorX Engineering &bull; Advanced Placement Intelligence
        </div>
      </div>
    </div>
  )
}
