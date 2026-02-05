"use client";

import { dmSans } from "@/lib/fonts";
import { cn } from "@/lib/utils";
import Image from "next/image";
import { usePathname, useRouter } from "next/navigation";

type linkType = {
  name: string;
  href: string;
  pageHeader?: string;
  activeIcon: string;
  inactiveIcon: string;
}[];

export const links: linkType = [
  {
    name: "Dashboard",
    href: "/dashboard",
    activeIcon: "/sidebarIcons/home-trend-up.png",
    inactiveIcon: "/sidebarIcons/home-trend-up-grey.png",
  },
  {
    name: "Inventory Management",
    href: "/inventory",
    activeIcon: "/sidebarIcons/building-active.svg",
    inactiveIcon: "/sidebarIcons/building.png",
  },
  {
    name: "Product Management",
    href: "/product",
    activeIcon: "/sidebarIcons/bag.png",
    inactiveIcon: "/sidebarIcons/bag-grey.png",
  },
  {
    name: "Order Management",
    href: "/order",
    activeIcon: "/sidebarIcons/shopping-cart.png",
    inactiveIcon: "/sidebarIcons/shopping-cart-grey.png",
  },
  // {
  //   name: "Analytics & Reporting",
  //   href: "/analytics",
  // },
  {
    name: "Finance Management",
    href: "/finance",
    activeIcon: "/sidebarIcons/wallet.png",
    inactiveIcon: "/sidebarIcons/wallet-grey.png",
  },
  {
    name: "Marketing & Engagement",
    href: "/marketing",
    activeIcon: "/sidebarIcons/presentation-chart.png",
    inactiveIcon: "/sidebarIcons/presentation-chart-grey.png",
  },
  {
    name: "User Management",
    href: "/user",
    activeIcon: "/sidebarIcons/user.png",
    inactiveIcon: "/sidebarIcons/user-grey.png",
  },
];

type SidebarLinksProps = {
  collapsed?: boolean;
};

const SidebarLinks = ({ collapsed = false }: SidebarLinksProps) => {
  const pathname = usePathname();
  const router = useRouter();

  const linkBaseClass = cn(
    "text-[16px] font-semibold h-13.75 flex items-center cursor-pointer mx-3",
    collapsed ? "justify-center px-2" : "px-4 gap-3"
  );

  return (
    <ul className={`${dmSans.className} flex-1 overflow-auto mt-3 space-y-2`}>
      {links.map((link, idx) => {
        const isActive = pathname === link.href;

        return (
          <li
            key={idx}
            className={cn(
              isActive ? "bg-primary text-white rounded-lg" : "text-[#98A2B3]",
              linkBaseClass
            )}
            onClick={() => router.push(link.href)}
            title={collapsed ? link.name : undefined}
          >
            <span className="shrink-0">
              <Image
                src={isActive ? link.activeIcon : link.inactiveIcon}
                alt={link.name}
                width={24}
                height={24}
              />
            </span>
            {!collapsed && (
              <span className="min-w-0 truncate">{link.name}</span>
            )}
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
                linkBaseClass
              )}
              onClick={() => router.push("/customer")}
              title={collapsed ? "Customer Support" : undefined}
            >
              <span className="shrink-0">
                <Image
                  src={
                    customerActive
                      ? "/sidebarIcons/presentation-chart-grey.png"
                      : "/sidebarIcons/life-ring-grey.png"
                  }
                  alt="Customer Support"
                  width={24}
                  height={24}
                />
              </span>
              {!collapsed && (
                <span className="min-w-0 truncate">Customer Support</span>
              )}
            </li>
            <li
              className={cn(
                configActive
                  ? "bg-primary text-white rounded-lg"
                  : "text-[#98A2B3]",
                linkBaseClass
              )}
              onClick={() => router.push("/configuration")}
              title={collapsed ? "Systems Configuration" : undefined}
            >
              <span className="shrink-0">
                <Image
                  src={
                    configActive
                      ? "/sidebarIcons/setting.png"
                      : "/sidebarIcons/setting-grey.png"
                  }
                  alt="System Configuration"
                  width={24}
                  height={24}
                />
              </span>
              {!collapsed && (
                <span className="min-w-0 truncate">Systems Configuration</span>
              )}
            </li>
          </>
        );
      })()}
    </ul>
  );
};

export default SidebarLinks;
