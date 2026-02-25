"use client";

import MainDashboard from "@/components/dashboard/MainDashboard";
import SalesDashboard from "@/components/dashboard/SalesDashboard";
import React from "react";
// import RecentOrdersTable from "@/components/dashboard/RecentOrdersTable";

const DashboardPage = () => {
  const [isSales, setIsSales] = React.useState(false);
  return isSales ? <SalesDashboard /> : <MainDashboard />;
};

export default DashboardPage;
