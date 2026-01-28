import type { Product } from "@/data/products";

export type AdminCategory = {
  id: number;
  name: string;
  slug: string;
  parent_id: number | null;
  created_at: string | null;
  updated_at: string | null;
  created_by: number | null;
  updated_by: number | null;
  subcategories: Array<Omit<AdminCategory, "subcategories">>;
};

export type PublicCategoriesResponse = {
  status: string;
  message: string;
  data: AdminCategory[];
};

export type CreateProductRequest = {
  name: string;
  description: string;
  price: number;
  stock: number;
  category_id: number;
  is_active: boolean;
  image_urls: string[];
  min_bulk_quantity: number;
  bulk_price: number;
};

export type CreateProductResponse = {
  status: string;
  code: number;
  message: string;
  data: {
    id: number;
    name: string;
    slug: string;
    description: string | null;
    price: number;
    stock: number;
    min_bulk_quantity: number | null;
    bulk_price: number | null;
    category_id: number | null;
    image_url: string | null;
    images: string[];
    is_active: boolean;
    average_rating: number | null;
    category?: { id: number; name?: string | null } | null;
  };
};

export type UploadImageResponse = {
  status: string;
  code: number;
  message: string;
  data: {
    url: string;
  };
};

export type UpdateProductRequest = {
  name?: string;
  description?: string;
  price?: number;
  stock?: number;
  category_id?: number;
  is_active?: boolean;
  image_urls?: string[];
  min_bulk_quantity?: number | null;
  bulk_price?: number | null;
};

export type UpdateProductResponse = {
  status: string;
  code: number;
  message: string;
  data: {
    id: number;
    name: string;
    description: string | null;
    category_id: number | null;
    price: number;
    stock: number;
    min_bulk_quantity: number | null;
    bulk_price: number | null;
    image_url: string | null;
    images: string[] | null;
    is_active: boolean;
    category?: { id: number; name?: string | null } | null;
  };
};

export type ProductState = {
  products: Product[];
  loadingProducts: boolean;
  loadingCategories: boolean;
  creatingProduct: boolean;
  updatingById: Record<string, boolean>;
  togglingStatusById: Record<string, boolean>;
  deletingById: Record<string, boolean>;
  error: string | null;
  categoriesError: string | null;
  createProductError: string | null;
  updateProductError: string | null;
  currentPage: number;
  lastPage: number;
  totalItems: number;
  perPage: number;
  categoryOptions: Array<{ id: number; name: string }>;
  categoriesTree: AdminCategory[];
  lastQuery: { page: number; categoryId: number | null; search: string };

  fetchCategories: () => Promise<boolean>;
  createProduct: (payload: CreateProductRequest) => Promise<boolean>;
  updateProduct: (
    productId: string | number,
    patch: UpdateProductRequest
  ) => Promise<boolean>;
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
      sku?: string | null;
      slug?: string | null;
      description: string | null;
      category_id: number | null;
      price: number | string;
      stock: number | null;
      min_bulk_quantity?: number | null;
      bulk_price?: number | string | null;
      low_stock_threshold: number | null;
      image_url: string | null;
      images?: string[];
      is_active: boolean;
      category?: {
        id: number;
        name?: string | null;
        parent_id?: number | null;
      } | null;
    }>;
    last_page: number;
    total: number;
  };
};
