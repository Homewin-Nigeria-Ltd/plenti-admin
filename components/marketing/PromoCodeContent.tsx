"use client";

import * as React from "react";
import DataTable from "@/components/common/DataTable";
import { Input } from "@/components/ui/input";
import Image from "next/image";
import { useMarketingStore } from "@/store/useMarketingStore";
import type {
  PromoCode,
  PromoCodeStatus,
  PromoCodeType,
} from "@/types/MarketingTypes";
import { EditPromoCodeModal } from "./EditPromoCodeModal";
import { PromoCodeDetailsModal } from "./PromoCodeDetailsModal";

const formatDate = (iso: string | null) => {
  if (!iso) return "—";
  try {
    return new Date(iso).toLocaleDateString("en-NG", {
      day: "numeric",
      month: "short",
      year: "numeric",
    });
  } catch {
    return iso;
  }
};

export default function PromoCodeContent() {
  const { loadingPromoCodes, promoCodes, fetchMarketingPromoCodes } =
    useMarketingStore();
  const [searchQuery, setSearchQuery] = React.useState("");
  const [selectedPromo, setSelectedPromo] = React.useState<PromoCode | null>(
    null
  );
  const [isDetailsModalOpen, setIsDetailsModalOpen] = React.useState(false);
  const [isEditModalOpen, setIsEditModalOpen] = React.useState(false);

  // Debounced server-side search
  React.useEffect(() => {
    const t = setTimeout(() => {
      fetchMarketingPromoCodes(searchQuery.trim() || undefined);
    }, 300);
    return () => clearTimeout(t);
  }, [searchQuery, fetchMarketingPromoCodes]);

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat("en-NG", {
      style: "currency",
      currency: "NGN",
      minimumFractionDigits: 2,
    }).format(amount);
  };

  const columns = [
    { key: "createdDate", label: "Date Created" },
    { key: "code", label: "Code" },
    { key: "type", label: "Type" },
    { key: "value", label: "Value" },
    { key: "minOrder", label: "Min. Order" },
    { key: "usage", label: "Usage" },
    { key: "expiry", label: "Expiry" },
    { key: "status", label: "Status" },
  ];

  const rows = promoCodes.map((promo) => ({
    ...promo,
    createdDate: formatDate(promo.created_at),
    code: <span className="font-medium">{promo.code}</span>,
    type: <TypeBadge type={promo.type} />,
    value: (
      <span className="text-[#101928]">
        {promo.type === "percentage"
          ? `${promo.value}%`
          : formatCurrency(promo.value)}
      </span>
    ),
    minOrder: (
      <span className="text-[#667085]">
        {promo.min_order_amount > 0
          ? formatCurrency(promo.min_order_amount)
          : "—"}
      </span>
    ),
    usage: (
      <span className="text-[#667085]">
        {promo.used_count} / {promo.usage_limit}
      </span>
    ),
    expiry: formatDate(promo.expiry_date),
    status: <StatusBadge status={promo.is_active ? "Active" : "Inactive"} />,
  }));

  const handleRowClick = (
    row: Record<string, React.ReactNode> & { id: number }
  ) => {
    const promo = promoCodes.find((p) => p.id === row.id);
    if (promo) {
      setSelectedPromo(promo);
      setIsDetailsModalOpen(true);
    }
  };

  const handleEditClick = () => {
    setIsDetailsModalOpen(false);
    setIsEditModalOpen(true);
  };

  const handleCloseDetails = () => {
    setIsDetailsModalOpen(false);
    setSelectedPromo(null);
  };

  const handleCloseEdit = () => {
    setIsEditModalOpen(false);
    setSelectedPromo(null);
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between gap-4">
        <div className="border border-[#F0F2F5] rounded-[8px] h-[38px] flex items-center gap-1 p-2 px-4 shadow-sm flex-1 max-w-md">
          <Image
            src={"/icons/search.png"}
            alt="Search"
            width={20}
            height={20}
          />
          <Input
            className="w-full placeholder:text-[#253B4B] border-0 outline-none focus-visible:ring-0 shadow-none"
            placeholder="Search"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
        </div>
        {/* <div className="flex items-center gap-3">
          <button className="border border-[#EEF1F6] rounded-lg p-2 hover:bg-gray-50 transition-colors">
            <Filter size={20} className="text-[#667085]" />
          </button>
        </div> */}
      </div>
      {loadingPromoCodes && promoCodes.length === 0 ? (
        <p className="text-center my-5 text-[#667085]">Loading promo codes…</p>
      ) : promoCodes.length > 0 ? (
        <DataTable columns={columns} rows={rows} onRowClick={handleRowClick} />
      ) : (
        <p className="text-center my-5 text-[#667085]">
          No promo codes available
        </p>
      )}

      <PromoCodeDetailsModal
        isOpen={isDetailsModalOpen}
        onClose={handleCloseDetails}
        promoCode={selectedPromo}
        onEditClick={handleEditClick}
      />

      <EditPromoCodeModal
        isOpen={isEditModalOpen}
        onClose={handleCloseEdit}
        promoCode={selectedPromo}
      />
    </div>
  );
}

const StatusBadge = ({ status }: { status: PromoCodeStatus }) => {
  const isActive = status === "Active";
  return (
    <span
      className={`px-3 py-1 rounded-full text-xs font-medium ${
        isActive ? "bg-green-100 text-green-700" : "bg-red-100 text-red-700"
      }`}
    >
      {status}
    </span>
  );
};

const TypeBadge = ({ type }: { type: PromoCodeType }) => {
  const label = type === "percentage" ? "Percentage" : "Fixed";
  const typeStyles: Record<PromoCodeType, string> = {
    percentage: "bg-green-100 text-green-700",
    fixed: "bg-orange-100 text-orange-700",
  };

  return (
    <span
      className={`px-3 py-1 rounded-full text-xs font-medium ${
        typeStyles[type] ?? "bg-gray-100 text-gray-700"
      }`}
    >
      {label}
    </span>
  );
};
