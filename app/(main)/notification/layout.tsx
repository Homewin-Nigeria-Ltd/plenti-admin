"use client";

import { ModuleAccessGate } from "@/components/common/ModuleAccessGate";
import * as React from "react";

export default function NotificationLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <ModuleAccessGate
      flag="canViewNotifications"
      message="You do not have permission to view notification management."
    >
      {children}
    </ModuleAccessGate>
  );
}
