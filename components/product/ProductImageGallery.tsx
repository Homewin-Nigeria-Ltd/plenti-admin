"use client";

import type { Product } from "@/data/products";
import { productDisplayImages } from "@/lib/mappers/products";
import { ChevronLeft, ChevronRight } from "lucide-react";
import Image from "next/image";
import * as React from "react";

type ProductImageGalleryProps = {
  product: Product;
};

export function ProductImageGallery({ product }: ProductImageGalleryProps) {
  const urls = productDisplayImages(product);
  const [index, setIndex] = React.useState(0);
  const productId = product.id;

  React.useEffect(() => {
    setIndex(0);
  }, [productId]);

  if (urls.length === 0) {
    return <div className="w-full h-48 bg-neutral-100" />;
  }

  const safeIndex = Math.min(index, urls.length - 1);
  const current = urls[safeIndex] ?? urls[0];
  const hasMany = urls.length > 1;

  const go = (next: number) => {
    setIndex((next + urls.length) % urls.length);
  };

  return (
    <div className="w-full h-48 bg-neutral-100 relative overflow-hidden group">
      <Image
        src={current}
        alt={product.name}
        fill
        className="object-cover"
        unoptimized
      />
      {hasMany ? (
        <>
          <button
            type="button"
            aria-label="Previous image"
            onClick={(event) => {
              event.stopPropagation();
              go(safeIndex - 1);
            }}
            className="absolute left-2 top-1/2 -translate-y-1/2 size-7 rounded-full bg-white/90 text-[#0B1E66] flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity z-[1]"
          >
            <ChevronLeft className="size-4" />
          </button>
          <button
            type="button"
            aria-label="Next image"
            onClick={(event) => {
              event.stopPropagation();
              go(safeIndex + 1);
            }}
            className="absolute right-2 top-1/2 -translate-y-1/2 size-7 rounded-full bg-white/90 text-[#0B1E66] flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity z-[1]"
          >
            <ChevronRight className="size-4" />
          </button>
          <div className="absolute bottom-2 left-0 right-0 flex justify-center gap-1 z-[1]">
            {urls.map((url, i) => (
              <button
                key={`${url}-${i}`}
                type="button"
                aria-label={`Show image ${i + 1}`}
                onClick={(event) => {
                  event.stopPropagation();
                  setIndex(i);
                }}
                className={`size-1.5 rounded-full ${
                  i === safeIndex ? "bg-white" : "bg-white/50"
                }`}
              />
            ))}
          </div>
        </>
      ) : null}
    </div>
  );
}
