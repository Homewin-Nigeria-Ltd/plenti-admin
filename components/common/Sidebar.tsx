"use client";

import SidebarLinks from "./SidebarLinks";
import Image from "next/image";
import { dmSans } from "@/lib/fonts";
import { LogOut } from "lucide-react";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { useRouter } from "next/navigation";

const Sidebar = () => {
  const router = useRouter();
  function logout() {
    router.push("/login");
  }

  return (
    <aside className="w-[--sidebar-width] px-8 pb-8 pt-16 h-screen flex flex-col justify-between bg-white md:sticky md:top-0 md:left-0 md:h-screen md:z-20 md:overflow-auto sm:fixed sm:inset-0 sm:h-auto sm:flex-col sm:justify-start sm:px-4">
      <div className="mb-6">
        <Image
          src={"/icons/plenti-logo-blue.svg"}
          alt="Plenti"
          width={270}
          height={64}
          className="w-40 h-auto md:w-67.5"
        />
      </div>
      <SidebarLinks />
      <div className="border-t-[0.5px] border-gray-300 flex justify-between items-center gap-5 pb-8 pt-4 px-4">
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
        <LogOut color="#D42620" onClick={logout} cursor={"pointer"} />
      </div>
    </aside>
  );
};

export default Sidebar;
