// Log Aktivitas types aligned with Laravel migration
// Table: log_aktivitas
// Columns: id, user_id (FK), aktivitas, waktu, ip_address, keterangan

export interface LogAktivitas {
  id: number; // bigint
  user_id: number; // FK ke users.id
  aktivitas: string; // varchar(100)
  waktu: string; // timestamp (ISO string)
  ip_address: string; // varchar(45)
  keterangan?: string | null; // text, nullable
}

export interface ApiResponse<T> {
  data: T;
  message?: string;
  status: number;
}

