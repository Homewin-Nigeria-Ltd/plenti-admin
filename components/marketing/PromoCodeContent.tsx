"use client";

import * as React from "react";
import DataTable from "@/components/common/DataTable";
import { Input } from "@/components/ui/input";
import { Filter } from "lucide-react";
import Image from "next/image";
import { mockPromoCodes } from "@/data/promoCodes";

const StatusBadge = ({
  status,
}: {
  status: "Approved" | "On Hold" | "Expired";
}) => {
  const statusStyles = {
    Approved: "bg-green-100 text-green-700",
    "On Hold": "bg-orange-100 text-orange-700",
    Expired: "bg-red-100 text-red-700",
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

const TypeBadge = ({ type }: { type: "Percentage" | "Fixed Amount" }) => {
  const typeStyles = {
    Percentage: "bg-green-100 text-green-700",
    "Fixed Amount": "bg-orange-100 text-orange-700",
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

export default function PromoCodeContent() {
  const [searchQuery, setSearchQuery] = React.useState("");

  const filteredPromoCodes = React.useMemo(() => {
    if (!searchQuery) return mockPromoCodes;
    const query = searchQuery.toLowerCase();
    return mockPromoCodes.filter(
      (promo) =>
        promo.code.toLowerCase().includes(query) ||
        promo.type.toLowerCase().includes(query) ||
        promo.status.toLowerCase().includes(query)
    );
  }, [searchQuery]);

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

  const rows = filteredPromoCodes.map((promo) => ({
    ...promo,
    createdDate: promo.createdDate,
    code: <span className="font-medium">{promo.code}</span>,
    type: <TypeBadge type={promo.type} />,
    value: (
      <span className="text-[#101928]">
        {promo.type === "Percentage"
          ? `${promo.value}%`
          : formatCurrency(promo.value)}
      </span>
    ),
    minOrder: (
      <span className="text-[#667085]">
        {promo.minOrder ? formatCurrency(promo.minOrder) : "-"}
      </span>
    ),
    expiry: promo.expiry,
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

      <DataTable columns={columns} rows={rows} />
    </div>
  );
}

