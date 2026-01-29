export type InventoryStatus =
  | "High Stock"
  | "Medium Stock"
  | "Low Stock"
  | "In Stock";

export type Warehouse = {
  id: string;
  name: string;
  units: number;
  fillPercentage: number;
  manager: string;
};

export type InventoryItem = {
  id: string;
  productId: string;
  productName: string;
  productImage: string;
  quantity: number;
  status: InventoryStatus;
  category: string;
  inventoryValue: string;
  warehouse?: string;
  warehouseId?: string;
  expiryDate?: string | null;
  batch?: string;
  supplier?: string;
};

export type RecentStock = {
  id: string;
  productName: string;
  productImage: string;
  purchasedBy: string;
  quantity: number;
  category: string;
  price: number;
};

export type StockLevel = {
  activeInStock: number;
  highStock: number;
  mediumStock: number;
  lowStock: number;
  highStockItems: number;
  mediumStockItems: number;
  lowStockItems: number;
};

export type InventoryItemApi = {
  id: number;
  name: string;
  sku: string | null;
  slug: string;
  image_url: string | null;
  stock: number;
  stock_status: string;
  inventory_value: string;
  category?: { id: number; name: string; slug: string } | null;
};

export type InventoryListResponse = {
  status?: string;
  code?: number;
  message?: string;
  data: {
    current_page: number;
    data: InventoryItemApi[];
    last_page: number;
    per_page: number;
    total: number;
  };
};

export type InventoryState = {
  items: InventoryItemApi[];
  loading: boolean;
  error: string | null;
  currentPage: number;
  lastPage: number;
  perPage: number;
  totalItems: number;
  lastQuery: { page: number; search: string };

  fetchInventory: (params?: {
    page?: number;
    search?: string;
  }) => Promise<boolean>;
  clearError: () => void;
}
