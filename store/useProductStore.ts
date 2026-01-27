import api from "@/lib/api";
import type { Product, ProductCategory } from "@/data/products";
import type { AdminProductsResponse, ProductState } from "@/types/ProductTypes";
import { create } from "zustand";

function mapAdminProductsToUi(products: AdminProductsResponse["data"]["data"]): Product[] {
  return products.map((p) => {
    const stock = typeof p.stock === "number" ? p.stock : 0;
    const low = typeof p.low_stock_threshold === "number" ? p.low_stock_threshold : 0;
    const isActive = !!p.is_active;

    const status: Product["status"] = !isActive
      ? "Unavailable"
      : stock <= 0
        ? "OutOfStock"
        : stock <= low
          ? "LowStock"
          : "Available";

    const price = typeof p.price === "string" ? Number(p.price) : p.price;

    return {
      id: p.id,
      name: p.name,
      description: p.description ?? "",
      price,
      // Backend doesn't return bulk price yet; use price as fallback for UI.
      bulkPrice: price,
      category: (p.category?.name ?? "Uncategorized") as ProductCategory,
      categoryId: p.category?.id ?? p.category_id ?? null,
      subCategory: "",
      stockLevel: stock,
      status,
      imageUrl: p.image_url ?? "https://picsum.photos/seed/product/300/300",
    };
  });
}

export const useProductStore = create<ProductState>((set, get) => ({
  products: [],
  loadingProducts: false,
  togglingStatusById: {},
  deletingById: {},
  error: null,
  currentPage: 1,
  lastPage: 1,
  totalItems: 0,
  perPage: 20,
  categoryOptions: [],
  lastQuery: { page: 1, categoryId: null, search: "" },

  fetchProducts: async (params) => {
    const page = params?.page ?? 1;
    const categoryIdRaw = params?.categoryId ?? null;
    const categoryId = categoryIdRaw && categoryIdRaw > 0 ? categoryIdRaw : null;
    const search = params?.search?.trim() ?? "";
    set({ lastQuery: { page, categoryId, search } });
    set({ loadingProducts: true, error: null });
    try {
      const query: Record<string, string | number> = { page };
      if (categoryId != null) query.category_id = categoryId;
      if (search) query.search = search;

      const { data } = await api.get<AdminProductsResponse>("/api/admin/products", {
        params: query,
      });

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
            optionsMap.set(p.categoryId, { id: p.categoryId, name: String(p.category) });
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
    const optimisticStatus: Product["status"] = wasUnavailable ? "Available" : "Unavailable";

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
        products: state.products.map((p) => (String(p.id) === id ? existing : p)),
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

