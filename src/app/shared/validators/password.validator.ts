import {
  FormControl,
  FormGroup,
  ValidationErrors,
  ValidatorFn,
  Validators,
} from '@angular/forms';

export class PasswordValidators {
  static pattern: ValidatorFn = Validators.pattern(
    '(?=.*[0-9])(?=.*[a-z])(?=.*[A-Z])[a-zA-Z0-9!@#\$%\^\&*\)\(+=._-]{8,}',
  );

  static minLength(formControl: FormControl): ValidationErrors {
    const requiredErrors = Validators.required(formControl);
    const minLengthErrors = Validators.minLength(8)(formControl);

    const hasErrors = !!requiredErrors || !!minLengthErrors;
    return hasErrors ? { minlength: true } : null;
  }

  static repassword(formGroup: FormGroup): ValidationErrors {
    const { password, repassword } = formGroup.controls;
    const hasErrors = repassword.invalid || repassword.value !== password.value;
    return hasErrors ? { repassword: true } : null;
  }

  static letter(formControl: FormControl): ValidationErrors {
    const letterReqex = /(?=.*[a-z])(?=.*[A-Z])/;
    if (!letterReqex.test(formControl.value)) {
      return { letter: true };
    }
    return null;
  }

  static number(formControl: FormControl): ValidationErrors {
    const numberRegex = /(?=.*[0-9])/;
    if (!numberRegex.test(formControl.value)) {
      return { number: true };
    }
    return null;
  }
}
