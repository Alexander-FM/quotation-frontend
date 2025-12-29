import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable, tap } from 'rxjs';
import { Router } from '@angular/router';
import { LoginRequest, TokenResponse, GenericResponse } from '../models/auth.model';

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  private apiUrl = 'http://127.0.0.1:8081/api/auth';

  constructor(
    private http: HttpClient,
    private router: Router
  ) { }

  login(credentials: LoginRequest): Observable<GenericResponse<TokenResponse>> {
    return this.http.post<GenericResponse<TokenResponse>>(`${this.apiUrl}/login`, credentials)
      .pipe(
        tap(response => {
          if (response.code === 1 && response.body) {
            this.saveTokens(response.body);
          }
        })
      );
  }

  validateToken(): Observable<GenericResponse<any>> {
    const token = this.getAccessToken();
    const headers = new HttpHeaders({
      'Authorization': `Bearer ${token}`
    });
    return this.http.post<GenericResponse<any>>(`${this.apiUrl}/validate`, {}, { headers });
  }

  refreshToken(): Observable<GenericResponse<TokenResponse>> {
    const refreshToken = this.getRefreshToken();
    const headers = new HttpHeaders({
      'Authorization': `Bearer ${refreshToken}`
    });
    return this.http.post<GenericResponse<TokenResponse>>(`${this.apiUrl}/refresh`, {}, { headers })
      .pipe(
        tap(response => {
          if (response.code === 1 && response.body) {
            this.saveTokens(response.body);
          }
        })
      );
  }

  private saveTokens(tokenData: TokenResponse): void {
    localStorage.setItem('access_token', tokenData.access_token);
    localStorage.setItem('refresh_token', tokenData.refresh_token);
    localStorage.setItem('username', tokenData.username);
    localStorage.setItem('expires_in', tokenData.expires_in.toString());
    localStorage.setItem('issued_at', tokenData.issued_at);
  }

  logout(): void {
    localStorage.removeItem('access_token');
    localStorage.removeItem('refresh_token');
    localStorage.removeItem('username');
    localStorage.removeItem('expires_in');
    localStorage.removeItem('issued_at');
    this.router.navigate(['/auth/login']);
  }

  getAccessToken(): string | null {
    return localStorage.getItem('access_token');
  }

  getRefreshToken(): string | null {
    return localStorage.getItem('refresh_token');
  }

  getUsername(): string | null {
    return localStorage.getItem('username');
  }

  isAuthenticated(): boolean {
    return !!this.getAccessToken();
  }

  // Helpers de expiración del Access Token
  getIssuedAtMs(): number | null {
    const issuedAt = localStorage.getItem('issued_at');
    if (!issuedAt) return null;
    const date = new Date(issuedAt);
    const ms = date.getTime();
    return isNaN(ms) ? null : ms;
  }

  getExpiresInMs(): number | null {
    const expiresInStr = localStorage.getItem('expires_in');
    if (!expiresInStr) return null;
    const val = Number(expiresInStr);
    return isNaN(val) ? null : val;
  }

  isAccessTokenExpiringSoon(thresholdMs: number = 60000): boolean {
    const issuedAtMs = this.getIssuedAtMs();
    const expiresInMs = this.getExpiresInMs();
    if (issuedAtMs == null || expiresInMs == null) return false;
    const expiryTime = issuedAtMs + expiresInMs;
    const remaining = expiryTime - Date.now();
    return remaining <= thresholdMs;
  }
}
