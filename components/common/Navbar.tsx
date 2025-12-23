"use client";
import { Bell } from "lucide-react";
import Image from "next/image";
import { usePathname } from "next/navigation";
import { Input } from "../ui/input";
import { links } from "@/components/common/SidebarLinks";

const formatTitle = (segment: string) =>
  segment
    .split("-")
    .map((s) => s.charAt(0).toUpperCase() + s.slice(1))
    .join(" ");

const Navbar = () => {
  const pathname = usePathname() || "/";
  const segments = pathname.split("/").filter(Boolean);
  const section = segments[0] || "dashboard";
  const matchedLink = links.find((l) => l.href === pathname);
  const title = matchedLink?.name ?? formatTitle(section);

  return (
    <nav className="h-(--navbar-height) px-6 md:px-6 bg-[#F5F5F5] w-full flex items-center justify-between sticky top-0 z-30">
      <h1 className="text-lg font-semibold">{title}</h1>

      <div className="flex items-center gap-10">
        <div className="bg-white rounded-xl shadow-md p-4 py-2 flex gap-2.5 items-center">
          <Image src={"/icons/search.png"} alt="" width={24} height={24} />
          <Input
            className="border-0 shadow-none outline-none w-75 focus-visible:ring-0"
            type="text"
            placeholder={`Search ${section}`}
          />
        </div>
        <div className="bg-white size-15 flex items-center justify-center rounded-full relative border border-[#EEF1F6] cursor-pointer">
          <Bell size={25} />
          <div className="size-3 rounded-full bg-red-500 absolute top-1 right-1"></div>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
