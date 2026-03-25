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

export type InventoryItemWarehouse = {
  id: number;
  name: string;
  quantity: number;
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
  warehouses_list?: InventoryItemWarehouse[];
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
    warehouse_id?: number | string;
  }) => Promise<boolean>;
  clearError: () => void;
};

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

export type WarehouseApi = {
  id: number;
  name: string;
  manager: string;
  location: string;
  description: string;
  is_active: boolean;
  total_products: number;
  total_units: number;
  total_worth: number;
  created_at: string;
  updated_at: string;
};

export type WarehousesResponse = {
  status: string;
  code: number;
  message: string;
  data: WarehouseApi[];
  timestamp: string;
};

export type CreateWarehouseRequest = {
  name: string;
  manager: string;
  location: string;
  description: string;
};

export type AuditLogUser = {
  id: number;
  name: string;
  amount_spent?: number;
  total_orders?: number;
};

export type AuditLogProduct = {
  id: number;
  name: string;
  sku: string | null;
  average_rating?: number;
};

export type AuditLogWarehouse = {
  id: number;
  name: string;
};

export type AuditLogEntry = {
  id: number;
  user_id: number;
  action_type: string;
  product_id: number;
  warehouse_id: number;
  details: Record<string, unknown>;
  description: string;
  created_at: string;
  updated_at: string;
  user: AuditLogUser;
  product: AuditLogProduct;
  warehouse: AuditLogWarehouse;
};

export type AuditLogResponse = {
  status?: string;
  code?: number;
  message?: string;
  data: {
    current_page: number;
    data: AuditLogEntry[];
    first_page_url: string;
    from: number;
    last_page: number;
    last_page_url: string;
    links: { url: string | null; label: string; page: number | null; active: boolean }[];
    next_page_url: string | null;
    path: string;
    per_page: number;
    prev_page_url: string | null;
    to: number;
    total: number;
  };
  timestamp?: string;
};

export type LowStockAlertProduct = {
  id: number;
  name: string;
  sku: string | null;
  slug: string;
  description: string | null;
  category_id: number | null;
  brand_id: number | null;
  price: number;
  cost_price: number | null;
  stock: number;
  min_bulk_quantity: number | null;
  bulk_price: number | null;
  low_stock_threshold: number;
  weight: number | null;
  image_url: string | null;
  images: unknown;
  is_active: boolean;
  created_at: string;
  updated_at: string;
  created_by: number | null;
  updated_by: number | null;
  stock_status: string;
  reorder_priority: string;
  average_rating: number;
  category: { id: number; name: string; slug: string } | null;
};

export type LowStockAlertsResponse = {
  status?: string;
  code?: number;
  message?: string;
  data: {
    products: LowStockAlertProduct[];
    count: number;
    threshold: number;
  };
  timestamp?: string;
};

export type TransferHistoryUser = {
  id: number;
  name: string;
  amount_spent?: number;
  total_orders?: number;
};

export type TransferHistoryEntry = {
  id: number;
  product_id: number;
  from_warehouse_id: number;
  to_warehouse_id: number;
  quantity: number;
  status: string;
  transferred_by: TransferHistoryUser;
  notes: string | null;
  created_at: string;
  updated_at: string;
  product: AuditLogProduct;
  from_warehouse: AuditLogWarehouse;
  to_warehouse: AuditLogWarehouse;
};

export type TransfersResponse = {
  status?: string;
  code?: number;
  message?: string;
  data: {
    current_page: number;
    data: TransferHistoryEntry[];
    first_page_url: string;
    from: number;
    last_page: number;
    last_page_url: string;
    links: { url: string | null; label: string; page: number | null; active: boolean }[];
    next_page_url: string | null;
    path: string;
    per_page: number;
    prev_page_url: string | null;
    to: number;
    total: number;
  };
  timestamp?: string;
};

export type TransferRequestApiEntry = {
  id: number;
  status?: string;
  note?: string | null;
  notes?: string | null;
  created_at?: string;
  reference?: string | null;
  request_number?: string | null;
  source_warehouse?: { id?: number; name?: string };
  destination_warehouse?: { id?: number; name?: string };
  from_warehouse?: { id?: number; name?: string };
  to_warehouse?: { id?: number; name?: string };
  items?: Array<{
    quantity?: number;
    qty?: number;
    product?: { name?: string };
    product_id?: number;
  }>;
  product?: { name?: string };
  quantity?: number;
};

export type TransferRequestsPaginatedMeta = {
  current_page?: number;
  data?: TransferRequestApiEntry[];
  last_page?: number;
  per_page?: number;
  total?: number;
};

export type TransferRequestsResponse = {
  status?: string;
  code?: number;
  message?: string;
  data?: TransferRequestsPaginatedMeta | TransferRequestApiEntry[];
  timestamp?: string;
};

export function parseTransferRequestsResponse(res: TransferRequestsResponse): {
  rows: TransferRequestApiEntry[];
  lastPage: number;
  total: number;
} {
  const d = res.data;
  if (!d) return { rows: [], lastPage: 1, total: 0 };
  if (Array.isArray(d)) {
    return { rows: d, lastPage: 1, total: d.length };
  }
  const rows = d.data ?? [];
  return {
    rows,
    lastPage: d.last_page ?? 1,
    total: d.total ?? rows.length,
  };
}

export type RestockRecommendationItem = {
  type: string;
  product_id: number;
  product_name: string;
  category: string;
  supplier: string;
  current_stock: number;
  daily_velocity: number;
  units_sold_30days: string;
  days_until_stockout: number;
  predicted_stockout_date: string;
  recommended_restock_quantity: number;
  priority: string;
  potential_revenue_loss: number;
  reason: string;
};

export type RestockAlertItem = {
  type: string;
  product_id: number;
  product_name: string;
  category: string;
  supplier: string;
  current_stock: number;
  threshold: number;
  priority: string;
  message: string;
};

export type RestockSummary = {
  total_recommendations: number;
  total_alerts: number;
  critical_items: number;
  high_priority_items: number;
  analysis_period: string;
  prediction_window: string;
  generated_at: string;
};

export type RestockRecommendationsResponse = {
  status?: string;
  code?: number;
  message?: string;
  data: {
    recommendations: RestockRecommendationItem[];
    alerts: RestockAlertItem[];
    summary: RestockSummary;
  };
  timestamp?: string;
};
