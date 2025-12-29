export interface EmployeeRequestDto {
  id?: number;
  fullName: string;
  documentTypeCode: string;
  documentNumber: string;
  phoneNumber: string;
  phoneNumber2?: string;
  streetAddress: string;
  userId: number;
  isActive: boolean;
}

export interface EmployeeResponseDto {
  id: number;
  fullName: string;
  documentTypeCode: string;
  documentNumber: string;
  phoneNumber: string;
  phoneNumber2?: string;
  streetAddress: string;
  userResponseDto: {
    id: number;
    username: string;
    isActive: boolean;
    roles: Array<{
      id: number;
      roleName: string;
      description?: string;
      isActive: boolean;
    }>;
  };
  isActive: boolean;
}

export interface GenericResponse<T> {
  code: number;
  message: string;
  body: T;
}
