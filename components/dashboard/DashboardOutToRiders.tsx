"use client";

import type { Order } from "@/types/OrderTypes";
import type { AdminRider } from "@/types/RiderTypes";
import { AlertTriangle, Check, Info, Radio } from "lucide-react";
import { useRouter } from "next/navigation";

type DashboardOutToRidersProps = {
  orders: Order[];
  riders: AdminRider[];
};

type RiderRowStatus =
  | "finding"
  | "accepted"
  | "on_the_way"
  | "delivered"
  | "no_rider";

type RiderDisplayRow = {
  id: string;
  kind: RiderRowStatus;
  title: string;
  titleClass: string;
  detail: string;
  name: string | null;
  asideLabel?: string;
};

const AVATAR_COLORS = ["#F79009", "#12B76A", "#0E9384", "#EE46BC"];

const DUMMY_COUNTS = { free: 14, onDelivery: 27, offline: 7 };

const DUMMY_ROWS: RiderDisplayRow[] = [
  {
    id: "dummy-finding",
    kind: "finding",
    title: "Finding a rider",
    titleClass: "text-[#F79009]",
    detail: "ORD-2846 · Abuja North · 6 riders in range",
    name: null,
    asideLabel: "0:42",
  },
  {
    id: "dummy-accepted",
    kind: "accepted",
    title: "Tunde B. accepted",
    titleClass: "text-[#101828]",
    detail: "ORD-2846 · Port Harcourt · at the warehouse",
    name: "Tunde B.",
  },
  {
    id: "dummy-on-the-way",
    kind: "on_the_way",
    title: "Kelechi E. on the way",
    titleClass: "text-[#101828]",
    detail: "ORD-2838 · Abuja North · ETA 11:32 AM",
    name: "Kelechi E.",
  },
  {
    id: "dummy-delivered",
    kind: "delivered",
    title: "Aisha B. delivered",
    titleClass: "text-[#12B76A]",
    detail: "ORD-2833 · Kano Main · 38 min trip",
    name: "Aisha B.",
    asideLabel: "11:02 AM",
  },
  {
    id: "dummy-no-rider",
    kind: "no_rider",
    title: "No rider in range",
    titleClass: "text-[#F04438]",
    detail: "ORD-2841 · Kano Main · 5 min, no takers",
    name: null,
  },
];

function RowIcon({
  kind,
  name,
  color,
}: {
  kind: RiderRowStatus;
  name: string | null;
  color: string;
}) {
  if (kind === "finding") {
    return (
      <span className="size-8 rounded-full bg-[#FFF6ED] text-[#F79009] inline-flex items-center justify-center shrink-0">
        <Radio className="size-3.5" />
      </span>
    );
  }
  if (kind === "no_rider") {
    return (
      <span className="size-8 rounded-full bg-[#FEF3F2] text-[#F04438] inline-flex items-center justify-center shrink-0">
        <AlertTriangle className="size-3.5" />
      </span>
    );
  }
  return (
    <span
      className="size-8 rounded-full text-white text-xs font-medium inline-flex items-center justify-center shrink-0"
      style={{ backgroundColor: color }}
    >
      {name?.[0] || "R"}
    </span>
  );
}

function countRiders(riders: AdminRider[]) {
  let free = 0;
  let onDelivery = 0;
  let offline = 0;
  for (const rider of riders) {
    const status = `${rider.rider_status || ""} ${rider.status || ""}`.toLowerCase();
    if (
      status.includes("offline") ||
      status.includes("inactive") ||
      status.includes("suspend")
    ) {
      offline += 1;
    } else if (
      status.includes("busy") ||
      status.includes("delivery") ||
      status.includes("on-trip")
    ) {
      onDelivery += 1;
    } else {
      free += 1;
    }
  }
  return { free, onDelivery, offline };
}

function RowAside({
  row,
  onRetry,
}: {
  row: RiderDisplayRow;
  onRetry: () => void;
}) {
  if (row.kind === "no_rider") {
    return (
      <button
        type="button"
        className="text-[12px] font-medium text-[#2F5BDB] shrink-0"
        onClick={onRetry}
      >
        Retry
      </button>
    );
  }
  if (row.kind === "accepted" || row.kind === "on_the_way") {
    return (
      <span className="size-5 rounded-full bg-[#ECFDF3] text-[#12B76A] inline-flex items-center justify-center shrink-0">
        <Check className="size-3" strokeWidth={2.5} />
      </span>
    );
  }
  if (row.kind === "finding") {
    return (
      <p className="text-[12px] font-medium text-[#F79009] shrink-0">
        {row.asideLabel}
      </p>
    );
  }
  return (
    <p className="text-[12px] text-[#98A2B3] shrink-0">{row.asideLabel}</p>
  );
}

export default function DashboardOutToRiders({
  riders,
}: DashboardOutToRidersProps) {
  const router = useRouter();
  const liveCounts = countRiders(riders);
  const hasLiveCounts =
    liveCounts.free + liveCounts.onDelivery + liveCounts.offline > 0;
  const counts = hasLiveCounts ? liveCounts : DUMMY_COUNTS;

  return (
    <section className="rounded-2xl border border-[#EAECF0] bg-white p-4 sm:p-5 min-w-0">
      <div className="flex items-start justify-between gap-3 mb-3">
        <div>
          <h2 className="text-sm font-semibold text-[#101828]">Out to riders</h2>
          <p className="text-[12px] text-[#667085] mt-0.5">
            Accepted orders broadcast on their own
          </p>
        </div>
        <button
          type="button"
          className="text-[12px] font-medium text-[#2F5BDB]"
          onClick={() => router.push("/rider")}
        >
          Track
        </button>
      </div>

      <div className="grid grid-cols-3 gap-3 mb-4">
        <div>
          <p className="text-[12px] text-[#667085] inline-flex items-center gap-1.5">
            <span className="size-1.5 rounded-full bg-[#12B76A]" />
            Free
          </p>
          <p className="text-xl font-semibold text-[#12B76A] leading-tight">
            {counts.free}
          </p>
        </div>
        <div>
          <p className="text-[12px] text-[#667085] inline-flex items-center gap-1.5">
            <span className="size-1.5 rounded-full bg-[#2F5BDB]" />
            On delivery
          </p>
          <p className="text-xl font-semibold text-[#2F5BDB] leading-tight">
            {counts.onDelivery}
          </p>
        </div>
        <div>
          <p className="text-[12px] text-[#667085] inline-flex items-center gap-1.5">
            <span className="size-1.5 rounded-full bg-[#98A2B3]" />
            Offline
          </p>
          <p className="text-xl font-semibold text-[#667085] leading-tight">
            {counts.offline}
          </p>
        </div>
      </div>

      <div className="space-y-3">
        {DUMMY_ROWS.map((row, index) => (
          <div key={row.id} className="flex items-start gap-2.5">
            <RowIcon
              kind={row.kind}
              name={row.name}
              color={AVATAR_COLORS[index % AVATAR_COLORS.length]}
            />
            <div className="min-w-0 flex-1">
              <p className={`text-sm font-medium ${row.titleClass}`}>{row.title}</p>
              <p className="text-[12px] text-[#667085] truncate">{row.detail}</p>
            </div>
            <RowAside row={row} onRetry={() => router.push("/order")} />
          </div>
        ))}
      </div>
      <p className="text-[11px] text-[#98A2B3] mt-3 inline-flex items-start gap-1.5">
        <Info className="size-3.5 mt-0.5 shrink-0" />
        Only riders within 100 m of the warehouse, and not on a delivery, see the
        request.
      </p>
    </section>
  );
}
