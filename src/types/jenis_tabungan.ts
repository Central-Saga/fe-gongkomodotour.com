// Jenis Tabungan types aligned with Laravel migration
// Table: jenis_tabungan
// Columns: id, nama, aturan_bunga_json, deskripsi, created_at, updated_at

export interface JenisTabungan {
  id: number; // bigint
  nama: string; // varchar(100)
  // Use unknown to avoid explicit any while allowing flexible JSON structure
  aturan_bunga_json?: Record<string, unknown> | null; // jsonb, nullable
  deskripsi?: string | null; // text, nullable
  created_at: string; // timestamp (ISO string)
  updated_at: string; // timestamp (ISO string)
}

export interface ApiResponse<T> {
  data: T;
  message?: string;
  status: number;
}
