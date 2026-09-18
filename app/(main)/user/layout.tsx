"use client";

import { ModuleAccessGate } from "@/components/common/ModuleAccessGate";
import * as React from "react";

export default function UserLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <ModuleAccessGate
      flag="canViewUserManagement"
      message="You do not have permission to view user management."
    >
      {children}
    </ModuleAccessGate>
  );
}
