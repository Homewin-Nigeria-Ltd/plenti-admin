"use client";

import { Product } from "@/data/products";
import ProductCard from "./ProductCard";
import ProductListFooter from "./ProductListFooter";

type ProductGridProps = {
  products: Product[];
  total: number;
  loadedCount: number;
  loadingMore?: boolean;
  canLoadMore: boolean;
  canEditProducts: boolean;
  canDeleteProducts: boolean;
  canPublishProducts: boolean;
  selectedIds?: Set<number>;
  onSelectedChange?: (productId: number, checked: boolean) => void;
  onLoadMore: () => void;
  formatCurrency: (n: number) => string;
};

export default function ProductGrid({
  products,
  total,
  loadedCount,
  loadingMore = false,
  canLoadMore,
  canEditProducts,
  canDeleteProducts,
  canPublishProducts,
  selectedIds,
  onSelectedChange,
  onLoadMore,
  formatCurrency,
}: ProductGridProps) {
  if (total === 0 || products.length === 0) {
    return (
      <div className="py-12 text-center text-sm text-[#667085]">
        No products found matching your search criteria.
      </div>
    );
  }

  return (
    <>
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
        {products.map((product) => (
          <ProductCard
            key={product.id}
            product={product}
            formatCurrency={formatCurrency}
            canEditProducts={canEditProducts}
            canDeleteProducts={canDeleteProducts}
            canPublishProducts={canPublishProducts}
            selected={selectedIds?.has(Number(product.id)) ?? false}
            onSelectedChange={
              onSelectedChange
                ? (checked) => onSelectedChange(Number(product.id), checked)
                : undefined
            }
          />
        ))}
      </div>
      <ProductListFooter
        loadedCount={loadedCount}
        total={total}
        canLoadMore={canLoadMore}
        loadingMore={loadingMore}
        onLoadMore={onLoadMore}
      />
    </>
  );
}
