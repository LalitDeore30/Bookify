import { Component } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { AuthService } from '../../services/auth/auth.service';
import { NzNotificationService } from 'ng-zorro-antd/notification';
import { Router } from '@angular/router';
import { CustomValidators } from '../../validators/custom-validators';

@Component({
  selector: 'app-signup-client',
  templateUrl: './signup-client.component.html',
  styleUrl: './signup-client.component.scss'
})
export class SignupClientComponent {
  validateForm!: FormGroup;
  passwordStrength: any = { level: 'weak', score: 0, feedback: [] };

  constructor(private fb: FormBuilder,
    private authService: AuthService,
    private notification: NzNotificationService,
    private router: Router) { }

  ngOnInit() {
    this.validateForm = this.fb.group({
      email: [null, [Validators.email, Validators.required]],
      name: [null, [Validators.required, Validators.minLength(2)]],
      lastname: [null, [Validators.required, Validators.minLength(2)]],
      phone: [null, [Validators.required, CustomValidators.phoneNumber()]],
      password: [null, [Validators.required, CustomValidators.strongPassword()]],
      checkPassword: [null, [Validators.required, CustomValidators.confirmPassword('password')]],
    });

    // Watch password changes for strength indicator
    this.validateForm.get('password')?.valueChanges.subscribe(value => {
      this.passwordStrength = CustomValidators.getPasswordStrength(value || '');
      // Revalidate confirm password when password changes
      this.validateForm.get('checkPassword')?.updateValueAndValidity();
    });
  }
  onPhoneInput(event: any) {
    const value = event.target.value;
    const digitsOnly = value.replace(/\D/g, '');
    if (digitsOnly.length <= 10) {
      event.target.value = CustomValidators.formatPhoneNumber(digitsOnly);
    }
  }

  getPasswordStrengthColor(): string {
    switch (this.passwordStrength.level) {
      case 'weak': return '#ff4d4f';
      case 'medium': return '#faad14';
      case 'strong': return '#52c41a';
      default: return '#d9d9d9';
    }
  }

  getPasswordStrengthWidth(): string {
    return `${(this.passwordStrength.score / 5) * 100}%`;
  }

  submitForm() {
    if (this.validateForm.valid) {
      // Format phone number before submission
      const formData = { ...this.validateForm.value };
      formData.phone = formData.phone.replace(/\D/g, ''); // Remove formatting for backend

      this.authService.registerClient(formData).subscribe({
      next: (res) => {
        this.notification
          .success(
            'SUCCESS',
            `Signup successful`,
            { nzDuration: 5000 }
          );
        this.router.navigateByUrl('/login');
      },
      error: (error) => {
        console.error('Signup error:', error);
        console.error('Error details:', {
          status: error.status,
          statusText: error.statusText,
          url: error.url,
          headers: error.headers,
          error: error.error
        });

        let errorMessage = 'An error occurred during signup';

        if (error.status === 403) {
          errorMessage = 'Access forbidden. This appears to be a backend security configuration issue. Please check the backend CSRF and CORS settings.';
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
          );
      }
    });
    } else {
      // Mark all fields as touched to show validation errors
      Object.keys(this.validateForm.controls).forEach(key => {
        this.validateForm.get(key)?.markAsTouched();
      });

      this.notification.warning(
        'Form Invalid',
        'Please correct the errors in the form before submitting.',
        { nzDuration: 5000 }
      );
    }
  }
}
