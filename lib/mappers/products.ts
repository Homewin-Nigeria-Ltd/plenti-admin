import type { Product, ProductBulkTier, ProductCategory } from "@/data/products";
import type { AdminCategory, AdminProductsResponse } from "@/types/ProductTypes";
import { resolveCategoryLabels } from "@/lib/mappers/categories";

function parseBulkTiers(raw: unknown): ProductBulkTier[] {
  if (!Array.isArray(raw)) return [];
  return raw
    .map((item) => {
      if (!item || typeof item !== "object") return null;
      const record = item as { min_qty?: unknown; price?: unknown };
      const min_qty = Number(record.min_qty);
      const price = Number(record.price);
      if (!Number.isFinite(min_qty) || min_qty <= 0) return null;
      if (!Number.isFinite(price) || price <= 0) return null;
      return { min_qty, price };
    })
    .filter((tier): tier is ProductBulkTier => tier !== null)
    .sort((a, b) => a.min_qty - b.min_qty);
}

export function mapAdminProductsToUi(
  products: AdminProductsResponse["data"]["data"],
  categoriesTree: AdminCategory[] = []
): Product[] {
  return products.map((p) => {
    const stock = typeof p.stock === "number" ? p.stock : 0;
    const low =
      typeof p.low_stock_threshold === "number" ? p.low_stock_threshold : 0;
    const isActive = !!p.is_active;

    const status: Product["status"] = !isActive
      ? "Unavailable"
      : stock <= 0
      ? "OutOfStock"
      : stock <= low
      ? "LowStock"
      : "Available";

    const price = typeof p.price === "string" ? Number(p.price) : p.price;
    const bulkPriceRaw =
      typeof p.bulk_price === "string"
        ? Number(p.bulk_price)
        : typeof p.bulk_price === "number"
          ? p.bulk_price
          : null;
    const minBulkQuantity =
      typeof p.min_bulk_quantity === "number" ? p.min_bulk_quantity : null;
    const bulkTiers = parseBulkTiers(p.bulk_tiers);
    if (
      bulkTiers.length === 0 &&
      typeof minBulkQuantity === "number" &&
      typeof bulkPriceRaw === "number" &&
      Number.isFinite(bulkPriceRaw)
    ) {
      bulkTiers.push({ min_qty: minBulkQuantity, price: bulkPriceRaw });
    }
    const lastTierPrice = bulkTiers[bulkTiers.length - 1]?.price;
    const bulkPrice =
      typeof lastTierPrice === "number" && Number.isFinite(lastTierPrice)
        ? lastTierPrice
        : typeof bulkPriceRaw === "number" && Number.isFinite(bulkPriceRaw)
          ? bulkPriceRaw
          : price;

    const discountPercentRaw =
      typeof p.discount_percent === "string"
        ? Number(p.discount_percent)
        : typeof p.discount_percent === "number"
          ? p.discount_percent
          : null;

    const images =
      Array.isArray(p.images) && p.images.length > 0
        ? p.images.filter((u): u is string => typeof u === "string" && !!u)
        : p.image_url
        ? [p.image_url]
        : [];

    const imageUrl =
      typeof images[0] === "string" && images[0]
        ? images[0]
        : p.image_url ?? "https://picsum.photos/seed/product/300/300";

    const categoryId = p.category?.id ?? p.category_id ?? null;
    const labels = resolveCategoryLabels(
      categoryId,
      p.category?.name ?? "Uncategorized",
      categoriesTree
    );

    return {
      id: p.id,
      name: p.name,
      description: p.description ?? "",
      price,
      bulkPrice,
      minBulkQuantity,
      bulkPriceRaw:
        typeof bulkPriceRaw === "number" && Number.isFinite(bulkPriceRaw)
          ? bulkPriceRaw
          : null,
      bulkTiers,
      discountPercent:
        typeof discountPercentRaw === "number" &&
        Number.isFinite(discountPercentRaw)
          ? discountPercentRaw
          : null,
      category: labels.category as ProductCategory,
      categoryId,
      subCategory: labels.subCategory,
      stockLevel: stock,
      status,
      imageUrl,
      images,
    };
  });
}
