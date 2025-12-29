export interface UserRequestDto {
  id?: number;
  username: string;
  password: string;
  isActive: boolean;
  roles: Array<{
    id?: number;
    roleName: string;
    description?: string;
    isActive?: boolean;
  }>;
}

export interface UserResponseDto {
  id: number;
  username: string;
  isActive: boolean;
  roles: Array<{
    id: number;
    roleName: string;
    description?: string;
    isActive: boolean;
  }>;
}

export interface GenericResponse<T> {
  code: number;
  message: string;
  body: T;
}
