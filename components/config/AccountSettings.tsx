"use client";

import * as React from "react";
import PersonalInformation from "./PersonalInformation";
import PasswordManagement from "./PasswordManagement";

export default function AccountSettings() {
  const [activeTab, setActiveTab] = React.useState<"personal" | "password">("personal");

  return (
    <div className="space-y-6 sm:space-y-8">
      <div className="flex gap-4 sm:gap-6 border-b border-neutral-100 overflow-x-auto -mx-4 px-4 sm:mx-0 sm:px-0">
        <button
          onClick={() => setActiveTab("personal")}
          className={`pb-3 sm:pb-4 px-1 font-medium text-sm sm:text-base transition-colors whitespace-nowrap ${
            activeTab === "personal"
              ? "text-primary-700 border-b-2 border-primary-700"
              : "text-neutral-500"
          }`}>
          Personal Information
        </button>
        <button
          onClick={() => setActiveTab("password")}
          className={`pb-3 sm:pb-4 px-1 font-medium text-sm sm:text-base transition-colors whitespace-nowrap ${
            activeTab === "password"
              ? "text-primary-700 border-b-2 border-primary-700"
              : "text-neutral-500"
          }`}>
          Password Management
        </button>
      </div>

      {activeTab === "personal" && <PersonalInformation />}

      {activeTab === "password" && <PasswordManagement />}
    </div>
  );
}

