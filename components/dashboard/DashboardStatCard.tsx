"use client";

import { cn } from "@/lib/utils";
import { Line, LineChart, ResponsiveContainer } from "recharts";

type DashboardStatCardProps = {
  title: string;
  value: string | number;
  changePercent: number;
  increased?: boolean;
  trendData: number[];
  className?: string;
};

export default function DashboardStatCard({
  title,
  value,
  changePercent,
  increased = true,
  trendData,
  className,
}: DashboardStatCardProps) {
  const formattedValue =
    typeof value === "number"
      ? new Intl.NumberFormat("en-US").format(value)
      : value;

  // Determine color based on change direction
  const getColor = () => {
    if (increased) {
      // Green for positive changes
      return "#10B981"; // green-500
    } else {
      // Red for negative changes
      return "#EF4444"; // red-500
    }
  };

  // For conversion rate or net profit, use orange
  const titleLower = title.toLowerCase();
  const isOrange =
    titleLower.includes("conversion") || titleLower.includes("net profit");
  const color = isOrange ? "#F97316" : getColor(); // orange-500 for conversion / net profit

  // Prepare chart data
  const chartData = trendData.map((val, index) => ({
    value: val,
    index,
  }));

  return (
    <div
      className={cn(
        "bg-white rounded-xl border border-[#EEF1F6] p-5 shadow-xs relative overflow-hidden",
        className
      )}
    >
      <div className="flex justify-between">
        <div className="flex-1">
          <p className="text-[#667085] text-sm font-medium mb-2">{title}</p>
          <p className="text-[#0B1E66] text-[28px] font-semibold tracking-tight mb-2">
            {formattedValue}
          </p>
        </div>
        <div className="flex flex-col justify-between items-end">
          <span
            className={cn(
              " items-center gap-1 text-sm font-medium",
              increased && !isOrange
                ? "text-[#10B981]"
                : !increased
                  ? "text-[#EF4444]"
                  : "text-[#F97316]"
            )}
          >
            {increased ? "+" : "-"} {Math.abs(changePercent)}%
          </span>

          <div className="w-[80px] h-[50px] shrink-0">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart
                data={chartData}
                margin={{ top: 8, right: 0, left: 0, bottom: 8 }}
              >
                <Line
                  type="monotone"
                  dataKey="value"
                  stroke={color}
                  strokeWidth={2}
                  dot={(props) => {
                    const { cx, cy, index } = props;
                    // Only show dot for the last point
                    if (index === chartData.length - 2) {
                      return (
                        <circle
                          cx={cx}
                          cy={cy}
                          r={4}
                          fill={color}
                          key={`dot-${index}`}
                        />
                      );
                    }
                    return null;
                  }}
                  activeDot={false}
                />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>
    </div>
  );
}
