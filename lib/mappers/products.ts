import type { Product, ProductCategory } from "@/data/products";
import type { AdminProductsResponse } from "@/types/ProductTypes";

export function mapAdminProductsToUi(
  products: AdminProductsResponse["data"]["data"]
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
    const bulkPrice =
      typeof bulkPriceRaw === "number" && Number.isFinite(bulkPriceRaw)
        ? bulkPriceRaw
        : price;

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

    return {
      id: p.id,
      name: p.name,
      description: p.description ?? "",
      price,
      bulkPrice,
      minBulkQuantity:
        typeof p.min_bulk_quantity === "number" ? p.min_bulk_quantity : null,
      bulkPriceRaw:
        typeof bulkPriceRaw === "number" && Number.isFinite(bulkPriceRaw)
          ? bulkPriceRaw
          : null,
      category: (p.category?.name ?? "Uncategorized") as ProductCategory,
      categoryId: p.category?.id ?? p.category_id ?? null,
      subCategory: "",
      stockLevel: stock,
      status,
      imageUrl,
      images,
    };
  });
}
