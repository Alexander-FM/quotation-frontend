export enum MaterialCalculationTypeEnum {
  SIMPLE = 'Simple',
  YIELD_BASED = 'Basado en el rendimiento',
  VOLUME_DM = 'Volumen en decímetros cúbicos',
  AREA = 'Area'
}

export interface MaterialRequestDto {
  id?: number;
  name: string;
  description?: string;
  unitCost: number;
  unidadOfMeasurementName: string;
  calculationType?: MaterialCalculationTypeEnum;
  adjustmentFactorName?: string;
  adjustmentFactorValue?: number;
  thicknessMicrons?: number;
  isActive: boolean;
}

export interface MaterialResponseDto {
  id: number;
  name: string;
  description?: string;
  unitCost: number;
  unidadOfMeasurementName: string;
  calculationType?: MaterialCalculationTypeEnum;
  adjustmentFactorName?: string;
  adjustmentFactorValue?: number;
  thicknessMicrons?: number;
  isActive: boolean;
}

export interface GenericResponse<T> {
  code: number;
  message: string;
  body: T;
}
