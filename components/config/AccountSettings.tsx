"use client";

import * as React from "react";
import { useAccountStore } from "@/store/useAccountStore";
import PersonalInformation from "./PersonalInformation";
import PasswordManagement from "./PasswordManagement";

export default function AccountSettings() {
  const [activeTab, setActiveTab] = React.useState<"personal" | "password">(
    "personal"
  );
  const fetchAccountSettings = useAccountStore((s) => s.fetchAccountSettings);

  React.useEffect(() => {
    fetchAccountSettings();
  }, [fetchAccountSettings]);

  return (
    <div className="space-y-6 sm:space-y-8">
      <div className="flex gap-4 sm:gap-6 overflow-x-auto -mx-4 px-4 sm:mx-0 sm:px-0">
        <button
          onClick={() => setActiveTab("personal")}
          className={`btn btn-secondary ${
            activeTab === "personal"
              ? "bg-[#E8EEFF] text-primary hover:bg-[#E8EEFF]"
              : ""
          }`}
        >
          Personal Information
        </button>
        <button
          onClick={() => setActiveTab("password")}
          className={`btn btn-secondary ${
            activeTab === "password"
              ? "bg-[#E8EEFF] text-primary hover:bg-[#E8EEFF]"
              : ""
          }`}
        >
          Password Management
        </button>
      </div>

      {activeTab === "personal" && <PersonalInformation />}

      {activeTab === "password" && <PasswordManagement />}
    </div>
  );
}
