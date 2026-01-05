export const metadata = {
  title: "Inventory Management | Plenti Admin",
};

import InventoryManagement from "@/components/inventory/InventoryManagement";

export default function InventoryPage() {
  return (
    <div className="space-y-6">
      <InventoryManagement />
    </div>
  );
}
