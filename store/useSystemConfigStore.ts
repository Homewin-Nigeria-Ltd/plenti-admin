"use client";

import { create } from "zustand";
import api from "@/lib/api";

function getApiErrorMessage(error: unknown): string | null {
  if (typeof error !== "object" || error === null) return null;
  const err = error as { response?: { data?: { message?: unknown } } };
  const message = err.response?.data?.message;
  return typeof message === "string" ? message : null;
}

export type Backup = {
  id: number;
  name: string;
  filename: string;
  path: string;
  size: number;
  type: string;
  status: string;
  created_by: number;
  notes: string | null;
  completed_at: string | null;
  created_at: string;
  updated_at: string;
  creator?: { id: number; name: string; email: string; avatar_url: string | null } | null;
};

export type BackupsPagination = {
  currentPage: number;
  lastPage: number;
  perPage: number;
  total: number;
};

export type CreateBackupPayload = {
  name: string;
  description: string;
  backup_type: "full" | "incremental";
};

type BackupsApiResponse = {
  status?: string;
  message?: string;
  data?: {
    current_page?: number;
    data?: Backup[];
    last_page?: number;
    per_page?: number;
    total?: number;
  };
};

type CreateBackupApiResponse = {
  status?: string;
  message?: string;
  data?: Backup;
};

type CreateBackupResult =
  | { ok: true; data: Backup }
  | { ok: false; error: string };

export const useSystemConfigStore = create<{
  backups: Backup[];
  backupsPagination: BackupsPagination | null;
  loadingBackups: boolean;
  backupsError: string | null;
  creatingBackup: boolean;
  fetchBackups: (page?: number) => Promise<boolean>;
  createBackup: (payload: CreateBackupPayload) => Promise<CreateBackupResult>;
}>((set, get) => ({
  backups: [],
  backupsPagination: null,
  loadingBackups: false,
  backupsError: null,
  creatingBackup: false,

  fetchBackups: async (page = 1) => {
    set({ loadingBackups: true, backupsError: null });
    try {
      const { data } = await api.get<BackupsApiResponse>("/api/admin/backups", {
        params: { page },
      });

      if (data?.status !== "success" || !data.data) {
        const message =
          typeof data?.message === "string"
            ? data.message
            : "Failed to load backups";
        set({ backupsError: message, loadingBackups: false });
        return false;
      }

      const list = Array.isArray(data.data.data) ? data.data.data : [];
      set({
        backups: list,
        backupsPagination: {
          currentPage: data.data.current_page ?? 1,
          lastPage: data.data.last_page ?? 1,
          perPage: data.data.per_page ?? Math.max(list.length, 1),
          total: data.data.total ?? list.length,
        },
        loadingBackups: false,
      });
      return true;
    } catch (error) {
      const message = getApiErrorMessage(error) ?? "Failed to load backups";
      set({ backupsError: message, loadingBackups: false });
      return false;
    }
  },

  createBackup: async (payload) => {
    set({ creatingBackup: true });
    try {
      const { data } = await api.post<CreateBackupApiResponse>(
        "/api/admin/backups",
        payload
      );

      if (data?.status !== "success" || !data.data) {
        return {
          ok: false,
          error: typeof data?.message === "string" ? data.message : "Failed to create backup",
        };
      }

      const currentPage = get().backupsPagination?.currentPage ?? 1;
      await get().fetchBackups(currentPage);
      return { ok: true, data: data.data };
    } catch (error) {
      return {
        ok: false,
        error: getApiErrorMessage(error) ?? "Failed to create backup",
      };
    } finally {
      set({ creatingBackup: false });
    }
  },
}));
