export const metadata = {
  title: "Account Settings | System Configuration",
};

import AccountSettings from "@/components/config/AccountSettings";

export default function AccountSettingsPage() {
  return (
    <div className="space-y-6">
      <AccountSettings />
    </div>
  );
}

