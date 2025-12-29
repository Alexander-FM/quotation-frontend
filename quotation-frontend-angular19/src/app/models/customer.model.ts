export interface CustomerRequestDto {
  id?: number;
  companyName: string;
  documentTypeCode: string;
  documentNumber: string;
  email: string;
  phoneNumber: string;
  phoneNumber2?: string;
  isActive: boolean;
}

export interface CustomerResponseDto {
  id: number;
  companyName: string;
  documentTypeCode: string;
  documentNumber: string;
  email: string;
  phoneNumber: string;
  phoneNumber2?: string;
  isActive: boolean;
}

export interface GenericResponse<T> {
  code: number;
  message: string;
  body: T;
}
