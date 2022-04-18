import {
  FormControl,
  ValidationErrors,
} from '@angular/forms';

export class PhoneNumberValidators {
  static phoneRequired(control: FormControl): ValidationErrors | null {
    if (control.value === '') {
      return {'phoneRequiredErr': true};
    }
    return null;
  }

  static phonePattern(control: FormControl): ValidationErrors | null {
    const regexp = new RegExp('^[+]?[0-9]{6,}');
    if (!regexp.test(control.value)) {
      return {'phonePatternErr': true};
    }
    return null;
  }
}
