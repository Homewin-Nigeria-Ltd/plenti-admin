"use client";

import DeclineIncomingOrderModal from "@/components/dashboard/DeclineIncomingOrderModal";
import { buildIncomingDetail } from "@/components/dashboard/incomingOrderView";
import {
  AlertDialog,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { AssignRiderModal } from "@/components/order/AssignRiderModal";
import { DeleteOrderConfirm } from "@/components/order/DeleteOrderConfirm";
import { DeliveryProviderSwitchSelect } from "@/components/order/DeliveryProviderSwitchSelect";
import { KwikPickupWarehouseSelect } from "@/components/order/KwikPickupWarehouseSelect";
import { MarkInTransitModal } from "@/components/order/MarkInTransitModal";
import { ReassignOrderDeliveryModal } from "@/components/order/ReassignOrderDeliveryModal";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  MOCK,
  displayRiderName,
  displayStatusLabel,
  fulfillmentIndexForPhase,
  orderDetailPhase,
  pickupCodeDigits,
  stepTimestamp,
  timelineForPhase,
} from "@/components/order/orderDetailPresentation";
import {
  AVATAR_COLORS,
  ORDER_STATUS_TABS,
  acceptPlentiOrder,
  customerAvatar,
  customerInitial,
  declinePlentiOrder,
  itemProductImage,
  itemProductName,
  orderDayLabel,
  orderTimeLabel,
  isCardPayment,
  isPlentiOrder,
  paymentCardMeta,
  paymentMeta,
  shipsFrom,
  type OrderStatusTab,
} from "@/components/order/orderManagementView";
import {
  ORDERS_API,
  orderStatusUpdatePath,
  plentiDeliveryBroadcastPath,
} from "@/data/orders";
import { formatCurrency } from "@/lib/format";
import { getOrderPermissions } from "@/lib/modulePermissions";
import { cn } from "@/lib/utils";
import { useAccountStore } from "@/store/useAccountStore";
import { useInventoryStore } from "@/store/useInventoryStore";
import { useOrderStore } from "@/store/useOrderStore";
import {
  ADMIN_ORDER_LIFECYCLE_STATUSES,
  type AdminOrderLifecycleStatus,
  type Order,
} from "@/types/OrderTypes";
import { format } from "date-fns";
import {
  Check,
  ChevronLeft,
  ChevronRight,
  Ellipsis,
  Info,
  Loader2,
  MapPin,
  Phone,
  Printer,
  X,
} from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import * as React from "react";
import { toast } from "sonner";
import api from "@/lib/api";

const FULFILLMENT_STEPS = [
  { id: "placed", label: "Placed" },
  { id: "accepted", label: "Accepted" },
  { id: "rider", label: "Rider assigned" },
  { id: "transit", label: "In Transit" },
  { id: "delivered", label: "Delivered" },
] as const;

function asPositiveId(value: unknown): number | null {
  const n = Number(value);
  return Number.isFinite(n) && n > 0 ? n : null;
}

function getOrderPlentiDeliveryId(order: Order | null): number | null {
  if (!order) return null;
  return (
    asPositiveId(order.plenti_delivery_id) ??
    asPositiveId(order.delivery_id) ??
    asPositiveId(order.order_assignment_id) ??
    asPositiveId(order.plenti_delivery?.id) ??
    asPositiveId(order.order_assignment?.delivery_id)
  );
}

function getOrderAssignedRiderId(order: Order | null): number | null {
  if (!order) return null;
  return (
    asPositiveId(order.rider_id) ??
    asPositiveId(order.rider?.id) ??
    asPositiveId(order.plenti_delivery?.rider_id) ??
    asPositiveId(order.order_assignment?.rider_id) ??
    asPositiveId(order.payment_gateway_response?.rider_info?.rider_id)
  );
}

function tabLabel(tab?: string | null) {
  return (
    ORDER_STATUS_TABS.find((item) => item.id === tab)?.label ?? "Orders"
  );
}

function money(value: number | string | null | undefined) {
  const n = Number(value);
  return Number.isFinite(n) ? formatCurrency(n) : "-";
}

function formatProductWeight(raw: number | string | null | undefined) {
  return raw == null || raw === "" ? "-" : `${raw} kg`;
}

function formatElapsed(seconds: number) {
  const mins = Math.floor(seconds / 60);
  const rest = seconds % 60;
  return `${mins}:${String(rest).padStart(2, "0")}`;
}

function timelineDot(tone: string) {
  if (tone === "ok") return "bg-[#12B76A]";
  if (tone === "wait") return "bg-[#F79009]";
  if (tone === "alert") return "bg-[#F04438]";
  if (tone === "info") return "bg-[#2F5BDB]";
  return "bg-[#D0D5DD]";
}

