export const metadata = {
  title: "Reorder Recommendations | Inventory | Plenti Admin",
};

const MOCK_RECOMMENDATIONS = [
  {
    id: "1",
    product: "Cooking Oil 5L",
    currentStock: 23,
    supplier: "Golden Foods Co.",
    recommendedOrder: 100,
  },
  {
    id: "2",
    product: "Noodles Pack (40)",
    currentStock: 45,
    supplier: "Quick Meals Co.",
    recommendedOrder: 80,
  },
  {
    id: "3",
    product: "Sugar 1kg",
    currentStock: 67,
    supplier: "Sweet Delights Inc.",
    recommendedOrder: 150,
  },
];

export default function ReorderRecommendationsPage() {
  return (
    <div className="space-y-6">
      <div className="space-y-3">
        {MOCK_RECOMMENDATIONS.map((r) => (
          <div
            key={r.id}
            className="bg-white rounded-xl border border-[#EAECF0] p-4 sm:p-5 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4"
          >
            <div>
              <p className="font-semibold text-primary">{r.product}</p>
              <p className="text-[#667085] text-sm mt-1">
                Current: {r.currentStock} units
              </p>
              <p className="text-[#667085] text-sm">Supplier: {r.supplier}</p>
            </div>
            <div className="sm:text-right">
              <p className="font-semibold text-[#0B1E66]">
                Order {r.recommendedOrder} units
              </p>
              <p className="text-[#667085] text-xs mt-1">
                Based on 30-day avg. sales
              </p>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
