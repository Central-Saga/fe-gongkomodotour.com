// Tabungan types aligned with Laravel migration
// Table: tabungan
// Columns: id, anggota_id, jenis_tabungan_id, saldo, tgl_buka, status, created_at, updated_at

export interface Tabungan {
  id: number; // bigint
  anggota_id: number; // unsignedBigInteger (FK to anggota.id)
  jenis_tabungan_id: number; // unsignedBigInteger (FK to jenis_tabungan.id)
  saldo: number; // decimal(15,2)
  tgl_buka: string; // date (YYYY-MM-DD)
  status: number; // smallInteger
  created_at: string; // timestamp (ISO string)
  updated_at: string; // timestamp (ISO string)
}

export interface ApiResponse<T> {
  data: T;
  message?: string;
  status: number;
}

