"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { cn } from "@/lib/utils";

const RIDER_TABS = [
  { href: "/rider", label: "Riders" },
  { href: "/rider/onboarding", label: "Onboarding" },
  { href: "/rider/chat", label: "Chat" },
] as const;

export function RiderTabNav() {
  const pathname = usePathname();

  const isActive = (href: string) => {
    if (href === "/rider") {
      return pathname === "/rider";
    }
    return pathname === href || pathname.startsWith(`${href}/`);
  };

  return (
    <nav className="w-full overflow-x-auto -mx-4 px-4 sm:mx-0 sm:px-0">
      <ul className="flex gap-4 sm:gap-6 min-w-max">
        {RIDER_TABS.map((tab) => {
          const active = isActive(tab.href);
          return (
            <li key={tab.href}>
              <Link
                href={tab.href}
                className={cn(
                  "inline-block px-4 py-2 font-medium text-sm sm:text-base transition-colors whitespace-nowrap rounded-md",
                  active
                    ? "bg-[#E8EEFF] text-primary"
                    : "bg-transparent text-neutral-500 hover:bg-neutral-50",
                )}
              >
                {tab.label}
              </Link>
            </li>
          );
        })}
      </ul>
    </nav>
  );
}
