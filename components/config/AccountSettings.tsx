"use client";

import * as React from "react";
import PersonalInformation from "./PersonalInformation";
import PasswordManagement from "./PasswordManagement";

export default function AccountSettings() {
  const [activeTab, setActiveTab] = React.useState<"personal" | "password">("personal");

  return (
    <div className="space-y-6 sm:space-y-8">
      <div className="flex gap-4 sm:gap-6 overflow-x-auto -mx-4 px-4 sm:mx-0 sm:px-0">
        <button
          onClick={() => setActiveTab("personal")}
          className={`px-4 py-2 font-medium text-sm sm:text-base transition-colors whitespace-nowrap rounded-md ${
            activeTab === "personal"
              ? "bg-[#E8EEFF] text-primary"
              : "bg-transparent text-neutral-500 hover:bg-neutral-50"
          }`}>
          Personal Information
        </button>
        <button
          onClick={() => setActiveTab("password")}
          className={`px-4 py-2 font-medium text-sm sm:text-base transition-colors whitespace-nowrap rounded-md ${
            activeTab === "password"
              ? "bg-[#E8EEFF] text-primary"
              : "bg-transparent text-neutral-500 hover:bg-neutral-50"
          }`}>
          Password Management
        </button>
      </div>

      {activeTab === "personal" && <PersonalInformation />}

      {activeTab === "password" && <PasswordManagement />}
    </div>
  );
}

