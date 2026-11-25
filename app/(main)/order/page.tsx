"use client";

import * as React from "react";
import { OrderPageSkeleton } from "@/components/order/OrderPageSkeleton";
import OrderTableWrapper from "@/components/order/OrderTableWrapper";
import { getOrderPermissions } from "@/lib/modulePermissions";
import { useAccountStore } from "@/store/useAccountStore";

export default function OrderPage() {
  const account = useAccountStore((state) => state.account);
  const { canViewOrderModule } = React.useMemo(
    () => getOrderPermissions(account),
    [account],
  );

  if (!account) {
    return <OrderPageSkeleton />;
  }

  if (!canViewOrderModule) {
    return (
      <div className="rounded-xl border border-[#EAECF0] bg-white p-12 text-center">
        <p className="text-sm text-[#667085]">
          You do not have permission to view order management.
        </p>
      </div>
    );
  }

  return <OrderTableWrapper />;
}
