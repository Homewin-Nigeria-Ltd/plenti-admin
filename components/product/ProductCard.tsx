"use client";

import { Checkbox } from "@/components/ui/checkbox";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import type { Product } from "@/data/products";
import { resolveCategoryLabels } from "@/lib/mappers/categories";
import { productDisplayImages } from "@/lib/mappers/products";
import { useProductStore } from "@/store/useProductStore";
import { Ellipsis } from "lucide-react";
import Image from "next/image";
import * as React from "react";
import { toast } from "sonner";
import { DeleteProductModal } from "./DeleteProductModal";
import { EditProductModal } from "./EditProductModal";
import { UnpublishProductModal } from "./UnpublishProductModal";
import {
  listingBadgeClass,
  productListingBadge,
  productSeller,
  productStockLabel,
  stockToneClass,
} from "./productManagementView";

type ProductCardProps = {
  product: Product;
  formatCurrency: (n: number) => string;
  canEditProducts: boolean;
  canDeleteProducts: boolean;
  canPublishProducts: boolean;
  selected?: boolean;
  onSelectedChange?: (checked: boolean) => void;
};

export default function ProductCard({
  product,
  formatCurrency,
  canEditProducts,
  canDeleteProducts,
  canPublishProducts,
  selected = false,
  onSelectedChange,
}: ProductCardProps) {
  const { toggleProductStatus, togglingStatusById, categoriesTree } =
    useProductStore();
  const categoryLabels = resolveCategoryLabels(
    typeof product.categoryId === "number" ? product.categoryId : null,
    product.category,
    categoriesTree,
  );
  const [isEditModalOpen, setIsEditModalOpen] = React.useState(false);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = React.useState(false);
  const [isUnpublishModalOpen, setIsUnpublishModalOpen] = React.useState(false);
  const isToggling = !!togglingStatusById[String(product.id)];
  const isActive = product.status !== "Unavailable";
  const badge = productListingBadge(product);
  const stock = productStockLabel(product);
  const imageUrl = productDisplayImages(product)[0] ?? product.imageUrl;

  return (
    <div className="relative overflow-hidden rounded-xl border border-[#EAECF0] bg-white">
      <div className="absolute left-3 top-3 z-10 flex items-center gap-2">
        {canDeleteProducts && onSelectedChange ? (
          <span
            className="inline-flex rounded-sm bg-white/95 p-0.5 shadow-sm"
            onClick={(event) => event.stopPropagation()}
          >
            <Checkbox
              checked={selected}
              onCheckedChange={onSelectedChange}
              className="h-4 w-4 border-[#D0D5DD]"
              aria-label={`Select ${product.name}`}
            />
          </span>
        ) : null}
        <span
          className={`inline-flex items-center rounded-full px-2 py-0.5 text-[11px] font-medium ${listingBadgeClass(badge)}`}
        >
          {badge}
        </span>
      </div>

      <div className="absolute right-3 top-3 z-10">
        {canEditProducts || canDeleteProducts || canPublishProducts ? (
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button
                variant="ghost"
                size="icon-sm"
                className="size-7 bg-white/90 shadow-sm"
              >
                <Ellipsis className="size-4" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent className="border-0" align="end">
              {canEditProducts && (
                <DropdownMenuItem
                  onClick={() => setIsEditModalOpen(true)}
                  className="text-[#0B1E66]"
                >
                  Edit
                </DropdownMenuItem>
              )}
              {canPublishProducts && (
                <DropdownMenuItem
                  disabled={isToggling}
                  className={
                    isActive ? "text-[#DD900D]" : "text-[#0F973D]"
                  }
                  onClick={async () => {
                    if (isActive) {
                      setIsUnpublishModalOpen(true);
                      return;
                    }
                    const ok = await toggleProductStatus(product.id);
                    if (ok) toast.success("Product published");
                    else toast.error("Failed to update product status");
                  }}
                >
                  {isActive ? "Unpublish" : "Publish"}
                </DropdownMenuItem>
              )}
              {canDeleteProducts && (
                <DropdownMenuItem
                  className="text-red-500"
                  onClick={() => setIsDeleteModalOpen(true)}
                >
                  Delete
                </DropdownMenuItem>
              )}
            </DropdownMenuContent>
          </DropdownMenu>
        ) : null}
      </div>

      <div className="relative h-44 w-full bg-[#F8FAFC]">
        {imageUrl ? (
          <Image
            src={imageUrl}
            alt={product.name}
            fill
            className="object-contain p-4"
            unoptimized
          />
        ) : null}
      </div>

      <div className="space-y-1 p-3.5">
        <p className="text-[12px] text-[#98A2B3]">
          {categoryLabels.category || product.category} · {productSeller(product)}
        </p>
        <h3 className="line-clamp-2 text-[14px] font-semibold leading-5 text-[#101828]">
          {product.name}
        </h3>
        <div className="flex items-end justify-between gap-2 pt-1">
          <p className="text-[15px] font-semibold text-[#101828]">
            {formatCurrency(product.price)}
          </p>
          <p className={`text-[12px] font-medium ${stockToneClass(stock.tone)}`}>
            {stock.text}
          </p>
        </div>
      </div>

      <EditProductModal
        isOpen={isEditModalOpen && canEditProducts}
        onClose={() => setIsEditModalOpen(false)}
        product={product}
      />

      <DeleteProductModal
        isOpen={isDeleteModalOpen && canDeleteProducts}
        onClose={() => setIsDeleteModalOpen(false)}
        product={product}
      />
      <UnpublishProductModal
        isOpen={isUnpublishModalOpen && canPublishProducts}
        onClose={() => setIsUnpublishModalOpen(false)}
        product={product}
      />
    </div>
  );
}
