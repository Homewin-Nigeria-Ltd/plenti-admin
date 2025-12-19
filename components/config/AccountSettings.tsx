"use client";

import * as React from "react";
import PersonalInformation from "./PersonalInformation";
import PasswordManagement from "./PasswordManagement";

export default function AccountSettings() {
  const [activeTab, setActiveTab] = React.useState<"personal" | "password">("personal");

  return (
    <div className="space-y-8">
      <div className="flex gap-6 border-b border-neutral-100">
        <button
          onClick={() => setActiveTab("personal")}
          className={`pb-4 px-1 font-medium text-base transition-colors ${
            activeTab === "personal"
              ? "text-primary-700 border-b-2 border-primary-700"
              : "text-neutral-500"
          }`}>
          Personal Information
        </button>
        <button
          onClick={() => setActiveTab("password")}
          className={`pb-4 px-1 font-medium text-base transition-colors ${
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

