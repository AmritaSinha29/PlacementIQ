"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { Activity, Mail, Lock, ArrowRight, Loader2, Building2, GraduationCap } from "lucide-react";
import { Button } from "@/components/ui/button";

export default function Login() {
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [role, setRole] = useState<"student" | "lender">("student");

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);

    // Simulate a network request — uses demo token since Supabase isn't wired locally
    setTimeout(() => {
      localStorage.setItem("placement_iq_token", "demo-local-token");
      localStorage.setItem("placement_iq_role", role);
      router.push(role === "lender" ? "/dashboard" : "/student");
    }, 1000);
  };

  const handleQuickDemo = (demoRole: "student" | "lender") => {
    localStorage.setItem("placement_iq_token", "demo-local-token");
    localStorage.setItem("placement_iq_role", demoRole);
    router.push(demoRole === "lender" ? "/dashboard" : "/student");
  };

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-slate-950 flex flex-col items-center justify-center p-6 relative overflow-hidden">

      {/* Decorative background blobs */}
      <div className="absolute top-[-10%] left-[-10%] w-[40%] h-[40%] rounded-full bg-indigo-600/5 blur-3xl pointer-events-none" />
      <div className="absolute bottom-[-10%] right-[-10%] w-[40%] h-[40%] rounded-full bg-purple-600/5 blur-3xl pointer-events-none" />

      <div className="w-full max-w-md z-10">
        {/* Logo */}
        <div className="flex flex-col items-center mb-8">
          <Link href="/" className="flex flex-col items-center gap-3 group">
            <div className="h-14 w-14 bg-indigo-600 rounded-xl flex items-center justify-center shadow-lg shadow-indigo-600/20 group-hover:shadow-indigo-600/40 transition-shadow">
              <Activity className="h-7 w-7 text-white" />
            </div>
            <h1 className="text-3xl font-extrabold tracking-tight text-slate-900 dark:text-white">
              Placement<span className="text-indigo-600">IQ</span>
            </h1>
          </Link>
          <p className="text-slate-500 mt-2 text-sm">AI-powered placement risk intelligence</p>
        </div>

        {/* Role Switcher */}
        <div className="grid grid-cols-2 gap-2 mb-6 bg-slate-100 dark:bg-slate-800 p-1 rounded-xl">
          <button
            onClick={() => setRole("student")}
            className={`flex items-center justify-center gap-2 py-2.5 rounded-lg text-sm font-medium transition-all ${
              role === "student"
                ? "bg-white dark:bg-slate-900 text-indigo-700 shadow-sm"
                : "text-slate-500 hover:text-slate-700 dark:hover:text-slate-300"
            }`}
          >
            <GraduationCap className="h-4 w-4" />
            Student
          </button>
          <button
            onClick={() => setRole("lender")}
            className={`flex items-center justify-center gap-2 py-2.5 rounded-lg text-sm font-medium transition-all ${
              role === "lender"
                ? "bg-white dark:bg-slate-900 text-blue-700 shadow-sm"
                : "text-slate-500 hover:text-slate-700 dark:hover:text-slate-300"
            }`}
          >
            <Building2 className="h-4 w-4" />
            Lender
          </button>
        </div>

        {/* Login Card */}
        <div className="bg-white dark:bg-slate-900 rounded-3xl p-8 border border-slate-200 dark:border-slate-800 shadow-xl shadow-slate-200/50 dark:shadow-none">
          <form onSubmit={handleLogin} className="space-y-5">

            <div className="space-y-2">
              <label className="text-sm font-medium text-slate-900 dark:text-slate-200">
                Email Address
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <Mail className="h-5 w-5 text-slate-400" />
                </div>
                <input
                  type="email"
                  id="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="pl-10 w-full p-3 rounded-xl border border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-950 focus:outline-none focus:ring-2 focus:ring-indigo-600/50 transition-all"
                  placeholder={role === "lender" ? "admin@bank.com" : "student@university.edu"}
                  required
                />
              </div>
            </div>

            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <label className="text-sm font-medium text-slate-900 dark:text-slate-200">Password</label>
                <a href="#" className="text-sm font-medium text-indigo-600 hover:text-indigo-500">Forgot password?</a>
              </div>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <Lock className="h-5 w-5 text-slate-400" />
                </div>
                <input
                  type="password"
                  id="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="pl-10 w-full p-3 rounded-xl border border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-950 focus:outline-none focus:ring-2 focus:ring-indigo-600/50 transition-all"
                  placeholder="••••••••"
                  required
                />
              </div>
            </div>

            <Button
              type="submit"
              id="login-submit"
              disabled={isLoading}
              className={`w-full h-12 rounded-xl text-base mt-2 ${
                role === "lender" ? "bg-blue-600 hover:bg-blue-700" : "bg-indigo-600 hover:bg-indigo-700"
              }`}
            >
              {isLoading ? (
                <><Loader2 className="mr-2 h-5 w-5 animate-spin" /> Authenticating...</>
              ) : (
                <>Sign In as {role === "lender" ? "Lender" : "Student"} <ArrowRight className="ml-2 h-5 w-5" /></>
              )}
            </Button>
          </form>

          {/* Demo Quick Access */}
          <div className="mt-6 pt-5 border-t border-slate-100 dark:border-slate-800">
            <p className="text-xs text-center text-slate-400 mb-3 font-medium uppercase tracking-wider">
              Quick Demo Access
            </p>
            <div className="grid grid-cols-2 gap-2">
              <button
                id="demo-student"
                onClick={() => handleQuickDemo("student")}
                className="flex items-center justify-center gap-2 py-2.5 px-3 rounded-xl border border-dashed border-indigo-300 text-indigo-600 hover:bg-indigo-50 transition-all text-sm font-medium dark:border-indigo-800 dark:hover:bg-indigo-900/20"
              >
                <GraduationCap className="h-4 w-4" />
                Student Demo
              </button>
              <button
                id="demo-lender"
                onClick={() => handleQuickDemo("lender")}
                className="flex items-center justify-center gap-2 py-2.5 px-3 rounded-xl border border-dashed border-blue-300 text-blue-600 hover:bg-blue-50 transition-all text-sm font-medium dark:border-blue-800 dark:hover:bg-blue-900/20"
              >
                <Building2 className="h-4 w-4" />
                Lender Demo
              </button>
            </div>
          </div>
        </div>

        <div className="text-center mt-6 text-xs text-slate-400">
          TenzorX Engineering &bull; Advanced Placement Intelligence
        </div>
      </div>
    </div>
  );
}
