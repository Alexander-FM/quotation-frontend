import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';
import { CustomerRequestDto, CustomerResponseDto, GenericResponse } from '../models/customer.model';

@Injectable({
  providedIn: 'root'
})
export class CustomerService {
  private apiUrl = 'http://127.0.0.1:8081/api/customers/customer';

  constructor(private http: HttpClient) {}

  private getAuthHeaders(): HttpHeaders {
    const token = localStorage.getItem('access_token');
    return new HttpHeaders({
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${token}`
    });
  }

  getAll(): Observable<GenericResponse<CustomerResponseDto[]>> {
    return this.http.get<GenericResponse<CustomerResponseDto[]>>(
      this.apiUrl,
      { headers: this.getAuthHeaders() }
    );
  }

  getById(id: number): Observable<GenericResponse<CustomerResponseDto>> {
    return this.http.get<GenericResponse<CustomerResponseDto>>(
      `${this.apiUrl}/${id}`,
      { headers: this.getAuthHeaders() }
    );
  }

  getByDocumentNumber(documentNumber: string): Observable<GenericResponse<CustomerResponseDto>> {
    return this.http.get<GenericResponse<CustomerResponseDto>>(
      `${this.apiUrl}/searchByDocumentNumber/${documentNumber}`,
      { headers: this.getAuthHeaders() }
    );
  }

  getByDocumentNumbers(documentNumbers: string[]): Observable<GenericResponse<CustomerResponseDto[]>> {
    const params = documentNumbers.join(',');
    return this.http.get<GenericResponse<CustomerResponseDto[]>>(
      `${this.apiUrl}/searchByDocumentNumberIds?documentNumberList=${params}`,
      { headers: this.getAuthHeaders() }
    );
  }

  create(request: CustomerRequestDto): Observable<GenericResponse<CustomerResponseDto>> {
    return this.http.post<GenericResponse<CustomerResponseDto>>(
      this.apiUrl,
      request,
      { headers: this.getAuthHeaders() }
    );
  }

  update(id: number, request: CustomerRequestDto): Observable<GenericResponse<CustomerResponseDto>> {
    return this.http.put<GenericResponse<CustomerResponseDto>>(
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
