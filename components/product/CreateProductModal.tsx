"use client";

import * as React from "react";
import Image from "next/image";
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
import { Upload, X } from "lucide-react";
import { toast } from "sonner";
import { useProductStore } from "@/store/useProductStore";
import { useInventoryStore } from "@/store/useInventoryStore";
import { useFilePreview } from "@/lib/useFilePreview";
import { uploadImage } from "@/lib/upload";

type CreateProductModalProps = {
  isOpen: boolean;
  onClose: () => void;
};

export function CreateProductModal({
  isOpen,
  onClose,
}: CreateProductModalProps) {
  const {
    categoriesTree,
    loadingCategories,
    fetchCategories,
    createProduct,
    creatingProduct,
  } = useProductStore();
  const { warehouses, fetchWarehouses } = useInventoryStore();

  const [productName, setProductName] = React.useState("");
  const [description, setDescription] = React.useState("");
  const [categoryId, setCategoryId] = React.useState<number | null>(null);
  const [subCategoryId, setSubCategoryId] = React.useState<number | null>(null);
  const [amount, setAmount] = React.useState("");
  const [initialStock, setInitialStock] = React.useState("");
  const [selectedWarehouseId, setSelectedWarehouseId] = React.useState<number | null>(null);
  const [minBulkQuantity, setMinBulkQuantity] = React.useState("");
  const [bulkPrice, setBulkPrice] = React.useState("");
  const [selectedFile, setSelectedFile] = React.useState<File | null>(null);
  const [isDragging, setIsDragging] = React.useState(false);
  const [uploadingImage, setUploadingImage] = React.useState(false);
  const fileInputRef = React.useRef<HTMLInputElement | null>(null);
  const previewUrl = useFilePreview(selectedFile);

  React.useEffect(() => {
    if (!isOpen) return;
    fetchCategories();
    fetchWarehouses();
  }, [isOpen, fetchCategories, fetchWarehouses]);

  const handleFileSelect = (file: File) => {
    if (file.type.startsWith("image/")) {
      setSelectedFile(file);
    } else {
      toast.error("Please select a valid image (PNG/JPG).");
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

  const handleClearSelectedFile = () => {
    setSelectedFile(null);
    if (fileInputRef.current) fileInputRef.current.value = "";
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    const resolvedCategoryId = subCategoryId ?? categoryId;
    if (!resolvedCategoryId) {
      toast.error("Please select a category");
      return;
    }

    if (!selectedFile) {
      toast.error("Please upload a product image");
      return;
    }

    const price = Number(amount);
    const stock = Number(initialStock);
    const minBulk = Number(minBulkQuantity);
    const bulk = Number(bulkPrice);

    if (!Number.isFinite(price) || price <= 0) {
      toast.error("Please enter a valid price");
      return;
    }
    if (!Number.isFinite(stock) || stock < 0) {
      toast.error("Please enter a valid stock quantity");
      return;
    }
    if (!Number.isFinite(minBulk) || minBulk <= 0) {
      toast.error("Please enter a valid min bulk quantity");
      return;
    }
    if (!Number.isFinite(bulk) || bulk <= 0) {
      toast.error("Please enter a valid bulk price");
      return;
    }

    if (!selectedWarehouseId) {
      toast.error("Please select a warehouse");
      return;
    }

    setUploadingImage(true);
    const uploadResult = await uploadImage(selectedFile, "product");
    setUploadingImage(false);

    if (!uploadResult.ok) {
      toast.error(uploadResult.error);
      return;
    }

    const ok = await createProduct({
      name: productName,
      description,
      price,
      stock,
      category_id: resolvedCategoryId,
      is_active: true,
      image_urls: [uploadResult.url],
      min_bulk_quantity: minBulk,
      bulk_price: bulk,
      warehouses: [
        {
          warehouse_id: selectedWarehouseId,
          quantity: stock,
        },
      ],
    });

    if (!ok) {
      toast.error("Failed to create product");
      return;
    }

    toast.success("Product created successfully");
    setProductName("");
    setDescription("");
    setCategoryId(null);
    setSubCategoryId(null);
    setAmount("");
    setInitialStock("");
    setSelectedWarehouseId(null);
    setMinBulkQuantity("");
    setBulkPrice("");
    setSelectedFile(null);
    if (fileInputRef.current) fileInputRef.current.value = "";
    onClose();
  };

  const selectedCategory = React.useMemo(
    () => categoriesTree.find((c) => c.id === categoryId) ?? null,
    [categoriesTree, categoryId]
  );

  const availableSubCategories = React.useMemo(
    () => selectedCategory?.subcategories ?? [],
    [selectedCategory]
  );

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent
        className="max-h-[90vh] flex flex-col p-0 w-[95vw] max-w-[557px]! sm:w-[557px]! sm:max-w-[557px]!"
        showCloseButton={false}
      >
        <DialogHeader className="px-4 sm:px-6 pt-4 sm:pt-6 pb-4 border-b border-neutral-100 relative">
          <DialogTitle className="text-xl sm:text-2xl font-semibold">
            Create New Product
          </DialogTitle>
          <DialogDescription className="text-xs sm:text-sm text-neutral-500">
            Create a new product listing
          </DialogDescription>
          <button
            type="button"
            onClick={onClose}
            aria-label="Close dialog"
            className="absolute top-4 sm:top-6 right-4 sm:right-6 flex items-center justify-center size-[30px] bg-[#E8EEFF] rounded-full"
          >
            <X color="#0B1E66" size={20} cursor="pointer" />
          </button>
        </DialogHeader>

        <form
          id="create-product-form"
          onSubmit={handleSubmit}
          className="flex-1 overflow-y-auto px-4 sm:px-6 py-4 space-y-4 sm:space-y-6"
        >
          <div className="space-y-2">
            <Label htmlFor="productName">Product Name</Label>
            <Input
              id="productName"
              placeholder="Product Name"
              value={productName}
              onChange={(e) => setProductName(e.target.value)}
              className="form-control"
              required
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="description">Product Description</Label>
            <textarea
              id="description"
              placeholder="Product Description"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              className="form-control w-full h-auto! min-h-[100px] resize-none"
              required
            />
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="category">Select Category</Label>
              <Select
                value={categoryId == null ? "" : String(categoryId)}
                onValueChange={(value) => {
                  const parsed = Number(value);
                  setCategoryId(Number.isFinite(parsed) ? parsed : null);
                  setSubCategoryId(null);
                }}
                disabled={loadingCategories}
              >
                <SelectTrigger id="category" className="form-control w-full!">
                  <SelectValue placeholder="Select Category" />
                </SelectTrigger>
                <SelectContent>
                  {categoriesTree.map((cat) => (
                    <SelectItem key={cat.id} value={String(cat.id)}>
                      {cat.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Label htmlFor="subCategory">Select Sub Category</Label>
              <Select
                value={subCategoryId == null ? "" : String(subCategoryId)}
                onValueChange={(value) => {
                  const parsed = Number(value);
                  setSubCategoryId(Number.isFinite(parsed) ? parsed : null);
                }}
                disabled={
                  !categoryId ||
                  loadingCategories ||
                  availableSubCategories.length === 0
                }
              >
                <SelectTrigger
                  id="subCategory"
                  className="form-control w-full!"
                >
                  <SelectValue placeholder="Select Sub Category" />
                </SelectTrigger>
                <SelectContent>
                  {availableSubCategories.map((subCat) => (
                    <SelectItem key={subCat.id} value={String(subCat.id)}>
                      {subCat.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="amount">Enter Amount</Label>
              <Input
                id="amount"
                type="number"
                placeholder="Enter Amount"
                value={amount}
                onChange={(e) => setAmount(e.target.value)}
                className="form-control"
                required
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="initialStock">Initial Stock Quantity</Label>
              <Input
                id="initialStock"
                type="number"
                placeholder="Initial Stock Quantity"
                value={initialStock}
                onChange={(e) => setInitialStock(e.target.value)}
                className="form-control"
                required
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="warehouse">Warehouse</Label>
              <Select
                value={selectedWarehouseId == null ? "" : String(selectedWarehouseId)}
                onValueChange={(value) => {
                  const parsed = Number(value);
                  setSelectedWarehouseId(Number.isFinite(parsed) ? parsed : null);
                }}
              >
                <SelectTrigger id="warehouse" className="form-control w-full!">
                  <SelectValue placeholder="Select Warehouse" />
                </SelectTrigger>
                <SelectContent>
                  {warehouses.map((w) => (
                    <SelectItem key={w.id} value={String(w.id)}>
                      {w.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="minBulkQuantity">Min Bulk Quantity</Label>
              <Input
                id="minBulkQuantity"
                type="number"
                placeholder="Min Bulk Quantity"
                value={minBulkQuantity}
                onChange={(e) => setMinBulkQuantity(e.target.value)}
                className="form-control"
                required
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="bulkPrice">Bulk Price</Label>
              <Input
                id="bulkPrice"
                type="number"
                placeholder="Bulk Price"
                value={bulkPrice}
                onChange={(e) => setBulkPrice(e.target.value)}
                className="form-control"
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
              }`}
            >
              <input
                type="file"
                accept="image/png,image/jpeg,image/jpg"
                onChange={handleFileInput}
                className="hidden"
                id="file-upload"
                ref={fileInputRef}
              />
              <label
                htmlFor="file-upload"
                className="cursor-pointer flex flex-col items-center gap-4"
              >
                {previewUrl ? (
                  <div className="w-full">
                    <div className="relative mx-auto w-full max-w-[260px]">
                      <div className="relative w-full h-[160px] rounded-md border border-neutral-200 overflow-hidden">
                        <Image
                          src={previewUrl}
                          alt="Selected product"
                          fill
                          sizes="260px"
                          className="object-cover"
                          unoptimized
                        />
                      </div>
                      <button
                        type="button"
                        onClick={(e) => {
                          e.preventDefault();
                          e.stopPropagation();
                          handleClearSelectedFile();
                        }}
                        className="absolute -top-3 -right-3 size-8 rounded-full bg-white border border-neutral-200 flex items-center justify-center shadow-sm"
                        aria-label="Remove selected image"
                      >
                        <X size={16} color="#0B1E66" />
                      </button>
                    </div>
                  </div>
                ) : (
                  <Upload className="size-12 text-primary" />
                )}
                <div>
                  <p className="font-medium text-primary">Upload Files</p>
                  <p className="text-sm text-neutral-500 mt-1">
                    Click or drag image to upload PNG, JPG and are allowed
                  </p>
                </div>
                {selectedFile && (
                  <p className="text-sm text-primary font-medium">
                    Selected: {selectedFile.name}
                  </p>
                )}
              </label>
            </div>
          </div>
        </form>

        <div className="px-4 sm:px-6 py-4 border-t border-neutral-100">
          <Button
            type="submit"
            form="create-product-form"
            className="btn btn-primary w-full"
            disabled={creatingProduct || uploadingImage}
          >
            {uploadingImage
              ? "Uploading image..."
              : creatingProduct
              ? "Creating product..."
              : "Create New Product"}
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
}
