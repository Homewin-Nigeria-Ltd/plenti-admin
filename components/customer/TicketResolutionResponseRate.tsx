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
import { useSupportStore } from "@/store/useSupportStore";
import type { ResolutionPeriod } from "@/types/SupportTypes";

const COLORS = ["#0B1E66", "#E8EEFF"];

const PERIOD_OPTIONS: { value: ResolutionPeriod; label: string }[] = [
  { value: "monthly", label: "Monthly" },
  { value: "weekly", label: "Weekly" },
  { value: "yearly", label: "Yearly" },
];

export default function TicketResolutionResponseRate() {
  const [period, setPeriod] = React.useState<ResolutionPeriod>("monthly");

  const {
    resolutionStatistics,
    loadingResolutionStatistics,
    fetchResolutionStatistics,
  } = useSupportStore();

  React.useEffect(() => {
    fetchResolutionStatistics(period);
  }, [period, fetchResolutionStatistics]);

  const data = React.useMemo(() => {
    const tat = resolutionStatistics?.tat_breakdown;
    if (tat != null) {
      const within = Math.max(0, Math.min(100, tat.within_tat_percentage ?? 0));
      const exceeded = Math.max(
        0,
        Math.min(100, tat.exceeded_tat_percentage ?? 0)
      );
      return [
        { name: "Within TAT", value: within, color: COLORS[0] },
        { name: "Exceeded TAT", value: exceeded, color: COLORS[1] },
      ];
    }
    return [
      { name: "Within TAT", value: 50, color: COLORS[0] },
      { name: "Exceeded TAT", value: 50, color: COLORS[1] },
    ];
  }, [resolutionStatistics]);

  if (loadingResolutionStatistics) {
    return (
      <div className="bg-white rounded-xl border border-[#EEF1F6] p-6">
        <div className="h-6 bg-[#EEF1F6] rounded w-2/3 mb-4 animate-pulse" />
        <div className="h-4 bg-[#EEF1F6] rounded w-full mb-6 animate-pulse" />
        <div className="h-75 bg-[#EEF1F6] rounded animate-pulse" />
      </div>
    );
  }

  return (
    <div className="bg-white rounded-xl border border-[#EEF1F6] p-6">
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-[#0B1E66] text-lg font-semibold">
          Ticket Resolution Response Rate
        </h3>
        <Select
          value={period}
          onValueChange={(v) => setPeriod(v as ResolutionPeriod)}
        >
          <SelectTrigger className="w-30 h-9 border-[#D0D5DD]">
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            {PERIOD_OPTIONS.map((opt) => (
              <SelectItem key={opt.value} value={opt.value}>
                {opt.label}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>

      <p className="text-[#667085] text-sm mb-6">
        {resolutionStatistics?.period != null && (
          <span className="mr-2">
            <strong>{resolutionStatistics.period}</strong>
            {resolutionStatistics.tat_breakdown?.tat_hours != null && (
              <span className="ml-1">
                (TAT: {resolutionStatistics.tat_breakdown.tat_hours}h)
              </span>
            )}
            {" · "}
          </span>
        )}
        {resolutionStatistics?.response_rate_percentage != null &&
        Number.isFinite(resolutionStatistics.response_rate_percentage) ? (
          <>
            Response rate:{" "}
            <strong>
              {resolutionStatistics.response_rate_percentage.toFixed(1)}%
            </strong>
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
              formatter={(value) => {
                const numericValue = Number(value);
                return `${(Number.isFinite(numericValue)
                  ? numericValue
                  : 0
                ).toFixed(1)}%`;
              }}
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
