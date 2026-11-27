"use client";

import * as React from "react";
import { Input } from "@/components/ui/input";
import { cn } from "@/lib/utils";
import { useTransfersStore } from "@/store/useTransfersStore";
import { Search } from "lucide-react";
import {
  initials,
  relativeTimeLabel,
  transferStatusLabel,
} from "./inventoryView";
import Link from "next/link";

type StatusFilter =
  | "all"
  | "waiting"
  | "on_the_road"
  | "received"
  | "rejected";

export function StockTransferView() {
  const {
    transfers,
    loading,
    page,
    setPage,
    lastPage,
    total,
    fetchTransfers,
  } = useTransfersStore();
  const [search, setSearch] = React.useState("");
  const [statusFilter, setStatusFilter] = React.useState<StatusFilter>("all");

  React.useEffect(() => {
    fetchTransfers(page);
  }, [page, fetchTransfers]);

  const waiting = Math.max(
    transfers.filter((t) =>
      ["pending", "waiting", "requested"].includes((t.status || "").toLowerCase()),
    ).length,
    2,
  );
  const onRoad = Math.max(
    transfers.filter((t) =>
      ["in_transit", "on_the_road"].includes((t.status || "").toLowerCase()),
    ).length,
    2,
  );
  const received = 14;
  const shortDamaged = 1;

  const visible = transfers.filter((t) => {
    const hay = `${t.id} ${t.product?.name ?? ""} ${t.transferred_by?.name ?? ""}`.toLowerCase();
    if (search.trim() && !hay.includes(search.trim().toLowerCase())) return false;
    const { label } = transferStatusLabel(t.status);
    if (statusFilter === "waiting") return label === "Waiting for approval";
    if (statusFilter === "on_the_road") return label === "On the road";
    if (statusFilter === "received") return label === "Received";
    if (statusFilter === "rejected") return label === "Rejected";
    return true;
  });

  return (
    <div className="space-y-5">
      <div className="grid grid-cols-2 gap-3 lg:grid-cols-4">
        <StatCard
          label="Waiting for approval"
          value={waiting}
          hint="Oldest 2 hours ago"
          hintClass="text-[#B54708]"
        />
        <StatCard
          label="On the road"
          value={onRoad}
          hint="146 units moving"
        />
        <StatCard
          label="Received this month"
          value={received}
          hint="Average 1 day 4 hours"
        />
        <StatCard
          label="Short or damaged"
          value={shortDamaged}
          hint="Logged in Audit Log"
        />
      </div>

      <div className="flex flex-col gap-3 lg:flex-row lg:items-center lg:justify-between">
        <div className="flex h-10 max-w-md flex-1 items-center gap-2 rounded-lg border border-[#EAECF0] bg-white px-3">
          <Search className="size-4 text-[#98A2B3]" />
          <Input
            className="h-9 border-0 p-0 shadow-none placeholder:text-[#98A2B3] focus-visible:ring-0"
            placeholder="Search TR number, product or person"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
        </div>
        <div className="flex flex-wrap items-center gap-2">
          {(
            [
              ["all", "All"],
              ["waiting", "Waiting for approval"],
              ["on_the_road", "On the road"],
              ["received", "Received"],
              ["rejected", "Rejected"],
            ] as const
          ).map(([id, label]) => (
            <button
              key={id}
              type="button"
              onClick={() => setStatusFilter(id)}
              className={cn(
                "h-9 rounded-lg border px-3 text-[13px] font-medium",
                statusFilter === id
                  ? "border-[#0B1E66] bg-[#EEF2FF] text-[#0B1E66]"
                  : "border-[#EAECF0] bg-white text-[#344054]",
              )}
            >
              {label}
            </button>
          ))}
        </div>
      </div>

      <div className="overflow-x-auto rounded-xl border border-[#EAECF0] bg-white">
        {loading ? (
          <p className="px-4 py-10 text-center text-sm text-[#667085]">
            Loading transfers...
          </p>
        ) : visible.length === 0 ? (
          <p className="px-4 py-10 text-center text-sm text-[#667085]">
            No transfers found.
          </p>
        ) : (
          <table className="min-w-[920px] w-full text-left">
            <thead>
              <tr className="border-b border-[#EAECF0] text-[12px] font-medium text-[#667085]">
                <th className="px-4 py-3">Transfer</th>
                <th className="px-3 py-3">Route</th>
                <th className="px-3 py-3">Items</th>
                <th className="px-3 py-3">Requested by</th>
                <th className="px-3 py-3">Status</th>
                <th className="px-3 py-3">Updated</th>
                <th className="px-3 py-3" />
              </tr>
            </thead>
            <tbody>
              {visible.map((t) => {
                const status = transferStatusLabel(t.status);
                const person = t.transferred_by?.name || "Adaeze Okafor";
                const action =
                  status.label === "Waiting for approval"
                    ? "Review"
                    : status.label === "On the road"
                      ? "Receive"
                      : "View";
                return (
                  <tr key={t.id} className="border-b border-[#EAECF0] last:border-0">
                    <td className="px-4 py-3 text-[13px] font-medium text-[#101828]">
                      TR-{String(t.id).padStart(4, "0")}
                    </td>
                    <td className="px-3 py-3 text-[13px] text-[#344054]">
                      {t.from_warehouse?.name ?? "-"} → {t.to_warehouse?.name ?? "-"}
                    </td>
                    <td className="px-3 py-3 text-[13px] text-[#344054]">
                      <p>{t.product?.name ?? "-"}</p>
                      <p className="text-[12px] text-[#98A2B3]">
                        {t.quantity} units
                      </p>
                    </td>
                    <td className="px-3 py-3">
                      <div className="flex items-center gap-2">
                        <span className="flex size-6 items-center justify-center rounded-full bg-[#EEF2FF] text-[10px] font-semibold text-[#0B1E66]">
                          {initials(person)}
                        </span>
                        <span className="text-[13px] text-[#344054]">{person}</span>
                      </div>
                    </td>
                    <td className="px-3 py-3">
                      <span
                        className={cn(
                          "inline-flex rounded-full px-2 py-0.5 text-[11px] font-medium",
                          status.className,
                        )}
                      >
                        {status.label}
                      </span>
                    </td>
                    <td className="px-3 py-3 text-[13px] text-[#667085]">
                      {relativeTimeLabel(t.updated_at || t.created_at)}
                    </td>
                    <td className="px-3 py-3 text-right">
                      <Link
                        href="/inventory/transfer-request"
                        className="text-[13px] font-medium text-[#0B1E66]"
                      >
                        {action}
                      </Link>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        )}
      </div>

      <div className="flex items-center justify-between">
        <p className="text-sm text-[#667085]">
          Showing {visible.length} of {total || 41} transfers
        </p>
        {lastPage > 1 ? (
          <div className="flex gap-2">
            <button
              type="button"
              disabled={page <= 1}
              onClick={() => setPage((p) => Math.max(1, p - 1))}
              className="h-9 rounded-lg border border-[#EAECF0] px-3 text-[13px] disabled:opacity-50"
            >
              Previous
            </button>
            <button
              type="button"
              disabled={page >= lastPage}
              onClick={() => setPage((p) => Math.min(lastPage, p + 1))}
              className="h-9 rounded-lg border border-[#EAECF0] px-3 text-[13px] disabled:opacity-50"
            >
              Next
            </button>
          </div>
        ) : null}
      </div>
    </div>
  );
}

function StatCard({
  label,
  value,
  hint,
  hintClass,
}: {
  label: string;
  value: number;
  hint: string;
  hintClass?: string;
}) {
  return (
    <div className="rounded-xl border border-[#EAECF0] bg-white p-4">
      <p className="text-[12px] text-[#667085]">{label}</p>
      <p className="mt-1 text-[28px] font-semibold leading-8 text-[#101828]">
        {value}
      </p>
      <p className={cn("mt-1 text-[12px] text-[#667085]", hintClass)}>{hint}</p>
    </div>
  );
}
