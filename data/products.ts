// Backend categories are dynamic, so keep this flexible.
export const ALL_PRODUCTS_CATEGORY = "All Product" as const;
export type ProductCategory = typeof ALL_PRODUCTS_CATEGORY | (string & {});

export type ProductStatus =
  | "Available"
  | "Unavailable"
  | "OutOfStock"
  | "LowStock";

export type Product = {
  id: string | number;
  name: string;
  description: string;
  price: number;
  bulkPrice: number;
  category: ProductCategory;
  categoryId?: number | null;
  subCategory: string;
  stockLevel: number;
  status: ProductStatus;
  imageUrl: string;
};

