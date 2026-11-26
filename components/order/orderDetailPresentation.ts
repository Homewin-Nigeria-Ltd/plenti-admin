import {
  isPaid,
  isPaymentFailed,
  isPlentiOrder,
  orderTimeLabel,
  riderName,
  statusLabel,
} from "@/components/order/orderManagementView";
import type { Order } from "@/types/OrderTypes";
import { format } from "date-fns";

export type OrderDetailPhase =
  | "pending"
  | "finding_rider"
  | "rider_assigned"
  | "in_transit"
  | "delivered"
  | "canceled";

export type TimelineEvent = {
  title: string;
  time?: string;
  tone: "wait" | "ok" | "info" | "alert" | "done";
};

export const MOCK = {
  plate: "KJA 112 QK",
  rating: "4.8",
  vehicle: "Bike",
  pickupCode: "4817",
  last4: "8021",
  cardBrand: "Visa",
  sku: ["THD-CF150 · White", "BIN-BL015 · Black"],
  trips: "3 trips today",
  distanceLeft: "2.1 km left",
  tripTime: "15 min",
  ridersPinged: 6,
  ridersCanAccept: 5,
  declinedBy: "Musa A.",
  declinedReason: "too heavy for a bike",
  acceptedBy: "Adaeze Okafir",
  riderName: "Tunde Bakare",
  riderPhone: "+234 809 441 2210",
  waitingSince: "11:14 AM",
  placed: "11:09 AM",
  accepted: "11:10 AM",
  riderAssigned: "11:12 AM",
  inTransit: "11:38 AM",
  delivered: "11:39 AM",
  canceled: "11:12 AM",
  refund: "11:13 AM",
  arrivedWarehouse: "11:38 AM",
};

function clock(iso?: string | null, labeled?: string | null) {
  if (labeled) return labeled;
  if (!iso) return "";
  const date = new Date(iso);
  if (!Number.isFinite(date.getTime())) return "";
  return format(date, "h:mm a");
}

export function orderDetailPhase(order: Order): OrderDetailPhase {
  const status = `${order.status ?? ""}`.toLowerCase();
  if (status.includes("cancel") || status.includes("refund")) return "canceled";
  if (
    status.includes("deliver") ||
    status.includes("success") ||
    status.includes("complete")
  ) {
    return "delivered";
  }
  if (status.includes("transit") || status.includes("ship")) return "in_transit";
  if (riderName(order)) return "rider_assigned";
  if (status.includes("pending")) return "pending";
  if (isPaymentFailed(order)) return "pending";
  return "finding_rider";
}

export function phaseHeadline(phase: OrderDetailPhase, label: string, order?: Order) {
  if (phase === "finding_rider" && (!order || isPlentiOrder(order))) {
    return `${label} · finding a rider`;
  }
  if (phase === "rider_assigned") return `${label} · rider assigned`;
  return label;
}

export function fulfillmentIndexForPhase(phase: OrderDetailPhase) {
  if (phase === "pending") return 1;
  if (phase === "finding_rider") return 2;
  if (phase === "rider_assigned") return 3;
  if (phase === "in_transit") return 4;
  if (phase === "delivered") return 5;
  if (phase === "canceled") return 2;
  return 1;
}

export function stepTimestamp(
  order: Order,
  index: number,
  phase: OrderDetailPhase,
) {
  const placed =
    order.checkout_time ||
    order.time_placed ||
    orderTimeLabel(order) ||
    MOCK.placed;
  const accepted =
    clock(order.accepted_at) ||
    order.payment_time ||
    clock(order.paid_at) ||
    MOCK.accepted;
  const assigned = clock(order.assigned_at) || MOCK.riderAssigned;
  const transit = clock(order.in_transit_at) || MOCK.inTransit;
  const delivered = clock(order.updated_at) || MOCK.delivered;

  if (index === 0) return placed;
  if (phase === "pending") return index === 1 ? "Now" : "";
  if (phase === "finding_rider") {
    if (index === 1) return accepted;
    if (index === 2) return "Now";
    return "";
  }
  if (phase === "rider_assigned") {
    if (index === 1) return accepted;
    if (index === 2) return assigned;
    return "";
  }
  if (phase === "in_transit") {
    if (index === 1) return accepted;
    if (index === 2) return assigned;
    if (index === 3) return transit;
    if (index === 4) return "Now";
    return "";
  }
  if (phase === "delivered") {
    if (index === 1) return accepted;
    if (index === 2) return assigned;
    if (index === 3) return transit;
    if (index === 4) return delivered;
    return "";
  }
  if (phase === "canceled") {
    if (index === 1) return MOCK.accepted;
    return "";
  }
  return "";
}

