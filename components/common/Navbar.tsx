"use client";
import { Bell, Menu } from "lucide-react";
import * as React from "react";
import { usePathname } from "next/navigation";
import { links } from "@/components/common/SidebarLinks";
import { NotificationModal } from "@/components/common/NotificationModal";
import { useNotificationsStore } from "@/store/useNotificationsStore";

type NavbarProps = {
  onMenuClick?: () => void;
};

const formatTitle = (segment: string) =>
  segment
    .split("-")
    .map((s) => s.charAt(0).toUpperCase() + s.slice(1))
    .join(" ");

const Navbar = ({ onMenuClick }: NavbarProps) => {
  const pathname = usePathname() || "/";
  const [isNotificationOpen, setIsNotificationOpen] = React.useState(false);
  const unreadCount = useNotificationsStore((state) => state.unreadCount);
  const refreshUnreadCount = useNotificationsStore(
    (state) => state.refreshUnreadCount,
  );
  const segments = pathname.split("/").filter(Boolean);
  const section = segments[0] || "dashboard";
  const matchedLink = links.find((l) => l.href === pathname);
  const isSingleUserPage =
    pathname.startsWith("/user/") && pathname !== "/user";
  const isRiderSection = pathname === "/rider" || pathname.startsWith("/rider/");
  const title = isSingleUserPage
    ? "Single User"
    : isRiderSection
      ? "Rider Management"
      : (matchedLink?.name ?? formatTitle(section));

  // React.useEffect(() => {
  //   void refreshUnreadCount();
  //   const intervalId = window.setInterval(() => {
  //     void refreshUnreadCount();
  //   }, 30000);
  //   return () => {
  //     window.clearInterval(intervalId);
  //   };
  // }, [refreshUnreadCount, isNotificationOpen]);

  return (
    <nav className="h-(--navbar-height) px-4 md:px-6 bg-[#F5F5F5] w-full flex items-center justify-between sticky top-0 z-30 gap-3">
      <div className="flex items-center gap-2 min-w-0">
        <button
          type="button"
          onClick={onMenuClick}
          className="lg:hidden size-10 shrink-0 rounded-full bg-white border border-[#EEF1F6] flex items-center justify-center"
          aria-label="Open menu"
        >
          <Menu className="size-5" />
        </button>
        <h1 className="text-base sm:text-lg font-semibold truncate">{title}</h1>
      </div>

      <div className="flex items-center gap-4 sm:gap-10 shrink-0">
        {/* <div className="bg-white rounded-xl shadow-md p-4 py-2 flex gap-2.5 items-center">
          <Image src={"/icons/search.png"} alt="" width={24} height={24} />
          <Input
            className="border-0 shadow-none outline-none w-75 focus-visible:ring-0"
            type="text"
            placeholder={`Search ${section}`}
          />
        </div> */}
        <button
          type="button"
          onClick={() => setIsNotificationOpen(true)}
          className="bg-white size-10 md:size-15 flex items-center justify-center rounded-full relative border border-[#EEF1F6] cursor-pointer"
          aria-label="Open notifications"
        >
          <Bell className="size-5 md:size-6" />
          {unreadCount > 0 && (
            <div className="size-3 rounded-full bg-red-500 absolute top-1 right-1"></div>
          )}
        </button>
      </div>
      <NotificationModal
        isOpen={isNotificationOpen}
        onClose={() => setIsNotificationOpen(false)}
      />
    </nav>
  );
};

export default Navbar;
