"use client";

import SidebarLinks from "./SidebarLinks";
import Image from "next/image";
import { dmSans } from "@/lib/fonts";
import { LogOut } from "lucide-react";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import * as React from "react";

const Sidebar = () => {
  const router = useRouter();
  const [isLoggingOut, setIsLoggingOut] = React.useState(false);

  async function logout() {
    setIsLoggingOut(true);
    try {
      const response = await fetch("/api/auth/logout", {
        method: "POST",
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
        <LogOut
          color="#D42620"
          onClick={logout}
          cursor={isLoggingOut ? "wait" : "pointer"}
          className={isLoggingOut ? "opacity-50" : ""}
        />
      </div>
    </aside>
  );
};

export default Sidebar;
