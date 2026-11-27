"use client";

import * as React from "react";
import { createPortal } from "react-dom";
import { useRouter, useSearchParams } from "next/navigation";
import { useDebounce } from "use-debounce";
import {
  Banknote,
  ChevronDown,
  ChevronLeft,
  ChevronRight,
  Clock,
  CreditCard,
  Info,
  Landmark,
  Search,
} from "lucide-react";
import { toast } from "sonner";
import OrderManagementHeader from "@/components/order/OrderManagementHeader";
import OrderStatusTabs from "@/components/order/OrderStatusTabs";
import {
  AVATAR_COLORS,
  acceptAllPendingOrders,
  customerInitial,
  customerAvatar,
  getDateRange,
  itemProductName,
  itemSummary,
  ORDER_PAYMENT_FILTERS,
  orderDayLabel,
  orderTimeLabel,
  paidDateLabel,
  paymentCardMeta,
  paymentMeta,
  paymentStatusLabel,
  type PaymentMethodKey,
  deliveryProviderLabel,
  riderName,
  shipsFrom,
  soldBy,
  statusLabel,
  statusQueryValue,
  statusTone,
  type OrderPeriod,
  type OrderStatusTab,
} from "@/components/order/orderManagementView";
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
import { Input } from "@/components/ui/input";
import { Skeleton } from "@/components/ui/skeleton";
import { PAGE_SIZE } from "@/lib/constant";
import { formatCurrency } from "@/lib/format";
import { getOrderPermissions } from "@/lib/modulePermissions";
import { cn } from "@/lib/utils";
import { useAccountStore } from "@/store/useAccountStore";
import { useInventoryStore } from "@/store/useInventoryStore";
import { useOrderStore } from "@/store/useOrderStore";
import type { Order } from "@/types/OrderTypes";

function OrderItemsCell({ order }: { order: Order }) {
  const [open, setOpen] = React.useState(false);
  const [pos, setPos] = React.useState({ x: 0, y: 0 });
  const items = order.items ?? [];
  const summary = itemSummary(order);

  return (
    <>
      <span
        className="line-clamp-2 cursor-default underline decoration-dotted decoration-[#D0D5DD] underline-offset-2"
        onMouseEnter={(event) => {
          const rect = event.currentTarget.getBoundingClientRect();
          setPos({ x: rect.left, y: rect.bottom + 8 });
          setOpen(true);
        }}
        onMouseLeave={() => setOpen(false)}
      >
        {summary}
      </span>
      {open
        ? createPortal(
            <div
              style={{ left: pos.x, top: pos.y }}
              className="pointer-events-none fixed z-[80] w-64 rounded-lg border border-[#E4E6EB] bg-white p-2.5 shadow-lg"
            >
              <p className="mb-1.5 text-[11px] font-medium uppercase tracking-wide text-[#98A2B3]">
                Items
              </p>
              {items.length > 0 ? (
                <ul className="space-y-1.5">
                  {items.map((item) => (
                    <li key={item.id} className="flex items-start justify-between gap-3 text-[12px]">
                      <span className="min-w-0 text-[#344054]">
                        {itemProductName(item) || "Item"}
                        <span className="text-[#98A2B3]"> × {item.quantity}</span>
                      </span>
                      <span className="shrink-0 font-medium text-[#101828]">
                        {formatCurrency(Number(item.price) || 0)}
                      </span>
                    </li>
                  ))}
                </ul>
              ) : (
                <p className="text-[12px] text-[#344054]">{summary}</p>
              )}
            </div>,
            document.body,
          )
        : null}
    </>
  );
}

function PaymentIcon({ kind }: { kind: PaymentMethodKey }) {
  if (kind === "wallet" || kind === "transfer") {
    return <Landmark className="size-3 text-[#12B76A]" />;
  }
  if (kind === "delivery") {
    return <Banknote className="size-3 text-[#667085]" />;
  }
  return <CreditCard className="size-3 text-[#12B76A]" />;
}

