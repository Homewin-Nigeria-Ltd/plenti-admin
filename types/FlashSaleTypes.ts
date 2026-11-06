export type FlashSaleStatus = "scheduled" | "running" | "ended" | "off";

export type FlashSaleItem = {
  product_id: number;
  name?: string | null;
  product_name?: string | null;
  original_price?: number | null;
  sale_price?: number | null;
  discount_percent: number;
  product?: {
    id: number;
    name?: string | null;
  } | null;
};

export type FlashSale = {
  id: number;
  name: string;
  starts_at: string;
  ends_at: string;
  is_active: boolean;
  status?: FlashSaleStatus | string | null;
  items_count?: number;
  items?: FlashSaleItem[];
  created_at?: string | null;
  updated_at?: string | null;
};

export type FlashSalePayload = {
  name: string;
  starts_at: string;
  ends_at: string;
  is_active: boolean;
  items: Array<{ product_id: number; discount_percent: number }>;
};

export type FlashSaleListResponse = {
  status?: string;
  code?: number;
  message?: string;
  timestamp?: string;
  data?:
    | FlashSale[]
    | {
        data?: FlashSale[];
        items?: FlashSale[];
      };
};

export type FlashSaleMutationResponse = {
  status?: string;
  code?: number;
  message?: string;
  data?: FlashSale | null;
};

export type FlashSaleState = {
  flashSales: FlashSale[];
  loadingFlashSales: boolean;
  loadingDetail: boolean;
  savingFlashSale: boolean;
  flashSalesError: string | null;
  saveError: string | null;
  deletingById: Record<number, boolean>;
  fetchFlashSales: (search?: string) => Promise<boolean>;
  fetchFlashSale: (id: number) => Promise<FlashSale | null>;
  createFlashSale: (payload: FlashSalePayload) => Promise<boolean>;
  updateFlashSale: (
    id: number,
    payload: FlashSalePayload | { is_active: boolean },
  ) => Promise<boolean>;
  deleteFlashSale: (id: number) => Promise<boolean>;
};
