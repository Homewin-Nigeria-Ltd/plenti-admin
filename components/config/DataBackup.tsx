"use client";

import * as React from "react";
import DataTable from "@/components/common/DataTable";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Download, Search } from "lucide-react";
import CreateBackupModal from "./CreateBackupModal";
import ExportCustomersDataModal from "./ExportCustomersDataModal";
import ExportOrdersDataModal from "./ExportOrdersDataModal";
import ExportProductDataModal from "./ExportProductDataModal";
import ExportTransactionDataModal from "./ExportTransactionDataModal";
import RestoreBackupModal, {
  type RestoreBackupInfo,
} from "./RestoreBackupModal";
import {
  useSystemConfigStore,
  type Backup,
} from "@/store/useSystemConfigStore";

function formatBytes(bytes: number): string {
  if (!Number.isFinite(bytes) || bytes <= 0) return "—";
  const kb = bytes / 1024;
  if (kb < 1024) return `${kb.toFixed(1)} KB`;
  const mb = kb / 1024;
  if (mb < 1024) return `${mb.toFixed(1)} MB`;
  return `${(mb / 1024).toFixed(1)} GB`;
}

function formatDateTime(iso: string): string {
  try {
    return new Date(iso).toLocaleString("en-NG", {
      month: "short",
      day: "2-digit",
      year: "numeric",
      hour: "2-digit",
      minute: "2-digit",
      hour12: true,
    });
  } catch {
    return iso;
  }
}

function StatusChip({ status }: { status: string }) {
  const s = (status || "").toLowerCase();
  const isSuccess = s === "successful";
  const isFailed = s === "failed";
  const className = isSuccess
    ? "bg-[#ECFDF3] text-[#027A48]"
    : isFailed
    ? "bg-[#FFF1F1] text-[#E11D48]"
    : "bg-[#FFFBEB] text-[#B45309]";
  const label = isSuccess
    ? "Successful"
    : isFailed
    ? "Failed"
    : status || "Pending";
  return (
    <span
      className={`inline-flex items-center px-3 py-1 rounded-full text-xs font-medium ${className}`}
    >
      {label}
    </span>
  );
}

