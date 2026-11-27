"use client";

import { Label } from "@/components/ui/label";
import { cn } from "@/lib/utils";
import { ImageIcon, Upload, X } from "lucide-react";
import Image from "next/image";
import * as React from "react";

type ProductImagesFieldProps = {
  existingUrls?: string[];
  selectedPreviews: string[];
  onFilesChosen: (files: FileList | File[]) => void;
  onRemoveExisting?: (url: string) => void;
  onRemoveSelected: (index: number) => void;
  inputId: string;
  fileInputRef: React.RefObject<HTMLInputElement | null>;
  variant?: "default" | "cover";
};

export function ProductImagesField({
  existingUrls = [],
  selectedPreviews,
  onFilesChosen,
  onRemoveExisting,
  onRemoveSelected,
  inputId,
  fileInputRef,
  variant = "default",
}: ProductImagesFieldProps) {
  const [isDragging, setIsDragging] = React.useState(false);
  const hasImages = existingUrls.length > 0 || selectedPreviews.length > 0;
  const isCover = variant === "cover";

  return (
    <div className="space-y-2">
      {isCover ? null : <Label>Upload Product Images</Label>}
      {hasImages ? (
        <div className="grid grid-cols-3 gap-2 sm:grid-cols-4">
          {existingUrls.map((url) => (
            <div
              key={url}
              className="relative aspect-square overflow-hidden rounded-md border border-neutral-200 bg-neutral-100"
            >
              <Image
                src={url}
                alt="Product"
                fill
                sizes="120px"
                className="object-cover"
                unoptimized
              />
              {onRemoveExisting ? (
                <button
                  type="button"
                  onClick={() => onRemoveExisting(url)}
                  className="absolute top-1 right-1 flex size-6 items-center justify-center rounded-full border border-neutral-200 bg-white shadow-sm"
                  aria-label="Remove image"
                >
                  <X size={12} color="#0B1E66" />
                </button>
              ) : null}
            </div>
          ))}
          {selectedPreviews.map((url, index) => (
            <div
              key={`${url}-${index}`}
              className="relative aspect-square overflow-hidden rounded-md border border-neutral-200 bg-neutral-100"
            >
              <Image
                src={url}
                alt="Selected product"
                fill
                sizes="120px"
                className="object-cover"
                unoptimized
              />
              {index === 0 && isCover ? (
                <span className="absolute bottom-1 left-1 rounded bg-black/70 px-1.5 py-0.5 text-[10px] font-medium text-white">
                  Cover
                </span>
              ) : null}
              <button
                type="button"
                onClick={() => onRemoveSelected(index)}
                className="absolute top-1 right-1 flex size-6 items-center justify-center rounded-full border border-neutral-200 bg-white shadow-sm"
                aria-label="Remove selected image"
              >
                <X size={12} color="#0B1E66" />
              </button>
            </div>
          ))}
        </div>
      ) : null}
      <div
        onDrop={(e) => {
          e.preventDefault();
          setIsDragging(false);
          onFilesChosen(e.dataTransfer.files);
        }}
        onDragOver={(e) => {
          e.preventDefault();
          setIsDragging(true);
        }}
        onDragLeave={() => setIsDragging(false)}
        className={cn(
          "rounded-xl border-2 border-dashed p-6 text-center transition-colors",
          isDragging
            ? "border-primary bg-primary/5"
            : isCover
              ? "border-[#D0D5DD] bg-[#F8FAFC]"
              : "border-neutral-200 bg-neutral-50",
        )}
      >
        <input
          ref={fileInputRef}
          type="file"
          accept="image/png,image/jpeg,image/jpg"
          multiple
          onChange={(e) => {
            if (e.target.files?.length) onFilesChosen(e.target.files);
          }}
          className="hidden"
          id={inputId}
        />
        <label
          htmlFor={inputId}
          className="flex cursor-pointer flex-col items-center gap-2"
        >
          {isCover ? (
            <ImageIcon className="size-8 text-[#98A2B3]" />
          ) : (
            <Upload className="size-10 text-primary" />
          )}
          <p
            className={cn(
              "font-medium",
              isCover ? "text-sm text-[#344054]" : "text-primary",
            )}
          >
            {hasImages
              ? "Add more images"
              : isCover
                ? "Drag photos here or browse"
                : "Upload images"}
          </p>
          <p className="text-xs text-[#98A2B3]">
            {isCover
              ? "JPG or PNG. Square crops with a plain background work best."
              : "Click or drag PNG/JPG files. You can select multiple."}
          </p>
        </label>
      </div>
    </div>
  );
}
