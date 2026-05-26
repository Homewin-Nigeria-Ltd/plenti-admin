import api from "@/lib/api";
import { PAGE_SIZE } from "@/lib/constant";
import {
  RIDERS_API,
  riderApprovePath,
  riderDetailPath,
  riderRejectPath,
  riderSuspendPath,
} from "@/data/riders";
import {
  filterOnboardingFromRiders,
  filterRidersBySearch,
  normalizeAdminRider,
  normalizeRidersList,
} from "@/lib/normalizeRider";
import type {
  AdminRider,
  CreateRiderPayload,
  CreateRiderResponse,
  RiderDetailResponse,
  RiderListSlice,
  RiderState,
  RidersListResponse,
} from "@/types/RiderTypes";
import { AxiosError } from "axios";
import { create } from "zustand";

function normalizeRidersPayload(data: RidersListResponse): {
  riders: AdminRider[];
  currentPage: number;
  lastPage: number;
  perPage: number;
  totalItems: number;
} {
  const payload = data.data;

  if (Array.isArray(payload)) {
    const riders = normalizeRidersList(payload);
    return {
      riders,
      currentPage: 1,
      lastPage: 1,
      perPage: riders.length || PAGE_SIZE,
      totalItems: riders.length,
    };
  }

  const rows = normalizeRidersList(payload?.data ?? []);
  return {
    riders: rows,
    currentPage: payload?.current_page ?? data.meta?.current_page ?? 1,
    lastPage: payload?.last_page ?? data.meta?.last_page ?? 1,
    perPage: payload?.per_page ?? data.meta?.per_page ?? PAGE_SIZE,
    totalItems: payload?.total ?? data.meta?.total ?? rows.length,
  };
}

function applySearch(
  normalized: ReturnType<typeof normalizeRidersPayload>,
  search: string,
): ReturnType<typeof normalizeRidersPayload> {
  if (!search.trim()) return normalized;
  const riders = filterRidersBySearch(normalized.riders, search);
  return {
    riders,
    currentPage: 1,
    lastPage: 1,
    perPage: riders.length || PAGE_SIZE,
    totalItems: riders.length,
  };
}

const emptyListSlice = (): RiderListSlice => ({
  riders: [],
  loading: false,
  error: null,
  currentPage: 1,
  lastPage: 1,
  perPage: PAGE_SIZE,
  totalItems: 0,
  lastQuery: { page: 1, search: "" },
});

async function requestRiders(
  endpoint: string,
  params: { page: number; search: string },
): Promise<ReturnType<typeof normalizeRidersPayload>> {
  const query: Record<string, string | number> = {
    page: params.page,
    per_page: PAGE_SIZE,
  };
  if (params.search) query.search = params.search;

  const { data } = await api.get<RidersListResponse>(endpoint, { params: query });
  return normalizeRidersPayload(data);
}

