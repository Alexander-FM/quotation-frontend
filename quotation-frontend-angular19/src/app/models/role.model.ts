export interface RoleRequestDto {
  id?: number;
  roleName: string;
  description?: string;
  isActive: boolean;
}

export interface RoleResponseDto {
  id: number;
  roleName: string;
  description?: string;
  isActive: boolean;
}

export interface GenericResponse<T> {
  code: number;
  message: string;
  body: T;
}
