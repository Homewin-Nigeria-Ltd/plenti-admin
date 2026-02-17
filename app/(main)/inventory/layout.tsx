import { InventoryTabNav } from "@/components/inventory/InventoryTabNav";

export default function InventoryLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <div className="space-y-6">
      <InventoryTabNav />
      {children}
    </div>
  );
}
