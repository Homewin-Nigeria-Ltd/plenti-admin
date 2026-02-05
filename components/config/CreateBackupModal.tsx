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
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { X } from "lucide-react";
import { toast } from "sonner";
import {
  useSystemConfigStore,
  type Backup,
  type CreateBackupPayload,
} from "@/store/useSystemConfigStore";

type CreateBackupModalProps = {
  isOpen: boolean;
  onClose: () => void;
  onSuccess?: (backup: Backup) => void;
};

export default function CreateBackupModal({
  isOpen,
  onClose,
  onSuccess,
}: CreateBackupModalProps) {
  const [name, setName] = React.useState("");
  const [description, setDescription] = React.useState("");
  const [backupType, setBackupType] =
    React.useState<CreateBackupPayload["backup_type"]>("full");

  const createBackup = useSystemConfigStore((s) => s.createBackup);
  const creatingBackup = useSystemConfigStore((s) => s.creatingBackup);

  const reset = () => {
    setName("");
    setDescription("");
    setBackupType("full");
  };

  const handleClose = () => {
    onClose();
    reset();
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim()) {
      toast.error("Please enter a backup name");
      return;
    }
    if (!description.trim()) {
      toast.error("Please enter a description");
      return;
    }

    const result = await createBackup({
      name: name.trim(),
      description: description.trim(),
      backup_type: backupType,
    });

    if (!result.ok) {
      toast.error(result.error);
      return;
    }

    toast.success("Backup created successfully");
    onSuccess?.(result.data);
    handleClose();
  };

  return (
    <Dialog open={isOpen} onOpenChange={(open) => !open && handleClose()}>
      <DialogContent
        className="max-h-[90vh] flex flex-col p-0 w-[95vw] max-w-[557px] sm:w-[557px] sm:max-w-[557px]"
        showCloseButton={false}
      >
        <DialogHeader className="px-4 sm:px-6 pt-4 sm:pt-6 pb-4 border-b border-neutral-100 relative">
          <DialogTitle className="text-xl sm:text-2xl font-semibold">
            Create Backup
          </DialogTitle>
          <DialogDescription className="text-xs sm:text-sm text-neutral-500">
            Create a new backup for your data.
          </DialogDescription>
          <button
            type="button"
            onClick={handleClose}
            aria-label="Close"
            className="absolute top-4 sm:top-6 right-4 sm:right-6 flex items-center justify-center size-[30px] bg-[#E8EEFF] rounded-full"
          >
            <X className="text-[#0B1E66]" size={20} />
          </button>
        </DialogHeader>

        <form
          id="create-backup-form"
          onSubmit={handleSubmit}
          className="flex-1 overflow-y-auto px-4 sm:px-6 py-4 space-y-4 sm:space-y-6"
        >
          <div className="space-y-2">
            <Label htmlFor="backup-name">Backup name</Label>
            <Input
              id="backup-name"
              placeholder="e.g. Daily backup"
              value={name}
              onChange={(e) => setName(e.target.value)}
              className="form-control"
              required
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="backup-desc">Description</Label>
            <Input
              id="backup-desc"
              placeholder="e.g. Daily backup"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              className="form-control"
              required
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="backup-type">Backup type</Label>
            <Select
              value={backupType}
              onValueChange={(v) =>
                setBackupType(v as CreateBackupPayload["backup_type"])
              }
            >
              <SelectTrigger id="backup-type" className="form-control w-full">
                <SelectValue placeholder="Select type" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="full">Full</SelectItem>
                <SelectItem value="incremental">Incremental</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </form>

        <div className="flex items-center justify-end gap-3 px-4 sm:px-6 py-4 border-t border-neutral-100">
          <Button type="button" variant="ghost" onClick={handleClose}>
            Cancel
          </Button>
          <Button
            type="submit"
            form="create-backup-form"
            className="btn btn-primary"
            disabled={creatingBackup}
          >
            {creatingBackup ? "Creating..." : "Create Backup"}
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
}
