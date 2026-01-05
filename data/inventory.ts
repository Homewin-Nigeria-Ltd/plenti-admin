export type InventoryStatus = "High Stock" | "Medium Stock" | "Low Stock";

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
  warehouse: string;
  warehouseId: string;
  quantity: number;
  expiryDate: string | null;
  status: InventoryStatus;
  batch: string;
  supplier: string;
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

export const mockInventoryItems: InventoryItem[] = [
  {
    id: "INV001",
    productId: "P001",
    productName: "Mr. Chef Salt",
    productImage: "https://picsum.photos/seed/mr-chef-salt/300/300",
    warehouse: "WH001",
    warehouseId: "WH001",
    quantity: 150,
    expiryDate: "2025-06-30",
    status: "High Stock",
    batch: "BATCH001",
    supplier: "Nigerian Rice Mills Ltd",
  },
  {
    id: "INV002",
    productId: "P002",
    productName: "Sonia Tomato Mix",
    productImage: "https://picsum.photos/seed/sonia-tomato/300/300",
    warehouse: "WH001",
    warehouseId: "WH001",
    quantity: 85,
    expiryDate: "2025-05-15",
    status: "Medium Stock",
    batch: "BATCH002",
    supplier: "Food Products Co.",
  },
  {
    id: "INV003",
    productId: "P003",
    productName: "Golden Penny Spaghetti",
    productImage: "https://picsum.photos/seed/spaghetti/300/300",
    warehouse: "WH002",
    warehouseId: "WH002",
    quantity: 25,
    expiryDate: "2026-01-20",
    status: "Low Stock",
    batch: "BATCH003",
    supplier: "Pasta Industries",
  },
  {
    id: "INV004",
    productId: "P004",
    productName: "Dangote Sugar",
    productImage: "https://picsum.photos/seed/sugar/300/300",
    warehouse: "WH001",
    warehouseId: "WH001",
    quantity: 200,
    expiryDate: null,
    status: "High Stock",
    batch: "BATCH004",
    supplier: "Dangote Group",
  },
  {
    id: "INV005",
    productId: "P005",
    productName: "Crown Flour",
    productImage: "https://picsum.photos/seed/flour/300/300",
    warehouse: "WH003",
    warehouseId: "WH003",
    quantity: 45,
    expiryDate: "2025-08-10",
    status: "Medium Stock",
    batch: "BATCH005",
    supplier: "Flour Mills Nigeria",
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
