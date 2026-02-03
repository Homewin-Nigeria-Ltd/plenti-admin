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
import { X } from "lucide-react";
import { Skeleton } from "@/components/ui/skeleton";
import { useRolesStore } from "@/store/useRolesStore";
import type { PermissionItem } from "@/types/RoleTypes";

/** Display type for role preview (used by RolePreviewModal) */
export type Permission = {
  id: string;
  title: string;
  description: string;
};

type CreateRoleModalProps = {
  isOpen: boolean;
  onClose: () => void;
  onSuccess?: (roleData: RoleData) => void;
};

type RoleData = {
  roleName: string;
  description: string;
  permissions: Permission[];
  permissionIds: number[];
};

function capitalizeModule(moduleKey: string): string {
  return moduleKey.charAt(0).toUpperCase() + moduleKey.slice(1);
}

export function CreateRoleModal({
  isOpen,
  onClose,
  onSuccess,
}: CreateRoleModalProps) {
  const {
    permissionsByModule,
    loadingPermissions,
    permissionsError,
    fetchPermissions,
  } = useRolesStore();
  const [roleName, setRoleName] = React.useState("");
  const [description, setDescription] = React.useState("");
  const [selectedPermissionIds, setSelectedPermissionIds] = React.useState<
    Set<number>
  >(new Set());

  React.useEffect(() => {
    if (isOpen) {
      fetchPermissions();
    }
  }, [isOpen, fetchPermissions]);

  const handlePermissionToggle = (permissionId: number) => {
    setSelectedPermissionIds((prev) => {
      const next = new Set(prev);
      if (next.has(permissionId)) next.delete(permissionId);
      else next.add(permissionId);
      return next;
    });
  };

  const handleModuleToggle = (modulePermissions: PermissionItem[]) => {
    const ids = modulePermissions.map((p) => p.id);
    const allSelected = ids.every((id) => selectedPermissionIds.has(id));
    setSelectedPermissionIds((prev) => {
      const next = new Set(prev);
      if (allSelected) ids.forEach((id) => next.delete(id));
      else ids.forEach((id) => next.add(id));
      return next;
    });
  };

  const moduleEntries = React.useMemo(
    () =>
      Object.entries(permissionsByModule).sort(([a], [b]) =>
        a.localeCompare(b)
      ),
    [permissionsByModule]
  );

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const permissionIds = Array.from(selectedPermissionIds);
    const permissionsForPreview: Permission[] = moduleEntries.flatMap(
      ([, perms]) =>
        perms
          .filter((p) => selectedPermissionIds.has(p.id))
          .map((p) => ({
            id: String(p.id),
            title: p.name,
            description: p.description ?? p.module ?? "",
          }))
    );
    if (onSuccess) {
      onSuccess({
        roleName,
        description,
        permissions: permissionsForPreview,
        permissionIds,
      });
    }
    onClose();
    setRoleName("");
    setDescription("");
    setSelectedPermissionIds(new Set());
  };

  const handleClose = () => {
    onClose();
    setRoleName("");
    setDescription("");
    setSelectedPermissionIds(new Set());
  };

  return (
    <Dialog open={isOpen} onOpenChange={(open) => !open && handleClose()}>
      <DialogContent
        className="max-h-[90vh] flex flex-col p-0 w-[95vw] max-w-[557px]! sm:w-[557px]! sm:max-w-[557px]!"
        showCloseButton={false}
      >
        <DialogHeader className="px-4 sm:px-6 pt-4 sm:pt-6 pb-4 border-b border-neutral-100 relative">
          <DialogTitle className="text-xl sm:text-2xl font-semibold">
            Create New Role
          </DialogTitle>
          <DialogDescription className="text-xs sm:text-sm text-neutral-500">
            Define a new role with specific permissions for your team.
          </DialogDescription>
          <button
            type="button"
            onClick={handleClose}
            aria-label="Close dialog"
            className="absolute top-4 sm:top-6 right-4 sm:right-6 flex items-center justify-center size-[30px] bg-[#E8EEFF] rounded-full"
          >
            <X color="#0B1E66" size={20} cursor="pointer" />
          </button>
        </DialogHeader>

        <form
          id="create-role-form"
          onSubmit={handleSubmit}
          className="flex-1 overflow-y-auto px-4 sm:px-6 py-4 space-y-4 sm:space-y-6"
        >
          <div className="space-y-2">
            <Label
              htmlFor="roleName"
              className="text-sm font-medium text-primary-700"
            >
              Role Name
            </Label>
            <Input
              id="roleName"
              placeholder="Role Name"
              value={roleName}
              onChange={(e) => setRoleName(e.target.value)}
              className="form-control"
              required
            />
          </div>

          <div className="space-y-2">
            <Label
              htmlFor="description"
              className="text-sm font-medium text-primary-700"
            >
              Description
            </Label>
            <textarea
              id="description"
              placeholder="Description"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              className="form-control w-full h-auto! min-h-[100px] resize-none"
              required
            />
          </div>

          <div className="space-y-4">
            <h3 className="font-semibold text-primary-700 text-lg">
              Permissions
            </h3>
            {loadingPermissions ? (
              <div className="space-y-4 max-h-[400px] overflow-y-auto pr-2">
                {[1, 2, 3].map((moduleIdx) => (
                  <div key={moduleIdx} className="space-y-2">
                    <div className="flex items-center gap-3 py-1">
                      <Skeleton className="size-4 rounded shrink-0" />
                      <Skeleton className="h-4 w-24" />
                    </div>
                    <div className="pl-7 space-y-2">
                      {[1, 2, 3].map((permIdx) => (
                        <div
                          key={permIdx}
                          className="flex items-start gap-3 p-3 rounded-lg border border-neutral-100"
                        >
                          <Skeleton className="mt-1 size-4 rounded shrink-0" />
                          <div className="flex-1 space-y-2">
                            <Skeleton className="h-4 w-32" />
                            <Skeleton className="h-3 w-24" />
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                ))}
              </div>
            ) : permissionsError ? (
              <p className="text-sm text-red-600 py-4">{permissionsError}</p>
            ) : moduleEntries.length === 0 ? (
              <p className="text-sm text-neutral-500 py-4">
                No permissions available
              </p>
            ) : (
              <div className="space-y-4 max-h-[400px] overflow-y-auto pr-2">
                {moduleEntries.map(([moduleKey, perms]) => {
                  const allSelected = perms.every((p) =>
                    selectedPermissionIds.has(p.id)
                  );
                  const someSelected = perms.some((p) =>
                    selectedPermissionIds.has(p.id)
                  );
                  const indeterminate = someSelected && !allSelected;
                  return (
                    <div key={moduleKey} className="space-y-2">
                      <div className="flex items-center gap-3 py-1">
                        <input
                          type="checkbox"
                          id={`module-${moduleKey}`}
                          checked={allSelected}
                          ref={(el) => {
                            if (el) el.indeterminate = indeterminate;
                          }}
                          onChange={() => handleModuleToggle(perms)}
                          className="size-4 rounded border-neutral-300 text-primary focus:ring-primary"
                        />
                        <Label
                          htmlFor={`module-${moduleKey}`}
                          className="font-semibold text-primary-700 text-sm cursor-pointer capitalize"
                        >
                          {capitalizeModule(moduleKey)}
                        </Label>
                      </div>
                      <div className="pl-7 space-y-2">
                        {perms.map((permission) => (
                          <div
                            key={permission.id}
                            className="flex items-start gap-3 p-3 rounded-lg border border-neutral-100 hover:bg-neutral-50 transition-colors"
                          >
                            <input
                              type="checkbox"
                              id={`perm-${permission.id}`}
                              checked={selectedPermissionIds.has(permission.id)}
                              onChange={() =>
                                handlePermissionToggle(permission.id)
                              }
                              className="mt-1 size-4 rounded border-neutral-300 text-primary focus:ring-primary"
                            />
                            <div className="flex-1">
                              <Label
                                htmlFor={`perm-${permission.id}`}
                                className="font-medium text-primary-700 text-sm cursor-pointer"
                              >
                                {permission.name}
                              </Label>
                              {(permission.description ?? permission.slug) && (
                                <p className="text-xs text-neutral-500 mt-1">
                                  {permission.description?.replaceAll(
                                    ".",
                                    " "
                                  ) ?? permission.slug.replaceAll(".", " ")}
                                </p>
                              )}
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>
                  );
                })}
              </div>
            )}
          </div>
        </form>

        <div className="px-4 sm:px-6 py-4 border-t border-neutral-100">
          <Button
            type="submit"
            form="create-role-form"
            className="btn btn-primary w-full"
            disabled={loadingPermissions}
          >
            Create Role
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
}