export default function OrderTableWrapper() {
  const account = useAccountStore((state) => state.account);
  const router = useRouter();
  const searchParams = useSearchParams();
  const orderIdParam = searchParams.get("orderId");
  const {
    orders,
    loading,
    currentPage,
    lastPage,
    totalItems,
    incomingTotal,
    orderStats,
    statusCounts,
    fetchOrders,
    fetchIncomingOrders,
    fetchOrderStats,
    exportOrders,
    exporting,
  } = useOrderStore();
  const warehouses = useInventoryStore((state) => state.warehouses);
  const fetchWarehouses = useInventoryStore((state) => state.fetchWarehouses);

  const [searchQuery, setSearchQuery] = React.useState("");
  const [debouncedSearch] = useDebounce(searchQuery, 400);
  const [tab, setTab] = React.useState<OrderStatusTab>("all");
  const [period, setPeriod] = React.useState<OrderPeriod>("7d");
  const [seller, setSeller] = React.useState("all");
  const [warehouseId, setWarehouseId] = React.useState("all");
  const [payment, setPayment] = React.useState("all");
  const [hasRequested, setHasRequested] = React.useState(false);
  const [acceptingAll, setAcceptingAll] = React.useState(false);
  const [acceptAllOpen, setAcceptAllOpen] = React.useState(false);
  const { canViewOrderList, canViewOrderDetails, canViewOrderStats } =
    React.useMemo(() => getOrderPermissions(account), [account]);

  const dateRange = React.useMemo(() => getDateRange(period), [period]);
  const listParams = React.useMemo(
    () => ({
      search: typeof debouncedSearch === "string" ? debouncedSearch.trim() : "",
      status: statusQueryValue(tab),
      start_date: dateRange.start,
      end_date: dateRange.end,
      warehouse_id: warehouseId === "all" ? undefined : warehouseId,
      payment_method: payment === "all" ? undefined : payment,
      delivery_provider: seller === "all" ? undefined : seller,
    }),
    [debouncedSearch, tab, dateRange, warehouseId, payment, seller],
  );

  React.useEffect(() => {
    const id = Number(orderIdParam);
    if (!canViewOrderDetails || !Number.isFinite(id) || id <= 0) return;
    router.replace(`/order/${id}`);
  }, [orderIdParam, canViewOrderDetails, router]);

  React.useEffect(() => {
    fetchWarehouses({ per_page: 100 });
  }, [fetchWarehouses]);

  React.useEffect(() => {
    if (!account || !canViewOrderStats) return;
    fetchOrderStats();
  }, [account, canViewOrderStats, fetchOrderStats]);

  React.useEffect(() => {
    if (!canViewOrderList) return;
    let cancelled = false;
    (async () => {
      const requests: Promise<boolean>[] = [
        fetchOrders({ page: 1, ...listParams }),
      ];
      if (tab === "pending") {
        requests.push(
          fetchIncomingOrders({
            page: 1,
            search: listParams.search,
          }),
        );
      }
      await Promise.all(requests);
      if (!cancelled) setHasRequested(true);
    })();
    return () => {
      cancelled = true;
    };
  }, [listParams, tab, fetchOrders, fetchIncomingOrders, canViewOrderList]);

  const visibleOrders = orders;

  const listLoading = loading;
  const listPage = currentPage;
  const listLastPage = lastPage;
  const revenue =
    orderStats?.total_revenue != null ? Number(orderStats.total_revenue) : undefined;
  const showBanner = tab === "pending" && incomingTotal > 0;

  const openOrder = (order: Order) => {
    if (!canViewOrderDetails || order.id == null) return;
    router.push(`/order/${order.id}`);
  };

  const handleExport = async () => {
    try {
      await exportOrders(listParams);
      toast.success("Orders exported");
    } catch (error) {
      toast.error(
        error instanceof Error ? error.message : "Failed to export orders",
      );
    }
  };

  const goToPage = (page: number) => {
    void fetchOrders({ page, ...listParams });
  };

  const handleAcceptAll = async () => {
    setAcceptingAll(true);
    try {
      const result = await acceptAllPendingOrders();
      toast.success(result?.message?.trim() || "Accepted pending orders");
      setAcceptAllOpen(false);
      await Promise.all([
        fetchIncomingOrders({ page: 1, search: listParams.search }),
        fetchOrders({ page: 1, ...listParams }),
        fetchOrderStats(),
      ]);
    } catch (error) {
      toast.error(
        error instanceof Error ? error.message : "Failed to accept orders",
      );
    } finally {
      setAcceptingAll(false);
    }
  };

  const showing = visibleOrders.length;
  const total = totalItems || showing;

  return (
    <div className="space-y-4">
      <OrderManagementHeader
        period={period}
        onPeriodChange={setPeriod}
        orderCount={statusCounts?.all}
        revenue={revenue}
        waitingCount={statusCounts?.pending}
        exporting={exporting}
        onExport={() => void handleExport()}
      />

      {canViewOrderStats || canViewOrderList ? (
        <OrderStatusTabs
          value={tab}
          onChange={setTab}
          statusCounts={statusCounts}
        />
      ) : null}

      {showBanner ? (
        <div className="flex flex-col gap-3 rounded-xl border border-[#B2DDFF] bg-[#F0F9FF] px-4 py-3 sm:flex-row sm:items-center sm:justify-between">
          <div className="flex items-start gap-2.5 min-w-0">
            <Info className="size-4 shrink-0 text-[#2F5BDB] mt-0.5" />
            <p className="text-[13px] leading-5 text-[#344054]">
              Accepting moves a Plenti order to Processing and sends it to riders
              near its warehouse. Vendor orders are accepted by the vendor; step
              in if one waits over 15 minutes.
            </p>
          </div>
          <button
            type="button"
            disabled={acceptingAll}
            onClick={() => setAcceptAllOpen(true)}
            className="h-9 shrink-0 rounded-lg bg-[#2F5BDB] px-3.5 text-[13px] font-medium text-white hover:bg-[#2F5BDB]/90 disabled:opacity-60"
          >
            {acceptingAll ? "Accepting…" : `Accept all ${incomingTotal}`}
          </button>
        </div>
      ) : null}

      <AlertDialog
        open={acceptAllOpen}
        onOpenChange={(open) => {
          if (!acceptingAll) setAcceptAllOpen(open);
        }}
      >
        <AlertDialogContent className="rounded-xl border-0 p-6 sm:max-w-md">
          <AlertDialogHeader>
            <AlertDialogTitle className="text-[18px] font-semibold text-[#101828]">
              Accept all pending orders?
            </AlertDialogTitle>
            <AlertDialogDescription className="text-sm text-[#667085]">
              This accepts incoming Plenti orders and sends them to riders near
              each warehouse. Vendor orders stay with the vendor.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter className="flex flex-row gap-3 sm:justify-end">
            <AlertDialogCancel
              disabled={acceptingAll}
              className="h-9 rounded-lg border border-[#EAECF0] bg-white text-[13px] font-medium text-[#344054]"
            >
              Cancel
            </AlertDialogCancel>
            <button
              type="button"
              disabled={acceptingAll}
              onClick={() => void handleAcceptAll()}
              className="h-9 shrink-0 rounded-lg bg-[#2F5BDB] px-3.5 text-[13px] font-medium text-white hover:bg-[#2F5BDB]/90 disabled:opacity-60"
            >
              {acceptingAll ? "Accepting…" : `Accept all ${incomingTotal}`}
            </button>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>

      {!canViewOrderList ? (
        <div className="rounded-xl border border-[#EAECF0] bg-white p-12 text-center">
          <p className="text-sm text-[#667085]">
            You do not have permission to view orders.
          </p>
        </div>
      ) : (
        <div className="overflow-hidden rounded-xl border border-[#EAECF0] bg-white">
          <div className="flex flex-col gap-2 border-b border-[#EAECF0] p-3 lg:flex-row lg:items-center">
            <div className="flex h-9 flex-1 items-center gap-2 rounded-lg border border-[#EAECF0] bg-white px-3">
              <Search className="size-4 shrink-0 text-[#98A2B3]" />
              <Input
                className="h-auto border-0 p-0 text-[13px] shadow-none placeholder:text-[#98A2B3] focus-visible:ring-0"
                placeholder="Order number, payment reference, customer name or email"
                value={searchQuery}
                onChange={(event) => setSearchQuery(event.target.value)}
              />
            </div>
            <div className="flex flex-wrap items-center gap-2">
              <FilterSelect
                value={seller}
                onChange={setSeller}
                options={[
                  { value: "all", label: "All sellers" },
                  { value: "plenti", label: "Plenti" },
                ]}
              />
              <FilterSelect
                value={warehouseId}
                onChange={setWarehouseId}
                options={[
                  { value: "all", label: "All warehouses" },
                  ...warehouses.map((warehouse) => ({
                    value: String(warehouse.id),
                    label: warehouse.name,
                  })),
                ]}
              />
              <FilterSelect
                value={payment}
                onChange={setPayment}
                options={[...ORDER_PAYMENT_FILTERS]}
              />
            </div>
          </div>

          {!hasRequested || listLoading ? (
            <OrderTableSkeleton />
          ) : visibleOrders.length === 0 ? (
            <p className="px-4 py-10 text-center text-sm text-[#667085]">
              No orders found
            </p>
          ) : (
            <>
              <div className="overflow-x-auto">
                <table className="w-full min-w-[1320px] text-sm">
                  <thead>
                    <tr className="border-b border-[#EAECF0] text-left text-[12px] font-medium text-[#667085]">
                      <th className="px-4 py-3 font-medium">Order</th>
                      <th className="px-4 py-3 font-medium">Date</th>
                      <th className="px-4 py-3 font-medium">Time</th>
                      <th className="px-4 py-3 font-medium">Customer</th>
                      <th className="px-4 py-3 font-medium">Items</th>
                      <th className="px-4 py-3 font-medium">Sold by</th>
                      <th className="px-4 py-3 font-medium">Ships from</th>
                      <th className="px-4 py-3 font-medium">Amount</th>
                      <th className="px-4 py-3 font-medium">Payment status</th>
                      <th className="px-4 py-3 font-medium">Date paid</th>
                      <th className="px-4 py-3 font-medium">Status</th>
                      <th className="px-4 py-3 font-medium">Rider</th>
                      <th className="px-4 py-3 font-medium">Delivery provider</th>
                    </tr>
                  </thead>
                  <tbody>
                    {visibleOrders.map((order, index) => {
                      const name = order.user?.name ?? "Customer";
                      const avatar = customerAvatar(order);
                      const sellerInfo = soldBy(order);
                      const paymentInfo = paymentMeta(order);
                      const card = paymentCardMeta(order);
                      const status = statusLabel(order);
                      const rider = riderName(order) || "-";
                      const provider = deliveryProviderLabel(order);
                      return (
                        <tr
                          key={order.id}
                          className="cursor-pointer border-b border-[#F2F4F7] last:border-0 hover:bg-[#F9FAFB]"
                          onClick={() => openOrder(order)}
                        >
                          <td className="px-4 py-3.5">
                            <button
                              type="button"
                              className="text-[13px] font-semibold text-[#2F5BDB]"
                              onClick={(event) => {
                                event.stopPropagation();
                                openOrder(order);
                              }}
                            >
                              {order.order_number}
                            </button>
                          </td>
                          <td className="whitespace-nowrap px-4 py-3.5 text-[13px] text-[#101828]">
                            {orderDayLabel(order)}
                          </td>
                          <td className="whitespace-nowrap px-4 py-3.5 text-[13px] text-[#667085]">
                            {orderTimeLabel(order)}
                          </td>
                          <td className="px-4 py-3.5">
                            <div className="flex items-center gap-2.5">
                              <Avatar className="size-7">
                                {avatar ? (
                                  <AvatarImage src={avatar} alt={name} />
                                ) : null}
                                <AvatarFallback
                                  className="text-[11px] font-medium text-white"
                                  style={{
                                    backgroundColor:
                                      AVATAR_COLORS[index % AVATAR_COLORS.length],
                                  }}
                                >
                                  {customerInitial(name)}
                                </AvatarFallback>
                              </Avatar>
                              <span className="text-[13px] font-medium text-[#101828]">
                                {name}
                              </span>
                            </div>
                          </td>
                          <td className="max-w-[220px] px-4 py-3.5 text-[13px] text-[#344054]">
                            <OrderItemsCell order={order} />
                          </td>
                          <td className="px-4 py-3.5">
                            <p className="text-[13px] font-medium text-[#101828]">
                              {sellerInfo.name}
                            </p>
                            <p
                              className={cn(
                                "text-[12px]",
                                sellerInfo.vendor
                                  ? "text-[#F79009]"
                                  : "text-[#667085]",
                              )}
                            >
                              {sellerInfo.subtitle}
                            </p>
                          </td>
                          <td className="whitespace-nowrap px-4 py-3.5 text-[13px] text-[#344054]">
                            {shipsFrom(order, warehouses)}
                          </td>
                          <td className="px-4 py-3.5">
                            <p className="text-[13px] font-semibold text-[#101828]">
                              {formatCurrency(Number(order.total) || 0)}
                            </p>
                            <p
                              className={cn(
                                "mt-0.5 flex items-center gap-1 text-[12px]",
                                paymentInfo.label === "Payment failed"
                                  ? "text-[#F04438]"
                                  : "text-[#667085]",
                              )}
                            >
                              <PaymentIcon kind={paymentInfo.key} />
                              {card.last4
                                ? `${paymentInfo.label} · ••••${card.last4}`
                                : paymentInfo.label}
                            </p>
                          </td>
                          <td className="whitespace-nowrap px-4 py-3.5">
                            <span
                              className={cn(
                                "text-[13px] font-medium",
                                paymentStatusLabel(order).toLowerCase() === "paid"
                                  ? "text-[#027A48]"
                                  : paymentInfo.label === "Payment failed"
                                    ? "text-[#F04438]"
                                    : "text-[#F79009]",
                              )}
                            >
                              {paymentStatusLabel(order)}
                            </span>
                          </td>
                          <td className="whitespace-nowrap px-4 py-3.5 text-[13px] text-[#667085]">
                            {paidDateLabel(order)}
                          </td>
                          <td className="px-4 py-3.5">
                            <span
                              className={cn(
                                "inline-flex items-center gap-1 text-[13px] font-medium",
                                statusTone(status),
                              )}
                            >
                              {status === "Pending" ||
                              status === "Refund Pending" ||
                              status === "Processing" ? (
                                <Clock className="size-3.5" />
                              ) : null}
                              {status}
                            </span>
                          </td>
                          <td className="whitespace-nowrap px-4 py-3.5 text-[13px] text-[#101828]">
                            {rider}
                          </td>
                          <td className="whitespace-nowrap px-4 py-3.5 text-[13px] text-[#344054]">
                            {provider}
                          </td>
                        </tr>
                      );
                    })}
                  </tbody>
                </table>
              </div>
              <div className="flex flex-col gap-3 px-4 py-3 sm:flex-row sm:items-center sm:justify-between">
                <p className="text-[13px] text-[#667085]">
                  Showing {showing} of {total.toLocaleString("en-US")} orders
                </p>
                <div className="flex items-center gap-2">
                  <button
                    type="button"
                    disabled={listPage <= 1}
                    onClick={() => goToPage(listPage - 1)}
                    className="inline-flex size-8 items-center justify-center rounded-lg border border-[#EAECF0] text-[#667085] disabled:cursor-not-allowed disabled:opacity-40"
                    aria-label="Previous page"
                  >
                    <ChevronLeft className="size-4" />
                  </button>
                  <span className="text-[13px] text-[#344054]">
                    Page {listPage}
                  </span>
                  <button
                    type="button"
                    disabled={listPage >= listLastPage}
                    onClick={() => goToPage(listPage + 1)}
                    className="inline-flex size-8 items-center justify-center rounded-lg border border-[#EAECF0] text-[#667085] disabled:cursor-not-allowed disabled:opacity-40"
                    aria-label="Next page"
                  >
                    <ChevronRight className="size-4" />
                  </button>
                </div>
              </div>
            </>
          )}
        </div>
      )}

    </div>
  );
}

