"use client";

import DataTable from "@/components/common/DataTable";
import { Input } from "@/components/ui/input";
import { useMarketingStore } from "@/store/useMarketingStore";
import type { Faq } from "@/types/MarketingTypes";
import Image from "next/image";
import * as React from "react";
import { EditFaqModal } from "./EditFaqModal";
import { FaqDetailsModal } from "./FaqDetailsModal";

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

function StatusBadge({ isActive }: { isActive: boolean }) {
  return (
    <span
      className={`px-3 py-1 rounded-full text-xs font-medium ${
        isActive ? "bg-green-100 text-green-700" : "bg-red-100 text-red-700"
      }`}
    >
      {isActive ? "Active" : "Inactive"}
    </span>
  );
}

export default function FaqContent() {
  const { loadingFaqs, faqs, fetchFaqs } = useMarketingStore();
  const [searchQuery, setSearchQuery] = React.useState("");
  const [selectedFaq, setSelectedFaq] = React.useState<Faq | null>(null);
  const [isDetailsModalOpen, setIsDetailsModalOpen] = React.useState(false);
  const [isEditModalOpen, setIsEditModalOpen] = React.useState(false);

  // Debounced server-side search
  React.useEffect(() => {
    const t = setTimeout(() => {
      fetchFaqs(searchQuery.trim() || undefined);
    }, 300);
    return () => clearTimeout(t);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [searchQuery]);

  const handleRowClick = (
    row: Record<string, React.ReactNode> & { id: number }
  ) => {
    const faq = faqs.find((f) => f.id === row.id);
    if (faq) {
      setSelectedFaq(faq);
      setIsDetailsModalOpen(true);
    }
  };

  const handleEditClick = () => {
    setIsDetailsModalOpen(false);
    setIsEditModalOpen(true);
  };

  const handleCloseDetails = () => {
    setIsDetailsModalOpen(false);
    setSelectedFaq(null);
  };

  const handleCloseEdit = () => {
    setIsEditModalOpen(false);
    setSelectedFaq(null);
  };

  const columns = [
    { key: "createdDate", label: "Date Created" },
    { key: "category", label: "Product" },
    { key: "question", label: "Question" },
    { key: "answer", label: "Answer" },
    { key: "status", label: "Status" },
  ];

  const rows = faqs.map((faq) => ({
    ...faq,
    createdDate: formatDate(faq.created_at),
    question: (
      <span className="font-medium text-[#101928]">{faq.question}</span>
    ),
    answer: (
      <span className="text-[#667085] text-sm line-clamp-2 max-w-[280px]">
        {faq.answer}
      </span>
    ),
    category: <span className="text-[#667085]">{faq.category}</span>,
    status: <StatusBadge isActive={faq.is_active} />,
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
      </div>
      {loadingFaqs && faqs.length === 0 ? (
        <p className="text-center my-5 text-[#667085]">Loading FAQs…</p>
      ) : faqs.length === 0 ? (
        <p className="text-center my-5 text-[#667085]">
          {searchQuery.trim()
            ? "No FAQs match your search"
            : "No FAQs available"}
        </p>
      ) : (
        <DataTable columns={columns} rows={rows} onRowClick={handleRowClick} />
      )}

      <FaqDetailsModal
        isOpen={isDetailsModalOpen}
        onClose={handleCloseDetails}
        faq={selectedFaq}
        onEditClick={handleEditClick}
      />

      <EditFaqModal
        isOpen={isEditModalOpen}
        onClose={handleCloseEdit}
        faq={selectedFaq}
      />
    </div>
  );
}
