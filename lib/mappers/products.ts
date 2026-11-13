import type { Product, ProductBulkTier, ProductCategory } from "@/data/products";
import type { AdminCategory, AdminProductsResponse } from "@/types/ProductTypes";
import { resolveCategoryLabels } from "@/lib/mappers/categories";

function extractImageUrl(value: unknown): string | null {
  if (typeof value === "string" && value.trim()) return value.trim();
  if (!value || typeof value !== "object") return null;
  const record = value as Record<string, unknown>;
  for (const key of ["url", "image_url", "original_url", "full_url", "image", "src", "path"]) {
    if (typeof record[key] === "string" && record[key].trim()) {
      return record[key].trim();
    }
  }
  return null;
}

function asImageList(value: unknown): unknown[] {
  if (Array.isArray(value)) return value;
  if (typeof value === "string" && value.trim().startsWith("[")) {
    try {
      const parsed = JSON.parse(value) as unknown;
      if (Array.isArray(parsed)) return parsed;
    } catch {
      return [];
    }
  }
  return [];
}

function collectProductImages(product: {
  image_url?: string | null;
  images?: unknown;
  image_urls?: unknown;
}): string[] {
  const urls: string[] = [];
  for (const bucket of [product.images, product.image_urls]) {
    for (const item of asImageList(bucket)) {
      const url = extractImageUrl(item);
      if (url) urls.push(url);
    }
  }
  const primary = extractImageUrl(product.image_url);
  if (primary) urls.unshift(primary);
  return Array.from(new Set(urls));
}

export function productDisplayImages(product: {
  imageUrl?: string | null;
  images?: string[] | null;
}): string[] {
  const urls = (product.images ?? []).filter(
    (url): url is string => typeof url === "string" && url.length > 0,
  );
  if (urls.length > 0) return Array.from(new Set(urls));
  if (product.imageUrl) return [product.imageUrl];
  return [];
}

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

    const images = collectProductImages(p);
    const imageUrl =
      images[0] ?? "https://picsum.photos/seed/product/300/300";

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
      weight: (() => {
        const raw =
          typeof p.weight === "string" ? Number(p.weight) : p.weight;
        return typeof raw === "number" && Number.isFinite(raw) ? raw : null;
      })(),
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
