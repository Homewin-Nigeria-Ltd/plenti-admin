import api from "@/lib/api";
import type { Product } from "@/data/products";
import type {
  AdminProductsResponse,
  CreateProductRequest,
  CreateProductResponse,
  ProductState,
  PublicCategoriesResponse,
  UpdateProductRequest,
  UpdateProductResponse,
} from "@/types/ProductTypes";
import { create } from "zustand";
import { mapAdminProductsToUi } from "@/lib/mappers/products";
import { flattenCategoryOptions } from "@/lib/mappers/categories";

function isRecord(value: unknown): value is Record<string, unknown> {
  return typeof value === "object" && value !== null;
}

function getApiErrorMessage(err: unknown): string | null {
  // axios error shape: { response?: { data?: unknown } }
  if (!isRecord(err)) return null;
  const response = (err as { response?: unknown }).response;
  if (!isRecord(response)) return null;
  const data = (response as { data?: unknown }).data;
  if (!isRecord(data)) return null;
  const message = data.message;
  return typeof message === "string" ? message : null;
}

export const useProductStore = create<ProductState>((set, get) => ({
  products: [],
  loadingProducts: false,
  loadingCategories: false,
  creatingProduct: false,
  updatingById: {},
  togglingStatusById: {},
  deletingById: {},
  error: null,
  categoriesError: null,
  createProductError: null,
  updateProductError: null,
  currentPage: 1,
  lastPage: 1,
  totalItems: 0,
  perPage: 20,
  categoryOptions: [],
  categoriesTree: [],
  lastQuery: { page: 1, categoryId: null, search: "" },

  fetchCategories: async () => {
    set({ loadingCategories: true, categoriesError: null });
    try {
      const response = await fetch("/api/categories", {
        method: "GET",
        headers: { Accept: "application/json" },
      });

      if (!response.ok) {
        const err = await response.json().catch(() => null);
        const message =
          typeof err?.message === "string"
            ? err.message
            : "Failed to fetch categories";
        set({ categoriesError: message });
        return false;
      }

      const data = (await response.json()) as PublicCategoriesResponse;
      const categories = Array.isArray(data?.data) ? data.data : [];
      const options = flattenCategoryOptions(categories);

      set((state) => {
        const optionsMap = new Map<number, { id: number; name: string }>(
          state.categoryOptions.map((c) => [c.id, c])
        );
        for (const opt of options) optionsMap.set(opt.id, opt);
        return {
          ...state,
          categoriesTree: categories,
          categoryOptions: Array.from(optionsMap.values()),
        };
      });

      return true;
    } catch (e) {
      console.error("Error fetching categories =>", e);
      set({ categoriesError: "Failed to fetch categories" });
      return false;
    } finally {
      set({ loadingCategories: false });
    }
  },

  createProduct: async (payload: CreateProductRequest) => {
    set({ creatingProduct: true, createProductError: null });
    try {
      const { data } = await api.post<CreateProductResponse>(
        "/api/admin/products",
        payload
      );
      if (data?.status !== "success") {
        const message =
          typeof data?.message === "string"
            ? data.message
            : "Failed to create product";
        set({ createProductError: message });
        return false;
      }

      const prevQuery = get().lastQuery;
      await get().fetchProducts({ ...prevQuery, page: 1 });
      return true;
    } catch (error: unknown) {
      const message = getApiErrorMessage(error) ?? "Failed to create product";
      console.error("Error creating product =>", error);
      set({ createProductError: message });
      return false;
    } finally {
      set({ creatingProduct: false });
    }
  },

  updateProduct: async (productId, patch: UpdateProductRequest) => {
    const id = String(productId);
    set((state) => ({
      updatingById: { ...state.updatingById, [id]: true },
      updateProductError: null,
    }));
    try {
      const { data } = await api.patch<UpdateProductResponse>(
        `/api/admin/products/${productId}`,
        patch
      );
      if (data?.status !== "success") {
        const message =
          typeof data?.message === "string"
            ? data.message
            : "Failed to update product";
        set({ updateProductError: message });
        return false;
      }

      const { lastQuery } = get();
      await get().fetchProducts(lastQuery);
      return true;
    } catch (error: unknown) {
      const message = getApiErrorMessage(error) ?? "Failed to update product";
      console.error("Error updating product =>", error);
      set({ updateProductError: message });
      return false;
    } finally {
      set((state) => ({
        updatingById: { ...state.updatingById, [id]: false },
      }));
    }
  },

  fetchProducts: async (params) => {
    const page = params?.page ?? 1;
    const categoryIdRaw = params?.categoryId ?? null;
    const categoryId =
      categoryIdRaw && categoryIdRaw > 0 ? categoryIdRaw : null;
    const search = params?.search?.trim() ?? "";
    set({ lastQuery: { page, categoryId, search } });
    set({ loadingProducts: true, error: null });
    try {
      const query: Record<string, string | number> = { page };
      if (categoryId != null) query.category_id = categoryId;
      if (search) query.search = search;

      const { data } = await api.get<AdminProductsResponse>(
        "/api/admin/products",
        {
          params: query,
        }
      );

      const mapped = mapAdminProductsToUi(data.data.data);

      const nextState: Partial<ProductState> = {
        products: mapped,
        currentPage: data.data.current_page ?? 1,
        lastPage: data.data.last_page ?? 1,
        totalItems: data.data.total ?? mapped.length,
        perPage: data.data.per_page ?? 20,
      };

      set((state) => {
        const optionsMap = new Map<number, { id: number; name: string }>(
          state.categoryOptions.map((c) => [c.id, c])
        );
        for (const p of mapped) {
          if (typeof p.categoryId === "number") {
            optionsMap.set(p.categoryId, {
              id: p.categoryId,
              name: String(p.category),
            });
          }
        }
        return {
          ...state,
          ...nextState,
          categoryOptions: Array.from(optionsMap.values()),
        };
      });

      return true;
    } catch (error) {
      console.error("Error fetching products =>", error);
      set({ error: "Failed to fetch products" });
      return false;
    } finally {
      set({ loadingProducts: false });
    }
  },

  toggleProductStatus: async (productId) => {
    const id = String(productId);
    const existing = get().products.find((p) => String(p.id) === id);
    if (!existing) return false;

    // Optimistic update: flip between "Unavailable" and "Available".
    // (For other statuses like LowStock/OutOfStock, we treat them as "active".)
    const wasUnavailable = existing.status === "Unavailable";
    const optimisticStatus: Product["status"] = wasUnavailable
      ? "Available"
      : "Unavailable";

    set((state) => ({
      togglingStatusById: { ...state.togglingStatusById, [id]: true },
      products: state.products.map((p) =>
        String(p.id) === id ? { ...p, status: optimisticStatus } : p
      ),
    }));

    try {
      await api.patch(`/api/admin/products/${productId}/toggle-status`);
      return true;
    } catch (error) {
      console.error("Error toggling product status =>", error);
      // Revert on failure
      set((state) => ({
        products: state.products.map((p) =>
          String(p.id) === id ? existing : p
        ),
      }));
      return false;
    } finally {
      set((state) => ({
        togglingStatusById: { ...state.togglingStatusById, [id]: false },
      }));
    }
  },

  deleteProduct: async (productId) => {
    const id = String(productId);
    const prevProducts = get().products;

    // Optimistic UI removal.
    set((state) => ({
      deletingById: { ...state.deletingById, [id]: true },
      products: state.products.filter((p) => String(p.id) !== id),
    }));

    try {
      await api.delete(`/api/admin/products/${productId}`);
      const { lastQuery } = get();
      await get().fetchProducts(lastQuery);

      const { currentPage, lastPage, products } = get();
      if (products.length === 0 && currentPage > 1 && lastPage < currentPage) {
        await get().fetchProducts({ ...lastQuery, page: lastPage });
      }
      return true;
    } catch (error) {
      console.error("Error deleting product =>", error);
      // Revert on failure
      set({ products: prevProducts });
      return false;
    } finally {
      set((state) => ({
        deletingById: { ...state.deletingById, [id]: false },
      }));
    }
  },
}));
