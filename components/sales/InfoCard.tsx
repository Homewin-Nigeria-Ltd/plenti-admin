import type { InfoCardData } from "@/types/sales";

export default function InfoCard({ data }: { data: InfoCardData }) {
  return (
    <div className="rounded-lg bg-[#E8EEFF] p-4">
      <p className="text-sm text-[#98A2B3] mb-4">{data.title}</p>
      <p className="text-[32px] font-semibold text-[#0B1E66] leading-tight mb-2">
        {data.value}
      </p>
      {data.subtitle && (
        <p className="text-xs text-[#98A2B3]">{data.subtitle}</p>
      )}
    </div>
  );
}
