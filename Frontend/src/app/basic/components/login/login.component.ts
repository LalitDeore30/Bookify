import { Component } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { AuthService } from '../../services/auth/auth.service';
import { Router } from '@angular/router';
import { NzNotificationService } from 'ng-zorro-antd/notification';
import { UserStorageService } from '../../services/storage/user-storage.service';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrl: './login.component.scss'
})
export class LoginComponent {
  validateForm!: FormGroup;

  constructor(
    private authService: AuthService,
    private fb: FormBuilder,
    private router: Router,
    private notification: NzNotificationService,
    private userStorageService: UserStorageService
  ) {
    this.validateForm = this.fb.group({
      userName: [null, [Validators.required]],
      password: [null, [Validators.required]]
    });
  }

  submitForm(): void {
    this.authService.login(this.validateForm.get('userName')!.value, this.validateForm.get('password')!.value)
      .subscribe({
        next: (res) => {
          console.log(res)
          if (this.userStorageService.isClientLoggedIn()) {
            this.router.navigateByUrl('client/dashboard')
          }
          else if (this.userStorageService.isCompanyLoggedIn()) {
            this.router.navigateByUrl('company/dashboard')
          }
        },
        error: (error) => {
          console.error('Login error:', error);
          console.error('Login error details:', {
            status: error.status,
            statusText: error.statusText,
            url: error.url,
            headers: error.headers,
            error: error.error
          });

          let errorMessage = 'Login failed';

          if (error.status === 403) {
            errorMessage = 'Access forbidden. This appears to be a backend security configuration issue. Please check the backend CSRF and CORS settings.';
          } else if (error.status === 401) {
            errorMessage = 'Invalid username or password.';
          } else if (error.error && typeof error.error === 'string') {
            errorMessage = error.error;
          } else if (error.message) {
            errorMessage = error.message;
          } else if (error.status) {
            errorMessage = `HTTP ${error.status}: ${error.statusText || 'Unknown error'}`;
          }

          this.notification
            .error(
              'ERROR',
              errorMessage,
              { nzDuration: 8000 }
            )
        }
      });
  }
}
