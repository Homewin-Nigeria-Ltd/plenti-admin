import type {
  RecentStock,
  StockLevel,
  Warehouse,
} from "@/types/InventoryTypes";

export const INVENTORY_API = {
  getInventory: "/api/admin/inventory",
  getStatistics: "/api/admin/inventory/statistics",
  getWarehouses: "/api/admin/warehouses",
  createWarehouse: "/api/admin/warehouses",
  adjustStock: "/api/admin/inventory",
  transfer: "/api/admin/inventory/transfer",
  transfers: "/api/admin/inventory/transfers",
  auditLog: "/api/admin/inventory/audit-log",
  lowStockAlerts: "/api/admin/inventory/low-stock-alerts",
  reorderRecommendations: "/api/admin/inventory/reorder-recommendations",
} as const;

export const mockWarehouses: Warehouse[] = [
  {
    id: "WH001",
    name: "North Warehouse",
    units: 12450,
    fillPercentage: 78,
    manager: "Ahmed Olalekan",
  },
  {
    id: "WH002",
    name: "South Warehouse",
    units: 8450,
    fillPercentage: 70,
    manager: "Fatima Ibrahim",
  },
  {
    id: "WH003",
    name: "East Warehouse",
    units: 5600,
    fillPercentage: 45,
    manager: "Chukwu Emeka",
  },
  {
    id: "WH004",
    name: "West Warehouse",
    units: 3200,
    fillPercentage: 20,
    manager: "Amina Bello",
  },
];

export const mockRecentStock: RecentStock[] = [
  {
    id: "RS001",
    productName: "Yam",
    productImage: "https://picsum.photos/seed/yam/300/300",
    purchasedBy: "Oluwafemi Oluwatobi",
    quantity: 100,
    category: "Food Stuffs",
    price: 250000,
  },
  {
    id: "RS002",
    productName: "Bag of Rice",
    productImage: "https://picsum.photos/seed/rice/300/300",
    purchasedBy: "Adebayo Adeyemi",
    quantity: 50,
    category: "Food Stuffs",
    price: 150000,
  },
  {
    id: "RS003",
    productName: "Cooking Oil",
    productImage: "https://picsum.photos/seed/oil/300/300",
    purchasedBy: "Chinwe Okafor",
    quantity: 75,
    category: "Food Stuffs",
    price: 180000,
  },
  {
    id: "RS004",
    productName: "Beans",
    productImage: "https://picsum.photos/seed/beans/300/300",
    purchasedBy: "Ibrahim Musa",
    quantity: 120,
    category: "Food Stuffs",
    price: 200000,
  },
];

export const mockStockLevel: StockLevel = {
  activeInStock: 120450,
  highStock: 60,
  mediumStock: 24,
  lowStock: 16,
  highStockItems: 1840,
  mediumStockItems: 1840,
  lowStockItems: 1840,
};
