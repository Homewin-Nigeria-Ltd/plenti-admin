"use client";

import * as React from "react";
import { Product } from "@/data/products";
import ProductCard from "./ProductCard";

type ProductGridProps = {
  products: Product[];
  total: number;
  page: number;
  pageCount: number;
  onPageChange: (page: number) => void;
  formatCurrency: (n: number) => string;
};

export default function ProductGrid({
  products,
  total,
  page,
  pageCount,
  onPageChange,
  formatCurrency,
}: ProductGridProps) {
  const canPrev = page > 1;
  const canNext = page < pageCount;

  if (total === 0) {
    return (
      <div className="text-center py-12 text-neutral-500">
        No products found matching your search criteria.
      </div>
    );
  }

  return (
    <>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
        {products.map((product) => (
          <ProductCard
            key={product.id}
            product={product}
            formatCurrency={formatCurrency}
          />
        ))}
      </div>

      <div className="flex items-center justify-between px-4 py-3 bg-white rounded-xl border border-neutral-100">
        <p className="text-sm text-neutral-500">
          Page {page} of {pageCount}
        </p>
        <div className="flex items-center gap-2">
          <button
            disabled={!canPrev}
            onClick={() => onPageChange(page - 1)}
            className={`rounded-full border border-neutral-100 px-3 py-1 text-sm ${
              !canPrev ? "opacity-50 cursor-not-allowed" : ""
            }`}>
            Previous
          </button>
          <button
            disabled={!canNext}
            onClick={() => onPageChange(page + 1)}
            className={`rounded-full border border-neutral-100 px-3 py-1 text-sm ${
              !canNext ? "opacity-50 cursor-not-allowed" : ""
            }`}>
            Next
          </button>
        </div>
      </div>
    </>
  );
}

