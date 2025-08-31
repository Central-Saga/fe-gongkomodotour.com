// Anggota types aligned with Laravel migration
// Table: anggota
// Columns: id, nama, nik, alamat, tanggal_lahir, no_hp, status, tgl_gabung, created_at, updated_at

export interface Anggota {
  id: number; // bigint
  nama: string; // varchar(255)
  nik: string; // varchar(30)
  alamat: string; // text
  tanggal_lahir: string; // date (YYYY-MM-DD)
  no_hp: string; // varchar(20)
  status: number; // smallInteger (kode status)
  tgl_gabung: string; // date (YYYY-MM-DD)
  created_at: string; // timestamp (ISO string)
  updated_at: string; // timestamp (ISO string)
}

export interface ApiResponse<T> {
  data: T;
  message?: string;
  status: number;
}

