"use client";

import * as React from "react";
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

export default function SidebarLinks({ collapsed = false }: SidebarLinksProps) {
  const pathname = usePathname();
  const router = useRouter();

  const isRouteActive = React.useCallback(
    (href: string) => pathname === href || pathname.startsWith(`${href}/`),
    [pathname]
  );

  const linkBaseClass = React.useMemo(
    () =>
      cn(
        "text-[16px] font-semibold h-13.75 flex items-center cursor-pointer",
        collapsed
          ? "justify-center px-2 mx-7 rounded-[4px] "
          : "px-4 gap-3 mx-3 rounded-lg"
      ),
    [collapsed]
  );

  const handleNav = React.useCallback(
    (e: React.MouseEvent<HTMLElement>) => {
      const href = (e.currentTarget as HTMLElement).dataset.href;
      if (href) router.push(href);
    },
    [router]
  );

  return (
    <ul className={`${dmSans.className} flex-1 overflow-auto mt-3 space-y-2`}>
      {links.map((link, idx) => {
        const isActive = isRouteActive(link.href);

        return (
          <li
            key={idx}
            className={cn(
              isActive ? "bg-primary text-white" : "text-[#98A2B3]",
              linkBaseClass
            )}
            data-href={link.href}
            onClick={handleNav}
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
        const customerActive = isRouteActive("/customer");
        const configActive = isRouteActive("/configuration");

        return (
          <>
            <li
              className={cn(
                customerActive
                  ? "bg-primary text-white rounded-lg"
                  : "text-[#98A2B3]",
                linkBaseClass
              )}
              data-href="/customer"
              onClick={handleNav}
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
              data-href="/configuration"
              onClick={handleNav}
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
}
