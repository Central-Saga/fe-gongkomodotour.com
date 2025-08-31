// Bunga Tabungan types aligned with Laravel migration
// Table: bunga_tabungan
// Columns: id, tabungan_id, bulan, tahun, saldo_minimum, persentase, jumlah_bunga, created_at, updated_at

export interface BungaTabungan {
  id: number; // bigint
  tabungan_id: number; // FK ke tabungan.id
  bulan: number; // smallInteger (1-12)
  tahun: number; // smallInteger (e.g., 2025)
  saldo_minimum: string; // decimal(15,2) as string to preserve precision
  persentase: string; // decimal(5,2) as string (percentage)
  jumlah_bunga: string; // decimal(15,2) as string
  created_at: string; // timestamp (ISO string)
  updated_at: string; // timestamp (ISO string)
}

export interface ApiResponse<T> {
  data: T;
  message?: string;
  status: number;
}

