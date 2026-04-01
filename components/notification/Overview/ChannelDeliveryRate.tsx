interface Channel {
  name: string;
  deliveredPercentage: number;
  sentCount: string;
  color: string;
  bgColor: string;
}

const ChannelDeliveryRate = () => {
  const channels: Channel[] = [
    {
      name: "Email",
      deliveredPercentage: 99,
      sentCount: "84,900",
      color: "bg-green-600",
      bgColor: "bg-green-100",
    },
    {
      name: "In-App",
      deliveredPercentage: 98,
      sentCount: "12,900",
      color: "bg-orange-500",
      bgColor: "bg-orange-100",
    },
    {
      name: "SMS",
      deliveredPercentage: 95,
      sentCount: "120,900",
      color: "bg-blue-900",
      bgColor: "bg-blue-100",
    },
  ];

  const totalNotifications = "184,320";

  return (
    <div className="w-full">
      <div className="bg-white rounded-2xl border border-gray-200 p-8 shadow-sm">
        {/* Header */}
        <div className="mb-8">
          <h2 className="text-xl font-bold text-gray-900 mb-2">
            Channel Delivery Rate
          </h2>
          <p className="text-gray-500 text-sm">
            {totalNotifications} notifications sent across all channels
          </p>
        </div>

        {/* Channels List */}
        <div className="space-y-8">
          {channels.map((channel, index) => (
            <div key={index} className="space-y-2">
              {/* Channel Header */}
              <div className="flex justify-between items-center">
                <span className="text-gray-900 font-medium text-base">
                  {channel.name}
                </span>
                <span className="text-green-700 font-semibold text-sm">
                  {channel.deliveredPercentage}% Delivered
                </span>
              </div>

              {/* Progress Bar */}
              <div className="relative h-3 bg-gray-200 rounded-full overflow-hidden">
                <div
                  className={`absolute top-0 left-0 h-full ${channel.color} rounded-full transition-all duration-1000 ease-out`}
                  style={{ width: `${channel.deliveredPercentage}%` }}
                />
              </div>

              {/* Sent Count */}
              <p className="text-gray-400 text-sm italic">
                Over {channel.sentCount} were sent
              </p>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default ChannelDeliveryRate;
