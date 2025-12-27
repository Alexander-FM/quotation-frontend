import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';
import { CatalogItemRequestDto, CatalogItemResponseDto, GenericResponse } from '../models/catalog-item.model';

@Injectable({
  providedIn: 'root'
})
export class CatalogItemService {
  private apiUrl = 'http://127.0.0.1:8081/api/catalogs/catalog-item';

  constructor(private http: HttpClient) {}

  private getAuthHeaders(): HttpHeaders {
    const token = localStorage.getItem('access_token');
    return new HttpHeaders({
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${token}`
    });
  }

  getAll(): Observable<GenericResponse<CatalogItemResponseDto[]>> {
    return this.http.get<GenericResponse<CatalogItemResponseDto[]>>(
      this.apiUrl,
      { headers: this.getAuthHeaders() }
    );
  }

  getById(id: number): Observable<GenericResponse<CatalogItemResponseDto>> {
    return this.http.get<GenericResponse<CatalogItemResponseDto>>(
      `${this.apiUrl}/${id}`,
      { headers: this.getAuthHeaders() }
    );
  }

  getByCode(code: string): Observable<GenericResponse<CatalogItemResponseDto>> {
    return this.http.get<GenericResponse<CatalogItemResponseDto>>(
      `${this.apiUrl}/searchByDocumentTypeCode?code=${code}`,
      { headers: this.getAuthHeaders() }
    );
  }

  create(request: CatalogItemRequestDto): Observable<GenericResponse<CatalogItemResponseDto>> {
    return this.http.post<GenericResponse<CatalogItemResponseDto>>(
      this.apiUrl,
      request,
      { headers: this.getAuthHeaders() }
    );
  }

  update(id: number, request: CatalogItemRequestDto): Observable<GenericResponse<CatalogItemResponseDto>> {
    return this.http.put<GenericResponse<CatalogItemResponseDto>>(
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
