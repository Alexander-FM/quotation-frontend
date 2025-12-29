import { HttpInterceptorFn, HttpRequest, HttpHandlerFn, HttpEvent, HttpErrorResponse } from '@angular/common/http';
import { inject } from '@angular/core';
import { AuthService } from '../services/auth.service';
import { Router } from '@angular/router';
import { Observable, Subject, throwError } from 'rxjs';
import { catchError, filter, switchMap, take } from 'rxjs/operators';

let isRefreshing = false;
const refreshSubject = new Subject<boolean>();

function addAuthHeader(req: HttpRequest<any>, token: string | null): HttpRequest<any> {
  if (!token) return req;
  return req.clone({
    setHeaders: { Authorization: `Bearer ${token}` }
  });
}

export const authInterceptor: HttpInterceptorFn = (req: HttpRequest<any>, next: HttpHandlerFn): Observable<HttpEvent<any>> => {
  const authService = inject(AuthService);
  const router = inject(Router);

  const isAuthEndpoint = req.url.includes('/api/auth');
  const accessToken = authService.getAccessToken();

  const forward = (requestToSend: HttpRequest<any>) =>
    next(requestToSend).pipe(
      catchError((error: HttpErrorResponse) => {
        if (!isAuthEndpoint && error.status === 401) {
          if (!isRefreshing) {
            isRefreshing = true;
            return authService.refreshToken().pipe(
              switchMap(() => {
                isRefreshing = false;
                refreshSubject.next(true);
                const newToken = authService.getAccessToken();
                return next(addAuthHeader(req, newToken));
              }),
              catchError((refreshErr) => {
                isRefreshing = false;
                refreshSubject.next(false);
                authService.logout();
                router.navigate(['/auth/login']);
                return throwError(() => refreshErr);
              })
            );
          } else {
            return refreshSubject.pipe(
              filter((done) => done === true),
              take(1),
              switchMap(() => {
                const newToken = authService.getAccessToken();
                return next(addAuthHeader(req, newToken));
              })
            );
          }
        }
        return throwError(() => error);
      })
    );

  // Pre-refresh proactivo si el token está por expirar (umbral 3 minutos)
  if (!isAuthEndpoint && accessToken && authService.isAccessTokenExpiringSoon(180000)) {
    if (!isRefreshing) {
      isRefreshing = true;
      return authService.refreshToken().pipe(
        switchMap(() => {
          isRefreshing = false;
          refreshSubject.next(true);
          const newToken = authService.getAccessToken();
          return forward(addAuthHeader(req, newToken));
        }),
        catchError((refreshErr) => {
          isRefreshing = false;
          refreshSubject.next(false);
          authService.logout();
          router.navigate(['/auth/login']);
          return throwError(() => refreshErr);
        })
      );
    } else {
      return refreshSubject.pipe(
        filter((done) => done === true),
        take(1),
        switchMap(() => {
          const newToken = authService.getAccessToken();
          return forward(addAuthHeader(req, newToken));
        })
      );
    }
  }

  // Adjuntar token al request (sobrescribe si ya venía)
  const authReq = isAuthEndpoint ? req : addAuthHeader(req, accessToken);
  return forward(authReq);
};
