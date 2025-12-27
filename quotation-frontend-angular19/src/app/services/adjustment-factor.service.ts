import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';
import { AdjustmentFactorRequestDto, AdjustmentFactorResponseDto, GenericResponse } from '../models/adjustment-factor.model';

@Injectable({
  providedIn: 'root'
})
export class AdjustmentFactorService {
  private apiUrl = 'http://127.0.0.1:8081/api/catalogs/adjustment-factor';

  constructor(private http: HttpClient) {}

  private getAuthHeaders(): HttpHeaders {
    const token = localStorage.getItem('access_token');
    return new HttpHeaders({
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${token}`
    });
  }

  getAll(): Observable<GenericResponse<AdjustmentFactorResponseDto[]>> {
    return this.http.get<GenericResponse<AdjustmentFactorResponseDto[]>>(
      this.apiUrl,
      { headers: this.getAuthHeaders() }
    );
  }

  getById(id: number): Observable<GenericResponse<AdjustmentFactorResponseDto>> {
    return this.http.get<GenericResponse<AdjustmentFactorResponseDto>>(
      `${this.apiUrl}/${id}`,
      { headers: this.getAuthHeaders() }
    );
  }

  getByName(name: string): Observable<GenericResponse<AdjustmentFactorResponseDto>> {
    return this.http.get<GenericResponse<AdjustmentFactorResponseDto>>(
      `${this.apiUrl}/searchByName?name=${name}`,
      { headers: this.getAuthHeaders() }
    );
  }

  create(request: AdjustmentFactorRequestDto): Observable<GenericResponse<AdjustmentFactorResponseDto>> {
    return this.http.post<GenericResponse<AdjustmentFactorResponseDto>>(
      this.apiUrl,
      request,
      { headers: this.getAuthHeaders() }
    );
  }

  update(id: number, request: AdjustmentFactorRequestDto): Observable<GenericResponse<AdjustmentFactorResponseDto>> {
    return this.http.put<GenericResponse<AdjustmentFactorResponseDto>>(
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
