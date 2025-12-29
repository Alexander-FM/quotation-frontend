import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';
import { RoleRequestDto, RoleResponseDto, GenericResponse } from '../models/role.model';

@Injectable({
  providedIn: 'root'
})
export class RoleService {
  private apiUrl = 'http://127.0.0.1:8081/api/employees/role';

  constructor(private http: HttpClient) {}

  private getAuthHeaders(): HttpHeaders {
    const token = localStorage.getItem('access_token');
    return new HttpHeaders({
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${token}`
    });
  }

  getAll(): Observable<GenericResponse<RoleResponseDto[]>> {
    return this.http.get<GenericResponse<RoleResponseDto[]>>(
      this.apiUrl,
      { headers: this.getAuthHeaders() }
    );
  }

  getById(id: number): Observable<GenericResponse<RoleResponseDto>> {
    return this.http.get<GenericResponse<RoleResponseDto>>(
      `${this.apiUrl}/${id}`,
      { headers: this.getAuthHeaders() }
    );
  }

  create(request: RoleRequestDto): Observable<GenericResponse<RoleResponseDto>> {
    return this.http.post<GenericResponse<RoleResponseDto>>(
      this.apiUrl,
      request,
      { headers: this.getAuthHeaders() }
    );
  }

  update(id: number, request: RoleRequestDto): Observable<GenericResponse<RoleResponseDto>> {
    return this.http.put<GenericResponse<RoleResponseDto>>(
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
