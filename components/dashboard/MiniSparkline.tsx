"use client";

import { cn } from "@/lib/utils";

type MiniSparklineProps = {
  data?: number[];
  compareData?: number[];
  color?: string;
  compareColor?: string;
  fill?: string;
  className?: string;
  showDot?: boolean;
};

function toCoords(
  values: number[],
  width: number,
  height: number,
  min: number,
  range: number,
  pad = 0,
) {
  const inner = width - pad * 2;
  if (values.length === 1) {
    const y = height - ((values[0] - min) / range) * (height - 4) - 2;
    return [
      [pad, y],
      [width - pad, y],
    ] as const;
  }
  return values.map((value, index) => {
    const x = pad + (index / (values.length - 1)) * inner;
    const y = height - ((value - min) / range) * (height - 4) - 2;
    return [x, y] as const;
  });
}

export default function MiniSparkline({
  data = [],
  compareData,
  color = "#2F5BDB",
  compareColor = "rgba(255,255,255,0.45)",
  fill,
  className,
  showDot = false,
}: MiniSparklineProps) {
  const points = data.length > 0 ? data : [0, 0, 0, 0];
  const compare = compareData && compareData.length > 1 ? compareData : null;
  const all = compare ? [...points, ...compare] : points;
  const width = 160;
  const height = 48;
  const pad = showDot ? 4 : 0;
  const max = Math.max(...all, 1);
  const min = Math.min(...all, 0);
  const range = max - min || 1;
  const coords = toCoords(points, width, height, min, range, pad);
  const line = coords.map(([x, y]) => `${x},${y}`).join(" ");
  const area = `${pad},${height} ${line} ${width - pad},${height}`;
  const compareLine = compare
    ? toCoords(compare, width, height, min, range, pad)
        .map(([x, y]) => `${x},${y}`)
        .join(" ")
    : null;
  const last = coords[coords.length - 1];

  return (
    <svg
      viewBox={`0 0 ${width} ${height}`}
      className={cn("w-full h-12", className)}
      preserveAspectRatio="none"
    >
      {fill ? <polygon points={area} fill={fill} /> : null}
      {compareLine ? (
        <polyline
          points={compareLine}
          fill="none"
          stroke={compareColor}
          strokeWidth="1.8"
          strokeLinejoin="round"
          strokeLinecap="round"
          strokeDasharray="4 3"
        />
      ) : null}
      <polyline
        points={line}
        fill="none"
        stroke={color}
        strokeWidth="2"
        strokeLinejoin="round"
        strokeLinecap="round"
      />
      {showDot && last ? (
        <circle cx={last[0]} cy={last[1]} r="3.2" fill={color} />
      ) : null}
    </svg>
  );
}
