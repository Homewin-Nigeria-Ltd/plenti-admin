"use client";

import * as React from "react";
import Image from "next/image";
import api from "@/lib/api";
import { INVENTORY_API } from "@/data/inventory";
import type { AuditLogEntry, AuditLogResponse } from "@/types/InventoryTypes";
import { toast } from "sonner";

function formatAuditDate(iso: string): { date: string; time: string } {
  try {
    const d = new Date(iso);
    const date = d.toLocaleDateString("en-US", {
      month: "short",
      day: "numeric",
      year: "numeric",
    });
    const time = d.toLocaleTimeString("en-US", {
      hour: "2-digit",
      minute: "2-digit",
      hour12: true,
    });
    return { date, time };
  } catch {
    return { date: "—", time: "—" };
  }
}

function getEntryTitle(entry: AuditLogEntry): string {
  const productName = entry.product?.name ?? "Product";
  switch (entry.action_type) {
    case "stock_transfer":
      return `${productName} transferred to another warehouse`;
    case "stock_in":
      return `Stock added for ${productName}`;
    case "transfer_status_update":
      return `Transfer status updated`;
    default:
      return productName;
  }
}

export function AuditLogView() {
  const [entries, setEntries] = React.useState<AuditLogEntry[]>([]);
  const [loading, setLoading] = React.useState(true);
  const [page, setPage] = React.useState(1);
  const [lastPage, setLastPage] = React.useState(1);
  const [total, setTotal] = React.useState(0);

  const fetchAuditLog = React.useCallback(async (pageNum: number) => {
    setLoading(true);
    try {
      const { data } = await api.get<AuditLogResponse>(INVENTORY_API.auditLog, {
        params: { page: pageNum, per_page: 20 },
      });
      if (data?.status === "success" && data?.data) {
        setEntries(data.data.data ?? []);
        setLastPage(data.data.last_page ?? 1);
        setTotal(data.data.total ?? 0);
      } else {
        setEntries([]);
      }
    } catch (err) {
      console.error("Audit log fetch error:", err);
      toast.error("Failed to load audit log");
      setEntries([]);
    } finally {
      setLoading(false);
    }
  }, []);

  React.useEffect(() => {
    fetchAuditLog(page);
  }, [page, fetchAuditLog]);

  return (
    <div className="space-y-6">
      {loading ? (
        <div className="space-y-4">
          {Array.from({ length: 5 }).map((_, i) => (
            <div
              key={i}
              className="bg-white rounded-xl border border-[#EAECF0] p-4 sm:p-5 animate-pulse"
            >
              <div className="flex gap-3">
                <div className="size-[26px] rounded-full bg-neutral-200 shrink-0" />
                <div className="flex-1 space-y-2">
                  <div className="h-4 bg-neutral-200 rounded w-3/4" />
                  <div className="h-3 bg-neutral-100 rounded w-1/2" />
                  <div className="h-3 bg-neutral-100 rounded w-full" />
                </div>
              </div>
            </div>
          ))}
        </div>
      ) : entries.length === 0 ? (
        <div className="bg-white rounded-xl border border-[#EAECF0] p-8 text-center text-[#667085] text-sm">
          No audit log entries found.
        </div>
      ) : (
        <>
          <div className="space-y-4">
            {entries.map((entry) => {
              const { date, time } = formatAuditDate(entry.created_at);
              const title = getEntryTitle(entry);
              const userName = entry.user?.name ?? "—";
              return (
                <div
                  key={entry.id}
                  className="bg-white rounded-xl border border-[#EAECF0] p-4 sm:p-5"
                >
                  <div className="flex gap-3">
                    <Image
                      src="/signal.svg"
                      alt=""
                      width={26}
                      height={26}
                      className="shrink-0 mt-0.5"
                    />
                    <div className="min-w-0 flex-1">
                      <div className="flex flex-wrap items-baseline justify-between gap-x-3 gap-y-1">
                        <p className="font-semibold text-[#101928]">{title}</p>
                        <p className="text-[#667085] text-sm shrink-0">
                          {date} | {time} • {userName}
                        </p>
                      </div>
                      <p className="text-[#667085] text-sm mt-2">
                        {entry.description}
                      </p>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
          {lastPage > 1 && (
            <div className="flex items-center justify-between gap-4 flex-wrap">
              <p className="text-[#667085] text-sm">
                Showing page {page} of {lastPage} ({total} entries)
              </p>
              <div className="flex gap-2">
                <button
                  type="button"
                  onClick={() => setPage((p) => Math.max(1, p - 1))}
                  disabled={page <= 1}
                  className="px-3 py-1.5 text-sm font-medium rounded-[3px] border border-[#EAECF0] text-[#101928] disabled:opacity-50 disabled:cursor-not-allowed hover:bg-neutral-50"
                >
                  Previous
                </button>
                <button
                  type="button"
                  onClick={() => setPage((p) => Math.min(lastPage, p + 1))}
                  disabled={page >= lastPage}
                  className="px-3 py-1.5 text-sm font-medium rounded-[3px] border border-[#EAECF0] text-[#101928] disabled:opacity-50 disabled:cursor-not-allowed hover:bg-neutral-50"
                >
                  Next
                </button>
              </div>
            </div>
          )}
        </>
      )}
    </div>
  );
}
