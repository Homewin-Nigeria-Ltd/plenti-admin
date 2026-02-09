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
import { ORDERS_API } from "@/data/orders";
import Image from "next/image";
import api from "@/lib/api";

const AssignRiderModal = dynamic(
  () => import("./AssignRiderModal").then((mod) => mod.AssignRiderModal),
  {
    ssr: false,
  }
);

const DeleteOrderConfirm = dynamic(
  () => import("./DeleteOrderConfirm").then((mod) => mod.DeleteOrderConfirm),
  {
    ssr: false,
  }
);

const formatCurrency = (n: number) =>
  new Intl.NumberFormat("en-NG", {
    style: "currency",
    currency: "NGN",
    minimumFractionDigits: 2,
  }).format(n);

export function OrderDetailsModal({
  isOpen,
  onClose,
  selectedId,
}: {
  isOpen: boolean;
  onClose: () => void;
  selectedId: number | null;
}) {
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

  React.useEffect(() => {
    if (!selectedId) return;
    fetchSingleOrders(selectedId);
  }, [fetchSingleOrders, selectedId]);

  const markAsInTransit = async () => {
    if (!selectedId) return;
    setIsMarkingInTransit(true);
    try {
      const { data } = await api.post<{ status?: string; message?: string }>(
        `${ORDERS_API.markInTransit}/${selectedId}/mark-in-transit`
      );

      if (data?.status === "success") {
        toast.success("Order marked as in transit");
        await fetchSingleOrders(selectedId);
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
    if (!selectedId) return;
    setIsIssuingRefund(true);
    try {
      const { data } = await api.post<{ status?: string; message?: string }>(
        `${ORDERS_API.issueRefund}/${selectedId}/issue-refund`
      );

      if (data?.status === "success") {
        toast.success("Refund issued successfully");
        await fetchSingleOrders(selectedId);
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

              <div className="flex items-center gap-2 absolute top-6 right-6">
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
                    <DropdownMenuItem
                      className="text-[#0B1E66] text-[14px] font-medium place-self-center"
                      onSelect={markAsInTransit}
                      disabled={isMarkingInTransit}
                    >
                      {isMarkingInTransit ? "Marking..." : "Mark As In Transit"}
                    </DropdownMenuItem>
                    <DropdownMenuSeparator />
                    <DropdownMenuItem
                      className="text-[#667085] text-[14px] place-self-center"
                      onSelect={issueRefund}
                      disabled={isIssuingRefund}
                    >
                      {isIssuingRefund ? "Issuing..." : "Issue Refund"}
                    </DropdownMenuItem>
                    <DropdownMenuSeparator />

                    <DropdownMenuItem
                      className="text-[#D69200] text-[14px] place-self-center"
                      onSelect={() => setAssignOpen(true)}
                    >
                      Assign Rider
                    </DropdownMenuItem>
                    <DropdownMenuSeparator />

                    <DropdownMenuItem
                      variant="destructive"
                      className="text-[#D42620] text-[14px] place-self-center"
                      onSelect={() => setConfirmOpen(true)}
                    >
                      Delete Order
                    </DropdownMenuItem>
                  </DropdownMenuContent>
                </DropdownMenu>
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
                    <p className="text-[#1F3A78] font-semibold">Order Items</p>
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
                          (singleOrder?.payment_status ?? "").toLowerCase() ===
                          "paid"
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
                        {singleOrder?.delivery_tracking ?? "—"}
                      </p>
                    </div>
                    <div className="space-y-1">
                      <p className="text-[#101928] font-medium">Shipping Fee</p>
                      <p className="text-[#98A2B3] text-sm">—</p>
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
            </div>
          </>
        )}
        <AssignRiderModal
          isOpen={assignOpen}
          onClose={() => setAssignOpen(false)}
        />
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
                { method: "DELETE", credentials: "include" }
              );
              const data = (await res.json().catch(() => ({}))) as {
                status?: string;
                message?: string;
              };
              const ok =
                res.ok && data?.status !== "error" && data?.status !== "failed";
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
                e instanceof Error ? e.message : "Failed to delete order"
              );
            } finally {
              setIsDeleting(false);
            }
          }}
        />
      </DialogContent>
    </Dialog>
  );
}
