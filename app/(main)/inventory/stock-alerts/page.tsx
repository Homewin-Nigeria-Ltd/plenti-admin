export const metadata = {
  title: "Stock Alerts | Inventory | Plenti Admin",
};

const MOCK_ALERTS = [
  {
    id: "1",
    product: "Cooking Oil 5L",
    location: "Abuja North",
    sku: "OIL-5L-VEG",
    unitsLeft: 23,
    reorderAt: 50,
  },
  {
    id: "2",
    product: "Noodles Pack (40)",
    location: "Port Harcourt",
    sku: "SUG-1K-WHT",
    unitsLeft: 67,
    reorderAt: 150,
  },
  {
    id: "3",
    product: "Sugar 1kg",
    location: "Lagos Central",
    sku: "NOD-40-INS",
    unitsLeft: 45,
    reorderAt: 80,
  },
];

export default function StockAlertsPage() {
  return (
    <div className="space-y-6">
      <h2 className="text-xl font-semibold text-[#101928]">Stock Alerts</h2>

      <div className="space-y-3">
        {MOCK_ALERTS.map((a) => (
          <div
            key={a.id}
            className="bg-[#FEF6E7] rounded-xl border border-[#865503] p-4 sm:p-5 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4"
          >
            <div>
              <p className="font-semibold text-[#101928]">{a.product}</p>
              <p className="text-[#667085] text-sm mt-1">
                {a.location} • {a.sku}
              </p>
            </div>
            <div className="sm:text-right">
              <p className="font-semibold text-[#101928]">{a.unitsLeft} units left</p>
              <p className="text-[#667085] text-sm">Reorder at: {a.reorderAt}</p>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