export default function DataBackup() {
  const [createOpen, setCreateOpen] = React.useState(false);
  const [restoreOpen, setRestoreOpen] = React.useState(false);
  const [restoreInfo, setRestoreInfo] =
    React.useState<RestoreBackupInfo | null>(null);
  const [exportOrdersOpen, setExportOrdersOpen] = React.useState(false);
  const [exportCustomersOpen, setExportCustomersOpen] = React.useState(false);
  const [exportProductsOpen, setExportProductsOpen] = React.useState(false);
  const [exportTransactionOpen, setExportTransactionOpen] = React.useState(false);

  const {
    backups,
    backupsPagination,
    loadingBackups,
    backupsError,
    fetchBackups,
  } = useSystemConfigStore();

  React.useEffect(() => {
    fetchBackups();
  }, [fetchBackups]);

  const openRestore = (backup: Backup) => {
    setRestoreInfo({
      id: `#${backup.id}`,
      createdAt: formatDateTime(backup.created_at),
      size: formatBytes(backup.size),
      type: backup.type,
    });
    setRestoreOpen(true);
  };

  const columns = [
    { key: "dateTime", label: "Date & Time" },
    { key: "backupId", label: "Backup ID" },
    { key: "size", label: "Size" },
    { key: "duration", label: "Duration" },
    { key: "type", label: "Type" },
    { key: "status", label: "Status" },
    { key: "actions", label: "Actions" },
  ];

  const rows = React.useMemo(
    () =>
      backups.map((b) => ({
        dateTime: (
          <span className="text-[#101928] text-sm">
            {formatDateTime(b.created_at)}
          </span>
        ),
        backupId: <span className="text-sm">#{b.id}</span>,
        size: (
          <span className="text-sm font-semibold">{formatBytes(b.size)}</span>
        ),
        duration: <span className="text-sm">—</span>,
        type: <span className="text-sm font-medium capitalize">{b.type}</span>,
        status: <StatusChip status={b.status} />,
        actions: (
          <button
            type="button"
            className="py-2 px-4 text-xs rounded-[4px] bg-[#E4E7EC] text-[#0B1E66]"
            onClick={() => openRestore(b)}
          >
            Restore
          </button>
        ),
      })),
    [backups]
  );

  const latest = backups[0] ?? null;
  const pagination = backupsPagination ?? {
    currentPage: 1,
    lastPage: 1,
    perPage: 10,
    total: backups.length,
  };

  return (
    <div className="space-y-6 sm:space-y-8">
      {/* Last Backup card */}
      <div className="bg-[#E8EEFF] border border-[#E4E7EC] rounded-xl p-4 sm:p-6 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div className="space-y-1">
          <h2 className="font-semibold text-[#0B1E66] text-base sm:text-lg">
            Last Backup
          </h2>
          <p className="text-sm text-[#253B4B] font-medium">
            {latest ? formatDateTime(latest.created_at) : "No backup yet"}
          </p>
          <p className="text-xs text-[#98A2B3]">
            {latest
              ? "Automatic daily backup completed successfully"
              : "Create your first backup below."}
          </p>
        </div>
        <Button
          className="btn btn-primary w-full sm:w-auto shrink-0"
          disabled={!latest}
          onClick={() => latest && openRestore(latest)}
        >
          Restore Backup
        </Button>
      </div>

      {/* Backup list + DataTable */}
      <div className="bg-white rounded-lg border border-[#EAECF0] p-4 sm:p-6 space-y-4 sm:space-y-6">
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
          <div className="relative w-full sm:max-w-[320px]">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 size-4 text-[#98A2B3]" />
            <Input
              placeholder="Search"
              className="pl-9 form-control"
              aria-label="Search backups"
            />
          </div>
          <Button
            className="btn btn-primary w-full sm:w-auto"
            onClick={() => setCreateOpen(true)}
          >
            Create Backup
          </Button>
        </div>

        {backupsError ? (
          <p className="text-sm text-red-600 py-4">{backupsError}</p>
        ) : loadingBackups ? (
          <div className="min-h-[200px] flex items-center justify-center text-sm text-[#667085]">
            Loading backups...
          </div>
        ) : backups.length === 0 ? (
          <div className="min-h-[200px] flex items-center justify-center text-sm text-[#667085] border border-dashed border-[#D0D5DD] rounded-lg">
            No backups yet. Click &quot;Create Backup&quot; to create one.
          </div>
        ) : (
          <div className="overflow-x-auto">
            <DataTable
              columns={columns}
              rows={rows}
              page={pagination.currentPage}
              pageCount={pagination.lastPage}
              pageSize={pagination.perPage}
              total={pagination.total}
              onPageChange={(page) => fetchBackups(page)}
              className="border border-[#EEF1F6] shadow-xs"
            />
          </div>
        )}
      </div>

      {/* Data Export */}
      <div className="bg-[#E8EEFF] border border-[#E4E7EC] rounded-xl p-4 sm:p-6 space-y-4">
        <div>
          <h3 className="font-semibold text-[#0B1E66] text-base sm:text-lg mb-1">
            Data Export
          </h3>
          <p className="text-xs sm:text-sm text-[#98A2B3]">
            Export your data for compliance, analysis, or migration purposes
          </p>
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
          <Button
            className="btn btn-primary w-full"
            onClick={() => setExportOrdersOpen(true)}
          >
            <Download className="size-4 mr-2" />
            Export Orders
          </Button>
          <Button
            className="btn btn-primary w-full"
            onClick={() => setExportCustomersOpen(true)}
          >
            <Download className="size-4 mr-2" />
            Export Customers
          </Button>
          <Button
            className="btn btn-primary w-full"
            onClick={() => setExportProductsOpen(true)}
          >
            <Download className="size-4 mr-2" />
            Export Products
          </Button>
          <Button
            className="btn btn-primary w-full"
            onClick={() => setExportTransactionOpen(true)}
          >
            <Download className="size-4 mr-2" />
            Export Transaction
          </Button>
        </div>
      </div>

      <RestoreBackupModal
        isOpen={restoreOpen}
        backup={restoreInfo}
        onClose={() => setRestoreOpen(false)}
      />
      <CreateBackupModal
        isOpen={createOpen}
        onClose={() => setCreateOpen(false)}
      />
      <ExportOrdersDataModal
        isOpen={exportOrdersOpen}
        onClose={() => setExportOrdersOpen(false)}
      />
      <ExportCustomersDataModal
        isOpen={exportCustomersOpen}
        onClose={() => setExportCustomersOpen(false)}
      />
      <ExportProductDataModal
        isOpen={exportProductsOpen}
        onClose={() => setExportProductsOpen(false)}
      />
      <ExportTransactionDataModal
        isOpen={exportTransactionOpen}
        onClose={() => setExportTransactionOpen(false)}
      />
    </div>
  );
}
