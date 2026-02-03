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
import type { Product } from "@/data/products";
import { useProductStore } from "@/store/useProductStore";
import { useFilePreview } from "@/lib/useFilePreview";
import type {
  UpdateProductRequest,
  UploadImageResponse,
} from "@/types/ProductTypes";

function resolveCategorySelection(
  rawCategoryId: number | null,
  categoriesTree: Array<{
    id: number;
    subcategories?: Array<{ id: number }>;
  }>
): { categoryId: number | null; subCategoryId: number | null } {
  if (!rawCategoryId) return { categoryId: null, subCategoryId: null };

  const parentMatch = categoriesTree.find((c) => c.id === rawCategoryId);
  if (parentMatch) return { categoryId: parentMatch.id, subCategoryId: null };

  const parentOfSub = categoriesTree.find((c) =>
    c.subcategories?.some((s) => s.id === rawCategoryId)
  );
  if (parentOfSub)
    return { categoryId: parentOfSub.id, subCategoryId: rawCategoryId };

  return { categoryId: rawCategoryId, subCategoryId: null };
}

type EditProductModalProps = {
  isOpen: boolean;
  onClose: () => void;
  product: Product | null;
};

export function EditProductModal({
  isOpen,
  onClose,
  product,
}: EditProductModalProps) {
  const {
    categoriesTree,
    loadingCategories,
    fetchCategories,
    updateProduct,
    updatingById,
  } = useProductStore();

  const [productName, setProductName] = React.useState("");
  const [description, setDescription] = React.useState("");
  const [categoryId, setCategoryId] = React.useState<number | null>(null);
  const [subCategoryId, setSubCategoryId] = React.useState<number | null>(null);
  const [amount, setAmount] = React.useState("");
  const [initialStock, setInitialStock] = React.useState("");
  const [minBulkQuantity, setMinBulkQuantity] = React.useState("");
  const [bulkPrice, setBulkPrice] = React.useState("");
  const [selectedFile, setSelectedFile] = React.useState<File | null>(null);
  const [isDragging, setIsDragging] = React.useState(false);
  const [uploadingImage, setUploadingImage] = React.useState(false);
  const fileInputRef = React.useRef<HTMLInputElement | null>(null);
  const previewUrl = useFilePreview(selectedFile);
  const wasOpenRef = React.useRef(false);
  const selectionPristineRef = React.useRef(true);
  const initializedForProductRef = React.useRef<string | number | null>(null);

  React.useEffect(() => {
    // Reset open state
    if (!isOpen) {
      wasOpenRef.current = false;
      selectionPristineRef.current = true;
      initializedForProductRef.current = null;
      return;
    }

    // On open: fetch categories once
    if (!wasOpenRef.current) {
      wasOpenRef.current = true;
      selectionPristineRef.current = true;
      fetchCategories();
    }

    if (!product) return;

    const productKey = product.id;
    const isNewProduct = initializedForProductRef.current !== productKey;

    // Initialize form fields ONLY when the product changes (or first open)
    if (isNewProduct) {
      initializedForProductRef.current = productKey;
      selectionPristineRef.current = true;

      setProductName(product.name);
      setDescription(product.description);
      setAmount(String(product.price ?? ""));
      setInitialStock(String(product.stockLevel ?? ""));
      setBulkPrice(
        product.bulkPriceRaw == null ? "" : String(product.bulkPriceRaw)
      );
      setMinBulkQuantity(
        product.minBulkQuantity == null ? "" : String(product.minBulkQuantity)
      );
      setSelectedFile(null);
      if (fileInputRef.current) fileInputRef.current.value = "";
    }

    // Initialize category selection only if user hasn't modified it in this open cycle
    if (!selectionPristineRef.current) return;

    const rawId =
      typeof product.categoryId === "number" ? product.categoryId : null;
    const resolved = resolveCategorySelection(rawId, categoriesTree);
    setCategoryId(resolved.categoryId);
    setSubCategoryId(resolved.subCategoryId);
  }, [isOpen, product, categoriesTree, fetchCategories]);

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

    if (!product) return;

    const patch: UpdateProductRequest = {};

    const nameTrim = productName.trim();
    if (nameTrim && nameTrim !== product.name) patch.name = nameTrim;

    const descTrim = description.trim();
    if (descTrim !== (product.description ?? "").trim())
      patch.description = descTrim;

    const price = Number(amount);
    if (!Number.isFinite(price) || price <= 0) {
      toast.error("Please enter a valid price");
      return;
    }
    if (price !== product.price) patch.price = price;

    const stock = Number(initialStock);
    if (!Number.isFinite(stock) || stock < 0) {
      toast.error("Please enter a valid stock quantity");
      return;
    }
    if (stock !== product.stockLevel) patch.stock = stock;

    const resolvedCategoryId = subCategoryId ?? categoryId;
    const originalCategoryId =
      typeof product.categoryId === "number" ? product.categoryId : null;
    if (resolvedCategoryId && resolvedCategoryId !== originalCategoryId) {
      patch.category_id = resolvedCategoryId;
    }

    // min_bulk_quantity: allow blank -> null (and only send if it changed)
    const minBulkRaw = minBulkQuantity.trim();
    const originalMinBulk =
      typeof product.minBulkQuantity === "number"
        ? product.minBulkQuantity
        : null;
    if (minBulkRaw === "") {
      if (originalMinBulk !== null) patch.min_bulk_quantity = null;
    } else {
      const minBulk = Number(minBulkRaw);
      if (!Number.isFinite(minBulk) || minBulk <= 0) {
        toast.error("Please enter a valid min bulk quantity");
        return;
      }
      if (minBulk !== originalMinBulk) patch.min_bulk_quantity = minBulk;
    }

    // bulk_price: allow blank -> null (and only send if it changed)
    const bulkRaw = bulkPrice.trim();
    const originalBulk =
      typeof product.bulkPriceRaw === "number" ? product.bulkPriceRaw : null;
    if (bulkRaw === "") {
      if (originalBulk !== null) patch.bulk_price = null;
    } else {
      const bulk = Number(bulkRaw);
      if (!Number.isFinite(bulk) || bulk <= 0) {
        toast.error("Please enter a valid bulk price");
        return;
      }
      if (bulk !== originalBulk) patch.bulk_price = bulk;
    }

    // Upload image only if user selected a new one
    if (selectedFile) {
      try {
        setUploadingImage(true);
        const fd = new FormData();
        fd.set("image", selectedFile);
        fd.set("folder", "product");

        const uploadRes = await fetch("/api/upload/image", {
          method: "POST",
          body: fd,
        });

        const uploadJson = (await uploadRes.json().catch(() => null)) as
          | UploadImageResponse
          | unknown
          | null;

        if (!uploadRes.ok) {
          const message =
            uploadJson &&
            typeof uploadJson === "object" &&
            "message" in uploadJson &&
            typeof (uploadJson as Record<string, unknown>).message === "string"
              ? String((uploadJson as Record<string, unknown>).message)
              : "Image upload failed";
          toast.error(message);
          return;
        }

        const imageUrl =
          uploadJson &&
          typeof uploadJson === "object" &&
          "data" in uploadJson &&
          typeof (uploadJson as Record<string, unknown>).data === "object" &&
          (uploadJson as Record<string, unknown>).data !== null &&
          "url" in
            ((uploadJson as Record<string, unknown>).data as Record<
              string,
              unknown
            >) &&
          typeof (
            (uploadJson as Record<string, unknown>).data as Record<
              string,
              unknown
            >
          ).url === "string"
            ? String(
                (
                  (uploadJson as Record<string, unknown>).data as Record<
                    string,
                    unknown
                  >
                ).url
              )
            : null;

        if (!imageUrl) {
          toast.error("Image upload failed: missing image URL");
          return;
        }

        patch.image_urls = [imageUrl];
      } finally {
        setUploadingImage(false);
      }
    }

    if (Object.keys(patch).length === 0) {
      toast.message("No changes to update");
      return;
    }

    const ok = await updateProduct(product.id, patch);
    if (!ok) {
      toast.error("Failed to update product");
      return;
    }

    toast.success("Product updated successfully");
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

  const currentImageUrls = React.useMemo(() => {
    if (!product) return [];
    const urls = Array.isArray(product.images) ? product.images : [];
    const merged = [
      ...urls.filter((u): u is string => typeof u === "string" && !!u),
      ...(product.imageUrl ? [product.imageUrl] : []),
    ];
    return Array.from(new Set(merged));
  }, [product]);

  if (!product) return null;

  const isUpdating = !!updatingById[String(product.id)];
  const isSaving = uploadingImage || isUpdating;

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent
        className="max-h-[90vh] flex flex-col p-0 w-[95vw] max-w-139.25! sm:w-139.25! sm:max-w-139.25!"
        showCloseButton={false}
      >
        <DialogHeader className="px-6 pt-6 pb-4 border-b border-neutral-100 relative">
          <DialogTitle className="text-2xl font-semibold">
            Edit Product
          </DialogTitle>
          <DialogDescription className="text-sm text-neutral-500">
            Update product information
          </DialogDescription>
          <button
            type="button"
            onClick={onClose}
            aria-label="Close dialog"
            className="absolute top-6 right-6 flex items-center justify-center size-7.5 bg-[#E8EEFF] rounded-full"
          >
            <X color="#0B1E66" size={20} cursor="pointer" />
          </button>
        </DialogHeader>

        <form
          id="edit-product-form"
          onSubmit={handleSubmit}
          className="flex-1 overflow-y-auto px-6 py-4 space-y-6"
        >
          <div className="space-y-2">
            <Label htmlFor="edit-productName">Product Name</Label>
            <Input
              id="edit-productName"
              placeholder="Product Name"
              value={productName}
              onChange={(e) => setProductName(e.target.value)}
              className="form-control"
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
              className="form-control w-full h-auto! min-h-25 resize-none"
              required
            />
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="edit-category">Select Category</Label>
              <Select
                value={categoryId == null ? "" : String(categoryId)}
                onValueChange={(value) => {
                  const parsed = Number(value);
                  setCategoryId(Number.isFinite(parsed) ? parsed : null);
                  setSubCategoryId(null);
                  selectionPristineRef.current = false;
                }}
                disabled={loadingCategories}
              >
                <SelectTrigger
                  id="edit-category"
                  className="form-control w-full!"
                >
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
              <Label htmlFor="edit-subCategory">Select Sub Category</Label>
              <Select
                value={subCategoryId == null ? "" : String(subCategoryId)}
                onValueChange={(value) => {
                  const parsed = Number(value);
                  setSubCategoryId(Number.isFinite(parsed) ? parsed : null);
                  selectionPristineRef.current = false;
                }}
                disabled={
                  !categoryId ||
                  loadingCategories ||
                  availableSubCategories.length === 0
                }
              >
                <SelectTrigger
                  id="edit-subCategory"
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

          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="edit-amount">Enter Amount</Label>
              <Input
                id="edit-amount"
                type="number"
                placeholder="Enter Amount"
                value={amount}
                onChange={(e) => setAmount(e.target.value)}
                className="form-control"
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
                className="form-control"
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
                className="form-control"
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
                className="form-control"
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
              className={`border-[0.5px] border-dashed rounded-lg p-8 text-center transition-colors ${
                isDragging
                  ? "border-primary bg-primary/5"
                  : "border-[#D9D9D9] bg-[#E8EEFF]"
              }`}
            >
              <input
                type="file"
                accept="image/png,image/jpeg,image/jpg"
                onChange={handleFileInput}
                className="hidden"
                id="edit-file-upload"
                ref={fileInputRef}
              />
              <label
                htmlFor="edit-file-upload"
                className="cursor-pointer flex flex-col items-center gap-4"
              >
                {previewUrl ? (
                  <div className="w-full">
                    <div className="relative mx-auto w-full max-w-65">
                      <div className="relative w-full h-40 rounded-md border border-neutral-200 overflow-hidden">
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
                ) : currentImageUrls.length > 0 ? (
                  <div className="w-full">
                    <div className="relative mx-auto w-full max-w-65">
                      <div className="relative w-full h-40 rounded-md border border-neutral-200 overflow-hidden">
                        <Image
                          src={currentImageUrls[0]}
                          alt={product.name}
                          fill
                          sizes="260px"
                          className="object-cover"
                        />
                      </div>
                      {currentImageUrls.length > 1 ? (
                        <p className="text-xs text-neutral-500 mt-2">
                          {currentImageUrls.length} images
                        </p>
                      ) : null}
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
              </label>
            </div>
          </div>
        </form>

        <div className="px-4 sm:px-6 py-4 border-t border-neutral-100">
          <Button
            type="submit"
            form="edit-product-form"
            className="btn btn-primary w-full"
            disabled={isSaving}
          >
            {uploadingImage
              ? "Uploading image..."
              : isUpdating
              ? "Updating product..."
              : "Update Product"}
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
}
