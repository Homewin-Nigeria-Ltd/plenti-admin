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
  /** From API statistics; when set, card can show product count and stock value */
  product_count?: number;
  stock_value?: string;
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
};

/** GET {{base_url}}/api/admin/inventory/statistics */
export type InventoryStockLevelBreakdown = {
  in_stock: { count: number; percentage: number };
  low_stock: { count: number; percentage: number };
  out_of_stock: { count: number; percentage: number };
};

export type InventoryStatisticsRecentStock = {
  id: number;
  name: string;
  sku: string | null;
  stock: number;
  price: number;
  category: string;
  stock_status: string;
  inventory_value: number;
  last_updated: string;
};

export type InventoryStatisticsLowStockAlert = {
  id: number;
  name: string;
  sku: string | null;
  stock: number;
  price: number;
  category: string;
  stock_status: string;
  reorder_priority: string;
};

export type InventoryStatisticsWarehouse = {
  warehouse_name: string;
  total_stock: string;
  product_count: number;
  stock_value: string;
};

export type InventoryStatisticsTopStock = {
  id: number;
  name: string;
  sku: string | null;
  stock: number;
  price: number;
  category: string;
  stock_value: string;
};

export type InventoryStatistics = {
  total_products: number;
  active_products: number;
  inactive_products: number;
  in_stock_products: number;
  low_stock_products: number;
  out_of_stock_products: number;
  total_stock_quantity: string;
  total_inventory_value: string;
  average_stock_per_product: string;
  categories_count: number;
  units_sold_last_30_days: string;
  stock_level_breakdown: InventoryStockLevelBreakdown;
  recent_stocks: InventoryStatisticsRecentStock[];
  low_stock_alerts: InventoryStatisticsLowStockAlert[];
  warehouse_breakdown: InventoryStatisticsWarehouse[];
  top_stock_by_value: InventoryStatisticsTopStock[];
};
