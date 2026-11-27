"use client";

import * as React from "react";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuTrigger,
  DropdownMenuItem,
} from "@/components/ui/dropdown-menu";
import Image from "next/image";
import type { Product } from "@/data/products";
import { Pencil } from "lucide-react";
import { Checkbox } from "@/components/ui/checkbox";
import { EditProductModal } from "./EditProductModal";
import { DeleteProductModal } from "./DeleteProductModal";
import { UnpublishProductModal } from "./UnpublishProductModal";
import { toast } from "sonner";
import { resolveCategoryLabels } from "@/lib/mappers/categories";
import { productDisplayImages } from "@/lib/mappers/products";
import { useProductStore } from "@/store/useProductStore";
import ProductListFooter from "./ProductListFooter";
import {
  listingBadgeClass,
  productListingBadge,
  productSeller,
  productSku,
  productStockLabel,
  productUpdatedLabel,
  stockToneClass,
} from "./productManagementView";

type ProductTableProps = {
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
  onToggleSelectAll?: (checked: boolean) => void;
  onLoadMore: () => void;
  formatCurrency: (n: number) => string;
};

export default function ProductTable({
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
  onToggleSelectAll,
  onLoadMore,
  formatCurrency,
}: ProductTableProps) {
  const { toggleProductStatus, togglingStatusById, categoriesTree } =
    useProductStore();
  const [selectedProduct, setSelectedProduct] = React.useState<Product | null>(
    null,
  );
  const [isEditModalOpen, setIsEditModalOpen] = React.useState(false);
  const [productToDelete, setProductToDelete] = React.useState<Product | null>(
    null,
  );
  const [isDeleteModalOpen, setIsDeleteModalOpen] = React.useState(false);
  const [productToUnpublish, setProductToUnpublish] =
    React.useState<Product | null>(null);

  const pageIds = products
    .map((product) => Number(product.id))
    .filter((id) => Number.isFinite(id) && id > 0);
  const selectedOnPage = pageIds.filter((id) => selectedIds?.has(id)).length;
  const allSelected = pageIds.length > 0 && selectedOnPage === pageIds.length;

  if (total === 0 || products.length === 0) {
    return (
      <div className="py-12 text-center text-sm text-[#667085]">
        No products found matching your search criteria.
      </div>
    );
  }

  return (
    <>
      <div className="overflow-x-auto rounded-xl border border-[#EAECF0] bg-white">
        <table className="min-w-[920px] w-full text-left">
          <thead>
            <tr className="border-b border-[#EAECF0] text-[12px] font-medium text-[#667085]">
              <th className="w-10 px-4 py-3">
                {canDeleteProducts && onSelectedChange ? (
                  <Checkbox
                    checked={allSelected}
                    onCheckedChange={(checked) => onToggleSelectAll?.(checked)}
                    aria-label="Select all products on this page"
                  />
                ) : null}
              </th>
              <th className="px-3 py-3">Product</th>
              <th className="px-3 py-3">Category</th>
              <th className="px-3 py-3">Seller</th>
              <th className="px-3 py-3">Price</th>
              <th className="px-3 py-3">Stock</th>
              <th className="px-3 py-3">Status</th>
              <th className="px-3 py-3">Last updated</th>
              <th className="w-12 px-3 py-3" />
            </tr>
          </thead>
          <tbody>
            {products.map((product) => {
              const categoryLabels = resolveCategoryLabels(
                typeof product.categoryId === "number"
                  ? product.categoryId
                  : null,
                product.category,
                categoriesTree,
              );
              const imageUrl =
                productDisplayImages(product)[0] ?? product.imageUrl;
              const badge = productListingBadge(product);
              const stock = productStockLabel(product);
              const isActive = product.status !== "Unavailable";

              return (
                <tr
                  key={product.id}
                  className="border-b border-[#EAECF0] last:border-0"
                >
                  <td className="px-4 py-3 align-middle">
                    {canDeleteProducts && onSelectedChange ? (
                      <span onClick={(event) => event.stopPropagation()}>
                        <Checkbox
                          checked={selectedIds?.has(Number(product.id)) ?? false}
                          onCheckedChange={(checked) =>
                            onSelectedChange(Number(product.id), checked)
                          }
                          aria-label={`Select ${product.name}`}
                        />
                      </span>
                    ) : null}
                  </td>
                  <td className="px-3 py-3">
                    <div className="flex items-center gap-3">
                      <div className="relative size-10 shrink-0 overflow-hidden rounded-lg bg-[#F8FAFC]">
                        {imageUrl ? (
                          <Image
                            src={imageUrl}
                            alt={product.name}
                            fill
                            className="object-contain p-1"
                            unoptimized
                          />
                        ) : null}
                      </div>
                      <div className="min-w-0">
                        <p className="truncate text-[13px] font-medium text-[#101828]">
                          {product.name}
                        </p>
                        <p className="text-[12px] text-[#98A2B3]">
                          {productSku(product)}
                        </p>
                      </div>
                    </div>
                  </td>
                  <td className="px-3 py-3 text-[13px] text-[#344054]">
                    {categoryLabels.category}
                  </td>
                  <td className="px-3 py-3 text-[13px] text-[#344054]">
                    {productSeller(product)}
                  </td>
                  <td className="px-3 py-3 text-[13px] font-medium text-[#101828]">
                    {formatCurrency(product.price)}
                  </td>
                  <td
                    className={`px-3 py-3 text-[13px] font-medium ${stockToneClass(stock.tone)}`}
                  >
                    {stock.text}
                  </td>
                  <td className="px-3 py-3">
                    <span
                      className={`inline-flex items-center rounded-full px-2 py-0.5 text-[11px] font-medium ${listingBadgeClass(badge)}`}
                    >
                      {badge}
                    </span>
                  </td>
                  <td className="px-3 py-3 text-[13px] text-[#667085]">
                    {productUpdatedLabel(product)}
                  </td>
                  <td className="px-3 py-3 text-right">
                    {canEditProducts ||
                    canDeleteProducts ||
                    canPublishProducts ? (
                      <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                          <Button
                            variant="ghost"
                            size="icon"
                            className="size-8 text-[#667085]"
                          >
                            <Pencil className="size-4" />
                          </Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent align="end" className="border-0">
                          {canEditProducts && (
                            <DropdownMenuItem
                              className="text-[#0B1E66]"
                              onClick={() => {
                                setSelectedProduct(product);
                                setIsEditModalOpen(true);
                              }}
                            >
                              Edit
                            </DropdownMenuItem>
                          )}
                          {canPublishProducts && (
                            <DropdownMenuItem
                              disabled={!!togglingStatusById[String(product.id)]}
                              className={
                                isActive ? "text-[#DD900D]" : "text-[#0F973D]"
                              }
                              onClick={async () => {
                                if (isActive) {
                                  setProductToUnpublish(product);
                                  return;
                                }
                                const ok = await toggleProductStatus(product.id);
                                if (ok) toast.success("Product published");
                                else
                                  toast.error("Failed to update product status");
                              }}
                            >
                              {isActive ? "Unpublish" : "Publish"}
                            </DropdownMenuItem>
                          )}
                          {canDeleteProducts && (
                            <DropdownMenuItem
                              className="text-red-500"
                              onClick={() => {
                                setProductToDelete(product);
                                setIsDeleteModalOpen(true);
                              }}
                            >
                              Delete
                            </DropdownMenuItem>
                          )}
                        </DropdownMenuContent>
                      </DropdownMenu>
                    ) : (
                      <span className="text-[#98A2B3]">-</span>
                    )}
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
      <ProductListFooter
        loadedCount={loadedCount}
        total={total}
        canLoadMore={canLoadMore}
        loadingMore={loadingMore}
        onLoadMore={onLoadMore}
      />
      <EditProductModal
        isOpen={isEditModalOpen && canEditProducts}
        onClose={() => {
          setIsEditModalOpen(false);
          setSelectedProduct(null);
        }}
        product={selectedProduct}
      />
      <DeleteProductModal
        isOpen={isDeleteModalOpen && canDeleteProducts}
        onClose={() => {
          setIsDeleteModalOpen(false);
          setProductToDelete(null);
        }}
        product={productToDelete}
      />
      <UnpublishProductModal
        isOpen={!!productToUnpublish && canPublishProducts}
        onClose={() => setProductToUnpublish(null)}
        product={productToUnpublish}
      />
    </>
  );
}
