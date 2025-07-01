import { Injectable } from '@angular/core';
import { HttpClient, HttpContext, HttpHeaders, HttpParams } from '@angular/common/http';
import { Observable, catchError, throwError } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class ApiService {
  // Hardcoded API URL (replace with your actual production API)
  private readonly baseUrl = 'https://fastapi-1-zl38.onrender.com';

  constructor(private http: HttpClient) { }

  /**
   * Generic GET request
   */
  get<T>(endpoint: string, params?: HttpParams, context?: HttpContext): Observable<T> {
    // Remove leading slash from endpoint if present to avoid double slashes
    const cleanEndpoint = endpoint.startsWith('/') ? endpoint.substring(1) : endpoint;
    const url = `${this.baseUrl}/${cleanEndpoint}`;
    
    console.log('Making GET request to:', url); // Debug log
    
    return this.http.get<T>(url, { params, context }).pipe(
      catchError(this.handleError)
    );
  }

  /**
   * Generic POST request
   */
  post<T>(endpoint: string, body: any, headers?: HttpHeaders): Observable<T> {
    const cleanEndpoint = endpoint.startsWith('/') ? endpoint.substring(1) : endpoint;
    const url = `${this.baseUrl}/${cleanEndpoint}`;
    
    return this.http.post<T>(url, body, {
      headers: headers || new HttpHeaders()
    }).pipe(
      catchError(this.handleError)
    );
  }

  /**
   * Generic PUT request
   */
  put<T>(endpoint: string, body: any, headers?: HttpHeaders): Observable<T> {
    const cleanEndpoint = endpoint.startsWith('/') ? endpoint.substring(1) : endpoint;
    const url = `${this.baseUrl}/${cleanEndpoint}`;
    
    return this.http.put<T>(url, body, {
      headers: headers || new HttpHeaders()
    }).pipe(
      catchError(this.handleError)
    );
  }

  /**
   * Generic DELETE request
   */
  delete<T>(endpoint: string): Observable<T> {
    const cleanEndpoint = endpoint.startsWith('/') ? endpoint.substring(1) : endpoint;
    const url = `${this.baseUrl}/${cleanEndpoint}`;
    
    return this.http.delete<T>(url).pipe(
      catchError(this.handleError)
    );
  }

  /**
   * Improved error handling
   */
  private handleError(error: any) {
    let errorMessage = 'An unknown error occurred!';
    
    if (error.error instanceof ErrorEvent) {
      // Client-side or network error
      errorMessage = `Client error: ${error.error.message}`;
    } else if (error.status === 0) {
      // API unreachable (CORS, network down, etc)
      errorMessage = 'Server unreachable! Check your network or API URL.';
    } else {
      // Server-side error
      errorMessage = `Server error: ${error.status} - ${error.message || error.error?.message}`;
    }
    
    console.error('[API Error]', errorMessage, error);
    return throwError(() => new Error(errorMessage));
  }
}