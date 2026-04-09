import { cn } from "@/lib/utils";

const NotificationOverviewStats = () => {
    const stats = [
        {
            title: "Total Sent (30d)",
            amount: "184,320",
            percentageChange: "12.4",
            trend: "up"
        },
        {
            title: "Delivery Rate",
            amount: "97.2%",
            percentageChange: "16.9",
            trend: "up"
        },
        {
            title: "Open Rate",
            amount: "38.5%",
            percentageChange: "10",
            trend: "down"
        },
        {
            title: "Click Rate",
            amount: "12.2%",

            percentageChange: "21.6",
            trend: "up"
        },
    ];

    return (
        <div className="grid grid-cols-4 gap-5">
            {stats.map((stat, idx) => (
                <div key={idx} className="border border-[#D9D9D9] rounded-xl p-5">
                    <h3 className="text-[#808080] font-medium">{stat.title}</h3>
                    <p className="text-[#0B1E66] font-semibold text-[32px] my-2">{stat.amount}</p>
                    <div className="flex gap-2 items-center">
                        <div className={cn(stat.trend === "up" ? "bg-[#E7F6EC] text-[#0F973D]" : "bg-[#FBEAE9] text-[#D42620]", 'font-medium text-[12px] w-fit px-3 rounded-2xl')}>
                            {stat.percentageChange}%
                        </div>
                        <p className="text-[#4D4D4D] text-[12px]">Compared to last month</p>
                    </div>
                </div>
            ))}
        </div>
    )
};

export default NotificationOverviewStats;
