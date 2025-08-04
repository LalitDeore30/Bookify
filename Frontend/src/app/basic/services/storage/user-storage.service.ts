import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, BehaviorSubject } from 'rxjs';

const BASIC_URL = 'http://localhost:8080/';

@Injectable({
  providedIn: 'root'
})
export class UserStorageService {
  private currentUserSubject = new BehaviorSubject<any>(null);
  private tokenSubject = new BehaviorSubject<string>('');
  
  public currentUser$ = this.currentUserSubject.asObservable();
  public token$ = this.tokenSubject.asObservable();

  constructor(private http: HttpClient) { }

  setToken(token: string): void {
    this.tokenSubject.next(token);
  }

  setUser(user: any): void {
    this.currentUserSubject.next(user);
  }

  getToken(): string {
    return this.tokenSubject.value;
  }

  getUser(): any {
    return this.currentUserSubject.value;
  }

  getUserId(): string {
    const user = this.getUser();
    return user ? user.userId : '';
  }

  getUserRole(): string {
    const user = this.getUser();
    return user ? user.role : '';
  }

  isClientLoggedIn(): boolean {
    const token = this.getToken();
    const role = this.getUserRole();
    return !!token && role === 'CLIENT';
  }

  isCompanyLoggedIn(): boolean {
    const token = this.getToken();
    const role = this.getUserRole();
    return !!token && role === 'COMPANY';
  }

  signOut(): Observable<any> {
    // Clear local session immediately
    this.clearSession();
    // Call backend logout endpoint
    return this.http.post(BASIC_URL + 'api/auth/logout', {});
  }

  clearSession(): void {
    this.tokenSubject.next('');
    this.currentUserSubject.next(null);
  }
}
