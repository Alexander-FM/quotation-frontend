export interface LoginRequest {
  username: string;
  password: string;
}

export interface TokenResponse {
  access_token: string;
  refresh_token: string;
  token_type: string;
  expires_in: number;
  issued_at: string;
  username: string;
}

export interface GenericResponse<T> {
  code: number;
  message: string;
  body: T;
}
