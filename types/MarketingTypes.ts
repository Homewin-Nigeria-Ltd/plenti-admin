export type MarketingState = {
  banners: Banner[];
  loadingBanners: boolean;
  promoCodes: PromoCode[];
  loadingPromoCodes: false;

  fetchMarketingBanners: () => Promise<boolean>;
  fetchMarketingPromoCodes: () => Promise<boolean>;
};

export type Banner = {
  endDate: string;
  imageUrl: string;
  title: string;
  targetUrl: string;
  startDate: string;
  status: BannerStatus;
};

export type BannerStatus = "ACTIVE" | "SCHEDULED";

export type PromoCode = {
  code: string;
  endDate: string;
  usageLimit: number;
  used: number;
  type: PromoCodeType;
  value: number;
  startDate: number;
  status: PromoCodeStatus;
};

export type PromoCodeStatus = "ACTIVE" | "SCHEDULED";
export type PromoCodeType = "PERCENT" | "FIXED";
