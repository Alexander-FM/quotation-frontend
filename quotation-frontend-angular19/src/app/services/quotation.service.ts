import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';
import { QuotationRequestDto, QuotationResponseDto, GenericResponse } from '../models/quotation.model';
import { AuthService } from './auth.service';

@Injectable({
  providedIn: 'root'
})
export class QuotationService {
  private apiUrl = 'http://127.0.0.1:8081/api/quotations/quotation';

  constructor(
    private http: HttpClient,
    private authService: AuthService
  ) {}

  private getAuthHeaders(): HttpHeaders {
    const token = this.authService.getAccessToken();
    return new HttpHeaders({
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${token}`
    });
  }

  getAll(): Observable<GenericResponse<QuotationResponseDto[]>> {
    return this.http.get<GenericResponse<QuotationResponseDto[]>>(
      this.apiUrl,
      { headers: this.getAuthHeaders() }
    );
  }

  getById(id: number): Observable<GenericResponse<QuotationResponseDto>> {
    return this.http.get<GenericResponse<QuotationResponseDto>>(
      `${this.apiUrl}/${id}`,
      { headers: this.getAuthHeaders() }
    );
  }

  create(quotation: QuotationRequestDto): Observable<GenericResponse<QuotationResponseDto>> {
    return this.http.post<GenericResponse<QuotationResponseDto>>(
      this.apiUrl,
      quotation,
      { headers: this.getAuthHeaders() }
    );
  }

  update(id: number, quotation: QuotationRequestDto): Observable<GenericResponse<QuotationResponseDto>> {
    return this.http.put<GenericResponse<QuotationResponseDto>>(
      `${this.apiUrl}/${id}`,
      quotation,
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
