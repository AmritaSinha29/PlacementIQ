"use client";

import Link from "next/link";
import { useState } from "react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Search, Download, Send } from "lucide-react";

const mockStudents = [
  {
    id: "e1",
    name: "Rahul Sharma",
    course: "B.Tech Computer Science",
    tier: "Tier 2 (NIT/IIIT)",
    riskScore: 85,
    band: "Critical",
    emiStatus: "Due in 3 months",
    change: "+7",
  },
  {
    id: "e2",
    name: "Vikram Singh",
    course: "B.Tech Information Technology",
    tier: "Tier 2 (NIT/IIIT)",
    riskScore: 81,
    band: "Critical",
    emiStatus: "Due in 2 months",
    change: "+12",
  },
  {
    id: "e3",
    name: "Priya Patel",
    course: "MBA Finance",
    tier: "Tier 1 (IIT/BITS)",
    riskScore: 72,
    band: "High",
    emiStatus: "Due in 6 months",
    change: "+4",
  },
  {
    id: "e4",
    name: "Amit Kumar",
    course: "B.E. Mechanical Engineering",
    tier: "Tier 3 (State)",
    riskScore: 68,
    band: "High",
    emiStatus: "Due in 5 months",
    change: "+2",
  },
  {
    id: "e5",
    name: "Sneha Reddy",
    course: "MCA",
    tier: "Tier 2 (NIT/IIIT)",
    riskScore: 55,
    band: "Medium",
    emiStatus: "Due in 8 months",
    change: "-3",
  },
  {
    id: "e6",
    name: "Karan Mehta",
    course: "B.Tech Electronics",
    tier: "Tier 3 (State)",
    riskScore: 63,
    band: "High",
    emiStatus: "Due in 4 months",
    change: "+5",
  },
  {
    id: "e7",
    name: "Anjali Nair",
    course: "B.Tech CSE (AI/ML)",
    tier: "Tier 2 (NIT/IIIT)",
    riskScore: 47,
    band: "Medium",
    emiStatus: "Due in 10 months",
    change: "-6",
  },
];

function getBandStyles(band: string) {
  switch (band) {
    case "Critical":
      return { badge: "destructive" as const, text: "text-red-600", score: "text-red-600" };
    case "High":
      return { badge: "default" as const, text: "text-amber-600", score: "text-amber-600", cls: "bg-amber-500 hover:bg-amber-600 text-white border-0" };
    default:
      return { badge: "default" as const, text: "text-blue-600", score: "text-blue-600", cls: "bg-blue-100 text-blue-700 hover:bg-blue-200 border-0" };
  }
}

export default function StudentsAtRiskPage() {
  const [search, setSearch] = useState("");

  const filtered = mockStudents.filter(
    (s) =>
      s.name.toLowerCase().includes(search.toLowerCase()) ||
      s.course.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div className="flex flex-col gap-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h2 className="text-3xl font-bold tracking-tight">At-Risk Borrowers</h2>
          <p className="text-muted-foreground mt-1">
            Prioritized list of students requiring intervention — sorted by risk severity.
          </p>
        </div>
        <div className="flex gap-2 shrink-0">
          <Button variant="outline" size="sm" className="gap-2">
            <Download className="h-4 w-4" /> Export CSV
          </Button>
          <Button size="sm" className="gap-2 bg-indigo-600 hover:bg-indigo-700">
            <Send className="h-4 w-4" /> Bulk Alert
          </Button>
        </div>
      </div>

      {/* Search bar */}
      <div className="relative max-w-sm">
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400" />
        <input
          type="text"
          placeholder="Search by name or course..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="pl-9 pr-4 py-2 w-full text-sm rounded-lg border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-900 focus:outline-none focus:ring-2 focus:ring-indigo-500/50 transition"
        />
      </div>

      {/* Table */}
      <div className="rounded-xl border bg-white dark:bg-slate-900 overflow-hidden shadow-sm">
        <Table>
          <TableHeader>
            <TableRow className="bg-slate-50 dark:bg-slate-800/50">
              <TableHead className="font-semibold">Student</TableHead>
              <TableHead className="font-semibold">Course &amp; Institute</TableHead>
              <TableHead className="text-center font-semibold">Risk Score</TableHead>
              <TableHead className="font-semibold">Risk Band</TableHead>
              <TableHead className="font-semibold">EMI Status</TableHead>
              <TableHead className="text-right font-semibold">Action</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {filtered.length === 0 ? (
              <TableRow>
                <TableCell colSpan={6} className="text-center text-muted-foreground py-10">
                  No students match your search.
                </TableCell>
              </TableRow>
            ) : (
              filtered.map((student) => {
                const styles = getBandStyles(student.band);
                const changePositive = student.change.startsWith("+");
                return (
                  <TableRow key={student.id} className="hover:bg-slate-50 dark:hover:bg-slate-800/40 transition-colors">
                    <TableCell className="font-medium">{student.name}</TableCell>
                    <TableCell>
                      <span>{student.course}</span>
                      <div className="text-xs text-muted-foreground">{student.tier}</div>
                    </TableCell>
                    <TableCell className="text-center">
                      <div className={`font-bold text-lg ${styles.score}`}>{student.riskScore}</div>
                      <div className={`text-xs font-medium ${changePositive ? "text-red-500" : "text-green-500"}`}>
                        {student.change} this week
                      </div>
                    </TableCell>
                    <TableCell>
                      <Badge
                        variant={styles.badge}
                        className={styles.cls}
                      >
                        {student.band}
                      </Badge>
                    </TableCell>
                    <TableCell className="text-muted-foreground text-sm">{student.emiStatus}</TableCell>
                    <TableCell className="text-right">
                      <Link href={`/dashboard/students/${student.id}`}>
                        <Button variant="ghost" size="sm" className="hover:bg-indigo-50 hover:text-indigo-700 dark:hover:bg-indigo-900/20">
                          View Profile →
                        </Button>
                      </Link>
                    </TableCell>
                  </TableRow>
                );
              })
            )}
          </TableBody>
        </Table>
      </div>

      <p className="text-xs text-muted-foreground">
        Showing {filtered.length} of {mockStudents.length} at-risk borrowers.
        Scores update every 24 hours based on live job market signals.
      </p>
    </div>
  );
}
