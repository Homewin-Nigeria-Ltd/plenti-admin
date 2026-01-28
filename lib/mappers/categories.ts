import type { AdminCategory } from "@/types/ProductTypes";

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

