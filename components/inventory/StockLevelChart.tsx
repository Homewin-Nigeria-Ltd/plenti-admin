"use client";

import {
  Cell,
  Label,
  Pie,
  PieChart,
  ResponsiveContainer,
  Tooltip,
} from "recharts";

type StockLevelChartProps = {
  activeInStock: number;
  highStock: number;
  mediumStock: number;
  lowStock: number;
};

const COLORS = ["#0B1E66", "#2E5CDB", "#E8EEFF"];

const RADIAN = Math.PI / 180;

type LabelProps = {
  cx?: number;
  cy?: number;
  midAngle?: number;
  outerRadius?: number;
  percent?: number;
};

const renderCustomizedLabel = (props: LabelProps) => {
  const { cx, cy, midAngle, outerRadius, percent } = props;
  if (!cx || !cy || midAngle === undefined || !outerRadius || percent === undefined) {
    return null;
  }
  const radius = outerRadius + -5;
  const x = cx + radius * Math.cos(-midAngle * RADIAN);
  const y = cy + radius * Math.sin(-midAngle * RADIAN);
  const padding = 8;

  return (
    <g>
      <circle
        cx={x}
        cy={y}
        r={12 + padding}
        fill="white"
        stroke="#E0E0E0"
        strokeWidth={1}
      />
      <text
        x={x}
        y={y}
        fill="#030E19"
        textAnchor="middle"
        dominantBaseline="central"
        fontSize="10"
        fontWeight="500"
      >
        {`${(percent * 100).toFixed(1)}%`}
      </text>
    </g>
  );
};

type TooltipProps = {
  active?: boolean;
  payload?: Array<{
    payload: { name: string; value: number };
  }>;
};

const CustomTooltip = (props: TooltipProps) => {
  const { active, payload } = props;
  if (active && payload && payload.length && payload[0]) {
    const data = payload[0].payload as { name: string; value: number };
    return (
      <div className="flex flex-col bg-[#1E1B39] px-5 py-2 rounded-[6.2px]">
        <p className="font-inter text-[#E5E5EF] text-[10.63px] leading-[11.58px] text-center">
          {data.name}
        </p>
        <p className="font-inter font-bold text-white text-[12.58px] leading-[15.45px] text-center">
          {data.value}%
        </p>
      </div>
    );
  }
  return null;
};

export default function StockLevelChart({
  activeInStock,
  highStock,
  mediumStock,
  lowStock,
}: StockLevelChartProps) {
  const data = [
    { name: "High Stock", value: highStock },
    { name: "Medium Stock", value: mediumStock },
    { name: "Low Stock", value: lowStock },
  ];

  return (
    <div style={{ width: "300px", height: "300px" }} className="mx-auto">
      <ResponsiveContainer width={300} height={300}>
        <PieChart>
          <Tooltip content={<CustomTooltip />} />
          <Pie
            data={data}
            innerRadius={80}
            outerRadius={100}
            fill="#8884d8"
            cornerRadius={5}
            paddingAngle={2}
            dataKey="value"
            labelLine={false}
            label={renderCustomizedLabel}
            startAngle={90}
            endAngle={-270}
          >
            {data.map((entry, index) => (
              <Cell
                key={`cell-${index}`}
                fill={COLORS[index % COLORS.length]}
              />
            ))}
            <Label
              content={(props) => {
                const { viewBox } = props;
                if (viewBox && "cx" in viewBox && "cy" in viewBox) {
                  return (
                    <text
                      x={viewBox.cx}
                      y={viewBox.cy}
                      textAnchor="middle"
                      dominantBaseline="middle"
                    >
                      <tspan
                        x={viewBox.cx}
                        y={viewBox.cy}
                        fill="#0B1E66"
                        fontSize="24"
                        fontWeight="600"
                        style={{ fontFamily: "inherit" }}
                      >
                        {new Intl.NumberFormat("en-US").format(activeInStock)}
                      </tspan>
                      <tspan
                        x={viewBox.cx}
                        y={(viewBox.cy || 0) + 24}
                        fill="#6B7280"
                        fontSize="12"
                        style={{ fontFamily: "inherit" }}
                      >
                        Active In Stock
                      </tspan>
                    </text>
                  );
                }
                return null;
              }}
            />
          </Pie>
        </PieChart>
      </ResponsiveContainer>
    </div>
  );
}
