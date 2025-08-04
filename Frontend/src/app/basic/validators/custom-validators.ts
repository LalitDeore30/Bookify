import { AbstractControl, ValidationErrors, ValidatorFn } from '@angular/forms';

export class CustomValidators {
  
  // Password validator: at least 6 characters, 1 uppercase, 1 lowercase, 1 digit, 1 symbol
  static strongPassword(): ValidatorFn {
    return (control: AbstractControl): ValidationErrors | null => {
      const value = control.value;
      
      if (!value) {
        return null; // Let required validator handle empty values
      }

      const hasUpperCase = /[A-Z]/.test(value);
      const hasLowerCase = /[a-z]/.test(value);
      const hasNumeric = /[0-9]/.test(value);
      const hasSpecialChar = /[!@#$%^&*()_+\-=\[\]{};':"\\|,.<>\/?]/.test(value);
      const isValidLength = value.length >= 6;

      const passwordValid = hasUpperCase && hasLowerCase && hasNumeric && hasSpecialChar && isValidLength;

      if (!passwordValid) {
        return {
          strongPassword: {
            hasUpperCase,
            hasLowerCase,
            hasNumeric,
            hasSpecialChar,
            isValidLength,
            actualLength: value.length
          }
        };
      }

      return null;
    };
  }

  // Phone number validator: exactly 10 digits
  static phoneNumber(): ValidatorFn {
    return (control: AbstractControl): ValidationErrors | null => {
      const value = control.value;
      
      if (!value) {
        return null; // Let required validator handle empty values
      }

      // Remove any non-digit characters for validation
      const digitsOnly = value.replace(/\D/g, '');
      
      if (digitsOnly.length !== 10) {
        return {
          phoneNumber: {
            actualLength: digitsOnly.length,
            requiredLength: 10
          }
        };
      }

      return null;
    };
  }

  // Confirm password validator
  static confirmPassword(passwordField: string): ValidatorFn {
    return (control: AbstractControl): ValidationErrors | null => {
      const password = control.parent?.get(passwordField)?.value;
      const confirmPassword = control.value;

      if (!confirmPassword) {
        return null; // Let required validator handle empty values
      }

      if (password !== confirmPassword) {
        return {
          confirmPassword: {
            message: 'Passwords do not match'
          }
        };
      }

      return null;
    };
  }

  // Get password strength level (for UI feedback)
  static getPasswordStrength(password: string): {
    level: 'weak' | 'medium' | 'strong';
    score: number;
    feedback: string[];
  } {
    if (!password) {
      return { level: 'weak', score: 0, feedback: ['Password is required'] };
    }

    const feedback: string[] = [];
    let score = 0;

    // Check length
    if (password.length >= 6) {
      score += 1;
    } else {
      feedback.push('At least 6 characters');
    }

    // Check uppercase
    if (/[A-Z]/.test(password)) {
      score += 1;
    } else {
      feedback.push('One uppercase letter');
    }

    // Check lowercase
    if (/[a-z]/.test(password)) {
      score += 1;
    } else {
      feedback.push('One lowercase letter');
    }

    // Check numbers
    if (/[0-9]/.test(password)) {
      score += 1;
    } else {
      feedback.push('One number');
    }

    // Check special characters
    if (/[!@#$%^&*()_+\-=\[\]{};':"\\|,.<>\/?]/.test(password)) {
      score += 1;
    } else {
      feedback.push('One special character');
    }

    let level: 'weak' | 'medium' | 'strong';
    if (score < 3) {
      level = 'weak';
    } else if (score < 5) {
      level = 'medium';
    } else {
      level = 'strong';
    }

    return { level, score, feedback };
  }

  // Format phone number for display (XXX) XXX-XXXX
  static formatPhoneNumber(value: string): string {
    if (!value) return '';
    
    const digitsOnly = value.replace(/\D/g, '');
    
    if (digitsOnly.length === 10) {
      return `(${digitsOnly.slice(0, 3)}) ${digitsOnly.slice(3, 6)}-${digitsOnly.slice(6)}`;
    }
    
    return value;
  }
}
