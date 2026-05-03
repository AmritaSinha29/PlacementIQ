"use client";

import dynamic from "next/dynamic";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";

// Lazy-load Recharts with ssr:false — avoids the height(-1) warning during SSG
const RiskTrendChart = dynamic(() => import("./RiskTrendChart"), {
  ssr: false,
  loading: () => <div className="h-[300px] flex items-center justify-center text-muted-foreground text-sm">Loading chart...</div>,
});

export default function DashboardOverview() {
  return (
    <div className="flex flex-col gap-6">
      <div className="flex justify-between items-center">
        <div>
          <h2 className="text-3xl font-bold tracking-tight">Portfolio Overview</h2>
          <p className="text-muted-foreground mt-1">
            Monitor real-time placement risk across your entire education loan portfolio.
          </p>
        </div>
      </div>

      {/* KPI Cards */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Borrowers</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">5,000</div>
            <p className="text-xs text-muted-foreground">+201 since last month</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium text-red-600">Critical Risk</CardTitle>
            <Badge variant="destructive">Needs Intervention</Badge>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-red-600">120</div>
            <p className="text-xs text-muted-foreground">Severe employability challenges</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium text-amber-600">High Risk</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-amber-600">450</div>
            <p className="text-xs text-muted-foreground">Significant delay likely</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium text-green-600">Low Risk</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-green-600">3,350</div>
            <p className="text-xs text-muted-foreground">Likely to be placed quickly</p>
          </CardContent>
        </Card>
      </div>

      {/* Chart + Alerts Row */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-7">
        <Card className="col-span-4">
          <CardHeader>
            <CardTitle>Risk Trend</CardTitle>
            <CardDescription>Average portfolio risk score over the last 6 months.</CardDescription>
          </CardHeader>
          <CardContent className="pl-2">
            <RiskTrendChart />
          </CardContent>
        </Card>
        <Card className="col-span-3">
          <CardHeader>
            <CardTitle>Recent Risk Alerts</CardTitle>
            <CardDescription>Borrowers crossing risk thresholds this week.</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {[1, 2, 3, 4, 5].map((i) => (
                <div key={i} className="flex items-center justify-between border-b pb-2 last:border-0">
                  <div className="space-y-1">
                    <p className="text-sm font-medium leading-none">Student ID: ...{1000 + i}</p>
                    <p className="text-sm text-muted-foreground">Moved from Medium to High Risk</p>
                  </div>
                  <div className="font-medium text-amber-600 text-sm">Score: 68</div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
