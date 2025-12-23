export const metadata = {
  title: "Integration Setting | System Configuration",
};

import IntegrationSettings from "@/components/config/IntegrationSettings";

export default function IntegrationPage() {
  return (
    <div className="space-y-6">
      <IntegrationSettings />
    </div>
  );
}
