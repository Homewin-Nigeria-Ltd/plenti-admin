import WarehouseDetailView from "@/components/inventory/WarehouseDetailView";

export const metadata = {
  title: "Warehouse Details | Plenti Admin",
};

export default async function WarehousePage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  return <WarehouseDetailView warehouseId={id} />;
}
