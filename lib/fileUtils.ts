/**
 * Formats a byte count as a human-readable size (e.g. "1.5MB", "256kB").
 */
export function formatFileSize(bytes: number): string {
  if (bytes < 1024) return bytes + "B";
  if (bytes < 1024 * 1024) return (bytes / 1024).toFixed(0) + "kB";
  return (bytes / (1024 * 1024)).toFixed(2) + "MB";
}

/**
 * Opens a File in a new browser tab (for images/PDFs the browser can display).
 */
export function openFileInNewTab(file: File): void {
  const url = URL.createObjectURL(file);
  window.open(url, "_blank");
}

/**
 * Triggers a download of the given File using its name.
 */
export function downloadFile(file: File): void {
  const url = URL.createObjectURL(file);
  const a = document.createElement("a");
  a.href = url;
  a.download = file.name;
  document.body.appendChild(a);
  a.click();
  document.body.removeChild(a);
  URL.revokeObjectURL(url);
}

const DEFAULT_IMAGE_ACCEPT = "image/";
const DEFAULT_MAX_SIZE_BYTES = 5 * 1024 * 1024; // 5MB

export type FilterValidImageFilesOptions = {
  acceptPrefix?: string;
  maxSizeBytes?: number;
};

/**
 * Filters a list of files to those that are valid images under the size limit.
 * Returns only the valid files; caller can compare length to show a warning if some were rejected.
 */
export function filterValidImageFiles(
  files: File[],
  options?: FilterValidImageFilesOptions
): File[] {
  const acceptPrefix = options?.acceptPrefix ?? DEFAULT_IMAGE_ACCEPT;
  const maxSizeBytes = options?.maxSizeBytes ?? DEFAULT_MAX_SIZE_BYTES;

  return files.filter((file) => {
    const isValidType = file.type.startsWith(acceptPrefix);
    const isValidSize = file.size <= maxSizeBytes;
    return isValidType && isValidSize;
  });
}
