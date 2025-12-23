"use client";

import * as React from "react";
import { useRouter } from "next/navigation";
import { User, Shield, Bell, Link2, ChevronRight } from "lucide-react";

type ConfigItem = {
  id: string;
  title: string;
  description: string;
  icon: React.ComponentType<{ className?: string }>;
  href?: string;
};

const configItems: ConfigItem[] = [
  {
    id: "account",
    title: "Account Settings",
    description: "Profile settings for individual admins, including name, email, profile picture,",
    icon: User,
  },
  {
    id: "permission",
    title: "Control and Permission",
    description: "User accounts with different permission levels",
    icon: Shield,
  },
  {
    id: "notifications",
    title: "Notifications",
    description: "Ability to customize notification preferences based on user roles",
    icon: Bell,
  },
  {
    id: "integration",
    title: "Integration Setting",
    description: "API settings for developers to integrate custom functionalities",
    icon: Link2,
  },
];

export default function SystemConfigList() {
  const router = useRouter();

  const handleItemClick = (item: ConfigItem) => {
    if (item.id === "account") {
      router.push("/configuration/account");
    } else if (item.id === "permission") {
      router.push("/configuration/permission");
    } else if (item.id === "notifications") {
      router.push("/configuration/notifications");
    } else if (item.id === "integration") {
      router.push("/configuration/integration");
    } else {
      console.log("Navigate to:", item.id);
    }
  };

  return (
    <div className="space-y-3 sm:space-y-4">
      {configItems.map((item) => {
        const Icon = item.icon;
        return (
          <div
            key={item.id}
            onClick={() => handleItemClick(item)}
            className="flex items-center gap-3 sm:gap-4 p-3 sm:p-4 bg-white rounded-lg border border-neutral-100 hover:bg-neutral-50 cursor-pointer transition-colors">
            <div className="flex-shrink-0">
              <Icon className="size-5 sm:size-6 text-primary" strokeWidth={1.5} />
            </div>
            <div className="flex-1 min-w-0">
              <h3 className="font-semibold text-primary-700 text-sm sm:text-base mb-1">
                {item.title}
              </h3>
              <p className="text-xs sm:text-sm text-neutral-500">
                {item.description}
              </p>
            </div>
            <div className="flex-shrink-0">
              <ChevronRight className="size-4 sm:size-5 text-primary-700" />
            </div>
          </div>
        );
      })}
    </div>
  );
}

