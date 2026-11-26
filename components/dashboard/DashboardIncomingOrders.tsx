"use client";

import DeclineIncomingOrderModal from "@/components/dashboard/DeclineIncomingOrderModal";
import IncomingOrderDetailsModal from "@/components/dashboard/IncomingOrderDetailsModal";
import {
  buildIncomingDetail,
  dummyDetailFromRow,
  dummyIncomingDetail,
  type IncomingOrderDetail,
} from "@/components/dashboard/incomingOrderView";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import {
  acceptPlentiOrder,
  declinePlentiOrder,
  fallbackWarehouseName,
} from "@/components/order/orderManagementView";
import { formatCurrency } from "@/lib/format";
import { useOrderStore } from "@/store/useOrderStore";
import type { Order } from "@/types/OrderTypes";
import type { WarehouseApi } from "@/types/InventoryTypes";
import { formatDistanceToNow } from "date-fns";
import { MapPin, ShoppingCart } from "lucide-react";
import { useRouter } from "next/navigation";
import * as React from "react";
import { toast } from "sonner";

type DashboardIncomingOrdersProps = {
  orders: Order[];
  warehouses?: WarehouseApi[];
  waitingCount?: number;
};

type IncomingRow = {
  id: string;
  name: string;
  initial: string;
  color: string;
  avatar?: string;
  orderNumber: string;
  time: string;
  isNew: boolean;
  products: string;
  location: string;
  payment: string;
  paid: boolean;
  amount: number;
  order?: Order;
};

const AVATAR_COLORS = ["#EE46BC", "#2F5BDB", "#12B76A", "#7A5AF8"];

const DUMMY_ROWS: IncomingRow[] = [
  {
    id: "dummy-1",
    name: "Chiamaka Obi",
    initial: "C",
    color: "#EE46BC",
    orderNumber: "ORD-2850",
    time: "just now",
    isNew: true,
    products: "Samsung Galaxy A15 128GB + Oraimo FreePods 4",
    location: "Abuja North",
    payment: "Paid · Card",
    paid: true,
    amount: 239900,
  },
  {
    id: "dummy-2",
    name: "Ibrahim Musa",
    initial: "I",
    color: "#2F5BDB",
    orderNumber: "ORD-2849",
    time: "2 min ago",
    isNew: false,
    products: "Hisense 43\" Smart TV",
    location: "Port Harcourt",
    payment: "Pay on delivery",
    paid: false,
    amount: 329000,
  },
  {
    id: "dummy-3",
    name: "Funmi Adeyemi",
    initial: "F",
    color: "#12B76A",
    orderNumber: "ORD-2848",
    time: "4 min ago",
    isNew: false,
    products: "Ofada rice 50kg bag + Palm oil 25L",
    location: "Kano Main",
    payment: "Paid · Transfer",
    paid: true,
    amount: 153000,
  },
  {
    id: "dummy-4",
    name: "Kemi Lawal",
    initial: "K",
    color: "#7A5AF8",
    orderNumber: "ORD-2847",
    time: "6 min ago",
    isNew: false,
    products: "Binatone 1.5L Blender",
    location: "Abuja North",
    payment: "Paid · Card",
    paid: true,
    amount: 42500,
  },
];

function productSummary(order: Order) {
  const items = order.items ?? [];
  if (items.length === 0) return "Samsung Galaxy A15 128GB";
  return items
    .map((item) => item.product_name || item.product?.name)
    .filter(Boolean)
    .slice(0, 3)
    .join(" + ");
}

function locationLabel(order: Order, warehouses: WarehouseApi[] = []) {
  const shipment =
    order.shipments?.find((row) => row.pickup_address || row.warehouse_id) ??
    order.shipments?.[0];
  if (shipment?.pickup_address) return shipment.pickup_address;
  const named = warehouses.find((warehouse) => warehouse.id === shipment?.warehouse_id);
  if (named?.name) return named.name;
  if (order.kwik_pickup_warehouse?.name) return order.kwik_pickup_warehouse.name;
  const city = order.shipping_address?.split(",").pop()?.trim();
  return city || fallbackWarehouseName(order.id);
}

function isPaid(order: Order) {
  const status = (order.payment_status || "").toLowerCase();
  return status.includes("paid") || status.includes("success");
}

function paymentMeta(order: Order) {
  const method = (order.payment_method || "").toLowerCase();
  const cod =
    method.includes("cash") ||
    method.includes("cod") ||
    method.includes("delivery") ||
    method.includes("pos");
  if (!isPaid(order) || cod) {
    return { paid: false, label: "Pay on delivery" };
  }
  if (method.includes("wallet")) return { paid: true, label: "Paid · Plenti wallet" };
  if (method.includes("paystack")) return { paid: true, label: "Paid · Paystack" };
  if (method.includes("monnify")) return { paid: true, label: "Paid · Monnify" };
  if (method.includes("transfer") || method.includes("bank")) {
    return { paid: true, label: "Paid · Transfer" };
  }
  return { paid: true, label: "Paid · Card" };
}

