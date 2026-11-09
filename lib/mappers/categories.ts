import type { CategoryRow } from "@/types/CategoryTypes";
import type { AdminCategory } from "@/types/ProductTypes";

export function resolveCategoryLabels(
  categoryId: number | null | undefined,
  fallbackName: string,
  tree: AdminCategory[]
): { category: string; subCategory: string } {
  const name = fallbackName || "Uncategorized";
  if (!categoryId || tree.length === 0) {
    return { category: name, subCategory: "" };
  }

  const parentMatch = tree.find((c) => c.id === categoryId);
  if (parentMatch) {
    return { category: parentMatch.name, subCategory: "" };
  }

  const parentOfSub = tree.find((c) =>
    c.subcategories?.some((s) => s.id === categoryId)
  );
  if (parentOfSub) {
    const sub = parentOfSub.subcategories?.find((s) => s.id === categoryId);
    return {
      category: parentOfSub.name,
      subCategory: sub?.name ?? name,
    };
  }

  return { category: name, subCategory: "" };
}

export function flattenCategoryOptions(categories: AdminCategory[]) {
  const options: Array<{ id: number; name: string }> = [];
  for (const cat of categories) {
    const subs = Array.isArray(cat.subcategories) ? cat.subcategories : [];
    if (subs.length > 0) {
      for (const sub of subs) {
        options.push({ id: sub.id, name: sub.name });
      }
    } else {
      options.push({ id: cat.id, name: cat.name });
    }
  }
  return options;
}

export function getTopLevelCategories(categories: AdminCategory[]) {
  const hasNested = categories.some(
    (cat) => Array.isArray(cat.subcategories) && cat.subcategories.length > 0,
  );
  if (hasNested) return categories;
  return categories.filter((cat) => cat.parent_id == null);
}

export function categoryImageUrl(
  category: Pick<AdminCategory, "image" | "image_url">,
) {
  return category.image_url?.trim() || category.image?.trim() || null;
}

function parseCommission(raw: unknown): number | null {
  if (raw == null || raw === "") return null;
  const value = Number(raw);
  return Number.isFinite(value) ? value : null;
}

export function flattenAdminCategories(
  categories: AdminCategory[],
): CategoryRow[] {
  const hasNested = categories.some(
    (cat) => Array.isArray(cat.subcategories) && cat.subcategories.length > 0,
  );

  if (!hasNested) {
    const nameById = new Map(categories.map((cat) => [cat.id, cat.name]));
    return categories.map((cat) => ({
      id: cat.id,
      name: cat.name,
      slug: cat.slug,
      imageUrl: categoryImageUrl(cat),
      parent_id: cat.parent_id,
      parentName: cat.parent_id ? (nameById.get(cat.parent_id) ?? "—") : "—",
      type: cat.parent_id ? "Subcategory" : "Category",
      commission_rate: parseCommission(cat.commission_rate),
      created_at: cat.created_at,
    }));
  }

  const rows: CategoryRow[] = [];
  for (const cat of categories) {
    rows.push({
      id: cat.id,
      name: cat.name,
      slug: cat.slug,
      imageUrl: categoryImageUrl(cat),
      parent_id: cat.parent_id,
      parentName: "—",
      type: "Category",
      commission_rate: parseCommission(cat.commission_rate),
      created_at: cat.created_at,
    });
    for (const sub of cat.subcategories ?? []) {
      rows.push({
        id: sub.id,
        name: sub.name,
        slug: sub.slug,
        imageUrl: categoryImageUrl(sub),
        parent_id: sub.parent_id ?? cat.id,
        parentName: cat.name,
        type: "Subcategory",
        commission_rate: parseCommission(sub.commission_rate),
        created_at: sub.created_at,
      });
    }
  }
  return rows;
}

