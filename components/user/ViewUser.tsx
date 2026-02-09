"use client";

import * as React from "react";
import {
  Line,
  LineChart,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";
import DataTable from "@/components/common/DataTable";
import DashboardStatCard from "@/components/dashboard/DashboardStatCard";
import CartMetrics from "@/components/dashboard/CartMetrics";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Input } from "@/components/ui/input";
import { ArrowLeft, Calendar, MapPin, Search } from "lucide-react";
import { useRouter } from "next/navigation";
import type { AdminUser, UserStats } from "@/types/UserTypes";

type ViewUserProps = {
  user: AdminUser;
  stats: UserStats | null;
};

function getInitialsFromName(name: string) {
  const parts = name.trim().split(/\s+/).filter(Boolean);
  const first = parts[0]?.[0] ?? "";
  const last = parts.length > 1 ? parts[parts.length - 1]?.[0] ?? "" : "";
  return (first + last).toUpperCase() || "U";
}

const formatNaira = (value: string | number) =>
  new Intl.NumberFormat("en-NG", {
    style: "currency",
    currency: "NGN",
    minimumFractionDigits: 0,
    maximumFractionDigits: 0,
  }).format(typeof value === "string" ? parseFloat(value) || 0 : value);

// Mock trend data for metric cards (in real app could come from API)
const mockTrendUp = [1, 1.5, 2, 2.2, 2.5, 2.4, 2.8];
const mockTrendDown = [3, 2.8, 2.5, 2.2, 2, 1.5, 1.2];

// Mock revenue chart data
const mockRevenueData = [
  { label: "16", value: 1.2 },
  { label: "18", value: 1.5 },
  { label: "20", value: 1.8 },
  { label: "22", value: 2.0 },
  { label: "24", value: 2.2 },
  { label: "26", value: 2.5 },
  { label: "28", value: 2.3 },
  { label: "30", value: 2.1 },
  { label: "02", value: 2.4 },
];

// Mock orders for this user (in real app would fetch by user id)
type OrderRow = {
  orderDate: string;
  orderId: string;
  customerName: React.ReactNode;
  orderValue: string;
  quantity: number;
  orderStatus: React.ReactNode;
};

const MOCK_ORDERS: OrderRow[] = [
  {
    orderDate: "Apr 12, 2023 09:32AM",
    orderId: "#0001",
    customerName: null as unknown as React.ReactNode,
    orderValue: "₦2,300.00",
    quantity: 30,
    orderStatus: null as unknown as React.ReactNode,
  },
  {
    orderDate: "Apr 12, 2023 09:32AM",
    orderId: "#0001",
    customerName: null as unknown as React.ReactNode,
    orderValue: "₦2,300.00",
    quantity: 1,
    orderStatus: null as unknown as React.ReactNode,
  },
];

function StatusPill({ status }: { status: string }) {
  const s = status?.toLowerCase?.() ?? "";
  const isSuccess = s === "successful" || s === "completed";
  const isProcessing = s === "processing" || s === "pending";
  const className = isSuccess
    ? "bg-[#ECFDF3] text-[#027A48]"
    : isProcessing
    ? "bg-[#FFF7ED] text-[#B54708]"
    : "bg-[#F2F4F7] text-[#667085]";
  return (
    <span
      className={`inline-flex items-center px-3 py-1 rounded-full text-xs font-medium ${className}`}
    >
      {status}
    </span>
  );
}

