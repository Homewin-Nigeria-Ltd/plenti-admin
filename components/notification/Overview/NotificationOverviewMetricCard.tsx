const NotificationOverviewMetricCard = () => {
  const metrics = [
    {
      title: "Total Sent (30d)",
      value: "184,320",
      change: 12.4,
      isPositive: true,
    },
    {
      title: "Delivery Rate",
      value: "97.2%",
      change: 16.9,
      isPositive: true,
    },
    {
      title: "Open Rate",
      value: "38.5%",
      change: 10,
      isPositive: false,
    },
    {
      title: "Click Rate",
      value: "12.2%",
      change: 21.6,
      isPositive: true,
    },
  ];

  return (
    <div className="w-full my-5">
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        {metrics.map((metric, index) => (
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
