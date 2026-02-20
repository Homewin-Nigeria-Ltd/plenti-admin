"use client";

import * as React from "react";
import DataTable from "@/components/common/DataTable";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Input } from "@/components/ui/input";
import Image from "next/image";
import { RefundDetailsModal } from "./RefundDetailsModal";
import { RefundApprovalConfirmModal } from "./RefundApprovalConfirmModal";
import { RejectRefundModal } from "./RejectRefundModal";
import { toast } from "sonner";
import { useFinanceStore } from "@/store/useFinanceStore";

type RefundStatus = "Approved" | "Processing" | "Rejected";

type RefundRequest = {
  refundDate: string;
  refundId: string;
  customerName: string;
  customerEmail: string;
  customerPhone?: string;
  amount: number;
  orderAmount?: number;
  orderId?: string;
  transactionId?: string;
  paymentMethod?: string;
  paymentGateway?: string;
  orderStatus: string;
  orderStatusDescription: string;
  status: RefundStatus;
};

// Mock data - replace with actual data source
const mockRefunds: RefundRequest[] = [
  {
    refundDate: "Apr 12, 2023 09:32AM",
    refundId: "REF-2024-001",
    customerName: "Adebayo Johnson",
    customerEmail: "adebayo.j@email.com",
    customerPhone: "+234 801 234 5678",
    amount: 45200.0,
    orderAmount: 45200.0,
    orderId: "ORD-2841",
    transactionId: "TXN-8901",
    paymentMethod: "Card",
    paymentGateway: "Paystack",
    orderStatus: "Order Not Delivered",
    orderStatusDescription:
      "Order was not delivered after 5 days. Customer wants full refund.",
    status: "Approved",
  },
  {
    refundDate: "Apr 12, 2023 09:32AM",
    refundId: "#0002",
    customerName: "John Doe",
    customerEmail: "johndoe@email.com",
    customerPhone: "+234 802 345 6789",
    amount: 1500.0,
    orderAmount: 1500.0,
    orderId: "ORD-2842",
    transactionId: "TXN-8902",
    paymentMethod: "Card",
    paymentGateway: "Paystack",
    orderStatus: "Product Defective/Damaged",
    orderStatusDescription:
      "One item in the order arrived damaged. Partial refund for that item.",
    status: "Processing",
  },
  {
    refundDate: "Apr 12, 2023 09:32AM",
    refundId: "#0003",
    customerName: "Jane Smith",
    customerEmail: "janesmith@email.com",
    customerPhone: "+234 803 456 7890",
    amount: 3200.0,
    orderAmount: 3200.0,
    orderId: "ORD-2843",
    transactionId: "TXN-8903",
    paymentMethod: "Wallet",
    paymentGateway: "Flutterwave",
    orderStatus: "Payment Error",
    orderStatusDescription:
      "Payment failed but amount was debited from customer account.",
    status: "Rejected",
  },
  {
    refundDate: "Apr 12, 2023 09:32AM",
    refundId: "#0004",
    customerName: "Alice Johnson",
    customerEmail: "alice@email.com",
    customerPhone: "+234 804 567 8901",
    amount: 1800.0,
    orderAmount: 1800.0,
    orderId: "ORD-2844",
    transactionId: "TXN-8904",
    paymentMethod: "Bank Transfer",
    paymentGateway: "Paystack",
    orderStatus: "Customer Request",
    orderStatusDescription: "Customer changed mind before delivery.",
    status: "Processing",
  },
  {
    refundDate: "Apr 12, 2023 09:32AM",
    refundId: "#0005",
    customerName: "Bob Williams",
    customerEmail: "bob@email.com",
    customerPhone: "+234 805 678 9012",
    amount: 4500.0,
    orderAmount: 4500.0,
    orderId: "ORD-2845",
    transactionId: "TXN-8905",
    paymentMethod: "Card",
    paymentGateway: "Paystack",
    orderStatus: "Duplicate Payment",
    orderStatusDescription: "Customer was charged twice for the same order.",
    status: "Rejected",
  },
  {
    refundDate: "Apr 12, 2023 09:32AM",
    refundId: "#0006",
    customerName: "Charlie Brown",
    customerEmail: "charlie@email.com",
    customerPhone: "+234 806 789 0123",
    amount: 2100.0,
    orderAmount: 2100.0,
    orderId: "ORD-2846",
    transactionId: "TXN-8906",
    paymentMethod: "Card",
    paymentGateway: "Paystack",
    orderStatus: "Payment Error",
    orderStatusDescription:
      "Payment failed but amount was debited from customer account.",
    status: "Approved",
  },
];

