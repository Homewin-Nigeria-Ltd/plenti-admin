import {
  CATEGORIES_API,
  categoryDeleteCheckPath,
  categoryPath,
} from "@/data/categories";
import api from "@/lib/api";
import type {
  CategoryDeleteCheck,
  CategoryDeleteCheckResponse,
  CategoryListResponse,
  CategoryMutationResponse,
  CategoryState,
  CreateCategoryRequest,
  UpdateCategoryRequest,
} from "@/types/CategoryTypes";
import type { AdminCategory } from "@/types/ProductTypes";
import { create } from "zustand";
import { useProductStore } from "@/store/useProductStore";

function isRecord(value: unknown): value is Record<string, unknown> {
  return typeof value === "object" && value !== null;
}

function getApiErrorMessage(err: unknown): string | null {
  if (!isRecord(err)) return null;
  const response = (err as { response?: unknown }).response;
  if (!isRecord(response)) return null;
  const data = (response as { data?: unknown }).data;
  if (!isRecord(data)) return null;
  if (typeof data.message === "string" && data.message.trim()) {
    return data.message;
  }
  const errors = data.errors;
  if (isRecord(errors)) {
    for (const value of Object.values(errors)) {
      if (Array.isArray(value) && typeof value[0] === "string") return value[0];
      if (typeof value === "string") return value;
    }
  }
  return null;
}

function unwrapCategories(payload: CategoryListResponse | undefined): AdminCategory[] {
  const raw = payload?.data;
  if (Array.isArray(raw)) return raw;
  if (!raw) return [];
  if (Array.isArray(raw.items)) return raw.items;
  if (Array.isArray(raw.data)) return raw.data;
  if (Array.isArray(raw.categories)) return raw.categories;
  return [];
}

function isSuccessStatus(status?: string) {
  if (!status) return true;
  return status === "success";
}

function parseCount(value: unknown): number | null {
  if (value == null || value === "") return null;
  const parsed = Number(value);
  return Number.isFinite(parsed) ? parsed : null;
}

function unwrapDeleteCheck(
  payload: CategoryDeleteCheckResponse | unknown,
): CategoryDeleteCheck | null {
  if (!isRecord(payload)) return null;
  const raw = isRecord(payload.data) ? payload.data : payload;
  if (!isRecord(raw)) return null;
  return {
    category_id: parseCount(raw.category_id),
    subcategories_count: parseCount(raw.subcategories_count) ?? 0,
    products_count: parseCount(raw.products_count) ?? 0,
    requires_delete_subcategories: Boolean(raw.requires_delete_subcategories),
    requires_delete_products: Boolean(raw.requires_delete_products),
  };
}

async function refreshProductCategories() {
  await useProductStore.getState().fetchCategories();
}

