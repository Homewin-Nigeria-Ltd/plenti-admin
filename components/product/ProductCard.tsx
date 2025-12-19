"use client";

import * as React from "react";
import { Button } from "@/components/ui/button";
import { Switch } from "@/components/ui/switch";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuTrigger,
  DropdownMenuItem,
} from "@/components/ui/dropdown-menu";
import Image from "next/image";
import type { Product, ProductStatus } from "@/data/products";
import { Ellipsis, ArrowRight } from "lucide-react";
import { EditProductModal } from "./EditProductModal";
import { DeleteProductModal } from "./DeleteProductModal";
import { toast } from "sonner";

type ProductCardProps = {
  product: Product;
  formatCurrency: (n: number) => string;
};

export default function ProductCard({ product, formatCurrency }: ProductCardProps) {
  const [status, setStatus] = React.useState(product.status);
  const [isEditModalOpen, setIsEditModalOpen] = React.useState(false);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = React.useState(false);

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
        <span className={`badge ${getStatusBadgeClass(status)}`}>
          {status}
        </span>
      </div>

      <div className="absolute top-4 right-4 z-10">
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button 
              variant="ghost" 
              size="icon-sm" 
              className="h-8 w-8 bg-[#E8EEFF] backdrop-blur-[5.974740982055664px]"
              style={{
                boxShadow: '-1.57px 1.57px 1.57px 0px #FFFFFF16 inset, 1.57px -1.57px 1.57px 0px #A5A5A516 inset'
              }}>
              <Ellipsis className="size-4" />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end">
            <DropdownMenuItem onClick={() => setIsEditModalOpen(true)}>Edit</DropdownMenuItem>
            <DropdownMenuItem 
              className="text-danger-500"
              onClick={() => setIsDeleteModalOpen(true)}>
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

      <div className="p-5 space-y-3">
        <div>
          <h3 className="font-semibold text-primary text-lg mb-1">
            {product.name}
          </h3>
          <p className="text-neutral-500 text-sm">{product.description}</p>
        </div>

        {/* Details Section */}
        <div className="space-y-2">
          {/* Price */}
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

          {/* Sub-category */}
          <div className="flex justify-between items-center text-sm">
            <span className="text-neutral-500">Sub-category:</span>
            <span className="font-semibold text-primary">
              {product.subCategory}
            </span>
          </div>

          <div className="flex justify-between items-center text-sm">
            <span className="text-neutral-500">Stock Level:</span>
            <span
              className={`font-semibold ${
                product.stockLevel < 100 ? "text-danger-500" : "text-[#0F973D]"
              }`}>
              {new Intl.NumberFormat("en-US").format(product.stockLevel)}
            </span>
          </div>
        </div>

        <div className="pt-2 border-t border-neutral-100 flex items-center justify-between">
          <button className="flex items-center gap-2 text-primary font-medium text-sm hover:underline">
            View Product
            <ArrowRight className="size-4" />
          </button>
          <Switch 
            checked={status === "Available"} 
            onCheckedChange={(checked) => {
              const newStatus = checked ? "Available" : "Unavailable";
              setStatus(newStatus);
              toast.success(`Product status updated to ${newStatus}`);
            }} 
          />
        </div>
      </div>

      {/* Edit Product Modal */}
      <EditProductModal
        isOpen={isEditModalOpen}
        onClose={() => setIsEditModalOpen(false)}
        product={product}
      />

      <DeleteProductModal
        isOpen={isDeleteModalOpen}
        onClose={() => setIsDeleteModalOpen(false)}
        product={product}
        onConfirm={() => {
          console.log("Delete product:", product.id);
        }}
      />
    </div>
  );
}

