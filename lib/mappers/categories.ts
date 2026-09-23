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

