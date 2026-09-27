"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { cn } from "@/lib/utils";

const INVENTORY_TABS = [
  { href: "/inventory", label: "Overview" },
  { href: "/inventory/stock-transfer", label: "Stock Transfer" },
  { href: "/inventory/transfer-request", label: "Transfer Request" },
  { href: "/inventory/reorder-recommendations", label: "Reorder Recommendations" },
  { href: "/inventory/stock-alerts", label: "Stock Alerts" },
  { href: "/inventory/audit-log", label: "Audit Log" },
] as const;

type InventoryTabNavProps = {
  stockAlertsCount?: number | null;
};

export function InventoryTabNav({ stockAlertsCount }: InventoryTabNavProps) {
  const pathname = usePathname();

  const isActive = (href: string) => {
    if (href === "/inventory") {
      return pathname === "/inventory" || pathname.startsWith("/inventory/warehouse");
    }
    return pathname === href;
  };

  return (
    <nav className="w-full min-w-0 overflow-x-auto">
      <ul className="flex gap-1 min-w-max">
        {INVENTORY_TABS.map((tab) => {
          const active = isActive(tab.href);
          const showCount =
            tab.href === "/inventory/stock-alerts" &&
            stockAlertsCount != null;
          return (
            <li key={tab.href}>
              <Link
                href={tab.href}
                className={cn(
                  "inline-flex items-center rounded-[3px] px-4 py-2.5 text-sm font-medium transition-colors whitespace-nowrap",
                  active
                    ? "bg-[#E8EEFF] text-[#0B1E66]"
                    : "text-[#667085] hover:text-[#101928]"
                )}
              >
                {tab.label}
                {showCount ? ` (${stockAlertsCount})` : null}
              </Link>
            </li>
          );
        })}
      </ul>
    </nav>
  );
}
