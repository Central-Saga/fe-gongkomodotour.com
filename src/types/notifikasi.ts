// Notifikasi types aligned with Laravel migration
// Table: notifikasi
// Columns: id, user_id (FK), judul, pesan, tanggal, status_baca, created_at

export interface Notifikasi {
  id: number; // bigint
  user_id: number; // FK ke users.id
  judul: string; // varchar(100)
  pesan: string; // text
  tanggal: string; // date (YYYY-MM-DD)
  status_baca: 0 | 1; // 0: belum dibaca, 1: dibaca
  created_at?: string | null; // timestamp, nullable
}

export interface ApiResponse<T> {
  data: T;
  message?: string;
  status: number;
}

