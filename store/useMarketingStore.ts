import api from "@/lib/api";
import type {
  Banner,
  CreateBannerRequest,
  CreateBannerResponse,
  CreateFaqRequest,
  CreatePromoCodeRequest,
  EngagementItem,
  Faq,
  MarketingState,
  PromoCode,
} from "@/types/MarketingTypes";
import { AxiosError } from "axios";
import { toast } from "sonner";
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
  updatingBanner: false,
  updateBannerError: null,
  deletingBanner: false,
  deleteBannerError: null,

  promoCodes: [],
  loadingPromoCodes: false,
  promoCodesError: null,
  creatingPromoCode: false,
  createPromoCodeError: null,
  updatingPromoCode: false,
  updatePromoCodeError: null,

  faqs: [],
  loadingFaqs: false,
  faqsError: null,
  creatingFaq: false,
  createFaqError: null,
  updatingFaq: false,
  updateFaqError: null,
  deletingFaq: false,
  deleteFaqError: null,

  engagement: [],
  loadingEngagement: false,
  engagementError: null,

  fetchMarketingBanners: async (page = 1, search?: string) => {
    set({ loadingBanners: true, bannersError: null });
    try {
      const params: { page: number; search?: string } = { page };
      if (search && search.trim()) params.search = search.trim();
      const { data } = await api.get<{
        status?: string;
        data?: Banner[] | { data: Banner[] };
      }>("/api/admin/banners", { params });

      const raw = data?.data;
      let banners: Banner[] = [];

      if (Array.isArray(raw)) {
        banners = raw;
      } else if (
        isRecord(raw) &&
        Array.isArray((raw as { data?: Banner[] }).data)
      ) {
        banners = (raw as { data: Banner[] }).data;
      }

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

  updateBanner: async (id: number, payload: CreateBannerRequest) => {
    set({ updatingBanner: true, updateBannerError: null });
    try {
      const { data } = await api.put<{
        status?: string;
        message?: string;
        data?: Banner;
      }>(`/api/admin/banners/${id}`, payload);
      if (data?.status !== "success") {
        const message =
          typeof data?.message === "string"
            ? data.message
            : "Failed to update banner";
        set({ updateBannerError: message });
        return false;
      }
      await get().fetchMarketingBanners();
      return true;
    } catch (error: unknown) {
      const message = getApiErrorMessage(error) ?? "Failed to update banner";
      console.error("Error updating banner =>", error);
      set({ updateBannerError: message });
      return false;
    } finally {
      set({ updatingBanner: false });
    }
  },

  deleteBanner: async (id: number) => {
    set({ deletingBanner: true, deleteBannerError: null });
    try {
      const { data } = await api.delete<{
        status?: string;
        code?: number;
        message?: string;
        data?: null;
      }>(`/api/admin/banners/${id}`);
      if (data?.status !== "success") {
        const message =
          typeof data?.message === "string"
            ? data.message
            : "Failed to delete banner";
        set({ deleteBannerError: message });
        return false;
      }
      set((state) => ({
        banners: state.banners.filter((b) => b.id !== id),
      }));
      return true;
    } catch (error: unknown) {
      const message = getApiErrorMessage(error) ?? "Failed to delete banner";
      console.error("Error deleting banner =>", error);
      set({ deleteBannerError: message });
      return false;
    } finally {
      set({ deletingBanner: false });
    }
  },

  fetchMarketingPromoCodes: async (search?: string) => {
    set({ loadingPromoCodes: true, promoCodesError: null });
    try {
      const params =
        search && search.trim() ? { search: search.trim() } : undefined;
      const { data } = await api.get<{
        status?: string;
        data?: PromoCode[];
      }>("/api/admin/promo-codes", { params });

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

  fetchFaqs: async (search?: string) => {
    set({ loadingFaqs: true, faqsError: null });
    try {
      const params =
        search && search.trim() ? { search: search.trim() } : undefined;
      const { data } = await api.get<{
        status?: string;
        data?: Faq[];
      }>("/api/admin/faqs", { params });

      const raw = data?.data;
      const faqs = Array.isArray(raw) ? raw : [];

      set({ faqs });
      return true;
    } catch (error: unknown) {
      const message = getApiErrorMessage(error) ?? "Failed to fetch FAQs";
      console.error("Error fetching FAQs =>", error);
      set({ faqsError: message });
      return false;
    } finally {
      set({ loadingFaqs: false });
    }
  },

  createFaq: async (payload: CreateFaqRequest) => {
    set({ creatingFaq: true, createFaqError: null });
    try {
      const { data } = await api.post<{
        status?: string;
        message?: string;
        data?: Faq;
      }>("/api/admin/faqs", payload);

      if (data?.status !== "success") {
        const message =
          typeof data?.message === "string"
            ? data.message
            : "Failed to create FAQ";
        set({ createFaqError: message });
        return false;
      }
      await get().fetchFaqs();
      return true;
    } catch (error: unknown) {
      const message = getApiErrorMessage(error) ?? "Failed to create FAQ";
      console.error("Error creating FAQ =>", error);
      set({ createFaqError: message });
      return false;
    } finally {
      set({ creatingFaq: false });
    }
  },

  updateFaq: async (id: number, payload: CreateFaqRequest) => {
    set({ updatingFaq: true, updateFaqError: null });
    try {
      const { data } = await api.patch<{
        status?: string;
        message?: string;
        data?: Faq;
      }>(`/api/admin/faqs/${id}`, payload);

      if (data?.status !== "success") {
        const message =
          typeof data?.message === "string"
            ? data.message
            : "Failed to update FAQ";
        set({ updateFaqError: message });
        return false;
      }
      await get().fetchFaqs();
      return true;
    } catch (error: unknown) {
      const message = getApiErrorMessage(error) ?? "Failed to update FAQ";
      if (error instanceof AxiosError) {
        toast.error(error.response?.data.message ?? "Failed to update FAQ");
      }
      console.error("Error updating FAQ =>", error);
      set({ updateFaqError: message });
      return false;
    } finally {
      set({ updatingFaq: false });
    }
  },

  deleteFaq: async (id: number) => {
    set({ deletingFaq: true, deleteFaqError: null });
    try {
      const { data } = await api.delete<{
        status?: string;
        code?: number;
        message?: string;
        data?: null;
      }>(`/api/admin/faqs/${id}`);
      if (data?.status !== "success") {
        const message =
          typeof data?.message === "string"
            ? data.message
            : "Failed to delete FAQ";
        set({ deleteFaqError: message });
        return false;
      }
      set((state) => ({
        faqs: state.faqs.filter((f) => f.id !== id),
      }));
      return true;
    } catch (error: unknown) {
      const message = getApiErrorMessage(error) ?? "Failed to delete FAQ";
      console.error("Error deleting FAQ =>", error);
      set({ deleteFaqError: message });
      return false;
    } finally {
      set({ deletingFaq: false });
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

      if (error instanceof AxiosError) {
        toast.error(
          error.response?.data.message ?? "Failed to create promo code"
        );
      }
      set({ createPromoCodeError: message });
      return false;
    } finally {
      set({ creatingPromoCode: false });
    }
  },

  updatePromoCode: async (id: number, payload: CreatePromoCodeRequest) => {
    set({ updatingPromoCode: true, updatePromoCodeError: null });
    try {
      const { data } = await api.patch<{
        status?: string;
        message?: string;
        data?: PromoCode;
      }>(`/api/admin/promo-codes/${id}`, payload);

      if (data?.status !== "success") {
        const message =
          typeof data?.message === "string"
            ? data.message
            : "Failed to update promo code";
        set({ updatePromoCodeError: message });
        return false;
      }
      await get().fetchMarketingPromoCodes();
      return true;
    } catch (error: unknown) {
      const message =
        getApiErrorMessage(error) ?? "Failed to update promo code";
      console.error("Error updating promo code =>", error);
      set({ updatePromoCodeError: message });
      return false;
    } finally {
      set({ updatingPromoCode: false });
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
