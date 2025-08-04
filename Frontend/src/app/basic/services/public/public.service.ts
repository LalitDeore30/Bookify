import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';

const BASIC_URL = 'http://localhost:8080/';

@Injectable({
  providedIn: 'root'
})
export class PublicService {

  constructor(private http: HttpClient) { }

  // Public endpoints that don't require authentication
  getAllAdsPublic(): Observable<any> {
    return this.http.get(BASIC_URL + 'ads');
  }

  searchAdsPublic(serviceName: string): Observable<any> {
    return this.http.get(BASIC_URL + `search/${serviceName}`);
  }

  // Test backend connection
  testBackend(): Observable<any> {
    return this.http.post(BASIC_URL + 'api/auth/test', {});
  }
}
