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
import { categoryImageUrl, getTopLevelCategories } from "@/lib/mappers/categories";
import { uploadImage } from "@/lib/upload";
import { useCategoryStore } from "@/store/useCategoryStore";
import type { AdminCategory } from "@/types/ProductTypes";
import { Upload, X } from "lucide-react";
import Image from "next/image";
import { toast } from "sonner";

const NO_PARENT = "none";

type CreateCategoryModalProps = {
  isOpen: boolean;
  onClose: () => void;
  category: AdminCategory | null;
};

export function CreateCategoryModal({
  isOpen,
  onClose,
  category,
}: CreateCategoryModalProps) {
  const {
    categories,
    createCategory,
    updateCategory,
    creatingCategory,
    updatingCategory,
  } = useCategoryStore();
  const [name, setName] = React.useState("");
  const [parentId, setParentId] = React.useState<string>(NO_PARENT);
  const [imageUrl, setImageUrl] = React.useState("");
  const [selectedFile, setSelectedFile] = React.useState<File | null>(null);
  const [previewUrl, setPreviewUrl] = React.useState<string | null>(null);
  const [isDragging, setIsDragging] = React.useState(false);
  const [uploading, setUploading] = React.useState(false);
  const fileInputRef = React.useRef<HTMLInputElement>(null);
  const isEdit = Boolean(category);
  const saving = creatingCategory || updatingCategory || uploading;

  React.useEffect(() => {
    if (!isOpen) return;
    setName(category?.name ?? "");
    setParentId(
      category?.parent_id != null ? String(category.parent_id) : NO_PARENT,
    );
    setImageUrl(category ? categoryImageUrl(category) ?? "" : "");
    setSelectedFile(null);
    setPreviewUrl(null);
  }, [isOpen, category]);

  React.useEffect(() => {
    if (!selectedFile) {
      setPreviewUrl(null);
      return;
    }
    const url = URL.createObjectURL(selectedFile);
    setPreviewUrl(url);
    return () => URL.revokeObjectURL(url);
  }, [selectedFile]);

  const parentOptions = React.useMemo(() => {
    return getTopLevelCategories(categories).filter(
      (cat) => cat.id !== category?.id,
    );
  }, [categories, category?.id]);

  const resetForm = () => {
    setName("");
    setParentId(NO_PARENT);
    setImageUrl("");
    setSelectedFile(null);
    setPreviewUrl(null);
  };

  const handleClose = () => {
    resetForm();
    onClose();
  };

  const handleFile = (file: File | undefined) => {
    if (!file) return;
    if (!file.type.startsWith("image/")) {
      toast.error("Please choose an image file");
      return;
    }
    setSelectedFile(file);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const nameTrim = name.trim();
    if (!nameTrim) {
      toast.error("Please enter a category name");
      return;
    }

    let image = imageUrl.trim() || null;
    if (selectedFile) {
      setUploading(true);
      const uploadResult = await uploadImage(selectedFile, "category");
      setUploading(false);
      if (!uploadResult.ok) {
        toast.error(uploadResult.error);
        return;
      }
      image = uploadResult.url;
    }

    const parsedParent = parentId === NO_PARENT ? null : Number(parentId);
    const payload = {
      name: nameTrim,
      parent_id: Number.isFinite(parsedParent) ? parsedParent : null,
      image,
    };

    const ok =
      isEdit && category
        ? await updateCategory(category.id, payload)
        : await createCategory(payload);

    if (!ok) {
      const { createCategoryError, updateCategoryError } =
        useCategoryStore.getState();
      toast.error(
        (isEdit ? updateCategoryError : createCategoryError) ??
          (isEdit ? "Failed to update category" : "Failed to create category"),
      );
      return;
    }

    toast.success(isEdit ? "Category updated" : "Category created");
    resetForm();
    onClose();
  };

  const displayPreview = previewUrl || imageUrl || null;

  return (
    <Dialog
      open={isOpen}
      onOpenChange={(open) => {
        if (!open) handleClose();
      }}
    >
      <DialogContent
        className="w-[calc(100%-2rem)] sm:max-w-[520px] max-h-[90dvh] overflow-y-auto"
        showCloseButton={false}
      >
        <DialogHeader className="relative pb-4">
          <DialogTitle className="text-lg sm:text-xl font-bold text-[#101928] mb-2 pr-10">
            {isEdit ? "Edit Category" : "Create Category"}
          </DialogTitle>
          <DialogDescription className="text-[#667085] text-sm font-normal pr-10">
            {isEdit
              ? "Update this category or move it under a parent"
              : "Add a product category or subcategory"}
          </DialogDescription>
          <button
            type="button"
            onClick={handleClose}
            aria-label="Close dialog"
            className="absolute top-0 right-0 flex items-center justify-center size-8 bg-[#E8EEFF] rounded-full hover:bg-[#E8EEFF]/80 transition-colors"
          >
            <X color="#0B1E66" size={18} />
          </button>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="space-y-2">
            <Label htmlFor="category-name" className="text-[#101928] font-medium">
              Name
            </Label>
            <Input
              id="category-name"
              placeholder="e.g. Groceries"
              value={name}
              onChange={(e) => setName(e.target.value)}
              className="focus-visible:ring-0 h-[48px]"
              required
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="category-parent" className="text-[#101928] font-medium">
              Parent category
            </Label>
            <Select value={parentId} onValueChange={setParentId}>
              <SelectTrigger
                id="category-parent"
                className="form-control w-full! h-[48px]"
              >
                <SelectValue placeholder="None (top-level)" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value={NO_PARENT}>None (top-level)</SelectItem>
                {parentOptions.map((cat) => (
                  <SelectItem key={cat.id} value={String(cat.id)}>
                    {cat.name}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <div className="space-y-2">
            <Label className="text-[#101928] font-medium">Image</Label>
            <div
              onDrop={(e) => {
                e.preventDefault();
                setIsDragging(false);
                handleFile(e.dataTransfer.files?.[0]);
              }}
              onDragOver={(e) => {
                e.preventDefault();
                setIsDragging(true);
              }}
              onDragLeave={() => setIsDragging(false)}
              className={`border-2 border-dashed rounded-lg p-5 text-center transition-colors ${
                isDragging
                  ? "border-primary bg-primary/5"
                  : "border-neutral-200 bg-neutral-50"
              }`}
            >
              <input
                ref={fileInputRef}
                type="file"
                accept="image/png,image/jpeg,image/jpg,image/webp"
                className="hidden"
                id="category-image-upload"
                onChange={(e) => {
                  handleFile(e.target.files?.[0]);
                  e.target.value = "";
                }}
              />
              <label
                htmlFor="category-image-upload"
                className="cursor-pointer flex flex-col items-center gap-3"
              >
                {displayPreview ? (
                  <div className="relative w-full max-w-[240px]">
                    <div className="relative w-full h-32 rounded-md border border-neutral-200 overflow-hidden bg-neutral-100">
                      <Image
                        src={displayPreview}
                        alt="Category preview"
                        fill
                        sizes="240px"
                        className="object-cover"
                        unoptimized
                      />
                    </div>
                    <button
                      type="button"
                      onClick={(e) => {
                        e.preventDefault();
                        e.stopPropagation();
                        setSelectedFile(null);
                        setImageUrl("");
                      }}
                      className="absolute -top-2 -right-2 size-8 rounded-full bg-white border border-neutral-200 flex items-center justify-center shadow-sm"
                      aria-label="Remove image"
                    >
                      <X size={16} color="#0B1E66" />
                    </button>
                  </div>
                ) : (
                  <Upload className="size-10 text-[#1F3A78]" />
                )}
                <p className="text-sm text-[#667085]">
                  Click or drag an image, or paste a URL below
                </p>
              </label>
            </div>
            <Input
              id="category-image-url"
              placeholder="https://example.com/category-header.jpg"
              value={selectedFile ? "" : imageUrl}
              onChange={(e) => {
                setSelectedFile(null);
                setImageUrl(e.target.value);
              }}
              className="focus-visible:ring-0 h-[48px]"
            />
          </div>

          <div className="pt-2">
            <Button
              type="submit"
              className="bg-[#1F3A78] hover:bg-[#1F3A78]/90 text-white w-full h-[52px] text-base font-medium"
              disabled={saving}
            >
              {saving
                ? isEdit
                  ? "Updating…"
                  : "Creating…"
                : isEdit
                  ? "Update Category"
                  : "Create Category"}
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
}
