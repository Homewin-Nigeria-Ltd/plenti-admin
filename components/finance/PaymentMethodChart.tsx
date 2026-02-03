"use client";

import { PieChart, Pie, Cell, ResponsiveContainer, Tooltip } from "recharts";

type PaymentData = {
  name: string;
  value: number;
  color: string;
};

type PaymentMethodChartProps = {
  data: PaymentData[];
  formatCurrency: (amount: number) => string;
  width?: number;
  height?: number;
};

const defaultPaymentItem: PaymentData = {
  name: "",
  value: 0,
  color: "#E5E7EB",
};

export function PaymentMethodChart({
  data,
  formatCurrency,
  width = 200,
  height = 200,
}: PaymentMethodChartProps) {
  // Find each payment method with safe fallbacks
  const cardPayments =
    data.find((d) => d.name === "Card Payments") ??
    data[0] ??
    defaultPaymentItem;
  const walletPayments =
    data.find((d) => d.name === "Wallet Payments") ??
    data[1] ??
    defaultPaymentItem;
  const bankTransfer =
    data.find((d) => d.name === "Bank Transfer") ??
    data[2] ??
    defaultPaymentItem;

  // Calculate radii for nested donut charts
  const outerRing = { innerRadius: 84, outerRadius: 96 };
  const middleRing = { innerRadius: 69, outerRadius: 81 };
  const innerRing = { innerRadius: 54, outerRadius: 66 };

  const pct = (num: number, total: number) =>
    total > 0 ? (num / total) * 100 : 50;

  // Outer ring: Card Payments + Bank Transfer (2 segments)
  const outerRingTotal = cardPayments.value + bankTransfer.value;
  const outerRingData = [
    { ...cardPayments, value: pct(cardPayments.value, outerRingTotal) },
    { ...bankTransfer, value: pct(bankTransfer.value, outerRingTotal) },
  ];

  // Middle ring: Wallet Payments + Card Payments (2 segments)
  const middleRingTotal = walletPayments.value + cardPayments.value;
  const middleRingData = [
    { ...walletPayments, value: pct(walletPayments.value, middleRingTotal) },
    { ...cardPayments, value: pct(cardPayments.value, middleRingTotal) },
  ];

  // Inner ring: Bank Transfer + Wallet Payments (2 segments)
  const innerRingTotal = bankTransfer.value + walletPayments.value;
  const innerRingData = [
    { ...bankTransfer, value: pct(bankTransfer.value, innerRingTotal) },
    { ...walletPayments, value: pct(walletPayments.value, innerRingTotal) },
  ];

  return (
    <div className="shrink-0">
      <ResponsiveContainer width={width} height={height}>
        <PieChart>
          {/* Outer ring - Card Payments + Bank Transfer */}
          <Pie
            data={outerRingData}
            cx="50%"
            cy="50%"
            innerRadius={outerRing.innerRadius}
            outerRadius={outerRing.outerRadius}
            startAngle={90}
            endAngle={-270}
            dataKey="value"
            paddingAngle={2}
            cornerRadius={8}
          >
            {outerRingData.map((entry, index) => (
              <Cell key={`outer-${index}`} fill={entry.color} />
            ))}
          </Pie>

          {/* Middle ring - Wallet Payments + Card Payments */}
          <Pie
            data={middleRingData}
            cx="50%"
            cy="50%"
            innerRadius={middleRing.innerRadius}
            outerRadius={middleRing.outerRadius}
            startAngle={90}
            endAngle={-270}
            dataKey="value"
            paddingAngle={2}
            cornerRadius={8}
          >
            {middleRingData.map((entry, index) => (
              <Cell key={`middle-${index}`} fill={entry.color} />
            ))}
          </Pie>

          {/* Inner ring - Bank Transfer + Wallet Payments */}
          <Pie
            data={innerRingData}
            cx="50%"
            cy="50%"
            innerRadius={innerRing.innerRadius}
            outerRadius={innerRing.outerRadius}
            startAngle={90}
            endAngle={-270}
            dataKey="value"
            paddingAngle={2}
            cornerRadius={8}
          >
            {innerRingData.map((entry, index) => (
              <Cell key={`inner-${index}`} fill={entry.color} />
            ))}
          </Pie>

          <Tooltip
            formatter={(value: number | undefined) =>
              formatCurrency(value ?? 0)
            }
            contentStyle={{
              borderRadius: 8,
              border: "1px solid #EEF1F6",
              boxShadow: "0 4px 12px rgba(0,0,0,0.08)",
            }}
          />
        </PieChart>
      </ResponsiveContainer>
    </div>
  );
}
