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
import type { Product, ProductStatus } from "@/data/products";
import { Ellipsis } from "lucide-react";
import DataTable from "@/components/common/DataTable";
import { EditProductModal } from "./EditProductModal";
import { DeleteProductModal } from "./DeleteProductModal";
import { toast } from "sonner";
import { resolveCategoryLabels } from "@/lib/mappers/categories";
import { useProductStore } from "@/store/useProductStore";

type ProductTableProps = {
  products: Product[];
  total: number;
  page: number;
  pageCount: number;
  pageSize: number;
  canEditProducts: boolean;
  canDeleteProducts: boolean;
  canPublishProducts: boolean;
  onPageChange: (page: number) => void;
  formatCurrency: (n: number) => string;
};

export default function ProductTable({
  products,
  total,
  page,
  pageCount,
  pageSize,
  canEditProducts,
  canDeleteProducts,
  canPublishProducts,
  onPageChange,
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

  const columns = [
    { key: "brandName", label: "Brand Name" },
    { key: "status", label: "Status" },
    { key: "category", label: "Category" },
    { key: "subCategory", label: "Sub category" },
    { key: "amount", label: "Amount" },
    { key: "discount", label: "Discount" },
    { key: "bulkAmount", label: "Bulk Tiers" },
    { key: "stockLevel", label: "Stock Level" },
    { key: "actions", label: "Actions" },
  ];

  const tableRows = React.useMemo(() => {
    return products.map((product) => {
      const categoryLabels = resolveCategoryLabels(
        typeof product.categoryId === "number" ? product.categoryId : null,
        product.category,
        categoriesTree
      );

      return {
      brandName: (
        <div className="flex items-center gap-3">
          <div className="relative w-12 h-12 rounded-lg overflow-hidden shrink-0">
            <Image
              src={product.imageUrl}
              alt={product.name}
              fill
              className="object-cover"
            />
          </div>
          <div>
            <p className="font-medium text-primary-700">{product.name}</p>
            <p className="text-neutral-500 text-xs">Product ID: {product.id}</p>
            <p className="text-neutral-500 text-xs">{product.description}</p>
          </div>
        </div>
      ),
      status: (() => {
        const getStatusBadgeClass = (status: ProductStatus) => {
          switch (status) {
            case "Available":
              return "badge-success";
            case "Unavailable":
              return "badge-neutral";
            case "LowStock":
              return "badge-warning";
            case "OutOfStock":
              return "badge-danger";
            default:
              return "badge-neutral";
          }
        };
        return (
          <span className={`badge ${getStatusBadgeClass(product.status)}`}>
            {product.status}
          </span>
        );
      })(),
      category: (
        <span className="text-primary-700">{categoryLabels.category}</span>
      ),
      subCategory: (
        <span className="text-primary-700">
          {categoryLabels.subCategory || "-"}
        </span>
      ),
      amount: (
        <span className="font-semibold text-primary-700">
          {formatCurrency(product.price)}
        </span>
      ),
      discount: (
        <span className="font-semibold text-primary-700">
          {typeof product.discountPercent === "number" &&
          product.discountPercent > 0
            ? `${product.discountPercent}%`
            : "-"}
        </span>
      ),
      bulkAmount: (
        <div className="space-y-1">
          {(product.bulkTiers ?? []).length > 0 ? (
            (product.bulkTiers ?? []).map((tier) => (
              <p
                key={`${product.id}-${tier.min_qty}-${tier.price}`}
                className="font-semibold text-primary-700"
              >
                {tier.min_qty}+ · {formatCurrency(tier.price)}
              </p>
            ))
          ) : (
            <span className="font-semibold text-primary-700">
              {formatCurrency(product.bulkPrice)}
            </span>
          )}
        </div>
      ),
      stockLevel: (
        <span
          className={`font-semibold ${
            product.stockLevel < 100 ? "text-red-600" : "text-green-600"
          }`}
        >
          {new Intl.NumberFormat("en-US").format(product.stockLevel)}
        </span>
      ),
      actions:
        canEditProducts || canDeleteProducts || canPublishProducts ? (
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="ghost" size="icon" className="h-8 w-8">
                <Ellipsis className="size-4" />
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
                    product.status !== "Unavailable"
                      ? "text-[#DD900D]"
                      : "text-[#0F973D]"
                  }
                  onClick={async () => {
                    const isActive = product.status !== "Unavailable";
                    const ok = await toggleProductStatus(product.id);
                    if (ok) {
                      toast.success(
                        isActive ? "Product unpublished" : "Product published",
                      );
                    } else {
                      toast.error("Failed to update product status");
                    }
                  }}
                >
                  {product.status !== "Unavailable" ? "Unpublish" : "Publish"}
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
          <span className="text-neutral-400">-</span>
        ),
      };
    });
  }, [
    products,
    categoriesTree,
    formatCurrency,
    toggleProductStatus,
    togglingStatusById,
    setSelectedProduct,
    setIsEditModalOpen,
    setProductToDelete,
    setIsDeleteModalOpen,
  ]);

  if (total === 0) {
    return (
      <div className="text-center py-12 text-neutral-500">
        No products found matching your search criteria.
      </div>
    );
  }

  return (
    <>
      <div className="overflow-x-auto -mx-4 px-4 sm:mx-0 sm:px-0">
        <DataTable
          columns={columns}
          rows={tableRows}
          page={page}
          pageCount={pageCount}
          pageSize={pageSize}
          total={total}
          onPageChange={onPageChange}
        />
      </div>
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
    </>
  );
}