type RefundFilter =
  | "all"
  | "awaiting-approval"
  | "rejected"
  | "awaiting-processing";

export function RefundRequestTable() {
  const { refunds, loadingRefunds, refundPagination } = useFinanceStore();

  // LOCAL STATES
  const [filter, setFilter] = React.useState<RefundFilter>("all");
  const [page, setPage] = React.useState(1);
  const [selectedRefund, setSelectedRefund] =
    React.useState<RefundRequest | null>(null);
  const [isModalOpen, setIsModalOpen] = React.useState(false);
  const [showConfirmModal, setShowConfirmModal] = React.useState(false);
  const [showRejectModal, setShowRejectModal] = React.useState(false);
  const isOpeningConfirmModal = React.useRef(false);
  const isOpeningRejectModal = React.useRef(false);
  const pageSize = 6;

  // FETCH ALL REFUNDS ON MOUNT
  // React.useEffect(() => {
  //   // FETCH ONLY WHEN THERE ARE NOT REFUNDS
  //   if (refunds.length === 0) {
  //     fetchRefunds(1);
  //   }
  // }, [fetchRefunds, refunds]);

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat("en-NG", {
      style: "currency",
      currency: "NGN",
      minimumFractionDigits: 2,
      maximumFractionDigits: 2,
    }).format(amount);
  };

  const statusChip = (status: RefundStatus) => {
    const colorMap = {
      Approved: "bg-[#ECFDF3] text-green-700",
      Processing: "bg-[#FFFBF5] text-[#FF9500]",
      Rejected: "bg-[#FEF6F7] text-[#E71D36]",
    };
    return (
      <span
        className={`px-3 w-fit py-1 rounded-full text-center text-xs font-medium ${colorMap[status]}`}
      >
        {status}
      </span>
    );
  };

  // Filter refunds based on selected filter
  const filteredRefunds = React.useMemo(() => {
    if (filter === "all") return mockRefunds;
    if (filter === "awaiting-approval")
      return mockRefunds.filter((r) => r.status === "Processing");
    if (filter === "rejected")
      return mockRefunds.filter((r) => r.status === "Rejected");
    if (filter === "awaiting-processing")
      return mockRefunds.filter((r) => r.status === "Approved");
    return mockRefunds;
  }, [filter]);

  // Paginate filtered refunds
  const paginatedRefunds = React.useMemo(() => {
    const start = (page - 1) * pageSize;
    const end = start + pageSize;
    return filteredRefunds.slice(start, end);
  }, [filteredRefunds, page]);

  const columns = [
    { key: "refundDate", label: "Refund Date" },
    { key: "refundId", label: "Refund ID" },
    { key: "customer", label: "Customer Name" },
    { key: "amount", label: "Amount" },
    { key: "orderStatus", label: "Order Status" },
    { key: "status", label: "Status" },
  ];

  const handleRowClick = (
    _row: Record<string, React.ReactNode>,
    index: number
  ) => {
    const clickedRefund = paginatedRefunds[index];
    if (clickedRefund) {
      setSelectedRefund(clickedRefund);
      setIsModalOpen(true);
    }
  };

  const handleApproveClick = () => {
    isOpeningConfirmModal.current = true;
    setIsModalOpen(false);
    // Use setTimeout to ensure state update happens after modal closes
    setTimeout(() => {
      setShowConfirmModal(true);
      isOpeningConfirmModal.current = false;
    }, 100);
  };

  const handleCloseDetailsModal = () => {
    setIsModalOpen(false);
    // Only clear selectedRefund if we're not opening the confirmation or reject modal
    if (!isOpeningConfirmModal.current && !isOpeningRejectModal.current) {
      setSelectedRefund(null);
    }
  };

  const handleConfirmApprove = () => {
    if (selectedRefund) {
      toast.success(`Refund approved`);
      setShowConfirmModal(false);
      setSelectedRefund(null);
    }
  };

  const handleCloseConfirmModal = () => {
    setShowConfirmModal(false);
    setSelectedRefund(null);
  };

  const handleRejectClick = () => {
    isOpeningRejectModal.current = true;
    setIsModalOpen(false);
    // Use setTimeout to ensure state update happens after modal closes
    setTimeout(() => {
      setShowRejectModal(true);
      isOpeningRejectModal.current = false;
    }, 100);
  };

  const handleCloseRejectModal = () => {
    setShowRejectModal(false);
    setSelectedRefund(null);
  };

  const handleConfirmReject = () => {
    if (selectedRefund) {
      toast.error(`Refund rejected`);
      setShowRejectModal(false);
      setSelectedRefund(null);
    }
  };

  const rows = paginatedRefunds.map((refund) => {
    const initial = refund.customerName?.charAt(0)?.toUpperCase() || "-";
    return {
      refundDate: refund.refundDate,
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
      amount: formatCurrency(refund.amount),
      orderStatus: (
        <div>
          <p className="text-[#101928] text-sm">{refund.orderStatus}</p>
        </div>
      ),
      status: (
        <div className="flex flex-col gap-1">{statusChip(refund.status)}</div>
      ),
    };
  });

  return (
    <div className="space-y-6">
      {/* Search Bar */}
      <div className="border border-[#F0F2F5] rounded-xl h-9.5 flex items-center gap-1 p-1 px-4 shadow-sm">
        <Image src={"/icons/search.png"} alt="Search" width={20} height={20} />
        <Input
          className="w-full placeholder:text-[#253B4B] border-0 outline-none focus-visible:ring-0 shadow-none"
          placeholder="Search"
        />
      </div>

      {/* Sub-tabs */}
      <div className="flex items-center gap-4 border-b border-gray-200">
        <button
          onClick={() => {
            setFilter("all");
            setPage(1);
          }}
          className={
            filter === "all"
              ? "text-[#0B1E66] font-medium rounded-[3px] border-b border-primary px-3 py-3"
              : "text-[#98A2B3] px-3 py-3"
          }
        >
          All Refunds
        </button>
        <button
          onClick={() => {
            setFilter("awaiting-approval");
            setPage(1);
          }}
          className={
            filter === "awaiting-approval"
              ? "text-[#0B1E66] font-medium rounded-[3px] border-b border-primary px-3 py-3"
              : "text-[#98A2B3] px-3 py-3"
          }
        >
          Awaiting Approval
        </button>
        <button
          onClick={() => {
            setFilter("rejected");
            setPage(1);
          }}
          className={
            filter === "rejected"
              ? "text-[#0B1E66] font-medium rounded-[3px] border-b border-primary px-3 py-3"
              : "text-[#98A2B3] px-3 py-3"
          }
        >
          Rejected Refund
        </button>
        <button
          onClick={() => {
            setFilter("awaiting-processing");
            setPage(1);
          }}
          className={
            filter === "awaiting-processing"
              ? "text-[#0B1E66] font-medium rounded-[3px] border-b border-primary px-3 py-3"
              : "text-[#98A2B3] px-3 py-3"
          }
        >
          Awaiting Processing
        </button>
      </div>

      {/* Table */}
      {!loadingRefunds && refunds.length > 0 ? (
        <DataTable
          columns={columns}
          rows={rows}
          page={refundPagination?.page || 0}
          pageSize={refundPagination?.pageSize || 0}
          total={refundPagination?.totalCount || 0}
          onPageChange={setPage}
          onRowClick={handleRowClick}
        />
      ) : (
        <p className="text-center my-5">No Refunds Available</p>
      )}

      {/* Refund Details Modal */}
      <RefundDetailsModal
        isOpen={isModalOpen}
        onClose={handleCloseDetailsModal}
        refund={selectedRefund}
        onApprove={handleApproveClick}
        onReject={handleRejectClick}
      />

      {/* Confirmation Modal */}
      <RefundApprovalConfirmModal
        isOpen={showConfirmModal}
        onClose={handleCloseConfirmModal}
        onConfirm={handleConfirmApprove}
        refund={
          selectedRefund
            ? {
                refundId: selectedRefund.refundId,
                customerName: selectedRefund.customerName,
                amount: selectedRefund.amount,
              }
            : null
        }
      />

      {/* Reject Refund Modal */}
      <RejectRefundModal
        isOpen={showRejectModal}
        onClose={handleCloseRejectModal}
        onConfirm={handleConfirmReject}
        refundId={selectedRefund?.refundId || null}
      />
    </div>
  );
}
