"use client";

import { getSidebarPermissions } from "@/lib/modulePermissions";
import { useAccountStore } from "@/store/useAccountStore";
import * as React from "react";

type SidebarPermissionFlag = keyof ReturnType<typeof getSidebarPermissions>;

type ModuleAccessGateProps = {
  flag: SidebarPermissionFlag;
  message: string;
  children: React.ReactNode;
};

export function ModuleAccessGate({
  flag,
  message,
  children,
}: ModuleAccessGateProps) {
  const account = useAccountStore((state) => state.account);
  const allowed = React.useMemo(
    () => getSidebarPermissions(account)[flag],
    [account, flag],
  );

  if (!account) {
    return (
      <div className="rounded-xl border border-[#EAECF0] bg-[#F9FAFB] p-12 text-center">
        <p className="text-sm text-[#667085]">Loading…</p>
      </div>
    );
  }

  if (!allowed) {
    return (
      <div className="rounded-xl border border-[#EAECF0] bg-[#F9FAFB] p-12 text-center">
        <p className="text-sm text-[#667085]">{message}</p>
      </div>
    );
  }

  return <>{children}</>;
}
