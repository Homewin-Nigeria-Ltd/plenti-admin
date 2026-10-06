"use client";

import * as React from "react";
import Cropper, { type Area } from "react-easy-crop";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { getCroppedImageFile, PRODUCT_IMAGE_CROP_SIZE } from "@/lib/cropImage";

type ImageCropDialogProps = {
  isOpen: boolean;
  imageSrc: string | null;
  onClose: () => void;
  onApply: (file: File) => void;
  aspect?: number;
  title?: string;
};

export function ImageCropDialog({
  isOpen,
  imageSrc,
  onClose,
  onApply,
  aspect = 1,
  title = "Crop Image",
}: ImageCropDialogProps) {
  const [crop, setCrop] = React.useState({ x: 0, y: 0 });
  const [zoom, setZoom] = React.useState(1);
  const [croppedAreaPixels, setCroppedAreaPixels] = React.useState<Area | null>(null);
  const [isApplying, setIsApplying] = React.useState(false);

  React.useEffect(() => {
    if (!isOpen) {
      setCrop({ x: 0, y: 0 });
      setZoom(1);
      setCroppedAreaPixels(null);
      setIsApplying(false);
    }
  }, [isOpen]);

  const handleApply = async () => {
    if (!imageSrc || !croppedAreaPixels) return;
    setIsApplying(true);
    try {
      const cropped = await getCroppedImageFile(
        imageSrc,
        croppedAreaPixels,
        "product-image.jpg",
        { width: PRODUCT_IMAGE_CROP_SIZE, height: PRODUCT_IMAGE_CROP_SIZE },
      );
      onApply(cropped);
    } finally {
      setIsApplying(false);
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={(open) => !open && onClose()}>
      <DialogContent
        className="max-h-[90vh] flex flex-col p-0 w-[95vw] max-w-[640px] sm:w-[640px] sm:max-w-[640px]"
        showCloseButton={false}
      >
        <DialogHeader className="px-4 sm:px-6 pt-4 sm:pt-6 pb-4 border-b border-neutral-100">
          <DialogTitle className="text-xl sm:text-2xl font-semibold">{title}</DialogTitle>
          <DialogDescription className="text-xs sm:text-sm text-neutral-500">
            Crop area and exported image are fixed at {PRODUCT_IMAGE_CROP_SIZE}×
            {PRODUCT_IMAGE_CROP_SIZE}px.
          </DialogDescription>
        </DialogHeader>

        <div className="flex-1 overflow-y-auto px-4 sm:px-6 py-4 space-y-4">
          <div className="relative h-[320px] w-full rounded-lg overflow-hidden bg-neutral-900">
            {imageSrc ? (
              <Cropper
                image={imageSrc}
                crop={crop}
                zoom={zoom}
                aspect={aspect}
                cropSize={{
                  width: PRODUCT_IMAGE_CROP_SIZE,
                  height: PRODUCT_IMAGE_CROP_SIZE,
                }}
                onCropChange={setCrop}
                onZoomChange={setZoom}
                onCropComplete={(_, areaPixels) => setCroppedAreaPixels(areaPixels)}
              />
            ) : null}
          </div>

          <div className="space-y-2">
            <label htmlFor="crop-zoom" className="text-sm font-medium text-primary">
              Zoom
            </label>
            <input
              id="crop-zoom"
              type="range"
              min={1}
              max={3}
              step={0.1}
              value={zoom}
              onChange={(e) => setZoom(Number(e.target.value))}
              className="w-full"
            />
          </div>
        </div>

        <div className="px-4 sm:px-6 py-4 border-t border-neutral-100 grid grid-cols-2 gap-3">
          <Button type="button" variant="outline" onClick={onClose} disabled={isApplying}>
            Cancel
          </Button>
          <Button type="button" onClick={handleApply} disabled={isApplying || !imageSrc}>
            {isApplying ? "Applying..." : "Apply Crop"}
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
}
