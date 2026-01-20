"use client";

import * as React from "react";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  ResponsiveContainer,
  Tooltip,
} from "recharts";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

const summaryData = [
  { category: "Order Issue", value: 2890134 },
  { category: "Refund Request", value: 860580 },
  { category: "Delivery Issue", value: 820240 },
  { category: "Others", value: 620420 },
];

const chartData = [
  { category: "Order Issue", value: 190000 },
  { category: "Business Banking", value: 180000 },
  { category: "Delivery Issue", value: 90000 },
  { category: "Others", value: 70000 },
];

export default function TicketByCategory() {
  const [period, setPeriod] = React.useState("monthly");

  const formatValue = (value: number) => {
    if (value >= 1000000) {
      return `${(value / 1000000).toFixed(1)}M`;
    }
    if (value >= 1000) {
      return `${(value / 1000).toFixed(0)}K`;
    }
    return value.toString();
  };

  return (
    <div className="bg-white rounded-xl border border-[#EEF1F6] p-6">
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-[#0B1E66] text-lg font-semibold">
          Ticket by Category
        </h3>
        <Select value={period} onValueChange={setPeriod}>
          <SelectTrigger className="w-[120px] h-9 border-[#D0D5DD]">
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="monthly">Monthly</SelectItem>
            <SelectItem value="weekly">Weekly</SelectItem>
            <SelectItem value="yearly">Yearly</SelectItem>
          </SelectContent>
        </Select>
      </div>

      <p className="text-[#667085] text-sm mb-6">
        This section provides an analysis or insights into ticket opened by new
        and returning customers.
      </p>

      {/* Summary Numbers */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
        {summaryData.map((item) => (
          <div key={item.category}>
            <p className="text-[#667085] text-xs mb-1">{item.category}</p>
            <p className="text-[#0B1E66] text-2xl font-semibold">
              {new Intl.NumberFormat("en-US").format(item.value)}
            </p>
          </div>
        ))}
      </div>

      {/* Bar Chart */}
      <div className="h-[300px]">
        <ResponsiveContainer width="100%" height="100%">
          <BarChart
            data={chartData}
            layout="vertical"
            margin={{ top: 20, right: 30, left: 20, bottom: 5 }}
          >
            <CartesianGrid
              strokeDasharray="3 3"
              stroke="#EEF1F6"
              horizontal={false}
            />
            <XAxis
              type="number"
              domain={[0, 200000]}
              tick={{ fill: "#667085", fontSize: 12 }}
              tickLine={false}
              axisLine={{ stroke: "#EEF1F6" }}
              tickFormatter={formatValue}
              ticks={[0, 20000, 40000, 60000, 80000, 100000, 200000]}
            />
            <YAxis
              type="category"
              dataKey="category"
              tick={{ fill: "#667085", fontSize: 12 }}
              tickLine={false}
              axisLine={{ stroke: "#EEF1F6" }}
              width={120}
            />
            <Tooltip
              formatter={(value: number | undefined) => formatValue(value ?? 0)}
              contentStyle={{
                borderRadius: 8,
                border: "1px solid #EEF1F6",
                boxShadow: "0 4px 12px rgba(0,0,0,0.08)",
              }}
            />
            <Bar
              dataKey="value"
              fill="#0B1E66"
              radius={[0, 8, 8, 0]}
              barSize={40}
            />
          </BarChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
}
