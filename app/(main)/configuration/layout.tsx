"use client";

import { ModuleAccessGate } from "@/components/common/ModuleAccessGate";
import * as React from "react";

export default function ConfigurationLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <ModuleAccessGate
      flag="canViewConfiguration"
      message="You do not have permission to view system configuration."
    >
      {children}
    </ModuleAccessGate>
  );
}
