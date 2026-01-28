import * as React from "react";

/**
 * Creates a `blob:` preview URL for a selected File and revokes it on cleanup.
 */
export function useFilePreview(file: File | null): string | null {
  const [previewUrl, setPreviewUrl] = React.useState<string | null>(null);

  React.useEffect(() => {
    if (!file) {
      setPreviewUrl(null);
      return;
    }

    const url = URL.createObjectURL(file);
    setPreviewUrl(url);

    return () => {
      URL.revokeObjectURL(url);
    };
  }, [file]);

  return previewUrl;
}
