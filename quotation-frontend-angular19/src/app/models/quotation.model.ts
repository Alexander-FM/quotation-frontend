export enum QuotationState {
  BORRADOR = 'BORRADOR',
  EN_REVISION = 'EN REVISIÓN',
  APROBADO = 'APROBADO',
  RECHAZADO = 'RECHAZADO'
}

export interface QuotationRequestDto {
  id?: number;
  customerDocumentNumber: string;
  employeeDocumentNumber: string;
  details: QuotationDetailRequestDto[];
}

export interface QuotationDetailRequestDto {
  id?: number;
  module: any; // ModuleRequestDto - se enviará solo el ID
  quantity: number;
  transportationCost?: number;
  laborCost?: number;
  packingCost?: number;
  subItems: QuotationDetailSubItemRequestDto[];
}

export interface QuotationDetailSubItemRequestDto {
  id?: number;
  materialId: number;
  quantity: number;
  rawMaterialCost: number;
  pieces: number;
}

export interface QuotationResponseDto {
  id: number;
  customerDocumentNumber: string;
  customerName: string;
  employeeDocumentNumber: string;
  employeeName: string;
  state: string;
  totalProductionCost: number;
  details: QuotationDetailResponseDto[];
}

export interface QuotationDetailResponseDto {
  id: number;
  module: any; // ModuleResponseDto
  quantity: number;
  transportationCost: number;
  laborCost: number;
  packingCost: number;
  overheadsPercentage: number;
  overheadsAmount: number;
  feePercentage: number;
  feeAmount: number;
  rebatePercentage: number;
  rebateAmount: number;
  profitMarginPercentage: number;
  unitProductionCost: number;
  suggestedPrice: number;
  totalLinePrice: number;
  subItems: QuotationDetailSubItemResponseDto[];
}

export interface QuotationDetailSubItemResponseDto {
  id: number;
  materialId: number;
  material: any; // MaterialResponseDto
  quantity: number;
  rawMaterialCost: number;
  pieces: number;
  unitPrice: number;
  totalPrice: number;
}

export interface GenericResponse<T> {
  code: number;
  message: string;
  body: T;
}
