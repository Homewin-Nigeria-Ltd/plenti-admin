import api from "@/lib/api";
import { PAGE_SIZE } from "@/lib/constant";
import {
  RIDERS_API,
  riderApprovePath,
  riderDetailPath,
  riderApplicationReviewPath,
  riderRejectPath,
  riderUnsuspendPath,
  riderSuspendPath,
} from "@/data/riders";
import type {
  AdminRider,
  CreateRiderPayload,
  CreateRiderResponse,
  OnboardingListResponse,
  RiderApplicationReviewResponse,
  RiderDetailResponse,
  RiderListSlice,
  RiderState,
  RidersListResponse,
} from "@/types/RiderTypes";
import { AxiosError } from "axios";
import { create } from "zustand";

function parseOnboardingListResponse(data: OnboardingListResponse): {
  riders: AdminRider[];
  currentPage: number;
  lastPage: number;
  perPage: number;
  totalItems: number;
} {
  const items = data.data?.items ?? [];
  const pagination = data.data?.pagination ?? {};

  return {
    riders: items,
    currentPage: pagination.current_page ?? 1,
    lastPage: pagination.last_page ?? 1,
    perPage: pagination.per_page ?? PAGE_SIZE,
    totalItems: pagination.total ?? items.length,
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

export const useRiderStore = create<RiderState>((set, get) => ({
  ...emptyListSlice(),
  onboarding: emptyListSlice(),
  singleRider: null,
  currentDelivery: null,
  applicationReview: null,
  loadingSingle: false,
  suspending: false,
  creatingRider: false,
  reviewingApplication: false,

  fetchRiders: async (params) => {
    const page = params?.page ?? 1;
    const search = params?.search?.trim() ?? "";
    const rider_status = params?.rider_status?.trim() ?? "";
    set({ loading: true, error: null, lastQuery: { page, search, rider_status } });

    try {
      const query: Record<string, string | number> = {
        page,
        per_page: PAGE_SIZE,
      };
      if (search) query.search = search;
      if (rider_status) query.rider_status = rider_status;

      const { data } = await api.get<RidersListResponse>(RIDERS_API.list, {
        params: query,
      });

      if (data?.status === "success" && data.data) {
        const pagination = data.data.pagination ?? {};
        set({
          riders: data.data.items ?? [],
          currentPage: pagination.current_page ?? 1,
          lastPage: pagination.last_page ?? 1,
          perPage: pagination.per_page ?? PAGE_SIZE,
          totalItems: pagination.total ?? data.data.items?.length ?? 0,
        });
        return true;
      }

      set({ error: "Failed to fetch riders", riders: [] });
      return false;
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
      const query: Record<string, string | number> = { page, per_page: PAGE_SIZE };
      if (search) query.search = search;

      const { data } = await api.get<OnboardingListResponse>(RIDERS_API.onboarding, {
        params: query,
      });
      const parsed = parseOnboardingListResponse(data);

      set((state) => ({
        onboarding: {
          ...state.onboarding,
          riders: parsed.riders,
          currentPage: parsed.currentPage,
          lastPage: parsed.lastPage,
          perPage: parsed.perPage,
          totalItems: parsed.totalItems,
        },
      }));
      return true;
    } catch (error) {
      console.error("Error fetching onboarding riders =>", error);
      set((state) => ({
        onboarding: {
          ...state.onboarding,
          error: "Failed to fetch onboarding riders",
          riders: [],
        },
      }));
      return false;
    } finally {
      set((state) => ({
        onboarding: { ...state.onboarding, loading: false },
      }));
    }
  },

  fetchRiderDetail: async (id) => {
    set({
      loadingSingle: true,
      singleRider: null,
      currentDelivery: null,
      applicationReview: null,
    });
    try {
      const { data } = await api.get<RiderDetailResponse>(riderDetailPath(id));
      if (data?.data?.rider) {
        set({
          singleRider: data.data.rider,
          currentDelivery: data.data.current_delivery ?? null,
        });
        return true;
      }
      return false;
    } catch (error) {
      console.error("Error fetching rider profile =>", error);
      const fromList =
        get().riders.find((r) => r.id === id) ??
        get().onboarding.riders.find((r) => r.id === id) ??
        null;
      if (fromList) {
        set({ singleRider: fromList, currentDelivery: null });
        return true;
      }
      set({ singleRider: null, currentDelivery: null });
      return false;
    } finally {
      set({ loadingSingle: false });
    }
  },

  fetchApplicationReview: async (id) => {
    set({
      loadingSingle: true,
      singleRider: null,
      currentDelivery: null,
      applicationReview: null,
    });
    try {
      const { data } = await api.get<RiderApplicationReviewResponse>(
        riderApplicationReviewPath(id),
      );
      if (data?.data) {
        set({ applicationReview: data.data });
        return true;
      }
      return false;
    } catch (error) {
      console.error("Error fetching rider application review =>", error);
      const fromList = get().onboarding.riders.find((r) => r.id === id) ?? null;
      if (fromList) {
        set({ applicationReview: { rider: fromList, documents: fromList.documents ?? [] } });
        return true;
      }
      set({ applicationReview: null });
      return false;
    } finally {
      set({ loadingSingle: false });
    }
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
                rider_status: "suspended",
                rider_status_label: "Suspended",
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

  unsuspendRider: async (id) => {
    set({ suspending: true });
    try {
      const { data } = await api.post<{ status?: string; message?: string }>(
        riderUnsuspendPath(id),
      );
      if (data?.status === "success") {
        set((state) => ({
          singleRider: state.singleRider
            ? {
                ...state.singleRider,
                rider_status: "active",
                rider_status_label: "Active",
              }
            : null,
        }));
        return true;
      }
      return false;
    } catch (error) {
      console.error("Error unsuspending rider =>", error);
      return false;
    } finally {
      set({ suspending: false });
    }
  },

  clearSingleRider: () =>
    set({
      singleRider: null,
      currentDelivery: null,
      applicationReview: null,
      loadingSingle: false,
    }),

  createRider: async (payload) => {
    set({ creatingRider: true });
    try {
      const body = {
        name: payload.name.trim(),
        full_name: payload.name.trim(),
        phone_number: payload.phone.trim(),
        email: payload.email.trim(),
        ...(payload.vehicle_type ? { vehicle_type: payload.vehicle_type } : {}),
      };

      const { data } = await api.post<CreateRiderResponse>(RIDERS_API.create, body);

      if (data?.status === "success") {
        const { lastQuery } = get();
        const onboardingSearch = get().onboarding.lastQuery.search;
        await get().fetchRiders({
          page: 1,
          search: lastQuery.search,
          rider_status: lastQuery.rider_status,
        });
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
        await get().fetchRiders({
          page: 1,
          search: get().lastQuery.search,
          rider_status: get().lastQuery.rider_status,
        });
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
