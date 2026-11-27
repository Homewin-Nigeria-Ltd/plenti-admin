"use client";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Skeleton } from "@/components/ui/skeleton";
import { getTopLevelCategories } from "@/lib/mappers/categories";
import { getProductPermissions } from "@/lib/modulePermissions";
import { cn } from "@/lib/utils";
import { useAccountStore } from "@/store/useAccountStore";
import { useProductStore } from "@/store/useProductStore";
import { LayoutGrid, List, Plus, Search, Upload } from "lucide-react";
import * as React from "react";
import { toast } from "sonner";
import { useDebounce } from "use-debounce";
import { CreateProductModal } from "./CreateProductModal";
import { BulkDeleteProductModal } from "./DeleteProductModal";
import ProductGrid from "./ProductGrid";
import ProductTable from "./ProductTable";
import {
  FALLBACK_PUBLISHED_COUNT,
  FALLBACK_UNPUBLISHED_COUNT,
  FALLBACK_VENDOR_PENDING,
  productMatchesListingFilter,
  type ProductListingFilter,
} from "./productManagementView";

export default function ProductCatalog() {
  const account = useAccountStore((state) => state.account);
  const {
    products,
    loadingProducts,
    fetchProducts,
    fetchCategories,
    categoriesTree,
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
  const [listingFilter, setListingFilter] =
    React.useState<ProductListingFilter>("all");
  const [sellerFilter, setSellerFilter] = React.useState("all");
  const [isCreateModalOpen, setIsCreateModalOpen] = React.useState(false);
  const [selectedIds, setSelectedIds] = React.useState<Set<number>>(
    () => new Set(),
  );
  const [isBulkDeleteOpen, setIsBulkDeleteOpen] = React.useState(false);
  const [loadingMore, setLoadingMore] = React.useState(false);
  const pageSize = perPage || 20;
  const [debouncedSearch] = useDebounce(searchQuery, 400);
  const {
    canViewProducts,
    canCreateProducts,
    canEditProducts,
    canDeleteProducts,
    canPublishProducts,
  } = React.useMemo(() => getProductPermissions(account), [account]);

  React.useEffect(() => {
    if (!canViewProducts) return;
    fetchCategories();
  }, [fetchCategories, canViewProducts]);

  const formatCurrency = (n: number) =>
    new Intl.NumberFormat("en-NG", {
      style: "currency",
      currency: "NGN",
      minimumFractionDigits: 0,
    }).format(n);

  React.useEffect(() => {
    if (!canViewProducts) return;
    fetchProducts({
      page: 1,
      categoryId: selectedCategoryId,
      search: debouncedSearch,
    });
  }, [fetchProducts, selectedCategoryId, debouncedSearch, canViewProducts]);

  const handleSelectedChange = React.useCallback(
    (productId: number, checked: boolean) => {
      if (!Number.isFinite(productId) || productId <= 0) return;
      setSelectedIds((prev) => {
        const next = new Set(prev);
        if (checked) next.add(productId);
        else next.delete(productId);
        return next;
      });
    },
    [],
  );

  const handleToggleSelectAll = React.useCallback(
    (checked: boolean) => {
      setSelectedIds((prev) => {
        const next = new Set(prev);
        for (const product of products) {
          const id = Number(product.id);
          if (!Number.isFinite(id) || id <= 0) continue;
          if (checked) next.add(id);
          else next.delete(id);
        }
        return next;
      });
    },
    [products],
  );

  const parentCategories = React.useMemo(
    () => getTopLevelCategories(categoriesTree).filter((c) => c.id > 0),
    [categoriesTree],
  );

  const visibleProducts = React.useMemo(() => {
    return products.filter((product) => {
      if (!productMatchesListingFilter(product, listingFilter)) return false;
      if (sellerFilter !== "all") {
        const seller = (product.seller ?? "Plenti").toLowerCase();
        if (seller !== sellerFilter.toLowerCase()) return false;
      }
      return true;
    });
  }, [products, listingFilter, sellerFilter]);

  const productCountLabel = loadingProducts
    ? "-"
    : totalItems.toLocaleString("en-US");
  const publishedLabel = loadingProducts
    ? "-"
    : FALLBACK_PUBLISHED_COUNT.toLocaleString("en-US");
  const unpublishedLabel = loadingProducts
    ? "-"
    : FALLBACK_UNPUBLISHED_COUNT.toLocaleString("en-US");

  const toggleListingFilter = (value: ProductListingFilter) => {
    setListingFilter((prev) => (prev === value ? "all" : value));
  };

  const loadMore = async () => {
    if (loadingMore || currentPage >= lastPage) return;
    setLoadingMore(true);
    await fetchProducts({
      page: currentPage + 1,
      categoryId: selectedCategoryId,
      search: debouncedSearch,
      append: true,
    });
    setLoadingMore(false);
  };

  return (
    <div className="min-w-0 space-y-4 md:space-y-5">
      {!canViewProducts ? (
        <div className="rounded-xl border border-[#EAECF0] bg-[#F9FAFB] p-12 text-center">
          <p className="text-sm text-[#667085]">
            You do not have permission to view product management.
          </p>
        </div>
      ) : (
        <>
          <div className="flex flex-col gap-3 sm:flex-row sm:items-start sm:justify-between">
            <div>
              <h1 className="text-[24px] leading-8 font-semibold text-[#101828] tracking-tight">
                Product Management
              </h1>
              <p className="mt-1 text-sm text-[#667085]">
                {productCountLabel} products · {publishedLabel} published ·{" "}
                {unpublishedLabel} unpublished
              </p>
            </div>
            <div className="flex flex-wrap items-center gap-2 shrink-0">
              {canDeleteProducts && selectedIds.size > 0 ? (
                <Button
                  variant="outline"
                  className="h-9 rounded-lg border-[#EAECF0] text-[13px] font-medium text-[#344054]"
                  onClick={() => {
                    if (selectedIds.size > 100) {
                      toast.error("You can delete up to 100 products at once");
                      return;
                    }
                    setIsBulkDeleteOpen(true);
                  }}
                >
                  Delete selected
                </Button>
              ) : null}
              {canCreateProducts ? (
                <>
                  <Button
                    variant="outline"
                    className="h-9 rounded-lg border-[#D0D5DD] bg-white text-[13px] font-medium text-[#344054]"
                    onClick={() =>
                      toast.info("Bulk upload is not available yet")
                    }
                  >
                    <Upload className="size-3.5" />
                    Bulk upload
                  </Button>
                  <Button
                    className="h-9 rounded-lg bg-[#0B1E66] hover:bg-[#0B1E66]/90 text-[13px] font-medium text-white"
                    onClick={() => setIsCreateModalOpen(true)}
                  >
                    <Plus className="size-3.5" />
                    Add New Product
                  </Button>
                </>
              ) : null}
            </div>
          </div>

          <div className="flex flex-col gap-3 rounded-xl border border-[#FEDF89] bg-[#FFFAEB] px-4 py-3 sm:flex-row sm:items-center sm:justify-between">
            <p className="text-sm text-[#B54708]">
              {FALLBACK_VENDOR_PENDING} vendor listings are waiting for
              approval. They show up here with the seller&apos;s name once
              approved.
            </p>
            <button
              type="button"
              className="shrink-0 text-sm font-semibold text-[#B54708] underline-offset-2 hover:underline"
              onClick={() => toast.info("Vendor listing review is coming soon")}
            >
              Review listings
            </button>
          </div>

          <div className="overflow-x-auto">
            <div className="flex min-w-max items-center gap-1">
              <button
                type="button"
                onClick={() => setSelectedCategoryId(null)}
                className={cn(
                  "inline-flex items-center gap-1.5 rounded-full px-3 py-1.5 text-[13px] font-medium whitespace-nowrap",
                  selectedCategoryId == null
                    ? "bg-[#0B1E66] text-white"
                    : "text-[#667085] hover:bg-[#F2F4F7]",
                )}
              >
                All
                <span
                  className={cn(
                    "text-[12px]",
                    selectedCategoryId == null
                      ? "text-white/80"
                      : "text-[#98A2B3]",
                  )}
                >
                  {loadingProducts ? "-" : totalItems.toLocaleString("en-US")}
                </span>
              </button>
              {parentCategories.map((category) => {
                const active = selectedCategoryId === category.id;
                return (
                  <button
                    key={category.id}
                    type="button"
                    onClick={() => setSelectedCategoryId(category.id)}
                    className={cn(
                      "inline-flex items-center gap-1.5 rounded-full px-3 py-1.5 text-[13px] font-medium whitespace-nowrap",
                      active
                        ? "bg-[#0B1E66] text-white"
                        : "text-[#667085] hover:bg-[#F2F4F7]",
                    )}
                  >
                    {category.name}
                  </button>
                );
              })}
            </div>
          </div>

          <div className="flex flex-col gap-3 lg:flex-row lg:items-center lg:justify-between">
            <div className="flex h-10 flex-1 items-center gap-2 rounded-lg border border-[#EAECF0] bg-white px-3 max-w-full lg:max-w-md">
              <Search className="size-4 shrink-0 text-[#98A2B3]" />
              <Input
                className="h-9 border-0 p-0 shadow-none placeholder:text-[#98A2B3] focus-visible:ring-0"
                placeholder="Search name, brand or SKU"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
            </div>
            <div className="flex flex-wrap items-center gap-2">
              <select
                value={sellerFilter}
                onChange={(event) => setSellerFilter(event.target.value)}
                className="h-9 rounded-lg border border-[#EAECF0] bg-white px-3 text-[13px] text-[#344054] outline-none"
              >
                <option value="all">All sellers</option>
                <option value="Plenti">Plenti</option>
              </select>
              <FilterChip
                active={listingFilter === "published"}
                onClick={() => toggleListingFilter("published")}
              >
                Published
              </FilterChip>
              <FilterChip
                active={listingFilter === "unpublished"}
                onClick={() => toggleListingFilter("unpublished")}
              >
                Unpublished
              </FilterChip>
              <FilterChip
                active={listingFilter === "out_of_stock"}
                onClick={() => toggleListingFilter("out_of_stock")}
              >
                Out of stock
              </FilterChip>
              <div className="ml-auto flex items-center rounded-lg border border-[#EAECF0] p-0.5">
                <button
                  type="button"
                  aria-label="List view"
                  className={cn(
                    "flex size-8 items-center justify-center rounded-md",
                    viewMode === "list"
                      ? "bg-[#F2F4F7] text-[#101828]"
                      : "text-[#98A2B3]",
                  )}
                  onClick={() => setViewMode("list")}
                >
                  <List className="size-4" />
                </button>
                <button
                  type="button"
                  aria-label="Grid view"
                  className={cn(
                    "flex size-8 items-center justify-center rounded-md",
                    viewMode === "grid"
                      ? "bg-[#F2F4F7] text-[#101828]"
                      : "text-[#98A2B3]",
                  )}
                  onClick={() => setViewMode("grid")}
                >
                  <LayoutGrid className="size-4" />
                </button>
              </div>
            </div>
          </div>

          {loadingProducts ? (
            viewMode === "grid" ? (
              <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
                {Array.from({ length: 8 }).map((_, idx) => (
                  <div
                    key={idx}
                    className="overflow-hidden rounded-xl border border-[#EAECF0] bg-white"
                  >
                    <Skeleton className="h-44 w-full" />
                    <div className="space-y-2 p-3">
                      <Skeleton className="h-3 w-24" />
                      <Skeleton className="h-4 w-3/4" />
                      <Skeleton className="h-4 w-20" />
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="overflow-hidden rounded-xl border border-[#EAECF0] bg-white">
                {Array.from({ length: pageSize }).map((_, rowIdx) => (
                  <div
                    key={rowIdx}
                    className="grid grid-cols-8 gap-4 border-b border-[#EAECF0] px-4 py-4"
                  >
                    {Array.from({ length: 8 }).map((_, cellIdx) => (
                      <Skeleton key={cellIdx} className="h-4 w-full" />
                    ))}
                  </div>
                ))}
              </div>
            )
          ) : null}

          {!loadingProducts && viewMode === "grid" ? (
            <ProductGrid
              products={visibleProducts}
              total={totalItems}
              loadedCount={visibleProducts.length}
              loadingMore={loadingMore}
              canLoadMore={currentPage < lastPage}
              canEditProducts={canEditProducts}
              canDeleteProducts={canDeleteProducts}
              canPublishProducts={canPublishProducts}
              selectedIds={selectedIds}
              onSelectedChange={handleSelectedChange}
              onLoadMore={loadMore}
              formatCurrency={formatCurrency}
            />
          ) : !loadingProducts ? (
            <ProductTable
              products={visibleProducts}
              total={totalItems}
              loadedCount={visibleProducts.length}
              loadingMore={loadingMore}
              canLoadMore={currentPage < lastPage}
              canEditProducts={canEditProducts}
              canDeleteProducts={canDeleteProducts}
              canPublishProducts={canPublishProducts}
              selectedIds={selectedIds}
              onSelectedChange={handleSelectedChange}
              onToggleSelectAll={handleToggleSelectAll}
              onLoadMore={loadMore}
              formatCurrency={formatCurrency}
            />
          ) : null}

          <CreateProductModal
            isOpen={isCreateModalOpen && canCreateProducts}
            onClose={() => setIsCreateModalOpen(false)}
          />
          <BulkDeleteProductModal
            isOpen={isBulkDeleteOpen && canDeleteProducts}
            productIds={Array.from(selectedIds)}
            onClose={() => setIsBulkDeleteOpen(false)}
            onDeleted={() => setSelectedIds(new Set())}
          />
        </>
      )}
    </div>
  );
}

function FilterChip({
  active,
  onClick,
  children,
}: {
  active: boolean;
  onClick: () => void;
  children: React.ReactNode;
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      className={cn(
        "h-9 rounded-lg border px-3 text-[13px] font-medium",
        active
          ? "border-[#0B1E66] bg-[#EEF2FF] text-[#0B1E66]"
          : "border-[#EAECF0] bg-white text-[#344054] hover:bg-[#F9FAFB]",
      )}
    >
      {children}
    </button>
  );
}
