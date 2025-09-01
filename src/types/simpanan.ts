// Simpanan types aligned with Laravel migration
// Table: simpanan
// Columns: id, anggota_id, jenis_simpanan_id, nominal, tanggal, keterangan, status, created_at, updated_at

export interface Simpanan {
  id: number; // bigint
  anggota_id: number; // unsignedBigInteger (FK to anggota.id)
  jenis_simpanan_id: number; // unsignedBigInteger (FK to jenis_simpanan.id)
  nominal: number; // decimal(18,2)
  tanggal: string; // date (YYYY-MM-DD)
  keterangan?: string | null; // text, nullable
  status: string; // enum('Aktif','Non Aktif') in DB
  created_at: string; // timestamp (ISO string)
  updated_at: string; // timestamp (ISO string)
}

export interface ApiResponse<T> {
  data: T;
  message?: string;
  status: number;
}

