export const metadata = {
  title: "Audit Log | Inventory | Plenti Admin",
};

import Image from "next/image";

const MOCK_ENTRIES = [
  {
    id: "1",
    title: "Premium Rice 50kg Transferred to Another Warehouse",
    date: "Apr 12, 2023",
    time: "09:32AM",
    user: "Oluwanifemi Osunsanya",
    description:
      "Oluwanifemi Osunsanya initiated the transfer of 25pcs Premium Rice 50kg from Lagos Central Warehouse to Abuja North Warehouse",
  },
  {
    id: "2",
    title: "New Stock Added",
    date: "Apr 12, 2023",
    time: "09:32AM",
    user: "Pelumi Adesokan",
    description: "Pelumi Adesokan added new stocks to the inventory",
  },
];

export default function AuditLogPage() {
  return (
    <div className="space-y-6">
      <div className="space-y-4">
        {MOCK_ENTRIES.map((entry) => (
          <div
            key={entry.id}
            className="bg-white rounded-xl border border-[#EAECF0] p-4 sm:p-5"
          >
            <div className="flex gap-3">
              <Image
                src="/signal.svg"
                alt=""
                width={26}
                height={26}
                className="shrink-0 mt-0.5"
              />
              <div className="min-w-0 flex-1">
                <div className="flex flex-wrap items-baseline gap-x-3 gap-y-1">
                  <p className="font-semibold text-[#101928]">{entry.title}</p>
                  <p className="text-[#667085] text-sm shrink-0">
                    {entry.date} | {entry.time} • {entry.user}
                  </p>
                </div>
                <p className="text-[#667085] text-sm mt-2">{entry.description}</p>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
