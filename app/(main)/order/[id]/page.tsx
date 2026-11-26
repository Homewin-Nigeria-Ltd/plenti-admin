import OrderDetailsView from "@/components/order/OrderDetailsView";
import { OrderPageSkeleton } from "@/components/order/OrderPageSkeleton";
import { Suspense } from "react";

export const metadata = {
  title: "Order details | Plenti Admin",
};

export default async function OrderDetailPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  return (
    <Suspense fallback={<OrderPageSkeleton />}>
      <OrderDetailsView orderId={id} />
    </Suspense>
  );
}
