/**
 * Helper functions untuk mengelola URL gambar dari API
 * Mendukung berbagai format URL dan storage paths
 */

/**
 * Interface untuk image options
 */
export interface ImageUrlOptions {
  quality?: number
  width?: number
  height?: number
  format?: 'jpg' | 'jpeg' | 'png' | 'gif' | 'webp'
  fit?: 'cover' | 'contain' | 'fill' | 'inside' | 'outside'
}

/**
 * Configuration untuk image service
 */
const IMAGE_CONFIG = {
  apiUrl: process.env.NEXT_PUBLIC_API_URL || 'https://api.parthamanunggal.com',
  storagePath: '/storage',
  tripPath: '/trip',
  defaultQuality: 80,
  defaultFormat: 'webp' as const,
  defaultFit: 'cover' as const
}

/**
 * Supported image formats
 */
export const SUPPORTED_IMAGE_FORMATS = [
  'jpg', 'jpeg', 'png', 'gif', 'webp', 'svg', 'bmp', 'tiff'
] as const

/**
 * Check apakah string adalah valid image filename
 */
export const isValidImageFilename = (filename: string): boolean => {
  if (!filename) return false
  
  const extension = filename.split('.').pop()?.toLowerCase()
  return extension ? SUPPORTED_IMAGE_FORMATS.includes(extension as typeof SUPPORTED_IMAGE_FORMATS[number]) : false
}

/**
 * Check apakah URL sudah absolute
 */
export const isAbsoluteUrl = (url: string): boolean => {
  return url.startsWith('http://') || url.startsWith('https://')
}

/**
 * Check apakah URL adalah storage path
 */
export const isStoragePath = (url: string): boolean => {
  return url.includes('/storage/') || url.startsWith('storage/')
}

/**
 * Check apakah URL adalah trip image
 */
export const isTripImage = (url: string): boolean => {
  return url.includes('/trip/') || url.startsWith('trip/')
}

/**
 * Normalize URL path
 */
const normalizePath = (path: string): string => {
  // Remove leading slash
  let normalized = path.startsWith('/') ? path.slice(1) : path
  
  // Remove trailing slash
  normalized = normalized.endsWith('/') ? normalized.slice(0, -1) : normalized
  
  return normalized
}

/**
 * Build storage URL
 */
const buildStorageUrl = (path: string): string => {
  const normalizedPath = normalizePath(path)
  return `${IMAGE_CONFIG.apiUrl}/${IMAGE_CONFIG.storagePath}/${normalizedPath}`
}

/**
 * Build trip image URL
 */
const buildTripImageUrl = (filename: string): string => {
  if (!isValidImageFilename(filename)) {
    console.warn(`Invalid image filename: ${filename}`)
    return ''
  }
  
  return `${IMAGE_CONFIG.apiUrl}${IMAGE_CONFIG.storagePath}${IMAGE_CONFIG.tripPath}/${filename}`
}

/**
 * Main function untuk mendapatkan full image URL dari API
 */
export function getImageUrl(url: string): string {
  if (!url) return ''

  // Jika URL sudah absolute dan valid, gunakan langsung
  if (isAbsoluteUrl(url)) {
    return url
  }

  // Jika URL adalah nama file saja (misal: 1753969394_cover-login.jpg)
  if (isValidImageFilename(url) && !url.includes('/')) {
    return buildTripImageUrl(url)
  }

  // Jika URL sudah mengandung /storage/trip/ di awal
  if (url.startsWith('/storage/trip/')) {
    return `${IMAGE_CONFIG.apiUrl}${url}`
  }

  // Jika URL sudah mengandung storage/trip/ tanpa slash di awal
  if (url.startsWith('storage/trip/')) {
    return `${IMAGE_CONFIG.apiUrl}/${url}`
  }

  // Jika URL adalah storage path lainnya
  if (isStoragePath(url)) {
    return buildStorageUrl(url)
  }

  // Fallback: gunakan API_URL dan normalize path
  const cleanUrl = normalizePath(url)
  return `${IMAGE_CONFIG.apiUrl}/${cleanUrl}`
}

/**
 * Get image URL dengan query parameters untuk optimization
 */
export function getOptimizedImageUrl(
  url: string, 
  options: ImageUrlOptions = {}
): string {
  const baseUrl = getImageUrl(url)
  if (!baseUrl) return ''

  const {
    quality = IMAGE_CONFIG.defaultQuality,
    width,
    height,
    format = IMAGE_CONFIG.defaultFormat,
    fit = IMAGE_CONFIG.defaultFit
  } = options

  const params = new URLSearchParams()

  if (quality !== IMAGE_CONFIG.defaultQuality) {
    params.append('q', quality.toString())
  }

  if (width) {
    params.append('w', width.toString())
  }

  if (height) {
    params.append('h', height.toString())
  }

  if (format !== IMAGE_CONFIG.defaultFormat) {
    params.append('f', format)
  }

  if (fit !== IMAGE_CONFIG.defaultFit) {
    params.append('fit', fit)
  }

  const queryString = params.toString()
  return queryString ? `${baseUrl}?${queryString}` : baseUrl
}

/**
 * Get thumbnail URL untuk image
 */
export function getThumbnailUrl(
  url: string, 
  size: number = 150
): string {
  return getOptimizedImageUrl(url, {
    width: size,
    height: size,
    fit: 'cover',
    quality: 70
  })
}

/**
 * Get preview URL untuk image (medium size)
 */
export function getPreviewUrl(
  url: string, 
  width: number = 400
): string {
  return getOptimizedImageUrl(url, {
    width,
    fit: 'inside',
    quality: 80
  })
}

/**
 * Get full size image URL
 */
export function getFullSizeImageUrl(url: string): string {
  return getImageUrl(url)
}

/**
 * Check apakah image URL valid
 */
export const isValidImageUrl = (url: string): boolean => {
  if (!url) return false
  
  try {
    const imageUrl = getImageUrl(url)
    return imageUrl.length > 0
  } catch {
    return false
  }
}

/**
 * Extract filename dari image URL
 */
export const extractFilenameFromUrl = (url: string): string => {
  if (!url) return ''
  
  try {
    const urlObj = new URL(url)
    const pathname = urlObj.pathname
    return pathname.split('/').pop() || ''
  } catch {
    // Fallback untuk relative URLs
    return url.split('/').pop() || ''
  }
}

/**
 * Get image extension dari URL
 */
export const getImageExtension = (url: string): string => {
  const filename = extractFilenameFromUrl(url)
  return filename.split('.').pop()?.toLowerCase() || ''
}

/**
 * Check apakah image adalah webp format
 */
export const isWebPImage = (url: string): boolean => {
  return getImageExtension(url) === 'webp'
}

/**
 * Check apakah image adalah SVG format
 */
export const isSvgImage = (url: string): boolean => {
  return getImageExtension(url) === 'svg'
}

/**
 * Get placeholder image URL
 */
export function getPlaceholderImageUrl(
  width: number = 300,
  height: number = 200,
  text?: string
): string {
  const params = new URLSearchParams({
    w: width.toString(),
    h: height.toString(),
    bg: 'f0f0f0',
    fg: '666666',
    text: text || `${width}x${height}`
  })
  
  return `https://via.placeholder.com/${width}x${height}?${params.toString()}`
}

// Export default function
export default getImageUrl
