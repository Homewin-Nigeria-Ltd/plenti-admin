import { ReorderRecommendationsView } from "@/components/inventory/ReorderRecommendationsView";

export const metadata = {
  title: "Reorder Recommendations | Inventory | Plenti Admin",
};

export default function ReorderRecommendationsPage() {
  return (
    <div className="space-y-6">
      <ReorderRecommendationsView />
    </div>
  );
}
