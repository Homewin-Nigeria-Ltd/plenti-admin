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

export type Permission = {
  id: string;
  title: string;
  description: string;
};

const permissions: Permission[] = [
  {
    id: "user-management",
    title: "User Management",
    description: "View and manage customer and admin accounts",
  },
  {
    id: "system-configuration",
    title: "System Configuration",
    description: "Configure system settings and integrations",
  },
  {
    id: "inventory-management",
    title: "Inventory Management",
    description: "Manage warehouse stock and transfers",
  },
  {
    id: "product-management",
    title: "Product Management",
    description: "Add, edit, and delete products",
  },
  {
    id: "order-management",
    title: "Order Management",
    description: "View and process customer orders",
  },
  {
    id: "payment-finance",
    title: "Payment & Finance",
    description: "Handle transactions and refunds",
  },
  {
    id: "analytics-reports",
    title: "Analytics & Reports",
    description: "View business analytics and reports",
  },
  {
    id: "marketing-engagement",
    title: "Marketing & Engagement",
    description: "Manage campaigns and promotions",
  },
  {
    id: "customer-support",
    title: "Customer Support",
    description: "Handle customer tickets and complaints",
  },
];

type CreateRoleModalProps = {
  isOpen: boolean;
  onClose: () => void;
  onSuccess?: (roleData: RoleData) => void;
};

type RoleData = {
  roleName: string;
  description: string;
  permissions: Permission[];
};

export function CreateRoleModal({ isOpen, onClose, onSuccess }: CreateRoleModalProps) {
  const [roleName, setRoleName] = React.useState("");
  const [description, setDescription] = React.useState("");
  const [selectedPermissions, setSelectedPermissions] = React.useState<Set<string>>(new Set());

  const handlePermissionToggle = (permissionId: string) => {
    const newSelected = new Set(selectedPermissions);
    if (newSelected.has(permissionId)) {
      newSelected.delete(permissionId);
    } else {
      newSelected.add(permissionId);
    }
    setSelectedPermissions(newSelected);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const selectedPermissionObjects = permissions.filter((p) =>
      selectedPermissions.has(p.id)
    );
    
    if (onSuccess) {
      onSuccess({
        roleName,
        description,
        permissions: selectedPermissionObjects,
      });
    }
    
    onClose();
    setRoleName("");
    setDescription("");
    setSelectedPermissions(new Set());
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-2xl max-h-[90vh] flex flex-col p-0 w-[95vw] sm:w-full">
        <DialogHeader className="px-4 sm:px-6 pt-4 sm:pt-6 pb-4 border-b border-neutral-100">
          <DialogTitle className="text-xl sm:text-2xl font-semibold">
            Create New Role
          </DialogTitle>
          <DialogDescription className="text-xs sm:text-sm text-neutral-500">
            Define a new role with specific permissions for your team.
          </DialogDescription>
        </DialogHeader>

        <form id="create-role-form" onSubmit={handleSubmit} className="flex-1 overflow-y-auto px-4 sm:px-6 py-4 space-y-4 sm:space-y-6">
          <div className="space-y-2">
            <Label htmlFor="roleName" className="text-sm font-medium text-primary-700">
              Role Name
            </Label>
            <Input
              id="roleName"
              placeholder="Role Name"
              value={roleName}
              onChange={(e) => setRoleName(e.target.value)}
              className="focus-visible:ring-0"
              required
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="description" className="text-sm font-medium text-primary-700">
              Description
            </Label>
            <textarea
              id="description"
              placeholder="Description"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              className="w-full min-h-[100px] rounded-md border border-input bg-transparent px-3 py-2 text-sm shadow-xs transition-[color,box-shadow] outline-none focus-visible:ring-0 resize-none"
              required
            />
          </div>

          <div className="space-y-4">
            <h3 className="font-semibold text-primary-700 text-lg">Permissions</h3>
            <div className="space-y-3 max-h-[400px] overflow-y-auto pr-2">
              {permissions.map((permission) => (
                <div
                  key={permission.id}
                  className="flex items-start gap-3 p-3 rounded-lg border border-neutral-100 hover:bg-neutral-50 transition-colors">
                  <input
                    type="checkbox"
                    id={permission.id}
                    checked={selectedPermissions.has(permission.id)}
                    onChange={() => handlePermissionToggle(permission.id)}
                    className="mt-1 size-4 rounded border-neutral-300 text-primary focus:ring-primary"
                  />
                  <div className="flex-1">
                    <Label
                      htmlFor={permission.id}
                      className="font-medium text-primary-700 text-sm cursor-pointer">
                      {permission.title}
                    </Label>
                    <p className="text-xs text-neutral-500 mt-1">
                      {permission.description}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </form>

        <div className="px-4 sm:px-6 py-4 border-t border-neutral-100">
          <Button type="submit" form="create-role-form" className="bg-primary hover:bg-primary/90 text-white w-full">
            Create Role
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
}
