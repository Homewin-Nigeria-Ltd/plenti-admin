"use client";

import * as React from "react";
import { PieChart, Pie, Cell, ResponsiveContainer, Tooltip } from "recharts";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

const COLORS = ["#0B1E66", "#E8EEFF"];

type TicketResolutionResponseRateProps = {
  responseRatePercentage?: number;
  loading?: boolean;
};

export default function TicketResolutionResponseRate({
  responseRatePercentage,
  loading = false,
}: TicketResolutionResponseRateProps) {
  const [period, setPeriod] = React.useState("monthly");

  const data = React.useMemo(() => {
    const rate =
      responseRatePercentage != null && Number.isFinite(responseRatePercentage)
        ? Math.max(0, Math.min(100, responseRatePercentage))
        : 50;
    return [
      { name: "Within TAT", value: rate, color: COLORS[0] },
      { name: "Exceeded TAT", value: 100 - rate, color: COLORS[1] },
    ];
  }, [responseRatePercentage]);

  if (loading) {
    return (
      <div className="bg-white rounded-xl border border-[#EEF1F6] p-6">
        <div className="h-6 bg-[#EEF1F6] rounded w-2/3 mb-4 animate-pulse" />
        <div className="h-4 bg-[#EEF1F6] rounded w-full mb-6 animate-pulse" />
        <div className="h-[300px] bg-[#EEF1F6] rounded animate-pulse" />
      </div>
    );
  }

  return (
    <div className="bg-white rounded-xl border border-[#EEF1F6] p-6">
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-[#0B1E66] text-lg font-semibold">
          Ticket Resolution Response Rate
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
        {responseRatePercentage != null &&
        Number.isFinite(responseRatePercentage) ? (
          <>
            Response rate: <strong>{responseRatePercentage.toFixed(1)}%</strong>
          </>
        ) : (
          "This section provides an analysis or insights into ticket resolution and response rate."
        )}
      </p>

      <div className="flex items-center justify-center">
        <ResponsiveContainer width="100%" height={300}>
          <PieChart>
            <Pie
              data={data}
              cx="50%"
              cy="50%"
              outerRadius={140}
              paddingAngle={2}
              dataKey="value"
              startAngle={90}
              endAngle={-270}
              labelLine={false}
            >
              {data.map((entry, index) => (
                <Cell
                  key={`cell-${index}`}
                  fill={COLORS[index % COLORS.length]}
                />
              ))}
            </Pie>
            <Tooltip
              formatter={(value: number | undefined) => `${value?.toFixed(1)}%`}
              contentStyle={{
                borderRadius: 8,
                border: "1px solid #EEF1F6",
                boxShadow: "0 4px 12px rgba(0,0,0,0.08)",
              }}
            />
          </PieChart>
        </ResponsiveContainer>
      </div>

      <div className="flex items-center justify-center gap-6 mt-4">
        {data.map((item, index) => (
          <div key={item.name} className="flex items-center gap-2">
            <div
              className="w-4 h-4 rounded-full"
              style={{ backgroundColor: COLORS[index] }}
            />
            <span className="text-sm text-[#667085]">{item.name}</span>
          </div>
        ))}
      </div>
    </div>
  );
}
