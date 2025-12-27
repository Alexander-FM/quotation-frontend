export interface UnitOfMeasurementRequestDto {
  id?: number;
  name: string;
  description?: string;
  isActive?: boolean;
}

export interface UnitOfMeasurementResponseDto {
  id: number;
  name: string;
  description?: string;
  isActive: boolean;
}

export interface GenericResponse<T> {
  code: number;
  message: string;
  body: T;
}
