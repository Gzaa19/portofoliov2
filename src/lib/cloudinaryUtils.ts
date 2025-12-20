/**
 * Client-safe Cloudinary utility functions
 * These functions only manipulate URLs and don't require the Cloudinary SDK
 */

/**
 * Convert Cloudinary URL to downloadable URL via proxy API
 * This avoids issues with Cloudinary raw files that don't support fl_attachment
 * 
 * For Cloudinary URLs, we route through our API proxy that sets proper Content-Disposition headers
 * For non-Cloudinary URLs, we return the original URL
 * 
 * @param cloudinaryUrl - The original Cloudinary URL
 * @param filename - Optional filename for the downloaded file
 * @returns Download URL that properly triggers file download
 */
export function getDownloadUrl(cloudinaryUrl: string, filename?: string): string {
    if (!cloudinaryUrl) {
        return cloudinaryUrl;
    }

    // If it's a Cloudinary URL, use our proxy API
    if (cloudinaryUrl.includes('cloudinary.com')) {
        const params = new URLSearchParams({
            url: cloudinaryUrl,
            ...(filename && { filename }),
        });
        return `/api/download?${params.toString()}`;
    }

    // For local files or other URLs, return as-is
    return cloudinaryUrl;
}

/**
 * Get original Cloudinary URL (without proxy)
 * Use this when you need to display/preview the file, not download it
 */
export function getPreviewUrl(cloudinaryUrl: string): string {
    return cloudinaryUrl;
}
