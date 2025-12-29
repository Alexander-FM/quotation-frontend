import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';
import { MaterialRequestDto, MaterialResponseDto, GenericResponse } from '../models/material.model';

@Injectable({
  providedIn: 'root'
})
export class MaterialService {
  private apiUrl = 'http://127.0.0.1:8081/api/materials/material';

  constructor(private http: HttpClient) {}

  private getAuthHeaders(): HttpHeaders {
    const token = localStorage.getItem('access_token');
    return new HttpHeaders({
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${token}`
    });
  }

  getAll(): Observable<GenericResponse<MaterialResponseDto[]>> {
    return this.http.get<GenericResponse<MaterialResponseDto[]>>(
      this.apiUrl,
      { headers: this.getAuthHeaders() }
    );
  }

  getById(id: number): Observable<GenericResponse<MaterialResponseDto>> {
    return this.http.get<GenericResponse<MaterialResponseDto>>(
      `${this.apiUrl}/${id}`,
      { headers: this.getAuthHeaders() }
    );
  }

  getByIdList(idList: number[]): Observable<GenericResponse<MaterialResponseDto[]>> {
    const params = idList.join(',');
    return this.http.get<GenericResponse<MaterialResponseDto[]>>(
      `${this.apiUrl}/searchMaterialsByIdList?idList=${params}`,
      { headers: this.getAuthHeaders() }
    );
  }

  create(request: MaterialRequestDto): Observable<GenericResponse<MaterialResponseDto>> {
    return this.http.post<GenericResponse<MaterialResponseDto>>(
      this.apiUrl,
      request,
      { headers: this.getAuthHeaders() }
    );
  }

  update(id: number, request: MaterialRequestDto): Observable<GenericResponse<MaterialResponseDto>> {
    return this.http.put<GenericResponse<MaterialResponseDto>>(
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
