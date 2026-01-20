"use client";

import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Ellipsis, X } from "lucide-react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { AssignRiderModal } from "./AssignRiderModal";
import * as React from "react";
import { toast } from "sonner";
import { DeleteOrderConfirm } from "./DeleteOrderConfirm";
import { useOrderStore } from "@/store/useOrderStore";

export function OrderDetailsModal({
  isOpen,
  onClose,
  selectedId,
}: {
  isOpen: boolean;
  onClose: () => void;
  selectedId: number | null;
}) {
  const { fetchSingleOrders, singleOrder } = useOrderStore();
  const [assignOpen, setAssignOpen] = React.useState(false);
  const [confirmOpen, setConfirmOpen] = React.useState(false);
  console.log("Selected id", selectedId);
  console.log("Single order details =>", singleOrder);

  React.useEffect(() => {
    // close modal if no id
    if (!selectedId) {
      return;
    }

    fetchSingleOrders(selectedId);
  }, [fetchSingleOrders, selectedId]);

  function markAsInTransit() {
    // onClose();
    toast.info("Order has been updated to in transit");
  }

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="min-w-[750px]" showCloseButton={false}>
        <DialogHeader className="relative">
          <DialogTitle className="font-medium text-[24px]">
            Order Details - ORD- {singleOrder?.id || ""}
          </DialogTitle>
          <DialogDescription className="text-[#808080] text-[14px] font-normal">
            Complete order information and actions
          </DialogDescription>

          <div className="flex items-center gap-[8px] absolute top-2 right-6">
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <button
                  type="button"
                  aria-label="More actions"
                  className="border-[0.2px] border-[#98A2B3] rounded-[4px] size-[24px] flex items-center justify-center cursor-pointer"
                >
                  <Ellipsis color="#0B1E66" size={18} />
                </button>
              </DropdownMenuTrigger>
              <DropdownMenuContent className="border-0 rounded-[12px] p-2 min-w-[220px]">
                <DropdownMenuItem
                  className="text-[#0B1E66] text-[14px] font-medium place-self-center"
                  onSelect={markAsInTransit}
                >
                  Mark As In Transit
                </DropdownMenuItem>
                <DropdownMenuSeparator />
                <DropdownMenuItem className="text-[#667085] text-[14px] place-self-center">
                  Issue Refund
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

        <div className="px-6 pb-6 space-y-6">
          {/* ORDERS ITEMS  */}
          {singleOrder && singleOrder?.items.length > 0 && (
            <>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="flex items-center gap-4">
                  <div className="size-16 h-full rounded-md bg-[#E8EEFF80] border-[0.5px] border-[#D0D5DD]"></div>
                  <div>
                    <p className="font-medium text-[16px] text-[#1A1A1A]">
                      Mr. Chef Salt
                    </p>
                    <p className="text-xs font-normal text-[#9B9B9B]">
                      High-quality premium long grain rice
                    </p>
                    <div className="flex items-center mt-5 gap-6 text-sm">
                      <span>
                        Price: <span className="font-medium">₦50,210</span>
                      </span>
                      <span className="text-[#9B9B9B]">
                        QTY: <span className="text-black">10</span>
                      </span>
                    </div>
                  </div>
                </div>
                <div className="flex items-center gap-4">
                  <div className="size-16 h-full rounded-md bg-[#E8EEFF80] border-[0.5px] border-[#D0D5DD]"></div>
                  <div>
                    <p className="font-medium text-[16px] text-[#1A1A1A]">
                      Dano Milk
                    </p>
                    <p className="text-xs font-normal text-[#9B9B9B]">
                      High-quality premium long grain rice
                    </p>
                    <div className="flex items-center mt-5 gap-6 text-sm">
                      <span>
                        Price: <span className="font-medium">₦50,210</span>
                      </span>
                      <span className="text-[#9B9B9B]">
                        QTY: <span className="text-black">10</span>
                      </span>
                    </div>
                  </div>
                </div>
                <div className="flex items-center gap-4">
                  <div className="size-16 h-full rounded-md bg-[#E8EEFF80] border-[0.5px] border-[#D0D5DD]"></div>
                  <div>
                    <p className="font-medium text-[16px] text-[#1A1A1A]">
                      Sunflower Groundnut Oil
                    </p>
                    <p className="text-xs font-normal text-[#9B9B9B]">
                      High-quality premium long grain rice
                    </p>
                    <div className="flex items-center mt-5 gap-6 text-sm">
                      <span>
                        Price: <span className="font-semibold">₦50,210</span>
                      </span>
                      <span className="text-[#9B9B9B]">
                        QTY: <span className="text-black">10</span>
                      </span>
                    </div>
                  </div>
                </div>
                <div className="flex items-center gap-4">
                  <div className="size-16 h-full rounded-md bg-[#E8EEFF80] border-[0.5px] border-[#D0D5DD]"></div>
                  <div>
                    <p className="font-medium text-[16px] text-[#1A1A1A]">
                      Mr. Chef Salt
                    </p>
                    <p className="text-xs font-normal text-[#9B9B9B]">
                      High-quality premium long grain rice
                    </p>
                    <div className="flex items-center mt-5 gap-6 text-sm">
                      <span>
                        Price: <span className="font-semibold">₦50,210</span>
                      </span>
                      <span className="text-[#9B9B9B]">
                        QTY: <span className="text-black">10</span>
                      </span>
                    </div>
                  </div>
                </div>
              </div>
            </>
          )}

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* PAYMENT DETAILS  */}
            <div className="rounded-xl border border-[#EEF1F6] bg-[#F9FAFB] p-6 space-y-4">
              <p className="text-[#1F3A78] font-semibold">Payment Details</p>
              <div className="space-y-1">
                <p className="text-[#101928] font-medium">Payment Method</p>
                <p className="text-[#667085] text-sm">
                  Pay with Cards, Bank Transfer or USSD
                </p>
              </div>
              <div className="space-y-1 mt-5">
                <p className="text-[#101928] font-medium">Payment Status</p>
                <span className="inline-flex items-center gap-2 rounded-full bg-green-100 text-green-700 px-3 py-1 text-sm">
                  <span className="size-2 rounded-full bg-green-600"></span>
                  Successful
                </span>
              </div>
              <div className="space-y-1">
                <p className="text-[#101928] text-[16px] font-medium">
                  Transaction Reference
                </p>
                <p className="text-[#98A2B3] text-sm">197HIT237-MOTES</p>
              </div>
            </div>

            {/* SHIPPING DETAILS  */}
            <div className="rounded-xl border border-[#EEF1F6] bg-[#F9FAFB] p-6 space-y-4">
              <p className="text-[#1F3A78] font-semibold">Shipping Details</p>
              <div className="space-y-1">
                <p className="text-[#101928] font-medium">Shipping Address</p>
                <p className="text-[#667085] text-sm">
                  {singleOrder?.deliveryAddress || ""}
                </p>
              </div>
              <div className="space-y-1">
                <p className="text-[#101928] font-medium">Shipping Details</p>
                <p className="text-[#98A2B3] text-sm">
                  Door Delivery. Delivery between 27 Aug and 28 Aug.
                </p>
              </div>
              <div className="space-y-1">
                <p className="text-[#101928] font-medium">Shipping Fee</p>
                <p className="text-[#98A2B3] text-sm">₦ 200</p>
              </div>
            </div>
          </div>

          <div className="border-t border-dashed border-[#EAECF0] pt-6 flex items-center justify-between">
            <p className="text-[#667085]">Amount Total</p>
            <p className="text-[#101928] font-semibold">
              {new Intl.NumberFormat("en-NG", {
                style: "currency",
                currency: "NGN",
                minimumFractionDigits: 2,
              }).format(Number(singleOrder?.totalAmount) || 0)}
            </p>
          </div>

          <Button
            variant="outline"
            className="w-full h-[52px] rounded-[8px] border-primary text-primary hover:bg-primary hover:text-white cursor-pointer"
          >
            View Order Timeline
          </Button>
        </div>
        <AssignRiderModal
          isOpen={assignOpen}
          onClose={() => setAssignOpen(false)}
        />
        <DeleteOrderConfirm
          open={confirmOpen}
          onOpenChange={setConfirmOpen}
          onConfirm={() => {
            setConfirmOpen(false);
            setAssignOpen(false);
            onClose();
            toast.error("Order has been cancelled");
          }}
        />
      </DialogContent>
    </Dialog>
  );
}