export function timelineForPhase(
  phase: OrderDetailPhase,
  order: Order,
  amountLabel: string,
  paymentLabel: string,
  customerName: string,
  rider: string,
): TimelineEvent[] {
  const placed =
    order.checkout_time || order.time_placed || orderTimeLabel(order) || MOCK.placed;
  const paid = order.payment_time || clock(order.paid_at) || placed;
  const acceptedAt = clock(order.accepted_at) || MOCK.accepted;
  const acceptedBy =
    typeof order.accepted_by === "string" && order.accepted_by.trim()
      ? order.accepted_by
      : MOCK.acceptedBy;
  const transitAt = clock(order.in_transit_at) || MOCK.inTransit;
  const refundAt = clock(order.refund_requested_at) || MOCK.refund;
  const plenti = isPlentiOrder(order);
  const code = pickupCodeDigits(order) || MOCK.pickupCode;

  const base: TimelineEvent[] = [];
  if (isPaid(order) || order.paid_at) {
    base.push({
      title: `Payment of ${amountLabel} confirmed by ${paymentLabel.toLowerCase()}`,
      time: paid,
      tone: "ok",
    });
  }
  base.push({
    title: "Order placed on the Plenti app",
    time: placed,
    tone: "done",
  });

  if (phase === "pending") {
    return [
      { title: "Waiting for someone to accept", tone: "wait" },
      ...base,
    ];
  }

  if (phase === "finding_rider") {
    if (!plenti) return base;
    return [
      {
        title: `${MOCK.declinedBy} declined · ${MOCK.declinedReason}`,
        time: "11:11 AM",
        tone: "alert",
      },
      {
        title: `Sent to ${MOCK.ridersPinged} riders within 100 m`,
        time: MOCK.accepted,
        tone: "info",
      },
      {
        title: `Accepted by ${acceptedBy}`,
        time: acceptedAt,
        tone: "ok",
      },
      ...base,
    ];
  }

  if (phase === "rider_assigned") {
    return [
      {
        title: `${rider} arrived at the warehouse`,
        time: MOCK.waitingSince,
        tone: "info",
      },
      {
        title: `${rider} accepted`,
        time: MOCK.riderAssigned,
        tone: "ok",
      },
      {
        title: `Sent to ${MOCK.ridersPinged} riders within 100 m`,
        time: MOCK.accepted,
        tone: "info",
      },
      {
        title: `Accepted by ${acceptedBy}`,
        time: acceptedAt,
        tone: "ok",
      },
      ...base,
    ];
  }

  if (phase === "in_transit") {
    return [
      {
        title: `Picked up with code ${code} · now In Transit`,
        time: transitAt,
        tone: "info",
      },
      {
        title: `${rider} arrived at the warehouse`,
        time: MOCK.arrivedWarehouse,
        tone: "ok",
      },
      {
        title: `${rider} accepted`,
        time: MOCK.riderAssigned,
        tone: "ok",
      },
      {
        title: `Sent to ${MOCK.ridersPinged} riders within 100 m`,
        time: MOCK.accepted,
        tone: "info",
      },
      {
        title: `Accepted by ${acceptedBy}`,
        time: acceptedAt,
        tone: "ok",
      },
      ...base,
    ];
  }

  if (phase === "delivered") {
    return [
      {
        title: `Delivered, received by ${customerName}`,
        time: MOCK.delivered,
        tone: "ok",
      },
      {
        title: `Picked up with code ${code} · now In Transit`,
        time: transitAt,
        tone: "info",
      },
      {
        title: `${rider} arrived at the warehouse`,
        time: MOCK.arrivedWarehouse,
        tone: "ok",
      },
      {
        title: `${rider} accepted`,
        time: MOCK.riderAssigned,
        tone: "ok",
      },
      {
        title: `Sent to ${MOCK.ridersPinged} riders within 100 m`,
        time: MOCK.accepted,
        tone: "info",
      },
      {
        title: `Accepted by ${acceptedBy}`,
        time: acceptedAt,
        tone: "ok",
      },
      ...base,
    ];
  }

  return [
    {
      title: `Refund of ${amountLabel} started`,
      time: refundAt,
      tone: "wait",
    },
    {
      title: "Customer canceled this order by mistake",
      time: clock(order.declined_at) || MOCK.canceled,
      tone: "alert",
    },
    ...base,
  ];
}

export function displayRiderName(order: Order) {
  return riderName(order) || MOCK.riderName;
}

export function displayStatusLabel(order: Order, phase: OrderDetailPhase) {
  const label = statusLabel(order);
  return phaseHeadline(phase, label, order);
}

export function pickupCodeDigits(order: Order) {
  const raw = order.pickup_code || order.delivery_code || "";
  const digits = String(raw).replace(/\D/g, "");
  if (!digits) return isPlentiOrder(order) ? MOCK.pickupCode : "";
  return digits.padStart(4, "0").slice(0, 4);
}
