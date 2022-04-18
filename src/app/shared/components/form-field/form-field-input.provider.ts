import {
  forwardRef,
  Provider,
} from '@angular/core';

import { FormFieldInput } from './form-field-input.model';

export function createFormFieldInputProvider(component: any): Provider {
  return {
    provide: FormFieldInput,
    useExisting: forwardRef(() => component),
    multi: true,
  };
}
