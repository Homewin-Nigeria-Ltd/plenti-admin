"use client";

import * as React from "react";
import DataTable from "@/components/common/DataTable";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Input } from "@/components/ui/input";
import Image from "next/image";
import {
  RefundDetailsModal,
  type RefundDetailsView,
} from "./RefundDetailsModal";
import { RefundApprovalConfirmModal } from "./RefundApprovalConfirmModal";
import { RejectRefundModal } from "./RejectRefundModal";
import { toast } from "sonner";
import { useFinanceStore } from "@/store/useFinanceStore";
import { formatCurrency } from "@/lib/format";
import { getFinancePermissions } from "@/lib/modulePermissions";
import { useAccountStore } from "@/store/useAccountStore";
import type { Refund, RefundFilter, RefundMetrics } from "@/types/FinanceTypes";
import { useDebounce } from "use-debounce";

const FILTERS: Array<{
  key: RefundFilter;
  label: string;
  countKey: keyof RefundMetrics;
}> = [
  { key: "all", label: "All Refunds", countKey: "total" },
  {
    key: "awaiting-approval",
    label: "Awaiting Approval",
    countKey: "awaiting_approval",
  },
  {
    key: "awaiting-processing",
    label: "Awaiting Processing",
    countKey: "awaiting_processing",
  },
  { key: "rejected", label: "Rejected Refund", countKey: "rejected" },
];

function formatRefundDate(iso?: string) {
  if (!iso) return "-";
  const date = new Date(iso);
  if (Number.isNaN(date.getTime())) return iso;
  return new Intl.DateTimeFormat("en-US", {
    month: "short",
    day: "numeric",
    year: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  }).format(date);
}

function statusChip(status: string) {
  const value = status.trim().toLowerCase();
  let className = "bg-gray-100 text-gray-700";
  if (value.includes("reject")) className = "bg-[#FEF6F7] text-[#E71D36]";
  else if (value.includes("approved") && !value.includes("awaiting"))
    className = "bg-[#ECFDF3] text-green-700";
  else if (value.includes("process") || value.includes("awaiting") || value === "pending")
    className = "bg-[#FFFBF5] text-[#FF9500]";

  return (
    <span
      className={`px-3 w-fit py-1 rounded-full text-center text-xs font-medium ${className}`}
    >
      {status || "-"}
    </span>
  );
}

function toDetailsView(
  refund: Refund,
  detail?: {
    refund_id?: string;
    customer_name?: string;
    customer_email?: string;
    customer_phone?: string;
    order_number?: string;
    amount?: number;
    status?: string;
    reason?: string;
    description?: string;
    payment_method?: string;
    gateway?: string;
    created_at?: string;
  } | null
): RefundDetailsView {
  return {
    refundId: detail?.refund_id || refund.refundId,
    customerName: detail?.customer_name || refund.customerName,
    customerEmail: detail?.customer_email || refund.customerEmail,
    customerPhone: detail?.customer_phone,
    amount: detail?.amount ?? refund.amount,
    orderId: detail?.order_number || refund.orderId,
    status: detail?.status || refund.status,
    reason: detail?.reason || refund.reason,
    description: detail?.description,
    paymentMethod: detail?.payment_method,
    gateway: detail?.gateway,
    requestedAt: detail?.created_at || refund.requestedAt,
  };
}

