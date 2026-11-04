import { CATEGORIES_API, categoryPath } from "@/data/categories";
import api from "@/lib/api";
import type {
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

async function refreshProductCategories() {
  await useProductStore.getState().fetchCategories();
}

export const useCategoryStore = create<CategoryState>((set, get) => ({
  categories: [],
  loadingCategories: false,
  creatingCategory: false,
  updatingCategory: false,
  deletingById: {},
  categoriesError: null,
  createCategoryError: null,
  updateCategoryError: null,
  deleteCategoryError: null,

  fetchCategories: async (search) => {
    set({ loadingCategories: true, categoriesError: null });
    try {
      const { data } = await api.get<CategoryListResponse>(CATEGORIES_API.list, {
        params: search?.trim() ? { search: search.trim() } : undefined,
      });
      set({ categories: unwrapCategories(data) });
      return true;
    } catch (error: unknown) {
      const message = getApiErrorMessage(error) ?? "Failed to fetch categories";
      console.error("Error fetching categories =>", error);
      set({ categoriesError: message, categories: [] });
      return false;
    } finally {
      set({ loadingCategories: false });
    }
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
      await get().fetchCategories();
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
      await get().fetchCategories();
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

  deleteCategory: async (id: number) => {
    set((state) => ({
      deletingById: { ...state.deletingById, [id]: true },
      deleteCategoryError: null,
    }));
    try {
      const { data } = await api.delete<CategoryMutationResponse>(
        categoryPath(id),
      );
      if (!isSuccessStatus(data?.status)) {
        const message =
          typeof data?.message === "string"
            ? data.message
            : "Failed to delete category";
        set({ deleteCategoryError: message });
        return false;
      }
      await get().fetchCategories();
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
