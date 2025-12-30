export interface ModuleRequestDto {
  id?: number;
  name: string;
  description?: string;
  dimensions?: string;
  isActive: boolean;
  overheadsCostPercentage?: number;
  feePercentage?: number;
  rebatePercentage?: number;
  profitMarginPercentage?: number;
}

export interface ModuleResponseDto {
  id: number;
  name: string;
  description?: string;
  dimensions?: string;
  isActive: boolean;
  overheadsCostPercentage?: number;
  feePercentage?: number;
  rebatePercentage?: number;
  profitMarginPercentage?: number;
  createdAt: string;
}

export interface GenericResponse<T> {
  code: number;
  message: string;
  body: T;
}
