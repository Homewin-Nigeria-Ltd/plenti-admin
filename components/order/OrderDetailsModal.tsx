"use client";

import dynamic from "next/dynamic";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Ellipsis, Loader2, X } from "lucide-react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import * as React from "react";
import { toast } from "sonner";
import { useOrderStore } from "@/store/useOrderStore";
import { ORDERS_API, orderStatusUpdatePath } from "@/data/orders";
import {
  ADMIN_ORDER_LIFECYCLE_STATUSES,
  type AdminOrderLifecycleStatus,
} from "@/types/OrderTypes";
import Image from "next/image";
import api from "@/lib/api";
import { getOrderPermissions } from "@/lib/modulePermissions";
import { useAccountStore } from "@/store/useAccountStore";
import { cn } from "@/lib/utils";

const AssignRiderModal = dynamic(
  () => import("./AssignRiderModal").then((mod) => mod.AssignRiderModal),
  {
    ssr: false,
  },
);

const DeleteOrderConfirm = dynamic(
  () => import("./DeleteOrderConfirm").then((mod) => mod.DeleteOrderConfirm),
  {
    ssr: false,
  },
);

const formatCurrency = (n: number) =>
  new Intl.NumberFormat("en-NG", {
    style: "currency",
    currency: "NGN",
    minimumFractionDigits: 2,
  }).format(n);

function formatOrderStatusLabel(raw: string | undefined | null) {
  if (raw == null || String(raw).trim() === "") return "—";
  return String(raw)
    .replace(/_/g, " ")
    .trim()
    .replace(/\b\w/g, (c) => c.toUpperCase());
}

function normalizeOrderStatusKey(statusRaw: string | undefined | null): string {
  return (statusRaw ?? "")
    .toLowerCase()
    .replace(/_/g, " ")
    .replace(/-/g, " ")
    .replace(/\s+/g, " ")
    .trim();
}

function orderStatusChipClass(statusRaw: string | undefined | null) {
  const s = normalizeOrderStatusKey(statusRaw);
  const colorMap: Record<string, string> = {
    successful: "bg-green-100 text-green-700",
    pending: "bg-gray-100 text-gray-700",
    processing: "bg-orange-100 text-orange-700",
    packed: "bg-sky-100 text-sky-800",
    shipped: "bg-indigo-100 text-indigo-800",
    "in transit": "bg-indigo-100 text-indigo-800",
    delivered: "bg-green-100 text-green-800",
    cancelled: "bg-red-100 text-red-700",
  };
  return colorMap[s] || "bg-gray-100 text-gray-700";
}

function orderStatusDotClass(statusRaw: string | undefined | null) {
  const s = normalizeOrderStatusKey(statusRaw);
  if (s === "successful" || s === "delivered") return "bg-green-600";
  if (s === "cancelled") return "bg-red-600";
  if (s === "packed") return "bg-sky-600";
  if (s === "shipped" || s === "in transit") return "bg-indigo-600";
  if (s === "processing") return "bg-orange-600";
  return "bg-gray-500";
}

const LIFECYCLE_MENU_ITEM_CLASS: Record<AdminOrderLifecycleStatus, string> = {
  // pending:
  //   "text-gray-700 data-highlighted:bg-gray-100 data-highlighted:text-gray-900 focus:bg-gray-100 focus:text-gray-900",
  // processing:
  //   "text-orange-700 data-highlighted:bg-orange-50 data-highlighted:text-orange-900 focus:bg-orange-50 focus:text-orange-900",
  packed:
    "text-sky-800 data-highlighted:bg-sky-50 data-highlighted:text-sky-950 focus:bg-sky-50 focus:text-sky-950",
  shipped:
    "text-indigo-800 data-highlighted:bg-indigo-50 data-highlighted:text-indigo-950 focus:bg-indigo-50 focus:text-indigo-950",
  delivered:
    "text-green-800 data-highlighted:bg-green-50 data-highlighted:text-green-950 focus:bg-green-50 focus:text-green-950",
  cancelled:
    "text-red-700 data-highlighted:bg-red-50 data-highlighted:text-red-900 focus:bg-red-50 focus:text-red-900",
};

function lifecycleMenuItemClass(status: AdminOrderLifecycleStatus) {
  return cn(
    "text-[14px] font-medium place-self-center",
    LIFECYCLE_MENU_ITEM_CLASS[status],
  );
}

/** Same palette as shipped / in-transit order status chip */
function inTransitMenuItemClass() {
  return cn(
    "text-[14px] font-medium place-self-center",
    LIFECYCLE_MENU_ITEM_CLASS.shipped,
  );
}

