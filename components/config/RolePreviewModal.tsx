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
import { User } from "lucide-react";
import type { Permission } from "./CreateRoleModal";

type RolePreviewModalProps = {
  isOpen: boolean;
  onClose: () => void;
  roleName: string;
  description: string;
  permissions: Permission[];
  userCount?: number;
  onEdit?: () => void;
};

export function RolePreviewModal({
  isOpen,
  onClose,
  roleName,
  description,
  permissions,
  userCount = 0,
  onEdit,
}: RolePreviewModalProps) {
  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-2xl max-h-[90vh] flex flex-col p-0 w-[95vw] sm:w-full">
        <DialogHeader className="px-4 sm:px-6 pt-4 sm:pt-6 pb-4 border-b border-neutral-100">
          <DialogTitle className="text-xl sm:text-2xl font-semibold">
            {roleName}
          </DialogTitle>
          <DialogDescription className="text-xs sm:text-sm text-neutral-500">
            View role details, permissions, and assigned users.
          </DialogDescription>
        </DialogHeader>

        <div className="flex-1 overflow-y-auto px-4 sm:px-6 py-4 space-y-4 sm:space-y-6">
          <div className="space-y-4">
            <h3 className="font-semibold text-primary-700 text-base sm:text-lg">Permissions</h3>
            <div className="space-y-3 max-h-[300px] sm:max-h-[400px] overflow-y-auto pr-2">
              {permissions.map((permission) => (
                <div
                  key={permission.id}
                  className="flex items-start gap-3 p-3 rounded-lg border border-neutral-100 bg-neutral-50">
                  <input
                    type="checkbox"
                    checked
                    readOnly
                    className="mt-1 size-4 rounded border-neutral-300 text-primary focus:ring-primary"
                  />
                  <div className="flex-1">
                    <p className="font-medium text-primary-700 text-sm">
                      {permission.title}
                    </p>
                    <p className="text-xs text-neutral-500 mt-1">
                      {permission.description}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </div>

          <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-2 pt-4 border-t border-neutral-100">
            <div className="flex items-center gap-2">
              <User className="size-4 text-neutral-500" />
              <span className="text-xs sm:text-sm text-neutral-700">
                User with this role ({userCount})
              </span>
            </div>
            <button className="text-xs sm:text-sm text-primary hover:underline font-medium">
              View User
            </button>
          </div>
        </div>

        <div className="px-4 sm:px-6 py-4 border-t border-neutral-100 flex flex-col sm:flex-row items-stretch sm:items-center gap-3 sm:gap-4">
          <Button
            type="button"
            variant="outline"
            onClick={onEdit}
            className="flex-1 border-primary text-primary order-2 sm:order-1">
            Edit Role
          </Button>
          <Button
            type="button"
            onClick={onClose}
            className="flex-1 bg-primary hover:bg-primary/90 text-white order-1 sm:order-2">
            Close
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
}
