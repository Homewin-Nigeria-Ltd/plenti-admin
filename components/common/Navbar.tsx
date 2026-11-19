"use client";
import {
  Bell,
  ChevronDown,
  ChevronRight,
  CircleHelp,
  PanelLeft,
  Search,
} from "lucide-react";
import * as React from "react";
import { usePathname, useRouter } from "next/navigation";
import { links } from "@/components/common/SidebarLinks";
import { NotificationModal } from "@/components/common/NotificationModal";
import { useNotificationsStore } from "@/store/useNotificationsStore";
import { useAccountStore } from "@/store/useAccountStore";
import { resetAllStores } from "@/store/resetAllStores";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { toast } from "sonner";


const formatTitle = (segment: string) =>
  segment
    .split("-")
    .map((s) => s.charAt(0).toUpperCase() + s.slice(1))
    .join(" ");

type NavbarProps = {
  onMenuClick?: () => void;
};

const Navbar = ({ onMenuClick }: NavbarProps) => {
  const pathname = usePathname() || "/";
  const router = useRouter();
  const [isNotificationOpen, setIsNotificationOpen] = React.useState(false);
  const [isLoggingOut, setIsLoggingOut] = React.useState(false);
  const [searchQuery, setSearchQuery] = React.useState("");
  const searchRef = React.useRef<HTMLInputElement>(null);
  const unreadCount = useNotificationsStore((state) => state.unreadCount);
  const account = useAccountStore((state) => state.account);
  const segments = pathname.split("/").filter(Boolean);
  const section = segments[0] || "dashboard";
  const matchedLink = links.find((l) => {
    const path = l.href.split("?")[0];
    return pathname === path || pathname.startsWith(`${path}/`);
  });
  const isSingleUserPage =
    pathname.startsWith("/user/") && pathname !== "/user";
  const isRiderSection = pathname === "/rider" || pathname.startsWith("/rider/");
  const title = isSingleUserPage
    ? "Single User"
    : isRiderSection
      ? "Rider Management"
      : (matchedLink?.name ?? formatTitle(section));

  const badgeCount = unreadCount > 0 ? unreadCount : 4;

  React.useEffect(() => {
    const onKeyDown = (event: KeyboardEvent) => {
      if ((event.metaKey || event.ctrlKey) && event.key.toLowerCase() === "k") {
        event.preventDefault();
        searchRef.current?.focus();
      }
    };
    window.addEventListener("keydown", onKeyDown);
    return () => window.removeEventListener("keydown", onKeyDown);
  }, []);

  const logout = React.useCallback(async () => {
    setIsLoggingOut(true);
    try {
      const response = await fetch("/api/auth/logout", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Accept: "application/json",
        },
      });

      if (response.ok) {
        resetAllStores();
        toast.success("Logged out successfully");
        router.push("/login");
      } else {
        toast.error("Logout failed");
      }
    } catch (error) {
      console.error("Logout error:", error);
      toast.error("Logout failed");
    } finally {
      setIsLoggingOut(false);
    }
  }, [router]);

  return (
    <nav className="h-(--navbar-height) px-4 md:px-6 bg-white w-full flex items-center justify-between sticky top-0 z-30 gap-3 border-b border-[#EAECF0]">
      <div className="flex items-center gap-2 min-w-0">
        <button
          type="button"
          onClick={onMenuClick}
          className="lg:hidden size-8 shrink-0 rounded-md text-[#98A2B3] hover:bg-[#F2F4F7] hover:text-[#344054] flex items-center justify-center cursor-pointer"
          aria-label="Open menu"
        >
          <PanelLeft className="size-[18px]" strokeWidth={1.75} />
        </button>
        <div className="flex items-center gap-1.5 min-w-0 text-[14px] leading-none">
          <button
            type="button"
            onClick={() => router.push("/dashboard")}
            className="shrink-0 text-[#98A2B3] hover:text-[#667085] cursor-pointer"
          >
            Plenti
          </button>
          <ChevronRight className="size-3.5 shrink-0 text-[#D0D5DD]" strokeWidth={1.75} />
          <h1 className="font-medium truncate text-[#667085]">{title}</h1>
        </div>
      </div>

      <div className="flex items-center gap-3 sm:gap-4 shrink-0">
        <label className="relative hidden sm:block w-[280px] md:w-[360px]">
          <Search
            className="pointer-events-none absolute left-3 top-1/2 size-[14px] -translate-y-1/2 text-[#98A2B3]"
            strokeWidth={1.75}
          />
          <input
            ref={searchRef}
            type="search"
            value={searchQuery}
            onChange={(event) => setSearchQuery(event.target.value)}
            placeholder="Search orders, products, warehouse..."
            className="h-9 w-full rounded-lg border border-[#EAECF0] bg-[#F9FAFB] pl-9 pr-14 text-[14px] text-[#101828] placeholder:text-[14px] placeholder:text-[#98A2B3] outline-none focus:border-[#D0D5DD] focus:bg-white"
            aria-label="Search orders, products, warehouse"
          />
          <kbd className="pointer-events-none absolute right-2 top-1/2 -translate-y-1/2 inline-flex items-center rounded-md border border-[#E4E7EC] bg-white px-1.5 py-0.5 text-[11px] font-medium text-[#98A2B3]">
            ⌘K
          </kbd>
        </label>
        <button
          type="button"
          className="size-9 flex items-center justify-center rounded-full text-[#98A2B3] hover:bg-[#F9FAFB] hover:text-[#667085] cursor-pointer"
          aria-label="Help"
        >
          <CircleHelp className="size-5" strokeWidth={1.75} />
        </button>

        <button
          type="button"
          onClick={() => setIsNotificationOpen(true)}
          className="relative size-9 flex items-center justify-center rounded-full text-[#98A2B3] hover:bg-[#F9FAFB] hover:text-[#667085] cursor-pointer"
          aria-label="Open notifications"
        >
          <Bell className="size-5" strokeWidth={1.75} />
          <span className="absolute -top-0.5 -right-0.5 min-w-4 h-4 px-1 rounded-full bg-[#F38744] text-white text-[10px] font-semibold leading-4 text-center">
            {badgeCount}
          </span>
        </button>

        <div className="w-px h-6 bg-[#E4E7EC]" />

        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <button
              type="button"
              className="flex items-center gap-1.5 rounded-full cursor-pointer"
              aria-label="Account menu"
            >
              <Avatar className="size-8">
                <AvatarImage src={account?.avatar_url || ""} />
                <AvatarFallback className="bg-[#F79009] text-white text-xs font-medium">
                  {account?.name?.[0] || ""}
                </AvatarFallback>
              </Avatar>
              <ChevronDown className="size-4 text-[#98A2B3]" strokeWidth={1.75} />
            </button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end" className="min-w-44">
            <DropdownMenuItem
              onClick={() => router.push("/configuration/account")}
            >
              Account settings
            </DropdownMenuItem>
            <DropdownMenuSeparator />
            <DropdownMenuItem
              disabled={isLoggingOut}
              onClick={logout}
              className="text-[#D92D20] focus:text-[#D92D20]"
            >
              {isLoggingOut ? "Logging out..." : "Log out"}
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>

      <NotificationModal
        isOpen={isNotificationOpen}
        onClose={() => setIsNotificationOpen(false)}
      />
    </nav>
  );
};

export default Navbar;
