import { NotificationData } from "@/types/NotificationTypes";

const NotificationOverviewMetricCard = ({
  metrics,
}: {
  metrics: NotificationData | null;
}) => {
  if (!metrics?.summary) {
    return (
      <div className="flex w-full text-center h-50 items-center justify-center">
        Loading metrics...
      </div>
    );
  }

  const formattedMetrics = [
    {
      title: "Total Sent (30d)",
      value: metrics?.summary.total_sent.value ?? "0",
      change: metrics?.summary.total_sent.comparison ?? 0,
      isPositive: metrics && metrics?.summary.total_sent.comparison > 0,
    },
    {
      title: "Delivery Rate",
      value: metrics?.summary.delivery_rate.value ?? "0",
      change: metrics?.summary.delivery_rate.comparison ?? 0,
      isPositive: metrics && metrics?.summary.delivery_rate.comparison > 0,
    },
    {
      title: "Open Rate",
      value: `${metrics?.summary.open_rate.value ?? 0}%`,
      change: metrics?.summary.open_rate.comparison ?? 0,
      isPositive: metrics && metrics?.summary.open_rate.comparison > 0,
    },
    {
      title: "Click Rate",
      value: `${metrics?.summary.click_rate.value ?? 0}%`,
      change: metrics?.summary.click_rate.comparison ?? 0,
      isPositive: metrics && metrics?.summary.click_rate.comparison > 0,
    },
  ];

  return (
    <div className="w-full my-5">
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        {formattedMetrics.map((metric, index) => (
          <div
            key={index}
            className="bg-white rounded-xl border border-gray-200 p-6 shadow-sm hover:shadow-md transition-shadow duration-200"
          >
            <h3 className="text-[#808080] text-sm font-medium mb-3">
              {metric.title}
            </h3>
            <div className="text-[32px] font-semibold text-[#0B1E66] mb-3">
              {metric.value}
            </div>
            <div className="flex items-center gap-1.5 text-sm">
              <span
                className={`flex items-center gap-0.5 px-3 text-[12px] font-medium rounded-[12px] ${
                  metric.isPositive
                    ? "text-green-600 bg-[#E7F6EC]"
                    : "text-red-500 bg-[#FBEAE9]"
                }`}
              >
                {metric.change}%
              </span>
              <span className="text-gray-500">Compared to last month</span>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default NotificationOverviewMetricCard;