export function RefundRequestTable() {
  const account = useAccountStore((state) => state.account);
  const { canManageFinanceRefunds } = React.useMemo(
    () => getFinancePermissions(account),
    [account]
  );

  const {
    refunds,
    loadingRefunds,
    refundPagination,
    refundMetrics,
    selectedRefundDetail,
    loadingRefundDetail,
    refundActionLoading,
    fetchRefunds,
    fetchRefundMetrics,
    fetchRefundDetail,
    approveRefund,
    rejectRefund,
    markRefundProcessed,
  } = useFinanceStore();

  const [filter, setFilter] = React.useState<RefundFilter>("all");
  const [search, setSearch] = React.useState("");
  const [debouncedSearch] = useDebounce(search, 400);
  const [page, setPage] = React.useState(1);
  const [selectedRefund, setSelectedRefund] = React.useState<Refund | null>(
    null
  );
  const [isModalOpen, setIsModalOpen] = React.useState(false);
  const [showConfirmModal, setShowConfirmModal] = React.useState(false);
  const [showRejectModal, setShowRejectModal] = React.useState(false);
  const [processConfirm, setProcessConfirm] = React.useState(false);
  const isOpeningConfirmModal = React.useRef(false);
  const isOpeningRejectModal = React.useRef(false);
  const pageSize = 10;

  React.useEffect(() => {
    setPage(1);
  }, [debouncedSearch]);

  React.useEffect(() => {
    fetchRefunds(page, pageSize, filter, debouncedSearch);
  }, [page, filter, debouncedSearch, fetchRefunds]);

  React.useEffect(() => {
    fetchRefundMetrics();
  }, [fetchRefundMetrics]);

  const refreshRefunds = React.useCallback(async () => {
    await Promise.all([
      fetchRefunds(page, pageSize, filter, debouncedSearch),
      fetchRefundMetrics(),
    ]);
  }, [fetchRefunds, fetchRefundMetrics, page, filter, debouncedSearch]);

  const detailsView = selectedRefund
    ? toDetailsView(selectedRefund, selectedRefundDetail)
    : null;

  const handleRowClick = async (
    _row: Record<string, React.ReactNode>,
    index: number
  ) => {
    const clickedRefund = refunds[index];
    if (!clickedRefund) return;
    setSelectedRefund(clickedRefund);
    setIsModalOpen(true);
    await fetchRefundDetail(clickedRefund.id);
  };

  const handleApproveClick = () => {
    isOpeningConfirmModal.current = true;
    setIsModalOpen(false);
    setTimeout(() => {
      setShowConfirmModal(true);
      isOpeningConfirmModal.current = false;
    }, 100);
  };

  const handleMarkProcessedClick = () => {
    isOpeningConfirmModal.current = true;
    setIsModalOpen(false);
    setTimeout(() => {
      setProcessConfirm(true);
      isOpeningConfirmModal.current = false;
    }, 100);
  };

  const handleCloseDetailsModal = () => {
    setIsModalOpen(false);
    if (!isOpeningConfirmModal.current && !isOpeningRejectModal.current) {
      setSelectedRefund(null);
    }
  };

  const handleConfirmApprove = async () => {
    if (!selectedRefund) return;
    const ok = await approveRefund(selectedRefund.id);
    if (ok) {
      toast.success("Refund approved");
      setShowConfirmModal(false);
      setSelectedRefund(null);
      await refreshRefunds();
      return;
    }
    toast.error("Failed to approve refund");
  };

  const handleConfirmProcessed = async () => {
    if (!selectedRefund) return;
    const ok = await markRefundProcessed(selectedRefund.id);
    if (ok) {
      toast.success("Refund marked as processed");
      setProcessConfirm(false);
      setSelectedRefund(null);
      await refreshRefunds();
      return;
    }
    toast.error("Failed to mark refund as processed");
  };

  const handleCloseConfirmModal = () => {
    setShowConfirmModal(false);
    setProcessConfirm(false);
    setSelectedRefund(null);
  };

  const handleRejectClick = () => {
    isOpeningRejectModal.current = true;
    setIsModalOpen(false);
    setTimeout(() => {
      setShowRejectModal(true);
      isOpeningRejectModal.current = false;
    }, 100);
  };

  const handleCloseRejectModal = () => {
    setShowRejectModal(false);
    setSelectedRefund(null);
  };

  const handleConfirmReject = async (reason: string) => {
    if (!selectedRefund) return;
    const ok = await rejectRefund(selectedRefund.id, reason);
    if (ok) {
      toast.success("Refund rejected");
      setShowRejectModal(false);
      setSelectedRefund(null);
      await refreshRefunds();
      return;
    }
    toast.error("Failed to reject refund");
  };

  const columns = [
    { key: "refundDate", label: "Refund Date" },
    { key: "refundId", label: "Refund ID" },
    { key: "customer", label: "Customer Name" },
    { key: "amount", label: "Amount" },
    { key: "reason", label: "Reason" },
    { key: "status", label: "Status" },
  ];

  const rows = refunds.map((refund) => {
    const initial = refund.customerName?.charAt(0)?.toUpperCase() || "-";
    return {
      refundDate: formatRefundDate(refund.requestedAt),
      refundId: refund.refundId,
      customer: (
        <div className="flex items-center gap-3">
          <Avatar className="size-8">
            <AvatarFallback className="bg-[#0B1E66] text-white">
              {initial}
            </AvatarFallback>
          </Avatar>
          <div>
            <p className="font-medium text-[#0B1E66]">{refund.customerName}</p>
            <p className="text-[#667085] text-xs">{refund.customerEmail}</p>
          </div>
        </div>
      ),
      amount: formatCurrency(refund.amount, { minimumFractionDigits: 2 }),
      reason: (
        <p className="text-[#101928] text-sm line-clamp-2">
          {refund.reason || "-"}
        </p>
      ),
      status: (
        <div className="flex flex-col gap-1">{statusChip(refund.status)}</div>
      ),
    };
  });

  const total = refundPagination?.totalCount ?? 0;
  const currentPage = refundPagination?.page || page;
  const currentPageSize = refundPagination?.pageSize || pageSize;

  return (
    <div className="space-y-6">
      <div className="border border-[#F0F2F5] rounded-xl h-9.5 flex items-center gap-1 p-1 px-4 shadow-sm">
        <Image src={"/icons/search.png"} alt="Search" width={20} height={20} />
        <Input
          value={search}
          onChange={(event) => setSearch(event.target.value)}
          className="w-full placeholder:text-[#253B4B] border-0 outline-none focus-visible:ring-0 shadow-none"
          placeholder="Search"
        />
      </div>

      <div className="flex items-center gap-4 border-b border-gray-200 overflow-x-auto">
        {FILTERS.map((item) => (
          <button
            key={item.key}
            onClick={() => {
              setFilter(item.key);
              setPage(1);
            }}
            className={
              filter === item.key
                ? "text-[#0B1E66] font-medium rounded-[3px] border-b border-primary px-3 py-3 whitespace-nowrap"
                : "text-[#98A2B3] px-3 py-3 whitespace-nowrap"
            }
          >
            {item.label}
            <span className="ml-1.5 text-xs">
              ({refundMetrics?.[item.countKey] ?? 0})
            </span>
          </button>
        ))}
      </div>

      {loadingRefunds && refunds.length === 0 ? (
        <p className="text-center my-5 text-[#667085]">Loading refunds…</p>
      ) : refunds.length > 0 ? (
        <DataTable
          columns={columns}
          rows={rows}
          page={currentPage}
          pageSize={currentPageSize}
          total={total}
          pageCount={Math.max(1, Math.ceil(total / currentPageSize))}
          onPageChange={setPage}
          onRowClick={handleRowClick}
        />
      ) : (
        <p className="text-center my-5">No Refunds Available</p>
      )}

      <RefundDetailsModal
        isOpen={isModalOpen}
        onClose={handleCloseDetailsModal}
        refund={detailsView}
        loading={loadingRefundDetail}
        canManage={canManageFinanceRefunds}
        actionLoading={refundActionLoading}
        onApprove={handleApproveClick}
        onReject={handleRejectClick}
        onMarkProcessed={handleMarkProcessedClick}
      />

      <RefundApprovalConfirmModal
        isOpen={showConfirmModal || processConfirm}
        onClose={handleCloseConfirmModal}
        onConfirm={processConfirm ? handleConfirmProcessed : handleConfirmApprove}
        confirming={refundActionLoading}
        confirmLabel={processConfirm ? "Mark processed" : "Approve Refund"}
        description={
          processConfirm && detailsView
            ? `You are about to mark ${formatCurrency(detailsView.amount, { minimumFractionDigits: 2 })} refund to ${detailsView.customerName} as processed. This action cannot be undone.`
            : undefined
        }
        refund={
          detailsView
            ? {
                refundId: detailsView.refundId,
                customerName: detailsView.customerName,
                amount: detailsView.amount,
              }
            : null
        }
      />

      <RejectRefundModal
        isOpen={showRejectModal}
        onClose={handleCloseRejectModal}
        onConfirm={handleConfirmReject}
        confirming={refundActionLoading}
        refundId={selectedRefund?.refundId ?? null}
      />
    </div>
  );
}
