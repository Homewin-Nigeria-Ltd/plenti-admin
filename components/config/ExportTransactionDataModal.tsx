"use client";

import * as React from "react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Checkbox } from "@/components/ui/checkbox";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { Calendar } from "@/components/ui/calendar";
import { X, CalendarIcon } from "lucide-react";
import { cn } from "@/lib/utils";

const EXPORT_FORMATS = [
  { value: "csv", label: "CSV" },
  { value: "pdf", label: "PDF" },
] as const;

const TRANSACTION_TYPE_OPTIONS = [
  { value: "all", label: "All" },
  { value: "payment", label: "Payment" },
  { value: "refund", label: "Refund" },
  { value: "transfer", label: "Transfer" },
];

const TRANSACTION_STATUS_OPTIONS = [
  { value: "all", label: "All" },
  { value: "successful", label: "Successful" },
  { value: "pending", label: "Pending" },
  { value: "failed", label: "Failed" },
];

const EXPORT_FIELD_IDS = [
  "transactionId",
  "customerId",
  "transactionType",
  "paymentGateway",
  "paymentMethod",
  "settledAt",
  "createdAt",
  "orderId",
  "amount",
  "status",
  "supplier",
] as const;

const EXPORT_FIELD_LABELS: Record<(typeof EXPORT_FIELD_IDS)[number], string> = {
  transactionId: "Transaction ID",
  customerId: "Customer ID",
  transactionType: "Transaction Type",
  paymentGateway: "Payment Gateway",
  paymentMethod: "Payment Method",
  settledAt: "Settled At",
  createdAt: "Created At",
  orderId: "Order ID",
  amount: "Amount (₦)",
  status: "Status",
  supplier: "Supplier",
};

function formatDateDDMMYYYY(date: Date): string {
  const d = date.getDate().toString().padStart(2, "0");
  const m = (date.getMonth() + 1).toString().padStart(2, "0");
  const y = date.getFullYear();
  return `${d}/${m}/${y}`;
}

type ExportTransactionDataModalProps = {
  isOpen: boolean;
  onClose: () => void;
  totalRecords?: number;
};

