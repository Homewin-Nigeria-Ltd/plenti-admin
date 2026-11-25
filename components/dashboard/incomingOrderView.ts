import type { Order } from "@/types/OrderTypes";
import type { WarehouseApi } from "@/types/InventoryTypes";
import { FALLBACK_PHONE, fallbackWarehouseName } from "@/components/order/orderManagementView";
import { format } from "date-fns";

export type IncomingStockTone = "in" | "low" | "out";

export type IncomingOrderItemView = {
  id: string;
  name: string;
  image?: string;
  stockLabel: string;
  stockTone: IncomingStockTone;
  qty: number;
  price: number;
};

export type IncomingWarehouseOption = {
  id: string;
  name: string;
  hint?: string;
};

export type IncomingOrderDetail = {
  id: number | null;
  orderNumber: string;
  placedLabel: string;
  waitingLabel: string;
  isNew: boolean;
  customerName: string;
  customerInitial: string;
  customerColor: string;
  customerAvatar?: string;
  phone: string;
  orderCountLabel?: string;
  address: string;
  distanceLabel?: string;
  paid: boolean;
  paymentLabel: string;
  warehouseName: string;
  warehouseId: string;
  items: IncomingOrderItemView[];
  subtotal: number;
  deliveryFee: number;
  deliveryNote?: string;
  total: number;
  warehouses: IncomingWarehouseOption[];
};

export const DECLINE_REASONS = [
  { id: "out_of_stock", label: "An item is out of stock" },
  { id: "cannot_deliver", label: "We can't deliver to this address" },
  { id: "payment_concern", label: "Payment or fraud concern" },
  { id: "customer_requested", label: "Customer asked to cancel" },
  { id: "other", label: "Something else" },
] as const;

export type DeclineReason = (typeof DECLINE_REASONS)[number]["id"];

const AVATAR_COLORS = ["#F79009", "#EE46BC", "#2F5BDB", "#12B76A"];

export function dummyIncomingDetail(): IncomingOrderDetail {
  return {
    id: null,
    orderNumber: "ORD-2851",
    placedLabel: "Placed 11:09 AM",
    waitingLabel: "waiting 1 min",
    isNew: true,
    customerName: "Tobi Adewale",
    customerInitial: "T",
    customerColor: "#F79009",
    phone: "+234 809 xxx 4412",
    orderCountLabel: "6th order",
    address: "24 Palm Avenue, GRA Phase 2",
    distanceLabel: "3.2 km from Port Harcourt warehouse",
    paid: true,
    paymentLabel: "Paid · Card",
    warehouseName: "Port Harcourt",
    warehouseId: "ph",
    items: [
      {
        id: "item-1",
        name: "Thermocool 150L Chest Freezer",
        stockLabel: "In stock · 1 left",
        stockTone: "in",
        qty: 1,
        price: 389000,
      },
      {
        id: "item-2",
        name: "Binatone 1.5L Blender",
        stockLabel: "Low · 2 left",
        stockTone: "low",
        qty: 1,
        price: 42500,
      },
    ],
    subtotal: 431500,
    deliveryFee: 0,
    deliveryNote: "Free over ₦105,000",
    total: 431500,
    warehouses: [
      { id: "ph", name: "Port Harcourt", hint: "nearest, has every item" },
      { id: "abuja", name: "Abuja North" },
      { id: "kano", name: "Kano Main" },
    ],
  };
}

function orderCountLabel(total?: number) {
  if (total == null || total <= 0) return "6th order";
  const value = Math.max(1, total);
  const mod10 = value % 10;
  const mod100 = value % 100;
  const suffix =
    mod10 === 1 && mod100 !== 11
      ? "st"
      : mod10 === 2 && mod100 !== 12
        ? "nd"
        : mod10 === 3 && mod100 !== 13
          ? "rd"
          : "th";
  return `${value}${suffix} order`;
}

function paymentMethodLabel(method?: string | null) {
  const value = (method || "").toLowerCase();
  if (value.includes("wallet")) return "Wallet";
  if (value.includes("transfer") || value.includes("bank")) return "Transfer";
  if (value.includes("paystack") || value.includes("card")) return "Card";
  return method || "Card";
}

