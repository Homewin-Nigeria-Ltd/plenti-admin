"use client";

import { ChevronRight } from "lucide-react";
import Image from "next/image";
import { useRouter } from "next/navigation";

type ConfigItem = {
  id: string;
  title: string;
  description: string;
  icon: string;
  href: string;
};

const configItems: ConfigItem[] = [
  {
    id: "account",
    title: "Account Settings",
    description:
      "Profile settings for individual admins, including name, email, profile picture,",
    icon: "/icons/user.png",
    href: "/configuration/account",
  },
  {
    id: "permission",
    title: "Control and Permission",
    description: "User accounts with different permission levels",
    icon: "/icons/shield.png",
    href: "/configuration/permission",
  },
  {
    id: "notifications",
    title: "Notifications",
    description:
      "Ability to customize notification preferences based on user roles",
    icon: "/icons/bell.png",
    href: "/configuration/notifications",
  },
  // {
  //   id: "integration",
  //   title: "Integration Setting",
  //   description:
  //     "API settings for developers to integrate custom functionalities",
  //   icon: "/icons/link.png",
  //   href: "/configuration/integration",
  // },
  // {
  //   id: "data-backup",
  //   title: "Data & Backup",
  //   description:
  //     "Export your data for compliance, analysis, or migration purposes",
  //   icon: "/icons/cloud.png",
  //   href: "/configuration/data-backup",
  // },
  // {
  //   id: "chatbot-configuration",
  //   title: "Chatbot Configuration",
  //   description: "Chatbot Keywords & Responses",
  //   icon: "/icons/sms-tracking.png",
  //   href: "/configuration/chatbot-configuration",
  // },
];

export default function SystemConfigList() {
  const router = useRouter();

  return (
    <div className="space-y-3 sm:space-y-4">
      {configItems.map((item) => {
        return (
          <div
            key={item.id}
            onClick={() => router.push(item.href)}
            className="flex items-center gap-3 sm:gap-4 p-3 sm:p-4 bg-white rounded-lg cursor-pointer transition-colors"
          >
            <div className="shrink-0 bg-[#E8EEFF] rounded-full p-3">
              <Image
                src={item.icon}
                alt={item.title}
                width={20}
                height={20}
                className="size-full"
              />
            </div>
            <div className="flex-1 min-w-0">
              <h3 className="font-semibold text-[#253B4B] text-sm sm:text-base mb-1">
                {item.title}
              </h3>
              <p className="text-xs sm:text-sm text-[#9B9B9B]">
                {item.description}
              </p>
            </div>
            <div className="shrink-0">
              <ChevronRight className="size-4 sm:size-5 text-[#0B1E66]" />
            </div>
          </div>
        );
      })}
    </div>
  );
}
