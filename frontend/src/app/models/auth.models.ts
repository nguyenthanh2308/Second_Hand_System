export interface User {
  id: number;
  username: string;
  email: string;
  role: 'Admin' | 'Customer';
  address?: string;
  token?: string;
}

export interface LoginRequest {
  username: string;
  password: string;
}

export interface RegisterRequest {
  username: string;
  password: string;
  email: string;
  address?: string;
}
