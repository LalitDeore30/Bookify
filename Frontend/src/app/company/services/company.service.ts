import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders, HttpErrorResponse } from '@angular/common/http';
import { Observable, throwError } from 'rxjs';
import { catchError } from 'rxjs/operators';
import { Router } from '@angular/router';
import { UserStorageService } from '../../basic/services/storage/user-storage.service';

const BASIC_URL = "http://localhost:8080/";
@Injectable({
  providedIn: 'root'
})
export class CompanyService {
  constructor(
    private http: HttpClient,
    private router: Router,
    private userStorageService: UserStorageService
  ) { }

  postAd(adDTO: any): Observable<any> {
    const userId = this.userStorageService.getUserId();
    // For FormData, we need to create headers without Content-Type
    const headers = new HttpHeaders({
      'Authorization': 'Bearer ' + this.userStorageService.getToken()
    });

    return this.http.post(
      BASIC_URL + `api/company/ad/${userId}`,
      adDTO,
      {
        headers: headers
      }
    ).pipe(
      catchError(this.handleError.bind(this))
    );
  }

  getAllAdsByUserId(): Observable<any> {
    const userId = this.userStorageService.getUserId();
    return this.http.get(
      BASIC_URL + `api/company/ads/${userId}`,
      {
        headers: this.createAuthorizationHeader()
      }
    ).pipe(
      catchError(this.handleError.bind(this))
    );
  }

  getAdById(adId: any): Observable<any> {
    return this.http.get(`${BASIC_URL}api/company/ad/${adId}`, {
      headers: this.createAuthorizationHeader()
    }).pipe(
      catchError(this.handleError.bind(this))
    );
  }

  updateAd(adId: any, adDTO: any): Observable<any> {
    // For FormData, we need to create headers without Content-Type
    const headers = new HttpHeaders({
      'Authorization': 'Bearer ' + this.userStorageService.getToken()
    });

    return this.http.put(`${BASIC_URL}api/company/ad/${adId}`, adDTO, {
      headers: headers
    }).pipe(
      catchError(this.handleError.bind(this))
    );
  }

  deleteAd(adId: any): Observable<any> {
    return this.http.delete(`${BASIC_URL}api/company/ad/${adId}`, {
      headers: this.createAuthorizationHeader()
    }).pipe(
      catchError(this.handleError.bind(this))
    );
  }

  getAllAdBookings(): Observable<any> {
    const companyId = this.userStorageService.getUserId();
    return this.http.get(`${BASIC_URL}api/company/booking/${companyId}`, {
      headers: this.createAuthorizationHeader()
    }).pipe(
      catchError(this.handleError.bind(this))
    );
  }

  changeBookingStatus(bookingsId: number, status: string): Observable<any> {
    return this.http.get(`${BASIC_URL}api/company/booking/${bookingsId}/${status}`, {
      headers: this.createAuthorizationHeader()
    }).pipe(
      catchError(this.handleError.bind(this))
    );
  }

  getAdReviews(adId: number): Observable<any> {
    return this.http.get(`${BASIC_URL}api/company/ad/${adId}/reviews`, {
      headers: this.createAuthorizationHeader()
    }).pipe(
      catchError(this.handleError.bind(this))
    );
  }

  createAuthorizationHeader(): HttpHeaders {
    const token = this.userStorageService.getToken();
    if (!token) {
      throw new Error('No authentication token found. Please login again.');
    }
    let authHeaders: HttpHeaders = new HttpHeaders();
    return authHeaders.set(
      'Authorization',
      'Bearer ' + token
    );
  }

  private handleError(error: HttpErrorResponse): Observable<never> {
    console.error('An error occurred:', error);
    
    if (error.status === 403 || error.status === 401) {
      this.userStorageService.clearSession();
      this.router.navigate(['/login']);
      return throwError(() => new Error('Session expired. Please login again.'));
    }
    
    return throwError(() => error);
  }
}

