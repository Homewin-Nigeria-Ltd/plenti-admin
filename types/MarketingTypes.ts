/** FAQ from GET {{admin_url}}/faqs */
export type Faq = {
  id: number;
  question: string;
  answer: string;
  category: string;
  position: number;
  is_active: boolean;
  created_at: string;
  updated_at: string;
};

/** Body for POST {{admin_url}}/faqs */
export type CreateFaqRequest = {
  question: string;
  answer: string;
  category: string;
};

/** Placeholder for engagement data (campaigns, notifications, etc.) until API is defined. */
export type EngagementItem = Record<string, unknown>;

export type CreateBannerRequest = {
  title: string;
  subheading?: string | null;
  description?: string | null;
  image_url: string;
  link_type: string;
  link_url?: string | null;
  link_id?: number | null;
  screen_location?: string | null;
  banner_type: string;
  is_active: boolean;
};

export type CreateBannerResponse = {
  status: string;
  code: number;
  message: string;
  data: {
    id: number;
    title: string;
    subheading: string | null;
    image_url: string;
    link_url: string | null;
    screen_location: string | null;
    banner_type: string;
    link_type: string;
    is_active: boolean;
    created_at: string;
    updated_at: string;
  };
};

export type MarketingState = {
  // Banners
  banners: Banner[];
  loadingBanners: boolean;
  bannersError: string | null;
  creatingBanner: boolean;
  createBannerError: string | null;
  updatingBanner: boolean;
  updateBannerError: string | null;
  deletingBanner: boolean;
  deleteBannerError: string | null;

  // Promo codes
  promoCodes: PromoCode[];
  loadingPromoCodes: boolean;
  promoCodesError: string | null;
  creatingPromoCode: boolean;
  createPromoCodeError: string | null;
  updatingPromoCode: boolean;
  updatePromoCodeError: string | null;

  // FAQs
  faqs: Faq[];
  loadingFaqs: boolean;
  faqsError: string | null;
  creatingFaq: boolean;
  createFaqError: string | null;
  updatingFaq: boolean;
  updateFaqError: string | null;
  deletingFaq: boolean;
  deleteFaqError: string | null;

  // Engagement (campaigns, notifications, analytics, etc.)
  engagement: EngagementItem[];
  loadingEngagement: boolean;
  engagementError: string | null;

  fetchMarketingBanners: (page?: number, search?: string) => Promise<boolean>;
  createBanner: (payload: CreateBannerRequest) => Promise<boolean>;
  updateBanner: (id: number, payload: CreateBannerRequest) => Promise<boolean>;
  deleteBanner: (id: number) => Promise<boolean>;
  fetchMarketingPromoCodes: (search?: string) => Promise<boolean>;
  createPromoCode: (payload: CreatePromoCodeRequest) => Promise<boolean>;
  updatePromoCode: (
    id: number,
    payload: CreatePromoCodeRequest
  ) => Promise<boolean>;
  fetchFaqs: (search?: string) => Promise<boolean>;
  createFaq: (payload: CreateFaqRequest) => Promise<boolean>;
  updateFaq: (id: number, payload: CreateFaqRequest) => Promise<boolean>;
  deleteFaq: (id: number) => Promise<boolean>;
  fetchEngagement: () => Promise<boolean>;
};

/** Body for POST {{admin_url}}/promo-codes */
export type CreatePromoCodeRequest = {
  code: string;
  type: "percentage" | "fixed";
  value: number;
  min_order_amount: number;
  usage_limit: number;
  expiry_date: string; // e.g. "2026-12-31T23:59:59"
  is_active: boolean;
};

export type Banner = {
  id: number;
  title: string;
  subheading: string | null;
  description: string | null;
  image_url: string;
  link_url: string | null;
  screen_location: string | null;
  banner_type: string;
  link_type: string;
  link_id: number | null;
  position: number;
  is_active: boolean;
  total_clicks: number;
  clicks_per_day: number;
  created_at?: string;
};

/** Promo code from GET {{admin_url}}/promo-codes */
export type PromoCode = {
  id: number;
  code: string;
  type: PromoCodeType;
  value: number;
  min_order_amount: number;
  usage_limit: number;
  used_count: number;
  expiry_date: string | null;
  description: string | null;
  is_active: boolean;
  created_by: number;
  created_at: string;
  updated_at: string;
};

export type PromoCodeStatus = "Active" | "Inactive";
export type PromoCodeType = "percentage" | "fixed";
