import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Bell, Shield, Users, Sliders } from "lucide-react";

export default function SettingsPage() {
  return (
    <div className="flex flex-col gap-6 max-w-3xl">
      <div>
        <h2 className="text-3xl font-bold tracking-tight">Settings</h2>
        <p className="text-muted-foreground mt-1">
          Configure alert thresholds, tenant preferences, and notification channels.
        </p>
      </div>

      {/* Risk Thresholds */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Sliders className="h-5 w-5 text-indigo-500" />
            Risk Score Thresholds
          </CardTitle>
          <CardDescription>
            Customize when students are escalated between risk bands.
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          {[
            { label: "Critical Risk Threshold", value: 80, color: "bg-red-500" },
            { label: "High Risk Threshold", value: 65, color: "bg-amber-500" },
            { label: "Medium Risk Threshold", value: 45, color: "bg-yellow-400" },
          ].map(({ label, value, color }) => (
            <div key={label} className="flex items-center justify-between py-3 border-b last:border-0">
              <div>
                <p className="text-sm font-medium">{label}</p>
                <p className="text-xs text-muted-foreground mt-0.5">
                  Students above this score are escalated
                </p>
              </div>
              <div className="flex items-center gap-3">
                <div className={`h-2.5 w-2.5 rounded-full ${color}`} />
                <span className="font-bold text-slate-800 dark:text-slate-200 w-8 text-right">
                  {value}
                </span>
              </div>
            </div>
          ))}
          <p className="text-xs text-muted-foreground pt-1">
            Threshold editing requires admin access — contact TenzorX support.
          </p>
        </CardContent>
      </Card>

      {/* Notification Channels */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Bell className="h-5 w-5 text-blue-500" />
            Notification Channels
          </CardTitle>
          <CardDescription>
            Where to deliver risk escalation alerts.
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-3">
          {[
            { channel: "Email Digest", enabled: true, desc: "Daily summary of new risk escalations" },
            { channel: "SMS Alerts", enabled: false, desc: "Instant SMS for critical threshold breaches" },
            { channel: "Webhook (POST)", enabled: true, desc: "Push alerts to your risk management system" },
          ].map(({ channel, enabled, desc }) => (
            <div key={channel} className="flex items-center justify-between py-3 border-b last:border-0">
              <div>
                <p className="text-sm font-medium">{channel}</p>
                <p className="text-xs text-muted-foreground">{desc}</p>
              </div>
              <span
                className={`text-xs font-semibold px-2.5 py-1 rounded-full ${
                  enabled
                    ? "bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400"
                    : "bg-slate-100 text-slate-500 dark:bg-slate-800"
                }`}
              >
                {enabled ? "Active" : "Inactive"}
              </span>
            </div>
          ))}
        </CardContent>
      </Card>

      {/* Tenant Info */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Users className="h-5 w-5 text-purple-500" />
            Tenant Information
          </CardTitle>
          <CardDescription>Your organization's PlacementIQ configuration.</CardDescription>
        </CardHeader>
        <CardContent className="space-y-3">
          {[
            { label: "Organization", value: "Demo NBFC Lender" },
            { label: "Tenant ID", value: "demo-tenant-001" },
            { label: "API Base URL", value: "http://localhost:8000" },
            { label: "Portfolio Size", value: "5,000 borrowers" },
          ].map(({ label, value }) => (
            <div key={label} className="flex justify-between py-2 border-b last:border-0 text-sm">
              <span className="text-muted-foreground">{label}</span>
              <span className="font-medium font-mono">{value}</span>
            </div>
          ))}
        </CardContent>
      </Card>

      {/* Security */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Shield className="h-5 w-5 text-green-500" />
            Security
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="text-sm text-muted-foreground space-y-1">
            <p>✓ JWT authentication via Supabase</p>
            <p>✓ CORS enabled for cross-origin API calls</p>
            <p>✓ All API endpoints require Bearer token</p>
            <p>✓ Audit trail enabled for all score mutations</p>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
