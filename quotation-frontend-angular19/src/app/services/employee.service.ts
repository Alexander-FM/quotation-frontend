import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';
import { EmployeeRequestDto, EmployeeResponseDto, GenericResponse } from '../models/employee.model';

@Injectable({
  providedIn: 'root'
})
export class EmployeeService {
  private apiUrl = 'http://127.0.0.1:8081/api/employees/employee';

  constructor(private http: HttpClient) {}

  private getAuthHeaders(): HttpHeaders {
    const token = localStorage.getItem('access_token');
    return new HttpHeaders({
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${token}`
    });
  }

  getAll(): Observable<GenericResponse<EmployeeResponseDto[]>> {
    return this.http.get<GenericResponse<EmployeeResponseDto[]>>(
      this.apiUrl,
      { headers: this.getAuthHeaders() }
    );
  }

  getById(id: number): Observable<GenericResponse<EmployeeResponseDto>> {
    return this.http.get<GenericResponse<EmployeeResponseDto>>(
      `${this.apiUrl}/${id}`,
      { headers: this.getAuthHeaders() }
    );
  }

  getByDocumentNumber(documentNumber: string): Observable<GenericResponse<EmployeeResponseDto>> {
    return this.http.get<GenericResponse<EmployeeResponseDto>>(
      `${this.apiUrl}/searchByDocumentNumber/${documentNumber}`,
      { headers: this.getAuthHeaders() }
    );
  }

  getByDocumentNumbers(documentNumbers: string[]): Observable<GenericResponse<EmployeeResponseDto[]>> {
    const params = documentNumbers.join(',');
    return this.http.get<GenericResponse<EmployeeResponseDto[]>>(
      `${this.apiUrl}/searchByDocumentNumberIds?documentNumberList=${params}`,
      { headers: this.getAuthHeaders() }
    );
  }

  create(request: EmployeeRequestDto): Observable<GenericResponse<EmployeeResponseDto>> {
    return this.http.post<GenericResponse<EmployeeResponseDto>>(
      this.apiUrl,
      request,
      { headers: this.getAuthHeaders() }
    );
  }

  update(id: number, request: EmployeeRequestDto): Observable<GenericResponse<EmployeeResponseDto>> {
    return this.http.put<GenericResponse<EmployeeResponseDto>>(
      `${this.apiUrl}/${id}`,
      request,
      { headers: this.getAuthHeaders() }
    );
  }

  delete(id: number): Observable<GenericResponse<any>> {
    return this.http.delete<GenericResponse<any>>(
      `${this.apiUrl}/${id}`,
      { headers: this.getAuthHeaders() }
    );
  }
}
