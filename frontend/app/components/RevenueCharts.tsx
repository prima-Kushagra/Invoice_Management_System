"use client";

import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
} from "recharts";

const data = [
  { month: "Jan", revenue: 4000 },
  { month: "Feb", revenue: 3000 },
  { month: "Mar", revenue: 5000 },
  { month: "Apr", revenue: 7000 },
  { month: "May", revenue: 6000 },
];

export default function RevenueChart() {
  return (
    <div className="bg-white p-6 rounded-2xl shadow-sm border border-slate-200 h-80">
      <h3 className="font-semibold mb-4">Revenue Overview</h3>

      <ResponsiveContainer width="100%" height="85%">
        <LineChart data={data}>
          <XAxis dataKey="month" />
          <YAxis />
          <Tooltip />
          <Line type="monotone" dataKey="revenue" stroke="#6366f1" />
        </LineChart>
      </ResponsiveContainer>
    </div>
  );
}