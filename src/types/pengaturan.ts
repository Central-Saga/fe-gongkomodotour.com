// Pengaturan types aligned with Eloquent model and expected schema
// Table: pengaturan
// Columns: id, nama_setting, jenis_setting, jenis_tabungan_id, periode_berlaku, value, keterangan, created_at, updated_at

export interface Pengaturan {
  id: number; // bigint
  nama_setting: string; // varchar(255)
  jenis_setting: string; // varchar(100)
  jenis_tabungan_id: number; // unsignedBigInteger (FK to jenis_tabungan.id)
  periode_berlaku: string; // date (YYYY-MM-DD)
  value: string; // text or varchar, stored as string
  keterangan?: string | null; // text, nullable
  created_at: string; // timestamp (ISO string)
  updated_at: string; // timestamp (ISO string)
}

export interface ApiResponse<T> {
  data: T;
  message?: string;
  status: number;
}

