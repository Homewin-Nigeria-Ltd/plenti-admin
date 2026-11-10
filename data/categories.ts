export const CATEGORIES_API = {
  list: "/api/admin/categories",
};

export function categoryPath(id: number) {
  return `${CATEGORIES_API.list}/${id}`;
}

export function categoryDeleteCheckPath(id: number) {
  return `${categoryPath(id)}/delete-check`;
}
