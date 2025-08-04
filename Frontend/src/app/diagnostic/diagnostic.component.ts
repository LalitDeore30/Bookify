import { Component } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';

@Component({
  selector: 'app-diagnostic',
  template: `
    <div style="padding: 20px; max-width: 800px; margin: 0 auto;">
      <h2>Backend Connectivity Diagnostic</h2>
      
      <div style="margin: 20px 0;">
        <button (click)="testBasicConnection()" style="margin-right: 10px; padding: 10px;">
          Test Basic Connection
        </button>
        <button (click)="testOptionsRequest()" style="margin-right: 10px; padding: 10px;">
          Test OPTIONS (CORS Preflight)
        </button>
        <button (click)="testPostRequest()" style="margin-right: 10px; padding: 10px;">
          Test POST Request
        </button>
        <button (click)="clearResults()" style="padding: 10px;">
          Clear Results
        </button>
      </div>

      <div *ngIf="results.length > 0" style="background: #f5f5f5; padding: 15px; border-radius: 5px;">
        <h3>Test Results:</h3>
        <div *ngFor="let result of results" style="margin: 10px 0; padding: 10px; border-left: 3px solid #007bff;">
          <strong>{{ result.test }}:</strong>
          <div style="margin-top: 5px;">
            <span [style.color]="result.success ? 'green' : 'red'">
              {{ result.success ? '✅ SUCCESS' : '❌ FAILED' }}
            </span>
          </div>
          <div style="margin-top: 5px; font-family: monospace; font-size: 12px;">
            {{ result.details }}
          </div>
        </div>
      </div>
    </div>
  `,
  standalone: true,
  imports: []
})
export class DiagnosticComponent {
  results: any[] = [];
  private baseUrl = 'http://localhost:8080';

  constructor(private http: HttpClient) {}

  testBasicConnection() {
    this.addResult('Basic Connection Test', 'Testing...', false);
    
    this.http.get(`${this.baseUrl}/`).subscribe({
      next: (response) => {
        this.updateLastResult(true, `Server responded: ${JSON.stringify(response)}`);
      },
      error: (error) => {
        this.updateLastResult(false, `Status: ${error.status}, Message: ${error.message}`);
      }
    });
  }

  testOptionsRequest() {
    this.addResult('CORS Preflight Test', 'Testing...', false);
    
    const headers = new HttpHeaders({
      'Origin': 'http://localhost:4200',
      'Access-Control-Request-Method': 'POST',
      'Access-Control-Request-Headers': 'Content-Type'
    });

    this.http.request('OPTIONS', `${this.baseUrl}/api/auth/client/sign-up`, { headers }).subscribe({
      next: (response) => {
        this.updateLastResult(true, `CORS preflight successful`);
      },
      error: (error) => {
        this.updateLastResult(false, `Status: ${error.status}, Headers: ${JSON.stringify(error.headers)}`);
      }
    });
  }

  testPostRequest() {
    this.addResult('POST Request Test', 'Testing...', false);
    
    const headers = new HttpHeaders({
      'Content-Type': 'application/json',
      'Accept': 'application/json',
      'Origin': 'http://localhost:4200'
    });

    const testData = {
      email: 'test@example.com',
      name: 'Test',
      lastname: 'User',
      phone: '1234567890',
      password: 'password123'
    };

    this.http.post(`${this.baseUrl}/api/auth/client/sign-up`, testData, { headers }).subscribe({
      next: (response) => {
        this.updateLastResult(true, `POST successful: ${JSON.stringify(response)}`);
      },
      error: (error) => {
        this.updateLastResult(false, 
          `Status: ${error.status}, StatusText: ${error.statusText}, ` +
          `URL: ${error.url}, Error: ${JSON.stringify(error.error)}`
        );
      }
    });
  }

  private addResult(test: string, details: string, success: boolean) {
    this.results.push({ test, details, success, timestamp: new Date() });
  }

  private updateLastResult(success: boolean, details: string) {
    if (this.results.length > 0) {
      const lastResult = this.results[this.results.length - 1];
      lastResult.success = success;
      lastResult.details = details;
    }
  }

  clearResults() {
    this.results = [];
  }
}
