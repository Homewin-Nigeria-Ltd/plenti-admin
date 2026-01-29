"use client";

import DataTable from "@/components/common/DataTable";
import { Input } from "@/components/ui/input";
import { useMarketingStore } from "@/store/useMarketingStore";
import { Banner } from "@/types/MarketingTypes";
import { Filter } from "lucide-react";
import Image from "next/image";
import * as React from "react";
import { Avatar, AvatarFallback, AvatarImage } from "../ui/avatar";
import { BannersTableSkeleton } from "./BannersTableSkeleton";
import { BannerDetailsModal } from "./BannerDetailsModal";

export default function BannersContent() {
  const { fetchMarketingBanners, banners, loadingBanners } =
    useMarketingStore();

  // LOCAL STATES
  const [searchQuery, setSearchQuery] = React.useState("");
  const [selectedBanner, setSelectedBanner] = React.useState<Banner | null>(
    null
  );
  const [isModalOpen, setIsModalOpen] = React.useState(false);

  React.useEffect(() => {
    fetchMarketingBanners();
  }, [fetchMarketingBanners]);

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

  const rows = banners.map((banner) => ({
    ...banner,
    createdDate: "—",
    image: (
      <div className="flex items-center">
        <Avatar>
          <AvatarImage src={banner.image_url} alt={banner.title} />
          <AvatarFallback>{banner.title[0]}</AvatarFallback>
        </Avatar>
      </div>
    ),
    heading: <span className="font-medium">{banner.title}</span>,
    subHeading: (
      <span className="text-[#667085]">{banner.subheading ?? "—"}</span>
    ),
    link: (
      <span className="text-[#667085] text-sm truncate max-w-[150px] block">
        {banner.link_url ?? "—"}
      </span>
    ),
    screenLocation: banner.screen_location ?? "—",
    sort: banner.position,
    type: banner.banner_type,
    status: <StatusBadge isActive={banner.is_active} />,
  }));

  const handleRowClick = (
    row: Record<string, React.ReactNode> & { id: number; title: string }
  ) => {
    const banner = banners.find((b) => b.id === row.id);
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

      {loadingBanners ? (
        <BannersTableSkeleton />
      ) : banners.length > 0 ? (
        <DataTable columns={columns} rows={rows} onRowClick={handleRowClick} />
      ) : (
        <p className="text-center my-5 text-[#667085]">No Banners Available</p>
      )}

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

const StatusBadge = ({ isActive }: { isActive: boolean }) => (
  <span
    className={`px-3 py-1 rounded-full text-xs font-medium ${
      isActive ? "bg-green-100 text-green-700" : "bg-red-100 text-red-700"
    }`}
  >
    {isActive ? "Active" : "Inactive"}
  </span>
);
