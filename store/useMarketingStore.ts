import api from "@/lib/api";
import { Banner, MarketingState, PromoCode } from "@/types/MarketingTypes";
import { AxiosError } from "axios";
import { create } from "zustand";

export const useMarketingStore = create<MarketingState>((set) => ({
  banners: [],
  loadingBanners: false,
  promoCodes: [],
  loadingPromoCodes: false,

  // ENDPOINT TO FETCH MARKETING BANNERS
  fetchMarketingBanners: async () => {
    set({ loadingBanners: true });
    try {
      const { data } = await api.get<{
        data: {
          banners: Banner[];
        };
      }>("/api/admin/marketing/banners");

      console.log("Banners fetched successfully =>", data.data);

      set({ banners: data.data.banners });

      return true;
    } catch (error) {
      if (error instanceof AxiosError) {
        console.log("Axios Error =>", error);
      }
      return false;
    } finally {
      set({ loadingBanners: false });
    }
  },

  // ENDPOINT TO FETCH MARKETING Promo Codes
  fetchMarketingPromoCodes: async () => {
    set({ loadingBanners: true });
    try {
      const { data } = await api.get<{
        data: {
          promoCodes: PromoCode[];
        };
      }>("/api/admin/marketing/promocodes");

      console.log("Banners fetched successfully =>", data.data);

      set({ promoCodes: data.data.promoCodes });

      return true;
    } catch (error) {
      if (error instanceof AxiosError) {
        console.log("Axios Error =>", error);
      }
      return false;
    } finally {
      set({ loadingBanners: false });
    }
  },
}));
