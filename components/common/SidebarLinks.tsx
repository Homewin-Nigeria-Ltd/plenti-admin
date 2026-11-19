"use client";

import * as React from "react";
import { dmSans } from "@/lib/fonts";
import { getSidebarPermissions } from "@/lib/modulePermissions";
import { cn } from "@/lib/utils";
import { useAccountStore } from "@/store/useAccountStore";
import {
  Bell,
  Bike,
  Headset,
  LayoutDashboard,
  Megaphone,
  Package,
  ShoppingBag,
  ShoppingCart,
  SlidersHorizontal,
  TrendingUp,
  Users,
  Wallet,
  type LucideIcon,
} from "lucide-react";
import Link from "next/link";
import { usePathname } from "next/navigation";

type NavBadge = {
  text: string;
  className: string;
};

type NavItem = {
  name: string;
  href: string;
  icon: LucideIcon;
  permission: keyof ReturnType<typeof getSidebarPermissions>;
  badge?: NavBadge;
};

type NavSection = {
  title: string;
  items: NavItem[];
};

const NAV_SECTIONS: NavSection[] = [
  {
    title: "Overview",
    items: [
      {
        name: "Dashboard",
        href: "/dashboard",
        icon: LayoutDashboard,
        permission: "canViewDashboard",
      },
    ],
  },
  {
    title: "Commerce",
    items: [
      {
        name: "Orders",
        href: "/order",
        icon: ShoppingCart,
        permission: "canViewOrderManagement",
        badge: { text: "4 new", className: "bg-[#FFF6ED] text-[#F38744]" },
      },
      {
        name: "Products",
        href: "/product",
        icon: ShoppingBag,
        permission: "canViewProductManagement",
      },
      {
        name: "Inventory",
        href: "/inventory",
        icon: Package,
        permission: "canViewInventoryManagement",
        badge: {
          text: "3",
          className: "bg-[#FEE4E2] text-[#D92D20] min-w-5 justify-center px-1.5",
        },
      },
      {
        name: "Sales",
        href: "/sales",
        icon: TrendingUp,
        permission: "canViewSalesManagement",
      },
      {
        name: "Marketing",
        href: "/marketing",
        icon: Megaphone,
        permission: "canViewMarketingAndEngagement",
      },
    ],
  },
  {
    title: "Operations",
    items: [
      {
        name: "Riders",
        href: "/rider",
        icon: Bike,
        permission: "canViewRiderManagement",
      },
      {
        name: "Customer support",
        href: "/customer",
        icon: Headset,
        permission: "canViewCustomerSupport",
      },
    ],
  },
  {
    title: "Admin",
    items: [
      {
        name: "Finance",
        href: "/finance",
        icon: Wallet,
        permission: "canViewFinanceManagement",
      },
      {
        name: "Users",
        href: "/user?type=customer",
        icon: Users,
        permission: "canViewUserManagement",
      },
      {
        name: "Notifications",
        href: "/notification",
        icon: Bell,
        permission: "canViewNotifications",
      },
      {
        name: "System config",
        href: "/configuration",
        icon: SlidersHorizontal,
        permission: "canViewConfiguration",
      },
    ],
  },
];

export const links = NAV_SECTIONS.flatMap((section) =>
  section.items.map((item) => ({ name: item.name, href: item.href })),
);

function hrefPath(href: string) {
  return href.split("?")[0];
}

type SidebarLinksProps = {
  collapsed?: boolean;
};

export default function SidebarLinks({ collapsed = false }: SidebarLinksProps) {
  const pathname = usePathname();
  const account = useAccountStore((state) => state.account);
  const permissions = React.useMemo(
    () => getSidebarPermissions(account),
    [account],
  );

  const visibleSections = React.useMemo(
    () =>
      NAV_SECTIONS.map((section) => ({
        ...section,
        items: section.items.filter((item) => permissions[item.permission]),
      })).filter((section) => section.items.length > 0),
    [permissions],
  );

  const isRouteActive = React.useCallback(
    (href: string) => {
      const path = hrefPath(href);
      return pathname === path || pathname.startsWith(`${path}/`);
    },
    [pathname],
  );

  return (
    <nav
      className={cn(dmSans.className, "sidebar-scroller flex-1 min-h-0 px-3 pb-3")}
    >
      {visibleSections.map((section) => (
        <div key={section.title} className="mb-4">
          {!collapsed ? (
            <p className="px-2.5 mb-1 text-[11px] font-semibold tracking-[0.08em] uppercase text-[#98A2B3]">
              {section.title}
            </p>
          ) : null}
          <ul className="space-y-0.5">
            {section.items.map((item) => {
              const isActive = isRouteActive(item.href);
              const Icon = item.icon;
              return (
                <li key={item.href}>
                  <Link
                    href={item.href}
                    title={collapsed ? item.name : undefined}
                    className={cn(
                      "flex items-center rounded-lg text-[14px] font-medium h-9 transition-colors",
                      collapsed ? "justify-center px-0" : "gap-2.5 px-2.5",
                      isActive
                        ? "bg-[#EEF2FF] text-[#0B1E66]"
                        : "text-[#667085] hover:bg-[#F9FAFB]",
                    )}
                  >
                    <Icon
                      className={cn(
                        "size-[18px] shrink-0",
                        isActive ? "text-[#0B1E66]" : "text-[#98A2B3]",
                      )}
                      strokeWidth={1.75}
                    />
                    {!collapsed ? (
                      <>
                        <span className="min-w-0 truncate flex-1">{item.name}</span>
                        {item.badge ? (
                          <span
                            className={cn(
                              "shrink-0 inline-flex items-center rounded-full py-0.5 px-2 text-[10px] font-semibold leading-none",
                              item.badge.className,
                            )}
                          >
                            {item.badge.text}
                          </span>
                        ) : null}
                      </>
                    ) : null}
                  </Link>
                </li>
              );
            })}
          </ul>
        </div>
      ))}
    </nav>
  );
}
