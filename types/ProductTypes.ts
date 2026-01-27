import type { Product } from "@/data/products";

export type ProductState = {
  products: Product[];
  loadingProducts: boolean;
  togglingStatusById: Record<string, boolean>;
  deletingById: Record<string, boolean>;
  error: string | null;
  currentPage: number;
  lastPage: number;
  totalItems: number;
  perPage: number;
  categoryOptions: Array<{ id: number; name: string }>;
  lastQuery: { page: number; categoryId: number | null; search: string };

  fetchProducts: (params?: {
    page?: number;
    categoryId?: number | null;
    search?: string;
  }) => Promise<boolean>;

  toggleProductStatus: (productId: string | number) => Promise<boolean>;
  deleteProduct: (productId: string | number) => Promise<boolean>;
};

export type AdminProductsResponse = {
  status: string;
  code: number;
  message: string;
  data: {
    current_page: number;
    per_page: number;
    data: Array<{
      id: number;
      name: string;
      description: string | null;
      category_id: number | null;
      price: number | string;
      stock: number | null;
      low_stock_threshold: number | null;
      image_url: string | null;
      is_active: boolean;
      category?: { id: number; name?: string | null } | null;
    }>;
    last_page: number;
    total: number;
  };
};

