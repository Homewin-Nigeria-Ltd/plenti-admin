import Image from "next/image";
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
          <p className="text-xs text-[#1A3FA3] bg-[#E8EEFF] rounded-2xl px-3 py-1">
            {stat.subtitle}
          </p>
        </div>
        <div className="shrink-0">
          <Image
            src={stat.trendIcon}
            alt="trend"
            width={75}
            height={29}
            className="object-contain"
          />
        </div>
      </div>
    </div>
  );
}
