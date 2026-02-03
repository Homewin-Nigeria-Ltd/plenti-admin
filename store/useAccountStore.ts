import api from "@/lib/api";
import type {
  AccountSettingsUser,
  UpdatePasswordRequest,
  UpdateProfileRequest,
} from "@/types/UserTypes";
import { create } from "zustand";

type AccountState = {
  account: AccountSettingsUser | null;
  loadingAccount: boolean;
  accountError: string | null;
  updatingProfile: boolean;
  updateProfileError: string | null;
  updatingPassword: boolean;
  updatePasswordError: string | null;
  fetchAccountSettings: () => Promise<boolean>;
  updateProfile: (payload: UpdateProfileRequest) => Promise<boolean>;
  updatePassword: (payload: UpdatePasswordRequest) => Promise<boolean>;
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
}));
