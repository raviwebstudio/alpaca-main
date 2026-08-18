/**
 * Utility functions for product image resolution, fallback handling,
 * and automatic cache-busting for updated/replaced images.
 */

// Known legacy file mapping fixes
const IMAGE_REPLACEMENTS: Record<string, string> = {
  "/products/media/plain-white-t-shirt01.jpg": "/products/media/plain-white-t-shirt01.webp",
};

export function getOptimizedImageUrl(src?: string | null, version?: string | number): string {
  if (!src || typeof src !== "string" || src.trim() === "") {
    return "/products/media/plain-white-t-shirt01.webp";
  }

  let cleanSrc = src.trim();

  // Normalize path if it contains leading 'public/'
  if (cleanSrc.startsWith("public/")) {
    cleanSrc = "/" + cleanSrc.slice(7);
  } else if (cleanSrc.startsWith("./public/")) {
    cleanSrc = "/" + cleanSrc.slice(9);
  }

  // External, data, or blob URLs are returned as-is
  if (
    cleanSrc.startsWith("http://") ||
    cleanSrc.startsWith("https://") ||
    cleanSrc.startsWith("data:") ||
    cleanSrc.startsWith("blob:")
  ) {
    return cleanSrc;
  }

  // Ensure leading slash for local relative paths
  if (!cleanSrc.startsWith("/")) {
    cleanSrc = "/" + cleanSrc;
  }

  // Automatic legacy path migration from /inventory/ to /products/media/
  if (cleanSrc.startsWith("/inventory/men/tshirts/")) {
    cleanSrc = "/products/media/" + cleanSrc.slice("/inventory/men/tshirts/".length);
  } else if (cleanSrc.startsWith("/inventory/")) {
    cleanSrc = "/products/media/" + cleanSrc.slice("/inventory/".length);
  }

  // If known legacy path that had extension difference
  const mappedSrc = IMAGE_REPLACEMENTS[cleanSrc] || cleanSrc;

  return mappedSrc;
}
