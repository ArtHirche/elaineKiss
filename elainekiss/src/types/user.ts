export interface User {
  id: string;
  email: string;
  name?: string;
  password?: string;
  provider?: 'email' | 'google';
  providerId?: string;
  role: 'admin' | 'user';
  emailVerified?: boolean;
  createdAt: Date;
  updatedAt: Date;
}

export interface CreateUserInput {
  email: string;
  name?: string;
  password?: string;
  provider?: 'email' | 'google';
  providerId?: string;
  role?: 'admin' | 'user';
}

export interface LoginInput {
  email: string;
  password?: string;
  provider?: 'google';
  providerId?: string;
  accessToken?: string;
}

export interface AuthResponse {
  user: Omit<User, 'password'>;
  token: string;
  refreshToken: string;
}
