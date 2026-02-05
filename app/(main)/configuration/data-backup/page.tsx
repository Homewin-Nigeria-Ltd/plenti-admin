import DataBackup from "@/components/config/DataBackup";

export const metadata = {
  title: "Data & Backup | System Configuration",
};

export default function DataBackupPage() {
  return (
    <div className="space-y-6">
      <DataBackup />
    </div>
  );
}
