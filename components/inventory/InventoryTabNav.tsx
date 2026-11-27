"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { cn } from "@/lib/utils";

const INVENTORY_TABS = [
  { href: "/inventory", label: "Stock" },
  { href: "/inventory/stock-transfer", label: "Stock Transfer" },
  { href: "/inventory/stock-alerts", label: "Stock Alerts" },
  { href: "/inventory/audit-log", label: "Audit Log" },
] as const;

type InventoryTabNavProps = {
  stockAlertsCount?: number | null;
  transferWaitingCount?: number | null;
};

export function InventoryTabNav({
  stockAlertsCount,
  transferWaitingCount,
}: InventoryTabNavProps) {
  const pathname = usePathname();

  const isActive = (href: string) => {
    if (href === "/inventory") {
      return (
        pathname === "/inventory" || pathname.startsWith("/inventory/warehouse")
      );
    }
    return pathname === href || pathname.startsWith(`${href}/`);
  };

  return (
    <nav className="w-full min-w-0 overflow-x-auto">
      <ul className="flex min-w-max gap-1 border-b border-[#EAECF0]">
        {INVENTORY_TABS.map((tab) => {
          const active = isActive(tab.href);
          const count =
            tab.href === "/inventory/stock-alerts"
              ? stockAlertsCount
              : tab.href === "/inventory/stock-transfer"
                ? transferWaitingCount
                : null;
          return (
            <li key={tab.href}>
              <Link
                href={tab.href}
                className={cn(
                  "inline-flex items-center gap-1.5 border-b-2 px-3 py-2.5 text-[13px] font-medium whitespace-nowrap -mb-px",
                  active
                    ? "border-[#0B1E66] text-[#0B1E66]"
                    : "border-transparent text-[#667085] hover:text-[#101828]",
                )}
              >
                {tab.label}
                {count != null && count > 0 ? (
                  <span
                    className={cn(
                      "rounded-full px-1.5 text-[11px] font-semibold",
                      active
                        ? "bg-[#EEF2FF] text-[#0B1E66]"
                        : "bg-[#F2F4F7] text-[#667085]",
                    )}
                  >
                    {count}
                  </span>
                ) : null}
              </Link>
            </li>
          );
        })}
      </ul>
    </nav>
  );
}
