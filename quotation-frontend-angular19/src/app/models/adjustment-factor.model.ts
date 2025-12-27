export interface AdjustmentFactorRequestDto {
  id?: number;
  name: string;
  value: number;
  isActive?: boolean;
}

export interface AdjustmentFactorResponseDto {
  id: number;
  name: string;
  value: number;
  isActive: boolean;
}

export interface GenericResponse<T> {
  code: number;
  message: string;
  body: T;
}
