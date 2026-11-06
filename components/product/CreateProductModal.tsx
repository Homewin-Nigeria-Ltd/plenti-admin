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
import { useProductStore } from "@/store/useProductStore";
import { useInventoryStore } from "@/store/useInventoryStore";
import { useFilesPreview } from "@/lib/useFilePreview";
import { useImageCropQueue } from "@/lib/useImageCropQueue";
import { uploadImages } from "@/lib/upload";
import { ImageCropDialog } from "@/components/common/ImageCropDialog";
import { ProductImagesField } from "@/components/product/ProductImagesField";
import {
  BulkTiersFields,
  emptyBulkTierRow,
  parseBulkTierRows,
} from "@/components/product/BulkTiersFields";

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
  const [selectedWarehouseId, setSelectedWarehouseId] = React.useState<
    number | null
  >(null);
  const [bulkTiers, setBulkTiers] = React.useState([emptyBulkTierRow()]);
  const [discountPercent, setDiscountPercent] = React.useState("");
  const [selectedFiles, setSelectedFiles] = React.useState<File[]>([]);
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

  React.useEffect(() => {
    if (!isOpen) return;
    fetchCategories();
    fetchWarehouses();
  }, [isOpen, fetchCategories, fetchWarehouses]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    const resolvedCategoryId = subCategoryId ?? categoryId;
    if (!resolvedCategoryId) {
      toast.error("Please select a category");
      return;
    }

    if (selectedFiles.length === 0) {
      toast.error("Please upload at least one product image");
      return;
    }

    const price = Number(amount);
    const stock = Number(initialStock);
    const parsedTiers = parseBulkTierRows(bulkTiers);

    if (!Number.isFinite(price) || price <= 0) {
      toast.error("Please enter a valid price");
      return;
    }
    if (!Number.isFinite(stock) || stock < 0) {
      toast.error("Please enter a valid stock quantity");
      return;
    }
    if (!parsedTiers.ok) {
      toast.error(parsedTiers.message);
      return;
    }
    if (parsedTiers.tiers.length === 0) {
      toast.error("Please add at least one bulk tier");
      return;
    }

    const discountRaw = discountPercent.trim();
    let discount = 0;
    if (discountRaw !== "") {
      discount = Number(discountRaw);
      if (!Number.isFinite(discount) || discount < 0 || discount > 100) {
        toast.error("Please enter a valid discount percent (0–100)");
        return;
      }
    }

    if (!selectedWarehouseId) {
      toast.error("Please select a warehouse");
      return;
    }

    setUploadingImage(true);
    const uploadResult = await uploadImages(selectedFiles, "product");
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
      image_urls: uploadResult.urls,
      bulk_tiers: parsedTiers.tiers,
      discount_percent: discount,
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
    setBulkTiers([emptyBulkTierRow()]);
    setDiscountPercent("");
    setSelectedFiles([]);
    resetQueue();
    onClose();
  };

  const selectedCategory = React.useMemo(
    () => categoriesTree.find((c) => c.id === categoryId) ?? null,
    [categoriesTree, categoryId],
  );

  const availableSubCategories = React.useMemo(
    () => selectedCategory?.subcategories ?? [],
    [selectedCategory],
  );

  return (
    <>
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
              className="absolute top-4 sm:top-6 right-4 sm:right-6 flex items-center justify-center size-7.5 bg-[#E8EEFF] rounded-full"
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
                className="form-control w-full h-auto! min-h-25 resize-none"
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
                  value={
                    selectedWarehouseId == null
                      ? ""
                      : String(selectedWarehouseId)
                  }
                  onValueChange={(value) => {
                    const parsed = Number(value);
                    setSelectedWarehouseId(
                      Number.isFinite(parsed) ? parsed : null,
                    );
                  }}
                >
                  <SelectTrigger
                    id="warehouse"
                    className="form-control w-full!"
                  >
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

            <BulkTiersFields
              idPrefix="create-bulk"
              value={bulkTiers}
              onChange={setBulkTiers}
            />

            <div className="space-y-2">
              <Label htmlFor="discountPercent">Discount %</Label>
              <Input
                id="discountPercent"
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
              selectedPreviews={selectedPreviews}
              onFilesChosen={enqueue}
              onRemoveSelected={(index) => {
                setSelectedFiles((prev) => prev.filter((_, i) => i !== index));
              }}
              inputId="file-upload"
              fileInputRef={fileInputRef}
            />
          </form>

          <div className="px-4 sm:px-6 py-4 border-t border-neutral-100">
            <Button
              type="submit"
              form="create-product-form"
              className="btn btn-primary w-full"
              disabled={creatingProduct || uploadingImage}
            >
              {uploadingImage
                ? selectedFiles.length > 1
                  ? "Uploading images..."
                  : "Uploading image..."
                : creatingProduct
                  ? "Creating product..."
                  : "Create New Product"}
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
