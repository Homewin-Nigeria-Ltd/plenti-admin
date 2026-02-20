"use client";

import DataTable from "@/components/common/DataTable";
import type { TargetRow } from "@/types/sales";

interface TargetTableProps {
  targets: TargetRow[];
}

export default function TargetTable({ targets }: TargetTableProps) {
  const columns = [
    { key: "createdDate", label: "Created Date", className: "min-w-[150px]" },
    { key: "period", label: "Period", className: "min-w-[180px]" },
    { key: "status", label: "Status", className: "min-w-[100px]" },
    { key: "teamMember", label: "Team Member", className: "min-w-[200px]" },
    { key: "target", label: "Target", className: "min-w-[120px]" },
    { key: "achieved", label: "Achieved", className: "min-w-[120px]" },
    { key: "progressBar", label: "Target", className: "min-w-[150px]" },
  ];

  const rows = targets.map((target) => ({
    createdDate: (
      <span className="text-sm text-[#344054]">{target.createdDate}</span>
    ),
    period: <span className="text-sm text-[#101828]">{target.period}</span>,
    status: (
      <span
        className={`inline-flex px-3 py-1 rounded-full text-xs font-bold ${
          target.status === "Quarterly"
            ? "bg-[#E7F6EC] text-[#027A48]"
            : target.status === "Yearly"
            ? "bg-[#FFF4E6] text-[#FF9500]"
            : "bg-[#E7F6EC] text-[#027A48]"
        }`}
      >
        {target.status}
      </span>
    ),
    teamMember: (
      <div className="flex flex-col">
        <span className="text-sm font-medium text-[#101928]">
          {target.teamMemberName}
        </span>
        <span className="text-sm text-[#475367]">{target.teamMemberRole}</span>
      </div>
    ),
    target: (
      <span className="text-sm font-medium text-[#101828]">{target.target}</span>
    ),
    achieved: (
      <span className="text-sm font-medium text-[#101828]">
        {target.achieved}
      </span>
    ),
    progressBar: (
      <div className="flex items-center gap-2">
        <div className="flex-1 h-2 bg-[#E8EEFF] rounded-full overflow-hidden">
          <div
            className="h-full bg-[#0B1E66] rounded-full"
            style={{ width: `${target.progress}%` }}
          />
        </div>
        <span className="text-sm font-medium text-[#101828] min-w-[45px]">
          {target.percentage}
        </span>
      </div>
    ),
  }));

  return <DataTable columns={columns} rows={rows} />;
}
