// Pengurus types aligned with Laravel migration
// Table: pengurus
// Columns: id, anggota_id, jabatan, periode_awal, periode_akhir, status, created_at, updated_at

export interface Pengurus {
  id: number; // bigint
  anggota_id: number; // unsignedBigInteger (FK to anggota.id)
  jabatan: string; // varchar(100)
  periode_awal: string; // date (YYYY-MM-DD)
  periode_akhir: string; // date (YYYY-MM-DD)
  status: number; // smallInteger
  created_at: string; // timestamp (ISO string)
  updated_at: string; // timestamp (ISO string)
}

export interface ApiResponse<T> {
  data: T;
  message?: string;
  status: number;
}

