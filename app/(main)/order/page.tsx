export const metadata = {
  title: "Order Management | Plenti Admin",
};

import OrderStatCard from "@/components/order/OrderStatCard";
import OrderTableWrapper from "@/components/order/OrderTableWrapper";
import { orderStats } from "@/data/orders";

export default function OrderPage() {
  const stats = orderStats;

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-5 gap-4">
        {stats.map((s) => (
          <OrderStatCard
            key={s.title}
            title={s.title}
            value={s.value}
            changePercent={s.changePercent}
            increased={s.increased}
          />
        ))}
      </div>
      <OrderTableWrapper />
    </div>
  );
}
