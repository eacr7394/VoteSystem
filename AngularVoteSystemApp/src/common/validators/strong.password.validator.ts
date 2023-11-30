import { AbstractControl, ValidationErrors, ValidatorFn } from '@angular/forms';

export function strongPasswordValidator(): ValidatorFn {
  return (control: AbstractControl): ValidationErrors | null => {

    const value: string = control.value;
    if (!value) {
      return null; 
    }

    // Define your password strength rules here
    const minLength = 10;
    const hasUpperCase = /[A-Z]/.test(value);
    const hasLowerCase = /[a-z]/.test(value);
    const hasNumeric = /\d/.test(value);
    const hasSpecialChar = /[!@#$%^&*()_+{}\[\]:;<>,.?~\\/-]/.test(value);

    const isStrong =
      value.length >= minLength &&
      hasUpperCase &&
      hasLowerCase &&
      hasNumeric &&
      hasSpecialChar;

    return !isStrong ? { strongPassword: true } : null;
  };
}
