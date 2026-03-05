"use client";

import DataTable from "@/components/common/DataTable";
import type { SalesTarget } from "@/store/useTargetsStore";
import { format } from "date-fns";

interface TargetTableProps {
  targets: SalesTarget[];
  page?: number;
  pageSize?: number;
  total?: number;
  pageCount?: number;
  onPageChange?: (page: number) => void;
}

export default function TargetTable({
  targets,
  page,
  pageSize,
  total,
  pageCount,
  onPageChange,
}: TargetTableProps) {
  console.log("Rendering TargetTable with targets:", targets);
  const columns = [
    { key: "createdDate", label: "Created Date", className: "min-w-[150px]" },
    { key: "period", label: "Period", className: "min-w-[180px]" },
    { key: "status", label: "Status", className: "min-w-[100px]" },
    { key: "teamMember", label: "Team Member", className: "min-w-[200px]" },
    { key: "target", label: "Target", className: "min-w-[120px]" },
    { key: "achieved", label: "Achieved", className: "min-w-[120px]" },
    { key: "progressBar", label: "Target", className: "min-w-[150px]" },
  ];

  const rows = targets.map((target) => {
    const user = target.user;
    const userName = user?.name || "Team Member";
    const firstRole = user?.roles?.[0];
    const userRole =
      firstRole != null
        ? typeof firstRole === "string"
          ? firstRole
          : firstRole?.name || "Team Member"
        : "Team Member";

    return {
      createdDate: (
        <span className="text-sm text-[#344054]">
          {format(new Date(target.created_at), "MMM dd, yyyy hh:mma")
            .replace("am", "AM")
            .replace("pm", "PM")}
        </span>
      ),
      period: (
        <span className="text-sm text-[#101828]">
          {format(new Date(target.start_date), "yyyy-MM-dd")} →{" "}
          {format(new Date(target.end_date), "yyyy-MM-dd")}
        </span>
      ),
      status: (
        <span
          className={`inline-flex px-3 py-1 rounded-full text-xs font-bold ${
            target.period === "quarterly"
              ? "bg-[#E7F6EC] text-[#027A48]"
              : target.period === "yearly"
                ? "bg-[#FFF4E6] text-[#FF9500]"
                : "bg-[#E7F6EC] text-[#027A48]"
          }`}
        >
          {target.period.charAt(0).toUpperCase() + target.period.slice(1)}
        </span>
      ),
      teamMember: (
        <div className="flex flex-col">
          <span className="text-sm font-medium text-[#101928]">{userName}</span>
          <span className="text-sm text-[#475367]">{userRole}</span>
        </div>
      ),
      target: (
        <span className="text-sm font-medium text-[#101828]">
          ₦{Math.round(Number(target.target_amount)).toLocaleString()}
        </span>
      ),
      achieved: (
        <span className="text-sm font-medium text-[#101928]">
          ₦{Math.round(Number(target.achieved_amount)).toLocaleString()}
        </span>
      ),
      progressBar: (
        <div className="flex items-center gap-2">
          <div className="flex-1 h-2 bg-[#E8EEFF] rounded-full overflow-hidden">
            <div
              className="h-full bg-[#0B1E66] rounded-full"
              style={{ width: `${target.progress_percentage}%` }}
            />
          </div>
          <span className="text-sm font-medium text-[#101928] min-w-11.25">
            {target.progress_percentage}%
          </span>
        </div>
      ),
    };
  });

  return (
    <DataTable
      columns={columns}
      rows={rows}
      page={page}
      pageSize={pageSize}
      total={total}
      pageCount={pageCount}
      onPageChange={onPageChange}
    />
  );
}
