/**
 * Fallback request function menggunakan XMLHttpRequest dasar
 * untuk mengatasi masalah dengan Axios dan Fetch API
 */

/**
 * Interface untuk request options
 */
export interface FallbackRequestOptions {
  method: 'GET' | 'POST' | 'PUT' | 'DELETE' | 'PATCH'
  url: string
  baseUrl?: string
  data?: Record<string, unknown> | FormData | string
  headers?: Record<string, string>
  timeout?: number
  withCredentials?: boolean
}

/**
 * Interface untuk response
 */
export interface FallbackResponse<T> {
  data: T
  status: number
  statusText: string
  headers: Record<string, string>
}

/**
 * Default configuration untuk fallback request
 */
const DEFAULT_CONFIG = {
  baseUrl: process.env.NEXT_PUBLIC_API_URL || 'https://api.parthamanunggal.com',
  timeout: 30000,
  withCredentials: false,
  headers: {
    'Accept': 'application/json',
    'Content-Type': 'application/json',
    'X-Requested-With': 'XMLHttpRequest'
  }
}

/**
 * Helper function untuk mendapatkan full URL
 */
const getFullUrl = (url: string, baseUrl: string): string => {
  if (url.startsWith('http://') || url.startsWith('https://')) {
    return url
  }
  return `${baseUrl}${url}`
}

/**
 * Helper function untuk set headers
 */
const setHeaders = (xhr: XMLHttpRequest, headers: Record<string, string>): void => {
  Object.entries(headers).forEach(([key, value]) => {
    xhr.setRequestHeader(key, value)
  })
}

/**
 * Helper function untuk parse response headers
 */
const parseResponseHeaders = (headerString: string): Record<string, string> => {
  const headers: Record<string, string> = {}
  if (!headerString) return headers
  
  const headerPairs = headerString.split('\u000d\u000a')
  for (const pair of headerPairs) {
    const index = pair.indexOf('\u003a\u0020')
    if (index > 0) {
      const key = pair.substring(0, index)
      const value = pair.substring(index + 2)
      headers[key] = value
    }
  }
  return headers
}

/**
 * Main fallback request function menggunakan XMLHttpRequest
 */
export async function fallbackRequest<T>(
  method: string,
  url: string,
  baseUrl: string = DEFAULT_CONFIG.baseUrl
): Promise<T> {
  return new Promise((resolve, reject) => {
    const fullUrl = getFullUrl(url, baseUrl)
    console.log(`Fallback request to: ${fullUrl}`)
    
    const xhr = new XMLHttpRequest()
    xhr.open(method, fullUrl, true)
    
    // Set default headers
    setHeaders(xhr, DEFAULT_CONFIG.headers)
    
    // Set timeout
    xhr.timeout = DEFAULT_CONFIG.timeout
    
    // Set credentials
    xhr.withCredentials = DEFAULT_CONFIG.withCredentials
    
    xhr.onload = function() {
      if (xhr.status >= 200 && xhr.status < 300) {
        try {
          const response = JSON.parse(xhr.responseText)
          resolve(response as T)
        } catch (e) {
          reject(new Error(`JSON parse error: ${e}`))
        }
      } else {
        reject(new Error(`HTTP error status: ${xhr.status} - ${xhr.statusText}`))
      }
    }
    
    xhr.onerror = function() {
      console.error('XHR error occurred')
      reject(new Error('Network error occurred'))
    }
    
    xhr.ontimeout = function() {
      reject(new Error('Request timed out'))
    }
    
    xhr.send()
  })
}

/**
 * Enhanced fallback request dengan options lengkap
 */
