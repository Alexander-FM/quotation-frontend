export interface CatalogItemRequestDto {
  id?: number;
  category: string;
  code: string;
  description?: string;
  isActive?: boolean;
}

export interface CatalogItemResponseDto {
  id: number;
  category: string;
  code: string;
  description?: string;
  isActive: boolean;
}

export interface GenericResponse<T> {
  code: number;
  message: string;
  body: T;
}
