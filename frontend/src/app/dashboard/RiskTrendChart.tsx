"use client";

import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from "recharts";

const mockChartData = [
  { name: "Oct", score: 62 },
  { name: "Nov", score: 65 },
  { name: "Dec", score: 64 },
  { name: "Jan", score: 68 },
  { name: "Feb", score: 71 },
  { name: "Mar", score: 75 },
];

export default function RiskTrendChart() {
  return (
    <div style={{ height: 300, width: "100%" }}>
      <ResponsiveContainer width="100%" height="100%">
        <LineChart
          data={mockChartData}
          margin={{ top: 5, right: 30, left: 20, bottom: 5 }}
        >
          <CartesianGrid strokeDasharray="3 3" vertical={false} />
          <XAxis
            dataKey="name"
            axisLine={false}
            tickLine={false}
            tick={{ fill: "#888888" }}
          />
          <YAxis
            domain={[0, 100]}
            axisLine={false}
            tickLine={false}
            tick={{ fill: "#888888" }}
          />
          <Tooltip
            contentStyle={{
              borderRadius: "8px",
              border: "none",
              boxShadow: "0 4px 6px -1px rgb(0 0 0 / 0.1)",
            }}
          />
          <Line
            type="monotone"
            dataKey="score"
            stroke="#2563eb"
            strokeWidth={3}
            dot={{ r: 4, strokeWidth: 2 }}
            activeDot={{ r: 6 }}
          />
        </LineChart>
      </ResponsiveContainer>
    </div>
  );
}
