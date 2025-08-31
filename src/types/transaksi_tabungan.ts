// Transaksi Tabungan types aligned with Laravel migration
// Table: transaksi_tabungan
// Columns: id, tabungan_id, tipe, nominal, tanggal, keterangan, created_at, updated_at

export interface TransaksiTabungan {
  id: number; // bigint
  tabungan_id: number; // FK ke tabungan.id
  tipe: string; // varchar(30)
  nominal: string; // decimal(15,2) as string to preserve precision
  tanggal: string; // date (YYYY-MM-DD)
  keterangan?: string | null; // text, nullable
  created_at: string; // timestamp (ISO string)
  updated_at: string; // timestamp (ISO string)
}

export interface ApiResponse<T> {
  data: T;
  message?: string;
  status: number;
}

