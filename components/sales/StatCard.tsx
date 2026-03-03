"use client";

import Image from "next/image";
import { LineChart, Line, ResponsiveContainer } from "recharts";
import type { SalesStat } from "@/types/sales";

export default function StatCard({ stat }: { stat: SalesStat }) {
  const changeColorClass =
    stat.changeColor === "green"
      ? "text-[#28A745]"
      : stat.changeColor === "red"
        ? "text-[#FF392B]"
        : "text-[#FFA000]";

  return (
    <div className="rounded-lg border border-[#D9D9D9] bg-white p-4">
      <div className="flex items-start justify-between mb-4">
        <p className="text-sm font-medium text-[#98A2B3]">{stat.title}</p>
        <span className={`text-xs font-bold ${changeColorClass}`}>
          {stat.change}
        </span>
      </div>
      <div className="flex items-end justify-between">
        <div className="flex flex-col gap-2">
          <p className="text-[32px] font-semibold leading-tight text-[#0B1E66]">
            {stat.value}
          </p>
          <p className="text-xs text-[#1A3FA3] bg-[#E8EEFF] rounded-2xl px-3 py-1 w-fit">
            {stat.subtitle}
          </p>
        </div>
        <div className="shrink-0">
          {stat.trendData && stat.trendData.length > 0 ? (
            <ResponsiveContainer width={75} height={29}>
              <LineChart data={stat.trendData}>
                <Line
                  type="monotone"
                  dataKey="value"
                  stroke={
                    stat.changeColor === "green"
                      ? "#28A745"
                      : stat.changeColor === "red"
                        ? "#FF392B"
                        : "#FFA000"
                  }
                  dot={false}
                  strokeWidth={2}
                />
              </LineChart>
            </ResponsiveContainer>
          ) : null}
        </div>
      </div>
    </div>
  );
}
