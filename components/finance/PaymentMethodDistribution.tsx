"use client";

import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import Image from "next/image";
import * as React from "react";
import { PaymentMethodChart } from "./PaymentMethodChart";

const paymentData = [
  { name: "Card Payments", value: 1234500, color: "#0B1E66" },
  { name: "Wallet Payments", value: 856300, color: "#3B82F6" },
  { name: "Bank Transfer", value: 365200, color: "#E5E7EB" },
];

const totalAmount = paymentData.reduce((sum, item) => sum + item.value, 0);

const formatCurrency = (amount: number) => {
  return new Intl.NumberFormat("en-NG", {
    style: "currency",
    currency: "NGN",
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  }).format(amount);
};

export function PaymentMethodDistribution() {
  const [timeRange, setTimeRange] = React.useState("daily");

  return (
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-5">
      {/* Payment Method Distribution Card */}
      <div className="bg-white rounded-[12px] border border-[#E4E7EC] p-6">
        <div className="flex items-center justify-between mb-4">
          <div>
            <h3 className="text-[#98A2B3] text-[16px] font-medium">
              Payment Method Distribution
            </h3>
            <p className="text-[#98A2B3] text-[12px] mt-2">
              This metric is based on check out
            </p>
          </div>
          <Select value={timeRange} onValueChange={setTimeRange}>
            <SelectTrigger className="w-[120px] bg-[#F8F9FB] border-0">
              <SelectValue />
            </SelectTrigger>
            <SelectContent className="border-0">
              <SelectItem value="daily">Daily</SelectItem>
              <SelectItem value="weekly">Weekly</SelectItem>
              <SelectItem value="monthly">Monthly</SelectItem>
            </SelectContent>
          </Select>
        </div>

        <div className="flex items-center gap-8">
          {/* Donut Chart */}
          <PaymentMethodChart
            data={paymentData}
            formatCurrency={formatCurrency}
          />

          {/* Total and Legend */}
          <div className="flex-1 space-y-6">
            <div className="flex items-center justify-between">
              <p className="text-[#0B1E66] text-2xl font-semibold">
                {formatCurrency(totalAmount)}
              </p>
              <div className="flex items-center gap-1 mt-1">
                <span className="inline-flex items-center gap-1 text-[#1DBF73] text-[12px] font-medium">
                  {/* <ArrowUp className="w-4 h-4" /> */}
                  32.1%
                  <Image
                    src="/icons/circle-up.png"
                    alt="arrow-up"
                    width={13}
                    height={13}
                  />
                </span>
              </div>
            </div>

            {/* Legend */}
            <div className="space-y-3">
              {paymentData.map((item, index) => (
                <div key={index} className="flex items-center gap-2">
                  <div
                    className="w-1 h-3 rounded-sm"
                    style={{ backgroundColor: item.color }}
                  />
                  <div className="flex-1">
                    <p className="text-[#98A2B3] text-[16px] font-normal">
                      {item.name}
                    </p>
                  </div>
                  <p className="text-[#101928] text-[14px] font-medium">
                    {formatCurrency(item.value)}
                  </p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* Metric Cards Grid */}
      <div className="grid grid-cols-2 gap-4">
        {/* Total Revenue Card */}
        <div className="bg-white rounded-[12px] border border-[#E4E7EC] p-2">
          <div className="bg-[#E8EEFF] rounded-[8px] p-5 h-full flex flex-col justify-between">
            <p className="text-[#98A2B3] text-[14px] mb-2">
              Total Revenue (Nov)
            </p>
            <p className="text-[#0B1E66] text-[30px] font-semibold mb-2">
              {formatCurrency(45678900)}
            </p>
            <p className="text-[#98A2B3] text-xs">10% Compared to last month</p>
          </div>
        </div>

        {/* Completed Refunds Card */}
        <div className="bg-white rounded-[12px] border border-[#E4E7EC] p-2">
          <div className="bg-[#E8EEFF] rounded-[8px] p-5 h-full flex flex-col justify-between">
            <p className="text-[#98A2B3] text-[14px] mb-2">Completed Refunds</p>
            <p className="text-[#0B1E66] text-[30px] font-semibold mb-2">
              {formatCurrency(234500)}
            </p>
            <p className="text-[#98A2B3] text-xs">10% Compared to last month</p>
          </div>
        </div>

        {/* Net Revenue Card 1 */}
        <div className="bg-white rounded-[12px] border border-[#E4E7EC] p-2">
          <div className="bg-[#E8EEFF] rounded-[8px] p-5 h-full flex flex-col justify-between">
            <p className="text-[#98A2B3] text-[14px] mb-2">Net Revenue</p>
            <p className="text-[#0B1E66] text-[30px] font-semibold mb-2">
              {formatCurrency(45678900)}
            </p>
            <p className="text-[#98A2B3] text-xs">10% Compared to last month</p>
          </div>
        </div>

        {/* Net Revenue Card 2 */}
        <div className="bg-white rounded-[12px] border border-[#E4E7EC] p-2">
          <div className="bg-[#E8EEFF] rounded-[8px] p-5 h-full flex flex-col justify-between">
            <p className="text-[#98A2B3] text-[14px] mb-2">Net Revenue</p>
            <p className="text-[#0B1E66] text-[30px] font-semibold mb-2">
              {formatCurrency(45678900)}
            </p>
            <p className="text-[#98A2B3] text-xs">10% Compared to last month</p>
          </div>
        </div>
      </div>
    </div>
  );
}
