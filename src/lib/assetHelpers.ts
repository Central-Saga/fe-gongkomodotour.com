import { apiRequest } from "./api"

/**
 * Interface untuk Asset yang sesuai dengan model Laravel
 */
export interface Asset {
  id: number
  file_name: string
  original_name: string
  mime_type: string
  file_size: number
  url: string
  status: string
  assetable_id: number
  assetable_type: string
  created_at: string
  updated_at: string
}

/**
 * Interface untuk response API yang mungkin berbeda dengan model
 */
export interface AssetApiResponse {
  id: number
  title: string
  description: string | null
  file_url: string
  original_file_url?: string
  file_path?: string
  is_external: boolean
  created_at: string
  updated_at: string
}

/**
 * Interface untuk response API yang mengembalikan data
 */
interface ApiResponse<T> {
  data: T
  message?: string
  status?: string
}

/**
 * Konversi response API ke interface Asset
 */
export const mapApiResponseToAsset = (apiResponse: AssetApiResponse): Asset => {
  return {
    id: apiResponse.id,
    file_name: apiResponse.title || '',
    original_name: apiResponse.original_file_url || apiResponse.file_url,
    mime_type: 'application/octet-stream', // Default mime type
    file_size: 0, // Default file size
    url: apiResponse.file_url,
    status: 'active',
    assetable_id: 0, // Akan diisi sesuai konteks
    assetable_type: '',
    created_at: apiResponse.created_at,
    updated_at: apiResponse.updated_at
  }
}

/**
 * Menghapus asset berdasarkan ID
 */
export const deleteAssetById = async (assetId: number): Promise<boolean> => {
  try {
    await apiRequest('DELETE', `/api/assets/${assetId}`)
    console.log(`Asset berhasil dihapus: ${assetId}`)
    return true
  } catch (error) {
    console.error(`Error deleting asset ${assetId}:`, error)
    throw error
  }
}

/**
 * Menghapus asset berdasarkan file_url
 * Mencari asset di list yang diberikan dan menghapus berdasarkan ID
 */
export const deleteAssetByFileUrl = async (
  fileUrl: string, 
  assetList: Asset[]
): Promise<Asset | null> => {
  try {
    // Cari asset berdasarkan file_url
    const assetToDelete = assetList.find(asset => asset.url === fileUrl)
    
    if (!assetToDelete) {
      console.warn(`Asset dengan file_url ${fileUrl} tidak ditemukan`)
      return null
    }
    
    // Hapus asset menggunakan ID yang benar
    await deleteAssetById(assetToDelete.id)
    
    return assetToDelete
  } catch (error) {
    console.error('Error deleting asset:', error)
    throw error
  }
}

/**
 * Menghapus multiple assets berdasarkan file_urls
 */
export const deleteMultipleAssetsByFileUrls = async (
  fileUrls: string[],
  assetList: Asset[]
): Promise<Asset[]> => {
  const deletedAssets: Asset[] = []
  
  for (const fileUrl of fileUrls) {
    try {
      const deletedAsset = await deleteAssetByFileUrl(fileUrl, assetList)
      if (deletedAsset) {
        deletedAssets.push(deletedAsset)
      }
    } catch (error) {
      console.warn(`Gagal hapus asset ${fileUrl}:`, error)
      // Lanjutkan dengan asset berikutnya
    }
  }
  
  return deletedAssets
}

/**
 * Membersihkan asset lama sebelum upload yang baru
 * Memastikan tidak ada duplikasi asset
 */
export const cleanupOldAssets = async (
  modelType: string,
  modelId: number,
  currentAssets: Asset[]
): Promise<void> => {
  if (currentAssets.length === 0) return
  
  console.log(`Membersihkan ${currentAssets.length} asset lama untuk ${modelType} ${modelId}`)
  
  for (const asset of currentAssets) {
    try {
      await deleteAssetById(asset.id)
      console.log(`Asset lama berhasil dihapus: ${asset.id}`)
    } catch (error) {
      console.warn(`Gagal hapus asset lama ${asset.id}:`, error)
      // Lanjutkan meski gagal hapus asset lama
    }
  }
}

/**
 * Upload asset baru
 */
export const uploadAsset = async (
  file: File,
  modelType: string,
  modelId: number
): Promise<Asset> => {
  try {
    const formData = new FormData()
    formData.append('file', file)
    formData.append('assetable_type', modelType)
    formData.append('assetable_id', modelId.toString())
    
    const response = await apiRequest<ApiResponse<Asset>>('POST', '/api/assets', formData)
    return response.data
  } catch (error) {
    console.error('Error uploading asset:', error)
    throw error
  }
}

/**
 * Update asset status
 */
export const updateAssetStatus = async (
  assetId: number,
  status: string
): Promise<Asset> => {
  try {
    const response = await apiRequest<ApiResponse<Asset>>('PATCH', `/api/assets/${assetId}`, {
      status
    })
    return response.data
  } catch (error) {
    console.error(`Error updating asset status ${assetId}:`, error)
    throw error
  }
}

/**
 * Get assets by model type and ID
 */
export const getAssetsByModel = async (
  modelType: string,
  modelId: number
): Promise<Asset[]> => {
  try {
    const response = await apiRequest<ApiResponse<Asset[]>>('GET', `/api/assets`, {
      params: {
        assetable_type: modelType,
        assetable_id: modelId
      }
    })
    return response.data
  } catch (error) {
    console.error(`Error getting assets for ${modelType} ${modelId}:`, error)
    throw error
  }
}

/**
 * Utility function untuk mendapatkan file extension dari filename
 */
export const getFileExtension = (filename: string): string => {
  return filename.split('.').pop()?.toLowerCase() || ''
}

/**
 * Utility function untuk format file size
 */
export const formatFileSize = (bytes: number): string => {
  if (bytes === 0) return '0 Bytes'
  
  const k = 1024
  const sizes = ['Bytes', 'KB', 'MB', 'GB']
  const i = Math.floor(Math.log(bytes) / Math.log(k))
  
  return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i]
}

/**
 * Utility function untuk check apakah file adalah image
 */
export const isImageFile = (mimeType: string): boolean => {
  return mimeType.startsWith('image/')
}

/**
 * Utility function untuk check apakah file adalah document
 */
export const isDocumentFile = (mimeType: string): boolean => {
  const documentTypes = [
    'application/pdf',
    'application/msword',
    'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
    'application/vnd.ms-excel',
    'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
    'text/plain'
  ]
  return documentTypes.includes(mimeType)
}
