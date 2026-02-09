import api from "@/lib/api";
import type {
  CreateRoleRequest,
  PermissionsByModule,
  Role,
  UpdateRoleRequest,
} from "@/types/RoleTypes";
import { create } from "zustand";

function getApiErrorMessage(err: unknown): string | null {
  if (typeof err !== "object" || err === null) return null;
  const response = (err as { response?: unknown }).response;
  if (typeof response !== "object" || response === null) return null;
  const data = (response as { data?: unknown }).data;
  if (typeof data !== "object" || data === null) return null;
  const message = (data as { message?: unknown }).message;
  return typeof message === "string" ? message : null;
}

export const useRolesStore = create<{
  roles: Role[];
  loadingRoles: boolean;
  rolesError: string | null;
  fetchRoles: () => Promise<boolean>;
  createRole: (payload: CreateRoleRequest) => Promise<boolean>;
  updateRole: (id: number, payload: UpdateRoleRequest) => Promise<boolean>;
  permissionsByModule: PermissionsByModule;
  loadingPermissions: boolean;
  permissionsError: string | null;
  fetchPermissions: () => Promise<boolean>;
}>((set, get) => ({
  roles: [],
  loadingRoles: false,
  rolesError: null,
  permissionsByModule: {},
  loadingPermissions: false,
  permissionsError: null,

  fetchRoles: async () => {
    set({ loadingRoles: true, rolesError: null });
    try {
      const { data } = await api.get<{
        status?: string;
        message?: string;
        data?: Role[];
      }>("/api/admin/roles");

      if (data?.status !== "success") {
        const message =
          typeof data?.message === "string"
            ? data.message
            : "Failed to load roles";
        set({ rolesError: message });
        return false;
      }

      const roles = Array.isArray(data?.data) ? data.data : [];
      set({ roles });
      return true;
    } catch (error: unknown) {
      const message = getApiErrorMessage(error) ?? "Failed to load roles";
      console.error("Error fetching roles =>", error);
      set({ rolesError: message });
      return false;
    } finally {
      set({ loadingRoles: false });
    }
  },

  createRole: async (payload: CreateRoleRequest) => {
    try {
      const { data } = await api.post<{
        status?: string;
        message?: string;
        data?: Role;
      }>("/api/admin/roles", payload);

      if (data?.status !== "success") {
        return false;
      }

      const newRole = data?.data;
      if (newRole) {
        set({ roles: [...get().roles, newRole] });
      } else {
        await get().fetchRoles();
      }
      return true;
    } catch (error: unknown) {
      console.error("Error creating role =>", error);
      return false;
    }
  },

  updateRole: async (id: number, payload: UpdateRoleRequest) => {
    try {
      const { data } = await api.put<{
        status?: string;
        message?: string;
        data?: Role;
      }>(`/api/admin/roles/${id}`, payload);

      if (data?.status !== "success") {
        return false;
      }

      const updated = data?.data;
      if (updated) {
        set({
          roles: get().roles.map((r) => (r.id === id ? updated : r)),
        });
      } else {
        await get().fetchRoles();
      }
      return true;
    } catch (error: unknown) {
      console.error("Error updating role =>", error);
      return false;
    }
  },

  fetchPermissions: async () => {
    set({ loadingPermissions: true, permissionsError: null });
    try {
      const { data } = await api.get<{
        status?: string;
        message?: string;
        data?: PermissionsByModule;
      }>("/api/admin/permissions");

      if (data?.status !== "success") {
        const message =
          typeof data?.message === "string"
            ? data.message
            : "Failed to load permissions";
        set({ permissionsError: message });
        return false;
      }

      const permissionsByModule = data?.data ?? {};
      set({ permissionsByModule });
      return true;
    } catch (error: unknown) {
      const message = getApiErrorMessage(error) ?? "Failed to load permissions";
      console.error("Error fetching permissions =>", error);
      set({ permissionsError: message });
      return false;
    } finally {
      set({ loadingPermissions: false });
    }
  },
}));
