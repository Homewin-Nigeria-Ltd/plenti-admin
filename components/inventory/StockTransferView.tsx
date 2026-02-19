"use client";

import * as React from "react";
import { ArrowRightLeft } from "lucide-react";
import { useTransfersStore } from "@/store/useTransfersStore";

function formatTransferDate(iso: string): string {
  try {
    const d = new Date(iso);
    return d.toLocaleDateString("en-CA", {
      year: "numeric",
      month: "2-digit",
      day: "2-digit",
    });
  } catch {
    return "—";
  }
}

function getStatusLabel(status: string): string {
  if (status === "completed") return "Complete";
  if (status === "in_transit") return "In Transit";
  return status;
}

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

  React.useEffect(() => {
    fetchTransfers(page);
  }, [page, fetchTransfers]);

  return (
    <div className="space-y-6">
      {loading ? (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {Array.from({ length: 4 }).map((_, i) => (
            <div
              key={i}
              className="bg-white rounded-xl border border-[#EAECF0] p-4 sm:p-5 animate-pulse"
            >
              <div className="flex items-start gap-3">
                <div className="size-10 rounded-lg bg-neutral-200 shrink-0" />
                <div className="flex-1 space-y-2">
                  <div className="h-4 bg-neutral-200 rounded w-32" />
                  <div className="h-3 bg-neutral-100 rounded w-48" />
                  <div className="h-3 bg-neutral-100 rounded w-20" />
                </div>
                <div className="h-6 w-16 rounded-full bg-neutral-100" />
              </div>
            </div>
          ))}
        </div>
      ) : transfers.length === 0 ? (
        <div className="bg-white rounded-xl border border-[#EAECF0] p-8 text-center text-[#667085] text-sm">
          No transfers found.
        </div>
      ) : (
        <>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {transfers.map((t) => (
              <div
                key={t.id}
                className="bg-white rounded-xl border border-[#EAECF0] p-4 sm:p-5 flex flex-col gap-3"
              >
                <div className="flex items-start gap-3">
                  <div className="flex items-center justify-center size-10 rounded-lg bg-[#0B1E66] shrink-0">
                    <ArrowRightLeft className="size-5 text-white" />
                  </div>
                  <div className="min-w-0 flex-1">
                    <p className="font-semibold text-primary text-sm">
                      {t.product?.name ?? "—"}
                    </p>
                    <p className="text-[#667085] text-xs mt-0.5">
                      {t.from_warehouse?.name ?? "—"} → {t.to_warehouse?.name ?? "—"} • {t.quantity} units
                    </p>
                    <p className="text-[#667085] text-xs mt-1">
                      {formatTransferDate(t.created_at)}
                    </p>
                  </div>
                  <span
                    className={
                      t.status === "completed"
                        ? "px-2.5 py-1 rounded-full text-xs font-medium bg-emerald-100 text-emerald-800"
                        : "px-2.5 py-1 rounded-full text-xs font-medium bg-neutral-100 text-neutral-700"
                    }
                  >
                    {getStatusLabel(t.status)}
                  </span>
                </div>
              </div>
            ))}
          </div>
          {lastPage > 1 && (
            <div className="flex items-center justify-between gap-4 flex-wrap">
              <p className="text-[#667085] text-sm">
                Showing page {page} of {lastPage} ({total} transfers)
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
