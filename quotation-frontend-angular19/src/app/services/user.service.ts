import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';
import { UserRequestDto, UserResponseDto, GenericResponse } from '../models/user.model';

@Injectable({
  providedIn: 'root'
})
export class UserService {
  private apiUrl = 'http://127.0.0.1:8081/api/employees/user';

  constructor(private http: HttpClient) {}

  private getAuthHeaders(): HttpHeaders {
    const token = localStorage.getItem('access_token');
    return new HttpHeaders({
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${token}`
    });
  }

  getAll(): Observable<GenericResponse<UserResponseDto[]>> {
    return this.http.get<GenericResponse<UserResponseDto[]>>(this.apiUrl, { headers: this.getAuthHeaders() });
  }

  getById(id: number): Observable<GenericResponse<UserResponseDto>> {
    return this.http.get<GenericResponse<UserResponseDto>>(`${this.apiUrl}/${id}`, { headers: this.getAuthHeaders() });
  }

  create(request: UserRequestDto): Observable<GenericResponse<UserResponseDto>> {
    return this.http.post<GenericResponse<UserResponseDto>>(this.apiUrl, request, { headers: this.getAuthHeaders() });
  }

  update(id: number, request: UserRequestDto): Observable<GenericResponse<UserResponseDto>> {
    return this.http.put<GenericResponse<UserResponseDto>>(`${this.apiUrl}/${id}`, request, { headers: this.getAuthHeaders() });
  }

  delete(id: number): Observable<GenericResponse<any>> {
    return this.http.delete<GenericResponse<any>>(`${this.apiUrl}/${id}`, { headers: this.getAuthHeaders() });
  }
}
