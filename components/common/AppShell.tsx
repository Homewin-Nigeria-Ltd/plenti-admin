"use client";

import Navbar from "@/components/common/Navbar";
import Sidebar from "@/components/common/Sidebar";
import { usePathname } from "next/navigation";
import * as React from "react";

export default function AppShell({
  children,
}: {
  children: React.ReactNode;
}) {
  const pathname = usePathname();
  const [mobileNavOpen, setMobileNavOpen] = React.useState(false);

  React.useEffect(() => {
    setMobileNavOpen(false);
  }, [pathname]);

  React.useEffect(() => {
    if (!mobileNavOpen) return;
    const previous = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    const onKey = (event: KeyboardEvent) => {
      if (event.key === "Escape") setMobileNavOpen(false);
    };
    window.addEventListener("keydown", onKey);
    return () => {
      document.body.style.overflow = previous;
      window.removeEventListener("keydown", onKey);
    };
  }, [mobileNavOpen]);

  return (
    <div className="flex min-h-dvh min-w-0 [--sidebar-width:340px] [--navbar-height:4rem] md:[--navbar-height:120px]">
      <Sidebar
        mobileOpen={mobileNavOpen}
        onMobileClose={() => setMobileNavOpen(false)}
      />
      <div className="flex min-h-dvh min-w-0 flex-1 flex-col">
        <Navbar onMenuClick={() => setMobileNavOpen(true)} />
        <main className="min-w-0 flex-1 overflow-auto bg-white p-4 sm:p-6">
          {children}
        </main>
      </div>
    </div>
  );
}
