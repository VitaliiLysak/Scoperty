import {
  AbstractControl,
  ValidationErrors,
  ValidatorFn,
} from '@angular/forms';

function isEmptyInputValue(value: any): boolean {
  // we don't check for string here so it also works with arrays
  return value == null || value.length === 0;
}

export class TransformControlValueValidators {
  static min(min: number, transform: Function): ValidatorFn {
    return (control: AbstractControl): ValidationErrors | null => {
      const controlValue = transform ? transform(control.value) : control.value;

      if (isEmptyInputValue(controlValue) || isEmptyInputValue(min)) {
        return null;  // don't validate empty values to allow optional controls
      }

      const value = parseFloat(controlValue);
      // Controls with NaN values after parsing should be treated as not having a
      // minimum, per the HTML forms spec: https://www.w3.org/TR/html5/forms.html#attr-input-min
      return !isNaN(value) && value < min
        ? { 'min': { 'min': min, 'actual': controlValue } }
        : null;
    };
  }

  static max(max: number, transform: Function): ValidatorFn {
    return (control: AbstractControl): ValidationErrors | null => {
      const controlValue = transform ? transform(control.value) : control.value;

      if (isEmptyInputValue(controlValue) || isEmptyInputValue(max)) {
        return null;  // don't validate empty values to allow optional controls
      }

      const value = parseFloat(controlValue);
      // Controls with NaN values after parsing should be treated as not having a
      // maximum, per the HTML forms spec: https://www.w3.org/TR/html5/forms.html#attr-input-max
      return !isNaN(value) && value > max
        ? { 'max': { 'max': max, 'actual': controlValue } }
        : null;
    };
  }
}
