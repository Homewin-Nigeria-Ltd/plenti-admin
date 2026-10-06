"use client";

import * as React from "react";
import { Button } from "@/components/ui/button";
import {
  AlertDialog,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import { Loader2, Plus } from "lucide-react";
import { toast } from "sonner";
import { useRolesStore } from "@/store/useRolesStore";
import type { Role } from "@/types/RoleTypes";
import {
  CreateUpdateRoleModal,
  type Permission,
} from "./CreateUpdateRoleModal";
import { RolePreviewModal } from "./RolePreviewModal";

type RoleData = {
  roleName: string;
  description: string;
  permissions: Permission[];
};

const PERMISSIONS_SHOWN = 4;

function roleToPreviewPermissions(role: Role): Permission[] {
  return role.permissions.map((p) => ({
    id: String(p.id),
    title: p.name,
    description: p.description ?? p.module ?? "",
  }));
}

export default function ControlAndPermission() {
  const { roles, loadingRoles, rolesError, fetchRoles, deleteRole, deletingRole } =
    useRolesStore();
  const [isCreateModalOpen, setIsCreateModalOpen] = React.useState(false);
  const [isPreviewModalOpen, setIsPreviewModalOpen] = React.useState(false);
  const [previewRoleData, setPreviewRoleData] = React.useState<RoleData | null>(
    null,
  );
  const [selectedRole, setSelectedRole] = React.useState<Role | null>(null);
  const [editingRole, setEditingRole] = React.useState<Role | null>(null);
  const [roleToDelete, setRoleToDelete] = React.useState<Role | null>(null);

  React.useEffect(() => {
    fetchRoles();
  }, [fetchRoles]);

  const handleRoleCreated = (roleData: RoleData) => {
    setPreviewRoleData(roleData);
    setSelectedRole(null);
    setEditingRole(null);
    setIsPreviewModalOpen(true);
  };

  const openPreview = (role: Role) => {
    setSelectedRole(role);
    setPreviewRoleData({
      roleName: role.name,
      description: role.description,
      permissions: roleToPreviewPermissions(role),
    });
    setIsPreviewModalOpen(true);
  };

  const closePreview = () => {
    setIsPreviewModalOpen(false);
    setPreviewRoleData(null);
    setSelectedRole(null);
  };

  const openCreateModal = () => {
    setEditingRole(null);
    setIsCreateModalOpen(true);
  };

  const openEditModal = (role: Role) => {
    closePreview();
    setEditingRole(role);
    setIsCreateModalOpen(true);
  };

  const closeCreateModal = () => {
    setIsCreateModalOpen(false);
    setEditingRole(null);
  };

  const handleDeleteConfirm = async () => {
    if (!roleToDelete) return;
    const success = await deleteRole(roleToDelete.id);
    if (success) {
      toast.success(`${roleToDelete.name} has been deleted`);
      if (selectedRole?.id === roleToDelete.id) closePreview();
      setRoleToDelete(null);
    }
  };

  return (
    <div className="space-y-4 sm:space-y-6">
      <div className="flex justify-end">
        <Button
          onClick={openCreateModal}
          className="btn btn-primary w-full sm:w-auto"
        >
          <Plus className="size-4 mr-2" />
          Create New Role
        </Button>
      </div>

      {loadingRoles ? (
        <p className="text-center py-8 text-[#667085]">Loading roles…</p>
      ) : rolesError ? (
        <p className="text-center py-8 text-red-600">{rolesError}</p>
      ) : roles.length === 0 ? (
        <p className="text-center py-8 text-[#667085]">No roles available</p>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6">
          {roles.map((role) => {
            const permissionNames = role.permissions.map((p) => p.name);
            const shown = permissionNames.slice(0, PERMISSIONS_SHOWN);
            const restCount = permissionNames.length - PERMISSIONS_SHOWN;
            return (
              <div
                key={role.id}
                role="button"
                tabIndex={0}
                onClick={() => openPreview(role)}
                onKeyDown={(e) => {
                  if (e.key === "Enter" || e.key === " ") {
                    e.preventDefault();
                    openPreview(role);
                  }
                }}
                className="bg-white rounded-lg border border-[#EAECF0] p-4 sm:p-6 cursor-pointer hover:border-[#0B1E66]/30 transition-colors text-left h-fit"
              >
                <div className="flex items-start justify-between gap-3 mb-2">
                  <h3 className="font-semibold text-primary-700 text-base sm:text-lg">
                    {role.name}
                  </h3>
                  <button
                    type="button"
                    onClick={(e) => {
                      e.stopPropagation();
                      setRoleToDelete(role);
                    }}
                    className="shrink-0 text-sm font-medium text-red-600 hover:text-red-700"
                  >
                    Delete
                  </button>
                </div>
                <p className="text-xs sm:text-sm text-neutral-500 mb-3 sm:mb-4">
                  {role.description}
                </p>
                <p className="text-xs text-neutral-500 mb-3">
                  Users with this role ({role.users_count ?? 0})
                </p>
                <div className="flex flex-wrap gap-2">
                  {shown.map((name, index) => (
                    <span key={index} className="badge badge-secondary">
                      {name}
                    </span>
                  ))}
                  {restCount > 0 && (
                    <span className="badge badge-secondary">
                      +{restCount}...
                    </span>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      )}

      <CreateUpdateRoleModal
        isOpen={isCreateModalOpen}
        onClose={closeCreateModal}
        onSuccess={handleRoleCreated}
        editRole={editingRole}
      />

      {previewRoleData && (
        <RolePreviewModal
          isOpen={isPreviewModalOpen}
          onClose={closePreview}
          roleName={previewRoleData.roleName}
          description={previewRoleData.description}
          permissions={previewRoleData.permissions}
          userCount={selectedRole?.users_count ?? 0}
          onEdit={() => selectedRole && openEditModal(selectedRole)}
        />
      )}

      <AlertDialog
        open={roleToDelete != null}
        onOpenChange={(open) => {
          if (!open && deletingRole) return;
          if (!open) setRoleToDelete(null);
        }}
      >
        <AlertDialogContent className="rounded-[12px] border-0 p-6 sm:max-w-md">
          <AlertDialogHeader>
            <AlertDialogTitle className="text-center text-[#0B1E66] text-[18px]">
              Delete {roleToDelete?.name}?
            </AlertDialogTitle>
            <AlertDialogDescription className="sr-only">
              Confirm role deletion
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter className="flex flex-row gap-3 sm:justify-center">
            <AlertDialogCancel
              disabled={deletingRole}
              className="rounded-[8px] h-12 border border-[#0B1E66] bg-transparent text-[#0B1E66] hover:bg-gray-50"
            >
              Cancel
            </AlertDialogCancel>
            <Button
              type="button"
              variant="destructive"
              disabled={deletingRole}
              className="rounded-[8px] h-12"
              onClick={() => void handleDeleteConfirm()}
            >
              {deletingRole ? (
                <span className="inline-flex items-center gap-2">
                  <Loader2 className="size-4 animate-spin" />
                  Deleting…
                </span>
              ) : (
                "Delete Role"
              )}
            </Button>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
}
