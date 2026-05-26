"use client";

import { RiderLayoutClient } from "@/components/rider/RiderLayoutClient";
import { Skeleton } from "@/components/ui/skeleton";
import { getRiderPermissions } from "@/lib/modulePermissions";
import { useAccountStore } from "@/store/useAccountStore";
import * as React from "react";

function RiderPageSkeleton() {
  return (
    <div className="space-y-6">
      <div className="flex gap-4">
        {[1, 2, 3].map((i) => (
          <Skeleton key={i} className="h-10 w-24" />
        ))}
        <Skeleton className="h-10 w-36 ml-auto" />
      </div>
      <Skeleton className="h-12 w-full max-w-xl" />
      <div className="space-y-3">
        {[1, 2, 3, 4, 5].map((i) => (
          <Skeleton key={i} className="h-16 w-full" />
        ))}
      </div>
    </div>
  );
}

export default function RiderLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const account = useAccountStore((state) => state.account);
  const { canViewRiderManagement } = React.useMemo(
    () => getRiderPermissions(account),
    [account],
  );

  if (!account) {
    return <RiderPageSkeleton />;
  }

  if (!canViewRiderManagement) {
    return (
      <div className="rounded-xl border border-[#EAECF0] bg-[#F9FAFB] p-12 text-center">
        <p className="text-sm text-[#667085]">
          You do not have permission to view rider management.
        </p>
      </div>
    );
  }

  return <RiderLayoutClient>{children}</RiderLayoutClient>;
}
