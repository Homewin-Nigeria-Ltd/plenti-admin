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

const Sidebar = () => {
  const router = useRouter();
  const [isLoggingOut, setIsLoggingOut] = React.useState(false);

  async function logout() {
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
  }

  return (
    <aside className="w-[--sidebar-width] px-8 pb-8 pt-10 h-screen flex flex-col justify-between bg-white md:sticky md:top-0 md:left-0 md:h-screen md:z-20 md:overflow-auto sm:fixed sm:inset-0 sm:h-auto sm:flex-col sm:justify-start sm:px-4">
      <div className="mb-3">
        <Image
          src={"/icons/plenti-logo-blue.svg"}
          alt="Plenti"
          width={270}
          height={64}
          className="w-40 h-auto md:w-67.5"
        />
      </div>
      <SidebarLinks />
      <div className="border-t-[0.5px] border-gray-300 flex justify-between items-center gap-5 pb-2 pt-4 px-4">
        <div className="flex items-center gap-3">
          <Avatar className="size-10">
            <AvatarImage src="https://github.com/shadcn.png" />
            <AvatarFallback>CN</AvatarFallback>
          </Avatar>
          <div>
            <h5
              className={`text-gray-400 text-[16px] font-medium ${dmSans.className}`}
            >
              Amarachi Anigbogu
            </h5>
            <p
              className={`${dmSans.className} font-normal text-gray-400 text-[16px] max-w-42.5 truncate`}
            >
              amarachianigbogu@hotmail.com
            </p>
          </div>
        </div>
        <AlertDialog>
          <AlertDialogTrigger asChild>
            <button type="button" disabled={isLoggingOut} aria-label="Log out">
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
              <AlertDialogCancel disabled={isLoggingOut} className="h-[50px]">
                Cancel
              </AlertDialogCancel>
              <AlertDialogAction
                className="bg-[#D42620] hover:bg-[#D42620]/90 h-[50px]"
                disabled={isLoggingOut}
                onClick={logout}
              >
                {isLoggingOut ? "Logging out..." : "Log out"}
              </AlertDialogAction>
            </AlertDialogFooter>
          </AlertDialogContent>
        </AlertDialog>
      </div>
    </aside>
  );
};

export default Sidebar;
