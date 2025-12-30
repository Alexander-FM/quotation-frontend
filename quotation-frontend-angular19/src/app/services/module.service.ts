import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';
import { ModuleRequestDto, ModuleResponseDto, GenericResponse } from '../models/module.model';
import { AuthService } from './auth.service';

@Injectable({
  providedIn: 'root'
})
export class ModuleService {
  private apiUrl = 'http://127.0.0.1:8081/api/quotations/module';

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

  getAll(): Observable<GenericResponse<ModuleResponseDto[]>> {
    return this.http.get<GenericResponse<ModuleResponseDto[]>>(
      this.apiUrl,
      { headers: this.getAuthHeaders() }
    );
  }

  getById(id: number): Observable<GenericResponse<ModuleResponseDto>> {
    return this.http.get<GenericResponse<ModuleResponseDto>>(
      `${this.apiUrl}/${id}`,
      { headers: this.getAuthHeaders() }
    );
  }

  create(module: ModuleRequestDto): Observable<GenericResponse<ModuleResponseDto>> {
    return this.http.post<GenericResponse<ModuleResponseDto>>(
      this.apiUrl,
      module,
      { headers: this.getAuthHeaders() }
    );
  }

  update(id: number, module: ModuleRequestDto): Observable<GenericResponse<ModuleResponseDto>> {
    return this.http.put<GenericResponse<ModuleResponseDto>>(
      `${this.apiUrl}/${id}`,
      module,
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
