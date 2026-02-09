"use client";

import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Switch } from "@/components/ui/switch";
import type { Product, ProductStatus } from "@/data/products";
import { useProductStore } from "@/store/useProductStore";
import { Ellipsis } from "lucide-react";
import Image from "next/image";
import * as React from "react";
import { toast } from "sonner";
import { DeleteProductModal } from "./DeleteProductModal";
import { EditProductModal } from "./EditProductModal";

type ProductCardProps = {
  product: Product;
  formatCurrency: (n: number) => string;
};

export default function ProductCard({
  product,
  formatCurrency,
}: ProductCardProps) {
  const { toggleProductStatus, togglingStatusById } = useProductStore();
  const [isEditModalOpen, setIsEditModalOpen] = React.useState(false);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = React.useState(false);
  const isToggling = !!togglingStatusById[String(product.id)];
  const isActive = product.status !== "Unavailable";

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
    <div className="bg-white rounded-xl border border-neutral-100 shadow-xs relative overflow-hidden">
      <div className="absolute top-4 left-4 z-10">
        <span className={`badge ${getStatusBadgeClass(product.status)}`}>
          {product.status}
        </span>
      </div>

      {/* Top Right Action Buttons */}
      <div className="absolute top-4 right-4 z-10">
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button
              variant="ghost"
              size="icon-sm"
              className="size-7 bg-[#E8EEFF] backdrop-blur-[5.974740982055664px]"
              style={{
                boxShadow:
                  "-1.57px 1.57px 1.57px 0px #FFFFFF16 inset, 1.57px -1.57px 1.57px 0px #A5A5A516 inset",
              }}
            >
              <Ellipsis className="size-4" />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent className="border-0" align="end">
            <DropdownMenuItem
              onClick={() => setIsEditModalOpen(true)}
              className="text-[#0B1E66]"
            >
              Edit
            </DropdownMenuItem>
            <DropdownMenuItem
              disabled={isToggling}
              className={
                product.status !== "Unavailable"
                  ? "text-[#DD900D]"
                  : "text-[#0F973D]"
              }
              onClick={async () => {
                const ok = await toggleProductStatus(product.id);
                if (ok) {
                  toast.success(
                    isActive ? "Product unpublished" : "Product published"
                  );
                } else {
                  toast.error("Failed to update product status");
                }
              }}
            >
              {isActive ? "Unpublish" : "Publish"}
            </DropdownMenuItem>
            <DropdownMenuItem
              className="text-red-500"
              onClick={() => setIsDeleteModalOpen(true)}
            >
              Delete
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>

      <div className="w-full h-48 bg-neutral-100 relative overflow-hidden">
        <Image
          src={product.imageUrl}
          alt={product.name}
          fill
          className="object-cover"
        />
      </div>

      <div className="p-4 sm:p-5 space-y-3">
        <div>
          <h3 className="font-semibold text-primary text-base sm:text-lg mb-1 line-clamp-2">
            {product.name}
          </h3>
          <p className="text-neutral-500 text-xs sm:text-sm line-clamp-2">
            {product.description}
          </p>
        </div>

        <div className="space-y-2">
          <div className="flex justify-between items-center text-sm">
            <span className="text-neutral-500">Price:</span>
            <span className="font-semibold text-primary">
              {formatCurrency(product.price)}
            </span>
          </div>

          <div className="flex justify-between items-center text-sm">
            <span className="text-neutral-500">Bulk (10+):</span>
            <span className="font-semibold text-primary">
              {formatCurrency(product.bulkPrice)}
            </span>
          </div>

          <div className="flex justify-between items-center text-sm">
            <span className="text-neutral-500">Category:</span>
            <span className="font-semibold text-primary">
              {product.category}
            </span>
          </div>

          <div className="flex justify-between items-center text-sm">
            <span className="text-neutral-500">Sub-category:</span>
            <span className="font-semibold text-primary">
              {product.subCategory || "-"}
            </span>
          </div>

          <div className="flex justify-between items-center text-sm">
            <span className="text-neutral-500">Stock Level:</span>
            <span
              className={`font-semibold ${
                product.stockLevel < 100 ? "text-danger-500" : "text-[#0F973D]"
              }`}
            >
              {new Intl.NumberFormat("en-US").format(product.stockLevel)}
            </span>
          </div>
        </div>

        {/* Bottom CTA Section */}
        <div className="pt-2 border-t border-neutral-100 flex items-center justify-end gap-2">
          {/* <button className="flex items-center gap-1 sm:gap-2 text-primary font-medium text-xs sm:text-sm hover:underline shrink-0">
            <span className="hidden sm:inline">View Product</span>
            <span className="sm:hidden">View</span>
            <ArrowRight className="size-3 sm:size-4" />
          </button> */}
          <Switch
            checked={isActive}
            disabled={isToggling}
            onCheckedChange={async () => {
              const ok = await toggleProductStatus(product.id);
              if (ok) {
                toast.success("Product status updated");
              } else {
                toast.error("Failed to update product status");
              }
            }}
          />
        </div>
      </div>

      <EditProductModal
        isOpen={isEditModalOpen}
        onClose={() => setIsEditModalOpen(false)}
        product={product}
      />

      <DeleteProductModal
        isOpen={isDeleteModalOpen}
        onClose={() => setIsDeleteModalOpen(false)}
        product={product}
      />
    </div>
  );
}
