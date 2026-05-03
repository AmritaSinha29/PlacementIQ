import { Badge } from "@/components/ui/badge";
import { BellRing, ShieldAlert, TrendingDown, CheckCircle2 } from "lucide-react";

const alerts = [
  {
    id: 1,
    type: "critical" as const,
    title: "Critical Risk Escalation: Rahul Sharma",
    timestamp: "Just now",
    description:
      "Student ID 123e4567-e89b-12d3-a456-426614174000 has crossed the 80-point critical threshold due to sustained drops in target sector hiring.",
    badges: [
      { label: "Action Required", variant: "destructive" as const },
      { label: "EMI Risk: High", variant: "outline" as const },
    ],
    icon: ShieldAlert,
  },
  {
    id: 2,
    type: "warning" as const,
    title: "Macro-Economic Signal Warning",
    timestamp: "2 hours ago",
    description:
      "IT Services sector hiring index has dropped by 18% YoY. 450 students in your Tier 2 and Tier 3 portfolios have had their risk scores adjusted upwards automatically.",
    badges: [{ label: "Portfolio-wide Impact", variant: "outline" as const }],
    icon: TrendingDown,
  },
  {
    id: 3,
    type: "info" as const,
    title: "High Risk Escalation: Vikram Singh",
    timestamp: "5 hours ago",
    description:
      "Student ID VIK-2025-1001 moved from Medium to High Risk. No internship recorded in the last 12 months and no active placement drive participation.",
    badges: [{ label: "Intervention Suggested", variant: "outline" as const }],
    icon: ShieldAlert,
  },
  {
    id: 4,
    type: "success" as const,
    title: "Successful Intervention: Priya Patel",
    timestamp: "Yesterday",
    description:
      "Priya Patel has successfully completed the recommended AWS Solutions Architect certification. Risk score reduced from 72 to 55 (High → Medium).",
    badges: [{ label: "Risk Reduced", variant: "outline" as const }],
    icon: CheckCircle2,
  },
  {
    id: 5,
    type: "info" as const,
    title: "Weekly Risk Digest Ready",
    timestamp: "2 days ago",
    description:
      "Your weekly portfolio risk summary is ready. 12 new high-risk escalations, 3 successful interventions logged. Average portfolio risk score: 67.4 (+2.1 from last week).",
    badges: [{ label: "Report", variant: "outline" as const }],
    icon: BellRing,
  },
];

const typeStyles = {
  critical: {
    wrapper: "border-red-200 bg-red-50 dark:bg-red-950/40 dark:border-red-900",
    icon: "text-red-600",
    title: "text-red-800 dark:text-red-300",
    desc: "text-red-700 dark:text-red-400",
  },
  warning: {
    wrapper: "border-amber-200 bg-amber-50 dark:bg-amber-950/40 dark:border-amber-900",
    icon: "text-amber-600",
    title: "text-amber-800 dark:text-amber-300",
    desc: "text-amber-700 dark:text-amber-400",
  },
  info: {
    wrapper: "border-blue-200 bg-blue-50 dark:bg-blue-950/40 dark:border-blue-900",
    icon: "text-blue-600",
    title: "text-blue-800 dark:text-blue-300",
    desc: "text-blue-700 dark:text-blue-400",
  },
  success: {
    wrapper: "border-emerald-200 bg-emerald-50 dark:bg-emerald-950/40 dark:border-emerald-900",
    icon: "text-emerald-600",
    title: "text-emerald-800 dark:text-emerald-300",
    desc: "text-emerald-700 dark:text-emerald-400",
  },
};

export default function AlertsInboxPage() {
  return (
    <div className="flex flex-col gap-6">
      {/* Header */}
      <div className="flex justify-between items-center">
        <div>
          <h2 className="text-3xl font-bold tracking-tight">Alert Inbox</h2>
          <p className="text-muted-foreground mt-1">
            Real-time threshold breaches and automated risk escalations.
          </p>
        </div>
        <span className="text-sm font-medium bg-red-100 text-red-700 px-3 py-1 rounded-full dark:bg-red-900/30 dark:text-red-400">
          {alerts.filter((a) => a.type === "critical" || a.type === "warning").length} unread
        </span>
      </div>

      {/* Alert list */}
      <div className="flex flex-col gap-3">
        {alerts.map((alert) => {
          const styles = typeStyles[alert.type];
          const Icon = alert.icon;
          return (
            <div
              key={alert.id}
              className={`rounded-lg border p-4 ${styles.wrapper}`}
            >
              {/* Title row */}
              <div className="flex items-start gap-3">
                <Icon className={`h-5 w-5 mt-0.5 shrink-0 ${styles.icon}`} />
                <div className="flex-1 min-w-0">
                  <div className="flex items-start justify-between gap-4">
                    <p className={`font-semibold text-sm leading-tight ${styles.title}`}>
                      {alert.title}
                    </p>
                    <span className="text-xs text-muted-foreground whitespace-nowrap shrink-0 mt-0.5">
                      {alert.timestamp}
                    </span>
                  </div>
                  <p className={`text-sm mt-2 leading-relaxed ${styles.desc}`}>
                    {alert.description}
                  </p>
                  {alert.badges.length > 0 && (
                    <div className="flex flex-wrap gap-2 mt-3">
                      {alert.badges.map((b) => (
                        <Badge
                          key={b.label}
                          variant={b.variant}
                          className={b.variant === "outline" ? "bg-white/50 dark:bg-black/30" : ""}
                        >
                          {b.label}
                        </Badge>
                      ))}
                    </div>
                  )}
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
