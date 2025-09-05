export interface Role {
  id: number;
  name: string;
  created_at?: string;
  updated_at?: string;
}

export interface ApiResponse<T> {
  data: T;
  message?: string;
  status?: number;
}

