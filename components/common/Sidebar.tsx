"use client";

import SidebarLinks from "./SidebarLinks";
import Image from "next/image";
import { dmSans } from "@/lib/fonts";
import { ChevronDown, PanelLeft, PanelLeftClose } from "lucide-react";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import * as React from "react";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { useAccountStore } from "@/store/useAccountStore";
import { resetAllStores } from "@/store/resetAllStores";
import { cn } from "@/lib/utils";

function formatRole(role?: string | null) {
  if (!role) return "";
  return role
    .split(/[-_\s]+/)
    .filter(Boolean)
    .map((part) => part.charAt(0).toUpperCase() + part.slice(1).toLowerCase())
    .join(" ");
}

const SIDEBAR_WIDTH_EXPANDED = 264;
const SIDEBAR_WIDTH_COLLAPSED = 76;

type SidebarProps = {
  mobileOpen?: boolean;
  onMobileClose?: () => void;
};

export default function Sidebar({
  mobileOpen = false,
  onMobileClose,
}: SidebarProps) {
  const router = useRouter();
  const [isLoggingOut, setIsLoggingOut] = React.useState(false);
  const [isExpanded, setIsExpanded] = React.useState(true);
  const [mounted, setMounted] = React.useState(false);
  const [logoutOpen, setLogoutOpen] = React.useState(false);

  const account = useAccountStore((state) => state.account);

  const toggleSidebar = React.useCallback(() => {
    if (mobileOpen) {
      onMobileClose?.();
      return;
    }
    setIsExpanded((open) => !open);
  }, [mobileOpen, onMobileClose]);

  React.useEffect(() => {
    setMounted(true);
  }, []);

  React.useEffect(() => {
    if (!account) {
      useAccountStore.getState().fetchAccountSettings();
    }
  }, [account]);

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

  const collapsed = mobileOpen ? false : !isExpanded;
  const roleLabel = formatRole(
    account?.roles?.[0]?.name || account?.role || "",
  );

  return (
    <>
      {mobileOpen ? (
        <button
          type="button"
          aria-label="Close menu"
          className="fixed inset-0 z-40 bg-black/40 lg:hidden"
          onClick={onMobileClose}
        />
      ) : null}
    <aside
      className={cn(
        "h-dvh max-h-dvh flex flex-col justify-between bg-white overflow-hidden shrink-0 border-r border-[#EAECF0] transition-[width,transform] duration-200 ease-in-out",
        "max-lg:fixed max-lg:inset-y-0 max-lg:left-0 max-lg:z-50",
        mobileOpen ? "max-lg:translate-x-0" : "max-lg:-translate-x-full",
        "lg:sticky lg:top-0 lg:z-20 lg:translate-x-0",
      )}
      style={{
        width: `${
          mobileOpen || isExpanded
            ? SIDEBAR_WIDTH_EXPANDED
            : SIDEBAR_WIDTH_COLLAPSED
        }px`,
      }}
    >
      <div className="overflow-hidden flex flex-col flex-1 min-h-0 shrink">
        <div
          className={cn(
            "h-16 shrink-0 flex items-center",
            collapsed
              ? "flex-col justify-center gap-2 px-2 pt-3"
              : "justify-between gap-2 px-4",
          )}
        >
          {collapsed ? (
            <div className="size-8 rounded-lg bg-[#0B1E66] text-white flex items-center justify-center text-xs font-semibold">
              P
            </div>
          ) : (
            <div className="flex items-center gap-2 min-w-0">
              <Image
                src={"/icons/plenti-logo-blue.svg"}
                alt="Plenti"
                width={110}
                height={28}
                className="h-7 w-auto"
              />
              <span className="shrink-0 rounded-md bg-[#F2F4F7] px-1.5 py-0.5 text-[10px] font-semibold text-[#667085]">
                Admin
              </span>
            </div>
          )}
          <button
            type="button"
            onClick={toggleSidebar}
            aria-label={collapsed ? "Open sidebar" : "Close sidebar"}
            className="size-8 shrink-0 rounded-md text-[#98A2B3] hover:bg-[#F2F4F7] hover:text-[#344054] flex items-center justify-center cursor-pointer"
          >
            {collapsed ? (
              <PanelLeft className="size-[18px]" strokeWidth={1.75} />
            ) : (
              <PanelLeftClose className="size-[18px]" strokeWidth={1.75} />
            )}
          </button>
        </div>

        <SidebarLinks collapsed={collapsed} />
      </div>

      <div className={cn("shrink-0", collapsed ? "p-2" : "p-3")}>
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <button
              type="button"
              className={cn(
                "w-full flex items-center rounded-xl border border-[#EAECF0] bg-white cursor-pointer",
                collapsed ? "justify-center p-1.5" : "gap-2.5 p-2",
              )}
              aria-label="Account menu"
            >
              <Avatar className="size-9 shrink-0">
                <AvatarImage src={account?.avatar_url || ""} />
                <AvatarFallback className="bg-[#F79009] text-white text-sm font-medium">
                  {account?.name?.[0] || ""}
                </AvatarFallback>
              </Avatar>
              {!collapsed && (
                <>
                  <div className={`min-w-0 flex-1 text-left ${dmSans.className}`}>
                    <p className="text-sm font-semibold text-[#101828] truncate leading-tight">
                      {account?.name || ""}
                    </p>
                    <p className="text-xs text-[#667085] truncate leading-tight mt-0.5">
                      {roleLabel || "Admin"}
                    </p>
                  </div>
                  <ChevronDown
                    className="size-4 shrink-0 text-[#98A2B3]"
                    strokeWidth={1.75}
                  />
                </>
              )}
            </button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end" side="top" className="min-w-44">
            <DropdownMenuItem
              onClick={() => router.push("/configuration/account")}
            >
              Account settings
            </DropdownMenuItem>
            <DropdownMenuSeparator />
            <DropdownMenuItem
              disabled={isLoggingOut}
              onClick={() => setLogoutOpen(true)}
              className="text-[#D92D20] focus:text-[#D92D20]"
            >
              Log out
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>

      {mounted ? (
        <AlertDialog open={logoutOpen} onOpenChange={setLogoutOpen}>
          <AlertDialogContent>
            <AlertDialogHeader>
              <AlertDialogTitle>Confirm logout</AlertDialogTitle>
              <AlertDialogDescription>
                Are you sure you want to log out of Plenti Admin?
              </AlertDialogDescription>
            </AlertDialogHeader>
            <AlertDialogFooter>
              <AlertDialogCancel disabled={isLoggingOut} className="h-12.5">
                Cancel
              </AlertDialogCancel>
              <AlertDialogAction
                className="bg-[#D42620] hover:bg-[#D42620]/90 h-12.5"
                disabled={isLoggingOut}
                onClick={logout}
              >
                {isLoggingOut ? "Logging out..." : "Log out"}
              </AlertDialogAction>
            </AlertDialogFooter>
          </AlertDialogContent>
        </AlertDialog>
      ) : null}
    </aside>
    </>
  );
}
