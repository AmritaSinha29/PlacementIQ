import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert"
import { Badge } from "@/components/ui/badge"
import { BellRing, ShieldAlert, TrendingDown } from "lucide-react"

export default function AlertsInboxPage() {
  return (
    <div className="flex flex-col gap-6">
      <div className="flex justify-between items-center">
        <div>
          <h2 className="text-3xl font-bold tracking-tight">Alert Inbox</h2>
          <p className="text-muted-foreground mt-1">
            Real-time threshold breaches and automated risk escalations.
          </p>
        </div>
      </div>

      <div className="flex flex-col gap-4">
        {/* Mock Alert 1 */}
        <Alert className="border-red-200 bg-red-50 dark:bg-red-950/40 dark:border-red-900">
          <ShieldAlert className="h-5 w-5 text-red-600" />
          <AlertTitle className="text-red-800 dark:text-red-300 font-semibold flex items-center justify-between">
            <span>Critical Risk Escalation: Rahul Sharma</span>
            <span className="text-xs font-normal text-muted-foreground">Just now</span>
          </AlertTitle>
          <AlertDescription className="text-red-700 dark:text-red-400 mt-2">
            Student ID <strong>123e4567-e89b-12d3-a456-426614174000</strong> has crossed the 80-point critical threshold due to sustained drops in target sector hiring. 
            <div className="mt-3 flex gap-2">
              <Badge variant="destructive">Action Required</Badge>
              <Badge variant="outline" className="bg-white/50 dark:bg-black/50">EMI Risk: High</Badge>
            </div>
          </AlertDescription>
        </Alert>

        {/* Mock Alert 2 */}
        <Alert className="border-amber-200 bg-amber-50 dark:bg-amber-950/40 dark:border-amber-900">
          <TrendingDown className="h-5 w-5 text-amber-600" />
          <AlertTitle className="text-amber-800 dark:text-amber-300 font-semibold flex items-center justify-between">
            <span>Macro-Economic Signal Warning</span>
            <span className="text-xs font-normal text-muted-foreground">2 hours ago</span>
          </AlertTitle>
          <AlertDescription className="text-amber-700 dark:text-amber-400 mt-2">
            IT Services sector hiring index has dropped by 18% YoY. 450 students in your Tier 2 and Tier 3 portfolios have had their risk scores adjusted upwards automatically.
          </AlertDescription>
        </Alert>

        {/* Mock Alert 3 */}
        <Alert className="border-blue-200 bg-blue-50 dark:bg-blue-950/40 dark:border-blue-900">
          <BellRing className="h-5 w-5 text-blue-600" />
          <AlertTitle className="text-blue-800 dark:text-blue-300 font-semibold flex items-center justify-between">
            <span>Successful Intervention</span>
            <span className="text-xs font-normal text-muted-foreground">Yesterday</span>
          </AlertTitle>
          <AlertDescription className="text-blue-700 dark:text-blue-400 mt-2">
            Priya Patel has successfully completed the recommended AWS Solutions Architect certification. Risk score reduced from 72 to 55 (High to Medium).
          </AlertDescription>
        </Alert>
      </div>
    </div>
  )
}
