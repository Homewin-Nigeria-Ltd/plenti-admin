"use client";

import { Label } from "@/components/ui/label";
import { Upload, X } from "lucide-react";
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
};

export function ProductImagesField({
  existingUrls = [],
  selectedPreviews,
  onFilesChosen,
  onRemoveExisting,
  onRemoveSelected,
  inputId,
  fileInputRef,
}: ProductImagesFieldProps) {
  const [isDragging, setIsDragging] = React.useState(false);
  const hasImages = existingUrls.length > 0 || selectedPreviews.length > 0;

  return (
    <div className="space-y-2">
      <Label>Upload Product Images</Label>
      {hasImages ? (
        <div className="grid grid-cols-3 sm:grid-cols-4 gap-2">
          {existingUrls.map((url) => (
            <div
              key={url}
              className="relative aspect-square rounded-md border border-neutral-200 overflow-hidden bg-neutral-100"
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
                  className="absolute top-1 right-1 size-6 rounded-full bg-white border border-neutral-200 flex items-center justify-center shadow-sm"
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
              className="relative aspect-square rounded-md border border-neutral-200 overflow-hidden bg-neutral-100"
            >
              <Image
                src={url}
                alt="Selected product"
                fill
                sizes="120px"
                className="object-cover"
                unoptimized
              />
              <button
                type="button"
                onClick={() => onRemoveSelected(index)}
                className="absolute top-1 right-1 size-6 rounded-full bg-white border border-neutral-200 flex items-center justify-center shadow-sm"
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
        className={`border-2 border-dashed rounded-lg p-6 text-center transition-colors ${
          isDragging
            ? "border-primary bg-primary/5"
            : "border-neutral-200 bg-neutral-50"
        }`}
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
          className="cursor-pointer flex flex-col items-center gap-2"
        >
          <Upload className="size-10 text-primary" />
          <p className="font-medium text-primary">
            {hasImages ? "Add more images" : "Upload images"}
          </p>
          <p className="text-sm text-neutral-500">
            Click or drag PNG/JPG files. You can select multiple.
          </p>
        </label>
      </div>
    </div>
  );
}
