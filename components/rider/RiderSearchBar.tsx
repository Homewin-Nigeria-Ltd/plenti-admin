"use client";

import { Input } from "@/components/ui/input";
import { Search } from "lucide-react";

type RiderSearchBarProps = {
  value: string;
  onChange: (value: string) => void;
  placeholder?: string;
};

export default function RiderSearchBar({
  value,
  onChange,
  placeholder = "Search System",
}: RiderSearchBarProps) {
  return (
    <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-4">
      <div className="border border-neutral-100 rounded-xl h-12.5 flex items-center gap-1 p-2 px-4 shadow-sm flex-1 max-w-full">
        <Search className="size-5 text-neutral-500 shrink-0" />
        <Input
          className="w-full placeholder:text-primary-700 border-0 outline-none focus-visible:ring-0 shadow-none"
          placeholder={placeholder}
          value={value}
          onChange={(e) => onChange(e.target.value)}
        />
      </div>
    </div>
  );
}
