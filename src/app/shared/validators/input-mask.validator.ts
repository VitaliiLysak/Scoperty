import {
  FormGroup,
  ValidationErrors,
  ValidatorFn,
} from '@angular/forms';

import { convertStringToInt } from '../utils/convert-string.util';

export class InputMaskValidators {
  static minLessThanOrEqualMax(unmaskValue: Function): ValidatorFn {
    return ({ controls }: FormGroup): ValidationErrors => {
      const { min, max } = controls;
      const minNumber = convertStringToInt(unmaskValue(min.value));
      const maxNumber = convertStringToInt(unmaskValue(max.value));
      const hasErrors = (minNumber > 0 && maxNumber > 0) && minNumber > maxNumber;

      return hasErrors ? { minLessThanOrEqualMax: true } : null;
    };
  }
}
