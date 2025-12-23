export type ProductCategory =
  | "All Product"
  | "Food & Beverages"
  | "Personal Care & Hygiene"
  | "Household Care"
  | "Health & Wellness";

export type ProductStatus =
  | "Available"
  | "Unavailable"
  | "OutOfStock"
  | "LowStock";

export type Product = {
  id: string;
  name: string;
  description: string;
  price: number;
  bulkPrice: number;
  category: ProductCategory;
  subCategory: string;
  stockLevel: number;
  status: ProductStatus;
  imageUrl: string;
};

export const mockProducts: Product[] = [
  {
    id: "1",
    name: "Mr. Chef Salt",
    description: "High-quality premium salt for cooking",
    price: 45000,
    bulkPrice: 40000,
    category: "Food & Beverages",
    subCategory: "Food",
    stockLevel: 450000,
    status: "Available",
    imageUrl: "https://picsum.photos/seed/mr-chef-salt/300/300",
  },
  {
    id: "2",
    name: "Sonia Tomato Mix",
    description: "Concentrated tomato paste",
    price: 35000,
    bulkPrice: 30000,
    category: "Food & Beverages",
    subCategory: "Food",
    stockLevel: 120000,
    status: "Available",
    imageUrl: "https://picsum.photos/seed/sonia-tomato/300/300",
  },
  {
    id: "3",
    name: "Golden Penny Spaghetti 500g",
    description: "Premium quality spaghetti pasta",
    price: 25000,
    bulkPrice: 22000,
    category: "Food & Beverages",
    subCategory: "Food",
    stockLevel: 24,
    status: "LowStock",
    imageUrl: "https://picsum.photos/seed/golden-penny-spaghetti/300/300",
  },
  {
    id: "4",
    name: "Golden Penny Goldenvita",
    description: "Nutritious breakfast cereal",
    price: 55000,
    bulkPrice: 50000,
    category: "Food & Beverages",
    subCategory: "Food",
    stockLevel: 89000,
    status: "Available",
    imageUrl: "https://picsum.photos/seed/goldenvita/300/300",
  },
  {
    id: "5",
    name: "Mama Gold Rice",
    description: "High-quality premium long grain rice",
    price: 65000,
    bulkPrice: 60000,
    category: "Food & Beverages",
    subCategory: "Food",
    stockLevel: 340000,
    status: "Available",
    imageUrl: "https://picsum.photos/seed/mama-gold-rice/300/300",
  },
  {
    id: "6",
    name: "Sunflower Groundnut Oil",
    description: "Pure and natural cooking oil",
    price: 75000,
    bulkPrice: 70000,
    category: "Food & Beverages",
    subCategory: "Food",
    stockLevel: 156000,
    status: "Available",
    imageUrl: "https://picsum.photos/seed/sunflower-oil/300/300",
  },
  {
    id: "7",
    name: "Ayoola Poundo Yam",
    description: "Premium pounded yam flour",
    price: 85000,
    bulkPrice: 80000,
    category: "Food & Beverages",
    subCategory: "Food",
    stockLevel: 78000,
    status: "Available",
    imageUrl: "https://picsum.photos/seed/ayoola-poundo/300/300",
  },
  {
    id: "8",
    name: "Golden Penny Goldenvita (Dano Cool Cow)",
    description: "Chocolate flavored breakfast cereal",
    price: 55000,
    bulkPrice: 50000,
    category: "Food & Beverages",
    subCategory: "Food",
    stockLevel: 67000,
    status: "Available",
    imageUrl: "https://picsum.photos/seed/dano-cool-cow/300/300",
  },
  {
    id: "9",
    name: "Dettol Antiseptic Liquid",
    description: "Powerful antiseptic for hygiene",
    price: 45000,
    bulkPrice: 40000,
    category: "Personal Care & Hygiene",
    subCategory: "Hygiene",
    stockLevel: 234000,
    status: "Available",
    imageUrl: "https://picsum.photos/seed/dettol/300/300",
  },
  {
    id: "10",
    name: "OMO Detergent Powder",
    description: "Effective laundry detergent",
    price: 35000,
    bulkPrice: 32000,
    category: "Household Care",
    subCategory: "Cleaning",
    stockLevel: 189000,
    status: "Available",
    imageUrl: "https://picsum.photos/seed/omo/300/300",
  },
  {
    id: "11",
    name: "Paracetamol Tablets",
    description: "Pain relief medication",
    price: 15000,
    bulkPrice: 13000,
    category: "Health & Wellness",
    subCategory: "Medication",
    stockLevel: 456000,
    status: "Available",
    imageUrl: "https://picsum.photos/seed/paracetamol/300/300",
  },
  {
    id: "12",
    name: "Closeup Toothpaste",
    description: "Fresh breath toothpaste",
    price: 25000,
    bulkPrice: 22000,
    category: "Personal Care & Hygiene",
    subCategory: "Oral Care",
    stockLevel: 278000,
    status: "Available",
    imageUrl: "https://picsum.photos/seed/closeup/300/300",
  },
];

