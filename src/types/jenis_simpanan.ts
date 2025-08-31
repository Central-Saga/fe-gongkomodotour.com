// Jenis Simpanan types aligned with Laravel migration
// Table: jenis_simpanan
// Columns: id, nama, deskripsi, created_at, updated_at

export interface JenisSimpanan {
  id: number; // bigint
  nama: string; // varchar(100)
  deskripsi?: string | null; // text, nullable
  created_at: string; // timestamp (ISO string)
  updated_at: string; // timestamp (ISO string)
}

export interface ApiResponse<T> {
  data: T;
  message?: string;
  status: number;
}

