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
import { Switch } from "@/components/ui/switch";
import { Upload, X } from "lucide-react";
import { toast } from "sonner";
import { useMarketingStore } from "@/store/useMarketingStore";
import { useFilePreview } from "@/lib/useFilePreview";
import { uploadImage } from "@/lib/upload";

type CreateBannerModalProps = {
  isOpen: boolean;
  onClose: () => void;
};

const BANNER_TYPES = ["Main", "In Page", "Full-Page"] as const;
const LINK_TYPES = [
  { value: "url", label: "URL" },
  { value: "category", label: "Category" },
] as const;

const initialFormData = {
  title: "",
  subheading: "",
  description: "",
  image_url: "",
  link_type: "url" as "url" | "category",
  link_url: "",
  link_id: "" as string,
  screen_location: "",
  banner_type: "In Page",
  is_active: true,
};

export function CreateBannerModal({ isOpen, onClose }: CreateBannerModalProps) {
  const { createBanner, creatingBanner } = useMarketingStore();
  const [formData, setFormData] = React.useState(initialFormData);
  const [selectedFile, setSelectedFile] = React.useState<File | null>(null);
  const [uploadingImage, setUploadingImage] = React.useState(false);
  const [isDragging, setIsDragging] = React.useState(false);
  const fileInputRef = React.useRef<HTMLInputElement | null>(null);
  const previewUrl = useFilePreview(selectedFile);

  const handleClose = () => {
    setFormData(initialFormData);
    setSelectedFile(null);
    if (fileInputRef.current) fileInputRef.current.value = "";
    onClose();
  };

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
    if (file) handleFileSelect(file);
  };

  const handleFileInput = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) handleFileSelect(file);
  };

  const handleClearSelectedFile = () => {
    setSelectedFile(null);
    if (fileInputRef.current) fileInputRef.current.value = "";
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    const title = formData.title.trim();
    if (!title) {
      toast.error("Title is required");
      return;
    }
    if (!selectedFile) {
      toast.error("Please upload a banner image");
      return;
    }

    setUploadingImage(true);
    const uploadResult = await uploadImage(selectedFile, "banner");
    setUploadingImage(false);

    if (!uploadResult.ok) {
      toast.error(uploadResult.error);
      return;
    }
    const imageUrl = uploadResult.url;

    const payload = {
      title,
      subheading: formData.subheading.trim() || null,
      description: formData.description.trim() || null,
      image_url: imageUrl,
      link_type: formData.link_type,
      link_url:
        formData.link_type === "url" ? formData.link_url.trim() || null : null,
      link_id:
        formData.link_type === "category" && formData.link_id
          ? Number(formData.link_id)
          : null,
      screen_location: formData.screen_location.trim() || null,
      banner_type: formData.banner_type,
      is_active: formData.is_active,
    };

    const ok = await createBanner(payload);
    if (!ok) {
      toast.error("Failed to create banner");
      return;
    }

    toast.success("Banner created successfully");
    handleClose();
  };

  return (
    <Dialog open={isOpen} onOpenChange={(open) => !open && handleClose()}>
      <DialogContent
        className="max-w-[600px] max-h-[90vh] overflow-y-auto"
        showCloseButton={false}
      >
        <DialogHeader className="relative pb-4">
          <DialogTitle className="text-2xl font-bold text-[#101928] mb-2">
            Create New Banner
          </DialogTitle>
          <DialogDescription className="text-[#667085] text-base font-normal">
            Add a promotional banner with link and placement options
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

        <form
          id="create-banner-form"
          onSubmit={handleSubmit}
          className="space-y-5"
        >
          <div className="space-y-2">
            <Label htmlFor="title" className="text-[#101928] font-medium">
              Title <span className="text-red-500">*</span>
            </Label>
            <Input
              id="title"
              placeholder="e.g. Staging Launch"
              value={formData.title}
              onChange={(e) =>
                setFormData((prev) => ({ ...prev, title: e.target.value }))
              }
              className="focus-visible:ring-0 h-[48px]"
              required
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="subheading" className="text-[#101928] font-medium">
              Subheading
            </Label>
            <Input
              id="subheading"
              placeholder="e.g. Welcome to the new dashboard"
              value={formData.subheading}
              onChange={(e) =>
                setFormData((prev) => ({ ...prev, subheading: e.target.value }))
              }
              className="focus-visible:ring-0 h-[48px]"
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="description" className="text-[#101928] font-medium">
              Description
            </Label>
            <textarea
              id="description"
              placeholder="Optional description"
              value={formData.description}
              onChange={(e) =>
                setFormData((prev) => ({
                  ...prev,
                  description: e.target.value,
                }))
              }
              className="w-full min-h-[80px] rounded-md border border-input bg-transparent px-3 py-2 text-sm shadow-xs transition-[color,box-shadow] outline-none focus-visible:ring-0 focus-visible:border-ring resize-none"
            />
          </div>

          <div className="space-y-2">
            <Label className="text-[#101928] font-medium">
              Banner image <span className="text-red-500">*</span>
            </Label>
            <div
              onDrop={handleDrop}
              onDragOver={(e) => {
                e.preventDefault();
                setIsDragging(true);
              }}
              onDragLeave={() => setIsDragging(false)}
              className={`border-2 border-dashed rounded-lg p-6 text-center transition-colors ${
                isDragging
                  ? "border-primary bg-primary/5"
                  : "border-neutral-200 bg-neutral-50"
              }`}
            >
              <input
                type="file"
                accept="image/png,image/jpeg,image/jpg,image/webp"
                onChange={handleFileInput}
                className="hidden"
                id="banner-file-upload"
                ref={fileInputRef}
              />
              <label
                htmlFor="banner-file-upload"
                className="cursor-pointer flex flex-col items-center gap-3"
              >
                {previewUrl ? (
                  <div className="w-full">
                    <div className="relative mx-auto w-full max-w-[320px]">
                      <div className="relative w-full aspect-[2/1] rounded-md border border-neutral-200 overflow-hidden bg-neutral-100">
                        <Image
                          src={previewUrl}
                          alt="Banner preview"
                          fill
                          sizes="320px"
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
                        className="absolute -top-2 -right-2 size-8 rounded-full bg-white border border-neutral-200 flex items-center justify-center shadow-sm hover:bg-neutral-50"
                        aria-label="Remove image"
                      >
                        <X size={16} color="#0B1E66" />
                      </button>
                    </div>
                  </div>
                ) : (
                  <Upload className="size-12 text-[#1F3A78]" />
                )}
                <div>
                  <p className="font-medium text-[#101928]">
                    {selectedFile
                      ? selectedFile.name
                      : "Click or drag image to upload"}
                  </p>
                  <p className="text-sm text-[#667085] mt-0.5">
                    PNG, JPG or WebP
                  </p>
                </div>
              </label>
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="link_type" className="text-[#101928] font-medium">
                Link type
              </Label>
              <Select
                value={formData.link_type}
                onValueChange={(value: "url" | "category") =>
                  setFormData((prev) => ({
                    ...prev,
                    link_type: value,
                    link_url: value === "url" ? prev.link_url : "",
                    link_id: value === "category" ? prev.link_id : "",
                  }))
                }
              >
                <SelectTrigger
                  id="link_type"
                  className="w-full focus-visible:ring-0 h-[48px]"
                >
                  <SelectValue placeholder="Link type" />
                </SelectTrigger>
                <SelectContent>
                  {LINK_TYPES.map(({ value, label }) => (
                    <SelectItem key={value} value={value}>
                      {label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            {formData.link_type === "url" ? (
              <div className="space-y-2">
                <Label
                  htmlFor="link_url"
                  className="text-[#101928] font-medium"
                >
                  Link URL
                </Label>
                <Input
                  id="link_url"
                  type="url"
                  placeholder="https://sujimoto.com"
                  value={formData.link_url}
                  onChange={(e) =>
                    setFormData((prev) => ({
                      ...prev,
                      link_url: e.target.value,
                    }))
                  }
                  className="focus-visible:ring-0 h-[48px]"
                />
              </div>
            ) : (
              <div className="space-y-2">
                <Label htmlFor="link_id" className="text-[#101928] font-medium">
                  Category ID
                </Label>
                <Input
                  id="link_id"
                  type="number"
                  placeholder="e.g. 1"
                  value={formData.link_id}
                  onChange={(e) =>
                    setFormData((prev) => ({
                      ...prev,
                      link_id: e.target.value,
                    }))
                  }
                  className="focus-visible:ring-0 h-[48px]"
                />
              </div>
            )}
          </div>

          <div className="space-y-2">
            <Label
              htmlFor="screen_location"
              className="text-[#101928] font-medium"
            >
              Screen location
            </Label>
            <Input
              id="screen_location"
              placeholder="e.g. Homepage"
              value={formData.screen_location}
              onChange={(e) =>
                setFormData((prev) => ({
                  ...prev,
                  screen_location: e.target.value,
                }))
              }
              className="focus-visible:ring-0 h-[48px]"
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="banner_type" className="text-[#101928] font-medium">
              Banner type
            </Label>
            <Select
              value={formData.banner_type}
              onValueChange={(value) =>
                setFormData((prev) => ({ ...prev, banner_type: value }))
              }
            >
              <SelectTrigger
                id="banner_type"
                className="w-full focus-visible:ring-0 h-[48px]"
              >
                <SelectValue placeholder="Select banner type" />
              </SelectTrigger>
              <SelectContent>
                {BANNER_TYPES.map((type) => (
                  <SelectItem key={type} value={type}>
                    {type}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <div className="flex items-center justify-between rounded-lg border border-input p-4">
            <Label htmlFor="is_active" className="text-[#101928] font-medium">
              Active
            </Label>
            <Switch
              id="is_active"
              checked={formData.is_active}
              onCheckedChange={(checked) =>
                setFormData((prev) => ({ ...prev, is_active: checked }))
              }
            />
          </div>

          <div className="pt-4">
            <Button
              type="submit"
              form="create-banner-form"
              className="bg-[#1F3A78] hover:bg-[#1F3A78]/90 text-white w-full h-[52px] text-base font-medium"
              disabled={creatingBanner || uploadingImage}
            >
              {uploadingImage
                ? "Uploading image…"
                : creatingBanner
                ? "Creating…"
                : "Create Banner"}
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
}
