import Link from "next/link"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"

const mockStudents = [
  { id: "e1", name: "Rahul Sharma", course: "B.Tech Computer Science", tier: "Tier 2", riskScore: 85, band: "Critical", emiStatus: "Due in 3 months" },
  { id: "e2", name: "Priya Patel", course: "MBA Finance", tier: "Tier 1", riskScore: 72, band: "High", emiStatus: "Due in 6 months" },
  { id: "e3", name: "Amit Kumar", course: "B.E. Mechanical", tier: "Tier 3", riskScore: 68, band: "High", emiStatus: "Due in 5 months" },
  { id: "e4", name: "Sneha Reddy", course: "MCA", tier: "Tier 2", riskScore: 55, band: "Medium", emiStatus: "Due in 8 months" },
  { id: "e5", name: "Vikram Singh", course: "B.Tech IT", tier: "Tier 2", riskScore: 81, band: "Critical", emiStatus: "Due in 2 months" },
]

export default function StudentsAtRiskPage() {
  return (
    <div className="flex flex-col gap-6">
      <div className="flex justify-between items-center">
        <div>
          <h2 className="text-3xl font-bold tracking-tight">At-Risk Borrowers</h2>
          <p className="text-muted-foreground mt-1">
            Prioritized list of students requiring intervention based on their Placement Risk Score.
          </p>
        </div>
        <div className="flex gap-2">
          <Button variant="outline">Export CSV</Button>
          <Button>Send Bulk Alerts</Button>
        </div>
      </div>

      <div className="rounded-md border bg-white dark:bg-slate-900">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Student</TableHead>
              <TableHead>Course & Institute</TableHead>
              <TableHead className="text-center">Risk Score (0-100)</TableHead>
              <TableHead>Risk Band</TableHead>
              <TableHead>EMI Status</TableHead>
              <TableHead className="text-right">Action</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {mockStudents.map((student) => (
              <TableRow key={student.id}>
                <TableCell className="font-medium">{student.name}</TableCell>
                <TableCell>
                  {student.course}
                  <div className="text-xs text-muted-foreground">{student.tier}</div>
                </TableCell>
                <TableCell className="text-center font-bold">
                  <span className={student.riskScore >= 80 ? "text-red-600" : "text-amber-600"}>
                    {student.riskScore}
                  </span>
                </TableCell>
                <TableCell>
                  <Badge variant={student.band === "Critical" ? "destructive" : "default"} className={student.band === "High" ? "bg-amber-500 hover:bg-amber-600" : ""}>
                    {student.band}
                  </Badge>
                </TableCell>
                <TableCell className="text-muted-foreground text-sm">{student.emiStatus}</TableCell>
                <TableCell className="text-right">
                  <Link href={`/dashboard/students/${student.id}`}>
                    <Button variant="ghost" size="sm">View Profile</Button>
                  </Link>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>
    </div>
  )
}
