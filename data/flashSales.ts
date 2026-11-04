export const FLASH_SALES_API = {
  list: "/api/admin/flash-sales",
};

export function flashSalePath(id: number) {
  return `${FLASH_SALES_API.list}/${id}`;
}
