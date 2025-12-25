"use client";

import * as React from "react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { mockProducts } from "@/data/products";
import { ProductCategory } from "@/data/products";
import { Search, Plus, List, Grid } from "lucide-react";
import ProductGrid from "./ProductGrid";
import ProductTable from "./ProductTable";
import { CreateProductModal } from "./CreateProductModal";

export default function ProductCatalog() {
  const [searchQuery, setSearchQuery] = React.useState("");
  const [selectedCategory, setSelectedCategory] =
    React.useState<ProductCategory>("All Product");
  const [viewMode, setViewMode] = React.useState<"grid" | "list">("grid");
  const [page, setPage] = React.useState(1);
  const [isCreateModalOpen, setIsCreateModalOpen] = React.useState(false);
  const pageSize = 10;

  const formatCurrency = (n: number) =>
    new Intl.NumberFormat("en-NG", {
      style: "currency",
      currency: "NGN",
      minimumFractionDigits: 0,
    }).format(n);

  const categories: ProductCategory[] = [
    "All Product",
    "Food & Beverages",
    "Personal Care & Hygiene",
    "Household Care",
    "Health & Wellness",
  ];

  const filteredProducts = React.useMemo(() => {
    let filtered = mockProducts;

    if (selectedCategory !== "All Product") {
      filtered = filtered.filter((p) => p.category === selectedCategory);
    }

    if (searchQuery) {
      filtered = filtered.filter(
        (p) =>
          p.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
          p.description.toLowerCase().includes(searchQuery.toLowerCase())
      );
    }

    return filtered;
  }, [selectedCategory, searchQuery]);

  React.useEffect(() => {
    setPage(1);
  }, [selectedCategory, searchQuery]);

  const paginatedProducts = React.useMemo(() => {
    const startIndex = (page - 1) * pageSize;
    const endIndex = startIndex + pageSize;
    return filteredProducts.slice(startIndex, endIndex);
  }, [filteredProducts, page, pageSize]);

  const pageCount = Math.max(1, Math.ceil(filteredProducts.length / pageSize));

  return (
    <div className="space-y-4 md:space-y-6">
      <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-4">
        <div className="border border-neutral-100 rounded-[8px] h-[50px] flex items-center gap-1 p-2 px-4 shadow-sm flex-1 max-w-full sm:max-w-md">
          <Search className="size-5 text-neutral-500 shrink-0" />
          <Input
            className="w-full placeholder:text-primary-700 border-0 outline-none focus-visible:ring-0 shadow-none"
            placeholder="Search"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
        </div>
        <div className="flex items-center gap-2 shrink-0">
          <Button
            className="btn btn-primary w-full sm:w-auto"
            onClick={() => setIsCreateModalOpen(true)}>
            <Plus className="size-4" />
            <span className="hidden sm:inline">Add New Product</span>
            <span className="sm:hidden">Add</span>
          </Button>
        </div>
      </div>

      <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-4">
        <div className="overflow-x-auto -mx-4 px-4 sm:mx-0 sm:px-0">
          <Tabs
            value={selectedCategory}
            onValueChange={(value) => setSelectedCategory(value as ProductCategory)}>
            <TabsList className="bg-transparent border-0 p-0 h-auto gap-2 min-w-max">
              {categories.map((category) => (
                <TabsTrigger
                  key={category}
                  value={category}
                  className="data-[state=active]:bg-primary data-[state=active]:text-white data-[state=active]:shadow-sm rounded-md px-3 sm:px-4 py-2 text-xs sm:text-sm font-medium whitespace-nowrap">
                  {category}
                </TabsTrigger>
              ))}
            </TabsList>
          </Tabs>
        </div>
        <div className="flex items-center gap-2 shrink-0">
          <Button
            variant="outline"
            size="icon"
            className={viewMode === "list" ? "bg-primary text-primary-foreground" : ""}
            onClick={() => setViewMode("list")}>
            <List className="size-4" />
          </Button>
          <Button
            variant="outline"
            size="icon"
            className={viewMode === "grid" ? "bg-primary text-primary-foreground" : ""}
            onClick={() => setViewMode("grid")}>
            <Grid className="size-4" />
          </Button>
        </div>
      </div>

      {viewMode === "grid" ? (
        <ProductGrid
          products={paginatedProducts}
          total={filteredProducts.length}
          page={page}
          pageCount={pageCount}
          onPageChange={setPage}
          formatCurrency={formatCurrency}
        />
      ) : (
        <ProductTable
          products={paginatedProducts}
          total={filteredProducts.length}
          page={page}
          pageSize={pageSize}
          onPageChange={setPage}
          formatCurrency={formatCurrency}
        />
      )}

      <CreateProductModal
        isOpen={isCreateModalOpen}
        onClose={() => setIsCreateModalOpen(false)}
      />
    </div>
  );
}

