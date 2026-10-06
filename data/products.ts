// Backend categories are dynamic, so keep this flexible.
export const ALL_PRODUCTS_CATEGORY = "All Product" as const;
export type ProductCategory = typeof ALL_PRODUCTS_CATEGORY | (string & {});

export type ProductStatus =
  | "Available"
  | "Unavailable"
  | "OutOfStock"
  | "LowStock";

export type ProductBulkTier = {
  min_qty: number;
  price: number;
};

export type Product = {
  id: string | number;
  name: string;
  description: string;
  price: number;
  bulkPrice: number;
  minBulkQuantity?: number | null;
  bulkPriceRaw?: number | null;
  bulkTiers?: ProductBulkTier[];
  discountPercent?: number | null;
  category: ProductCategory;
  categoryId?: number | null;
  subCategory: string;
  stockLevel: number;
  status: ProductStatus;
  imageUrl: string;
  images?: string[];
};
