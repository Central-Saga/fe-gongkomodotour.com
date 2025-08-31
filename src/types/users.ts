// User type aligned with the `users` table schema in the diagram
// Columns: id, email, password, anggota_id, remember_token, created_at, updated_at
export interface User {
  id: number; // bigint
  email: string; // varchar(255)
  password: string; // varchar(255)
  anggota_id: number; // bigint (FK)
  remember_token?: string | null; // varchar(100), nullable/optional
  created_at: string; // timestamp (ISO string)
  updated_at: string; // timestamp (ISO string)
}

export interface ApiResponse<T> {
  data: T;
  message?: string;
  status: number;
}