function FilterSelect({
  value,
  onChange,
  options,
}: {
  value: string;
  onChange: (value: string) => void;
  options: { value: string; label: string }[];
}) {
  return (
    <div className="relative">
      <select
        value={value}
        onChange={(event) => onChange(event.target.value)}
        className="h-9 appearance-none rounded-lg border border-[#EAECF0] bg-white py-0 pl-3 pr-8 text-[13px] text-[#344054] outline-none"
      >
        {options.map((option) => (
          <option key={option.value} value={option.value}>
            {option.label}
          </option>
        ))}
      </select>
      <ChevronDown className="pointer-events-none absolute right-2.5 top-1/2 size-3.5 -translate-y-1/2 text-[#98A2B3]" />
    </div>
  );
}

function OrderTableSkeleton() {
  return (
    <div className="overflow-x-auto">
      <div className="grid grid-cols-10 gap-4 border-b border-[#EAECF0] px-4 py-3">
        {Array.from({ length: 10 }).map((_, index) => (
          <Skeleton key={index} className="h-3 w-16" />
        ))}
      </div>
      {Array.from({ length: 6 }).map((_, rowIdx) => (
        <div
          key={rowIdx}
          className="grid grid-cols-10 gap-4 border-b border-[#F2F4F7] px-4 py-4"
        >
          <Skeleton className="h-4 w-20" />
          <Skeleton className="h-4 w-24" />
          <Skeleton className="h-4 w-16" />
          <div className="flex items-center gap-2">
            <Skeleton className="size-7 rounded-full" />
            <Skeleton className="h-4 w-24" />
          </div>
          <Skeleton className="h-4 w-28" />
          <Skeleton className="h-4 w-20" />
          <Skeleton className="h-4 w-24" />
          <Skeleton className="h-4 w-16" />
          <Skeleton className="h-4 w-16" />
          <Skeleton className="h-4 w-20" />
        </div>
      ))}
    </div>
  );
}
