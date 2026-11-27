import type { Product } from "@/data/products";

export type ProductListingBadge = "Published" | "Unpublished" | "Out of stock";
export type ProductListingFilter =
  | "all"
  | "published"
  | "unpublished"
  | "out_of_stock";

export const FALLBACK_SELLER = "Plenti";
export const FALLBACK_WAREHOUSE = "Abuja North";
export const FALLBACK_VENDOR_PENDING = 8;
export const FALLBACK_PUBLISHED_COUNT = 3044;
export const FALLBACK_UNPUBLISHED_COUNT = 158;

export function productListingBadge(product: Product): ProductListingBadge {
  if (product.status === "Unavailable") return "Unpublished";
  if (product.status === "OutOfStock" || product.stockLevel <= 0) {
    return "Out of stock";
  }
  return "Published";
}

export function productMatchesListingFilter(
  product: Product,
  filter: ProductListingFilter,
): boolean {
  if (filter === "all") return true;
  const badge = productListingBadge(product);
  if (filter === "published") return badge === "Published";
  if (filter === "unpublished") return badge === "Unpublished";
  return badge === "Out of stock";
}

export function productStockLabel(product: Product): {
  text: string;
  tone: "ok" | "warn" | "danger";
} {
  const warehouse = product.warehouseName?.trim() || FALLBACK_WAREHOUSE;
  if (product.stockLevel <= 0) return { text: "0 in stock", tone: "danger" };
  if (product.stockLevel < 50) {
    return { text: `${product.stockLevel} left at ${warehouse}`, tone: "warn" };
  }
  return { text: `${product.stockLevel} in stock`, tone: "ok" };
}

export function productSeller(product: Product): string {
  return product.seller?.trim() || FALLBACK_SELLER;
}

export function productSku(product: Product): string {
  const sku = product.sku?.trim();
  if (sku) return sku;
  return `SKU-${product.id}`;
}

export function productUpdatedLabel(product: Product): string {
  if (!product.updatedAt) return "2 days ago";
  const date = new Date(product.updatedAt);
  if (Number.isNaN(date.getTime())) return "2 days ago";
  const diffMs = Date.now() - date.getTime();
  const mins = Math.floor(diffMs / 60000);
  if (mins < 1) return "Just now";
  if (mins < 60) return `${mins} min ago`;
  const hours = Math.floor(mins / 60);
  if (hours < 24) return `${hours} hour${hours === 1 ? "" : "s"} ago`;
  const days = Math.floor(hours / 24);
  if (days < 7) return `${days} day${days === 1 ? "" : "s"} ago`;
  return date.toLocaleDateString("en-GB", {
    day: "numeric",
    month: "short",
    year: "numeric",
  });
}

export function listingBadgeClass(badge: ProductListingBadge): string {
  if (badge === "Published") return "bg-[#ECFDF3] text-[#027A48]";
  if (badge === "Unpublished") return "bg-[#F2F4F7] text-[#344054]";
  return "bg-[#FEF3F2] text-[#B42318]";
}

export function stockToneClass(tone: "ok" | "warn" | "danger"): string {
  if (tone === "ok") return "text-[#027A48]";
  if (tone === "warn") return "text-[#B54708]";
  return "text-[#B42318]";
}
