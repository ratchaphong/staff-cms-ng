// src/app/pages/product/product.service.ts
import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { catchError, Observable, throwError } from 'rxjs';
import { Product } from './product.interface';

@Injectable({ providedIn: 'root' })
export class ProductService {
  private baseUrl = 'https://pd-m-service.onrender.com';

  constructor(private http: HttpClient) {}

  getProducts(): Observable<Product[]> {
    return this.http
      .get<Product[]>(`${this.baseUrl}/products/search`)
      .pipe(catchError(this.handleError('getProducts')));
  }

  getProductById(id: string): Observable<Product> {
    return this.http
      .get<Product>(`${this.baseUrl}/products/${id}`)
      .pipe(catchError(this.handleError('getProductById')));
  }

  createProduct(product: Partial<Product>): Observable<Product> {
    return this.http
      .post<Product>(`${this.baseUrl}/products`, product)
      .pipe(catchError(this.handleError('createProduct')));
  }

  updateProduct(id: string, data: Partial<Product>): Observable<Product> {
    return this.http
      .patch<Product>(`${this.baseUrl}/products/${id}`, data)
      .pipe(catchError(this.handleError('updateProduct')));
  }

  deleteProduct(id: string): Observable<void> {
    return this.http
      .delete<void>(`${this.baseUrl}/products/${id}`)
      .pipe(catchError(this.handleError('deleteProduct')));
  }

  private handleError(operation: string) {
    return (error: any) => {
      console.error(`❌ ${operation} error:`, error);
      return throwError(() => error);
    };
  }
}
