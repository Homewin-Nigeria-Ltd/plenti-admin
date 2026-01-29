import api from "@/lib/api";
import type {
  Banner,
  CreateBannerRequest,
  CreateBannerResponse,
  CreatePromoCodeRequest,
  EngagementItem,
  MarketingState,
  PromoCode,
} from "@/types/MarketingTypes";
import { create } from "zustand";

function isRecord(value: unknown): value is Record<string, unknown> {
  return typeof value === "object" && value !== null;
}

function getApiErrorMessage(err: unknown): string | null {
  if (!isRecord(err)) return null;
  const response = (err as { response?: unknown }).response;
  if (!isRecord(response)) return null;
  const data = (response as { data?: unknown }).data;
  if (!isRecord(data)) return null;
  const message = data.message;
  return typeof message === "string" ? message : null;
}

export const useMarketingStore = create<MarketingState>((set, get) => ({
  banners: [],
  loadingBanners: false,
  bannersError: null,
  creatingBanner: false,
  createBannerError: null,

  promoCodes: [],
  loadingPromoCodes: false,
  promoCodesError: null,
  creatingPromoCode: false,
  createPromoCodeError: null,

  engagement: [],
  loadingEngagement: false,
  engagementError: null,

  fetchMarketingBanners: async () => {
    set({ loadingBanners: true, bannersError: null });
    try {
      const { data } = await api.get<{
        status?: string;
        data?: Banner[];
      }>("/api/admin/banners");

      const raw = data?.data;
      const banners = Array.isArray(raw) ? raw : [];

      set({ banners });
      return true;
    } catch (error: unknown) {
      const message = getApiErrorMessage(error) ?? "Failed to fetch banners";
      console.error("Error fetching banners =>", error);
      set({ bannersError: message });
      return false;
    } finally {
      set({ loadingBanners: false });
    }
  },

  createBanner: async (payload: CreateBannerRequest) => {
    set({ creatingBanner: true, createBannerError: null });
    try {
      const { data } = await api.post<CreateBannerResponse>(
        "/api/admin/banners",
        payload
      );
      if (data?.status !== "success") {
        const message =
          typeof data?.message === "string"
            ? data.message
            : "Failed to create banner";
        set({ createBannerError: message });
        return false;
      }
      await get().fetchMarketingBanners();
      return true;
    } catch (error: unknown) {
      const message = getApiErrorMessage(error) ?? "Failed to create banner";
      console.error("Error creating banner =>", error);
      set({ createBannerError: message });
      return false;
    } finally {
      set({ creatingBanner: false });
    }
  },

  fetchMarketingPromoCodes: async () => {
    set({ loadingPromoCodes: true, promoCodesError: null });
    try {
      const { data } = await api.get<{
        status?: string;
        data?: PromoCode[];
      }>("/api/admin/promo-codes");

      const raw = data?.data;
      const promoCodes = Array.isArray(raw) ? raw : [];

      set({ promoCodes });
      return true;
    } catch (error: unknown) {
      const message =
        getApiErrorMessage(error) ?? "Failed to fetch promo codes";
      console.error("Error fetching promo codes =>", error);
      set({ promoCodesError: message });
      return false;
    } finally {
      set({ loadingPromoCodes: false });
    }
  },

  createPromoCode: async (payload: CreatePromoCodeRequest) => {
    set({ creatingPromoCode: true, createPromoCodeError: null });
    try {
      const { data } = await api.post<{
        status?: string;
        message?: string;
        data?: PromoCode;
      }>("/api/admin/promo-codes", payload);

      if (data?.status !== "success") {
        const message =
          typeof data?.message === "string"
            ? data.message
            : "Failed to create promo code";
        set({ createPromoCodeError: message });
        return false;
      }
      await get().fetchMarketingPromoCodes();
      return true;
    } catch (error: unknown) {
      const message =
        getApiErrorMessage(error) ?? "Failed to create promo code";
      console.error("Error creating promo code =>", error);
      set({ createPromoCodeError: message });
      return false;
    } finally {
      set({ creatingPromoCode: false });
    }
  },

  fetchEngagement: async () => {
    set({ loadingEngagement: true, engagementError: null });
    try {
      const { data } = await api.get<{
        data?: EngagementItem[];
        engagement?: EngagementItem[];
      }>("/api/admin/marketing/engagement");

      const raw = data?.data ?? data?.engagement;
      const engagement = Array.isArray(raw) ? raw : [];

      set({ engagement });
      return true;
    } catch (error: unknown) {
      const message =
        getApiErrorMessage(error) ?? "Failed to fetch engagement data";
      console.error("Error fetching engagement =>", error);
      set({ engagementError: message, engagement: [] });
      return false;
    } finally {
      set({ loadingEngagement: false });
    }
  },
}));