export function OrderDetailsModal({
  isOpen,
  onClose,
  selectedId,
}: {
  isOpen: boolean;
  onClose: () => void;
  selectedId: number | null;
}) {
  const account = useAccountStore((state) => state.account);
  const {
    fetchSingleOrders,
    singleOrder,
    loadingSingle,
    fetchOrders,
    lastQuery,
  } = useOrderStore();
  const [assignOpen, setAssignOpen] = React.useState(false);
  const [confirmOpen, setConfirmOpen] = React.useState(false);
  const [isDeleting, setIsDeleting] = React.useState(false);
  const [isMarkingInTransit, setIsMarkingInTransit] = React.useState(false);
  const [isIssuingRefund, setIsIssuingRefund] = React.useState(false);
  const [lifecycleStatusUpdating, setLifecycleStatusUpdating] =
    React.useState<AdminOrderLifecycleStatus | null>(null);
  const {
    canViewOrderDetails,
    canMarkOrderInTransit,
    canIssueOrderRefund,
    canAssignOrderRider,
    canDeleteOrder,
  } = React.useMemo(() => getOrderPermissions(account), [account]);

  const canShowActionMenu =
    canMarkOrderInTransit ||
    canIssueOrderRefund ||
    canAssignOrderRider ||
    canDeleteOrder;

  React.useEffect(() => {
    if (!canViewOrderDetails) return;
    if (!selectedId) return;
    fetchSingleOrders(selectedId);
  }, [fetchSingleOrders, selectedId, canViewOrderDetails]);

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
        await fetchSingleOrders(selectedId, { silent: true });
        await fetchOrders({
          page: lastQuery.page,
          search: lastQuery.search,
        });
      } else {
        toast.error(data?.message ?? "Failed to update order status");
      }
    } catch (error) {
      console.error("Error updating order status =>", error);
      toast.error("Failed to update order status");
    } finally {
      setLifecycleStatusUpdating(null);
    }
  };

  const markAsInTransit = async () => {
    if (!canMarkOrderInTransit) {
      toast.error("You do not have permission to update order status");
      return;
    }
    if (!selectedId) return;
    setIsMarkingInTransit(true);
    try {
      const { data } = await api.post<{ status?: string; message?: string }>(
        `${ORDERS_API.markInTransit}/${selectedId}/mark-in-transit`,
      );

      if (data?.status === "success") {
        toast.success("Order marked as in transit");
        await fetchSingleOrders(selectedId, { silent: true });
      } else {
        toast.error(data?.message || "Failed to mark order as in transit");
      }
    } catch (error) {
      console.error("Error marking order as in transit =>", error);
      toast.error("Failed to mark order as in transit");
    } finally {
      setIsMarkingInTransit(false);
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
        await fetchSingleOrders(selectedId, { silent: true });
      } else {
        toast.error(data?.message || "Failed to issue refund");
      }
    } catch (error) {
      console.error("Error issuing refund =>", error);
      toast.error("Failed to issue refund");
    } finally {
      setIsIssuingRefund(false);
    }
  };

  const items = singleOrder?.items ?? [];

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent
        className="max-h-[90vh] flex flex-col p-0 w-[95vw] max-w-[750px] sm:w-[750px] sm:max-w-[750px]"
        showCloseButton={false}
      >
        {loadingSingle ? (
          <>
            <DialogTitle className="sr-only">Loading order details</DialogTitle>
            <div className="flex flex-col items-center justify-center min-h-[280px] gap-3 px-6 py-12">
              <Loader2 className="size-10 animate-spin text-[#0B1E66]" />
              <p className="text-sm text-[#667085]">Loading order details…</p>
            </div>
          </>
        ) : (
          <>
            <DialogHeader className="relative px-6 pt-6 pb-4 border-b border-neutral-100 shrink-0">
              <DialogTitle className="font-medium text-[24px]">
                Order Details – {singleOrder?.order_number ?? selectedId ?? "—"}
              </DialogTitle>
              <DialogDescription className="text-[#808080] text-[14px] font-normal">
                Complete order information and actions
              </DialogDescription>
              {singleOrder && (
                  <div className="mt-3 flex flex-wrap items-center gap-2 pr-20">
                    <span className="text-sm font-medium text-[#101928]">
                      Order status
                    </span>
                    <span
                      className={`inline-flex items-center gap-2 rounded-full px-3 py-1 text-sm font-medium ${orderStatusChipClass(
                        String(singleOrder.status),
                      )}`}
                    >
                      <span
                        className={`size-2 shrink-0 rounded-full ${orderStatusDotClass(
                          String(singleOrder.status),
                        )}`}
                      />
                      {formatOrderStatusLabel(String(singleOrder.status))}
                    </span>
                  </div>
                )}

              <div className="flex items-center gap-2 absolute top-6 right-6">
                {canShowActionMenu && (
                  <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                      <button
                        type="button"
                        aria-label="More actions"
                        className="border-[0.2px] border-[#98A2B3] rounded-lg size-6 flex items-center justify-center cursor-pointer"
                      >
                        <Ellipsis color="#0B1E66" size={18} />
                      </button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent className="border-0 rounded-2xl p-2 min-w-[220px]">
                      {canMarkOrderInTransit &&
                        ADMIN_ORDER_LIFECYCLE_STATUSES.map((status) => (
                          <DropdownMenuItem
                            key={status}
                            className={lifecycleMenuItemClass(status)}
                            onSelect={() => {
                              void setLifecycleOrderStatus(status);
                            }}
                            disabled={lifecycleStatusUpdating !== null}
                          >
                            {lifecycleStatusUpdating === status
                              ? "Updating…"
                              : `Mark as ${status.charAt(0).toUpperCase() + status.slice(1)}`}
                          </DropdownMenuItem>
                        ))}
                      {canMarkOrderInTransit && (
                        <DropdownMenuSeparator />
                      )}
                      {/* Mark as in transit — hidden from menu
                      {canMarkOrderInTransit && (
                        <>
                          <DropdownMenuItem
                            className={inTransitMenuItemClass()}
                            onSelect={markAsInTransit}
                            disabled={isMarkingInTransit}
                          >
                            {isMarkingInTransit
                              ? "Marking..."
                              : "Mark As In Transit"}
                          </DropdownMenuItem>
                          <DropdownMenuSeparator />
                        </>
                      )}
                      */}

                      {canIssueOrderRefund && (
                        <>
                          <DropdownMenuItem
                            className="text-[#667085] text-[14px] place-self-center"
                            onSelect={issueRefund}
                            disabled={isIssuingRefund}
                          >
                            {isIssuingRefund ? "Issuing..." : "Issue Refund"}
                          </DropdownMenuItem>
                          <DropdownMenuSeparator />
                        </>
                      )}

                      {canAssignOrderRider && (
                        <>
                          <DropdownMenuItem
                            className="text-[#D69200] text-[14px] place-self-center"
                            onSelect={() => setAssignOpen(true)}
                          >
                            Assign Rider
                          </DropdownMenuItem>
                          <DropdownMenuSeparator />
                        </>
                      )}

                      {canDeleteOrder && (
                        <DropdownMenuItem
                          variant="destructive"
                          className="text-[#D42620] text-[14px] place-self-center"
                          onSelect={() => setConfirmOpen(true)}
                        >
                          Delete Order
                        </DropdownMenuItem>
                      )}
                    </DropdownMenuContent>
                  </DropdownMenu>
                )}

                {/* Close Button  */}
                <button
                  type="button"
                  onClick={onClose}
                  aria-label="Close dialog"
                  className="flex items-center justify-center size-[30px] bg-[#E8EEFF] rounded-full"
                >
                  <X color="#0B1E66" size={20} cursor="pointer" />
                </button>
              </div>
            </DialogHeader>

            <div className="flex-1 overflow-y-auto px-6 pb-6">
              {!canViewOrderDetails ? (
                <div className="rounded-xl border border-[#EAECF0] bg-[#F9FAFB] p-12 text-center mt-4">
                  <p className="text-sm text-[#667085]">
                    You do not have permission to view order details.
                  </p>
                </div>
              ) : (
                <div className="space-y-6">
                  {items.length > 0 ? (
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      {items.map((item) => (
                        <div key={item.id} className="flex items-center gap-4">
                          <div className="size-16 shrink-0 rounded-md bg-[#E8EEFF80] border-[0.5px] border-[#D0D5DD] overflow-hidden">
                            {item.product?.image_url ? (
                              <Image
                                src={item.product.image_url}
                                alt={item.product_name}
                                width={64}
                                height={64}
                                className="size-full object-cover"
                              />
                            ) : (
                              <div className="size-full bg-[#E8EEFF80]" />
                            )}
                          </div>
                          <div className="min-w-0">
                            <p className="font-medium text-[16px] text-[#1A1A1A]">
                              {item.product_name ?? "—"}
                            </p>
                            <p className="text-xs text-[#9B9B9B] truncate">
                              {item.product?.description ?? "—"}
                            </p>
                            <div className="flex items-center mt-2 gap-6 text-sm">
                              <span>
                                Price:{" "}
                                <span className="font-medium">
                                  {item.price != null
                                    ? formatCurrency(Number(item.price) || 0)
                                    : "—"}
                                </span>
                              </span>
                              <span className="text-[#9B9B9B]">
                                QTY:{" "}
                                <span className="text-black">
                                  {item.quantity ?? "—"}
                                </span>
                              </span>
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>
                  ) : (
                    <div className="rounded-xl border border-[#EEF1F6] bg-[#F9FAFB] p-6">
                      <p className="text-[#1F3A78] font-semibold">
                        Order Items
                      </p>
                      <p className="text-[#667085] text-sm mt-1">—</p>
                    </div>
                  )}

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div className="rounded-xl border border-[#EEF1F6] bg-[#F9FAFB] p-6 space-y-4">
                      <p className="text-[#1F3A78] font-semibold">
                        Payment Details
                      </p>
                      <div className="space-y-1">
                        <p className="text-[#101928] font-medium">
                          Payment Method
                        </p>
                        <p className="text-[#667085] text-sm">
                          {singleOrder?.payment_method ?? "—"}
                        </p>
                      </div>
                      <div className="space-y-1 mt-5">
                        <p className="text-[#101928] font-medium">
                          Payment Status
                        </p>
                        <span
                          className={`inline-flex items-center gap-2 rounded-full px-3 py-1 text-sm ${
                            (
                              singleOrder?.payment_status ?? ""
                            ).toLowerCase() === "paid"
                              ? "bg-green-100 text-green-700"
                              : "bg-amber-100 text-amber-700"
                          }`}
                        >
                          <span
                            className={`size-2 rounded-full ${
                              (
                                singleOrder?.payment_status ?? ""
                              ).toLowerCase() === "paid"
                                ? "bg-green-600"
                                : "bg-amber-600"
                            }`}
                          />
                          {singleOrder?.payment_status ?? "—"}
                        </span>
                      </div>
                      <div className="space-y-1">
                        <p className="text-[#101928] text-[16px] font-medium">
                          Transaction Reference
                        </p>
                        <p className="text-[#98A2B3] text-sm">
                          {singleOrder?.payment_reference ?? "—"}
                        </p>
                      </div>
                    </div>

                    <div className="rounded-xl border border-[#EEF1F6] bg-[#F9FAFB] p-6 space-y-4">
                      <p className="text-[#1F3A78] font-semibold">
                        Shipping Details
                      </p>
                      <div className="space-y-1">
                        <p className="text-[#101928] font-medium">
                          Shipping Address
                        </p>
                        <p className="text-[#667085] text-sm">
                          {singleOrder?.shipping_address ?? "—"}
                        </p>
                      </div>
                      <div className="space-y-1">
                        <p className="text-[#101928] font-medium">
                          Shipping Details
                        </p>
                        <p className="text-[#98A2B3] text-sm">
                          {singleOrder?.shipping_details ??
                            singleOrder?.shippingDetails ??
                            singleOrder?.delivery_tracking ??
                            "—"}
                        </p>
                      </div>
                      <div className="space-y-1">
                        <p className="text-[#101928] font-medium">
                          Shipping Fee
                        </p>
                        <p className="text-[#98A2B3] text-sm">
                          {(() => {
                            const fee =
                              singleOrder?.shipping_fee ??
                              singleOrder?.shippingFee;
                            return fee != null && !Number.isNaN(Number(fee))
                              ? formatCurrency(Number(fee))
                              : "—";
                          })()}
                        </p>
                      </div>
                      <div className="space-y-1">
                        <p className="text-[#101928] font-medium">Phone</p>
                        <p className="text-[#98A2B3] text-sm">
                          {singleOrder?.phone_number ?? "—"}
                        </p>
                      </div>
                    </div>
                  </div>

                  <div className="border-t border-dashed border-[#EAECF0] pt-6 flex items-center justify-between">
                    <p className="text-[#667085]">Amount Total</p>
                    <p className="text-[#101928] font-semibold">
                      {singleOrder?.total != null
                        ? formatCurrency(Number(singleOrder.total))
                        : "—"}
                    </p>
                  </div>

                  <Button
                    variant="outline"
                    className="w-full h-[52px] rounded-xl border-primary text-primary hover:bg-primary hover:text-white cursor-pointer"
                  >
                    View Order Timeline
                  </Button>
                </div>
              )}
            </div>
          </>
        )}
        <AssignRiderModal
          isOpen={assignOpen && canAssignOrderRider}
          onClose={() => setAssignOpen(false)}
        />
        {canDeleteOrder && (
          <DeleteOrderConfirm
            open={confirmOpen}
            onOpenChange={(open) => {
              if (!isDeleting) setConfirmOpen(open);
            }}
            isDeleting={isDeleting}
            onConfirm={async () => {
              if (!selectedId) return;
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
                  res.ok &&
                  data?.status !== "error" &&
                  data?.status !== "failed";
                if (!ok) {
                  throw new Error(data?.message ?? "Failed to delete order");
                }

                setConfirmOpen(false);
                setAssignOpen(false);
                onClose();

                toast.success("Order has been cancelled");
                await fetchOrders({
                  page: lastQuery.page,
                  search: lastQuery.search,
                });
              } catch (e) {
                toast.error(
                  e instanceof Error ? e.message : "Failed to delete order",
                );
              } finally {
                setIsDeleting(false);
              }
            }}
          />
        )}
      </DialogContent>
    </Dialog>
  );
}
