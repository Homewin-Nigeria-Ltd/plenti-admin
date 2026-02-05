"use client";

import * as React from "react";
import DataTable from "@/components/common/DataTable";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Plus, Search } from "lucide-react";
import AddChatbotKeywordModal, {
  type NewKeywordData,
} from "./AddChatbotKeywordModal";

type KeywordRow = {
  id: string;
  dateTime: string;
  keyword: string;
  response: string;
  category: string;
  status: "Active" | "Inactive";
};

const MOCK_KEYWORDS: KeywordRow[] = [
  {
    id: "1",
    dateTime: "Apr 12, 2023 09:32AM",
    keyword: "Order Status",
    response: "Check your order status in My Orders section",
    category: "Order",
    status: "Active",
  },
  {
    id: "2",
    dateTime: "Apr 12, 2023 09:32AM",
    keyword: "Refund",
    response: "Refund requests are processed within 3-5 business days",
    category: "Payment",
    status: "Active",
  },
  {
    id: "3",
    dateTime: "Apr 12, 2023 09:32AM",
    keyword: "Delivery Time",
    response: "Standard delivery takes 2-5 business days",
    category: "Delivery",
    status: "Active",
  },
  {
    id: "4",
    dateTime: "Apr 12, 2023 09:32AM",
    keyword: "Bulk discount",
    response: "We offer bulk discounts on orders of 10+ items",
    category: "Pricing",
    status: "Active",
  },
];

function StatusPill({ status }: { status: KeywordRow["status"] }) {
  const isActive = status === "Active";
  return (
    <span
      className={`inline-flex items-center px-3 py-1 rounded-full text-xs font-medium ${
        isActive ? "bg-[#ECFDF3] text-[#027A48]" : "bg-[#F2F4F7] text-[#667085]"
      }`}
    >
      {status}
    </span>
  );
}

export default function ChatbotConfiguration() {
  const [page, setPage] = React.useState(1);
  const [searchQuery, setSearchQuery] = React.useState("");
  const [keywords, setKeywords] = React.useState<KeywordRow[]>(MOCK_KEYWORDS);
  const [addKeywordOpen, setAddKeywordOpen] = React.useState(false);
  const pageCount = 6;
  const perPage = 4;
  const total = Math.max(keywords.length, 24);

  const filteredKeywords = React.useMemo(() => {
    if (!searchQuery.trim()) return keywords;
    const q = searchQuery.toLowerCase();
    return keywords.filter(
      (k) =>
        k.keyword.toLowerCase().includes(q) ||
        k.response.toLowerCase().includes(q) ||
        k.category.toLowerCase().includes(q)
    );
  }, [keywords, searchQuery]);

  const categoryLabels: Record<string, string> = {
    order: "Order",
    payment: "Payment",
    delivery: "Delivery",
    pricing: "Pricing",
    support: "Support",
  };

  const handleSaveKeyword = React.useCallback((data: NewKeywordData) => {
    const categoryLabel = categoryLabels[data.category] ?? data.category;
    setKeywords((prev) => [
      {
        id: String(Date.now()),
        dateTime: new Date().toLocaleString("en-NG", {
          month: "short",
          day: "2-digit",
          year: "numeric",
          hour: "2-digit",
          minute: "2-digit",
          hour12: true,
        }),
        keyword: data.keyword,
        response: data.response,
        category: categoryLabel,
        status: "Active",
      },
      ...prev,
    ]);
  }, []);

  const columns = [
    { key: "dateTime", label: "Date & Time" },
    { key: "keyword", label: "Keyword/Trigger" },
    { key: "response", label: "Response" },
    { key: "category", label: "Category" },
    { key: "status", label: "Status" },
  ];

  const rows = React.useMemo(
    () =>
      filteredKeywords.map((row) => ({
        dateTime: (
          <span className="text-[#101928] text-sm">{row.dateTime}</span>
        ),
        keyword: (
          <span className="text-sm font-medium text-[#101928]">
            {row.keyword}
          </span>
        ),
        response: (
          <span className="text-sm text-[#667085]">{row.response}</span>
        ),
        category: (
          <span className="text-sm text-[#344054]">{row.category}</span>
        ),
        status: <StatusPill status={row.status} />,
      })),
    [filteredKeywords]
  );

  return (
    <div className="space-y-4 sm:space-y-6">
      <div className="bg-white rounded-lg border border-[#EAECF0] p-4 sm:p-6">
        <h2 className="font-semibold text-[#0B1E66] text-base sm:text-lg mb-4">
          Chatbot Config
        </h2>

        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 mb-4 sm:mb-6">
          <div className="relative w-full sm:max-w-[320px]">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 size-4 text-[#98A2B3]" />
            <Input
              placeholder="Search"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-9 form-control"
              aria-label="Search keywords"
            />
          </div>
          <Button
            className="btn btn-primary w-full sm:w-auto shrink-0"
            onClick={() => setAddKeywordOpen(true)}
          >
            <Plus className="size-4 mr-2" />
            Add Keyword
          </Button>
        </div>

        <div className="overflow-x-auto">
          {rows.length === 0 ? (
            <div className="min-h-[200px] flex items-center justify-center text-sm text-[#667085] border border-dashed border-[#D0D5DD] rounded-lg">
              No keywords found. Click &quot;Add Keyword&quot; to create one.
            </div>
          ) : (
            <DataTable
              columns={columns}
              rows={rows}
              page={page}
              pageCount={pageCount}
              pageSize={perPage}
              total={total}
              onPageChange={setPage}
              className="border border-[#EEF1F6] shadow-xs"
            />
          )}
        </div>
      </div>

      <AddChatbotKeywordModal
        isOpen={addKeywordOpen}
        onClose={() => setAddKeywordOpen(false)}
        onSave={handleSaveKeyword}
      />
    </div>
  );
}
