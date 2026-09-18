"use client";

import { ModuleAccessGate } from "@/components/common/ModuleAccessGate";
import * as React from "react";

export default function DashboardLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <ModuleAccessGate
      flag="canViewDashboard"
      message="You do not have permission to view the dashboard."
    >
      {children}
    </ModuleAccessGate>
  );
}
