import {
  FormControl,
  ValidationErrors,
} from '@angular/forms';

import { MAX_FLOORS_COUNT } from '../../app.constants';

import { isEmptyString } from '../utils/empty-string.util';

export class FloorValidators {
  static floorRequired({value}: FormControl): ValidationErrors | null {
    if (isEmptyString(value)) {
      return {floorRequiredErr: true};
    }
    return null;
  }

  static floorNumber({value}: FormControl): ValidationErrors | null {
    if (!(value >= 0 && value <= MAX_FLOORS_COUNT)) {
      return {floorNumberErr: true};
    }
    return null;
  }
}
