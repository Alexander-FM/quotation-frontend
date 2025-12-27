import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../../environments/environment';

@Injectable({
  providedIn: 'root'
})
export class CatalogService {
  private baseUrl = environment.apiBaseUrl;

  constructor(private http: HttpClient) { }

  listItems(): Observable<any> {
    return this.http.get(`${this.baseUrl}/catalogs/items`);
  }

  listUnits(): Observable<any> {
    return this.http.get(`${this.baseUrl}/catalogs/units`);
  }

  listFactorAdjustments(): Observable<any> {
    return this.http.get(`${this.baseUrl}/catalogs/factor-adjustments`);
  }
}
