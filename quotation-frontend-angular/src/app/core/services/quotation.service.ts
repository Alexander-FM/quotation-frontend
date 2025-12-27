import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../../environments/environment';

@Injectable({
  providedIn: 'root'
})
export class QuotationService {
  private baseUrl = environment.apiBaseUrl;

  constructor(private http: HttpClient) { }

  list(): Observable<any> {
    return this.http.get(`${this.baseUrl}/quotations`);
  }

  create(data: any): Observable<any> {
    return this.http.post(`${this.baseUrl}/quotations`, data);
  }

  update(id: number, data: any): Observable<any> {
    return this.http.put(`${this.baseUrl}/quotations/${id}`, data);
  }

  delete(id: number): Observable<any> {
    return this.http.delete(`${this.baseUrl}/quotations/${id}`);
  }

  getDetails(id: number): Observable<any> {
    return this.http.get(`${this.baseUrl}/quotations/${id}/details`);
  }

  getModules(id: number): Observable<any> {
    return this.http.get(`${this.baseUrl}/quotations/${id}/modules`);
  }

  getDetailSubitems(detailId: number): Observable<any> {
    return this.http.get(`${this.baseUrl}/quotation-details/${detailId}/subitems`);
  }
}
