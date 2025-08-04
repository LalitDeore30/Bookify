import { Component } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { AuthService } from '../../services/auth/auth.service';
import { NzNotificationService } from 'ng-zorro-antd/notification';
import { Router } from '@angular/router';
import { CustomValidators } from '../../validators/custom-validators';

@Component({
  selector: 'app-signup-company',
  templateUrl: './signup-company.component.html',
  styleUrl: './signup-company.component.scss'
})
export class SignupCompanyComponent {
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
      address: [null, [Validators.required, Validators.minLength(5)]],
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

      this.authService.registerCompany(formData).subscribe({
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
          this.notification
            .error(
              'ERROR',
              `${error.error}`,
              { nzDuration: 5000 }
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
