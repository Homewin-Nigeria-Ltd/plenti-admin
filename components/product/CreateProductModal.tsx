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
import { Switch } from "@/components/ui/switch";
import { Plus, X } from "lucide-react";
import { toast } from "sonner";
import { useProductStore } from "@/store/useProductStore";
import { useInventoryStore } from "@/store/useInventoryStore";
import { useFilesPreview } from "@/lib/useFilePreview";
import { useImageCropQueue } from "@/lib/useImageCropQueue";
import { uploadImages } from "@/lib/upload";
import { ImageCropDialog } from "@/components/common/ImageCropDialog";
import { ProductImagesField } from "@/components/product/ProductImagesField";
import { cn } from "@/lib/utils";

type CreateProductModalProps = {
  isOpen: boolean;
  onClose: () => void;
};

type Visibility = "publish" | "unpublished" | "draft";

const MAX_PHOTOS = 8;

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
  const [brand, setBrand] = React.useState("");
  const [modelName, setModelName] = React.useState("");
  const [amount, setAmount] = React.useState("");
  const [compareAt, setCompareAt] = React.useState("");
  const [sku, setSku] = React.useState("");
  const [barcode, setBarcode] = React.useState("");
  const [weight, setWeight] = React.useState("");
  const [hasVariants, setHasVariants] = React.useState(false);
  const [visibility, setVisibility] = React.useState<Visibility>("publish");
  const [specs, setSpecs] = React.useState<Array<{ key: string; value: string }>>(
    [{ key: "", value: "" }],
  );
  const [selectedWarehouseId, setSelectedWarehouseId] = React.useState<
    number | null
  >(null);
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
    setSelectedFiles((prev) => {
      if (prev.length >= MAX_PHOTOS) return prev;
      return [...prev, file].slice(0, MAX_PHOTOS);
    });
  });

  React.useEffect(() => {
    if (!isOpen) return;
    fetchCategories();
    fetchWarehouses();
  }, [isOpen, fetchCategories, fetchWarehouses]);

  React.useEffect(() => {
    if (selectedWarehouseId != null) return;
    if (warehouses.length === 0) return;
    setSelectedWarehouseId(warehouses[0].id);
  }, [warehouses, selectedWarehouseId]);

  const resetForm = () => {
    setProductName("");
    setDescription("");
    setCategoryId(null);
    setSubCategoryId(null);
    setBrand("");
    setModelName("");
    setAmount("");
    setCompareAt("");
    setSku("");
    setBarcode("");
    setWeight("");
    setHasVariants(false);
    setVisibility("publish");
    setSpecs([{ key: "", value: "" }]);
    setSelectedWarehouseId(warehouses[0]?.id ?? null);
    setSelectedFiles([]);
    resetQueue();
  };

  const submitProduct = async (mode: "draft" | "publish") => {
    const resolvedCategoryId = subCategoryId ?? categoryId;
    if (!resolvedCategoryId) {
      toast.error("Please select a category");
      return;
    }
    if (!productName.trim()) {
      toast.error("Please enter a product name");
      return;
    }
    if (selectedFiles.length === 0) {
      toast.error("Please upload at least one product image");
      return;
    }

    const price = Number(amount);
    if (!Number.isFinite(price) || price <= 0) {
      toast.error("Please enter a valid selling price");
      return;
    }

    const weightRaw = weight.trim();
    let weightValue: number | undefined;
    if (weightRaw !== "") {
      weightValue = Number(weightRaw);
      if (!Number.isFinite(weightValue) || weightValue <= 0) {
        toast.error("Please enter a valid weight in kg");
        return;
      }
    }

    const compareAtValue = Number(compareAt);
    let discount = 0;
    if (compareAt.trim() !== "") {
      if (!Number.isFinite(compareAtValue) || compareAtValue <= 0) {
        toast.error("Please enter a valid compare-at price");
        return;
      }
      if (compareAtValue > price) {
        discount = Math.round((1 - price / compareAtValue) * 100);
      }
    }

    const warehouseId = selectedWarehouseId ?? warehouses[0]?.id ?? null;
    if (!warehouseId) {
      toast.error("Please select a warehouse");
      return;
    }

    const isActive = mode === "publish" && visibility === "publish";

    setUploadingImage(true);
    const uploadResult = await uploadImages(selectedFiles, "product");
    setUploadingImage(false);

    if (!uploadResult.ok) {
      toast.error(uploadResult.error);
      return;
    }

    const ok = await createProduct({
      name: productName.trim(),
      description: description.trim(),
      price,
      stock: 0,
      category_id: resolvedCategoryId,
      is_active: isActive,
      image_urls: uploadResult.urls,
      bulk_tiers: [{ min_qty: 1, price }],
      discount_percent: discount,
      ...(weightValue != null ? { weight: weightValue } : {}),
      warehouses: [
        {
          warehouse_id: warehouseId,
          quantity: 0,
        },
      ],
    });

    if (!ok) {
      toast.error("Failed to create product");
      return;
    }

    toast.success(
      mode === "draft" ? "Draft saved" : "Product created successfully",
    );
    resetForm();
    onClose();
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    await submitProduct(visibility === "draft" ? "draft" : "publish");
  };

  const selectedCategory = React.useMemo(
    () => categoriesTree.find((c) => c.id === categoryId) ?? null,
    [categoriesTree, categoryId],
  );

  const availableSubCategories = React.useMemo(
    () => selectedCategory?.subcategories ?? [],
    [selectedCategory],
  );

  const busy = creatingProduct || uploadingImage;
  const photoCount = selectedFiles.length;

  return (
    <>
      <Dialog open={isOpen} onOpenChange={onClose}>
        <DialogContent
          className="flex max-h-[92vh] w-[95vw] max-w-[980px]! flex-col gap-0 p-0 sm:max-w-[980px]!"
          showCloseButton={false}
        >
          <DialogHeader className="relative border-b border-[#EAECF0] px-5 py-4 sm:px-6">
            <DialogTitle className="text-lg font-semibold text-[#101828]">
              Create New Product
            </DialogTitle>
            <DialogDescription className="text-sm text-[#667085]">
              Fields marked * are required
            </DialogDescription>
            <button
              type="button"
              onClick={onClose}
              aria-label="Close dialog"
              className="absolute top-4 right-4 flex size-8 items-center justify-center rounded-full bg-[#F2F4F7]"
            >
              <X color="#344054" size={16} />
            </button>
          </DialogHeader>

          <form
            id="create-product-form"
            onSubmit={handleSubmit}
            className="flex-1 overflow-y-auto px-5 py-5 sm:px-6"
          >
            <div className="grid grid-cols-1 gap-6 lg:grid-cols-[1.15fr_0.85fr]">
              <div className="space-y-6">
                <section className="space-y-3">
                  <div className="flex items-center justify-between gap-3">
                    <div>
                      <p className="text-sm font-semibold text-[#101828]">
                        Photos <span className="text-[#D92D20]">*</span>
                      </p>
                      <p className="text-xs text-[#98A2B3]">
                        {photoCount}/{MAX_PHOTOS} · First photo is the cover
                      </p>
                    </div>
                  </div>
                  <ProductImagesField
                    selectedPreviews={selectedPreviews}
                    onFilesChosen={(files) => {
                      const remaining = MAX_PHOTOS - selectedFiles.length;
                      if (remaining <= 0) {
                        toast.error("You can upload up to 8 photos");
                        return;
                      }
                      enqueue(
                        Array.from(files as FileList | File[]).slice(
                          0,
                          remaining,
                        ),
                      );
                    }}
                    onRemoveSelected={(index) => {
                      setSelectedFiles((prev) =>
                        prev.filter((_, i) => i !== index),
                      );
                    }}
                    inputId="file-upload"
                    fileInputRef={fileInputRef}
                    variant="cover"
                  />
                </section>

                <section className="space-y-3">
                  <p className="text-sm font-semibold text-[#101828]">
                    Basic details
                  </p>
                  <Field label="Product name" required htmlFor="productName">
                    <Input
                      id="productName"
                      placeholder="e.g. Galaxy A15 128GB"
                      value={productName}
                      onChange={(e) => setProductName(e.target.value)}
                      className="h-10 rounded-lg border-[#EAECF0]"
                      required
                    />
                  </Field>
                  <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
                    <Field label="Category" required htmlFor="category">
                      <Select
                        value={categoryId == null ? "" : String(categoryId)}
                        onValueChange={(value) => {
                          const parsed = Number(value);
                          setCategoryId(Number.isFinite(parsed) ? parsed : null);
                          setSubCategoryId(null);
                        }}
                        disabled={loadingCategories}
                      >
                        <SelectTrigger
                          id="category"
                          className="h-10 w-full! rounded-lg border-[#EAECF0]"
                        >
                          <SelectValue placeholder="Pick a category" />
                        </SelectTrigger>
                        <SelectContent>
                          {categoriesTree.map((cat) => (
                            <SelectItem key={cat.id} value={String(cat.id)}>
                              {cat.name}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </Field>
                    <Field label="Sub-category" htmlFor="subCategory">
                      <Select
                        value={
                          subCategoryId == null ? "" : String(subCategoryId)
                        }
                        onValueChange={(value) => {
                          const parsed = Number(value);
                          setSubCategoryId(
                            Number.isFinite(parsed) ? parsed : null,
                          );
                        }}
                        disabled={
                          !categoryId ||
                          loadingCategories ||
                          availableSubCategories.length === 0
                        }
                      >
                        <SelectTrigger
                          id="subCategory"
                          className="h-10 w-full! rounded-lg border-[#EAECF0]"
                        >
                          <SelectValue placeholder="Pick a sub-category too" />
                        </SelectTrigger>
                        <SelectContent>
                          {availableSubCategories.map((subCat) => (
                            <SelectItem
                              key={subCat.id}
                              value={String(subCat.id)}
                            >
                              {subCat.name}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </Field>
                  </div>
                  <p className="text-xs text-[#98A2B3]">
                    Making categories? Categories and sub-categories are managed
                    in System Config.
                  </p>
                  <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
                    <Field label="Brand" htmlFor="brand">
                      <Input
                        id="brand"
                        placeholder="e.g. Samsung, Hisense"
                        value={brand}
                        onChange={(e) => setBrand(e.target.value)}
                        className="h-10 rounded-lg border-[#EAECF0]"
                      />
                    </Field>
                    <Field label="Model or size" htmlFor="modelName">
                      <Input
                        id="modelName"
                        placeholder="e.g. A15, 128GB, 50kg"
                        value={modelName}
                        onChange={(e) => setModelName(e.target.value)}
                        className="h-10 rounded-lg border-[#EAECF0]"
                      />
                    </Field>
                  </div>
                  <Field label="Description" htmlFor="description">
                    <textarea
                      id="description"
                      placeholder="What is it, what is in the box, why it's worth buying"
                      value={description}
                      onChange={(e) => setDescription(e.target.value)}
                      className="min-h-24 w-full resize-none rounded-lg border border-[#EAECF0] px-3 py-2 text-sm outline-none focus-visible:ring-2 focus-visible:ring-[#0B1E66]/20"
                    />
                  </Field>
                </section>

                <section className="space-y-3">
                  <div className="flex items-center justify-between">
                    <p className="text-sm font-semibold text-[#101828]">
                      Specifications
                    </p>
                    <p className="text-xs text-[#98A2B3]">
                      Shown in a table on the product page
                    </p>
                  </div>
                  <div className="space-y-2">
                    {specs.map((spec, index) => (
                      <div
                        key={index}
                        className="grid grid-cols-[1fr_1fr_auto] gap-2"
                      >
                        <Input
                          placeholder="e.g. Storage"
                          value={spec.key}
                          onChange={(e) =>
                            setSpecs((prev) =>
                              prev.map((row, i) =>
                                i === index
                                  ? { ...row, key: e.target.value }
                                  : row,
                              ),
                            )
                          }
                          className="h-10 rounded-lg border-[#EAECF0]"
                        />
                        <Input
                          placeholder="e.g. 128GB"
                          value={spec.value}
                          onChange={(e) =>
                            setSpecs((prev) =>
                              prev.map((row, i) =>
                                i === index
                                  ? { ...row, value: e.target.value }
                                  : row,
                              ),
                            )
                          }
                          className="h-10 rounded-lg border-[#EAECF0]"
                        />
                        <button
                          type="button"
                          className="flex size-10 items-center justify-center text-[#98A2B3]"
                          onClick={() =>
                            setSpecs((prev) =>
                              prev.length === 1
                                ? [{ key: "", value: "" }]
                                : prev.filter((_, i) => i !== index),
                            )
                          }
                          aria-label="Remove specification"
                        >
                          <X className="size-4" />
                        </button>
                      </div>
                    ))}
                  </div>
                  <button
                    type="button"
                    className="inline-flex items-center gap-1 text-sm font-medium text-[#0B1E66]"
                    onClick={() =>
                      setSpecs((prev) => [...prev, { key: "", value: "" }])
                    }
                  >
                    <Plus className="size-4" />
                    Add specification
                  </button>
                </section>
              </div>

              <div className="space-y-6">
                <section className="space-y-3">
                  <p className="text-sm font-semibold text-[#101828]">Pricing</p>
                  <Field label="Selling price" required htmlFor="amount">
                    <div className="relative">
                      <span className="absolute left-3 top-1/2 -translate-y-1/2 text-sm text-[#667085]">
                        ₦
                      </span>
                      <Input
                        id="amount"
                        type="number"
                        placeholder="215,000"
                        value={amount}
                        onChange={(e) => setAmount(e.target.value)}
                        className="h-10 rounded-lg border-[#EAECF0] pl-7"
                        required
                      />
                    </div>
                  </Field>
                  <Field label="Compare-at price" htmlFor="compareAt">
                    <div className="relative">
                      <span className="absolute left-3 top-1/2 -translate-y-1/2 text-sm text-[#667085]">
                        ₦
                      </span>
                      <Input
                        id="compareAt"
                        type="number"
                        placeholder="Optional"
                        value={compareAt}
                        onChange={(e) => setCompareAt(e.target.value)}
                        className="h-10 rounded-lg border-[#EAECF0] pl-7"
                      />
                    </div>
                  </Field>
                </section>

                <section className="space-y-3">
                  <p className="text-sm font-semibold text-[#101828]">
                    Identification
                  </p>
                  <Field label="SKU" htmlFor="sku">
                    <Input
                      id="sku"
                      placeholder="Auto-generated from name and brand"
                      value={sku}
                      onChange={(e) => setSku(e.target.value)}
                      className="h-10 rounded-lg border-[#EAECF0]"
                    />
                  </Field>
                  <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
                    <Field label="Barcode" htmlFor="barcode">
                      <Input
                        id="barcode"
                        placeholder="If it has one"
                        value={barcode}
                        onChange={(e) => setBarcode(e.target.value)}
                        className="h-10 rounded-lg border-[#EAECF0]"
                      />
                    </Field>
                    <Field label="Weight" htmlFor="weight">
                      <div className="relative">
                        <Input
                          id="weight"
                          type="number"
                          min={0}
                          step="0.01"
                          placeholder="kg"
                          value={weight}
                          onChange={(e) => setWeight(e.target.value)}
                          className="h-10 rounded-lg border-[#EAECF0] pr-10"
                        />
                        <span className="absolute right-3 top-1/2 -translate-y-1/2 text-sm text-[#98A2B3]">
                          kg
                        </span>
                      </div>
                    </Field>
                  </div>
                  {warehouses.length > 1 ? (
                    <Field label="Warehouse" htmlFor="warehouse">
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
                          className="h-10 w-full! rounded-lg border-[#EAECF0]"
                        >
                          <SelectValue placeholder="Select warehouse" />
                        </SelectTrigger>
                        <SelectContent>
                          {warehouses.map((w) => (
                            <SelectItem key={w.id} value={String(w.id)}>
                              {w.name}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </Field>
                  ) : null}
                </section>

                <section className="rounded-xl border border-[#EAECF0] p-4">
                  <div className="flex items-start justify-between gap-3">
                    <div>
                      <p className="text-sm font-semibold text-[#101828]">
                        Variants
                      </p>
                      <p className="mt-1 text-xs text-[#667085]">
                        Stock, colour, next-day vs pickup, second-screen
                        listings. You&apos;ll set this up after you publish.
                      </p>
                    </div>
                    <Switch
                      checked={hasVariants}
                      onCheckedChange={setHasVariants}
                    />
                  </div>
                </section>

                <section className="space-y-3">
                  <p className="text-sm font-semibold text-[#101828]">
                    Visibility
                  </p>
                  <VisibilityOption
                    checked={visibility === "publish"}
                    onChange={() => setVisibility("publish")}
                    title="Publish now"
                    description="Live on the storefront as soon as you save."
                  />
                  <VisibilityOption
                    checked={visibility === "unpublished"}
                    onChange={() => setVisibility("unpublished")}
                    title="Save as unpublished"
                    description="In the catalog, hidden from shoppers."
                  />
                  <VisibilityOption
                    checked={visibility === "draft"}
                    onChange={() => setVisibility("draft")}
                    title="Keep as draft"
                    description="Come back to this later. Drafts stay in this list."
                  />
                </section>
              </div>
            </div>
          </form>

          <div className="flex flex-col-reverse gap-2 border-t border-[#EAECF0] px-5 py-4 sm:flex-row sm:items-center sm:justify-end sm:px-6">
            <Button
              type="button"
              variant="ghost"
              className="h-10 rounded-lg text-[#344054]"
              onClick={onClose}
              disabled={busy}
            >
              Cancel
            </Button>
            <Button
              type="button"
              variant="outline"
              className="h-10 rounded-lg border-[#D0D5DD] text-[#344054]"
              disabled={busy}
              onClick={() => submitProduct("draft")}
            >
              Save as draft
            </Button>
            <Button
              type="submit"
              form="create-product-form"
              className="h-10 rounded-lg bg-[#0B1E66] text-white hover:bg-[#0B1E66]/90"
              disabled={busy}
            >
              {uploadingImage
                ? selectedFiles.length > 1
                  ? "Uploading images..."
                  : "Uploading image..."
                : creatingProduct
                  ? "Creating product..."
                  : "Publish product"}
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

function Field({
  label,
  required,
  htmlFor,
  children,
}: {
  label: string;
  required?: boolean;
  htmlFor?: string;
  children: React.ReactNode;
}) {
  return (
    <div className="space-y-1.5">
      <Label htmlFor={htmlFor} className="text-[13px] font-medium text-[#344054]">
        {label}
        {required ? <span className="text-[#D92D20]"> *</span> : null}
      </Label>
      {children}
    </div>
  );
}

function VisibilityOption({
  checked,
  onChange,
  title,
  description,
}: {
  checked: boolean;
  onChange: () => void;
  title: string;
  description: string;
}) {
  return (
    <label
      className={cn(
        "flex cursor-pointer items-start gap-3 rounded-xl border px-3 py-3",
        checked ? "border-[#0B1E66] bg-[#F8FAFF]" : "border-[#EAECF0] bg-white",
      )}
    >
      <input
        type="radio"
        name="visibility"
        checked={checked}
        onChange={onChange}
        className="mt-1 size-4 accent-[#0B1E66]"
      />
      <span>
        <span className="block text-sm font-medium text-[#101828]">{title}</span>
        <span className="mt-0.5 block text-xs text-[#667085]">
          {description}
        </span>
      </span>
    </label>
  );
}