function isNew(order: Order) {
  const created = new Date(order.created_at).getTime();
  return Date.now() - created < 15 * 60 * 1000;
}

function mapOrder(
  order: Order,
  index: number,
  warehouses: WarehouseApi[] = [],
): IncomingRow {
  const payment = paymentMeta(order);
  return {
    id: String(order.id),
    name: order.user?.name || "Customer",
    initial: order.user?.name?.[0] || "U",
    color: AVATAR_COLORS[index % AVATAR_COLORS.length],
    avatar: order.user?.avatar || order.user?.avatar_url || "",
    orderNumber: order.order_number,
    time: formatDistanceToNow(new Date(order.created_at), { addSuffix: true }),
    isNew: isNew(order),
    products: productSummary(order),
    location: locationLabel(order, warehouses),
    payment: payment.label,
    paid: payment.paid,
    amount: Number(order.total) || 0,
    order,
  };
}

export default function DashboardIncomingOrders({
  orders,
  warehouses = [],
  waitingCount,
}: DashboardIncomingOrdersProps) {
  const router = useRouter();
  const fetchOrders = useOrderStore((state) => state.fetchOrders);
  const fetchIncomingOrders = useOrderStore((state) => state.fetchIncomingOrders);
  const fetchOrderStats = useOrderStore((state) => state.fetchOrderStats);
  const lastQuery = useOrderStore((state) => state.lastQuery);
  const lastIncomingQuery = useOrderStore((state) => state.lastIncomingQuery);
  const rows =
    orders.length > 0
      ? orders.map((order, index) => mapOrder(order, index, warehouses))
      : DUMMY_ROWS;
  const waiting = waitingCount && waitingCount > 0 ? waitingCount : rows.length;
  const [detail, setDetail] = React.useState<IncomingOrderDetail | null>(null);
  const [selectedOrder, setSelectedOrder] = React.useState<Order | null>(null);
  const [detailsOpen, setDetailsOpen] = React.useState(false);
  const [declineOpen, setDeclineOpen] = React.useState(false);
  const [submitting, setSubmitting] = React.useState(false);

  const openOrderPage = (row: IncomingRow) => {
    if (row.order?.id != null) {
      router.push(`/order/${row.order.id}?from=pending`);
      return true;
    }
    return false;
  };

  const openDetails = (row: IncomingRow) => {
    if (openOrderPage(row)) return;
    if (row.orderNumber === "ORD-2851") {
      setSelectedOrder(null);
      setDetail(dummyIncomingDetail());
    } else {
      setSelectedOrder(null);
      setDetail(dummyDetailFromRow(row));
    }
    setDeclineOpen(false);
    setDetailsOpen(true);
  };

  const openDecline = (row: IncomingRow) => {
    if (row.order) {
      setSelectedOrder(row.order);
      setDetail(buildIncomingDetail(row.order, warehouses, row.color));
    } else if (row.orderNumber === "ORD-2851") {
      setSelectedOrder(null);
      setDetail(dummyIncomingDetail());
    } else {
      setSelectedOrder(null);
      setDetail(dummyDetailFromRow(row));
    }
    setDetailsOpen(false);
    setDeclineOpen(true);
  };

  const refreshOrders = async () => {
    await Promise.all([
      fetchIncomingOrders({
        page: lastIncomingQuery.page,
        search: lastIncomingQuery.search,
        per_page: lastIncomingQuery.per_page,
      }),
      fetchOrders({
        page: lastQuery.page,
        search: lastQuery.search,
        delivery_provider: lastQuery.delivery_provider || undefined,
      }),
      fetchOrderStats(),
    ]);
  };

  const handleAccept = async (warehouseId?: string) => {
    if (!selectedOrder) {
      toast.success("Order sent to riders");
      setDetailsOpen(false);
      return;
    }
    setSubmitting(true);
    try {
      await acceptPlentiOrder(selectedOrder, warehouseId);
      toast.success("Order sent to riders");
      setDetailsOpen(false);
      await refreshOrders();
    } catch (error) {
      toast.error(error instanceof Error ? error.message : "Failed to accept order");
    } finally {
      setSubmitting(false);
    }
  };

  const handleDecline = async (payload: { reason: string; message: string }) => {
    if (!selectedOrder) {
      toast.success("Order declined");
      setDeclineOpen(false);
      setDetailsOpen(false);
      return;
    }
    setSubmitting(true);
    try {
      await declinePlentiOrder(selectedOrder, payload);
      toast.success("Order declined");
      setDeclineOpen(false);
      setDetailsOpen(false);
      await refreshOrders();
    } catch (error) {
      toast.error(error instanceof Error ? error.message : "Failed to decline order");
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <section className="rounded-2xl border border-[#E4E6EB] bg-white p-4 sm:p-5 min-w-0">
      <div className="flex items-start justify-between gap-3 mb-3">
        <div className="flex items-start gap-2.5 min-w-0">
          <span className="size-8 rounded-lg bg-[#FFF6ED] text-[#F38744] inline-flex items-center justify-center shrink-0 mt-0.5">
            <ShoppingCart className="size-4" />
          </span>
          <div>
            <div className="flex items-center gap-2">
              <h2 className="text-sm font-semibold text-[#101828]">Incoming orders</h2>
              {waiting > 0 ? (
                <span className="rounded-md bg-[#FFF6ED] text-[#F38744] text-[11px] font-semibold px-2 py-0.5">
                  {waiting} waiting
                </span>
              ) : null}
            </div>
            <p className="text-[12px] text-[#667085] mt-0.5">
              Accept to send to riders. Decline needs a reason.
            </p>
          </div>
        </div>
        <button
          type="button"
          className="text-[12px] font-medium text-[#2F5BDB] shrink-0"
          onClick={() => window.open("/order", "_blank", "noopener,noreferrer")}
        >
          Open New tab
        </button>
      </div>

      <div className="divide-y divide-[#E4E6EB]">
        {rows.map((row) => (
          <div key={row.id} className="flex items-center gap-3 py-3 min-w-0">
            <button
              type="button"
              className="flex items-center gap-3 min-w-0 flex-1 text-left"
              onClick={() => openDetails(row)}
            >
              <Avatar className="size-8 shrink-0">
                <AvatarImage src={row.avatar || ""} />
                <AvatarFallback
                  className="text-white text-xs"
                  style={{ backgroundColor: row.color }}
                >
                  {row.initial}
                </AvatarFallback>
              </Avatar>
              <div className="min-w-0 flex-1">
                <div className="flex items-center gap-1.5 min-w-0">
                  <p className="text-sm font-medium text-[#101828] truncate">
                    {row.name}
                  </p>
                  <span className="text-[11px] text-[#98A2B3] truncate">
                    {row.orderNumber} · {row.time}
                  </span>
                  {row.isNew ? (
                    <span className="text-[10px] font-semibold uppercase tracking-wide text-[#F04438]">
                      NEW
                    </span>
                  ) : null}
                </div>
                <p className="text-[12px] text-[#667085] truncate">{row.products}</p>
                <div className="mt-0.5 flex flex-wrap items-center gap-x-2 text-[11px] text-[#667085]">
                  <span className="inline-flex items-center gap-1">
                    <MapPin className="size-3 text-[#98A2B3]" />
                    {row.location}
                  </span>
                  <span className="text-[#D0D5DD]">·</span>
                  {row.paid ? (
                    <span className="inline-flex items-center gap-1">
                      <span className="size-1.5 rounded-full bg-[#12B76A]" />
                      {row.payment}
                    </span>
                  ) : (
                    <span>{row.payment}</span>
                  )}
                </div>
              </div>
            </button>
            <div className="shrink-0 flex items-center gap-2">
              <p className="text-sm font-semibold text-[#101828] mr-1">
                {formatCurrency(row.amount)}
              </p>
              <button
                type="button"
                className="h-8 px-3 rounded-lg border border-[#E4E6EB] bg-white text-[12px] text-[#667085] hover:bg-[#F9FAFB]"
                onClick={() => openDecline(row)}
              >
                Decline
              </button>
              <button
                type="button"
                className="h-8 px-4 rounded-lg bg-[#2F5BDB] text-white text-[12px] font-medium hover:bg-[#2F5BDB]/90"
                onClick={() => openDetails(row)}
              >
                Accept
              </button>
            </div>
          </div>
        ))}
      </div>
      <p className="text-[11px] text-[#98A2B3] mt-1">
        New orders also pop up wherever you are in the admin, with a sound.
      </p>

      <IncomingOrderDetailsModal
        open={detailsOpen}
        detail={detail}
        submitting={submitting}
        onClose={() => setDetailsOpen(false)}
        onDecline={() => {
          setDetailsOpen(false);
          setDeclineOpen(true);
        }}
        onAccept={(warehouseId) => void handleAccept(warehouseId)}
      />
      <DeclineIncomingOrderModal
        open={declineOpen}
        detail={detail}
        submitting={submitting}
        onClose={() => setDeclineOpen(false)}
        onBack={() => {
          setDeclineOpen(false);
          setDetailsOpen(true);
        }}
        onConfirm={(payload) => void handleDecline(payload)}
      />
    </section>
  );
}
