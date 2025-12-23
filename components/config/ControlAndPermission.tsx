"use client";

import * as React from "react";
import { Button } from "@/components/ui/button";
import { Plus } from "lucide-react";
import { CreateRoleModal, type Permission } from "./CreateRoleModal";
import { RolePreviewModal } from "./RolePreviewModal";

type RoleData = {
  roleName: string;
  description: string;
  permissions: Permission[];
};

type Role = {
  id: string;
  title: string;
  description: string;
  permissions: string[];
  additionalCount?: number;
};

const roles: Role[] = [
  {
    id: "super-admin",
    title: "Super Admin",
    description: "Full system access including user management, system configuration, and all operations",
    permissions: ["User Management", "System Configuration"],
    additionalCount: 7,
  },
  {
    id: "admin",
    title: "Admin",
    description: "Manage products, orders, inventory, and customer support (no system configuration access)",
    permissions: ["Inventory Management"],
    additionalCount: 7,
  },
  {
    id: "warehouse-manager",
    title: "Warehouse Manager",
    description: "Inventory management, stock transfers, and order fulfillment only",
    permissions: ["Inventory Management", "Order Management"],
  },
  {
    id: "support-lead",
    title: "Support Lead",
    description: "Customer support tickets, refunds, and user account management",
    permissions: ["Inventory Management", "Order Management"],
  },
  {
    id: "support-agent",
    title: "Support Agent",
    description: "Customer support tickets, refunds, and user account management",
    permissions: ["Inventory Management", "Order Management"],
  },
];

export default function ControlAndPermission() {
  const [isCreateModalOpen, setIsCreateModalOpen] = React.useState(false);
  const [isPreviewModalOpen, setIsPreviewModalOpen] = React.useState(false);
  const [previewRoleData, setPreviewRoleData] = React.useState<RoleData | null>(null);

  const handleRoleCreated = (roleData: RoleData) => {
    setPreviewRoleData(roleData);
    setIsPreviewModalOpen(true);
  };

  return (
    <div className="space-y-4 sm:space-y-6">
      <div className="flex justify-end">
        <Button
          onClick={() => setIsCreateModalOpen(true)}
          className="bg-primary hover:bg-primary/90 text-white w-full sm:w-auto">
          <Plus className="size-4 mr-2" />
          Create New Role
        </Button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6">
        {roles.map((role) => (
          <div
            key={role.id}
            className="bg-white rounded-lg border border-neutral-100 shadow-sm p-4 sm:p-6 hover:shadow-md transition-shadow">
            <h3 className="font-semibold text-primary-700 text-base sm:text-lg mb-2">
              {role.title}
            </h3>
            <p className="text-xs sm:text-sm text-neutral-500 mb-3 sm:mb-4">
              {role.description}
            </p>
            <div className="flex flex-wrap gap-2">
              {role.permissions.map((permission, index) => (
                <span
                  key={index}
                  className="badge badge-secondary">
                  {permission}
                </span>
              ))}
              {role.additionalCount && (
                <span className="badge badge-secondary">
                  +{role.additionalCount}...
                </span>
              )}
            </div>
          </div>
        ))}
      </div>

      <CreateRoleModal
        isOpen={isCreateModalOpen}
        onClose={() => setIsCreateModalOpen(false)}
        onSuccess={handleRoleCreated}
      />

      {previewRoleData && (
        <RolePreviewModal
          isOpen={isPreviewModalOpen}
          onClose={() => setIsPreviewModalOpen(false)}
          roleName={previewRoleData.roleName}
          description={previewRoleData.description}
          permissions={previewRoleData.permissions}
          userCount={0}
          onEdit={() => {
            setIsPreviewModalOpen(false);
            setIsCreateModalOpen(true);
          }}
        />
      )}
    </div>
  );
}