export const useRiderStore = create<RiderState>((set, get) => ({
  ...emptyListSlice(),
  onboarding: emptyListSlice(),
  singleRider: null,
  loadingSingle: false,
  suspending: false,
  creatingRider: false,
  reviewingApplication: false,

  fetchRiders: async (params) => {
    const page = params?.page ?? 1;
    const search = params?.search?.trim() ?? "";
    set({ loading: true, error: null, lastQuery: { page, search } });

    try {
      const normalized = applySearch(
        await requestRiders(RIDERS_API.list, { page, search }),
        search,
      );
      set({
        riders: normalized.riders,
        currentPage: normalized.currentPage,
        lastPage: normalized.lastPage,
        perPage: normalized.perPage,
        totalItems: normalized.totalItems,
      });
      return true;
    } catch (error) {
      console.error("Error fetching riders =>", error);
      set({ error: "Failed to fetch riders", riders: [] });
      return false;
    } finally {
      set({ loading: false });
    }
  },

  fetchOnboardingRiders: async (params) => {
    const page = params?.page ?? 1;
    const search = params?.search?.trim() ?? "";
    set((state) => ({
      onboarding: {
        ...state.onboarding,
        loading: true,
        error: null,
        lastQuery: { page, search },
      },
    }));

    try {
      let normalized = applySearch(
        await requestRiders(RIDERS_API.onboarding, { page, search }),
        search,
      );

      if (normalized.riders.length === 0) {
        try {
          const allRiders = await requestRiders(RIDERS_API.list, { page: 1, search: "" });
          const filtered = filterOnboardingFromRiders(allRiders.riders);
          if (filtered.length > 0) {
            normalized = applySearch(
              {
                riders: filtered,
                currentPage: 1,
                lastPage: 1,
                perPage: filtered.length || PAGE_SIZE,
                totalItems: filtered.length,
              },
              search,
            );
          }
        } catch {
          // keep empty onboarding result from primary request
        }
      }

      set((state) => ({
        onboarding: {
          ...state.onboarding,
          riders: normalized.riders,
          currentPage: normalized.currentPage,
          lastPage: normalized.lastPage,
          perPage: normalized.perPage,
          totalItems: normalized.totalItems,
        },
      }));
      return true;
    } catch (error) {
      console.error("Error fetching onboarding riders =>", error);

      try {
        const fallback = applySearch(
          await requestRiders(RIDERS_API.list, { page, search }),
          search,
        );
        const filtered = filterOnboardingFromRiders(fallback.riders);
        const result = applySearch(
          {
            riders: filtered,
            currentPage: 1,
            lastPage: 1,
            perPage: filtered.length || PAGE_SIZE,
            totalItems: filtered.length,
          },
          search,
        );
        set((state) => ({
          onboarding: {
            ...state.onboarding,
            riders: result.riders,
            currentPage: result.currentPage,
            lastPage: result.lastPage,
            perPage: result.perPage,
            totalItems: result.totalItems,
          },
        }));
        return true;
      } catch {
        set((state) => ({
          onboarding: {
            ...state.onboarding,
            error: "Failed to fetch onboarding riders",
            riders: [],
          },
        }));
        return false;
      }
    } finally {
      set((state) => ({
        onboarding: { ...state.onboarding, loading: false },
      }));
    }
  },

  fetchSingleRider: async (id, preview) => {
    set({
      loadingSingle: true,
      singleRider: preview ?? null,
    });

    try {
      const { data } = await api.get<RiderDetailResponse>(riderDetailPath(id));
      if (data?.data) {
        set({ singleRider: normalizeAdminRider(data.data) });
        return true;
      }
    } catch (error) {
      console.error("Error fetching rider profile =>", error);
      const state = get();
      const fromList =
        state.riders.find((r) => r.id === id) ??
        state.onboarding.riders.find((r) => r.id === id) ??
        preview ??
        null;
      if (fromList) {
        set({ singleRider: fromList });
        return true;
      }
      set({ singleRider: null });
      return false;
    } finally {
      set({ loadingSingle: false });
    }

    return false;
  },

  suspendRider: async (id) => {
    set({ suspending: true });
    try {
      const { data } = await api.post<{ status?: string; message?: string }>(
        riderSuspendPath(id),
      );
      if (data?.status === "success") {
        set((state) => ({
          singleRider: state.singleRider
            ? {
                ...state.singleRider,
                status: "suspended",
                rider_status: "suspended",
              }
            : null,
        }));
        return true;
      }
      return false;
    } catch (error) {
      console.error("Error suspending rider =>", error);
      return false;
    } finally {
      set({ suspending: false });
    }
  },

  clearSingleRider: () => set({ singleRider: null, loadingSingle: false }),

  createRider: async (payload) => {
    set({ creatingRider: true });
    try {
      const body = {
        name: payload.name.trim(),
        full_name: payload.name.trim(),
        phone: payload.phone.trim(),
        email: payload.email.trim(),
        ...(payload.vehicle_type ? { vehicle_type: payload.vehicle_type } : {}),
      };

      const { data } = await api.post<CreateRiderResponse>(RIDERS_API.list, body);

      if (data?.status === "success") {
        const { lastQuery } = get();
        const onboardingSearch = get().onboarding.lastQuery.search;
        await get().fetchRiders({ page: 1, search: lastQuery.search });
        await get().fetchOnboardingRiders({ page: 1, search: onboardingSearch });
        return { ok: true, message: data.message };
      }

      return {
        ok: false,
        message: data?.message ?? "Failed to onboard rider",
        errors: data?.errors,
      };
    } catch (error) {
      console.error("Error creating rider =>", error);
      if (error instanceof AxiosError) {
        const apiData = error.response?.data as Partial<CreateRiderResponse> | undefined;
        return {
          ok: false,
          message:
            typeof apiData?.message === "string"
              ? apiData.message
              : "Failed to onboard rider",
          errors: apiData?.errors,
        };
      }
      return { ok: false, message: "Failed to onboard rider" };
    } finally {
      set({ creatingRider: false });
    }
  },

  approveOnboardingRider: async (id) => {
    set({ reviewingApplication: true });
    try {
      const { data } = await api.post<{ status?: string; message?: string }>(
        riderApprovePath(id),
      );
      if (data?.status === "success") {
        const onboardingSearch = get().onboarding.lastQuery.search;
        await get().fetchOnboardingRiders({ page: 1, search: onboardingSearch });
        await get().fetchRiders({ page: 1, search: get().lastQuery.search });
        return true;
      }
      return false;
    } catch (error) {
      console.error("Error approving rider application =>", error);
      return false;
    } finally {
      set({ reviewingApplication: false });
    }
  },

  rejectOnboardingRider: async (id, reason) => {
    set({ reviewingApplication: true });
    try {
      const trimmed = reason.trim();
      const { data } = await api.post<{ status?: string; message?: string }>(
        riderRejectPath(id),
        { reason: trimmed, rejection_reason: trimmed },
      );
      if (data?.status === "success") {
        const onboardingSearch = get().onboarding.lastQuery.search;
        await get().fetchOnboardingRiders({ page: 1, search: onboardingSearch });
        return true;
      }
      return false;
    } catch (error) {
      console.error("Error rejecting rider application =>", error);
      return false;
    } finally {
      set({ reviewingApplication: false });
    }
  },
}));
