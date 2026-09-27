export const metadata = {
  title: "System Configuration",
};

import SystemConfigList from "@/components/config/SystemConfigList";

export default function ConfigurationPage() {
  return (
    <div className="min-w-0 space-y-4 sm:space-y-6">
      <SystemConfigList />
    </div>
  );
}
