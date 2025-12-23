"use client";

import * as React from "react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Upload } from "lucide-react";
import type { Product, ProductCategory } from "@/data/products";
import { toast } from "sonner";

type EditProductModalProps = {
  isOpen: boolean;
  onClose: () => void;
  product: Product | null;
};

const categories: ProductCategory[] = [
  "Food & Beverages",
  "Personal Care & Hygiene",
  "Household Care",
  "Health & Wellness",
];

const subCategories: Record<Exclude<ProductCategory, "All Product">, string[]> = {
  "Food & Beverages": ["Food", "Beverages", "Snacks"],
  "Personal Care & Hygiene": ["Hygiene", "Oral Care", "Skincare"],
  "Household Care": ["Cleaning", "Laundry", "Kitchen"],
  "Health & Wellness": ["Medication", "Supplements", "Wellness"],
};

export function EditProductModal({ isOpen, onClose, product }: EditProductModalProps) {
  const [productName, setProductName] = React.useState("");
  const [description, setDescription] = React.useState("");
  const [category, setCategory] = React.useState<ProductCategory | "">("");
  const [subCategory, setSubCategory] = React.useState("");
  const [amount, setAmount] = React.useState("");
  const [initialStock, setInitialStock] = React.useState("");
  const [minBulkQuantity, setMinBulkQuantity] = React.useState("");
  const [bulkPrice, setBulkPrice] = React.useState("");
  const [selectedFile, setSelectedFile] = React.useState<File | null>(null);
  const [isDragging, setIsDragging] = React.useState(false);

  React.useEffect(() => {
    if (product) {
      setProductName(product.name);
      setDescription(product.description);
      setCategory(product.category);
      setSubCategory(product.subCategory);
      setAmount(product.price.toString());
      setInitialStock(product.stockLevel.toString());
      setBulkPrice(product.bulkPrice.toString());
   
      setMinBulkQuantity("10");
      setSelectedFile(null);
    }
  }, [product]);

  const handleFileSelect = (file: File) => {
    if (file.type.startsWith("image/")) {
      setSelectedFile(file);
    }
  };

  const handleDrop = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    setIsDragging(false);
    const file = e.dataTransfer.files[0];
    if (file) {
      handleFileSelect(file);
    }
  };

  const handleFileInput = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      handleFileSelect(file);
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    console.log({
      productId: product?.id,
      productName,
      description,
      category,
      subCategory,
      amount,
      initialStock,
      minBulkQuantity,
      bulkPrice,
      selectedFile,
    });
    toast.success("Product updated successfully");
    onClose();
  };

  const availableSubCategories = category && category !== "All Product" 
    ? subCategories[category as Exclude<ProductCategory, "All Product">] 
    : [];

  if (!product) return null;

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-2xl max-h-[90vh] flex flex-col p-0">
        <DialogHeader className="px-6 pt-6 pb-4 border-b border-neutral-100">
          <DialogTitle className="text-2xl font-semibold">
            Edit Product
          </DialogTitle>
          <DialogDescription className="text-sm text-neutral-500">
            Update product information
          </DialogDescription>
        </DialogHeader>

        <form id="edit-product-form" onSubmit={handleSubmit} className="flex-1 overflow-y-auto px-6 py-4 space-y-6">
          <div className="space-y-2">
            <Label htmlFor="edit-productName">Product Name</Label>
            <Input
              id="edit-productName"
              placeholder="Product Name"
              value={productName}
              onChange={(e) => setProductName(e.target.value)}
              className="focus-visible:ring-0"
              required
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="edit-description">Product Description</Label>
            <textarea
              id="edit-description"
              placeholder="Product Description"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              className="w-full min-h-[100px] rounded-md border border-input bg-transparent px-3 py-2 text-sm shadow-xs transition-[color,box-shadow] outline-none focus-visible:ring-0 resize-none"
              required
            />
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="edit-category">Select Category</Label>
              <Select value={category} onValueChange={(value) => {
                setCategory(value as ProductCategory);
                setSubCategory("");
              }}>
                <SelectTrigger id="edit-category" className="w-full focus-visible:ring-0">
                  <SelectValue placeholder="Select Category" />
                </SelectTrigger>
                <SelectContent>
                  {categories.map((cat) => (
                    <SelectItem key={cat} value={cat}>
                      {cat}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Label htmlFor="edit-subCategory">Select Sub Category</Label>
              <Select
                value={subCategory}
                onValueChange={setSubCategory}
                disabled={!category}>
                <SelectTrigger id="edit-subCategory" className="w-full focus-visible:ring-0">
                  <SelectValue placeholder="Select Sub Category" />
                </SelectTrigger>
                <SelectContent>
                  {availableSubCategories.map((subCat: string) => (
                    <SelectItem key={subCat} value={subCat}>
                      {subCat}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="edit-amount">Enter Amount</Label>
              <Input
                id="edit-amount"
                type="number"
                placeholder="Enter Amount"
                value={amount}
                onChange={(e) => setAmount(e.target.value)}
                className="focus-visible:ring-0"
                required
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="edit-initialStock">Initial Stock Quantity</Label>
              <Input
                id="edit-initialStock"
                type="number"
                placeholder="Initial Stock Quantity"
                value={initialStock}
                onChange={(e) => setInitialStock(e.target.value)}
                className="focus-visible:ring-0"
                required
              />
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="edit-minBulkQuantity">Min Bulk Quantity</Label>
              <Input
                id="edit-minBulkQuantity"
                type="number"
                placeholder="Min Bulk Quantity"
                value={minBulkQuantity}
                onChange={(e) => setMinBulkQuantity(e.target.value)}
                className="focus-visible:ring-0"
                required
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="edit-bulkPrice">Bulk Price</Label>
              <Input
                id="edit-bulkPrice"
                type="number"
                placeholder="Bulk Price"
                value={bulkPrice}
                onChange={(e) => setBulkPrice(e.target.value)}
                className="focus-visible:ring-0"
                required
              />
            </div>
          </div>

          <div className="space-y-2">
            <Label>Upload Product Image</Label>
            <div
              onDrop={handleDrop}
              onDragOver={(e) => {
                e.preventDefault();
                setIsDragging(true);
              }}
              onDragLeave={() => setIsDragging(false)}
              className={`border-2 border-dashed rounded-lg p-8 text-center transition-colors ${
                isDragging
                  ? "border-primary bg-primary/5"
                  : "border-neutral-200 bg-neutral-50"
              }`}>
              <input
                type="file"
                accept="image/png,image/jpeg,image/jpg"
                onChange={handleFileInput}
                className="hidden"
                id="edit-file-upload"
              />
              <label
                htmlFor="edit-file-upload"
                className="cursor-pointer flex flex-col items-center gap-4">
                <Upload className="size-12 text-primary" />
                <div>
                  <p className="font-medium text-primary">Upload Files</p>
                  <p className="text-sm text-neutral-500 mt-1">
                    Click or drag image to upload PNG, JPG and are allowed
                  </p>
                </div>
                {selectedFile ? (
                  <p className="text-sm text-primary font-medium">
                    Selected: {selectedFile.name}
                  </p>
                ) : (
                  <p className="text-sm text-neutral-500">
                    Current: {product.imageUrl.split("/").pop()}
                  </p>
                )}
              </label>
            </div>
          </div>

        </form>

        <div className="px-4 sm:px-6 py-4 border-t border-neutral-100">
          <Button type="submit" form="edit-product-form" className="bg-primary hover:bg-primary/90 w-full">
            Update Product
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
}
