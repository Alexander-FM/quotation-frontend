import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../../environments/environment';

@Injectable({
  providedIn: 'root'
})
export class MaterialService {
  private baseUrl = environment.apiBaseUrl;

  constructor(private http: HttpClient) { }

  list(): Observable<any> {
    return this.http.get(`${this.baseUrl}/materials`);
  }

  create(data: any): Observable<any> {
    return this.http.post(`${this.baseUrl}/materials`, data);
  }

  update(id: number, data: any): Observable<any> {
    return this.http.put(`${this.baseUrl}/materials/${id}`, data);
  }

  delete(id: number): Observable<any> {
    return this.http.delete(`${this.baseUrl}/materials/${id}`);
  }
}
