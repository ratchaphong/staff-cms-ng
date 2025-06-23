// src/app/pages/product/product.service.ts
import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders, HttpParams } from '@angular/common/http';
import { catchError, Observable } from 'rxjs';
import { Product } from './product.interface';
import { isBrowser } from '../utils/browser.utils';

@Injectable({
  providedIn: 'root',
})
export class ProductService {
  private baseUrl = 'https://pd-m-service.onrender.com';

  constructor(private http: HttpClient) {}

  getProducts(): Observable<Product[]> {
    let params = new HttpParams();

    const token = isBrowser() ? localStorage.getItem('access_token') : null;

    const headers = new HttpHeaders({
      Authorization: `Bearer ${token || ''}`,
    });

    return this.http
      .get<Product[]>(this.baseUrl + '/products', { params, headers })
      .pipe(
        catchError((err) => {
          console.error('❌ API error', err);
          throw err;
        })
      );
  }

  getProductById(id: string): Observable<Product> {
    let params = new HttpParams();

    const token = isBrowser() ? localStorage.getItem('access_token') : null;

    const headers = new HttpHeaders({
      Authorization: `Bearer ${token || ''}`,
    });

    return this.http
      .get<Product>(this.baseUrl + `/products/${id}`, { params, headers })
      .pipe(
        catchError((err) => {
          console.error('❌ API error', err);
          throw err;
        })
      );
  }

  createProduct(product: Partial<Product>): Observable<Product> {
    const token = isBrowser() ? localStorage.getItem('access_token') : null;

    const headers = new HttpHeaders({
      Authorization: `Bearer ${token || ''}`,
      'Content-Type': 'application/json',
    });

    return this.http
      .post<Product>(this.baseUrl + '/products', product, { headers })
      .pipe(
        catchError((err) => {
          console.error('❌ API error', err);
          throw err;
        })
      );
  }

  updateProduct(id: string, data: Partial<Product>): Observable<Product> {
    const token = isBrowser() ? localStorage.getItem('access_token') : null;
    const headers = new HttpHeaders({
      Authorization: `Bearer ${token || ''}`,
      'Content-Type': 'application/json',
    });

    return this.http
      .patch<Product>(`${this.baseUrl}/products/${id}`, data, { headers })
      .pipe(
        catchError((err) => {
          console.error('❌ Update error', err);
          throw err;
        })
      );
  }

  deleteProduct(id: string): Observable<void> {
    const token = isBrowser() ? localStorage.getItem('access_token') : null;
    const headers = new HttpHeaders({
      Authorization: `Bearer ${token || ''}`,
    });

    return this.http
      .delete<void>(`${this.baseUrl}/products/${id}`, { headers })
      .pipe(
        catchError((err) => {
          console.error('❌ Delete error', err);
          throw err;
        })
      );
  }
}
