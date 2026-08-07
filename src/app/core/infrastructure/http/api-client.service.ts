import { HttpClient, HttpParams, HttpResponse } from '@angular/common/http';
import { Injectable, inject } from '@angular/core';
import { Observable } from 'rxjs';

import { APP_CONFIG } from '@core/infrastructure/config/app-config.token';

@Injectable({ providedIn: 'root' })
export class ApiClient {
  private readonly http = inject(HttpClient);
  private readonly baseUrl = inject(APP_CONFIG).apiBaseUrl;

  get<TResponse>(path: string, params?: HttpParams): Observable<TResponse> {
    return this.http.get<TResponse>(this.resolve(path), { params });
  }

  post<TResponse, TBody>(path: string, body: TBody): Observable<TResponse> {
    return this.http.post<TResponse>(this.resolve(path), body);
  }

  put<TResponse, TBody>(path: string, body: TBody): Observable<TResponse> {
    return this.http.put<TResponse>(this.resolve(path), body);
  }

  patch<TResponse, TBody>(path: string, body: TBody): Observable<TResponse> {
    return this.http.patch<TResponse>(this.resolve(path), body);
  }

  delete<TResponse>(path: string): Observable<TResponse> {
    return this.http.delete<TResponse>(this.resolve(path));
  }

  getBlob(path: string, params?: HttpParams): Observable<HttpResponse<Blob>> {
    return this.http.get(this.resolve(path), { params, observe: 'response', responseType: 'blob' });
  }

  private resolve(path: string): string {
    return `${this.baseUrl}/${path.replace(/^\//, '')}`;
  }
}
