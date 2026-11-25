"use client";

import { formatCompactNaira, parseNumeric } from "@/lib/mappers/dashboard";
import type { DashboardTopProduct } from "@/types/DashboardTypes";
import type { InventoryStatisticsRecentStock } from "@/types/InventoryTypes";
import { format, formatDistanceToNow, isToday, isYesterday } from "date-fns";
import { Package } from "lucide-react";
import Image from "next/image";
import { useRouter } from "next/navigation";

type DashboardProductListsProps = {
  products?: DashboardTopProduct[] | null;
  recentStocks?: InventoryStatisticsRecentStock[];
};

type StockRow = {
  id: string;
  name: string;
  detail: string;
  amount: string;
  time: string;
};

const DUMMY_TOP: DashboardTopProduct[] = [
  {
    name: "Samsung Galaxy A15 128GB",
    category_name: "Phones",
    total_income: "2399000",
    units_sold: "48",
  },
  {
    name: "Hisense 43\" Smart TV",
    category_name: "Electronics",
    total_income: "1645000",
    units_sold: "22",
  },
  {
    name: "Ofada rice 50kg bag",
    category_name: "Groceries",
    total_income: "980000",
    units_sold: "61",
  },
  {
    name: "Thermocool 150L Chest Freezer",
    category_name: "Appliances",
    total_income: "776000",
    units_sold: "9",
  },
  {
    name: "Oraimo FreePods 4",
    category_name: "Accessories",
    total_income: "412000",
    units_sold: "33",
  },
];

const DUMMY_STOCK: StockRow[] = [
  {
    id: "dummy-stock-1",
    name: "Samsung Galaxy A15 128GB",
    detail: "Primeline Electronics → Abuja North · recorded by Bola A.",
    amount: "+120 units",
    time: "9:40 AM",
  },
  {
    id: "dummy-stock-2",
    name: "Ofada rice 50kg bag",
    detail: "Kolade Agro Farms → Kano Main · recorded by Yusuf K.",
    amount: "+60 bags",
    time: "8:15 AM",
  },
  {
    id: "dummy-stock-3",
    name: "Thermocool 150L Chest Freezer",
    detail: "Coolhaus Appliances → Port Harcourt · recorded by Bola A.",
    amount: "+18 units",
    time: "Yesterday",
  },
  {
    id: "dummy-stock-4",
    name: "Hisense 43\" Smart TV",
    detail: "Bluepeak Distributors → Abuja North · recorded by Ngozi E.",
    amount: "+40 units",
    time: "Yesterday",
  },
  {
    id: "dummy-stock-5",
    name: "Hisense 43\" Smart TV",
    detail: "Bluepeak Distributors → Abuja North · recorded by Ngozi E.",
    amount: "+40 units",
    time: "Yesterday",
  },
];

function stockTime(value?: string) {
  if (!value) return "—";
  const date = new Date(value);
  if (isToday(date)) return format(date, "h:mm a");
  if (isYesterday(date)) return "Yesterday";
  return formatDistanceToNow(date, { addSuffix: true });
}

export default function DashboardProductLists({
  products,
  recentStocks = [],
}: DashboardProductListsProps) {
  const router = useRouter();
  const top = (products && products.length > 0 ? products : DUMMY_TOP).slice(0, 5);
  const recent: StockRow[] =
    recentStocks.length > 0
      ? recentStocks.slice(0, 5).map((item) => ({
          id: String(item.id),
          name: item.name,
          detail: [item.category, item.sku].filter(Boolean).join(" · "),
          amount: `+${item.stock} units`,
          time: stockTime(item.last_updated),
        }))
      : DUMMY_STOCK;

  return (
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
      <section className="rounded-2xl border border-[#EAECF0] bg-white p-4 sm:p-5">
        <div className="flex items-center justify-between mb-3">
          <h2 className="text-sm font-semibold text-[#101828]">Top products</h2>
          <span className="text-[12px] text-[#667085]">Past month</span>
        </div>
        <div className="space-y-3">
            {top.map((product) => (
              <div key={product.name} className="flex items-center gap-3">
                <div className="size-9 rounded-lg bg-[#F2F4F7] overflow-hidden shrink-0">
                  {product.image_url || product.image_urls?.[0] ? (
                    <Image
                      src={product.image_url || product.image_urls?.[0] || ""}
                      alt={product.name}
                      width={36}
                      height={36}
                      className="size-9 object-cover"
                      unoptimized
                    />
                  ) : null}
                </div>
                <div className="min-w-0 flex-1">
                  <p className="text-sm font-medium text-[#101828] truncate">
                    {product.name}
                  </p>
                  <p className="text-[12px] text-[#667085] truncate">
                    {product.category_name}
                  </p>
                </div>
                <div className="text-right shrink-0">
                  <p className="text-sm font-semibold text-[#101828]">
                    {formatCompactNaira(parseNumeric(product.total_income))}
                  </p>
                  <p className="text-[12px] text-[#98A2B3]">
                    {product.units_sold} sold
                  </p>
                </div>
              </div>
            ))}
        </div>
      </section>

      <section className="rounded-2xl border border-[#EAECF0] bg-white p-4 sm:p-5">
        <div className="flex items-center justify-between mb-3">
          <h2 className="text-sm font-semibold text-[#101828]">Recent stock intake</h2>
          <button
            type="button"
            className="text-[12px] font-medium text-[#2F5BDB]"
            onClick={() => router.push("/inventory")}
          >
            Audit log
          </button>
        </div>
        <div className="space-y-3">
          {recent.map((item) => (
            <div key={item.id} className="flex items-start gap-3">
              <span className="size-8 rounded-lg bg-[#ECFDF3] text-[#12B76A] inline-flex items-center justify-center shrink-0">
                <Package className="size-4" />
              </span>
              <div className="min-w-0 flex-1">
                <p className="text-sm font-medium text-[#101828] truncate">
                  {item.name}
                </p>
                <p className="text-[12px] text-[#667085] truncate">{item.detail}</p>
              </div>
              <div className="text-right shrink-0">
                <p className="text-sm font-semibold text-[#12B76A]">{item.amount}</p>
                <p className="text-[11px] text-[#98A2B3]">{item.time}</p>
              </div>
            </div>
          ))}
        </div>
      </section>
    </div>
  );
}