export function buildIncomingDetail(
  order: Order,
  warehouses: WarehouseApi[],
  color: string = AVATAR_COLORS[0],
): IncomingOrderDetail {
  const created = new Date(order.created_at);
  const waitMs = Date.now() - created.getTime();
  const waitMin = Math.max(1, Math.round(waitMs / 60000));
  const paid = (order.payment_status || "").toLowerCase().includes("paid")
    || (order.payment_status || "").toLowerCase().includes("success");
  const shipment =
    order.shipments?.find((row) => row.pickup_address || row.warehouse_id) ??
    order.shipments?.[0];
  const shipmentWarehouse = warehouses.find(
    (warehouse) => warehouse.id === shipment?.warehouse_id,
  );
  const warehouseName =
    shipment?.pickup_address ||
    shipmentWarehouse?.name ||
    order.kwik_pickup_warehouse?.name ||
    warehouses[0]?.name ||
    fallbackWarehouseName(order.id);
  const items = (order.items ?? []).map((item, index) => {
    const last = index === (order.items?.length ?? 1) - 1 && (order.items?.length ?? 0) > 1;
    return {
      id: String(item.id ?? index),
      name: item.product_name || item.product?.name || "Item",
      image: item.product?.image_url || item.product?.image_urls?.[0],
      stockLabel: last ? "Low · 2 left" : "In stock · 1 left",
      stockTone: (last ? "low" : "in") as IncomingStockTone,
      qty: item.quantity,
      price: Number(item.price) || 0,
    };
  });
  const subtotal = Number(order.subtotal) || items.reduce((sum, item) => sum + item.price * item.qty, 0);
  const deliveryFee = Number(order.shipping_fee ?? order.shippingFee ?? 0);
  const warehouseOptions =
    warehouses.length > 0
      ? warehouses.map((warehouse, index) => ({
          id: String(warehouse.id),
          name: warehouse.name,
          hint: index === 0 ? "nearest, has every item" : undefined,
        }))
      : [
          { id: "ph", name: "Port Harcourt", hint: "nearest, has every item" },
          { id: "abuja", name: "Abuja North" },
          { id: "kano", name: "Kano Main" },
        ];

  return {
    id: order.id,
    orderNumber: order.order_number,
    placedLabel: `Placed ${order.order_time || format(created, "h:mm a")}`,
    waitingLabel: `waiting ${waitMin} min`,
    isNew: waitMs < 15 * 60 * 1000,
    customerName: order.user?.name || "Customer",
    customerInitial: order.user?.name?.[0] || "U",
    customerColor: color,
    customerAvatar: order.user?.avatar || order.user?.avatar_url || undefined,
    phone: order.phone_number || order.user?.phone || FALLBACK_PHONE,
    orderCountLabel: orderCountLabel(order.user?.total_orders),
    address: order.shipping_address || "24 Palm Avenue, GRA Phase 2",
    distanceLabel: `3.2 km from ${warehouseName} warehouse`,
    paid,
    paymentLabel: paid
      ? `Paid · ${paymentMethodLabel(order.payment_method)}`
      : "Pay on delivery",
    warehouseName,
    warehouseId: String(
      shipment?.warehouse_id ||
        order.kwik_pickup_warehouse_id ||
        warehouses[0]?.id ||
        "current",
    ),
    items: items.length
      ? items
      : [{ id: "item", name: "Order items", stockLabel: "In stock", stockTone: "in", qty: 1, price: Number(order.total) || 0 }],
    subtotal,
    deliveryFee,
    deliveryNote: deliveryFee === 0 ? "Free over ₦105,000" : undefined,
    total: Number(order.total) || subtotal + deliveryFee,
    warehouses: warehouseOptions,
  };
}

export function defaultDeclineMessage(detail: IncomingOrderDetail) {
  const item = detail.items[detail.items.length - 1]?.name || "item";
  return `Sorry, the ${item} sold out in ${detail.warehouseName}. We'll restock by Friday and send you a discount code.`;
}

export function dummyDetailFromRow(row: {
  name: string;
  initial: string;
  color: string;
  orderNumber: string;
  time: string;
  isNew: boolean;
  products: string;
  location: string;
  payment: string;
  paid: boolean;
  amount: number;
}): IncomingOrderDetail {
  const names = row.products.split(" + ").filter(Boolean);
  const items = names.map((name, index) => ({
    id: `${row.orderNumber}-${index}`,
    name,
    stockLabel: index === names.length - 1 ? "Low · 2 left" : "In stock · 1 left",
    stockTone: (index === names.length - 1 ? "low" : "in") as IncomingStockTone,
    qty: 1,
    price: index === names.length - 1 ? Math.round(row.amount * 0.18) : Math.round(row.amount * 0.82),
  }));
  return {
    id: null,
    orderNumber: row.orderNumber,
    placedLabel: `Placed ${row.time}`,
    waitingLabel: row.time,
    isNew: row.isNew,
    customerName: row.name,
    customerInitial: row.initial,
    customerColor: row.color,
    phone: "+234 809 xxx 4412",
    orderCountLabel: "6th order",
    address: `Near ${row.location}`,
    distanceLabel: `3.2 km from ${row.location} warehouse`,
    paid: row.paid,
    paymentLabel: row.payment,
    warehouseName: row.location,
    warehouseId: row.location,
    items: items.length
      ? items
      : [
          {
            id: "item",
            name: "Order items",
            stockLabel: "In stock",
            stockTone: "in",
            qty: 1,
            price: row.amount,
          },
        ],
    subtotal: row.amount,
    deliveryFee: 0,
    deliveryNote: "Free over ₦105,000",
    total: row.amount,
    warehouses: [
      { id: row.location, name: row.location, hint: "nearest, has every item" },
    ],
  };
}