export default function OrderDetailsView({ orderId }: { orderId: string }) {
  const router = useRouter();
  const searchParams = useSearchParams();
  const fromTab = (searchParams.get("from") ?? "pending") as OrderStatusTab;
  const selectedId = Number(orderId);
  const account = useAccountStore((state) => state.account);
  const {
    fetchSingleOrders,
    singleOrder,
    loadingSingle,
    orders,
    incomingOrders,
    fetchOrders,
    lastQuery,
  } = useOrderStore();
  const warehouses = useInventoryStore((state) => state.warehouses);
  const fetchWarehouses = useInventoryStore((state) => state.fetchWarehouses);
  const {
    canViewOrderDetails,
    canMarkOrderInTransit,
    canIssueOrderRefund,
    canAssignOrderRider,
    canDeleteOrder,
  } = React.useMemo(() => getOrderPermissions(account), [account]);

  const [acceptOpen, setAcceptOpen] = React.useState(false);
  const [declineOpen, setDeclineOpen] = React.useState(false);
  const [assignOpen, setAssignOpen] = React.useState(false);
  const [reassignOpen, setReassignOpen] = React.useState(false);
  const [confirmOpen, setConfirmOpen] = React.useState(false);
  const [submitting, setSubmitting] = React.useState(false);
  const [isDeleting, setIsDeleting] = React.useState(false);
  const [isIssuingRefund, setIsIssuingRefund] = React.useState(false);
  const [transitOpen, setTransitOpen] = React.useState(false);
  const [isMarkingInTransit, setIsMarkingInTransit] = React.useState(false);
  const [isBroadcasting, setIsBroadcasting] = React.useState(false);
  const [lifecycleStatusUpdating, setLifecycleStatusUpdating] =
    React.useState<AdminOrderLifecycleStatus | null>(null);
  const [elapsed, setElapsed] = React.useState(42);

  React.useEffect(() => {
    const timer = window.setInterval(() => {
      setElapsed((value) => value + 1);
    }, 1000);
    return () => window.clearInterval(timer);
  }, []);

  React.useEffect(() => {
    fetchWarehouses({ per_page: 100 });
  }, [fetchWarehouses]);

  React.useEffect(() => {
    if (!canViewOrderDetails) return;
    if (!Number.isFinite(selectedId) || selectedId <= 0) return;
    void fetchSingleOrders(selectedId);
  }, [canViewOrderDetails, fetchSingleOrders, selectedId]);

  const siblings = orders.length > 0 ? orders : incomingOrders;
  const currentIndex = siblings.findIndex((order) => order.id === selectedId);
  const nextOrder =
    currentIndex >= 0 ? siblings[currentIndex + 1] : undefined;
  const position = currentIndex >= 0 ? currentIndex + 1 : 1;
  const total = siblings.length || 1;

  React.useEffect(() => {
    const onKey = (event: KeyboardEvent) => {
      if (event.target instanceof HTMLInputElement || event.target instanceof HTMLTextAreaElement) {
        return;
      }
      if (event.key === "j" || event.key === "J") {
        if (nextOrder?.id) router.push(`/order/${nextOrder.id}?from=${fromTab}`);
      }
      if ((event.key === "k" || event.key === "K") && currentIndex > 0) {
        const prev = siblings[currentIndex - 1];
        if (prev?.id) router.push(`/order/${prev.id}?from=${fromTab}`);
      }
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [currentIndex, fromTab, nextOrder?.id, router, siblings]);

  const refresh = async () => {
    if (!Number.isFinite(selectedId)) return;
    await fetchSingleOrders(selectedId, { silent: true });
    await fetchOrders({
      page: lastQuery.page,
      search: lastQuery.search,
      delivery_provider: lastQuery.delivery_provider || undefined,
      status: lastQuery.status,
    });
  };

  const handleAccept = async () => {
    if (!singleOrder) return;
    setSubmitting(true);
    try {
      await acceptPlentiOrder(singleOrder);
      toast.success("Order sent to riders");
      setAcceptOpen(false);
      await refresh();
    } catch (error) {
      toast.error(error instanceof Error ? error.message : "Failed to accept order");
    } finally {
      setSubmitting(false);
    }
  };

  const handleDecline = async (payload: { reason: string; message: string }) => {
    if (!singleOrder) return;
    setSubmitting(true);
    try {
      await declinePlentiOrder(singleOrder, payload);
      toast.success("Order declined");
      setDeclineOpen(false);
      router.push("/order");
    } catch (error) {
      toast.error(error instanceof Error ? error.message : "Failed to decline order");
    } finally {
      setSubmitting(false);
    }
  };

  const setLifecycleOrderStatus = async (status: AdminOrderLifecycleStatus) => {
    if (!canMarkOrderInTransit) {
      toast.error("You do not have permission to update order status");
      return;
    }
    if (!selectedId) return;
    setLifecycleStatusUpdating(status);
    try {
      const { data } = await api.patch<{ status?: string; message?: string }>(
        orderStatusUpdatePath(selectedId),
        { status },
      );
      if (data?.status === "success") {
        toast.success(
          `Order marked as ${status.charAt(0).toUpperCase() + status.slice(1)}`,
        );
        await refresh();
      } else {
        toast.error(data?.message ?? "Failed to update order status");
      }
    } catch {
      toast.error("Failed to update order status");
    } finally {
      setLifecycleStatusUpdating(null);
    }
  };

  const issueRefund = async () => {
    if (!canIssueOrderRefund) {
      toast.error("You do not have permission to issue refunds");
      return;
    }
    if (!selectedId) return;
    setIsIssuingRefund(true);
    try {
      const { data } = await api.post<{ status?: string; message?: string }>(
        `${ORDERS_API.issueRefund}/${selectedId}/issue-refund`,
      );
      if (data?.status === "success") {
        toast.success("Refund issued successfully");
        await refresh();
      } else {
        toast.error(data?.message || "Failed to issue refund");
      }
    } catch {
      toast.error("Failed to issue refund");
    } finally {
      setIsIssuingRefund(false);
    }
  };

  const markAsInTransit = async () => {
    if (!selectedId) return;
    setIsMarkingInTransit(true);
    try {
      const { data } = await api.post<{ status?: string; message?: string }>(
        `${ORDERS_API.markInTransit}/${selectedId}/mark-in-transit`,
      );
      if (data?.status === "success") {
        toast.success("Marked In Transit. The customer got an SMS with the ETA.");
        setTransitOpen(false);
        await refresh();
      } else {
        toast.error(data?.message || "Failed to mark order as in transit");
      }
    } catch {
      toast.error("Failed to mark order as in transit");
    } finally {
      setIsMarkingInTransit(false);
    }
  };

  const broadcastDelivery = async () => {
    if (!singleOrder?.can_broadcast_to_riders) return;
    const deliveryId = getOrderPlentiDeliveryId(singleOrder);
    if (deliveryId == null) {
      toast.error(
        "This order has no Plenti delivery to broadcast. Switch the provider to Plenti first.",
      );
      return;
    }
    setIsBroadcasting(true);
    try {
      const { data } = await api.patch<{ status?: string; message?: string }>(
        plentiDeliveryBroadcastPath(deliveryId),
      );
      if (data?.status === "error" || data?.status === "failed") {
        toast.error(data?.message ?? "Failed to broadcast delivery");
        return;
      }
      toast.success(data?.message ?? "Delivery broadcast to riders");
      await refresh();
    } catch {
      toast.error("Failed to broadcast delivery");
    } finally {
      setIsBroadcasting(false);
    }
  };

  if (!Number.isFinite(selectedId) || selectedId <= 0) {
    return (
      <div className="rounded-xl border border-[#E4E6EB] bg-white p-12 text-center">
        <p className="text-sm text-[#667085]">Order not found.</p>
      </div>
    );
  }

  if (!canViewOrderDetails) {
    return (
      <div className="rounded-xl border border-[#E4E6EB] bg-white p-12 text-center">
        <p className="text-sm text-[#667085]">
          You do not have permission to view order details.
        </p>
      </div>
    );
  }

  if (loadingSingle && !singleOrder) {
    return (
      <div className="flex min-h-[40vh] flex-col items-center justify-center gap-3">
        <Loader2 className="size-8 animate-spin text-[#2F5BDB]" />
        <p className="text-sm text-[#667085]">Loading order details…</p>
      </div>
    );
  }

  if (!singleOrder) {
    return (
      <div className="rounded-xl border border-[#E4E6EB] bg-white p-12 text-center">
        <p className="text-sm text-[#667085]">Order not found.</p>
        <Link href="/order" className="mt-3 inline-block text-sm font-medium text-[#2F5BDB]">
          Back to orders
        </Link>
      </div>
    );
  }

  const order = singleOrder;
  const phase = orderDetailPhase(order);
  const label = displayStatusLabel(order, phase);
  const warehouseName = shipsFrom(order, warehouses);
  const payment = paymentMeta(order);
  const card = paymentCardMeta(order);
  const plenti = isPlentiOrder(order);
  const canAssignRider = Boolean(order.can_assign_rider);
  const paidAt =
    order.payment_time ||
    (order.paid_at && Number.isFinite(new Date(order.paid_at).getTime())
      ? format(new Date(order.paid_at), "h:mm a")
      : orderTimeLabel(order));
  const deliveryPartner =
    order.delivery_provider_label ||
    order.delivery_selection?.provider_label ||
    "Partner delivery";
  const created = new Date(order.created_at);
  const placedToday =
    Number.isFinite(created.getTime()) &&
    format(created, "yyyy-MM-dd") === format(new Date(), "yyyy-MM-dd");
  const placedWhen = placedToday
    ? `today at ${orderTimeLabel(order)}`
    : `${orderDayLabel(order)} at ${orderTimeLabel(order)}`;
  const currentStep = fulfillmentIndexForPhase(phase);
  const items = order.items ?? [];
  const itemCount = items.reduce((sum, item) => sum + Number(item.quantity || 0), 0) || items.length;
  const subtotal = Number(order.subtotal) || 0;
  const deliveryFee = Number(
    order.shipping_fee ??
      order.shippingFee ??
      order.delivery_economics?.customer_delivery_charge ??
      0,
  );
  const rider = displayRiderName(order);
  const name = order.user?.name ?? "Customer";
  const avatar = customerAvatar(order);
  const detail = buildIncomingDetail(order, warehouses, AVATAR_COLORS[0]);
  const riderPhone =
    order.payment_gateway_response?.rider_info?.rider_phone || MOCK.riderPhone;
  const code = pickupCodeDigits(order);
  const timeline = timelineForPhase(
    phase,
    order,
    money(order.total),
    payment.label,
    name,
    rider,
  );
  const chipClass = (value: string) => {
    const text = value.toLowerCase();
    if (text.includes("cancel")) return "bg-[#FEF3F2] text-[#D92D20]";
    if (text.includes("deliver")) return "bg-[#ECFDF3] text-[#027A48]";
    if (text.includes("transit") || text.includes("rider assigned")) {
      return "bg-[#EEF4FF] text-[#2F5BDB]";
    }
    if (text.includes("pending") || text.includes("finding") || text.includes("processing")) {
      return "bg-[#FFF6ED] text-[#F38744]";
    }
    return "bg-[#F2F4F7] text-[#667085]";
  };

  return (
    <div className="min-w-0 space-y-4">
      <div className="flex items-center gap-2 text-[13px] text-[#667085]">
        <Link href="/order" className="hover:text-[#344054]">
          Order Management
        </Link>
        <span className="text-[#D0D5DD]">›</span>
        <span className="font-medium text-[#101828]">{order.order_number}</span>
      </div>

      <div className="flex flex-col gap-3 lg:flex-row lg:items-center lg:justify-between">
        <Link
          href="/order"
          className="inline-flex items-center gap-1 text-[13px] font-medium text-[#344054] hover:text-[#101828]"
        >
          <ChevronLeft className="size-4" />
          Back to {tabLabel(fromTab)}
        </Link>
        <div className="flex flex-wrap items-center gap-2 text-[13px] text-[#667085]">
          <span className="hidden sm:inline text-[#98A2B3]">Press J or K</span>
          <span>
            {position} of {total} in {tabLabel(fromTab)}
          </span>
          {nextOrder ? (
            <Link
              href={`/order/${nextOrder.id}?from=${fromTab}`}
              className="inline-flex items-center gap-1 rounded-lg border border-[#E4E6EB] bg-white px-2.5 py-1.5 text-[13px] text-[#344054] hover:bg-[#F9FAFB]"
            >
              Next: <span className="font-medium text-[#101828]">{nextOrder.order_number}</span>
              <span className="hidden sm:inline text-[#667085]">
                {nextOrder.user?.name}
              </span>
              <ChevronRight className="size-4 text-[#98A2B3]" />
            </Link>
          ) : null}
        </div>
      </div>

      <div className="flex flex-col gap-3 sm:flex-row sm:items-start sm:justify-between">
        <div>
          <div className="flex flex-wrap items-center gap-2">
            <h1 className="text-[24px] font-semibold tracking-tight text-[#101828]">
              Order {order.order_number}
            </h1>
            <span
              className={cn(
                "rounded-md px-2 py-0.5 text-[12px] font-semibold",
                chipClass(label),
              )}
            >
              {label}
            </span>
          </div>
          <p className="mt-1 text-[13px] text-[#667085]">
            Placed {placedWhen} · Plenti app · {warehouseName} warehouse
          </p>
        </div>
        <div className="flex flex-wrap items-center gap-2">
          {phase === "pending" ? (
            <>
              <button
                type="button"
                className="h-9 rounded-lg border border-[#E4E6EB] bg-white px-3.5 text-[13px] font-medium text-[#D92D20] hover:bg-[#FEF3F2]"
                onClick={() => setDeclineOpen(true)}
              >
                Decline
              </button>
              <button
                type="button"
                className="h-9 rounded-lg bg-[#2F5BDB] px-3.5 text-[13px] font-medium text-white hover:bg-[#2F5BDB]/90"
                onClick={() => setAcceptOpen(true)}
              >
                Accept order
              </button>
            </>
          ) : null}
          {phase === "finding_rider" ? (
            <>
              <button
                type="button"
                onClick={() => window.print()}
                className="h-9 inline-flex items-center gap-1.5 rounded-lg border border-[#E4E6EB] bg-white px-3.5 text-[13px] font-medium text-[#344054]"
              >
                <Printer className="size-3.5" />
                Print invoice
              </button>
              {canAssignRider ? (
                <button
                  type="button"
                  className="h-9 rounded-lg bg-[#2F5BDB] px-3.5 text-[13px] font-medium text-white"
                  onClick={() => setAssignOpen(true)}
                >
                  Assign Rider
                </button>
              ) : null}
            </>
          ) : null}
          {phase === "rider_assigned" ? (
            <>
              <button
                type="button"
                className="h-9 rounded-lg border border-[#E4E6EB] bg-white px-3.5 text-[13px] font-medium text-[#344054]"
                onClick={() => setReassignOpen(true)}
              >
                Reassign Rider
              </button>
              <button
                type="button"
                className="h-9 rounded-lg bg-[#2F5BDB] px-3.5 text-[13px] font-medium text-white"
                onClick={() => setTransitOpen(true)}
              >
                Mark In Transit
              </button>
            </>
          ) : null}
          {phase === "in_transit" ? (
            <>
              <button
                type="button"
                onClick={() => window.print()}
                className="h-9 inline-flex items-center gap-1.5 rounded-lg border border-[#E4E6EB] bg-white px-3.5 text-[13px] font-medium text-[#344054]"
              >
                <Printer className="size-3.5" />
                Print invoice
              </button>
              <a
                href={`tel:${riderPhone.replace(/\s/g, "")}`}
                className="h-9 inline-flex items-center gap-1.5 rounded-lg bg-[#2F5BDB] px-3.5 text-[13px] font-medium text-white"
              >
                <Phone className="size-3.5" />
                Call rider
              </a>
            </>
          ) : null}
          {phase === "delivered" ? (
            <>
              <button
                type="button"
                disabled={isIssuingRefund}
                onClick={() => void issueRefund()}
                className="h-9 rounded-lg border border-[#E4E6EB] bg-white px-3.5 text-[13px] font-medium text-[#344054] disabled:opacity-60"
              >
                {isIssuingRefund ? "Requesting…" : "Request refund"}
              </button>
              <button
                type="button"
                onClick={() => window.print()}
                className="h-9 inline-flex items-center gap-1.5 rounded-lg bg-[#2F5BDB] px-3.5 text-[13px] font-medium text-white"
              >
                <Printer className="size-3.5" />
                Print invoice
              </button>
            </>
          ) : null}
          {phase === "canceled" ? (
            <button
              type="button"
              className="h-9 rounded-lg bg-[#D92D20] px-3.5 text-[13px] font-medium text-white"
              onClick={() => setConfirmOpen(true)}
            >
              Delete order
            </button>
          ) : null}
          {canMarkOrderInTransit ||
          canIssueOrderRefund ||
          canAssignOrderRider ||
          canDeleteOrder ? (
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <button
                  type="button"
                  aria-label="More actions"
                  className="inline-flex size-9 items-center justify-center rounded-lg border border-[#E4E6EB] bg-white text-[#344054] hover:bg-[#F9FAFB]"
                >
                  <Ellipsis className="size-4" />
                </button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end" className="min-w-[200px] rounded-xl p-1">
                {canMarkOrderInTransit
                  ? ADMIN_ORDER_LIFECYCLE_STATUSES.map((status) => (
                      <DropdownMenuItem
                        key={status}
                        disabled={lifecycleStatusUpdating !== null}
                        onSelect={() => void setLifecycleOrderStatus(status)}
                      >
                        {lifecycleStatusUpdating === status
                          ? "Updating…"
                          : `Mark as ${status.charAt(0).toUpperCase() + status.slice(1)}`}
                      </DropdownMenuItem>
                    ))
                  : null}
                {canMarkOrderInTransit ? <DropdownMenuSeparator /> : null}
                {canIssueOrderRefund ? (
                  <DropdownMenuItem
                    disabled={isIssuingRefund}
                    onSelect={() => void issueRefund()}
                  >
                    {isIssuingRefund ? "Issuing…" : "Issue refund"}
                  </DropdownMenuItem>
                ) : null}
                {canAssignOrderRider && order.can_assign_rider ? (
                  <DropdownMenuItem onSelect={() => setAssignOpen(true)}>
                    Assign rider
                  </DropdownMenuItem>
                ) : null}
                {canAssignOrderRider ? (
                  <DropdownMenuItem onSelect={() => setReassignOpen(true)}>
                    Reassign rider
                  </DropdownMenuItem>
                ) : null}
                {canDeleteOrder ? (
                  <>
                    <DropdownMenuSeparator />
                    <DropdownMenuItem
                      className="text-[#D92D20]"
                      onSelect={() => setConfirmOpen(true)}
                    >
                      Delete order
                    </DropdownMenuItem>
                  </>
                ) : null}
              </DropdownMenuContent>
            </DropdownMenu>
          ) : null}
        </div>
      </div>

      {phase === "rider_assigned" ? (
        <div className="rounded-xl bg-[#101828] px-4 py-2.5 text-[13px] text-white">
          {rider} is assigned. He has been notified.
        </div>
      ) : null}
      {phase === "in_transit" ? (
        <div className="rounded-xl bg-[#101828] px-4 py-2.5 text-[13px] text-white">
          Marked In Transit. The customer got an SMS with the ETA.
        </div>
      ) : null}

      <div className="overflow-x-auto rounded-2xl border border-[#E4E6EB] bg-white px-4 py-4 sm:px-6">
        <div className="flex min-w-[640px] items-start">
          {(phase === "canceled"
            ? [
                { id: "placed", label: "Placed" },
                { id: "accepted", label: "Accepted" },
                { id: "canceled", label: "Canceled by customer" },
              ]
            : FULFILLMENT_STEPS
          ).map((step, index, list) => {
            const canceledStep = phase === "canceled" && step.id === "canceled";
            const done = canceledStep ? false : index < currentStep;
            const active = canceledStep ? true : index === currentStep;
            const time = canceledStep
              ? MOCK.canceled
              : stepTimestamp(order, index, phase);
            return (
              <div key={step.id} className="flex flex-1 items-start">
                <div className="flex min-w-0 flex-col items-center text-center">
                  <span
                    className={cn(
                      "flex size-7 items-center justify-center rounded-full text-[12px]",
                      canceledStep
                        ? "border border-[#F04438] bg-[#F04438] text-white"
                        : done
                        ? "border border-[#12B76A] bg-[#12B76A] text-white"
                        : active
                          ? "border-2 border-[#2F5BDB] bg-white"
                          : "border border-[#D0D5DD] bg-white",
                    )}
                  >
                    {done ? (
                      <Check className="size-3.5" />
                    ) : canceledStep ? (
                      <X className="size-3.5" />
                    ) : active ? (
                      <span className="size-2 rounded-full bg-[#2F5BDB]" />
                    ) : null}
                  </span>
                  <p
                    className={cn(
                      "mt-2 text-[12px] font-medium",
                      canceledStep
                        ? "text-[#D92D20]"
                        : done || active
                          ? "text-[#101828]"
                          : "text-[#98A2B3]",
                    )}
                  >
                    {step.label}
                  </p>
                  {time ? (
                    <p className="text-[11px] text-[#98A2B3]">{time}</p>
                  ) : null}
                </div>
                {index < list.length - 1 ? (
                  <div
                    className={cn(
                      "mt-3.5 h-px flex-1",
                      list[index + 1]?.id === "canceled"
                        ? "bg-[#F04438]"
                        : index + 1 < currentStep
                          ? "bg-[#12B76A]"
                          : "bg-[#E4E6EB]",
                    )}
                  />
                ) : null}
              </div>
            );
          })}
        </div>
      </div>

      <div className="grid grid-cols-1 gap-4 xl:grid-cols-2">
        <section className="rounded-2xl border border-[#E4E6EB] bg-white p-4 sm:p-5">
          <div className="mb-3 flex items-center justify-between">
            <h2 className="text-sm font-semibold text-[#101828]">Rider</h2>
            {phase !== "canceled" && plenti ? (
              <span className="text-[12px] font-medium text-[#2F5BDB]">How riders are picked</span>
            ) : null}
          </div>
          {phase === "pending" ? (
            <div className="flex items-start gap-2 rounded-xl bg-[#F9FAFB] px-3 py-3 text-[13px] text-[#667085]">
              <Info className="mt-0.5 size-4 shrink-0 text-[#98A2B3]" />
              <p>
                No rider yet. Once you accept, the order goes to free riders within 100 m of{" "}
                {warehouseName} warehouse.
              </p>
            </div>
          ) : null}
          {phase === "finding_rider" && (plenti || canAssignRider) ? (
            <div className="space-y-3">
              <div className="flex items-start justify-between gap-3">
                <div className="flex items-start gap-3">
                  <span className="mt-0.5 size-8 rounded-full bg-[#EEF4FF]" />
                  <div>
                    <p className="text-sm font-semibold text-[#101828]">Finding a rider</p>
                    <p className="text-[12px] text-[#667085]">
                      Sent to {MOCK.ridersPinged} riders within 100 m. {MOCK.ridersCanAccept} can still accept.
                    </p>
                    <p className="mt-1 text-[12px] text-[#98A2B3]">
                      If nobody accepts in 8 minutes you get an alert.
                    </p>
                  </div>
                </div>
                <span className="text-sm font-semibold text-[#2F5BDB]">
                  {formatElapsed(elapsed)}
                </span>
              </div>
              {canAssignRider ? (
                <button
                  type="button"
                  className="text-[12px] font-medium text-[#2F5BDB]"
                  onClick={() => setAssignOpen(true)}
                >
                  Assign rider yourself
                </button>
              ) : null}
            </div>
          ) : null}
          {phase === "finding_rider" && !plenti && !canAssignRider ? (
            <div className="flex items-start gap-2 rounded-xl bg-[#F9FAFB] px-3 py-3 text-[13px] text-[#667085]">
              <Info className="mt-0.5 size-4 shrink-0 text-[#98A2B3]" />
              <div>
                <p className="font-medium text-[#101828]">{deliveryPartner}</p>
                <p>
                  {order.delivery_type_label || "Normal"} delivery. No Plenti rider
                  to assign.
                </p>
              </div>
            </div>
          ) : null}
          {phase === "rider_assigned" || phase === "in_transit" || phase === "delivered" ? (
            <div className="space-y-3">
              <div className="flex items-start justify-between gap-3">
                <div className="flex items-start gap-3">
                  <Avatar className="size-10">
                    <AvatarFallback className="bg-[#FEF3C7] text-sm font-semibold text-[#B54708]">
                      {rider.slice(0, 1)}
                    </AvatarFallback>
                  </Avatar>
                  <div>
                    <p className="text-sm font-semibold text-[#101828]">{rider}</p>
                    <p className="text-[12px] text-[#667085]">
                      {MOCK.vehicle} · {MOCK.plate} · rated {MOCK.rating}
                      {phase === "rider_assigned" ? ` · ${MOCK.trips}` : ""}
                    </p>
                  </div>
                </div>
                <a
                  href={`tel:${riderPhone.replace(/\s/g, "")}`}
                  className="inline-flex items-center gap-1 text-[12px] font-medium text-[#2F5BDB]"
                >
                  <Phone className="size-3.5" />
                  Call
                </a>
              </div>
              <div className="grid grid-cols-3 gap-2 text-[12px]">
                <div>
                  <p className="text-[#98A2B3]">Where</p>
                  <p className="font-medium text-[#101828]">
                    {phase === "delivered"
                      ? "Delivered"
                      : phase === "in_transit"
                        ? "On the way"
                        : "At the warehouse"}
                  </p>
                </div>
                <div>
                  <p className="text-[#98A2B3]">
                    {phase === "delivered" ? "Trip time" : phase === "in_transit" ? "ETA" : "Waiting"}
                  </p>
                  <p className="font-medium text-[#101828]">
                    {phase === "delivered"
                      ? MOCK.tripTime
                      : phase === "in_transit"
                        ? `${MOCK.inTransit} · ${MOCK.distanceLeft}`
                        : `since ${MOCK.waitingSince}`}
                  </p>
                </div>
                <div>
                  <p className="text-[#98A2B3]">Pickup code</p>
                  <p className="font-semibold tracking-[0.2em] text-[#101828]">
                    {code.split("").join(" ")}
                  </p>
                </div>
              </div>
              {phase === "in_transit" ? (
                <div className="relative h-28 overflow-hidden rounded-xl bg-[#E8F0E6]">
                  <div className="absolute inset-0 opacity-40 [background-image:linear-gradient(#c5d5c4_1px,transparent_1px),linear-gradient(90deg,#c5d5c4_1px,transparent_1px)] [background-size:18px_18px]" />
                  <MapPin className="absolute left-8 top-8 size-5 text-[#12B76A]" />
                  <MapPin className="absolute right-10 top-12 size-5 text-[#2F5BDB]" />
                  <span className="absolute bottom-2 left-3 rounded-md bg-white/90 px-2 py-0.5 text-[11px] text-[#344054]">
                    {MOCK.inTransit} · {MOCK.distanceLeft}
                  </span>
                </div>
              ) : null}
              {phase === "delivered" ? (
                <div className="rounded-xl bg-[#ECFDF3] px-3 py-2.5 text-[12px] text-[#027A48]">
                  Delivered at {MOCK.delivered}. Received by {name} · code confirmed · photo taken by rider.
                </div>
              ) : null}
            </div>
          ) : null}
          {phase === "canceled" ? (
            <p className="text-[13px] text-[#667085]">
              Broadcast stopped when the customer canceled at {MOCK.canceled}. No rider was assigned.
            </p>
          ) : null}
        </section>

        <section className="rounded-2xl border border-[#E4E6EB] bg-white p-4 sm:p-5">
          <h2 className="mb-3 text-sm font-semibold text-[#101828]">Customer</h2>
          <div className="flex items-start gap-3">
            <Avatar className="size-10">
              {avatar ? <AvatarImage src={avatar} alt={name} /> : null}
              <AvatarFallback
                className="text-sm font-medium text-white"
                style={{ backgroundColor: AVATAR_COLORS[0] }}
              >
                {customerInitial(name)}
              </AvatarFallback>
            </Avatar>
            <div className="min-w-0">
              <p className="text-sm font-semibold text-[#101828]">{name}</p>
              <p className="text-[12px] text-[#667085]">
                {detail.phone}
                {detail.orderCountLabel ? ` · ${detail.orderCountLabel}` : ""}
              </p>
              {order.user?.email ? (
                <p className="text-[12px] text-[#667085]">{order.user.email}</p>
              ) : null}
              <p className="mt-2 text-[11px] font-medium uppercase tracking-wide text-[#98A2B3]">
                Delivery address
              </p>
              <p className="text-[13px] text-[#344054]">{detail.address}</p>
              {detail.distanceLabel ? (
                <p className="text-[12px] text-[#667085]">{detail.distanceLabel}</p>
              ) : null}
              {order.shipping_details || order.shippingDetails || order.delivery_tracking ? (
                <>
                  <p className="mt-2 text-[11px] font-medium uppercase tracking-wide text-[#98A2B3]">
                    Shipping details
                  </p>
                  <p className="text-[13px] text-[#344054]">
                    {order.shipping_details ||
                      order.shippingDetails ||
                      order.delivery_tracking}
                  </p>
                </>
              ) : null}
            </div>
          </div>
        </section>
      </div>

      <section className="rounded-2xl border border-[#E4E6EB] bg-white p-4 sm:p-5">
        <h2 className="mb-3 text-sm font-semibold text-[#101828]">Delivery</h2>
        <dl className="mb-4 grid grid-cols-1 gap-3 text-[13px] sm:grid-cols-2 lg:grid-cols-4">
          <div>
            <dt className="text-[#98A2B3]">Delivery type</dt>
            <dd className="mt-0.5 text-[#101828]">
              {order.delivery_type_label ||
                order.delivery_selection?.type_label ||
                order.delivery_type ||
                order.delivery_selection?.type ||
                "-"}
            </dd>
          </div>
          <div>
            <dt className="text-[#98A2B3]">Delivery fee</dt>
            <dd className="mt-0.5 text-[#101828]">
              {order.delivery_economics?.customer_delivery_charge != null
                ? money(order.delivery_economics.customer_delivery_charge)
                : deliveryFee > 0
                  ? money(deliveryFee)
                  : "-"}
            </dd>
          </div>
          <div>
            <dt className="text-[#98A2B3]">Kwik delivery fee</dt>
            <dd className="mt-0.5 text-[#101828]">
              {order.delivery_pricing_snapshot?.kwik_provider_cost != null
                ? money(order.delivery_pricing_snapshot.kwik_provider_cost)
                : "-"}
            </dd>
          </div>
          <div>
            <dt className="text-[#98A2B3]">Plenti profit</dt>
            <dd className="mt-0.5 text-[#101828]">
              {order.delivery_economics?.delivery_margin != null
                ? money(order.delivery_economics.delivery_margin)
                : "-"}
            </dd>
          </div>
        </dl>
        <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
          <DeliveryProviderSwitchSelect
            orderId={selectedId}
            order={order}
            onUpdated={async () => {
              await refresh();
            }}
          />
          <KwikPickupWarehouseSelect
            orderId={selectedId}
            order={order}
            onUpdated={async () => {
              await refresh();
            }}
          />
        </div>
        {order.can_broadcast_to_riders ? (
          <button
            type="button"
            disabled={isBroadcasting}
            onClick={() => void broadcastDelivery()}
            className="mt-4 h-10 w-full rounded-lg bg-[#2F5BDB] text-[13px] font-medium text-white hover:bg-[#2F5BDB]/90 disabled:opacity-60 sm:w-auto sm:px-4"
          >
            {isBroadcasting ? "Broadcasting…" : "Broadcast to riders"}
          </button>
        ) : null}
      </section>

      <div className="grid grid-cols-1 gap-4 xl:grid-cols-[minmax(0,1.4fr)_minmax(0,1fr)]">
        <section className="rounded-2xl border border-[#E4E6EB] bg-white p-4 sm:p-5">
          <div className="mb-3 flex items-center justify-between gap-3">
            <h2 className="text-sm font-semibold text-[#101828]">Items</h2>
            <p className="text-[12px] text-[#667085]">
              {itemCount} item{itemCount === 1 ? "" : "s"} · from {warehouseName}
            </p>
          </div>
          <div className="divide-y divide-[#E4E6EB]">
            {items.length > 0 ? (
              items.map((item) => (
                <div key={item.id} className="flex items-center gap-3 py-3">
                  <div className="size-12 shrink-0 overflow-hidden rounded-xl bg-[#F2F4F7]">
                    {itemProductImage(item) ? (
                      <Image
                        src={itemProductImage(item) || ""}
                        alt={itemProductName(item)}
                        width={48}
                        height={48}
                        className="size-12 object-cover"
                        unoptimized
                      />
                    ) : null}
                  </div>
                  <div className="min-w-0 flex-1">
                    <p className="truncate text-sm font-medium text-[#101828]">
                      {itemProductName(item)}
                    </p>
                    <p className="truncate text-[12px] text-[#98A2B3]">
                      {item.product?.description || "-"}
                    </p>
                    <p className="text-[12px] text-[#98A2B3]">
                      Weight: {formatProductWeight(item.product?.weight ?? item.weight)}
                    </p>
                  </div>
                  <p className="shrink-0 text-[12px] text-[#667085]">
                    {money(item.price)} × {item.quantity}
                  </p>
                  <p className="w-24 shrink-0 text-right text-sm font-semibold text-[#101828]">
                    {money(Number(item.price) * Number(item.quantity || 1))}
                  </p>
                </div>
              ))
            ) : (
              <p className="py-6 text-sm text-[#667085]">No items on this order.</p>
            )}
          </div>
          <div className="mt-3 space-y-1.5 border-t border-[#E4E6EB] pt-3 text-[13px]">
            <div className="flex justify-between text-[#667085]">
              <span>Subtotal</span>
              <span>{money(subtotal)}</span>
            </div>
            {Number(order.discount) > 0 ? (
              <div className="flex justify-between text-[#667085]">
                <span>Discount</span>
                <span>−{money(order.discount)}</span>
              </div>
            ) : null}
            {Number(order.tax) > 0 ? (
              <div className="flex justify-between text-[#667085]">
                <span>Tax</span>
                <span>{money(order.tax)}</span>
              </div>
            ) : null}
            <div className="flex justify-between text-[#667085]">
              <span>Delivery</span>
              <span>
                {deliveryFee > 0 ? money(deliveryFee) : "Free over ₦100,000"}
              </span>
            </div>
            <div className="flex justify-between text-[#667085]">
              <span>Total weight</span>
              <span>{formatProductWeight(order.total_weight)}</span>
            </div>
            <div className="flex justify-between pt-1 text-sm font-semibold text-[#101828]">
              <span>Total</span>
              <span>{money(order.total)}</span>
            </div>
          </div>
        </section>

        <div className="space-y-4">
          <section className="rounded-2xl border border-[#E4E6EB] bg-white p-4 sm:p-5">
            <h2 className="mb-3 text-sm font-semibold text-[#101828]">Payment Details</h2>
            <dl className="space-y-2 text-[13px]">
              <div className="flex justify-between gap-3">
                <dt className="text-[#667085]">Method</dt>
                <dd className="text-[#101828]">
                  {isCardPayment(payment.key)
                    ? `${payment.label} · ${card.brand || MOCK.cardBrand} ••••${card.last4 || MOCK.last4}`
                    : payment.label}
                </dd>
              </div>
              <div className="flex justify-between gap-3">
                <dt className="text-[#667085]">Status</dt>
                <dd
                  className={
                    phase === "canceled"
                      ? "font-medium text-[#F79009]"
                      : payment.paid
                        ? "font-medium text-[#027A48]"
                        : "text-[#F79009]"
                  }
                >
                  {phase === "canceled" ? "Refund in progress" : payment.paid ? "Paid" : payment.label}
                </dd>
              </div>
              <div className="flex justify-between gap-3">
                <dt className="text-[#667085]">Amount</dt>
                <dd className="font-semibold text-[#101828]">{money(order.total)}</dd>
              </div>
              <div className="flex justify-between gap-3">
                <dt className="text-[#667085]">Reference</dt>
                <dd className="truncate text-[#101828]">{order.payment_reference || "-"}</dd>
              </div>
              <div className="flex justify-between gap-3">
                <dt className="text-[#667085]">Paid at</dt>
                <dd className="text-[#101828]">{paidAt}</dd>
              </div>
              {order.payment_status ? (
                <div className="flex justify-between gap-3">
                  <dt className="text-[#667085]">Payment status</dt>
                  <dd className="capitalize text-[#101828]">{order.payment_status}</dd>
                </div>
              ) : null}
            </dl>
            {phase === "canceled" ? (
              <p className="mt-3 text-[12px] text-[#667085]">
                Full refund of {money(order.total)} started at {MOCK.refund}. Track it in Finance.
              </p>
            ) : null}
          </section>

          <section className="rounded-2xl border border-[#E4E6EB] bg-white p-4 sm:p-5">
            <h2 className="mb-3 text-sm font-semibold text-[#101828]">Order Timeline</h2>
            <ol className="space-y-3">
              {timeline.map((event) => (
                <li key={`${event.title}-${event.time ?? ""}`} className="flex gap-2 text-[13px]">
                  <span className={cn("mt-1.5 size-2 shrink-0 rounded-full", timelineDot(event.tone))} />
                  <div>
                    <p className="text-[#344054]">{event.title}</p>
                    {event.time ? (
                      <p className="text-[12px] text-[#98A2B3]">{event.time}</p>
                    ) : null}
                  </div>
                </li>
              ))}
            </ol>
          </section>
        </div>
      </div>

      <AlertDialog
        open={acceptOpen}
        onOpenChange={(open) => {
          if (!submitting) setAcceptOpen(open);
        }}
      >
        <AlertDialogContent className="rounded-xl border-0 p-6 sm:max-w-md">
          <AlertDialogHeader>
            <AlertDialogTitle className="text-[18px] font-semibold text-[#101828]">
              Accept this order?
            </AlertDialogTitle>
            <AlertDialogDescription className="text-sm text-[#667085]">
              This sends the order to riders near {warehouseName} warehouse.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter className="flex flex-row gap-3 sm:justify-end">
            <AlertDialogCancel
              disabled={submitting}
              className="h-9 rounded-lg border border-[#EAECF0] bg-white text-[13px] font-medium text-[#344054]"
            >
              Cancel
            </AlertDialogCancel>
            <button
              type="button"
              disabled={submitting}
              onClick={() => void handleAccept()}
              className="h-9 rounded-lg bg-[#2F5BDB] px-3.5 text-[13px] font-medium text-white hover:bg-[#2F5BDB]/90 disabled:opacity-60"
            >
              {submitting ? "Accepting…" : "Accept order"}
            </button>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>

      <DeclineIncomingOrderModal
        open={declineOpen}
        detail={detail}
        submitting={submitting}
        onClose={() => setDeclineOpen(false)}
        onBack={() => setDeclineOpen(false)}
        onConfirm={(payload) => void handleDecline(payload)}
      />
      <AssignRiderModal
        isOpen={assignOpen}
        onClose={() => setAssignOpen(false)}
      />
      <ReassignOrderDeliveryModal
        isOpen={reassignOpen}
        onClose={() => setReassignOpen(false)}
        deliveryId={getOrderPlentiDeliveryId(order)}
        orderNumber={order.order_number}
        currentRiderId={getOrderAssignedRiderId(order)}
        currentRiderName={rider}
        warehouseName={warehouseName}
        onSuccess={async () => {
          await refresh();
        }}
      />
      <MarkInTransitModal
        open={transitOpen}
        order={order}
        riderName={rider}
        submitting={isMarkingInTransit}
        onOpenChange={setTransitOpen}
        onConfirm={() => void markAsInTransit()}
      />
      {canDeleteOrder || phase === "canceled" ? (
        <DeleteOrderConfirm
          open={confirmOpen}
          onOpenChange={(open) => {
            if (!isDeleting) setConfirmOpen(open);
          }}
          isDeleting={isDeleting}
          orderNumber={order.order_number}
          refundLabel={money(order.total)}
          onConfirm={async () => {
            setIsDeleting(true);
            try {
              const res = await fetch(
                `/api/proxy${ORDERS_API.deleteOrder}/${selectedId}`,
                { method: "DELETE", credentials: "include" },
              );
              const data = (await res.json().catch(() => ({}))) as {
                status?: string;
                message?: string;
              };
              const ok =
                res.ok && data?.status !== "error" && data?.status !== "failed";
              if (!ok) throw new Error(data?.message ?? "Failed to delete order");
              toast.success("Order has been cancelled");
              router.push("/order");
            } catch (error) {
              toast.error(
                error instanceof Error ? error.message : "Failed to delete order",
              );
            } finally {
              setIsDeleting(false);
            }
          }}
        />
      ) : null}
    </div>
  );
}
