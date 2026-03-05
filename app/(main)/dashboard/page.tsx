"use client";

import MainDashboard from "@/components/dashboard/MainDashboard";
import SalesDashboard from "@/components/dashboard/SalesDashboard";
import { useAccountStore } from "@/store/useAccountStore";

const DashboardPage = () => {
  const user = useAccountStore((state) => state.account);
  if (!user) return null;

  // Determine if user has sales-related roles
  const isSales =
    user.roles.some((role) => role.slug === "sales-rep") ||
    user.roles.some((role) => role.slug === "sales-manager");

  return isSales ? <SalesDashboard /> : <MainDashboard />;
};

export default DashboardPage;
