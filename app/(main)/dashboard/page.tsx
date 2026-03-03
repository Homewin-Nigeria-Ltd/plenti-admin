"use client";

import MainDashboard from "@/components/dashboard/MainDashboard";
import SalesDashboard from "@/components/dashboard/SalesDashboard";
import React from "react";
import { useAuthStore } from "@/store/useAuthStore";
import { useAccountStore } from "@/store/useAccountStore";

const DashboardPage = () => {
  const user = useAccountStore((state) => state.account);
  // If user is not loaded yet, you may want to show a loader or fallback
  if (!user) return null;
  const department = Array.isArray(user.department)
    ? user.department.join(" ").toLowerCase()
    : String(user.department || "").toLowerCase();
  const isSales = department.includes("sales");
  return isSales ? <SalesDashboard /> : <MainDashboard />;
};

export default DashboardPage;
