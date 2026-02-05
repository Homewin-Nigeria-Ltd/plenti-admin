"use client";

import SidebarLinks from "./SidebarLinks";
import Image from "next/image";
import { dmSans } from "@/lib/fonts";
import { LogOut } from "lucide-react";
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
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";
import { useAccountStore } from "@/store/useAccountStore";
import { cn } from "@/lib/utils";

const SIDEBAR_WIDTH_EXPANDED = 340;
const SIDEBAR_WIDTH_COLLAPSED = 135;

const Sidebar = React.memo(function Sidebar() {
  const router = useRouter();
  const [isLoggingOut, setIsLoggingOut] = React.useState(false);
  const [isExpanded, setIsExpanded] = React.useState(false);
  const [footerMounted, setFooterMounted] = React.useState(false);

  // Only re-render when account changes (not when loadingAccount, etc.)
  const account = useAccountStore((state) => state.account);

  React.useEffect(() => {
    const t = requestAnimationFrame(() => setFooterMounted(true));
    return () => cancelAnimationFrame(t);
  }, []);

  const handleExpand = React.useCallback(() => setIsExpanded(true), []);
  const handleCollapse = React.useCallback(() => setIsExpanded(false), []);

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

  const collapsed = !isExpanded;

  return (
    <aside
      className="h-screen max-h-screen flex flex-col justify-between bg-white md:sticky md:top-0 md:left-0 md:z-20 overflow-hidden sm:fixed sm:inset-0 transition-[width] duration-200 ease-in-out shrink-0"
      style={{
        width: `${
          isExpanded ? SIDEBAR_WIDTH_EXPANDED : SIDEBAR_WIDTH_COLLAPSED
        }px`,
      }}
      onMouseEnter={handleExpand}
      onMouseLeave={handleCollapse}
    >
      <div className="overflow-hidden flex flex-col flex-1 min-h-0 shrink">
        <div
          className={cn(
            "mb-3 pt-10 shrink-0",
            collapsed ? "px-2 flex justify-center" : "px-8 sm:px-4"
          )}
        >
          {collapsed ? (
            <div className="w-10 h-10 flex items-center justify-center">
              <Image
                src="/favicon.ico"
                alt="Plenti"
                width={40}
                height={40}
                className="w-10 h-10 object-contain"
              />
            </div>
          ) : (
            <Image
              src={"/icons/plenti-logo-blue.svg"}
              alt="Plenti"
              width={270}
              height={64}
              className="w-40 h-auto md:w-67.5"
            />
          )}
        </div>

        <SidebarLinks collapsed={collapsed} />
      </div>

      <div
        className={cn(
          "border-t-[0.5px] border-gray-300 flex items-center pb-2 pt-4 shrink-0 min-h-[72px]",
          collapsed ? "flex-col gap-2 px-2" : "justify-between gap-5 px-4"
        )}
      >
        {footerMounted ? (
          <>
            <div
              className={cn(
                "flex items-center min-w-0",
                collapsed ? "justify-center" : "gap-3"
              )}
            >
              <Avatar className={cn("shrink-0", collapsed ? "size-9" : "size-10")}>
                <AvatarImage src={account?.avatar_url || ""} />
                <AvatarFallback>{account?.name?.[0] || ""}</AvatarFallback>
              </Avatar>
              {!collapsed && (
                <div className="min-w-0">
                  <h5
                    className={`text-gray-400 text-[16px] font-medium truncate ${dmSans.className}`}
                  >
                    {account?.name || ""}
                  </h5>
                  <p
                    className={`${dmSans.className} font-normal text-gray-400 text-[16px] max-w-42.5 truncate`}
                  >
                    {account?.email || ""}
                  </p>
                </div>
              )}
            </div>

            <AlertDialog>
          <AlertDialogTrigger asChild>
            <button
              type="button"
              disabled={isLoggingOut}
              aria-label="Log out"
              className={cn(collapsed && "hidden")}
            >
              <LogOut
                color="#D42620"
                cursor={isLoggingOut ? "wait" : "pointer"}
                className={isLoggingOut ? "opacity-50" : ""}
              />
            </button>
          </AlertDialogTrigger>
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
          </>
        ) : null}
      </div>
    </aside>
  );
});

Sidebar.displayName = "Sidebar";

export default Sidebar;
