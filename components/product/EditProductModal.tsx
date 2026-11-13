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
import { X } from "lucide-react";
import { toast } from "sonner";
import type { Product } from "@/data/products";
import { useProductStore } from "@/store/useProductStore";
import { useFilesPreview } from "@/lib/useFilePreview";
import { useImageCropQueue } from "@/lib/useImageCropQueue";
import { uploadImages } from "@/lib/upload";
import { ImageCropDialog } from "@/components/common/ImageCropDialog";
import { ProductImagesField } from "@/components/product/ProductImagesField";
import {
  BulkTiersFields,
  bulkTiersEqual,
  parseBulkTierRows,
  productToBulkTierRows,
} from "@/components/product/BulkTiersFields";
import type { UpdateProductRequest } from "@/types/ProductTypes";

function productImageUrls(product: Product): string[] {
  const fromImages = (product.images ?? []).filter(
    (url): url is string =>
      typeof url === "string" &&
      url.length > 0 &&
      !url.includes("picsum.photos"),
  );
  if (fromImages.length > 0) return Array.from(new Set(fromImages));
  if (product.imageUrl && !product.imageUrl.includes("picsum.photos")) {
    return [product.imageUrl];
  }
  return [];
}

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
  const [weight, setWeight] = React.useState("");
  const [bulkTiers, setBulkTiers] = React.useState(productToBulkTierRows({}));
  const [discountPercent, setDiscountPercent] = React.useState("");
  const [selectedFiles, setSelectedFiles] = React.useState<File[]>([]);
  const [existingImageUrls, setExistingImageUrls] = React.useState<string[]>(
    [],
  );
  const [originalImageUrls, setOriginalImageUrls] = React.useState<string[]>(
    [],
  );
  const [uploadingImage, setUploadingImage] = React.useState(false);
  const selectedPreviews = useFilesPreview(selectedFiles);
  const {
    cropImageSrc,
    isCropOpen,
    fileInputRef,
    enqueue,
    handleApply: handleCropApply,
    resetQueue,
  } = useImageCropQueue((file) => {
    setSelectedFiles((prev) => [...prev, file]);
  });
  const wasOpenRef = React.useRef(false);
  const selectionPristineRef = React.useRef(true);
  const initializedForProductRef = React.useRef<string | number | null>(null);

  React.useEffect(() => {
    // Reset open state
    if (!isOpen) {
      wasOpenRef.current = false;
      selectionPristineRef.current = true;
      initializedForProductRef.current = null;
      resetQueue();
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
      setWeight(product.weight == null ? "" : String(product.weight));
      setBulkTiers(productToBulkTierRows(product));
      setDiscountPercent(
        product.discountPercent == null ? "" : String(product.discountPercent)
      );
      const urls = productImageUrls(product);
      setExistingImageUrls(urls);
      setOriginalImageUrls(urls);
      setSelectedFiles([]);
      resetQueue();
    }

    // Initialize category selection only if user hasn't modified it in this open cycle
    if (!selectionPristineRef.current) return;

    const rawId =
      typeof product.categoryId === "number" ? product.categoryId : null;
    const resolved = resolveCategorySelection(rawId, categoriesTree);
    setCategoryId(resolved.categoryId);
    setSubCategoryId(resolved.subCategoryId);
  }, [isOpen, product, categoriesTree, fetchCategories, resetQueue]);

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

    const weightRaw = weight.trim();
    const originalWeight =
      typeof product.weight === "number" ? product.weight : null;
    if (weightRaw === "") {
      if (originalWeight !== null) patch.weight = null;
    } else {
      const weightValue = Number(weightRaw);
      if (!Number.isFinite(weightValue) || weightValue <= 0) {
        toast.error("Please enter a valid weight in kg");
        return;
      }
      if (weightValue !== originalWeight) patch.weight = weightValue;
    }

    const resolvedCategoryId = subCategoryId ?? categoryId;
    const originalCategoryId =
      typeof product.categoryId === "number" ? product.categoryId : null;
    if (resolvedCategoryId && resolvedCategoryId !== originalCategoryId) {
      patch.category_id = resolvedCategoryId;
    }

    const parsedTiers = parseBulkTierRows(bulkTiers);
    if (!parsedTiers.ok) {
      toast.error(parsedTiers.message);
      return;
    }
    const originalTiers = productToBulkTierRows(product);
    const originalParsed = parseBulkTierRows(originalTiers);
    const originalBulkTiers = originalParsed.ok ? originalParsed.tiers : [];
    if (!bulkTiersEqual(parsedTiers.tiers, originalBulkTiers)) {
      patch.bulk_tiers = parsedTiers.tiers;
    }

    const discountRaw = discountPercent.trim();
    const originalDiscount =
      typeof product.discountPercent === "number"
        ? product.discountPercent
        : null;
    if (discountRaw === "") {
      if (originalDiscount !== null && originalDiscount !== 0) {
        patch.discount_percent = 0;
      }
    } else {
      const discount = Number(discountRaw);
      if (!Number.isFinite(discount) || discount < 0 || discount > 100) {
        toast.error("Please enter a valid discount percent (0–100)");
        return;
      }
      if (discount !== originalDiscount) patch.discount_percent = discount;
    }

    const imagesChanged =
      selectedFiles.length > 0 ||
      existingImageUrls.join("|") !== originalImageUrls.join("|");

    if (imagesChanged) {
      if (existingImageUrls.length + selectedFiles.length === 0) {
        toast.error("Please keep at least one product image");
        return;
      }

      let uploadedUrls: string[] = [];
      if (selectedFiles.length > 0) {
        setUploadingImage(true);
        const uploadResult = await uploadImages(selectedFiles, "product");
        setUploadingImage(false);
        if (!uploadResult.ok) {
          toast.error(uploadResult.error);
          return;
        }
        uploadedUrls = uploadResult.urls;
      }

      patch.image_urls = [...existingImageUrls, ...uploadedUrls];
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

  if (!product) return null;

  const isUpdating = !!updatingById[String(product.id)];
  const isSaving = uploadingImage || isUpdating;

  return (
    <>
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

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
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

            <div className="space-y-2">
              <Label htmlFor="edit-weight">Weight (kg)</Label>
              <Input
                id="edit-weight"
                type="number"
                min={0}
                step="0.01"
                placeholder="e.g. 1.5"
                value={weight}
                onChange={(e) => setWeight(e.target.value)}
                className="form-control"
              />
            </div>
          </div>

          <BulkTiersFields
            idPrefix="edit-bulk"
            value={bulkTiers}
            onChange={setBulkTiers}
          />

          <div className="space-y-2">
            <Label htmlFor="edit-discountPercent">Discount %</Label>
            <Input
              id="edit-discountPercent"
              type="number"
              min={0}
              max={100}
              step="0.01"
              placeholder="Discount %"
              value={discountPercent}
              onChange={(e) => setDiscountPercent(e.target.value)}
              className="form-control"
            />
            <p className="text-xs text-[#667085]">
              Permanent product discount. It does not expire. Timed promotions
              belong on Flash Sales.
            </p>
          </div>

          <ProductImagesField
            existingUrls={existingImageUrls}
            selectedPreviews={selectedPreviews}
            onFilesChosen={enqueue}
            onRemoveExisting={(url) => {
              setExistingImageUrls((prev) => prev.filter((item) => item !== url));
            }}
            onRemoveSelected={(index) => {
              setSelectedFiles((prev) => prev.filter((_, i) => i !== index));
            }}
            inputId="edit-file-upload"
            fileInputRef={fileInputRef}
          />
        </form>

        <div className="px-4 sm:px-6 py-4 border-t border-neutral-100">
          <Button
            type="submit"
            form="edit-product-form"
            className="btn btn-primary w-full"
            disabled={isSaving}
          >
            {uploadingImage
              ? selectedFiles.length > 1
                ? "Uploading images..."
                : "Uploading image..."
              : isUpdating
              ? "Updating product..."
              : "Update Product"}
          </Button>
        </div>
        </DialogContent>
      </Dialog>

      <ImageCropDialog
        isOpen={isCropOpen}
        imageSrc={cropImageSrc}
        onClose={resetQueue}
        onApply={handleCropApply}
        aspect={1}
        title="Crop Product Image"
      />
    </>
  );
}
