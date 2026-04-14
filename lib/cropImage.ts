export type PixelCropArea = {
  x: number;
  y: number;
  width: number;
  height: number;
};

function createImageElement(src: string): Promise<HTMLImageElement> {
  return new Promise((resolve, reject) => {
    const img = new Image();
    img.addEventListener("load", () => resolve(img));
    img.addEventListener("error", () => reject(new Error("Failed to load image for cropping")));
    img.src = src;
  });
}

export const PRODUCT_IMAGE_CROP_SIZE = 124;

export type CroppedImageOutputOptions = {
  width: number;
  height: number;
};

export async function getCroppedImageFile(
  imageSrc: string,
  crop: PixelCropArea,
  fileName = "cropped-image.jpg",
  output?: CroppedImageOutputOptions,
): Promise<File> {
  const image = await createImageElement(imageSrc);
  const canvas = document.createElement("canvas");
  const outW = output?.width ?? crop.width;
  const outH = output?.height ?? crop.height;
  canvas.width = outW;
  canvas.height = outH;

  const ctx = canvas.getContext("2d");
  if (!ctx) {
    throw new Error("Unable to crop image");
  }

  ctx.imageSmoothingEnabled = true;
  ctx.imageSmoothingQuality = "high";

  ctx.drawImage(
    image,
    crop.x,
    crop.y,
    crop.width,
    crop.height,
    0,
    0,
    outW,
    outH,
  );

  const blob: Blob = await new Promise((resolve, reject) => {
    canvas.toBlob(
      (result) => {
        if (!result) {
          reject(new Error("Unable to create cropped image"));
          return;
        }
        resolve(result);
      },
      "image/jpeg",
      0.92,
    );
  });

  return new File([blob], fileName, { type: "image/jpeg" });
}
