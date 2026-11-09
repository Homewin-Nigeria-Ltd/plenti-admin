import type { AdminCategory } from "@/types/ProductTypes";

export type CreateCategoryRequest = {
  name: string;
  parent_id?: number | null;
  image?: string | null;
  commission_rate?: number | null;
};

export type UpdateCategoryRequest = {
  name?: string;
  parent_id?: number | null;
  image?: string | null;
  commission_rate?: number | null;
};

export type CategoryListResponse = {
  status?: string;
  message?: string;
  data?:
    | AdminCategory[]
    | {
        data?: AdminCategory[];
        items?: AdminCategory[];
        categories?: AdminCategory[];
      };
};

export type CategoryMutationResponse = {
  status?: string;
  message?: string;
  data?: AdminCategory | null;
};

export type CategoryRow = {
  id: number;
  name: string;
  slug: string;
  imageUrl: string | null;
  parent_id: number | null;
  parentName: string;
  type: "Category" | "Subcategory";
  commission_rate?: number | null;
  created_at: string | null;
};

export type CategoryState = {
  categories: AdminCategory[];
  loadingCategories: boolean;
  creatingCategory: boolean;
  updatingCategory: boolean;
  deletingById: Record<number, boolean>;
  categoriesError: string | null;
  createCategoryError: string | null;
  updateCategoryError: string | null;
  deleteCategoryError: string | null;
  fetchCategories: (search?: string) => Promise<boolean>;
  createCategory: (payload: CreateCategoryRequest) => Promise<boolean>;
  updateCategory: (
    id: number,
    payload: UpdateCategoryRequest,
  ) => Promise<boolean>;
  deleteCategory: (
    id: number,
    options?: { delete_products?: boolean },
  ) => Promise<boolean>;
};
