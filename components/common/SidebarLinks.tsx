"use client";

import { dmSans } from "@/lib/fonts";
import { cn } from "@/lib/utils";
import { usePathname, useRouter } from "next/navigation";

const SidebarLinks = () => {
  const pathname = usePathname();
  const router = useRouter();

  const links = [
    {
      name: "Dashboard",
      href: "/dashboard",
    },
    {
      name: "Inventory Management",
      href: "/inventory",
    },
    {
      name: "Product Management",
      href: "/product",
    },
    {
      name: "Order Management",
      href: "/order",
    },
    {
      name: "Analytics & Reporting",
      href: "/analytics",
    },
    {
      name: "Finance Management",
      href: "/finance",
    },
    {
      name: "Marketing & Engagement",
      href: "/marketing",
    },
    {
      name: "User Management",
      href: "/user",
    },
  ];

  return (
    <ul className={`${dmSans.className} flex-1 overflow-auto mt-6 space-y-2`}>
      {links.map((link, idx) => {
        const isActive = pathname === link.href;

        return (
          <li
            key={idx}
            className={cn(
              isActive ? "bg-primary text-white rounded-lg" : "text-[#98A2B3]",
              "text-[16px] font-semibold h-13.75 px-4 flex items-center cursor-pointer"
            )}
            onClick={() => router.push(link.href)}
          >
            {link.name}
          </li>
        );
      })}
      {(() => {
        const customerActive = pathname === "/customer";
        const configActive = pathname === "/configuration";

        return (
          <>
            <li
              className={cn(
                customerActive
                  ? "bg-primary text-white rounded-lg"
                  : "text-[#98A2B3]",
                "text-[16px] font-semibold h-13.75 px-4 flex items-center cursor-pointer"
              )}
              onClick={() => router.push("/customer")}
            >
              Customer Support
            </li>
            <li
              className={cn(
                configActive ? "bg-primary text-white" : "text-[#98A2B3]",
                "text-[16px] font-semibold h-13.75 px-4 flex items-center cursor-pointer"
              )}
              onClick={() => router.push("/configuration")}
            >
              Systems Configuration
            </li>
          </>
        );
      })()}
    </ul>
  );
};

export default SidebarLinks;
