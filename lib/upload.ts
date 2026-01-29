/**
 * Uploads an image to the backend via /api/upload/image.
 * Returns the public URL on success, or an error message on failure.
 */
export type UploadImageResult =
  | { ok: true; url: string }
  | { ok: false; error: string };

export async function uploadImage(
  file: File,
  folder: string = "product"
): Promise<UploadImageResult> {
  const formData = new FormData();
  formData.set("image", file);
  formData.set("folder", folder);

  const res = await fetch("/api/upload/image", {
    method: "POST",
    body: formData,
  });

  const json = (await res.json().catch(() => null)) as unknown;

  if (!res.ok) {
    const message =
      json &&
      typeof json === "object" &&
      "message" in json &&
      typeof (json as Record<string, unknown>).message === "string"
        ? String((json as Record<string, unknown>).message)
        : "Image upload failed";
    return { ok: false, error: message };
  }

  if (!json || typeof json !== "object") {
    return { ok: false, error: "Image upload failed: invalid response" };
  }
  const data = (json as Record<string, unknown>).data;
  if (!data || typeof data !== "object") {
    return { ok: false, error: "Image upload failed: missing image URL" };
  }
  const url = (data as Record<string, unknown>).url;
  if (typeof url !== "string") {
    return { ok: false, error: "Image upload failed: missing image URL" };
  }

  return { ok: true, url };
}
