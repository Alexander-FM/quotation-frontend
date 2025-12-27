import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';
import { UnitOfMeasurementRequestDto, UnitOfMeasurementResponseDto, GenericResponse } from '../models/unit-of-measurement.model';

@Injectable({
  providedIn: 'root'
})
export class UnitOfMeasurementService {
  private apiUrl = 'http://127.0.0.1:8081/api/catalogs/unit-of-measurement';

  constructor(private http: HttpClient) {}

  private getAuthHeaders(): HttpHeaders {
    const token = localStorage.getItem('access_token');
    return new HttpHeaders({
      'Authorization': `Bearer ${token}`,
      'Content-Type': 'application/json'
    });
  }

  getAll(): Observable<GenericResponse<UnitOfMeasurementResponseDto[]>> {
    return this.http.get<GenericResponse<UnitOfMeasurementResponseDto[]>>(this.apiUrl, {
      headers: this.getAuthHeaders()
    });
  }

  getById(id: number): Observable<GenericResponse<UnitOfMeasurementResponseDto>> {
    return this.http.get<GenericResponse<UnitOfMeasurementResponseDto>>(`${this.apiUrl}/${id}`, {
      headers: this.getAuthHeaders()
    });
  }

  create(request: UnitOfMeasurementRequestDto): Observable<GenericResponse<UnitOfMeasurementResponseDto>> {
    return this.http.post<GenericResponse<UnitOfMeasurementResponseDto>>(this.apiUrl, request, {
      headers: this.getAuthHeaders()
    });
  }

  update(id: number, request: UnitOfMeasurementRequestDto): Observable<GenericResponse<UnitOfMeasurementResponseDto>> {
    return this.http.put<GenericResponse<UnitOfMeasurementResponseDto>>(`${this.apiUrl}/${id}`, request, {
      headers: this.getAuthHeaders()
    });
  }

  delete(id: number): Observable<GenericResponse<object>> {
    return this.http.delete<GenericResponse<object>>(`${this.apiUrl}/${id}`, {
      headers: this.getAuthHeaders()
    });
  }
}
