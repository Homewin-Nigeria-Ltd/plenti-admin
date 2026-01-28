"use client";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Skeleton } from "@/components/ui/skeleton";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { ALL_PRODUCTS_CATEGORY } from "@/data/products";
import { useProductStore } from "@/store/useProductStore";
import { Grid, List, Plus, Search } from "lucide-react";
import * as React from "react";
import { useDebounce } from "use-debounce";
import { CreateProductModal } from "./CreateProductModal";
import ProductGrid from "./ProductGrid";
import ProductTable from "./ProductTable";
import Image from "next/image";
import { cn } from "@/lib/utils";

export default function ProductCatalog() {
  const {
    products,
    loadingProducts,
    fetchProducts,
    fetchCategories,
    categoryOptions,
    currentPage,
    lastPage,
    totalItems,
    perPage,
  } = useProductStore();
  const [selectedCategoryId, setSelectedCategoryId] = React.useState<
    number | null
  >(null);
  const [searchQuery, setSearchQuery] = React.useState("");
  const [viewMode, setViewMode] = React.useState<"grid" | "list">("grid");
  const [isCreateModalOpen, setIsCreateModalOpen] = React.useState(false);
  const pageSize = perPage || 20;
  const [debouncedSearch] = useDebounce(searchQuery, 400);

  React.useEffect(() => {
    fetchCategories();
  }, [fetchCategories]);

  const formatCurrency = (n: number) =>
    new Intl.NumberFormat("en-NG", {
      style: "currency",
      currency: "NGN",
      minimumFractionDigits: 0,
    }).format(n);

  // Fetch products when filters/search change (reset to page 1).
  React.useEffect(() => {
    fetchProducts({
      page: 1,
      categoryId: selectedCategoryId,
      search: debouncedSearch,
    });
  }, [fetchProducts, selectedCategoryId, debouncedSearch]);

  const categories = React.useMemo(() => {
    return [
      { value: ALL_PRODUCTS_CATEGORY, label: ALL_PRODUCTS_CATEGORY },
      ...categoryOptions
        .filter((c) => c.id > 0)
        .map((c) => ({ value: String(c.id), label: c.name })),
    ];
  }, [categoryOptions]);

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
            className="btn btn-primary w-full sm:w-auto rounded-[4px]"
            onClick={() => setIsCreateModalOpen(true)}
          >
            <Plus className="size-4" />
            <span className="hidden sm:inline">Add New Product</span>
            <span className="sm:hidden">Add</span>
          </Button>
        </div>
      </div>

      {loadingProducts ? (
        viewMode === "grid" ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {Array.from({ length: 8 }).map((_, idx) => (
              <div
                key={idx}
                className="bg-white rounded-xl border border-neutral-100 shadow-xs relative overflow-hidden"
              >
                <Skeleton className="h-48 w-full" />
                <div className="p-4 sm:p-5 space-y-3">
                  <div className="space-y-2">
                    <Skeleton className="h-5 w-3/4" />
                    <Skeleton className="h-4 w-full" />
                    <Skeleton className="h-4 w-2/3" />
                  </div>
                  <div className="space-y-2">
                    <Skeleton className="h-4 w-full" />
                    <Skeleton className="h-4 w-full" />
                    <Skeleton className="h-4 w-1/2" />
                  </div>
                  <div className="pt-2 border-t border-neutral-100 flex items-center justify-between gap-2">
                    <Skeleton className="h-4 w-24" />
                    <Skeleton className="h-6 w-10 rounded-full" />
                  </div>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="bg-white rounded-xl border border-neutral-100 overflow-x-auto">
            <div className="min-w-[720px]">
              <div className="grid grid-cols-8 gap-4 px-4 py-3 border-b border-neutral-100">
                {Array.from({ length: 8 }).map((_, idx) => (
                  <Skeleton key={idx} className="h-4 w-20" />
                ))}
              </div>
              {Array.from({ length: pageSize }).map((_, rowIdx) => (
                <div
                  key={rowIdx}
                  className="grid grid-cols-8 gap-4 px-4 py-4 border-b border-neutral-100"
                >
                  {Array.from({ length: 8 }).map((_, cellIdx) => (
                    <Skeleton key={cellIdx} className="h-4 w-full" />
                  ))}
                </div>
              ))}
              <div className="flex items-center justify-between px-4 py-3">
                <Skeleton className="h-4 w-32" />
                <div className="flex items-center gap-2">
                  <Skeleton className="h-8 w-24 rounded-full" />
                  <Skeleton className="h-8 w-24 rounded-full" />
                </div>
              </div>
            </div>
          </div>
        )
      ) : null}

      <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-4">
        <div className="overflow-x-auto -mx-4 px-4 sm:mx-0 sm:px-0">
          <Tabs
            value={
              selectedCategoryId == null
                ? ALL_PRODUCTS_CATEGORY
                : String(selectedCategoryId)
            }
            onValueChange={(value) => {
              if (value === ALL_PRODUCTS_CATEGORY) {
                setSelectedCategoryId(null);
              } else {
                const parsed = Number(value);
                setSelectedCategoryId(
                  Number.isFinite(parsed) && parsed > 0 ? parsed : null
                );
              }
            }}
          >
            <TabsList className="bg-transparent border-0 p-0 h-auto gap-2 min-w-max">
              {categories.map((category) => (
                <TabsTrigger
                  key={category.value}
                  value={category.value}
                  className="data-[state=active]:bg-[#E8EEFF] data-[state=active]:text-[#0B1E66] data-[state=active]:shadow-sm rounded-[3px] px-3 sm:px-4 py-2 text-xs sm:text-sm font-medium whitespace-nowrap text-[#808080]"
                >
                  {category.label}
                </TabsTrigger>
              ))}
            </TabsList>
          </Tabs>
        </div>
        <div className="flex items-center gap-2 shrink-0">
          <Button
            variant="outline"
            size="icon"
            className={cn(
              viewMode === "list" ? "bg-[#E8EEFF]" : "",
              "size-[32px] border-0 rounded-0 hover:bg-[#E8EEFF] shadow-none"
            )}
            onClick={() => setViewMode("list")}
          >
            <Image
              src={
                viewMode === "list"
                  ? "/icons/list-bottom-active.png"
                  : "/icons/list-bottom.png"
              }
              alt="List view"
              width={20}
              height={20}
            />
          </Button>
          <Button
            variant="outline"
            size="icon"
            className={cn(
              viewMode === "grid" ? "bg-[#E8EEFF]" : "",
              "size-[32px] border-0 rounded-0 hover:bg-[#E8EEFF] shadow-none"
            )}
            onClick={() => setViewMode("grid")}
          >
            <Image
              src={
                viewMode === "grid"
                  ? "/icons/grid-nine-active.png"
                  : "/icons/grid-nine.png"
              }
              alt="Grid view"
              width={20}
              height={20}
            />
          </Button>
        </div>
      </div>

      {!loadingProducts && viewMode === "grid" ? (
        <ProductGrid
          products={products}
          total={totalItems}
          page={currentPage}
          pageCount={lastPage}
          onPageChange={(nextPage) => {
            fetchProducts({
              page: nextPage,
              categoryId: selectedCategoryId,
              search: debouncedSearch,
            });
          }}
          formatCurrency={formatCurrency}
        />
      ) : !loadingProducts ? (
        <ProductTable
          products={products}
          total={totalItems}
          page={currentPage}
          pageCount={lastPage}
          pageSize={pageSize}
          onPageChange={(nextPage) => {
            fetchProducts({
              page: nextPage,
              categoryId: selectedCategoryId,
              search: debouncedSearch,
            });
          }}
          formatCurrency={formatCurrency}
        />
      ) : null}

      <CreateProductModal
        isOpen={isCreateModalOpen}
        onClose={() => setIsCreateModalOpen(false)}
      />
    </div>
  );
}
