import { InventoryLayoutClient } from "@/components/inventory/InventoryLayoutClient";

export default function InventoryLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <div className="space-y-6">
      <InventoryLayoutClient />
      {children}
    </div>
  );
}
