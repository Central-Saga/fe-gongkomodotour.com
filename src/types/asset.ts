// Asset types aligned with Laravel migration
// Table: asset
// Columns: id, file_name, original_name, mime_type, file_size, url, status, assetable_id, assetable_type, created_at, updated_at

export interface Asset {
  id: number; // bigint
  file_name: string; // varchar(255)
  original_name: string; // varchar(255)
  mime_type: string; // varchar(100)
  file_size: number; // bigint (bytes)
  url: string; // varchar(255)
  status: string; // varchar(50), default 'active'
  assetable_id: number; // unsignedBigInteger (FK id)
  assetable_type: string; // varchar(100) (morph type)
  created_at: string; // timestamp (ISO string)
  updated_at: string; // timestamp (ISO string)
}

export interface ApiResponse<T> {
  data: T;
  message?: string;
  status: number;
}

