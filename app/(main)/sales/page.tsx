"use client";

import { Suspense } from "react";
import SalesContent from "@/components/sales/SalesContent";
import { Skeleton } from "@/components/ui/skeleton";
import { useAccountStore } from "@/store/useAccountStore";
import SalesRepContent from "@/components/sales/SalesRepContent";
import SalesManagerContent from "@/components/sales/SalesManagerContent";

function SalesSkeleton() {
  return (
    <div className="space-y-6">
      <div className="flex gap-4">
        {[1, 2, 3, 4, 5].map((i) => (
          <Skeleton key={i} className="h-10 flex-1" />
        ))}
      </div>
      <div className="space-y-3">
        {[1, 2, 3].map((i) => (
          <Skeleton key={i} className="h-20 w-full" />
        ))}
      </div>
    </div>
  );
}

export default function SaleManagement() {
  const user = useAccountStore((state) => state.account);
  if (!user) return null;

  console.log("User roles:", user.roles); // Debugging line to check user roles

  // Determine user role and render appropriate view
  const isSalesRep = user.roles.some((role) => role.slug === "sales-rep");
  const isSalesManager = user.roles.some(
    (role) => role.slug === "sales-manager",
  );

  const renderContent = () => {
    if (isSalesRep) {
      return <SalesRepContent />;
    } else if (isSalesManager) {
      return <SalesManagerContent />;
    } else {
      return <SalesContent />;
    }
  };

  return <Suspense fallback={<SalesSkeleton />}>{renderContent()}</Suspense>;
}
