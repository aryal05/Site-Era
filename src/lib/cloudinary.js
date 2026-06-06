/**
 * Cloudinary Utility Functions
 * Helper functions for working with Cloudinary images
 */

/**
 * Get optimized image URL from Cloudinary
 * @param {string} url - Original Cloudinary URL
 * @param {object} options - Transformation options
 * @returns {string} - Transformed URL
 */
export function getOptimizedImageUrl(url, options = {}) {
  if (!url || !url.includes("cloudinary.com")) {
    return url; // Return original if not a Cloudinary URL
  }

  const {
    width,
    height,
    crop = "fill",
    quality = "auto",
    format = "auto",
    gravity = "auto",
  } = options;

  // Extract parts of the URL
  const parts = url.split("/upload/");
  if (parts.length !== 2) return url;

  // Build transformation string
  const transformations = [];

  if (width) transformations.push(`w_${width}`);
  if (height) transformations.push(`h_${height}`);
  if (crop) transformations.push(`c_${crop}`);
  if (quality) transformations.push(`q_${quality}`);
  if (format) transformations.push(`f_${format}`);
  if (gravity) transformations.push(`g_${gravity}`);

  const transformString = transformations.join(",");

  return `${parts[0]}/upload/${transformString}/${parts[1]}`;
}

/**
 * Get thumbnail URL from Cloudinary image
 * @param {string} url - Original Cloudinary URL
 * @param {number} size - Thumbnail size (default: 200)
 * @returns {string} - Thumbnail URL
 */
export function getThumbnailUrl(url, size = 200) {
  return getOptimizedImageUrl(url, {
    width: size,
    height: size,
    crop: "fill",
    quality: "auto",
    format: "auto",
  });
}

/**
 * Get responsive image srcset for Cloudinary
 * @param {string} url - Original Cloudinary URL
 * @param {array} sizes - Array of widths [640, 768, 1024, 1280]
 * @returns {string} - srcset string
 */
export function getResponsiveSrcSet(url, sizes = [640, 768, 1024, 1280, 1920]) {
  if (!url || !url.includes("cloudinary.com")) {
    return "";
  }

  return sizes
    .map((size) => {
      const optimizedUrl = getOptimizedImageUrl(url, {
        width: size,
        quality: "auto",
        format: "auto",
      });
      return `${optimizedUrl} ${size}w`;
    })
    .join(", ");
}

/**
 * Extract public ID from Cloudinary URL
 * @param {string} url - Cloudinary URL
 * @returns {string} - Public ID
 */
export function getPublicIdFromUrl(url) {
  if (!url || !url.includes("cloudinary.com")) {
    return null;
  }

  const parts = url.split("/upload/");
  if (parts.length !== 2) return null;

  // Remove transformations if present
  const pathParts = parts[1].split("/");
  const filenameParts = pathParts[pathParts.length - 1].split(".");
  filenameParts.pop(); // Remove extension

  return [...pathParts.slice(0, -1), filenameParts.join(".")].join("/");
}

/**
 * Delete image from Cloudinary
 * Note: This requires an API endpoint with admin credentials
 * @param {string} publicId - Cloudinary public ID
 * @returns {Promise} - Deletion result
 */
export async function deleteImage(publicId) {
  try {
    const response = await fetch("/api/upload/delete", {
      method: "DELETE",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ publicId }),
    });

    if (!response.ok) {
      throw new Error("Failed to delete image");
    }

    return await response.json();
  } catch (error) {
    console.error("Delete image error:", error);
    throw error;
  }
}

/**
 * Upload image to Cloudinary
 * @param {File} file - Image file to upload
 * @param {object} options - Upload options
 * @returns {Promise<object>} - Upload result with URL
 */
export async function uploadImage(file, options = {}) {
  const formData = new FormData();
  formData.append("file", file);

  if (options.folder) {
    formData.append("folder", options.folder);
  }

  try {
    const response = await fetch("/api/upload", {
      method: "POST",
      body: formData,
    });

    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(errorData.error || "Upload failed");
    }

    return await response.json();
  } catch (error) {
    console.error("Upload image error:", error);
    throw error;
  }
}

/**
 * Validate image file before upload
 * @param {File} file - File to validate
 * @param {object} options - Validation options
 * @returns {object} - { valid: boolean, error: string }
 */
export function validateImageFile(
  file,
  options = { maxSize: 10, allowedTypes: ["image/jpeg", "image/png", "image/gif", "image/webp"] },
) {
  if (!file) {
    return { valid: false, error: "No file provided" };
  }

  if (!options.allowedTypes.includes(file.type)) {
    return {
      valid: false,
      error: `Invalid file type. Allowed: ${options.allowedTypes.join(", ")}`,
    };
  }

  const maxSizeBytes = options.maxSize * 1024 * 1024;
  if (file.size > maxSizeBytes) {
    return {
      valid: false,
      error: `File too large. Maximum size: ${options.maxSize}MB`,
    };
  }

  return { valid: true };
}

/**
 * Get blur placeholder for image loading
 * @param {string} url - Cloudinary URL
 * @returns {string} - Blurred placeholder URL
 */
export function getBlurPlaceholder(url) {
  return getOptimizedImageUrl(url, {
    width: 20,
    quality: 1,
    format: "auto",
    effect: "blur:1000",
  });
}
