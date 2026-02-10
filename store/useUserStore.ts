import api from "@/lib/api";
import { create } from "zustand";
import type {
  AdminSingleUserResponse,
  AdminDetailsResponse,
  AdminUsersResponse,
  ApiValidationError,
  CreateUserRequest,
  CreateUserResponse,
  // CreateUserResult,
  UserState,
} from "@/types/UserTypes";
import { AxiosError } from "axios";

export const useUserStore = create<UserState>((set, get) => ({
  users: [],
  loadingUsers: false,
  loadingSingleUser: false,
  creatingUser: false,
  error: null,
  currentPage: 1,
  lastPage: 1,
  perPage: 15,
  totalItems: 0,
  lastQuery: { page: 1, search: "", role: "customer" },
  singleUser: null,
  singleUserStats: null,
  adminDetails: null,
  loadingAdminDetails: false,
  adminDetailsError: null,

  fetchUsers: async (params) => {
    const page = params?.page ?? 1;
    const search = params?.search?.trim() ?? "";
    const role = params?.role ?? "customer";
    set({ loadingUsers: true, error: null, lastQuery: { page, search, role } });

    try {
      const query: Record<string, string | number> = { page };
      if (search) query.search = search;
      query.role = role;

      const { data } = await api.get<AdminUsersResponse>("/api/admin/users", {
        params: query,
      });

      set({
        users: data.data ?? [],
        currentPage: data.meta?.current_page ?? 1,
        lastPage: data.meta?.last_page ?? 1,
        perPage: data.meta?.per_page ?? 15,
        totalItems: data.meta?.total ?? data.data?.length ?? 0,
      });

      return true;
    } catch (error) {
      console.error("Error fetching users =>", error);
      set({ error: "Failed to fetch users" });
      return false;
    } finally {
      set({ loadingUsers: false });
    }
  },

  fetchSingleUser: async (id) => {
    set({ loadingSingleUser: true, error: null });
    try {
      const { data } = await api.get<AdminSingleUserResponse>(
        `/api/admin/users/${id}`
      );
      set({
        singleUser: data.data ?? null,
        singleUserStats: data.stats ?? null,
      });
      return true;
    } catch (error) {
      console.error("Error fetching single user =>", error);
      set({ error: "Failed to fetch user" });
      return false;
    } finally {
      set({ loadingSingleUser: false });
    }
  },

  fetchAdminDetails: async (id) => {
    set({ loadingAdminDetails: true, adminDetailsError: null });
    try {
      const { data } = await api.get<AdminDetailsResponse>(
        `/api/admin/users/${id}/admin-details`
      );
      set({ adminDetails: data.data ?? null });
      return true;
    } catch (error) {
      console.error("Error fetching admin details =>", error);
      set({ adminDetailsError: "Failed to fetch admin details" });
      return false;
    } finally {
      set({ loadingAdminDetails: false });
    }
  },

  clearSingleUser: () => {
    set({
      singleUser: null,
      singleUserStats: null,
      adminDetails: null,
      adminDetailsError: null,
    });
  },

  createUser: async (payload: CreateUserRequest) => {
    set({ creatingUser: true, error: null });
    try {
      const { data } = await api.post<CreateUserResponse>(
        "/api/admin/users",
        payload
      );

      // Refresh list using last query (show newest on page 1 typically).
      // Keep role/search, reset to page 1 so newly created user is visible.
      // (No frontend math—backend meta stays source of truth.)
      const { lastQuery } = get();
      const nextQuery = { ...lastQuery, page: 1 };
      set({ lastQuery: nextQuery });
      await get().fetchUsers(nextQuery);

      return { ok: true, data };
    } catch (error) {
      console.error("Error creating user =>", error);
      if (error instanceof AxiosError) {
        const apiData = error.response?.data as
          | Partial<ApiValidationError>
          | undefined;
        const message =
          typeof apiData?.message === "string"
            ? apiData.message
            : "Failed to create user";
        const errors =
          apiData?.errors && typeof apiData.errors === "object"
            ? apiData.errors
            : undefined;

        set({ error: message });
        return { ok: false, message, errors };
      }

      set({ error: "Failed to create user" });
      return { ok: false, message: "Failed to create user" };
    } finally {
      set({ creatingUser: false });
    }
  },
}));
