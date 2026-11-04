import * as React from "react";
import { toast } from "sonner";

export function useImageCropQueue(onCropped: (file: File) => void) {
  const [cropImageSrc, setCropImageSrc] = React.useState<string | null>(null);
  const [isCropOpen, setIsCropOpen] = React.useState(false);
  const queueRef = React.useRef<File[]>([]);
  const busyRef = React.useRef(false);
  const fileInputRef = React.useRef<HTMLInputElement | null>(null);
  const onCroppedRef = React.useRef(onCropped);
  onCroppedRef.current = onCropped;

  const startNext = React.useCallback(() => {
    const next = queueRef.current.shift();
    if (!next) {
      busyRef.current = false;
      setIsCropOpen(false);
      setCropImageSrc(null);
      if (fileInputRef.current) fileInputRef.current.value = "";
      return;
    }

    const reader = new FileReader();
    reader.onload = () => {
      const dataUrl = typeof reader.result === "string" ? reader.result : null;
      if (!dataUrl) {
        toast.error("Failed to read selected image");
        startNext();
        return;
      }
      setCropImageSrc(dataUrl);
      setIsCropOpen(true);
    };
    reader.onerror = () => {
      toast.error("Failed to read selected image");
      startNext();
    };
    reader.readAsDataURL(next);
  }, []);

  const enqueue = React.useCallback(
    (files: FileList | File[]) => {
      const images = Array.from(files).filter((file) =>
        file.type.startsWith("image/"),
      );
      if (images.length === 0) {
        toast.error("Please select a valid image (PNG/JPG).");
        return;
      }
      queueRef.current.push(...images);
      if (!busyRef.current) {
        busyRef.current = true;
        startNext();
      }
    },
    [startNext],
  );

  const handleApply = React.useCallback(
    (file: File) => {
      onCroppedRef.current(file);
      startNext();
    },
    [startNext],
  );

  const resetQueue = React.useCallback(() => {
    queueRef.current = [];
    busyRef.current = false;
    setIsCropOpen(false);
    setCropImageSrc(null);
    if (fileInputRef.current) fileInputRef.current.value = "";
  }, []);

  return {
    cropImageSrc,
    isCropOpen,
    fileInputRef,
    enqueue,
    handleApply,
    resetQueue,
  };
}
