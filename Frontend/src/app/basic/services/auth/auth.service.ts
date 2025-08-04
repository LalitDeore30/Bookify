import { HttpClient, HttpResponse, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { map, Observable } from 'rxjs';
import { UserStorageService } from '../storage/user-storage.service';

const BASIC_URL = 'http://localhost:8080/';
const AUTH_HEADER = 'Authorization';
@Injectable({
  providedIn: 'root'
})
export class AuthService {

  constructor(
    private http: HttpClient,
    private userStorageService: UserStorageService
  ) { }

  registerClient(signupRequestDTO: any): Observable<any> {
    const headers = new HttpHeaders({
      'Content-Type': 'application/json',
      'Accept': 'application/json'
    });

    return this.http.post(BASIC_URL + "client/sign-up", signupRequestDTO, { headers });
  }

  registerCompany(signupRequestDTO: any): Observable<any> {
    const headers = new HttpHeaders({
      'Content-Type': 'application/json',
      'Accept': 'application/json'
    });

    return this.http.post(BASIC_URL + "company/sign-up", signupRequestDTO, { headers });
  }

  login(username: string, password: string): Observable<any> {
    const headers = new HttpHeaders({
      'Content-Type': 'application/json',
      'Accept': 'application/json'
    });

    // Backend expects either 'username' or 'email' field
    const loginRequest = {
      username: username,
      email: username,  // Also send as email for compatibility
      password: password
    };

    console.log('Sending login request to:', BASIC_URL + "authenticate");
    console.log('Request payload:', loginRequest);

    return this.http.post(BASIC_URL + "authenticate", loginRequest, {
      headers,
      observe: 'response'
    })
      .pipe(
        map((res: HttpResponse<any>) => {
          console.log(res.body);
          this.userStorageService.setUser(res.body);

          const tokenLength = res.headers.get(AUTH_HEADER)?.length;
          const bearerToken = res.headers.get(AUTH_HEADER)?.substring(7, tokenLength);
          console.log(bearerToken);
          this.userStorageService.setToken(bearerToken || '');
          return res;
        })
      );
  }

  logout(): Observable<any> {
    return this.userStorageService.signOut();
  }

  refreshToken(): Observable<any> {
    return this.http.post(BASIC_URL + "api/auth/refresh-token", {});
  }

  // Test method to check if backend is accessible
  testBackendConnection(): Observable<any> {
    return this.http.post(BASIC_URL + "api/auth/test", {}, {
      headers: new HttpHeaders({
        'Content-Type': 'application/json',
        'Accept': 'application/json'
      })
    });
  }
}
