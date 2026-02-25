import { salesStats } from "@/data/sales";
import StatCard from "@/components/sales/StatCard";

export default function SalesOverviewStats() {
  return (
    <div className="grid grid-cols-1 gap-4 md:grid-cols-2 xl:grid-cols-4">
      {salesStats.map((stat) => (
        <StatCard key={stat.title} stat={stat} />
      ))}
    </div>
  );
}