export default function ExportTransactionDataModal({
  isOpen,
  onClose,
  totalRecords = 5,
}: ExportTransactionDataModalProps) {
  const [format, setFormat] = React.useState<string>("");
  const [startDate, setStartDate] = React.useState<Date | undefined>(undefined);
  const [endDate, setEndDate] = React.useState<Date | undefined>(undefined);
  const [transactionType, setTransactionType] = React.useState("all");
  const [transactionStatus, setTransactionStatus] = React.useState("all");
  const [selectedFields, setSelectedFields] = React.useState<Set<string>>(
    new Set()
  );
  const [startOpen, setStartOpen] = React.useState(false);
  const [endOpen, setEndOpen] = React.useState(false);

  const recordsToExport = totalRecords;
  const selectedCount = selectedFields.size;

  const toggleField = (id: string) => {
    setSelectedFields((prev) => {
      const next = new Set(prev);
      if (next.has(id)) next.delete(id);
      else next.add(id);
      return next;
    });
  };

  const selectAllFields = () => {
    if (selectedFields.size === EXPORT_FIELD_IDS.length) {
      setSelectedFields(new Set());
    } else {
      setSelectedFields(new Set(EXPORT_FIELD_IDS));
    }
  };

  const handleExport = () => {
    onClose();
  };

  return (
    <Dialog open={isOpen} onOpenChange={(open) => !open && onClose()}>
      <DialogContent
        className="max-h-[90vh] flex flex-col p-0 w-[95vw] max-w-[600px] sm:max-w-[600px]"
        showCloseButton={false}
      >
        <DialogHeader className="px-4 sm:px-6 pt-4 sm:pt-6 pb-4 border-b border-neutral-100 relative">
          <DialogTitle className="text-xl sm:text-2xl font-semibold text-[#101928]">
            Export Transaction Data
          </DialogTitle>
          <DialogDescription className="text-sm text-[#667085]">
            Export financial transactions with payment gateway details.
          </DialogDescription>
          <button
            type="button"
            onClick={onClose}
            aria-label="Close"
            className="absolute top-4 right-4 sm:top-6 sm:right-6 flex items-center justify-center size-[30px] bg-[#E8EEFF] rounded-full"
          >
            <X className="size-4 text-[#0B1E66]" />
          </button>
        </DialogHeader>

        <div className="flex-1 overflow-y-auto px-4 sm:px-6 py-4 space-y-5">
          <div className="space-y-2">
            <Label className="text-sm font-medium">Export Format</Label>
            <Select value={format} onValueChange={setFormat}>
              <SelectTrigger className="w-full form-control">
                <SelectValue placeholder="Select Export Format" />
              </SelectTrigger>
              <SelectContent>
                {EXPORT_FORMATS.map((f) => (
                  <SelectItem key={f.value} value={f.value}>
                    {f.label}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <div className="space-y-2">
            <Label className="text-sm font-medium">
              Date Range (Optional)
            </Label>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <div className="space-y-1.5">
                <Label className="text-xs text-[#667085]">Start Date</Label>
                <Popover open={startOpen} onOpenChange={setStartOpen}>
                  <PopoverTrigger asChild>
                    <Button
                      variant="outline"
                      className={cn(
                        "w-full justify-start text-left font-normal form-control",
                        !startDate && "text-muted-foreground"
                      )}
                    >
                      <CalendarIcon className="mr-2 size-4" />
                      {startDate
                        ? formatDateDDMMYYYY(startDate)
                        : "dd/mm/yyyy"}
                    </Button>
                  </PopoverTrigger>
                  <PopoverContent className="w-auto p-0" align="start">
                    <Calendar
                      mode="single"
                      selected={startDate}
                      onSelect={(d) => {
                        setStartDate(d);
                        setStartOpen(false);
                      }}
                    />
                  </PopoverContent>
                </Popover>
              </div>
              <div className="space-y-1.5">
                <Label className="text-xs text-[#667085]">End Date</Label>
                <Popover open={endOpen} onOpenChange={setEndOpen}>
                  <PopoverTrigger asChild>
                    <Button
                      variant="outline"
                      className={cn(
                        "w-full justify-start text-left font-normal form-control",
                        !endDate && "text-muted-foreground"
                      )}
                    >
                      <CalendarIcon className="mr-2 size-4" />
                      {endDate ? formatDateDDMMYYYY(endDate) : "dd/mm/yyyy"}
                    </Button>
                  </PopoverTrigger>
                  <PopoverContent className="w-auto p-0" align="start">
                    <Calendar
                      mode="single"
                      selected={endDate}
                      onSelect={(d) => {
                        setEndDate(d);
                        setEndOpen(false);
                      }}
                    />
                  </PopoverContent>
                </Popover>
              </div>
            </div>
          </div>

          <div className="space-y-2">
            <Label className="text-sm font-medium">Filters</Label>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <div className="space-y-1.5">
                <Label className="text-xs text-[#667085]">Transaction Type</Label>
                <Select
                  value={transactionType}
                  onValueChange={setTransactionType}
                >
                  <SelectTrigger className="w-full form-control">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    {TRANSACTION_TYPE_OPTIONS.map((o) => (
                      <SelectItem key={o.value} value={o.value}>
                        {o.label}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              <div className="space-y-1.5">
                <Label className="text-xs text-[#667085]">
                  Transaction Status
                </Label>
                <Select
                  value={transactionStatus}
                  onValueChange={setTransactionStatus}
                >
                  <SelectTrigger className="w-full form-control">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    {TRANSACTION_STATUS_OPTIONS.map((o) => (
                      <SelectItem key={o.value} value={o.value}>
                        {o.label}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            </div>
          </div>

          <div className="space-y-2">
            <div className="flex items-center justify-between">
              <Label className="text-sm font-medium">Select Fields</Label>
              <button
                type="button"
                onClick={selectAllFields}
                className="text-sm font-medium text-[#0B1E66] hover:underline"
              >
                Select All
              </button>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 rounded-lg border border-[#EAECF0] p-3">
              {EXPORT_FIELD_IDS.map((id) => (
                <label
                  key={id}
                  className="flex items-center gap-2 cursor-pointer"
                >
                  <Checkbox
                    checked={selectedFields.has(id)}
                    onCheckedChange={() => toggleField(id)}
                  />
                  <span className="text-sm text-[#344054]">
                    {EXPORT_FIELD_LABELS[id]}
                  </span>
                </label>
              ))}
            </div>
          </div>

          <div className="rounded-lg bg-[#F9FAFB] border border-[#EAECF0] px-4 py-3 text-sm text-[#667085]">
            <p>
              <span className="font-medium text-[#344054]">Records to export:</span>{" "}
              {recordsToExport} of {recordsToExport}
            </p>
            <p>
              <span className="font-medium text-[#344054]">Selected fields:</span>{" "}
              {selectedCount} {selectedCount === 1 ? "field" : "fields"}
            </p>
          </div>
        </div>

        <div className="flex items-center justify-end gap-3 px-4 sm:px-6 py-4 border-t border-neutral-100">
          <Button type="button" variant="outline" onClick={onClose}>
            Cancel
          </Button>
          <Button
            type="button"
            className="btn btn-primary"
            onClick={handleExport}
          >
            Export CSV
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
}
