import api from "@/lib/api";
import type {
  AccountSettingsUser,
  UpdatePasswordRequest,
  UpdateProfileRequest,
} from "@/types/UserTypes";
import { create } from "zustand";

export type UploadAvatarResult =
  | { ok: true; avatar_url: string }
  | { ok: false; message: string };

type AccountState = {
  account: AccountSettingsUser | null;
  loadingAccount: boolean;
  accountError: string | null;
  updatingProfile: boolean;
  updateProfileError: string | null;
  updatingPassword: boolean;
  updatePasswordError: string | null;
  uploadingAvatar: boolean;
  fetchAccountSettings: () => Promise<boolean>;
  updateProfile: (payload: UpdateProfileRequest) => Promise<boolean>;
  updatePassword: (payload: UpdatePasswordRequest) => Promise<boolean>;
  uploadAvatar: (file: File) => Promise<UploadAvatarResult>;
};

function getApiErrorMessage(err: unknown): string | null {
  if (typeof err !== "object" || err === null) return null;
  const response = (err as { response?: unknown }).response;
  if (typeof response !== "object" || response === null) return null;
  const data = (response as { data?: unknown }).data;
  if (typeof data !== "object" || data === null) return null;
  const message = (data as { message?: unknown }).message;
  return typeof message === "string" ? message : null;
}

export const useAccountStore = create<AccountState>((set, get) => ({
  account: null,
  loadingAccount: false,
  accountError: null,
  updatingProfile: false,
  updateProfileError: null,
  updatingPassword: false,
  updatePasswordError: null,
  uploadingAvatar: false,

  fetchAccountSettings: async () => {
    set({ loadingAccount: true, accountError: null });
    try {
      const { data } = await api.get<{
        status?: string;
        message?: string;
        data?: AccountSettingsUser;
      }>("/api/admin/account-settings");

      if (data?.status !== "success") {
        const message =
          typeof data?.message === "string"
            ? data.message
            : "Failed to load account settings";
        set({ accountError: message });
        return false;
      }

      const account = data?.data ?? null;
      set({ account });
      return true;
    } catch (error: unknown) {
      const message =
        getApiErrorMessage(error) ?? "Failed to load account settings";
      console.error("Error fetching account settings =>", error);
      set({ accountError: message });
      return false;
    } finally {
      set({ loadingAccount: false });
    }
  },

  updateProfile: async (payload: UpdateProfileRequest) => {
    set({ updatingProfile: true, updateProfileError: null });
    try {
      const { data } = await api.put<{
        status?: string;
        message?: string;
        data?: AccountSettingsUser;
      }>("/api/admin/account-settings/profile", payload);

      if (data?.status !== "success") {
        const message =
          typeof data?.message === "string"
            ? data.message
            : "Failed to update profile";
        set({ updateProfileError: message });
        return false;
      }

      const updated = data?.data;
      if (updated) set({ account: updated });
      else await get().fetchAccountSettings();
      return true;
    } catch (error: unknown) {
      const message = getApiErrorMessage(error) ?? "Failed to update profile";
      console.error("Error updating profile =>", error);
      set({ updateProfileError: message });
      return false;
    } finally {
      set({ updatingProfile: false });
    }
  },

  updatePassword: async (payload: UpdatePasswordRequest) => {
    set({ updatingPassword: true, updatePasswordError: null });
    try {
      const { data } = await api.put<{
        status?: string;
        message?: string;
        data?: null;
      }>("/api/admin/account-settings/password", payload);

      if (data?.status !== "success") {
        const message =
          typeof data?.message === "string"
            ? data.message
            : "Failed to update password";
        set({ updatePasswordError: message });
        return false;
      }
      return true;
    } catch (error: unknown) {
      const message = getApiErrorMessage(error) ?? "Failed to update password";
      console.error("Error updating password =>", error);
      set({ updatePasswordError: message });
      return false;
    } finally {
      set({ updatingPassword: false });
    }
  },

  uploadAvatar: async (file: File): Promise<UploadAvatarResult> => {
    set({ uploadingAvatar: true });
    try {
      const formData = new FormData();
      formData.set("avatar", file);

      const res = await fetch("/api/upload/avatar", {
        method: "POST",
        body: formData,
      });

      const json = (await res.json().catch(() => null)) as {
        status?: string;
        message?: string;
        data?: { avatar_url?: string };
        errors?: Record<string, string[]>;
      } | null;

      if (!res.ok) {
        const message =
          (typeof json?.message === "string" && json.message) ||
          (json?.errors?.avatar?.[0]) ||
          "Failed to upload avatar";
        return { ok: false, message };
      }

      if (json?.status !== "success" || !json?.data?.avatar_url) {
        return {
          ok: false,
          message:
            (typeof json?.message === "string" && json.message) ||
            "Failed to upload avatar",
        };
      }

      const avatar_url = json.data.avatar_url;
      const account = get().account;
      if (account) {
        set({ account: { ...account, avatar_url } });
      }
      return { ok: true, avatar_url };
    } catch (error: unknown) {
      const message =
        getApiErrorMessage(error) ?? "Failed to upload avatar";
      console.error("Error uploading avatar =>", error);
      return { ok: false, message };
    } finally {
      set({ uploadingAvatar: false });
    }
  },
}));
