"use client";

import * as React from "react";
import DataTable from "@/components/common/DataTable";
import { Input } from "@/components/ui/input";
import { Filter } from "lucide-react";
import Image from "next/image";
import { mockBanners, type Banner } from "@/data/banners";
import { BannerDetailsModal } from "./BannerDetailsModal";

const StatusBadge = ({
  status,
}: {
  status: "Active Ad" | "Inactive Ad";
}) => {
  const isActive = status === "Active Ad";
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

export default function BannersContent() {
  const [searchQuery, setSearchQuery] = React.useState("");
  const [selectedBanner, setSelectedBanner] = React.useState<Banner | null>(
    null
  );
  const [isModalOpen, setIsModalOpen] = React.useState(false);

  const filteredBanners = React.useMemo(() => {
    if (!searchQuery) return mockBanners;
    const query = searchQuery.toLowerCase();
    return mockBanners.filter(
      (banner) =>
        banner.heading.toLowerCase().includes(query) ||
        banner.subHeading.toLowerCase().includes(query) ||
        banner.screenLocation.toLowerCase().includes(query)
    );
  }, [searchQuery]);

  const columns = [
    { key: "createdDate", label: "Created Date" },
    { key: "image", label: "Image" },
    { key: "heading", label: "Heading" },
    { key: "subHeading", label: "Sub-heading" },
    { key: "link", label: "Link" },
    { key: "screenLocation", label: "Screen Location" },
    { key: "sort", label: "Sort" },
    { key: "type", label: "Type" },
    { key: "status", label: "Status" },
  ];

  const rows = filteredBanners.map((banner) => ({
    ...banner,
    createdDate: banner.createdDate,
    image: (
      <div className="flex items-center">
        <Image
          src={banner.imageUrl}
          alt={banner.imageAlt}
          width={60}
          height={40}
          className="rounded object-cover"
        />
      </div>
    ),
    heading: <span className="font-medium">{banner.heading}</span>,
    subHeading: <span className="text-[#667085]">{banner.subHeading}</span>,
    link: (
      <span className="text-[#667085] text-sm truncate max-w-[150px] block">
        {banner.link}
      </span>
    ),
    screenLocation: banner.screenLocation,
    sort: banner.sort,
    type: banner.type,
    status: <StatusBadge status={banner.status} />,
  }));

  const handleRowClick = (
    row: Record<string, React.ReactNode> & { id: string }
  ) => {
    const banner = filteredBanners.find((b) => b.id === row.id);
    if (banner) {
      setSelectedBanner(banner);
      setIsModalOpen(true);
    }
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
        <div className="flex items-center gap-3">
          <button className="border border-[#EEF1F6] rounded-lg p-2 hover:bg-gray-50 transition-colors">
            <Filter size={20} className="text-[#667085]" />
          </button>
        </div>
      </div>

      <DataTable
        columns={columns}
        rows={rows}
        onRowClick={handleRowClick}
      />

      <BannerDetailsModal
        isOpen={isModalOpen}
        onClose={() => {
          setIsModalOpen(false);
          setSelectedBanner(null);
        }}
        banner={selectedBanner}
      />
    </div>
  );
}