export default function ViewUser({ user, stats }: ViewUserProps) {
  const router = useRouter();
  const [orderSearch, setOrderSearch] = React.useState("");
  const [ordersPage, setOrdersPage] = React.useState(1);

  const totalRevenue = stats?.total_revenue ?? "0";
  const totalOrders = stats?.total_orders ?? 0;
  const refunds = stats?.refunds ?? 0;
  const netProfit = stats?.net_profit ?? "0";

  const metricCards = React.useMemo(
    () => [
      {
        title: "Total Revenue",
        value: formatNaira(totalRevenue),
        changePercent: 22,
        increased: true,
        trendData: mockTrendUp,
      },
      {
        title: "Total Orders",
        value: totalOrders,
        changePercent: 25,
        increased: false,
        trendData: mockTrendDown,
      },
      {
        title: "Refunds",
        value: refunds,
        changePercent: 49,
        increased: true,
        trendData: mockTrendUp,
      },
      {
        title: "Net Profit",
        value: `${netProfit}%`,
        changePercent: 1.9,
        increased: true,
        trendData: mockTrendUp,
      },
    ],
    [totalRevenue, totalOrders, refunds, netProfit]
  );

  const ordersWithCells = React.useMemo(() => {
    return MOCK_ORDERS.map((row) => ({
      orderDate: (
        <span className="text-[#101928] text-sm">{row.orderDate}</span>
      ),
      orderId: (
        <span className="text-sm font-medium text-[#101928]">
          {row.orderId}
        </span>
      ),
      customerName: (
        <div className="flex items-center gap-3 min-w-0">
          <Avatar className="size-8 shrink-0">
            {user.avatar_url ? (
              <AvatarImage src={user.avatar_url} alt={user.name} />
            ) : null}
            <AvatarFallback className="bg-[#E8EEFF] text-[#0B1E66] text-xs font-semibold">
              {getInitialsFromName(user.name)}
            </AvatarFallback>
          </Avatar>
          <div className="min-w-0">
            <p className="text-sm font-medium text-[#101928] truncate">
              {user.name}
            </p>
            <p className="text-xs text-[#667085] truncate">{user.email}</p>
          </div>
        </div>
      ),
      orderValue: (
        <span className="text-sm text-[#344054]">{row.orderValue}</span>
      ),
      quantity: <span className="text-sm text-[#344054]">{row.quantity}</span>,
      orderStatus: (
        <StatusPill
          status={row.quantity === 30 ? "Successful" : "Processing"}
        />
      ),
    }));
  }, [user]);

  const orderColumns = [
    { key: "orderDate", label: "Order Date" },
    { key: "orderId", label: "Order ID" },
    { key: "customerName", label: "Customer Name" },
    { key: "orderValue", label: "Order Value" },
    { key: "quantity", label: "Quantity" },
    { key: "orderStatus", label: "Order Status" },
  ];

  return (
    <div className="space-y-4 sm:space-y-6">
      <button
        type="button"
        onClick={() => router.back()}
        className="inline-flex items-center gap-2 text-sm text-[#101928] hover:text-[#0B1E66]"
      >
        <ArrowLeft className="size-4" />
        Back
      </button>
      <div className="flex items-center gap-3">
        <h1 className="text-lg font-semibold text-[#101928]">Single User</h1>
      </div>

      {/* Metric cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-4">
        {metricCards.map((m) => (
          <DashboardStatCard
            key={m.title}
            title={m.title}
            value={m.value}
            changePercent={m.changePercent}
            increased={m.increased}
            trendData={m.trendData}
          />
        ))}
      </div>

      {/* User profile + Revenue + Cart row */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-4">
        {/* User profile card */}
        <div className="lg:col-span-4 bg-white rounded-xl border border-[#EEF1F6] p-6 shadow-xs">
          <div className="flex flex-col items-center text-center mb-6">
            <Avatar className="size-20 sm:size-24 mb-4">
              {user.avatar_url ? (
                <AvatarImage src={user.avatar_url} alt={user.name} />
              ) : null}
              <AvatarFallback className="bg-[#E8EEFF] text-[#0B1E66] text-2xl font-semibold">
                {getInitialsFromName(user.name)}
              </AvatarFallback>
            </Avatar>
            <p className="font-semibold text-[#101928] text-base">
              {user.name}
            </p>
            <p className="text-sm text-[#667085]">{user.email}</p>
          </div>
          <div className="space-y-4">
            <div className="flex items-start gap-3">
              <MapPin className="size-4 text-[#667085] mt-0.5 shrink-0" />
              <div>
                <p className="text-xs text-[#98A2B3] font-medium">Location</p>
                <p className="text-sm text-[#344054]">
                  24 Idah Market Road, Idah, Kogi
                </p>
              </div>
            </div>
            <div className="flex items-start gap-3">
              <Calendar className="size-4 text-[#667085] mt-0.5 shrink-0" />
              <div>
                <p className="text-xs text-[#98A2B3] font-medium">
                  First Order
                </p>
                <p className="text-sm text-[#344054]">
                  September 30, 2019 1:49 PM
                </p>
              </div>
            </div>
            <div className="flex items-start gap-3">
              <Calendar className="size-4 text-[#667085] mt-0.5 shrink-0" />
              <div>
                <p className="text-xs text-[#98A2B3] font-medium">
                  Latest Orders
                </p>
                <p className="text-sm text-[#344054]">
                  February 14, 2020 7:52 AM
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Revenue chart card */}
        <div className="lg:col-span-5 bg-white rounded-xl border border-[#EEF1F6] p-6 shadow-xs">
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center gap-2">
              <h3 className="text-[#0B1E66] text-lg font-semibold">Revenue</h3>
              <span className="size-2 rounded-full bg-[#0B1E66]" />
            </div>
            <a
              href="#"
              className="text-sm font-medium text-[#0B1E66] hover:underline"
            >
              View Details →
            </a>
          </div>
          <div className="h-[220px]">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart
                data={mockRevenueData}
                margin={{ top: 10, right: 10, left: 0, bottom: 0 }}
              >
                <XAxis
                  dataKey="label"
                  tick={{ fill: "#667085", fontSize: 11 }}
                  tickLine={false}
                  axisLine={{ stroke: "#EEF1F6" }}
                />
                <YAxis
                  tick={{ fill: "#667085", fontSize: 11 }}
                  tickLine={false}
                  axisLine={{ stroke: "#EEF1F6" }}
                  tickFormatter={(v) => (v >= 1 ? `$${v}M` : String(v))}
                  domain={[0, 2.5]}
                  ticks={[0, 0.5, 1, 1.5, 2, 2.5]}
                />
                <Tooltip
                  cursor={{ stroke: "#EEF1F6" }}
                  contentStyle={{
                    borderRadius: 8,
                    border: "1px solid #EEF1F6",
                    fontSize: 12,
                  }}
                  formatter={(value: number | undefined) => [
                    `${value}k`,
                    "Revenue",
                  ]}
                />
                <Line
                  type="monotone"
                  dataKey="value"
                  stroke="#0B1E66"
                  strokeWidth={2}
                  dot={{ r: 3, fill: "#0B1E66" }}
                  activeDot={{ r: 4, fill: "#0B1E66" }}
                />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Cart summary card */}
        <div className="lg:col-span-3">
          <CartMetrics
            percentage={38}
            abandonedCart={720}
            abandonedRevenue="500900"
          />
        </div>
      </div>

      {/* Orders table */}
      <div className="bg-white rounded-xl border border-[#EEF1F6] p-4 sm:p-6 shadow-xs">
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 mb-4">
          <div className="relative w-full sm:max-w-[280px]">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 size-4 text-[#98A2B3]" />
            <Input
              placeholder="Search"
              value={orderSearch}
              onChange={(e) => setOrderSearch(e.target.value)}
              className="pl-9 form-control"
              aria-label="Search orders"
            />
          </div>
        </div>
        <div className="overflow-x-auto">
          <DataTable
            columns={orderColumns}
            rows={ordersWithCells}
            page={ordersPage}
            pageCount={6}
            pageSize={10}
            total={24}
            onPageChange={setOrdersPage}
            className="border border-[#EEF1F6] shadow-xs"
          />
        </div>
      </div>
    </div>
  );
}