export const useCategoryStore = create<CategoryState>((set, get) => ({
  categories: [],
  parentCategories: [],
  subCategories: [],
  loadingCategories: false,
  creatingCategory: false,
  updatingCategory: false,
  deletingById: {},
  categoriesError: null,
  createCategoryError: null,
  updateCategoryError: null,
  deleteCategoryError: null,
  deleteCheck: null,
  loadingDeleteCheck: false,
  deleteCheckError: null,

  fetchCategories: async (params) => {
    const search = params?.search?.trim();
    const type = params?.type;
    set({ loadingCategories: true, categoriesError: null });
    try {
      const { data } = await api.get<CategoryListResponse>(CATEGORIES_API.list, {
        params: {
          ...(search ? { search } : {}),
          ...(type ? { type } : {}),
        },
      });
      const list = unwrapCategories(data);
      if (type === "sub") {
        set({ subCategories: list });
      } else if (type === "parent") {
        set({ parentCategories: list });
      } else {
        set({ categories: list });
      }
      return true;
    } catch (error: unknown) {
      const message = getApiErrorMessage(error) ?? "Failed to fetch categories";
      console.error("Error fetching categories =>", error);
      const empty =
        type === "sub"
          ? { subCategories: [] as AdminCategory[] }
          : type === "parent"
            ? { parentCategories: [] as AdminCategory[] }
            : { categories: [] as AdminCategory[] };
      set({ categoriesError: message, ...empty });
      return false;
    } finally {
      set({ loadingCategories: false });
    }
  },

  fetchDeleteCheck: async (id) => {
    set({ loadingDeleteCheck: true, deleteCheckError: null, deleteCheck: null });
    try {
      const { data } = await api.get<CategoryDeleteCheckResponse>(
        categoryDeleteCheckPath(id),
      );
      const check = unwrapDeleteCheck(data);
      if (!check) {
        set({
          deleteCheckError: "Failed to check category delete requirements",
        });
        return false;
      }
      set({ deleteCheck: check });
      return true;
    } catch (error: unknown) {
      const message =
        getApiErrorMessage(error) ??
        "Failed to check category delete requirements";
      console.error("Error checking category delete =>", error);
      set({ deleteCheckError: message, deleteCheck: null });
      return false;
    } finally {
      set({ loadingDeleteCheck: false });
    }
  },

  clearDeleteCheck: () => {
    set({
      deleteCheck: null,
      loadingDeleteCheck: false,
      deleteCheckError: null,
    });
  },

  createCategory: async (payload: CreateCategoryRequest) => {
    set({ creatingCategory: true, createCategoryError: null });
    try {
      const { data } = await api.post<CategoryMutationResponse>(
        CATEGORIES_API.list,
        payload,
      );
      if (!isSuccessStatus(data?.status)) {
        const message =
          typeof data?.message === "string"
            ? data.message
            : "Failed to create category";
        set({ createCategoryError: message });
        return false;
      }
      await Promise.all([
        get().fetchCategories({ type: "parent" }),
        get().fetchCategories({ type: "sub" }),
      ]);
      void refreshProductCategories();
      return true;
    } catch (error: unknown) {
      const message = getApiErrorMessage(error) ?? "Failed to create category";
      console.error("Error creating category =>", error);
      set({ createCategoryError: message });
      return false;
    } finally {
      set({ creatingCategory: false });
    }
  },

  updateCategory: async (id: number, payload: UpdateCategoryRequest) => {
    set({ updatingCategory: true, updateCategoryError: null });
    try {
      const { data } = await api.patch<CategoryMutationResponse>(
        categoryPath(id),
        payload,
      );
      if (!isSuccessStatus(data?.status)) {
        const message =
          typeof data?.message === "string"
            ? data.message
            : "Failed to update category";
        set({ updateCategoryError: message });
        return false;
      }
      await Promise.all([
        get().fetchCategories({ type: "parent" }),
        get().fetchCategories({ type: "sub" }),
      ]);
      void refreshProductCategories();
      return true;
    } catch (error: unknown) {
      const message = getApiErrorMessage(error) ?? "Failed to update category";
      console.error("Error updating category =>", error);
      set({ updateCategoryError: message });
      return false;
    } finally {
      set({ updatingCategory: false });
    }
  },

  deleteCategory: async (id, options) => {
    set((state) => ({
      deletingById: { ...state.deletingById, [id]: true },
      deleteCategoryError: null,
    }));
    try {
      const { data } = await api.delete<CategoryMutationResponse>(
        categoryPath(id),
        {
          params: {
            delete_subcategories: Boolean(options?.delete_subcategories),
            delete_products: Boolean(options?.delete_products),
          },
        },
      );
      if (!isSuccessStatus(data?.status)) {
        const message =
          typeof data?.message === "string"
            ? data.message
            : "Failed to delete category";
        set({ deleteCategoryError: message });
        return false;
      }
      await Promise.all([
        get().fetchCategories({ type: "parent" }),
        get().fetchCategories({ type: "sub" }),
      ]);
      void refreshProductCategories();
      return true;
    } catch (error: unknown) {
      const message = getApiErrorMessage(error) ?? "Failed to delete category";
      console.error("Error deleting category =>", error);
      set({ deleteCategoryError: message });
      return false;
    } finally {
      set((state) => {
        const next = { ...state.deletingById };
        delete next[id];
        return { deletingById: next };
      });
    }
  },
}));