export async function fallbackRequestWithOptions<T>(
  options: FallbackRequestOptions
): Promise<FallbackResponse<T>> {
  return new Promise((resolve, reject) => {
    const {
      method,
      url,
      baseUrl = DEFAULT_CONFIG.baseUrl,
      data,
      headers = {},
      timeout = DEFAULT_CONFIG.timeout,
      withCredentials = DEFAULT_CONFIG.withCredentials
    } = options
    
    const fullUrl = getFullUrl(url, baseUrl)
    console.log(`Enhanced fallback request to: ${fullUrl}`)
    
    const xhr = new XMLHttpRequest()
    xhr.open(method, fullUrl, true)
    
    // Merge default headers dengan custom headers
    const mergedHeaders = { ...DEFAULT_CONFIG.headers, ...headers }
    setHeaders(xhr, mergedHeaders)
    
    // Set timeout
    xhr.timeout = timeout
    
    // Set credentials
    xhr.withCredentials = withCredentials
    
    xhr.onload = function() {
      if (xhr.status >= 200 && xhr.status < 300) {
        try {
          const responseData = JSON.parse(xhr.responseText)
          const response: FallbackResponse<T> = {
            data: responseData,
            status: xhr.status,
            statusText: xhr.statusText,
            headers: parseResponseHeaders(xhr.getAllResponseHeaders())
          }
          resolve(response)
        } catch (e) {
          reject(new Error(`JSON parse error: ${e}`))
        }
      } else {
        reject(new Error(`HTTP error status: ${xhr.status} - ${xhr.statusText}`))
      }
    }
    
    xhr.onerror = function() {
      console.error('XHR error occurred')
      reject(new Error('Network error occurred'))
    }
    
    xhr.ontimeout = function() {
      reject(new Error('Request timed out'))
    }
    
    // Send data if provided
    if (data) {
      if (data instanceof FormData) {
        xhr.send(data)
      } else if (typeof data === 'string') {
        xhr.send(data)
      } else {
        xhr.send(JSON.stringify(data))
      }
    } else {
      xhr.send()
    }
  })
}

/**
 * Simple GET request helper
 */
export async function fallbackGet<T>(
  url: string,
  baseUrl?: string
): Promise<T> {
  return fallbackRequest<T>('GET', url, baseUrl)
}

/**
 * Simple POST request helper
 */
export async function fallbackPost<T>(
  url: string,
  data?: Record<string, unknown> | FormData,
  baseUrl?: string
): Promise<T> {
  return fallbackRequestWithOptions<T>({
    method: 'POST',
    url,
    data,
    baseUrl
  }).then(response => response.data)
}

/**
 * Simple PUT request helper
 */
export async function fallbackPut<T>(
  url: string,
  data?: Record<string, unknown> | FormData,
  baseUrl?: string
): Promise<T> {
  return fallbackRequestWithOptions<T>({
    method: 'PUT',
    url,
    data,
    baseUrl
  }).then(response => response.data)
}

/**
 * Simple DELETE request helper
 */
export async function fallbackDelete<T>(
  url: string,
  baseUrl?: string
): Promise<T> {
  return fallbackRequest<T>('DELETE', url, baseUrl)
}

/**
 * Simple PATCH request helper
 */
export async function fallbackPatch<T>(
  url: string,
  data?: Record<string, unknown> | FormData,
  baseUrl?: string
): Promise<T> {
  return fallbackRequestWithOptions<T>({
    method: 'PATCH',
    url,
    data,
    baseUrl
  }).then(response => response.data)
}

/**
 * Check apakah browser mendukung XMLHttpRequest
 */
export const isXHRAvailable = (): boolean => {
  return typeof XMLHttpRequest !== 'undefined'
}

/**
 * Check apakah browser mendukung FormData
 */
export const isFormDataAvailable = (): boolean => {
  return typeof FormData !== 'undefined'
}

/**
 * Utility function untuk retry request
 */
export async function retryRequest<T>(
  requestFn: () => Promise<T>,
  maxRetries: number = 3,
  delay: number = 1000
): Promise<T> {
  let lastError: Error
  
  for (let attempt = 1; attempt <= maxRetries; attempt++) {
    try {
      return await requestFn()
    } catch (error) {
      lastError = error as Error
      console.warn(`Request attempt ${attempt} failed:`, error)
      
      if (attempt < maxRetries) {
        await new Promise(resolve => setTimeout(resolve, delay * attempt))
      }
    }
  }
  
  throw lastError!
}
