"use client";

import * as React from "react";
import DataTable from "@/components/common/DataTable";
import { Input } from "@/components/ui/input";
import { Filter } from "lucide-react";
import Image from "next/image";
import { mockPromoCodes } from "@/data/promoCodes";
import { useMarketingStore } from "@/store/useMarketingStore";
import { PromoCodeStatus, PromoCodeType } from "@/types/MarketingTypes";

export default function PromoCodeContent() {
  const { loadingPromoCodes, promoCodes, fetchMarketingPromoCodes } =
    useMarketingStore();
  const [searchQuery, setSearchQuery] = React.useState("");

  console.log("Promo codes in promo code content component =>", promoCodes);

  // FETCH PROMO CODE ON MOUNT
  // React.useEffect(() => {
  //   // FETCH PROMO CODE ONLY WHEN DATA IS EMPTY
  //   if (promoCodes.length === 0) {
  //     fetchMarketingPromoCodes();
  //   }
  // }, [fetchMarketingPromoCodes, promoCodes]);

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
    { key: "expiry", label: "Expiry" },
    { key: "status", label: "Status" },
  ];

  const rows = promoCodes.map((promo) => ({
    ...promo,
    createdDate: promo.startDate,
    code: <span className="font-medium">{promo.code}</span>,
    type: <TypeBadge type={promo.type} />,
    value: (
      <span className="text-[#101928]">
        {promo.type === "PERCENT"
          ? `${promo.value}%`
          : formatCurrency(promo.value)}
      </span>
    ),
    minOrder: (
      <span className="text-[#667085]">
        {promo.used ? formatCurrency(promo.used) : "-"}
      </span>
    ),
    expiry: promo.endDate,
    status: <StatusBadge status={promo.status} />,
  }));

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
        <div className="flex items-center gap-3">
          <button className="border border-[#EEF1F6] rounded-lg p-2 hover:bg-gray-50 transition-colors">
            <Filter size={20} className="text-[#667085]" />
          </button>
        </div>
      </div>
      {!loadingPromoCodes && promoCodes.length > 0 ? (
        <DataTable columns={columns} rows={rows} />
      ) : (
        <p className="text-center my-5">No Promo Code Available</p>
      )}
    </div>
  );
}

const StatusBadge = ({ status }: { status: PromoCodeStatus }) => {
  const statusStyles = {
    ACTIVE: "bg-green-100 text-green-700",
    // "On Hold": "bg-orange-100 text-orange-700",
    SCHEDULED: "bg-red-100 text-red-700",
  };

  return (
    <span
      className={`px-3 py-1 rounded-full text-xs font-medium ${
        statusStyles[status] || "bg-gray-100 text-gray-700"
      }`}
    >
      {status}
    </span>
  );
};

const TypeBadge = ({ type }: { type: PromoCodeType }) => {
  const typeStyles = {
    PERCENT: "bg-green-100 text-green-700",
    FIXED: "bg-orange-100 text-orange-700",
  };

  return (
    <span
      className={`px-3 py-1 rounded-full text-xs font-medium ${
        typeStyles[type] || "bg-gray-100 text-gray-700"
      }`}
    >
      {type}
    </span>
  );
};
