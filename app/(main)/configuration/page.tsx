export const metadata = {
  title: "System Configuration",
};

import SystemConfigList from "@/components/config/SystemConfigList";

export default function ConfigurationPage() {
  return (
    <div className="space-y-6">
      <SystemConfigList />
    </div>
  );
}
