import {
  FormGroup,
  ValidationErrors,
} from '@angular/forms';

import { FiltersFormPropertyType } from './filters.model';

export class PropertyTypeValidators {
  static nonEmpty(formGroup: FormGroup): ValidationErrors {
    const { house, apartment }: FiltersFormPropertyType = formGroup.value;
    const hasErrors = !house && !apartment;

    return hasErrors ? { empty: true } : null;
  }
}
