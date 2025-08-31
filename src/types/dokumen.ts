// Dokumen types aligned with Laravel migration
// Table: dokumen
// Columns: id, nama_file, tipe, tahun, keterangan, file_path, created_at, updated_at

export interface Dokumen {
  id: number; // bigint
  nama_file: string; // varchar(255)
  tipe: string; // varchar(50)
  tahun: number; // smallInteger
  keterangan?: string | null; // text, nullable
  file_path: string; // varchar(255)
  created_at: string; // timestamp (ISO string)
  updated_at: string; // timestamp (ISO string)
}

export interface ApiResponse<T> {
  data: T;
  message?: string;
  status: number;
}

